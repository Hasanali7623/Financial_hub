package com.finance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocr_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcrLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Column(name = "parsed_amount")
    private BigDecimal parsedAmount;

    @Column(name = "parsed_date")
    private LocalDate parsedDate;

    @Column(name = "parsed_merchant")
    private String parsedMerchant;

    @Column(name = "parsed_description", length = 500)
    private String parsedDescription;

    @Column(name = "parsing_status")
    private String parsingStatus; // SUCCESS, FAILED, PARTIAL

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
