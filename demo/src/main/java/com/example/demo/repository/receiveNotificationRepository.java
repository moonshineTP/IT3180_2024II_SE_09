package com.example.demo.repository;

import com.example.demo.model.Notification;
import com.example.demo.model.Account;
import com.example.demo.model.receiveNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface receiveNotificationRepository extends JpaRepository<receiveNotification, Long> {
    // Find all notifications sent to a given account
    @Query("SELECT rn.notification FROM ReceiveNotification rn WHERE rn.account = :account")
    List<Notification> findNotificationsByAccount(@Param("account") Account account);
}
