var Router = require("Router");
var _ = require("lodash");
var when = require("when");

var appRouter = new Router();
/*
You can instantiate an HTTP client with 
the following options, which will be used for all calls. 
Default values shown.
{
  baseUrl : null, 
  method : "GET",
  headers : {},
  body : null,
  connectionTimeout : null,
  socketTimeout : null
}
*/
var fbGraphClient = require('http')({
  baseUrl:'http://graph.facebook.com/',
});

appRouter.get("/fb/pivotal", function(req,res,restofpath) {
  var result = fbGraphClient.getJSON('gopivotal'
  , function(data,response) {
    // the callback function will execute on the repsonse when its ready
    return {
      reponse_code_from_fb: response.responseCode,
      data_from_fb: data
    };
  });
  res.setBody(result);
});

appRouter.get("/fb/pivotal_http_request", function(req,res,restofpath) {
  // the request method of http allows you to override the default options 
  var result = fbGraphClient.request({
    url: 'gopivotal',
    headers: {Accept:'application/json'},
    connectTimeout:1000,
    socketTimeout:5000,
  }, function(responseBody,response) {
    // the callback function will execute on the repsonse when its ready
    return {
      reponse_code_from_fb: response.responseCode,
      data_from_fb: JSON.parse(responseBody)
    };
  });
    
  
  res.setBody(result);
});

appRouter.get("/fb/*restofpath", function(req,res,restofpath) {
  var result = fbGraphClient.getJSON(restofpath
  , function(data,response) {
    // the callback function will execute on the repsonse when its ready
    return {
      reponse_code_from_fb: response.responseCode,
      data_from_fb: data
    };
  });
  res.setBody(result);
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({links :[
    {rel: 'Pivotal on Facebook\'s Graph API', href: baseUrl+'/fb/pivotal'},
    {rel: 'Facebook\'s Graph API', href: baseUrl+'/fb/*anything'}
  ]});
});

module.exports = appRouter;
