package com.finance.controller;

import com.finance.dto.request.SavingsGoalRequest;
import com.finance.dto.response.ApiResponse;
import com.finance.dto.response.SavingsGoalResponse;
import com.finance.service.SavingsGoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Savings Goals", description = "Savings goal management endpoints")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @PostMapping
    @Operation(summary = "Create a new savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> createGoal(
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication authentication) {
        SavingsGoalResponse response = savingsGoalService.createGoal(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all savings goals")
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getAllGoals(Authentication authentication) {
        List<SavingsGoalResponse> goals = savingsGoalService.getAllGoals(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(goals));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get savings goal by ID")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getGoalById(
            @PathVariable Long id,
            Authentication authentication) {
        SavingsGoalResponse response = savingsGoalService.getGoalById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication authentication) {
        SavingsGoalResponse response = savingsGoalService.updateGoal(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete savings goal")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @PathVariable Long id,
            Authentication authentication) {
        savingsGoalService.deleteGoal(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Savings goal deleted successfully", null));
    }

    @PostMapping("/{id}/contribute")
    @Operation(summary = "Add contribution to savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> addContribution(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            Authentication authentication) {
        SavingsGoalResponse response = savingsGoalService.addContribution(id, amount, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Contribution added successfully", response));
    }
}
