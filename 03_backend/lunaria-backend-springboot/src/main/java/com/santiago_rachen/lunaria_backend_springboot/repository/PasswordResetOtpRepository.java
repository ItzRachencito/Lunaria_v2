package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    
    Optional<PasswordResetOtp> findByEmailAndUsedFalse(String email);
    
    Optional<PasswordResetOtp> findByOtpCodeAndEmail(String otpCode, String email);
    
    List<PasswordResetOtp> findByEmail(String email);
    
    @Modifying
    @Query("DELETE FROM PasswordResetOtp p WHERE p.expiresAt < :now OR p.used = true")
    int deleteExpiredOrUsed(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE PasswordResetOtp p SET p.used = true, p.usedAt = :usedAt WHERE p.email = :email AND p.used = false")
    int markAllAsUsedForEmail(@Param("email") String email, @Param("usedAt") LocalDateTime usedAt);
}
