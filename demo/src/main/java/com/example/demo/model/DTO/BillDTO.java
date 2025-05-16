package com.example.demo.model.DTO;

import java.time.LocalDate;
public class BillDTO {

    private Long id; // Unique identifier for the bill

    private String feeId;
    private String feeName; // Name of the fee
    private String apartmentNumber; // Apartment number associated with the bill
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
    public String getFeeId() {
        return feeId;
    }
    public void setFeeId(String feeId) {
        this.feeId = feeId;
    }
    public String getFeeName() {
        return feeName;
    }
    public void setFeeName(String feeName) {
        this.feeName = feeName;
    }
    public String getApartmentNumber() {
        return apartmentNumber;
    }
    public void setApartmentNumber(String apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }
}
