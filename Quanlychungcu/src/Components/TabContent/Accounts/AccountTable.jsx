// AccountTable.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './AccountTable.css';

const AccountTable = ({ filteredAccounts, refetchAccounts, onOpenPopUp, setReloadFunc}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchPrivateAccount = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/gettarget/getPrivateAccount',null,{
          withCredentials: true
        });
        setIsAdmin(response.data?.role === 'admin');
      } catch (error) {
        console.error('Error fetching private account:', error);
        if(error.response.status===403) window.location.reload();
      }
    };

    fetchPrivateAccount();
  }, []);
   // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })} ${date.toLocaleDateString('en-GB')}`;
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const Pagination = () => {
    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
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
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const handleView = (account) => {
    console.log("đang xem " + account);
    setReloadFunc(() => refetchAccounts)
    onOpenPopUp('account', account);
  };

  const handleDelete = async (account) => {
    console.log("đang xóa " + account)
    const isEmail = account.email && account.email.trim() !== '';
    const payload = isEmail
      ? { email: account.email }
      : { username: account.username };
    try {
      await axios.delete('http://localhost:8080/api/update/deleteaccount', {
        data: payload,
        withCredentials: true
      });
      if (refetchAccounts) { // Kiểm tra xem prop có tồn tại không trước khi gọi
          refetchAccounts();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) window.location.reload();
      if (!error.response || error.response.status !== 200) console.log("error" + error);
    }
  };

  if (!filteredAccounts.length) {
    return (
      <div className="no-results">
        <h3>No results found</h3>
      </div>
    );
  }

  return (
    <div className="account-table-container">
      <table className="account-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            {isAdmin && <th>Email</th>}
            <th>Resident ID</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Last Offline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {currentItems.map((account, index) => (
                <tr key={account.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{account.username}</td>
                {isAdmin && <td>{account.email}</td>}
                <td>{account.residentId}</td>
                <td>{account.role}</td>
                <td>{account.status}</td>
                <td>{formatDateTime(account.createdDate)}</td>
                <td>{formatDateTime(account.lastOffline)}</td>
                <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                          className="icon-btn view-btn"
                          onClick={() => handleView(account)}
                      >
                          <FontAwesomeIcon icon={faEye} />
                      </button>
                      {isAdmin && (
                          <button 
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(account)}
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
      {totalPages > 1 && <Pagination />}
    </div>
  );
};

export default AccountTable;