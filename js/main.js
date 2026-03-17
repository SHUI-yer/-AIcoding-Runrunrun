// 游戏主循环
let lastTime = Date.now();
function gameLoop() {
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;
    
    updatePlayer();
    generateObstacle();
    updateObstacles();
    updateEndFlag(deltaTime);
    checkObstacleCollision();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// 绑定事件
function bindEvents() {
    // 规则按钮跳转
    DOM.rulesButton.addEventListener('click', () => {
        hideAllScreens();
        DOM.rulesScreen.style.display = 'flex';
    });
    // 返回开始界面按钮事件
    DOM.backToStartButton.addEventListener('click', () => {
        hideAllScreens();
        DOM.startScreen.style.display = 'flex';
    });

    DOM.startButton.addEventListener('click', () => {
        hideAllScreens();
        initLevel(1);
        showLevelStart();
    });
    DOM.restartButton.addEventListener('click', () => {
        initLevel(1);
        showLevelStart();
    });
    DOM.nextLevelButton.addEventListener('click', () => {
        const nextLevel = levelState.currentLevel + 1;
        if (nextLevel <= CONFIG.totalLevels) {
            initLevel(nextLevel);
            showLevelStart();
        } else {
            gameOver();
        }
    });
    
    DOM.levelStartScreen.addEventListener('click', gameStart);
    DOM.gameContainer.addEventListener('click', smallJump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            bigJump();
        }
    });
}

// 初始化游戏
function initGame() {
    preloadAssets();
    initPlayer();
    initLevel(1);
    bindEvents();
    gameLoop();
}

window.addEventListener('load', initGame);