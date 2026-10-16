package com.carrylink.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class JwtFilter extends OncePerRequestFilter {
  private final UserDetailsService details; private final byte[] secret;
  public JwtFilter(UserDetailsService details,@Value("${carrylink.jwt-secret}") String secret){this.details=details;this.secret=secret.getBytes(StandardCharsets.UTF_8);}
  protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
    String h=req.getHeader("Authorization");
    if(h!=null&&h.startsWith("Bearer ")){try{String email=Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret)).build().parseSignedClaims(h.substring(7)).getPayload().getSubject(); var u=details.loadUserByUsername(email); SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u,null,u.getAuthorities()));}catch(JwtException|IllegalArgumentException ignored){res.sendError(401,"Invalid token");return;}}
    chain.doFilter(req,res);
  }
}
