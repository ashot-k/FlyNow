package org.flynow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class FlyNowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlyNowApplication.class, args);
    }

}
