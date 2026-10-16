package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.*;

@Entity @Getter @Setter @NoArgsConstructor
public class Trip {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) private User traveller;
    @Column(nullable=false) private String origin;
    @Column(nullable=false) private String destination;
    @Column(nullable=false) private Instant departureTime;
    @Column(nullable=false) private Instant expectedArrivalTime;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private TransportType transportType;
    @Column(nullable=false) private double totalCapacity;
    @Column(nullable=false) private double availableCapacity;
    @Column(nullable=false) private String pickupPoint;
    @Column(nullable=false) private String dropPoint;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private TripStatus status = TripStatus.ACTIVE;
    @Column(nullable=false) private Instant createdAt = Instant.now();
    @Version private long version;
    @OneToMany(mappedBy="trip", cascade=CascadeType.ALL, orphanRemoval=true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OrderBy("sequenceOrder ASC") private List<TripStop> stops = new ArrayList<>();
}
