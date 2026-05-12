// DOM元素获取
const DOM = {
    canvas: document.getElementById('gameCanvas'),
    startScreen: document.getElementById('startScreen'),
    rulesScreen: document.getElementById('rulesScreen'),
    levelStartScreen: document.getElementById('levelStartScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    levelCompleteScreen: document.getElementById('levelCompleteScreen'),
    levelSelectScreen: document.getElementById('levelSelectScreen'),
    levelGrid: document.getElementById('levelGrid'),
    healthValue: document.getElementById('healthValue'),
    healthBar: document.getElementById('healthBar'),
    levelNumber: document.getElementById('levelNumber'),
    finalLevel: document.getElementById('finalLevel'),
    nextLevel: document.getElementById('nextLevel'),
    newMaxHealth: document.getElementById('newMaxHealth'),
    jumpIndicator: document.getElementById('jumpIndicator'),
    currentLevelNum: document.getElementById('currentLevelNum'),
    levelDescription: document.getElementById('levelDescription'),
    startButton: document.getElementById('startButton'),
    rulesButton: document.getElementById('rulesButton'),
    levelSelectButton: document.getElementById('levelSelectButton'),
    backToStartButton: document.getElementById('backToStartButton'),
    backFromSelectButton: document.getElementById('backFromSelectButton'),
    resetProgressButton: document.getElementById('resetProgressButton'),
    restartButton: document.getElementById('restartButton'),
    nextLevelButton: document.getElementById('nextLevelButton'),
    failToSelectButton: document.getElementById('failToSelectButton'),
    successToSelectButton: document.getElementById('successToSelectButton'),
    gameContainer: document.getElementById('gameContainer'),
    audioControl: document.getElementById('audioControl')
};

// 画布初始化
const ctx = DOM.canvas.getContext('2d');
const canvasW = DOM.canvas.width;
const canvasH = DOM.canvas.height;

// 游戏状态变量
let gameState = 'start';
let player = { jumpType: 'none' };
let obstacles = [];
let endFlag = {};
let levelState = {
    currentLevel: 1,
    maxHealth: CONFIG.health.initialMax,
    currentHealth: CONFIG.health.initialMax,
    flagInitDistance: 0,
    flagCurrentDistance: 0
};
let timeAccumulator = 0;
const frameTime = 1000 / CONFIG.fps;

// 进度管理
const PROGRESS_KEY = 'runrunrun_progress';
let gameProgress = {
    unlockedLevel: 1,
    maxHealthRecord: CONFIG.health.initialMax
};

function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameProgress));
}

function loadProgress() {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
        gameProgress = JSON.parse(saved);
    }
}

// 图片预加载
const preloadedImages = {
    bg: new Image(),
    player: new Image(),
    start: new Image(),
    success: new Image(),
    fail: new Image(),
    obs1: new Image(),
    obs2: new Image(),
    obs3: new Image()
};

function preloadAssets() {
    preloadedImages.bg.src = CONFIG.background.imgSrc;
    preloadedImages.player.src = 'player.png';
    preloadedImages.start.src = 'start.png';
    preloadedImages.success.src = 'success.png';
    preloadedImages.fail.src = 'fail.png';
    preloadedImages.obs1.src = 'obs1.png';
    preloadedImages.obs2.src = 'obs2.png';
    preloadedImages.obs3.src = 'obs3.png';
}