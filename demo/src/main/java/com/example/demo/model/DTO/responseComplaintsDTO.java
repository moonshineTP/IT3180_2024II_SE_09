package com.example.demo.model.DTO;

import java.time.LocalDateTime;
public class responseComplaintsDTO {

    private Long id; // Unique identifier for the response

    private String userRole;
    private String userName; // Name of the user
    private String responseContent; // Content of the response
    private LocalDateTime responseTime; // Time of the response
    private String complaintId; // Reference to the Complaint entity

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
    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getComplaintId() {
        return complaintId;
    }
    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }
}

