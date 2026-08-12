package com.taskportal.service;

import com.taskportal.dto.AuthResponse;
import com.taskportal.dto.LoginRequest;
import com.taskportal.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}