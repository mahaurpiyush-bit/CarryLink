package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
public class Report {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) private User reporter;
    @ManyToOne(optional=false) private Booking booking;
    @Column(nullable=false, length=2000) private String description;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ReportStatus status = ReportStatus.OPEN;
    @Column(nullable=false) private Instant createdAt = Instant.now();
}
