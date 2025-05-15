package com.example.demo.model.DTO;

import jakarta.persistence.*;
public class receiveNotificationDTO {
    private Long id; // Unique identifier for the record
    private String residentId; // Reference to the Resident entity
    private String notificationId; // Reference to the Notification entity

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResidentId() {
        return residentId;
    }
    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }
    public String getNotificationId() {
        return notificationId;
    }
    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }
}
