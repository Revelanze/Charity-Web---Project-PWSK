/**
 * Project: CareUnity
 * Method: Object Oriented Programming (OOP)
 */

class CareUnityApp {
    constructor() {
        // Ambil data dari LocalStorage atau inisialisasi data default
        this.campaigns = JSON.parse(localStorage.getItem('careunity_data')) || [
            { id: 1, title: "Operasi Kanker Paru Pak Doni", target: 80000000, current: 45000000 },
            { id: 2, title: "Bantu Adik Laila Lawan Leukemia", target: 40000000, current: 15000000 },
            { id: 3, title: "Biaya Kemoterapi Pejuang Dhuafa", target: 120000000, current: 90000000 }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    // Fungsi untuk berganti halaman (Tab System)
    changeTab(pageId) {
        document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');

        document.querySelectorAll('.menu-item').forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-page') === pageId) link.classList.add('active');
        });
    }

    // Fungsi Render Tampilan
    updateDisplay() {
        this.renderCampaignList();
        this.renderAdminData();
    }

    renderCampaignList() {
        const container = document.getElementById('campaign-display');
        if(!container) return;
        
        container.innerHTML = "";
        this.campaigns.forEach(item => {
            const percent = (item.current / item.target) * 100;
            container.innerHTML += `
                <div class="card-item">
                    <div class="card-body">
                        <h4>${item.title}</h4>
                        <div class="prog-bar">
                            <div class="prog-fill" style="width: ${percent}%"></div>
                        </div>
                        <p style="font-size: 14px;">Terkumpul: <strong>Rp ${item.current.toLocaleString()}</strong></p>
                        <p style="font-size: 12px; color: #888;">Target: Rp ${item.target.toLocaleString()}</p>
                    </div>
                </div>
            `;
        });
    }

    renderAdminData() {
        const tableBody = document.getElementById('table-body-admin');
        if(!tableBody) return;

        tableBody.innerHTML = "";
        this.campaigns.forEach((item, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>Rp ${item.target.toLocaleString()}</td>
                    <td>Rp ${item.current.toLocaleString()}</td>
                    <td>
                        <button class="btn-del" onclick="app.removeCampaign(${index})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    // Operasi CRUD (Create & Delete)
    addNewCampaign(title, target) {
        const newData = {
            id: Date.now(),
            title: title,
            target: parseInt(target),
            current: 0
        };
        this.campaigns.push(newData);
        this.saveAndSync();
    }

    removeCampaign(index) {
        if(confirm("Hapus data kampanye ini?")) {
            this.campaigns.splice(index, 1);
            this.saveAndSync();
        }
    }

    saveAndSync() {
        localStorage.setItem('careunity_data', JSON.stringify(this.campaigns));
        this.updateDisplay();
    }

    // Setup Event Listeners (Interaksi User)
    setupEventListeners() {
        // Navigasi Menu
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeTab(e.target.getAttribute('data-page'));
            });
        });

        // Tombol di Hero
        document.getElementById('go-donasi').onclick = () => this.changeTab('donasi');

        // Form Donasi Submit
        document.getElementById('form-donasi-baru').onsubmit = (e) => {
            e.preventDefault();
            const nama = document.getElementById('donatur-nama').value;
            alert(`Terima kasih Bapak/Ibu ${nama}. Donasi Anda sangat berarti.`);
            e.target.reset();
            this.changeTab('home');
        };

        // Form Relawan Submit
        document.getElementById('form-relawan-baru').onsubmit = (e) => {
            e.preventDefault();
            alert("Terima kasih telah mendaftar! Kami akan segera menghubungi Anda.");
            e.target.reset();
            this.changeTab('home');
        };

        // Tambah Data Admin
        document.getElementById('btn-tambah-data').onclick = () => {
            const jdl = prompt("Nama Kampanye:");
            const tgt = prompt("Target Dana (Angka saja):");
            if(jdl && tgt) this.addNewCampaign(jdl, tgt);
        };
    }
}

// Menjalankan Aplikasi
const app = new CareUnityApp();