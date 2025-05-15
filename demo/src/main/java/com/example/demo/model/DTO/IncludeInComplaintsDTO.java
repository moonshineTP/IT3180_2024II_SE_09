package com.example.demo.model.DTO;

public class IncludeInComplaintsDTO {
    private Long id; // Unique identifier for the record
    private String residentId; // Reference to the Resident entity
    private String complaintId; // Reference to the Complaint entity

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
    public String getComplaintId() {
        return complaintId;
    }
    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }
}
