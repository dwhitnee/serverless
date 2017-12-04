'use strict';

// HTTP response for successful call
let successResponse = {
  body: "RESPONSE GOES HERE",

  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*' // Required for CORS support to work
  }
};

// HTTP response for bad call
// 400 = we got bad data from user
// 404 = page not found
// 500 = server error
let errorResponse = "doh!";
/*{
  statusCode: 400,
  message: "There was an error in the request",

  headers: {
    'Access-Control-Allow-Origin': '*' // Required for CORS support to work
  }
};
 */

module.exports = {
  //----------------------------------------
  // example
  //----------------------------------------
  helloWorld:  function( event, context, callback ) {

    const response = successResponse;
    response.body = JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      debug: event
    });

    callback( null, response );
  },

  //----------------------------------------
  // return data about all bus routes
  //----------------------------------------
  busRoutes: function( event, context, callback ) {

    const response = successResponse;

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
    let errors = null;

    if (!query) {
      errors = errorResponse;

    } else {
      let timeStamp = event.requestContext.requestTimeEpoch;
      let timeString = event.requestContext.requestTime;

      // FIXME: store this in DB
      response.body = JSON.stringify({
        bus: query.bus,
        event: query.event,
        time: timeStamp,
        debug: event
      });

    }

    callback( errors, response );
  }

};
