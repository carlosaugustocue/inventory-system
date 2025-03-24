package com.inventory.system.controller;

import com.inventory.system.dto.AuthDTOs.MessageResponse;
import com.inventory.system.model.User;
import com.inventory.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> accessAdminDashboard() {
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Admin Dashboard accessed successfully.")
                .build());
    }

    @PutMapping("/users/{username}/unlock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> unlockUserAccount(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        user.setAccountNonLocked(true);
        userRepository.save(user);

        return ResponseEntity.ok(MessageResponse.builder()
                .message("User account unlocked successfully.")
                .build());
    }
}