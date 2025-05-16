package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"fee_household_id", "starting_date"})
})
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
    private long amount; // Amount of money for the bill

    @Column(name = "status", nullable = false)
    private String status; // Status of the bill (e.g., paid, unpaid)
    @Column(name = "paying_date", nullable = false)
    private LocalDate payingDate; // Date when the bill was paid

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

    public long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDate getPayingDate() {
        return payingDate;
    }
    public void setPayingDate(LocalDate payingDate) {
        this.payingDate = payingDate;
    }
}
