// ./Components/Prompts/CreateItemPrompt.jsx
import React, { useState } from 'react'; // Bỏ useEffect nếu không dùng
import './CreateItemPrompt.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faSpinner, faIdCard, faUserCircle, faCar } from '@fortawesome/free-solid-svg-icons'; // Thêm faUserCircle

// Component nhận prop errorMessage (lỗi từ server/logic cha)
const CreateItemPrompt = ({ itemType, onSubmit, onClose, isLoading, errorMessage: serverErrorMessage }) => {
    const [primaryId, setPrimaryId] = useState('');
    const [secondaryId, setSecondaryId] = useState(''); // For vehicle's residentId
    const [clientError, setClientError] = useState(''); // Lỗi validation client-side

    const handleSubmit = () => {
        setClientError(''); // Xóa lỗi client cũ
        if (!primaryId.trim()) {
            setClientError(itemType === 'resident' ? 'Mã cư dân không được để trống.' : 'Biển số xe không được để trống.');
            return;
        }
        if (itemType === 'vehicle' && !secondaryId.trim()) {
            setClientError('Mã số chủ xe không được để trống khi tạo phương tiện.');
            return;
        }
        // Gọi onSubmit từ cha, cha sẽ xử lý API và set lỗi server nếu có
        onSubmit(primaryId, itemType === 'vehicle' ? secondaryId : null);
    };

    const placeholderText = itemType === 'resident' ? "Nhập Mã số cư dân mới" : "Nhập Biển số xe mới";
    const titleText = itemType === 'resident' ? "Tạo Cư dân Mới" : "Tạo Phương tiện Mới";

    // Hiển thị lỗi từ server trước, sau đó mới đến lỗi client
    const displayError = serverErrorMessage || clientError;

    return (
        <div className="create-item-prompt-overlay">
            <div className="create-item-prompt-content">
                <button className="close-prompt-btn" onClick={onClose} title="Đóng">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>{titleText}</h3>
                {/* *** HIỂN THỊ LỖI Ở ĐÂY *** */}
                {displayError && <p className="prompt-error">{displayError}</p>}

                <div className="prompt-input-group">
                    <FontAwesomeIcon icon={itemType === 'resident' ? faIdCard : faCar} className="prompt-input-icon"/>
                    <input
                        type="text"
                        value={primaryId}
                        onChange={(e) => {
                            setPrimaryId(e.target.value);
                            setClientError(''); // Xóa lỗi client khi người dùng gõ
                        }}
                        placeholder={placeholderText}
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                {itemType === 'vehicle' && (
                    <div className="prompt-input-group">
                         <FontAwesomeIcon icon={faUserCircle} className="prompt-input-icon"/>
                        <input
                            type="text"
                            value={secondaryId}
                            onChange={(e) => {
                                setSecondaryId(e.target.value);
                                setClientError(''); // Xóa lỗi client khi người dùng gõ
                            }}
                            placeholder="Nhập Mã số chủ xe"
                            disabled={isLoading}
                        />
                    </div>
                )}
                <button onClick={handleSubmit} className="submit-prompt-btn" disabled={isLoading}>
                    {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheck} />}
                    Xác nhận Tạo
                </button>
            </div>
        </div>
    );
};

export default CreateItemPrompt;