# 🚀 Login App - Next.js

A simple web application with authentication system using **Next.js App Router**, featuring login, rate limiting, middleware protection, and unit testing.

---

## 📌 Features

* 🔐 Login Authentication (JWT)
* 🛡️ Rate Limit (5 request / menit per IP)
* ⏳ Cooldown + Countdown saat login gagal
* 🔒 Middleware Protect Dashboard
* 🧪 Unit Testing (Form validation & login)
* 💾 MySQL Database
* 🎨 Simple Modern UI (tanpa Tailwind)

---

## 🛠️ Tech Stack

* **Frontend**

  * Next.js 14 (App Router)
  * React (TypeScript / TSX)
  * CSS (Custom styling)

* **Backend**

  * Next.js API Routes
  * JWT (Authentication)
  * bcryptjs (Password hashing)

* **Database**

  * MySQL

* **Testing**

  * Jest
  * React Testing Library

---

## ⚙️ Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/login-app.git
cd login-app
```

---

### 2. Install Dependency

```bash
npm install
```

---

### 3. Setup Environment

Setup di file `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=login_app

JWT_SECRET=e15fa4d0a08143036de38252dfa0c78acea942212a56c42d10344c9b1182bb2d
```

  

---

### 4. Jalankan Database

Buat Database login_app

Import atau buat tabel `users`:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255)
);
```

---

### 5. Jalankan Seeder 

Gunakan file `seed.ts` untuk menambahkan user ke database , jalankan melalui terminal:

```bash
npx ts-node -P tsconfig.seed.json seed.ts
```

---

### 6. Jalankan Project

```bash
npm run dev
```

Akses di:

```
http://localhost:3000
```

---

### 7. Jalankan Unit Test

```bash
npm run test
```

---

## 🏗️ Arsitektur Aplikasi

Aplikasi ini menggunakan arsitektur berbasis **Next.js App Router** dengan pemisahan antara frontend dan backend dalam satu project.

---

### 🔹 1. Frontend (Client Side)

* Form login dibuat menggunakan React (TSX)
* Validasi dilakukan di client:

  * Field wajib
  * Format email
* Menangani:

  * Loading state
  * Error message
  * Cooldown countdown (localStorage)

---

### 🔹 2. Backend (API Routes)

Endpoint utama:

```
/api/login
/api/logout
/api/me
```

Fungsi:

* Validasi user dari database
* Hash password menggunakan bcrypt
* Generate JWT token
* Simpan token ke cookies

---

### 🔹 3. Authentication Flow

1. User login → kirim email & password
2. Backend verifikasi:

   * Cek user di database
   * Bandingkan password (bcrypt)
3. Jika valid:

   * Generate JWT
   * Simpan ke cookies
4. User diarahkan ke dashboard

---

### 🔹 4. Middleware

Digunakan untuk proteksi route:

* Mengecek token JWT di cookies
* Jika tidak ada → redirect ke login
* Jika ada → akses dashboard

---

### 🔹 5. Rate Limiting

* Maksimal **5 request / menit / IP**
* Disimpan di memory (Map)
* Jika melebihi:

  * API return `429`
  * Frontend menampilkan countdown
  * Form di-disable

---

### 🔹 6. Unit Testing

Testing dilakukan untuk:

* Validasi form login
* Response API (mock fetch)
* Handling error & rate limit

Tools:

* Jest
* React Testing Library

---

## 📂 Struktur Folder

```
app/
 ├── page.tsx        # Login Page
 ├── dashboard/      # Dashboard Page
 ├── api/
 │    ├── login/
 │    ├── logout/
 │    └── me/

lib/
 ├── db.ts           # Database connection
 ├── rateLimiter.ts  # Rate limiting logic

middleware.ts        # Route protection

__tests__/           # Unit testing
```

---

## 🔐 Security Features

* Password hashing (bcrypt)
* JWT authentication
* Rate limiting (anti brute force)
* Middleware protection
* Client-side validation

---

## 📈 Future Improvement

* 🔄 Refresh Token
* 🌐 Redis untuk rate limit (production ready)
* 📊 Dashboard data real
* 🔔 Toast notification
* 📱 Responsive UI improvement

---

## 👨‍💻 Author

**Bima Tri Wiyono**

##
