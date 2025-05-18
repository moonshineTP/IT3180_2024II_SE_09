package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Resident;

public interface ResidentRepository extends JpaRepository<Resident, String> {
    Resident findByResidentId(String residentId); // Sửa thành findByResidentId

    boolean existsByIdentityNumberAndResidentIdNot(String identityNumber, String residentId);

    boolean existsByPhoneNumberAndResidentIdNot(String phoneNumber, String residentId);

    boolean existsByEmailAndResidentIdNot(String email, String residentId);

    boolean existsByApartmentNumberAndIsHouseholdOwnerTrueAndResidentIdNot(
        String apartmentNumber, String residentId
    );

    List<Resident> findByApartmentNumber(String apartmentNumber);
}
