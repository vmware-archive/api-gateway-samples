var Router = require("Router");
var RatedRouter = require("modules/RatedRouter")
var _router = new Router();
var appRouter = new RatedRouter(_router);

appRouter.get("/hello", function(req,res) {
  res.setBody({message: "Hello World!"});
});




module.exports = _router;