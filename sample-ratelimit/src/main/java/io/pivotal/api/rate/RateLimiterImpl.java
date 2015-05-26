package io.pivotal.api.rate;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component("rateLimiter")
public class RateLimiterImpl {
	
	@Autowired
	private StringRedisTemplate template;
	
	@Autowired
	private ObjectMapper mapper;
	
	public Rate getCurrent(final Rate rate){
		Long now = System.currentTimeMillis();
		Long time = (Long)(now/(1000*rate.getWindow()));
		final String key = rate.getKey()+":"+time;
		List<Object> results = template.execute(new SessionCallback<List<Object>>() {

			@Override
			public  List<Object> execute(RedisOperations ops) throws DataAccessException {
				ops.multi();
				ops.boundValueOps(key).increment(1L);
				ops.expire(key, rate.getWindow(), TimeUnit.SECONDS);
				return ops.exec();
			}
		});
		Long current = (Long)results.get(0);
		rate.setCurrent(current.intValue());
		rate.setReset(time*(rate.getWindow()*1000));
		return rate;
	}
	
	public Rate getRate(String apikey){
		Rate rate = null;
		try {
			rate = mapper.readValue(template.opsForValue().get(apikey), Rate.class);
			rate = getCurrent(rate);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return rate;
	}
	
	public void setRate(Rate rate){
		try {
			template.opsForValue().set(rate.getKey(), mapper.writeValueAsString(rate));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
}
