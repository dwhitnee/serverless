//----------------------------------------
//  Functions to be uploaded to the "cloud" (AWS Lambda and API Gateway)
//----------------------------------------

'use strict';

// HTTP response for successful call
let successResponse = {
  body: "RESPONSE GOES HERE",

  statusCode: 200,
  headers: {
    // Allow any web page to call us (CORS support)
    'Access-Control-Allow-Origin': '*'
  }
};

// HTTP response for bad call
// 400 = we got bad data from user
// 404 = page not found
// 500 = server error
let errorResponse = {
  error: { messageString: "huh?" },
  messageString: "Doh! There was an error in the request",
};


//----------------------------------------
// server functions go here
//----------------------------------------

module.exports = {
  //----------------------------------------
  // example
  // @param event -    info about the call (URL params, caller, etc)
  // @param context -  info about AWS (generally uninteresting)
  // @param callback - function to invoke when we are done
  //----------------------------------------
  helloWorld:  function( event, context, callback ) {

    let response = successResponse;
    response.body = JSON.stringify({
      message: 'Hello World! Your function executed successfully!',
      event: event,
      context: context
    });

    callback( null, response );
  },

  //----------------------------------------
  // return data about all bus routes
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
          stops: ["x", "y", "z"]
        }
      },

      debug: event
    });

    callback( null, response );
  },

  //----------------------------------------
  // Something happened, store it. Read input from event.queryStringParameters
  //----------------------------------------
  busEvent: function( event, context, callback ) {
      
    let response = successResponse;
    let query = event.queryStringParameters;
    let now = new Date();

    if (!query) {
      callback( errorResponse );

    } else {

      let timeStamp = event.requestContext.requestTimeEpoch;
      let timeString = event.requestContext.requestTime;
        
      response.body = JSON.stringify({
        bus: query.bus,
        time: timeStamp,
        timeISO: now.toISOString(),
	message: "update successful",
        debug: event
      });
        
      //----------------------------------------
      // save data to DB
      //----------------------------------------
      let dbParams = {
        TableName : 'Widgets',
        Item: {
          //HashKey: 'id',
          id: parseInt( query.bus ), 
	  time: Date.now()
        }
      };
      
      Object.assign( dbParams.Item, query );

      let AWS = require('aws-sdk');
      let dynamoDB = new AWS.DynamoDB.DocumentClient();
      
      dynamoDB.put( dbParams, function(err, data) {
        if (err) {
          console.log(err);
          callback( err );      
        } else {
          callback( null, response );   
        }
      });
    }
      
  }

};
