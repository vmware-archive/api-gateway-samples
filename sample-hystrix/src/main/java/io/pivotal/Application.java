package io.pivotal;

import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;

@EnableCircuitBreaker
public class Application extends com.pivotal.mss.apigateway.Application {

	public static void main(String[] args) {
		runApplication(Application.class, args);
	}

}