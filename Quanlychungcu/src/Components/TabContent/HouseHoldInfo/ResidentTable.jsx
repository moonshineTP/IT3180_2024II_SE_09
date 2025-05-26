// ./Components/TabContent/HouseHoldInfo/ResidentResultTable.jsx (Tạo file mới)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faVenusMars, faBirthdayCake, faHomeUser, faLink,faUserTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ResultTable.css'; // Tạo file CSS riêng hoặc dùng chung/sửa lại AccountTable.css

// Helper function to format dates (YYYY-MM-DD -> DD/MM/YYYY or similar)
const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ResidentResultTable = ({
    residents,          // Danh sách cư dân đã lọc để hiển thị
    onOpenPopUp,        // Hàm từ App để mở popup (truyền type, data, callback)
    refetchResidents,   // Hàm để fetch lại danh sách cư dân sau khi xóa
    viewerAccount,
    setReloadFunc       // Thông tin tài khoản người đang xem (để check quyền admin)
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Hoặc bạn có thể truyền vào làm prop

    const isAdmin = viewerAccount?.role === "admin"; // Xác định quyền admin

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResidents = Array.isArray(residents) ? residents.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Array.isArray(residents) ? Math.ceil(residents.length / itemsPerPage) : 0;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="pagination resident-table-pagination"> {/* Thêm class riêng nếu cần */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        );
    };

    const handleViewResident = (resident) => {
        if (onOpenPopUp) {
            // Mở ResidentPopUp, truyền dữ liệu resident và callback để refetch danh sách này
            // (nếu ResidentPopUp có thể trigger thay đổi làm ảnh hưởng đến bảng này)
            setReloadFunc(() => refetchResidents)
            onOpenPopUp('resident', resident);
        }
    };

    const handleDeleteResident = async (residentId) => {
        if (!residentId) {
            console.error("Resident ID is required for deletion.");
            // alert("Lỗi: Không có mã cư dân để xóa.");
            return;
        }
        if (!window.confirm(`Bạn có chắc chắn muốn xóa cư dân có mã "${residentId}" và các phương tiện liên quan không?`)) {
            return;
        }

        try {
            await axios.delete("http://localhost:8080/api/update/deleteresident", {
                params: { residentId }, // <- request param
                withCredentials: true,
            });
            alert(`Cư dân mã "${residentId}" đã được xóa thành công.`);
            if (refetchResidents) {
                refetchResidents(); // Tải lại danh sách cư dân
            }
        } catch (error) {
            console.error(`Error deleting resident ${residentId}:`, error);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data || "Lỗi không xác định từ server.";
                if (status === 403) {
                    alert("Lỗi: Bạn không có quyền thực hiện hành động này.");
                    window.location.reload(); // Có thể reload nếu lỗi quyền nghiêm trọng
                } else if (status === 400) {
                    alert(`Lỗi: ${message}`);
                } else {
                    alert(`Lỗi server (${status}): ${message}`);
                }
            } else {
                alert("Lỗi xóa cư dân: Không thể kết nối hoặc lỗi không xác định.");
            }
        }
    };

    if (!Array.isArray(residents) || residents.length === 0) {
        return (
            <div className="no-results">
                <p>Không tìm thấy cư dân nào khớp với bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="resident-table-container result-table-container"> {/* Thêm class chung */}
            <table className="result-table resident-table"> {/* Thêm class chung */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Mã cư dân</th>
                        <th><FontAwesomeIcon icon={faVenusMars} /> Giới tính</th>
                        <th><FontAwesomeIcon icon={faBirthdayCake} /> Ngày sinh</th>
                        <th><FontAwesomeIcon icon={faHomeUser} /> Số căn hộ</th>
                        <th><FontAwesomeIcon icon={faUserTag} /> Chủ hộ?</th>
                        <th><FontAwesomeIcon icon={faLink} /> TK Liên kết</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentResidents.map((resident, index) => (
                        <tr key={resident.residentId || index}> {/* Ưu tiên residentId làm key */}
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{resident.fullName || 'N/A'}</td>
                            <td>{resident.residentId || 'N/A'}</td>
                            <td>{resident.gender || 'N/A'}</td>
                            <td>{formatDateDisplay(resident.dateOfBirth)}</td>
                            <td>{resident.apartmentNumber || 'N/A'}</td>
                            <td>{resident.isHouseholdOwner ? 'Có' : 'Không'}</td>
                            <td>{resident.linkingUsername || resident.account?.username || 'Chưa có'}</td>
                            <td className="actions-cell">
                                <div className="action-buttons">
                                    <button
                                        className="icon-btn view-btn"
                                        onClick={() => handleViewResident(resident)}
                                        title="Xem chi tiết cư dân"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            className="icon-btn delete-btn"
                                            onClick={() => handleDeleteResident(resident.residentId)}
                                            title="Xóa cư dân"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination />
        </div>
    );
};

export default ResidentResultTable;