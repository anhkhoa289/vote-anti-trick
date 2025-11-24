# 🏗️ Infrastructure Voting System

Hệ thống voting cho các infrastructure ấn tượng, được xây dựng với Next.js 16 và PostgreSQL.

## ✨ Tính năng

- 🗳️ Vote cho các infrastructure yêu thích
- ➕ Thêm infrastructure mới
- 📊 Xem số lượng vote real-time
- 💾 Lưu trữ dữ liệu với PostgreSQL
- 🎨 Giao diện đẹp với Tailwind CSS
- ⚡ Full-stack với Next.js App Router

## 🛠️ Công nghệ sử dụng

- **Frontend & Backend**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Yêu cầu

- Node.js 18+ hoặc 20+
- PostgreSQL 14+ (đã cài đặt và đang chạy)
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd vote-anti-trick
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Thiết lập database

Tạo database PostgreSQL:

```bash
createdb vote_infrastructure
```

Hoặc sử dụng psql:

```sql
CREATE DATABASE vote_infrastructure;
```

### 4. Cấu hình môi trường

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cập nhật connection string trong `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vote_infrastructure?schema=public"
```

Thay `username` và `password` bằng thông tin PostgreSQL của bạn.

### 5. Chạy migrations

```bash
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. (Tùy chọn) Seed dữ liệu mẫu

Bạn có thể tạo file `prisma/seed.ts` để thêm dữ liệu mẫu.

### 8. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc dự án

```
vote-anti-trick/
├── app/
│   ├── api/
│   │   └── infrastructures/
│   │       ├── route.ts              # GET, POST infrastructures
│   │       └── [id]/
│   │           ├── route.ts          # GET infrastructure by ID
│   │           └── vote/
│   │               └── route.ts      # POST vote
│   ├── layout.tsx
│   └── page.tsx                      # Home page
├── components/
│   ├── VotingPage.tsx                # Main voting page component
│   ├── InfrastructureCard.tsx       # Infrastructure card with vote button
│   └── AddInfrastructureForm.tsx    # Form to add new infrastructure
├── lib/
│   └── prisma.ts                     # Prisma client singleton
├── prisma/
│   └── schema.prisma                 # Database schema
├── types/
│   └── index.ts                      # TypeScript types
└── .env                              # Environment variables (not in git)
```

## 🔧 API Endpoints

### GET /api/infrastructures
Lấy danh sách tất cả infrastructures với số lượng vote.

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Kubernetes",
    "description": "Container orchestration platform",
    "imageUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "votes": 42
    }
  }
]
```

### POST /api/infrastructures
Tạo infrastructure mới.

**Request Body:**
```json
{
  "name": "Docker",
  "description": "Containerization platform",
  "imageUrl": "https://..." // optional
}
```

### GET /api/infrastructures/[id]
Lấy thông tin chi tiết của một infrastructure.

### POST /api/infrastructures/[id]/vote
Vote cho một infrastructure.

**Request Body:**
```json
{
  "voterName": "John Doe", // optional
  "voterEmail": "john@example.com" // optional
}
```

## 💾 Database Schema

### Infrastructure
- `id`: String (CUID)
- `name`: String
- `description`: String
- `imageUrl`: String (nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Vote
- `id`: String (CUID)
- `infrastructureId`: String (FK)
- `voterName`: String (nullable)
- `voterEmail`: String (nullable)
- `ipAddress`: String (nullable)
- `createdAt`: DateTime

## 🎨 Customization

### Thay đổi màu sắc
Chỉnh sửa Tailwind classes trong các component ở thư mục `components/`.

### Thêm fields mới
1. Cập nhật `prisma/schema.prisma`
2. Chạy `npx prisma migrate dev --name your_migration_name`
3. Cập nhật TypeScript types trong `types/index.ts`
4. Cập nhật API routes và components

## 🔍 Prisma Studio

Để xem và chỉnh sửa database trực quan:

```bash
npx prisma studio
```

Mở [http://localhost:5555](http://localhost:5555)

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm start` - Chạy production server
- `npx prisma studio` - Mở Prisma Studio
- `npx prisma migrate dev` - Tạo và chạy migration mới
- `npx prisma generate` - Generate Prisma Client

## 🐛 Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đang chạy: `pg_isready`
- Kiểm tra connection string trong `.env`
- Kiểm tra database đã được tạo

### Lỗi Prisma Client
- Chạy `npx prisma generate` để tạo lại client
- Xóa `node_modules` và chạy `npm install` lại

### Lỗi TypeScript
- Kiểm tra tất cả dependencies đã được cài đặt
- Restart TypeScript server trong editor

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ using Next.js and PostgreSQL
