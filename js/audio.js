// 音频管理器
const AUDIO = {
    sounds: {},
    isMuted: false,
    currentBGM: null,

    init() {
        // 初始化音效
        for (const [key, url] of Object.entries(CONFIG.audio)) {
            const audio = new Audio(url);
            if (key.startsWith('bgm')) {
                audio.loop = true;
            }
            this.sounds[key] = audio;
        }
    },

    play(key, restart = true) {
        if (this.isMuted || !this.sounds[key]) return;
        if (restart) this.sounds[key].currentTime = 0;
        this.sounds[key].play().catch(e => console.log("音频播放受阻，请交互后重试", e));
    },

    stop(key) {
        if (!this.sounds[key]) return;
        this.sounds[key].pause();
        this.sounds[key].currentTime = 0;
    },

    playBGM(key) {
        if (this.currentBGM === key) return;
        if (this.currentBGM) this.stop(this.currentBGM);
        this.currentBGM = key;
        this.play(key);
    },

    stopBGM() {
        if (this.currentBGM) {
            this.stop(this.currentBGM);
            this.currentBGM = null;
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.currentBGM) this.sounds[this.currentBGM].pause();
        } else {
            if (this.currentBGM) this.sounds[this.currentBGM].play();
        }
        return this.isMuted;
    }
};
