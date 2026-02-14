let notesData = []; // data kosong awal
const JSONBIN_ID = "699044f843b1c97be97e379b"; // ganti sesuai bin-mu
const JSONBIN_KEY = "$2a$10$wE.kuL5ktb.9qVxo31iZB.4jR9HVpIRbdMVN.TWzDNwfvpjWTlC72"; // ganti dengan X-Master-Key-mu

// Elemen
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');
const notesList = document.getElementById('notesList');
const addNoteBtn = document.getElementById('addNoteBtn');
const newText = document.getElementById('newText');
const newAuthor = document.getElementById('newAuthor');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const logoutBtn = document.getElementById('logoutBtn');

// --- Login Admin ---
loginBtn.addEventListener('click', () => {
    const pass = document.getElementById('adminPassword').value;
    if(pass === "admin123") {
        loginSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        fetchNotes();
    } else {
        loginMsg.textContent = "Password salah!";
    }
});

// --- Logout ---
logoutBtn.addEventListener('click', () => {
    adminSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// --- Render Notes ---
function renderNotes() {
    notesList.innerHTML = '';
    notesData.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'note-card'; // match style card frontend
        div.innerHTML = `
            <p class="note-text">${note.text}</p>
            <div class="note-author">— ${note.author}</div>
            <button class="cta-button note-delete" onclick="deleteNote(${index})">Hapus</button>
        `;
        notesList.appendChild(div);
    });
}

// --- Tambah Note ---
addNoteBtn.addEventListener('click', () => {
    const text = newText.value.trim();
    const author = newAuthor.value.trim() || 'Anonymous';
    if (!text) return alert("Isi pesan dulu!");

    // Ambil dulu data terbaru dari JSONBin
    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    })
    .then(res => res.json())
    .then(data => {
        notesData = data.record.notes || [];
        notesData.push({ text, author }); // tambahkan note baru
        return fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_KEY
            },
            body: JSON.stringify({ notes: notesData })
        });
    })
    .then(res => res.json())
    .then(() => {
        console.log("Note berhasil ditambahkan dan sinkron dengan JSONBin");
        renderNotes(); // render ulang
        newText.value = '';
        newAuthor.value = '';
    })
    .catch(err => console.error("Gagal update JSONBin:", err));
});

// --- Hapus Note ---
function deleteNote(i) {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;

    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    })
    .then(res => res.json())
    .then(data => {
        notesData = data.record.notes || [];
        notesData.splice(i, 1); // hapus
        return fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_KEY
            },
            body: JSON.stringify({ notes: notesData })
        });
    })
    .then(res => res.json())
    .then(() => renderNotes())
    .catch(err => console.error("Gagal hapus note:", err));
}

// --- Hapus Semua ---
deleteAllBtn.addEventListener('click', () => {
    if (!confirm("Yakin ingin hapus semua pesan?")) return;

    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    })
    .then(res => res.json())
    .then(data => {
        notesData = []; // kosongkan
        return fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_KEY
            },
            body: JSON.stringify({ notes: notesData })
        });
    })
    .then(res => res.json())
    .then(() => renderNotes())
    .catch(err => console.error("Gagal hapus semua:", err));
});

// --- Update JSONBin ---
function updateNotes() {
    renderNotes();
    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_KEY
        },
        body: JSON.stringify({notes: notesData})
    }).then(res => res.json())
    .then(()=>console.log("Data disimpan di JSONBin"))
    .catch(err=>console.error(err));
}

// --- Ambil data dari JSONBin ---
function fetchNotes() {
    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    }).then(res=>res.json())
    .then(data=>{
        notesData = data.record.notes || [];
        renderNotes();
    }).catch(err=>{
        console.error(err);
        alert("Gagal mengambil data dari JSONBin. Coba periksa API Key atau Bin ID.");
    });
}
