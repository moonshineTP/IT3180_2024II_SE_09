package com.example.demo.repository; // Thay bằng package của bạn

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.RegisterToken;

import java.util.Date;
@Repository
public interface RegisterTokenRepository extends JpaRepository<RegisterToken, Long> {

    // Tìm token bằng chuỗi token
    RegisterToken findByToken(String token);

    // Xóa token theo email (dùng khi tạo token mới cho cùng 1 email)
    void deleteByEmail(String email);

    // Xóa các token đã hết hạn (có thể dùng với scheduled task)
    void deleteAllByExpiryDateBefore(Date now);

    // Kiểm tra sự tồn tại của token (tuỳ chọn)
    boolean existsByToken(String token);
}