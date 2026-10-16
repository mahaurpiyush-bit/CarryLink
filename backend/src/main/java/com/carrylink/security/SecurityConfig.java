package com.carrylink.security;

import com.carrylink.domain.User;
import com.carrylink.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.*;

@Configuration @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
  private final UserRepository users;
  @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
  @Bean UserDetailsService userDetailsService(){ return email -> users.findByEmail(email).map(this::details).orElseThrow(() -> new UsernameNotFoundException(email)); }
  private UserDetails details(User u){ return org.springframework.security.core.userdetails.User.withUsername(u.getEmail()).password(u.getPasswordHash()).roles(u.getRole().name()).build(); }
  @Bean SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
    return http.csrf(c -> c.disable()).cors(c -> {}).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(a -> a.requestMatchers("/api/auth/**","/error").permitAll().anyRequest().authenticated()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
  }
}
