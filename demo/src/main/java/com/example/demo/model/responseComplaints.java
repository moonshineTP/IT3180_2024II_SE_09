package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a response to a complaint.
 * This entity is used to store information about responses to complaints.
 */

@Entity
@Table(name = "response_complaints", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"complaint_id", "user_email"})
})
public class responseComplaints {

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
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaints complaint; // Reference to the Complaint entity

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

    public Complaints getComplaint() {
        return complaint;
    }

    public void setComplaint(Complaints complaint) {
        this.complaint = complaint;
    }
}
