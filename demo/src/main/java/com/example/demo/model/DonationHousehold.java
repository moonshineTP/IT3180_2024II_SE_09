package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donation_households")
public class DonationHousehold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the record

    @Column(name = "apartment_number", nullable = false)
    private String apartmentNumber; // Apartment number

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation; // The donation this household contributed to

    @Column(name = "donated_money", nullable = false)
    private Double donatedMoney = 0.0; // The amount of money donated (default is 0)
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationHousehold> donations = new ArrayList<>();


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApartmentNumber() {
        return apartmentNumber;
    }

    public void setApartmentNumber(String apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public Double getDonatedMoney() {
        return donatedMoney;
    }

    public void setDonatedMoney(Double donatedMoney) {
        this.donatedMoney = donatedMoney;
    }
}
