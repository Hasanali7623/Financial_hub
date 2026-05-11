package com.finance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String type; // INCOME or EXPENSE

    @Column(length = 3)
    private String currency = "USD";

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(length = 500)
    private String description;

    private String merchant;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Column(name = "recurring_frequency")
    private String recurringFrequency; // DAILY, WEEKLY, MONTHLY, YEARLY

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(name = "ocr_processed")
    private Boolean ocrProcessed = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
