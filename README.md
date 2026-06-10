# 🎮 Baby Game Fun - Permainan Interaktif untuk Bayi (Update v2.0)

## ✨ Fitur Terbaru (v2.0)

### 🔐 Login System
- **Dual Login**: Player dan Admin login terpisah
- **Admin Dashboard**: Login khusus untuk manajemen
- Admin Email: `admin@babygamefun.com`
- Admin Password: `admin123`

### 👥 Admin Dashboard
1. **Players Management**
   - Melihat daftar semua player
   - Lihat detail profil player lain
   - Melihat item di keranjang player
   - Cek history penukaran item

2. **Items Management**
   - Tambah item baru
   - Restock/update jumlah stok
   - Hapus item yang tidak digunakan
   - Auto-sync stok ke semua player

3. **Exchange History**
   - Lihat riwayat penukaran item
   - Track siapa yang menukar apa
   - Informasi tanggal dan harga

### 💰 Sistem Skor Kredit

#### Cara Mendapatkan Skor:
- **Game 1 (Cocokan Gambar)**: 10 skor per pasangan
- **Game 2 (Rapikan Barang)**: 12 skor per item
- **Game 3 (Tebak Hewan)**: 15 skor per jawaban benar
- **Game 4 (Kebun Ajaib)**: 10-30 skor per klik (random)

#### Challenge Sesi (SESI 1-4):
- **SESI 1 (Soal 1-50)**: 10 skor kredit per soal
- **SESI 2 (Soal 1-50)**: 20 skor kredit per soal
- **SESI 3 (Soal 1-50)**: 50 skor kredit per soal
- **SESI 4 (Soal 1-20)**: Sistem khusus dengan harga perbenih dan waktu tanam

#### Bonus Spesial:
- **Login Harian**: 10.000 skor kredit (1x sehari)
- **Ulang Tahun**: 10.000 skor kredit bonus (otomatis saat login di tanggal ultah)

### 🛒 Item Shop & Exchange

#### Default Items:
1. Es Krim - 20.000 skor kredit (Stok: 5)
2. Snack Taro - 15.000 skor kredit (Stok: 5)
3. Silverqueen - 50.000 skor kredit (Stok: 2)
4. Uang 5 ribu - 55.000 skor kredit (Stok: 2)
5. Uang 10 ribu - 120.000 skor kredit (Stok: 1)
6. Uang 20 ribu - 300.000 skor kredit (Stok: 1)
7. Uang 50 ribu - 1.000.000 skor kredit (Stok: 1)

#### Flow Penukaran:
1. Player melihat item di "Skor Kredit"
2. Klik "Tambah ke Keranjang"
3. Buka "Keranjang Item"
4. Klik "Tukar" untuk menukar dengan skor
5. Stok otomatis berkurang di admin & player lain

### 🔄 Real-time Sync
- Semua player share data yang sama via LocalStorage
- Jika admin update stok, semua player melihat perubahan
- Jika player menukar item, stok berkurang untuk semua
- Exchange history tercatat otomatis

## 📋 4 Permainan Menyenangkan

1. **🍎 Cocokan Gambar** - Matching game dengan 16 kartu
2. **🎈 Rapikan Barang** - Drag & drop barang ke keranjang
3. **🦁 Tebak Hewan** - Dengarkan suara, tebak hewan
4. **🍌 Kebun Ajaib** - Klik pot, dapat random reward

## 🛠 Teknologi
- **HTML5** - Struktur
- **CSS3** - Styling & Animasi
- **JavaScript Vanilla** - Logika & Interaksi
- **LocalStorage** - Sinkronisasi data
- **Web Audio API** - Feedback audio
- **Speech Synthesis API** - Text-to-speech

## 📁 Struktur File
```
baby-game-fun/
├── index.html      # Semua halaman (Player + Admin)
├── styles.css      # Styling komprehensif
├── script.js       # Logika game & admin
└── README.md       # Dokumentasi
```

## 🚀 Cara Menggunakan

### Login sebagai Player:
1. Buka aplikasi
2. Pilih tab "👶 Player"
3. Daftar akun baru atau login
4. Pilih dan mainkan game
5. Kumpulkan skor kredit
6. Tukar dengan item di Keranjang

### Login sebagai Admin:
1. Buka aplikasi
2. Pilih tab "👨‍💼 Admin"
3. Email: `admin@babygamefun.com`
4. Password: `admin123`
5. Kelola player, item, dan exchange

## 👨‍💻 Fitur Admin Detail

### Tab Players
- Lihat semua player terdaftar
- Total score setiap player
- Jumlah kredit yang dimiliki
- Berapa item di keranjang
- Klik "Lihat Detail" untuk melihat:
  - Profil lengkap
  - Daftar item di keranjang
  - Siap untuk disiapkan barangnya

### Tab Manage Items
- Form tambah item baru
- Input nama, harga, stok awal
- List item dengan aksi:
  - Update stok (real-time sync)
  - Hapus item
- Perubahan langsung terlihat di player

### Tab Exchanges
- History semua penukaran
- Info player yang menukar
- Item yang ditukar
- Harga dan tanggal penukaran
- Untuk tracking & analisis

## 💾 Data Storage
- **Users**: Profil player, password, score, kredit
- **Items**: Daftar item, harga, stok
- **Exchanges**: History penukaran, player, item, tanggal
- **Semua tersimpan di LocalStorage** - Tidak perlu server

## 🔄 Multi-Device Sync

### Skenario:
- Player A di Device 1 menukar item
- Stok berkurang untuk Player B di Device 2
- Admin di Device 3 update stok
- Semua player melihat update

### Cara Kerjanya:
- Data di-save di LocalStorage browser
- Setiap perubahan di-sync otomatis
- Load data dari LocalStorage saat login
- Update UI real-time

## 🎯 Workflow Rekomendasi Admin

1. **Setiap pagi**: Cek player baru di tab Players
2. **Update stok**: Jika ada item yang habis, restock di tab Items
3. **Monitor exchange**: Lihat siapa yang menukar di tab Exchanges
4. **Siapkan hadiah**: Lihat item apa yang sering ditukar
5. **Tambah item**: Jika ada permintaan khusus, tambah item baru

## ⚙️ Konfigurasi

### Ubah Admin Password:
Edit di `script.js`:
```javascript
const ADMIN_PASSWORD = 'admin123';
```

### Ubah Item Default:
Edit di `script.js` function `getDefaultItems()`

### Ubah Bonus Login:
Edit di `script.js` function `login()`:
```javascript
user.totalCredit = (user.totalCredit || 0) + 10000;
```

## 🐛 Testing

### Test Player:
- Email: `player@test.com`
- Password: `123456`

### Test Flow:
1. Daftar akun player
2. Login & main game
3. Kumpulkan skor
4. Tambah item ke keranjang
5. Tukar item
6. Login admin cek history
7. Update stok item
8. Login player lain, lihat perubahan

## 📈 Fitur Masa Depan
- Backend server untuk multi-user real-time
- Database untuk persistensi data
- Achievement system
- Leaderboard
- Multiplayer games
- Parent control panel
- Analytics dashboard

## 📝 License
Gratis untuk digunakan dan dikembangkan

---

**Happy Gaming! 🎉🎮**