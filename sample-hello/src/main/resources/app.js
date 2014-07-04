var Router = require("Router");

var appRouter = new Router();

appRouter.get("/hello", function(req,res) {
  res.setBody({message: "Hello World!"});
});

var helloService = spring.getBean("helloService");
appRouter.get("/hello-spring", function(req,res) {
  res.setBody({message: helloService.getHelloMessage()});
});


var echoModule = require('/modules/echoModule');
appRouter.get("/echo/:message", function(req,res, message) {
  res.setBody(echoModule.echo(message));
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    links :[
    {rel: 'Hello world', href: baseUrl+'/hello'},
    {rel: 'Hello world, using a Spring Bean to return the hello message ', href: baseUrl+'/hello-spring'},
    {rel: 'Echos the message back. Also an example of module definition and loading.', href: baseUrl+'/echo/:message'},
    {rel: 'Interactive test runner. You can modify tests and applicaiton code at runtime', href: "http://localhost:8080/test/index.html"}
  ]});
});

module.exports = appRouter;
