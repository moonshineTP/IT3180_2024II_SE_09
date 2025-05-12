package com.example.demo.model.DTO;

import java.time.LocalDateTime;

public class VehicleDTO {
    private String licensePlate; // Biển số xe
    private String residentId; // Mã cư dân (linked resident ID)
    private String vehicleType; // Loại phương tiện
    private String brand; // Hãng xe
    private String model; // Dòng xe
    private String color; // Màu sắc xe
    private LocalDateTime registrationDate; // Ngày đăng ký phương tiện tại chung cư
    private String parkingSlot; // Số chỗ đậu xe
    private byte[] image; // Ảnh xe (Base64 hoặc link)
    private String note; // Ghi chú thêm

    // Getters and Setters
    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getResidentId() {
        return residentId;
    }

    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getParkingSlot() {
        return parkingSlot;
    }

    public void setParkingSlot(String parkingSlot) {
        this.parkingSlot = parkingSlot;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
