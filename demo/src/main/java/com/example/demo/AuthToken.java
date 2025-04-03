package com.example.demo;

import jakarta.persistence.*;
import java.util.Date;

@MappedSuperclass // Không phải Entity, chỉ là template
public abstract class AuthToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    private String email;
    private String hashedNewPassword;
    private Date expiryDate;

    // Getter và Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getHashedNewPassword() { return hashedNewPassword; }
    public void setHashedNewPassword(String hashedNewPassword) { this.hashedNewPassword = hashedNewPassword; }
    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
}