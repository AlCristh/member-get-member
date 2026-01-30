package com.alejandro.membergetmember.api.controller;

import com.alejandro.membergetmember.api.dto.auth.AuthResponse;
import com.alejandro.membergetmember.api.dto.auth.LoginRequest;
import com.alejandro.membergetmember.api.dto.auth.RegisterRequest;
import com.alejandro.membergetmember.service.AuthService;
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
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
