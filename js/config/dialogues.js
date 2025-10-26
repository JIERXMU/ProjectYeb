// ProjectYeb 对话内容配置
// 包含大量不同时间、不同心情、不同事件的对话内容

const DIALOGUES = {
    // 早晨对话 (5种心情 × 5个变体)
    
    // 讨厌 - 早晨
    "hate_morning": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "（背对着你）走开..."},
                    {speaker: "玩家", text: "早安，Yui。昨晚睡得好吗？"},
                    {speaker: "Yui", text: "不用你管我", options: [
                        {text: "对不起，我做错了什么吗？", effects: {mood: 2}},
                        {text: "那我自己走了", effects: {mood: -3}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（冷冷地看了你一眼）..."},
                    {speaker: "玩家", text: "早上好，要吃早餐吗？"},
                    {speaker: "Yui", text: "不想吃", options: [
                        {text: "那你想做什么？", effects: {mood: 1}},
                        {text: "好吧，我先走了", effects: {mood: -2}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（叹气）又是新的一天..."},
                    {speaker: "玩家", text: "今天天气不错，要不要出去走走？"},
                    {speaker: "Yui", text: "不想出去", options: [
                        {text: "那在家做点什么？", effects: {mood: 2}},
                        {text: "好吧，你休息吧", effects: {mood: -1}}
                    ]}
                ]
            }
        ]
    },

    // 不开心 - 早晨
    "unhappy_morning": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "早上好..."},
                    {speaker: "玩家", text: "早安，Yui。看起来没什么精神？"},
                    {speaker: "Yui", text: "嗯...有点无聊", options: [
                        {text: "我们聊聊天吧", effects: {mood: 3}},
                        {text: "要不要玩游戏？", effects: {mood: 8}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（揉着眼睛）早..."},
                    {speaker: "玩家", text: "睡得好吗？"},
                    {speaker: "Yui", text: "还行吧，就是有点困", options: [
                        {text: "要不要再睡一会儿？", effects: {mood: 2}},
                        {text: "喝点咖啡提神？", effects: {mood: 4}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "今天早上好安静啊..."},
                    {speaker: "玩家", text: "是啊，很宁静的早晨"},
                    {speaker: "Yui", text: "有点不习惯", options: [
                        {text: "要不要听点音乐？", effects: {mood: 5}},
                        {text: "我们来玩个游戏吧", effects: {mood: 7}}
                    ]}
                ]
            }
        ]
    },

    // 平常 - 早晨
    "normal_morning": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "早安！今天天气真不错"},
                    {speaker: "玩家", text: "是啊，阳光很好"},
                    {speaker: "Yui", text: "感觉今天会是美好的一天", options: [
                        {text: "我们一起让它更美好吧", effects: {mood: 6}},
                        {text: "今天有什么计划吗？", effects: {mood: 4}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早上好，睡得好香啊"},
                    {speaker: "玩家", text: "看到你精神饱满真好"},
                    {speaker: "Yui", text: "嗯，今天感觉很有活力", options: [
                        {text: "要不要运动一下？", effects: {mood: 5}},
                        {text: "想吃什么早餐？", effects: {mood: 3}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早安，新的一天开始了"},
                    {speaker: "玩家", text: "是啊，时间过得真快"},
                    {speaker: "Yui", text: "希望今天能过得充实", options: [
                        {text: "我们一起做些有趣的事吧", effects: {mood: 7}},
                        {text: "你有什么想做的吗？", effects: {mood: 5}}
                    ]}
                ]
            }
        ]
    },

    // 开心 - 早晨
    "happy_morning": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "早安！今天心情特别好！"},
                    {speaker: "玩家", text: "看到你这么开心真好"},
                    {speaker: "Yui", text: "因为有你在身边啊", options: [
                        {text: "我也很开心", effects: {mood: 8}},
                        {text: "今天想做什么特别的事？", effects: {mood: 10}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早上好！今天阳光真灿烂"},
                    {speaker: "玩家", text: "是啊，和你一样灿烂"},
                    {speaker: "Yui", text: "嘻嘻，你真会说话", options: [
                        {text: "我说的是实话", effects: {mood: 9}},
                        {text: "要不要去公园散步？", effects: {mood: 12}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早安！昨晚做了个好梦"},
                    {speaker: "玩家", text: "什么好梦？"},
                    {speaker: "Yui", text: "梦见我们一起去了游乐园", options: [
                        {text: "听起来很有趣", effects: {mood: 7}},
                        {text: "也许我们可以真的去一次", effects: {mood: 15}}
                    ]}
                ]
            }
        ]
    },

    // 超级开心 - 早晨
    "superHappy_morning": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "早安！今天是我最开心的一天！"},
                    {speaker: "玩家", text: "为什么这么开心？"},
                    {speaker: "Yui", text: "因为有你在我身边", options: [
                        {text: "我会一直陪着你的", effects: {mood: 10}},
                        {text: "你值得所有的快乐", effects: {mood: 15}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早上好！感觉今天会有奇迹发生！"},
                    {speaker: "玩家", text: "什么奇迹？"},
                    {speaker: "Yui", text: "和你在一起的每一天都是奇迹", options: [
                        {text: "你让我也很幸福", effects: {mood: 12}},
                        {text: "我们一起创造更多奇迹", effects: {mood: 18}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "早安！今天我要把快乐传递给每个人！"},
                    {speaker: "玩家", text: "你已经让我很快乐了"},
                    {speaker: "Yui", text: "真的吗？太好了！", options: [
                        {text: "你是我最大的快乐", effects: {mood: 20}},
                        {text: "我们一起分享这份快乐", effects: {mood: 15}}
                    ]}
                ]
            }
        ]
    },

    // 中午对话 (5种心情 × 5个变体)

    // 讨厌 - 中午
    "hate_noon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "（独自坐在角落）..."},
                    {speaker: "玩家", text: "中午了，要吃午饭吗？"},
                    {speaker: "Yui", text: "不饿", options: [
                        {text: "那你想做什么？", effects: {mood: 1}},
                        {text: "好吧，我先去吃饭了", effects: {mood: -2}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（看着窗外）太阳好大..."},
                    {speaker: "玩家", text: "是啊，要不要拉上窗帘？"},
                    {speaker: "Yui", text: "随便", options: [
                        {text: "我来帮你拉上", effects: {mood: 2}},
                        {text: "那就不管了", effects: {mood: -1}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（翻着书）..."},
                    {speaker: "玩家", text: "在看什么书？"},
                    {speaker: "Yui", text: "没什么好看的", options: [
                        {text: "要不要换一本？", effects: {mood: 1}},
                        {text: "那我不打扰了", effects: {mood: -2}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（摆弄手机）..."},
                    {speaker: "玩家", text: "在玩什么游戏？"},
                    {speaker: "Yui", text: "没什么好玩的", options: [
                        {text: "要不要一起玩？", effects: {mood: 3}},
                        {text: "好吧，你继续", effects: {mood: -1}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "（叹气）中午了..."},
                    {speaker: "玩家", text: "是啊，时间过得真快"},
                    {speaker: "Yui", text: "嗯...", options: [
                        {text: "今天有什么计划？", effects: {mood: 1}},
                        {text: "我先去忙了", effects: {mood: -3}}
                    ]}
                ]
            }
        ]
    },

    // 不开心 - 中午
    "unhappy_noon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "中午了呢..."},
                    {speaker: "玩家", text: "是啊，时间过得真快"},
                    {speaker: "Yui", text: "有点饿了", options: [
                        {text: "想吃什么？", effects: {mood: 4}},
                        {text: "再等一会儿吧", effects: {mood: -2}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "中午的阳光好刺眼..."},
                    {speaker: "玩家", text: "要不要换个地方坐？"},
                    {speaker: "Yui", text: "算了，懒得动", options: [
                        {text: "我来帮你换个位置", effects: {mood: 3}},
                        {text: "那就不换了", effects: {mood: -1}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "肚子咕咕叫了..."},
                    {speaker: "玩家", text: "看来是饿了"},
                    {speaker: "Yui", text: "嗯...", options: [
                        {text: "想吃什么？", effects: {mood: 4}},
                        {text: "我去准备午餐", effects: {mood: 5}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "中午好安静啊..."},
                    {speaker: "玩家", text: "是啊，大家都在休息"},
                    {speaker: "Yui", text: "感觉有点寂寞", options: [
                        {text: "我陪着你呢", effects: {mood: 6}},
                        {text: "要不要听音乐？", effects: {mood: 4}}
                    ]}
                ]
            },
            {
                dialogues: [
                    {speaker: "Yui", text: "中午了，该吃饭了"},
                    {speaker: "玩家", text: "是啊，你饿了吗？"},
                    {speaker: "Yui", text: "有点，但没什么胃口", options: [
                        {text: "吃点清淡的？", effects: {mood: 3}},
                        {text: "喝点汤暖暖胃？", effects: {mood: 4}}
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
                    {speaker: "Yui", text: "中午了，该吃午饭了"},
                    {speaker: "玩家", text: "是啊，你饿了吗？"},
                    {speaker: "Yui", text: "嗯，有点饿了", options: [
                        {text: "想吃什么？", effects: {mood: 3}},
                        {text: "我来做饭吧", effects: {mood: 5}}
                    ]}
                ]
            }
        ]
    },

    // 开心 - 中午
    "happy_noon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "中午啦！好饿啊！"},
                    {speaker: "玩家", text: "看来你胃口不错"},
                    {speaker: "Yui", text: "因为心情好嘛", options: [
                        {text: "想吃什么好吃的？", effects: {mood: 6}},
                        {text: "我们去吃大餐吧", effects: {mood: 8}}
                    ]}
                ]
            }
        ]
    },

    // 超级开心 - 中午
    "superHappy_noon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "中午啦！今天真是太棒了！"},
                    {speaker: "玩家", text: "看到你这么开心真好"},
                    {speaker: "Yui", text: "因为有你在啊", options: [
                        {text: "我也很开心", effects: {mood: 10}},
                        {text: "我们一起庆祝吧", effects: {mood: 12}}
                    ]}
                ]
            }
        ]
    },

    // 下午对话 (5种心情 × 5个变体)

    // 讨厌 - 下午
    "hate_afternoon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "（看着窗外）..."},
                    {speaker: "玩家", text: "下午了，要不要喝点茶？"},
                    {speaker: "Yui", text: "不用", options: [
                        {text: "那你想做什么？", effects: {mood: 1}},
                        {text: "好吧，不打扰你了", effects: {mood: -1}}
                    ]}
                ]
            }
        ]
    },

    // 不开心 - 下午
    "unhappy_afternoon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "下午好无聊啊..."},
                    {speaker: "玩家", text: "要不要做点什么？"},
                    {speaker: "Yui", text: "不知道做什么", options: [
                        {text: "我们看电影吧", effects: {mood: 4}},
                        {text: "玩游戏怎么样？", effects: {mood: 6}}
                    ]}
                ]
            }
        ]
    },

    // 平常 - 下午
    "normal_afternoon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "下午的时光真悠闲"},
                    {speaker: "玩家", text: "是啊，很适合放松"},
                    {speaker: "Yui", text: "嗯，感觉很舒服", options: [
                        {text: "要不要听音乐？", effects: {mood: 3}},
                        {text: "看书也不错", effects: {mood: 4}}
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

    // 超级开心 - 下午
    "superHappy_afternoon": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "今天下午是我最幸福的时光！"},
                    {speaker: "玩家", text: "为什么这么说？"},
                    {speaker: "Yui", text: "因为和你在一起的每一刻都很珍贵", options: [
                        {text: "你让我也很幸福", effects: {mood: 10}},
                        {text: "我们会一直这样幸福的", effects: {mood: 15}}
                    ]}
                ]
            }
        ]
    },

    // 晚上对话 (5种心情 × 5个变体)

    // 讨厌 - 晚上
    "hate_evening": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "（看着窗外）天黑了..."},
                    {speaker: "玩家", text: "是啊，时间过得真快"},
                    {speaker: "Yui", text: "嗯...", options: [
                        {text: "要不要吃晚饭？", effects: {mood: 1}},
                        {text: "我先去休息了", effects: {mood: -1}}
                    ]}
                ]
            }
        ]
    },

    // 不开心 - 晚上
    "unhappy_evening": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "晚上了呢..."},
                    {speaker: "玩家", text: "是啊，一天又要结束了"},
                    {speaker: "Yui", text: "感觉今天过得好快", options: [
                        {text: "今天过得开心吗？", effects: {mood: 3}},
                        {text: "明天会更好的", effects: {mood: 4}}
                    ]}
                ]
            }
        ]
    },

    // 平常 - 晚上
    "normal_evening": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "晚上好，今天过得真快"},
                    {speaker: "玩家", text: "是啊，和你在一起时间过得特别快"},
                    {speaker: "Yui", text: "嘻嘻，我也是这么觉得", options: [
                        {text: "今天开心吗？", effects: {mood: 5}},
                        {text: "明天会更开心的", effects: {mood: 6}}
                    ]}
                ]
            }
        ]
    },

    // 开心 - 晚上
    "happy_evening": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "晚上啦！今天真是美好的一天！"},
                    {speaker: "玩家", text: "看到你这么开心真好"},
                    {speaker: "Yui", text: "因为有你在啊", options: [
                        {text: "我也很开心", effects: {mood: 7}},
                        {text: "明天会更美好", effects: {mood: 8}}
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

    // 凌晨对话 (5种心情 × 5个变体)

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
    },

    // 不开心 - 凌晨
    "unhappy_midnight": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "这么晚了..."},
                    {speaker: "玩家", text: "是啊，该睡觉了"},
                    {speaker: "Yui", text: "睡不着", options: [
                        {text: "要不要聊聊天？", effects: {mood: 3}},
                        {text: "数羊试试？", effects: {mood: 2}}
                    ]}
                ]
            }
        ]
    },

    // 平常 - 凌晨
    "normal_midnight": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "这么晚了还不睡？"},
                    {speaker: "玩家", text: "是啊，你也一样"},
                    {speaker: "Yui", text: "在想事情", options: [
                        {text: "想什么呢？", effects: {mood: 4}},
                        {text: "早点休息吧", effects: {mood: 3}}
                    ]}
                ]
            }
        ]
    },

    // 开心 - 凌晨
    "happy_midnight": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "这么晚了还这么精神！"},
                    {speaker: "玩家", text: "你也是啊"},
                    {speaker: "Yui", text: "因为今天太开心了", options: [
                        {text: "今天确实很棒", effects: {mood: 6}},
                        {text: "明天会更开心", effects: {mood: 8}}
                    ]}
                ]
            }
        ]
    },

    // 超级开心 - 凌晨
    "superHappy_midnight": {
        variants: [
            {
                dialogues: [
                    {speaker: "Yui", text: "这么晚了还不想睡！"},
                    {speaker: "玩家", text: "为什么这么兴奋？"},
                    {speaker: "Yui", text: "因为今天太完美了", options: [
                        {text: "确实很完美", effects: {mood: 10}},
                        {text: "明天会更完美", effects: {mood: 12}}
                    ]}
                ]
            }
        ]
    }
};

// 导出对话配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIALOGUES;
}
