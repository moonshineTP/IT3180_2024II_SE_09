// ./Components/TabContent/Notification/NotificationDetailPopUp.jsx
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faCalendarAlt, faSpinner,faEdit,
    faThumbsUp, faThumbsDown, faStar, faEye, faCommentDots, faUsers, faPlus, faTrash, faChevronLeft,
    faUser, faTools, faExclamationTriangle, faBookOpen
} from '@fortawesome/free-solid-svg-icons'; // Thêm faUser, faTools, faExclamationTriangle, faCar
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; // faStarRegular
import RichTextEditor from '../../Common/RichTextEditor'; // Giả định bạn có component RichTextEditor
import './NotificationDetailPopUp.css'; // Tạo file CSS riêng cho popup

const DEFAULT_TEXT = 'N/A';
const DEFAULT_DATE_TEXT = 'N/A';

const formatDisplayDateTime = (dateTimeString) => { /* ... */
    if (!dateTimeString) return DEFAULT_DATE_TEXT;
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
               date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return DEFAULT_TEXT; }
};

const getTypeIcon = (type) => { /* ... */
    switch (type) {
        case 'administrative': return faBookOpen;
        case 'maintenance': return faTools;
        case 'emergency': return faExclamationTriangle;
        case 'event': return faCalendarAlt;
        default: return faBell;
    }
};

const NotificationDetailPopUp = ({ notificationData, onClose, refetchNotifications, ViewerAccount }) => {
    const [notification, setNotification] = useState(notificationData);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State cho các trường có thể chỉnh sửa
    const [tempTitle, setTempTitle] = useState(notification?.title || DEFAULT_TEXT);
    const [tempContent, setTempContent] = useState(notification?.content || DEFAULT_TEXT);
    const [tempCreatorName, setTempCreatorName] = useState(notification?.creatorName || DEFAULT_TEXT);
    const [tempSendto, setTempSendto] = useState(notification?.sendto || 'public');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Permissions ---
    const isAdmin = ViewerAccount?.role === 'admin';
    const canEditContent = isAdmin; // Chỉ admin mới sửa được nội dung
    const isOwnerOfResponse = (responseUserName) => ViewerAccount?.username === responseUserName; // Cho phép chủ comment xóa

    // --- States cho các tab tương tác ---
    const [activeInteractionTab, setActiveInteractionTab] = useState('view');
    const [interactionCounts, setInteractionCounts] = useState({ view: 0, like: 0, dislike: 0, starred: 0, receive: 0, response: 0 });
    const [currentInteractionList, setCurrentInteractionList] = useState([]);
    const [isLoadingInteractions, setIsLoadingInteractions] = useState(false);
    const [interactionError, setInteractionError] = useState('');

    // --- State cho tương tác của người dùng hiện tại (Like/Dislike/Starred) ---
    const [userLikeStatus, setUserLikeStatus] = useState('none'); // 'like', 'dislike', 'none'
    const [userStarredStatus, setUserStarredStatus] = useState(false); // true/false

    // State cho thêm người nhận/bình luận
    const [newRecipientId, setNewRecipientId] = useState(''); // Cho tab Receive
    const [newComment, setNewComment] = useState(''); // Cho tab Response


    // --- Hàm fetch số lượng và danh sách tương tác cho từng tab ---
    const fetchInteractionData = async (tabType) => {
        if (!notification?.announcementId) return;

        setIsLoadingInteractions(true);
        setInteractionError('');
        setCurrentInteractionList([]);

        let apiPath;
        let payload = { announcementId: notification.announcementId }; // Base payload
        let responseData; // Để lưu response.data

        try {
            let response;
            if (tabType === 'response') {
                apiPath = '/api/GetList/getResponseNotification'; // Backend API nhận announcementId
                response = await axios.post(apiPath, payload, { withCredentials: true });
                responseData = response.data;
            } else if (tabType === 'receive') {
                apiPath = '/api/GetList/getReceiveResidents'; // Backend API nhận announcementId
                response = await axios.post(apiPath, payload, { withCredentials: true });
                responseData = response.data;
            } else { // view, like, dislike, starred
                apiPath = '/api/GetList/getInteractNotification'; // Backend API nhận notificationId và typeInteract
                response = await axios.post(apiPath, { ...payload, typeInteract: tabType }, { withCredentials: true });
                responseData = response.data;
            }

            if (Array.isArray(responseData)) {
                // Sắp xếp theo thời gian mới nhất lên đầu
                const sortedList = responseData.sort((a, b) => {
                    const dateA = new Date(a.responseTime || a.createdAt); // responseTime cho Interact/Response, createdAt cho Receive
                    const dateB = new Date(b.responseTime || b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
                setCurrentInteractionList(sortedList);
                setInteractionCounts(prev => ({ ...prev, [tabType]: sortedList.length }));

                // Đặc biệt cho Like/Dislike/Starred: Kiểm tra tương tác của người dùng hiện tại
                if (['like', 'dislike', 'starred'].includes(tabType)) {
                    const currentUserInteraction = sortedList.find(item => item.userName === ViewerAccount?.username);
                    if (tabType === 'like') setUserLikeStatus(currentUserInteraction ? 'like' : 'none');
                    else if (tabType === 'dislike') setUserLikeStatus(currentUserInteraction ? 'dislike' : 'none');
                    else if (tabType === 'starred') setUserStarredStatus(!!currentUserInteraction);
                }

            } else if (typeof responseData === 'string' && responseData.includes("No ")) {
                setInteractionCounts(prev => ({ ...prev, [tabType]: 0 }));
                setCurrentInteractionList([]);
            } else {
                throw new Error("Dữ liệu tương tác không hợp lệ từ server.");
            }
        } catch (err) {
            console.error(`Error fetching ${tabType} interactions:`, err);
            setInteractionCounts(prev => ({ ...prev, [tabType]: 0 }));
            setCurrentInteractionList([]);
            if (err.response?.status === 403) {
                setInteractionError("Bạn không có quyền xem danh sách này.");
            } else {
                setInteractionError(`Lỗi tải ${tabType}: ${err.response?.data?.message || err.message}`);
            }
        } finally {
            setIsLoadingInteractions(false);
        }
    };


    // --- useEffect: Đồng bộ state, fetch data khi mở popup ---
    useEffect(() => {
        setNotification(notificationData);
        setTempTitle(notificationData?.title || DEFAULT_TEXT);
        setTempContent(notificationData?.content || DEFAULT_TEXT);
        setTempCreatorName(notificationData?.creatorName || DEFAULT_TEXT);
        setTempSendto(notificationData?.sendto || 'public');

        setIsEditing(false);
        setIsLoading(false);
        setErrorMessage('');
        setSuccessMessage('');

        // Ghi nhận lượt xem khi mở thông báo
        const registerView = async () => {
            if (!notificationData?.announcementId || !ViewerAccount?.username) return;
            try {
                // API createInteractNotification (POST) nhận notificationId và typeInteract
                await axios.post(
                    'http://localhost:8080/api/update/createInteractNotification',
                    { notificationId: notificationData.announcementId, typeInteract: 'view' },
                    { withCredentials: true }
                );
                // Sau khi đăng ký view thành công, cập nhật count
                fetchInteractionData('view');
            } catch (err) {
                // console.error("Failed to register view:", err);
                // Nếu lỗi 400 (đã tồn tại), bỏ qua
                if (err.response?.status !== 400) {
                     console.error("Failed to register view:", err);
                }
            }
        };

        registerView();
        // Fetch data cho tất cả các tab để lấy count ban đầu
        ['view', 'like', 'dislike', 'starred', 'response'].forEach(tab => fetchInteractionData(tab));
        if (notificationData?.sendto === 'private') { // Chỉ fetch receive nếu là thông báo riêng tư
            fetchInteractionData('receive');
        }

    }, [notificationData, ViewerAccount]);


    // --- Hàm xử lý Save (khi admin sửa) ---
    const handleSave = async () => {
        if (!isAdmin) { setErrorMessage("Bạn không có quyền chỉnh sửa."); return; }
        if (!notification.announcementId) { setErrorMessage("Mã thông báo không tồn tại."); return; }
        if (!tempTitle.trim()) { setErrorMessage("Tiêu đề không được để trống."); return; }
        if (!tempContent.trim()) { setErrorMessage("Nội dung không được để trống."); return; }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const updateDTO = {
            announcementId: notification.announcementId,
            title: tempTitle,
            content: tempContent,
            creatorName: tempCreatorName.trim() || null,
            sendto: tempSendto,
            type: notification.type, // Type không được sửa, gửi lại type cũ
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/changenotification', // API update notification
                updateDTO,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setSuccessMessage("✅ Cập nhật thông báo thành công!");
                // Cập nhật local state với dữ liệu mới từ API nếu API trả về DTO
                // Nếu API chỉ trả về message, cập nhật local state thủ công
                setNotification(prev => ({ ...prev, ...updateDTO }));
                setIsEditing(false);
                if (refetchNotifications) refetchNotifications(); // Refresh bảng chính
            } else {
                setErrorMessage(response.data?.message || response.data || "Lỗi cập nhật.");
            }
        } catch (error) {
            console.error("Error updating notification:", error);
            setErrorMessage(error.response?.data?.message || error.response?.data || `Lỗi ${error.response?.status}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Hàm xử lý tương tác (Like, Dislike, Starred) ---
    const handleInteraction = async (interactionType) => { // 'like', 'dislike', 'starred'
        if (!ViewerAccount?.username || !notification?.announcementId) {
            setInteractionError("Vui lòng đăng nhập để tương tác.");
            return;
        }
        if (!isAdmin && interactionType === 'view') return; // Non-admin views are auto-tracked, not clicked.

        let apiCallType = 'create'; // Mặc định là tạo mới
        let currentStatus = (interactionType === 'like' || interactionType === 'dislike') ? userLikeStatus : userStarredStatus;

        if (currentStatus === interactionType || (interactionType === 'starred' && currentStatus === true)) {
            apiCallType = 'delete'; // Bỏ chọn nếu click lại chính nó
        } else if (userLikeStatus !== 'none' && (interactionType === 'like' || interactionType === 'dislike')) {
            apiCallType = 'update'; // Chuyển từ like sang dislike hoặc ngược lại
        }

        setIsLoading(true); // Dùng loading chung cho popup
        setInteractionError('');
        try {
            const payload = {
                notificationId: notification.announcementId,
                typeInteract: interactionType,
                // userName: viewerAccount.username // Backend sẽ tự lấy từ Authentication
            };

            let response;
            if (apiCallType === 'create') {
                response = await axios.post('http://localhost:8080/api/update/createInteractNotification', payload, { withCredentials: true });
            } else if (apiCallType === 'delete') {
                // API deleteInteractNotification (POST) nhận typeInteract
                response = await axios.post('http://localhost:8080/api/update/deleteInteractNotification', payload, { withCredentials: true });
            } else if (apiCallType === 'update') {
                // API updateInteractNotification (Cần tạo ở backend)
                // Giả định nó là POST và nhận typeInteract và oldTypeInteract (hoặc chỉ typeInteract mới)
                // Vì API backend của bạn không có updateInteractNotification, chúng ta sẽ làm Delete cũ và Create mới
                if (!window.confirm("Bạn có muốn thay đổi loại tương tác không?")) return;
                await axios.post('http://localhost:8080/api/update/deleteInteractNotification', { notificationId: notification.announcementId, typeInteract: userLikeStatus }, { withCredentials: true });
                response = await axios.post('http://localhost:8080/api/update/createInteractNotification', payload, { withCredentials: true });
            }

            if (response.status === 200) {
                // Cập nhật UI ngay lập tức
                if (interactionType === 'like') setUserLikeStatus(apiCallType === 'delete' ? 'none' : 'like');
                else if (interactionType === 'dislike') setUserLikeStatus(apiCallType === 'delete' ? 'none' : 'dislike');
                else if (interactionType === 'starred') setUserStarredStatus(apiCallType === 'delete' ? false : true);

                // Sau đó fetch lại số lượng và danh sách cho tab hiện tại (và các tab khác nếu cần)
                fetchInteractionData(activeInteractionTab);
                // fetchInteractionData('like'); fetchInteractionData('dislike'); fetchInteractionData('starred'); // Cập nhật các count
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi tương tác.");
            }
        } catch (error) {
            console.error(`Error interacting (${interactionType}):`, error);
            setInteractionError(error.response?.data?.message || error.response?.data || `Lỗi ${error.response?.status}`);
        } finally {
            setIsLoading(false);
        }
    };


    // --- Hàm quản lý người nhận riêng tư (thêm/xóa) ---
    const handleAddReceiveRecipient = async () => { // Bỏ newRecipientId parameter, lấy từ state
        if (!newRecipientId.trim()) { setInteractionError("Vui lòng nhập Mã cư dân."); return; }
        if (!notification?.announcementId) { setInteractionError("Mã thông báo không tồn tại."); return; }
        if (currentInteractionList.some(r => r.residentId === newRecipientId)) { setInteractionError("Mã cư dân này đã có trong danh sách."); return; }

        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/createReceiveNotification',
                { residentId: newRecipientId, notificationId: notification.announcementId },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data) {
                setNewRecipientId('');
                await fetchInteractionData('receive'); // Fetch lại danh sách nhận
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi khi thêm người nhận.");
            }
        } catch (error) {
            console.error("Error adding recipient:", error);
            setInteractionError(error.response?.data?.message || error.response.data || `Lỗi: ${error.response.status}`);
        } finally {
            setIsLoadingInteractions(false);
        }
    };

    const handleDeleteReceiveRecipient = async (residentIdToDelete) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa cư dân ${residentIdToDelete} khỏi danh sách nhận không?`)) return;
        if (!residentIdToDelete || !notification?.announcementId) { setInteractionError("Thiếu thông tin để xóa."); return; }

        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.post( // API delete là POST, nhận body
                'http://localhost:8080/api/update/deleteReceiveNotification',
                { residentId: residentIdToDelete, notificationId: notification.announcementId }, // Gửi residentId và announcementId
                { withCredentials: true }
            );

            if (response.status === 200) {
                await fetchInteractionData('receive'); // Fetch lại danh sách nhận
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi khi xóa người nhận.");
            }
        } catch (error) {
            console.error("Error deleting recipient:", error);
            setInteractionError(error.response?.data?.message || error.response.data || `Lỗi: ${error.response.status}`);
        } finally {
            setIsLoadingInteractions(false);
        }
    };


    // --- Hàm quản lý bình luận (Thêm bình luận mới) ---
    const handleAddResponse = async () => { // Bỏ commentContent parameter, lấy từ state
        if (!newComment.trim()) { setInteractionError("Bình luận không được để trống."); return; }
        if (!notification?.announcementId || !ViewerAccount?.username) { setInteractionError("Không đủ thông tin để bình luận."); return; }

        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/createresponseNotification', // API tạo bình luận
                {
                    notificationId: notification.announcementId,
                    responseContent: newComment.trim(),
                },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setNewComment(''); // Xóa input bình luận
                await fetchInteractionData('response'); // Fetch lại danh sách bình luận
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi khi thêm bình luận.");
            }
        } catch (error) {
            console.error("Error adding response:", error);
            setInteractionError(error.response?.data?.message || error.response.data || `Lỗi: ${error.response.status}`);
        } finally {
            setIsLoadingInteractions(false);
        }
    };

    // --- Hàm quản lý bình luận (Xóa bình luận) ---
    const handleDeleteResponse = async (responseId, responseUserName) => {
        if (!window.confirm(`Xác nhận xóa bình luận này của ${responseUserName}?`)) return;
        if (!responseId || !notification?.announcementId) { setInteractionError("Thiếu thông tin để xóa bình luận."); return; }

        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.post( // API deleteResponseNotification là POST, nhận body
                'http://localhost:8080/api/update/deleteresponseNotification',
                { id: responseId, userName: responseUserName }, // API cần id và userName (Backend sẽ kiểm tra quyền)
                { withCredentials: true }
            );
            if (response.status === 200) {
                await fetchInteractionData('response'); // Fetch lại danh sách bình luận
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi khi xóa bình luận.");
            }
        } catch (error) {
            console.error("Error deleting response:", error);
            setInteractionError(error.response?.data?.message || error.response.data || `Lỗi: ${error.response?.status}`);
        } finally {
            setIsLoadingInteractions(false);
        }
    };


    return (
        <div className="notification-detail-popup-container">
            {/* Nút thoát */}
            <button className="detail-back-btn" onClick={onClose} title="Quay lại danh sách">
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* Thông báo lỗi/thành công */}
            {errorMessage && <p className="detail-error-message">{errorMessage}</p>}
            {successMessage && <p className="detail-success-message">{successMessage}</p>}

            {/* Header */}
            <div className="detail-header">
                <FontAwesomeIcon icon={getTypeIcon(notification.type)} className="detail-type-icon" />
                <div className="detail-header-text">
                    <h3>Thông báo {notification.type || DEFAULT_TEXT}</h3>
                </div>
                {canEditContent && !isEditing ? ( // Nút chỉnh sửa
                    <button className="detail-edit-btn" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                    </button>
                ) : null}
            </div>

            {/* Thông tin bài báo */}
            <div className="detail-info-block">
                {isEditing ? (
                    <input type="text" className="detail-title-input" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="Tiêu đề" disabled={isLoading} />
                ) : (
                    <h2 className="detail-title">{notification.title || DEFAULT_TEXT}</h2>
                )}
                <p className="detail-id">Mã: <strong>{notification.announcementId || DEFAULT_TEXT}</strong></p>
                <p className="detail-creator">Người tạo: {notification.creatorName || DEFAULT_TEXT}</p>
                <p className="detail-created-at">Ngày tạo: {formatDisplayDateTime(notification.createdAt)}</p>
                <p className="detail-sendto">Đối tượng: {notification.sendto === 'public' ? 'Công khai' : 'Riêng tư'}</p>
            </div>

            {/* Nội dung bài báo */}
            <div className="detail-content-block">
                {isEditing ? (
                    <RichTextEditor data={tempContent} onChange={setTempContent} disabled={isLoading} />
                ) : (
                    <div className="detail-content-display" dangerouslySetInnerHTML={{ __html: notification.content || '<p>Không có nội dung.</p>' }}></div>
                )}
            </div>

            {/* Nút lưu/hủy khi chỉnh sửa */}
            {isEditing && (
                <div className="detail-edit-actions">
                    <button className="detail-cancel-btn" onClick={() => { setIsEditing(false); setTempTitle(notification.title || DEFAULT_TEXT); setTempContent(notification.content || DEFAULT_TEXT); setTempCreatorName(notification.creatorName || DEFAULT_TEXT); setErrorMessage(''); setSuccessMessage(''); }}>Hủy</button>
                    <button className="detail-save-btn" onClick={handleSave} disabled={isLoading}>{isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Lưu'}</button>
                </div>
            )}

            {/* Icon tương tác dưới bên phải */}
            {!isEditing && ( // Chỉ hiển thị khi không ở chế độ chỉnh sửa
                <div className="detail-action-icons">
                    <button className={`action-icon-btn ${userLikeStatus === 'like' ? 'active' : ''}`} onClick={() => handleInteraction('like')} title="Thích">
                        <FontAwesomeIcon icon={faThumbsUp} /> {interactionCounts.like}
                    </button>
                    <button className={`action-icon-btn ${userLikeStatus === 'dislike' ? 'active' : ''}`} onClick={() => handleInteraction('dislike')} title="Không thích">
                        <FontAwesomeIcon icon={faThumbsDown} /> {interactionCounts.dislike}
                    </button>
                    <button className={`action-icon-btn ${userStarredStatus ? 'active' : ''}`} onClick={() => handleInteraction('starred')} title="Quan tâm">
                        <FontAwesomeIcon icon={userStarredStatus ? faStar : faStarRegular} /> {interactionCounts.starred}
                    </button>
                </div>
            )}

            {/* Danh sách các tương tác (Tabs) */}
            <div className="detail-interaction-tabs">
                <div className="interaction-tab-buttons">
                    <button className={`tab-btn ${activeInteractionTab === 'view' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('view')}>
                        <FontAwesomeIcon icon={faEye} /> Xem ({interactionCounts.view})
                    </button>
                    <button className={`tab-btn ${activeInteractionTab === 'like' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('like')}>
                        <FontAwesomeIcon icon={faThumbsUp} /> Thích ({interactionCounts.like})
                    </button>
                    <button className={`tab-btn ${activeInteractionTab === 'dislike' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('dislike')}>
                        <FontAwesomeIcon icon={faThumbsDown} /> Không thích ({interactionCounts.dislike})
                    </button>
                    <button className={`tab-btn ${activeInteractionTab === 'starred' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('starred')}>
                        <FontAwesomeIcon icon={faStar} /> Quan tâm ({interactionCounts.starred})
                    </button>
                    {notification.sendto === 'private' && ( // Tab "Nhận" chỉ cho thông báo riêng tư
                        <button className={`tab-btn ${activeInteractionTab === 'receive' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('receive')}>
                            <FontAwesomeIcon icon={faUsers} /> Nhận ({interactionCounts.receive})
                        </button>
                    )}
                    <button className={`tab-btn ${activeInteractionTab === 'response' ? 'active' : ''}`} onClick={() => setActiveInteractionTab('response')}>
                        <FontAwesomeIcon icon={faCommentDots} /> Bình luận ({interactionCounts.response})
                    </button>
                </div>

                <div className="interaction-list-display">
                    {isLoadingInteractions ? (
                        <p className="loading-text"><FontAwesomeIcon icon={faSpinner} spin /> Đang tải danh sách...</p>
                    ) : interactionError ? (
                        <p className="error-message">{interactionError}</p>
                    ) : currentInteractionList.length === 0 ? (
                        <p className="no-data-text">Chưa có tương tác nào.</p>
                    ) : (
                        <ul className="interaction-list">
                            {currentInteractionList.map((item) => (
                                <li key={item.id} className="interaction-item">
                                    {activeInteractionTab === 'view' && (
                                        <>
                                            <FontAwesomeIcon icon={faEye} className="item-icon" />
                                            <span>{item.userName} ({item.userRole}) đã xem vào {formatDisplayDateTime(item.responseTime)}</span>
                                        </>
                                    )}
                                    {(activeInteractionTab === 'like' || activeInteractionTab === 'dislike' || activeInteractionTab === 'starred') && (
                                        <>
                                            <FontAwesomeIcon icon={activeInteractionTab === 'like' ? faThumbsUp : activeInteractionTab === 'dislike' ? faThumbsDown : faStar} className="item-icon" />
                                            <span>{item.userName} ({item.userRole}) đã {activeInteractionTab} vào {formatDisplayDateTime(item.responseTime)}</span>
                                        </>
                                    )}
                                    {activeInteractionTab === 'receive' && (
                                        <>
                                            <FontAwesomeIcon icon={faUser} className="item-icon" />
                                            <span>{item.fullName} (Mã: {item.residentId})</span>
                                            {isAdmin && ( // Admin có thể xóa người nhận
                                                <button className="delete-interaction-btn" onClick={() => handleDeleteReceiveRecipient(item.residentId, item.notificationId)}> {/* Truyền notificationId */}
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {activeInteractionTab === 'response' && (
                                        <>
                                            <div className="response-header">
                                                <span className="response-user">{item.userName} ({item.userRole})</span>
                                                <span className="response-time">{formatDisplayDateTime(item.responseTime)}</span>
                                            </div>
                                            <p className="response-content">{item.responseContent}</p>
                                            {(isAdmin || isOwnerOfResponse(item.userName)) && ( // Admin hoặc chủ comment có thể xóa
                                                <button className="delete-interaction-btn" onClick={() => handleDeleteResponse(item.id, item.userName)}> {/* Truyền responseId và userName */}
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Form thêm người nhận (cho tab Receive) */}
                    {activeInteractionTab === 'receive' && isAdmin && !isLoadingInteractions && (
                        <div className="add-recipient-form">
                            <input type="text" value={newRecipientId} onChange={(e) => setNewRecipientId(e.target.value)} placeholder="Mã cư dân mới" />
                            <button onClick={handleAddReceiveRecipient} disabled={isLoadingInteractions}>
                                {isLoadingInteractions ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPlus} />} Thêm
                            </button>
                        </div>
                    )}
                     {/* Form thêm bình luận (cho tab Response) */}
                    {activeInteractionTab === 'response' && !isLoadingInteractions && (
                        <div className="add-response-form">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Viết bình luận của bạn..." rows="3"></textarea>
                            <button onClick={handleAddResponse} disabled={isLoadingInteractions}>
                                {isLoadingInteractions ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Bình luận'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailPopUp;