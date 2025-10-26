# ProjectYeb 技术文档

## 📋 项目概述

**项目名称**: ProjectYeb  
**游戏类型**: 挂机养成网页游戏  
**技术栈**: HTML + CSS + JavaScript  
**核心玩法**: 照顾收养的女儿Yui，通过互动提升心情值，解锁家具和对话

---

## 🏗️ 项目架构

### 文件结构
```
ProjectYeb/
├── index.html                    # 主页面
├── css/
│   ├── style.css                 # 主样式文件
│   └── components/               # 组件样式
│       ├── ui.css                # UI组件样式
│       ├── dialogue.css          # 对话系统样式
│       ├── themes.css            # 时间主题样式
│       ├── interaction.css       # 交互系统样式
│       ├── furniture.css         # 家具系统样式
│       └── shop.css              # 商店系统样式
├── js/
│   ├── main.js                   # 主程序入口
│   ├── config/                   # 配置模块
│   │   ├── gameData.js           # 游戏数值配置
│   │   ├── gameTexts.js          # 游戏文本配置
│   │   └── dialogues.js          # 对话内容配置
│   ├── systems/                  # 游戏系统
│   │   ├── idleSystem.js         # 挂机系统
│   │   ├── levelSystem.js        # 等级系统
│   │   ├── currencySystem.js     # 货币系统
│   │   ├── dialogueSystem.js     # 对话系统
│   │   ├── moodSystem.js         # 心情系统
│   │   ├── behaviorSystem.js     # 行为系统
│   │   ├── furnitureSystem.js    # 家具系统
│   │   ├── shopSystem.js         # 商店系统
│   │   ├── timeSystem.js         # 时间系统
│   │   └── interactionSystem.js  # 交互系统
│   └── ui/                       # UI模块
│       ├── debugPanel.js         # 调试面板
│       ├── notification.js       # 通知系统
│       └── uiManager.js          # UI管理器
└── data/
    └── dialogues.json            # 对话数据
```

---

## 🔧 核心系统详解

### 1. 基础框架系统

#### 实现方式
- **模块化设计**: 每个系统独立封装，通过全局对象 `window.gameSystems` 管理
- **事件驱动**: 系统间通过自定义事件通信
- **数据分离**: 数值和文本配置集中管理

#### 关键代码
```javascript
// 系统初始化
function initializeGame() {
    window.gameSystems = {
        timeSystem: initializeTimeSystem(),
        idleSystem: initializeIdleSystem(),
        levelSystem: initializeLevelSystem(),
        moodSystem: initializeMoodSystem(),
        behaviorSystem: initializeBehaviorSystem(),
        dialogueSystem: initializeDialogueSystem(),
        interactionSystem: initializeInteractionSystem(),
        furnitureSystem: initializeFurnitureSystem(),
        shopSystem: initializeShopSystem(),
        notificationSystem: initializeNotificationSystem()
    };
}
```

### 2. 挂机系统 (IdleSystem)

#### 功能特性
- 随时间自动获得经验和金币
- 支持离线收益计算
- 可配置的收益速度

#### 实现方式
```javascript
class IdleSystem {
    constructor() {
        this.idleRate = 1; // 挂机倍率
        this.lastUpdateTime = Date.now();
        this.initialize();
    }
    
    // 计算离线收益
    calculateOfflineGains() {
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastUpdateTime;
        const minutesPassed = timeDiff / (1000 * 60);
        
        const expGain = Math.floor(minutesPassed * CONFIG.idle.exp * this.idleRate);
        const coinGain = Math.floor(minutesPassed * CONFIG.idle.coins * this.idleRate);
        
        return { exp: expGain, coins: coinGain };
    }
}
```

### 3. 等级系统 (LevelSystem)

#### 功能特性
- 经验累积升级机制
- 线性→指数增长的经验需求
- 升级奖励和红点提示

#### 实现方式
```javascript
class LevelSystem {
    getRequiredExp(level) {
        // 经验需求公式：线性增长 + 指数增长
        const baseExp = CONFIG.levels.base;
        const growthRate = CONFIG.levels.growth;
        return Math.floor(baseExp * Math.pow(growthRate, level - 1));
    }
    
    addExp(amount) {
        this.currentExp += amount;
        while (this.currentExp >= this.getRequiredExp(this.level)) {
            this.levelUp();
        }
    }
}
```

### 4. 心情系统 (MoodSystem)

#### 功能特性
- 心情值范围：0-100
- 5个心情等级：讨厌、不开心、无聊、平常、开心、超级开心
- 自然衰减机制（不同等级衰减速度不同）

#### 实现方式
```javascript
class MoodSystem {
    // 心情等级划分
    getMoodLevel(moodValue) {
        if (moodValue <= 20) return 'hate';
        if (moodValue <= 60) return 'unhappy';
        if (moodValue <= 80) return 'normal';
        if (moodValue <= 99) return 'happy';
        return 'superHappy';
    }
    
    // 自然衰减
    applyNaturalDecay() {
        const decayRates = {
            hate: 0.1,        // 每10分钟-1
            unhappy: 1,       // 每分钟-1
            normal: 3,        // 每分钟-3
            happy: 4,         // 每分钟-4
            superHappy: 4     // 每分钟-4（100时维持10分钟）
        };
        
        const currentLevel = this.getMoodLevel(this.currentMood);
        this.currentMood = Math.max(0, this.currentMood - decayRates[currentLevel]);
    }
}
```

### 5. 对话系统 (DialogueSystem)

#### 功能特性
- 逐字显示效果（打字机效果）
- 彩色姓名区分说话人
- 选项分支和效果应用
- Key-变体映射（25种基础Key = 5心情×5时间段）

#### 实现方式
```javascript
class DialogueSystem {
    // 开始逐字显示效果
    startTypingEffect(element, text, onComplete = null) {
        this.isTyping = true;
        let currentIndex = 0;
        
        this.typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                element.textContent += text[currentIndex];
                currentIndex++;
            } else {
                clearInterval(this.typingInterval);
                this.isTyping = false;
                if (onComplete) onComplete();
            }
        }, this.typingSpeed);
    }
    
    // 显示选项回应
    showOptionResponse(option) {
        // 清空内容重新显示
        dialogueText.innerHTML = '';
        
        // 显示玩家回应
        const playerResponse = this.createDialogueElement('玩家', option.text);
        dialogueText.appendChild(playerResponse);
        
        // 显示Yui回应
        const yuiResponse = this.createDialogueElement('Yui', this.getYuiResponse(option));
        dialogueText.appendChild(yuiResponse);
        
        // 继续对话流程
        setTimeout(() => this.continueDialogue(), 2000);
    }
}
```

### 6. 时间系统 (TimeSystem)

#### 功能特性
- 5个时间段：早晨、中午、下午、晚上、凌晨
- 明显色彩区分各时段UI
- 时间段文字显示

#### 实现方式
```javascript
class TimeSystem {
    getCurrentPeriod() {
        const hour = this.currentTime.getHours();
        if (hour >= 5 && hour < 8) return '早晨';
        if (hour >= 8 && hour < 12) return '中午';
        if (hour >= 12 && hour < 18) return '下午';
        if (hour >= 18 && hour < 23) return '晚上';
        return '凌晨';
    }
    
    updateTheme() {
        const period = this.getCurrentPeriod();
        const themeColors = {
            '早晨': { primary: '#87CEEB', secondary: '#E6F3FF' },
            '中午': { primary: '#FFD700', secondary: '#FFF8E1' },
            '下午': { primary: '#FFA500', secondary: '#FFEBCD' },
            '晚上': { primary: '#2F4F4F', secondary: '#708090' },
            '凌晨': { primary: '#191970', secondary: '#2F4F4F' }
        };
        
        document.documentElement.style.setProperty('--theme-primary', themeColors[period].primary);
        document.documentElement.style.setProperty('--theme-secondary', themeColors[period].secondary);
    }
}
```

### 7. 交互系统 (InteractionSystem)

#### 功能特性
- 摸摸头功能（点击状态窗口）
- 鼠标悬浮和点击动画效果
- 防重复点击机制
- 心情加成效果

#### 实现方式
```javascript
class InteractionSystem {
    // 摸摸头功能
    patHead() {
        if (this.isPatting) return;
        this.isPatting = true;
        
        const moodLevel = window.gameSystems.moodSystem.getMoodLevel();
        const thought = this.getRandomThought(moodLevel);
        
        // 显示想法窗口
        this.showThoughtWindow(thought, moodLevel);
        
        // 应用心情加成
        this.applyPatHeadEffect(moodLevel);
        
        // 播放动画
        this.playStatusWindowAnimation(moodLevel);
        
        setTimeout(() => { this.isPatting = false; }, 1000);
    }
    
    // 播放点击动画
    playClickAnimation(statusWindow, statusEmoji, statusText) {
        if (statusWindow) {
            statusWindow.classList.add('click-animation');
            setTimeout(() => statusWindow.classList.remove('click-animation'), 300);
        }
        // ... 其他元素的动画
    }
}
```

### 8. 家具系统 (FurnitureSystem)

#### 功能特性
- 两种家具类型：持续互动型、单次互动型
- 仓库→房间放置逻辑
- 家具解锁对应Yui行为

#### 实现方式
```javascript
class FurnitureSystem {
    // 放置家具
    placeFurniture(furnitureId, position) {
        const furniture = this.ownedFurniture.find(f => f.id === furnitureId);
        if (!furniture || furniture.placed) return false;
        
        furniture.placed = true;
        furniture.position = position;
        
        // 更新房间显示
        this.updateRoomDisplay();
        
        // 解锁对应行为
        this.unlockBehaviors(furniture.behaviors);
        
        return true;
    }
    
    // 解锁行为
    unlockBehaviors(behaviors) {
        behaviors.forEach(behavior => {
            if (!this.unlockedBehaviors.includes(behavior)) {
                this.unlockedBehaviors.push(behavior);
            }
        });
    }
}
```

### 9. 商店系统 (ShopSystem)

#### 功能特性
- 三类商品：道具、礼物、家具
- 购买逻辑和库存管理
- 金币消费和物品获取

#### 实现方式
```javascript
class ShopSystem {
    // 购买商品
    purchaseItem(itemId) {
        const item = this.shopItems.find(i => i.id === itemId);
        if (!item || window.gameState.coins < item.price) return false;
        
        // 扣除金币
        window.gameState.coins -= item.price;
        
        // 添加物品到对应库存
        if (item.type === 'furniture') {
            this.addToFurnitureInventory(item);
        } else if (item.type === 'gift') {
            this.addToGiftInventory(item);
        } else {
            this.useItemImmediately(item);
        }
        
        return true;
    }
}
```

### 10. 行为系统 (BehaviorSystem)

#### 功能特性
- 根据心情自动切换行为
- 家具互动解锁新行为
- 定时切换下一行为

#### 实现方式
```javascript
class BehaviorSystem {
    // 获取当前行为
    getCurrentBehavior() {
        const moodLevel = window.gameSystems.moodSystem.getMoodLevel();
        const availableBehaviors = this.getAvailableBehaviors(moodLevel);
        
        if (availableBehaviors.length === 0) {
            return this.defaultBehaviors[moodLevel];
        }
        
        // 根据权重随机选择行为
        return this.selectWeightedBehavior(availableBehaviors);
    }
    
    // 定时切换行为
    scheduleNextBehaviorChange() {
        const changeInterval = this.getBehaviorChangeInterval();
        setTimeout(() => {
            this.changeBehavior();
            this.scheduleNextBehaviorChange();
        }, changeInterval);
    }
}
```

---

## 🎨 UI/UX 设计规范

### 视觉风格
- **主色调**: 黑白灰
- **线条**: 略粗边框
- **说话人**: 不同颜色区分
- **时间段**: 5种明显色彩主题

### 界面布局
```
┌─────────────────┐ ← 信息区
│ 时间 等级 心情 金币 │
├─────────────────┤ ← 核心区  
│ 房间窗口 / 对话窗口 │
│ Yui当前行为显示   │
├─────────────────┤ ← 操作区
│ 对话 礼物 衣柜   │
│ 房屋 商城 音乐   │
└─────────────────┘
```

### 交互细节
- **状态窗口**: 鼠标悬浮放大，点击缩小动画
- **家具显示**: 可点击状态视觉区分
- **红点提示**: 等级奖励可领取时
- **系统通知**: 独立区域，不遮挡

---

## 🔧 技术实现要点

### 数据管理
```javascript
// 数值配置
const CONFIG = {
    idle: { exp: 1, coins: 2 },
    levels: { base: 100, growth: 1.5 },
    mood: { decay: [0.1, 1, 3, 4, 4] }
};

// 文本配置  
const TEXTS = {
    mood: ["讨厌","不开心","无聊","平常","开心","超级开心"],
    time: ["早晨","中午","下午","晚上","凌晨"]
};
```

### 对话数据结构
```json
{
  "mood_happy_morning": {
    "variants": [
      {
        "dialogues": [
          {"speaker": "Yui", "text": "早安..."},
          {"speaker": "玩家", "text": "睡得好吗？"},
          {"speaker": "Yui", "text": "嗯...", "options": [
            {"text": "选项A", "effects": {mood: +5}},
            {"text": "选项B", "effects": {mood: -3}}
          ]}
        ]
      }
    ]
  }
}
```

### 家具配置
```javascript
const FURNITURE = {
  "switch": {
    name: "Switch游戏机", 
    type: "continuous",
    price: 500,
    moodEffect: 2,
    behaviors: ["playing_games"]
  }
};
```

---

## 🚀 性能优化

### 1. 内存管理
- 定时清理不再使用的DOM元素
- 使用事件委托减少事件监听器数量
- 合理使用闭包避免内存泄漏

### 2. 渲染优化
- CSS动画使用transform和opacity（GPU加速）
- 避免频繁的DOM操作
- 使用requestAnimationFrame优化动画

### 3. 数据持久化
- 本地存储用于保存游戏进度
- 数据压缩减少存储空间
- 定期备份重要数据

---

## 🔍 调试和测试

### 调试面板功能
- 挂机速度倍率调整
- 数值直接修改（好感度、经验值）
- 时间模式切换（系统时间/自定义时间）
- 强制触发下一行为

### 测试策略
- 单元测试：每个系统的核心功能
- 集成测试：系统间交互
- 用户体验测试：交互流程和动画效果

---

## 📈 扩展性设计

### 模块化架构
- 每个系统独立，易于维护和扩展
- 统一的接口规范
- 插件式设计，支持功能扩展

### 配置驱动
- 所有数值和文本通过配置文件调整
- 支持热重载配置
- 易于平衡调整

### 国际化支持
- 文本内容与代码分离
- 支持多语言切换
- 本地化资源管理

---

## 🎯 总结

ProjectYeb采用现代化的前端技术栈，通过模块化设计和事件驱动架构实现了复杂的游戏系统。项目具有良好的可维护性、扩展性和性能表现，为后续功能迭代奠定了坚实基础。

**技术亮点**:
- 完整的模块化架构
- 响应式UI设计
- 流畅的动画效果
- 可配置的游戏平衡
- 完善的调试工具

**未来扩展**:
- 更多对话内容和事件
- 社交功能（好友系统）
- 成就系统
- 云端存档
- 移动端优化

---
*文档最后更新: 2025-10-26*
