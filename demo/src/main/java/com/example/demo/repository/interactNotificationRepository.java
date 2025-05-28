package com.example.demo.repository;

import com.example.demo.model.InteractNotification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Account;
import com.example.demo.model.Notification;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
    // Find notifications with interactType="concerned" for a user and matching notification IDs
@Repository
public interface InteractNotificationRepository extends JpaRepository<InteractNotification, Long> {

    // Tìm thông báo được người dùng quan tâm
    @Query("SELECT inot.notification FROM InteractNotification inot WHERE inot.account.email = :email AND inot.typeInteract = 'starred' AND inot.notification.announcementId IN :notificationIds")
    List<Notification> findStarredNotificationsByUserEmailAndNotificationIds(@Param("email") String email, @Param("notificationIds") List<String> notificationIds);

    // Tìm tương tác theo thông báo, loại và người dùng
    InteractNotification findByNotificationAndTypeInteractAndAccount(Notification notification, String typeInteract, Account account);

    // Tìm các tương tác theo email và danh sách ID thông báo (announcementId)
    @Query("SELECT inot FROM InteractNotification inot WHERE inot.account.email = :email AND inot.notification.announcementId IN :notificationIds")
    List<InteractNotification> findByAccountEmailAndNotificationIds(@Param("email") String email, @Param("notificationIds") List<String> notificationIds);
}

