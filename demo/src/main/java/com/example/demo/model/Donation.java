package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @Column(length = 100, unique = true)
    private String Id; // Unique identifier for the donation

    @Column(name = "donation_name")
    private String donationName; // Name of the donation

    @Column(name = "founder")
    private String founder; // Founder of the donation
    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // Content/description of the donation

    @Column(name = "accumulated_money")
    private long accumulatedMoney = 0; // Total accumulated money (default is 0)

    @Column(name = "status")
    private String status = "open"; // Status of the donation (open/closed)

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationHousehold> donationHouseholds = new ArrayList<>();

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

    public long getAccumulatedMoney() {
        return accumulatedMoney;
    }

    public void setAccumulatedMoney(long accumulatedMoney) {
        this.accumulatedMoney = accumulatedMoney;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public List<DonationHousehold> getDonationHouseholds() {
        return donationHouseholds;
    }
    public void setDonationHouseholds(List<DonationHousehold> donationHouseholds) {
        this.donationHouseholds = donationHouseholds;
    }
}