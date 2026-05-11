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
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String category;
    private String type;
    private String currency;
    private LocalDate transactionDate;
    private String description;
    private String merchant;
    private String paymentMethod;
    private Boolean isRecurring;
    private String recurringFrequency;
    private LocalDate nextDueDate;
    private Boolean ocrProcessed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
