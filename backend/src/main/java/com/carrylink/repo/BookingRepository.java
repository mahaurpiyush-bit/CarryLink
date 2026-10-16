package com.carrylink.repo;
import com.carrylink.domain.Booking;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BookingRepository extends JpaRepository<Booking,Long> {
    List<Booking> findBySenderIdOrTravellerIdOrderByCreatedAtDesc(Long senderId, Long travellerId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Booking> findByRequestId(Long requestId);
}
