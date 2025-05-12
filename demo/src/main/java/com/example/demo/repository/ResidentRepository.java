package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Resident;

public interface ResidentRepository extends JpaRepository<Resident, String> {

    Resident findByResident_id(String id);

    boolean existsByIdentityNumberAndResident_idNot(String identityNumber, String residentId);

    boolean existsByPhoneNumberAndResident_idNot(String phoneNumber, String residentId);

    boolean existsByEmailAndResident_idNot(String email, String residentId);

    boolean existsByApartmentNumberAndFloorNumberAndIsHouseholdOwnerTrueAndResident_idNot(
        String apartmentNumber, String floorNumber, String residentId
    );
}
