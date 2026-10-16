package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"booking_id", "reviewer_id"}))
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private Booking booking;
    @ManyToOne(optional = false) private User reviewer;
    @ManyToOne(optional = false) private User reviewedUser;
    @Column(nullable = false) private int rating;
    @Column(nullable = false, length = 1000) private String comment;
    @Column(nullable = false) private Instant createdAt = Instant.now();
}
