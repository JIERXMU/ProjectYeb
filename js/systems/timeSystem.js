// 时间系统
// 负责管理游戏内时间、时间段切换和主题变化

class TimeSystem {
    constructor() {
        this.currentTime = new Date();
        this.gameStartTime = new Date();
        this.isCustomTime = false;
        this.customTimeOffset = 0;
        this.updateInterval = null;
        
        // 时间段配置
        this.periods = CONFIG.time.periods;
        this.themeClasses = CONFIG.time.themeClasses;
        
        this.initialize();
    }

    // 初始化时间系统
    initialize() {
        this.startTimeUpdate();
        this.updateDisplay();
        this.applyTimeTheme();
    }

    // 开始时间更新循环
    startTimeUpdate() {
        // 每秒更新一次时间显示
        this.updateInterval = setInterval(() => {
            this.updateTime();
            this.updateDisplay();
            this.checkPeriodChange();
        }, 1000);
    }

    // 更新时间
    updateTime() {
        if (this.isCustomTime) {
            // 自定义时间模式
            const realTime = new Date();
            const timeDiff = realTime - this.gameStartTime;
            this.currentTime = new Date(this.customTimeOffset + timeDiff);
        } else {
            // 系统时间模式
            this.currentTime = new Date();
        }
    }

    // 更新显示
    updateDisplay() {
        const timeElement = document.getElementById('current-time');
        const periodElement = document.getElementById('time-period');
        
        if (timeElement && periodElement) {
            const timeString = this.formatTime(this.currentTime);
            const period = this.getCurrentPeriod();
            
            timeElement.textContent = timeString;
            periodElement.textContent = period;
        }
    }

    // 格式化时间显示
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // 获取当前时间段
    getCurrentPeriod() {
        const currentHour = this.currentTime.getHours();
        
        for (const period of this.periods) {
            if (period.start <= period.end) {
                // 正常时间段 (如 6:00-10:59)
                if (currentHour >= period.start && currentHour <= period.end) {
                    return period.name;
                }
            } else {
                // 跨天时间段 (如 22:00-5:59)
                if (currentHour >= period.start || currentHour <= period.end) {
                    return period.name;
                }
            }
        }
        
        return "早晨"; // 默认值
    }

    // 检查时间段变化并应用主题
    checkPeriodChange() {
        const currentPeriod = this.getCurrentPeriod();
        const lastPeriod = this.lastPeriod;
        
        if (currentPeriod !== lastPeriod) {
            this.applyTimeTheme();
            this.lastPeriod = currentPeriod;
            
            // 触发时间段变化事件
            this.onPeriodChange(currentPeriod);
        }
    }

    // 应用时间主题
    applyTimeTheme() {
        const gameContainer = document.getElementById('game-container');
        const currentPeriod = this.getCurrentPeriod();
        const themeClass = this.themeClasses[currentPeriod];
        
        if (!themeClass) return;
        
        // 移除所有时间主题类
        Object.values(this.themeClasses).forEach(className => {
            gameContainer.classList.remove(className);
        });
        
        // 添加当前主题类
        gameContainer.classList.add(themeClass);
    }

    // 时间段变化事件
    onPeriodChange(newPeriod) {
        console.log(`时间段变化: ${newPeriod}`);
        
        // 可以在这里触发时间段相关的游戏事件
        // 例如：早晨触发起床事件，晚上触发睡觉事件等
        
        // 通知其他系统时间段变化
        if (window.gameSystems) {
            if (window.gameSystems.behaviorSystem) {
                window.gameSystems.behaviorSystem.onTimePeriodChange(newPeriod);
            }
            if (window.gameSystems.moodSystem) {
                window.gameSystems.moodSystem.onTimePeriodChange(newPeriod);
            }
        }
    }

    // 切换到自定义时间模式
    setCustomTime(hours, minutes = 0) {
        const baseTime = new Date();
        baseTime.setHours(hours, minutes, 0, 0);
        this.customTimeOffset = baseTime.getTime();
        this.gameStartTime = new Date();
        this.isCustomTime = true;
        
        console.log(`切换到自定义时间模式: ${hours}:${minutes.toString().padStart(2, '0')}`);
    }

    // 切换回系统时间模式
    setSystemTime() {
        this.isCustomTime = false;
        this.customTimeOffset = 0;
        console.log('切换回系统时间模式');
    }

    // 获取当前时间对象
    getCurrentTime() {
        return new Date(this.currentTime);
    }

    // 获取当前小时
    getCurrentHour() {
        return this.currentTime.getHours();
    }

    // 获取当前分钟
    getCurrentMinute() {
        return this.currentTime.getMinutes();
    }

    // 获取时间段描述
    getPeriodDescription(period = null) {
        const targetPeriod = period || this.getCurrentPeriod();
        return TEXTS.timePeriods[targetPeriod]?.description || '';
    }

    // 获取时间段问候语
    getPeriodGreeting(period = null) {
        const targetPeriod = period || this.getCurrentPeriod();
        return TEXTS.timePeriods[targetPeriod]?.greeting || '';
    }

    // 计算时间差（分钟）
    getTimeDifferenceInMinutes(startTime, endTime = null) {
        const end = endTime || this.currentTime;
        const diffMs = end - startTime;
        return Math.floor(diffMs / (1000 * 60));
    }

    // 格式化时间差显示
    formatTimeDifference(minutes) {
        if (minutes < 60) {
            return `${minutes}分钟`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? 
                `${hours}小时${remainingMinutes}分钟` : 
                `${hours}小时`;
        }
    }

    // 获取游戏运行时间
    getGameRunningTime() {
        return this.getTimeDifferenceInMinutes(this.gameStartTime);
    }

    // 暂停时间系统
    pause() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // 恢复时间系统
    resume() {
        if (!this.updateInterval) {
            this.startTimeUpdate();
        }
    }

    // 销毁时间系统
    destroy() {
        this.pause();
    }
}

// 创建全局时间系统实例
let timeSystem = null;

// 初始化时间系统
function initializeTimeSystem() {
    if (!timeSystem) {
        timeSystem = new TimeSystem();
    }
    return timeSystem;
}

// 导出时间系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimeSystem, initializeTimeSystem };
}
