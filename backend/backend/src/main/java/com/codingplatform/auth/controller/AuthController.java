package com.codingplatform.auth.controller;

import com.codingplatform.auth.dto.LoginRequest;
import com.codingplatform.auth.dto.LoginResponse;
import com.codingplatform.auth.dto.RegisterRequest;
import com.codingplatform.auth.dto.RegisterResponse;
import com.codingplatform.auth.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
