class CareUnityApp {
    constructor() {
        this.ST_CAMP = 'CU_V5_FINAL_CAMP';
        this.ST_DON = 'CU_V5_FINAL_DON';
        this.ST_VOL = 'CU_V5_FINAL_VOL';

        this.initData();
        this.init();
    }

    initData() {
        if (!localStorage.getItem(this.ST_CAMP)) {
            const camp = [
                { id: 1, title: "Operasi Kanker Pak Jono", target: 50000000, current: 32000000, img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400" },
                { id: 2, title: "Nutrisi Pejuang Kanker", target: 20000000, current: 5000000, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400" }
            ];
            localStorage.setItem(this.ST_CAMP, JSON.stringify(camp));
        }
        if (!localStorage.getItem(this.ST_DON)) {
            const don = [
                { id: 101, nama: "Wayan Kopling", tujuan: "Operasi Kanker Pak Jono", jumlah: 20000000, campId: 1 },
                { id: 102, nama: "Ketut Nuklir", tujuan: "Operasi Kanker Pak Jono", jumlah: 12000000, campId: 1 },
                { id: 103, nama: "Nengah Saklar", tujuan: "Nutrisi Pejuang Kanker", jumlah: 5000000, campId: 2 }
            ];
            localStorage.setItem(this.ST_DON, JSON.stringify(don));
        }
        if (!localStorage.getItem(this.ST_VOL)) {
            const vol = [
                { id: 201, nama: "dr. Tirta", phone: "08112233445", email: "tirta@medis.com", skill: "Medis" },
                { id: 202, nama: "Leanan Sidhe", phone: "08556677889", email: "leasid@gmail.com", skill: "Sosial" },
                { id: 203, nama: "David Lopez", phone: "08129988776", email: "dapez@relawan.org", skill: "Umum" }
            ];
            localStorage.setItem(this.ST_VOL, JSON.stringify(vol));
        }
        this.load();
    }

    load() {
        this.campaigns = JSON.parse(localStorage.getItem(this.ST_CAMP));
        this.donations = JSON.parse(localStorage.getItem(this.ST_DON));
        this.volunteers = JSON.parse(localStorage.getItem(this.ST_VOL));
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(b => b.onclick = () => this.navigateTo(b.dataset.target));

        document.getElementById('form-donasi').onsubmit = (e) => {
            e.preventDefault();
            const cid = document.getElementById('d-target-camp').value;
            const nama = document.getElementById('d-nama').value;
            const jumlah = parseInt(document.getElementById('d-jumlah').value);
            const idx = this.campaigns.findIndex(c => c.id == cid);
            if (idx !== -1) {
                this.campaigns[idx].current += jumlah;
                this.donations.push({ id: Date.now(), nama, tujuan: this.campaigns[idx].title, jumlah, campId: parseInt(cid) });
                this.sync(); this.navigateTo('home'); e.target.reset();
            }
        };

        document.getElementById('form-relawan').onsubmit = (e) => {
            e.preventDefault();
            this.volunteers.push({ 
                id: Date.now(), 
                nama: document.getElementById('r-nama').value, 
                phone: document.getElementById('r-phone').value,
                email: document.getElementById('r-email').value,
                skill: document.getElementById('r-skill').value 
            });
            this.sync(); this.navigateTo('home'); e.target.reset();
        };

        document.getElementById('add-btn').onclick = () => {
            const t = prompt("Judul Kampanye:");
            const tg = prompt("Target (Rp):");
            if (t && tg) {
                this.campaigns.push({ id: Date.now(), title: t, target: parseInt(tg), current: 0, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400" });
                this.sync();
            }
        };
    }

    deleteData(type, i) {
        if (confirm("Hapus data?")) {
            if (type === 'c') this.campaigns.splice(i, 1);
            if (type === 'd') {
                const d = this.donations[i];
                const cIdx = this.campaigns.findIndex(c => c.id == d.campId);
                if (cIdx !== -1) this.campaigns[cIdx].current -= d.jumlah;
                this.donations.splice(i, 1);
            }
            if (type === 'v') this.volunteers.splice(i, 1);
            this.sync();
        }
    }

    editCampaign(i) {
        const t = prompt("Edit Judul:", this.campaigns[i].title);
        const tg = prompt("Edit Target:", this.campaigns[i].target);
        if (t && tg) {
            this.campaigns[i].title = t;
            this.campaigns[i].target = parseInt(tg);
            this.sync();
        }
    }

    navigateTo(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`page-${id}`).classList.add('active');
        document.querySelector(`[data-target="${id}"]`).classList.add('active');
        this.render();
    }

    render() {
        const list = document.getElementById('campaign-list');
        if (list) list.innerHTML = this.campaigns.map(c => `
            <div class="card">
                <img src="${c.img}" class="card-img">
                <div class="card-info">
                    <h4>${c.title}</h4>
                    <div class="prog-bg"><div class="prog-bar" style="width:${(c.current/c.target)*100}%"></div></div>
                    <p>Terkumpul: <b>Rp ${c.current.toLocaleString()}</b></p>
                </div>
            </div>`).join('');

        const sel = document.getElementById('d-target-camp');
        if (sel) sel.innerHTML = '<option value="">Pilih Kampanye</option>' + this.campaigns.map(c => `<option value="${c.id}">${c.title}</option>`).join('');

        // Admin Tables
        document.getElementById('admin-table').innerHTML = this.campaigns.map((c, i) => `
            <tr><td><b>${c.title}</b></td><td>Rp ${c.target.toLocaleString()}</td><td>Rp ${c.current.toLocaleString()}</td>
            <td><button class="btn-edit" onclick="app.editCampaign(${i})">Edit</button><button class="btn-delete" onclick="app.deleteData('c',${i})">Hapus</button></td></tr>`).join('');

        document.getElementById('donatur-table').innerHTML = this.donations.map((d, i) => `
            <tr><td><b>${d.nama}</b></td><td>${d.tujuan}</td><td>Rp ${d.jumlah.toLocaleString()}</td>
            <td><button class="btn-delete" onclick="app.deleteData('d',${i})">Hapus</button></td></tr>`).join('');

        document.getElementById('relawan-table').innerHTML = this.volunteers.map((v, i) => `
            <tr><td><b>${v.nama}</b></td><td><small>${v.phone} / ${v.email}</small></td><td><span class="badge">${v.skill}</span></td>
            <td><button class="btn-delete" onclick="app.deleteData('v',${i})">Hapus</button></td></tr>`).join('');

        document.getElementById('stat-count').innerText = this.campaigns.length;
        document.getElementById('stat-sum').innerText = `Rp ${this.donations.reduce((a,b)=>a+b.jumlah,0).toLocaleString()}`;
    }

    sync() {
        localStorage.setItem(this.ST_CAMP, JSON.stringify(this.campaigns));
        localStorage.setItem(this.ST_DON, JSON.stringify(this.donations));
        localStorage.setItem(this.ST_VOL, JSON.stringify(this.volunteers));
        this.render();
    }
}
const app = new CareUnityApp();