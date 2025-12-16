package com.santiago_rachen.lunaria_backend_springboot.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Lunaria API",
        version = "1.0",
        description = "API for Lunaria e-commerce platform - Complete REST API documentation for managing items, users, sales, favorites, and more."
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT token for authentication. Include 'Bearer ' prefix in the Authorization header."
)
public class OpenApiConfig {
}