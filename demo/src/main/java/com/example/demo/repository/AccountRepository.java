// File: AccountRepository.java
package com.example.demo.repository;  // Thay bằng package của bạn
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Account;
public interface AccountRepository extends JpaRepository<Account, Long> {
	Account findByEmail(String email);
	Account findByUsername(String username);
}