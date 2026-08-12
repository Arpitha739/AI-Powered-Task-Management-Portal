package com.taskportal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {

        return "JWT Authentication Success";
    }
    
    @GetMapping("/api/test/public")
    public String publicTest() {
        return "Spring Boot Backend Connected Successfully";
    }
    
}