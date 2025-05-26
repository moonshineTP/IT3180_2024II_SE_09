import axios from 'axios';

// Hàm gọi API lấy thông tin private account
export const getPrivateAccount = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/gettarget/getPrivateAccount',
      null,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) window.location.reload();
    throw error;
  }
};

// Hàm kiểm tra quyền
export const checkPermissions = (userPrivate, account) => {
  const isAdmin = userPrivate?.role === 'admin';
  const isOwner = userPrivate?.email === account?.email;
  return { isAdmin, isOwner, showEditButton: isAdmin || isOwner };
};