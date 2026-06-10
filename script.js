// Game State
let currentUser = null;
let gameScores = {
    shapes: 0,
    objects: 0,
    animals: 0,
    fruits: 0
};

const users = JSON.parse(localStorage.getItem('users')) || [];

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Authentication
function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        gameScores = user.scores || { shapes: 0, objects: 0, animals: 0, fruits: 0 };
        showPage('menuPage');
    } else {
        alert('Email atau Password salah! 😢');
    }
}

function register(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Password tidak sama! 😢');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar! 😢');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        scores: { shapes: 0, objects: 0, animals: 0, fruits: 0 }
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Daftar berhasil! Silakan login 🎉');
    toggleRegister();
}

function toggleRegister() {
    document.getElementById('loginPage').classList.toggle('hidden');
    document.getElementById('registerPage').classList.toggle('hidden');
}

function logout() {
    currentUser = null;
    gameScores = { shapes: 0, objects: 0, animals: 0, fruits: 0 };
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    showPage('loginPage');
    closeMenuOptions();
}

// Menu Functions
function toggleMenuOptions() {
    const menu = document.getElementById('menuOptions');
    menu.classList.toggle('hidden');
}

function closeMenuOptions() {
    document.getElementById('menuOptions').classList.add('hidden');
}

function backToMenu() {
    closeMenuOptions();
    showPage('menuPage');
}

function showProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    const totalScore = Object.values(gameScores).reduce((a, b) => a + b, 0);
    document.getElementById('profileScore').textContent = totalScore;
    showPage('profilePage');
    closeMenuOptions();
}

function showCredits() {
    showPage('creditsPage');
    closeMenuOptions();
}

function showItems() {
    showPage('itemsPage');
    closeMenuOptions();
}

function toggleResetPassword() {
    const newPassword = prompt('Masukkan password baru:');
    if (newPassword) {
        currentUser.password = newPassword;
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Password berhasil diubah! 🔐');
        }
    }
}

// Game Management
function startGame(gameType) {
    closeMenuOptions();
    if (gameType === 'shapes') {
        initShapesGame();
        showPage('gameShapes');
    } else if (gameType === 'objects') {
        initObjectsGame();
        showPage('gameObjects');
    } else if (gameType === 'animals') {
        initAnimalsGame();
        showPage('gameAnimals');
    } else if (gameType === 'fruits') {
        initFruitsGame();
        showPage('gameFruits');
    }
}

// GAME 1: Shapes Matching
const shapesList = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠', '⭐', '💛'];
let shapesBoard = [];
let firstCard = null;
let secondCard = null;
let canClick = true;

function initShapesGame() {
    const board = document.getElementById('shapesBoard');
    board.innerHTML = '';
    shapesBoard = [...shapesList, ...shapesList].sort(() => Math.random() - 0.5);
    
    shapesBoard.forEach((shape, index) => {
        const card = document.createElement('div');
        card.className = 'shape-card';
        card.textContent = shape;
        card.setAttribute('data-shape', shape);
        card.setAttribute('data-index', index);
        card.onclick = () => selectShape(index, card);
        board.appendChild(card);
    });
}

function selectShape(index, card) {
    if (!canClick || card.classList.contains('matched')) return;
    
    if (!firstCard) {
        firstCard = { index, card };
        card.style.opacity = '0.5';
    } else if (!secondCard && index !== firstCard.index) {
        secondCard = { index, card };
        canClick = false;
        
        if (firstCard.card.getAttribute('data-shape') === card.getAttribute('data-shape')) {
            // Match found
            setTimeout(() => {
                firstCard.card.classList.add('matched');
                secondCard.card.classList.add('matched');
                playSound('success');
                gameScores.shapes += 10;
                document.getElementById('shapesScore').textContent = gameScores.shapes;
                
                firstCard = null;
                secondCard = null;
                canClick = true;
                
                if (document.querySelectorAll('.shape-card.matched').length === shapesList.length * 2) {
                    setTimeout(() => alert(`🎉 Selesai! Total Skor: ${gameScores.shapes}`), 500);
                }
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                firstCard.card.style.opacity = '1';
                card.style.opacity = '1';
                playSound('error');
                firstCard = null;
                secondCard = null;
                canClick = true;
            }, 600);
        }
    }
}

function resetShapesGame() {
    gameScores.shapes = 0;
    document.getElementById('shapesScore').textContent = '0';
    initShapesGame();
}

// GAME 2: Objects Organization
const objectsList = ['🍎', '🍌', '🍊', '🍇', '🥕', '🥬', '🍅', '🥒'];
let objectsGame = [];

function initObjectsGame() {
    const container = document.getElementById('objectsContainer');
    container.innerHTML = '';
    
    objectsList.forEach((obj, index) => {
        const item = document.createElement('div');
        item.className = 'draggable-item';
        item.textContent = obj;
        item.draggable = true;
        item.style.left = Math.random() * 80 + '%';
        item.style.top = Math.random() * 60 + '%';
        
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.innerHTML);
        });
        
        container.appendChild(item);
    });
    
    setupBasket();
}

function setupBasket() {
    const basket = document.getElementById('basket');
    const container = document.getElementById('objectsContainer');
    
    basket.addEventListener('dragover', (e) => {
        e.preventDefault();
        basket.classList.add('full');
    });
    
    basket.addEventListener('dragleave', () => {
        basket.classList.remove('full');
    });
    
    basket.addEventListener('drop', (e) => {
        e.preventDefault();
        basket.classList.remove('full');
        
        const items = document.querySelectorAll('.draggable-item');
        const randomItem = items[Math.floor(Math.random() * items.length)];
        if (randomItem) {
            randomItem.remove();
            gameScores.objects += 12;
            document.getElementById('objectsScore').textContent = gameScores.objects;
            playSound('success');
            
            if (document.querySelectorAll('.draggable-item').length === 0) {
                setTimeout(() => alert(`🎉 Selesai! Total Skor: ${gameScores.objects}`), 500);
            }
        }
    });
}

function resetObjectsGame() {
    gameScores.objects = 0;
    document.getElementById('objectsScore').textContent = '0';
    initObjectsGame();
}

// GAME 3: Animal Guessing
const animalsList = [
    { emoji: '🐶', name: 'Anjing', sound: 'woof' },
    { emoji: '🐱', name: 'Kucing', sound: 'meow' },
    { emoji: '🐮', name: 'Sapi', sound: 'moo' },
    { emoji: '🐷', name: 'Babi', sound: 'oink' }
];
let currentAnimal = null;
let animalScore = 0;

function initAnimalsGame() {
    currentAnimal = animalsList[Math.floor(Math.random() * animalsList.length)];
    animalScore = 0;
    showAnimalChoice();
}

function showAnimalChoice() {
    const display = document.getElementById('animalDisplay');
    const choices = document.getElementById('animalChoices');
    display.textContent = '❓';
    choices.innerHTML = '';
    
    const shuffled = animalsList.sort(() => Math.random() - 0.5);
    shuffled.slice(0, 4).forEach(animal => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = animal.emoji;
        btn.onclick = () => selectAnimal(animal);
        choices.appendChild(btn);
    });
}

function selectAnimal(animal) {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (animal.name === currentAnimal.name) {
        buttons.forEach(btn => {
            if (btn.textContent === currentAnimal.emoji) {
                btn.classList.add('correct');
            }
        });
        playSound('success');
        gameScores.animals += 15;
        document.getElementById('animalsScore').textContent = gameScores.animals;
        
        setTimeout(() => {
            currentAnimal = animalsList[Math.floor(Math.random() * animalsList.length)];
            showAnimalChoice();
            buttons.forEach(btn => btn.disabled = false);
        }, 1000);
    } else {
        buttons.forEach(btn => {
            if (btn.textContent === animal.emoji) {
                btn.classList.add('wrong');
            }
        });
        playSound('error');
        
        setTimeout(() => {
            buttons.forEach(btn => btn.disabled = false);
            btn.classList.remove('wrong');
        }, 1000);
    }
}

function resetAnimalsGame() {
    gameScores.animals = 0;
    document.getElementById('animalsScore').textContent = '0';
    initAnimalsGame();
}

// GAME 4: Magic Fruits
const fruits = ['🍎', '🍌', '🍊', '🍇', '🥝', '🍓', '🍉', '🍒', '🍑', '🥝'];

function initFruitsGame() {
    const board = document.getElementById('fruitsBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        const pot = document.createElement('div');
        pot.className = 'fruit-pot';
        pot.textContent = '🪴';
        pot.onclick = () => openPot(pot);
        board.appendChild(pot);
    }
}

function openPot(pot) {
    if (pot.classList.contains('opened')) return;
    
    pot.classList.add('opened');
    const fruit = fruits[Math.floor(Math.random() * fruits.length)];
    
    const reward = document.createElement('div');
    reward.className = 'fruit-reward';
    reward.textContent = fruit;
    pot.appendChild(reward);
    
    gameScores.fruits += Math.floor(Math.random() * 20) + 10;
    document.getElementById('fruitsScore').textContent = gameScores.fruits;
    playSound('success');
    
    setTimeout(() => {
        reward.remove();
    }, 1000);
}

function resetFruitsGame() {
    gameScores.fruits = 0;
    document.getElementById('fruitsScore').textContent = '0';
    initFruitsGame();
}

// Sound Effects
function playSound(type) {
    const sounds = {
        success: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==",
        error: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg=="
    };
    
    if (sounds[type]) {
        const audio = new Audio(sounds[type]);
        audio.play().catch(() => {});
    }
}

// Sound Button for Animals
document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            if (currentAnimal) {
                const utterance = new SpeechSynthesisUtterance(currentAnimal.name);
                utterance.lang = 'id-ID';
                speechSynthesis.speak(utterance);
            }
        });
    }
});

// Save Score on Game End
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        currentUser.scores = gameScores;
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
});