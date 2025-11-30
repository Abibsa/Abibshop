# Admin Panel - Dokumentasi Fungsionalitas

## Overview
Admin panel AbibShop sekarang memiliki kontrol penuh atas semua aspek aplikasi dengan state management menggunakan Zustand dan local storage persistence.

## Fitur yang Telah Diimplementasikan

### 1. **Manajemen Produk** (`/admin/products`)
#### Fitur:
- ✅ **Lihat semua produk** dengan informasi lengkap (nama, harga, stok, status, sales)
- ✅ **Tambah produk baru** dengan dialog form
- ✅ **Edit produk** - ubah nama, harga, stok, kategori, deskripsi
- ✅ **Hapus produk** dengan konfirmasi
- ✅ **Pencarian produk** berdasarkan nama atau kategori
- ✅ **Status badge** (Active, Low Stock, Out of Stock)

#### Store: `lib/product-store.ts`
- Data tersimpan di localStorage dengan key `product-storage`
- Perubahan langsung ter-reflect di seluruh aplikasi

---

### 2. **Manajemen Pesanan** (`/admin/orders`)
#### Fitur:
- ✅ **Lihat semua pesanan** dengan detail lengkap
- ✅ **Update status pesanan** (Pending → Paid → Processing → Completed/Cancelled)
- ✅ **Hapus pesanan** dengan konfirmasi
- ✅ **Filter berdasarkan status** (All, Pending, Paid, Processing, Completed, Cancelled)
- ✅ **Pencarian** berdasarkan Order ID, nama customer, atau username Roblox
- ✅ **Informasi lengkap**: Customer, Product, Payment Method, Amount, Date

#### Store: `lib/order-store.ts`
- Data tersimpan di localStorage dengan key `order-storage`
- Status pesanan dapat diubah secara real-time

---

### 3. **Manajemen Pengguna** (`/admin/users`)
#### Fitur:
- ✅ **Lihat semua user** dengan informasi lengkap
- ✅ **Toggle role** - ubah user menjadi admin atau sebaliknya
- ✅ **Ban/Unban user** - kontrol akses user
- ✅ **Hapus user** dengan konfirmasi
- ✅ **Pencarian user** berdasarkan nama atau email
- ✅ **Status badge** (Active, Banned, Inactive)
- ✅ **Role badge** (Admin, User)

#### Store: `lib/user-store.ts`
- Data tersimpan di localStorage dengan key `user-storage`
- Perubahan role dan status langsung berlaku

---

### 4. **Dashboard Admin** (`/admin`)
#### Fitur:
- ✅ **Statistik real-time**:
  - Total Revenue (dari pesanan completed)
  - Total Orders
  - Pending Orders
  - Completed Orders
- ✅ **Tabel pesanan terbaru** (5 terakhir)
- ✅ **Quick navigation** via AdminNavbar

---

## State Management

### Zustand Stores
Semua data dikelola dengan Zustand dan persist ke localStorage:

1. **Product Store** (`lib/product-store.ts`)
   ```typescript
   - products: Product[]
   - addProduct()
   - updateProduct()
   - deleteProduct()
   - getProductById()
   ```

2. **Order Store** (`lib/order-store.ts`)
   ```typescript
   - orders: Order[]
   - addOrder()
   - updateOrderStatus()
   - deleteOrder()
   - getOrderById()
   - getOrdersByCustomer()
   ```

3. **User Store** (`lib/user-store.ts`)
   ```typescript
   - users: User[]
   - addUser()
   - updateUser()
   - deleteUser()
   - banUser()
   - unbanUser()
   - getUserById()
   ```

---

## Cara Menggunakan

### Sebagai Admin:
1. Login dengan akun admin (`admin@abibshop.com` / `admin123`)
2. Akses admin panel melalui navbar atau langsung ke `/admin`
3. Gunakan AdminNavbar untuk navigasi antar halaman

### Mengelola Produk:
1. Buka `/admin/products`
2. Klik "Tambah Produk" untuk menambah produk baru
3. Klik icon menu (⋮) pada produk untuk Edit atau Delete
4. Gunakan search bar untuk mencari produk

### Mengelola Pesanan:
1. Buka `/admin/orders`
2. Gunakan filter untuk melihat pesanan berdasarkan status
3. Klik icon Edit untuk mengubah status pesanan
4. Klik icon Delete untuk menghapus pesanan

### Mengelola User:
1. Buka `/admin/users`
2. Klik icon menu (⋮) pada user untuk:
   - Toggle role (Admin ↔ User)
   - Ban/Unban user
   - Delete user

---

## Data Persistence

Semua perubahan yang dilakukan di admin panel akan:
- ✅ Tersimpan di localStorage browser
- ✅ Bertahan setelah refresh halaman
- ✅ Langsung ter-update di semua komponen yang menggunakan store
- ✅ Dapat di-reset dengan clear localStorage

---

## Keamanan

- ✅ Hanya user dengan role `admin` yang bisa akses admin panel
- ✅ Auto-redirect ke `/login` jika bukan admin
- ✅ Protected routes dengan `useEffect` check

---

## Next Steps (Opsional)

Untuk production, Anda bisa:
1. Ganti localStorage dengan API backend (Express, NestJS, dll)
2. Tambahkan authentication JWT yang proper
3. Implementasi upload image untuk produk
4. Tambahkan pagination untuk tabel besar
5. Export data ke CSV/Excel
6. Real-time notifications untuk pesanan baru
7. Dashboard analytics yang lebih detail

---

## Teknologi yang Digunakan

- **State Management**: Zustand + Persist Middleware
- **UI Components**: Radix UI (via shadcn/ui)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Framework**: Next.js 14 (App Router)
- **TypeScript**: Full type safety

---

**Dibuat pada**: 1 Desember 2024
**Status**: ✅ Fully Functional
