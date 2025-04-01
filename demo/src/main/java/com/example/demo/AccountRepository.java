// File: AccountRepository.java
package com.example.demo;  // Thay bằng package của bạn

import com.example.demo.Account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
public interface AccountRepository extends JpaRepository<Account, Long> {
	Account findByEmail(String email);
}