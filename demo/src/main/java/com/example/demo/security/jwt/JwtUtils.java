package com.example.demo.security.jwt;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {
	private final SecretKey SECRET_KEY = Jwts.SIG.HS512.key().build(); // Tạo key an toàn

    // Tạo token
    public String generateToken(String email, long expirationTime) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SECRET_KEY, Jwts.SIG.HS512) // Sử dụng enum Jwts.SIG
                .compact();
    }

    // Lấy username từ token
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Kiểm tra token hợp lệ
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}