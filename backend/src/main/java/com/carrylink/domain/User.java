package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String phone;
    @Column(nullable=false) @com.fasterxml.jackson.annotation.JsonIgnore private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    @Column(nullable=false) private double rating = 5.0;
    @Column(nullable=false) private int completedTrips = 0;
    @Column(nullable=false) private Instant createdAt = Instant.now();
}
