# ProjectYeb - 挂机养成网页游戏

## 项目概述
- **游戏类型**: 挂机养成网页游戏
- **核心玩法**: 照顾收养的女儿Yui，通过互动提升心情值，解锁家具和对话
- **技术栈**: HTML + CSS + JavaScript

## 开发进度
- [ ] 第一阶段：核心框架
  - [ ] 基础UI布局 + 时间系统
  - [ ] 挂机系统 + 本地存储
  - [ ] 数值配置系统
- [ ] 第二阶段：核心玩法
  - [ ] 心情系统 + 行为系统
  - [ ] 对话系统基础框架
  - [ ] 调试面板
- [ ] 第三阶段：扩展系统
  - [ ] 家具系统 + 房间布置
  - [ ] 商店系统 + 道具系统
  - [ ] 礼物系统 + 对话触发
- [ ] 第四阶段：内容完善
  - [ ] 对话内容填充
  - [ ] 特殊事件系统
  - [ ] 视觉优化 + 音效

## 文件结构
```
ProjectYeb/
├── index.html
├── css/
│   ├── style.css
│   └── components/
│       ├── ui.css
│       ├── dialogue.css
│       └── themes.css
├── js/
│   ├── main.js
│   ├── config/
│   │   ├── gameData.js
│   │   └── gameTexts.js
│   ├── systems/
│   │   ├── idleSystem.js
│   │   ├── levelSystem.js
│   │   ├── currencySystem.js
│   │   ├── dialogueSystem.js
│   │   ├── moodSystem.js
│   │   ├── behaviorSystem.js
│   │   ├── furnitureSystem.js
│   │   ├── shopSystem.js
│   │   ├── timeSystem.js
│   │   └── eventSystem.js
│   └── ui/
│       ├── debugPanel.js
│       ├── notification.js
│       └── uiManager.js
└── data/
    └── dialogues.json
