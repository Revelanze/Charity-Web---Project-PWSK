class CareUnityApp {
    constructor() {
        // Key baru 'cu_final_v1' agar data lama di browser tidak bentrok
        const storageKeyCamp = 'cu_final_camp';
        const storageKeyDon = 'cu_final_don';
        const storageKeyVol = 'cu_final_vol';

        // 1. Data Dummy Kampanye (Saldo Awal)
        this.campaigns = JSON.parse(localStorage.getItem(storageKeyCamp)) || [
            { id: 1, title: "Operasi Kanker Pak Jono", target: 50000000, current: 32000000, img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400" },
            { id: 2, title: "Nutrisi Pejuang Kanker", target: 20000000, current: 5000000, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400" }
        ];

        // 2. Data Dummy Donatur (Mewakili saldo 32jt dan 5jt)
        this.donations = JSON.parse(localStorage.getItem(storageKeyDon)) || [
            { id: 101, nama: "Wayan Kopling", tujuan: "Operasi Kanker Pak Jono", jumlah: 20000000, campId: 1 },
            { id: 102, nama: "Nengah Helper", tujuan: "Operasi Kanker Pak Jono", jumlah: 12000000, campId: 1 },
            { id: 103, nama: "Supir Kikir", tujuan: "Nutrisi Pejuang Kanker", jumlah: 5000000, campId: 2 }
        ];

        // 3. Data Dummy Relawan
        this.volunteers = JSON.parse(localStorage.getItem(storageKeyVol)) || [
            { id: 201, nama: "dr. Tirta", skill: "Medis" },
            { id: 202, nama: "Sarah Alexandra", skill: "Pendampingan Psikososial" },
            { id: 203, nama: "Bapak Budi", skill: "Umum" }
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Navigasi
        document.querySelectorAll('.nav-btn').forEach(b => {
            b.onclick = () => this.navigateTo(b.dataset.target);
        });

        // Form Donasi (Create & Update Saldo)
        document.getElementById('form-donasi').onsubmit = (e) => {
            e.preventDefault();
            const campId = document.getElementById('d-target-camp').value;
            const nama = document.getElementById('d-nama').value;
            const jumlah = parseInt(document.getElementById('d-jumlah').value);

            if (!campId || jumlah <= 0) return alert("Mohon lengkapi data dengan benar!");

            const idx = this.campaigns.findIndex(c => c.id == campId);
            if (idx !== -1) {
                this.campaigns[idx].current += jumlah;
                this.donations.push({ 
                    id: Date.now(), 
                    nama, 
                    tujuan: this.campaigns[idx].title, 
                    jumlah, 
                    campId: parseInt(campId) 
                });
                alert(`Terima kasih ${nama}! Donasi berhasil.`);
                e.target.reset();
                this.sync();
                this.navigateTo('home');
            }
        };

        // Form Relawan (Create)
        document.getElementById('form-relawan').onsubmit = (e) => {
            e.preventDefault();
            this.volunteers.push({ 
                id: Date.now(), 
                nama: document.getElementById('r-nama').value, 
                skill: document.getElementById('r-skill').value 
            });
            alert("Pendaftaran Relawan Berhasil!");
            e.target.reset();
            this.sync();
            this.navigateTo('home');
        };

        // Tambah Kampanye Baru (Create)
        document.getElementById('add-btn').onclick = () => {
            const t = prompt("Judul Kampanye:");
            const tg = prompt("Target Dana (Rp):");
            if (t && tg > 0) {
                this.campaigns.push({ 
                    id: Date.now(), 
                    title: t, 
                    target: parseInt(tg), 
                    current: 0, 
                    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400" 
                });
                this.sync();
            }
        };
    }

    // Update Kampanye (Update)
    editCampaign(i) {
        const t = prompt("Edit Judul:", this.campaigns[i].title);
        const tg = prompt("Edit Target:", this.campaigns[i].target);
        if (t && tg > 0) {
            this.campaigns[i].title = t;
            this.campaigns[i].target = parseInt(tg);
            this.sync();
        }
    }

    // Hapus Data (Delete)
    deleteData(type, i) {
        if (confirm("Hapus data ini?")) {
            if (type === 'c') {
                this.campaigns.splice(i, 1);
            } else if (type === 'd') {
                const don = this.donations[i];
                const cIdx = this.campaigns.findIndex(c => c.id == don.campId);
                if (cIdx !== -1) this.campaigns[cIdx].current -= don.jumlah;
                this.donations.splice(i, 1);
            } else {
                this.volunteers.splice(i, 1);
            }
            this.sync();
        }
    }

    navigateTo(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`page-${id}`).classList.add('active');
        const activeBtn = document.querySelector(`[data-target="${id}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        this.render(); 
        window.scrollTo(0,0);
    }

    render() {
        // Tampilan Kartu di Home
        const list = document.getElementById('campaign-list');
        if (list) {
            list.innerHTML = this.campaigns.map(c => `
                <div class="card">
                    <img src="${c.img}" class="card-img">
                    <div class="card-info">
                        <h4>${c.title}</h4>
                        <div class="prog-bg"><div class="prog-bar" style="width:${Math.min((c.current/c.target)*100, 100)}%"></div></div>
                        <p style="font-size:13px">Terkumpul: <b>Rp ${c.current.toLocaleString()}</b></p>
                    </div>
                </div>
            `).join('');
        }

        // Dropdown Pilihan Kampanye
        const select = document.getElementById('d-target-camp');
        if (select) {
            select.innerHTML = '<option value="">-- Pilih Kampanye --</option>' + 
                this.campaigns.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
        }

        // Tabel Admin
        document.getElementById('admin-table').innerHTML = this.campaigns.map((c, i) => `
            <tr><td>${c.title}</td><td>Rp ${c.target.toLocaleString()}</td><td>Rp ${c.current.toLocaleString()}</td>
            <td><button onclick="app.editCampaign(${i})" style="color:blue;border:none;background:none;cursor:pointer">Edit</button>
            <button onclick="app.deleteData('c',${i})" style="color:red;border:none;background:none;cursor:pointer;margin-left:10px">Hapus</button></td></tr>`).join('');

        document.getElementById('donatur-table').innerHTML = this.donations.map((d, i) => `
            <tr><td>${d.nama}</td><td>${d.tujuan}</td><td>Rp ${d.jumlah.toLocaleString()}</td>
            <td><button onclick="app.deleteData('d',${i})" style="color:red;border:none;background:none;cursor:pointer">Hapus</button></td></tr>`).join('');

        document.getElementById('relawan-table').innerHTML = this.volunteers.map((v, i) => `
            <tr><td>${v.nama}</td><td>${v.skill}</td>
            <td><button onclick="app.deleteData('v',${i})" style="color:red;border:none;background:none;cursor:pointer">Hapus</button></td></tr>`).join('');

        // Statistik Dashboard
        document.getElementById('stat-count').innerText = this.campaigns.length;
        const totalUang = this.donations.reduce((acc, curr) => acc + curr.jumlah, 0);
        document.getElementById('stat-sum').innerText = `Rp ${totalUang.toLocaleString()}`;
    }

    sync() {
        localStorage.setItem('cu_final_camp', JSON.stringify(this.campaigns));
        localStorage.setItem('cu_final_don', JSON.stringify(this.donations));
        localStorage.setItem('cu_final_vol', JSON.stringify(this.volunteers));
        this.render();
    }
}
const app = new CareUnityApp();