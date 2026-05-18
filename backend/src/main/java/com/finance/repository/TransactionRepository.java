package com.finance.repository;

import com.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    List<Transaction> findByUserIdAndCategoryOrderByTransactionDateDesc(Long userId, String category);

    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndTypeOrderByTransactionDateDesc(Long userId, String type);

    List<Transaction> findByUserIdAndTransactionDateBetween(
            Long userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndCategoryAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, String category, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndIsRecurringTrueAndNextDueDateBetween(
            Long userId, LocalDate startDate, LocalDate endDate);

    void deleteByUserId(Long userId);
}

