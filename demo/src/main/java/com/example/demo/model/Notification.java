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

    @Lob
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String creatorName;

    @Lob
    private byte[] attachment;

    @ElementCollection
    @CollectionTable(name = "announcement_targets", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "username")
    private List<String> targetUsernames; // null hoặc danh sách các username

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<responseNotification> responseNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<interactNotification> interactNotifications = new ArrayList<>();

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
    public byte[] getAttachment() {
        return attachment;
    }

    public void setAttachment(byte[] attachment) {
        this.attachment = attachment;
    }
    public List<String> getTargetUsernames() {
        return targetUsernames;
    }
    
    public void setTargetUsernames(List<String> targetUsernames) {
        this.targetUsernames = targetUsernames;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}

