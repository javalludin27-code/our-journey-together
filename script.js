// Gunakan localStorage jika ada, kalau nggak pakai default dari file
let notesData = JSON.parse(localStorage.getItem('notesData')) || [    
    {
        text: "Bersamamu, setiap hari adalah petualangan baru. Terima kasih telah menjadi alasan senyumku dan membuat hidup ini lebih bermakna.",
        author: "Your Love"
    },
    {
        text: "Dalam keheningan malam atau keriuhan hari, hatimu adalah rumah ternyaman bagiku. Aku bersyukur untuk setiap momen bersamamu.",
        author: "Forever Yours"
    }
];

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

// Render awal
renderNotes();

// Modal handling
export function openModal() {
    document.getElementById('noteModal').style.display = 'flex';
}

export function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
    document.getElementById('noteText').value = '';
    document.getElementById('noteAuthor').value = '';
}

export function saveNote() {
    const text = document.getElementById('noteText').value.trim();
    const author = document.getElementById('noteAuthor').value.trim() || 'Anonymous';
    if (!text) return alert('Tulis pesan dulu!');

    notesData.push({ text, author });
    localStorage.setItem('notesData', JSON.stringify(notesData));
    renderNotes();
    closeModal();
}

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Counter - tanggal hubungan kalian
const startDate = new Date('2007-04-14T00:00:00');

function updateCounter() {
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    // Koreksi jika ada nilai negatif
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Dapatkan jumlah hari di bulan sebelumnya
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    // Update HTML
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Counter tetap update setiap detik
updateCounter();
setInterval(updateCounter, 1000); // ini cuma untuk counter, tidak menyentuh navbar

// Track scroll direction
let lastScrollY = window.scrollY;
let scrollDirection = 'down';
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    scrollDirection = (y > lastScrollY) ? 'down' : 'up';
    lastScrollY = y;
}, { passive: true });

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.timeline-item, .gallery-item, .note-card').forEach(el => {
    observer.observe(el);
});


// Close modal on outside click
document.getElementById('noteModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Hamburger toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu saat klik link
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});

// Navbar active
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
        const activeLink = document.querySelector(
            `nav a[href="#${currentSection.id}"]`
        );
        if (activeLink) activeLink.classList.add("active");
    }
}

// Jalankan navbar active saat scroll, resize, dan load
window.addEventListener("scroll", () => requestAnimationFrame(setActiveLink));
window.addEventListener("resize", setActiveLink);
window.addEventListener("load", setActiveLink);

// Ambil tombol dan modal buttons
const addNoteButton = document.getElementById('addNoteButton');
const cancelButton = document.querySelector('.btn-cancel');
const saveButton = document.querySelector('.btn-save');

// Tambahkan event listener
addNoteButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);
saveButton.addEventListener('click', saveNote);
