package com.example.demo.model.DTO;
public class DonationDTO {

    private String Id; // Unique identifier for the donation

    private String donationName; // Name of the donation

    private String founder; // Founder of the donation

    private String content; // Content/description of the donation

    private long accumulatedMoney = 0; // Total accumulated money (default is 0)

    private String status; // Status of the donation (open/closed)

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
}