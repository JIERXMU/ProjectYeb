// ProjectYeb 游戏数值配置
// 所有游戏数值集中管理，便于调整和平衡

const CONFIG = {
    // 挂机系统配置
    idle: {
        // 基础挂机收益（每秒）- 大幅提升让玩家快速上手
        baseExpPerSecond: 5.0,    // 从1.0提升到5.0
        baseCoinsPerSecond: 20.0, // 从2.0提升到20.0
        
        // 等级对挂机收益的加成系数
        levelBonusMultiplier: 0.2, // 从0.1提升到0.2
        
        // 离线收益计算（分钟）
        offlineMaxMinutes: 1440, // 24小时
        offlineEfficiency: 0.8,  // 离线效率为在线的80%
        
        // 测试阶段：每次刷新重置数据
        resetOnRefresh: true
    },
    
    // 等级系统配置
    levels: {
        // 等级经验需求表 (从1级开始)
        expRequirements: [
            0,      // 1级
            100,    // 2级
            250,    // 3级
            500,    // 4级
            1000,   // 5级
            2000,   // 6级
            4000,   // 7级
            8000,   // 8级
            16000,  // 9级
            32000,  // 10级
            64000,  // 11级
            128000, // 12级
            256000, // 13级
            512000, // 14级
            1024000 // 15级
        ],
        
        // 升级奖励
        levelUpReward: {
            coins: 50, // 每次升级获得金币
            moodBonus: 5 // 每次升级心情加成
        },
        
        // 最大等级
        maxLevel: 15
    },
    
    // 心情系统配置
    mood: {
        // 心情值范围
        minMood: 0,
        maxMood: 100,
        
        // 心情等级划分
        thresholds: {
            hate: 20,      // 0-20: 讨厌
            unhappy: 60,   // 20-60: 不开心/无聊
            normal: 80,    // 60-80: 平常
            happy: 99,     // 80-99: 开心
            superHappy: 100 // 100+: 超级开心
        },
        
        // 自然衰减速率（每分钟）
        decayRates: {
            superHappy: 4,   // 超级开心：每分钟-4
            happy: 4,        // 开心：每分钟-4
            normal: 3,       // 平常：每分钟-3
            unhappy: 2,      // 不开心/无聊：每分钟-2
            hate: 0.1        // 讨厌：每10分钟-1 (0.1/分钟)
        },
        
        // 超级开心持续时间（分钟）
        superHappyDuration: 10,
        
        // 初始心情值
        initialMood: 40
    },
    
    // 金币系统配置
    currency: {
        // 初始金币 - 增加初始金币让玩家快速购买物品
        initialCoins: 200,
        
        // 金币获取途径倍率
        multipliers: {
            idle: 1.0,      // 挂机
            levelUp: 2.0,   // 升级 - 从1.0提升到2.0
            event: 3.0,     // 事件 - 从2.0提升到3.0
            dialogue: 2.0   // 对话选项 - 从1.5提升到2.0
        }
    },
    
    // 时间系统配置
    time: {
        // 时间段划分
        periods: [
            { name: "早晨", start: 6, end: 10 },   // 6:00-10:59
            { name: "中午", start: 11, end: 13 },  // 11:00-13:59
            { name: "下午", start: 14, end: 17 },  // 14:00-17:59
            { name: "晚上", start: 18, end: 21 },  // 18:00-21:59
            { name: "凌晨", start: 22, end: 5 }    // 22:00-5:59
        ],
        
        // 时间段对应的主题类名
        themeClasses: {
            "早晨": "theme-morning",
            "中午": "theme-noon", 
            "下午": "theme-afternoon",
            "晚上": "theme-evening",
            "凌晨": "theme-midnight"
        },
        
        // 行为切换间隔（秒）
        behaviorChangeInterval: 30
    },
    
    // 行为系统配置
    behaviors: {
        // 基础行为（无家具时）
        baseBehaviors: [
            "发呆",
            "四处张望", 
            "打哈欠",
            "整理头发",
            "叹气"
        ],
        
        // 行为持续时间范围（秒）
        durationRange: {
            min: 20,
            max: 60
        }
    },
    
    // 家具系统配置
    furniture: {
        // 家具类型
        types: {
            continuous: "continuous", // 持续互动型
            instant: "instant"       // 单次互动型
        },
        
        // 示例家具配置
        examples: {
            "switch": {
                name: "Switch游戏机",
                type: "continuous",
                price: 500,
                moodEffect: 2, // 每分钟心情变化
                behaviors: ["playing_games"],
                description: "Yui喜欢玩的游戏机"
            },
            "treadmill": {
                name: "跑步机", 
                type: "continuous",
                price: 300,
                moodEffect: 1,
                behaviors: ["exercising"],
                description: "让Yui保持健康的跑步机"
            },
            "bed": {
                name: "舒适床铺",
                type: "instant", 
                price: 200,
                moodEffect: 10, // 单次心情提升
                behaviors: ["sleeping"],
                description: "Yui休息的地方"
            },
            "mp3": {
                name: "MP3播放器",
                type: "continuous",
                price: 150,
                moodEffect: 1,
                behaviors: ["listening_music"],
                description: "Yui听音乐用的播放器"
            },
            "harry_potter": {
                name: "哈利波特全集",
                type: "continuous", 
                price: 400,
                moodEffect: 1,
                behaviors: ["reading_books"],
                description: "Yui最喜欢的书籍"
            }
        }
    },
    
    // 商店系统配置
    shop: {
        // 商品分类
        categories: {
            furniture: "家具",
            gifts: "礼物", 
            items: "道具"
        },
        
        // 商品配置
        items: {
            // 家具类商品
            "switch": {
                id: "switch",
                name: "Switch游戏机",
                category: "furniture",
                price: 500,
                description: "Yui喜欢玩的游戏机",
                effects: "持续互动：暂停心情衰减"
            },
            "treadmill": {
                id: "treadmill",
                name: "跑步机",
                category: "furniture",
                price: 300,
                description: "让Yui保持健康的跑步机",
                effects: "持续互动：暂停心情衰减"
            },
            "bed": {
                id: "bed",
                name: "舒适床铺",
                category: "furniture",
                price: 200,
                description: "Yui休息的地方",
                effects: "单次互动：心情+10"
            },
            "mp3": {
                id: "mp3",
                name: "MP3播放器",
                category: "furniture",
                price: 150,
                description: "Yui听音乐用的播放器",
                effects: "持续互动：暂停心情衰减"
            },
            "harry_potter": {
                id: "harry_potter",
                name: "哈利波特全集",
                category: "furniture",
                price: 400,
                description: "Yui最喜欢的书籍",
                effects: "持续互动：暂停心情衰减"
            },
            
            // 礼物类商品 - 大幅增加种类
            "chocolate": {
                id: "chocolate",
                name: "巧克力",
                category: "gifts",
                price: 50,
                description: "甜甜的巧克力，Yui很喜欢",
                effects: "赠送：心情+5"
            },
            "teddy_bear": {
                id: "teddy_bear",
                name: "泰迪熊",
                category: "gifts",
                price: 100,
                description: "可爱的毛绒玩具",
                effects: "赠送：心情+8"
            },
            "flowers": {
                id: "flowers",
                name: "鲜花",
                category: "gifts",
                price: 80,
                description: "美丽的花束",
                effects: "赠送：心情+6"
            },
            "ice_cream": {
                id: "ice_cream",
                name: "冰淇淋",
                category: "gifts",
                price: 40,
                description: "清凉的冰淇淋，夏天最爱",
                effects: "赠送：心情+4"
            },
            "book": {
                id: "book",
                name: "故事书",
                category: "gifts",
                price: 120,
                description: "有趣的童话故事书",
                effects: "赠送：心情+7"
            },
            "necklace": {
                id: "necklace",
                name: "项链",
                category: "gifts",
                price: 200,
                description: "漂亮的银项链",
                effects: "赠送：心情+12"
            },
            "cake": {
                id: "cake",
                name: "蛋糕",
                category: "gifts",
                price: 150,
                description: "美味的生日蛋糕",
                effects: "赠送：心情+10"
            },
            "music_box": {
                id: "music_box",
                name: "音乐盒",
                category: "gifts",
                price: 180,
                description: "会播放美妙音乐的音乐盒",
                effects: "赠送：心情+9"
            },
            "photo_frame": {
                id: "photo_frame",
                name: "相框",
                category: "gifts",
                price: 90,
                description: "可以放照片的相框",
                effects: "赠送：心情+6"
            },
            "stuffed_cat": {
                id: "stuffed_cat",
                name: "毛绒猫咪",
                category: "gifts",
                price: 130,
                description: "可爱的猫咪玩偶",
                effects: "赠送：心情+8"
            },
            
            // 道具类商品
            "mood_boost": {
                id: "mood_boost",
                name: "心情提升剂",
                category: "items",
                price: 30,
                description: "立即提升心情",
                effects: "立即使用：心情+15"
            },
            "exp_boost": {
                id: "exp_boost",
                name: "经验加成剂",
                category: "items",
                price: 40,
                description: "立即获得经验",
                effects: "立即使用：经验+50"
            },
            "coin_boost": {
                id: "coin_boost",
                name: "金币加成剂",
                category: "items",
                price: 25,
                description: "立即获得金币",
                effects: "立即使用：金币+100"
            }
        }
    },
    
    // 调试系统配置
    debug: {
        // 默认倍率
        defaultMultiplier: 1,
        
        // 允许的倍率范围
        multiplierRange: {
            min: 0.1,
            max: 100
        },
        
        // 快捷键
        shortcuts: {
            toggleDebug: "F12",      // 切换调试面板
            forceDialogue: "F11",    // 强制触发对话
            resetGame: "F10"         // 重置游戏
        }
    },
    
    // 专注力系统配置
    focus: {
        // 基础专注力变化速率（每分钟）
        baseRecoveryRate: 1,    // 每分钟恢复1点专注力
        baseConsumptionRate: 2, // 每分钟消耗2点专注力
        
        // 调试倍率范围
        debugMultiplierRange: {
            min: 0.1,
            max: 10.0
        },
        
        // 默认调试倍率
        defaultDebugMultiplier: 1.0
    },
    
    // 游戏平衡参数
    balance: {
        // 目标：100分钟内达到开心状态
        targetTimeToHappy: 100, // 分钟
        
        // 前期快速升级，后期缓慢成长
        progressionCurve: "exponential",
        
        // 关键数值标识
        criticalValues: {
            moodHappyThreshold: 80,
            levelFastGrowthEnd: 5,
            furnitureUnlockLevel: 3
        }
    }
};

// 阶段一：新系统扩展配置

// 职业系统配置
const CAREERS = {
    'intern': { 
        name: '实习生', 
        baseIncome: 10, 
        focusCost: 2,
        requiredLevel: 1,
        description: '基础工作，收入稳定'
    },
    'assistant': { 
        name: '助理', 
        baseIncome: 20, 
        focusCost: 3,
        requiredLevel: 3,
        description: '协助工作，收入较高'
    },
    'specialist': { 
        name: '专员', 
        baseIncome: 35, 
        focusCost: 4,
        requiredLevel: 5,
        description: '专业工作，收入可观'
    },
    'manager': { 
        name: '经理', 
        baseIncome: 55, 
        focusCost: 5,
        requiredLevel: 8,
        description: '管理职位，收入丰厚'
    },
    'director': { 
        name: '总监', 
        baseIncome: 80, 
        focusCost: 6,
        requiredLevel: 12,
        description: '高级管理，顶级收入'
    }
};

// 技能树配置
const SKILLS = {
    'efficiency': { 
        name: '工作效率', 
        maxLevel: 10, 
        effect: 0.05,
        description: '提升打工收入效率',
        costPerLevel: 1
    },
    'focus': { 
        name: '专注力', 
        maxLevel: 5, 
        effect: -0.1,
        description: '降低专注力消耗',
        costPerLevel: 2
    },
    'recovery': { 
        name: '恢复力', 
        maxLevel: 5, 
        effect: 0.2,
        description: '提升专注力恢复速度',
        costPerLevel: 2
    },
    'endurance': { 
        name: '持久力', 
        maxLevel: 3, 
        effect: 0.5,
        description: '提升专注力上限',
        costPerLevel: 3
    }
};

// 任务系统配置
const TASKS = {
    daily: [
        {
            id: 'daily_pat_head',
            name: '日常关怀',
            description: '对Yui进行5次摸摸头',
            type: 'interaction',
            target: 5,
            reward: { coins: 50, exp: 10 }
        },
        {
            id: 'daily_dialogue',
            name: '日常交流',
            description: '与Yui进行3次对话',
            type: 'dialogue',
            target: 3,
            reward: { coins: 30, exp: 15 }
        },
        {
            id: 'daily_work',
            name: '日常工作',
            description: '完成1次打工',
            type: 'career',
            target: 1,
            reward: { coins: 20, exp: 5 }
        }
    ],
    promotion: [
        {
            id: 'promotion_level3',
            name: '职场晋升',
            description: '达到职业等级3级',
            type: 'career_level',
            target: 3,
            reward: { coins: 200, skillPoint: 1 }
        },
        {
            id: 'promotion_level5',
            name: '职场精英',
            description: '达到职业等级5级',
            type: 'career_level',
            target: 5,
            reward: { coins: 500, skillPoint: 2 }
        },
        {
            id: 'promotion_level8',
            name: '职场专家',
            description: '达到职业等级8级',
            type: 'career_level',
            target: 8,
            reward: { coins: 1000, skillPoint: 3 }
        }
    ],
    achievements: [
        {
            id: 'achievement_first_work',
            name: '初次打工',
            description: '完成第一次打工',
            type: 'career_first',
            target: 1,
            reward: { coins: 100, exp: 50 }
        },
        {
            id: 'achievement_skill_master',
            name: '技能大师',
            description: '将一个技能升到满级',
            type: 'skill_max',
            target: 1,
            reward: { coins: 300, skillPoint: 5 }
        },
        {
            id: 'achievement_task_complete',
            name: '任务达人',
            description: '完成10个任务',
            type: 'task_count',
            target: 10,
            reward: { coins: 500, exp: 100 }
        }
    ]
};

// 舒适度系统配置
const COMFORT_CONFIG = {
    // 舒适度加成系数
    bonusMultiplier: 0.01, // 每点舒适度提供1%加成
    maxBonus: 0.5,        // 最大加成50%
    
    // 家具舒适度值
    furnitureComfort: {
        'bed': 10,
        'switch': 5,
        'treadmill': 3,
        'mp3': 4,
        'harry_potter': 6
    }
};

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CONFIG, 
        CAREERS, 
        SKILLS, 
        TASKS, 
        COMFORT_CONFIG 
    };
}
