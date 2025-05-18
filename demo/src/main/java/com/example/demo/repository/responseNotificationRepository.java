package com.example.demo.repository;
import com.example.demo.model.ResponseNotification;
import com.example.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Account;
@Repository
public interface ResponseNotificationRepository extends JpaRepository<ResponseNotification, Long> {
    // Custom query methods can be defined here if needed
    ResponseNotification findByNotificationAndAccount(Notification notification, Account account);
}
