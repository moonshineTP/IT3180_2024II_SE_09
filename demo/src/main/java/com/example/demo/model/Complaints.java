package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;



@Entity
@Table(name = "complaints")
public class Complaints {
    
    @Id
    private String complaintId;

    @ManyToOne(optional = true)
    @JoinColumn(name = "resident_id", referencedColumnName = "resident_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Resident resident;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime submittedAt;

    private String status; // e.g., "Pending", "In Progress", "Resolved", "Rejected"

    private LocalDateTime processedAt;

    private String staffId; // người xử lý khiếu nại

    private String priority; // "Low", "Medium", "High", "not_urgent"
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    List<IncludeInComplaints> includeInComplaints = new ArrayList<>();
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    List<responseComplaints> responseComplaints = new ArrayList<>();
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    List<interactComplaint> interactComplaints = new ArrayList<>();


    // Getters and Setters

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }
    public Resident getResident() {
        return resident;
    }
    public void setResident(Resident resident) {
        this.resident = resident;
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
    public List<IncludeInComplaints> getIncludeInComplaints() {
        return includeInComplaints;
    }
    public void setIncludeInComplaints(List<IncludeInComplaints> includeInComplaints) {
        this.includeInComplaints = includeInComplaints;
    }
    public List<responseComplaints> getResponseComplaints() {
        return responseComplaints;
    }
    public void setResponseComplaints(List<responseComplaints> responseComplaints) {
        this.responseComplaints = responseComplaints;
    }
    public List<interactComplaint> getInteractComplaints() {
        return interactComplaints;
    }
    public void setInteractComplaints(List<interactComplaint> interactComplaints) {
        this.interactComplaints = interactComplaints;
    }
}
