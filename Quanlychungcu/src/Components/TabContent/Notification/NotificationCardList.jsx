// ./Components/TabContent/Notification/NotificationCardList.jsx (Tạo file mới)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash, faEye, faClock, faUserEdit, faIdBadge, faHeading,
    faBell, faBookOpen, faTools,faExclamationTriangle,faCalendarAlt// Để lấy icon cho loại thông báo, faCalendarAlt // Icons cho các trường thông tin
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './NotificationCardList.css'; // Tạo file CSS riêng

const DEFAULT_TEXT = 'N/A';

// Helper function to format LocalDateTime for display
const formatDisplayDateTime = (dateTimeString) => {
    if (!dateTimeString) return DEFAULT_TEXT;
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
               date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return DEFAULT_TEXT; }
};

// Helper để chọn icon loại thông báo
const getTypeIcon = (type) => {
    switch (type) {
        case 'administrative': return faBookOpen;
        case 'maintenance': return faTools; // Nếu có icon tools
        case 'emergency': return faExclamationTriangle; // Nếu có icon cảnh báo
        case 'event': return faCalendarAlt;
        default: return faBell; // Mặc định là icon chuông
    }
};

const NotificationCardList = ({
    notifications,      // Mảng NotificationDTOs đã lọc
    onOpenNotificationDetail, // Hàm để mở popup chi tiết/sửa (nếu muốn mở lại)
    ViewerAccount,      // Thông tin người đang xem
    refetchNotifications // Hàm để làm mới danh sách sau khi xóa
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const isAdmin = ViewerAccount?.role === 'admin';

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(notifications) ? notifications.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Array.isArray(notifications) ? Math.ceil(notifications.length / itemsPerPage) : 0;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="notification-list-pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        );
    };

    const handleDeleteNotification = async (announcementId) => {
        if (!announcementId) {
            console.error("Announcement ID is required for deletion.");
            alert("Lỗi: Không có mã thông báo để xóa.");
            return;
        }
        if (!window.confirm(`Bạn có chắc chắn muốn xóa thông báo "${announcementId}" không?`)) {
            return;
        }

        try {
            // API @DeleteMapping("/deletenotification") nhận RequestBody NotificationDTO
            await axios.delete( // Axios DELETE với body cần dùng axios.delete(url, { data: body })
                `http://localhost:8080/api/update/deletenotification`,{data:
                { announcementId: announcementId }, // Gửi announcementId trong body
                 withCredentials: true }
            );
            alert(`Thông báo mã "${announcementId}" đã được xóa thành công.`);
            if (refetchNotifications) {
                refetchNotifications(); // Tải lại danh sách thông báo
            }
        } catch (error) {
            console.error(`Error deleting notification ${announcementId}:`, error);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data || "Lỗi không xác định từ server.";
                if (status === 403) {
                    alert("Lỗi: Bạn không có quyền thực hiện hành động này.");
                    // window.location.reload(); // Có thể reload nếu lỗi quyền
                } else if (status === 400 || status === 404) {
                    alert(`Lỗi: ${message}`);
                } else {
                    alert(`Lỗi server (${status}): ${message}`);
                }
            } else {
                alert("Lỗi xóa thông báo: Không thể kết nối hoặc lỗi không xác định.");
            }
        }
    };

    // Hàm để mở chi tiết thông báo (nếu muốn)
    const handleViewNotificationDetail = async (notification) =>{
        let announcementId = notification.announcementId;
        if (!announcementId) {
            console.error("Announcement ID is required to view details.");
            return;
        }
        try {
        const response = await axios.post(
            'http://localhost:8080/api/gettarget/getNotification',
            { announcementId: announcementId },
            { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
            if (onOpenNotificationDetail) {
                onOpenNotificationDetail(response.data); // Gọi hàm để mở chi tiết thông báo
                return;
            }
        } else {
            console.error("Failed to fetch notification details, status:", response.status, response.data);
            return;
        }
        } catch (error) {
            console.error("Error fetching notification details:", error);
            return; // Trả về null khi lỗi
        }
    };


    if (!Array.isArray(notifications) || notifications.length === 0) {
        return (
            <div className="notification-list-no-results">
                <p>Không có thông báo nào khớp với bộ lọc hiện tại.</p>
            </div>
        );
    }

    return (
        <div className="notification-card-list-container">
            <div className="notification-cards-grid">
                {currentItems.map((notification) => (
                    <div key={notification.announcementId} className="notification-card">
                        <div className="notification-card-header">
                            <FontAwesomeIcon icon={getTypeIcon(notification.type)} className="notification-type-icon" />
                            <div className="notification-header-info">
                                <h4 className="notification-title">
                                    <FontAwesomeIcon icon={faHeading} className="info-icon" /> {notification.title || DEFAULT_TEXT}
                                </h4>
                                <p className="notification-id">
                                    <FontAwesomeIcon icon={faIdBadge} className="info-icon" /> Mã: {notification.announcementId || DEFAULT_TEXT}
                                </p>
                            </div>
                        </div>
                        <div className="notification-card-body">
                            <p className="notification-creator">
                                <FontAwesomeIcon icon={faUserEdit} className="info-icon" /> Người tạo: {notification.creatorName || DEFAULT_TEXT}
                            </p>
                            <p className="notification-created-at">
                                <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" /> Tạo lúc: {formatDisplayDateTime(notification.createdAt)}
                            </p>
                            <p className="notification-updated-at">
                                <FontAwesomeIcon icon={faClock} className="info-icon" /> Cập nhật: {formatDisplayDateTime(notification.updatedAt)}
                            </p>
                        </div>
                        <div className="notification-card-actions">
                            {/* Nút xem chi tiết (có thể mở form chỉ để xem, hoặc 1 popup riêng) */}
                            <button
                                className="action-button view-button"
                                onClick={() => handleViewNotificationDetail(notification)}
                                title="Xem chi tiết thông báo"
                            >
                                <FontAwesomeIcon icon={faEye} /> Xem
                            </button>
                            {isAdmin && (
                                <button
                                    className="action-button delete-button"
                                    onClick={() => handleDeleteNotification(notification.announcementId)}
                                    title="Xóa thông báo"
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Xóa
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination />
        </div>
    );
};

export default NotificationCardList;