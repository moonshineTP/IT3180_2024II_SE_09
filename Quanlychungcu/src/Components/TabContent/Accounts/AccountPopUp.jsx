import React, { useState , useEffect} from 'react';
import './AccountPopUp.css';
import axios from 'axios';
import { validateUsername } from '../../Service/ValidateService';
const AccountPopUp = ({account,reloadFunc,onOpenPopUp,viewerAccount}) => {
    console.log("hello");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(account?.username || '');
  const [tempResidentId, setTempResidentId] = useState(account?.residentId || '');
  const [tempRole, setTempRole] = useState(account?.role || '');
  const [tempBan, setTempBan] = useState(account?.ban || 'Active');
  const [errorMessage, setErrorMessage] = useState('');
  const [accounts, setAccounts] = useState(account);
  const isAdmin= viewerAccount.role==="admin";
  const isOwner= viewerAccount.username==account?.username;
  const showEditButton=isAdmin||isOwner;
  const getAvatarByRole = (role) => {
    switch (role) {
      case 'admin':
        return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
      case 'resident':
        return 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    }
  };
  const [tempAvatar, setTempAvatar] = useState(() => getAvatarByRole(accounts?.role));
  const resetStates = () => {
    setIsEditing(false);
    setTempUsername(accounts?.username || '');
    setTempResidentId(accounts?.residentId || '');
    setTempRole(accounts?.role || '');
    setTempBan(accounts?.ban || 'Active');
    setErrorMessage('');
  };
  const handleSave = async () => {
    let a=validateUsername(tempUsername);
    if(a!=="Successful!") {setErrorMessage(a); return;}
    try {
      const updateData = {
        username: tempUsername,
        email: accounts?.email,
        ...(isAdmin && { // Chỉ thêm các field này nếu là admin
          role: tempRole,
          residentId: tempResidentId,
          ban: tempBan
        })
      };
      await axios.put(
        'http://localhost:8080/api/update/changeaccount',
        updateData,
        { withCredentials: true }
      );
      setAccounts(prev => ({
        ...account,
        ...prev,
        username: tempUsername,
        ...(isAdmin && {
          role: tempRole,
          residentId: tempResidentId,
          ban: tempBan
        })
      }));
      if(reloadFunc) reloadFunc();
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
    }finally {
      setIsEditing(false);
    }
  };
  const handleResidentClick = async (residentId) =>{
    if (!residentId || residentId.trim() === "") return;
    try{
      const response = await axios.post(
        'http://localhost:8080/api/gettarget/getResident',
        {residentId:residentId},
        { withCredentials: true }
      );
      onOpenPopUp('resident', response.data);
    }catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            window.location.reload();
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
  }
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
  useEffect(() => {
    setTempAvatar(getAvatarByRole(tempRole));
  }, [tempRole]);

  return (
    <div className="user-info-container">
      {/* Header Section */}
      <div className="user-header">
        <img 
          src={tempAvatar}  
          alt="avatar" 
          className="role-avatar" 
        />
        <div className="user-main-info">
          <div className="username-section">
            {(isEditing&&(isOwner||isAdmin)) ? (
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="username-input"
                autoFocus
              />
            ) : (
              <h2 className="username">{accounts?.username || 'Chưa đặt tên'}</h2>
            )}
            <div className={`status-dot ${accounts?.status?.toLowerCase()}`} />
          </div>
          <div className="role-tag">
            {isEditing && isAdmin ? (
              <select
                value={tempRole}
                onChange={(e) => setTempRole(e.target.value)}
                className="role-select"
              >
                <option value="admin">Quản trị viên</option>
                <option value="resident">Cư dân</option>
                <option value="guest">Khách</option>
              </select>
            ) : (
              <>
                {accounts?.role === 'admin' && 'Quản trị viên'}
                {accounts?.role === 'resident' && 'Cư dân'}
                {accounts?.role === 'guest' && 'Khách'}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Information List */}
      <div className="info-list">
        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{accounts?.email || 'Chưa có email'}</span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Tham gia: {formatDate(accounts?.createdDate)}</span>
        </div>

        <div className="info-item">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hoạt động cuối: {formatDate(accounts?.lastOffline)}</span>
        </div>

        <div className="info-item">
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span>
          Trạng thái:{" "}
          {isEditing && isAdmin ? (
            <select
              value={tempBan}
              onChange={(e) => setTempBan(e.target.value)}
              className="ban-select"
            >
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Bị khóa</option>
            </select>
          ) : (
            <span className={`ban-status ${accounts?.ban?.toLowerCase()}`}>
              {accounts?.ban === "Active" ? " Hoạt động" : " Bị khóa"}
            </span>
          )}
        </span>
      </div>

      <div className="info-item">
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
        <span>
          Mã cư dân:{" "}
          {isEditing && isAdmin && (tempRole === "resident") ? (
            <input
              type="text"
              value={tempResidentId}
              onChange={(e) => setTempResidentId(e.target.value)}
              className="resident-input"
            />
          ) : (
            <div className="resident-id-link" onClick={() => handleResidentClick(accounts?.residentId)}>
              {accounts?.residentId || "Chưa liên kết"}
            </div>
          )}
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
          showEditButton && (
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
          )
        ) : (
          <div className="edit-actions">
            <button 
              className="cancel-button"
              onClick={resetStates}
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
}
export default AccountPopUp;