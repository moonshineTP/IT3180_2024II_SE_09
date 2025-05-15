package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Bill;
import com.example.demo.model.Fee;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    // Find all bills associated with a specific Fee
    List<Bill> findByFeeHousehold_Fee(Fee fee);
}
