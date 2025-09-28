package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for REST APIs tested in Postman
            .authorizeHttpRequests()
                .requestMatchers(HttpMethod.POST, "/register").permitAll() // Allow registration
                .requestMatchers("/test").authenticated() // Require auth for /test
                .anyRequest().authenticated() // Protect all other endpoints
            .and()
            .httpBasic(); // Use Basic Auth (username/password)

        return http.build();
    }
}