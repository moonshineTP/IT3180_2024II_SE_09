package com.example.demo.model.DTO;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.example.demo.model.FeeHousehold;

@Entity
@Table(name = "household_fees")
public class FeeDTO {

    @Id
    private String Id;

    private String feeName;

    private String feeType;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String supervisor;
    // Getters & Setters

    public String getId() {
        return Id;
    }

    public void setId(String Id) {
        this.Id = Id;
    }

    public String getFeeType() {
        return feeType;
    }

    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getFeeName() {
        return feeName;
    }

    public void setFeeName(String feeName) {
        this.feeName = feeName;
    }

    public String getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(String supervisor) {
        this.supervisor = supervisor;
    }
}
