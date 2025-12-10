package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String email;
    private String token;
    private String role;
}
