package com.finance.controller;

import com.finance.dto.request.BudgetRequest;
import com.finance.dto.response.ApiResponse;
import com.finance.dto.response.BudgetResponse;
import com.finance.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Budgets", description = "Budget management endpoints")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @Operation(summary = "Create a new budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {
        BudgetResponse response = budgetService.createBudget(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Budget created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all budgets")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets(Authentication authentication) {
        List<BudgetResponse> budgets = budgetService.getAllBudgets(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(
            @PathVariable Long id,
            Authentication authentication) {
        BudgetResponse response = budgetService.getBudgetById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/period")
    @Operation(summary = "Get budgets by period")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByPeriod(
            @RequestParam Integer month,
            @RequestParam Integer year,
            Authentication authentication) {
        List<BudgetResponse> budgets = budgetService.getBudgetsByPeriod(authentication.getName(), month, year);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {
        BudgetResponse response = budgetService.updateBudget(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long id,
            Authentication authentication) {
        budgetService.deleteBudget(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}
