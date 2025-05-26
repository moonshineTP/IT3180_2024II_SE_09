// utils/validation.js
// ValidateService.js (Ví dụ)
export const validateUsername = (username) => {
  if (!username) return "Tên người dùng không được để trống.";
  if (username.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự.";
  if (username.length > 20) return "Tên người dùng không được quá 20 ký tự.";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) { // Chỉ cho phép chữ cái, số và dấu gạch dưới
    return "Tên người dùng chỉ chứa chữ cái, số và dấu gạch dưới.";
  }
  return "Successful!";
};