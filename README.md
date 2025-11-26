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
- **ORM**: Prisma 7 (with adapter pattern)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

## 📋 Yêu cầu

- Node.js 18+ hoặc 20+
- Docker & Docker Compose (cho PostgreSQL)
- yarn (package manager)

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd vote-anti-trick
```

### 2. Cài đặt dependencies

```bash
yarn install
```

### 3. Thiết lập database

Khởi động PostgreSQL với Docker:

```bash
docker-compose up -d
```

Database sẽ chạy trên port **6543** (không phải 5432).

### 4. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` (nếu chưa có):

```bash
cp .env.example .env
```

File `.env` mặc định:

```env
DATABASE_URL="postgresql://vote:vote123@localhost:6543/vote_infrastructure?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Chạy migrations và generate Prisma Client

```bash
yarn prisma migrate dev --name init
yarn prisma generate
```

Hoặc sử dụng makefile shortcuts:

```bash
make prisma-migrate
make prisma-generate
```

### 6. Chạy development server

```bash
yarn dev
# hoặc
make dev
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
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── generated/                    # Generated Prisma client
├── types/
│   └── index.ts                      # TypeScript types
├── prisma.config.ts                  # Prisma 7 datasource config
├── makefile                          # Development shortcuts
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
2. Chạy `yarn prisma migrate dev --name your_migration_name`
3. Chạy `yarn prisma generate` để cập nhật client
4. Cập nhật TypeScript types trong `types/index.ts`
5. Cập nhật API routes và components

## 🔍 Prisma Studio

Để xem và chỉnh sửa database trực quan:

```bash
yarn prisma studio
```

Mở [http://localhost:5555](http://localhost:5555)

## 📝 Scripts

### Development
- `yarn dev` / `make dev` - Chạy development server
- `yarn build` - Build production
- `yarn start` - Chạy production server
- `yarn lint` - Chạy linting

### Database
- `yarn prisma studio` - Mở Prisma Studio
- `yarn prisma migrate dev` - Tạo và chạy migration mới
- `yarn prisma generate` / `make prisma-generate` - Generate Prisma Client
- `docker-compose up -d` - Khởi động PostgreSQL

### Testing
- `yarn test` - Chạy unit tests
- `yarn test:watch` - Chạy tests trong watch mode
- `yarn test:coverage` - Chạy tests với coverage report

## 🧪 Testing & Quality

Project có comprehensive unit tests với 100% coverage cho backend API routes.

- **25 tests** covering tất cả API endpoints
- **100% coverage** (branches, functions, lines, statements)
- **SonarQube integration** sẵn sàng

Xem chi tiết:
- **[Testing Guide](docs/TESTING.md)** - Hướng dẫn chạy tests và xem coverage
- **[SonarQube Setup](docs/SONARQUBE.md)** - Tích hợp với SonarQube/SonarCloud

## 🐛 Troubleshooting

### Lỗi kết nối database
- Kiểm tra Docker container đang chạy: `docker-compose ps`
- Kiểm tra connection string trong `.env` (phải dùng port 6543)
- Khởi động lại database: `docker-compose restart`

### Lỗi "Prisma Client not initialized"
- Chạy `yarn prisma generate` để tạo lại client
- Client được generate vào thư mục `prisma/generated/`, không phải `node_modules`

### Lỗi "Module not found" cho Prisma Client
- Project này dùng custom output location: `prisma/generated/`
- Import từ `../prisma/generated/client`, không phải `@prisma/client`
- Chạy `yarn prisma generate` nếu thư mục chưa tồn tại

### Lỗi TypeScript sau khi thay đổi schema
- Chạy `yarn prisma generate` để cập nhật types
- Restart TypeScript server trong editor

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ using Next.js and PostgreSQL
