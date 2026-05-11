package com.finance.controller;

import com.finance.dto.response.ApiResponse;
import com.finance.dto.response.TransactionResponse;
import com.finance.service.OcrService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/integrations/ocr")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "OCR Integration", description = "OCR receipt parsing endpoints")
public class OcrController {

    private final OcrService ocrService;

    @PostMapping("/parse")
    @Operation(summary = "Upload and parse receipt using OCR")
    public ResponseEntity<ApiResponse<TransactionResponse>> uploadReceipt(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File is required"));
        }

        TransactionResponse response = ocrService.uploadAndParseReceipt(file, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Receipt processed successfully", response));
    }
}
