package com.example.demo.repository;
import com.example.demo.model.FeeHousehold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FeeHouseholdRepository extends JpaRepository<FeeHousehold, Long> {
    // Find FeeHousehold by apartmentNumber and feeId
    FeeHousehold findByApartmentNumberAndFeeId(String apartmentNumber, String feeId);
}
