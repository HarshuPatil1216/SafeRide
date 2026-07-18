package com.saferide.controller;

import com.saferide.dto.RegisterRequest;
import com.saferide.dto.UserResponse;
import com.saferide.entity.User;
import com.saferide.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {

        User createdUser = authService.registerUser(request);

        UserResponse response = new UserResponse(
                createdUser.getId(),
                createdUser.getFullName(),
                createdUser.getEmail(),
                createdUser.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}