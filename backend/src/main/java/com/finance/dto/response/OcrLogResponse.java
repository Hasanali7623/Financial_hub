package com.finance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrLogResponse {
    private Long id;
    private String fileName;
    private String rawText;
    private BigDecimal parsedAmount;
    private LocalDate parsedDate;
    private String parsedMerchant;
    private String parsedDescription;
    private String parsingStatus;
    private String errorMessage;
    private Long transactionId;
    private LocalDateTime createdAt;
}
