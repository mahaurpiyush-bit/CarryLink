package com.carrylink.service;

import com.carrylink.api.Dtos;
import com.carrylink.domain.*;
import com.carrylink.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service @RequiredArgsConstructor
public class AuthService {
  private final UserRepository users; private final PasswordEncoder encoder;
  @Value("${carrylink.jwt-secret}") private String jwtSecret;
  private String token(User u){return Jwts.builder().subject(u.getEmail()).issuedAt(java.util.Date.from(Instant.now())).expiration(java.util.Date.from(Instant.now().plus(120, ChronoUnit.MINUTES))).signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))).compact();}
  @Transactional public Dtos.Auth register(Dtos.Register input) {
    if(users.findByEmail(input.email()).isPresent()) throw new IllegalArgumentException("Email is already registered");
    User u=new User(); u.setName(input.name()); u.setEmail(input.email().toLowerCase()); u.setPhone(input.phone()); u.setPasswordHash(encoder.encode(input.password())); u.setRole(input.role()); u.setVerificationStatus(input.role()==Role.TRAVELLER?VerificationStatus.PENDING:VerificationStatus.VERIFIED); users.save(u);
    return new Dtos.Auth(token(u),u.getId(),u.getName(),u.getRole());
  }
  public Dtos.Auth login(Dtos.Login input) {
    User u=users.findByEmail(input.email().toLowerCase()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"));
    if(!encoder.matches(input.password(),u.getPasswordHash())) throw new IllegalArgumentException("Invalid email or password");
    return new Dtos.Auth(token(u),u.getId(),u.getName(),u.getRole());
  }
}
