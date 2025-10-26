// 行为系统
// 负责管理Yui的行为切换、行为显示和行为持续时间

class BehaviorSystem {
    constructor() {
        this.currentBehavior = null;
        this.behaviorStartTime = Date.now();
        this.behaviorDuration = 0;
        this.availableBehaviors = [];
        this.behaviorChangeCallbacks = [];
        this.updateInterval = null;
        
        this.initialize();
    }

    // 初始化行为系统
    initialize() {
        this.loadGameState();
        this.updateAvailableBehaviors();
        this.startBehavior();
        this.startBehaviorUpdate();
    }

    // 加载游戏状态
    loadGameState() {
        // 测试阶段：每次刷新重置
        if (CONFIG.idle.resetOnRefresh) {
            this.resetToInitial();
            return;
        }
        
        try {
            const saved = localStorage.getItem('projectyeb_behavior_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentBehavior = data.currentBehavior || null;
                this.behaviorStartTime = data.behaviorStartTime || Date.now();
                this.behaviorDuration = data.behaviorDuration || 0;
            } else {
                this.resetToInitial();
            }
        } catch (error) {
            console.error('加载行为数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.currentBehavior = null;
        this.behaviorStartTime = Date.now();
        this.behaviorDuration = 0;
    }

    // 开始行为更新循环
    startBehaviorUpdate() {
        // 每秒检查一次行为状态
        this.updateInterval = setInterval(() => {
            this.updateBehavior();
        }, 1000);
    }

    // 更新行为状态
    updateBehavior() {
        const currentTime = Date.now();
        const behaviorElapsed = (currentTime - this.behaviorStartTime) / 1000;
        
        // 更新行为颜色（随时间变淡）
        this.updateBehaviorColor();
        
        // 检查是否需要切换行为
        if (behaviorElapsed >= this.behaviorDuration) {
            this.changeToRandomBehavior();
        }
    }

    // 开始行为
    startBehavior() {
        if (!this.currentBehavior) {
            this.changeToRandomBehavior();
        } else {
            this.updateDisplay();
        }
    }

    // 切换到随机行为
    changeToRandomBehavior() {
        if (this.availableBehaviors.length === 0) {
            this.updateAvailableBehaviors();
        }
        
        if (this.availableBehaviors.length === 0) {
            console.warn('没有可用的行为');
            return;
        }
        
        // 根据心情选择行为权重
        const weightedBehaviors = this.getWeightedBehaviors();
        const randomIndex = Math.floor(Math.random() * weightedBehaviors.length);
        const newBehavior = weightedBehaviors[randomIndex];
        
        this.setBehavior(newBehavior);
    }

    // 获取加权行为列表
    getWeightedBehaviors() {
        const moodLevel = window.gameSystems?.moodSystem?.getMoodLevel() || 'normal';
        const baseBehaviors = CONFIG.behaviors.baseBehaviors;
        
        // 根据心情等级调整行为权重
        const moodWeights = {
            'superHappy': 1.5,
            'happy': 1.2,
            'normal': 1.0,
            'unhappy': 0.8,
            'hate': 0.5
        };
        
        const weight = moodWeights[moodLevel] || 1.0;
        const weightedList = [];
        
        // 为每个行为添加权重
        this.availableBehaviors.forEach(behavior => {
            const baseWeight = this.getBehaviorWeight(behavior);
            const finalWeight = Math.max(1, Math.floor(baseWeight * weight));
            
            // 根据权重重复添加行为到列表
            for (let i = 0; i < finalWeight; i++) {
                weightedList.push(behavior);
            }
        });
        
        return weightedList.length > 0 ? weightedList : this.availableBehaviors;
    }

    // 获取行为权重
    getBehaviorWeight(behavior) {
        // 为不同行为设置基础权重
        const behaviorWeights = {
            '发呆': 3,
            '四处张望': 2,
            '打哈欠': 1,
            '整理头发': 2,
            '叹气': 1,
            'playing_games': 4,
            'exercising': 2,
            'sleeping': 3,
            'listening_music': 3,
            'reading_books': 2
        };
        
        return behaviorWeights[behavior] || 1;
    }

    // 设置行为
    setBehavior(behavior) {
        const oldBehavior = this.currentBehavior;
        this.currentBehavior = behavior;
        this.behaviorStartTime = Date.now();
        
        // 设置随机持续时间
        const durationRange = CONFIG.behaviors.durationRange;
        this.behaviorDuration = durationRange.min + Math.random() * (durationRange.max - durationRange.min);
        
        // 更新显示
        this.updateDisplay();
        
        // 取消之前的高亮
        if (oldBehavior) {
            this.unhighlightFurniture(oldBehavior);
        }
        
        // 检查是否需要高亮家具
        this.checkFurnitureHighlight(behavior);
        
        // 触发行为变化回调
        this.triggerBehaviorChangeCallbacks(oldBehavior, behavior);
        
        // 保存游戏状态
        this.saveGameState();
        
        console.log(`行为切换: ${oldBehavior || '无'} -> ${behavior}, 持续时间: ${this.behaviorDuration.toFixed(1)}秒`);
    }

    // 检查是否需要高亮家具
    checkFurnitureHighlight(behavior) {
        // 检查行为是否与家具相关
        const furnitureBehaviors = {
            'playing_games': 'switch',
            'exercising': 'treadmill',
            'sleeping': 'bed',
            'listening_music': 'mp3',
            'reading_books': 'harry_potter'
        };
        
        const furnitureId = furnitureBehaviors[behavior];
        if (furnitureId && window.gameSystems?.furnitureSystem) {
            // 持续高亮对应的家具（在整个行为期间）
            window.gameSystems.furnitureSystem.highlightFurnitureContinuous(furnitureId);
        }
    }

    // 取消家具高亮
    unhighlightFurniture(behavior) {
        // 检查行为是否与家具相关
        const furnitureBehaviors = {
            'playing_games': 'switch',
            'exercising': 'treadmill',
            'sleeping': 'bed',
            'listening_music': 'mp3',
            'reading_books': 'harry_potter'
        };
        
        const furnitureId = furnitureBehaviors[behavior];
        if (furnitureId && window.gameSystems?.furnitureSystem) {
            // 取消高亮对应的家具
            window.gameSystems.furnitureSystem.unhighlightFurniture(furnitureId);
        }
    }

    // 强制切换到下一个行为
    forceNextBehavior() {
        this.changeToRandomBehavior();
        
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                '强制切换行为',
                'info'
            );
        }
    }

    // 更新可用行为列表
    updateAvailableBehaviors() {
        // 基础行为
        this.availableBehaviors = [...CONFIG.behaviors.baseBehaviors];
        
        // 添加家具解锁的行为（只包括当前放置在房间中的家具）
        if (window.gameSystems?.furnitureSystem) {
            const placedFurniture = window.gameSystems.furnitureSystem.getPlacedFurnitureList();
            placedFurniture.forEach(furniture => {
                const furnitureConfig = CONFIG.furniture.examples[furniture.id];
                if (furnitureConfig && furnitureConfig.behaviors) {
                    furnitureConfig.behaviors.forEach(behavior => {
                        if (!this.availableBehaviors.includes(behavior)) {
                            this.availableBehaviors.push(behavior);
                        }
                    });
                }
            });
        }
        
        console.log('可用行为列表更新:', this.availableBehaviors);
    }

    // 更新显示
    updateDisplay() {
        const behaviorElement = document.getElementById('current-behavior');
        const emojiElement = document.getElementById('yui-status-emoji');
        
        if (behaviorElement && this.currentBehavior) {
            const behaviorText = TEXTS.behaviors[this.currentBehavior] || this.currentBehavior;
            
            // 添加动画效果
            behaviorElement.classList.add('behavior-changing');
            behaviorElement.textContent = behaviorText;
            
            // 重置颜色为深色（新行为）
            behaviorElement.style.color = '#ffffff';
            behaviorElement.style.opacity = '1';
            
            // 更新Emoji显示
            if (emojiElement) {
                const emoji = this.getBehaviorEmoji(this.currentBehavior);
                emojiElement.textContent = emoji;
            }
            
            // 动画结束后移除动画类
            setTimeout(() => {
                behaviorElement.classList.remove('behavior-changing');
            }, 1000);
        }
    }

    // 获取行为对应的Emoji
    getBehaviorEmoji(behavior) {
        const emojiMap = {
            '发呆': '😐',
            '四处张望': '👀',
            '打哈欠': '🥱',
            '整理头发': '💁‍♀️',
            '叹气': '😮‍💨',
            'playing_games': '👧🎮', // 小人+游戏机
            'exercising': '👧🏃‍♀️', // 小人+跑步
            'sleeping': '👧😴', // 小人+睡觉
            'listening_music': '👧🎵', // 小人+音乐
            'reading_books': '👧📚'  // 小人+书本
        };
        
        return emojiMap[behavior] || '👧'; // 默认显示小人
    }

    // 更新行为颜色（随时间变淡）
    updateBehaviorColor() {
        const behaviorElement = document.getElementById('current-behavior');
        if (behaviorElement && this.currentBehavior) {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - this.behaviorStartTime) / 1000;
            const progress = Math.min(elapsedTime / this.behaviorDuration, 1);
            
            // 颜色随时间变淡：从白色逐渐变灰
            const opacity = Math.max(0.3, 1 - progress * 0.7); // 从1到0.3
            const colorValue = Math.floor(255 * opacity);
            behaviorElement.style.color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
            behaviorElement.style.opacity = opacity.toString();
        }
    }

    // 添加行为变化回调
    addBehaviorChangeCallback(callback) {
        if (typeof callback === 'function') {
            this.behaviorChangeCallbacks.push(callback);
        }
    }

    // 触发行为变化回调
    triggerBehaviorChangeCallbacks(oldBehavior, newBehavior) {
        this.behaviorChangeCallbacks.forEach(callback => {
            try {
                callback(oldBehavior, newBehavior);
            } catch (error) {
                console.error('行为变化回调执行失败:', error);
            }
        });
    }

    // 心情等级变化事件
    onMoodLevelChange(newMoodLevel) {
        console.log(`心情等级变化，重新计算行为权重: ${newMoodLevel}`);
        
        // 心情变化时可能立即切换行为
        if (Math.random() < 0.3) { // 30%概率立即切换行为
            this.changeToRandomBehavior();
        }
    }

    // 时间段变化事件
    onTimePeriodChange(newPeriod) {
        console.log(`时间段变化，可能影响行为: ${newPeriod}`);
        
        // 时间段变化时可能切换行为
        if (Math.random() < 0.2) { // 20%概率切换行为
            this.changeToRandomBehavior();
        }
    }

    // 获取当前行为信息
    getCurrentBehaviorInfo() {
        if (!this.currentBehavior) {
            return {
                name: '无行为',
                description: 'Yui没有任何行为',
                elapsedTime: 0,
                remainingTime: 0
            };
        }
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.behaviorStartTime) / 1000;
        const remainingTime = Math.max(0, this.behaviorDuration - elapsedTime);
        
        return {
            name: this.currentBehavior,
            description: TEXTS.behaviors[this.currentBehavior] || this.currentBehavior,
            elapsedTime: elapsedTime,
            remainingTime: remainingTime,
            progress: elapsedTime / this.behaviorDuration
        };
    }

    // 获取可用行为列表
    getAvailableBehaviors() {
        return [...this.availableBehaviors];
    }

    // 检查行为是否可用
    isBehaviorAvailable(behavior) {
        return this.availableBehaviors.includes(behavior);
    }

    // 解锁新行为
    unlockBehavior(behavior) {
        if (!this.availableBehaviors.includes(behavior)) {
            this.availableBehaviors.push(behavior);
            console.log(`解锁新行为: ${behavior}`);
            
            // 显示解锁通知
            if (window.gameSystems?.notificationSystem) {
                const behaviorText = TEXTS.behaviors[behavior] || behavior;
                window.gameSystems.notificationSystem.showNotification(
                    `解锁新行为: ${behaviorText}`,
                    'success'
                );
            }
            
            return true;
        }
        return false;
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            currentBehavior: this.currentBehavior,
            behaviorStartTime: this.behaviorStartTime,
            behaviorDuration: this.behaviorDuration
        };
        
        try {
            localStorage.setItem('projectyeb_behavior_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存行为数据失败:', error);
        }
        
        // 通知其他系统保存游戏状态
        if (window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 暂停行为系统
    pause() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // 恢复行为系统
    resume() {
        if (!this.updateInterval) {
            this.startBehaviorUpdate();
        }
    }

    // 销毁行为系统
    destroy() {
        this.pause();
        this.saveGameState();
        this.behaviorChangeCallbacks = [];
    }
}

// 创建全局行为系统实例
let behaviorSystem = null;

// 初始化行为系统
function initializeBehaviorSystem() {
    if (!behaviorSystem) {
        behaviorSystem = new BehaviorSystem();
    }
    return behaviorSystem;
}

// 导出行为系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BehaviorSystem, initializeBehaviorSystem };
}
