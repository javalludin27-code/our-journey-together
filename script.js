// ===== index.html JS =====
let notesData = []; // kosong dulu

const JSONBIN_ID = "699044f843b1c97be97e379b"; 
const JSONBIN_KEY = "$2a$10$wE.kuL5ktb.9qVxo31iZB.4jR9HVpIRbdMVN.TWzDNwfvpjWTlC72";

// Ambil notes dari JSONBin saat halaman load
function fetchNotesFromDB() {
    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    })
    .then(res => res.json())
    .then(data => {
        notesData = data.record.notes || [];
        renderNotes();
    })
    .catch(err => {
        console.error("Gagal fetch notes:", err);
        // fallback: tampilkan array default
        notesData = [
            {
                text: "Bersamamu, setiap hari adalah petualangan baru...",
                author: "Your Love"
            },
            {
                text: "Dalam keheningan malam atau keriuhan hari...",
                author: "Forever Yours"
            }
        ];
        renderNotes();
    });
}

// Render notes ke grid
function renderNotes() {
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = '';
    notesData.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card visible';
        card.innerHTML = `
            <p class="note-text">${note.text}</p>
            <div class="note-author">— ${note.author}</div>
        `;
        grid.appendChild(card);
    });
}

// Modal handling
function openModal() {
    document.getElementById('noteModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
    document.getElementById('noteText').value = '';
    document.getElementById('noteAuthor').value = '';
}

// Save note baru
function saveNote() {
    const text = document.getElementById('noteText').value.trim();
    const author = document.getElementById('noteAuthor').value.trim() || 'Anonymous';
    if (!text) return alert('Tulis pesan dulu!');

    notesData.push({ text, author });

    // PUT ke JSONBin
    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_KEY
        },
        body: JSON.stringify({ notes: notesData })
    })
    .then(res => res.json())
    .then(() => {
        // Ambil ulang dari JSONBin supaya sinkron dengan admin panel
        return fetchNotesFromDB();
    })
    .catch(err => console.error("Gagal sync JSONBin:", err));

    closeModal();
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
    fetchNotesFromDB();

    // Event listener modal
    document.getElementById('addNoteButton').addEventListener('click', openModal);
    document.querySelector('.btn-cancel').addEventListener('click', closeModal);
    document.querySelector('.btn-save').addEventListener('click', saveNote);

    // Close modal on outside click
    document.getElementById('noteModal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
});
