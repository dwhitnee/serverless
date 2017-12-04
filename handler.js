'use strict';

let successResponse = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*' // Required for CORS support to work
  },

  body: "RESPONSE GOES HERE"
};

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
  }

};
