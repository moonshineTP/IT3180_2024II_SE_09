package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Account;
import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.RegisterToken;
import com.example.demo.model.Resident;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.RegisterTokenRepository;
import com.example.demo.repository.ResidentRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.List;

import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletResponse;


@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private static final String PASSWORD_RESET = "PasswordReset";
    private static final String REGISTER = "Register";
    private static final int TOKEN_EXPIRY_MINUTES = 30;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository PtokenRepository;
    private final RegisterTokenRepository RtokenRepository;
    private final JavaMailSender mailSender;
    private final ResidentRepository residentRepository;

    public AuthService(PasswordEncoder passwordEncoder,
                       PasswordResetTokenRepository PtokenRepository, RegisterTokenRepository RtokenRepository,
                       JavaMailSender mailSender,ResidentRepository residentRepository) {
        this.passwordEncoder = passwordEncoder;
        this.PtokenRepository = PtokenRepository;
        this.RtokenRepository = RtokenRepository;
        this.mailSender = mailSender;
        this.residentRepository = residentRepository;
    }
    public boolean validateUsername(String username, Map<String, String> response) {
        if (username == null || username.isEmpty()) {
            response.put("usernameStatus", "Username không được để trống!");
            return false;
        }
    
        String usernameRegex = "^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
        if (!Pattern.matches(usernameRegex, username)) {
            response.put("usernameStatus", "Username có cú pháp không hợp lệ! Từ 5-20 ký tự, chỉ gồm chữ, số, dấu . hoặc _, không bắt đầu/kết thúc bằng . hoặc _ và không có 2 ký tự đặc biệt liên tiếp.");
            return false;
        }
    
        response.put("usernameStatus", "Successful!");
        return true;
    }
    public boolean validateEmail(String email, Map<String, String> response) {
        if (email == null || email.isEmpty()) {
            response.put("emailStatus", "Email không được để trống!");
            return false;
        }
    
        if (email.contains(" ")) {
            response.put("emailStatus", "Email không được chứa khoảng trắng!");
            return false;
        }
    
        if (!email.contains("@")) {
            response.put("emailStatus", "Email phải chứa ký tự '@'!");
            return false;
        }
    
        if (!email.contains(".")) {
            response.put("emailStatus", "Email phải chứa dấu chấm '.' sau phần tên miền!");
            return false;
        }
    
        // Regex tổng quát (cơ bản)
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (!Pattern.matches(emailRegex, email)) {
            response.put("emailStatus", "Email không đúng định dạng chuẩn (ví dụ: ten@example.com)!");
            return false;
        }
    
        response.put("emailStatus", "Successful!");
        return true;
    }    
    public boolean validatePassword(String password, Map<String, String> response) {
        if (password == null || password.isEmpty()) {
            response.put("passwordStatus", "Mật khẩu không được để trống!");
            return false;
        }
    
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$";
        if (!Pattern.matches(passwordRegex, password)) {
            response.put("passwordStatus", "Mật khẩu không hợp lệ! Từ 8-20 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
            return false;
        }
    
        response.put("passwordStatus", "Successful!");
        return true;
    }        
    public void addJwtToCookie(String token, HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from("jwt", token)
        .httpOnly(true)
        .secure(false)          // false nếu chạy HTTP (localhost)      // QUAN TRỌNG cho cross-origin (localhost:5173 ↔ 8080)
        .path("/")
        .maxAge(60 * 60 * 24) // Thời gian sống của cookie (1 ngày)
        .build();

    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
}
    @Transactional
    public void createToken(String email, String newPassword, String username, String token, String type) {
        if (PASSWORD_RESET.equals(type)) {
            PtokenRepository.deleteByEmail(email);
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUsername(username);
            resetToken.setEmail(email);
            resetToken.setHashedNewPassword(passwordEncoder.encode(newPassword));
            resetToken.setExpiryDate(calculateExpiryDate());

            PtokenRepository.save(resetToken);
        } else if (REGISTER.equals(type)) {
            RtokenRepository.deleteByEmail(email);
            RegisterToken registerToken = new RegisterToken();
            registerToken.setToken(token);
            registerToken.setEmail(email);
            registerToken.setUsername(username);
            registerToken.setHashedNewPassword(passwordEncoder.encode(newPassword));
            registerToken.setExpiryDate(calculateExpiryDate());
            RtokenRepository.save(registerToken);
        }
    }

    public void sendEmail(String email, String token, String type) {
        String resetUrl = PASSWORD_RESET.equals(type)
                ? "http://localhost:5173/confirm-reset.html?token=" + token
                : "http://localhost:5173/confirm-register.html?token=" + token;

        String subject = PASSWORD_RESET.equals(type) ? "Xác nhận đổi mật khẩu" : "Xác nhận đăng ký";
        String buttonText = PASSWORD_RESET.equals(type) ? "Xác nhận đổi mật khẩu" : "Xác nhận đăng ký";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setTo(email);
            helper.setSubject(subject);

            String htmlContent = "<h3>Vui lòng click nút bên dưới để " + subject.toLowerCase() + ":</h3>" +
                    "<a href=\"" + resetUrl + "\" style=\"" +
                    "background-color: #4CAF50; border: none; color: white; " +
                    "padding: 15px 32px; text-align: center; " +
                    "text-decoration: none; display: inline-block; font-size: 16px;\">" +
                    buttonText + "</a>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Gửi email thất bại: {}", e.getMessage());
        }
    }
    public void sendEmailNoti(String Email,  String Subject, String HtmlContent){
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setTo(Email);
            helper.setSubject(HtmlContent);
            helper.setText(HtmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Gửi email thất bại: {}", e.getMessage());
        }
    }
    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, TOKEN_EXPIRY_MINUTES);
        return cal.getTime();
    }
    public List<String> getEmailsByResidentIds(List<String> residentIds) {
    // Validate input
        if (residentIds == null || residentIds.isEmpty()) {
            throw new IllegalArgumentException("Resident IDs list cannot be null or empty");
        }

        // Fetch residents by residentIds
        List<Resident> residents = residentRepository.findByResidentIdIn(residentIds);

        // Extract accounts connected to the residents
        List<Account> accounts = residents.stream()
                .map(Resident::getAccount) // Assuming Resident has a getAccount() method
                .filter(Objects::nonNull) // Exclude null accounts
                .collect(Collectors.toList());

        // Extract emails from the accounts
        List<String> emails = accounts.stream()
                .map(Account::getEmail)
                .collect(Collectors.toList());
        System.out.println(emails);

        return emails;
    }
    @Transactional
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupExpiredTokens() {
        PtokenRepository.deleteAllByExpiryDateBefore(new Date());
        RtokenRepository.deleteAllByExpiryDateBefore(new Date());
    }
}