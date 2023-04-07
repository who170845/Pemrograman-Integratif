# Pemrograman-Integratif

# Hal-hal yang Harus Terinstall dalam PC 

1. NodeJs
2. NPM
3. XAMPP (untuk data base mysql)

Kemudian `npm install` untuk menginstall module yang diperlukan untuk menjalankan program.
- `npm install grpc` untuk menginstall grpc yang diperlukan oleh program.
- `npm install protobuf` supaya file .proto dapat dijalankan.
- `npm install mysql` supaya dapat terkonfigurasi dengan data base mysql.

# Dokumentasi

- Buat data base menggunakan XAMPP MySQL dengan nama `penduduk`. Dalam data base `penduduk` terdapat tabel `data` dengan kolom `id`, `nama`, dan `umur`.

![Screenshot (29)](https://user-images.githubusercontent.com/113872836/230643163-0692333b-621d-4c37-bc45-2c2e74ea0a89.png)

- Kemudian jalankan server dalam program supaya terhubung ke data base yang telah dibuat sebelumnya, dengan menjalan perintah `npm start`.

![Screenshot (30)](https://user-images.githubusercontent.com/113872836/230643731-34c5cfd5-a042-43cd-869e-37c04583eb54.png)

- Setelah server dijalankan, baru program bisa bisa dijalankan dengan perintah `node client.js`.
- Program untuk grpc ini mencakup fungsi:
    - listUser();
    - getUser(id);
    - addUser('nama', 'umur');
    - updateUser(id, 'nama', 'umur');
    - deleteUser(id);

- Misal kita ingin menambahkan user, maka dalam fungsi `addUser` kita masukkan nama dan umur user yang ingin kita tambahkan. Contoh `addUser('Anda', '40');` saya menambahn user bernama `Anda` berumur 40 tahun. Kemudian jalankan di terminal `node client.js`.

![Screenshot (31)](https://user-images.githubusercontent.com/113872836/230645276-f31e7c84-e673-49e0-bf2a-6fb22a315ba7.png)

- Secara otomatis user yang kita tambahkan akan terdata di data base penduduk.

![Screenshot (32)](https://user-images.githubusercontent.com/113872836/230645459-e249f9ed-85fa-4d18-9241-8e4dd9557a71.png)

- Demikian juga untuk fungsi yang lain.

# Terima Kasih :-)

