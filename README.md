# Hệ Thống Quản Lý Chung Cư Green Light

Chào mừng bạn đến với Green Light - giải pháp phần mềm quản lý chung cư hiện đại và tiện lợi. Dự án này được phát triển nhằm đơn giản hóa các quy trình vận hành, tăng cường tương tác giữa ban quản lý và cư dân, đồng thời mang lại trải nghiệm sống tốt hơn cho cộng đồng.

## Mục Lục

1.  [Live Demo](#live-demo)
2.  [Dành Cho Người Dùng (Cư Dân & Khách)](#dành-cho-người-dùng-cư-dân--khách)
    *   [Truy Cập Hệ Thống](#truy-cập-hệ-thống)
    *   [Tạo Tài Khoản Mới](#tạo-tài-khoản-mới)
    *   [Đăng Nhập](#đăng-nhập)
    *   [Quên Mật Khẩu](#quên-mật-khẩu)
    *   [Các Tính Năng Chính Sau Khi Đăng Nhập](#các-tính-năng-chính-sau-khi-đăng-nhập)
        *   [Trang Chủ (Home)](#trang-chủ-home)
        *   [Thông Tin Tài Khoản Cá Nhân](#thông-tin-tài-khoản-cá-nhân)
        *   [Thông Tin Hộ Khẩu (Dành cho Cư dân)](#thông-tin-hộ-khẩu-dành-cho-cư-dân)
        *   [Thanh Toán Phí](#thanh-toán-phí)
        *   [Thông Báo](#thông-báo)
        *   [Gửi và Theo Dõi Khiếu Nại](#gửi-và-theo-dõi-khiếu-nại)
    *   [Đăng Xuất](#đăng-xuất)
3.  [Dành Cho Quản Trị Viên (Admin)](#dành-cho-quản-trị-viên-admin)
4.  [Tính Năng Chính Của Hệ Thống (Tổng Quan)](#tính-năng-chính-của-hệ-thống-tổng-quan)
5.  [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
6.  [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
7.  [Cài Đặt và Chạy Dự Án (Local)](#cài-đặt-và-chạy-dự-án-local)
    *   [Yêu Cầu Tiên Quyết](#yêu-cầu-tiên-quyết)
    *   [Backend (`demo` folder)](#backend-demo-folder)
    *   [Frontend (`Quanlychungcu` folder)](#frontend-quanlychungcu-folder)
    *   [Truy Cập Ứng Dụng Cục Bộ](#truy-cập-ứng-dụng-cục-bộ)
8.  [Quy Trình Hoạt Động Cốt Lõi](#quy-trình-hoạt-động-cốt-lõi)
9.  [Tổng Quan Về API Endpoints (Backend)](#tổng-quan-về-api-endpoints-backend)

## Live Demo

Hệ thống hiện có thể được trải nghiệm trực tiếp tại địa chỉ:
**[http://115.79.197.14/](http://115.79.197.14/)**

**Lưu ý khi truy cập Demo:**
*   URL trên mặc định trỏ đến `index1.html`, là trang dành cho các quy trình đăng nhập, đăng ký, và khôi phục mật khẩu.
*   Sau khi hoàn tất quá trình đăng nhập thành công, người dùng sẽ được tự động chuyển hướng đến `index.html`, trang ứng dụng chính của hệ thống.

## Dành Cho Người Dùng (Cư Dân & Khách)

Phần này mô tả các quy trình và tính năng chính mà bạn, với vai trò là cư dân hoặc khách, có thể sử dụng trên hệ thống Green Light.

### Truy Cập Hệ Thống

1.  Mở trình duyệt web (Chrome, Firefox, Safari, Edge, etc.).
2.  Truy cập vào địa chỉ: [http://115.79.197.14/](http://115.79.197.14/)
    *   Bạn sẽ được chuyển đến trang `index1.html`, đây là cổng vào chính cho các thao tác liên quan đến tài khoản.

### Tạo Tài Khoản Mới

Nếu bạn chưa có tài khoản, hãy làm theo các bước sau để đăng ký:

1.  Tại trang [http://115.79.197.14/](http://115.79.197.14/), tìm và nhấp vào liên kết "Chưa có tài khoản? Đăng ký".
2.  Điền đầy đủ các thông tin được yêu cầu:
    *   **Tên đăng nhập:** Chọn một tên đăng nhập duy nhất (5-20 ký tự, chỉ gồm chữ, số, dấu `.` hoặc `_`, không bắt đầu/kết thúc bằng `.` hoặc `_` và không có 2 ký tự đặc biệt liên tiếp).
    *   **Email:** Nhập địa chỉ email hợp lệ của bạn. Email này sẽ được sử dụng để xác thực tài khoản và nhận thông báo quan trọng.
    *   **Mật khẩu:** Tạo một mật khẩu mạnh (8-20 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt).
3.  Nhấp vào nút "Đăng Ký".
4.  **Xác thực Email:** Hệ thống sẽ gửi một email xác nhận đến địa chỉ email bạn đã đăng ký.
    *   Mở hộp thư của bạn, tìm email từ "Green Light" (kiểm tra cả thư mục Spam/Junk nếu không thấy).
    *   Nhấp vào đường link hoặc nút "Xác nhận đăng ký" trong email.
5.  Sau khi xác nhận thành công, tài khoản của bạn sẽ được kích hoạt. Bây giờ bạn có thể đăng nhập vào hệ thống.

### Đăng Nhập

1.  Tại trang [http://115.79.197.14/](http://115.79.197.14/), đảm bảo bạn đang ở biểu mẫu "Đăng Nhập".
2.  Nhập **Email** và **Mật khẩu** đã đăng ký của bạn.
3.  Nhấp vào nút "Đăng Nhập".
4.  Nếu thông tin chính xác, bạn sẽ được chuyển hướng đến trang quản lý chính của hệ thống (`index.html`).

### Quên Mật Khẩu

Nếu bạn quên mật khẩu, bạn có thể khôi phục lại theo các bước sau:

1.  Tại trang [http://115.79.197.14/](http://115.79.197.14/), nhấp vào liên kết "Quên mật khẩu?".
2.  Nhập **Email** đã đăng ký tài khoản của bạn.
3.  Nhập **Mật khẩu mới** mà bạn muốn đặt.
4.  Nhấp vào nút "Gửi Yêu Cầu".
5.  **Xác thực Email:** Hệ thống sẽ gửi một email xác nhận việc đổi mật khẩu.
    *   Mở hộp thư của bạn, tìm email từ "Green Light".
    *   Nhấp vào đường link hoặc nút "Xác nhận đổi mật khẩu" trong email.
6.  Sau khi xác nhận, mật khẩu của bạn sẽ được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.

### Các Tính Năng Chính Sau Khi Đăng Nhập

Sau khi đăng nhập thành công vào `index.html`, bạn sẽ thấy giao diện chính của hệ thống với các tab chức năng:

#### Trang Chủ (Home)

*   Hiển thị thông tin tổng quan, các tin tức mới nhất hoặc thông báo quan trọng từ ban quản lý.
*   *(Chi tiết về nội dung trang chủ có thể thay đổi tùy theo cấu hình của Admin).*

#### Thông Tin Tài Khoản Cá Nhân

*   Truy cập bằng cách nhấp vào biểu tượng người dùng (User icon) trên thanh Header.
*   Xem thông tin tài khoản của bạn: Tên đăng nhập, Email, Vai trò, Ngày tạo, Lần hoạt động cuối.
*   **Chỉnh sửa Tên đăng nhập:** Bạn có thể thay đổi tên đăng nhập của mình (nếu tên mới chưa tồn tại).

#### Thông Tin Hộ Khẩu (Dành cho Cư dân)

*   **Truy cập Tab "HouseHoldInfo":**
    *   Nếu tài khoản của bạn đã được liên kết với một hồ sơ cư dân, bạn có thể xem thông tin chi tiết về hộ khẩu của mình.
    *   Thông tin có thể bao gồm: Tên chủ hộ, các thành viên trong gia đình, diện tích căn hộ, thông tin phương tiện (xe máy, ô tô).
    *   *(Hiện tại, việc cập nhật thông tin hộ khẩu thường do Admin thực hiện. Cư dân chủ yếu xem thông tin).*

#### Thanh Toán Phí (Tab "FeePayment")

*   Xem danh sách các khoản phí cần thanh toán (phí quản lý, phí dịch vụ, phí gửi xe,...).
*   Kiểm tra chi tiết từng khoản phí: Số tiền, hạn thanh toán, trạng thái (đã thanh toán, chưa thanh toán).
*   *(Tính năng thanh toán trực tuyến có thể chưa được tích hợp hoặc đang trong quá trình phát triển. Vui lòng liên hệ ban quản lý để biết hình thức thanh toán hiện tại).*

#### Thông Báo (Tab "Notification")

*   Nhận và xem các thông báo từ ban quản lý chung cư.
*   Các loại thông báo:
    *   **Thông báo chung:** Tin tức, sự kiện, quy định mới.
    *   **Thông báo riêng tư:** Các thông báo liên quan trực tiếp đến căn hộ hoặc tài khoản của bạn.
*   Bạn có thể tương tác với thông báo như đánh dấu đã đọc, quan tâm, hoặc phản hồi (nếu được cho phép).

#### Gửi và Theo Dõi Khiếu Nại (Tab "Complaint")

*   **Gửi Khiếu Nại Mới:**
    1.  Chọn mục tạo khiếu nại mới.
    2.  Nhập **Tiêu đề** và **Nội dung chi tiết** của vấn đề bạn muốn phản ánh.
    3.  Gửi khiếu nại.
*   **Theo Dõi Khiếu Nại:**
    *   Xem danh sách các khiếu nại bạn đã gửi.
    *   Theo dõi trạng thái xử lý của từng khiếu nại (VD: "Đang chờ xử lý", "Đang xử lý", "Đã giải quyết").
    *   Xem các phản hồi từ ban quản lý.

### Đăng Xuất

*   Để đăng xuất khỏi hệ thống, nhấp vào biểu tượng Đăng xuất (Sign Out icon) trên thanh Header.
*   Bạn sẽ được chuyển hướng trở lại trang đăng nhập (`index1.html`).

## Dành Cho Quản Trị Viên (Admin)

Với vai trò Admin, bạn sẽ có quyền truy cập vào các chức năng quản lý nâng cao hơn, bao gồm:

*   **Quản lý Tài khoản:** Tạo, sửa, xóa, khóa/mở khóa tài khoản người dùng (bao gồm cả cư dân và các admin khác nếu có quyền). Phân quyền cho tài khoản.
*   **Quản lý Cư dân & Hộ khẩu:** Nhập liệu, cập nhật thông tin chi tiết của cư dân, quản lý hộ khẩu, liên kết tài khoản người dùng với hồ sơ cư dân, quản lý phương tiện.
*   **Quản lý Phí & Đóng góp:** Tạo các loại phí, áp phí cho các hộ, theo dõi công nợ, ghi nhận thanh toán, quản lý các quỹ đóng góp.
*   **Quản lý Thông báo:** Soạn thảo và gửi các loại thông báo đến cư dân, quản lý danh sách người nhận.
*   **Xử lý Khiếu nại:** Tiếp nhận, phân loại, giao việc, cập nhật tiến độ và phản hồi các khiếu nại từ cư dân.
*   **Thống kê và Báo cáo:** Xem các báo cáo về thu chi, tình hình cư dân, hoạt động hệ thống.

*(Các quy trình chi tiết cho Admin sẽ được hướng dẫn trong tài liệu quản trị riêng).*

## Tính Năng Chính Của Hệ Thống (Tổng Quan)

*   **Quản lý Xác thực & Tài khoản:** Đăng nhập, đăng ký, đặt lại mật khẩu (xác thực qua email), phân quyền (Admin, Resident, Guest), quản lý thông tin tài khoản, theo dõi trạng thái online/offline.
*   **Quản lý Cư dân & Hộ khẩu:** Quản lý thông tin chi tiết cư dân, liên kết tài khoản với cư dân, quản lý phương tiện.
*   **Quản lý Phí & Đóng góp:** Tạo và quản lý các loại phí, ghi nhận đóng góp, quản lý hóa đơn và thanh toán.
*   **Quản lý Thông báo:** Gửi thông báo chung/riêng tư, tương tác với thông báo (đọc, quan tâm, phản hồi).
*   **Quản lý Khiếu nại:** Cư dân tạo khiếu nại, Admin xử lý và phản hồi, theo dõi trạng thái.
*   **Bảo mật:** JWT cho xác thực API, mã hóa mật khẩu BCrypt, CORS configuration.

## Công Nghệ Sử Dụng

*   **Frontend:** React 19, Vite, JavaScript (ES Modules), Axios, CSS, React Router, FontAwesome, Recharts.
*   **Backend:** Java 21, Spring Boot 3.4.4, Spring Security (JWT, BCrypt), Spring Data JPA (Hibernate), MySQL, Maven, Spring Mail, Jackson, jjwt.

## Cấu Trúc Thư Mục

```
IT3180_2024II_SE_09/
├── Quanlychungcu/                  # Frontend React
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── Components/             # Các UI Components chính
│   │   │   ├── Header/Header.jsx
│   │   │   ├── MenuTab/MenuTab.jsx
│   │   │   └── TabContent/         # Logic hiển thị nội dung các tab
│   │   │       ├── Accounts/Accounts.jsx
│   │   │       ├── Complaint/Complaint.jsx
│   │   │       ├── FeePayment/FeePayment.jsx
│   │   │       ├── Home/Home.jsx
│   │   │       ├── HouseHoldInfo/HouseHoldInfo.jsx
│   │   │       └── Notification/Notification.jsx
│   │   ├── App.jsx                 # Component gốc của React app
│   │   └── main.jsx                # Điểm vào của React app
│   ├── index.html                  # HTML chính (sau đăng nhập)
│   ├── index1.html                 # HTML trang đăng nhập/đăng ký
│   ├── package.json
│   └── vite.config.js
└── demo/                           # Backend Spring Boot
    ├── src/
    │   ├── main/
    │   │   ├── java/com/example/demo/
    │   │   │   ├── config/
    │   │   │   │   └── SecurityConfig.java       # Cấu hình bảo mật Spring
    │   │   │   ├── controller/                 # Các REST API Controllers
    │   │   │   │   ├── AuthController.java     # Xử lý xác thực
    │   │   │   │   ├── GetList.java          # API lấy danh sách
    │   │   │   │   ├── getTarget.java        # API lấy đối tượng cụ thể
    │   │   │   │   └── updateTarget.java     # API cập nhật/tạo/xóa
    │   │   │   ├── model/                      # Các JPA Entities và DTOs
    │   │   │   │   ├── Account.java
    │   │   │   │   ├── Resident.java
    │   │   │   │   ├── Fee.java
    │   │   │   │   ├── Notification.java
    │   │   │   │   └── Complaints.java
    │   │   │   ├── repository/                 # Các Spring Data JPA Repositories
    │   │   │   ├── scheduler/
    │   │   │   │   └── OfflineChecker.java     # Tác vụ kiểm tra offline
    │   │   │   ├── security/jwt/
    │   │   │   │   ├── JwtFilter.java          # Filter xử lý JWT
    │   │   │   │   └── JwtUtils.java           # Tiện ích tạo/validate JWT
    │   │   │   ├── service/                    # Chứa business logic
    │   │   │   │   ├── AuthService.java
    │   │   │   │   └── MapService.java
    │   │   │   └── DemoApplication.java        # Lớp khởi chạy Spring Boot
    │   │   └── resources/
    │   │       └── application.properties      # File cấu hình chính
    └── pom.xml                         # File cấu hình Maven
```

## Cài Đặt và Chạy Dự Án (Local)

Phần này dành cho nhà phát triển muốn chạy dự án trên máy cá nhân.

### Yêu Cầu Tiên Quyết

*   Node.js (phiên bản LTS) và npm/yarn/pnpm.
*   JDK 21.
*   Apache Maven.
*   MySQL Server.
*   Tài khoản Gmail cho chức năng gửi email.

### Backend (`demo` folder)

1.  Clone repository.
2.  Điều hướng vào thư mục `IT3180_2024II_SE_09/demo`.
3.  **Cấu hình Database:**
    *   Tạo database `world` trong MySQL.
    *   Cập nhật `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password` trong `src/main/resources/application.properties`.
        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/world?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Ho_Chi_Minh
        spring.datasource.username=your_mysql_username
        spring.datasource.password=your_mysql_password
        ```
4.  **Cấu hình Email:**
    *   Cập nhật `spring.mail.username`, `spring.mail.password` trong `application.properties`.
        ```properties
        spring.mail.username=your_gmail_account@gmail.com
        spring.mail.password=your_gmail_app_password_or_regular_password
        ```
5.  **Build dự án:**
    ```bash
    mvn clean install
    ```
6.  **Chạy Backend:** Chạy `DemoApplication.java` từ IDE hoặc:
    ```bash
    mvn spring-boot:run
    ```
    *   Backend sẽ chạy trên `http://115.79.197.14:8080`.

### Frontend (`Quanlychungcu` folder)

1.  Điều hướng vào thư mục `IT3180_2024II_SE_09/Quanlychungcu`.
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
3.  **Chạy Frontend (Development mode):**
    ```bash
    npm run dev
    ```
    *   Frontend sẽ chạy trên `http://115.79.197.14`.

### Truy Cập Ứng Dụng Cục Bộ

*   Mở trình duyệt và truy cập `http://115.79.197.14/index1.html`.

## Quy Trình Hoạt Động Cốt Lõi

*   **Đăng ký Người dùng mới:**
    1.  Người dùng truy cập trang `index1.html` và chọn "Đăng ký".
    2.  Nhập thông tin: Tên đăng nhập, Email, Mật khẩu.
    3.  Hệ thống backend (`/api/auth/request-register`) kiểm tra tính hợp lệ của thông tin.
    4.  Nếu hợp lệ, backend tạo một token đăng ký, lưu vào database, và gửi email chứa link xác nhận.
    5.  Người dùng nhấp vào link xác nhận trong email (`confirm-register.html`).
    6.  Trang xác nhận gửi token đến backend (`/api/auth/confirm-register`).
    7.  Backend xác minh token, kích hoạt tài khoản.

*   **Đăng nhập:**
    1.  Người dùng truy cập `index1.html`, nhập Email và Mật khẩu.
    2.  Thông tin được gửi đến backend (`/api/auth/login`).
    3.  Backend kiểm tra thông tin.
    4.  Nếu thành công, backend tạo JWT và gửi về cho frontend dưới dạng HTTP-Only Cookie.
    5.  Frontend chuyển hướng đến `index.html`. Mọi yêu cầu API tiếp theo sẽ đính kèm JWT cookie.

*   **Quản lý Dữ liệu (Ví dụ: Admin quản lý Cư dân):**
    1.  Admin đăng nhập, truy cập tab "HouseHoldInfo".
    2.  Frontend gọi API `/api/GetList/residents` để lấy danh sách.
    3.  Admin có thể xem chi tiết, tạo mới, sửa, xóa thông tin.
    4.  Các thao tác tạo/sửa gửi dữ liệu đến API tương ứng trong `/api/update/`.

*   **Gửi Thông báo (Admin):**
    1.  Admin vào mục "Notification".
    2.  Tạo thông báo mới, nhập tiêu đề, nội dung, loại, đối tượng nhận.
    3.  Dữ liệu được gửi đến API của backend.
    4.  Backend lưu và xử lý việc gửi thông báo.

*   **Xử lý Khiếu nại:**
    1.  Cư dân tạo khiếu nại từ tab "Complaint" (gửi đến `/api/update/createcomplaints`).
    2.  Admin xem danh sách (`/api/GetList/complaints`), xem chi tiết (`/api/gettarget/getComplaint`), cập nhật trạng thái, phản hồi qua các API trong `/api/update/`.

## Tổng Quan Về API Endpoints (Backend)

*   **`/api/auth/**`:** Các endpoints xác thực (login, register, reset password) - Public.
*   **`/api/GetList/**`:** Lấy danh sách các đối tượng (accounts, residents, fees, etc.) - Yêu cầu xác thực.
*   **`/api/gettarget/**`:** Lấy thông tin chi tiết của một đối tượng cụ thể - Yêu cầu xác thực.
*   **`/api/update/**`:** Tạo, cập nhật, xóa các đối tượng - Yêu cầu xác thực và phân quyền.
*   **`/checkin`:** Kiểm tra tính hợp lệ của JWT - Yêu cầu xác thực.
*   **`/logouts`:** Đăng xuất người dùng - Yêu cầu xác thực.
*   **`/ping`:** Cập nhật trạng thái "Online" của người dùng - Yêu cầu xác thực.

---

Chúc bạn có trải nghiệm tốt nhất với Green Light! Mọi ý kiến đóng góp xin vui lòng liên hệ đội ngũ phát triển.
