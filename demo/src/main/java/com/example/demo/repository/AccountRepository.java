// File: AccountRepository.java
package com.example.demo.repository;  // Thay bằng package của bạn
import java.util.List;
import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Account;
public interface AccountRepository extends JpaRepository<Account, String> {
	Account findByEmail(String email);
	Account findByUsername(String username);
	List<Account> findByLastVisitBeforeAndStatus(Instant lastVisit, String status);
}