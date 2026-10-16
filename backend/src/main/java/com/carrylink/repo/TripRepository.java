package com.carrylink.repo;
import com.carrylink.domain.*;
import org.springframework.data.jpa.repository.*;
import jakarta.persistence.LockModeType;
import java.util.*;
public interface TripRepository extends JpaRepository<Trip,Long> {
  @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select t from Trip t where t.id=:id") Optional<Trip> findLockedById(Long id);
  List<Trip> findByTravellerIdOrderByDepartureTimeDesc(Long id);
}
