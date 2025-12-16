package com.santiago_rachen.lunaria_backend_springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.server.url:http://localhost:9090}")
    private String serverUrl;

    public String getServerUrl() {
        return serverUrl;
    }
}