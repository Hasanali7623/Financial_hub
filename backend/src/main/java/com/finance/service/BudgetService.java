package com.finance.service;

import com.finance.dto.request.BudgetRequest;
import com.finance.dto.response.BudgetResponse;
import com.finance.entity.Budget;
import com.finance.entity.User;
import com.finance.exception.ResourceAlreadyExistsException;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.BudgetRepository;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final com.finance.repository.TransactionRepository transactionRepository;

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if budget already exists for this category, month, and year
        if (budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), request.getCategory(), request.getMonth(), request.getYear()).isPresent()) {
            throw new ResourceAlreadyExistsException("Budget already exists for this category and period");
        }

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setSpentAmount(BigDecimal.ZERO);
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setAlertThreshold(request.getAlertThreshold());

        // Set start and end dates
        budget.setStartDate(LocalDate.of(request.getYear(), request.getMonth(), 1));
        budget.setEndDate(budget.getStartDate().plusMonths(1).minusDays(1));

        Budget saved = budgetRepository.save(budget);
        log.info("Budget created: {} for user: {}", saved.getId(), userEmail);

        return mapToResponse(saved);
    }

    @Transactional
    public List<BudgetResponse> getAllBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return budgetRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(budget -> {
                    // Recalculate spending for each budget before returning
                    recalculateBudgetSpending(budget);
                    return mapToResponse(budget);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public BudgetResponse getBudgetById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to budget");
        }

        // Recalculate spending before returning
        recalculateBudgetSpending(budget);

        return mapToResponse(budget);
    }

    @Transactional
    public List<BudgetResponse> getBudgetsByPeriod(String userEmail, Integer month, Integer year) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream()
                .map(budget -> {
                    // Recalculate spending for each budget before returning
                    recalculateBudgetSpending(budget);
                    return mapToResponse(budget);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to budget");
        }

        // Check if updating to a different category/period that already exists
        if (!budget.getCategory().equals(request.getCategory()) || 
            !budget.getMonth().equals(request.getMonth()) || 
            !budget.getYear().equals(request.getYear())) {
            if (budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                    user.getId(), request.getCategory(), request.getMonth(), request.getYear()).isPresent()) {
                throw new ResourceAlreadyExistsException("Budget already exists for this category and period");
            }
        }

        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setAlertThreshold(request.getAlertThreshold());
        budget.setStartDate(LocalDate.of(request.getYear(), request.getMonth(), 1));
        budget.setEndDate(budget.getStartDate().plusMonths(1).minusDays(1));

        Budget updated = budgetRepository.save(budget);
        log.info("Budget updated: {} for user: {}", updated.getId(), userEmail);

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteBudget(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to budget");
        }

        budgetRepository.delete(budget);
        log.info("Budget deleted: {} for user: {}", id, userEmail);
    }

    @Transactional
    public void updateBudgetSpent(Long budgetId, BigDecimal amount) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        budget.setSpentAmount(budget.getSpentAmount().add(amount));
        budgetRepository.save(budget);
    }

    @Transactional
    public void updateBudgetForTransaction(Long userId, String category, LocalDate transactionDate, BigDecimal amount) {
        int month = transactionDate.getMonthValue();
        int year = transactionDate.getYear();
        
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, category, month, year)
                .ifPresent(budget -> recalculateBudgetSpending(budget));
    }

    @Transactional
    public void recalculateBudgetForCategory(Long userId, String category, LocalDate transactionDate) {
        int month = transactionDate.getMonthValue();
        int year = transactionDate.getYear();
        
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, category, month, year)
                .ifPresent(budget -> recalculateBudgetSpending(budget));
    }

    private void recalculateBudgetSpending(Budget budget) {
        // Calculate total spent from actual transactions
        LocalDate startDate = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        BigDecimal totalSpent = transactionRepository
            .findByFilters(budget.getUser().getId(), budget.getCategory(), "EXPENSE", startDate, endDate)
            .stream()
            .map(com.finance.entity.Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        budget.setSpentAmount(totalSpent);
        budgetRepository.save(budget);
        log.info("Budget {} recalculated: spent = {}", budget.getId(), totalSpent);
    }

    private BudgetResponse mapToResponse(Budget budget) {
        BigDecimal remainingAmount = budget.getAmount().subtract(budget.getSpentAmount());
        BigDecimal percentageUsed = budget.getAmount().compareTo(BigDecimal.ZERO) > 0
                ? budget.getSpentAmount().divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .amount(budget.getAmount())
                .spentAmount(budget.getSpentAmount())
                .remainingAmount(remainingAmount)
                .month(budget.getMonth())
                .year(budget.getYear())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .alertThreshold(budget.getAlertThreshold())
                .percentageUsed(percentageUsed)
                .createdAt(budget.getCreatedAt())
                .build();
    }
}
