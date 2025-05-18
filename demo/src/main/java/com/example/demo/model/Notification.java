package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "announcements")
public class Notification {

    @Id
    @Column(length = 100, unique = true)
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
    private List<ResponseNotification> responseNotifications = new ArrayList<>();
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InteractNotification> interactNotifications = new ArrayList<>();
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReceiveNotification> receiveNotifications = new ArrayList<>();

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
    public List<ResponseNotification> getResponseNotifications() {
        return responseNotifications;
    }
    public void setResponseNotifications(List<ResponseNotification> responseNotifications) {
        this.responseNotifications = responseNotifications;
    }
    public List<InteractNotification> getInteractNotifications() {
        return interactNotifications;
    }
    public void setInteractNotifications(List<InteractNotification> interactNotifications) {
        this.interactNotifications = interactNotifications;
    }
    public List<ReceiveNotification> getReceiveNotifications() {
        return receiveNotifications;
    }
    public void setReceiveNotifications(List<ReceiveNotification> receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }
}

