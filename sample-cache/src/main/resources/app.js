var Router = require("Router");

var appRouter = new Router();

var cache = require('cache');

appRouter.get('/cache/:key', function(req,res,key) {
  log.info("getting key {}",key); 
  var result = cache.get(key).then(function(value) {
    return { key: key, value: value }
  });
  res.setBody(result);
});

appRouter.put('/cache/:key', function(req,res,key) {
  log.info("setting key {} to value {}",key,req.body); 
  res.setBody(cache.set(key,req.body));
});

appRouter.get('/cache/setfakedata/:key', function(req,res,key) {
  var data = {message:"here's some fake data",timestamp: new Date()};
  log.info("setting key {} to value {}",key,data); 
  res.setBody(cache.set(key,data));
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    links :[
    {title: 'GET an object, or PUT the request body, in the cache with the given key', href: baseUrl+'/cache/{key}', templated: true},
    {title: 'Set some fake data in the cache with the given key', href: baseUrl+'/cache/setfakedata/{key}', templated: true},
    {title: 'Set some fake data in the cache keyed to "foo"', href: baseUrl+'/cache/setfakedata/foo'},
    {title: 'Get the data keyed to "foo"', href: baseUrl+'/cache/foo'}
  ]});
});


module.exports = appRouter;
