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
public class SavingsGoalResponse {
    private Long id;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private BigDecimal remainingAmount;
    private LocalDate targetDate;
    private String description;
    private String status;
    private BigDecimal progress;
    private LocalDateTime createdAt;
}
