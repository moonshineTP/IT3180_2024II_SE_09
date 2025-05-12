package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class AuthController_authenticated {
    // Các phương thức đã được xác thực sẽ được thêm vào đây
    // Ví dụ: @GetMapping("/profile") public ResponseEntity<Account> getProfile() { ... }
    // Hoặc các phương thức khác mà bạn muốn bảo vệ bằng JWT
    // Các phương thức này sẽ được gọi sau khi xác thực thành công
    @PostMapping("/logout")
    public ResponseEntity<?> handleLogout(HttpServletResponse httpResponse) {
        // Xóa cookie jwt
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Đặt thời gian sống của cookie về 0 để xóa nó
        httpResponse.addCookie(cookie);

        return ResponseEntity.ok("Đăng xuất thành công");
    }
    @PostMapping("/checkin")
    public ResponseEntity<?> handlecheckin(HttpServletResponse httpResponse) {
        return ResponseEntity.ok("checkin thành công");
    }
    
}
