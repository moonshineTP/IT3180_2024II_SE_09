package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents an interaction with a complaint.
 * This entity is used to store information about interactions such as ratings or comments on complaints.
 */

@Entity
@Table(name = "interact_complaints")
public class interactComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the interaction

    @Column(name = "star_number_rating", nullable = false)
    private Integer starNumberRating; // Star rating (0 to 5)

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private Account account; // Reference to the Account entity (email of the interacting user)

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaints complaint; // Reference to the Complaint entity

    @Column(name = "response_time", nullable = false)
    private LocalDateTime responseTime; // Time of the interaction

    // Default constructor
    public interactComplaint() {}

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

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Complaints getComplaint() {
        return complaint;
    }

    public void setComplaint(Complaints complaint) {
        this.complaint = complaint;
    }

    public LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }
}