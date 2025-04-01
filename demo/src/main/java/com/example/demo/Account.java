// File: Account.java
package com.example.demo;  // Thay bằng package của bạn

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)  // Lưu trữ mật khẩu đã mã hóa
    private String password;

    @Column(length = 100)
    private String email;

    // ---------------------------
    // Getter & Setter 
    // ---------------------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}