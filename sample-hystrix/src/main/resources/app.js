var Router = require("Router");
var appRouter = new Router();

var sampleService = require('./services/sample-service.js');


appRouter.get("/circuit", function(req, res, name) {
  res.setBody(sampleService.test() );
});

appRouter.get("/test", function(req, res) {
  
  var blah = Math.floor( (Math.random() * 10) + 1 );
  
  if ( blah > 6) {
    res.setStatus(500);
  }

  res.setBody("You get a " + blah);
  
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({});
});

module.exports = appRouter;
