var Router = require("Router");

var appRouter = new Router();
var UADetector = require('UADetector');

appRouter.get("/uadetector",function(req,res) {
  res.setBody({
    your_useragent_is : req.headers['User-Agent'],
    UADetector_says_this : UADetector(req)
  });
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    links :[
    {title: 'Output from UADetector', href: baseUrl+'/uadetector'}
  ]});
});

module.exports = appRouter;
