# Phần mềm quản lý chung cư hiện đại SmartApart

## Mục Lục

1. [Mô tả chung](#mô-tả-chung)
2. [Phân Công Nhiệm Vụ](#phân-công-nhiệm-vụ)
3. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
4. [Cài Đặt](#cài-đặt)
5. [Hướng Dẫn Phát Triển](#hướng-dẫn-phát-triển)
6. [Giấy Phép](#giấy-phép)

## Mô tả chung

**SmartApart** là phần mềm quản lý chung cư hiện đại, toàn diện, hỗ trợ đa dạng tác vụ và đa người dùng.
Trong đó, ba đối tượng chính bao gồm:

1. **Ban quản lý:**

- Quản lý tài khoản cư dân, quản lý thông tin chung các cư dân, các bên dịch vụ và doanh nghiệp.
- Đa dạng, linh hoạt các tác vụ quản lý luồng tiền; tạo các loại quỹ dài hạn/ngắn hạn; tạo các phí và quản lý truy thu.
- Tạo các thông báo gửi đến cư dân, thông báo khẩn, thông báo đa phương tiện: SMS, Email,…
- Thống kê, nghiên cứu dữ liệu hệ thống

2. **Cư dân**

- Cập nhật thông tin bản thân, thông tin dân sự, hành chính đến ban quản lý.
- Nhận thông báo, giới thiệu từ ban quản lý
- Thanh toán các loại phí.
- Gửi khiếu nại, báo cáo sự cố, bất cập đến ban quản lý. Báo động tai nạn, cháy nổ.
- Mạng xã hội cư dân, tính năng trò chuyện trực tuyến.
  3 **Khách**
- **Bên dịch vụ**: Hệ thống chấm công, quản lý nhân viên làm việc tại chung cư
- **Bên nhà nước**: Kiểm tra hành chính, an ninh
- **Bên phân tích dữ liệu**: Khai phá dữ liệu nhân khẩu

## Phân Công Nhiệm Vụ


| Họ và Tên            | Nhiệm vụ                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Phạm Gia Hưng**     | Trưởng nhóm, quản lý chất lượng và kiểm thử phần mềm. Lập trình đôi với các thành viên khác |
| **Đỗ Trường Giang** | Thiết lập cơ sở dữ liệu, kết nối hạ tầng, triển khai phần mềm, đảm bảo tính đồng bộ           |
| **Ngô Vũ Minh**       | Phân tích và phát triển giao diện hiển thị, kết nối frontend với API từ backend                       |
| **Đoàn Tiến Thành** | Phân tích và phát triển backend, xử lý dữ liệu, tạo API cho frontend                                    |

## Cấu Trúc Thư Mục

```
src/
├── main/
│   ├── frontend/
│   │   ├── admin/
│   │   ├── resident/
│   │   ├── guest/
│   │
│   │
│   ├── backend
│   │   ├── config/
│   │   ├── images/
│   │   ├── node_modules/
│   │   └── srccode/
│   │       ├── .authentication/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │
│   │
│   └── config
├── test/
│   ├── frontend/
│   │   ├── admin/
│   │   ├── resident/
│   │   ├── guest/
│   │
│   │
│   └── backend/
│       ├── .authentication/
│       ├── data/
│       ├── domain/
│       └── presentation/
└── product/
```

## Cài Đặt


## Hướng Dẫn Phát Triển


## Giấy Phép
Dự án này được cấp phép theo giấy phép Apache License. Xem tệp `LICENSE` để biết thêm chi tiết.
