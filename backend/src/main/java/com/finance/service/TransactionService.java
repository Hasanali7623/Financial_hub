package com.finance.service;

import com.finance.dto.request.TransactionRequest;
import com.finance.dto.response.TransactionResponse;
import com.finance.entity.Transaction;
import com.finance.entity.User;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.TransactionRepository;
import com.finance.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;

    public TransactionService(TransactionRepository transactionRepository, 
                             UserRepository userRepository, 
                             @Lazy BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetService = budgetService;
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setType(request.getType());
        transaction.setCurrency(request.getCurrency());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setMerchant(request.getMerchant());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setIsRecurring(request.getIsRecurring());
        transaction.setRecurringFrequency(request.getRecurringFrequency());
        
        // Calculate next due date if recurring
        if (Boolean.TRUE.equals(request.getIsRecurring()) && request.getRecurringFrequency() != null) {
            transaction.setNextDueDate(calculateNextDueDate(request.getTransactionDate(), request.getRecurringFrequency()));
        } else {
            transaction.setNextDueDate(request.getNextDueDate());
        }
        
        transaction.setOcrProcessed(false);

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction created: {} for user: {}", saved.getId(), userEmail);

        // Update budget if this is an expense
        if ("EXPENSE".equals(saved.getType())) {
            budgetService.updateBudgetForTransaction(user.getId(), saved.getCategory(), 
                saved.getTransactionDate(), saved.getAmount());
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return transactionRepository.findByUserIdOrderByTransactionDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setType(request.getType());
        transaction.setCurrency(request.getCurrency());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setMerchant(request.getMerchant());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setIsRecurring(request.getIsRecurring());
        transaction.setRecurringFrequency(request.getRecurringFrequency());
        
        // Calculate next due date if recurring
        if (Boolean.TRUE.equals(request.getIsRecurring()) && request.getRecurringFrequency() != null) {
            transaction.setNextDueDate(calculateNextDueDate(request.getTransactionDate(), request.getRecurringFrequency()));
        } else {
            transaction.setNextDueDate(request.getNextDueDate());
        }

        // Get old values for budget update
        String oldCategory = transaction.getCategory();
        LocalDate oldDate = transaction.getTransactionDate();
        String oldType = transaction.getType();

        Transaction updated = transactionRepository.save(transaction);
        log.info("Transaction updated: {}", updated.getId());

        // Recalculate budgets for affected categories
        if ("EXPENSE".equals(oldType) || "EXPENSE".equals(updated.getType())) {
            budgetService.recalculateBudgetForCategory(user.getId(), oldCategory, oldDate);
            if (!oldCategory.equals(updated.getCategory()) || !oldDate.equals(updated.getTransactionDate())) {
                budgetService.recalculateBudgetForCategory(user.getId(), updated.getCategory(), updated.getTransactionDate());
            }
        }

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTransaction(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        String category = transaction.getCategory();
        LocalDate transactionDate = transaction.getTransactionDate();
        String type = transaction.getType();

        transactionRepository.delete(transaction);
        log.info("Transaction deleted: {}", id);

        // Recalculate budget if this was an expense
        if ("EXPENSE".equals(type)) {
            budgetService.recalculateBudgetForCategory(user.getId(), category, transactionDate);
        }
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> filterTransactions(String userEmail, String category, String type, 
                                                       LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return transactionRepository.findByFilters(user.getId(), category, type, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getUpcomingRecurringTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);
        
        return transactionRepository.findByUserIdAndIsRecurringTrueAndNextDueDateBetween(
                user.getId(), today, threeDaysLater)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LocalDate calculateNextDueDate(LocalDate currentDate, String frequency) {
        if (currentDate == null || frequency == null) {
            return null;
        }
        
        switch (frequency.toUpperCase()) {
            case "DAILY":
                return currentDate.plusDays(1);
            case "WEEKLY":
                return currentDate.plusWeeks(1);
            case "MONTHLY":
                return currentDate.plusMonths(1);
            case "YEARLY":
                return currentDate.plusYears(1);
            default:
                return null;
        }
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .category(transaction.getCategory())
                .type(transaction.getType())
                .currency(transaction.getCurrency())
                .transactionDate(transaction.getTransactionDate())
                .description(transaction.getDescription())
                .merchant(transaction.getMerchant())
                .paymentMethod(transaction.getPaymentMethod())
                .isRecurring(transaction.getIsRecurring())
                .recurringFrequency(transaction.getRecurringFrequency())
                .nextDueDate(transaction.getNextDueDate())
                .ocrProcessed(transaction.getOcrProcessed())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
