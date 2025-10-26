// ProjectYeb 游戏文本配置
// 所有界面文本和对话内容集中管理

const TEXTS = {
    // 心情等级描述
    moodLevels: {
        hate: {
            name: "讨厌",
            description: "Yui现在很讨厌你...",
            color: "#ff4444",
            emoji: "🔴"
        },
        unhappy: {
            name: "不开心",
            description: "Yui看起来不太开心",
            color: "#ffaa00", 
            emoji: "🟡"
        },
        normal: {
            name: "平常",
            description: "Yui心情一般",
            color: "#44ff44",
            emoji: "🟢"
        },
        happy: {
            name: "开心", 
            description: "Yui很开心！",
            color: "#4444ff",
            emoji: "🔵"
        },
        superHappy: {
            name: "超级开心",
            description: "Yui超级开心！",
            color: "#aa44ff",
            emoji: "🟣"
        }
    },

    // 时间段描述
    timePeriods: {
        "早晨": {
            description: "清晨的阳光洒进房间",
            greeting: "早安..."
        },
        "中午": {
            description: "正午的阳光很温暖",
            greeting: "中午好..."
        },
        "下午": {
            description: "下午的时光很悠闲",
            greeting: "下午好..."
        },
        "晚上": {
            description: "夜晚的星空很美",
            greeting: "晚上好..."
        },
        "凌晨": {
            description: "深夜的宁静",
            greeting: "这么晚了..."
        }
    },

    // 行为描述
    behaviors: {
        // 基础行为
        "发呆": "Yui正在发呆...",
        "四处张望": "Yui好奇地四处张望",
        "打哈欠": "Yui打了个哈欠",
        "整理头发": "Yui在整理头发",
        "叹气": "Yui轻轻地叹了口气",
        
        // 家具相关行为
        "playing_games": "Yui在玩Switch游戏",
        "exercising": "Yui在跑步机上运动",
        "sleeping": "Yui正在睡觉",
        "listening_music": "Yui在听音乐",
        "reading_books": "Yui在看书"
    },

    // 界面文本
    ui: {
        buttons: {
            talk: "对话",
            gift: "礼物", 
            wardrobe: "衣柜",
            house: "房屋",
            shop: "商城",
            music: "音乐",
            dialogueNext: "继续",
            dialogueClose: "关闭",
            applyDebug: "应用修改",
            nextBehavior: "下一行为"
        },
        labels: {
            level: "等级",
            mood: "心情", 
            coins: "金币",
            time: "时间",
            idleMultiplier: "挂机倍率",
            debugMood: "心情值",
            debugExp: "经验值",
            debugCoins: "金币"
        },
        notifications: {
            levelUp: "升级了！达到等级 {level}",
            coinsEarned: "获得 {amount} 金币",
            moodChanged: "心情{change}了 {amount} 点",
            furniturePlaced: "放置了 {name}",
            furnitureRemoved: "收回了 {name}",
            giftGiven: "送出了礼物",
            eventTriggered: "特殊事件触发！"
        }
    },

    // 对话系统文本
    dialogues: {
        // 对话键格式: mood_time
        // 心情: hate, unhappy, normal, happy, superHappy
        // 时间: morning, noon, afternoon, evening, midnight
        
        // 不开心 - 早晨
        "unhappy_morning": {
            variants: [
                {
                    dialogues: [
                        {speaker: "Yui", text: "（背对着你）..."},
                        {speaker: "玩家", text: "早安，Yui。睡得好吗？"},
                        {speaker: "Yui", text: "嗯...还行吧", options: [
                            {text: "今天想做什么？", effects: {mood: 2}},
                            {text: "要不要吃早餐？", effects: {mood: 5}}
                        ]}
                    ]
                },
                {
                    dialogues: [
                        {speaker: "Yui", text: "早上好..."},
                        {speaker: "玩家", text: "看起来你没什么精神"},
                        {speaker: "Yui", text: "只是有点无聊", options: [
                            {text: "我们聊聊天吧", effects: {mood: 3}},
                            {text: "要不要玩游戏？", effects: {mood: 8}}
                        ]}
                    ]
                }
            ]
        },

        // 平常 - 中午  
        "normal_noon": {
            variants: [
                {
                    dialogues: [
                        {speaker: "Yui", text: "中午了呢..."},
                        {speaker: "玩家", text: "时间过得真快"},
                        {speaker: "Yui", text: "是啊，有点饿了", options: [
                            {text: "想吃什么？", effects: {mood: 4}},
                            {text: "再等一会儿吧", effects: {mood: -2}}
                        ]}
                    ]
                }
            ]
        },

        // 开心 - 下午
        "happy_afternoon": {
            variants: [
                {
                    dialogues: [
                        {speaker: "Yui", text: "今天下午好舒服啊！"},
                        {speaker: "玩家", text: "看到你这么开心真好"},
                        {speaker: "Yui", text: "因为有你在嘛", options: [
                            {text: "我也很开心", effects: {mood: 5}},
                            {text: "我们去散步吧", effects: {mood: 8}}
                        ]}
                    ]
                }
            ]
        },

        // 超级开心 - 晚上
        "superHappy_evening": {
            variants: [
                {
                    dialogues: [
                        {speaker: "Yui", text: "今天是我最开心的一天！"},
                        {speaker: "玩家", text: "看到你这样的笑容真好"},
                        {speaker: "Yui", text: "谢谢你一直陪着我", options: [
                            {text: "我会一直陪着你的", effects: {mood: 10}},
                            {text: "你值得所有的快乐", effects: {mood: 15}}
                        ]}
                    ]
                }
            ]
        },

        // 讨厌 - 凌晨
        "hate_midnight": {
            variants: [
                {
                    dialogues: [
                        {speaker: "Yui", text: "（冷冷地看着你）..."},
                        {speaker: "玩家", text: "这么晚了还不睡吗？"},
                        {speaker: "Yui", text: "不用你管", options: [
                            {text: "对不起...", effects: {mood: 1}},
                            {text: "早点休息吧", effects: {mood: -5}}
                        ]}
                    ]
                }
            ]
        }
    },

    // 特殊事件文本
    events: {
        "mood_max": {
            title: "特别的时刻",
            description: "Yui的心情达到了最高点！",
            dialogues: [
                {speaker: "Yui", text: "今天真的是特别的一天..."},
                {speaker: "玩家", text: "怎么了？"},
                {speaker: "Yui", text: "因为有你在，让我感受到了真正的幸福"},
                {speaker: "玩家", text: "（感动）..."},
                {speaker: "Yui", text: "谢谢你，让我重新相信了温暖"}
            ],
            rewards: {
                coins: 100,
                mood: 5
            }
        },
        "level_5": {
            title: "成长的证明",
            description: "Yui达到了5级！",
            dialogues: [
                {speaker: "Yui", text: "我好像变得更懂事了..."},
                {speaker: "玩家", text: "你一直在成长呢"},
                {speaker: "Yui", text: "都是因为你的照顾"}
            ],
            rewards: {
                coins: 50,
                mood: 10
            }
        }
    },

    // 家具描述文本
    furniture: {
        switch: {
            name: "Switch游戏机",
            description: "Yui最喜欢的游戏机，可以玩各种有趣的游戏",
            interaction: "Yui开心地玩着游戏"
        },
        treadmill: {
            name: "跑步机", 
            description: "让Yui保持健康的运动设备",
            interaction: "Yui在跑步机上运动"
        },
        bed: {
            name: "舒适床铺",
            description: "Yui休息的地方，柔软的床铺让人安心",
            interaction: "Yui在床上休息"
        },
        mp3: {
            name: "MP3播放器",
            description: "可以播放Yui喜欢的音乐",
            interaction: "Yui戴着耳机听音乐"
        },
        harry_potter: {
            name: "哈利波特全集",
            description: "Yui最喜欢的魔法故事书",
            interaction: "Yui沉浸在书的世界里"
        }
    },

    // 错误和提示信息
    errors: {
        insufficientCoins: "金币不足！",
        inventoryFull: "背包已满！",
        furnitureLimit: "房间家具数量已达上限",
        invalidAction: "无法执行此操作",
        saveFailed: "保存失败，请检查存储空间"
    },

    // 帮助文本
    help: {
        gameDescription: "照顾收养的女儿Yui，通过互动提升她的心情值",
        controls: "点击按钮与Yui互动，购买家具装饰房间",
        tips: [
            "经常与Yui对话可以提升心情",
            "购买家具可以解锁新的行为",
            "注意Yui的心情变化，及时互动",
            "等级提升会增加挂机收益"
        ]
    }
};

// 导出文本配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEXTS;
}
