package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
public class TripStop {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @com.fasterxml.jackson.annotation.JsonIgnore private Trip trip;
    @Column(nullable=false) private String location;
    @Column(nullable=false) private int sequenceOrder;
    @Column(nullable=false) private Instant expectedArrival;
    @Column(nullable=false) private Instant expectedDeparture;
}
