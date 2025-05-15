package com.example.demo.model.DTO;

import java.time.LocalDate;
import com.example.demo.model.FeeHousehold;
public class BillDTO {

    private Long id; // Unique identifier for the bill

    private FeeHousehold feeHousehold; // Reference to the FeeHousehold entity

    private LocalDate startingDate; // Starting date of the bill

    private LocalDate dueDate; // Due date of the bill

    private long amount; // Amount of money for the bill

    private String status; // Status of the bill (e.g., paid, unpaid)

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
