package com.example.hello;

import org.springframework.stereotype.Component;

@Component
public class HelloService {

    public String getHelloMessage() {
        return "Hello from a Spring Bean!";
    }

}
