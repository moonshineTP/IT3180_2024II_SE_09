import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faCalendarAlt, faSpinner,
    faThumbsUp, faThumbsDown, faStar, faEye, faCommentDots, faUsers, faPlus, faTrash, faChevronLeft,
    faUser, faTools, faExclamationTriangle, faEdit, faBookOpen, faPaperPlane // Added faPaperPlane for email send button
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import RichTextEditor from '../../Common/RichTextEditor';
import './NotificationDetailPopUp.css';


const DEFAULT_TEXT = 'N/A';
const DEFAULT_DATE_TEXT = 'N/A';

const formatDisplayDateTime = (dateTimeString) => {
    if (!dateTimeString) return DEFAULT_DATE_TEXT;
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
               date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return DEFAULT_TEXT; }
};

const getTypeIcon = (type) => {
    switch (type) {
        case 'administrative': return faBookOpen;
        case 'maintenance': return faTools;
        case 'emergency': return faExclamationTriangle;
        case 'event': return faCalendarAlt;
        default: return faBell;
    }
};


const NotificationDetailPopUp = ({ notificationData, onClose, refetchNotifications, ViewerAccount, onOpenPopUp }) => {
    const [notification, setNotification] = useState(notificationData);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // General loading for popup interactions

    const [tempTitle, setTempTitle] = useState(notification?.title || DEFAULT_TEXT);
    const [tempContent, setTempContent] = useState(notification?.content || DEFAULT_TEXT);
    const [tempCreatorName, setTempCreatorName] = useState(notification?.creatorName || DEFAULT_TEXT);
    const [tempSendto, setTempSendto] = useState(notification?.sendto || 'public');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const isAdmin = ViewerAccount?.role === 'admin';
    const canEditContent = isAdmin;
    const isOwnerOfResponse = (responseUserName) => ViewerAccount?.username === responseUserName;

    const [activeInteractionTab, setActiveInteractionTab] = useState('view');
    const [interactionCounts, setInteractionCounts] = useState({ view: 0, like: 0, dislike: 0, starred: 0, receive: 0, response: 0 });
    const [currentInteractionList, setCurrentInteractionList] = useState([]);
    const [isLoadingInteractions, setIsLoadingInteractions] = useState(false); // Loading for interaction lists
    const [interactionError, setInteractionError] = useState('');

    const [userLikeStatus, setUserLikeStatus] = useState('none');
    const [userStarredStatus, setUserStarredStatus] = useState(false);

    const [newRecipientId, setNewRecipientId] = useState('');
    const [newComment, setNewComment] = useState('');

    // --- NEW STATE FOR LOADING ACCOUNT/RESIDENT DETAILS ---
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailFetchError, setDetailFetchError] = useState('');

    // --- NEW STATE FOR EMAIL SENDING FEATURE ---
    const [isLoadingEmailSend, setIsLoadingEmailSend] = useState(false);
    const [emailSendSuccessMessage, setEmailSendSuccessMessage] = useState('');
    const [emailSendErrorMessage, setEmailSendErrorMessage] = useState('');


    const fetchInteractionData = useCallback(async (tabType) => {
        if (!notification?.announcementId) return;

        setIsLoadingInteractions(true);
        setInteractionError('');
        setCurrentInteractionList([]);
        setEmailSendErrorMessage(''); // Clear email error when changing tabs/fetching interactions
        setEmailSendSuccessMessage('');

        let apiPath;
        let payload = { announcementId: notification.announcementId };

        try {
            let response;
            if (tabType === 'response') {
                apiPath = 'http://localhost:8080/api/gettarget/getResponseNotification';
                response = await axios.post(apiPath, payload, { withCredentials: true });
            } else if (tabType === 'receive') {
                apiPath = 'http://localhost:8080/api/gettarget/getReceiveResidents';
                response = await axios.post(apiPath, payload, { withCredentials: true });
            } else { // view, like, dislike, starred
                apiPath = 'http://localhost:8080/api/gettarget/getInteractNotification';
                response = await axios.post(apiPath, { notificationId: notification.announcementId, typeInteract: tabType }, { withCredentials: true });
            }
            const fetchedList = Array.isArray(response.data) ? response.data : [];
            const sortedList = fetchedList.sort((a, b) => {
                const dateA = new Date(a.responseTime || a.createdAt || 0);
                const dateB = new Date(b.responseTime || b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });

            setCurrentInteractionList(sortedList);
            setInteractionError('');

        } catch (err) {
            console.error(`Error fetching ${tabType} interactions:`, err);
            setInteractionCounts(prev => ({ ...prev, [tabType]: 0 }));
            setCurrentInteractionList([]);
            if (err.response?.status === 403) {
                setInteractionError("Bạn không có quyền xem danh sách này.");
            } else if (err.response?.data?.message) {
                setInteractionError(err.response.data.message);
            } else {
                setInteractionError(`Lỗi tải ${tabType}: ${err.message}`);
            }
        } finally {
            setIsLoadingInteractions(false);
        }
    }, [notification?.announcementId]);

    const fetchAllCountsAndUserStatus = useCallback(async () => {
        if (!notification?.announcementId) return;

        setIsLoading(true);
        setInteractionError('');
        setEmailSendErrorMessage(''); // Clear email error when refetching all counts
        setEmailSendSuccessMessage('');

        try {
            const fetchApiAndNormalize = async (apiCallPromise) => {
                try {
                    const res = await apiCallPromise;
                    return Array.isArray(res.data) ? res.data : [];
                } catch (err) {
                    console.error(`Error fetching for counts:`, err);
                    return [];
                }
            };

            const [viewList, likeList, dislikeList, starredList, responseList, receiveList] = await Promise.all([
                fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getInteractNotification', { notificationId: notification.announcementId, typeInteract: 'view' }, { withCredentials: true })),
                fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getInteractNotification', { notificationId: notification.announcementId, typeInteract: 'like' }, { withCredentials: true })),
                fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getInteractNotification', { notificationId: notification.announcementId, typeInteract: 'dislike' }, { withCredentials: true })),
                fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getInteractNotification', { notificationId: notification.announcementId, typeInteract: 'starred' }, { withCredentials: true })),
                fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getResponseNotification', { announcementId: notification.announcementId }, { withCredentials: true })),
                notification.sendto === 'private' ? fetchApiAndNormalize(axios.post('http://localhost:8080/api/gettarget/getReceiveResidents', { announcementId: notification.announcementId }, { withCredentials: true })) : Promise.resolve([]),
            ]);

            const newCounts = {
                view: viewList.length,
                like: likeList.length,
                dislike: dislikeList.length,
                starred: starredList.length,
                response: responseList.length,
                receive: receiveList.length,
            };
            setInteractionCounts(newCounts);

            const userLiked = likeList.some(item => item.userName === ViewerAccount?.username);
            const userDisliked = dislikeList.some(item => item.userName === ViewerAccount?.username);
            const userStarred = starredList.some(item => item.userName === ViewerAccount?.username);

            if (userLiked) { setUserLikeStatus('like'); }
            else if (userDisliked) { setUserLikeStatus('dislike'); }
            else { setUserLikeStatus('none'); }
            setUserStarredStatus(userStarred);

            // Re-fetch current tab's interaction list to ensure counts are updated
            fetchInteractionData(activeInteractionTab);

        } catch (error) {
            console.error("Error fetching all counts and user status:", error);
            setInteractionError("Không thể tải dữ liệu tương tác.");
            setInteractionCounts({ view: 0, like: 0, dislike: 0, starred: 0, receive: 0, response: 0 });
            setUserLikeStatus('none');
            setUserStarredStatus(false);
        } finally {
            setIsLoading(false);
        }
    }, [notification, ViewerAccount, activeInteractionTab, fetchInteractionData]);


    useEffect(() => {
        setNotification(notificationData);
        setTempTitle(notificationData?.title || DEFAULT_TEXT);
        setTempContent(notificationData?.content || DEFAULT_TEXT);
        setTempCreatorName(notificationData?.creatorName || DEFAULT_TEXT);
        setTempSendto(notificationData?.sendto || 'public');

        setIsEditing(false);
        setErrorMessage('');
        setSuccessMessage('');
        setDetailFetchError('');
        setEmailSendErrorMessage(''); // Clear email error on new notification load
        setEmailSendSuccessMessage('');


        const registerViewAndCheckStatus = async () => {
            if (!notificationData?.announcementId || !ViewerAccount?.username) return;
            try {
                // Check if user has already viewed
                const viewResponse = await axios.post(
                    'http://localhost:8080/api/gettarget/getInteractNotification',
                    { notificationId: notificationData.announcementId, typeInteract: 'view' },
                    { withCredentials: true }
                );
                const hasViewed = Array.isArray(viewResponse.data) && viewResponse.data.some(item => item.userName === ViewerAccount.username);

                // If not viewed, register view
                if (!hasViewed) {
                    await axios.post(
                        'http://localhost:8080/api/update/createInteractNotification',
                        { notificationId: notificationData.announcementId, typeInteract: 'view' },
                        { withCredentials: true }
                    );
                }
            } catch (err) {
                console.error("Failed to register view or check status:", err);
                // Status 400 might mean 'already viewed' or invalid input, not always an error
                if (err.response?.status !== 400) {
                     console.error("Failed to register view:", err);
                }
            } finally {
                // Always fetch all counts and user status after initial view attempt
                fetchAllCountsAndUserStatus();
            }
        };
        registerViewAndCheckStatus();
    }, [notificationData, ViewerAccount, fetchAllCountsAndUserStatus]);


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
            type: notification.type,
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/changenotification',
                updateDTO,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setSuccessMessage("✅ Cập nhật thông báo thành công!");
                setNotification(prev => ({ ...prev, ...updateDTO }));
                setIsEditing(false);
                if (refetchNotifications) refetchNotifications();
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
    const handleInteraction = async (interactionType) => {
        if (!ViewerAccount?.username || !notification?.announcementId) {
            setInteractionError("Vui lòng đăng nhập để tương tác.");
            return;
        }
        let action = 'create';
        let currentStatus = (interactionType === 'like' || interactionType === 'dislike') ? userLikeStatus : userStarredStatus;

        if (currentStatus === interactionType || (interactionType === 'starred' && currentStatus === true)) {
            action = 'delete';
        } else if (userLikeStatus !== 'none' && (interactionType === 'like' || interactionType === 'dislike')) {
            action = 'update';
        }
        setIsLoading(true);
        setInteractionError('');
        try {
            const payload = { notificationId: notification.announcementId, typeInteract: interactionType };
            if (action === 'create') {
                await axios.post('http://localhost:8080/api/update/createInteractNotification', payload, { withCredentials: true });
            } else if (action === 'delete') {
                await axios.delete('http://localhost:8080/api/update/deleteInteractNotification', {data : payload, withCredentials: true });
            } else if (action === 'update') {
                const oldType = userLikeStatus;
                await axios.delete('http://localhost:8080/api/update/deleteInteractNotification', {data:{ notificationId: notification.announcementId, typeInteract: oldType }, withCredentials: true });
                await axios.post('http://localhost:8080/api/update/createInteractNotification', payload, { withCredentials: true });
            }
            await fetchAllCountsAndUserStatus();
        } catch (error) {
            console.error(`Error interacting (${interactionType}):`, error);
            setInteractionError(error.response?.data?.message || error.response?.data || `Lỗi ${error.response?.status}`);
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddReceiveRecipient = async () => {
        if (!newRecipientId.trim()) { setInteractionError("Vui lòng nhập Mã cư dân."); return; }
        if (!notification?.announcementId) { setInteractionError("Mã thông báo không tồn tại."); return; }
        if (currentInteractionList.some(r => r.residentId === newRecipientId)) { setInteractionError("Mã cư dân này đã có trong danh sách."); return; }
        setIsLoadingInteractions(true);
        setInteractionError('');
        setEmailSendErrorMessage(''); // Clear email error when adding recipient
        setEmailSendSuccessMessage('');

        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/createReceiveNotification',
                { residentId: newRecipientId, notificationId: notification.announcementId },
                { withCredentials: true }
            );
            if (response.status === 200 && response.data) {
                setNewRecipientId('');
                await fetchInteractionData('receive'); // Re-fetch the receive list to update counts/display
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
        setEmailSendErrorMessage(''); // Clear email error when deleting recipient
        setEmailSendSuccessMessage('');

        try {
            const response = await axios.delete(
                'http://localhost:8080/api/update/deleteReceiveNotification',{
                data:
                { residentId: residentIdToDelete, notificationId: notification.announcementId },
                withCredentials: true }
            );
            if (response.status === 200) {
                await fetchInteractionData('receive'); // Re-fetch the receive list to update counts/display
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
    const handleAddResponse = async () => {
        if (!newComment.trim()) { setInteractionError("Bình luận không được để trống."); return; }
        if (!notification?.announcementId || !ViewerAccount?.username) { setInteractionError("Không đủ thông tin để bình luận."); return; }
        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/createresponseNotification',
                {
                    notificationId: notification.announcementId,
                    responseContent: newComment.trim(),
                },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setNewComment('');
                await fetchInteractionData('response');
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
    const handleDeleteResponse = async (responseId, responseUserName) => {
        if (!window.confirm(`Xác nhận xóa bình luận này của ${responseUserName}?`)) return;
        if (!responseId || !notification?.announcementId) { setInteractionError("Thiếu thông tin để xóa bình luận."); return; }
        setIsLoadingInteractions(true);
        setInteractionError('');
        try {
            const response = await axios.delete(
                'http://localhost:8080/api/update/deleteresponseNotification',{
                data:{ id: responseId, userName: responseUserName },
                withCredentials: true }
            );
            if (response.status === 200) {
                await fetchInteractionData('response');
            } else {
                setInteractionError(response.data?.message || response.data || "Lỗi khi xóa bình luận.");
            }
        } catch (error) {
            console.error("Error deleting response:", error);
            setInteractionError(error.response?.data?.message || error.response.data || `Lỗi: ${error.response.status}`);
        } finally {
            setIsLoadingInteractions(false);
        }
    };

    // --- HANDLER TO FETCH ACCOUNT DETAILS AND OPEN POPUP ---
    const handleUserClick = async (username) => {
        if (!username || typeof onOpenPopUp !== 'function') return;
        if (isLoadingDetails) return;

        setIsLoadingDetails(true);
        setDetailFetchError('');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/gettarget/account',
                { username: username },
                { withCredentials: true }
            );
            if (response.data) {
                onOpenPopUp('account', response.data);
            } else {
                setDetailFetchError('Không tìm thấy thông tin tài khoản.');
            }
        } catch (err) {
            console.error("Error fetching account details:", err);
            setDetailFetchError(err.response?.data?.message || err.response?.data || 'Lỗi tải thông tin tài khoản.');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // --- HANDLER TO FETCH RESIDENT DETAILS AND OPEN POPUP ---
    const handleResidentClick = async (residentId) => {
        if (!residentId || typeof onOpenPopUp !== 'function') return;
        if (isLoadingDetails) return;

        setIsLoadingDetails(true);
        setDetailFetchError('');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/gettarget/getResident',
                { residentId: residentId },
                { withCredentials: true }
            );
            if (response.data) {
                onOpenPopUp('resident', response.data);
            } else {
                setDetailFetchError('Không tìm thấy thông tin cư dân.');
            }
        } catch (err) {
            console.error("Error fetching resident details:", err);
            setDetailFetchError(err.response?.data?.message || err.response?.data || 'Lỗi tải thông tin cư dân.');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // --- NEW: HANDLER FOR SENDING EMAILS ---
    const handleSendEmailToResidents = async () => {
        setEmailSendSuccessMessage('');
        setEmailSendErrorMessage('');

        if (!isAdmin) {
            setEmailSendErrorMessage("Bạn không có quyền gửi email.");
            return;
        }
        if (notification.sendto !== 'private') {
            setEmailSendErrorMessage("Chỉ có thể gửi email cho thông báo riêng tư.");
            return;
        }
        if (!notification.title || !notification.content) {
            setEmailSendErrorMessage("Tiêu đề và nội dung thông báo không được trống.");
            return;
        }

        // Ensure currentInteractionList is populated with 'receive' data
        if (activeInteractionTab !== 'receive' && interactionCounts.receive === 0) {
            // If not on 'receive' tab and count is 0, fetch it first
            // This case might be rare if the button is only visible on the 'receive' tab.
            // But it's a safety check. For simplicity in UI, we'll assume the button is
            // only enabled/visible when the 'receive' tab is active and its data loaded.
            setEmailSendErrorMessage("Vui lòng chuyển sang tab 'Nhận' để tải danh sách cư dân trước.");
            return;
        }
        if (currentInteractionList.length === 0) {
             setEmailSendErrorMessage("Không có cư dân nào trong danh sách nhận để gửi email.");
             return;
        }

        const residentIdsToSend = currentInteractionList.map(item => item.residentId);

        if (residentIdsToSend.length === 0) {
            setEmailSendErrorMessage("Không tìm thấy mã cư dân nào để gửi email.");
            return;
        }

        setIsLoadingEmailSend(true);

        const requestBody = {
            HtmlContent: notification.content,
            Subject: notification.title,
            ResidentIds: residentIdsToSend,
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/update/sendEmailToResidentsByIds', // Your backend API endpoint
                requestBody,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setEmailSendSuccessMessage("✅ " + response.data);
            } else {
                setEmailSendErrorMessage(response.data?.message || "Đã xảy ra lỗi khi gửi email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailSendErrorMessage(error.response?.data?.message || error.response?.data || `Lỗi: ${error.message}`);
        } finally {
            setIsLoadingEmailSend(false);
            // Optionally clear messages after a delay
            setTimeout(() => {
                setEmailSendSuccessMessage('');
                setEmailSendErrorMessage('');
            }, 5000);
        }
    };


    return (
        <div className="notification-detail-popup-container">
            <button className="detail-back-btn" onClick={onClose} title="Quay lại danh sách">
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {errorMessage && <p className="detail-error-message">{errorMessage}</p>}
            {successMessage && <p className="detail-success-message">{successMessage}</p>}
            {detailFetchError && <p className="detail-error-message small-error">{detailFetchError}</p>}
            {emailSendErrorMessage && <p className="detail-error-message">{emailSendErrorMessage}</p>} {/* NEW: Display email send error */}
            {emailSendSuccessMessage && <p className="detail-success-message">{emailSendSuccessMessage}</p>} {/* NEW: Display email send success */}


            <div className="detail-header">
                <FontAwesomeIcon icon={getTypeIcon(notification.type)} className="detail-type-icon" />
                <div className="detail-header-text">
                    <h3>Thông báo {notification.type || DEFAULT_TEXT}</h3>
                </div>
                {canEditContent && !isEditing ? (
                    <button className="detail-edit-btn" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                    </button>
                ) : null}
            </div>

            <div className="detail-info-block">
                {isEditing ? (
                    <input type="text" className="detail-title-input" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="Tiêu đề" disabled={isLoading} />
                ) : (
                    <h2 className="detail-title">{notification.title || DEFAULT_TEXT}</h2>
                )}
                <p className="detail-id">Mã: <strong>{notification.announcementId || DEFAULT_TEXT}</strong></p>
                <p className="detail-creator">
                    Người tạo:
                    <span
                        className="clickable-username"
                        onClick={() => handleUserClick(notification.creatorName)}
                        title={`Xem chi tiết ${notification.creatorName}`}
                    >
                        {notification.creatorName || DEFAULT_TEXT}
                        {isLoadingDetails && <FontAwesomeIcon icon={faSpinner} spin className="inline-spinner" />}
                    </span>
                </p>
                <p className="detail-created-at">Ngày tạo: {formatDisplayDateTime(notification.createdAt)}</p>
                <p className="detail-created-at">Ngày update: {formatDisplayDateTime(notification.updatedAt)}</p>
                <p className="detail-sendto">Đối tượng: {notification.sendto === 'public' ? 'Công khai' : 'Riêng tư'}</p>
            </div>

            <div className="detail-content-block">
                {isEditing ? (
                    <RichTextEditor data={tempContent} onChange={setTempContent} disabled={isLoading} />
                ) : (
                    <div className="detail-content-display" dangerouslySetInnerHTML={{ __html: notification.content || '<p>Không có nội dung.</p>' }}></div>
                )}
            </div>

            {isEditing && (
                <div className="detail-edit-actions">
                    <button className="detail-cancel-btn" onClick={() => { setIsEditing(false); setTempTitle(notification.title || DEFAULT_TEXT); setTempContent(notification.content || DEFAULT_TEXT); setTempCreatorName(notification.creatorName || DEFAULT_TEXT); setErrorMessage(''); setSuccessMessage(''); }}>Hủy</button>
                    <button className="detail-save-btn" onClick={handleSave} disabled={isLoading}>{isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Lưu'}</button>
                </div>
            )}

            {!isEditing && (
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
                    {notification.sendto === 'private' && (
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
                                <li key={item.id || item.residentId || item.userName + Date.now()} className="interaction-item">
                                    {activeInteractionTab === 'view' && (
                                        <>
                                            <FontAwesomeIcon icon={faEye} className="item-icon" />
                                            <span
                                                className="clickable-username"
                                                onClick={() => handleUserClick(item.userName)}
                                                title={`Xem chi tiết ${item.userName}`}
                                            >
                                                {item.userName} {isLoadingDetails && <FontAwesomeIcon icon={faSpinner} spin className="inline-spinner" />}
                                            </span>
                                            ({item.userRole}) đã xem vào {formatDisplayDateTime(item.responseTime)}
                                        </>
                                    )}
                                    {(activeInteractionTab === 'like' || activeInteractionTab === 'dislike' || activeInteractionTab === 'starred') && (
                                        <>
                                            <FontAwesomeIcon icon={activeInteractionTab === 'like' ? faThumbsUp : activeInteractionTab === 'dislike' ? faThumbsDown : faStar} className="item-icon" />
                                            <span
                                                className="clickable-username"
                                                onClick={() => handleUserClick(item.userName)}
                                                title={`Xem chi tiết ${item.userName}`}
                                            >
                                                {item.userName} {isLoadingDetails && <FontAwesomeIcon icon={faSpinner} spin className="inline-spinner" />}
                                            </span>
                                            ({item.userRole}) đã {activeInteractionTab} vào {formatDisplayDateTime(item.responseTime)}
                                        </>
                                    )}
                                    {activeInteractionTab === 'receive' && (
                                        <>
                                            <FontAwesomeIcon icon={faUser} className="item-icon" />
                                            <span
                                                className="clickable-resident"
                                                onClick={() => handleResidentClick(item.residentId)}
                                                title={`Xem chi tiết cư dân ${item.residentId}`}
                                            >
                                                {item.fullName} (Mã: {item.residentId})
                                                {isLoadingDetails && <FontAwesomeIcon icon={faSpinner} spin className="inline-spinner" />}
                                            </span>
                                            {isAdmin && (
                                                <button className="delete-interaction-btn" onClick={() => handleDeleteReceiveRecipient(item.residentId)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {activeInteractionTab === 'response' && (
                                        <>
                                            <div className="response-header">
                                                <span
                                                    className="response-user clickable-username"
                                                    onClick={() => handleUserClick(item.userName)}
                                                    title={`Xem chi tiết ${item.userName}`}
                                                >
                                                    {item.userName} {isLoadingDetails && <FontAwesomeIcon icon={faSpinner} spin className="inline-spinner" />}
                                                </span>
                                                ({item.userRole})
                                                <span className="response-time">{formatDisplayDateTime(item.responseTime)}</span>
                                            </div>
                                            <p className="response-content">{item.responseContent}</p>
                                            {(isAdmin || isOwnerOfResponse(item.userName)) && (
                                                <button className="delete-interaction-btn" onClick={() => handleDeleteResponse(item.id, item.userName)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {activeInteractionTab === 'receive' && isAdmin && !isLoadingInteractions && (
                        <div className="add-recipient-form">
                            <input type="text" value={newRecipientId} onChange={(e) => setNewRecipientId(e.target.value)} placeholder="Mã cư dân mới" />
                            <button onClick={handleAddReceiveRecipient} disabled={isLoadingInteractions}>
                                {isLoadingInteractions ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPlus} />} Thêm
                            </button>
                            {/* NEW: Send Email Button for Admins */}
                            <button
                                className="send-email-btn"
                                onClick={handleSendEmailToResidents}
                                disabled={isLoadingEmailSend || currentInteractionList.length === 0}
                                title="Gửi email thông báo này đến các cư dân trong danh sách."
                            >
                                {isLoadingEmailSend ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                                Gửi email cho cư dân
                            </button>
                        </div>
                    )}
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