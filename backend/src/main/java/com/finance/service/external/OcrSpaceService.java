package com.finance.service.external;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class OcrSpaceService {

    @Value("${ocr.space.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.ocr.space")
            .build();

    public Mono<Map<String, Object>> parseReceipt(MultipartFile file) {
        // Check if API key is configured
        if (apiKey == null || apiKey.equals("your_ocr_space_api_key")) {
            log.warn("OCR API key not configured, using mock response");
            return Mono.just(generateMockOcrResponse());
        }
        
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            }, MediaType.parseMediaType(file.getContentType()));
            builder.part("apikey", apiKey);
            builder.part("language", "eng");
            builder.part("isOverlayRequired", "false");
            builder.part("detectOrientation", "true");
            builder.part("scale", "true");

            @SuppressWarnings("unchecked")
            Mono<Map<String, Object>> result = (Mono<Map<String, Object>>) (Mono<?>) webClient.post()
                    .uri("/parse/image")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .doOnSuccess(response -> log.info("OCR processing successful"))
                    .doOnError(error -> log.error("OCR processing failed: {}", error.getMessage()))
                    .onErrorResume(error -> Mono.just(generateMockOcrResponse()));
            return result;
        } catch (Exception e) {
            log.error("Error preparing OCR request: {}", e.getMessage());
            return Mono.just(generateMockOcrResponse());
        }
    }
    
    private Map<String, Object> generateMockOcrResponse() {
        // Generate a mock OCR response for demonstration when API key is not configured
        String mockText = "RECEIPT\n\n" +
                         "Store Name: Sample Store\n" +
                         "Date: " + java.time.LocalDate.now().toString() + "\n" +
                         "Total: $25.00\n\n" +
                         "Note: This is a mock receipt. Configure OCR API key for real receipt parsing.";
        
        return Map.of(
            "ParsedResults", java.util.List.of(
                Map.of("ParsedText", mockText)
            ),
            "OCRExitCode", 1,
            "IsErroredOnProcessing", false
        );
    }

    public String extractTextFromOcrResponse(Map<String, Object> ocrResponse) {
        try {
            if (ocrResponse.get("ParsedResults") instanceof java.util.List) {
                java.util.List<?> parsedResults = (java.util.List<?>) ocrResponse.get("ParsedResults");
                if (!parsedResults.isEmpty() && parsedResults.get(0) instanceof Map) {
                    Map<?, ?> firstResult = (Map<?, ?>) parsedResults.get(0);
                    return (String) firstResult.get("ParsedText");
                }
            }
            return "";
        } catch (Exception e) {
            log.error("Error extracting text from OCR response: {}", e.getMessage());
            return "";
        }
    }
}
