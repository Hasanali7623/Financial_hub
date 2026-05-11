package com.finance.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Type is required")
    private String type; // INCOME or EXPENSE

    private String currency = "USD";

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    private String description;

    private String merchant;

    private String paymentMethod;

    private Boolean isRecurring = false;

    private String recurringFrequency; // DAILY, WEEKLY, MONTHLY, YEARLY

    private LocalDate nextDueDate;
}
