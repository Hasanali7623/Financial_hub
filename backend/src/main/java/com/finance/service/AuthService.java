package com.finance.service;

import com.finance.dto.request.ChangePasswordRequest;
import com.finance.dto.request.LoginRequest;
import com.finance.dto.request.RegisterRequest;
import com.finance.dto.response.AuthResponse;
import com.finance.dto.response.UserResponse;
import com.finance.entity.User;
import com.finance.exception.ResourceAlreadyExistsException;
import com.finance.exception.ResourceNotFoundException;
import com.finance.repository.BudgetRepository;
import com.finance.repository.SavingsGoalRepository;
import com.finance.repository.TransactionRepository;
import com.finance.repository.UserRepository;
import com.finance.security.CustomUserDetailsService;
import com.finance.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = customUserDetailsService.getUserByEmail(userDetails.getUsername());

        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration)
                .user(mapToUserResponse(user))
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtTokenProvider.extractUsername(refreshToken);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        User user = customUserDetailsService.getUserByEmail(username);

        String newAccessToken = jwtTokenProvider.generateToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration)
                .user(mapToUserResponse(user))
                .build();
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Delete all user-related data first to avoid foreign key constraint violations
        Long userId = user.getId();
        
        log.info("Deleting all data for user: {}", email);
        
        // Delete transactions
        transactionRepository.deleteByUserId(userId);
        log.info("Deleted transactions for user: {}", email);
        
        // Delete budgets
        budgetRepository.deleteByUserId(userId);
        log.info("Deleted budgets for user: {}", email);
        
        // Delete savings goals
        savingsGoalRepository.deleteByUserId(userId);
        log.info("Deleted savings goals for user: {}", email);
        
        // Finally delete the user account
        userRepository.delete(user);
        log.info("Account deleted for user: {}", email);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
