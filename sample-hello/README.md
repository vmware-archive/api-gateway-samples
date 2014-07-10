# Hello World
A Hello World, using Spring, an example of module loading, and testing with Jasmine

An API Gateway application starts with [src/main/resources/app.js](src/main/resources/app.js). Here, a Router is defined, which is responsible for handling HTTP requests and generating responses. A Router with no defined routes would look like this:
 
```
var Router = require("Router");

var appRouter = new Router();
\\ Your routes would go here
module.exports = appRouter;
``` 

Please see TODO: port Router docs over

Every API Gateway application is based on Spring Boot. Sometimes you'll want to write something in Java or use some pre-existing Java library. If you can write a Spring Bean that encapsulates what you want to do in Java, it's very easy to access that bean and call it in JavaScript:

```
package com.example;

import org.springframework.stereotype.Component;

@Component
public class HelloService {

    public String getHelloMessage() {
        return "Hello from a Spring Bean!";
    }

}
```

```
var helloService = spring.getBean("helloService");
appRouter.get("/hello-spring", function(req,res) {
  res.setBody({message: helloService.getHelloMessage()});
});
```

In API Gateway, modules are defined in Common-JS style. A Module looks like this:

[src/main/resources/modules/echoModule.js](src/main/resources/modules/echoModule.js)
```
var echoFunction = function(someValue) {
  return { "echo" : someValue };
};
module.exports = {
  echo : echoFunction
};
```

You get a handle on the module by using require(), passing in either the absolute path (leading slash) or relative path (no leading slash, ./ or ../ are ok) to the module. You don't need the .js extension for js files either. Then you can use the module like this:
```
var echoModule = require('/modules/echoModule');
appRouter.get("/echo/:message", function(req, res, message) {
  res.setBody(echoModule.echo(message));
});
```

We've integrated Jasmine 2.0 as a behavior-driven testing framework: http://jasmine.github.io/2.0/introduction.html. Here's a test for the echo module:

[src/test/resources/spec/echoModuleSpec.js](src/test/resources/spec/echoModuleSpec.js)
```
var echoModule = require('/modules/echoModule.js');
describe("echoModule", function() {
  describe("#echo", function() {
    it("returns an object containing the message it recieved ", function() {
      expect(echoModule.echo("someMessage")).toEqual({echo:"someMessage"});
    });
  });
});
```

You place your spec files in src/test/resources/spec. These tests will run as part of the Maven lifecycle, and you can also run them interactively. With interactive testing, you can iterate quickly between writing tests, writing application code, and running the tests, all without having to restart the server. 

To turn on interactive testing, set the property ```enableInteractiveTesting=true``` in src/main/resources/application.properties. Then restart the server, and go to http://localhost:8080/test/index.html. You see the results of all the tests, and you can click on an individual spec to re-run just that spec.

