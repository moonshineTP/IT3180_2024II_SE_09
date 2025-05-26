// ./Components/TabContent/Residents/ResidentPopUp.jsx (Create this new file)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResidentPopUp.css'; // Create this CSS file
// Assuming you have a checkPermissions helper function
// and a hook for getting viewer account info if not passed dow
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faFemale, faMale, faPhone, faEnvelope, faBriefcase, faHome, faUserTag, faLink, faCalendar, faIdCard, faSignInAlt, faSignOutAlt, faCar, faEdit, faSave, faTimes,faMotorcycle} from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

// Default values for display if data is null or field is null
const DEFAULT_TEXT = 'Chưa có dữ liệu';
const DEFAULT_DATE_TEXT = 'Chưa có dữ liệu';
const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'; // Default resident avatar

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return DEFAULT_DATE_TEXT;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Ngày không hợp lệ';
    }
};
const getAvatarUrlFromBytes = (byteArray) => {
    if (!byteArray) return DEFAULT_AVATAR_URL;
    if (typeof byteArray === 'string' && byteArray.startsWith('/9j/') || byteArray.startsWith('iVBORw0KGgo')) { // Basic check for likely base64 start
         return `data:image/jpeg;base64,${byteArray}`; // Or data:image/png if applicable
    }
    console.warn("Avatar data is not a recognizable base64 string. Using default avatar.");
    return DEFAULT_AVATAR_URL;
};
const ResidentPopUp = ({ data, onResidentSaved, onOpenPopUp,viewerAccount}) => {
    const [residentData, setResidentData] = useState(data);
    const [isEditing, setIsEditing] = useState(false);
    const [tempFullName, setTempFullName] = useState(residentData?.fullName || '');
    const [tempGender, setTempGender] = useState(residentData?.gender || '');
    const [tempDateOfBirth, setTempDateOfBirth] = useState(residentData?.dateOfBirth || ''); 
    const [tempPlaceOfBirth, setTempPlaceOfBirth] = useState(residentData?.placeOfBirth || '');
    const [tempIdentityNumber, setTempIdentityNumber] = useState(residentData?.identityNumber || '');
    const [tempCccdIssueDate, setTempCccdIssueDate] = useState(residentData?.cccdIssueDate || '');
    const [tempCccdExpiryDate, setTempCccdExpiryDate] = useState(residentData?.cccdExpiryDate || '');
    const [tempPhoneNumber, setTempPhoneNumber] = useState(residentData?.phoneNumber || '');
    const [tempEmail, setTempEmail] = useState(residentData?.email || '');
    const [tempOccupation, setTempOccupation] = useState(residentData?.occupation || '');
    const [tempApartmentNumber, setTempApartmentNumber] = useState(residentData?.apartmentNumber || '');
    const [tempIsHouseholdOwner, setTempIsHouseholdOwner] = useState(residentData?.isHouseholdOwner || false);
    const [tempRelationshipWithOwner, setTempRelationshipWithOwner] = useState(residentData?.relationshipWithOwner || '');
    const [tempMoveInDate, setTempMoveInDate] = useState(residentData?.moveInDate || '');
    const [tempMoveOutDate, setTempMoveOutDate] = useState(residentData?.moveOutDate || '');
    // Avatar editing is complex (file upload), will omit temp state/input for avatar for simplicity, just display


    // State for vehicle list
    const [vehicleList, setVehicleList] = useState([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [vehicleError, setVehicleError] = useState(null);


    // State for messages
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Added success message state
    const isAdmin = viewerAccount?.role==="admin";

    // Boolean to control display of edit button
    const showEditButton = isAdmin; // Only admin sees the edit button


    // Effect to synchronize state when prop 'data' changes (viewing a different resident)
    useEffect(() => {
        setResidentData(data);
        setTempFullName(data?.fullName || '');
        setTempGender(data?.gender || '');
        setTempDateOfBirth(data?.dateOfBirth || '');
        setTempPlaceOfBirth(data?.placeOfBirth || '');
        setTempIdentityNumber(data?.identityNumber || '');
        setTempCccdIssueDate(data?.cccdIssueDate || '');
        setTempCccdExpiryDate(data?.cccdExpiryDate || '');
        setTempPhoneNumber(data?.phoneNumber || '');
        setTempEmail(data?.email || '');
        setTempOccupation(data?.occupation || '');
        setTempApartmentNumber(data?.apartmentNumber || '');
        setTempIsHouseholdOwner(data?.isHouseholdOwner || false);
        setTempRelationshipWithOwner(data?.relationshipWithOwner || '');
        setTempMoveInDate(data?.moveInDate || '');
        setTempMoveOutDate(data?.moveOutDate || '');
        setErrorMessage('');
        setSuccessMessage(''); // Reset messages
        setIsEditing(false); // Exit edit mode

        // Fetch vehicle list for this resident
        const fetchVehicles = async () => {
            if (!data?.residentId) {
                setVehicleList([]);
                return;
            }
            setIsLoadingVehicles(true);
            setVehicleError(null); // Xóa lỗi cũ
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/gettarget/getVehiclesByResident`,
                    { residentId: data.residentId },
                    { withCredentials: true }
                );

                // Xử lý response dựa trên cách API trả về
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        // Trường hợp (4): API trả về danh sách xe
                        setVehicleList(response.data);
                        if (response.data.length === 0) {
                            // Có thể backend trả về mảng rỗng thay vì string "No vehicles..."
                            // Bạn có thể đặt thông báo ở đây nếu muốn
                            // setVehicleError("Cư dân này không có xe nào được đăng ký.");
                        }
                    } else if (typeof response.data === 'string') {
                        // Trường hợp (3): API trả về string "No vehicles found..." với status 200 OK
                        setVehicleList([]); // Vẫn là mảng rỗng
                        setVehicleError(response.data); // Hiển thị thông báo từ API
                    } else {
                        // Các trường hợp 200 OK khác mà data không phải mảng hoặc string mong đợi
                        console.warn("API /getVehiclesByResident returned 200 OK but data is not an array or expected string:", response.data);
                        setVehicleList([]);
                        setVehicleError("Dữ liệu danh sách xe không hợp lệ từ server.");
                    }
                } else {
                    // Các trường hợp status khác 200 (ví dụ: 400, 404 từ các return ResponseEntity.badRequest())
                    // Khối catch sẽ xử lý các lỗi HTTP này.
                    // Tuy nhiên, axios sẽ ném lỗi cho các status 4xx, 5xx, nên logic này có thể không cần thiết.
                    console.warn(`API /getVehiclesByResident returned status ${response.status}:`, response.data);
                    setVehicleList([]);
                    setVehicleError(typeof response.data === 'string' ? response.data : "Lỗi không xác định khi tải danh sách xe.");
                }

            } catch (error) {
                console.error("Error fetching vehicles:", error);
                setVehicleList([]); // Luôn đảm bảo vehicleList là mảng khi có lỗi

                if (error.response) {
                    // Server trả về lỗi (ví dụ 400, 403, 404)
                    const status = error.response.status;
                    const responseData = error.response.data;

                    if (typeof responseData === 'string') {
                        setVehicleError(responseData); // Hiển thị thông báo lỗi string từ backend
                    } else if (responseData && responseData.message) {
                        setVehicleError(responseData.message); // Nếu backend trả về object có message
                    } else if (status === 403) {
                        setVehicleError('Bạn không có quyền xem danh sách xe này.');
                    } else if (status === 404) { // Mặc dù API của bạn trả 400 cho "Resident not found"
                        setVehicleError('Không tìm thấy thông tin cư dân hoặc xe.');
                    }
                    else {
                        setVehicleError(`Lỗi server (${status}) khi tải danh sách xe.`);
                    }
                } else if (error.request) {
                    setVehicleError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
                } else {
                    setVehicleError("Đã có lỗi xảy ra khi tải danh sách xe: " + error.message);
                }
            } finally {
                setIsLoadingVehicles(false);
            }
        };
        fetchVehicles();
    }, [data]); // Rerun effect if data or viewer changes

     // Helper to format boolean IsHouseholdOwner
    const formatIsHouseholdOwner = (value) => {
        if (value === null || value === undefined) return DEFAULT_TEXT;
        return value ? 'Có' : 'Không';
    };
    // Handle Save function
    const handleSave = async () => {
        setErrorMessage(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        if (!isAdmin) { // Double check permissions on save attempt
            setErrorMessage('Bạn không có quyền chỉnh sửa thông tin cư dân.');
            return;
        }
        const updatePayload = {
            residentId: residentData?.residentId, // Required to identify the resident
            fullName: tempFullName,
            gender: tempGender,
            dateOfBirth: tempDateOfBirth,
            placeOfBirth: tempPlaceOfBirth,
            identityNumber: tempIdentityNumber,
            cccdIssueDate: tempCccdIssueDate,
            cccdExpiryDate: tempCccdExpiryDate,
            phoneNumber: tempPhoneNumber,
            email: tempEmail,
            occupation: tempOccupation,
            apartmentNumber: tempApartmentNumber,
            isHouseholdOwner: tempIsHouseholdOwner,
            relationshipWithOwner: tempRelationshipWithOwner,
            moveInDate: tempMoveInDate,
            moveOutDate: tempMoveOutDate,
        };

        // Basic validation for critical fields (you might need more)
         if (!updatePayload.residentId) {
             setErrorMessage('Lỗi: Không xác định được cư dân cần cập nhật.');
             return;
         }
         if (!updatePayload.fullName || updatePayload.fullName.trim() === '') {
             setErrorMessage('Tên đầy đủ không được để trống.');
             return;
         }
        try {
            const response = await axios.put(
                `http://localhost:8080/api/update/changeresident`, // Example endpoint using residentId in path
                 updatePayload, // Send the payload
                { withCredentials: true }
            );
            if (response.status === 200) {
                setSuccessMessage('✅ Cập nhật thông tin cư dân thành công!');
                setResidentData(response.data);
                setIsEditing(false);
                if (onResidentSaved && typeof onResidentSaved === 'function') {
                    onResidentSaved();
                }
            } else {
                setErrorMessage(`Cập nhật thất bại: Mã trạng thái ${response.status}`);
            }
        } catch (error) {
            console.error("Resident update failed:", error);
             setSuccessMessage(''); // Clear success message on error
             if (error.response) {
                 if (error.response.status === 403) {
                     setErrorMessage("Không có quyền thực hiện thao tác này."); // Backend should enforce this
                 } else if (error.response.status === 400) {
                     setErrorMessage(error.response.data?.message || 'Yêu cầu cập nhật không hợp lệ.');
                 } else if (error.response.status === 404) {
                     setErrorMessage('Không tìm thấy cư dân để cập nhật.');
                 }
                 else {
                     setErrorMessage(`Lỗi server: ${error.response.status}`);
                 }
             } else if (error.request) {
                 setErrorMessage('Không nhận được phản hồi từ server.');
             } else {
                 setErrorMessage('Lỗi: ' + error.message);
             }
        }
    };
    const resetStates = () => {
        setIsEditing(false);
        setTempFullName(residentData?.fullName || '');
        setTempGender(residentData?.gender || '');
        setTempDateOfBirth(residentData?.dateOfBirth || '');
        setTempPlaceOfBirth(residentData?.placeOfBirth || '');
        setTempIdentityNumber(residentData?.identityNumber || '');
        setTempCccdIssueDate(residentData?.cccdIssueDate || '');
        setTempCccdExpiryDate(residentData?.cccdExpiryDate || '');
        setTempPhoneNumber(residentData?.phoneNumber || '');
        setTempEmail(residentData?.email || '');
        setTempOccupation(residentData?.occupation || '');
        setTempApartmentNumber(residentData?.apartmentNumber || '');
        setTempIsHouseholdOwner(residentData?.isHouseholdOwner || false);
        setTempRelationshipWithOwner(residentData?.relationshipWithOwner || '');
        setTempMoveInDate(residentData?.moveInDate || '');
        setTempMoveOutDate(residentData?.moveOutDate || '');
        setErrorMessage('');
        setSuccessMessage(''); // Also reset success message
    };
    const handleViewLinkedAccount = async (username) => {
        if(!username) return;
        try{
            const response = await axios.post(
                `http://localhost:8080/api/gettarget/account`, // Example endpoint using residentId in path
                 {username:username}, // Send the payload
                { withCredentials: true }
            );
            onOpenPopUp('account',response.data);
        }catch (error) {
            console.error("Switching failed:", error);
            setSuccessMessage(''); // Clear success message on error
            if (error.response) {
                if (error.response.status === 403) {
                    setErrorMessage("Không có quyền thực hiện thao tác này."); // Backend should enforce this
                } else if (error.response.status === 400) {
                    setErrorMessage(error.response.data?.message || 'Tài khoản ko tồn tại');
                } else if (error.response.status === 404) {
                    setErrorMessage('Không tìm thấy tài khoản để xem');
                }
                else {
                    setErrorMessage(`Lỗi server: ${error.response.status}`);
                }
            } else if (error.request) {
                setErrorMessage('Không nhận được phản hồi từ server.');
            } else {
                setErrorMessage('Lỗi: ' + error.message);
            }
        }
    };
    const handleViewApartment = async (apartmentNumber) =>{
        if(!apartmentNumber) return;
        onOpenPopUp('household',apartmentNumber);
    }
    const handleViewVehicle = async (vehicle) => {
        onOpenPopUp('vehicle', vehicle)
    };
    return (
        <div className="resident-info-container">
             {/* Messages */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Header Section */}
            <div className="resident-header">
                <div className="resident-avatar-container">
                    <img
                        // Use the avatar data from state for display, default if null
                        src={getAvatarUrlFromBytes(residentData?.avatar)}
                        alt="Ảnh đại diện"
                        className="resident-avatar"
                    />
                </div>
                <div className="resident-main-info">
                    {isEditing && isAdmin ? (
                         <input
                            type="text"
                            value={tempFullName}
                            onChange={(e) => setTempFullName(e.target.value)}
                            className="main-info-input full-name-input"
                            placeholder="Họ và tên"
                            autoFocus
                         />
                    ) : (
                         <h2 className="resident-name">{residentData?.fullName || DEFAULT_TEXT}</h2>
                    )}
                    <p className="resident-id">Mã số cư dân: <strong>{residentData?.residentId || DEFAULT_TEXT}</strong></p>

                     {isEditing && isAdmin ? (
                           <input
                             type="text"
                              value={tempApartmentNumber}
                              onChange={(e) => setTempApartmentNumber(e.target.value)}
                             className="main-info-input apartment-number-input"
                             placeholder="Số căn hộ"
                           />
                     ) : (
                         <div className="resident-apartment-wrapper">
                             <p className="resident-apartment">
                                 <FontAwesomeIcon icon={faHome} /> Căn hộ: <strong>{residentData?.apartmentNumber || DEFAULT_TEXT}</strong>
                             </p>
                             <button
                                 className="view-linked-account-button"
                                 onClick={()=>{handleViewApartment(residentData.apartmentNumber)}}
                                 title="Xem thông tin căn hộ"
                             >
                                 Xem
                             </button>
                         </div>
                     )}
                </div>
            </div>
            {/* Information Details - Three Columns */}
            <div className="resident-details-grid">
                {/* Column 1 */}
                <div className="detail-column">
                    <h3>Thông tin chung</h3>
                    <div className="detail-item">
                        <FontAwesomeIcon icon={tempGender === 'Nữ' ? faFemale : faMale} className="detail-icon" />
                        <span>Giới tính: </span>
                        {isEditing && isAdmin ? (
                             <select
                                 value={tempGender}
                                 onChange={(e) => setTempGender(e.target.value)}
                                 className="detail-input"
                             >
                                 <option value="">Chọn</option>
                                 <option value="Nam">Nam</option>
                                 <option value="Nữ">Nữ</option>
                                 <option value="Khác">Khác</option>
                             </select>
                        ) : (
                             <span>{residentData?.gender || DEFAULT_TEXT}</span>
                        )}
                    </div>
                     <div className="detail-item">
                        <FontAwesomeIcon icon={faPhone} className="detail-icon" />
                        <span>Số điện thoại: </span>
                        {isEditing && isAdmin ? (
                             <input
                                 type="text"
                                 value={tempPhoneNumber}
                                 onChange={(e) => setTempPhoneNumber(e.target.value)}
                                 className="detail-input"
                                 placeholder="Số điện thoại"
                             />
                        ) : (
                             <span>{residentData?.phoneNumber || DEFAULT_TEXT}</span>
                        )}
                    </div>
                     <div className="detail-item">
                        <FontAwesomeIcon icon={faEnvelope} className="detail-icon" />
                        <span>Email: </span>
                        {isEditing && isAdmin ? (
                             <input
                                 type="email"
                                 value={tempEmail}
                                 onChange={(e) => setTempEmail(e.target.value)}
                                 className="detail-input"
                                 placeholder="Email cá nhân"
                             />
                        ) : (
                             <span>{residentData?.email || DEFAULT_TEXT}</span>
                        )}
                    </div>
                     <div className="detail-item">
                        <FontAwesomeIcon icon={faBriefcase} className="detail-icon" />
                        <span>Nghề nghiệp: </span>
                        {isEditing && isAdmin ? (
                             <input
                                 type="text"
                                 value={tempOccupation}
                                 onChange={(e) => setTempOccupation(e.target.value)}
                                 className="detail-input"
                                 placeholder="Nghề nghiệp"
                             />
                        ) : (
                             <span>{residentData?.occupation || DEFAULT_TEXT}</span>
                        )}
                    </div>
                     <div className="detail-item">
                        <FontAwesomeIcon icon={faUserTag} className="detail-icon" />
                        <span>Là chủ hộ: </span>
                         {isEditing && isAdmin ? (
                              <select
                                  value={tempIsHouseholdOwner}
                                  onChange={(e) => setTempIsHouseholdOwner(e.target.value === 'true')} // Convert string back to boolean
                                  className="detail-input"
                              >
                                   <option value="false">Không</option>
                                  <option value="true">Có</option>
                              </select>
                         ) : (
                              <span>{formatIsHouseholdOwner(residentData?.isHouseholdOwner)}</span>
                         )}
                    </div>
                     {/* Chỉ hiển thị quan hệ nếu không phải chủ hộ */}
                    {!residentData?.isHouseholdOwner && (
                         <div className="detail-item">
                             <FontAwesomeIcon icon={faUserCircle} className="detail-icon" /> {/* Using UserCircle icon */}
                             <span>Quan hệ với chủ hộ: </span>
                              {isEditing && isAdmin ? (
                                  <input
                                      type="text"
                                      value={tempRelationshipWithOwner}
                                      onChange={(e) => setTempRelationshipWithOwner(e.target.value)}
                                      className="detail-input"
                                      placeholder="Quan hệ với chủ hộ"
                                  />
                              ) : (
                                  <span>{residentData?.relationshipWithOwner || "mối quan hệ phức tạp"}</span>
                              )}
                         </div>
                    )}

                     {/* Linked Account Info */}
                     <div className="detail-item">
                         <FontAwesomeIcon icon={faLink} className="detail-icon" />
                         <span>Tài khoản liên kết: </span>
                         {residentData?.linkingUsername ? (
                             <div className="linked-account-info">
                                 <span>{residentData.linkingUsername}</span>
                                 {/* Button to view linked account details */}
                                <button
                                    className="view-linked-account-button"
                                    onClick={()=>{handleViewLinkedAccount(residentData.linkingUsername)}}
                                    title="Xem thông tin tài khoản"
                                >
                                    Xem
                                </button>
                             </div>
                         ) : (
                             <span>Chưa liên kết tài khoản</span>
                         )}
                     </div>

                </div>

                {/* Column 2 */}
                 <div className="detail-column">
                     <h3>Giấy tờ tùy thân & Sinh sống</h3>
                     <div className="detail-item">
                         <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                         <span>Ngày sinh: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="date"
                                  value={tempDateOfBirth}
                                  onChange={(e) => setTempDateOfBirth(e.target.value)}
                                   className="detail-input"
                               />
                          ) : (
                               <span>{formatDate(residentData?.dateOfBirth)}</span>
                          )}
                     </div>
                      <div className="detail-item">
                         <FontAwesomeIcon icon={faHome} className="detail-icon" /> {/* Using Home icon */}
                         <span>Nơi sinh: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="text"
                                  value={tempPlaceOfBirth}
                                  onChange={(e) => setTempPlaceOfBirth(e.target.value)}
                                   className="detail-input"
                                  placeholder="Nơi sinh"
                               />
                          ) : (
                               <span>{residentData?.placeOfBirth || DEFAULT_TEXT}</span>
                          )}
                     </div>
                     <div className="detail-item">
                         <FontAwesomeIcon icon={faIdCard} className="detail-icon" />
                         <span>Số CCCD: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="text"
                                  value={tempIdentityNumber}
                                  onChange={(e) => setTempIdentityNumber(e.target.value)}
                                   className="detail-input"
                                  placeholder="Số Căn cước công dân"
                               />
                          ) : (
                               <span>{residentData?.identityNumber || DEFAULT_TEXT}</span>
                          )}
                     </div>
                     <div className="detail-item">
                         <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                         <span>Ngày cấp CCCD: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="date"
                                  value={tempCccdIssueDate}
                                  onChange={(e) => setTempCccdIssueDate(e.target.value)}
                                   className="detail-input"
                               />
                          ) : (
                               <span>{formatDate(residentData?.cccdIssueDate)}</span>
                          )}
                     </div>
                     <div className="detail-item">
                         <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                         <span>Ngày hết hạn CCCD: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="date"
                                  value={tempCccdExpiryDate}
                                  onChange={(e) => setTempCccdExpiryDate(e.target.value)}
                                   className="detail-input"
                               />
                          ) : (
                               <span>{formatDate(residentData?.cccdExpiryDate)}</span>
                          )}
                     </div>
                      <div className="detail-item">
                         <FontAwesomeIcon icon={faSignInAlt} className="detail-icon" />
                         <span>Ngày chuyển vào: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="date"
                                  value={tempMoveInDate}
                                  onChange={(e) => setTempMoveInDate(e.target.value)}
                                   className="detail-input"
                               />
                          ) : (
                               <span>{formatDate(residentData?.moveInDate)}</span>
                          )}
                     </div>
                      <div className="detail-item">
                         <FontAwesomeIcon icon={faSignOutAlt} className="detail-icon" />
                         <span>Ngày rời đi: </span>
                          {isEditing && isAdmin ? (
                               <input
                                  type="date"
                                  value={tempMoveOutDate}
                                  onChange={(e) => setTempMoveOutDate(e.target.value)}
                                   className="detail-input"
                               />
                          ) : (
                               <span>{formatDate(residentData?.moveOutDate)}</span>
                          )}
                     </div>
                 </div>
                {/* Column 3 - Vehicles */}
                <div className="detail-column vehicle-column">
                    <h3>Danh sách xe</h3>
                    {isLoadingVehicles ? (
                        <div className="loading-text">Đang tải danh sách xe...</div>
                    ) : vehicleError ? (
                         <div className="error-message small">{vehicleError}</div> // Use a smaller error style for lists
                    ) : vehicleList.length > 0 ? (
                        <div className="vehicle-list-container">
                            {vehicleList.map((vehicle) => (
                                <div key={vehicle.licensePlate} className="vehicle-item" onClick={()=>{handleViewVehicle(vehicle)}}> {/* Assuming licensePlate is unique */}
                                    {(vehicle?.vehicleType==="Car")&&<FontAwesomeIcon icon={faCar} className="vehicle-icon" />}
                                    {(vehicle?.vehicleType==="Motorbike")&&<FontAwesomeIcon icon={faMotorcycle} className="vehicle-icon" />}
                                     {/* Display license plate and maybe a button to view details */}
                                    <span>{vehicle.licensePlate}</span>
                                    {/* Add a button here if you have a separate Vehicle Detail Popup */}
                                     {/* <button className="view-vehicle-button">Xem chi tiết</button> */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data-text">Không có xe đăng ký.</div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                {/* Nút Chỉnh sửa: Chỉ hiển thị nếu viewer là admin và KHÔNG đang chỉnh sửa */}
                {showEditButton && !isEditing ? (
                    <button
                        className="edit-button"
                        onClick={() => {
                            setIsEditing(true);
                            setErrorMessage(''); // Clear previous errors
                            setSuccessMessage(''); // Clear previous success messages
                        }}
                        aria-label="Chỉnh sửa thông tin cư dân"
                    >
                        <FontAwesomeIcon icon={faEdit} className="button-icon"/> Chỉnh sửa
                    </button>
                ) : null}

                {/* Nút Hủy/Lưu: Chỉ hiển thị nếu đang chỉnh sửa */}
                {isEditing && (
                    <div className="edit-actions">
                        <button
                            className="cancel-button"
                            onClick={resetStates} // Reset state về giá trị ban đầu
                            aria-label="Hủy thay đổi"
                        >
                            <FontAwesomeIcon icon={faTimes} className="button-icon"/> Hủy
                        </button>
                        <button
                            className="save-button"
                            onClick={handleSave}
                            aria-label="Lưu thay đổi"
                        >
                           <FontAwesomeIcon icon={faSave} className="button-icon"/> Lưu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResidentPopUp;