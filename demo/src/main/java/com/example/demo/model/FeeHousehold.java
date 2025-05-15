package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fee_household")
public class FeeHousehold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the record

    @Column(name = "apartment_number", nullable = false)
    private String apartmentNumber; // Apartment number

    @ManyToOne
    @JoinColumn(name = "fee_id", nullable = false)
    private Fee fee; // Reference to the Fee entity

    @Column(name = "starting_day", nullable = false)
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

    public Fee getFee() {
        return fee;
    }

    public void setFee(Fee fee) {
        this.fee = fee;
    }

    public LocalDate getStartingDay() {
        return startingDay;
    }

    public void setStartingDay(LocalDate startingDay) {
        this.startingDay = startingDay;
    }
}
