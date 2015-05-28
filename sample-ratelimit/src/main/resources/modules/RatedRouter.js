var RatedRouter = function(router) {
	this.router = router;
}

function getApiKey(req){
	console.log(Object.keys(req.headers));
	var header = req.headers["authorization"];
	return header.split(" ")[1];
}

function checkLimit(req,res){
	var api = getApiKey(req);
	var rate = spring.getBean("rateLimiter").getRate(api);
	var remaining = rate.value-rate.current;
	res.setHeader("X-RateLimit-Limit",rate.value);
	res.setHeader("X-RateLimit-Remaining", Math.max(0,remaining));
	res.setHeader("X-RateLimit-Reset",rate.reset);
	return (remaining > 0);
}

RatedRouter.prototype = {
		
	get: function(path, handle){
		this.router.get(path, function(req, res){
			if(!checkLimit(req,res)){
				res.setStatus(429);
			}else{
				handle(req,res);
			}
		});
	},
	post: function(path, handle){
		this.router.post(path, function(req, res){
			if(!checkLimit(req,res)){
				res.setStatus(429);
			}else{
				handle(req,res);
			}
		});
	},
	
	put: function(path, handle){
		this.router.put(path, function(req, res){
			if(!checkLimit(req,res)){
				res.setStatus(429);
			}else{
				handle(req,res);
			}
		});
	},
	
	delete : function(path, handle){
		this.router.delete(path, function(req, res){
			if(!checkLimit(req,res)){
				res.setStatus(429);
			}else{
				handle(req,res);
			}
		});
	}

   
}

module.exports = RatedRouter