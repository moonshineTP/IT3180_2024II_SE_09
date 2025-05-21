import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Tạo file App.jsx chứa toàn bộ layout
import axios from "axios";

const checkAuthentication = async () => {
  console.log("Đang kiểm tra xác thực...");
  try {
    // Gọi API check-in để xác minh JWT
    await axios.get("http://localhost:8080/checkin", { withCredentials: true });
    // Nếu không có lỗi, xác thực thành công
    console.log("Xác thực thành công.");
  } catch (error) {
    console.error("Lỗi kiểm tra xác thực:", error.message);
    // Kiểm tra xem lỗi có đối tượng response không (tức là lỗi HTTP từ server)
    if (error.response) {
      // Axios mặc định sẽ throw error cho các status không phải 2xx.
      // Nếu error.response tồn tại, nghĩa là status không phải là 200 (hoặc 2xx).
      // Bạn muốn chuyển hướng nếu status không phải 200.
      // Điều kiện này sẽ đúng nếu error.response tồn tại do hành vi của axios.
      console.log(`Trạng thái phản hồi: ${error.response.status}. Đang chuyển hướng đến trang đăng nhập...`);
      window.location.href = "/index1.html";

      // QUAN TRỌNG: Ném ra một lỗi ở đây để ngăn khối .then() tiếp theo chạy.
      // Điều này cũng cho phép khối .catch() bên ngoài xử lý.
      throw new Error("Đang chuyển hướng đến trang đăng nhập.");
    } else {
      // Lỗi mạng, server không phản hồi, vấn đề CORS, v.v. (error.response không xác định)
      console.error("Lỗi mạng hoặc lỗi thiết lập trong quá trình check-in:", error);
      // Ném lại lỗi gốc để khối .catch() bên ngoài xử lý.
      // Trong trường hợp này, chúng ta không chuyển hướng mà chỉ để ứng dụng không tải được.
      throw error;
    }
  }
};

// Tạo một root duy nhất
console.log("Bắt đầu khởi tạo ứng dụng...");

checkAuthentication()
  .then(() => {
    // Phần này CHỈ thực thi nếu checkAuthentication hoàn thành thành công
    // (tức là JWT hợp lệ và không có lỗi nào được ném ra).
    console.log("Kiểm tra xác thực thành công, đang render App.");
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch(error => {
    // Khối này sẽ bắt các lỗi được ném ra từ checkAuthentication.
    // Nếu đó là lỗi "Đang chuyển hướng đến trang đăng nhập.", thì việc chuyển hướng đã được bắt đầu.
    if (error.message === "Đang chuyển hướng đến trang đăng nhập.") {
      console.log("Quá trình chuyển hướng đang diễn ra. App sẽ không được render.");
      // Không cần làm gì thêm, trình duyệt sẽ xử lý việc chuyển trang.
    } else {
      // Đối với các lỗi khác (ví dụ: lỗi mạng nghiêm trọng, server API checkin bị sập)
      console.error("Lỗi nghiêm trọng trong quá trình khởi tạo ứng dụng:", error);
      // Tùy chọn: Hiển thị một thông báo lỗi thân thiện với người dùng trên trang
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = "<h1>Lỗi Khởi Tạo Ứng Dụng</h1><p>Không thể xác thực hoặc đã xảy ra lỗi mạng. Vui lòng thử làm mới trang hoặc thử lại sau.</p>";
      }
    }
  });
