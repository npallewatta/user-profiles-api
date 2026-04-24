package com.project.userapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.project.userapi.repository.UserRepository;

@SpringBootApplication(exclude = UserRepository.class)
public class UserApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserApiApplication.class, args);
    }
}
