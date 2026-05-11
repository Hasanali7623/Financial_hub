package com.finance.repository;

import com.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:category IS NULL OR t.category = :category) " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByFilters(@Param("userId") Long userId,
                                   @Param("category") String category,
                                   @Param("type") String type,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);
    
    List<Transaction> findByUserIdAndIsRecurringTrueAndNextDueDateBetween(
            Long userId, LocalDate startDate, LocalDate endDate);
    
    void deleteByUserId(Long userId);
}
