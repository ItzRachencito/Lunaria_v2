package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/password-reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    /**
     * Request password reset - sends OTP to email
     * POST /api/password-reset/request
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El correo electrónico es requerido"
            ));
        }
        
        // Basic email validation
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Formato de correo electrónico inválido"
            ));
        }
        
        PasswordResetService.PasswordResetResult result = passwordResetService.requestPasswordReset(email);
        
        return ResponseEntity.ok(Map.of(
            "success", result.isSuccess(),
            "message", result.getMessage()
        ));
    }
    
    /**
     * Verify OTP and reset password
     * POST /api/password-reset/reset
     * Body: { "email": "user@example.com", "otp": "123456", "newPassword": "newpass123" }
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        
        // Validate inputs
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El correo electrónico es requerido"
            ));
        }
        
        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El código OTP es requerido"
            ));
        }
        
        if (otp.length() != 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El código OTP debe tener 6 dígitos"
            ));
        }
        
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "La nueva contraseña debe tener al menos 6 caracteres"
            ));
        }
        
        PasswordResetService.PasswordResetResult result = 
            passwordResetService.verifyAndResetPassword(email, otp, newPassword);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", result.getMessage()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", result.getMessage()
            ));
        }
    }
    
    /**
     * Resend OTP if expired
     * POST /api/password-reset/resend
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/resend")
    public ResponseEntity<Map<String, Object>> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El correo electrónico es requerido"
            ));
        }
        
        PasswordResetService.PasswordResetResult result = passwordResetService.resendOtp(email);
        
        return ResponseEntity.ok(Map.of(
            "success", result.isSuccess(),
            "message", result.getMessage()
        ));
    }
}
