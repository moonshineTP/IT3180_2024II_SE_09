package com.example.demo.repository;

import com.example.demo.model.Notification;
import com.example.demo.model.Resident;
import com.example.demo.model.receiveNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface receiveNotificationRepository extends JpaRepository<receiveNotification, Long> {
    // Find all notifications sent to a given account
    @Query("SELECT rn.notification FROM receiveNotification rn WHERE rn.resident = :resident")
    List<Notification> findNotificationsByResident(@Param("resident") Resident resident);

    @Query("SELECT COUNT(rn) > 0 FROM receiveNotification rn WHERE rn.resident = :resident AND rn.notification = :notification")
    boolean existsByResidentAndNotification(@Param("resident") Resident resident, @Param("notification") Notification notification);

}
