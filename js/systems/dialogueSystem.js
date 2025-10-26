// 对话系统
// 负责管理对话的显示、选项选择和效果应用

class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.currentDialogueIndex = 0;
        this.isTyping = false;
        this.isDialogueEnded = false; // 对话是否结束
        this.typingSpeed = 30; // 毫秒每字符
        this.typingInterval = null;
        
        this.initialize();
    }

    // 初始化对话系统
    initialize() {
        this.setupEventListeners();
        console.log('对话系统初始化完成');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击对话窗口继续
        const dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.addEventListener('click', (event) => {
                if (event.target === dialogueContainer) {
                    // 只有在对话结束后才允许点击外部关闭
                    if (this.isDialogueEnded) {
                        this.closeDialogue();
                    }
                } else if (event.target.closest('.dialogue-content')) {
                    // 点击对话内容区域继续下一句
                    // 只有在没有选项显示时才允许继续
                    const dialogueOptions = document.getElementById('dialogue-options');
                    if (!dialogueOptions || dialogueOptions.children.length === 0) {
                        this.nextDialogue();
                    }
                }
            });
        }
        
        // 添加全局点击事件监听器，用于点击框外区域关闭对话
        document.addEventListener('click', (event) => {
            const dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer && !dialogueContainer.classList.contains('hidden')) {
                if (!dialogueContainer.contains(event.target)) {
                    // 点击了对话框外区域
                    if (this.isDialogueEnded) {
                        this.closeDialogue();
                    }
                }
            }
        });
    }

    // 开始随机对话
    startRandomDialogue() {
        const moodLevel = window.gameSystems?.moodSystem?.getMoodLevel() || 'unhappy';
        const timePeriod = window.gameSystems?.timeSystem?.getCurrentPeriod() || '早晨';
        
        // 将中文时间段转换为英文键
        const timeKeyMap = {
            '早晨': 'morning',
            '中午': 'noon',
            '下午': 'afternoon',
            '晚上': 'evening',
            '凌晨': 'midnight'
        };
        
        const timeKey = timeKeyMap[timePeriod] || 'morning';
        const dialogueKey = `${moodLevel}_${timeKey}`;
        
        console.log(`开始对话，键: ${dialogueKey}, 心情: ${moodLevel}, 时间: ${timePeriod}`);
        
        this.startDialogueByKey(dialogueKey);
    }

    // 根据键开始对话
    startDialogueByKey(dialogueKey) {
        // 首先尝试从新的对话配置中查找
        let dialogueConfig = DIALOGUES[dialogueKey];
        
        // 如果找不到，尝试从旧的文本配置中查找
        if (!dialogueConfig && TEXTS.dialogues) {
            dialogueConfig = TEXTS.dialogues[dialogueKey];
        }
        
        if (!dialogueConfig || !dialogueConfig.variants || dialogueConfig.variants.length === 0) {
            console.warn(`找不到对话配置: ${dialogueKey}`);
            this.showDefaultDialogue();
            return;
        }
        
        // 随机选择一个对话变体
        const randomVariant = dialogueConfig.variants[
            Math.floor(Math.random() * dialogueConfig.variants.length)
        ];
        
        this.startDialogue(randomVariant);
    }

    // 开始事件对话
    startEventDialogue(eventConfig) {
        if (!eventConfig.dialogues) {
            console.warn('事件对话配置无效');
            return;
        }
        
        const dialogueVariant = {
            dialogues: eventConfig.dialogues
        };
        
        this.startDialogue(dialogueVariant, true); // true 表示是事件对话
    }

    // 开始自定义对话
    startCustomDialogue(dialogues) {
        const dialogueVariant = {
            dialogues: dialogues
        };
        
        this.startDialogue(dialogueVariant, false);
    }

    // 开始对话
    startDialogue(dialogueVariant, isEvent = false) {
        if (!dialogueVariant.dialogues || dialogueVariant.dialogues.length === 0) {
            console.warn('对话变体无效');
            return;
        }
        
        this.currentDialogue = dialogueVariant;
        this.currentDialogueIndex = 0;
        
        this.showDialogueWindow();
        this.displayCurrentDialogueLine();
        
        console.log(`开始${isEvent ? '事件' : ''}对话，共${dialogueVariant.dialogues.length}句`);
    }

    // 显示默认对话
    showDefaultDialogue() {
        const defaultDialogue = {
            dialogues: [
                {speaker: "Yui", text: "..."},
                {speaker: "玩家", text: "怎么了？"},
                {speaker: "Yui", text: "没什么..."}
            ]
        };
        
        this.startDialogue(defaultDialogue);
    }

    // 显示对话窗口
    showDialogueWindow() {
        const dialogueContainer = document.getElementById('dialogue-container');
        const roomContainer = document.getElementById('room-container');
        
        if (dialogueContainer && roomContainer) {
            dialogueContainer.classList.remove('hidden');
            roomContainer.classList.add('hidden');
            
            // 添加动画效果
            dialogueContainer.classList.add('dialogue-fade-in');
        }
    }

    // 隐藏对话窗口
    hideDialogueWindow() {
        const dialogueContainer = document.getElementById('dialogue-container');
        const roomContainer = document.getElementById('room-container');
        
        if (dialogueContainer && roomContainer) {
            dialogueContainer.classList.add('dialogue-fade-out');
            
            setTimeout(() => {
                dialogueContainer.classList.add('hidden');
                dialogueContainer.classList.remove('dialogue-fade-in', 'dialogue-fade-out');
                roomContainer.classList.remove('hidden');
            }, 200);
        }
    }

    // 显示当前对话行
    displayCurrentDialogueLine() {
        if (!this.currentDialogue || this.currentDialogueIndex >= this.currentDialogue.dialogues.length) {
            // 对话结束，显示结束提示
            this.showDialogueEnd();
            return;
        }
        
        const currentLine = this.currentDialogue.dialogues[this.currentDialogueIndex];
        const dialogueText = document.getElementById('dialogue-text');
        const dialogueOptions = document.getElementById('dialogue-options');
        
        if (!dialogueText || !dialogueOptions) return;
        
        // 清空之前的内容
        dialogueText.innerHTML = '';
        dialogueOptions.innerHTML = '';
        
        // 显示说话人
        const speakerElement = document.createElement('div');
        speakerElement.className = `speaker-${currentLine.speaker === 'Yui' ? 'yui' : 'player'}`;
        speakerElement.textContent = currentLine.speaker + ':';
        dialogueText.appendChild(speakerElement);
        
        // 显示对话文本（逐字显示）
        const textElement = document.createElement('div');
        textElement.className = 'dialogue-line';
        dialogueText.appendChild(textElement);
        
        this.startTypingEffect(textElement, currentLine.text);
        
        // 显示选项（如果有）
        if (currentLine.options && currentLine.options.length > 0) {
            this.displayOptions(currentLine.options);
        }
    }

    // 显示对话结束提示
    showDialogueEnd() {
        const dialogueText = document.getElementById('dialogue-text');
        
        if (dialogueText) {
            dialogueText.innerHTML = `
                <div class="dialogue-end">对话结束</div>
                <div class="dialogue-exit-hint">点击对话框外区域结束对话</div>
            `;
            this.isDialogueEnded = true;
        }
    }

    // 开始逐字显示效果
    startTypingEffect(element, text, onComplete = null) {
        this.isTyping = true;
        let currentIndex = 0;
        
        // 清除之前的打字效果
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        
        element.textContent = '';
        element.classList.add('typing-effect');
        
        this.typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                element.textContent += text[currentIndex];
                currentIndex++;
            } else {
                // 打字完成
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                this.isTyping = false;
                element.classList.remove('typing-effect');
                
                // 如果有回调函数，执行它
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }, this.typingSpeed);
    }

    // 显示选项
    displayOptions(options) {
        const dialogueOptions = document.getElementById('dialogue-options');
        if (!dialogueOptions) return;
        
        options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option.text;
            optionBtn.addEventListener('click', () => {
                this.selectOption(option);
            });
            
            dialogueOptions.appendChild(optionBtn);
        });
    }

    // 选择选项
    selectOption(option) {
        // 应用选项效果
        if (option.effects) {
            this.applyOptionEffects(option.effects);
        }
        
        // 立即显示玩家回应
        this.showOptionResponse(option);
    }

    // 显示选项回应
    showOptionResponse(option) {
        const dialogueText = document.getElementById('dialogue-text');
        const dialogueOptions = document.getElementById('dialogue-options');
        
        if (!dialogueText || !dialogueOptions) return;
        
        // 清空选项
        dialogueOptions.innerHTML = '';
        
        // 清空对话文本，准备重新显示
        dialogueText.innerHTML = '';
        
        // 显示玩家回应（立即显示）
        const playerResponseElement = document.createElement('div');
        playerResponseElement.className = 'speaker-player';
        playerResponseElement.textContent = '玩家:';
        dialogueText.appendChild(playerResponseElement);
        
        const playerTextElement = document.createElement('div');
        playerTextElement.className = 'dialogue-line';
        playerTextElement.textContent = option.text;
        dialogueText.appendChild(playerTextElement);
        
        // 显示Yui的回应（立即显示）
        const yuiResponseElement = document.createElement('div');
        yuiResponseElement.className = 'speaker-yui';
        yuiResponseElement.textContent = 'Yui:';
        dialogueText.appendChild(yuiResponseElement);
        
        const yuiTextElement = document.createElement('div');
        yuiTextElement.className = 'dialogue-line';
        
        // 根据选项效果选择Yui的回应
        let yuiResponse;
        if (option.effects && option.effects.mood > 0) {
            yuiResponse = this.getPositiveResponse();
        } else if (option.effects && option.effects.mood < 0) {
            yuiResponse = this.getNegativeResponse();
        } else {
            yuiResponse = this.getNeutralResponse();
        }
        
        yuiTextElement.textContent = yuiResponse;
        dialogueText.appendChild(yuiTextElement);
        
        // 滚动到最新内容
        dialogueText.scrollTop = dialogueText.scrollHeight;
        
        // 等待2秒后继续正常对话流程
        setTimeout(() => {
            // 移动到下一句对话
            this.currentDialogueIndex++;
            
            // 检查是否还有更多对话
            if (this.currentDialogueIndex >= this.currentDialogue.dialogues.length) {
                // 对话结束
                this.isDialogueEnded = true;
                this.showDialogueEnd();
            } else {
                // 还有更多对话，继续显示
                this.displayCurrentDialogueLine();
            }
        }, 2000);
    }

    // 获取积极回应
    getPositiveResponse() {
        const responses = [
            "嗯，谢谢你这么说",
            "听到你这么说我很开心",
            "你真好",
            "我也这么觉得",
            "谢谢你的理解"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 获取消极回应
    getNegativeResponse() {
        const responses = [
            "好吧...",
            "我知道了",
            "嗯...",
            "这样啊",
            "好吧，我明白了"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 获取中性回应
    getNeutralResponse() {
        const responses = [
            "嗯",
            "好的",
            "我知道了",
            "原来如此",
            "这样啊"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 应用选项效果
    applyOptionEffects(effects) {
        if (effects.mood && window.gameSystems?.moodSystem) {
            window.gameSystems.moodSystem.changeMood(effects.mood, 'dialogue_option');
        }
        
        if (effects.coins && window.gameState) {
            window.gameState.coins += effects.coins;
            if (window.gameSystems?.idleSystem) {
                window.gameSystems.idleSystem.updateCurrencyDisplay();
            }
        }
        
        console.log('应用选项效果:', effects);
    }

    // 下一句对话
    nextDialogue() {
        if (this.isTyping) {
            // 如果正在打字，立即完成
            this.completeTyping();
            return;
        }
        
        this.currentDialogueIndex++;
        this.displayCurrentDialogueLine();
    }

    // 完成打字效果
    completeTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.isTyping = false;
        
        const dialogueText = document.getElementById('dialogue-text');
        if (dialogueText) {
            const textElement = dialogueText.querySelector('.dialogue-line');
            if (textElement) {
                const currentLine = this.currentDialogue.dialogues[this.currentDialogueIndex];
                textElement.textContent = currentLine.text;
                textElement.classList.remove('typing-effect');
            }
        }
    }

    // 关闭对话
    closeDialogue() {
        this.currentDialogue = null;
        this.currentDialogueIndex = 0;
        this.isTyping = false;
        this.isDialogueEnded = false; // 重置对话结束状态
        
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.hideDialogueWindow();
        console.log('对话结束');
    }

    // 强制关闭对话（用于特殊情况）
    forceCloseDialogue() {
        this.closeDialogue();
        
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                '对话已强制关闭',
                'info'
            );
        }
    }

    // 检查是否有活跃对话
    isDialogueActive() {
        return this.currentDialogue !== null;
    }

    // 获取当前对话信息
    getCurrentDialogueInfo() {
        if (!this.currentDialogue) {
            return null;
        }
        
        return {
            totalLines: this.currentDialogue.dialogues.length,
            currentLine: this.currentDialogueIndex,
            progress: this.currentDialogueIndex / this.currentDialogue.dialogues.length,
            isTyping: this.isTyping
        };
    }

    // 设置打字速度
    setTypingSpeed(speed) {
        this.typingSpeed = Math.max(10, Math.min(500, speed)); // 限制在10-500毫秒之间
        console.log(`打字速度设置为: ${this.typingSpeed}ms/字符`);
    }

    // 暂停对话系统
    pause() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
    }

    // 恢复对话系统
    resume() {
        // 对话系统不需要特殊的恢复逻辑
    }

    // 销毁对话系统
    destroy() {
        this.pause();
        this.closeDialogue();
    }
}

// 创建全局对话系统实例
let dialogueSystem = null;

// 初始化对话系统
function initializeDialogueSystem() {
    if (!dialogueSystem) {
        dialogueSystem = new DialogueSystem();
    }
    return dialogueSystem;
}

// 导出对话系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DialogueSystem, initializeDialogueSystem };
}
