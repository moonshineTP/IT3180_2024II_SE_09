package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a notification for user interactions.
 * This entity is used to store information about user interactions such as likes and comments.
 */

@Entity
@Table(name = "response_notifications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"notification_id", "user_email"})
})
public class responseNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the response

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private Account account; // Reference to the Account entity (email of the user)

    @Column(name = "response_content", columnDefinition = "TEXT", nullable = false)
    private String responseContent; // Content of the response

    @Column(name = "response_time", nullable = false)
    private LocalDateTime responseTime; // Time of the response

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification; // Reference to the Notification entity

    // Default constructor

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
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

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }
}
