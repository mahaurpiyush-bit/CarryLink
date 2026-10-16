package com.carrylink.repo;
import com.carrylink.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReportRepository extends JpaRepository<Report,Long> { List<Report> findByStatusOrderByCreatedAtAsc(com.carrylink.domain.ReportStatus status); }
