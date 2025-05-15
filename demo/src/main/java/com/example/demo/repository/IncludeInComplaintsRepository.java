package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.IncludeInComplaints;
import com.example.demo.model.Complaints;
import com.example.demo.model.Account;

import java.util.List;

public interface IncludeInComplaintsRepository extends JpaRepository<IncludeInComplaints, Long> {
    // Find all IncludeInComplaints entries by Complaint
    List<IncludeInComplaints> findByComplaint(Complaints complaint);

    // Find all IncludeInComplaints entries by Account
    List<IncludeInComplaints> findByAccount(Account account);
}