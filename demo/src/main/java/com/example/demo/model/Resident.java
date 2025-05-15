package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "residents")
public class Resident {

    @Id
    @Column(name = "resident_id", nullable = false, updatable = false)
    private String resident_id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "gender")
    private String gender; // Nam / Nữ / Khác

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "identity_number", unique = true)
    private String identityNumber;

    @Column(name = "cccd_issue_date")
    private LocalDate cccdIssueDate;

    @Column(name = "cccd_expiry_date")
    private LocalDate cccdExpiryDate;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "apartment_number")
    private String apartmentNumber;

    @Column(name = "is_household_owner")
    private Boolean isHouseholdOwner;

    @Column(name = "relationship_with_owner")
    private String relationshipWithOwner;

    @Column(name = "move_in_date")
    private LocalDate moveInDate;

    @Column(name = "move_out_date")
    private LocalDate moveOutDate;

    @Lob
    @Column(name = "avatar", columnDefinition = "BLOB")
    private byte[] avatar; // Store avatar directly in the database as binary data
    
    @OneToOne(optional = true)
    @JoinColumn(name = "linking_email", referencedColumnName = "email", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL) // Cần thư viện Hibernate
    private Account account;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<receiveNotification> receiveNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IncludeInComplaints> includeInComplaints = new ArrayList<>();
    // Getters and Setters
    public String getResident_id() {
        return resident_id;
    }

    public void setResident_id(String resident_id) {
        this.resident_id = resident_id;
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
    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
