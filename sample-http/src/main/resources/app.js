var Router = require("Router");
var _ = require("lodash");

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
  var result = fbGraphClient.getJSON('pivotalsoftware'
  , function(response) {
    // the callback function will execute on the repsonse when its ready
    return {
      reponse_code_from_fb: response.statusCode,
      data_from_fb: response.body
    };
  });
  res.setBody(result);
});

appRouter.get("/fb/pivotal_http_request", function(req,res,restofpath) {
  // the request method of http allows you to override the default options 
  var result = fbGraphClient.request({
    url: 'pivotalsoftware',
    headers: {Accept:'application/json'},
    connectTimeout:1000,
    socketTimeout:5000,
  }, function(response) {
    // the callback function will execute on the repsonse when its ready
    return {
      reponse_code_from_fb: response.statusCode,
      data_from_fb: JSON.parse(response.body)
    };
  });
    
  
  res.setBody(result);
});

appRouter.get("/fb/*restofpath", function(req,res,restofpath) {
  var result = fbGraphClient.getJSON(restofpath
  , function(response) {
    // the callback function will execute on the response when its ready
    return {
      reponse_code_from_fb: response.statusCode,
      data_from_fb: response.body
    };
  });
  res.setBody(result);
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({links :[
    {title: 'Pivotal on Facebook\'s Graph API', href: baseUrl+'/fb/pivotal'},
    {title: 'Pivotal on Facebook\'s Graph API, setting headers and timeouts on the request', href: baseUrl+'/fb/pivotal_http_request'},
    {title: 'Facebook\'s Graph API', href: baseUrl+'/fb/{username}', templated: true},
    {title: 'Rick Astley on Facebook\'s Graph API', href: baseUrl+'/fb/RickAstley'}
  ]});
});

module.exports = appRouter;
