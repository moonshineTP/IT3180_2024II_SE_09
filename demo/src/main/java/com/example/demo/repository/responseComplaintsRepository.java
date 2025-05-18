package com.example.demo.repository;
import com.example.demo.model.ResponseComplaints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Account;
import com.example.demo.model.Complaints;
@Repository
public interface ResponseComplaintsRepository extends JpaRepository<ResponseComplaints, Long> {
    // Custom query methods can be defined here if needed
    ResponseComplaints  findByComplaintAndAccount(Complaints complaint, Account account);
}
