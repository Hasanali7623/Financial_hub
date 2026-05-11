package com.finance.service;

import com.finance.dto.request.SavingsGoalRequest;
import com.finance.dto.response.SavingsGoalResponse;
import com.finance.entity.SavingsGoal;
import com.finance.entity.User;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.SavingsGoalRepository;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    @Transactional
    public SavingsGoalResponse createGoal(SavingsGoalRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavingsGoal goal = new SavingsGoal();
        goal.setUser(user);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO);
        goal.setTargetDate(request.getTargetDate());
        goal.setDescription(request.getDescription());
        goal.setStatus("ACTIVE");

        SavingsGoal saved = savingsGoalRepository.save(goal);
        log.info("Savings goal created: {} for user: {}", saved.getId(), userEmail);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SavingsGoalResponse> getAllGoals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return savingsGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SavingsGoalResponse getGoalById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }

        return mapToResponse(goal);
    }

    @Transactional
    public SavingsGoalResponse updateGoal(Long id, SavingsGoalRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : goal.getCurrentAmount());
        goal.setTargetDate(request.getTargetDate());
        goal.setDescription(request.getDescription());

        // Check if goal is completed
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        }

        SavingsGoal updated = savingsGoalRepository.save(goal);
        log.info("Savings goal updated: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteGoal(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }

        savingsGoalRepository.delete(goal);
        log.info("Savings goal deleted: {}", id);
    }

    @Transactional
    public SavingsGoalResponse addContribution(Long id, BigDecimal amount, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        }

        SavingsGoal updated = savingsGoalRepository.save(goal);
        log.info("Contribution added to goal: {}, amount: {}", id, amount);

        return mapToResponse(updated);
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        BigDecimal remainingAmount = goal.getTargetAmount().subtract(goal.getCurrentAmount());
        
        return SavingsGoalResponse.builder()
                .id(goal.getId())
                .name(goal.getName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .remainingAmount(remainingAmount)
                .targetDate(goal.getTargetDate())
                .description(goal.getDescription())
                .status(goal.getStatus())
                .progress(goal.getProgress())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
