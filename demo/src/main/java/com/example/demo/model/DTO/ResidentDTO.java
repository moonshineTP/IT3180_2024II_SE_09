package com.example.demo.model.DTO;

import java.time.LocalDate;

public class ResidentDTO {
    private String resident_id;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String identityNumber;
    private LocalDate cccdIssueDate;
    private LocalDate cccdExpiryDate;
    private String phoneNumber;
    private String email;
    private String occupation;
    private String apartmentNumber;
    private String floorNumber;
    private Boolean isHouseholdOwner;
    private String relationshipWithOwner;
    private LocalDate moveInDate;
    private LocalDate moveOutDate;
    private byte[] avatar; // Store avatar as binary data
    private String linkingEmail; // Email from the linked account
    private String linkingUsername; // Username from the linked account

    // Getters and Setters
    public String getResident_id() {
        return resident_id;
    }

    public void setResident_id(String residentId) {
        this.resident_id = residentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPlaceOfBirth() {
        return placeOfBirth;
    }

    public void setPlaceOfBirth(String placeOfBirth) {
        this.placeOfBirth = placeOfBirth;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public LocalDate getCccdIssueDate() {
        return cccdIssueDate;
    }

    public void setCccdIssueDate(LocalDate cccdIssueDate) {
        this.cccdIssueDate = cccdIssueDate;
    }

    public LocalDate getCccdExpiryDate() {
        return cccdExpiryDate;
    }

    public void setCccdExpiryDate(LocalDate cccdExpiryDate) {
        this.cccdExpiryDate = cccdExpiryDate;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getApartmentNumber() {
        return apartmentNumber;
    }

    public void setApartmentNumber(String apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }

    public Boolean getIsHouseholdOwner() {
        return isHouseholdOwner;
    }

    public void setIsHouseholdOwner(Boolean isHouseholdOwner) {
        this.isHouseholdOwner = isHouseholdOwner;
    }

    public String getRelationshipWithOwner() {
        return relationshipWithOwner;
    }

    public void setRelationshipWithOwner(String relationshipWithOwner) {
        this.relationshipWithOwner = relationshipWithOwner;
    }

    public LocalDate getMoveInDate() {
        return moveInDate;
    }

    public void setMoveInDate(LocalDate moveInDate) {
        this.moveInDate = moveInDate;
    }

    public LocalDate getMoveOutDate() {
        return moveOutDate;
    }

    public void setMoveOutDate(LocalDate moveOutDate) {
        this.moveOutDate = moveOutDate;
    }

    public byte[] getAvatar() {
        return avatar;
    }

    public void setAvatar(byte[] avatar) {
        this.avatar = avatar;
    }

    public String getLinkingEmail() {
        return linkingEmail;
    }

    public void setLinkingEmail(String linkingEmail) {
        this.linkingEmail = linkingEmail;
    }

    public String getLinkingUsername() {
        return linkingUsername;
    }

    public void setLinkingUsername(String linkingUsername) {
        this.linkingUsername = linkingUsername;
    }
    public String getFloorNumber() {
        return floorNumber;
    }
    public void setFloorNumber(String floorNumber) {
        this.floorNumber = floorNumber;
    }
}