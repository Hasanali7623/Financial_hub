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
public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private Integer month;
    private Integer year;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal alertThreshold;
    private BigDecimal percentageUsed;
    private LocalDateTime createdAt;
}
