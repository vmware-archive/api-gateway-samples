# Rate limited Router
Using redis to control request rate based on access tokens.

# Overview

This sample covers various advanced topics involved in using API Gateway to create a rate limited API. Within the project, you can find examples of extending the routing functionality, accessing Spring Beans in JavaScript, as well as scripting custom Java Classes. 

## io.pivotal.api.rate.RateLimiterImpl
This Java Class ( / Spring Component) defines the Rate Limiter implementation, which handles storing and reading the rate limiting definition for acccess tokens, and incrementing/resetting request counts in Redis.

This Component is accessed using ```spring.getBean("rateLimiter")``` in RatedRouter.js to call its methods from JavaScript.

## RatedRouter.js
This JavaScript module is a wrapper around the core JS router for API Gateway, which calls the rateLimiter component to check rate limiting quotas for the supplied access tokens.

When defining route handlers for HTTP methods (.get(),.post(), etc), the rate limiter is called before the defined handler logic to determine whether the limit has been exceeded, or to continue.


# Setup : Testing Locally

*Before starting the application locally, you will need to start your local Redis server by running ```redis-server``` in the command line.

To start the Spring Boot app for this sample, run the command ```mvn spring-boot:run``` from the project's root directory.

# Setup : Deploy to Pivotal Cloud Foundry

*Before pushing the app to Pivotal Cloud Foundry, you must first create an instance of a Redis service (tested on p-redis) to store the rate limit configuration details for access tokens.

From the CF cli, log in to your CF environment and select the org and space you will be deploying to. Use the ```cf create-service``` command to create an instance of redis named 'rate-limit-redis' with the 'shared-vm' plan ( eg. cf cs p-redis shared-vm rate-limit-redis ). If you wish to create the service instance with a different name, you should also replace the ```- rate-limit-redis``` on line 9 of the manifest.yml to reflect this.

Once your Redis service instance has been created, run the ```cf push``` command in this directory.

The manifest.yml file in this project will automatically set up the app with the name "api-gateway-rate-limit-sample", 1 512mb instance, and bind the rate-limit-redis service before starting.


# Testing it Out!

Once you've pushed to CF or started the app locally, you're now ready to test out the rate limiting functionality!

## Creating an access token

First, you'll create an access token with a configured rate limiting service level by making a POST request to the ```/api/v1/token``` endpoint. This endpoint allows you to generate a new access token, and allows the API user to define the number of requests the token can be used for within a specific window. 

The following curl command will generate an access token which is allowed 10 requests within a 1 minute window:

```
curl 'http://localhost:8080/api/v1/token' -H 'Content-Type: application/json' --data-binary $'{\n  "value":10,\n  "current":null,\n  "reset":null,\n  "window":60\n}' 
```

In the JSON response, you'll see a key for ```access_token```, and you will need this value to test out the subsequent request.

eg. 
```
{ 
  "access_token":"27c4e751e00kg8",
  "value":10,
  "window":60
`}
```

## Testing the API

Using the access_token created in the previous API call, you should now be able to access the rate-limited apis.
The following curl command will perfom a GET request to the ```/api/v1/fb/pivotal`` endpoint, which is set up on the Rate limiting router, and requires an access token in the Authorization header ( use the access_token key from the previous response JSON)

```
curl 'http://localhost:8080/api/v1/fb/pivotal' -H 'Authorization: token <access_token>'
```