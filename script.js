const MAX_ANGLE = 15;
const SPEED_FACTOR = 0.0002;
const SPIN_PROBABILITY = 0.00016;
const SPIN_DURATION_MS = 500;
const SCALE_SPEED = 0.08;

const images = document.querySelectorAll('.img1, .img2, .img3, .img4, .center-img');

const rotationData = Array.from(images).map(img => {
    return {
        element: img,
        timeOffset: Math.random() * 2 * Math.PI,
        initialRotation: parseFloat(img.dataset.initialRotation) || 0,
        isSpinning: false,
        spinStartTime: 0,
        targetScale: 1.0,
        currentScale: 1.0
    };
});

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateRotation(timestamp) {
    rotationData.forEach(item => {
        const element = item.element;
        const time = timestamp * SPEED_FACTOR + item.timeOffset;
        const deltaAngle = MAX_ANGLE * Math.sin(time);
        let finalAngle = item.initialRotation + deltaAngle;

        if (item.isSpinning) {
            const elapsed = timestamp - item.spinStartTime;
            const progress = Math.min(1, elapsed / SPIN_DURATION_MS);
            const easedProgress = easeOutCubic(progress);
            finalAngle = (item.initialRotation + deltaAngle) + (360 * easedProgress);
            if (progress >= 1) {
                item.isSpinning = false;
                item.initialRotation += 360;
            }
        } else {
            if (Math.random() < SPIN_PROBABILITY) {
                item.isSpinning = true;
                item.spinStartTime = timestamp;
            }
        }

        item.currentScale += (item.targetScale - item.currentScale) * SCALE_SPEED;
        
        element.style.transform = `rotate(${finalAngle}deg) scale(${item.currentScale})`;
    });
    requestAnimationFrame(animateRotation);
}
requestAnimationFrame(animateRotation);

const spanDamirKamsh = document.querySelector('.one'); 
const spanDamik = document.querySelector('.two');      

function resetImageStates() {
    rotationData.forEach(item => {
        item.targetScale = 1.0;
        item.element.classList.remove('highlighted', 'dimmed');
    });
}

function applyHoverEffects(element, highlightMap) {
    rotationData.forEach(item => {
        const imgClass = item.element.classList[0];
        const action = highlightMap[imgClass];
        if (action === 'highlighted') {
            item.targetScale = 1.1;
            item.element.classList.add('highlighted');
            item.element.classList.remove('dimmed');
        } else {
            item.targetScale = 0.85;
            item.element.classList.add('dimmed');
            item.element.classList.remove('highlighted');
        }
    });
    if (element) element.classList.add('wave-animate-active');
}

if (spanDamirKamsh) {
    spanDamirKamsh.addEventListener('mouseover', () => {
        applyHoverEffects(spanDamirKamsh, {img1: 'dimmed', img2: 'dimmed', img3: 'highlighted', img4: 'highlighted'});
    });
    spanDamirKamsh.addEventListener('mouseout', () => {
        resetImageStates();
        spanDamirKamsh.classList.remove('wave-animate-active');
    });
}

if (spanDamik) {
    spanDamik.addEventListener('mouseover', () => {
        applyHoverEffects(spanDamik, {img1: 'highlighted', img2: 'highlighted', img3: 'dimmed', img4: 'dimmed'});
    });
    spanDamik.addEventListener('mouseout', () => {
        resetImageStates();
        spanDamik.classList.remove('wave-animate-active');
    });
}

const fadeDuration = 400;
const allLinks = document.querySelectorAll('a');

allLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        if (this.target === '_blank') return;

        const href = this.getAttribute('href');
        const isInternalLink = href && !href.startsWith('#') && this.hostname === window.location.hostname;

        if (isInternalLink) {
            event.preventDefault();
            document.body.classList.add('page-exit');

            setTimeout(() => {
                if (this.classList.contains('cube1')) {
                    const homeTarget = (href && /home/i.test(href)) ? href : '/home.html';
                    const targetUrl = homeTarget.startsWith('/') ? window.location.origin + homeTarget : homeTarget;
                    window.location.href = targetUrl;
                } else {
                    window.location.href = href;
                }
            }, fadeDuration);
        }
    });
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.classList.remove('page-exit');
    }
});

const themeToggleBtn = document.querySelector('.moon1');

const sunIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cm">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>`;

const moonIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cm">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>`;

function applyTheme(themeName) {
    if (themeName === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggleBtn) themeToggleBtn.innerHTML = moonIconSVG;
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggleBtn) themeToggleBtn.innerHTML = sunIconSVG;
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); 
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme('dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleBtn.style.cursor = 'pointer'; 
}
