// File: AuthService.java
package com.example.demo;  // Thay bằng package của bạn
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
@Service
public class AuthService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;  // Inject Bean
    private final PasswordResetTokenRepository PtokenRepository;
    private final RegisterTokenRepository RtokenRepository;
    private final JwtUtils jwtUtils;
    @Autowired
    private JavaMailSender mailSender;
    public AuthService(AccountRepository accountRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository PtokenRepository, RegisterTokenRepository RtokenRepository,JwtUtils jwtUtils) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.PtokenRepository=PtokenRepository;
        this.RtokenRepository=RtokenRepository;
        this.jwtUtils=jwtUtils;
    }
    public boolean ishaped(String email, String rawPassword, Map<String, String> response) {
    	if(email.isEmpty()||rawPassword.isEmpty()) {
	        if (email.isEmpty()) {
	            response.put("emailStatus", "Email không được để trống!");
	        } else response.put("emailStatus", "Successful!");
	        if (rawPassword.isEmpty()) {
	        	response.put("passwordStatus", "Mật khẩu không được để trống!");
	        } else response.put("passwordStatus", "Successful!");
	        return false;
        }
    	String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    	int flag =0;
        if (!Pattern.matches(emailRegex, email)) {
        	response.put("emailStatus", "Email không hợp lệ !"); flag=1;
        } else {
            response.put("emailStatus", "Successful!");
        }
        if (rawPassword.length() < 8) {
        	response.put("passwordStatus","Mật khẩu phải có ít nhất 8 ký tự!"); flag=1;
        } else if (!rawPassword.matches(".*[A-Z].*")) {
        	response.put("passwordStatus","Mật khẩu phải chứa ít nhất 1 chữ hoa!"); flag=1;
        } else {
        	response.put("passwordStatus", "Successful!");
        }
        if(flag==1) return false;
        return true;
    }
    public Map<String, String> validateLogin(String email, String rawPassword) {
        Map<String, String> response = new HashMap<>();
        //validate hình thức
        if(!ishaped(email,rawPassword,response)) return response;
        // validate database
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            response.put("emailStatus", "đell tài khoản nào có email này!"); //add hiệu ứng sai trái vào username thoi
            response.put("passwordStatus", "Successful!");
            return response;
        } else {
            response.put("emailStatus", "Successful!");
            // So sánh mật khẩu raw vs mã hóa
            if (!passwordEncoder.matches(rawPassword, account.getPassword())) {
                response.put("passwordStatus", "Mật khẩu không trùng khớp!");
            } else {
                response.put("passwordStatus", "Successful!");
            }
        }
        if(response.get("emailStatus")=="Successful!"&&response.get("passwordStatus")=="Successful!") {
		    String token = jwtUtils.generateToken(account.getEmail());
		    response.put("Token", token);
        }
        return response;
    }
    @Transactional
    public void createToken(String email, String newPassword,String tokeN, String type) {
        // Xóa token cũ
        // Kiểm tra type hợp lệ và tạo token
        if (type=="PasswordReset") {
        	PtokenRepository.deleteByEmail(email);
        	PasswordResetToken token = new PasswordResetToken();
         // Thiết lập thông tin token
            token.setToken(tokeN);
            token.setEmail(email);
            token.setHashedNewPassword(passwordEncoder.encode(newPassword));
            token.setExpiryDate(calculateExpiryDate()); // Giả định phương thức này đã được định nghĩa
            
            // Lưu token
            PtokenRepository.save(token);
        } 
        if (type=="Register") {
        	RtokenRepository.deleteByEmail(email);
        	RegisterToken token = new RegisterToken();
         // Thiết lập thông tin token
            token.setToken(tokeN);
            token.setEmail(email);
            token.setHashedNewPassword(passwordEncoder.encode(newPassword));
            token.setExpiryDate(calculateExpiryDate()); // Giả định phương thức này đã được định nghĩa
            
            // Lưu token
            RtokenRepository.save(token);
        }
    }
    
    public void sendEmail(String email, String token, String type) {
    	if(type=="PasswordReset") {
	        String resetUrl = "http://localhost:5173/confirm-reset.html?token=" + token;
	
	        MimeMessage message = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message);
	
	        try {
	            helper.setTo(email);
	            helper.setSubject("Xác nhận đổi mật khẩu");
	            
	            String htmlContent = "<h3>Vui lòng click nút bên dưới để xác nhận đổi mật khẩu:</h3>" +
	                               "<a href=\"" + resetUrl + "\" style=\"" + 
	                               "background-color: #4CAF50; border: none; color: white; " +
	                               "padding: 15px 32px; text-align: center; " +
	                               "text-decoration: none; display: inline-block; font-size: 16px;\">" +
	                               "Xác nhận đổi mật khẩu</a>";
	
	            helper.setText(htmlContent, true);
	            mailSender.send(message);
	        } catch (MessagingException e) {
	        	 System.out.print("Khôi phục mật khâủ thất bại do "+e.getMessage());
	        }
    	}
    	if(type=="Register") {
	        String resetUrl = "http://localhost:5173/confirm-register.html?token=" + token;
	
	        MimeMessage message = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message);
	
	        try {
	            helper.setTo(email);
	            helper.setSubject("Xác nhận đăng ký");
	            
	            String htmlContent = "<h3>Vui lòng click nút bên dưới để xác nhận đăng ký:</h3>" +
	                               "<a href=\"" + resetUrl + "\" style=\"" + 
	                               "background-color: #4CAF50; border: none; color: white; " +
	                               "padding: 15px 32px; text-align: center; " +
	                               "text-decoration: none; display: inline-block; font-size: 16px;\">" +
	                               "Xác nhận đăng ký</a>";
	
	            helper.setText(htmlContent, true);
	            mailSender.send(message);
	        } catch (MessagingException e) {
	        	 System.out.print("Đăng ký thất bại do "+e.getMessage());
	        }
    	}
    }

    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 30); // Token hết hạn sau 30 phút
        return cal.getTime();
    }
 // Thêm scheduled task dọn dẹp token hết hạn
    @Transactional
    @Scheduled(cron = "0 0 3 * * ?") // Chạy hàng ngày lúc 3h sáng
    public void cleanupExpiredTokens() {
        PtokenRepository.deleteAllByExpiryDateBefore(new Date());
        RtokenRepository.deleteAllByExpiryDateBefore(new Date());
    }
}