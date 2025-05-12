package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "receive_notifications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"resident_id", "notification_id"})
})
public class receiveNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the record

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident; // Reference to the Resident entity

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification; // Reference to the Notification entity

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }
}