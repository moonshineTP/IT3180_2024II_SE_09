package com.example.demo.model.DTO;

import java.time.LocalDateTime;



public class ComplaintsDTO {
    
    private String complaintId;

    private String residentId;

    private String residentName;

    private String apartmentNumber;

    private byte[] avt;

    private String title;

    private String description;

    private LocalDateTime submittedAt;

    private String status; // e.g., "Pending", "In Progress", "Resolved", "Rejected"

    private LocalDateTime processedAt;

    private String staffId; // người xử lý khiếu nại

    private String priority; // "Low", "Medium", "High", "not_urgent"

    // Getters and Setters

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getResidentId() {
        return residentId;
    }

    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
    public String getResidentName() {
        return residentName;
    }
    public void setResidentName(String residentName) {
        this.residentName = residentName;
    }
    public String getApartmentNumber() {
        return apartmentNumber;
    }
    public void setApartmentNumber(String apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }
    public byte[] getAvt() {
        return avt;
    }
    public void setAvt(byte[] avt) {
        this.avt = avt;
    }
}
