var Router = require("Router");

var appRouter = new Router();

var censoredSource = 'south_park';
var apiUrl = "http://www.iheartquotes.com/api/v1/random?format=json&max_characters=200&source=starwars+xfiles+hitchhiker+"+censoredSource;
var numberOfQuotes = 20;

var quoteApiClient = require("http")({
  url: apiUrl
});

var shouldCensorQuote = function(quote) {
  return quote.source == censoredSource;
}

appRouter.get("/rawquote", function(req,res) {
  var response = quoteApiClient.getJSON();
  res.setBody({response:response});
});

appRouter.get("/quote", function(req,res) {
  var body = quoteApiClient.getJSON().then(function(response) {
    return {
      link: response.body.link,
      quote : response.body.quote
    }; 
  });
  res.setBody(body);
});

appRouter.get("/quotes", function(req,res) {
  var body = [];
  var num = req.parameters['limit']
  for (var i = 0; i < num; i++) {
    var quote = quoteApiClient.getJSON().then(function(response) {
      return {
        link: response.body.link,
        quote : response.body.quote
      }; 
    });
    body.push(quote);
  }
  res.setBody(body);
});

appRouter.get("/censorquotes", function(req,res) {
  var body = [];
  for (var i = 0; i < numberOfQuotes; i++) {
    var quote = quoteApiClient.getJSON().then(function(response) {
      if (shouldCensorQuote(response.body)) {
        log.warn("censored quote! '{}'",response.body.quote);
        response.body.quote = "***CENSORED!***";
      }
      return {
        link: response.body.link,
        quote : response.body.quote
      }; 
    });
    body.push(quote);
  }
  res.setBody(body);
});

appRouter.get("/errorcensoredquotes", function(req,res) {
  var body = [];
  for (var i = 0; i < numberOfQuotes; i++) {
    var quote = quoteApiClient.getJSON().then(function(response) {
      if (shouldCensorQuote(response.body)) {
        log.warn("censored quote! '{}'",response.body.quote);
        throw new Error("censored quote!");
      }
      return {
        link: response.body.link,
        quote : response.body.quote
      }; 
    });
    body.push(quote);
  }
  res.setBody(body);
});

appRouter.get("/catcherrorcensoredquotes", function(req,res) {
  var body = [];
  for (var i = 0; i < numberOfQuotes; i++) {
    var quote = quoteApiClient.getJSON().then(function(response) {
      if (shouldCensorQuote(response.body)) {
        log.warn("censored quote! '{}'",response.body.quote);
        throw new Error("censored quote!");
      }
      return response.body;
    }).then(function(body) {
      return {
        link: body.link,
        quote : body.quote
      };
    },function(e) {
      return {
        link: null,
        quote : "The quote is censored"
      }
    });
    body.push(quote);
  }
  res.setBody(body);
});

function getCleanQuote(tries) {
  if (tries <= 0) {
    return {
      link: null,
      quote : "we couldn't find a clean quote"
    }
  }
  return quoteApiClient.getJSON().then(function(response) {
    if (shouldCensorQuote(response.body)) {
      log.warn("censored quote! {} more tries... '{}'", tries, response.body.quote);
      return getCleanQuote(--tries);
    }
    return {
      link: response.body.link,
      quote : response.body.quote
    };
  });
}

appRouter.get("/cleanquotes", function(req,res) {
  var body = [];
  for (var i = 0; i < numberofQuotes; i++) {
    body.push(getCleanQuote(numberOfQuotes));
  }
  res.setBody(body);
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    note:'Random quotes from http://www.iheartquotes.com/. All endpoints use '+apiUrl+'. A "censored" quote is a quote that has a source == "'+censoredSource+'".',
    links :[
    {title: 'The raw output of a single random quote', href: baseUrl+'/rawquote'},
    {title: 'Just the link and content of a quote', href: baseUrl+'/quote'},
    {title: 'Fetch 5 quotes in parallel', href: baseUrl+'/quotes'},
    {title: 'Fetch 5 quotes in parallel, censor quotes', href: baseUrl+'/censorquotes'},
    {title: 'Fetch 5 quotes in parallel, throw an error for censored quotes', href: baseUrl+'/errorcensoredquotes', expect:[{statusCode:500},{statusCode:200}]},
    {title: 'Fetch 5 quotes in parallel, throw an error for censored quotes, then catch it in the next promise chain', href: baseUrl+'/catcherrorcensoredquotes'},
    {title: 'Fetch 5 quotes in parallel, replace censored quotes with clean quotes', href: baseUrl+'/cleanquotes'}
  ]});
});


module.exports = appRouter;
