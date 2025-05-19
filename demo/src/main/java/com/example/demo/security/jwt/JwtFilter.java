package com.example.demo.security.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    // Danh sách các public endpoints không cần JWT
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
        "/api/auth/"
    );

    public JwtFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = extractToken(request);
            if (token == null) {
                System.out.println("📌 Token được gửi lên: ");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing token");
                return;
            }

            if (jwtUtils.validateToken(token)) {
                String email = jwtUtils.getEmailFromToken(token);
                 // Load user details and set authentication
                UserDetails userDetails;
                try {
                    userDetails = userDetailsService.loadUserByUsername(email);
                } catch (UsernameNotFoundException ex) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Account removed");
                    System.out.println("Account removed");
                    return;
                }
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                System.out.println("Token không hợp lệ");
                return;
            }
        } catch (JwtException | IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token error: " + e.getMessage());
            System.out.println("Token error: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    // Sửa thành vòng lặp for để tránh lỗi
    private boolean isPublicEndpoint(String requestURI) {
        for (String endpoint : PUBLIC_ENDPOINTS) {
            if (requestURI.startsWith(endpoint)) {
                return true;
            }
        }
        return false;
    }

    private String extractToken(HttpServletRequest request) {
        // If no token in the header, check cookies
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                //System.out.print("Cookie jwt được gửi lên: " + cookie.getName());
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
    
        // Return null if no token is found
        return null;
    }
}