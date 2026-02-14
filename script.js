// ======================== Notes & JSONBin ========================
let notesData = []; // data kosong awal

const JSONBIN_ID = "699044f843b1c97be97e379b"; 
const JSONBIN_KEY = "$2a$10$wE.kuL5ktb.9qVxo31iZB.4jR9HVpIRbdMVN.TWzDNwfvpjWTlC72";

// Fetch notes dari JSONBin saat load
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
        notesData = [
            { text: "Bersamamu, setiap hari adalah petualangan baru...", author: "Your Love" },
            { text: "Dalam keheningan malam atau keriuhan hari...", author: "Forever Yours" }
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
        card.className = 'note-card'; // jangan langsung visible
        card.innerHTML = `
            <p class="note-text">${note.text}</p>
            <div class="note-author">— ${note.author}</div>
        `;
        grid.appendChild(card);

        // biarkan observer yang menambahkan .visible
        observer.observe(card);

        card.innerHTML = `
            <p class="note-text">${note.text}</p>
            <div class="note-author">— ${note.author}</div>
        `;
        grid.appendChild(card);
    });
}

// Modal handling
function openModal() { document.getElementById('noteModal').style.display = 'flex'; }
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

    fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY },
        body: JSON.stringify({ notes: notesData })
    })
    .then(res => res.json())
    .then(() => fetchNotesFromDB())
    .catch(err => console.error("Gagal sync JSONBin:", err));

    closeModal();
}

// ======================== Navbar & Scroll ========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
document.querySelectorAll("nav a").forEach(link => link.addEventListener("click", () => navMenu.classList.remove("active")));

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Navbar active highlight
function setActiveLink() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("section[id]");
    const navHeight = navbar.offsetHeight;

    let currentSection = null;
    let closestDistance = Infinity;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom > navHeight) {
            const distance = Math.abs(rect.top - navHeight);
            if (distance < closestDistance) {
                closestDistance = distance;
                currentSection = section;
            }
        }
    });

    navLinks.forEach(link => link.classList.remove("active"));
    if (currentSection) {
        const activeLink = document.querySelector(`nav a[href="#${currentSection.id}"]`);
        if (activeLink) activeLink.classList.add("active");
    }
}

window.addEventListener("scroll", () => requestAnimationFrame(setActiveLink));
window.addEventListener("resize", setActiveLink);
window.addEventListener("load", setActiveLink);

// ======================== Counter ========================
const startDate = new Date('2007-04-14T00:00:00');

function updateCounter() {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth; months--;
    }
    if (months < 0) { months += 12; years--; }

    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);

// ======================== Intersection Observer ========================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
        else entry.target.classList.remove('visible');
    });
}, observerOptions);

document.querySelectorAll('.timeline-item, .gallery-item, .note-card').forEach(el => observer.observe(el));

// ======================== DOMContentLoaded ========================
document.addEventListener('DOMContentLoaded', () => {
    fetchNotesFromDB();

    document.getElementById('addNoteButton').addEventListener('click', openModal);
    document.querySelector('.btn-cancel').addEventListener('click', closeModal);
    document.querySelector('.btn-save').addEventListener('click', saveNote);

    document.getElementById('noteModal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });
});
