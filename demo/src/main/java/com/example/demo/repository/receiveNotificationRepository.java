package com.example.demo.repository;

import com.example.demo.model.Notification;
import com.example.demo.model.Resident;
import com.example.demo.model.ReceiveNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceiveNotificationRepository extends JpaRepository<ReceiveNotification, Long> {
    // Find all notifications sent to a given account
    @Query("SELECT rn.notification FROM ReceiveNotification rn WHERE rn.resident = :resident")
    List<Notification> findNotificationsByResident(@Param("resident") Resident resident);

    @Query("SELECT COUNT(rn) > 0 FROM ReceiveNotification rn WHERE rn.resident = :resident AND rn.notification = :notification")
    boolean existsByResidentAndNotification(@Param("resident") Resident resident, @Param("notification") Notification notification);
    ReceiveNotification findByResidentAndNotification(Resident resident, Notification notification);

}
