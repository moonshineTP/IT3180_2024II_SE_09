// ./Components/TabContent/HouseHoldInfo/VehicleResultTable.jsx (Tạo file mới)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faCar, faMotorcycle, faPalette, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ResultTable.css'; // Tái sử dụng CSS từ ResidentResultTable hoặc tạo file chung

// Helper function to format LocalDateTime (tương tự ResidentResultTable)
const formatVehicleRegDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'N/A';
    // Chỉ hiển thị ngày tháng cho ngày đăng ký xe
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const VehicleResultTable = ({
    vehicles,           // Danh sách xe đã lọc để hiển thị
    onOpenPopUp,        // Hàm từ App để mở popup (truyền type, data, callback)
    refetchVehicles,    // Hàm để fetch lại danh sách xe sau khi xóa
    viewerAccount,
    setReloadFunc    // Thông tin tài khoản người đang xem
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const isAdmin = viewerAccount?.role === "admin";

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVehicles = Array.isArray(vehicles) ? vehicles.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Array.isArray(vehicles) ? Math.ceil(vehicles.length / itemsPerPage) : 0;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const Pagination = () => { /* ... (Tương tự ResidentResultTable, có thể tách thành component riêng) ... */
        if (totalPages <= 1) return null;
        return (
            <div className="pagination vehicle-table-pagination">
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

    const handleViewVehicle = (vehicle) => {
        if (onOpenPopUp) {
            setReloadFunc(() => refetchVehicles)
            onOpenPopUp('vehicle', vehicle);
        }
    };

    const handleDeleteVehicle = async (licensePlate) => {
        if (!licensePlate) {
            console.error("License plate is required for deletion.");
            // alert("Lỗi: Không có biển số xe để xóa.");
            return;
        }
        if (!window.confirm(`Bạn có chắc chắn muốn xóa phương tiện có biển số "${licensePlate}" không?`)) {
            return;
        }

        try {
            // API endpoint để xóa vehicle (điều chỉnh nếu cần)
            await axios.delete('http://localhost:8080/api/update/deletevehicle', {
            data: {
                licensePlate: licensePlate
            },
            withCredentials: true
            });

            alert(`Phương tiện biển số "${licensePlate}" đã được xóa thành công.`);
            if (refetchVehicles) {
                refetchVehicles(); // Tải lại danh sách phương tiện
            }
        } catch (error) {
            console.error(`Error deleting vehicle ${licensePlate}:`, error);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data || "Lỗi không xác định từ server.";
                if (status === 403) {
                    alert("Lỗi: Bạn không có quyền thực hiện hành động này.");
                     //window.location.reload();
                } else if (status === 400 || status === 404) {
                    alert(`Lỗi: ${message}`);
                } else {
                    alert(`Lỗi server (${status}): ${message}`);
                }
            } else {
                alert("Lỗi xóa phương tiện: Không thể kết nối hoặc lỗi không xác định.");
            }
        }
    };

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
        return (
            <div className="no-results">
                <p>Không tìm thấy phương tiện nào khớp với bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="vehicle-table-container result-table-container">
            <table className="result-table vehicle-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Biển số xe</th>
                        <th><FontAwesomeIcon icon={faCar} /> Loại xe</th>
                        <th>Hãng xe</th>
                        <th>Dòng xe</th>
                        <th><FontAwesomeIcon icon={faPalette} /> Màu sắc</th>
                        <th><FontAwesomeIcon icon={faCalendarCheck} /> Ngày ĐK</th>
                        <th>Mã chủ xe</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVehicles.map((vehicle, index) => (
                        <tr key={vehicle.licensePlate || index}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{vehicle.licensePlate || 'N/A'}</td>
                            <td>
                                {vehicle.vehicleType === 'Car' && <FontAwesomeIcon icon={faCar} title="Ô tô" />}
                                {vehicle.vehicleType === 'Motorbike' && <FontAwesomeIcon icon={faMotorcycle} title="Xe máy" />}
                                <span style={{ marginLeft: '5px' }}>{vehicle.vehicleType || 'N/A'}</span>
                            </td>
                            <td>{vehicle.brand || 'N/A'}</td>
                            <td>{vehicle.model || 'N/A'}</td>
                            <td>{vehicle.color || 'N/A'}</td>
                            <td>{formatVehicleRegDate(vehicle.registrationDate)}</td>
                            <td>{vehicle.residentId || 'N/A'}</td>
                            <td className="actions-cell">
                                <div className="action-buttons">
                                    <button
                                        className="icon-btn view-btn"
                                        onClick={() => handleViewVehicle(vehicle)}
                                        title="Xem chi tiết phương tiện"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            className="icon-btn delete-btn"
                                            onClick={() => handleDeleteVehicle(vehicle.licensePlate)}
                                            title="Xóa phương tiện"
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

export default VehicleResultTable;