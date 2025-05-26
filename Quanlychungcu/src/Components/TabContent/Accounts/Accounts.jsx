// ./Components/TabContent/Accounts/Accountcontent.js (adjust path as needed)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Account.css'; // Make sure this path is correct
import TabContentFrame2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";
import AccountTable from './AccountTable';
import { 
  faUserCircle, 
  faFilter, 
  faUser, 
  faEnvelope, 
  faUserTag, 
  faSignal, 
  faToggleOn, 
  faCalendar,
  faUndo,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Accountcontent({ onOpenPopUp,setReloadFunc}) {
   const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [ban, setBan] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [lastOfflineFrom, setLastOfflineFrom] = useState('');
  const [lastOfflineTo, setLastOfflineTo] = useState('');
  const[residentId, setResidentId] =useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  // Hàm xử lý reset
  const handleReset = () => {
    setUsername('');
    setEmail('');
    setRole('');
    setStatus('');
    setBan('');
    setResidentId('');
    setCreatedFrom('');
    setCreatedTo('');
    setLastOfflineFrom('');
    setLastOfflineTo('');
  };
  const handleFilter = async () => {
  try {
    // Gọi API lấy danh sách tài khoản
    const response = await axios.get('http://localhost:8080/api/GetList/accounts',{withCredentials: true});
    const allAccounts = response.data;
    // Áp dụng bộ lọc
    const filteredAccounts = allAccounts.filter(account => {
      // Lọc theo username
      const usernameMatch = !username || 
        account.username.toLowerCase().includes(username.toLowerCase());

      // Lọc theo email
      const emailMatch = !email || 
        account.email.toLowerCase().includes(email.toLowerCase());
      const residentIdMatch = !residentId ||
       account.residentId.toLowerCase().includes(residentId.toLowerCase())

      // Lọc theo role
      const roleMatch = !role || account.role === role;

      // Lọc theo status
      const statusMatch = !status || account.status === status;

      // Lọc theo activity
      const banMatch = !ban || account.ban === ban;

      // Lọc theo ngày tạo
      const createdDate = new Date(account.createdDate);
      const createdFromDate = createdFrom ? new Date(createdFrom) : null;
      const createdToDate = createdTo ? new Date(createdTo) : null;
      
      let createdMatch = true;
      if (createdFromDate && createdToDate) {
        createdMatch = createdDate >= createdFromDate && createdDate <= createdToDate;
      } else if (createdFromDate) {
        createdMatch = createdDate >= createdFromDate;
      } else if (createdToDate) {
        createdMatch = createdDate <= createdToDate;
      }

      // Lọc theo last offline
      const lastOfflineDate = new Date(account.lastOffline);
      const lastOfflineFromDate = lastOfflineFrom ? new Date(lastOfflineFrom) : null;
      const lastOfflineToDate = lastOfflineTo ? new Date(lastOfflineTo) : null;
      
      let lastOfflineMatch = true;
      if (lastOfflineFromDate && lastOfflineToDate) {
        lastOfflineMatch = lastOfflineDate >= lastOfflineFromDate && lastOfflineDate <= lastOfflineToDate;
      } else if (lastOfflineFromDate) {
        lastOfflineMatch = lastOfflineDate >= lastOfflineFromDate;
      } else if (lastOfflineToDate) {
        lastOfflineMatch = lastOfflineDate <= lastOfflineToDate;
      }

      return usernameMatch && emailMatch && roleMatch && 
             statusMatch && banMatch && 
             createdMatch && lastOfflineMatch&&residentIdMatch;
    });
    setFilteredAccounts(filteredAccounts);
    // Xử lý kết quả filteredAccounts ở đây
    console.log('Danh sách đã lọc:', filteredAccounts);
  } catch (error) {
    console.error('Lỗi khi lọc tài khoản:', error);
    if(error.response.status===403) window.location.reload();
  } 
};

  return (
    <>
      {/* Account Header */}
      <div className="accountHeader">
        <FontAwesomeIcon icon={faUserCircle} className="header-icon" />
        <span className="header-text">Thông tin tài khoản</span>
        <FontAwesomeIcon icon={faUserCircle} className="header-icon" />
      </div>

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="filter-actions">
          <button 
            className="filter-btn reset-btn"
            onClick={handleReset}
          >
            <FontAwesomeIcon icon={faUndo} />
            <span>Đặt lại</span>
          </button>
          <button 
            className="filter-btn apply-btn"
            onClick={handleFilter}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Áp dụng lọc</span>
          </button>
        </div>
        <div className="filter-header">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <h3>Bộ lọc tài khoản</h3>
        </div>

        {/* Cập nhật các input với state và onChange */}
        <div className="filter-grid">
          {/* Username Input */}
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input 
              type="text" 
              placeholder="Tên người dùng"
              className="filter-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input 
              type="email" 
              placeholder="Địa chỉ email"
              className="filter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* residentId Input */}
          <div className="input-group">
            <FontAwesomeIcon icon={faPeopleGroup} className="input-icon" />
            <input 
              type="text" 
              placeholder="Mã số cư dân"
              className="filter-input"
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
            />
          </div>

          {/* Role Select */}
          <div className="input-group">
            <FontAwesomeIcon icon={faUserTag} className="input-icon" />
            <select 
              className="filter-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Vai trò</option>
              <option value="guest">Khách</option>
              <option value="resident">Cư dân</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="input-group">
            <FontAwesomeIcon icon={faSignal} className="input-icon" />
            <select 
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Activity Select */}
          <div className="input-group">
            <FontAwesomeIcon icon={faToggleOn} className="input-icon" />
            <select 
              className="filter-select"
              value={ban}
              onChange={(e) => setBan(e.target.value)}
            >
              <option value="">Hoạt động</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Date Pickers */}
          <div className="date-group">
            <div className="date-pair">
              <FontAwesomeIcon icon={faCalendar} className="input-icon" />
              <div className="date-inputs">
                <label>Ngày tạo:</label>
                <div className="date-range">
                  <input 
                    type="date" 
                    className="filter-date"
                    value={createdFrom}
                    onChange={(e) => setCreatedFrom(e.target.value)}
                  />
                  <span>đến</span>
                  <input 
                    type="date" 
                    className="filter-date"
                    value={createdTo}
                    onChange={(e) => setCreatedTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="date-pair">
              <FontAwesomeIcon icon={faCalendar} className="input-icon" />
              <div className="date-inputs">
                <label>Lần offline cuối:</label>
                <div className="date-range">
                  <input 
                    type="date" 
                    className="filter-date"
                    value={lastOfflineFrom}
                    onChange={(e) => setLastOfflineFrom(e.target.value)}
                  />
                  <span>đến</span>
                  <input 
                    type="date" 
                    className="filter-date"
                    value={lastOfflineTo}
                    onChange={(e) => setLastOfflineTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AccountTable filteredAccounts={filteredAccounts} refetchAccounts={handleFilter} onOpenPopUp={onOpenPopUp} setReloadFunc={setReloadFunc}/>
    </>
  );
}

export default function AccountInfo({ onOpenPopUp, setReloadFunc}) {
  return <TabContentFrame2 content={<Accountcontent onOpenPopUp={onOpenPopUp} setReloadFunc={setReloadFunc}/>} />;
}