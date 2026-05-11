package com.finance.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAdviceRequest {

    @NotBlank(message = "User query is required")
    private String query;

    private String context; // Optional financial context
}
