var Rate = Packages.io.pivotal.api.rate.Rate;
var rateLimiter = spring.getBean("rateLimiter");

var Router = require("Router");
var RatedRouter = require("./modules/RatedRouter.js")
var router = new Router();
var appRouter = new RatedRouter(router);

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

router.post("/token", function(req, res){
	var rate = new Rate();
	var token = Math.floor((1 + Math.random()) * 0x1000000000000000).toString(24);
	rate.setKey(token);
	rate.setValue( req.body.value || req.parameters['value'] || 10 );
	rate.setWindow( req.body.window || req.parameters['window'] || 120 );

	rateLimiter.setRate(rate);

	res.setBody({ 
		'access_token': token,
		'value': rate.getValue(),
		'window': rate.getWindow()
	});
});

module.exports = router;