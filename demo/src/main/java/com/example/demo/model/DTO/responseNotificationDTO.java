package com.example.demo.model.DTO;

import java.time.LocalDateTime;
public class responseNotificationDTO {
    private Long id; // Unique identifier for the response
    private String accountId; // Reference to the Account entity (email of the user)
    private String responseContent; // Content of the response
    private LocalDateTime responseTime; // Time of the response
    private String notificationId; // Reference to the Notification entity

    // Default constructor

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResponseContent() {
        return responseContent;
    }

    public void setResponseContent(String responseContent) {
        this.responseContent = responseContent;
    }

    public LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }

    public String getAccountId() {
        return accountId;
    }
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
    public String getNotificationId() {
        return notificationId;
    }
    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }
}