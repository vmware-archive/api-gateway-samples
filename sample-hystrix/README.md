# API Gateway Hystrix Integration Sample

##Overview

This sample project provides an example implementation of the Netflix open source project Hystrix, which handles a latency and fault tolerance using a circuit breaker pattern. 

The project contains a scriptable implementation of the HystrixCommand class, which allows a developer to create Hystrix circuits in pure JavaScript.

### io.pivotal.GenericHystrixCommand

This Java Class is a simple interface which extends and exposes functionality from the core HystrixCommand class. The **run()** and **getFallback()** methods are overrided in the JS implementation to allow JS function blocks to be used.

### src/main/resources/hystrix-command.js

This JS module wraps the ***io.pivotal.GenericHystrixCommand*** Java Class and exposes Hystrix functionality in a JavaScript Constructor. Extending the original class allows the run and getFallback methods to be replaced with JS functions passed to the constructor.


##Testing locally

Run the [Hystrix Dashboard](https://github.com/Netflix/Hystrix/tree/master/hystrix-dashboard#run-via-gradle) on your local machine.

Start the application by running the following in the command line from the project root directory.

```mvn spring-boot:run```

Run the local testing api by navigating to the test-node-api directory in your terminal and running the following command

```node api.js```


Open the Hystrix Dashboard (http://localhost:7979/hystrix-dashboard) in your browser and type in your local server's Hystrix stream : http://localhost:8080/hystrix.stream.

Using curl, or a similar API testing tool, perform a ```GET``` request to the ``/api/circuit `` endpoint, and note the updates in the Hystrix dashboard.

As the Node.js API starts to 'fail' (it has a random chance of returning 500, and a random chance of appearing as 'failing', by only returning 500 for a random period of time), you will begin to see the circuit's error rate go up, and the circuit will eventually switch over to the "open" state and only perform the fallback method.
