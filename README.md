# Todo List

Ứng dụng quản lý công việc đơn giản sử dụng React, Node.js/Express và MySQL.

## Chức năng

- Xem danh sách công việc
- Thêm, sửa và xóa công việc
- Đánh dấu đã hoàn thành/chưa hoàn thành
- Lọc theo trạng thái và tìm kiếm theo tên

## Cấu trúc dự án

```text
todolisst/
├── client/             # React + Vite
├── server/             # Node.js + Express
└── server/database/    # MySQL schema
```

## Cách chạy

### 1. Tạo cơ sở dữ liệu

Mở MySQL và chạy file `server/database/schema.sql`:

```bash
mysql -u root -p < server/database/schema.sql
```

### 2. Cấu hình backend

```bash
cp server/.env.example server/.env
```

Sau đó sửa `server/.env` cho đúng tài khoản MySQL trên máy.

### 3. Chạy ứng dụng

```bash
npm run dev
```

- Giao diện: http://localhost:5173
- API: http://localhost:3000/api/todos
- Kiểm tra server: http://localhost:3000/api/health

## Các lệnh hữu ích

```bash
npm run dev          # Chạy frontend và backend
npm run dev:client   # Chỉ chạy frontend
npm run dev:server   # Chỉ chạy backend
npm run build        # Build frontend
```
