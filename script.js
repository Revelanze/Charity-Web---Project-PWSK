/**
 * CareUnity OOP Engine 2026
 * Diperbaiki untuk memastikan semua tombol navigasi berfungsi.
 */

class CareUnityApp {
    constructor() {
        // Data Inisial
        this.campaigns = JSON.parse(localStorage.getItem('careunity_v3_data')) || [
            { id: 1, title: "Biaya Operasi Pak Jono", target: 50000000, current: 32000000, img: "https://izi.or.id/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-23-at-3.15.07-PM-768x1024.jpeg" },
            { id: 2, title: "Kemoterapi Adik Siska", target: 30000000, current: 12000000, img: "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2022/02/20/2936333389.jpeg" },
            { id: 3, title: "Nutrisi Pejuang Kanker", target: 10000000, current: 8000000, img: "https://www.itb.ac.id/files/dokumentasi/1674027445-Kolaborasi-Menggembirakan-di-Rumah-Pejuang-Kanker-Ambu.jpg" }
        ];

        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindForms();
        this.render();
        console.log("CareUnity App Initialized...");
    }

    // Fungsi Navigasi Tab
    bindNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                this.navigateTo(target);
            });
        });

        // Tombol Tambah Data di Admin
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                const title = prompt("Masukkan Judul Kampanye:");
                const target = prompt("Target Dana (Rp):");
                if (title && target) this.addCampaign(title, target);
            };
        }
    }

    navigateTo(pageId) {
        // Hilangkan semua class active
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

        // Aktifkan yang dipilih
        const targetPage = document.getElementById(`page-${pageId}`);
        const targetBtn = document.querySelector(`[data-target="${pageId}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');
        
        window.scrollTo(0, 0);
    }

    bindForms() {
        const formDonasi = document.getElementById('form-donasi');
        if (formDonasi) {
            formDonasi.onsubmit = (e) => {
                e.preventDefault();
                alert(`Donasi dari ${document.getElementById('d-nama').value} berhasil disimulasikan!`);
                formDonasi.reset();
                this.navigateTo('home');
            };
        }

        const formRelawan = document.getElementById('form-relawan');
        if (formRelawan) {
            formRelawan.onsubmit = (e) => {
                e.preventDefault();
                alert("Terima kasih telah mendaftar sebagai relawan!");
                formRelawan.reset();
                this.navigateTo('home');
            };
        }
    }

    render() {
        this.renderHomeCards();
        this.renderAdminTable();
        this.updateAdminStats();
    }

    renderHomeCards() {
        const list = document.getElementById('campaign-list');
        if (!list) return;
        list.innerHTML = this.campaigns.map(c => {
            const perc = (c.current / c.target) * 100;
            return `
                <div class="card">
                    <img src="${c.img}" class="card-img">
                    <div class="card-info">
                        <h4 style="font-weight:700">${c.title}</h4>
                        <div class="prog-bg"><div class="prog-bar" style="width:${perc}%"></div></div>
                        <p style="font-size:13px; color:#64748b">Terkumpul: <b>Rp ${c.current.toLocaleString()}</b></p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAdminTable() {
        const tbody = document.getElementById('admin-table');
        if (!tbody) return;
        tbody.innerHTML = this.campaigns.map((c, i) => `
            <tr>
                <td><img src="${c.img}" style="width:40px; border-radius:5px"></td>
                <td><b>${c.title}</b></td>
                <td>Rp ${c.target.toLocaleString()}</td>
                <td>Rp ${c.current.toLocaleString()}</td>
                <td><button onclick="app.deleteCampaign(${i})" style="color:red; border:none; background:none; cursor:pointer; font-weight:600">Hapus</button></td>
            </tr>
        `).join('');
    }

    updateAdminStats() {
        const countEl = document.getElementById('stat-count');
        const sumEl = document.getElementById('stat-sum');
        if (!countEl || !sumEl) return;

        const total = this.campaigns.reduce((a, b) => a + b.current, 0);
        countEl.innerText = this.campaigns.length;
        sumEl.innerText = `Rp ${total.toLocaleString()}`;
    }

    addCampaign(title, target) {
        this.campaigns.push({
            id: Date.now(),
            title: title,
            target: parseInt(target),
            current: 0,
            img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
        });
        this.sync();
    }

    deleteCampaign(index) {
        if (confirm("Hapus data ini?")) {
            this.campaigns.splice(index, 1);
            this.sync();
        }
    }

    sync() {
        localStorage.setItem('careunity_v3_data', JSON.stringify(this.campaigns));
        this.render();
    }
}

// Global initialization
const app = new CareUnityApp();