package org.flynow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FlyNowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlyNowApplication.class, args);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:3000").allowedHeaders("*").allowedMethods("*");
                registry.addMapping("/**").allowedOrigins("http://192.168.1.64:3000").allowedHeaders("*").allowedMethods("*");
            }
        };
    }
}
