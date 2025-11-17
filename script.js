// --- 1. НАСТРОЙКИ АНИМАЦИИ ---

// pendulum
const MAX_ANGLE = 15;     
const SPEED_FACTOR = 0.0002; 

const SPIN_PROBABILITY = 0.00016; // Frequency
const SPIN_DURATION_MS = 500;   
const SCALE_SPEED = 0.080; // Animation speed

// --- 2. ПОДГОТОВКА ДАННЫХ ---

const images = document.querySelectorAll('.img1, .img2, .img3, .img4');

const rotationData = Array.from(images).map(img => {
    return {
        element: img,
        timeOffset: Math.random() * 2 * Math.PI, 
        initialRotation: parseFloat(img.dataset.initialRotation) || 0,
        
        isSpinning: false,
        spinStartTime: 0,
        
        // НОВЫЕ СВОЙСТВА для масштабирования
        targetScale: 1.0,  // Целевой размер
        currentScale: 1.0  // Текущий размер (для плавной анимации)
    };
});

// Функция плавности (ease out)
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// --- 3. ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ ---

function animateRotation(timestamp) {
    rotationData.forEach(item => {
        const element = item.element;
        
        // --- Логика маятника (всегда работает) ---
        const time = timestamp * SPEED_FACTOR + item.timeOffset;
        const deltaAngle = MAX_ANGLE * Math.sin(time);
        let pendulumAngle = item.initialRotation + deltaAngle;

        let finalAngle = pendulumAngle; // Итоговый угол

        // --- Логика 360-Спина (если активен) ---
        if (item.isSpinning) {
            const elapsed = timestamp - item.spinStartTime;
            const progress = Math.min(1, elapsed / SPIN_DURATION_MS);
            const easedProgress = easeOutCubic(progress);
            
            finalAngle = pendulumAngle + (360 * easedProgress);

            if (progress >= 1) {
                item.isSpinning = false;
                item.initialRotation += 360; 
            }
        } else {
            // Триггер Спина (только если не вращается)
            if (Math.random() < SPIN_PROBABILITY) {
                item.isSpinning = true;
                item.spinStartTime = timestamp;
            }
        }
        
        // --- НОВАЯ ЛОГИКА: Плавное масштабирование (Lerp) ---
        // item.currentScale плавно "догоняет" item.targetScale
        item.currentScale += (item.targetScale - item.currentScale) * SCALE_SPEED;

        // --- 4. ПРИМЕНЯЕМ ВСЕ ТРАНСФОРМАЦИИ ---
        element.style.transform = `rotate(${finalAngle}deg) scale(${item.currentScale})`;
    });

    requestAnimationFrame(animateRotation);
}

// Launch
requestAnimationFrame(animateRotation);


// Event Listeners
const spanDamirKamsh = document.querySelector('.one'); 
const spanDamik = document.querySelector('.two');      
const allImages = {
    img1: rotationData.find(item => item.element.classList.contains('img1')),
    img2: rotationData.find(item => item.element.classList.contains('img2')),
    img3: rotationData.find(item => item.element.classList.contains('img3')),
    img4: rotationData.find(item => item.element.classList.contains('img4'))
};

// "DAMIR KAMSHYBEK" (.one) 
spanDamirKamsh.addEventListener('mouseover', () => {
    // 3 and 4
    allImages.img3.targetScale = 1.1;
    allImages.img4.targetScale = 1.1;
    allImages.img3.element.classList.add('highlighted');
    allImages.img4.element.classList.add('highlighted');

    // 1 and 2 shadow
    allImages.img1.targetScale = 0.85;
    allImages.img2.targetScale = 0.85;
    allImages.img1.element.classList.add('dimmed');
    allImages.img2.element.classList.add('dimmed');

    spanDamirKamsh.classList.add('wave-animate-active');
});

spanDamirKamsh.addEventListener('mouseout', () => {
    // reset
    rotationData.forEach(item => {
        item.targetScale = 1.0;
        item.element.classList.remove('highlighted', 'dimmed');
    });
    spanDamirKamsh.classList.remove('wave-animate-active');
});

// "DAMIK" (.two) 
spanDamik.addEventListener('mouseover', () => {
    // 1 and 2 
    allImages.img1.targetScale = 1.1;
    allImages.img2.targetScale = 1.1;
    allImages.img1.element.classList.add('highlighted');
    allImages.img2.element.classList.add('highlighted');

    // 3 and 4 Shadow
    allImages.img3.targetScale = 0.85;
    allImages.img4.targetScale = 0.85;
    allImages.img3.element.classList.add('dimmed');
    allImages.img4.element.classList.add('dimmed');

    spanDamik.classList.add('wave-animate-active');
});

spanDamik.addEventListener('mouseout', () => {
    // reset
    rotationData.forEach(item => {
        item.targetScale = 1.0;
        item.element.classList.remove('highlighted', 'dimmed');
    });
    spanDamik.classList.remove('wave-animate-active');
});

const animationDuration = 400; // 400ms (должно совпадать с 0.4s в CSS)

// 2. Находим все ссылки на странице
const links = document.querySelectorAll('a');

links.forEach(link => {
    link.addEventListener('click', function(event) {
        const href = this.href; // Куда ведет ссылка
        
        // 3. Проверяем, что это НЕ внешняя ссылка и НЕ якорь (#)
        if (this.hostname === window.location.hostname && 
            href.indexOf('#') === -1 && 
            this.target !== '_blank') 
        {
            // 4. Перехватываем стандартное поведение
            event.preventDefault(); 
            
            // 5. Запускаем анимацию ИСЧЕЗАНИЯ
            document.body.classList.add('page-exit');
            
            // 6. Ждем завершения анимации (400ms)
            setTimeout(() => {
                // 7. Переходим на новую страницу
                window.location.href = href; 
            }, animationDuration);
        }
        // (Если это внешняя ссылка или якорь, она сработает как обычно)
    });
});