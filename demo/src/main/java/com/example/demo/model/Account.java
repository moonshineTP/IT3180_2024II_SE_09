// File: Account.java
package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "last_visit")
    private LocalDateTime lastVisit;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(length = 100)
    private String email;

    @Column(nullable = false)
    private String role = "guest"; // Mặc định là guest

    @Column(length = 100)
    private String username; // Tự động set từ email nếu null
    @Column(nullable = false)
    private String ban = "Active"; // Mặc định là chưa bị ban
    @Column(nullable = false)
    private String status = "Offline"; // tình trạng online/offline
    @OneToOne(optional = true)
    @JoinColumn(name = "resident_id", referencedColumnName = "resident_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL) // Cần thư viện Hibernate
    private Resident resident;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<interactNotification> interactNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<responseNotification> responseNotifications = new ArrayList<>();
    // ---------------------------
    // Constructors
    // ---------------------------
    public Account() {
        this.createdDate = LocalDateTime.now();
    }

    // ---------------------------
    // Getter & Setter
    // ---------------------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getLastVisit() { return lastVisit; }
    public void setLastVisit(LocalDateTime lastVisit) {  this.lastVisit = lastVisit; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status;}
    public String getBan() { return ban; }
    public void setBan(String ban) { this.ban = ban;}
    public Resident getResident() {
        return resident;
    }
    public void setResident(Resident resident) {
        this.resident = resident;
    }
}
