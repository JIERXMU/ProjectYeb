// ProjectYeb 主游戏文件
// 负责初始化游戏系统和协调各系统之间的交互

// 全局游戏状态
window.gameState = {
    level: 1,
    experience: 0,
    coins: 0,
    mood: 40,
    furniture: [],
    inventory: [],
    lastSaveTime: Date.now(),
    
    // 阶段一：新系统状态字段
    career: {
        currentJob: 'intern',
        jobLevel: 1,
        jobExp: 0,
        focus: 100,
        lastWorkTime: Date.now(),
        totalWorkIncome: 0
    },
    
    skills: {
        efficiency: 0,
        focus: 0,
        recovery: 0,
        endurance: 0
    },
    
    tasks: {
        daily: [],
        promotion: [],
        achievements: [],
        completedTasks: 0,
        skillPoints: 0
    },
    
    comfort: {
        totalComfort: 0,
        lastComfortUpdate: Date.now()
    }
};

// 全局游戏系统管理器
window.gameSystems = {};

// 游戏主类
class ProjectYebGame {
    constructor() {
        this.isInitialized = false;
        this.isPaused = false;
    }

    // 初始化游戏
    async initialize() {
        if (this.isInitialized) return;

        console.log('正在初始化 ProjectYeb 游戏...');

        try {
            // 1. 初始化游戏状态
            await this.initializeGameState();

            // 2. 初始化各系统
            await this.initializeSystems();

            // 3. 设置UI事件监听
            await this.setupEventListeners();

            // 4. 启动游戏循环
            this.startGameLoop();

            this.isInitialized = true;
            console.log('ProjectYeb 游戏初始化完成！');

            // 显示欢迎消息
            this.showWelcomeMessage();

        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.showError('游戏初始化失败，请刷新页面重试。');
        }
    }

    // 初始化游戏状态
    async initializeGameState() {
        // 加载保存的游戏数据
        await this.loadGameData();

        // 设置初始状态（如果无保存数据）
        if (CONFIG.idle.resetOnRefresh) {
            this.resetGameState();
        }

        console.log('游戏状态初始化完成');
    }

    // 初始化各系统
    async initializeSystems() {
        // 初始化时间系统
        window.gameSystems.timeSystem = initializeTimeSystem();
        
        // 初始化等级系统
        window.gameSystems.levelSystem = initializeLevelSystem();
        
        // 初始化挂机系统
        window.gameSystems.idleSystem = initializeIdleSystem();
        
        // 初始化心情系统
        window.gameSystems.moodSystem = initializeMoodSystem();
        
        // 初始化行为系统
        window.gameSystems.behaviorSystem = initializeBehaviorSystem();
        
        // 初始化对话系统
        window.gameSystems.dialogueSystem = initializeDialogueSystem();
        
        // 初始化通知系统
        window.gameSystems.notificationSystem = initializeNotificationSystem();
        
        // 初始化调试面板
        window.gameSystems.debugPanel = initializeDebugPanel();
        
        // 初始化家具系统
        window.gameSystems.furnitureSystem = initializeFurnitureSystem();
        
        // 初始化商店系统
        window.gameSystems.shopSystem = initializeShopSystem();
        
        // 初始化交互系统
        window.gameSystems.interactionSystem = initializeInteractionSystem();
        
        // 阶段二：初始化打工系统
        window.gameSystems.careerSystem = initializeCareerSystem();

        // 阶段四：初始化事件系统
        window.gameSystems.eventSystem = initializeEventSystem();

        console.log('所有游戏系统初始化完成');
    }

    // 设置UI事件监听
    setupEventListeners() {
        // 对话按钮
        const talkBtn = document.getElementById('talk-btn');
        if (talkBtn) {
            talkBtn.addEventListener('click', () => {
                this.startDialogue();
            });
        }

        // 礼物按钮
        const giftBtn = document.getElementById('gift-btn');
        if (giftBtn) {
            giftBtn.addEventListener('click', () => {
                this.openGiftMenu();
            });
        }

        // 房屋按钮
        const houseBtn = document.getElementById('house-btn');
        if (houseBtn) {
            houseBtn.addEventListener('click', () => {
                this.toggleDecorationMode();
            });
        }

        // 商城按钮
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.openShop();
            });
        }

        // 衣柜按钮
        const wardrobeBtn = document.getElementById('wardrobe-btn');
        if (wardrobeBtn) {
            wardrobeBtn.addEventListener('click', () => {
                this.openWardrobe();
            });
        }

        // 音乐按钮
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                this.openMusic();
            });
        }

        // 调试面板快捷键
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F12') {
                event.preventDefault();
                this.toggleDebugPanel();
            }
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onGamePause();
            } else {
                this.onGameResume();
            }
        });

        // 金币点击事件
        this.setupCoinClickEvent();

        console.log('UI事件监听器设置完成');
    }

    // 开始游戏循环
    startGameLoop() {
        // 游戏主循环 - 每秒更新一次
        setInterval(() => {
            if (!this.isPaused) {
                this.gameUpdate();
            }
        }, 1000);

        console.log('游戏循环已启动');
    }

    // 游戏更新
    gameUpdate() {
        // 更新各系统
        this.updateSystems();

        // 检查特殊事件
        this.checkSpecialEvents();

        // 自动保存（每30秒）
        const currentTime = Date.now();
        if (currentTime - window.gameState.lastSaveTime > 30000) {
            this.saveGame();
            window.gameState.lastSaveTime = currentTime;
        }
    }

    // 更新各系统
    updateSystems() {
        // 各系统有自己的更新循环，这里主要处理系统间协调
    }

    // 检查特殊事件
    checkSpecialEvents() {
        // 检查心情满值事件
        if (window.gameState.mood >= 100 && !window.gameState.moodMaxEventTriggered) {
            this.triggerSpecialEvent('mood_max');
            window.gameState.moodMaxEventTriggered = true;
        }

        // 检查等级达到5级事件
        if (window.gameState.level >= 5 && !window.gameState.level5EventTriggered) {
            this.triggerSpecialEvent('level_5');
            window.gameState.level5EventTriggered = true;
        }

        // 重置心情满值事件触发状态（当心情低于100时）
        if (window.gameState.mood < 100 && window.gameState.moodMaxEventTriggered) {
            window.gameState.moodMaxEventTriggered = false;
        }
    }

    // 触发特殊事件
    triggerSpecialEvent(eventId) {
        const eventConfig = TEXTS.events[eventId];
        if (!eventConfig) return;

        console.log(`触发特殊事件: ${eventConfig.title}`);

        // 显示事件通知
        if (window.gameSystems.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                eventConfig.description,
                'event'
            );
        }

        // 执行事件对话
        if (window.gameSystems.dialogueSystem) {
            window.gameSystems.dialogueSystem.startEventDialogue(eventConfig);
        }

        // 发放奖励
        if (eventConfig.rewards) {
            this.applyEventRewards(eventConfig.rewards);
        }
    }

    // 应用事件奖励
    applyEventRewards(rewards) {
        if (rewards.coins && window.gameState) {
            window.gameState.coins += rewards.coins;
            if (window.gameSystems.idleSystem) {
                window.gameSystems.idleSystem.updateCurrencyDisplay();
            }
        }

        if (rewards.mood && window.gameSystems.moodSystem) {
            window.gameSystems.moodSystem.changeMood(rewards.mood);
        }
    }

    // 开始对话
    startDialogue() {
        if (window.gameSystems.dialogueSystem) {
            window.gameSystems.dialogueSystem.startRandomDialogue();
        }
    }

    // 打开礼物菜单
    openGiftMenu() {
        if (window.gameSystems.shopSystem) {
            // 打开礼物背包
            window.gameSystems.shopSystem.openGiftBackpack();
        } else {
            if (window.gameSystems.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    '礼物功能开发中...',
                    'info'
                );
            }
        }
    }

    // 切换装修模式
    toggleDecorationMode() {
        if (window.gameSystems.furnitureSystem) {
            window.gameSystems.furnitureSystem.toggleDecorationMode();
        } else {
            if (window.gameSystems.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    '房屋装修功能开发中...',
                    'info'
                );
            }
        }
    }

    // 打开商店
    openShop() {
        if (window.gameSystems.shopSystem) {
            window.gameSystems.shopSystem.openShop();
        } else {
            if (window.gameSystems.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    '商店功能开发中...',
                    'info'
                );
            }
        }
    }

    // 切换调试面板
    toggleDebugPanel() {
        if (window.gameSystems.debugPanel) {
            window.gameSystems.debugPanel.toggle();
        }
    }

    // 打开衣柜
    openWardrobe() {
        if (window.gameSystems.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                '衣柜功能开发中...',
                'info'
            );
        }
    }

    // 打开音乐
    openMusic() {
        if (window.gameSystems.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                '音乐功能开发中...',
                'info'
            );
        }
    }

    // 游戏暂停
    onGamePause() {
        this.isPaused = true;
        console.log('游戏暂停');

        // 暂停各系统
        Object.values(window.gameSystems).forEach(system => {
            if (system.pause) {
                system.pause();
            }
        });
    }

    // 游戏恢复
    onGameResume() {
        this.isPaused = false;
        console.log('游戏恢复');

        // 恢复各系统
        Object.values(window.gameSystems).forEach(system => {
            if (system.resume) {
                system.resume();
            }
        });
    }

    // 加载游戏数据
    async loadGameData() {
        try {
            const saved = localStorage.getItem('projectyeb_save_data');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(window.gameState, data);
                console.log('游戏数据加载成功');
            }
        } catch (error) {
            console.error('加载游戏数据失败:', error);
        }
    }

    // 保存游戏
    saveGame() {
        try {
            localStorage.setItem('projectyeb_save_data', JSON.stringify(window.gameState));
            console.log('游戏数据已保存');
        } catch (error) {
            console.error('保存游戏数据失败:', error);
        }
    }

    // 重置游戏状态
    resetGameState() {
        window.gameState = {
            level: 1,
            experience: 0,
            coins: CONFIG.currency.initialCoins,
            mood: CONFIG.mood.initialMood,
            furniture: [],
            inventory: [],
            lastSaveTime: Date.now(),
            
            // 阶段一：新系统状态字段
            career: {
                currentJob: 'intern',
                jobLevel: 1,
                jobExp: 0,
                focus: 100,
                lastWorkTime: Date.now(),
                totalWorkIncome: 0
            },
            
            skills: {
                efficiency: 0,
                focus: 0,
                recovery: 0,
                endurance: 0
            },
            
            tasks: {
                daily: [],
                promotion: [],
                achievements: [],
                completedTasks: 0,
                skillPoints: 0
            },
            
            comfort: {
                totalComfort: 0,
                lastComfortUpdate: Date.now()
            }
        };
        console.log('游戏状态已重置');
    }

    // 显示欢迎消息
    showWelcomeMessage() {
        if (window.gameSystems.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                '欢迎来到 ProjectYeb！照顾Yui，让她开心起来吧！',
                'welcome'
            );
        }
    }

    // 设置金币点击事件
    setupCoinClickEvent() {
        const coinAnimation = document.querySelector('.coin-animation');
        if (coinAnimation) {
            coinAnimation.style.cursor = 'pointer';
            coinAnimation.addEventListener('click', () => {
                this.onCoinClick();
            });
        }
    }

    // 金币点击处理
    onCoinClick() {
        // 增加金币数量
        window.gameState.coins += 1;
        
        // 更新金币显示
        if (window.gameSystems?.idleSystem) {
            window.gameSystems.idleSystem.updateCurrencyDisplay();
        }
        
        // 播放点击动画
        this.playCoinClickAnimation();
        
        // 显示金币+1特效
        this.showCoinPlusOneEffect();
        
        console.log('点击金币，获得 1 金币');
    }

    // 显示金币+1特效
    showCoinPlusOneEffect() {
        const coinDisplay = document.querySelector('.coin-display');
        if (!coinDisplay) return;
        
        // 随机选择显示文字或emoji
        const useEmoji = Math.random() > 0.5;
        const plusOneElement = document.createElement('div');
        plusOneElement.className = `coin-plus-one ${useEmoji ? 'emoji' : ''}`;
        plusOneElement.textContent = useEmoji ? '💰' : '+1';
        
        // 定位到金币显示区域
        const rect = coinDisplay.getBoundingClientRect();
        plusOneElement.style.left = `${rect.left + rect.width / 2}px`;
        plusOneElement.style.top = `${rect.top}px`;
        
        document.body.appendChild(plusOneElement);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (plusOneElement.parentNode) {
                plusOneElement.parentNode.removeChild(plusOneElement);
            }
        }, 1500);
    }

    // 播放金币点击动画
    playCoinClickAnimation() {
        const coinAnimation = document.querySelector('.coin-animation');
        if (!coinAnimation) return;
        
        // 添加点击动画类
        coinAnimation.classList.add('coin-click-animation');
        
        // 1秒后移除动画类
        setTimeout(() => {
            coinAnimation.classList.remove('coin-click-animation');
        }, 1000);
    }

    // 显示错误消息
    showError(message) {
        if (window.gameSystems.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // 获取游戏信息
    getGameInfo() {
        return {
            version: '1.0.0',
            initialized: this.isInitialized,
            paused: this.isPaused,
            systems: Object.keys(window.gameSystems),
            state: window.gameState
        };
    }

    // 销毁游戏
    destroy() {
        this.isPaused = true;
        
        // 销毁各系统
        Object.values(window.gameSystems).forEach(system => {
            if (system.destroy) {
                system.destroy();
            }
        });
        
        // 保存游戏
        this.saveGame();
        
        console.log('游戏已销毁');
    }
}

// 创建全局游戏实例
let gameInstance = null;

// 初始化游戏
function initializeGame() {
    if (!gameInstance) {
        gameInstance = new ProjectYebGame();
    }
    return gameInstance;
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM加载完成，开始初始化游戏...');
    
    try {
        const game = initializeGame();
        await game.initialize();
        
        // 将游戏实例暴露给全局，方便调试
        window.projectYebGame = game;
        
    } catch (error) {
        console.error('游戏初始化失败:', error);
        alert('游戏初始化失败，请检查控制台错误信息。');
    }
});

// 导出游戏类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProjectYebGame, initializeGame };
}
