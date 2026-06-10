// ===== GLOBAL STATE =====
let currentUser = null;
let loginType = 'player'; // 'player' atau 'admin'
let gameScores = {
    shapes: 0,
    objects: 0,
    animals: 0,
    fruits: 0
};

// Initialize data
let users = JSON.parse(localStorage.getItem('users')) || [];
let items = JSON.parse(localStorage.getItem('items')) || getDefaultItems();
let exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];

// Default admin untuk testing
const ADMIN_EMAIL = 'admin@babygamefun.com';
const ADMIN_PASSWORD = 'admin123';

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ===== LOGIN AUTHENTICATION =====
function switchLoginTab(type) {
    loginType = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (type === 'player') {
        document.getElementById('playerRegisterLink').style.display = 'block';
        document.getElementById('adminRegisterLink').style.display = 'none';
    } else {
        document.getElementById('playerRegisterLink').style.display = 'none';
        document.getElementById('adminRegisterLink').style.display = 'block';
    }
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (loginType === 'admin') {
        // Admin login
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            currentUser = { email: ADMIN_EMAIL, isAdmin: true };
            loadAdminDashboard();
            showPage('adminDashboard');
        } else {
            alert('Email atau Password Admin salah! 😢');
        }
    } else {
        // Player login
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            gameScores = user.scores || { shapes: 0, objects: 0, animals: 0, fruits: 0 };
            
            // Add login bonus
            const today = new Date().toDateString();
            if (user.lastLoginDate !== today) {
                user.totalCredit = (user.totalCredit || 0) + 10000;
                user.lastLoginDate = today;
            }
            
            saveUsers();
            showPage('menuPage');
        } else {
            alert('Email atau Password salah! 😢');
        }
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
        scores: { shapes: 0, objects: 0, animals: 0, fruits: 0 },
        totalCredit: 0,
        cartItems: [],
        exchangeHistory: [],
        lastLoginDate: new Date().toDateString()
    };
    
    users.push(newUser);
    saveUsers();
    alert('Daftar berhasil! Silakan login 🎉');
    toggleRegister();
}

function toggleRegister() {
    document.getElementById('loginPage').classList.toggle('hidden');
    document.getElementById('registerPage').classList.toggle('hidden');
}

function logout() {
    if (currentUser) {
        saveCurrentUser();
    }
    currentUser = null;
    loginType = 'player';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn').classList.add('active');
    showPage('loginPage');
    closeMenuOptions();
}

function logoutAdmin() {
    currentUser = null;
    loginType = 'player';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    showPage('loginPage');
}

// ===== MENU FUNCTIONS =====
function toggleMenuOptions() {
    const menu = document.getElementById('menuOptions');
    menu.classList.toggle('hidden');
}

function closeMenuOptions() {
    document.getElementById('menuOptions').classList.add('hidden');
}

function backToMenu() {
    saveCurrentUser();
    closeMenuOptions();
    showPage('menuPage');
}

function showProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    const totalScore = Object.values(gameScores).reduce((a, b) => a + b, 0);
    document.getElementById('profileScore').textContent = totalScore;
    const today = new Date().toDateString();
    const bonus = currentUser.lastLoginDate === today ? '0' : '10.000';
    document.getElementById('loginBonus').textContent = bonus;
    showPage('profilePage');
    closeMenuOptions();
}

function showCredits() {
    loadShopItems();
    showPage('creditsPage');
    closeMenuOptions();
}

function showItems() {
    loadCartItems();
    showPage('itemsPage');
    closeMenuOptions();
}

function toggleResetPassword() {
    const newPassword = prompt('Masukkan password baru:');
    if (newPassword) {
        currentUser.password = newPassword;
        saveUsers();
        alert('Password berhasil diubah! 🔐');
    }
}

// ===== ADMIN FUNCTIONS =====
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tab === 'players') {
        loadPlayersList();
    } else if (tab === 'items') {
        loadItemsManagement();
    } else if (tab === 'exchanges') {
        loadExchangesList();
    }
}

function loadAdminDashboard() {
    document.getElementById('totalPlayers').textContent = users.length;
    document.getElementById('totalItems').textContent = items.length;
}

function loadPlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    
    users.forEach(user => {
        const totalScore = Object.values(user.scores || {}).reduce((a, b) => a + b, 0);
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-info">
                <h3>👶 ${user.name}</h3>
                <p>📧 ${user.email}</p>
                <p>⭐ Total Score: ${totalScore}</p>
                <p>💰 Kredit: ${user.totalCredit || 0}</p>
                <p>🛒 Cart Items: ${(user.cartItems || []).length}</p>
            </div>
            <button onclick="showPlayerDetail(${user.id})" class="btn-view-detail">👁 Lihat Detail</button>
        `;
        list.appendChild(card);
    });
}

function showPlayerDetail(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const totalScore = Object.values(user.scores || {}).reduce((a, b) => a + b, 0);
    const content = document.getElementById('playerDetailContent');
    
    let cartItemsHtml = '';
    if (user.cartItems && user.cartItems.length > 0) {
        user.cartItems.forEach(cartItem => {
            const item = items.find(i => i.id === cartItem.id);
            if (item) {
                cartItemsHtml += `<div class="cart-item-detail">🎁 ${item.name} - 💰 ${item.price}</div>`;
            }
        });
    } else {
        cartItemsHtml = '<p>Keranjang kosong</p>';
    }
    
    content.innerHTML = `
        <div class="player-detail-info">
            <p><strong>Nama:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Total Score:</strong> ${totalScore}</p>
            <p><strong>Total Kredit:</strong> ${user.totalCredit || 0}</p>
            <h4>📦 Items di Keranjang:</h4>
            <div class="cart-items-detail">${cartItemsHtml}</div>
        </div>
    `;
    
    document.getElementById('playerDetailModal').classList.remove('hidden');
}

function closePlayerDetail() {
    document.getElementById('playerDetailModal').classList.add('hidden');
}

function addNewItem() {
    const name = document.getElementById('itemName').value.trim();
    const price = parseInt(document.getElementById('itemPrice').value);
    const stock = parseInt(document.getElementById('itemStock').value);
    
    if (!name || !price || !stock) {
        alert('Semua field harus diisi!');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        name: name,
        price: price,
        stock: stock,
        createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    saveItems();
    
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemStock').value = '';
    
    alert('Item berhasil ditambahkan! ✅');
    loadItemsManagement();
}

function loadItemsManagement() {
    const list = document.getElementById('itemsManagementList');
    list.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-management-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>🎁 ${item.name}</h4>
                <p>💰 Harga: ${item.price} skor kredit</p>
                <p>📊 Stok: ${item.stock}</p>
            </div>
            <div class="item-actions">
                <input type="number" id="stock_${item.id}" value="${item.stock}" placeholder="Stok baru" min="0">
                <button onclick="updateItemStock(${item.id})" class="btn-update-stock">📝 Update</button>
                <button onclick="deleteItem(${item.id})" class="btn-delete-item">🗑 Hapus</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function updateItemStock(itemId) {
    const newStock = parseInt(document.getElementById('stock_' + itemId).value);
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        item.stock = newStock;
        saveItems();
        
        // Update stok di keranjang semua player
        updatePlayersCreditAfterStockChange();
        
        alert('Stok berhasil diupdate! ✅');
        loadItemsManagement();
    }
}

function deleteItem(itemId) {
    if (confirm('Yakin ingin menghapus item ini?')) {
        items = items.filter(i => i.id !== itemId);
        saveItems();
        alert('Item berhasil dihapus!');
        loadItemsManagement();
    }
}

function loadExchangesList() {
    const list = document.getElementById('exchangesList');
    list.innerHTML = '';
    
    if (exchanges.length === 0) {
        list.innerHTML = '<p>Belum ada riwayat penukaran</p>';
        return;
    }
    
    exchanges.forEach(exchange => {
        const user = users.find(u => u.id === exchange.userId);
        const item = items.find(i => i.id === exchange.itemId);
        
        const card = document.createElement('div');
        card.className = 'exchange-card';
        card.innerHTML = `
            <div class="exchange-info">
                <p><strong>👤 Player:</strong> ${user?.name || 'Unknown'}</p>
                <p><strong>🎁 Item:</strong> ${item?.name || 'Unknown'}</p>
                <p><strong>💰 Harga:</strong> ${item?.price || 0} skor kredit</p>
                <p><strong>📅 Tanggal:</strong> ${new Date(exchange.date).toLocaleString('id-ID')}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

// ===== GAME FUNCTIONS =====
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
            setTimeout(() => {
                firstCard.card.classList.add('matched');
                secondCard.card.classList.add('matched');
                playSound('success');
                gameScores.shapes += 10;
                document.getElementById('shapesScore').textContent = gameScores.shapes;
                
                // Add credit
                currentUser.totalCredit = (currentUser.totalCredit || 0) + 10;
                
                firstCard = null;
                secondCard = null;
                canClick = true;
                
                if (document.querySelectorAll('.shape-card.matched').length === shapesList.length * 2) {
                    setTimeout(() => alert(`🎉 Selesai! Total Skor: ${gameScores.shapes}`), 500);
                }
            }, 600);
        } else {
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
            currentUser.totalCredit = (currentUser.totalCredit || 0) + 12;
            
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

function initAnimalsGame() {
    currentAnimal = animalsList[Math.floor(Math.random() * animalsList.length)];
    showAnimalChoice();
}

function showAnimalChoice() {
    const display = document.getElementById('animalDisplay');
    const choices = document.getElementById('animalChoices');
    display.textContent = '❓';
    choices.innerHTML = '';
    
    const shuffled = [...animalsList].sort(() => Math.random() - 0.5);
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
        currentUser.totalCredit = (currentUser.totalCredit || 0) + 15;
        
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
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('wrong');
            });
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
    const points = Math.floor(Math.random() * 20) + 10;
    
    const reward = document.createElement('div');
    reward.className = 'fruit-reward';
    reward.textContent = fruit;
    pot.appendChild(reward);
    
    gameScores.fruits += points;
    document.getElementById('fruitsScore').textContent = gameScores.fruits;
    playSound('success');
    currentUser.totalCredit = (currentUser.totalCredit || 0) + points;
    
    setTimeout(() => {
        reward.remove();
    }, 1000);
}

function resetFruitsGame() {
    gameScores.fruits = 0;
    document.getElementById('fruitsScore').textContent = '0';
    initFruitsGame();
}

// ===== SHOP & CART FUNCTIONS =====
function getDefaultItems() {
    return [
        { id: 1, name: 'Es Krim', price: 20000, stock: 5 },
        { id: 2, name: 'Snack Taro', price: 15000, stock: 5 },
        { id: 3, name: 'Silverqueen', price: 50000, stock: 2 },
        { id: 4, name: 'Uang 5 ribu', price: 55000, stock: 2 },
        { id: 5, name: 'Uang 10 ribu', price: 120000, stock: 1 },
        { id: 6, name: 'Uang 20 ribu', price: 300000, stock: 1 },
        { id: 7, name: 'Uang 50 ribu', price: 1000000, stock: 1 }
    ];
}

function loadShopItems() {
    const shop = document.getElementById('shopItems');
    shop.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        card.innerHTML = `
            <h4>🎁 ${item.name}</h4>
            <p>💰 Harga: ${item.price.toLocaleString('id-ID')} skor kredit</p>
            <p>📊 Stok: ${item.stock}</p>
            <button onclick="addToCart(${item.id})" class="btn-add-cart" ${item.stock === 0 ? 'disabled' : ''}>
                ${item.stock === 0 ? '❌ Habis' : '🛒 Tambah ke Keranjang'}
            </button>
        `;
        shop.appendChild(card);
    });
}

function addToCart(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item || item.stock === 0) {
        alert('Item tidak tersedia!');
        return;
    }
    
    if (!currentUser.cartItems) currentUser.cartItems = [];
    currentUser.cartItems.push(itemId);
    saveUsers();
    alert(`✅ ${item.name} ditambahkan ke keranjang!`);
}

function loadCartItems() {
    const cart = document.getElementById('cartItems');
    document.getElementById('currentCredit').textContent = (currentUser.totalCredit || 0).toLocaleString('id-ID');
    
    if (!currentUser.cartItems || currentUser.cartItems.length === 0) {
        cart.innerHTML = '<p class="empty-cart">Keranjang Anda kosong 🛒</p>';
        return;
    }
    
    cart.innerHTML = '';
    const cartItems = {};
    
    currentUser.cartItems.forEach(itemId => {
        cartItems[itemId] = (cartItems[itemId] || 0) + 1;
    });
    
    Object.keys(cartItems).forEach(itemId => {
        const item = items.find(i => i.id === parseInt(itemId));
        if (item) {
            const itemCard = document.createElement('div');
            itemCard.className = 'cart-item-card';
            itemCard.innerHTML = `
                <div class="item-details">
                    <h4>🎁 ${item.name}</h4>
                    <p>💰 ${item.price.toLocaleString('id-ID')} skor kredit</p>
                    <p>Qty: ${cartItems[itemId]}</p>
                </div>
                <button onclick="exchangeItem(${item.id})" class="btn-exchange">💳 Tukar</button>
                <button onclick="removeFromCart(${item.id})" class="btn-remove">🗑 Hapus</button>
            `;
            cart.appendChild(itemCard);
        }
    });
}

function removeFromCart(itemId) {
    if (currentUser.cartItems) {
        const index = currentUser.cartItems.indexOf(itemId);
        if (index > -1) {
            currentUser.cartItems.splice(index, 1);
            saveUsers();
            loadCartItems();
        }
    }
}

function exchangeItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    if ((currentUser.totalCredit || 0) < item.price) {
        alert('Skor kredit tidak cukup! 😢');
        return;
    }
    
    if (item.stock === 0) {
        alert('Item sudah habis! 😢');
        return;
    }
    
    // Proses penukaran
    currentUser.totalCredit = (currentUser.totalCredit || 0) - item.price;
    item.stock -= 1;
    
    // Hapus dari keranjang
    if (currentUser.cartItems) {
        const index = currentUser.cartItems.indexOf(itemId);
        if (index > -1) {
            currentUser.cartItems.splice(index, 1);
        }
    }
    
    // Tambah ke history penukaran
    if (!currentUser.exchangeHistory) currentUser.exchangeHistory = [];
    currentUser.exchangeHistory.push({
        itemId: itemId,
        itemName: item.name,
        price: item.price,
        date: new Date().toISOString()
    });
    
    // Simpan exchange history global
    exchanges.push({
        userId: currentUser.id,
        itemId: itemId,
        price: item.price,
        date: new Date().toISOString()
    });
    
    saveUsers();
    saveItems();
    saveExchanges();
    
    alert(`✅ Berhasil menukar ${item.name}!\n💰 Skor Anda sekarang: ${currentUser.totalCredit}`);
    loadCartItems();
}

// ===== SOUND EFFECTS =====
function playSound(type) {
    const sounds = {
        success: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
        error: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg=="
    };
    
    if (sounds[type]) {
        const audio = new Audio(sounds[type]);
        audio.play().catch(() => {});
    }
}

// Sound button for animals
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

// ===== STORAGE FUNCTIONS =====
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

function saveExchanges() {
    localStorage.setItem('exchanges', JSON.stringify(exchanges));
}

function saveCurrentUser() {
    if (currentUser && !currentUser.isAdmin) {
        currentUser.scores = gameScores;
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
        }
    }
}

function updatePlayersCreditAfterStockChange() {
    // Ini dipanggil ketika admin mengubah stok
    // Semua player akan melihat perubahan stok karena mereka load data dari localStorage yang sama
    saveItems();
}

// Auto save before unload
window.addEventListener('beforeunload', () => {
    saveCurrentUser();
});

// Set default items if not exists
if (items.length === 0) {
    items = getDefaultItems();
    saveItems();
}