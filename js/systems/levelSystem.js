// 等级系统
// 负责管理玩家等级、经验获取和升级机制

class LevelSystem {
    constructor() {
        this.currentLevel = 1;
        this.experience = 0;
        this.levelUpCallbacks = [];
        
        this.initialize();
    }

    // 初始化等级系统
    initialize() {
        this.loadGameState();
        
        // 同步到全局游戏状态
        if (window.gameState) {
            window.gameState.level = this.currentLevel;
            window.gameState.experience = this.experience;
        }
        
        this.updateDisplay();
    }

    // 加载游戏状态
    loadGameState() {
        // 测试阶段：每次刷新重置
        if (CONFIG.idle.resetOnRefresh) {
            this.resetToInitial();
            return;
        }
        
        try {
            const saved = localStorage.getItem('projectyeb_level_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLevel = data.level || 1;
                this.experience = data.experience || 0;
            } else {
                this.resetToInitial();
            }
        } catch (error) {
            console.error('加载等级数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.currentLevel = 1;
        this.experience = 0;
    }

    // 添加经验值
    addExperience(amount) {
        if (amount <= 0) return;
        
        this.experience += amount;
        
        // 同步到全局游戏状态
        if (window.gameState) {
            window.gameState.experience = this.experience;
        }
        
        // 检查是否升级
        const leveledUp = this.checkLevelUp();
        
        // 更新显示
        this.updateDisplay();
        
        // 保存游戏状态
        this.saveGameState();
        
        return leveledUp;
    }

    // 检查升级
    checkLevelUp() {
        const nextLevelExp = this.getNextLevelExp();
        
        if (this.experience >= nextLevelExp && this.currentLevel < CONFIG.levels.maxLevel) {
            return this.levelUp();
        }
        
        return false;
    }

    // 升级
    levelUp() {
        this.currentLevel++;
        
        // 同步到全局游戏状态
        if (window.gameState) {
            window.gameState.level = this.currentLevel;
        }
        
        // 应用升级奖励
        this.applyLevelUpReward();
        
        // 触发升级回调
        this.triggerLevelUpCallbacks();
        
        // 显示升级通知
        this.showLevelUpNotification();
        
        console.log(`升级！当前等级: ${this.currentLevel}`);
        
        // 检查是否还能继续升级
        this.checkLevelUp();
        
        return true;
    }

    // 应用升级奖励
    applyLevelUpReward() {
        const reward = CONFIG.levels.levelUpReward;
        
        // 奖励金币
        if (reward.coins > 0 && window.gameState) {
            window.gameState.coins += reward.coins;
            
            // 更新UI显示
            if (window.gameSystems?.idleSystem) {
                window.gameSystems.idleSystem.updateCurrencyDisplay();
            }
            
            // 显示金币获得通知
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    `升级奖励: ${reward.coins}金币`, 
                    'success'
                );
            }
        }
        
        // 奖励心情加成
        if (reward.moodBonus > 0 && window.gameSystems?.moodSystem) {
            window.gameSystems.moodSystem.changeMood(reward.moodBonus);
        }
    }

    // 显示升级通知
    showLevelUpNotification() {
        const notificationText = TEXTS.ui.notifications.levelUp.replace('{level}', this.currentLevel);
        
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(notificationText, 'success');
        }
    }

    // 获取下一级所需经验
    getNextLevelExp() {
        const expRequirements = CONFIG.levels.expRequirements;
        
        if (this.currentLevel >= expRequirements.length) {
            return Infinity; // 已达到最大等级
        }
        
        return expRequirements[this.currentLevel];
    }

    // 获取当前等级经验进度
    getExpProgress() {
        const currentLevelExp = this.getCurrentLevelExp();
        const nextLevelExp = this.getNextLevelExp();
        
        if (nextLevelExp === Infinity) {
            return 1; // 最大等级，进度为100%
        }
        
        const expInCurrentLevel = this.experience - currentLevelExp;
        const expNeeded = nextLevelExp - currentLevelExp;
        
        return expInCurrentLevel / expNeeded;
    }

    // 获取当前等级起始经验
    getCurrentLevelExp() {
        const expRequirements = CONFIG.levels.expRequirements;
        
        if (this.currentLevel <= 1) {
            return 0;
        }
        
        if (this.currentLevel - 1 < expRequirements.length) {
            return expRequirements[this.currentLevel - 1];
        }
        
        return expRequirements[expRequirements.length - 1];
    }

    // 更新显示
    updateDisplay() {
        const levelElement = document.getElementById('level-display');
        const levelProgressElement = document.getElementById('level-progress');
        const levelExpElement = document.getElementById('level-exp');
        
        if (levelElement) {
            levelElement.textContent = this.currentLevel;
        }
        
        if (levelProgressElement) {
            const progress = this.getExpProgress() * 100;
            levelProgressElement.style.width = `${progress}%`;
        }
        
        if (levelExpElement) {
            const currentExp = Math.floor(this.experience);
            const nextLevelExp = this.getNextLevelExp();
            levelExpElement.textContent = `${currentExp}/${nextLevelExp}`;
        }
        
        // 更新经验变化率显示
        this.updateExpRateDisplay();
    }
    
    // 更新经验变化率显示
    updateExpRateDisplay() {
        const expRateDisplay = document.getElementById('exp-rate-display');
        if (expRateDisplay && window.gameSystems?.careerSystem) {
            const careerSystem = window.gameSystems.careerSystem;
            const expRate = careerSystem.changeRates.experience || 0;
            
            if (expRate > 0) {
                const formattedRate = careerSystem.formatChangeRate(expRate, 's');
                expRateDisplay.textContent = formattedRate;
                expRateDisplay.className = `rate-display positive`;
            } else {
                expRateDisplay.textContent = '0';
                expRateDisplay.className = `rate-display`;
            }
        }
    }

    // 更新经验条
    updateExpBar() {
        // 这个方法现在合并到updateDisplay中
        this.updateDisplay();
    }

    // 添加升级回调
    addLevelUpCallback(callback) {
        if (typeof callback === 'function') {
            this.levelUpCallbacks.push(callback);
        }
    }

    // 触发升级回调
    triggerLevelUpCallbacks() {
        this.levelUpCallbacks.forEach(callback => {
            try {
                callback(this.currentLevel);
            } catch (error) {
                console.error('等级升级回调执行失败:', error);
            }
        });
    }

    // 获取等级信息
    getLevelInfo() {
        return {
            level: this.currentLevel,
            experience: this.experience,
            nextLevelExp: this.getNextLevelExp(),
            expProgress: this.getExpProgress(),
            isMaxLevel: this.currentLevel >= CONFIG.levels.maxLevel
        };
    }

    // 设置等级（调试用）
    setLevel(level) {
        const newLevel = Math.max(1, Math.min(level, CONFIG.levels.maxLevel));
        
        if (newLevel !== this.currentLevel) {
            this.currentLevel = newLevel;
            this.experience = this.getCurrentLevelExp();
            
            this.updateDisplay();
            this.saveGameState();
            
            console.log(`等级设置为: ${this.currentLevel}`);
        }
    }

    // 设置经验值（调试用）
    setExperience(exp) {
        this.experience = Math.max(0, exp);
        
        // 检查升级
        this.checkLevelUp();
        
        this.updateDisplay();
        this.saveGameState();
        
        console.log(`经验值设置为: ${this.experience}`);
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            level: this.currentLevel,
            experience: this.experience
        };
        
        try {
            localStorage.setItem('projectyeb_level_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存等级数据失败:', error);
        }
        
        // 通知其他系统保存游戏状态
        if (window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 获取等级对挂机收益的加成
    getLevelBonusMultiplier() {
        const levelBonus = CONFIG.idle.levelBonusMultiplier;
        return 1 + (this.currentLevel - 1) * levelBonus;
    }

    // 检查是否达到特定等级
    hasReachedLevel(targetLevel) {
        return this.currentLevel >= targetLevel;
    }

    // 获取等级描述
    getLevelDescription() {
        if (this.currentLevel <= 3) {
            return "新手阶段";
        } else if (this.currentLevel <= 7) {
            return "成长阶段";
        } else if (this.currentLevel <= 12) {
            return "熟练阶段";
        } else {
            return "专家阶段";
        }
    }

    // 销毁等级系统
    destroy() {
        this.saveGameState();
        this.levelUpCallbacks = [];
    }
}

// 创建全局等级系统实例
let levelSystem = null;

// 初始化等级系统
function initializeLevelSystem() {
    if (!levelSystem) {
        levelSystem = new LevelSystem();
    }
    return levelSystem;
}

// 导出等级系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LevelSystem, initializeLevelSystem };
}
