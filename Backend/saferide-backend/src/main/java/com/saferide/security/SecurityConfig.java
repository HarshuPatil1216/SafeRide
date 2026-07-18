package com.saferide.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF - appropriate for stateless REST APIs.
                // Re-enable (or use a token-based CSRF strategy) if this app
                // ever serves browser-based form submissions with cookie auth.
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health").permitAll()
                        .anyRequest().authenticated()
                )

                // Basic auth for now, per requirements. Swap out for a
                // JWT/OAuth2 resource server config later if needed.
                .httpBasic(basic -> {});

        return http.build();
    }
}