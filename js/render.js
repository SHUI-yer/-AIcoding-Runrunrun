// 更新UI
function updateHealthUI() {
    DOM.healthValue.textContent = levelState.currentHealth;
    DOM.healthBar.style.width = `${(levelState.currentHealth / levelState.maxHealth) * 100}%`;
}

function updateLevelUI() {
    const level = levelState.currentLevel;
    const flagInitDis = levelState.flagInitDistance;
    DOM.levelNumber.textContent = level;
    DOM.currentLevelNum.textContent = level;
    DOM.levelDescription.textContent = `红旗初始距离${flagInitDis}米，≤20米时从最右侧出现！`;
}

// 绘制红旗
function drawEndFlag() {
    if (!endFlag.isShow || !endFlag.isExist) return;
    ctx.fillStyle = '#333333';
    ctx.fillRect(endFlag.x, endFlag.y, endFlag.poleWidth, endFlag.poleHeight);
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    const flagTopX = endFlag.x + endFlag.poleWidth;
    const flagTopY = endFlag.y;
    ctx.moveTo(flagTopX, flagTopY);
    ctx.lineTo(flagTopX + endFlag.flagWidth, flagTopY);
    ctx.lineTo(flagTopX + endFlag.flagWidth, flagTopY + endFlag.flagHeight);
    ctx.lineTo(flagTopX + endFlag.flagWidth / 2, flagTopY + endFlag.flagHeight - 5);
    ctx.lineTo(flagTopX, flagTopY + endFlag.flagHeight);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(flagTopX, flagTopY + 2);
    ctx.lineTo(flagTopX + endFlag.flagWidth - 2, flagTopY + 2);
    ctx.lineTo(flagTopX + endFlag.flagWidth - 2, flagTopY + endFlag.flagHeight - 2);
    ctx.lineTo(flagTopX + endFlag.flagWidth / 2, flagTopY + endFlag.flagHeight - 7);
    ctx.lineTo(flagTopX, flagTopY + endFlag.flagHeight - 2);
    ctx.closePath();
    ctx.fill();
}

// 游戏流程控制 UI 切换
function showLevelStart() {
    gameState = 'levelStart';
    hideAllScreens();
    DOM.levelStartScreen.style.display = 'flex';
    updateLevelUI();
}

function gameStart() {
    gameState = 'playing';
    hideAllScreens();
    AUDIO.playBGM('bgmGame');
}

function levelComplete() {
    gameState = 'levelComplete';
    hideAllScreens();
    AUDIO.play('success');
    DOM.levelCompleteScreen.style.display = 'flex';
    const nextLevel = levelState.currentLevel + 1;
    DOM.nextLevel.textContent = nextLevel > CONFIG.totalLevels ? levelState.currentLevel : nextLevel;
    DOM.newMaxHealth.textContent = levelState.maxHealth + CONFIG.health.increasePerLevel;
}

function gameOver() {
    gameState = 'gameOver';
    hideAllScreens();
    AUDIO.play('fail');
    DOM.gameOverScreen.style.display = 'flex';
    DOM.finalLevel.textContent = levelState.currentLevel;
    if (levelState.currentLevel === CONFIG.totalLevels) {
        DOM.gameOverScreen.querySelector('h2').textContent = '恭喜通关!';
        DOM.gameOverScreen.querySelector('p').innerHTML = '你成功通过所有8关，跑酷大神诞生！';
    }
}

function hideAllScreens() {
    DOM.startScreen.style.display = 'none';
    DOM.rulesScreen.style.display = 'none';
    DOM.levelSelectScreen.style.display = 'none';
    DOM.levelStartScreen.style.display = 'none';
    DOM.gameOverScreen.style.display = 'none';
    DOM.levelCompleteScreen.style.display = 'none';
}

// 渲染关卡选择列表
function renderLevelGrid() {
    DOM.levelGrid.innerHTML = '';
    for (let i = 1; i <= CONFIG.totalLevels; i++) {
        const levelItem = document.createElement('div');
        levelItem.className = 'level-item';
        levelItem.textContent = i;
        
        if (i > gameProgress.unlockedLevel) {
            levelItem.classList.add('locked');
        } else {
            levelItem.addEventListener('click', () => {
                initLevel(i);
                showLevelStart();
            });
        }
        DOM.levelGrid.appendChild(levelItem);
    }
}

// 绘制游戏主画面
function draw() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(preloadedImages.bg, 0, 0, canvasW, canvasH);
    drawEndFlag();
    
    // 绘制玩家（带简单的跑动/呼吸动画）
    ctx.save();
    let bounceY = 0;
    let rotation = 0;
    
    if (gameState === 'playing') {
        if (player.onGround) {
            // 地面上跑动：微弱的上下颠簸和倾斜
            bounceY = Math.sin(player.animTick) * 3;
            rotation = Math.sin(player.animTick) * 0.05;
        } else {
            // 空中：根据垂直速度倾斜
            rotation = player.velocityY * 0.02;
        }
    }
    
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2 + bounceY);
    ctx.rotate(rotation);
    ctx.drawImage(preloadedImages.player, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
    
    obstacles.forEach(obs => ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height));
}