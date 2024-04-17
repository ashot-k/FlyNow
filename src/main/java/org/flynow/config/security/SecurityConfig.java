package org.flynow.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((requests) -> {
            try {
                requests.anyRequest().permitAll();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
        http.csrf().disable();
        return http.build();
    }

}
