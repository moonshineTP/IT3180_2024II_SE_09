// ./Components/TabContent/HouseHoldInfo/HouseHoldcontent.jsx

import React, { useState } from 'react'; // Thêm useEffect nếu chưa có
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HouseHoldInfo.css';
import TabContentFrame2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";
import ResidentResultTable from './ResidentTable'; // Import bảng cư dân
import VehicleResultTable from './VehicleTable';   // Import bảng xe
import CreateItemPrompt from './CreateItemPrompt'; // <-- IMPORT PROMPT
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// ... (các imports icon) ...
import {
    faHome, faFilter, faUndo, faUsers, faCar, faUser, faEnvelope, faIdCard, faLink, faSpinner,
    faCalendarAlt, faVenusMars, faPhone, faBriefcase, faBuilding, faUserTag,
    faSignInAlt, faSignOutAlt, faCarSide, faTags, faPalette, faParking, faStickyNote,
    faCheckSquare, faSquare
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const DEFAULT_FILTER_TEXT = '';
const DEFAULT_FILTER_SELECT = '';

// Component HouseHoldcontent giờ nhận prop onOpenPopUp
function HouseHoldcontent({ViewerAccount, onOpenPopUp, setReloadFunc}) {
    const [filterMode, setFilterMode] = useState('resident');
    const [filteredResidents, setFilteredResidents] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [filterError, setFilterError] = useState(null);
    const [showCreatePrompt, setShowCreatePrompt] = useState(false);
    const [createItemType, setCreateItemType] = useState(null); // 'resident' hoặc 'vehicle'
    const [isCreatingItem, setIsCreatingItem] = useState(false); // Loading state cho API tạo
    const [createPromptError, setCreatePromptError] = useState('');

    const isAdmin= ViewerAccount?.role==="admin";

    const initialResidentFilterState = {
        fullName: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        gender: { value: DEFAULT_FILTER_SELECT, isEnabled: true },
        dateOfBirthFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        dateOfBirthTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        placeOfBirth: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        identityNumber: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        cccdIssueDateFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        cccdIssueDateTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        cccdExpiryDateFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        cccdExpiryDateTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        phoneNumber: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        email: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        occupation: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        apartmentNumber: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        isHouseholdOwner: { value: DEFAULT_FILTER_SELECT, isEnabled: true },
        relationshipWithOwner: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        moveInDateFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        moveInDateTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        moveOutDateFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        moveOutDateTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        linkingUsername: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
    };
    const [residentFilters, setResidentFilters] = useState(initialResidentFilterState);

    const initialVehicleFilterState = {
        licensePlate: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        vehicleType: { value: DEFAULT_FILTER_SELECT, isEnabled: true },
        brand: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        model: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        color: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        registrationDateFrom: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        registrationDateTo: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        parkingSlot: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        note: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
        residentId: { value: DEFAULT_FILTER_TEXT, isEnabled: true },
    };
    const [vehicleFilters, setVehicleFilters] = useState(initialVehicleFilterState);

    // --- Các hàm getFilteredResidents, getFilteredVehicles, filterCombinedResults như trước ---
    // --- 1. HÀM LỌC DANH SÁCH CƯ DÂN (ĐÃ SỬA THEO QUAN ĐIỂM 2) ---
    const getFilteredResidents = (allResidents, criteria) => {
        if (!allResidents) return [];
        if (!criteria || Object.keys(criteria).length === 0) {
            return allResidents;
        }

        return allResidents.filter(resident => {
            for (const key in criteria) {
                const filterValue = criteria[key];
                let residentValue = resident[key]; // Giá trị từ DTO

                if (key.endsWith('From')) {
                    const baseKey = key.slice(0, -4);
                    residentValue = resident[baseKey]; // Lấy giá trị ngày gốc từ DTO
                    const residentDate = residentValue ? new Date(residentValue) : null;
                    const filterDateFrom = filterValue ? new Date(filterValue) : null;

                    if (filterDateFrom) { // Chỉ lọc nếu có giá trị 'From' được nhập
                        if (!residentDate || residentDate < filterDateFrom) {
                            // Nếu ngày của cư dân là NULL HOẶC nhỏ hơn ngày From -> không khớp
                            return false;
                        }
                    }
                } else if (key.endsWith('To')) {
                    const baseKey = key.slice(0, -2);
                    residentValue = resident[baseKey]; // Lấy giá trị ngày gốc từ DTO
                    const residentDate = residentValue ? new Date(residentValue) : null;
                    const filterDateTo = filterValue ? new Date(filterValue) : null;

                    if (filterDateTo) { // Chỉ lọc nếu có giá trị 'To' được nhập
                        const adjustedFilterDateTo = new Date(filterDateTo);
                        adjustedFilterDateTo.setDate(adjustedFilterDateTo.getDate() + 1); // Để bao gồm cả ngày 'To'

                        if (!residentDate || residentDate >= adjustedFilterDateTo) {
                            // Nếu ngày của cư dân là NULL HOẶC lớn hơn hoặc bằng ngày (To + 1) -> không khớp
                            return false;
                        }
                    }
                } else if (typeof residentValue === 'string' && typeof filterValue === 'string') {
                    if (!residentValue.toLowerCase().includes(filterValue.toLowerCase())) {
                        return false;
                    }
                } else if (key === 'isHouseholdOwner' && typeof filterValue === 'boolean') {
                    // Đối với boolean, nếu residentValue là null/undefined, nó sẽ không bằng filterValue (true/false)
                    if (resident.isHouseholdOwner !== filterValue) {
                        return false;
                    }
                }
                // Xử lý các trường hợp giá trị null/undefined cho các filter khác (không phải date)
                // Nếu người dùng nhập filterValue (khác rỗng/default) nhưng residentValue lại là null/undefined -> loại
                else if ((residentValue === undefined || residentValue === null) &&
                          filterValue !== undefined && filterValue !== null && filterValue !== DEFAULT_FILTER_TEXT && filterValue !== DEFAULT_FILTER_SELECT) {
                    return false;
                }
                // So sánh các giá trị khác (số, khớp chính xác string nếu cần)
                else if (residentValue !== undefined && residentValue !== null &&
                          filterValue !== undefined && filterValue !== null &&
                          filterValue !== DEFAULT_FILTER_TEXT && filterValue !== DEFAULT_FILTER_SELECT) {
                    if (residentValue.toString().toLowerCase() !== filterValue.toString().toLowerCase()) {
                        // Có thể cần logic so sánh cụ thể hơn cho từng kiểu nếu không muốn chỉ so sánh string
                        // return false; // Bỏ comment nếu muốn so sánh chính xác hơn
                    }
                }
            }
            return true; // Khớp tất cả các tiêu chí
        });
    };

    // --- 2. HÀM LỌC DANH SÁCH PHƯƠNG TIỆN (ĐÃ SỬA THEO QUAN ĐIỂM 2) ---
    const getFilteredVehicles = (allVehicles, criteria) => {
        if (!allVehicles) return [];
        if (!criteria || Object.keys(criteria).length === 0) {
            return allVehicles;
        }

        return allVehicles.filter(vehicle => {
            for (const key in criteria) {
                const filterValue = criteria[key];
                let vehicleValue = vehicle[key];

                if (key.endsWith('From')) {
                    const baseKey = key.slice(0, -4);
                    vehicleValue = vehicle[baseKey];
                    const vehicleDate = vehicleValue ? new Date(vehicleValue) : null;
                    const filterDateFrom = filterValue ? new Date(filterValue) : null;

                    if (filterDateFrom) {
                        if (!vehicleDate || vehicleDate < filterDateFrom) {
                            return false;
                        }
                    }
                } else if (key.endsWith('To')) {
                    const baseKey = key.slice(0, -2);
                    vehicleValue = vehicle[baseKey];
                    const vehicleDate = vehicleValue ? new Date(vehicleValue) : null;
                    const filterDateTo = filterValue ? new Date(filterValue) : null;

                    if (filterDateTo) {
                        const adjustedFilterDateTo = new Date(filterDateTo);
                        adjustedFilterDateTo.setDate(adjustedFilterDateTo.getDate() + 1);
                        if (!vehicleDate || vehicleDate >= adjustedFilterDateTo) {
                            return false;
                        }
                    }
                } else if (typeof vehicleValue === 'string' && typeof filterValue === 'string') {
                    if (!vehicleValue.toLowerCase().includes(filterValue.toLowerCase())) {
                        return false;
                    }
                } else if (key === 'vehicleType' && filterValue) {
                    if (vehicle.vehicleType !== filterValue) {
                        return false;
                    }
                }
                else if ((vehicleValue === undefined || vehicleValue === null) &&
                          filterValue !== undefined && filterValue !== null && filterValue !== DEFAULT_FILTER_TEXT && filterValue !== DEFAULT_FILTER_SELECT) {
                    return false;
                }
                else if (vehicleValue !== undefined && vehicleValue !== null &&
                          filterValue !== undefined && filterValue !== null &&
                          filterValue !== DEFAULT_FILTER_TEXT && filterValue !== DEFAULT_FILTER_SELECT) {
                    if (vehicleValue.toString().toLowerCase() !== filterValue.toString().toLowerCase()) {
                        // return false;
                    }
                }
            }
            return true;
        });
    };

    const filterCombinedResults = (filteredResidentsList, filteredVehiclesList, mode, activeVehicleFiltersUsed, activeResidentFiltersUsed) => {
        const listA = Array.isArray(filteredResidentsList) ? filteredResidentsList : [];
        const listB = Array.isArray(filteredVehiclesList) ? filteredVehiclesList : [];

        if (mode === 'resident') {
            if (listA.length === 0) return [];
            const vehicleCriteriaApplied = Object.keys(activeVehicleFiltersUsed || {}).length > 0;
            if (!vehicleCriteriaApplied) return listA;
            if (listB.length === 0 && vehicleCriteriaApplied) return []; // Nếu có filter xe nhưng ko có xe nào khớp -> rỗng

            const residentIdsFromFilteredVehicles = new Set(listB.map(v => v.residentId));
            return listA.filter(resident => residentIdsFromFilteredVehicles.has(resident.residentId));
        } else if (mode === 'vehicle') {
            if (listB.length === 0) return [];
            const residentCriteriaApplied = Object.keys(activeResidentFiltersUsed || {}).length > 0;
            if (!residentCriteriaApplied) return listB;
            if (listA.length === 0 && residentCriteriaApplied) return []; // Nếu có filter dân nhưng ko có dân nào khớp -> rỗng

            const residentIdsFromFilteredResidents = new Set(listA.map(r => r.residentId));
            return listB.filter(vehicle => residentIdsFromFilteredResidents.has(vehicle.residentId));
        }
        return [];
    };

    const handleFilterChange = (filterType, field, value) => { /* ... như trước ... */
        if (filterType === 'resident') {
            setResidentFilters(prev => ({ ...prev, [field]: { ...prev[field], value: value } }));
        } else if (filterType === 'vehicle') {
            setVehicleFilters(prev => ({ ...prev, [field]: { ...prev[field], value: value } }));
        }
    };

    const handleToggleFilterField = (filterType, field, newEnabledState) => { /* ... như trước ... */
      if (filterType === 'resident') {
          setResidentFilters(prev => ({ ...prev, [field]: { ...prev[field], isEnabled: newEnabledState !== undefined ? newEnabledState : !prev[field].isEnabled }}));
      } else if (filterType === 'vehicle') {
          setVehicleFilters(prev => ({ ...prev, [field]: { ...prev[field], isEnabled: newEnabledState !== undefined ? newEnabledState : !prev[field].isEnabled }}));
      }
    };

    const handleResetFilters = (filterType) => { /* ... như trước ... */
        if (filterType === 'resident') {
            setResidentFilters(initialResidentFilterState);
        } else if (filterType === 'vehicle') {
            setVehicleFilters(initialVehicleFilterState);
        }
        setFilteredResidents([]);
        setFilteredVehicles([]);
        setFilterError(null);
    };

    const handleApplyFilters = async () => { /* ... như trước, nhớ truyền activeResidentFilters và activeVehicleFilters vào filterCombinedResults ... */
        setIsLoadingResults(true);
        setFilterError(null);
        setFilteredResidents([]);
        setFilteredVehicles([]);

        const activeResidentFilters = {};
        for (const key in residentFilters) {
            if (residentFilters[key].isEnabled && residentFilters[key].value !== DEFAULT_FILTER_SELECT && residentFilters[key].value !== DEFAULT_FILTER_TEXT) {
                if (key.endsWith('From') || key.endsWith('To')) {
                    activeResidentFilters[key] = residentFilters[key].value;
                } else if (key === 'isHouseholdOwner') {
                    if (residentFilters[key].value === 'true') activeResidentFilters[key] = true;
                    else if (residentFilters[key].value === 'false') activeResidentFilters[key] = false;
                }
                else {
                    activeResidentFilters[key] = residentFilters[key].value;
                }
            }
        }

        const activeVehicleFilters = {};
        for (const key in vehicleFilters) {
            if (vehicleFilters[key].isEnabled && vehicleFilters[key].value !== DEFAULT_FILTER_SELECT && vehicleFilters[key].value !== DEFAULT_FILTER_TEXT) {
                activeVehicleFilters[key] = vehicleFilters[key].value;
            }
        }

        console.log("Chế độ lọc:", filterMode);
        console.log("Filter Cư dân sẽ dùng:", activeResidentFilters);
        console.log("Filter Phương tiện sẽ dùng:", activeVehicleFilters);

        try {
            const [residentsResponse, vehiclesResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/GetList/residents', { withCredentials: true }),
                axios.get('http://localhost:8080/api/GetList/vehicles', { withCredentials: true })
            ]);

            const allFetchedResidents = Array.isArray(residentsResponse.data) ? residentsResponse.data : [];
            const allFetchedVehicles = Array.isArray(vehiclesResponse.data) ? vehiclesResponse.data : [];

            const initialFilteredResidents = getFilteredResidents(allFetchedResidents, activeResidentFilters);
            const initialFilteredVehicles = getFilteredVehicles(allFetchedVehicles, activeVehicleFilters);

            console.log("Initial Filtered Residents (A):", initialFilteredResidents.length);
            console.log("Initial Filtered Vehicles (B):", initialFilteredVehicles.length);

            if (filterMode === 'resident') {
                const finalCombinedResidents = filterCombinedResults(initialFilteredResidents, initialFilteredVehicles, 'resident', activeVehicleFilters, activeResidentFilters); // Truyền active filters
                setFilteredResidents(finalCombinedResidents);
                console.log("Final Combined Residents to display:", finalCombinedResidents.length);
            } else if (filterMode === 'vehicle') {
                const finalCombinedVehicles = filterCombinedResults(initialFilteredResidents, initialFilteredVehicles, 'vehicle', activeVehicleFilters, activeResidentFilters); // Truyền active filters
                setFilteredVehicles(finalCombinedVehicles);
                console.log("Final Combined Vehicles to display:", finalCombinedVehicles.length);
            }

        } catch (err) { /* ... error handling ... */
          console.error("Lỗi khi áp dụng bộ lọc:", err);
          let errorMessage = "Đã có lỗi xảy ra khi lọc dữ liệu.";
          if (err.response) {
            errorMessage = `Lỗi từ server: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
            if (err.response.status === 403) errorMessage = "Bạn không có quyền truy cập dữ liệu này.";
          } else if (err.request) {
            errorMessage = "Không thể kết nối đến server.";
          }
          setFilterError(errorMessage);
        } finally {
          setIsLoadingResults(false);
        }
    };


    const renderFilterField = (filterType, fieldKey, label, type = "text", options = [], icon = null) => {
        const filters = filterType === 'resident' ? residentFilters : vehicleFilters;

        if (type === "date") {
            const fromKey = `${fieldKey}From`;
            const toKey = `${fieldKey}To`;
            // **SỬA LỖI Ở ĐÂY: Kiểm tra filters[fromKey] và filters[toKey] trước khi truy cập isEnabled**
            const fromFieldState = filters[fromKey];
            const toFieldState = filters[toKey];

            if (!fromFieldState || !toFieldState) {
                console.error(`Lỗi cấu hình: Thiếu state cho '${fromKey}' hoặc '${toKey}' trong filterType '${filterType}'.`);
                return <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>Lỗi cấu hình filter cho: {label} (Date Range)</div>;
            }

            const isDateEnabled = fromFieldState.isEnabled && toFieldState.isEnabled; // Cả hai phải enabled

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
                              // Khi tick, cả hai From và To đều được set isEnabled theo newState
                              handleToggleFilterField(filterType, fromKey, newState);
                              handleToggleFilterField(filterType, toKey, newState);
                          }}
                          title={isDateEnabled ? "Bỏ chọn khoảng ngày này" : "Lọc theo khoảng ngày này"}
                      />
                  </div>
                  <div className="date-range-filter">
                      <input
                          type="date"
                          value={fromFieldState.value || ''}
                          onChange={(e) => handleFilterChange(filterType, fromKey, e.target.value)}
                          disabled={!fromFieldState.isEnabled} // Vẫn disable riêng lẻ nếu cần
                      />
                      <span>đến</span>
                      <input
                          type="date"
                          value={toFieldState.value || ''}
                          onChange={(e) => handleFilterChange(filterType, toKey, e.target.value)}
                          disabled={!toFieldState.isEnabled} // Vẫn disable riêng lẻ nếu cần
                      />
                  </div>
              </div>
          );
        }
        // Xử lý cho các type khác (text, select)
        const fieldState = filters[fieldKey];
        // **SỬA LỖI Ở ĐÂY: Kiểm tra fieldState trước khi truy cập isEnabled**
        if (!fieldState) {
            console.error(`Lỗi cấu hình: Thiếu state cho '${fieldKey}' trong filterType '${filterType}'.`);
            return <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>Lỗi cấu hình filter cho: {label}</div>;
        }

        return (
            <div className={`filter-field-item ${!fieldState.isEnabled ? 'disabled' : ''}`}>
                <div className="filter-field-header">
                    {icon && <FontAwesomeIcon icon={icon} className="filter-field-icon" />}
                    <label htmlFor={`${filterType}-${fieldKey}`}>{label}:</label>
                    <FontAwesomeIcon
                        icon={fieldState.isEnabled ? faCheckSquare : faSquare}
                        className="filter-field-toggle"
                        onClick={() => handleToggleFilterField(filterType, fieldKey)} // Đảo ngược trạng thái hiện tại
                        title={fieldState.isEnabled ? "Bỏ chọn trường này" : "Chọn trường này để lọc"}
                    />
                </div>
                {type === "text" && ( /* ... input text ... */
                    <input
                        type="text"
                        id={`${filterType}-${fieldKey}`}
                        value={fieldState.value}
                        onChange={(e) => handleFilterChange(filterType, fieldKey, e.target.value)}
                        disabled={!fieldState.isEnabled}
                        placeholder={label}
                    />
                )}
                {type === "select" && ( /* ... select ... */
                    <select
                        id={`${filterType}-${fieldKey}`}
                        value={fieldState.value}
                        onChange={(e) => handleFilterChange(filterType, fieldKey, e.target.value)}
                        disabled={!fieldState.isEnabled}
                    >
                        <option value={DEFAULT_FILTER_SELECT}>Tất cả</option>
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )}
            </div>
        );
    };
    // Hàm mở prompt tạo mới
        const handleOpenCreatePrompt = (type) => {
            setCreateItemType(type);
            setShowCreatePrompt(true);
            setCreatePromptError(''); // Xóa lỗi cũ
        };

        // Hàm đóng prompt
        const handleCloseCreatePrompt = () => {
            setShowCreatePrompt(false);
            setCreateItemType(null);
            setIsCreatingItem(false);
        };

        // Hàm xử lý khi nhấn "Xác nhận Tạo" trong prompt
        const handleSubmitCreateItem = async (primaryId, secondaryId = null) => {
            setIsCreatingItem(true);
            setCreatePromptError('');

            try {
                let createResponse;
                let targetType;
                let targetIdentifier; // Để fetch lại đối tượng sau khi tạo

                if (createItemType === 'resident') {
                    targetType = 'resident';
                    targetIdentifier = { residentId: primaryId };
                    createResponse = await axios.post(
                        'http://localhost:8080/api/update/createresident',
                        { residentId: primaryId },
                        { withCredentials: true }
                    );
                    handleApplyFilters();
                } else if (createItemType === 'vehicle') {
                    targetType = 'vehicle';
                    targetIdentifier = { licensePlate: primaryId }; // API get target vehicle dùng licensePlate
                    createResponse = await axios.post(
                        'http://localhost:8080/api/update/createvehicle',
                        { licensePlate: primaryId, residentId: secondaryId }, // Backend cần cả residentId
                        { withCredentials: true }
                    );
                    handleApplyFilters()
                } else {
                    throw new Error("Loại tạo mới không hợp lệ.");
                }

                if (createResponse.status === 200 || createResponse.status === 201) { // 201 Created cũng OK
                    // API tạo của bạn chỉ trả về message, nên cần fetch lại đối tượng vừa tạo
                    let getResponse;
                    if (targetType === 'resident') {
                        getResponse = await axios.post('http://localhost:8080/api/gettarget/getResident', targetIdentifier, { withCredentials: true });
                    } else if (targetType === 'vehicle') {
                        getResponse = await axios.post('http://localhost:8080/api/gettarget/getVehicle', targetIdentifier, { withCredentials: true });
                    }

                    if (getResponse.data && onOpenPopUp) {
                        onOpenPopUp(targetType, getResponse.data, handleApplyFilters); // Mở popup chỉnh sửa, truyền handleApplyFilters để reload bảng
                        handleCloseCreatePrompt(); // Đóng prompt tạo
                        // handleApplyFilters(); // Tải lại bảng ngay lập tức
                    } else {
                        throw new Error("Không thể lấy thông tin đối tượng vừa tạo.");
                    }
                } else {
                    // Xử lý nếu API tạo không thành công nhưng không ném lỗi (ít gặp với axios)
                    setCreatePromptError(createResponse.data?.message || createResponse.data || "Lỗi khi tạo đối tượng.");
                }
            } catch (error) {
                console.error(`Error creating ${createItemType}:`, error);
                if (error.response) {
                    setCreatePromptError(error.response.data?.message || error.response.data || `Lỗi: ${error.response.status}`);
                } else {
                    setCreatePromptError("Lỗi mạng hoặc server không phản hồi.");
                }
            } finally {
                setIsCreatingItem(false);
            }
        };
    const handleFilterForRefresh = async () => {
        // Logic này cần gọi lại API GetList/residents và GetList/vehicles
        // sau đó áp dụng lại các filter hiện tại để cập nhật filteredResidents và filteredVehicles
        // Đây là một phiên bản rút gọn, bạn cần làm cho nó đầy đủ hơn
        // bằng cách tái sử dụng logic trong handleApplyFilters hoặc tách ra hàm fetch và filter riêng
        console.log("Triggering refetch via handleFilterForRefresh...");
        await handleApplyFilters(); // Gọi lại hàm lọc chính
    };

    return ( /* ... JSX như trước, gọi renderFilterField ... */
         <>
            {/* Household Header */}
            <div className="householdHeader">
                <FontAwesomeIcon icon={faHome} className="header-icon" />
                <span className="header-text">Thông tin Cư dân & Phương tiện</span>
                <FontAwesomeIcon icon={faHome} className="header-icon" />
            </div>

            {/* Filter Panel */}
            <div className="main-filter-panel">
                <div className="filter-panel-header">
                    <h3><FontAwesomeIcon icon={faFilter} /> Bộ lọc chi tiết</h3>
                </div>

                <div className="filter-mode-selector">
                    <button
                        className={`mode-button ${filterMode === 'resident' ? 'active' : ''}`}
                        onClick={() => setFilterMode('resident')}
                    >
                        <FontAwesomeIcon icon={faUsers} /> Lọc theo Cư dân
                    </button>
                    <button
                        className={`mode-button ${filterMode === 'vehicle' ? 'active' : ''}`}
                        onClick={() => setFilterMode('vehicle')}
                    >
                        <FontAwesomeIcon icon={faCar} /> Lọc theo Phương tiện
                    </button>
                </div>
                {isAdmin && (
                    <div className="create-new-buttons">
                        <button onClick={() => handleOpenCreatePrompt('resident')} className="create-new-btn">
                            <FontAwesomeIcon icon={faPlusCircle} /> Tạo Cư dân Mới
                        </button>
                        <button onClick={() => handleOpenCreatePrompt('vehicle')} className="create-new-btn">
                            <FontAwesomeIcon icon={faPlusCircle} /> Tạo Phương tiện Mới
                        </button>
                    </div>
                )}
                {/* Resident Filters */}
                {filterMode === 'resident' && (
                    <div className="filter-section resident-filters">
                        <h4>Bộ lọc Cư dân</h4>
                        <div className="filter-grid">
                            {renderFilterField('resident', 'fullName', 'Họ và tên', 'text', [], faUser)}
                            {renderFilterField('resident', 'gender', 'Giới tính', 'select', [ { value: 'Nam', label: 'Nam' }, { value: 'Nữ', label: 'Nữ' }, { value: 'Khác', label: 'Khác' }], faVenusMars)}
                            {renderFilterField('resident', 'apartmentNumber', 'Số căn hộ', 'text', [], faBuilding)}
                            {isAdmin && renderFilterField('resident', 'identityNumber', 'Số CCCD', 'text', [], faIdCard)}
                            {isAdmin && renderFilterField('resident', 'phoneNumber', 'Số điện thoại', 'text', [], faPhone)}
                            {isAdmin && renderFilterField('resident', 'email', 'Email', 'text', [], faEnvelope)}
                            {renderFilterField('resident', 'occupation', 'Nghề nghiệp', 'text', [], faBriefcase)}
                            {renderFilterField('resident', 'isHouseholdOwner', 'Là chủ hộ', 'select', [ { value: 'true', label: 'Có' }, { value: 'false', label: 'Không' }], faUserTag)}
                            {renderFilterField('resident', 'relationshipWithOwner', 'Quan hệ với chủ hộ', 'text', [], faUserTag)}
                            {renderFilterField('resident', 'linkingUsername', 'Username tài khoản liên kết', 'text', [], faLink)}
                            {renderFilterField('resident', 'dateOfBirth', 'Ngày sinh (khoảng)', 'date', [], faCalendarAlt)}
                            {isAdmin && renderFilterField('resident', 'cccdIssueDate', 'Ngày cấp CCCD (khoảng)', 'date', [], faCalendarAlt)}
                            {isAdmin && renderFilterField('resident', 'cccdExpiryDate', 'Ngày hết hạn CCCD (khoảng)', 'date', [], faCalendarAlt)}
                            {renderFilterField('resident', 'moveInDate', 'Ngày chuyển vào (khoảng)', 'date', [], faSignInAlt)}
                            {renderFilterField('resident', 'moveOutDate', 'Ngày rời đi (khoảng)', 'date', [], faSignOutAlt)}
                             {renderFilterField('resident', 'placeOfBirth', 'Nơi sinh', 'text', [], faHome)}
                        </div>
                        <div className="filter-actions-section">
                            <button onClick={() => handleResetFilters('resident')} className="reset-filter-btn">
                                <FontAwesomeIcon icon={faUndo} /> Đặt lại Filter Cư dân
                            </button>
                        </div>
                    </div>
                )}

                {/* Vehicle Filters */}
                {filterMode === 'vehicle' && (
                    <div className="filter-section vehicle-filters">
                        <h4>Bộ lọc Phương tiện</h4>
                        <div className="filter-grid">
                            {renderFilterField('vehicle', 'licensePlate', 'Biển số xe', 'text', [], faCarSide)}
                            {renderFilterField('vehicle', 'vehicleType', 'Loại xe', 'select', [ { value: 'Car', label: 'Ô tô' }, { value: 'Motorbike', label: 'Xe máy' } ], faCarSide)}
                            {renderFilterField('vehicle', 'brand', 'Hãng xe', 'text', [], faTags)}
                            {renderFilterField('vehicle', 'model', 'Dòng xe', 'text', [], faTags)}
                            {renderFilterField('vehicle', 'color', 'Màu sắc', 'text', [], faPalette)}
                            {renderFilterField('vehicle', 'parkingSlot', 'Vị trí đỗ xe', 'text', [], faParking)}
                            {renderFilterField('vehicle', 'residentId', 'Mã chủ xe (liên kết)', 'text', [], faUser)}
                            {renderFilterField('vehicle', 'registrationDate', 'Ngày đăng ký (khoảng)', 'date', [], faCalendarAlt)}
                            {renderFilterField('vehicle', 'note', 'Ghi chú', 'text', [], faStickyNote)}
                        </div>
                        <div className="filter-actions-section">
                            <button onClick={() => handleResetFilters('vehicle')} className="reset-filter-btn">
                                <FontAwesomeIcon icon={faUndo} /> Đặt lại Filter Phương tiện
                            </button>
                        </div>
                    </div>
                )}

                <div className="apply-all-filters-section">
                    <button onClick={handleApplyFilters} className="apply-all-btn">
                        <FontAwesomeIcon icon={faFilter} /> Áp dụng tất cả bộ lọc
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div className="filter-results-panel">
                <h3>Kết quả lọc ({filterMode === 'resident' ? 'Cư dân' : 'Phương tiện'})</h3>
                {isLoadingResults && <div><FontAwesomeIcon icon={faSpinner} spin /> Đang tải kết quả...</div>}
                {filterError && <div className="error-message">{filterError}</div>}

                {filterMode === 'resident' && !isLoadingResults && !filterError && (
                    <ResidentResultTable
                        residents={filteredResidents}
                        onOpenPopUp={onOpenPopUp}
                        refetchResidents={handleFilterForRefresh} // Truyền hàm refetch
                        viewerAccount={ViewerAccount} // Truyền thông tin viewer
                        setReloadFunc={setReloadFunc}
                    />
                )}
                {filterMode === 'vehicle' && !isLoadingResults && !filterError && (
                    <VehicleResultTable
                        vehicles={filteredVehicles}
                        onOpenPopUp={onOpenPopUp}
                        refetchVehicles={handleFilterForRefresh} // Truyền hàm refetch
                        viewerAccount={ViewerAccount} // Truyền thông tin viewer
                        setReloadFunc={setReloadFunc}
                    />
                )}
                {/* Thông báo không có kết quả sẽ nằm trong từng component bảng */}
            </div>
            {/* Prompt tạo mới */}
            {showCreatePrompt && (
                <CreateItemPrompt
                    itemType={createItemType}
                    onSubmit={handleSubmitCreateItem}
                    onClose={handleCloseCreatePrompt}
                    isLoading={isCreatingItem}
                    errorMessage={createPromptError}
                />
            )}
        </>
    );
}

export default function HouseHoldInfo({ onOpenPopUp, ViewerAccount ,setReloadFunc}) {
    return <TabContentFrame2 content={<HouseHoldcontent onOpenPopUp={onOpenPopUp} ViewerAccount={ViewerAccount} setReloadFunc={setReloadFunc}/>}/>;
}
