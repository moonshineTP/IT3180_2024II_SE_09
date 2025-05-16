package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Donation;
import com.example.demo.model.DonationHousehold;
import java.util.List;

@Repository
public interface DonationHouseholdRepository extends JpaRepository<DonationHousehold, Long> {
    // Find DonationHousehold records by apartmentNumber
    List<DonationHousehold> findByApartmentNumber(String apartmentNumber);
    DonationHousehold findByApartmentNumberAndDonation(String apartmentNumber, Donation donation);
}
