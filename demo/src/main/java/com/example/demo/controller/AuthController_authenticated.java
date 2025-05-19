package com.example.demo.controller;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.demo.model.Account;
import com.example.demo.repository.AccountRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping
public class AuthController_authenticated {
    private final AccountRepository userRepository;

    public AuthController_authenticated(AccountRepository userRepository) {
        this.userRepository = userRepository;
    }
    // Các phương thức đã được xác thực sẽ được thêm vào đây
    // Ví dụ: @GetMapping("/profile") public ResponseEntity<Account> getProfile() { ... }
    // Hoặc các phương thức khác mà bạn muốn bảo vệ bằng JWT
    // Các phương thức này sẽ được gọi sau khi xác thực thành công
    @GetMapping("/checkin")
    public ResponseEntity<?> handlecheckin(HttpServletResponse httpResponse) { // Bạn có thể inject Authentication trực tiếp
        return ResponseEntity.ok("checkin thành công");
    }
    @PostMapping("/logouts")
    public ResponseEntity<?> handleLogout(HttpServletResponse httpResponse, Authentication authentication) {
        // Xóa cookie jwt
        System.out.println("Đã đăng xuất");
        String currentEmail = authentication.getName();
        Account account = userRepository.findByEmail(currentEmail);
        userRepository.save(account);
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Đặt thời gian sống của cookie về 0 để xóa nó
        httpResponse.addCookie(cookie);
        return ResponseEntity.ok("Đăng xuất thành công");
    }
    @PostMapping("/ping")
    public ResponseEntity<Void> ping(Authentication auth) {
        String email = auth.getName();
        Account account = userRepository.findByEmail(email);
        if (account != null) {
            account.setStatus("Online");
            account.setLastVisit(Instant.now());
            userRepository.save(account);
        }
        return ResponseEntity.ok().build();
    }
}
