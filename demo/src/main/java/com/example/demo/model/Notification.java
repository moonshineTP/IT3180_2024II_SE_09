package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "announcements")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String announcementId;

    private String title;
    private String type;
    private String sendto;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String creatorName;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<responseNotification> responseNotifications = new ArrayList<>();
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<interactNotification> interactNotifications = new ArrayList<>();
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<receiveNotification> receiveNotifications = new ArrayList<>();

    // Getters and Setters

    public String getAnnouncementId() {
        return announcementId;
    }

    public void setAnnouncementId(String announcementId) {
        this.announcementId = announcementId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getSendto() {
        return sendto;
    }
    public void setSendto(String sendto) {
        this.sendto = sendto;
    }
    public List<responseNotification> getResponseNotifications() {
        return responseNotifications;
    }
    public void setResponseNotifications(List<responseNotification> responseNotifications) {
        this.responseNotifications = responseNotifications;
    }
    public List<interactNotification> getInteractNotifications() {
        return interactNotifications;
    }
    public void setInteractNotifications(List<interactNotification> interactNotifications) {
        this.interactNotifications = interactNotifications;
    }
    public List<receiveNotification> getReceiveNotifications() {
        return receiveNotifications;
    }
    public void setReceiveNotifications(List<receiveNotification> receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }
}

