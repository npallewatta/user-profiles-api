package com.project.userapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class UserApiApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(UserApiApplication.class, args);
    }
}
