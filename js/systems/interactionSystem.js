// 交互系统
// 负责处理摸摸头等特殊交互

class InteractionSystem {
    constructor() {
        this.availableThoughts = {
            hate: [
                "别碰我...",
                "走开...",
                "不想理你...",
                "讨厌...",
                "离我远点..."
            ],
            unhappy: [
                "嗯...",
                "有点无聊...",
                "没什么特别的感觉...",
                "还行吧...",
                "一般般..."
            ],
            normal: [
                "感觉还不错",
                "挺舒服的",
                "谢谢你的关心",
                "感觉被照顾了",
                "心情好了一些"
            ],
            happy: [
                "嘻嘻，好开心！",
                "感觉好温暖",
                "最喜欢这样了",
                "好舒服啊",
                "谢谢你关心我"
            ],
            superHappy: [
                "太幸福了！",
                "感觉自己是世界上最幸福的人！",
                "好开心好开心！",
                "谢谢你让我这么快乐！",
                "这一刻太美好了！"
            ]
        };
        
        this.usedThoughts = {
            hate: [],
            unhappy: [],
            normal: [],
            happy: [],
            superHappy: []
        };
        
        this.isPatting = false; // 防止重复点击
        
        this.initialize();
    }

    // 初始化交互系统
    initialize() {
        this.setupEventListeners();
        console.log('交互系统初始化完成');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击状态窗口摸摸头
        const statusWindow = document.getElementById('yui-status-window');
        if (statusWindow) {
            statusWindow.addEventListener('click', () => {
                this.patHead();
            });
            
            // 添加触摸反馈样式
            statusWindow.style.cursor = 'pointer';
            statusWindow.title = '点击摸摸头';
        }
    }

    // 摸摸头功能
    patHead() {
        // 防止重复点击
        if (this.isPatting) {
            return;
        }
        
        this.isPatting = true;
        
        const moodLevel = window.gameSystems?.moodSystem?.getMoodLevel() || 'unhappy';
        
        // 获取当前心情对应的想法
        const thought = this.getRandomThought(moodLevel);
        
        // 显示想法窗口
        this.showThoughtWindow(thought, moodLevel);
        
        // 根据心情给予不同的心情加成
        this.applyPatHeadEffect(moodLevel);
        
        // 播放状态窗口动画
        this.playStatusWindowAnimation(moodLevel);
        
        console.log(`摸摸头，心情: ${moodLevel}, 想法: ${thought}`);
        
        // 1秒后允许再次点击
        setTimeout(() => {
            this.isPatting = false;
        }, 1000);
    }

    // 播放状态窗口动画
    playStatusWindowAnimation(moodLevel) {
        const statusWindow = document.getElementById('yui-status-window');
        const statusEmoji = document.getElementById('yui-status-emoji');
        const statusText = document.getElementById('current-behavior');
        
        // 播放点击动画效果
        this.playClickAnimation(statusWindow, statusEmoji, statusText);
    }

    // 播放点击动画效果
    playClickAnimation(statusWindow, statusEmoji, statusText) {
        if (statusWindow) {
            statusWindow.classList.add('click-animation');
            setTimeout(() => {
                statusWindow.classList.remove('click-animation');
            }, 300);
        }
        
        if (statusEmoji) {
            statusEmoji.classList.add('click-animation');
            setTimeout(() => {
                statusEmoji.classList.remove('click-animation');
            }, 500);
        }
        
        if (statusText) {
            statusText.classList.add('click-animation');
            setTimeout(() => {
                statusText.classList.remove('click-animation');
            }, 400);
        }
    }

    // 获取随机想法（不放回随机）
    getRandomThought(moodLevel) {
        const available = this.availableThoughts[moodLevel];
        const used = this.usedThoughts[moodLevel];
        
        // 如果所有想法都用过了，重置
        if (used.length >= available.length) {
            this.usedThoughts[moodLevel] = [];
        }
        
        // 获取未使用的想法
        const unusedThoughts = available.filter(thought => !used.includes(thought));
        
        if (unusedThoughts.length === 0) {
            // 如果所有想法都用过了，随机选择一个
            const randomIndex = Math.floor(Math.random() * available.length);
            return available[randomIndex];
        }
        
        // 从未使用的想法中随机选择一个
        const randomIndex = Math.floor(Math.random() * unusedThoughts.length);
        const selectedThought = unusedThoughts[randomIndex];
        
        // 标记为已使用
        this.usedThoughts[moodLevel].push(selectedThought);
        
        return selectedThought;
    }

    // 显示想法窗口
    showThoughtWindow(thought, moodLevel) {
        // 创建想法窗口
        let thoughtWindow = document.getElementById('thought-window');
        
        if (!thoughtWindow) {
            thoughtWindow = document.createElement('div');
            thoughtWindow.id = 'thought-window';
            thoughtWindow.className = 'thought-window';
            document.getElementById('core-area').appendChild(thoughtWindow);
        }
        
        // 设置内容和样式
        thoughtWindow.textContent = thought;
        thoughtWindow.className = `thought-window thought-${moodLevel}`;
        
        // 显示窗口
        thoughtWindow.classList.remove('hidden');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            thoughtWindow.classList.add('hidden');
        }, 3000);
        
        // 添加动画效果
        thoughtWindow.classList.add('thought-fade-in');
        setTimeout(() => {
            thoughtWindow.classList.remove('thought-fade-in');
        }, 500);
    }

    // 应用摸摸头效果
    applyPatHeadEffect(moodLevel) {
        const moodEffects = {
            hate: 1,        // 讨厌：轻微提升
            unhappy: 2,     // 不开心：小提升
            normal: 3,      // 平常：中等提升
            happy: 4,       // 开心：较大提升
            superHappy: 5   // 超级开心：大幅提升
        };
        
        const moodChange = moodEffects[moodLevel] || 2;
        
        if (window.gameSystems?.moodSystem) {
            window.gameSystems.moodSystem.changeMood(moodChange, 'pat_head');
        }
        
        // 显示通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `摸摸头！心情+${moodChange}`,
                'success'
            );
        }
    }

    // 获取交互统计
    getInteractionStats() {
        const stats = {};
        for (const moodLevel in this.availableThoughts) {
            stats[moodLevel] = {
                total: this.availableThoughts[moodLevel].length,
                used: this.usedThoughts[moodLevel].length,
                remaining: this.availableThoughts[moodLevel].length - this.usedThoughts[moodLevel].length
            };
        }
        return stats;
    }

    // 重置想法使用记录
    resetThoughts() {
        for (const moodLevel in this.usedThoughts) {
            this.usedThoughts[moodLevel] = [];
        }
        console.log('想法使用记录已重置');
    }

    // 暂停交互系统
    pause() {
        // 交互系统不需要特殊的暂停逻辑
    }

    // 恢复交互系统
    resume() {
        // 交互系统不需要特殊的恢复逻辑
    }

    // 销毁交互系统
    destroy() {
        this.pause();
        // 移除想法窗口
        const thoughtWindow = document.getElementById('thought-window');
        if (thoughtWindow) {
            thoughtWindow.remove();
        }
    }
}

// 创建全局交互系统实例
let interactionSystem = null;

// 初始化交互系统
function initializeInteractionSystem() {
    if (!interactionSystem) {
        interactionSystem = new InteractionSystem();
    }
    return interactionSystem;
}

// 导出交互系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractionSystem, initializeInteractionSystem };
}
