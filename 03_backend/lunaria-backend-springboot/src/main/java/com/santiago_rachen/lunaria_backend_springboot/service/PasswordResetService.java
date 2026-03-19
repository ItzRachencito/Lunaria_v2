package com.santiago_rachen.lunaria_backend_springboot.service;

import com.santiago_rachen.lunaria_backend_springboot.entity.PasswordResetOtp;
import com.santiago_rachen.lunaria_backend_springboot.entity.UserEntity;
import com.santiago_rachen.lunaria_backend_springboot.repository.PasswordResetOtpRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class PasswordResetService {
    
    @Autowired
    private PasswordResetOtpRepository otpRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${otp.expiration.minutes:10}")
    private int otpExpirationMinutes;
    
    private final Random random = new Random();
    
    /**
     * Generate a 6-digit OTP
     */
    public String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }
    
    /**
     * Request password reset - generates OTP and sends email
     */
    @Transactional
    public PasswordResetResult requestPasswordReset(String email) {
        // Check if user exists
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Return success anyway to prevent email enumeration
            return new PasswordResetResult(true, "Si el correo existe, recibirás un código OTP");
        }
        
        // Invalidate any existing OTPs for this email
        otpRepository.markAllAsUsedForEmail(email, LocalDateTime.now());
        
        // Generate new OTP
        String otpCode = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpirationMinutes);
        
        // Save OTP to database
        PasswordResetOtp otp = new PasswordResetOtp(email, otpCode, expiresAt);
        otpRepository.save(otp);
        
        // Send email with OTP
        emailService.sendPasswordResetEmail(email, otpCode);
        
        return new PasswordResetResult(true, "Código OTP enviado al correo electrónico");
    }
    
    /**
     * Verify OTP and reset password
     */
    @Transactional
    public PasswordResetResult verifyAndResetPassword(String email, String otpCode, String newPassword) {
        // Find valid OTP
        Optional<PasswordResetOtp> otpOpt = otpRepository.findByOtpCodeAndEmail(otpCode, email);
        
        if (otpOpt.isEmpty()) {
            return new PasswordResetResult(false, "Código OTP inválido");
        }
        
        PasswordResetOtp otp = otpOpt.get();
        
        // Check if OTP is valid
        if (!otp.isValid()) {
            if (otp.isExpired()) {
                return new PasswordResetResult(false, "El código OTP ha expirado. Solicita uno nuevo.");
            }
            if (otp.getUsed()) {
                return new PasswordResetResult(false, "El código OTP ya fue utilizado");
            }
            return new PasswordResetResult(false, "Código OTP inválido");
        }
        
        // Find user and update password
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new PasswordResetResult(false, "Usuario no encontrado");
        }
        
        UserEntity user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark OTP as used
        otp.setUsed(true);
        otp.setUsedAt(LocalDateTime.now());
        otpRepository.save(otp);
        
        // Invalidate all other OTPs for this email
        otpRepository.markAllAsUsedForEmail(email, LocalDateTime.now());
        
        return new PasswordResetResult(true, "Contraseña actualizada exitosamente");
    }
    
    /**
     * Resend OTP if previous one expired
     */
    @Transactional
    public PasswordResetResult resendOtp(String email) {
        return requestPasswordReset(email);
    }
    
    /**
     * Result class for password reset operations
     */
    public static class PasswordResetResult {
        private final boolean success;
        private final String message;
        
        public PasswordResetResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
    }
}
