package com.saferide.serviceimpl;

import com.saferide.dto.LoginRequest;
import com.saferide.dto.LoginResponse;
import com.saferide.dto.RegisterRequest;
import com.saferide.entity.User;
import com.saferide.exception.EmailAlreadyExistsException;
import com.saferide.repository.UserRepository;
import com.saferide.security.JwtService;
import com.saferide.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ==============================
    // REGISTER USER
    // ==============================
    @Override
    public User registerUser(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }

        // Create new user
        User user = new User();

        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());

        // Encode password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        // Save user to database
        return userRepository.save(user);
    }

    // ==============================
    // LOGIN USER
    // ==============================
    @Override
    public LoginResponse loginUser(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Verify password
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Generate JWT token
        String token = jwtService.generateToken(
                user.getEmail()
        );

        // Return user details + JWT
        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                token,
                "Login Successful"
        );
    }
}