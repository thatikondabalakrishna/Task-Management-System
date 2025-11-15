package com.tms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for simplicity
            .authorizeHttpRequests(auth -> auth
                .antMatchers("/public/**", "/login", "/Register", "/registration").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")                  // Custom login page
                .loginProcessingUrl("/loginAccount")  // Login form posts here
                .usernameParameter("userName")        // Username field in form
                .passwordParameter("Password")        // Password field in form
                .defaultSuccessUrl("/dashboard", true) // Redirect on success
                .failureUrl("/login?error=true")     // Redirect on failure
            )
            .logout(logout -> logout
                .logoutUrl("/Logout")
                .logoutSuccessUrl("/login")
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            if ("ADMIN".equals(username)) {
                return User.builder()
                        .username("ADMIN")
                        .password(passwordEncoder().encode("1234")) // Hardcoded password
                        .roles("ADMIN")
                        .build();
            } else if ("user".equals(username)) {
                return User.builder()
                        .username("user")
                        .password(passwordEncoder().encode("user123"))
                        .roles("USER")
                        .build();
            } else {
                throw new UsernameNotFoundException("User not found");
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
