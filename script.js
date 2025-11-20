// 1. НАСТРОЙКИ И ДАННЫЕ АНИМАЦИИ
const MAX_ANGLE = 15;
const SPEED_FACTOR = 0.0002;
const SPIN_PROBABILITY = 0.00016;
const SPIN_DURATION_MS = 500;
const SCALE_SPEED = 0.08;

const images = document.querySelectorAll('.img1, .img2, .img3, .img4');

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

// 2. ЦИКЛ АНИМАЦИИ (ВРАЩЕНИЕ И МАСШТАБ)
function animateRotation(timestamp) {
    rotationData.forEach(item => {
        const element = item.element;

        // Маятник
        const time = timestamp * SPEED_FACTOR + item.timeOffset;
        const deltaAngle = MAX_ANGLE * Math.sin(time);
        let finalAngle = item.initialRotation + deltaAngle;

        // Спин
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

        // Масштабирование
        item.currentScale += (item.targetScale - item.currentScale) * SCALE_SPEED;
        element.style.transform = `rotate(${finalAngle}deg) scale(${item.currentScale})`;
    });
    requestAnimationFrame(animateRotation);
}
requestAnimationFrame(animateRotation);

// 3. ЛОГИКА ХОВЕРОВ
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

// 4. НАВИГАЦИЯ И ПЕРЕХОДЫ
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
