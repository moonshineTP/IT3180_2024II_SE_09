package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    private String Id; // Unique identifier for the donation

    @Column(name = "donation_name", nullable = false)
    private String donationName; // Name of the donation

    @Column(name = "founder", nullable = false)
    private String founder; // Founder of the donation

    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // Content/description of the donation

    @Column(name = "accumulated_money", nullable = false)
    private Double accumulatedMoney = 0.0; // Total accumulated money (default is 0)

    @Column(name = "status", nullable = false)
    private String status = "open"; // Status of the donation (open/closed)

    // Getters and Setters
    public String getId() {
        return Id;
    }

    public void setId(String id) {
        this.Id = id;
    }

    public String getDonationName() {
        return donationName;
    }

    public void setDonationName(String donationName) {
        this.donationName = donationName;
    }

    public String getFounder() {
        return founder;
    }

    public void setFounder(String founder) {
        this.founder = founder;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Double getAccumulatedMoney() {
        return accumulatedMoney;
    }

    public void setAccumulatedMoney(Double accumulatedMoney) {
        this.accumulatedMoney = accumulatedMoney;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}