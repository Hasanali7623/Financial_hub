package com.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FinancialHealthDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancialHealthDashboardApplication.class, args);
    }
}
