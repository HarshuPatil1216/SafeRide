package com.saferide.service;

import com.saferide.dto.RegisterRequest;
import com.saferide.entity.User;

public interface AuthService {

    User registerUser(RegisterRequest request);
}