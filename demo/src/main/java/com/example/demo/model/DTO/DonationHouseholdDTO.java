package com.example.demo.model.DTO;
public class DonationHouseholdDTO {
    private Long id; // Unique identifier for the record
    private String apartmentNumber; // Apartment number
    private String donation_id; // The donation this household contributed to
    private long donatedMoney = 0; // The amount of money donated (default is 0)


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
    public long getDonatedMoney() {
        return donatedMoney;
    }

    public void setDonatedMoney(long donatedMoney) {
        this.donatedMoney = donatedMoney;
    }
    public String getDonation_id() {
        return donation_id;
    }
    public void setDonation_id(String donation_id) {
        this.donation_id = donation_id;
    }
}