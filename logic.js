// 初始化玩家
function initPlayer() {
    player = {
        x: CONFIG.player.x,
        y: CONFIG.background.groundY - CONFIG.player.height,
        width: CONFIG.player.width,
        height: CONFIG.player.height,
        velocityY: 0,
        onGround: true,
        groundY: CONFIG.background.groundY - CONFIG.player.height,
        jumpType: 'none',
        animTick: 0 // 用于简单的动画效果
    };
}

// 初始化红旗
function initEndFlag() {
    const groundY = CONFIG.background.groundY;
    endFlag = {
        x: canvasW + 100,
        y: groundY - CONFIG.flag.poleHeight,
        poleWidth: CONFIG.flag.poleWidth,
        poleHeight: CONFIG.flag.poleHeight,
        flagWidth: CONFIG.flag.flagWidth,
        flagHeight: CONFIG.flag.flagHeight,
        isShow: false,
        isExist: true,
        isInitedShowPos: false
    };
    levelState.flagCurrentDistance = levelState.flagInitDistance;
}

// 初始化关卡
function initLevel(level = 1) {
    const flagInitDistance = CONFIG.flag.initDistanceBase + (level - 1) * CONFIG.flag.initDistanceStep;
    levelState = {
        currentLevel: level,
        maxHealth: CONFIG.health.initialMax + (level - 1) * CONFIG.health.increasePerLevel,
        currentHealth: CONFIG.health.initialMax + (level - 1) * CONFIG.health.increasePerLevel,
        flagInitDistance: flagInitDistance,
        flagCurrentDistance: flagInitDistance
    };
    obstacles = [];
    timeAccumulator = 0;
    initEndFlag();
    initPlayer();
    updateHealthUI();
    updateLevelUI();
}

// 更新玩家状态
function updatePlayer() {
    if (gameState !== 'playing') return;
    
    player.animTick += 0.15; // 跑动动画速度
    
    let currentGravity = 0;
    if (player.jumpType === 'small') currentGravity = CONFIG.player.smallJumpGravity;
    else if (player.jumpType === 'big') currentGravity = CONFIG.player.bigJumpGravity;
    
    player.velocityY += currentGravity;
    player.y += player.velocityY;
    
    if (player.y >= player.groundY) {
        player.y = player.groundY;
        player.velocityY = 0;
        player.onGround = true;
        player.jumpType = 'none';
    }
}

// 小跳逻辑
function smallJump() {
    if (!player.onGround || gameState !== 'playing') return;
    player.velocityY = -CONFIG.player.smallJumpPower;
    player.onGround = false;
    player.jumpType = 'small';
    AUDIO.play('jump');
}

// 大跳逻辑
function bigJump() {
    if (!player.onGround || gameState !== 'playing') return;
    player.velocityY = -CONFIG.player.bigJumpPower;
    player.onGround = false;
    player.jumpType = 'big';
    AUDIO.play('jump');
    DOM.jumpIndicator.style.display = 'block';
    setTimeout(() => DOM.jumpIndicator.style.display = 'none', 1000);
}

// 更新红旗状态
function updateEndFlag(deltaTime) {
    if (gameState !== 'playing' || !endFlag.isExist) return;
    
    timeAccumulator += deltaTime;
    if (timeAccumulator >= 1000) {
        levelState.flagCurrentDistance = Math.max(0, levelState.flagCurrentDistance - CONFIG.flag.reduceSpeed);
        timeAccumulator = 0;
    }
    
    if (!endFlag.isShow && levelState.flagCurrentDistance <= CONFIG.flag.showDistance) {
        endFlag.isShow = true;
        endFlag.x = canvasW - endFlag.poleWidth;
        endFlag.isInitedShowPos = true;
    }
    
    if (endFlag.isShow && endFlag.isInitedShowPos) {
        endFlag.x -= CONFIG.flag.moveSpeed;
        endFlag.x = Math.max(0, endFlag.x);
    }
    
    const tolerance = 8;
    if (endFlag.x >= CONFIG.player.x - tolerance && endFlag.x <= CONFIG.player.x + tolerance) {
        // 解锁下一关
        if (levelState.currentLevel < CONFIG.totalLevels) {
            gameProgress.unlockedLevel = Math.max(gameProgress.unlockedLevel, levelState.currentLevel + 1);
        }
        saveProgress();
        levelComplete();
        endFlag.isExist = false;
    }
    
    if (endFlag.x < 0) {
        // 解锁下一关
        if (levelState.currentLevel < CONFIG.totalLevels) {
            gameProgress.unlockedLevel = Math.max(gameProgress.unlockedLevel, levelState.currentLevel + 1);
        }
        saveProgress();
        levelComplete();
        endFlag.isExist = false;
    }
}

// 按权重选择障碍类型
function selectObstacleTypeByWeight(availableTypes) {
    const weightMap = {};
    let totalWeight = 0;
    availableTypes.forEach(type => {
        const key = type.img.split('.')[0];
        weightMap[key] = CONFIG.obstacle.probWeights[key];
        totalWeight += weightMap[key];
    });
    
    const randomVal = Math.random() * totalWeight;
    let currentWeight = 0;
    for (const type of availableTypes) {
        const key = type.img.split('.')[0];
        currentWeight += weightMap[key];
        if (randomVal <= currentWeight) return type;
    }
    return availableTypes[0];
}

// 生成障碍
function generateObstacle() {
    if (gameState !== 'playing') return;
    if (Math.random() > CONFIG.obstacle.generateProb) return;
    
    const availableTypes = CONFIG.obstacleTypes.filter(t => {
        const min = t.minLevel || 1;
        const max = t.maxLevel || CONFIG.totalLevels;
        return levelState.currentLevel >= min && levelState.currentLevel <= max;
    });
    if (availableTypes.length === 0) return;
    
    let startX = canvasW + 50;
    if (obstacles.length > 0) {
        const lastObstacle = obstacles[obstacles.length - 1];
        startX = Math.max(startX, lastObstacle.x + lastObstacle.width + CONFIG.obstacle.minSpace);
    }
    
    const isGroup = levelState.currentLevel >= CONFIG.obstacle.groupStartLevel && Math.random() < CONFIG.obstacle.groupProb;
    const groupCount = isGroup ? Math.floor(Math.random() * CONFIG.obstacle.groupMaxCount) + 1 : 1;
    const groundY = CONFIG.background.groundY;
    
    for (let i = 0; i < groupCount; i++) {
        const selectedType = selectObstacleTypeByWeight(availableTypes);
        let width = 0;
        const baseW = CONFIG.obstacle.baseWidth;
        if (selectedType.img === 'obs1.png') width = baseW * 1.25 * 1.25;
        else if (selectedType.img === 'obs2.png') width = baseW * 1.25;
        else width = baseW;
        
        const height = Math.random() * (CONFIG.obstacle.heightRange.max - CONFIG.obstacle.heightRange.min) + CONFIG.obstacle.heightRange.min;
        const currentX = startX + i * (width + CONFIG.obstacle.groupInnerSpace);
        
        obstacles.push({
            x: currentX,
            y: groundY - height,
            width: width,
            height: height,
            img: preloadedImages[selectedType.img.split('.')[0]],
            damage: selectedType.damage
        });
    }
}

// 更新障碍状态
function updateObstacles() {
    if (gameState !== 'playing') return;
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= CONFIG.obstacle.moveSpeed;
        if (obstacles[i].x < -obstacles[i].width) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// 碰撞检测
function checkObstacleCollision() {
    if (gameState !== 'playing') return;
    
    const pPaddingX = CONFIG.player.hitboxPadding.x;
    const pPaddingY = CONFIG.player.hitboxPadding.y;
    
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        
        // 使用更精细的碰撞体检测
        if (
            player.x + pPaddingX < obs.x + obs.width - 5 &&
            player.x + player.width - pPaddingX > obs.x + 5 &&
            player.y + pPaddingY < obs.y + obs.height - 5 &&
            player.y + player.height - pPaddingY > obs.y + 5
        ) {
            levelState.currentHealth = Math.max(0, levelState.currentHealth - obs.damage);
            updateHealthUI();
            AUDIO.play('hit');
            obstacles.splice(i, 1);
            i--;
            if (levelState.currentHealth <= 0) gameOver();
            break;
        }
    }
}