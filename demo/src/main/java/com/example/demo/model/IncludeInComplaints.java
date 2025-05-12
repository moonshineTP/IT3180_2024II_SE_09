package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "include_in_complaints", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"resident_id", "complaint_id"})
})
public class IncludeInComplaints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the record

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident; // Reference to the Resident entity

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

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public Complaints getComplaint() {
        return complaint;
    }

    public void setComplaint(Complaints complaint) {
        this.complaint = complaint;
    }
}
