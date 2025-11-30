# Cara Melihat Produk Baru

Karena produk tersimpan di localStorage browser, Anda perlu **clear localStorage** untuk melihat produk yang baru:

## Opsi 1: Clear localStorage via Browser Console (Recommended)

1. Buka browser (Chrome/Edge/Firefox)
2. Tekan `F12` atau `Ctrl+Shift+I` untuk membuka Developer Tools
3. Buka tab **Console**
4. Ketik command berikut dan tekan Enter:
   ```javascript
   localStorage.clear()
   ```
5. Refresh halaman (`F5` atau `Ctrl+R`)

## Opsi 2: Clear Site Data

1. Buka Developer Tools (`F12`)
2. Buka tab **Application** (Chrome/Edge) atau **Storage** (Firefox)
3. Di sidebar kiri, klik **Local Storage**
4. Klik pada URL website Anda (biasanya `http://localhost:3000`)
5. Klik kanan → **Clear** atau klik icon 🗑️ (Delete)
6. Refresh halaman

## Opsi 3: Hard Refresh

1. Tekan `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (Mac)
2. Ini akan clear cache dan reload halaman

---

## Setelah Clear localStorage

Setelah localStorage di-clear, produk baru akan otomatis ter-load dari `product-store.ts`:

✅ **58 Produk Robux** akan muncul di:
- `/products` - Halaman customer
- `/admin/products` - Halaman admin

✅ **3 Kategori Baru**:
- Robux 5 Hari (14 produk)
- Robux Gift Card (33 produk)
- Robux Via Login (11 produk)

---

## Catatan Penting

- Data di localStorage akan ter-reset ke initial state
- Produk yang ditambah/edit via admin akan hilang (kembali ke default)
- Ini normal untuk development, untuk production gunakan database backend
