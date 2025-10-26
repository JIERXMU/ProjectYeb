// 心情系统
// 负责管理Yui的心情值、自然衰减和心情等级

class MoodSystem {
    constructor() {
        this.currentMood = CONFIG.mood.initialMood;
        this.lastMoodUpdate = Date.now();
        this.superHappyStartTime = null;
        this.moodChangeCallbacks = [];
        this.updateInterval = null;
        
        this.initialize();
    }

    // 初始化心情系统
    initialize() {
        this.loadGameState();
        this.updateDisplay();
        this.startMoodDecay();
    }

    // 加载游戏状态
    loadGameState() {
        // 测试阶段：每次刷新重置
        if (CONFIG.idle.resetOnRefresh) {
            this.resetToInitial();
            return;
        }
        
        try {
            const saved = localStorage.getItem('projectyeb_mood_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentMood = data.mood || CONFIG.mood.initialMood;
                this.superHappyStartTime = data.superHappyStartTime || null;
            } else {
                this.resetToInitial();
            }
        } catch (error) {
            console.error('加载心情数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.currentMood = CONFIG.mood.initialMood;
        this.superHappyStartTime = null;
    }

    // 开始心情衰减循环
    startMoodDecay() {
        // 每分钟更新一次心情衰减
        this.updateInterval = setInterval(() => {
            this.updateMoodDecay();
        }, 60000); // 1分钟
    }

    // 更新心情衰减
    updateMoodDecay() {
        const currentTime = Date.now();
        const deltaMinutes = (currentTime - this.lastMoodUpdate) / (1000 * 60);
        
        if (deltaMinutes <= 0) return;
        
        // 计算衰减
        const decayAmount = this.calculateMoodDecay(deltaMinutes);
        
        // 应用衰减
        if (decayAmount > 0) {
            this.changeMood(-decayAmount, 'natural_decay');
        }
        
        this.lastMoodUpdate = currentTime;
    }

    // 计算心情衰减
    calculateMoodDecay(deltaMinutes) {
        const moodLevel = this.getMoodLevel();
        const decayRate = this.getDecayRate(moodLevel);
        
        return decayRate * deltaMinutes;
    }

    // 获取心情衰减速率
    getDecayRate(moodLevel) {
        const decayRates = CONFIG.mood.decayRates;
        
        switch (moodLevel) {
            case 'superHappy':
                return decayRates.superHappy;
            case 'happy':
                return decayRates.happy;
            case 'normal':
                return decayRates.normal;
            case 'unhappy':
                return decayRates.unhappy;
            case 'hate':
                return decayRates.hate;
            default:
                return decayRates.normal;
        }
    }

    // 改变心情值
    changeMood(amount, source = 'unknown') {
        if (amount === 0) return;
        
        const oldMood = this.currentMood;
        const oldMoodLevel = this.getMoodLevel();
        
        // 更新心情值
        this.currentMood = Math.max(
            CONFIG.mood.minMood, 
            Math.min(CONFIG.mood.maxMood, this.currentMood + amount)
        );
        
        const newMoodLevel = this.getMoodLevel();
        
        // 检查超级开心状态
        this.checkSuperHappyState(oldMood, this.currentMood);
        
        // 更新显示
        this.updateDisplay();
        
        // 显示心情变化提示
        this.showMoodChange(amount, source);
        
        // 触发心情变化回调
        this.triggerMoodChangeCallbacks(oldMood, this.currentMood, source);
        
        // 检查心情等级变化
        if (oldMoodLevel !== newMoodLevel) {
            this.onMoodLevelChange(oldMoodLevel, newMoodLevel);
        }
        
        // 保存游戏状态
        this.saveGameState();
        
        console.log(`心情${amount > 0 ? '提升' : '下降'} ${Math.abs(amount)}点，当前心情: ${this.currentMood} (${source})`);
    }

    // 显示心情变化提示
    showMoodChange(amount, source) {
        const moodChangeElement = document.getElementById('mood-change');
        if (!moodChangeElement) return;
        
        const isPositive = amount > 0;
        const changeText = isPositive ? 'up' : 'down';
        const changeClass = isPositive ? 'mood-increase' : 'mood-decrease';
        
        moodChangeElement.textContent = changeText;
        moodChangeElement.className = `mood-change ${changeClass}`;
        moodChangeElement.classList.remove('hidden');
        
        // 持续显示，不清除
        // 只在下次心情变化时更新
    }

    // 清除心情变化显示
    clearMoodChange() {
        const moodChangeElement = document.getElementById('mood-change');
        if (moodChangeElement) {
            moodChangeElement.classList.add('hidden');
        }
    }

    // 检查超级开心状态
    checkSuperHappyState(oldMood, newMood) {
        const superHappyThreshold = CONFIG.mood.thresholds.superHappy;
        
        // 进入超级开心状态
        if (newMood >= superHappyThreshold && oldMood < superHappyThreshold) {
            this.superHappyStartTime = Date.now();
            console.log('进入超级开心状态！');
        }
        
        // 离开超级开心状态
        if (newMood < superHappyThreshold && oldMood >= superHappyThreshold) {
            this.superHappyStartTime = null;
            console.log('离开超级开心状态');
        }
        
        // 检查超级开心持续时间
        if (this.superHappyStartTime && newMood >= superHappyThreshold) {
            const currentTime = Date.now();
            const superHappyDuration = (currentTime - this.superHappyStartTime) / (1000 * 60);
            
            if (superHappyDuration >= CONFIG.mood.superHappyDuration) {
                // 超级开心持续时间结束，开始快速衰减
                console.log('超级开心持续时间结束');
            }
        }
    }

    // 心情等级变化事件
    onMoodLevelChange(oldLevel, newLevel) {
        console.log(`心情等级变化: ${oldLevel} -> ${newLevel}`);
        
        // 通知其他系统心情等级变化
        if (window.gameSystems?.behaviorSystem) {
            window.gameSystems.behaviorSystem.onMoodLevelChange(newLevel);
        }
        
        // 显示心情等级变化通知
        this.showMoodLevelChangeNotification(oldLevel, newLevel);
    }

    // 显示心情等级变化通知
    showMoodLevelChangeNotification(oldLevel, newLevel) {
        const oldMoodInfo = TEXTS.moodLevels[oldLevel];
        const newMoodInfo = TEXTS.moodLevels[newLevel];
        
        if (!oldMoodInfo || !newMoodInfo) return;
        
        const notificationText = `Yui的心情从${oldMoodInfo.name}变为${newMoodInfo.name}${newMoodInfo.emoji}`;
        
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(notificationText, 'mood');
        }
    }

    // 获取心情等级
    getMoodLevel() {
        const thresholds = CONFIG.mood.thresholds;
        const mood = this.currentMood;
        
        if (mood >= thresholds.superHappy) return 'superHappy';
        if (mood >= thresholds.happy) return 'happy';
        if (mood >= thresholds.normal) return 'normal';
        if (mood >= thresholds.unhappy) return 'unhappy';
        return 'hate';
    }

    // 获取心情信息
    getMoodInfo() {
        const moodLevel = this.getMoodLevel();
        const moodInfo = TEXTS.moodLevels[moodLevel] || TEXTS.moodLevels.normal;
        
        return {
            value: this.currentMood,
            level: moodLevel,
            name: moodInfo.name,
            description: moodInfo.description,
            color: moodInfo.color,
            emoji: moodInfo.emoji
        };
    }

    // 更新显示
    updateDisplay() {
        const moodElement = document.getElementById('mood-display');
        const moodProgressElement = document.getElementById('mood-progress');
        const moodStatusElement = document.getElementById('mood-status-text');
        const moodValueElement = document.getElementById('mood-status');
        
        if (moodElement) {
            moodElement.textContent = Math.floor(this.currentMood);
            
            // 根据心情值设置颜色
            const moodInfo = this.getMoodInfo();
            moodElement.style.color = moodInfo.color;
        }
        
        if (moodProgressElement) {
            const progress = (this.currentMood / CONFIG.mood.maxMood) * 100;
            moodProgressElement.style.width = `${progress}%`;
            
            // 根据心情值设置进度条颜色
            const moodInfo = this.getMoodInfo();
            moodProgressElement.style.background = moodInfo.color;
        }
        
        if (moodStatusElement) {
            const moodInfo = this.getMoodInfo();
            moodStatusElement.textContent = `${moodInfo.emoji} ${moodInfo.name}`;
            moodStatusElement.className = `mood-${moodInfo.level}`;
        }
        
        if (moodValueElement) {
            const moodInfo = this.getMoodInfo();
            moodValueElement.textContent = `${Math.floor(this.currentMood)}/100`;
            moodValueElement.style.color = moodInfo.color;
        }
    }

    // 添加心情变化回调
    addMoodChangeCallback(callback) {
        if (typeof callback === 'function') {
            this.moodChangeCallbacks.push(callback);
        }
    }

    // 触发心情变化回调
    triggerMoodChangeCallbacks(oldMood, newMood, source) {
        this.moodChangeCallbacks.forEach(callback => {
            try {
                callback(oldMood, newMood, source);
            } catch (error) {
                console.error('心情变化回调执行失败:', error);
            }
        });
    }

    // 时间段变化事件
    onTimePeriodChange(newPeriod) {
        // 可以根据时间段对心情产生微小影响
        // 例如：早晨心情略微提升，深夜心情略微下降
        const periodEffects = {
            "早晨": 1,
            "中午": 0,
            "下午": 0,
            "晚上": -1,
            "凌晨": -2
        };
        
        const effect = periodEffects[newPeriod] || 0;
        if (effect !== 0) {
            this.changeMood(effect, 'time_period');
        }
    }

    // 设置心情值（调试用）
    setMood(value) {
        const newMood = Math.max(
            CONFIG.mood.minMood, 
            Math.min(CONFIG.mood.maxMood, value)
        );
        
        const oldMood = this.currentMood;
        this.currentMood = newMood;
        
        this.updateDisplay();
        this.saveGameState();
        
        console.log(`心情值设置为: ${this.currentMood}`);
        
        // 触发变化回调
        this.triggerMoodChangeCallbacks(oldMood, newMood, 'debug');
    }

    // 获取心情对行为的影响系数
    getMoodBehaviorMultiplier() {
        const moodLevel = this.getMoodLevel();
        
        switch (moodLevel) {
            case 'superHappy': return 1.5;
            case 'happy': return 1.2;
            case 'normal': return 1.0;
            case 'unhappy': return 0.8;
            case 'hate': return 0.5;
            default: return 1.0;
        }
    }

    // 检查是否达到特定心情等级
    hasReachedMoodLevel(targetLevel) {
        const currentLevel = this.getMoodLevel();
        const levelOrder = ['hate', 'unhappy', 'normal', 'happy', 'superHappy'];
        
        const currentIndex = levelOrder.indexOf(currentLevel);
        const targetIndex = levelOrder.indexOf(targetLevel);
        
        return currentIndex >= targetIndex;
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            mood: this.currentMood,
            superHappyStartTime: this.superHappyStartTime
        };
        
        try {
            localStorage.setItem('projectyeb_mood_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存心情数据失败:', error);
        }
        
        // 更新全局游戏状态
        if (window.gameState) {
            window.gameState.mood = this.currentMood;
        }
        
        // 通知其他系统保存游戏状态
        if (window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 暂停心情系统
    pause() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // 恢复心情系统
    resume() {
        if (!this.updateInterval) {
            this.startMoodDecay();
        }
    }

    // 销毁心情系统
    destroy() {
        this.pause();
        this.saveGameState();
        this.moodChangeCallbacks = [];
    }
}

// 创建全局心情系统实例
let moodSystem = null;

// 初始化心情系统
function initializeMoodSystem() {
    if (!moodSystem) {
        moodSystem = new MoodSystem();
    }
    return moodSystem;
}

// 导出心情系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MoodSystem, initializeMoodSystem };
}
