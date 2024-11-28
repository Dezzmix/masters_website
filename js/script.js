const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

// Устанавливаем размеры холста под размер видимой области
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();

let particlesArray = [];
let scrollSpeedFactor = 0.5; // Коэффициент инверсии движения

// Обработка мыши
const mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.pageX; // Учитываем координаты мыши на странице
    mouse.y = event.pageY;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1; // Случайный размер от 1 до 5 пикселей
        const grayValue = Math.floor(Math.random() * 100 + 150); // Оттенок от 150 до 250 (светло-серый)
        this.color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`; 
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 30 + 1;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    update(scrollOffset) {
        // Учитываем инвертированное смещение прокрутки
        const effectiveScrollY = -scrollOffset * scrollSpeedFactor;

        let dx = mouse.x - this.x; // Расстояние до мыши
        let dy = mouse.y - (this.y - effectiveScrollY); // Смещение с учётом инверсии
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Расчёт силы притяжения
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density * 0.2;
        let directionY = forceDirectionY * force * this.density * 0.2;

        // Если частица в зоне притяжения мыши
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Возвращение частиц на базовые координаты с учётом инверсии
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 40;
            }
            if (this.y !== this.baseY + effectiveScrollY) {
                let dy = (this.y - effectiveScrollY) - this.baseY;
                this.y -= dy / 40;
            }
        }
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 2000; // Плотность частиц
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height + window.scrollY * scrollSpeedFactor; // Учитываем начальное смещение
        particlesArray.push(new Particle(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update(window.scrollY);
    }
    requestAnimationFrame(animate);
}

init();
animate();

// Обновляем размеры холста при изменении размеров окна
window.addEventListener('resize', function() {
    setCanvasSize();
    init();
});
