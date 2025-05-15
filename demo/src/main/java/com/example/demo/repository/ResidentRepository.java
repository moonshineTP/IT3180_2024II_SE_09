package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Resident;

public interface ResidentRepository extends JpaRepository<Resident, String> {

    Resident findByResident_id(String id);

    boolean existsByIdentityNumberAndResident_idNot(String identityNumber, String residentId);

    boolean existsByPhoneNumberAndResident_idNot(String phoneNumber, String residentId);

    boolean existsByEmailAndResident_idNot(String email, String residentId);

    boolean existsByApartmentNumberAndIsHouseholdOwnerTrueAndResident_idNot(
        String apartmentNumber, String residentId
    );
    List<Resident> findByApartmentNumber(String apartmentNumber);
}
