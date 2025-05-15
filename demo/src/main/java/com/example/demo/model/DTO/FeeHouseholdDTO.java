package com.example.demo.model.DTO;
import java.time.LocalDate;
public class FeeHouseholdDTO {
    private Long id; // Unique identifier for the record
    private String apartmentNumber; // Apartment number
    private String feeID; // Reference to the Fee entity
    private LocalDate startingDay; // The starting day for the fee

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

    public LocalDate getStartingDay() {
        return startingDay;
    }

    public void setStartingDay(LocalDate startingDay) {
        this.startingDay = startingDay;
    }
    public String getFeeID() {
        return feeID;
    }
    public void setFeeID(String feeID) {
        this.feeID = feeID;
    }
}

