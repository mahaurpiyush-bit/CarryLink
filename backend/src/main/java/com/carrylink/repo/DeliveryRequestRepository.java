package com.carrylink.repo;
import com.carrylink.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DeliveryRequestRepository extends JpaRepository<DeliveryRequest,Long> {
  List<DeliveryRequest> findBySenderIdOrderByCreatedAtDesc(Long id);
  List<DeliveryRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
}
