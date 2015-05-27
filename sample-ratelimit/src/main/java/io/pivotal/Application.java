package io.pivotal;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
@EnableAutoConfiguration
@ComponentScan
@EnableConfigurationProperties
public class Application extends com.pivotal.mss.apigateway.Application {
	
	public static void main(String[] args) {
		runApplication(Application.class, args);
		List<Integer> names = new ArrayList<Integer>();
	}
	
	@Bean
	StringRedisTemplate template(RedisConnectionFactory connectionFactory) {
		return new StringRedisTemplate(connectionFactory);
	}

	
	
	
}
