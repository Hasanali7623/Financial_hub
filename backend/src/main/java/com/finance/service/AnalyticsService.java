package com.finance.service;

import com.finance.dto.request.FinancialAdviceRequest;
import com.finance.service.external.FrankfurterService;
import com.finance.service.external.HuggingFaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService {

    private final HuggingFaceService huggingFaceService;
    private final FrankfurterService frankfurterService;

    public String getFinancialAdvice(FinancialAdviceRequest request) {
        return huggingFaceService.getFinancialAdvice(request.getQuery(), request.getContext()).block();
    }

    public BigDecimal convertCurrency(String from, String to, BigDecimal amount) {
        return frankfurterService.convertCurrency(from, to, amount).block();
    }

    public Map<String, Object> getExchangeRates(String baseCurrency) {
        return frankfurterService.getExchangeRates(baseCurrency).block();
    }

    public String analyzeSpendingPattern(String transactionData) {
        return huggingFaceService.analyzeSpendingPattern(transactionData).block();
    }
}
