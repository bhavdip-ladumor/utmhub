const heroData = [
    { title: "ONE STOP SOLUTION", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1500" },
    { title: "INDUSTRIAL EXCELLENCE", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500" },
    { title: "CREATIVE ARTISTRY", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500" }
];

const slider = document.getElementById('split-slider');
const dotsContainer = document.getElementById('indicator-container');
let currentIdx = 0;
let autoPlayTimer; // Variable to hold the timer

function setup() {
    if(!slider) return;

    heroData.forEach((item, i) => {
        // Build Slide
        const s = document.createElement('div');
        s.className = `slide ${i === 0 ? 'active' : ''}`;
        s.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${item.img}')`;
        s.innerHTML = `<div class="slide-content"><h1>${item.title}</h1></div>`;
        slider.appendChild(s);

        // Build Dot
        const d = document.createElement('div');
        d.className = `dot ${i === 0 ? 'active' : ''}`;
        d.onclick = () => {
            goTo(i);
            resetTimer(); // Reset timer on click
        };
        dotsContainer.appendChild(d);
    });

    startTimer(); // Start the 3-second cycle
}

function goTo(index) {
    const allSlides = document.querySelectorAll('.slide');
    const allDots = document.querySelectorAll('.dot');

    // Remove active from current
    allSlides[currentIdx].classList.remove('active');
    allDots[currentIdx].classList.remove('active');

    // Update index
    currentIdx = index;
    if (currentIdx >= heroData.length) currentIdx = 0;
    if (currentIdx < 0) currentIdx = heroData.length - 1;

    // Add active to new
    allSlides[currentIdx].classList.add('active');
    allDots[currentIdx].classList.add('active');
}

// --- TIMER LOGIC ---
function startTimer() {
    autoPlayTimer = setInterval(() => {
        goTo(currentIdx + 1);
    }, 3000); // 3000ms = 3 seconds
}

function resetTimer() {
    clearInterval(autoPlayTimer);
    startTimer();
}

// --- SWIPE LOGIC ---
let xStart = 0;
slider.addEventListener('touchstart', e => xStart = e.touches[0].clientX);
slider.addEventListener('touchend', e => {
    let xDiff = xStart - e.changedTouches[0].clientX;
    if (Math.abs(xDiff) > 50) {
        goTo(xDiff > 0 ? currentIdx + 1 : currentIdx - 1);
        resetTimer();
    }
});

setup();
