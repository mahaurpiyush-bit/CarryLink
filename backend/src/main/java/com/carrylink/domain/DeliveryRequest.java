package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
public class DeliveryRequest {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @com.fasterxml.jackson.annotation.JsonIgnore private User sender;
    @Column(nullable=false) private String origin;
    @Column(nullable=false) private String destination;
    @Column(nullable=false) private String pickupPoint;
    @Column(nullable=false) private String dropPoint;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ItemCategory itemCategory;
    @Column(nullable=false, length=1000) private String description;
    @Column(nullable=false) private double weight;
    private String dimensions;
    @Column(nullable=false) private Instant requiredBy;
    @Column(nullable=false) private double offeredAmount;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private RequestStatus status = RequestStatus.OPEN;
    @Column(nullable=false) private Instant createdAt = Instant.now();
}
