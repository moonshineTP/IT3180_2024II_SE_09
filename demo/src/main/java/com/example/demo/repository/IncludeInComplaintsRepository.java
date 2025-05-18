package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.IncludeInComplaints;
import com.example.demo.model.Resident;
import com.example.demo.model.Complaints;

import java.util.List;

public interface IncludeInComplaintsRepository extends JpaRepository<IncludeInComplaints, Long> {
    // Find all IncludeInComplaints entries by Complaint
    List<IncludeInComplaints> findByComplaint(Complaints complaint);

    IncludeInComplaints findByResidentAndComplaint(Resident resident, Complaints complaint);

    @Query("SELECT inc.complaint FROM IncludeInComplaints inc WHERE inc.resident = :resident AND inc.complaint.complaintId IN :complaintIds")
    List<Complaints> findIncludedComplaintsByResidentAndComplaintIds(@Param("resident") Resident resident, @Param("complaintIds") List<String> complaintIds);
}