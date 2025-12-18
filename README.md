# 🎮 AbibShop - Platform Top Up Roblox Terpercaya

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**Website e-commerce modern untuk layanan Roblox dengan desain futuristik dan UX terbaik**

[Demo](#) • [Dokumentasi](#) • [Laporan](#)

</div>

---

## ✨ Fitur Utama

### 🎨 **Modern UI/UX Design**
- ✅ Gradient mesh backgrounds
- ✅ Glassmorphism effects
- ✅ Smooth animations & micro-interactions
- ✅ Responsive design (Mobile-first)
- ✅ Dark mode support

### 🛍️ **E-Commerce Features**
- ✅ Katalog produk dengan filter & search
- ✅ Product detail pages
- ✅ Shopping cart dengan Zustand
- ✅ Checkout flow yang intuitif
- ✅ Order tracking system

### 🔐 **Authentication & Authorization**
- ✅ Supabase Authentication
- ✅ Login system (Admin & User)
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Secure session management

### 📊 **Admin Dashboard**
- ✅ Statistics cards dengan gradient
- ✅ Order management
- ✅ Real-time order status
- ✅ Customer data management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/abibshop.git

# Navigate to directory
cd abibshop

# Install dependencies
npm install
```

### Setup Supabase

1. **Buat Project di Supabase**
   - Buka [supabase.com](https://supabase.com) dan login
   - Klik "New Project"
   - Isi nama project dan password database
   - Pilih region terdekat (Southeast Asia - Singapore)

2. **Setup Database**
   - Buka "SQL Editor" di dashboard Supabase
   - Copy isi file `supabase/schema.sql`
   - Paste dan run di SQL Editor
   - Tunggu sampai selesai

3. **Setup Environment Variables**
   - Buat file `.env.local` di root folder
   - Copy API keys dari Supabase Dashboard → Settings → API
   - Isi file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Buat Admin User**
   - Buka "Authentication" → "Users" di Supabase
   - Klik "Add user" → "Create new user"
   - Email: `admin@abibshop.com`, Password: `admin123`
   - Centang "Auto Confirm User"
   - Setelah dibuat, buka "Table Editor" → "profiles"
   - Edit user tersebut, ubah `role` menjadi `admin`

5. **Run Development Server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔑 Demo Accounts

### Admin Account
```
Email: admin@abibshop.com
Password: admin123
```

### User Account
```
Email: user@example.com
Password: user123
```

---

## 📁 Struktur Proyek

```
abibshop/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── products/            # Product catalog
│   ├── checkout/            # Checkout flow
│   ├── tracking/            # Order tracking
│   ├── order/[id]/          # Order status
│   ├── login/               # Authentication
│   ├── admin/               # Admin dashboard
│   └── api/                 # API routes
│       ├── products/        # Product API
│       └── orders/          # Order API
├── components/              # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/                  # ShadCN components
├── lib/                     # Utilities & stores
│   ├── supabase/            # Supabase clients
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   ├── middleware.ts    # Session management
│   │   └── database.types.ts # TypeScript types
│   ├── store.ts             # Cart state
│   └── utils.ts             # Utilities
├── services/                # Service layer
│   ├── auth.service.ts      # Auth operations
│   ├── product.service.ts   # Product operations
│   └── order.service.ts     # Order operations
├── supabase/
│   └── schema.sql           # Database schema
├── middleware.ts            # Next.js middleware
└── public/                  # Static assets
```

---

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **State Management**: Zustand

### Backend ✅
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Payment Gateway**: Tripay / Midtrans (Coming Soon)

---

## 🌈 Design System

### Color Palette
- **Primary**: Blue to Purple gradient
- **Secondary**: Purple to Pink gradient
- **Accent**: Various gradients per category

### Animations
- `animate-slide-up`: Slide from bottom
- `animate-scale-in`: Scale from center
- `animate-float`: Floating effect
- `hover-lift`: Lift on hover

### Custom Classes
- `.gradient-mesh`: Mesh gradient background
- `.gradient-primary`: Primary gradient
- `.glass`: Glassmorphism effect
- `.hover-lift`: Hover lift effect

---

## 📄 Halaman

| Route | Deskripsi | Status |
|-------|-----------|--------|
| `/` | Landing page | ✅ |
| `/products` | Katalog produk | ✅ |
| `/products/[id]` | Detail produk | ✅ |
| `/checkout` | Checkout | ✅ |
| `/tracking` | Cek pesanan | ✅ |
| `/order/[id]` | Status pesanan | ✅ |
| `/login` | Login | ✅ |
| `/admin` | Dashboard admin | ✅ |
| `/admin/orders` | Kelola pesanan | ✅ |

---

## 🔧 Development

### Build untuk Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Linting
```bash
npm run lint
```

---

## 📝 Roadmap

### Phase 1 (Current) ✅
- [x] UI/UX Design
- [x] Authentication System
- [x] Product Catalog
- [x] Admin Dashboard

### Phase 2 (Current) 🚧
- [x] Backend Integration (Supabase)
- [x] Database Schema & RLS
- [x] API Routes
- [ ] Real Payment Gateway
- [ ] Email Notifications
- [ ] WhatsApp Integration

### Phase 3 (Future)
- [ ] User Dashboard
- [ ] Order History
- [ ] Affiliate System
- [ ] Analytics Dashboard

---

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Your Name]
- **Project Manager**: [Your Name]

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ for UAS Project**

[⬆ Back to Top](#-abibshop---platform-top-up-roblox-terpercaya)

</div>
