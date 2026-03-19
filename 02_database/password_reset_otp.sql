-- Table to store password reset OTPs
-- This table stores one-time passwords for password recovery

CREATE TABLE IF NOT EXISTS password_reset_otp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    INDEX idx_email (email),
    INDEX idx_otp_code (otp_code),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cleanup: Remove expired OTPs older than 24 hours (can be run as a scheduled task)
-- DELETE FROM password_reset_otp WHERE expires_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
