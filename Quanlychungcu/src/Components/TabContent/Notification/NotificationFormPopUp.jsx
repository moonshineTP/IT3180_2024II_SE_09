// ./Components/TabContent/Notification/NotificationFormPopUp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationFormPopUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner, faIdBadge, faHeading, faUsers, faFileLines, faUserEdit, faClipboardList } from '@fortawesome/free-solid-svg-icons'; // Thêm faPlus, faTrash (nếu dùng)
import RichTextEditor from '../../Common/RichTextEditor';


const DEFAULT_TEXT = '';
const DEFAULT_SELECT = '';

// Component này chỉ dùng để tạo mới thông báo
// Props:
// - onClose: Hàm để đóng form (quay lại bảng)
// - onSaveSuccess: Callback để gọi sau khi tạo thành công (refresh bảng)
// - viewerAccount: Thông tin tài khoản người đang đăng nhập (để lấy isAdmin và gợi ý creatorName)
const NotificationFormPopUp = ({ onClose, onSaveSuccess, viewerAccount }) => { // Bỏ initialData và reloadFunc
    // --- States của form ---
    // announcementId luôn cho phép nhập và là required
    const [announcementId, setAnnouncementId] = useState(DEFAULT_TEXT);
    const [title, setTitle] = useState(DEFAULT_TEXT);
    const [type, setType] = useState(DEFAULT_SELECT);
    const [sendto, setSendto] = useState('public');
    const [content, setContent] = useState(DEFAULT_TEXT);
    // CreatorName: Admin có thể nhập, nếu để trống, backend sẽ tự lấy từ Authentication.
    // Gợi ý là username của ViewerAccount.
    const [creatorName, setCreatorName] = useState(viewerAccount?.username || '');

    const [isLoading, setIsLoading] = useState(false); // Loading chung cho form submit
    const [errorMessage, setErrorMessage] = useState(''); // Lỗi chung của form
    const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công chung

    // --- States cho người nhận riêng tư (chỉ khi sendto là private và là admin) ---
    // Danh sách này chỉ được quản lý SAU KHI thông báo ĐÃ TẠO LẦN ĐẦU VỚI ID TỒN TẠI.
    // Vì đây chỉ là form TẠO MỚI, phần này sẽ không được quản lý trực tiếp ở đây.
    // Người dùng sẽ phải tạo xong, rồi mở lại để sửa và thêm người nhận nếu muốn.

    // useEffect để reset form khi cần (ví dụ: sau khi tạo thành công, hoặc khi form được mở lại)
    useEffect(() => {
        // Reset form về trạng thái ban đầu khi component mount
        setAnnouncementId(DEFAULT_TEXT);
        setTitle(DEFAULT_TEXT);
        setType(DEFAULT_SELECT);
        setSendto('public');
        setContent(DEFAULT_TEXT);
        setCreatorName(viewerAccount?.username || ''); // Reset người tạo về mặc định/gợi ý
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(false);
        // Không fetch recipients ở đây vì đây là form tạo mới
    }, [viewerAccount]); // Chỉ reset khi viewerAccount thay đổi (ví dụ: đăng nhập lại)


    const handleContentChange = (editorData) => {
        setContent(editorData);
    };

    // --- Hàm GỬI FORM (chỉ là tạo mới) ---
    const handleSubmit = async (e) => { // Đổi tên hàm để tránh nhầm lẫn với handleSubmit của form
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // --- Validation ---
        // announcementId luôn bắt buộc khi tạo mới
        if (!announcementId.trim()) { setErrorMessage("Mã thông báo không được để trống."); setIsLoading(false); return; }
        if (!title.trim()) { setErrorMessage("Tiêu đề không được để trống."); setIsLoading(false); return; }
        if (!type) { setErrorMessage("Vui lòng chọn loại thông báo."); setIsLoading(false); return; }
        if (!sendto) { setErrorMessage("Vui lòng chọn đối tượng gửi."); setIsLoading(false); return; }
        if (!content.trim()) { setErrorMessage("Nội dung không được để trống."); setIsLoading(false); return; }
        // creatorName có thể để trống, backend sẽ tự xử lý nếu người dùng không nhập gì

        const notificationDTO = {
            announcementId: announcementId,
            title: title,
            type: type,
            sendto: sendto,
            content: content,
            creatorName: creatorName.trim() || null, // Gửi tên người tạo đã nhập/sửa. Nếu rỗng, gửi null để backend có thể xử lý.
        };

        try {
            // Luôn gọi API tạo mới
            const response = await axios.post(
                'http://localhost:8080/api/update/createnotification',
                notificationDTO,
                { withCredentials: true }
            );

            if (response.status === 200 || response.status === 201) {
                const apiMessage = (typeof response.data === 'string' && response.data) ? response.data :
                                   (response.data?.message || 'Tạo thông báo thành công!');

                setSuccessMessage(`✅ ${apiMessage}`);

                if (onSaveSuccess && typeof onSaveSuccess === 'function') {
                    onSaveSuccess(); // Gọi callback để refresh bảng
                }

                // Reset form về trạng thái tạo mới sau khi thành công
                setAnnouncementId(DEFAULT_TEXT);
                setTitle(DEFAULT_TEXT);
                setType(DEFAULT_SELECT);
                setSendto('public');
                setContent(DEFAULT_TEXT);
                setCreatorName(viewerAccount?.username || ''); // Reset người tạo

                setTimeout(() => {
                    onClose(); // Đóng form (quay lại bảng)
                }, 1500);

            } else {
                setErrorMessage(response.data?.message || response.data || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Error creating notification:", error);
            if (error.response) {
                setErrorMessage(error.response.data?.message || error.response.data || `Lỗi ${error.response.status}`);
            } else {
                setErrorMessage("Lỗi mạng hoặc server không phản hồi.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="notification-form-popup-overlay"> {/* Giữ overlay nếu muốn form trông như popup trên nền */}
            <div className="notification-form-popup-content"> {/* Hoặc đổi thành notification-form-panel nếu muốn là panel */}
                <button className="form-close-btn" onClick={onClose} title="Đóng">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>Tạo Thông báo Mới</h3> {/* Tiêu đề cố định */}

                {errorMessage && <p className="form-error-message">{errorMessage}</p>}
                {successMessage && <p className="form-success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="notification-form">
                    <div className="form-group">
                        <label htmlFor="announcementId"><FontAwesomeIcon icon={faIdBadge} /> Mã Thông báo:</label>
                        <input type="text" id="announcementId" value={announcementId} onChange={(e) => setAnnouncementId(e.target.value)} disabled={isLoading} required /> {/* Luôn enabled trừ khi loading */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="title"><FontAwesomeIcon icon={faHeading} /> Tiêu đề:</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type"><FontAwesomeIcon icon={faClipboardList} /> Loại Thông báo:</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)} disabled={isLoading} required>
                            <option value="" disabled={type !== ""}>Chọn loại...</option>
                            <option value="administrative">Thông báo hành chính – quản lý</option>
                            <option value="maintenance">Thông báo bảo trì, kỹ thuật</option>
                            <option value="emergency">Thông báo khẩn cấp – cảnh báo</option>
                            <option value="event">Sự kiện – cộng đồng</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faUsers} /> Đối tượng gửi:</label>
                        <div className="radio-group">
                            <label htmlFor="sendto-public"><input type="radio" id="sendto-public" name="sendto" value="public" checked={sendto === 'public'} onChange={(e) => setSendto(e.target.value)} disabled={isLoading}/> Công khai</label>
                            <label htmlFor="sendto-private"><input type="radio" id="sendto-private" name="sendto" value="private" checked={sendto === 'private'} onChange={(e) => setSendto(e.target.value)} disabled={isLoading}/> Riêng tư</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content"><FontAwesomeIcon icon={faFileLines} /> Nội dung:</label>
                        <RichTextEditor
                            data={content}
                            onChange={handleContentChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="creatorName"><FontAwesomeIcon icon={faUserEdit} /> Người tạo:</label>
                        <input
                            type="text"
                            id="creatorName"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            disabled={isLoading} // Chỉ disabled khi đang loading
                            placeholder="Nhập tên người tạo (mặc định là bạn)"
                        />
                        {/* Không cần dòng small text vì luôn cho phép nhập hoặc là mặc định */}
                    </div>

                    {/* --- PHẦN QUẢN LÝ NGƯỜI NHẬN RIÊNG TƯ ĐÃ ĐƯỢC BỎ BỚT --- */}
                    {/* Ở đây, không có phần quản lý người nhận riêng tư trực tiếp,
                        vì nó sẽ được quản lý sau khi thông báo đã được tạo và có ID.
                        Người dùng sẽ phải mở lại thông báo đó ở chế độ chỉnh sửa để thêm người nhận. */}
                    {/* ... (phần quản lý người nhận riêng tư trước đó sẽ không có ở đây) ... */}


                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn" disabled={isLoading}>
                            <FontAwesomeIcon icon={faTimes} /> Hủy
                        </button>
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                            Tạo Thông báo {/* Text cố định */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationFormPopUp;