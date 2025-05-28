// ./Components/TabContent/Notification/NotificationContent.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Notification.css';
import axios from 'axios';
import TabContentFrame2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";
import NotificationCardList from './NotificationCardList'; // Import danh sách thông báo
import NotificationDetailPopUp from './NotificationDetailPopUp'; // Import chi tiết thông báo
import {
    faBell, faFilter, faUndo, faPlusCircle, faUsers, faUserLock, faBookOpen,
    faStar as faStarSolid,
    faFileAlt, faTags, faCalendarAlt, faUserEdit,
    faCheckSquare, faSquare, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import NotificationFormPopUp from './NotificationFormPopUp'; // Import form popup

const DEFAULT_FILTER_TEXT = '';
const DEFAULT_FILTER_SELECT = '';

function NotificationContent({ ViewerAccount , onOpenPopUp}) {
    // --- State cho Tab điều hướng ---
    const [activePrimaryTab, setActivePrimaryTab] = useState('public');
    const [activeSecondaryTab, setActiveSecondaryTab] = useState('all');

    // --- State cho việc hiển thị kết quả ---
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [filterError, setFilterError] = useState(null);

    // --- State cho Bộ Lọc Chi Tiết ---
    const initialNotificationFilterState = {
        title: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        type: { value: DEFAULT_FILTER_SELECT, isEnabled: true },
        createdAtFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        createdAtTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        updatedAtFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        updatedAtTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        creatorName: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
    };
    const [notificationFilters, setNotificationFilters] = useState(initialNotificationFilterState);

    // --- State quản lý hiển thị Form hay Bảng kết quả ---
    const [displayMode, setDisplayMode] = useState('results');
    const [notificationDetailData, setNotificationDetailData] = useState(null); 

    const isAdmin = ViewerAccount?.role === 'admin';

    // --- Hàm xử lý thay đổi Filter ---
    const handleFilterChange = (field, value) => {
        setNotificationFilters(prev => ({ ...prev, [field]: { ...prev[field], value: value } }));
    };

    const handleToggleFilterField = (field, newEnabledState) => {
        setNotificationFilters(prev => ({ ...prev, [field]: { isEnabled: newEnabledState !== undefined ? newEnabledState : !prev[field].isEnabled }}));
    };

    // --- Hàm Reset Filters ---
    const handleResetDetailedFilters = () => {
        setNotificationFilters(initialNotificationFilterState);
        setFilteredNotifications([]);
        setFilterError(null);
    };

    // --- Helper để lọc danh sách thông báo theo tiêu chí chi tiết (frontend) ---
    const getFilteredNotificationsFrontend = (allNotifications, criteria) => {
        if (!allNotifications) return [];
        if (!criteria || Object.keys(criteria).length === 0) {
            return allNotifications; // Trả về tất cả nếu không có tiêu chí lọc
        }

        return allNotifications.filter(notification => {
            for (const key in criteria) {
                const filterValue = criteria[key];
                let notificationValue = notification[key]; // Giá trị từ NotificationDTO

                // Xử lý Date Range (createdAt, updatedAt)
                if (key.endsWith('From')) {
                    const baseKey = key.slice(0, -4);
                    notificationValue = notification[baseKey];
                    const notificationDate = notificationValue ? new Date(notificationValue) : null;
                    const filterDateFrom = filterValue ? new Date(filterValue) : null;

                    if (filterDateFrom) { // Chỉ lọc nếu có giá trị 'From' được nhập
                        if (!notificationDate || notificationDate < filterDateFrom) {
                            return false;
                        }
                    }
                } else if (key.endsWith('To')) {
                    const baseKey = key.slice(0, -2);
                    notificationValue = notification[baseKey];
                    const notificationDate = notificationValue ? new Date(notificationValue) : null;
                    const filterDateTo = filterValue ? new Date(filterValue) : null;

                    if (filterDateTo) { // Chỉ lọc nếu có giá trị 'To' được nhập
                        const adjustedFilterDateTo = new Date(filterDateTo);
                        adjustedFilterDateTo.setDate(adjustedFilterDateTo.getDate() + 1); // Để bao gồm cả ngày 'To'

                        if (!notificationDate || notificationDate >= adjustedFilterDateTo) {
                            return false;
                        }
                    }
                }
                // Xử lý các trường string (title, creatorName)
                else if (typeof notificationValue === 'string' && typeof filterValue === 'string') {
                    if (!notificationValue.toLowerCase().includes(filterValue.toLowerCase())) {
                        return false;
                    }
                }
                // Xử lý trường type (select)
                else if (key === 'type' && filterValue) {
                    if (notification.type !== filterValue) { // So sánh chính xác type
                        return false;
                    }
                }
                // Xử lý các trường hợp giá trị null/undefined cho các filter khác
                else if ((notificationValue === undefined || notificationValue === null) &&
                           filterValue !== undefined && filterValue !== null && filterValue !== DEFAULT_FILTER_TEXT && filterValue !== DEFAULT_FILTER_SELECT) {
                    return false;
                }
                // (Các trường khác không có trong DTO hoặc không cần lọc theo kiểu này)
            }
            return true; // Khớp tất cả các tiêu chí
        });
    };


    // --- HÀM ÁP DỤNG LỌC CHÍNH ---
    const handleApplyFilters = async () => {
        setDisplayMode('results');
        setIsLoadingResults(true);
        setFilterError(null);
        setFilteredNotifications([]);

        const activeDetailedFilters = {};
        for (const key in notificationFilters) {
            if (notificationFilters[key].isEnabled &&
                notificationFilters[key].value !== DEFAULT_FILTER_SELECT &&
                notificationFilters[key].value !== DEFAULT_FILTER_TEXT) {
                activeDetailedFilters[key] = notificationFilters[key].value;
            }
        }

        try {
            let baseNotifications = []; // Danh sách thông báo cơ sở từ bước 1
            let apiErrorOccurred = false; // Flag để biết lỗi API có xảy ra không

            // Bước 1: Lấy danh sách thông báo cơ sở dựa trên activePrimaryTab (Public/Private)
            if (activePrimaryTab === 'public') {
                const response = await axios.get('http://localhost:8080/api/GetList/public-notifications', { withCredentials: true });
                if (Array.isArray(response.data)) {
                    baseNotifications = response.data;
                } else if (typeof response.data === 'string' && response.data.includes("No public notifications found")) {
                    setFilterError(response.data); // Backend có thể trả về thông báo này
                } else {
                    setFilterError("Dữ liệu thông báo công khai không hợp lệ.");
                }
            } else if (activePrimaryTab === 'private') {
                try {
                    let response;
                    if (isAdmin) { // Nếu là admin, gọi API mới (/private-notifications)
                        response = await axios.post('http://localhost:8080/api/GetList/private-notifications', {}, { withCredentials: true }); // API POST không nhận body
                    } else { // Nếu không phải admin, gọi API cũ (/getprivateNotification)
                        response = await axios.post('http://localhost:8080/api/GetList/getprivateNotification', {}, { withCredentials: true });
                    }

                    if (Array.isArray(response.data)) {
                        baseNotifications = response.data;
                    } else if (typeof response.data === 'string' && response.data.includes("No private notifications found")) {
                        setFilterError(response.data);
                    } else if (typeof response.data === 'string' && response.data.includes("User is not a resident")) {
                        setFilterError("Bạn không phải là cư dân để xem thông báo riêng tư.");
                    } else {
                        setFilterError("Dữ liệu thông báo riêng tư không hợp lệ.");
                    }
                } catch (privateTabError) {
                    apiErrorOccurred = true; // Đánh dấu có lỗi API trong nhánh private
                    console.error("Error fetching private notifications:", privateTabError);
                    if (privateTabError.response?.status === 403) { // Xử lý đặc biệt 403 từ /private-notifications
                        setFilterError("Bạn không có quyền xem thông báo riêng tư này.");
                    } else if (privateTabError.response?.status === 400 || privateTabError.response?.status === 404) {
                        setFilterError(privateTabError.response.data?.message || "Lỗi yêu cầu thông báo riêng tư.");
                    } else {
                        setFilterError("Lỗi không xác định khi tải thông báo riêng tư.");
                    }
                    baseNotifications = []; // Xóa danh sách nếu có lỗi
                }
            }

            // Nếu có lỗi API xảy ra ở Bước 1, không tiếp tục xử lý
            if (apiErrorOccurred) {
                setFilteredNotifications([]);
                return;
            }

            let filteredBySecondaryTab = baseNotifications;

            // Bước 2: Lọc danh sách cơ sở đó dựa trên activeSecondaryTab (All/Unread/Starred)
            if (activeSecondaryTab === 'unread') {
                if (filteredBySecondaryTab.length > 0) {
                    const response = await axios.post(
                        'http://localhost:8080/api/GetList/filterNotReadNotifications',
                        filteredBySecondaryTab.map(n => ({ announcementId: n.announcementId })), // Gửi chỉ ID
                        { withCredentials: true }
                    );
                    if (Array.isArray(response.data)) {
                        filteredBySecondaryTab = response.data;
                    } else if (typeof response.data === 'string' && response.data.includes("No not-read notifications found")) {
                        filteredBySecondaryTab = [];
                    } else {
                         setFilterError("Dữ liệu thông báo chưa đọc không hợp lệ.");
                         filteredBySecondaryTab = [];
                    }
                } else { filteredBySecondaryTab = []; }
            } else if (activeSecondaryTab === 'starred') {
                if (filteredBySecondaryTab.length > 0) {
                    const response = await axios.post(
                        'http://localhost:8080/api/GetList/filterConcernedNotifications',
                        filteredBySecondaryTab.map(n => ({ announcementId: n.announcementId })), // Gửi chỉ ID
                        { withCredentials: true }
                    );
                    if (Array.isArray(response.data)) {
                        filteredBySecondaryTab = response.data;
                    } else if (typeof response.data === 'string' && response.data.includes("No concerned notifications found")) {
                        filteredBySecondaryTab = [];
                    } else {
                         setFilterError("Dữ liệu thông báo quan tâm không hợp lệ.");
                         filteredBySecondaryTab = [];
                    }
                } else { filteredBySecondaryTab = []; }
            }
            // Bước 3: Lọc danh sách từ Bước 2 dựa trên notificationFilters (bộ lọc chi tiết)
            const finalNotifications = getFilteredNotificationsFrontend(filteredBySecondaryTab, activeDetailedFilters);
            setFilteredNotifications(finalNotifications);
            finalNotifications.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt);
                const dateB = new Date(b.updatedAt || b.createdAt);
                // Sắp xếp giảm dần (mới nhất lên đầu)
                return dateB.getTime() - dateA.getTime();
            });

            setFilteredNotifications(finalNotifications);

        } catch (err) {
            console.error("Lỗi khi áp dụng bộ lọc thông báo:", err);
            let errorMessage = "Đã có lỗi xảy ra khi lọc thông báo.";
            if (err.response) {
                errorMessage = `Lỗi từ server: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
                if (err.response.status === 403) errorMessage = "Bạn không có quyền truy cập dữ liệu này.";
            } else if (err.request) {
                errorMessage = "Không thể kết nối đến server.";
            }
            setFilterError(errorMessage);
            setFilteredNotifications([]);
        } finally {
            setIsLoadingResults(false);
        }
    };


    // --- Hàm để mở form tạo mới ---
    const handleOpenCreateForm = () => {
        setDisplayMode('form');
    };

    // --- Hàm để mở form chỉnh sửa (không dùng nữa theo yêu cầu) ---
    // const handleOpenEditForm = (notificationData) => {
    //     setFormInitialData(notificationData);
    //     setDisplayMode('form');
    // };

    // --- Callback khi form thông báo được lưu thành công ---
    const handleNotificationSaved = () => {
        handleApplyFilters(); // Tải lại bảng kết quả sau khi lưu
        setDisplayMode('results'); // Quay lại hiển thị bảng sau khi lưu
    };
    // --- Hàm để mở xem chi tiết thông báo ---
    const handleOpenNotificationDetail = (notificationData) => {
        setNotificationDetailData(notificationData); // Lưu dữ liệu thông báo cần xem
        setDisplayMode('detail'); // Chuyển sang hiển thị chi tiết
    };
    const handleCloseNotificationDetail = () => {
        // Có thể refetch lại dữ liệu bảng nếu có tương tác nào đó trong detail popup làm thay đổi trạng thái
        // Ví dụ: lượt xem, like/dislike/starred.
        handleApplyFilters(); // Tải lại bảng để cập nhật lượt xem/tương tác
        setDisplayMode('results'); // Quay lại hiển thị bảng
        setNotificationDetailData(null); // Xóa dữ liệu chi tiết
    };

    // useEffect để fetch thông báo ban đầu
    useEffect(() => {
        handleApplyFilters();
    }, [activePrimaryTab, activeSecondaryTab]); // Re-run khi tab thay đổi để fetch lại và lọc


    // --- Helper function để render một trường filter ---
    const renderFilterField = (fieldKey, label, type = "text", options = [], icon = null) => {
        const filters = notificationFilters;

        if (type === "date") { /* ... như cũ ... */
            const fromKey = `${fieldKey}From`;
            const toKey = `${fieldKey}To`;
            const fromFieldState = filters[fromKey];
            const toFieldState = filters[toKey];

            if (!fromFieldState || !toFieldState) {
                console.error(`Lỗi cấu hình: Thiếu state cho '${fromKey}' hoặc '${toKey}'.`);
                return <div className="filter-field-error">Lỗi cấu hình filter: {label}</div>;
            }
            const isDateEnabled = fromFieldState.isEnabled && toFieldState.isEnabled;

            return (
              <div className={`filter-field-item ${!isDateEnabled ? 'disabled' : ''}`}>
                  <div className="filter-field-header">
                      {icon && <FontAwesomeIcon icon={icon} className="filter-field-icon" />}
                      <label>{label}:</label>
                      <FontAwesomeIcon
                          icon={isDateEnabled ? faCheckSquare : faSquare}
                          className="filter-field-toggle"
                          onClick={() => {
                              const newState = !isDateEnabled;
                              handleToggleFilterField(fromKey, newState);
                              handleToggleFilterField(toKey, newState);
                          }}
                          title={isDateEnabled ? "Bỏ chọn khoảng ngày" : "Lọc theo khoảng ngày"}
                      />
                  </div>
                  <div className="date-range-filter">
                      <input type="date" value={fromFieldState.value} onChange={(e) => handleFilterChange(fromKey, e.target.value)} disabled={!fromFieldState.isEnabled} />
                      <span>đến</span>
                      <input type="date" value={toFieldState.value} onChange={(e) => handleFilterChange(toKey, e.target.value)} disabled={!toFieldState.isEnabled} />
                  </div>
              </div>
          );
        }
        const fieldStateGeneral = filters[fieldKey];
        if (!fieldStateGeneral) { /* ... */ return <div className="filter-field-error">Lỗi cấu hình filter: {label}</div>; }

        return (
            <div className={`filter-field-item ${!fieldStateGeneral.isEnabled ? 'disabled' : ''}`}>
                <div className="filter-field-header">
                    {icon && <FontAwesomeIcon icon={icon} className="filter-field-icon" />}
                    <label htmlFor={`notification-${fieldKey}`}>{label}:</label>
                    <FontAwesomeIcon
                        icon={fieldStateGeneral.isEnabled ? faCheckSquare : faSquare}
                        className="filter-field-toggle"
                        onClick={() => handleToggleFilterField(fieldKey)}
                        title={fieldStateGeneral.isEnabled ? "Bỏ chọn" : "Chọn"}
                    />
                </div>
                {type === "text" && ( <input type="text" id={`notification-${fieldKey}`} value={fieldStateGeneral.value} onChange={(e) => handleFilterChange(fieldKey, e.target.value)} disabled={!fieldStateGeneral.isEnabled} placeholder={label} /> )}
                {type === "select" && (
                    <select id={`notification-${fieldKey}`} value={fieldStateGeneral.value} onChange={(e) => handleFilterChange(fieldKey, e.target.value)} disabled={!fieldStateGeneral.isEnabled}>
                        <option value={DEFAULT_FILTER_SELECT}>Tất cả {label.toLowerCase()}</option>
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )}
            </div>
        );
    };


    return (
        <div className="notification-page-container">
            {/* Notification Header */}
            <div className="notification-header">
                <FontAwesomeIcon icon={faBell} className="header-icon" />
                <span className="header-text">Quản lý Thông báo</span>
                <FontAwesomeIcon icon={faBell} className="header-icon" />
            </div>

            {/* Tab Navigation Panel */}
            <div className="notification-tabs-panel">
                <div className="notification-primary-tabs">
                    <button
                        className={`notification-tab-button ${activePrimaryTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActivePrimaryTab('public')}
                    >
                        <FontAwesomeIcon icon={faUsers} /> Thông báo Chung
                    </button>
                    <button
                        className={`notification-tab-button ${activePrimaryTab === 'private' ? 'active' : ''}`}
                        onClick={() => setActivePrimaryTab('private')}
                    >
                        <FontAwesomeIcon icon={faUserLock} /> Thông báo Riêng tư
                    </button>
                </div>
                <div className="notification-secondary-tabs">
                    <button
                        className={`notification-tab-button secondary ${activeSecondaryTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('all')}
                    >
                        <FontAwesomeIcon icon={faBookOpen} /> Tất cả
                    </button>
                    <button
                        className={`notification-tab-button secondary ${activeSecondaryTab === 'unread' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('unread')}
                    >
                        <span className="notification-unread-badge">0</span>
                        Chưa đọc
                    </button>
                    <button
                        className={`notification-tab-button secondary ${activeSecondaryTab === 'starred' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('starred')}
                    >
                        <FontAwesomeIcon icon={activeSecondaryTab === 'starred' ? faStarSolid : faStarRegular} /> Quan tâm
                    </button>
                </div>
            </div>

            {/* Detailed Filter Panel */}
            <div className="main-filter-panel notification-detailed-filter-panel">
                <div className="filter-panel-header">
                    <h3><FontAwesomeIcon icon={faFilter} /> Bộ lọc chi tiết Thông báo</h3>
                </div>
                <div className="filter-grid">
                    {renderFilterField('title', 'Tiêu đề', 'text', [], faFileAlt)}
                    {renderFilterField('type', 'Loại thông báo', 'select', [
                        { value: 'administrative', label: 'Hành chính – quản lý' },
                        { value: 'maintenance', label: 'Bảo trì, kỹ thuật' },
                        { value: 'emergency', label: 'Khẩn cấp – cảnh báo' },
                        { value: 'event', label: 'Sự kiện – cộng đồng' }
                    ], faTags)}
                    {renderFilterField('creatorName', 'Người tạo', 'text', [], faUserEdit)}
                    {renderFilterField('createdAt', 'Ngày tạo', 'date', [], faCalendarAlt)}
                    {renderFilterField('updatedAt', 'Ngày cập nhật', 'date', [], faCalendarAlt)}
                </div>
                <div className="notification-filter-actions">
                    <button onClick={handleResetDetailedFilters} className="reset-filter-btn">
                        <FontAwesomeIcon icon={faUndo} /> Đặt lại Filter
                    </button>
                     {isAdmin && (
                        <button
                            onClick={handleOpenCreateForm} // Gọi hàm mở form tạo mới
                            className="notification-create-btn"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} /> Tạo Thông báo Mới
                        </button>
                     )}
                    <button onClick={handleApplyFilters} className="notification-apply-btn">
                        <FontAwesomeIcon icon={faFilter} /> Áp dụng Lọc
                    </button>
                </div>
            </div>

            {/* --- HIỂN THỊ BẢNG HOẶC FORM TÙY displayMode --- */}
            <div className="notification-content-area"> {/* Container mới cho nội dung thay đổi */}
                {displayMode === 'results' && (
                    <div className="filter-results-panel notification-results-display-panel">
                        <h3>Danh sách Thông báo</h3>
                        {isLoadingResults && <div className="loading-indicator"><FontAwesomeIcon icon={faSpinner} spin size="2x" /><p>Đang tải...</p></div>}
                        {filterError && <div className="error-message">{filterError}</div>}
                        {!isLoadingResults && !filterError && filteredNotifications.length === 0 && (
                            <p className="no-results-text">Không có thông báo nào khớp với bộ lọc hiện tại.</p>
                        )}
                        {/* Placeholder for NotificationTable */}
                        {filteredNotifications.length > 0 && !isLoadingResults && !filterError && (
                             <NotificationCardList
                                notifications={filteredNotifications}
                                onOpenNotificationDetail={handleOpenNotificationDetail} 
                                ViewerAccount={ViewerAccount}
                                refetchNotifications={handleApplyFilters} // Để xóa
                             />
                        )}
                    </div>
                )}

                {displayMode === 'form' && (
                    // Component NotificationFormPopUp (đã không còn là popup nữa, nhưng vẫn dùng tên đó)
                    <NotificationFormPopUp
                        onClose={() => setDisplayMode('results')} // Đóng form và quay lại bảng
                        onSaveSuccess={handleNotificationSaved} // Callback khi lưu thành công
                        ViewerAccount={ViewerAccount}
                    />
                )}
                {displayMode === 'detail' && notificationDetailData && ( // Mới: Hiển thị chi tiết thông báo
                    <NotificationDetailPopUp
                        notificationData={notificationDetailData}
                        onClose={handleCloseNotificationDetail} // Nút thoát trong detail popup sẽ gọi hàm này
                        refetchNotifications={handleApplyFilters} // Callback để làm mới bảng sau khi có tương tác
                        ViewerAccount={ViewerAccount}
                        onOpenPopUp={onOpenPopUp}
                    />
                )}
            </div> {/* Hết .notification-content-area */}
        </div>
    );
}
export default function Notification({ ViewerAccount, onOpenPopUp}) {
    return <TabContentFrame2 content={<NotificationContent ViewerAccount={ViewerAccount} onOpenPopUp={onOpenPopUp}/>}/>;
}