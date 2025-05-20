import React, { useState } from 'react';
import './AccountPopUp.css';
import axios from 'axios';
const AccountPopUp = ({ account }) => {
    console.log("hello");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(account?.username || '');
  const [errorMessage, setErrorMessage] = useState('');

  const getRoleAvatar = () => {
    switch (account?.role) {
      case 'admin':
        return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
      case 'resident':
        return 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    }
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(
        'http://localhost:8080/api/update/changeaccount',
        { username: tempUsername,
          email : account?.email
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setErrorMessage('✅ Cập nhật thành công! Đang tải lại trang...');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            window.location.href = '/index1.html';
            break;
          case 400:
            setErrorMessage(error.response.data.message || 'Cập nhật thất bại');
            break;
          default:
            setErrorMessage('Lỗi không xác định');
        }
      } else {
        setErrorMessage('Lỗi kết nối mạng');
      }
    }
    setIsEditing(false);
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có dữ liệu';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="user-info-container">
      {/* Header Section */}
      <div className="user-header">
        <img 
          src={getRoleAvatar()} 
          alt="avatar" 
          className="role-avatar" 
        />
        <div className="user-main-info">
          <div className="username-section">
            {isEditing ? (
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="username-input"
                autoFocus
              />
            ) : (
              <h2 className="username">{account?.username || 'Chưa đặt tên'}</h2>
            )}
            <div className={`status-dot ${account?.status?.toLowerCase()}`} />
          </div>
          <div className="role-tag">
            {account?.role === 'admin' && 'Quản trị viên'}
            {account?.role === 'resident' && 'Cư dân'}
            {account?.role==='guest' && 'Khách'}
          </div>
        </div>
      </div>

      {/* Information List */}
      <div className="info-list">
        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{account?.email || 'Chưa có email'}</span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Tham gia: {formatDate(account?.createdDate)}</span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hoạt động cuối: {formatDate(account?.lastOffline)}</span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <span>
            Trạng thái: 
            <span className = {`ban-status ${account?.ban?.toLowerCase()}`}>
              {account?.ban === 'Active' ? ' Hoạt động' : ' Bị khóa'}
            </span>
          </span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span>
            Mã cư dân: {account?.resident_id || 'Chưa liên kết'}
          </span>
        </div>
      </div>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      {/* Action Buttons */}
      <div className="action-buttons">
        {!isEditing ? (
          <button 
            className="edit-button"
            onClick={() => {
              setIsEditing(true);
              setErrorMessage('');
            }}
            aria-label="Chỉnh sửa tên người dùng"
          >
            Chỉnh sửa
          </button>
        ) : (
          <div className="edit-actions">
            <button 
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                setTempUsername(account?.username || '');
                setErrorMessage('');
              }}
              aria-label="Hủy thay đổi"
            >
              Hủy
            </button>
            <button 
              className="save-button"
              onClick={handleSave}
              aria-label="Lưu thay đổi"
            >
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPopUp;