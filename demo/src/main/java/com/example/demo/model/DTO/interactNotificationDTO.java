package com.example.demo.model.DTO;
import java.time.LocalDateTime;

public class interactNotificationDTO {

    private Long id; // Unique identifier for the interaction
    private String typeInteract; // Type of interaction (e.g., "like", "comment")
    private String userRole; // Reference to the Account entity (email of the interacting user)
    private String userName; // Name of the user
    private String notificationId; // Reference to the Notification entity
    private LocalDateTime responseTime; // Time of the interaction


    // Default constructor

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeInteract() {
        return typeInteract;
    }

    public void setTypeInteract(String typeInteract) {
        this.typeInteract = typeInteract;
    }
    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
    public String getNotificationId() {
        return notificationId;
    }
    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }

    public LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
