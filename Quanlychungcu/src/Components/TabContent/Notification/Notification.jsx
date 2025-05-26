// ./Components/TabContent/Notification/NotificationInfo.jsx (Hoặc tên file của bạn)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Notification.css'; // Tạo file CSS này
import TabContentFrame2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";
import {
    faBell, faFilter, faUndo, faPlusCircle, faUsers, faUserLock, faBookOpen, faCheckSquare,faSquare,
    faStar as faStarSolid, // Quan tâm (solid)
    faFileAlt, // Title
    faTags,    // Type
    faCalendarAlt, // CreatedAt, UpdatedAt
    faUserEdit // CreatorName
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; // Quan tâm (regular)

// (Giả sử bạn sẽ có NotificationTable.jsx sau này)
// import NotificationTable from './NotificationTable';

const DEFAULT_FILTER_TEXT = '';
const DEFAULT_FILTER_SELECT = '';

function NotificationContent({ viewerAccount, onOpenPopUp }) { // Nhận props nếu cần
    // --- State cho Tab điều hướng ---
    const [activePrimaryTab, setActivePrimaryTab] = useState('public'); // 'public' hoặc 'private'
    const [activeSecondaryTab, setActiveSecondaryTab] = useState('all'); // 'all', 'unread', 'starred'

    // --- State cho việc hiển thị kết quả ---
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [filterError, setFilterError] = useState(null);

    // --- State cho Bộ Lọc Chi Tiết ---
    const initialNotificationFilterState = {
        title: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        type: { value: DEFAULT_FILTER_SELECT, isEnabled: true }, // Loại thông báo
        // sendto được điều khiển bởi activePrimaryTab
        createdAtFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        createdAtTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        updatedAtFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        updatedAtTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        creatorName: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
    };
    const [notificationFilters, setNotificationFilters] = useState(initialNotificationFilterState);

    const isAdmin = viewerAccount?.role === 'admin'; // Giả sử viewerAccount được truyền vào

    // --- Hàm xử lý thay đổi Filter ---
    const handleFilterChange = (field, value) => {
        setNotificationFilters(prev => ({
            ...prev,
            [field]: { ...prev[field], value: value }
        }));
    };

    const handleToggleFilterField = (field) => {
        setNotificationFilters(prev => ({
            ...prev,
            [field]: { ...prev[field], isEnabled: !prev[field].isEnabled }
        }));
    };

    // --- Hàm Reset Filters ---
    const handleResetDetailedFilters = () => {
        setNotificationFilters(initialNotificationFilterState);
        setFilteredNotifications([]);
        setFilterError(null);
    };

    // --- Hàm Áp dụng Lọc ---
    const handleApplyFilters = async () => {
        setIsLoadingResults(true);
        setFilterError(null);
        setFilteredNotifications([]);

        const activeFilters = {
            sendto: activePrimaryTab, // Lấy từ tab chính
            // Thêm các điều kiện từ activeSecondaryTab nếu cần (ví dụ: isRead: false, isStarred: true)
        };

        for (const key in notificationFilters) {
            if (notificationFilters[key].isEnabled &&
                notificationFilters[key].value !== DEFAULT_FILTER_SELECT &&
                notificationFilters[key].value !== DEFAULT_FILTER_TEXT) {
                activeFilters[key] = notificationFilters[key].value;
            }
        }

        console.log("Đang lọc thông báo với tiêu chí:", activeFilters);
        // TODO: Gọi API lấy danh sách thông báo với 'activeFilters'
        // Ví dụ:
        // try {
        //   const response = await axios.post('/api/getlist/notifications', activeFilters, { withCredentials: true });
        //   setFilteredNotifications(response.data);
        // } catch (err) {
        //   setFilterError("Lỗi khi tải thông báo.");
        // } finally {
        //   setIsLoadingResults(false);
        // }
        setTimeout(() => { // Giả lập API call
            setIsLoadingResults(false);
            setFilterError("Chức năng lọc thông báo đang được phát triển.");
        }, 1000);
    };

    // --- Helper function để render một trường filter ---
    const renderFilterField = (fieldKey, label, type = "text", options = [], icon = null) => {
        const fieldState = notificationFilters[fieldKey];
         if (!fieldState && !(type === "date" && (notificationFilters[`${fieldKey}From`] || notificationFilters[`${fieldKey}To`]))) {
            console.error(`Lỗi cấu hình: Thiếu state cho '${fieldKey}' trong notificationFilters.`);
            return <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>Lỗi cấu hình filter cho: {label}</div>;
        }


        if (type === "date") {
            const fromKey = `${fieldKey}From`;
            const toKey = `${fieldKey}To`;
            const fromFieldState = notificationFilters[fromKey];
            const toFieldState = notificationFilters[toKey];

            if (!fromFieldState || !toFieldState) {
                 console.error(`Lỗi cấu hình: Thiếu state cho '${fromKey}' hoặc '${toKey}'.`);
                 return <div style={{ color: 'red' }}>Lỗi date filter: {label}</div>;
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
                              handleToggleFilterField(fromKey, newState); // Truyền new State
                              handleToggleFilterField(toKey, newState);   // Truyền new State
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
        // Xử lý cho type khác (text, select)
         if (!fieldState) { // Kiểm tra lại fieldState sau khi xử lý date
            console.error(`Lỗi cấu hình: Thiếu state cho '${fieldKey}'.`);
            return <div style={{ color: 'red' }}>Lỗi filter: {label}</div>;
        }


        return (
            <div className={`filter-field-item ${!fieldState.isEnabled ? 'disabled' : ''}`}>
                <div className="filter-field-header">
                    {icon && <FontAwesomeIcon icon={icon} className="filter-field-icon" />}
                    <label htmlFor={`notification-${fieldKey}`}>{label}:</label>
                    <FontAwesomeIcon
                        icon={fieldState.isEnabled ? faCheckSquare : faSquare}
                        className="filter-field-toggle"
                        onClick={() => handleToggleFilterField(fieldKey)}
                        title={fieldState.isEnabled ? "Bỏ chọn" : "Chọn"}
                    />
                </div>
                {type === "text" && ( <input type="text" id={`notification-${fieldKey}`} value={fieldState.value} onChange={(e) => handleFilterChange(fieldKey, e.target.value)} disabled={!fieldState.isEnabled} placeholder={label} /> )}
                {type === "select" && (
                    <select id={`notification-${fieldKey}`} value={fieldState.value} onChange={(e) => handleFilterChange(fieldKey, e.target.value)} disabled={!fieldState.isEnabled}>
                        <option value={DEFAULT_FILTER_SELECT}>Tất cả {label.toLowerCase()}</option>
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )}
            </div>
        );
    };


    return (
        <>
            {/* Notification Header */}
            <div className="notification-header"> {/* Đổi tên class cho header của trang này */}
                <FontAwesomeIcon icon={faBell} className="header-icon" />
                <span className="header-text">Quản lý Thông báo</span>
                <FontAwesomeIcon icon={faBell} className="header-icon" />
            </div>

            {/* Tab Navigation Panel */}
            <div className="notification-tabs-panel">
                <div className="primary-tabs">
                    <button
                        className={`tab-button ${activePrimaryTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActivePrimaryTab('public')}
                    >
                        <FontAwesomeIcon icon={faUsers} /> Thông báo Chung
                    </button>
                    <button
                        className={`tab-button ${activePrimaryTab === 'private' ? 'active' : ''}`}
                        onClick={() => setActivePrimaryTab('private')}
                    >
                        <FontAwesomeIcon icon={faUserLock} /> Thông báo Riêng tư
                    </button>
                </div>
                <div className="secondary-tabs">
                    <button
                        className={`tab-button secondary ${activeSecondaryTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('all')}
                    >
                        <FontAwesomeIcon icon={faBookOpen} /> Tất cả
                    </button>
                    <button
                        className={`tab-button secondary ${activeSecondaryTab === 'unread' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('unread')}
                    >
                        <span className="unread-count-badge">3</span> {/* Ví dụ số lượng chưa đọc */}
                        Chưa đọc
                    </button>
                    <button
                        className={`tab-button secondary ${activeSecondaryTab === 'starred' ? 'active' : ''}`}
                        onClick={() => setActiveSecondaryTab('starred')}
                    >
                        <FontAwesomeIcon icon={activeSecondaryTab === 'starred' ? faStarSolid : faStarRegular} /> Quan tâm
                    </button>
                </div>
            </div>

            {/* Detailed Filter Panel */}
            <div className="main-filter-panel notification-filter-panel"> {/* Thêm class riêng */}
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
                    {/* sendto được chọn bởi primary tab */}
                    {renderFilterField('creatorName', 'Người tạo', 'text', [], faUserEdit)}
                    {renderFilterField('createdAt', 'Ngày tạo (khoảng)', 'date', [], faCalendarAlt)}
                    {renderFilterField('updatedAt', 'Ngày cập nhật (khoảng)', 'date', [], faCalendarAlt)}
                </div>
                <div className="filter-actions-section">
                    <button onClick={handleResetDetailedFilters} className="reset-filter-btn">
                        <FontAwesomeIcon icon={faUndo} /> Đặt lại Filter
                    </button>
                     {isAdmin && ( // Chỉ admin mới thấy nút tạo
                        <button onClick={() => { /* TODO: onOpenPopUp('create-notification', null, handleApplyFilters) */ alert("Mở popup tạo thông báo");}} className="create-new-btn notification-create-btn">
                            <FontAwesomeIcon icon={faPlusCircle} /> Tạo Thông báo Mới
                        </button>
                     )}
                    <button onClick={handleApplyFilters} className="apply-all-btn notification-apply-btn">
                        <FontAwesomeIcon icon={faFilter} /> Áp dụng Lọc
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div className="filter-results-panel notification-results-panel">
                <h3>Danh sách Thông báo</h3>
                {isLoadingResults && <div><FontAwesomeIcon icon={faSpinner} spin /> Đang tải...</div>}
                {filterError && <div className="error-message">{filterError}</div>}
                {!isLoadingResults && !filterError && filteredNotifications.length === 0 && (
                    <p>Không có thông báo nào khớp với bộ lọc hiện tại.</p>
                )}
                {/* {filteredNotifications.length > 0 && !isLoadingResults && !filterError && (
                    <NotificationTable
                        notifications={filteredNotifications}
                        onOpenNotificationPopUp={onOpenPopUp} // Để xem chi tiết
                        viewerAccount={viewerAccount}
                    />
                )} */}
                 {!isLoadingResults && !filterError && filteredNotifications.length > 0 && (
                     <p>Sẽ hiển thị bảng thông báo ở đây với {filteredNotifications.length} kết quả.</p>
                 )}
            </div>
        </>
    );
}

// Component NotificationInfo (export default)
export default function NotificationInfo({ viewerAccount, onOpenPopUp }) { // Nhận props
    return <TabContentFrame2 content={<NotificationContent viewerAccount={viewerAccount} onOpenPopUp={onOpenPopUp} />} />;
}
