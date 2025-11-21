
        //  Memastikan kode berjalan hanya setelah HTML selesai dimuat 
        document.addEventListener('DOMContentLoaded', function() {
            
            //  Mengambil elemen HTML dan menyimpannya dalam variabel agar mudah diakses
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //  Mendefinisikan URL gambar untuk status Normal, Sukses, dan Error. 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
              Mengubah gambar dan teks alternatif (alt) berdasarkan status kalkulator yang diberikan ('normal', 'success', atau 'error')
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    //  Kodingan ini berfungsi untuk MENGATUR GAMBAR STATUS KEMBALI KE TAMPILAN NORMAL (DEFAULT). 
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              Kodingan ini berfungsi untuk membersihkan layar kalkulator dan mereset status visualnya ke kondisi awal
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
              Menghapus karakter terakhir dari nilai yang saat ini ditampilkan pada layar kalkulator. 
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              Menambahkan nilai tombol (angka atau operator) yang diklik ke akhir nilai yang ditampilkan di layar. 
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
              Menghitung hasil ekspresi matematika yang ada di layar dan mengupdate status visual.
             */
            function calculateResult() {
                //  Memeriksa apakah layar kosong. Jika ya, mengubah status menjadi error dan menampilkan pesan.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    //  Setelah 1.5 detik, memanggil clearDisplay untuk mereset layar kembali ke keadaan normal.
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    // Menggunakan fungsi 'eval' untuk mengevaluasi ekspresi matematika yang ada di layar. 
                    let result = eval(display.value
                        .replace(/%/g, '/100') // Mengganti simbol persentase (%) dengan pembagian 100 untuk melakukan perhitungan persentase. 
                    ); 
                    
                    // Memastikan hasil perhitungan adalah angka valid (bukan Infinity atau NaN). 
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); // Mengubah gambar status menjadi 'Sukses!' karena perhitungan berhasil. 
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); // Mengubah gambar status menjadi 'Error!' karena terjadi kesalahan perhitungan (misalnya pembagian dengan nol) atau input tidak valid. 
                    setTimeout(clearDisplay, 1500);
                }
            }


            // Memasang event listener 'click' pada setiap tombol kalkulator. 
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    // Menggunakan pernyataan switch untuk menentukan tindakan berdasarkan nilai tombol yang diklik. 
                    switch(value) {
                        case 'C':
                            // Memanggil fungsi untuk membersihkan layar. 
                            clearDisplay();
                            break;
                        case 'DEL':
                            // Memanggil fungsi untuk menghapus karakter terakhir. 
                            deleteLastChar();
                            break;
                        case '=':
                            // Memanggil fungsi untuk menghitung dan menampilkan hasil. 
                            calculateResult();
                            break;
                        default:
                            // Untuk tombol angka atau operator lainnya: 
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                // Jika layar masih menampilkan hasil sukses atau error dari perhitungan sebelumnya, layar akan dibersihkan sebelum menambahkan input baru. 
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            // Memungkinkan input dan operasi kalkulator melalui keyboard dengan mendengarkan event 'keydown'. 
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });