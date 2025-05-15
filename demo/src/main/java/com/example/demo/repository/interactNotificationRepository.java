package com.example.demo.repository;

import com.example.demo.model.interactNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Notification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
@Repository 
public interface interactNotificationRepository extends JpaRepository<interactNotification, Long> {
    // Find notifications with interactType="concerned" for a user and matching notification IDs
    @Query("SELECT inot.notification FROM InteractNotification inot WHERE inot.user.email = :email AND inot.typeInteract = 'concerned' AND inot.notification.announcementId IN :notificationIds")
    List<Notification> findConcernedNotificationsByUserEmailAndNotificationIds(@Param("email") String email, @Param("notificationIds") List<String> notificationIds);
}

