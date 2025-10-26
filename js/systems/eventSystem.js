// 特殊事件系统
// 负责管理条件触发的事件和强制对话

class EventSystem {
    constructor() {
        this.activeEvents = [];
        this.eventHistory = [];
        this.eventCooldowns = {};
        
        this.initialize();
    }

    // 初始化事件系统
    initialize() {
        this.loadGameState();
        this.setupEventListeners();
        this.startEventChecker();
    }

    // 加载游戏状态
    loadGameState() {
        try {
            const saved = localStorage.getItem('projectyeb_event_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.activeEvents = data.activeEvents || [];
                this.eventHistory = data.eventHistory || [];
                this.eventCooldowns = data.eventCooldowns || {};
            }
        } catch (error) {
            console.error('加载事件数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.activeEvents = [];
        this.eventHistory = [];
        this.eventCooldowns = {};
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听心情变化
        document.addEventListener('moodChanged', (event) => {
            this.checkMoodEvents(event.detail.newMood);
        });

        // 监听等级提升
        document.addEventListener('levelUp', (event) => {
            this.checkLevelEvents(event.detail.newLevel);
        });

        // 监听家具放置
        document.addEventListener('furniturePlaced', (event) => {
            this.checkFurnitureEvents(event.detail.furniture);
        });

        // 监听礼物赠送
        document.addEventListener('giftGiven', (event) => {
            this.checkGiftEvents(event.detail.gift);
        });
    }

    // 开始事件检查器
    startEventChecker() {
        // 每分钟检查一次事件触发条件
        setInterval(() => {
            this.checkTimeEvents();
            this.checkRandomEvents();
        }, 60000); // 1分钟
    }

    // 检查心情相关事件
    checkMoodEvents(currentMood) {
        // 心情满值事件
        if (currentMood >= 100) {
            this.triggerEvent('mood_max');
        }

        // 心情极低事件
        if (currentMood <= 20) {
            this.triggerEvent('mood_min');
        }

        // 心情大幅提升事件
        if (currentMood >= 80 && !this.eventCooldowns['mood_high']) {
            this.triggerEvent('mood_high');
            this.eventCooldowns['mood_high'] = Date.now();
        }
    }

    // 检查等级相关事件
    checkLevelEvents(currentLevel) {
        // 等级里程碑事件
        const milestones = [5, 10, 20, 30, 50];
        if (milestones.includes(currentLevel)) {
            this.triggerEvent(`level_${currentLevel}`);
        }
    }

    // 检查家具相关事件
    checkFurnitureEvents(furniture) {
        // 第一个家具事件
        if (this.eventHistory.filter(e => e.type === 'furniture').length === 0) {
            this.triggerEvent('first_furniture');
        }

        // 特定家具事件
        if (furniture.id === 'switch') {
            this.triggerEvent('got_switch');
        } else if (furniture.id === 'bed') {
            this.triggerEvent('got_bed');
        }
    }

    // 检查礼物相关事件
    checkGiftEvents(gift) {
        // 第一个礼物事件
        if (this.eventHistory.filter(e => e.type === 'gift').length === 0) {
            this.triggerEvent('first_gift');
        }

        // 特定礼物事件
        if (gift.id === 'chocolate') {
            this.triggerEvent('got_chocolate');
        } else if (gift.id === 'teddy_bear') {
            this.triggerEvent('got_teddy_bear');
        }
    }

    // 检查时间相关事件
    checkTimeEvents() {
        const now = new Date();
        const hour = now.getHours();

        // 早晨问候事件
        if (hour === 7 && !this.eventCooldowns['morning_greeting']) {
            this.triggerEvent('morning_greeting');
            this.eventCooldowns['morning_greeting'] = Date.now();
        }

        // 晚安事件
        if (hour === 22 && !this.eventCooldowns['good_night']) {
            this.triggerEvent('good_night');
            this.eventCooldowns['good_night'] = Date.now();
        }

        // 生日事件（示例：每月15日）
        if (now.getDate() === 15 && !this.eventCooldowns['monthly_birthday']) {
            this.triggerEvent('monthly_birthday');
            this.eventCooldowns['monthly_birthday'] = Date.now();
        }
    }

    // 检查随机事件
    checkRandomEvents() {
        // 5%概率触发随机事件
        if (Math.random() < 0.05 && !this.eventCooldowns['random_event']) {
            const randomEvents = [
                'random_thought',
                'weather_change',
                'memory_share',
                'future_dream'
            ];
            const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            this.triggerEvent(randomEvent);
            this.eventCooldowns['random_event'] = Date.now();
        }
    }

    // 触发事件
    triggerEvent(eventType) {
        // 检查冷却时间
        if (this.eventCooldowns[eventType]) {
            const cooldown = this.getEventCooldown(eventType);
            if (Date.now() - this.eventCooldowns[eventType] < cooldown) {
                return false;
            }
        }

        // 获取事件配置
        const eventConfig = this.getEventConfig(eventType);
        if (!eventConfig) {
            console.error(`事件配置不存在: ${eventType}`);
            return false;
        }

        // 创建事件记录
        const event = {
            type: eventType,
            name: eventConfig.name,
            triggeredAt: Date.now(),
            data: eventConfig.data || {}
        };

        // 添加到活动事件
        this.activeEvents.push(event);

        // 添加到历史记录
        this.eventHistory.push(event);

        // 设置冷却时间
        this.eventCooldowns[eventType] = Date.now();

        // 触发事件效果
        this.applyEventEffects(event);

        // 显示事件对话
        this.showEventDialogue(event);

        // 保存游戏状态
        this.saveGameState();

        console.log(`触发事件: ${eventType}`);
        return true;
    }

    // 获取事件冷却时间（毫秒）
    getEventCooldown(eventType) {
        const cooldowns = {
            'mood_high': 24 * 60 * 60 * 1000, // 24小时
            'morning_greeting': 24 * 60 * 60 * 1000, // 24小时
            'good_night': 24 * 60 * 60 * 1000, // 24小时
            'monthly_birthday': 30 * 24 * 60 * 60 * 1000, // 30天
            'random_event': 2 * 60 * 60 * 1000 // 2小时
        };

        return cooldowns[eventType] || 0;
    }

    // 获取事件配置
    getEventConfig(eventType) {
        const eventConfigs = {
            // 心情事件
            'mood_max': {
                name: '心情爆满！',
                dialogue: [
                    {speaker: "Yui", text: "今天是我最开心的一天！", color: "#ff6b6b"},
                    {speaker: "玩家", text: "看到你这么开心真好", color: "#4ecdc4"},
                    {speaker: "Yui", text: "因为有你在身边啊！", color: "#ff6b6b"}
                ],
                effects: { coins: 100, exp: 50 }
            },
            'mood_min': {
                name: '心情低落',
                dialogue: [
                    {speaker: "Yui", text: "（低头不语）...", color: "#ff6b6b"},
                    {speaker: "玩家", text: "怎么了？不开心吗？", color: "#4ecdc4"},
                    {speaker: "Yui", text: "没什么...只是有点难过", color: "#ff6b6b"}
                ],
                effects: { mood: 10 } // 安慰效果
            },
            'mood_high': {
                name: '心情愉悦',
                dialogue: [
                    {speaker: "Yui", text: "今天心情特别好！", color: "#ff6b6b"},
                    {speaker: "玩家", text: "看到你开心我也很开心", color: "#4ecdc4"},
                    {speaker: "Yui", text: "我们一起做点什么吧！", color: "#ff6b6b"}
                ],
                effects: { coins: 50 }
            },

            // 等级事件
            'level_5': {
                name: '等级里程碑',
                dialogue: [
                    {speaker: "Yui", text: "哇！我升到5级了！", color: "#ff6b6b"},
                    {speaker: "玩家", text: "恭喜你！继续加油", color: "#4ecdc4"},
                    {speaker: "Yui", text: "嗯！我会努力的！", color: "#ff6b6b"}
                ],
                effects: { coins: 200, exp: 100 }
            },
            'level_10': {
                name: '双位数等级',
                dialogue: [
                    {speaker: "Yui", text: "10级了！感觉成长了很多", color: "#ff6b6b"},
                    {speaker: "玩家", text: "是啊，你变得越来越优秀了", color: "#4ecdc4"},
                    {speaker: "Yui", text: "都是因为有你的陪伴", color: "#ff6b6b"}
                ],
                effects: { coins: 500, exp: 200 }
            },

            // 家具事件
            'first_furniture': {
                name: '第一个家具',
                dialogue: [
                    {speaker: "Yui", text: "哇！这是给我的家具吗？", color: "#ff6b6b"},
                    {speaker: "玩家", text: "是啊，希望你喜欢", color: "#4ecdc4"},
                    {speaker: "Yui", text: "谢谢！我会好好使用的", color: "#ff6b6b"}
                ],
                effects: { mood: 15 }
            },
            'got_switch': {
                name: '获得游戏机',
                dialogue: [
                    {speaker: "Yui", text: "Switch游戏机！太棒了！", color: "#ff6b6b"},
                    {speaker: "玩家", text: "喜欢吗？我们可以一起玩", color: "#4ecdc4"},
                    {speaker: "Yui", text: "真的吗？太好了！", color: "#ff6b6b"}
                ],
                effects: { mood: 20 }
            },

            // 礼物事件
            'first_gift': {
                name: '第一次送礼',
                dialogue: [
                    {speaker: "Yui", text: "这是...给我的礼物？", color: "#ff6b6b"},
                    {speaker: "玩家", text: "是啊，希望你喜欢", color: "#4ecdc4"},
                    {speaker: "Yui", text: "谢谢你！我很开心", color: "#ff6b6b"}
                ],
                effects: { mood: 25 }
            },

            // 时间事件
            'morning_greeting': {
                name: '早晨问候',
                dialogue: [
                    {speaker: "Yui", text: "早安！新的一天开始了", color: "#ff6b6b"},
                    {speaker: "玩家", text: "早安，今天也要开心哦", color: "#4ecdc4"},
                    {speaker: "Yui", text: "嗯！我们一起加油", color: "#ff6b6b"}
                ],
                effects: { mood: 10 }
            },
            'good_night': {
                name: '晚安问候',
                dialogue: [
                    {speaker: "Yui", text: "晚安，今天过得很开心", color: "#ff6b6b"},
                    {speaker: "玩家", text: "晚安，做个好梦", color: "#4ecdc4"},
                    {speaker: "Yui", text: "你也是，明天见", color: "#ff6b6b"}
                ],
                effects: { mood: 8 }
            },

            // 随机事件
            'random_thought': {
                name: '突然的想法',
                dialogue: [
                    {speaker: "Yui", text: "我突然想到...", color: "#ff6b6b"},
                    {speaker: "玩家", text: "想到什么了？", color: "#4ecdc4"},
                    {speaker: "Yui", text: "能遇见你真是太好了", color: "#ff6b6b"}
                ],
                effects: { mood: 12 }
            },
            'weather_change': {
                name: '天气变化',
                dialogue: [
                    {speaker: "Yui", text: "看！天气变了", color: "#ff6b6b"},
                    {speaker: "玩家", text: "是啊，感觉心情也跟着变了", color: "#4ecdc4"},
                    {speaker: "Yui", text: "但和你在一起，什么天气都很好", color: "#ff6b6b"}
                ],
                effects: { mood: 8 }
            }
        };

        return eventConfigs[eventType];
    }

    // 应用事件效果
    applyEventEffects(event) {
        const config = this.getEventConfig(event.type);
        if (!config || !config.effects) return;

        const effects = config.effects;

        // 应用金币效果
        if (effects.coins && window.gameState) {
            window.gameState.coins += effects.coins;
            if (window.gameSystems?.idleSystem) {
                window.gameSystems.idleSystem.updateCurrencyDisplay();
            }
        }

        // 应用经验效果
        if (effects.exp && window.gameSystems?.levelSystem) {
            window.gameSystems.levelSystem.addExperience(effects.exp);
        }

        // 应用心情效果
        if (effects.mood && window.gameSystems?.moodSystem) {
            window.gameSystems.moodSystem.changeMood(effects.mood, 'event');
        }

        // 显示效果通知
        if (window.gameSystems?.notificationSystem) {
            let effectText = '';
            if (effects.coins) effectText += `+${effects.coins}金币 `;
            if (effects.exp) effectText += `+${effects.exp}经验 `;
            if (effects.mood) effectText += `+${effects.mood}心情 `;

            if (effectText) {
                window.gameSystems.notificationSystem.showNotification(
                    `事件奖励: ${effectText.trim()}`,
                    'event'
                );
            }
        }
    }

    // 显示事件对话
    showEventDialogue(event) {
        const config = this.getEventConfig(event.type);
        if (!config || !config.dialogue) return;

        // 使用对话系统显示事件对话
        if (window.gameSystems?.dialogueSystem) {
            window.gameSystems.dialogueSystem.startCustomDialogue(config.dialogue);
        }
    }

    // 强制触发事件（调试用）
    forceTriggerEvent(eventType) {
        return this.triggerEvent(eventType);
    }

    // 获取活动事件
    getActiveEvents() {
        return this.activeEvents;
    }

    // 获取事件历史
    getEventHistory() {
        return this.eventHistory;
    }

    // 清除过期事件
    clearExpiredEvents() {
        const now = Date.now();
        this.activeEvents = this.activeEvents.filter(event => 
            now - event.triggeredAt < 24 * 60 * 60 * 1000 // 保留24小时内的事件
        );
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            activeEvents: this.activeEvents,
            eventHistory: this.eventHistory,
            eventCooldowns: this.eventCooldowns
        };
        
        try {
            localStorage.setItem('projectyeb_event_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存事件数据失败:', error);
        }
    }

    // 销毁事件系统
    destroy() {
        this.saveGameState();
    }
}

// 创建全局事件系统实例
let eventSystem = null;

// 初始化事件系统
function initializeEventSystem() {
    if (!eventSystem) {
        eventSystem = new EventSystem();
    }
    return eventSystem;
}

// 导出事件系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventSystem, initializeEventSystem };
}
