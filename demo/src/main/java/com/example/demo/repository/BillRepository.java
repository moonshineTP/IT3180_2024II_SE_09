package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.Bill;
import com.example.demo.model.Fee;
import com.example.demo.model.FeeHousehold;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    // Find all bills associated with a specific Fee
    List<Bill> findByFeeHousehold_Fee(Fee fee);
    List<Bill> findByFeeHousehold(FeeHousehold feeHousehold);
    @Query("SELECT b FROM Bill b WHERE b.feeHousehold.apartmentNumber = :apartmentNumber")
    List<Bill> findByApartmentNumber(String apartmentNumber);
    Bill findByStartingDateAndFeeHousehold(java.time.LocalDate startingDate, FeeHousehold feeHousehold);
}
