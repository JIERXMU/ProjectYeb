// 调试面板系统
// 提供游戏调试功能，包括数值修改、功能测试等

class DebugPanel {
    constructor() {
        this.isVisible = false;
        this.debugElements = {};
        
        this.initialize();
    }

    // 初始化调试面板
    initialize() {
        this.setupEventListeners();
        this.loadDebugSettings();
        console.log('调试面板初始化完成');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 应用调试修改按钮
        const applyBtn = document.getElementById('apply-debug');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyDebugChanges();
            });
        }

        // 下一行为按钮
        const nextBehaviorBtn = document.getElementById('next-behavior');
        if (nextBehaviorBtn) {
            nextBehaviorBtn.addEventListener('click', () => {
                this.forceNextBehavior();
            });
        }

        // 退出按钮
        const closeDebugBtn = document.getElementById('close-debug');
        if (closeDebugBtn) {
            closeDebugBtn.addEventListener('click', () => {
                this.toggle();
            });
        }

        // 挂机倍率输入框
        const idleMultiplierInput = document.getElementById('idle-multiplier');
        if (idleMultiplierInput) {
            idleMultiplierInput.addEventListener('change', (event) => {
                this.onIdleMultiplierChange(event.target.value);
            });
        }

        // 调试快捷键
        document.addEventListener('keydown', (event) => {
            // 使用 Ctrl+Shift+D 打开调试面板（避免与浏览器快捷键冲突）
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggle();
            }
            
            // 使用 Ctrl+Shift+T 强制触发对话
            if (event.ctrlKey && event.shiftKey && event.key === 'T' && this.isVisible) {
                event.preventDefault();
                this.forceDialogue();
            }
            
            // 使用 Ctrl+Shift+R 重置游戏
            if (event.ctrlKey && event.shiftKey && event.key === 'R' && this.isVisible) {
                event.preventDefault();
                this.resetGame();
            }
            
            // 备用快捷键：F9 打开调试面板
            if (event.key === 'F9') {
                event.preventDefault();
                this.toggle();
            }
        });
    }

    // 加载调试设置
    loadDebugSettings() {
        try {
            const saved = localStorage.getItem('projectyeb_debug_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // 应用保存的设置
                this.applySavedSettings(settings);
            }
        } catch (error) {
            console.error('加载调试设置失败:', error);
        }
    }

    // 应用保存的设置
    applySavedSettings(settings) {
        // 挂机倍率
        if (settings.idleMultiplier !== undefined) {
            const input = document.getElementById('idle-multiplier');
            if (input) {
                input.value = settings.idleMultiplier;
                this.onIdleMultiplierChange(settings.idleMultiplier);
            }
        }
    }

    // 切换调试面板显示
    toggle() {
        const debugPanel = document.getElementById('debug-panel');
        if (!debugPanel) return;
        
        if (this.isVisible) {
            debugPanel.classList.add('hidden');
            this.isVisible = false;
        } else {
            debugPanel.classList.remove('hidden');
            this.isVisible = true;
            this.updateDebugValues();
        }
        
        console.log(`调试面板${this.isVisible ? '显示' : '隐藏'}`);
    }

    // 更新调试值
    updateDebugValues() {
        if (!this.isVisible) return;
        
        // 更新时间显示
        const debugHourInput = document.getElementById('debug-hour');
        const debugMinuteInput = document.getElementById('debug-minute');
        if (debugHourInput && debugMinuteInput && window.gameSystems?.timeSystem) {
            const currentTime = window.gameSystems.timeSystem.getCurrentTime();
            debugHourInput.value = currentTime.hour;
            debugMinuteInput.value = currentTime.minute;
        }
        
        // 更新心情值
        const debugMoodInput = document.getElementById('debug-mood');
        if (debugMoodInput && window.gameState) {
            debugMoodInput.value = Math.floor(window.gameState.mood);
        }
        
        // 更新经验值
        const debugExpInput = document.getElementById('debug-exp');
        if (debugExpInput && window.gameSystems?.levelSystem) {
            const levelInfo = window.gameSystems.levelSystem.getLevelInfo();
            debugExpInput.value = Math.floor(levelInfo.experience);
        }
        
        // 更新金币
        const debugCoinsInput = document.getElementById('debug-coins');
        if (debugCoinsInput && window.gameState) {
            debugCoinsInput.value = Math.floor(window.gameState.coins);
        }
        
        // 更新挂机倍率显示
        const idleMultiplierInput = document.getElementById('idle-multiplier');
        if (idleMultiplierInput && window.gameSystems?.idleSystem) {
            idleMultiplierInput.value = window.gameSystems.idleSystem.getIdleMultiplier();
        }
        
        // 阶段一：更新新系统调试值
        this.updateNewSystemDebugValues();
    }

    // 更新新系统调试值
    updateNewSystemDebugValues() {
        if (!window.gameState) return;
        
        // 更新职业系统调试值
        const debugJobLevelInput = document.getElementById('debug-job-level');
        const debugFocusInput = document.getElementById('debug-focus');
        if (debugJobLevelInput && window.gameState.career) {
            debugJobLevelInput.value = window.gameState.career.jobLevel;
        }
        if (debugFocusInput && window.gameState.career) {
            debugFocusInput.value = Math.floor(window.gameState.career.focus);
        }
        
        // 更新技能系统调试值
        const debugSkillPointsInput = document.getElementById('debug-skill-points');
        if (debugSkillPointsInput && window.gameState.tasks) {
            debugSkillPointsInput.value = window.gameState.tasks.skillPoints;
        }
        
        // 更新舒适度调试值
        const debugComfortInput = document.getElementById('debug-comfort');
        if (debugComfortInput && window.gameState.comfort) {
            debugComfortInput.value = Math.floor(window.gameState.comfort.totalComfort);
        }
    }

    // 应用调试修改
    applyDebugChanges() {
        let appliedChanges = [];
        
        // 检查并应用时间修改
        const debugHourInput = document.getElementById('debug-hour');
        const debugMinuteInput = document.getElementById('debug-minute');
        if (debugHourInput && debugMinuteInput && window.gameSystems?.timeSystem) {
            const hour = parseInt(debugHourInput.value);
            const minute = parseInt(debugMinuteInput.value);
            
            // 只有当值有效且与当前时间不同时才应用
            if (!isNaN(hour) && !isNaN(minute)) {
                const currentTime = window.gameSystems.timeSystem.getCurrentTime();
                if (hour !== currentTime.hour || minute !== currentTime.minute) {
                    window.gameSystems.timeSystem.setCustomTime(hour, minute);
                    appliedChanges.push(`时间: ${hour}:${minute.toString().padStart(2, '0')}`);
                }
            }
        }
        
        // 检查并应用心情值修改
        const debugMoodInput = document.getElementById('debug-mood');
        if (debugMoodInput && window.gameSystems?.moodSystem) {
            const newMood = parseInt(debugMoodInput.value);
            
            // 只有当值有效且与当前心情不同时才应用
            if (!isNaN(newMood) && newMood !== Math.floor(window.gameState.mood)) {
                window.gameSystems.moodSystem.setMood(newMood);
                appliedChanges.push(`心情: ${newMood}`);
            }
        }
        
        // 检查并应用经验值修改
        const debugExpInput = document.getElementById('debug-exp');
        if (debugExpInput && window.gameSystems?.levelSystem) {
            const newExp = parseInt(debugExpInput.value);
            
            // 只有当值有效且与当前经验不同时才应用
            if (!isNaN(newExp)) {
                const levelInfo = window.gameSystems.levelSystem.getLevelInfo();
                if (newExp !== Math.floor(levelInfo.experience)) {
                    window.gameSystems.levelSystem.setExperience(newExp);
                    appliedChanges.push(`经验: ${newExp}`);
                }
            }
        }
        
        // 检查并应用金币修改
        const debugCoinsInput = document.getElementById('debug-coins');
        if (debugCoinsInput && window.gameState) {
            const newCoins = parseInt(debugCoinsInput.value);
            
            // 只有当值有效且与当前金币不同时才应用
            if (!isNaN(newCoins) && newCoins !== Math.floor(window.gameState.coins)) {
                window.gameState.coins = newCoins;
                if (window.gameSystems?.idleSystem) {
                    window.gameSystems.idleSystem.updateCurrencyDisplay();
                }
                appliedChanges.push(`金币: ${newCoins}`);
            }
        }
        
        // 保存调试设置
        this.saveDebugSettings();
        
        // 显示应用结果通知
        if (window.gameSystems?.notificationSystem) {
            if (appliedChanges.length > 0) {
                window.gameSystems.notificationSystem.showNotification(
                    `已应用修改: ${appliedChanges.join(', ')}`,
                    'success'
                );
            } else {
                window.gameSystems.notificationSystem.showNotification(
                    '没有检测到需要应用的修改',
                    'info'
                );
            }
        }
        
        console.log('调试修改已应用:', appliedChanges);
    }

    // 挂机倍率变化
    onIdleMultiplierChange(value) {
        const multiplier = parseFloat(value) || 1;
        
        if (window.gameSystems?.idleSystem) {
            window.gameSystems.idleSystem.setIdleMultiplier(multiplier);
        }
        
        // 保存设置
        this.saveDebugSettings();
    }

    // 强制下一行为
    forceNextBehavior() {
        if (window.gameSystems?.behaviorSystem) {
            window.gameSystems.behaviorSystem.forceNextBehavior();
        }
    }

    // 强制触发对话
    forceDialogue() {
        if (window.gameSystems?.dialogueSystem) {
            window.gameSystems.dialogueSystem.startRandomDialogue();
        }
    }

    // 重置游戏
    resetGame() {
        if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
            // 清除所有本地存储数据
            this.clearAllGameData();
            
            // 重新加载页面
            location.reload();
        }
    }

    // 清除所有游戏数据
    clearAllGameData() {
        const keys = [
            'projectyeb_save_data',
            'projectyeb_level_data',
            'projectyeb_mood_data',
            'projectyeb_behavior_data',
            'projectyeb_debug_settings',
            'projectyeb_offline_earnings'
        ];
        
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('所有游戏数据已清除');
    }

    // 保存调试设置
    saveDebugSettings() {
        const settings = {
            idleMultiplier: window.gameSystems?.idleSystem?.getIdleMultiplier() || 1
        };
        
        try {
            localStorage.setItem('projectyeb_debug_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存调试设置失败:', error);
        }
    }

    // 添加自定义调试命令
    addDebugCommand(command, callback) {
        if (typeof callback === 'function') {
            this.debugCommands = this.debugCommands || {};
            this.debugCommands[command] = callback;
        }
    }

    // 执行调试命令
    executeDebugCommand(command, ...args) {
        if (this.debugCommands && this.debugCommands[command]) {
            this.debugCommands[command](...args);
        } else {
            console.warn(`未知的调试命令: ${command}`);
        }
    }

    // 获取调试信息
    getDebugInfo() {
        const gameInfo = window.projectYebGame?.getGameInfo() || {};
        const systems = window.gameSystems || {};
        
        return {
            game: gameInfo,
            systems: Object.keys(systems),
            debugPanel: {
                visible: this.isVisible,
                commands: this.debugCommands ? Object.keys(this.debugCommands) : []
            }
        };
    }

    // 显示调试信息
    showDebugInfo() {
        const info = this.getDebugInfo();
        console.log('调试信息:', info);
        
        // 在调试面板中显示信息（可选）
        if (this.isVisible) {
            // 可以在这里添加在面板中显示详细信息的逻辑
        }
    }

    // 暂停调试面板
    pause() {
        // 调试面板不需要特殊的暂停逻辑
    }

    // 恢复调试面板
    resume() {
        // 调试面板不需要特殊的恢复逻辑
    }

    // 销毁调试面板
    destroy() {
        this.saveDebugSettings();
        
        // 移除事件监听器
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.add('hidden');
        }
        
        this.isVisible = false;
    }
}

// 创建全局调试面板实例
let debugPanel = null;

// 初始化调试面板
function initializeDebugPanel() {
    if (!debugPanel) {
        debugPanel = new DebugPanel();
    }
    return debugPanel;
}

// 导出调试面板供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DebugPanel, initializeDebugPanel };
}
