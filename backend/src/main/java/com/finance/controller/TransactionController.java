package com.finance.controller;

import com.finance.dto.request.TransactionRequest;
import com.finance.dto.response.ApiResponse;
import com.finance.dto.response.TransactionResponse;
import com.finance.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Transactions", description = "Transaction management endpoints")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Create a new transaction")
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        TransactionResponse response = transactionService.createTransaction(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions(Authentication authentication) {
        List<TransactionResponse> transactions = transactionService.getAllTransactions(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(
            @PathVariable Long id,
            Authentication authentication) {
        TransactionResponse response = transactionService.getTransactionById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update transaction")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        TransactionResponse response = transactionService.updateTransaction(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        transactionService.deleteTransaction(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> filterTransactions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        List<TransactionResponse> transactions = transactionService.filterTransactions(
                authentication.getName(), category, type, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/recurring/upcoming")
    @Operation(summary = "Get upcoming recurring bills/transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getUpcomingRecurringTransactions(
            Authentication authentication) {
        List<TransactionResponse> transactions = transactionService.getUpcomingRecurringTransactions(
                authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}
