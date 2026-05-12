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

    // 关卡选择按钮
    DOM.levelSelectButton.addEventListener('click', () => {
        hideAllScreens();
        renderLevelGrid();
        DOM.levelSelectScreen.style.display = 'flex';
    });

    // 关卡选择返回按钮
    DOM.backFromSelectButton.addEventListener('click', () => {
        hideAllScreens();
        DOM.startScreen.style.display = 'flex';
    });

    // 重置进度按钮
    DOM.resetProgressButton.addEventListener('click', () => {
        if (confirm('确定要重置所有游戏进度吗？')) {
            gameProgress = {
                unlockedLevel: 1,
                maxHealthRecord: CONFIG.health.initialMax
            };
            saveProgress();
            renderLevelGrid();
        }
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

    // 失败/成功界面返回关卡选择
    const goToLevelSelect = () => {
        hideAllScreens();
        renderLevelGrid();
        DOM.levelSelectScreen.style.display = 'flex';
    };
    DOM.failToSelectButton.addEventListener('click', goToLevelSelect);
    DOM.successToSelectButton.addEventListener('click', goToLevelSelect);

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
    
    // 音频切换
    DOM.audioControl.addEventListener('click', () => {
        const isMuted = AUDIO.toggleMute();
        DOM.audioControl.textContent = isMuted ? '🔇 音乐: 关' : '🔊 音乐: 开';
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            bigJump();
        }
    });
}

// 初始化游戏
function initGame() {
    loadProgress();
    AUDIO.init();
    preloadAssets();
    initPlayer();
    initLevel(1);
    bindEvents();
    gameLoop();
    AUDIO.playBGM('bgmStart');
}

window.addEventListener('load', initGame);