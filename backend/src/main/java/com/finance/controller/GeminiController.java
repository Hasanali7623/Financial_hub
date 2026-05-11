package com.finance.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class GeminiController {

    private static final String API_KEY = "AIzaSyAu12r5JuVgIdkloI7eL14LiwOkH630nzA";
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askGemini(@RequestBody Map<String, String> request) {
        String question = request.get("question");

        try {
            RestTemplate restTemplate = new RestTemplate();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", question)))
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_API_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        String answer = (String) parts.get(0).get("text");
                        return ResponseEntity.ok(Map.of("response", answer));
                    }
                }
            }

            return ResponseEntity.ok(Map.of("response", "No response from AI"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("response", "Error: " + e.getMessage()));
        }
    }
}
