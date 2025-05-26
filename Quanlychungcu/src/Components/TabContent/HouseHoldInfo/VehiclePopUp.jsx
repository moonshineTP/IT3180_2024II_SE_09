// ./Components/TabContent/Vehicles/VehiclePopUp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VehiclePopUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCar, faMotorcycle, faCalendarAlt, faParking, faStickyNote,
    faExclamationTriangle, faEdit, faSave, faTimes, faSpinner, faIdBadge // Thêm icon cho Resident ID
} from '@fortawesome/free-solid-svg-icons';
// import { checkPermissions } from '../../Service/AccountService'; // Bỏ comment nếu dùng

// Default values
const DEFAULT_TEXT = 'Chưa có dữ liệu';
const DEFAULT_DATE_TEXT = 'Chưa có dữ liệu';

// Helper function to format LocalDateTime
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return DEFAULT_DATE_TEXT;
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        // Format cho input type="datetime-local" cần YYYY-MM-DDTHH:mm
        // Format cho hiển thị có thể khác
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`; // Format hiển thị
    } catch { return 'Ngày không hợp lệ'; }
};

// Helper để convert date string (YYYY-MM-DDTHH:mm or from API) sang format YYYY-MM-DDTHH:mm cho input
const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    } catch {
        return '';
    }
};


const VehiclePopUp = ({ data: initialVehicleData, onOpenPopUp, viewerAccount, onVehicleSaved }) => {
    const [vehicleData, setVehicleData] = useState(initialVehicleData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // State for editable fields
    const [tempVehicleType, setTempVehicleType] = useState(initialVehicleData?.vehicleType || '');
    const [tempBrand, setTempBrand] = useState(initialVehicleData?.brand || '');
    const [tempModel, setTempModel] = useState(initialVehicleData?.model || '');
    const [tempColor, setTempColor] = useState(initialVehicleData?.color || '');
    const [tempParkingSlot, setTempParkingSlot] = useState(initialVehicleData?.parkingSlot || '');
    const [tempNote, setTempNote] = useState(initialVehicleData?.note || '');
    // *** NEW: States for editable registrationDate and residentId ***
    const [tempRegistrationDate, setTempRegistrationDate] = useState(formatDateTimeForInput(initialVehicleData?.registrationDate));
    const [tempResidentId, setTempResidentId] = useState(initialVehicleData?.residentId || '');


    const [isLoadingOwner, setIsLoadingOwner] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Permissions
    // const { isAdmin } = checkPermissions(viewerAccount); // Nếu dùng checkPermissions
    const isAdmin = viewerAccount?.role === "admin"; // Giả sử viewerAccount được truyền đúng
    const showEditButton = isAdmin;

    // Effect to synchronize temp states when 'initialVehicleData' prop changes
    useEffect(() => {
        setVehicleData(initialVehicleData);
        setTempVehicleType(initialVehicleData?.vehicleType || '');
        setTempBrand(initialVehicleData?.brand || '');
        setTempModel(initialVehicleData?.model || '');
        setTempColor(initialVehicleData?.color || '');
        setTempParkingSlot(initialVehicleData?.parkingSlot || '');
        setTempNote(initialVehicleData?.note || '');
        // *** NEW: Update tempRegistrationDate and tempResidentId ***
        setTempRegistrationDate(formatDateTimeForInput(initialVehicleData?.registrationDate));
        setTempResidentId(initialVehicleData?.residentId || '');

        setIsEditing(false);
        setIsSaving(false);
        setError(null);
        setSuccessMessage('');
        setIsLoadingOwner(false);
    }, [initialVehicleData]);


    // Handle clicking "Xem chủ xe"
    const handleViewOwner = async () => {
        // Sử dụng tempResidentId nếu đang edit, ngược lại dùng vehicleData.residentId
        const residentIdToView = isEditing ? tempResidentId : vehicleData?.residentId;
        if (!residentIdToView) {
            setError('Không có mã số chủ xe để xem thông tin.');
            return;
        }
        // ... (rest of handleViewOwner logic as before) ...
        if (!onOpenPopUp || typeof onOpenPopUp !== 'function') { /* ... */ return; }
        setIsLoadingOwner(true);
        setError(null);
        try {
            const response = await axios.post(
                `http://localhost:8080/api/gettarget/getResident`,
                { residentId: residentIdToView },
                { withCredentials: true }
            );
            if (response.data) {
                onOpenPopUp('resident', response.data, null);
            } else {
                setError(`Không tìm thấy thông tin cho chủ xe mã: ${residentIdToView}`);
            }
        } catch (err) { /* ... error handling ... */
            console.error("Error fetching owner (resident) details:", err);
            if (err.response) {
                if (err.response.status === 403) setError('Bạn không có quyền xem thông tin chủ xe này.');
                else if (err.response.status === 404) setError(`Không tìm thấy chủ xe với mã: ${residentIdToView}.`);
                else setError(`Lỗi server (${err.response.status}) khi tải thông tin chủ xe.`);
            } else if (err.request) setError('Không thể kết nối đến server để tải thông tin chủ xe.');
            else setError('Lỗi khi tải thông tin chủ xe: ' + err.message);
        } finally {
            setIsLoadingOwner(false);
        }
    };


    const getVehicleIcon = (type) => { /* ... (giữ nguyên) ... */
        if (type?.toLowerCase() === 'car') return faCar;
        if (type?.toLowerCase() === 'motorbike') return faMotorcycle;
        return faCar;
    };

    // Reset temp states to current vehicleData values
    const resetStates = () => {
        setIsEditing(false);
        setTempVehicleType(vehicleData?.vehicleType || '');
        setTempBrand(vehicleData?.brand || '');
        setTempModel(vehicleData?.model || '');
        setTempColor(vehicleData?.color || '');
        setTempParkingSlot(vehicleData?.parkingSlot || '');
        setTempNote(vehicleData?.note || '');
        // *** NEW: Reset tempRegistrationDate and tempResidentId ***
        setTempRegistrationDate(formatDateTimeForInput(vehicleData?.registrationDate));
        setTempResidentId(vehicleData?.residentId || '');
        setError('');
        setSuccessMessage('');
    };

    // Handle Save
    const handleSave = async () => {
        if (!isAdmin) { /* ... */ return; }
        if (!vehicleData?.licensePlate) { /* ... */ return; }

        // Basic validation
        if (!tempVehicleType) { setError("Loại xe không được để trống."); return; }
        if (!tempBrand) { setError("Hãng xe không được để trống."); return; }
        if (!tempModel) { setError("Dòng xe không được để trống."); return; }
        // *** NEW: Validation for residentId and registrationDate if admin is editing them ***
        if (!tempResidentId && isAdmin) { setError("Mã chủ xe không được để trống khi chỉnh sửa."); return; }
        if (!tempRegistrationDate && isAdmin) { setError("Ngày đăng ký không được để trống khi chỉnh sửa."); return; }


        const updatePayload = {
            licensePlate: vehicleData.licensePlate,
            vehicleType: tempVehicleType,
            brand: tempBrand,
            model: tempModel,
            color: tempColor,
            parkingSlot: tempParkingSlot,
            note: tempNote,
            // *** NEW: Add tempRegistrationDate and tempResidentId to payload ***
            // Backend cần parse tempRegistrationDate (string YYYY-MM-DDTHH:mm) thành LocalDateTime
            registrationDate: tempRegistrationDate ? new Date(tempRegistrationDate).toISOString() : null, // Gửi ISO string hoặc null
            residentId: tempResidentId,
        };

        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.put(
                `http://localhost:8080/api/update/changevehicle`,
                updatePayload,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setSuccessMessage("✅ Cập nhật thông tin phương tiện thành công!");
                setVehicleData(response.data);
                setIsEditing(false);
                if (onVehicleSaved && typeof onVehicleSaved === 'function') {
                    onVehicleSaved();
                }
            } else {
                setError(`Cập nhật thất bại: ${response.status}`);
            }
        } catch (err) { /* ... error handling ... */
            console.error("Vehicle update failed:", err);
            if (err.response) {
                if (err.response.status === 403) setError("Không có quyền cập nhật phương tiện này.");
                else if (err.response.status === 400) setError(err.response.data?.message || "Dữ liệu cập nhật không hợp lệ.");
                else if (err.response.status === 404) setError("Không tìm thấy phương tiện để cập nhật.");
                else setError(`Lỗi server (${err.response.status}) khi cập nhật.`);
            } else if (err.request) setError("Không thể kết nối đến server.");
            else setError("Lỗi khi cập nhật: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };


    if (!vehicleData) { /* ... (giữ nguyên) ... */
        return (
            <div className="vehicle-popup-container">
                <div className="error-message vehicle-error">
                    <FontAwesomeIcon icon={faExclamationTriangle} /> Không có dữ liệu phương tiện để hiển thị.
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-popup-container">
            {/* ... (Header and Messages as before) ... */}
            <div className="vehicle-popup-header">
                <FontAwesomeIcon icon={getVehicleIcon(vehicleData.vehicleType)} className="vehicle-header-icon" />
                <div className="vehicle-header-text">
                    <h2>Thông tin phương tiện</h2>
                    <p className="license-plate-highlight">Biển số: <strong>{vehicleData.licensePlate || DEFAULT_TEXT}</strong></p>
                </div>
            </div>

            {error && <div className="error-message vehicle-error">{error}</div>}
            {successMessage && <div className="success-message vehicle-success">{successMessage}</div>}

            <div className="vehicle-details-list">
                {/* Vehicle Type, Brand, Model, Color - with edit inputs */}
                <div className="vehicle-detail-item">
                    <span className="detail-label"><FontAwesomeIcon icon={getVehicleIcon(vehicleData.vehicleType)} /> Loại phương tiện:</span>
                    {isEditing && isAdmin ? ( <select className="detail-input" value={tempVehicleType} onChange={(e) => setTempVehicleType(e.target.value)}><option value="">Chọn loại xe</option><option value="Car">Ô tô</option><option value="Motorbike">Xe máy</option></select> ) : ( <span className="detail-value">{vehicleData.vehicleType || DEFAULT_TEXT}</span> )}
                </div>
                <div className="vehicle-detail-item">
                    <span className="detail-label">Hãng xe:</span>
                     {isEditing && isAdmin ? ( <input type="text" className="detail-input" value={tempBrand} onChange={(e) => setTempBrand(e.target.value)} placeholder="VD: Honda, Toyota" /> ) : ( <span className="detail-value">{vehicleData.brand || DEFAULT_TEXT}</span> )}
                </div>
                <div className="vehicle-detail-item">
                    <span className="detail-label">Dòng xe:</span>
                    {isEditing && isAdmin ? ( <input type="text" className="detail-input" value={tempModel} onChange={(e) => setTempModel(e.target.value)} placeholder="VD: SH, Vios" /> ) : ( <span className="detail-value">{vehicleData.model || DEFAULT_TEXT}</span> )}
                </div>
                <div className="vehicle-detail-item">
                    <span className="detail-label">Màu sắc:</span>
                     {isEditing && isAdmin ? ( <input type="text" className="detail-input" value={tempColor} onChange={(e) => setTempColor(e.target.value)} placeholder="VD: Đen, Trắng" /> ) : ( <span className="detail-value">{vehicleData.color || DEFAULT_TEXT}</span> )}
                </div>

                {/* Registration Date - with edit input */}
                <div className="vehicle-detail-item">
                    <span className="detail-label"><FontAwesomeIcon icon={faCalendarAlt} /> Ngày đăng ký tại chung cư:</span>
                    {isEditing && isAdmin ? (
                        <input
                            type="datetime-local" // Sử dụng datetime-local cho cả ngày và giờ
                            className="detail-input"
                            value={tempRegistrationDate}
                            onChange={(e) => setTempRegistrationDate(e.target.value)}
                        />
                    ) : (
                        <span className="detail-value">{formatDateTime(vehicleData.registrationDate)}</span>
                    )}
                </div>

                {/* Parking Slot - with edit input */}
                <div className="vehicle-detail-item">
                    <span className="detail-label"><FontAwesomeIcon icon={faParking} /> Chỗ đậu xe:</span>
                     {isEditing && isAdmin ? ( <input type="text" className="detail-input" value={tempParkingSlot} onChange={(e) => setTempParkingSlot(e.target.value)} placeholder="VD: A01, B02" /> ) : ( <span className="detail-value">{vehicleData.parkingSlot || DEFAULT_TEXT}</span> )}
                </div>

                {/* Owner (Resident ID) - with edit input */}
                <div className="vehicle-detail-item owner-info-item">
                    <span className="detail-label"><FontAwesomeIcon icon={faIdBadge} /> Chủ xe (Mã cư dân):</span>
                    {isEditing && isAdmin ? (
                        <input
                            type="text"
                            className="detail-input"
                            value={tempResidentId}
                            onChange={(e) => setTempResidentId(e.target.value)}
                            placeholder="Nhập mã cư dân"
                        />
                    ) : (
                        <div className="owner-id-container">
                            <span className="detail-value">{vehicleData.residentId || DEFAULT_TEXT}</span>
                            {vehicleData.residentId && onOpenPopUp && (
                                <button className="view-owner-button" onClick={handleViewOwner} disabled={isLoadingOwner} title="Xem thông tin chủ xe">
                                    {isLoadingOwner ? (<><FontAwesomeIcon icon={faSpinner} spin /> Đang tải...</>) : 'Xem chủ xe'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Note - with edit input */}
                <div className="vehicle-detail-item">
                    <span className="detail-label"><FontAwesomeIcon icon={faStickyNote} /> Ghi chú:</span>
                    {isEditing && isAdmin ? ( <textarea className="detail-input note-textarea" value={tempNote} onChange={(e) => setTempNote(e.target.value)} placeholder="Ghi chú thêm (nếu có)" rows="3"></textarea> ) : ( <span className="detail-value note-value">{vehicleData.note || DEFAULT_TEXT}</span> )}
                </div>
            </div>

            {/* Action Buttons - như cũ */}
            <div className="action-buttons">
                {isSaving && <span className="saving-text"><FontAwesomeIcon icon={faSpinner} spin /> Đang lưu...</span>}
                {showEditButton && !isEditing && !isSaving ? (
                    <button className="edit-button" onClick={() => { setIsEditing(true); setError(''); setSuccessMessage('');}}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                    </button>
                ) : null}
                {isEditing && !isSaving && (
                    <div className="edit-actions">
                        <button className="cancel-button" onClick={resetStates}>
                            <FontAwesomeIcon icon={faTimes} /> Hủy
                        </button>
                        <button className="save-button" onClick={handleSave} disabled={isSaving}>
                            <FontAwesomeIcon icon={faSave} /> Lưu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehiclePopUp;