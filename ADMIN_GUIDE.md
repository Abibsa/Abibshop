# AbibShop - Panduan Login & Admin

## 🔐 Akun Demo

### Admin
- **Email**: admin@abibshop.com
- **Password**: admin123
- **Akses**: Dashboard Admin penuh

### User Biasa
- **Email**: user@example.com
- **Password**: user123
- **Akses**: Halaman user biasa

## 📋 Fitur Login

### Untuk Admin:
1. Login di `/login`
2. Setelah login, akan redirect ke `/admin`
3. Akses dashboard dengan statistik:
   - Total Revenue
   - Total Orders
   - Pending Orders
   - Completed Orders
4. Kelola pesanan di `/admin/orders`:
   - Search pesanan
   - Filter by status
   - Edit status pesanan
   - Lihat detail lengkap customer

### Untuk User:
1. Login di `/login`
2. Setelah login, akan redirect ke homepage
3. Dapat melihat profil di navbar
4. Logout dari dropdown menu

## 🎨 Fitur Navbar

- **Sebelum Login**: Tombol "Login"
- **Setelah Login**: 
  - Dropdown menu dengan nama user
  - Link ke Dashboard Admin (khusus admin)
  - Tombol Logout
- **Mobile**: Responsive dengan Sheet menu

## 💾 State Management

Menggunakan **Zustand** dengan persist middleware:
- Data login tersimpan di localStorage
- Auto-login saat refresh page
- Protected routes untuk admin

## 🛡️ Security

- Route protection di halaman admin
- Auto redirect ke login jika tidak authenticated
- Role-based access control (admin/user)

## 📱 Halaman

- `/login` - Halaman login
- `/admin` - Dashboard admin (protected)
- `/admin/orders` - Kelola pesanan (protected)
- Semua halaman lain - Public

---

**Note**: Ini adalah implementasi demo dengan mock data. Untuk production, integrasikan dengan backend API dan database real.
