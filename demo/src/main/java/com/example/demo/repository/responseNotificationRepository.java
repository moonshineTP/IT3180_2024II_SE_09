package com.example.demo.repository;
import com.example.demo.model.responseNotification;
import com.example.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Account;
@Repository
public interface responseNotificationRepository extends JpaRepository<responseNotification, Long> {
    // Custom query methods can be defined here if needed
    responseNotification findByNotificationAndAccount(Notification notification, Account account);
}
