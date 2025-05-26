// ./Components/TabContent/Households/HouseholdPopUp.jsx (Create this new file)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HouseholdPopUp.css'; // Create this CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMale, faFemale, faUserCircle, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_TEXT = 'Chưa có dữ liệu';

// Helper function to format boolean IsHouseholdOwner for display
const formatIsHouseholdOwnerDisplay = (isOwner) => {
    if (isOwner === null || isOwner === undefined) return DEFAULT_TEXT;
    return isOwner ? 'Chủ hộ' : 'Thành viên';
};

// Component HouseholdPopUp
// Props:
// - data: Object containing apartmentNumber (e.g., { apartmentNumber: '101' })
// - onOpenPopUp: Function from App to open other popups (like ResidentPopUp)
const HouseholdPopUp = ({ data, onOpenPopUp }) => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const apartmentNumber = data; // Get apartmentNumber from prop

    useEffect(() => {
        if (!apartmentNumber) {
            setError('Không có thông tin số căn hộ để tải.');
            setMembers([]); // Clear members if no apartment number
            return;
        }
        const fetchHouseholdMembers = async () => {
            setIsLoading(true);
            setError(null);
            setMembers([]); // Clear previous members before fetching

            try {
                // API endpoint to get residents by apartment number
                const response = await axios.post(
                    'http://localhost:8080/api/gettarget/getResidentsByApartment',
                    { apartmentNumber: apartmentNumber }, // Payload
                    { withCredentials: true }
                );

                // Check if response.data is an array (for success) or string (for "No residents found")
                if (Array.isArray(response.data)) {
                    setMembers(response.data);
                } else if (typeof response.data === 'string') {
                    // Handle "No residents found" message
                    setError(response.data); // Or set a more user-friendly message
                    setMembers([]);
                } else {
                     // Handle unexpected response format
                    setError('Phản hồi không hợp lệ từ server.');
                    setMembers([]);
                }
            } catch (err) {
                console.error("Error fetching household members:", err);
                if (err.response) {
                    if (err.response.status === 403) {
                        setError('Bạn không có quyền xem thông tin hộ gia đình này.');
                    } else if (err.response.status === 400) {
                        setError(err.response.data || 'Yêu cầu không hợp lệ (ví dụ: thiếu số căn hộ).');
                    } else if (err.response.status === 404) {
                        setError(`Không tìm thấy thông tin cho căn hộ ${apartmentNumber}.`);
                    } else {
                        setError(`Lỗi server: ${err.response.status}`);
                    }
                } else if (err.request) {
                    setError('Không nhận được phản hồi từ server.');
                } else {
                    setError('Lỗi khi tải dữ liệu: ' + err.message);
                }
                setMembers([]); // Clear members on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchHouseholdMembers();
    }, [apartmentNumber]); // Rerun effect if apartmentNumber changes
    // Handle clicking on a member card to open ResidentPopUp
    const handleMemberClick = async (residentId) => {
        if (!residentId) {
            console.error("Resident ID is missing, cannot open details.");
            setError("Không thể mở chi tiết, thiếu mã cư dân.");
            return;
        }
        if (onOpenPopUp && typeof onOpenPopUp === 'function') {
            // Before opening ResidentPopUp, we need the FULL resident data.
            // The current API /getResidentsByApartment only returns a subset.
            // So, we need to fetch the full resident details first.
            try {
                // API endpoint to get full resident details by residentId
                // Assuming your backend has an endpoint like this, or adjust as needed
                // If you already have a hook or service for this, use it.
                const response = await axios.post(
                    `http://localhost:8080/api/gettarget/getResident`, // Example endpoint
                    { residentId: residentId },
                    { withCredentials: true }
                );

                if (response.data) {
                    // Open ResidentPopUp with the full resident data
                    // The 'reloadFunc' (onSuccessCallback for ResidentPopUp) might not be relevant
                    // when opening from HouseholdPopUp, unless you want to refetch household list
                    // after editing a resident. For now, pass null or a specific callback.
                    onOpenPopUp('resident', response.data); // Pass 'resident' type, full data, and null for success callback
                } else {
                    setError(`Không tìm thấy thông tin chi tiết cho cư dân mã ${residentId}.`);
                }
            } catch (err) {
                console.error("Error fetching full resident details:", err);
                setError(`Lỗi khi tải chi tiết cư dân: ${err.message}`);
                 if (err.response?.status === 403) {
                     setError('Không có quyền xem chi tiết cư dân này.');
                 }
            }
        } else {
            console.warn("onOpenPopUp prop is missing, cannot open resident details.");
            setError("Chức năng xem chi tiết thành viên không khả dụng.");
        }
    };

    return (
        <div className="household-popup-container">
            <h2 className="household-popup-title">
                <FontAwesomeIcon icon={faUsers} /> Thông tin gia đình căn hộ: <strong>{apartmentNumber || 'N/A'}</strong>
            </h2>

            {isLoading && (
                <div className="loading-indicator">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    <p>Đang tải thành viên...</p>
                </div>
            )}

            {error && !isLoading && ( // Show error only if not loading
                <div className="error-message household-error">
                    <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                </div>
            )}

            {!isLoading && !error && members.length === 0 && (
                <p className="no-members-text">Không có thành viên nào trong căn hộ này.</p>
            )}

            {!isLoading && !error && members.length > 0 && (
                <div className="household-members-list">
                    {members.map((member) => (
                        <button
                            key={member.residentId}
                            className="member-card"
                            type="button"
                            onClick={() => handleMemberClick(member.residentId)}
                        >
                            <FontAwesomeIcon
                                icon={member.gender === 'Nữ' ? faFemale : member.gender === 'Nam' ? faMale : faUserCircle}
                                className="member-icon"
                            />
                            <div className="member-info">
                                <p className="member-name">{member.fullName || DEFAULT_TEXT}</p>
                                <p className="member-detail">
                                    {formatIsHouseholdOwnerDisplay(member.isHouseholdOwner)}
                                    {member.relationshipWithOwner && !member.isHouseholdOwner && (
                                        <span> - {member.relationshipWithOwner} của chủ hộ</span>
                                    )}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HouseholdPopUp;