//----------------------------------------
//  Functions to be uploaded to the "cloud" (AWS Lambda and API Gateway)
//----------------------------------------

'use strict';

// HTTP response for successful call
let successResponse = {
  body: "RESPONSE GOES HERE - REPLACE ME",
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*'    // Allow any web page to call us (CORS support)
  }
};

// HTTP response for bad call
// 400 = we got bad data from user
// 404 = page not found
// 500 = server error
let errorResponse = {
  error: { messageString: "huh?" },
  messageString: "Doh! There was an error in the request"
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
  helloWorld:  function( request, context, callback ) {

    let response = successResponse;
    response.body = JSON.stringify({
      message: 'Hello World! Your function executed successfully!',
      request: request,
      context: context
    });

    callback( null, response );
  }

};
