# Hướng dẫn thiết lập dự án CVConnect trên máy mới

Tài liệu này cung cấp các bước chi tiết để thiết lập và chạy toàn bộ dự án CVConnect (bao gồm Backend và Frontend) trên một máy tính mới, đảm bảo môi trường hoạt động nhất quán.

## 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy tính đã cài đặt các công cụ sau:
*   **Docker & Docker Compose**: Để chạy cơ sở dữ liệu và các dịch vụ backend.
*   **Node.js (v18 trở lên)**: Để chạy Frontend và các script khởi tạo dữ liệu.
*   **Git**: Để clone mã nguồn.

## 2. Bước 1: Chuẩn bị mã nguồn
Clone repo từ GitHub về máy:
```bash
git clone <URL_REPO_CỦA_BẠN>
cd CVConnect
```

## 3. Bước 2: Thiết lập Backend (Cơ sở hạ tầng)
Hệ thống sử dụng nhiều loại cơ sở dữ liệu và công cụ trung gian (MySQL, PostgreSQL, Redis, MongoDB, Kafka).
1. Di chuyển vào thư mục `BE`:
   ```bash
   cd BE
   ```
2. Tạo file cấu hình môi trường từ mẫu:
   ```bash
   cp cvconnect.env.example cvconnect.env
   ```
3. Khởi chạy các container hạ tầng:
   ```bash
   docker-compose up -d
   ```
   *Đợi vài phút để các dịch vụ này sẵn sàng.*

## 4. Bước 3: Xây dựng và Chạy ứng dụng Backend
Sau khi hạ tầng đã sẵn sàng, chúng ta cần build và chạy các dịch vụ Java (Spring Boot):
1. Vẫn tại thư mục `BE`, chạy lệnh:
   ```bash
   docker-compose -f docker-compose.app.yml up --build -d
   ```
   *Lệnh này sẽ tự động tải các dependencies của Maven, đóng gói file JAR và chạy trong Docker.*

2. Kiểm tra trạng thái các container:
   ```bash
   docker ps
   ```
   Đảm bảo tất cả 9 container (4 app services, 5 infra services) đều có trạng thái **Up**.

## 5. Bước 4: Khởi tạo dữ liệu mẫu (Database Seeding)
Để có tài khoản đăng nhập và dữ liệu để kiểm thử, bạn cần chạy script seed:
1. Đảm bảo bạn đang ở thư mục `BE`.
2. Cài đặt các thư viện cần thiết cho script:
   ```bash
   npm install
   ```
3. Chạy script seeding:
   ```bash
   node scripts/seed_test_data.js
   ```
   *Script này sẽ tạo các bảng cần thiết và chèn tài khoản admin/candidate thử nghiệm.*

## 6. Bước 5: Thiết lập Frontend
1. Di chuyển vào thư mục Frontend:
   ```bash
   cd ../FE/company
   ```
2. Cài đặt các dependencies:
   ```bash
   npm install
   ```
3. Khởi chạy Frontend ở chế độ development:
   ```bash
   npm run dev
   ```
   Frontend sẽ chạy tại: `http://localhost:3000`

## 7. Thông tin đăng nhập thử nghiệm
Sau khi hoàn tất setup, bạn có thể đăng nhập bằng các tài khoản sau:

| Vai trò | Tên đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| **Nhà tuyển dụng / Quản trị** | `admin_test` | `Password123!` |
| **Ứng viên** | `candidate_test` | `Password123!` |

## 8. Các lưu ý quan trọng
*   **Cấu hình**: File `BE/cvconnect.env` chứa các biến môi trường cho Backend. Mặc định đã được cấu hình cho chạy Docker local.
*   **Lỗi hiển thị**: Nếu gặp lỗi font chữ tiếng Việt (`???`), đây là vấn đề về cấu hình encoding của database (đã ghi nhận trong báo cáo lỗi).
*   **Cổng (Ports)**: Đảm bảo các cổng `3000`, `8888`, `3306`, `5432`, `6379`, `27018` không bị chiếm dụng bởi ứng dụng khác.
