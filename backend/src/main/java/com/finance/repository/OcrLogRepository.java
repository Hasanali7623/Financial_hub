package com.finance.repository;

import com.finance.entity.OcrLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcrLogRepository extends JpaRepository<OcrLog, Long> {
    List<OcrLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<OcrLog> findByUserIdAndParsingStatus(Long userId, String parsingStatus);
}
