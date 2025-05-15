package com.example.demo.model.DTO;

import java.time.LocalDateTime;
public class NotificationDTO {
    private String announcementId;
    private String title;
    private String type;
    private String sendto;
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String creatorName;

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
}