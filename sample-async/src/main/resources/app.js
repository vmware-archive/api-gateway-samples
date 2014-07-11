var Router = require("Router");

var appRouter = new Router();

var http = require("http")();

appRouter.get("/rawjoke", function(req,res) {
  var response = http.getJSON("http://api.icndb.com/jokes/random");
  res.setBody({response:response});
});

appRouter.get("/joke", function(req,res) {
  var body = http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
    return {
      id: response.body.value.id,
      joke : response.body.value.joke
    }; 
  });
  res.setBody(body);
});

appRouter.get("/jokes", function(req,res) {
  var body = [];
  for (var i = 0; i < 5; i++) {
    var joke = http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
      return {
        id: response.body.value.id,
        joke : response.body.value.joke
      }; 
    });
    body.push(joke);
  }
  res.setBody(body);
});

appRouter.get("/censordirtyjokes", function(req,res) {
  var body = [];
  for (var i = 0; i < 5; i++) {
    var joke = http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
      if (response.body.value.categories.length > 0) {
        log.warn("dirty joke! '{}'",body.value.joke);
        response.body.value.joke = "***CENSORED!***";
      }
      return {
        id: response.body.value.id,
        joke : response.body.value.joke
      }; 
    });
    body.push(joke);
  }
  res.setBody(body);
});

appRouter.get("/errordirtyjokes", function(req,res) {
  var body = [];
  for (var i = 0; i < 5; i++) {
    var joke = http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
      if (response.body.value.categories.length > 0) {
        log.warn("dirty joke! '{}'",response.body.value.joke);
        throw new Error("dirty joke!");
      }
      return {
        id: response.body.value.id,
        joke : response.body.value.joke
      }; 
    });
    body.push(joke);
  }
  res.setBody(body);
});

appRouter.get("/catcherrordirtyjokes", function(req,res) {
  var body = [];
  for (var i = 0; i < 5; i++) {
    var joke = http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
      if (response.body.value.categories.length > 0) {
        log.warn("dirty joke! '{}'",response.body.value.joke);
        throw new Error("dirty joke!");
      }
      return response.body;
    }).then(function(body) {
      return {
        id: body.value.id,
        joke : body.value.joke
      };
    },function(e) {
      return {
        id: -1,
        joke : "The joke was dirty"
      }
    });
    body.push(joke);
  }
  res.setBody(body);
});

function getCleanJoke(tries) {
  if (tries <= 0) {
    return {
      id: -1,
      joke : "we couldn't find a clean joke"
    }
  }
  return http.getJSON("http://api.icndb.com/jokes/random").then(function(response) {
    if (response.body.value.categories.length > 0) {
      log.warn("dirty joke! {} more tries... '{}'", tries, response.body.value.joke);
      return getCleanJoke(--tries);
    }
    return {
      id: response.body.value.id,
      joke : response.body.value.joke
    };
  });
}

appRouter.get("/cleanjokes", function(req,res) {
  var body = [];
  for (var i = 0; i < 5; i++) {
    body.push(getCleanJoke(5));
  }
  res.setBody(body);
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    note:'Cuck Norris jokes from http://www.icndb.com/. All endpoints use http://api.icndb.com/jokes/random. A "dirty" joke is a joke that has a category.',
    links :[
    {rel: 'The raw output of a single random joke', href: baseUrl+'/rawjoke'},
    {rel: 'Just the id and content of a joke', href: baseUrl+'/joke'},
    {rel: 'Fetch 5 jokes in parallel', href: baseUrl+'/jokes'},
    {rel: 'Fetch 5 jokes in parallel, censor dirty jokes', href: baseUrl+'/censordirtyjokes'},
    {rel: 'Fetch 5 jokes in parallel, throw an error for dirty jokes', href: baseUrl+'/errordirtyjokes'},
    {rel: 'Fetch 5 jokes in parallel, throw an error for dirty jokes, then catch it in the next promise chain', href: baseUrl+'/catcherrordirtyjokes'},
    {rel: 'Fetch 5 jokes in parallel, replace dirty jokes with clean jokes', href: baseUrl+'/cleanjokes'},
  ]});
});


module.exports = appRouter;
