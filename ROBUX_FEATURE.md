# Fitur Robux Gratis - AbibShop

## Deskripsi
Sistem untuk mendapatkan Robux gratis melalui berbagai metode:

### 1. **Game Pass 5 Hari**
- Dapatkan 500 Robux langsung saat aktivasi
- Berlaku selama 5 hari
- Bonus harian selama periode aktif

### 2. **Login Harian**
- Login setiap hari untuk mendapatkan Robux gratis
- Reward: 50-200 Robux (meningkat dengan streak)
- Streak bonus: Semakin lama streak, semakin besar reward
- Reset jika tidak login lebih dari 1 hari

### 3. **Kode Redeem**
Kode yang tersedia:
- `ROBUX100` - 100 Robux
- `ROBUX250` - 250 Robux
- `ROBUX500` - 500 Robux
- `WELCOME2024` - 150 Robux
- `FREEGIFT` - 75 Robux
- `SPECIAL1000` - 1000 Robux

Setiap kode hanya bisa digunakan sekali per user.

### 4. **Gift Card**
- Masukkan kode gift card untuk mendapatkan Robux
- Nilai random antara 100-1000 Robux

## Fitur Teknis

### Penyimpanan Data
- Menggunakan `localStorage` untuk menyimpan data user
- Data yang disimpan:
  - Balance Robux
  - Tanggal login terakhir
  - Login streak
  - Tanggal kadaluarsa Game Pass
  - Daftar kode yang sudah di-redeem

### Notifikasi
- Notifikasi sukses (hijau) untuk aksi berhasil
- Notifikasi error (merah) untuk aksi gagal
- Auto-dismiss setelah 3 detik

### Animasi
- Menggunakan Framer Motion untuk animasi smooth
- Gradient background yang bergerak
- Hover effects pada tombol
- Slide-in animations untuk konten

## Cara Menggunakan

1. **Akses Halaman**: Klik "Robux Gratis" di navigasi atau kunjungi `/robux`
2. **Pilih Tab**: Pilih salah satu dari 4 metode yang tersedia
3. **Klaim Reward**: Ikuti instruksi di setiap tab untuk mendapatkan Robux

## Lokasi File
- Halaman utama: `/app/robux/page.tsx`
- Navigasi: `/components/Navbar.tsx`
- Banner promo: `/app/page.tsx`
- Styling: `/app/globals.css`

## Dependencies
- `framer-motion` - Untuk animasi
- `lucide-react` - Untuk ikon
- `localStorage` - Untuk penyimpanan data lokal
