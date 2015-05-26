var Router = require("Router");
var RatedRouter = require("modules/RatedRouter")
var _router = new Router();
var appRouter = new RatedRouter(_router);

var fbGraphClient = require('http')({
	baseUrl : 'http://graph.facebook.com/',
});

appRouter.get("/fb/pivotal", function(req, res) {
	var result = fbGraphClient.getJSON('pivotalsoftware', function(response) {
		return {
			reponse_code_from_fb : response.statusCode,
			data_from_fb : response.body
		};
	});
	res.setBody(result);
});

module.exports = _router;