package com.santiago_rachen.lunaria_backend_springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private String brevoApiKey;
    private String fromEmail;
    private String fromName;
    private String frontendUrl;
    
    @Autowired
    public EmailService(
            @Value("${brevo.api.key:}") String brevoApiKey,
            @Value("${brevo.from.email:}") String fromEmail,
            @Value("${brevo.from.name:Lunaria}") String fromName,
            @Value("${app.frontend.url:}") String frontendUrl) {
        this.brevoApiKey = brevoApiKey;
        // Fallback to default Brevo sender if not configured
        this.fromEmail = (fromEmail != null && !fromEmail.isEmpty()) ? fromEmail : "contact@lunaria.app";
        this.fromName = fromName;
        this.frontendUrl = frontendUrl;
    }
    
    /**
     * Send password reset OTP email using Brevo API
     * Falls back to console logging if API key is not configured
     */
    public void sendPasswordResetEmail(String email, String otpCode) {
        String subject = "🔐 Código de recuperación de contraseña - Lunaria";
        
        String htmlContent = buildPasswordResetHtml(email, otpCode);
        String textContent = buildPasswordResetText(email, otpCode);
        
        if (brevoApiKey != null && !brevoApiKey.isEmpty()) {
            sendEmailWithBrevo(email, subject, htmlContent, textContent, otpCode);
        } else {
            // Fallback to console for development
            System.out.println("===========================================");
            System.out.println("📧 EMAIL DE RECUPERACIÓN (DESARROLLO)");
            System.out.println("===========================================");
            System.out.println("Para: " + email);
            System.out.println("Asunto: " + subject);
            System.out.println("Código OTP: " + otpCode);
            System.out.println("===========================================");
        }
    }
    
    /**
     * Send email using Brevo API v3
     */
    private void sendEmailWithBrevo(String email, String subject, String htmlContent, String textContent, String otpCode) {
        try {
            // Using Brevo's REST API directly with HTTP client
            String url = "https://api.brevo.com/v3/smtp/email";
            
            // Debug logging
            System.out.println("=== DEBUG BREVO ===");
            System.out.println("API Key configured: " + (brevoApiKey != null && !brevoApiKey.isEmpty()));
            System.out.println("From Email: " + fromEmail);
            System.out.println("From Name: " + fromName);
            System.out.println("===================");
            
            // Create JSON payload
            String jsonPayload = String.format(
                "{\"sender\":{\"name\":\"%s\",\"email\":\"%s\"},\"to\":[{\"email\":\"%s\"}],\"subject\":\"%s\",\"htmlContent\":\"%s\",\"textContent\":\"%s\"}",
                escapeJson(fromName),
                escapeJson(fromEmail),
                escapeJson(email),
                escapeJson(subject),
                escapeJson(htmlContent),
                escapeJson(textContent)
            );
            
            // Create HTTP client and send request
            java.net.URL urlObj = new java.net.URL(url);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) urlObj.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("api-key", brevoApiKey);
            conn.setDoOutput(true);
            
            try (java.io.OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
            
            int responseCode = conn.getResponseCode();
            if (responseCode >= 200 && responseCode < 300) {
                System.out.println("✅ Email enviado exitosamente a " + email);
            } else {
                // Read error response
                StringBuilder errorResponse = new StringBuilder();
                try (java.io.BufferedReader br = new java.io.BufferedReader(
                        new java.io.InputStreamReader(conn.getErrorStream(), java.nio.charset.StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        errorResponse.append(line);
                    }
                }
                System.out.println("❌ Error al enviar email. Código: " + responseCode);
                System.out.println("Respuesta de error: " + errorResponse.toString());
                
                // Fallback to console on error
                System.out.println("===========================================");
                System.out.println("📧 EMAIL DE RECUPERACIÓN (FALLBACK)");
                System.out.println("===========================================");
                System.out.println("Para: " + email);
                System.out.println("Asunto: " + subject);
                System.out.println("Código OTP: " + otpCode);
                System.out.println("===========================================");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error al enviar email: " + e.getMessage());
            // Fallback to console
            System.out.println("📧 (Fallback) Código OTP para " + email + ": " + otpCode);
        }
    }
    
    private String buildPasswordResetHtml(String email, String otpCode) {
        String resetUrl = (frontendUrl != null && !frontendUrl.isEmpty() ? frontendUrl : "http://localhost:5173") + "/reset-password?email=" + email;
        
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "<title>Recuperar Contraseña</title>" +
            "<style>" +
            "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }" +
            ".container { max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { font-size: 32px; font-weight: bold; color: #2c3e50; }" +
            ".title { color: #34495e; font-size: 24px; margin-bottom: 20px; }" +
            ".otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }" +
            ".info { color: #7f8c8d; font-size: 14px; line-height: 1.6; }" +
            ".warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px; color: #856404; font-size: 13px; }" +
            ".footer { text-align: center; margin-top: 30px; color: #95a5a6; font-size: 12px; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='container'>" +
            "<div class='header'>" +
            "<div class='logo'>🔧 Lunaria</div>" +
            "</div>" +
            "<h1 class='title'>¿Olvidaste tu contraseña?</h1>" +
            "<p class='info'>Hola, hemos recibido una solicitud para restablecer tu contraseña en Lunaria.</p>" +
            "<p class='info'>Usa el siguiente código OTP para recuperar tu cuenta:</p>" +
            "<div class='otp-box'>" + otpCode + "</div>" +
            "<p class='info'>Este código expire en <strong>10 minutos</strong>.</p>" +
            "<div class='warning'>" +
            "⚠️ <strong>Nota de seguridad:</strong> Si no solicitaste este código, ignora este correo. Tu contraseña permanecerá segura." +
            "</div>" +
            "<div class='footer'>" +
            "<p>Este es un correo automático de Lunaria. Por favor no responder.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>";
    }
    
    private String buildPasswordResetText(String email, String otpCode) {
        return "🔧 Lunaria - Recuperación de Contraseña\n\n" +
            "Hola,\n\n" +
            "Hemos recibido una solicitud para restablecer tu contraseña.\n\n" +
            "Tu código OTP es: " + otpCode + "\n\n" +
            "Este código expira en 10 minutos.\n\n" +
            "Si no solicitaste este código, ignora este correo.\n\n" +
            "Saludos,\n" +
            "Equipo Lunaria";
    }
    
    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
