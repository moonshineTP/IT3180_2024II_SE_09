package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate; // Biển số xe
    
    @ManyToOne
    @JoinColumn(name = "resident_id", referencedColumnName = "resident_id")
    private Resident resident; // Mã cư dân
    
    @Column(name = "vehicle_type")
    private String vehicleType; // Loại phương tiện
    
    @Column(name = "brand")
    private String brand; // Hãng xe
    
    @Column(name = "model")
    private String model; // Dòng xe
    
    @Column(name = "color")
    private String color; // Màu sắc xe
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate; // Ngày đăng ký phương tiện tại chung cư
    
    @Column(name = "parking_slot")
    private String parkingSlot; // Số chỗ đậu xe
    
    @Lob
    @Column(name = "image")
    private byte[] image; // Ảnh xe (Base64 hoặc link)
    
    @Column(name = "note")
    private String note; // Ghi chú thêm

    // Constructors, Getters, Setters
    
    public Vehicle() {
        this.registrationDate = LocalDateTime.now();
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
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
