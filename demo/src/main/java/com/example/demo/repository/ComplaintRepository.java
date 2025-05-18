package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Complaints;

public interface ComplaintRepository extends JpaRepository<Complaints, String> {
    // Custom method to find a Complaint by its ID (if needed)
    Complaints findByComplaintId(String complaintId);
}
