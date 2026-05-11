package com.finance.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.application.name}")
    private String applicationName;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", applicationName);
        health.put("timestamp", LocalDateTime.now());
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", applicationName);
        info.put("version", "1.0.0");
        info.put("description", "AI-Assisted Personal Financial Health Dashboard Backend");
        info.put("features", new String[]{
                "JWT Authentication",
                "Transaction Management",
                "Budget Tracking",
                "Savings Goals",
                "OCR Receipt Parsing",
                "Currency Conversion",
                "AI Financial Advice"
        });
        info.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(info);
    }
}
