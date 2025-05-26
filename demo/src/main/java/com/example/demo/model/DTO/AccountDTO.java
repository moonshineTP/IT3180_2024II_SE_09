package com.example.demo.model.DTO;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;

public class AccountDTO {
    private String username;
    private String email; // Optional, based on role
    private String role;
    private String status;
    private String ban;
    private LocalDateTime createdDate;
    private Instant lastVisit;
    private LocalDateTime lastOffline;
    private String residentId; // Include resident_id if the account is linked to a resident

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBan() {
        return ban;
    }

    public void setBan(String ban) {
        this.ban = ban;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getLastVisit() {
        return lastVisit;
    }

    public void setLastVisit(Instant lastVisit) {
        this.lastVisit = lastVisit;
    }

    public String getResidentId() {
        return residentId;
    }

    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }
    public LocalDateTime getLastOffline() {
        return lastOffline;
    }
    public void setLastOffline(LocalDateTime lastOffline) {
        this.lastOffline = lastOffline;
    }
}