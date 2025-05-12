package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a notification for user interactions.
 * This entity is used to store information about user interactions such as likes and comments.
 */

@Entity
@Table(name = "interact_notifications")
public class interactNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the interaction

    @Column(name = "type_interact", nullable = false)
    private String typeInteract; // Type of interaction (e.g., "like", "comment")

    @ManyToOne
    @JoinColumn(name = "email_of_interact_user", referencedColumnName = "email", nullable = false)
    private Account account; // Reference to the Account entity (email of the interacting user)

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification; // Reference to the Notification entity

    @Column(name = "response_time", nullable = false)
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

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }
}
