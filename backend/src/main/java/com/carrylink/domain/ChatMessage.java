package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
public class ChatMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private Booking booking;
    @ManyToOne(optional = false) private User sender;
    @Column(nullable = false, length = 1000) private String body;
    @Column(nullable = false) private Instant createdAt = Instant.now();
}
