// ============================================
// TV SCREEN PROJECT DESCRIPTIONS
// ============================================
const tvScreen = document.getElementById('tv-screen');
const projectLinks = document.querySelectorAll('a[data-image]');

projectLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const imagePath = link.getAttribute('data-image');
        if (imagePath) {
            // Define a imagem de fundo da TV screen
            tvScreen.style.backgroundImage = `url(${imagePath})`;
            tvScreen.classList.add('active');
        }
    });

    link.addEventListener('mouseleave', () => {
        tvScreen.classList.remove('active');
        // Limpa a imagem de fundo ao sair para a transição funcionar
        tvScreen.style.backgroundImage = 'none';
    });
});

// ============================================
// TUNNEL SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const mainTitle = document.querySelector('.mainTitle');
    const presentationSection = document.querySelector('.presentation');
    const contentWrappers = document.querySelectorAll('.textProjectsDiv, .content-wrapper');

    // Hero title tunnel effect
    if (mainTitle && presentationSection) {
        const sectionHeight = presentationSection.offsetHeight;
        const scrollFraction = scrollY / sectionHeight;

        const scale = Math.max(0.2, 1 - scrollFraction * 0.8);
        const opacity = Math.max(0.1, 1 - scrollFraction * 0.9);

        mainTitle.style.transform = `scale(${scale})`;
        mainTitle.style.opacity = `${opacity}`;
    }

    // Content wrappers 3D effect
    contentWrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const progress = 1 - Math.max(0, Math.min(1, rect.top / windowHeight));

        if (progress > 0) {
            const scale = 1 - progress * 0.1;
            const translateX = progress * 5;
            wrapper.style.transform = `translateX(${translateX}%) scale(${scale})`;
        }
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #66fcea, #a855f7);
    z-index: 10000;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ============================================
// TYPING EFFECT
// ============================================
const creativeText = document.getElementById('creativeDev');
const text = 'Desenvolvedor Web Full Stack & Blockchain ';
let index = 0;

function typeWriter() {
    if (index < text.length) {
        creativeText.textContent = text.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 50);
    }
}

window.addEventListener('load', () => {
    creativeText.textContent = '';
    setTimeout(typeWriter, 1000);
});