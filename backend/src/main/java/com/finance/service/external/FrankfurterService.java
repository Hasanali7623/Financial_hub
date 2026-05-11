package com.finance.service.external;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@Slf4j
public class FrankfurterService {

    @Value("${frankfurter.base.url}")
    private String baseUrl;

    private final WebClient webClient;

    public FrankfurterService(@Value("${frankfurter.base.url}") String baseUrl) {
        this.baseUrl = baseUrl;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public Mono<BigDecimal> convertCurrency(String from, String to, BigDecimal amount) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/latest")
                        .queryParam("from", from)
                        .queryParam("to", to)
                        .queryParam("amount", amount)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                    if (rates != null && rates.containsKey(to)) {
                        Object rate = rates.get(to);
                        if (rate instanceof Number) {
                            return new BigDecimal(((Number) rate).doubleValue())
                                    .setScale(2, RoundingMode.HALF_UP);
                        }
                    }
                    return amount;
                })
                .doOnSuccess(result -> log.info("Currency conversion successful: {} {} = {} {}", 
                        amount, from, result, to))
                .doOnError(error -> log.error("Currency conversion failed: {}", error.getMessage()))
                .onErrorReturn(amount);
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> getExchangeRates(String baseCurrency) {
        return (Mono<Map<String, Object>>) (Mono<?>) webClient.get()
                .uri("/latest?from=" + baseCurrency)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnSuccess(response -> log.info("Exchange rates fetched successfully"))
                .doOnError(error -> log.error("Failed to fetch exchange rates: {}", error.getMessage()));
    }
}
