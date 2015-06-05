var Router = require("Router");
var appRouter = new Router();

var sampleService = require('./services/sample-service.js');

appRouter.get("/circuit", function(req, res, name) {
  res.setBody( sampleService.test() );
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({});
});

module.exports = appRouter;
