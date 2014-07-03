var Router = require("Router");
var appRouter = new Router();

var weatherObj = require('/data/weather.json');
var jsonpath = require('json-path');

appRouter.get('/weather',function(req,res) {
  var result = weatherObj;
  if (req.parameters.path) {
    result = jsonpath(result,req.parameters.path);
  }
  res.setBody(result);
});

appRouter.get('/weather/now',function(req,res) {
  res.setBody(jsonpath(weatherObj,'currentConditions'));
});

appRouter.get('/weather/yesterday',function(req,res) {
  res.setBody(jsonpath(weatherObj,'yesterdayConditions'));
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    note:'Running JSONPath on prerecorded weather data. JSONPath provided by https://code.google.com/p/json-path/',
    links :[
    {rel: 'Original weather object', href: baseUrl+'/weather'},
    {rel: 'Toronto weather now', href: baseUrl+'/weather/now'},
    {rel: 'Toronto weather yesterday', href: baseUrl+'/weather/yesterday'},
    {rel: 'First 2 forecast periods', href: baseUrl+'/weather?path=forecastGroup.forecast[0:2]'},
    {rel: 'Last 2 forecast periods', href: baseUrl+'/weather?path=forecastGroup.forecast[-2:]'}
  ]});
});

module.exports = appRouter;
