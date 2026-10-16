package com.carrylink.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"request_id"}))
public class Booking {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) private DeliveryRequest request;
    @ManyToOne(optional=false) private Trip trip;
    @ManyToOne(optional=false) private User sender;
    @ManyToOne(optional=false) private User traveller;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role proposedBy;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status = BookingStatus.PENDING;
    @Column(nullable=false) private double reservedWeight;
    @Column(nullable=false) private Instant createdAt = Instant.now();
    private String receiverName;
    @Column(length=1000) private String deliveryNote;
    private Instant deliveredAt;
    @Version private long version;
}
