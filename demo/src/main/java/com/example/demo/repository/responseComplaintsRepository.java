package com.example.demo.repository;
import com.example.demo.model.responseComplaints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Account;
import com.example.demo.model.Complaints;
@Repository
public interface responseComplaintsRepository extends JpaRepository<responseComplaints, Long> {
    // Custom query methods can be defined here if needed
    responseComplaints  findByComplaintAndAccount(Complaints complaint, Account account);
}
