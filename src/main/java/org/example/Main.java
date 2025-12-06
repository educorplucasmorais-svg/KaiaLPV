package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = "model")
@EnableJpaRepositories(basePackages = "org.example")
@ComponentScan(basePackages = {"org.example", "model", "service", "controller", "config"})
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}