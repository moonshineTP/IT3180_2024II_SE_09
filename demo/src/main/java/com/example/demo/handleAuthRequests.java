package com.example.demo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Date;
@RestController
@RequestMapping("/api/auth")
public class handleAuthRequests {
	private final AuthService authService;
	private final AccountRepository userRepository;
	private final PasswordResetTokenRepository PtokenRepository;
	private final RegisterTokenRepository RtokenRepository;
    public handleAuthRequests (AuthService authService,AccountRepository userRepository,PasswordResetTokenRepository PtokenRepository,RegisterTokenRepository RtokenRepository) {
        this.authService = authService;
        this.userRepository=userRepository;
        this.PtokenRepository=PtokenRepository;
        this.RtokenRepository=RtokenRepository;
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> handleLogin(@RequestBody Request request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Map<String, String> response = new HashMap<>();
        response = authService.validateLogin(email,password);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/request-register")
    public ResponseEntity<Map<String, String>> requestRegister(@RequestBody Request request) {
    	String email = request.getEmail();
        String password = request.getPassword();
        Map<String, String> response = new HashMap<>();
        if(!authService.ishaped(email, password, response)) return ResponseEntity.ok(response);
        if (userRepository.findByEmail(email)!=null) {
            response.put("emailStatus", "Email đã tồn tại");
            response.put("passwordStatus", "Successful!");
            return ResponseEntity.ok(response);
        }
        response.put("emailStatus", "Successful!");
        response.put("passwordStatus", "Successful!");
        // Tạo và lưu token
        String token = UUID.randomUUID().toString();
        authService.createToken(email, password, token, "Register");
        
        // Gửi email
        authService.sendEmail(email, token, "Register");
        
        return ResponseEntity.ok(response); // Trả về status 200 không content
    }
    @Transactional
    @PostMapping("/confirm-register")
    public ResponseEntity<?> confirmRegister(@RequestBody Token tokeN) {
    	String token=tokeN.getToken();
        RegisterToken resetToken = RtokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }
        if (resetToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token đã hết hạn");
        }
        Account user = new Account();
        user.setPassword(resetToken.getHashedNewPassword());
        user.setEmail(resetToken.getEmail());
        userRepository.save(user);
        RtokenRepository.delete(resetToken);

        return ResponseEntity.ok("Đăng kí thành công");
    }
    @PostMapping("/request-reset")
    public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestBody Request request) {
    	String email = request.getEmail();
        String password = request.getPassword();
        Map<String, String> response = new HashMap<>();
        if(!authService.ishaped(email, password, response)) return ResponseEntity.ok(response);
        if (userRepository.findByEmail(email)==null) {
            response.put("emailStatus", "Email không tồn tại");
            response.put("passwordStatus", "Successful!");
            return ResponseEntity.ok(response);
        }
        response.put("emailStatus", "Successful!");
        response.put("passwordStatus", "Successful!");
        // Tạo và lưu token
        String token = UUID.randomUUID().toString();
        authService.createToken(email, password,token, "PasswordReset");
        
        // Gửi email
        authService.sendEmail(email, token, "PasswordReset");
        
        return ResponseEntity.ok(response); // Trả về status 200 không content
    }
    @Transactional
    @PostMapping("/confirm-reset")
    public ResponseEntity<?> confirmReset(@RequestBody Token tokeN) {
    	String token=tokeN.getToken();
        PasswordResetToken resetToken = PtokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }
        if (resetToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token đã hết hạn");
        }
        Account user = userRepository.findByEmail(resetToken.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("User không tồn tại! Có kẻ đã xoá nick của bạn!");
        }
        user.setPassword(resetToken.getHashedNewPassword());
        userRepository.save(user);
        PtokenRepository.delete(resetToken);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
    static class Request {
        private String email;
        private String password;

        // Getter & Setter
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    static class Token {
        private String Token;
        // Getter & Setter
        public String getToken() { return Token; }
        public void setToken(String Token) { this.Token = Token; }
    }
}