package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) private Booking booking;
    @Column(nullable=false) private double amount;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentStatus status = PaymentStatus.CREATED;
    @Column(nullable=false, unique=true) private String idempotencyKey;
    @Column(nullable=false) private Instant createdAt = Instant.now();
    private Instant updatedAt;
}
