package com.example.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Account;
import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.RegisterToken;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.RegisterTokenRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Date;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;
	private final AccountRepository userRepository;
	private final PasswordResetTokenRepository PtokenRepository;
	private final RegisterTokenRepository RtokenRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    public AuthController (AuthService authService,AccountRepository userRepository,PasswordResetTokenRepository PtokenRepository,RegisterTokenRepository RtokenRepository,JwtUtils jwtUtils,PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository=userRepository;
        this.PtokenRepository=PtokenRepository;
        this.RtokenRepository=RtokenRepository;
        this.jwtUtils=jwtUtils;
        this.passwordEncoder=passwordEncoder;
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> handleLogin(@RequestBody Request request, HttpServletResponse httpResponse) {
        Map<String, String> response = new HashMap<>();

        boolean ValidEmail = authService.validateEmail(request.getEmail(), response);
        boolean ValidPassword = authService.validatePassword(request.getPassword(), response);
        if (!ValidEmail||!ValidPassword) {
            return ResponseEntity.ok(response);
        }

        // Tìm account và kiểm tra mật khẩu
        Account account = userRepository.findByEmail(request.getEmail());
        if (account == null) {
            response.put("emailStatus", "Không tìm thấy tài khoản với email này!");
            response.put("passwordStatus", "Successful!");
            return ResponseEntity.ok(response);
        }

        response.put("emailStatus", "Successful!");
        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            response.put("passwordStatus", "Mật khẩu không trùng khớp!");
            return ResponseEntity.ok(response);
        }
        if(account.getBan().equals("Inactive")) {
            response.put("passwordStatus", "Tài khoản đã bị ban!");
            response.put("emailStatus", "Tài khoản đã bị ban!");
            return ResponseEntity.ok(response);
        }
        // Tạo JWT và thêm vào cookie
        String token = jwtUtils.generateToken(account.getEmail(),60*60*24*1000L);
        System.out.println("Token được tạo: " + token);
        String setCookieHeader = httpResponse.getHeader("Set-Cookie");
        System.out.println("Set-Cookie header before addCookie: " + setCookieHeader);
        authService.addJwtToCookie(token, httpResponse); // Thêm cookie vào response
        setCookieHeader = httpResponse.getHeader("Set-Cookie");
        System.out.println("Set-Cookie header after addCookie: " + setCookieHeader);

        response.put("passwordStatus", "Successful!");
        return ResponseEntity.ok(response);
    }
    @PostMapping("/request-register")
    public ResponseEntity<Map<String, String>> requestRegister(@RequestBody Request request) {
        String username = request.getUsername();
    	String email = request.getEmail();
        String password = request.getPassword();
        Map<String, String> response = new HashMap<>();
        boolean ValidEmail = authService.validateEmail(email, response);
        boolean ValidPassword = authService.validatePassword(password, response);
        boolean ValidUsername = authService.validateUsername(username, response);
        if(!ValidEmail||!ValidUsername||!ValidPassword) return ResponseEntity.ok(response);
        if (userRepository.findByEmail(email)!=null) {
            response.put("emailStatus", "Email đã tồn tại");
            return ResponseEntity.ok(response);
        }
        if (userRepository.findByUsername(username)!=null) {
            response.put("usernameStatus", "Username đã tồn tại");
            return ResponseEntity.ok(response);
        }
        // Tạo và lưu token
        String token = UUID.randomUUID().toString();
        authService.createToken(email, password,username, token, "Register");
        
        // Gửi email
        authService.sendEmail(email, token, "Register");
        
        return ResponseEntity.ok(response); // Trả về status 200 không content
    }
    @Transactional
    @PostMapping("/confirm-register")
    public ResponseEntity<?> confirmRegister(@RequestBody Token tokeN) {
    	String token=tokeN.getToken();
        RegisterToken resetToken = RtokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }
        if (resetToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token đã hết hạn");
        }
        Account user = new Account();
        user.setPassword(resetToken.getHashedNewPassword());
        user.setEmail(resetToken.getEmail());
        user.setUsername(resetToken.getUsername());
        userRepository.save(user);
        RtokenRepository.delete(resetToken);
        return ResponseEntity.ok("Đăng kí thành công");
    }
    @PostMapping("/request-reset")
    public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestBody Request request) {
    	String email = request.getEmail();
        String password = request.getPassword();
        Map<String, String> response = new HashMap<>();
        boolean ValidEmail = authService.validateEmail(email, response);
        boolean ValidPassword = authService.validatePassword(password, response);   
        if(!ValidEmail||!ValidPassword) return ResponseEntity.ok(response);
        if (userRepository.findByEmail(email)==null) {
            response.put("emailStatus", "Email không tồn tại");
            return ResponseEntity.ok(response);
        }
        // Tạo và lưu token
        String token = UUID.randomUUID().toString();
        authService.createToken(email, password,"",token, "PasswordReset");
        // Gửi email
        authService.sendEmail(email, token, "PasswordReset");
        
        return ResponseEntity.ok(response); // Trả về status 200 không content
    }
    @Transactional
    @PostMapping("/confirm-reset")
    public ResponseEntity<?> confirmReset(@RequestBody Token tokeN) {
    	String token=tokeN.getToken();
        PasswordResetToken resetToken = PtokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }
        if (resetToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token đã hết hạn");
        }
        Account user = userRepository.findByEmail(resetToken.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("User không tồn tại! Có kẻ đã xoá nick của bạn!");
        }
        user.setPassword(resetToken.getHashedNewPassword());
        userRepository.save(user);
        PtokenRepository.delete(resetToken);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
    static class Request {
        private String username;
        private String email;
        private String password;
        // Getter & Setter
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    static class Token {
        private String Token;
        // Getter & Setter
        public String getToken() { return Token; }
        public void setToken(String Token) { this.Token = Token; }
    }
}