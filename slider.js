// EASILY CUSTOMIZABLE DATA
const heroData = [
    { title: "ARCHITECTURAL FLOW", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR39kOBIH7p5o62i2Pk1RECNj90QjTqKJ6aR5-jtes49Y-oJbArM8m7gYHv6M6P9HQ6rdWDs7VUhZ5FKzTbSIT08aKbEZsAnpiZRCTMu2btVh8OSNqO97ZOFsIv1JLhNsRSGuKbYre2lAu4NkDVbAhJ2272dAmXFJ0WhWQ3JGdtS4plD77Dg40mYDl/w486-h486/2021-02-09.png" },
    { title: "NATURE BEYOND", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500" },
    { title: "DUSK HORIZON", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500" },
    { title: "resin.cosmos", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500" }

];

const slider = document.getElementById('split-slider');
const dots = document.getElementById('indicator-container');
let currentIdx = 0;

function setup() {
    heroData.forEach((item, i) => {
        // Build Slide
        const s = document.createElement('div');
        s.className = `slide ${i === 0 ? 'active' : ''}`;
        s.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${item.img})`;
        s.innerHTML = `<div class="slide-content"><h1>${item.title}</h1></div>`;
        slider.appendChild(s);

        // Build Dot
        const d = document.createElement('div');
        d.className = `dot ${i === 0 ? 'active' : ''}`;
        d.onclick = () => goTo(i);
        dots.appendChild(d);
    });
}

function goTo(index) {
    if (index === currentIdx) return;
    
    const allSlides = document.querySelectorAll('.slide');
    const allDots = document.querySelectorAll('.dot');

    // Remove active from current
    allSlides[currentIdx].classList.remove('active');
    allDots[currentIdx].classList.remove('active');

    // Add active to new
    currentIdx = index;
    allSlides[currentIdx].classList.add('active');
    allDots[currentIdx].classList.add('active');
}

// TOUCH SWIPE FOR MOBILE
let xStart = 0;
slider.addEventListener('touchstart', e => xStart = e.touches[0].clientX);
slider.addEventListener('touchend', e => {
    let xDiff = xStart - e.changedTouches[0].clientX;
    if (Math.abs(xDiff) > 50) {
        let n = xDiff > 0 ? currentIdx + 1 : currentIdx - 1;
        if (n >= heroData.length) n = 0;
        if (n < 0) n = heroData.length - 1;
        goTo(n);
    }
});


setup();
