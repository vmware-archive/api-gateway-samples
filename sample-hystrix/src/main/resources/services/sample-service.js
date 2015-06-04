var endpoint = require("env")("CIRCUIT_BREAKER_ENDPOINT") || '/api/circuit';
var host = require("env")("CIRCUIT_BREAKER_HOST") || 'http://localhost:3000';

var HystrixCommand = require("../hystrix-command.js");

var async = require('async');

var api = require('http')({
  baseUrl : host
});

module.exports = {
  "test" : function(){ 
    return new HystrixCommand("test", "apiRequest", function(){

      var request = api.get(endpoint, function(response){
        
        if(response.statusCode === 500) {
          throw new Error("EXTERNAL SERVICE ERROR");
        }

        return response.body;
      },
      function(reason){
        throw new Error(reason);
      });
      
      return request.get();
    },
    function() {
      
      return "Fallback, Hello World!";

    }).execute();
    
  }
}