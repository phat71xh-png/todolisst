# Todo List

Ứng dụng quản lý công việc sử dụng React, Vite, Express và PostgreSQL. Dự án được cấu hình để deploy miễn phí lên Vercel, sử dụng Neon làm database.

## Chức năng

- Xem, thêm, sửa và xóa công việc
- Đánh dấu hoàn thành hoặc chưa hoàn thành
- Lọc theo trạng thái và tìm kiếm theo tên
- Đặt thời hạn cho công việc

## Chạy trên máy cá nhân

Yêu cầu Node.js 22+ và PostgreSQL.

```bash
npm install
copy server\.env.example server\.env
npm run dev
```

Cập nhật `DATABASE_URL` trong `server/.env` theo PostgreSQL trên máy. Backend sẽ tự tạo bảng `todos` khi nhận request API đầu tiên.

- Giao diện: http://localhost:5173
- API: http://localhost:3000/api/todos
- Health check: http://localhost:3000/api/health

## CI/CD và deploy miễn phí

### 1. Push repository lên GitHub

Workflow `.github/workflows/ci.yml` tự động kiểm tra cú pháp backend và build frontend trên mọi pull request hoặc push vào `main`.

### 2. Import repository vào Vercel

1. Đăng nhập [Vercel](https://vercel.com) bằng GitHub.
2. Chọn **Add New > Project** và import repository này.
3. Giữ **Root Directory** ở thư mục gốc của repository.
4. Vercel sẽ đọc cấu hình trong `vercel.json`.

### 3. Tạo PostgreSQL miễn phí

Trong Vercel project, mở **Storage > Create Database**, chọn Neon Postgres và gói Free. Kết nối database với cả Production, Preview và Development để Vercel tự thêm `DATABASE_URL`.

Nếu tạo Neon riêng, thêm connection string vào **Settings > Environment Variables** với tên `DATABASE_URL`.

### 4. Deploy

Vercel tự deploy production khi có commit mới trên `main` và tạo preview deployment cho pull request. Bảng `todos` được tạo tự động khi API nhận request đầu tiên.

Sau khi deploy, kiểm tra:

```text
https://<ten-project>.vercel.app/api/health
```

## Lệnh hữu ích

```bash
npm run dev          # Chạy frontend và backend
npm run check        # Kiểm tra cú pháp backend
npm run build        # Build frontend
npm start            # Chạy backend local
```
