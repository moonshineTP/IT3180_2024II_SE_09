package com.example.demo.repository;

import com.example.demo.model.interactComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Complaints;
import com.example.demo.model.Account;
@Repository
public interface interactComplaintRepository extends JpaRepository<interactComplaint, Long> {
    // Custom query methods can be defined here if needed
    // For example, find by complaint ID or user email
    interactComplaint findByComplaintAndStarNumberRatingAndAccount(Complaints complaintId, Integer starNumberRating, Account account);
}