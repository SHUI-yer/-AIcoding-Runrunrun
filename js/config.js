// 游戏核心配置
const CONFIG = {
    totalLevels: 8,
    pixelPerMeter: 5,
    background: { groundY: 420, imgSrc: 'bg.png' },
    flag: {
        initDistanceBase: 20,
        initDistanceStep: 20,
        showDistance: 20,
        reduceSpeed: 6,
        moveSpeed: 4,
        poleWidth: 6,
        poleHeight: 120,
        flagWidth: 40,
        flagHeight: 30
    },
    obstacle: {
        moveSpeed: 4,
        generateProb: 0.008,
        minSpace: 50,
        groupStartLevel: 2,
        groupProb: 0.2,
        groupMaxCount: 2,
        groupInnerSpace: 80,
        heightRange: { min: 30, max: 70 },
        baseWidth: 64,
        probWeights: { obs1: 0.6, obs2: 0.3, obs3: 0.1 }
    },
    obstacleTypes: [
        { name: "普通障碍", img: 'obs1.png', damage: 10, maxLevel: 8 },
        { name: "危险障碍", img: 'obs2.png', damage: 20, minLevel: 2, maxLevel: 8 },
        { name: "致命障碍", img: 'obs3.png', damage: 30, minLevel: 4, maxLevel: 8 }
    ],
    player: {
        x: 100,
        width: 40,
        height: 60,
        smallJumpPower: 18,
        smallJumpGravity: 0.6,
        bigJumpPower: 22,
        bigJumpGravity: 0.4,
        groundOffset: 0
    },
    health: { initialMax: 100, increasePerLevel: 20 },
    fps: 60
};