// 挂机系统
// 负责管理自动获得经验和金币的挂机机制

class IdleSystem {
    constructor() {
        this.idleMultiplier = CONFIG.debug.defaultMultiplier;
        this.lastUpdateTime = Date.now();
        this.updateInterval = null;
        this.offlineEarnings = { exp: 0, coins: 0 };
        
        this.initialize();
    }

    // 初始化挂机系统
    initialize() {
        this.loadOfflineEarnings();
        this.startIdleLoop();
        
        // 监听页面可见性变化，处理离线收益
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHide();
            } else {
                this.onPageShow();
            }
        });
    }

    // 开始挂机循环
    startIdleLoop() {
        // 每秒更新一次挂机收益
        this.updateInterval = setInterval(() => {
            this.updateIdleEarnings();
        }, 1000);
    }

    // 更新挂机收益
    updateIdleEarnings() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // 转换为秒
        
        if (deltaTime <= 0) return;
        
        // 计算收益
        const earnings = this.calculateEarnings(deltaTime);
        
        // 应用收益
        this.applyEarnings(earnings);
        
        this.lastUpdateTime = currentTime;
    }

    // 计算收益
    calculateEarnings(deltaTime) {
        const baseExpPerSecond = CONFIG.idle.baseExpPerSecond;
        const baseCoinsPerSecond = CONFIG.idle.baseCoinsPerSecond;
        const levelBonus = CONFIG.idle.levelBonusMultiplier;
        
        // 获取当前等级
        const currentLevel = window.gameState?.level || 1;
        
        // 计算等级加成
        const levelMultiplier = 1 + (currentLevel - 1) * levelBonus;
        
        // 应用挂机倍率
        const expEarned = baseExpPerSecond * levelMultiplier * this.idleMultiplier * deltaTime;
        const coinsEarned = baseCoinsPerSecond * levelMultiplier * this.idleMultiplier * deltaTime;
        
        return {
            exp: expEarned,
            coins: coinsEarned
        };
    }

    // 应用收益
    applyEarnings(earnings) {
        if (!window.gameState) return;
        
        // 更新经验值
        if (earnings.exp > 0) {
            // 使用等级系统的addExperience方法，确保经验条正确更新
            if (window.gameSystems?.levelSystem) {
                window.gameSystems.levelSystem.addExperience(earnings.exp);
            } else {
                // 备用方案：直接更新经验值
                window.gameState.experience += earnings.exp;
            }
        }
        
        // 更新金币
        if (earnings.coins > 0) {
            window.gameState.coins += earnings.coins;
            
            // 更新UI显示
            this.updateCurrencyDisplay();
            
            // 触发变化率更新
            if (window.gameSystems?.careerSystem) {
                window.gameSystems.careerSystem.triggerChangeRateUpdate();
            }
        }
        
        // 保存游戏状态
        this.saveGameState();
    }

    // 更新货币显示
    updateCurrencyDisplay() {
        const coinsElement = document.getElementById('coins-display');
        if (coinsElement && window.gameState) {
            const coins = Math.floor(window.gameState.coins);
            coinsElement.textContent = this.formatCoinDisplay(coins);
        }
    }

    // 格式化金币显示（数量级省略）
    formatCoinDisplay(coins) {
        if (coins < 1000) {
            return coins.toString(); // 小于1000，直接显示
        } else if (coins < 10000) {
            return (coins / 1000).toFixed(1) + 'K'; // 1K - 9.9K
        } else if (coins < 1000000) {
            return Math.floor(coins / 1000) + 'K'; // 10K - 999K
        } else if (coins < 10000000) {
            return (coins / 1000000).toFixed(1) + 'M'; // 1M - 9.9M
        } else {
            return Math.floor(coins / 1000000) + 'M'; // 10M+
        }
    }

    // 页面隐藏时处理
    onPageHide() {
        this.lastUpdateTime = Date.now();
        console.log('页面隐藏，记录离线时间');
    }

    // 页面显示时处理
    onPageShow() {
        const currentTime = Date.now();
        const offlineTime = (currentTime - this.lastUpdateTime) / 1000; // 转换为秒
        
        if (offlineTime > 1) {
            // 计算离线收益
            this.calculateOfflineEarnings(offlineTime);
        }
        
        this.lastUpdateTime = currentTime;
    }

    // 计算离线收益
    calculateOfflineEarnings(offlineSeconds) {
        const maxOfflineMinutes = CONFIG.idle.offlineMaxMinutes;
        const offlineEfficiency = CONFIG.idle.offlineEfficiency;
        
        // 限制最大离线时间
        const offlineMinutes = Math.min(offlineSeconds / 60, maxOfflineMinutes);
        
        if (offlineMinutes <= 0) return;
        
        // 计算离线收益（效率为在线的80%）
        const earnings = this.calculateEarnings(offlineMinutes * 60 * offlineEfficiency);
        
        // 存储离线收益
        this.offlineEarnings = {
            exp: earnings.exp,
            coins: earnings.coins,
            offlineTime: offlineMinutes
        };
        
        // 显示离线收益通知
        this.showOfflineEarningsNotification();
        
        console.log(`离线收益: ${Math.floor(earnings.exp)}经验, ${Math.floor(earnings.coins)}金币, 离线时间: ${offlineMinutes.toFixed(1)}分钟`);
    }

    // 显示离线收益通知
    showOfflineEarningsNotification() {
        if (this.offlineEarnings.exp > 0 || this.offlineEarnings.coins > 0) {
            const notificationText = `离线收益: ${Math.floor(this.offlineEarnings.exp)}经验, ${Math.floor(this.offlineEarnings.coins)}金币`;
            
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(notificationText, 'info');
            }
            
            // 应用离线收益
            this.applyOfflineEarnings();
        }
    }

    // 应用离线收益
    applyOfflineEarnings() {
        if (!window.gameState) return;
        
        // 应用经验
        if (this.offlineEarnings.exp > 0) {
            // 使用等级系统的addExperience方法，确保经验条正确更新
            if (window.gameSystems?.levelSystem) {
                window.gameSystems.levelSystem.addExperience(this.offlineEarnings.exp);
            } else {
                // 备用方案：直接更新经验值
                window.gameState.experience += this.offlineEarnings.exp;
            }
        }
        
        // 应用金币
        if (this.offlineEarnings.coins > 0) {
            window.gameState.coins += this.offlineEarnings.coins;
            this.updateCurrencyDisplay();
        }
        
        // 重置离线收益
        this.offlineEarnings = { exp: 0, coins: 0 };
        
        // 保存游戏状态
        this.saveGameState();
    }

    // 设置挂机倍率
    setIdleMultiplier(multiplier) {
        const minMultiplier = CONFIG.debug.multiplierRange.min;
        const maxMultiplier = CONFIG.debug.multiplierRange.max;
        
        // 限制倍率范围
        this.idleMultiplier = Math.max(minMultiplier, Math.min(maxMultiplier, multiplier));
        
        console.log(`挂机倍率设置为: ${this.idleMultiplier}`);
    }

    // 获取当前挂机倍率
    getIdleMultiplier() {
        return this.idleMultiplier;
    }

    // 获取挂机收益统计
    getEarningsStats() {
        const baseExpPerSecond = CONFIG.idle.baseExpPerSecond;
        const baseCoinsPerSecond = CONFIG.idle.baseCoinsPerSecond;
        const levelBonus = CONFIG.idle.levelBonusMultiplier;
        
        const currentLevel = window.gameState?.level || 1;
        const levelMultiplier = 1 + (currentLevel - 1) * levelBonus;
        
        return {
            expPerSecond: baseExpPerSecond * levelMultiplier * this.idleMultiplier,
            coinsPerSecond: baseCoinsPerSecond * levelMultiplier * this.idleMultiplier,
            levelMultiplier: levelMultiplier,
            idleMultiplier: this.idleMultiplier
        };
    }

    // 保存游戏状态
    saveGameState() {
        if (window.gameState && window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 加载离线收益
    loadOfflineEarnings() {
        try {
            const saved = localStorage.getItem('projectyeb_offline_earnings');
            if (saved) {
                this.offlineEarnings = JSON.parse(saved);
                localStorage.removeItem('projectyeb_offline_earnings');
            }
        } catch (error) {
            console.error('加载离线收益失败:', error);
        }
    }

    // 保存离线收益
    saveOfflineEarnings() {
        try {
            if (this.offlineEarnings.exp > 0 || this.offlineEarnings.coins > 0) {
                localStorage.setItem('projectyeb_offline_earnings', JSON.stringify(this.offlineEarnings));
            }
        } catch (error) {
            console.error('保存离线收益失败:', error);
        }
    }

    // 暂停挂机系统
    pause() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // 恢复挂机系统
    resume() {
        if (!this.updateInterval) {
            this.startIdleLoop();
        }
    }

    // 销毁挂机系统
    destroy() {
        this.pause();
        this.saveOfflineEarnings();
    }
}

// 创建全局挂机系统实例
let idleSystem = null;

// 初始化挂机系统
function initializeIdleSystem() {
    if (!idleSystem) {
        idleSystem = new IdleSystem();
    }
    return idleSystem;
}

// 导出挂机系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IdleSystem, initializeIdleSystem };
}
