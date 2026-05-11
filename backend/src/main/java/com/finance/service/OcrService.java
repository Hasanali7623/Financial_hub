package com.finance.service;

import com.finance.dto.response.OcrLogResponse;
import com.finance.dto.response.TransactionResponse;
import com.finance.entity.OcrLog;
import com.finance.entity.Transaction;
import com.finance.entity.User;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.OcrLogRepository;
import com.finance.repository.TransactionRepository;
import com.finance.repository.UserRepository;
import com.finance.service.external.OcrSpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class OcrService {

    private final OcrSpaceService ocrSpaceService;
    private final OcrLogRepository ocrLogRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponse uploadAndParseReceipt(MultipartFile file, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            // Call OCR API
            Map<String, Object> ocrResponse = ocrSpaceService.parseReceipt(file).block();
            String rawText = ocrSpaceService.extractTextFromOcrResponse(ocrResponse);

            // Parse the text
            OcrLog ocrLog = new OcrLog();
            ocrLog.setUser(user);
            ocrLog.setFileName(file.getOriginalFilename());
            ocrLog.setRawText(rawText);

            // Extract information from text
            BigDecimal amount = extractAmount(rawText);
            LocalDate date = extractDate(rawText);
            String merchant = extractMerchant(rawText);

            ocrLog.setParsedAmount(amount);
            ocrLog.setParsedDate(date);
            ocrLog.setParsedMerchant(merchant);
            ocrLog.setParsedDescription("Receipt from " + (merchant != null ? merchant : "Unknown"));

            if (amount != null) {
                ocrLog.setParsingStatus("SUCCESS");

                // Create transaction
                Transaction transaction = new Transaction();
                transaction.setUser(user);
                transaction.setAmount(amount);
                transaction.setCategory("General");
                transaction.setType("EXPENSE");
                transaction.setCurrency("USD");
                transaction.setTransactionDate(date != null ? date : LocalDate.now());
                transaction.setDescription(ocrLog.getParsedDescription());
                transaction.setMerchant(merchant);
                transaction.setOcrProcessed(true);

                Transaction savedTransaction = transactionRepository.save(transaction);
                ocrLog.setTransaction(savedTransaction);
                ocrLogRepository.save(ocrLog);

                log.info("OCR processed successfully and transaction created: {}", savedTransaction.getId());

                return mapToTransactionResponse(savedTransaction);
            } else {
                ocrLog.setParsingStatus("PARTIAL");
                ocrLog.setErrorMessage("Could not extract amount from receipt");
                ocrLogRepository.save(ocrLog);

                throw new RuntimeException("Could not extract required information from receipt");
            }

        } catch (Exception e) {
            log.error("OCR processing failed: {}", e.getMessage());
            throw new RuntimeException("Failed to process receipt: " + e.getMessage());
        }
    }

    private BigDecimal extractAmount(String text) {
        // Pattern to match amounts like $12.34, 12.34, $12, etc.
        Pattern pattern = Pattern.compile("(?:total|amount|\\$)\\s*:?\\s*(\\d+\\.?\\d{0,2})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            try {
                return new BigDecimal(matcher.group(1));
            } catch (Exception e) {
                log.error("Error parsing amount: {}", e.getMessage());
            }
        }
        return null;
    }

    private LocalDate extractDate(String text) {
        // Pattern to match dates like 12/31/2023, 2023-12-31, etc.
        Pattern pattern = Pattern.compile("(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})|(\\d{4}[/-]\\d{1,2}[/-]\\d{1,2})");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            try {
                String dateStr = matcher.group();
                // Basic parsing - you might want to use a more robust date parser
                return LocalDate.now(); // Simplified for now
            } catch (Exception e) {
                log.error("Error parsing date: {}", e.getMessage());
            }
        }
        return LocalDate.now();
    }

    private String extractMerchant(String text) {
        // Extract first line as merchant name (simplified)
        String[] lines = text.split("\\n");
        if (lines.length > 0) {
            return lines[0].trim().substring(0, Math.min(lines[0].trim().length(), 100));
        }
        return "Unknown Merchant";
    }

    public OcrLogResponse getOcrLogById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        OcrLog ocrLog = ocrLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OCR log not found"));

        if (!ocrLog.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to OCR log");
        }

        return mapToOcrLogResponse(ocrLog);
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
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
                .ocrProcessed(transaction.getOcrProcessed())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    private OcrLogResponse mapToOcrLogResponse(OcrLog ocrLog) {
        return OcrLogResponse.builder()
                .id(ocrLog.getId())
                .fileName(ocrLog.getFileName())
                .rawText(ocrLog.getRawText())
                .parsedAmount(ocrLog.getParsedAmount())
                .parsedDate(ocrLog.getParsedDate())
                .parsedMerchant(ocrLog.getParsedMerchant())
                .parsedDescription(ocrLog.getParsedDescription())
                .parsingStatus(ocrLog.getParsingStatus())
                .errorMessage(ocrLog.getErrorMessage())
                .transactionId(ocrLog.getTransaction() != null ? ocrLog.getTransaction().getId() : null)
                .createdAt(ocrLog.getCreatedAt())
                .build();
    }
}
