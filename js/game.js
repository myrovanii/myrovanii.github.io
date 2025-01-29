// Инициализация Telegram
if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.MainButton.hide();
}

// Системные переменные
let selectedRace = 1;
let selectedClass = null;
const assetsBase = './assets/images/races';

// Ресурсы для загрузки
const assetsToLoad = [
    './assets/images/loading-bg.jpg',
    `${assetsBase}/race1/class1.png`,
    `${assetsBase}/race1/class2.png`,
    `${assetsBase}/race1/class3.png`,
    `${assetsBase}/race1/class4.png`,
    './assets/images/loading-bg.jpg',
    `${assetsBase}/race2/class1.png`,
    `${assetsBase}/race2/class2.png`,
    `${assetsBase}/race2/class3.png`,
    `${assetsBase}/race2/class4.png`,
    './assets/images/loading-bg.jpg',
    `${assetsBase}/race3/class1.png`,
    `${assetsBase}/race3/class2.png`,
    `${assetsBase}/race3/class3.png`,
    `${assetsBase}/race3/class4.png`,
];

// Загрузка ресурсов
async function loadResources() {
    let loaded = 0;
    const updateProgress = () => {
        loaded++;
        const percent = Math.floor((loaded / assetsToLoad.length) * 100);
        document.querySelector('.progress').style.width = `${percent}%`;
        document.querySelector('.percentage').textContent = `${percent}%`;
    };

    await Promise.all(assetsToLoad.map(url => 
        new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                updateProgress();
                resolve();
            };
            img.onerror = resolve;
        })
    ));

    document.getElementById('loading-screen').classList.remove('active');
    document.getElementById('character-screen').classList.add('active');
}

// Генерация классов
function generateClasses(race) {
    const grid = document.querySelector('.class-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const classItem = document.createElement('div');
        classItem.className = 'class-item';
        classItem.innerHTML = `
            <img src="${assetsBase}/race${race}/class${i}.png" alt="Класс ${i}">
            <div>Класс ${i}</div>
        `;

        classItem.addEventListener('click', () => {
            document.querySelectorAll('.class-item').forEach(item => 
                item.classList.remove('selected')
            );
            classItem.classList.add('selected');
            selectedClass = i;
            document.getElementById('confirm-btn').disabled = false;
        });

        grid.appendChild(classItem);
    }
}

// Смена расы
document.querySelectorAll('.race-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const race = parseInt(btn.dataset.race);
        document.querySelectorAll('.race-btn').forEach(b => 
            b.classList.remove('active')
        );
        btn.classList.add('active');
        selectedRace = race;
        selectedClass = null;
        document.getElementById('confirm-btn').disabled = true;
        generateClasses(race);
    });
});

// Подтверждение выбора
document.getElementById('confirm-btn').addEventListener('click', () => {
    const data = { race: selectedRace, class: selectedClass };
    if (window.Telegram?.WebApp?.sendData) {
        Telegram.WebApp.sendData(JSON.stringify(data));
    } else {
        alert(`Выбрано: Раса ${data.race}, Класс ${data.class}`);
    }
});

// Старт
loadResources().catch(console.error);