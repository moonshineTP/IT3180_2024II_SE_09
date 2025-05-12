package com.example.demo.model.DTO;

import java.time.LocalDateTime;

public class AccountDTO {
    private Long id;
    private String username;
    private String email; // Optional, based on role
    private String role;
    private String status;
    private String ban;
    private LocalDateTime createdDate;
    private LocalDateTime lastVisit;
    private String resident_id; // Include resident_id if the account is linked to a resident

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getLastVisit() {
        return lastVisit;
    }

    public void setLastVisit(LocalDateTime lastVisit) {
        this.lastVisit = lastVisit;
    }

    public String getResident_id() {
        return resident_id;
    }

    public void setResident_id(String residentId) {
        this.resident_id = residentId;
    }
}