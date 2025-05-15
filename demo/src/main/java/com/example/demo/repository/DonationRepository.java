package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, String> {
    // Custom method to find a Donation by its ID (if needed)
    Donation findDonationById(String id);
}