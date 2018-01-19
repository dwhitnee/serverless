//----------------------------------------
//  Functions to be uploaded to the cloud (AWS Lambda and API Gateway)
//----------------------------------------

'use strict';

// HTTP response for a successful call
let successResponse = {
  body: "RESPONSE GOES HERE - REPLACE ME",
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*'    // Allow any web page to call us (CORS support)
  }
};

// There is a bug/"feauture" in API Gateway that swallows these errors
let errorResponse = {
  error: { messageString: "huh?" },
  messageString: "Doh! There was an error in the request"
};



//----------------------------------------
// server functions go here, function names must be placed in serverless.yml
// to get wired up
//----------------------------------------

module.exports = {
  //----------------------------------------
  // example
  // @param event -    info about the call (URL params, caller, etc)
  // @param context -  info about AWS (generally uninteresting)
  // @param callback - function to invoke when we are done
  //----------------------------------------
  busRoutes: function( event, context, callback ) {

    let response = successResponse;

    response.body = JSON.stringify({
      busRoutes: [1004, 1005, 1006],
      bus: {
        1004: {
          stops: [1,2,3,4]
        },
        1005: {
          stops: [6,7,8,9]
        },
        1006: {
          stops: ["x", "y", "z", "w"]
        }
      },

      debug: event
    });

    callback( null, response );
  },

  //----------------------------------------------------------------------
  // return all database comments for this bus for today only
  // expects /events?bus=1006  (optional: &day="Thu Jan 18 2018")
  //----------------------------------------------------------------------
  getBusEvents: function( request, context, callback ) {

    let query = request.queryStringParameters;
    let now = new Date();
    let response = successResponse;

    if (!query || !query.bus) {

      console.error("bad params passed, no bus number?");
      console.error( JSON.stringify( request ));
      callback( null, errorResponse );

    } else {       // query DB

      console.log("Getting events for bus " + query.bus + " for " + now.toDateString() );

      let day = query.day || now.toDateString();   // "Thu Jan 18 2018"

      // SQL equivalent: "SELECT * from BusEvents WHERE bus=1006 AND day="Thu Jan 18 2018"

      // The Index allows us to do this "where" clause. Since this is "NoSQL" this
      // query is impossible without this Index configured on the table ahead of time.

      // The alternative is to scan() all BusEvents and only show the days and buses we want.
      // Or put a secondary/sort index on "day" and display only the buses we want.

      let dbRequest = {
        TableName : "BusEvents",
        IndexName: "day-bus-index",
        KeyConditionExpression: "bus = :bus and #theday = :day",
        ExpressionAttributeNames:{
          "#theday": "day"     // because "day" is a reserved word in Dynamo
        },
        ExpressionAttributeValues: {
          ":bus": parseInt( query.bus ),     // 1006
          ":day": day                        // "Thu Jan 18 2018"
        }
      };

      console.log( dbRequest );

      let AWS = require('aws-sdk');
      let dynamoDB = new AWS.DynamoDB.DocumentClient();

      dynamoDB.query( dbRequest, function( err, data ) {
        if (err) {
          console.log("DynamoDB error:" + err );
          callback( err );
        } else {
          response.body = JSON.stringify( data.Items );
          callback( null, response );
        }
      });


    }
  },


  //----------------------------------------
  // Something happened, let's store it in Dynamo with a time stamp
  //----------------------------------------
  storeBusEvent: function( request, context, callback ) {

    let postData = JSON.parse( request.body );    // This is from the user
    console.log( request.body );

    let response = successResponse;
    let now = new Date();

    if (!postData || !postData.bus) {
      let error = "bad params passed, no bus number?";

      console.error( error );
      console.error( JSON.stringify( request ));
      callback( null, errorResponse );

    } else {

      // we can pull interesting unforgeable data directly from the request.
      let timeStamp = request.requestContext.requestTimeEpoch;
      let timeString = request.requestContext.requestTime;
      let requestId = request.requestContext.requestId;
      let sourceIp = request.requestContext.identity.sourceIp; // could be used as userId?

      // convert to Integer since DB expects that. "1006" != 1006 to a database.
      let bus = parseInt( postData.bus );

      // This can be inspected in the web debugger, but we really don't need it otherwise
      response.body = JSON.stringify({
        bus: bus,
        postData: postData,
        timeStamp: timeStamp,
        timeISO: now.toISOString(),
        message: "update successful",
        debug: request
      });

      // console.log( response.body );

      //----------------------------------------
      // save data to DB, first we make some non-forgeable meta data
      // bus and day are the primary and secondary (sort) keys.
      // time is a nice to have for precision
      //----------------------------------------
      let dbParams = {
        TableName : 'BusEvents',
        Item: {
          id: requestId,           // somthing unique, but sadly uninteresting to us.
          bus: bus,                // 1006
          day: now.toDateString(), // "Thu Jan 18 2018"
          time: now.toISOString(), // "2018-01-18T21:40:19.609Z"
          sourceIp: sourceIp       // 24.18.255.124 (computer/phone's IP address)
        }
      };

      // Then we add on whatever the user told us (assign is "copy")
      Object.assign( dbParams.Item, postData );

      console.log( JSON.stringify( dbParams ));

      let AWS = require('aws-sdk');
      let dynamoDB = new AWS.DynamoDB.DocumentClient();

      dynamoDB.put( dbParams, function( err, data ) {
        if (err) {
          console.log("DynamoDB error:" + err );
          callback( err );
        } else {
          callback( null, response );
        }
      });
    }

  }

};
