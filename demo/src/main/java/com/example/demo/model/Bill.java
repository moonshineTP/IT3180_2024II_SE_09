package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id; // Unique identifier for the bill

    @ManyToOne
    @JoinColumn(name = "fee_household_id", nullable = false)
    private FeeHousehold feeHousehold; // Reference to the FeeHousehold entity

    @Column(name = "starting_date", nullable = false)
    private LocalDate startingDate; // Starting date of the bill

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate; // Due date of the bill

    @Column(name = "amount", nullable = false)
    private Double amount; // Amount of money for the bill

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FeeHousehold getFeeHousehold() {
        return feeHousehold;
    }

    public void setFeeHousehold(FeeHousehold feeHousehold) {
        this.feeHousehold = feeHousehold;
    }

    public LocalDate getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
