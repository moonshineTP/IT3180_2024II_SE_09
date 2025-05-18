package com.example.demo.model.DTO;

import java.time.LocalDateTime;

public class InteractComplaintDTO {
    private Long id; // Unique identifier for the interaction

    private Integer starNumberRating; // Star rating (0 to 5)

    private String userRole; // Reference to the Account entity (email of the interacting user)
    private String userName; // Name of the user

    private String complaintId; // Reference to the Complaint entity
    private LocalDateTime responseTime; // Time of the interaction

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStarNumberRating() {
        return starNumberRating;
    }

    public void setStarNumberRating(Integer starNumberRating) {
        if (starNumberRating < 0 || starNumberRating > 5) {
            throw new IllegalArgumentException("Star rating must be between 0 and 5");
        }
        this.starNumberRating = starNumberRating;
    }

    public LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }
    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
    public String getComplaintId() {
        return complaintId;
    }
    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
