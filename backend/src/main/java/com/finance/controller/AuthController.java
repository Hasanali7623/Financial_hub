package com.finance.controller;

import com.finance.dto.request.ChangePasswordRequest;
import com.finance.dto.request.LoginRequest;
import com.finance.dto.request.RefreshTokenRequest;
import com.finance.dto.request.RegisterRequest;
import com.finance.dto.response.ApiResponse;
import com.finance.dto.response.AuthResponse;
import com.finance.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change user password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        authService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete user account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        authService.deleteAccount(email);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}
