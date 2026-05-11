package com.finance.service.external;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class HuggingFaceService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    public Mono<String> getFinancialAdvice(String query, String context) {
        // Debug logging
        log.info("=== AI ADVISOR DEBUG ===");
        log.info("API Key present: {}", apiKey != null);
        log.info("API Key length: {}", apiKey != null ? apiKey.length() : 0);
        log.info("API Key starts with: {}", apiKey != null ? apiKey.substring(0, Math.min(10, apiKey.length())) : "null");
        
        // Always try to use Gemini API first
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("your_")) {
            log.error("GEMINI API KEY NOT CONFIGURED! Using fallback. ApiKey: {}", apiKey);
            return Mono.just(generateFallbackAdvice(query));
        }
        
        Map<String, Object> requestBody = new HashMap<>();
        String fullQuery = context != null && !context.isEmpty() 
                ? context + " " + query 
                : "You are a professional financial advisor. Provide helpful, practical advice for this question: " + query;
        
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", fullQuery);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        log.info("Sending request to Gemini API for query: {}", query);
        
        return webClient.post()
                .uri("/gemini-pro:generateContent?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        log.info("Received response from Gemini API: {}", response);
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            Map<String, Object> content1 = (Map<String, Object>) candidates.get(0).get("content");
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content1.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                String generatedText = (String) parts.get(0).get("text");
                                log.info("Successfully generated advice: {}", generatedText.substring(0, Math.min(50, generatedText.length())));
                                return generatedText;
                            }
                        }
                        log.warn("No candidates found in Gemini response");
                        return "Unable to generate advice";
                    } catch (Exception e) {
                        log.error("Error parsing Gemini response: {}", e.getMessage(), e);
                        return "Unable to generate advice";
                    }
                })
                .doOnError(error -> {
                    log.error("Failed to generate financial advice from Gemini API: {}", error.getMessage(), error);
                })
                .onErrorResume(error -> {
                    log.info("Using fallback advice due to error");
                    return Mono.just(generateFallbackAdvice(query));
                });
    }

    private String generateFallbackAdvice(String query) {
        String lowerQuery = query.toLowerCase();
        
        if (lowerQuery.contains("save") || lowerQuery.contains("saving")) {
            return "💰 To save more money:\n\n" +
                   "1. Set up automatic transfers to savings on payday\n" +
                   "2. Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings\n" +
                   "3. Track your expenses daily to identify areas to cut back\n" +
                   "4. Start with small goals - even ₹500/month adds up\n" +
                   "5. Consider opening a high-yield savings account";
        } else if (lowerQuery.contains("budget") || lowerQuery.contains("groceries") || lowerQuery.contains("food")) {
            return "🛒 Budgeting Tips:\n\n" +
                   "1. Plan meals weekly and make a shopping list\n" +
                   "2. A typical grocery budget is 10-15% of income\n" +
                   "3. Buy in bulk for non-perishables\n" +
                   "4. Use the envelope method for cash budgeting\n" +
                   "5. Review and adjust your budget monthly";
        } else if (lowerQuery.contains("expense") || lowerQuery.contains("reduce") || lowerQuery.contains("cut")) {
            return "✂️ Reduce Expenses:\n\n" +
                   "1. Cancel unused subscriptions\n" +
                   "2. Cook at home more often\n" +
                   "3. Use public transportation or carpool\n" +
                   "4. Negotiate bills (internet, phone, insurance)\n" +
                   "5. Wait 24 hours before making impulse purchases";
        } else if (lowerQuery.contains("goal") || lowerQuery.contains("achieve")) {
            return "🎯 Achieve Financial Goals:\n\n" +
                   "1. Make goals specific and measurable\n" +
                   "2. Break large goals into smaller milestones\n" +
                   "3. Automate savings for consistency\n" +
                   "4. Review progress weekly or monthly\n" +
                   "5. Celebrate small wins to stay motivated";
        } else if (lowerQuery.contains("debt") || lowerQuery.contains("loan")) {
            return "💳 Managing Debt:\n\n" +
                   "1. List all debts with interest rates\n" +
                   "2. Pay minimums on all, extra on highest rate\n" +
                   "3. Consider debt consolidation if rates are high\n" +
                   "4. Avoid taking on new debt while paying off existing\n" +
                   "5. Negotiate lower interest rates with creditors";
        } else if (lowerQuery.contains("invest") || lowerQuery.contains("investment")) {
            return "📈 Investment Basics:\n\n" +
                   "1. Start with an emergency fund (3-6 months expenses)\n" +
                   "2. Contribute to retirement accounts first\n" +
                   "3. Diversify investments across asset classes\n" +
                   "4. Consider low-cost index funds for long-term\n" +
                   "5. Don't invest money you'll need in next 5 years";
        } else {
            return "💡 General Financial Advice:\n\n" +
                   "1. Track all income and expenses\n" +
                   "2. Build an emergency fund (3-6 months expenses)\n" +
                   "3. Pay yourself first - save before spending\n" +
                   "4. Avoid lifestyle inflation as income grows\n" +
                   "5. Review your finances monthly and adjust as needed\n\n" +
                   "Feel free to ask specific questions about saving, budgeting, investing, or debt management!";
        }
    }

    public Mono<String> analyzeSpendingPattern(String transactionData) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your_gemini_api_key")) {
            log.warn("Gemini API key not configured for spending analysis");
            return Mono.just("Please configure Gemini API key to analyze spending patterns.");
        }

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", "Analyze this spending pattern and provide insights: " + transactionData);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        log.info("Sending spending pattern analysis request to Gemini API");

        return webClient.post()
                .uri("/gemini-pro:generateContent?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        log.info("Received spending analysis response from Gemini API");
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            Map<String, Object> content1 = (Map<String, Object>) candidates.get(0).get("content");
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content1.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                return (String) parts.get(0).get("text");
                            }
                        }
                        return "Unable to analyze spending pattern";
                    } catch (Exception e) {
                        log.error("Error parsing Gemini response for spending analysis: {}", e.getMessage(), e);
                        return "Unable to analyze";
                    }
                })
                .doOnError(error -> {
                    log.error("Failed to analyze spending pattern: {}", error.getMessage(), error);
                })
                .onErrorReturn("Unable to analyze spending pattern at this time.");
    }
}
