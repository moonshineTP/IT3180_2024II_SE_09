package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Fee;

public interface FeeRepository extends JpaRepository<Fee, String> {
    // Method to find a Fee by its feeId
    Fee findByFeeId(String feeId);
}