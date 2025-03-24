package com.inventory.system.controller;

import com.inventory.system.dto.AuthDTOs.JwtResponse;
import com.inventory.system.dto.AuthDTOs.LoginRequest;
import com.inventory.system.dto.AuthDTOs.MessageResponse;
import com.inventory.system.dto.AuthDTOs.SignupRequest;
import com.inventory.system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("User registered successfully!")
                .build());
    }
}