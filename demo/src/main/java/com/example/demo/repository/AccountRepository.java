// File: AccountRepository.java
package com.example.demo.repository;  // Thay bằng package của bạn
import java.util.List;
import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Account;
public interface AccountRepository extends JpaRepository<Account, String> {
	Account findByEmail(String email);
	Account findByUsername(String username);
	List<Account> findByLastVisitBeforeAndStatus(Instant lastVisit, String status);
	@Query("SELECT a FROM Account a WHERE a.resident IS NOT NULL AND a.resident.apartmentNumber IS NOT NULL AND a.resident.apartmentNumber IN :apartmentNumbers")
	List<Account> findByResident_ApartmentNumberIn(@Param("apartmentNumbers") List<String> apartmentNumbers);
}