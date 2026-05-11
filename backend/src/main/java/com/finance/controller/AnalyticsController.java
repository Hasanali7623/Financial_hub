package com.finance.controller;

import com.finance.dto.request.FinancialAdviceRequest;
import com.finance.dto.response.ApiResponse;
import com.finance.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Analytics & AI", description = "Analytics and AI-powered endpoints")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/ml/advice")
    @Operation(summary = "Get AI-powered financial advice")
    public ResponseEntity<ApiResponse<String>> getFinancialAdvice(
            @Valid @RequestBody FinancialAdviceRequest request) {
        String advice = analyticsService.getFinancialAdvice(request);
        return ResponseEntity.ok(ApiResponse.success("Financial advice generated", advice));
    }

    @GetMapping("/currency/convert")
    @Operation(summary = "Convert currency")
    public ResponseEntity<ApiResponse<BigDecimal>> convertCurrency(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam BigDecimal amount) {
        BigDecimal convertedAmount = analyticsService.convertCurrency(from, to, amount);
        return ResponseEntity.ok(ApiResponse.success("Currency converted successfully", convertedAmount));
    }

    @GetMapping("/currency/rates")
    @Operation(summary = "Get exchange rates")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExchangeRates(
            @RequestParam(defaultValue = "USD") String base) {
        Map<String, Object> rates = analyticsService.getExchangeRates(base);
        return ResponseEntity.ok(ApiResponse.success("Exchange rates fetched successfully", rates));
    }

    @PostMapping("/analytics/spending-pattern")
    @Operation(summary = "Analyze spending pattern")
    public ResponseEntity<ApiResponse<String>> analyzeSpendingPattern(
            @RequestBody String transactionData) {
        String analysis = analyticsService.analyzeSpendingPattern(transactionData);
        return ResponseEntity.ok(ApiResponse.success("Spending pattern analyzed", analysis));
    }
}
