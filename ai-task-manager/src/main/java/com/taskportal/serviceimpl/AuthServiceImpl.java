package com.taskportal.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskportal.dto.LoginRequest;
import com.taskportal.util.JwtUtil;

import com.taskportal.dto.AuthResponse;
import com.taskportal.dto.RegisterRequest;
import com.taskportal.entity.User;
import com.taskportal.repository.UserRepository;
import com.taskportal.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    @Override
   
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return new AuthResponse(
                null,
                "User Registered Successfully",
                user.getName());
    }
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid Credentials"));

        boolean matched =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        if (!matched) {

            throw new RuntimeException(
                    "Invalid Credentials");
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail());

        return new AuthResponse(
                token,
                "Login Successful",
                user.getName());
    }
}