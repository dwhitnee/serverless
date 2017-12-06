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
  helloBus: function( event, context, callback ) {

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


};
