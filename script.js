/* ==================================================
   KONFIGURASI
================================================== */

const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxjT84sHBHCpjT7a9iTTMgjA4nWO12RS3f7WAfbaSq5-sMx1ymAGsBj7uAWu6NtOTYXnQ/exec";


/* ==================================================
   MENU MOBILE
================================================== */

function toggleMenu() {

    const menu = document.getElementById("navMenu");

    if (menu) {
        menu.classList.toggle("show");
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const links =
        document.querySelectorAll(".nav-menu a");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            const menu =
                document.getElementById("navMenu");

            if (menu) {
                menu.classList.remove("show");
            }

        });

    });

});


/* ==================================================
   KIRIM PESAN
================================================== */

async function kirimPesan(event) {

    event.preventDefault();

    const form =
        document.getElementById("contactForm");

    const status =
        document.getElementById("status");

    const button =
        document.getElementById("btnKirim");


    const nama =
        document.getElementById("nama").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const subjek =
        document.getElementById("subjek").value.trim();

    const pesan =
        document.getElementById("pesan").value.trim();


    if (!nama || !email || !subjek || !pesan) {

        status.innerHTML =
            "❌ Semua kolom wajib diisi.";

        status.style.color = "#dc2626";

        return;
    }


    button.disabled = true;

    button.innerText = "Mengirim...";

    status.innerHTML =
        "⏳ Pesan sedang dikirim...";

    status.style.color = "#16a34a";


    try {

        const response =
            await fetch(APPS_SCRIPT_URL, {

                method: "POST",

                body: JSON.stringify({

                    action: "kirimPesan",

                    nama: nama,

                    email: email,

                    subjek: subjek,

                    pesan: pesan

                })

            });


        const result =
            await response.json();


        if (result.status === "success") {

            status.innerHTML =
                "✅ Pesan berhasil dikirim.";

            status.style.color =
                "#15803d";

            form.reset();

        } else {

            throw new Error(
                result.message ||
                "Pesan gagal dikirim."
            );

        }

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ Pesan gagal dikirim. Periksa URL Apps Script.";

        status.style.color =
            "#dc2626";

    }


    button.disabled = false;

    button.innerText =
        "Kirim Pesan";
}


/* ==================================================
   ADMIN - LOGIN
================================================== */

function loginAdmin(event) {

    event.preventDefault();

    const username =
        document.getElementById("adminUsername").value;

    const password =
        document.getElementById("adminPassword").value;

    const status =
        document.getElementById("loginStatus");


    if (
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "adminLogin",
            "true"
        );

        tampilkanAdmin();

    } else {

        status.innerHTML =
            "❌ Username atau password salah.";

        status.style.color =
            "#dc2626";
    }
}


/* ==================================================
   CEK LOGIN ADMIN
================================================== */

function cekAdmin() {

    const login =
        localStorage.getItem("adminLogin");

    if (login === "true") {

        tampilkanAdmin();

    }

}


/* ==================================================
   TAMPILKAN PANEL ADMIN
================================================== */

function tampilkanAdmin() {

    const loginBox =
        document.getElementById("loginBox");

    const adminPanel =
        document.getElementById("adminPanel");


    if (loginBox) {
        loginBox.style.display = "none";
    }

    if (adminPanel) {
        adminPanel.style.display = "block";
    }


    ambilDataPesan();
}


/* ==================================================
   LOGOUT
================================================== */

function logoutAdmin() {

    localStorage.removeItem(
        "adminLogin"
    );

    location.reload();
}


/* ==================================================
   AMBIL DATA PESAN
================================================== */

async function ambilDataPesan() {

    const table =
        document.getElementById("dataPesan");

    const total =
        document.getElementById("totalPesan");


    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="6"
                style="text-align:center">
                ⏳ Memuat data...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                APPS_SCRIPT_URL +
                "?action=getPesan"
            );


        const result =
            await response.json();


        if (result.status !== "success") {

            throw new Error(
                result.message
            );
        }


        const data =
            result.data || [];


        if (total) {

            total.innerText =
                data.length;

        }


        if (data.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center">
                        Belum ada pesan.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = "";


        data.forEach(function (item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${escapeHTML(item.timestamp)}</td>

                <td>${escapeHTML(item.nama)}</td>

                <td>${escapeHTML(item.email)}</td>

                <td>${escapeHTML(item.subjek)}</td>

                <td>${escapeHTML(item.pesan)}</td>

                <td>
                    <span class="badge">
                        ${escapeHTML(item.status)}
                    </span>
                </td>

            `;


            table.appendChild(row);

        });


    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center;color:red">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

    }

}


/* ==================================================
   KEAMANAN TAMPILAN DATA
================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}