package io.pivotal;

import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;

public class GenericHystrixCommand extends HystrixCommand<String> {
  
  public GenericHystrixCommand(String name, String groupKey) {
    super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey(groupKey))
      .andCommandKey(HystrixCommandKey.Factory.asKey(name)));
  }

  @Override
  protected String run() {
    return "";
  }
  
  @Override
  protected String getFallback() {
    return "";
  }

}
