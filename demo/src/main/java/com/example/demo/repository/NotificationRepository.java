package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    // Custom method to find notifications by sendto field
    List<Notification> findBySendto(String sendto);
}
