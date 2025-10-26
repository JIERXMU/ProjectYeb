// 打工系统
// 基于窗口活动状态的挂机系统
// 游戏窗口非活动时：打工状态（高收益）
// 游戏窗口活动时：休息状态（低收益）

class CareerSystem {
    constructor() {
        this.isGameActive = true; // 游戏窗口是否活动
        this.lastUpdateTime = Date.now();
        this.lastValues = {
            coins: 0,
            experience: 0,
            focus: 100
        };
        this.changeRates = {
            coins: 0,
            experience: 0,
            focus: 0
        };
        this.smoothedRates = {
            coins: 0,
            experience: 0,
            focus: 0
        };
        this.lastRateUpdateTime = Date.now();
        this.focusDebugMultiplier = CONFIG.focus.defaultDebugMultiplier;
        this.initialize();
    }

    // 初始化打工系统
    initialize() {
        this.setupEventListeners();
        this.startWorkLoop();
        console.log('打工系统初始化完成');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 页面可见性变化监听
        document.addEventListener('visibilitychange', () => {
            this.onVisibilityChange();
        });
        
        // 窗口焦点变化监听
        window.addEventListener('focus', () => {
            this.onWindowFocus();
        });
        
        window.addEventListener('blur', () => {
            this.onWindowBlur();
        });
    }

    // 开始工作循环
    startWorkLoop() {
        // 每秒更新一次状态和收益
        setInterval(() => {
            this.updateCareerState();
        }, 1000);
    }

    // 页面可见性变化
    onVisibilityChange() {
        this.isGameActive = !document.hidden;
        this.updateStatusDisplay();
        console.log(`游戏窗口${this.isGameActive ? '活动' : '非活动'}`);
    }

    // 窗口获得焦点
    onWindowFocus() {
        this.isGameActive = true;
        this.updateStatusDisplay();
        console.log('游戏窗口获得焦点 - 休息状态');
    }

    // 窗口失去焦点
    onWindowBlur() {
        this.isGameActive = false;
        this.updateStatusDisplay();
        console.log('游戏窗口失去焦点 - 打工状态');
    }

    // 更新打工状态
    updateCareerState() {
        const currentTime = Date.now();
        const timeDiff = (currentTime - this.lastUpdateTime) / 1000; // 秒
        
        if (timeDiff > 0) {
            // 记录当前值用于计算变化率（在变化前记录）
            this.recordCurrentValues();
            
            // 计算收益
            const income = this.calculateIncome(timeDiff);
            
            // 发放收益
            if (income > 0) {
                window.gameState.coins += income;
                window.gameState.career.totalWorkIncome += income;
                
                // 增加职业经验
                this.addJobExperience(timeDiff);
                
                // 更新专注力
                this.updateFocusRecovery(timeDiff);
                
                // 更新UI显示
                this.updateUIDisplay();
                
                // 记录收益日志（避免频繁通知）
                if (Math.floor(currentTime / 1000) % 10 === 0) {
                    console.log(`${this.isGameActive ? '休息' : '打工'}收益: ${income.toFixed(2)} 金币`);
                }
            }
            
            // 计算变化速率（在专注力更新后）
            this.calculateChangeRates(timeDiff);
            
            this.lastUpdateTime = currentTime;
        }
    }

    // 记录当前值
    recordCurrentValues() {
        this.lastValues = {
            coins: window.gameState.coins,
            experience: window.gameState.experience,
            focus: window.gameState.career.focus
        };
    }

    // 计算变化速率
    calculateChangeRates(timeDiff) {
        if (timeDiff <= 0) return;
        
        // 计算每秒变化率
        this.changeRates.coins = (window.gameState.coins - this.lastValues.coins) / timeDiff;
        this.changeRates.experience = (window.gameState.experience - this.lastValues.experience) / timeDiff;
        this.changeRates.focus = (window.gameState.career.focus - this.lastValues.focus) / timeDiff;
        
        // 应用平滑算法
        this.applySmoothing(timeDiff);
        
        // 更新变化率显示
        this.updateChangeRateDisplay();
    }
    
    // 应用平滑算法
    applySmoothing(timeDiff) {
        const currentTime = Date.now();
        const timeSinceLastUpdate = (currentTime - this.lastRateUpdateTime) / 1000;
        
        // 平滑因子：0.3表示30%平滑，值越小收敛越快
        const smoothingFactor = 0.3;
        
        // 应用指数平滑
        this.smoothedRates.coins = this.smoothedRates.coins * smoothingFactor + 
                                  this.changeRates.coins * (1 - smoothingFactor);
        this.smoothedRates.experience = this.smoothedRates.experience * smoothingFactor + 
                                       this.changeRates.experience * (1 - smoothingFactor);
        this.smoothedRates.focus = this.smoothedRates.focus * smoothingFactor + 
                                  this.changeRates.focus * (1 - smoothingFactor);
        
        this.lastRateUpdateTime = currentTime;
        
        // 调试信息：专注力变化率对比
        if (Math.floor(currentTime / 1000) % 5 === 0) {
            console.log(`专注力变化率 - 实际: ${this.changeRates.focus.toFixed(4)}/s, 平滑后: ${this.smoothedRates.focus.toFixed(4)}/s`);
        }
    }
    
    // 触发变化率更新（供其他系统调用）
    triggerChangeRateUpdate() {
        const currentTime = Date.now();
        const timeDiff = (currentTime - this.lastUpdateTime) / 1000;
        
        if (timeDiff > 0) {
            this.calculateChangeRates(timeDiff);
            this.lastUpdateTime = currentTime;
        }
    }

    // 更新变化率显示
    updateChangeRateDisplay() {
        // 更新金币变化率
        const coinRateDisplay = document.getElementById('coin-rate-display');
        if (coinRateDisplay) {
            const rate = this.smoothedRates.coins;
            const formattedRate = this.formatChangeRate(rate, 's');
            coinRateDisplay.textContent = formattedRate;
            coinRateDisplay.className = `rate-display ${rate >= 0 ? 'positive' : 'negative'}`;
        }
        
        // 更新经验变化率
        const expRateDisplay = document.getElementById('exp-rate-display');
        if (expRateDisplay) {
            const rate = this.smoothedRates.experience;
            const formattedRate = this.formatChangeRate(rate, 's');
            expRateDisplay.textContent = formattedRate;
            expRateDisplay.className = `rate-display ${rate >= 0 ? 'positive' : 'negative'}`;
        }
        
        // 更新专注力变化率
        const focusRateDisplay = document.getElementById('focus-rate-display');
        if (focusRateDisplay) {
            const rate = this.smoothedRates.focus;
            const formattedRate = this.formatChangeRate(rate, 's');
            focusRateDisplay.textContent = formattedRate;
            focusRateDisplay.className = `rate-display ${rate >= 0 ? 'positive' : 'negative'}`;
        }
    }

    // 格式化变化率显示
    formatChangeRate(rate, unit) {
        if (Math.abs(rate) < 0.001) {
            return '0';
        }
        
        let displayRate = rate;
        let displayUnit = unit;
        
        // 根据单位调整显示
        if (unit === 'min') {
            displayRate = rate * 60; // 转换为每分钟
            displayUnit = 'min';
        }
        
        // 格式化数字，支持计数法显示
        const formattedRate = this.formatNumber(Math.abs(displayRate));
        const sign = displayRate >= 0 ? '+' : '-';
        
        return `${sign}${formattedRate}/${displayUnit}`;
    }
    
    // 格式化数字，支持计数法显示
    formatNumber(number) {
        if (number < 1000) {
            return number.toFixed(2); // 小于1000，显示小数点后两位
        } else if (number < 10000) {
            return (number / 1000).toFixed(1) + 'k'; // 1k - 9.9k
        } else if (number < 1000000) {
            return Math.floor(number / 1000) + 'k'; // 10k - 999k
        } else if (number < 10000000) {
            return (number / 1000000).toFixed(1) + 'M'; // 1M - 9.9M
        } else {
            return Math.floor(number / 1000000) + 'M'; // 10M+
        }
    }

    // 计算收益（基于窗口状态）
    calculateIncome(timeDiff) {
        const career = window.gameState.career;
        const currentJob = CAREERS[career.currentJob];
        
        // 基础收益率（每秒）
        let baseRate = currentJob.baseIncome / 60; // 转换为每秒
        
        // 根据窗口状态调整收益
        if (this.isGameActive) {
            // 游戏窗口活动时：休息状态，低收益
            baseRate *= 0.2; // 20%收益
        } else {
            // 游戏窗口非活动时：打工状态，高收益
            baseRate *= 1.0; // 100%收益
        }
        
        // 技能加成
        const skillBonus = this.calculateSkillBonus();
        
        // 舒适度加成
        const comfortBonus = this.calculateComfortBonus();
        
        // 职业等级加成
        const levelBonus = this.calculateLevelBonus();
        
        // 获取挂机倍率
        const idleMultiplier = window.gameSystems?.idleSystem?.getIdleMultiplier() || 1;
        
        // 总收益计算（包含挂机倍率）
        const totalIncome = baseRate * timeDiff * (1 + skillBonus + comfortBonus + levelBonus) * idleMultiplier;
        
        return totalIncome;
    }

    // 更新状态显示
    updateStatusDisplay() {
        const statusDisplay = document.getElementById('career-status-display');
        if (!statusDisplay) return;
        
        const status = this.isGameActive ? '休息' : '打工';
        const statusClass = this.isGameActive ? 'rest-status' : 'work-status';
        
        statusDisplay.innerHTML = `
            <div class="career-status ${statusClass}">
                <span class="status-icon">${this.isGameActive ? '🏠' : '💼'}</span>
                <span class="status-text">${status}状态</span>
                <span class="window-status">${this.isGameActive ? '游戏内' : '游戏外'}</span>
            </div>
        `;
    }

    // 计算工作收益
    calculateWorkIncome() {
        const career = window.gameState.career;
        const currentJob = CAREERS[career.currentJob];
        
        let baseIncome = currentJob.baseIncome;
        
        // 技能加成
        const skillBonus = this.calculateSkillBonus();
        
        // 舒适度加成
        const comfortBonus = this.calculateComfortBonus();
        
        // 职业等级加成
        const levelBonus = this.calculateLevelBonus();
        
        // 总收益计算
        const totalIncome = Math.floor(baseIncome * (1 + skillBonus + comfortBonus + levelBonus));
        
        return totalIncome;
    }

    // 计算技能加成
    calculateSkillBonus() {
        const skills = window.gameState.skills;
        let bonus = 0;
        
        // 工作效率技能加成
        if (skills.efficiency > 0) {
            bonus += skills.efficiency * SKILLS.efficiency.effect;
        }
        
        // 专注力技能加成（减少消耗，这里转换为收益加成）
        if (skills.focus > 0) {
            bonus += skills.focus * SKILLS.focus.effect * 0.5; // 转换为收益加成
        }
        
        return bonus;
    }

    // 计算舒适度加成
    calculateComfortBonus() {
        const comfort = window.gameState.comfort;
        const totalComfort = comfort.totalComfort || 0;
        
        // 每点舒适度提供1%加成，最多50%
        const bonus = Math.min(COMFORT_CONFIG.maxBonus, totalComfort * COMFORT_CONFIG.bonusMultiplier);
        
        return bonus;
    }

    // 计算职业等级加成
    calculateLevelBonus() {
        const career = window.gameState.career;
        
        // 每级提供5%的加成
        return (career.jobLevel - 1) * 0.05;
    }

    // 增加职业经验
    addJobExperience(amount) {
        const career = window.gameState.career;
        career.jobExp += amount;
        
        // 检查是否升级
        this.checkJobLevelUp();
    }

    // 检查职业升级
    checkJobLevelUp() {
        const career = window.gameState.career;
        const requiredExp = this.getRequiredJobExp(career.jobLevel);
        
        if (career.jobExp >= requiredExp) {
            this.jobLevelUp();
        }
    }

    // 职业升级
    jobLevelUp() {
        const career = window.gameState.career;
        career.jobLevel += 1;
        career.jobExp = 0; // 重置经验
        
        // 显示升级通知
        this.showNotification(`职业升级！现在是 ${CAREERS[career.currentJob].name} ${career.jobLevel} 级`, 'success');
        
        // 触发升级事件
        this.triggerLevelUpEvent();
        
        console.log(`职业升级到 ${career.jobLevel} 级`);
    }

    // 获取所需职业经验
    getRequiredJobExp(level) {
        // 经验需求：100 * level^2
        return 100 * Math.pow(level, 2);
    }

    // 更新专注力状态（恢复和消耗）
    updateFocusRecovery(timeDiff) {
        const career = window.gameState.career;
        
        // 获取挂机倍率
        const idleMultiplier = window.gameSystems?.idleSystem?.getIdleMultiplier() || 1;
        
        if (this.isGameActive) {
            // 游戏窗口活动时：休息状态，专注力恢复
            // 基础恢复速度：每分钟恢复1点专注力
            const baseRecoveryRate = CONFIG.focus.baseRecoveryRate / 60; // 每秒恢复量
            
            // 技能加成
            const recoveryBonus = this.calculateRecoveryBonus();
            
            // 总恢复速度（受挂机倍率和调试倍率影响）
            const totalRecoveryRate = baseRecoveryRate * (1 + recoveryBonus) * idleMultiplier * this.focusDebugMultiplier;
            
            // 恢复专注力
            const focusRecovery = timeDiff * totalRecoveryRate;
            career.focus = Math.min(100, career.focus + focusRecovery);
        } else {
            // 游戏窗口非活动时：打工状态，专注力消耗
            // 基础消耗速度：每分钟消耗2点专注力
            const baseConsumptionRate = CONFIG.focus.baseConsumptionRate / 60; // 每秒消耗量
            
            // 技能加成（减少消耗）
            const consumptionReduction = this.calculateConsumptionReduction();
            
            // 总消耗速度（受挂机倍率和调试倍率影响）
            const totalConsumptionRate = baseConsumptionRate * (1 - consumptionReduction) * idleMultiplier * this.focusDebugMultiplier;
            
            // 消耗专注力
            const focusConsumption = timeDiff * totalConsumptionRate;
            career.focus = Math.max(0, career.focus - focusConsumption);
        }
        
        // 更新专注力进度条
        this.updateFocusProgressBar();
    }
    
    // 计算消耗减少加成
    calculateConsumptionReduction() {
        const skills = window.gameState.skills;
        let reduction = 0;
        
        // 专注力技能加成（减少消耗）
        if (skills.focus > 0) {
            reduction += skills.focus * SKILLS.focus.effect;
        }
        
        return Math.min(0.5, reduction); // 最多减少50%消耗
    }
    
    // 更新专注力进度条
    updateFocusProgressBar() {
        const focusProgress = document.getElementById('focus-progress');
        const career = window.gameState.career;
        
        if (focusProgress) {
            const focusPercentage = career.focus;
            focusProgress.style.width = `${focusPercentage}%`;
        }
    }

    // 计算恢复加成
    calculateRecoveryBonus() {
        const skills = window.gameState.skills;
        let bonus = 0;
        
        // 恢复力技能加成
        if (skills.recovery > 0) {
            bonus += skills.recovery * SKILLS.recovery.effect;
        }
        
        return bonus;
    }

    // 切换职业
    changeJob(jobId) {
        const career = window.gameState.career;
        const targetJob = CAREERS[jobId];
        
        if (!targetJob) {
            this.showNotification('无效的职业', 'error');
            return false;
        }
        
        // 检查等级要求
        if (window.gameState.level < targetJob.requiredLevel) {
            this.showNotification(`需要等级 ${targetJob.requiredLevel} 才能选择该职业`, 'warning');
            return false;
        }
        
        // 切换职业
        career.currentJob = jobId;
        career.jobLevel = 1; // 新职业从1级开始
        career.jobExp = 0;
        
        // 显示通知
        this.showNotification(`已切换到 ${targetJob.name} 职业`, 'success');
        
        // 更新UI
        this.updateUIDisplay();
        
        return true;
    }

    // 获取可用的职业
    getAvailableJobs() {
        const availableJobs = [];
        
        for (const [jobId, job] of Object.entries(CAREERS)) {
            if (window.gameState.level >= job.requiredLevel) {
                availableJobs.push({
                    id: jobId,
                    ...job
                });
            }
        }
        
        return availableJobs;
    }

    // 更新UI显示
    updateUIDisplay() {
        // 更新专注力显示
        this.updateFocusDisplay();
        
        // 更新职业信息显示
        this.updateCareerDisplay();
        
        // 更新金币显示
        if (window.gameSystems?.idleSystem) {
            window.gameSystems.idleSystem.updateCurrencyDisplay();
        }
    }

    // 更新专注力显示
    updateFocusDisplay() {
        const focusDisplay = document.getElementById('focus-display');
        if (!focusDisplay) return;
        
        const career = window.gameState.career;
        focusDisplay.textContent = `专注力: ${Math.floor(career.focus)}/100`;
        
        // 根据专注力值设置颜色
        if (career.focus < 20) {
            focusDisplay.style.color = '#ff4444'; // 红色
        } else if (career.focus < 50) {
            focusDisplay.style.color = '#ffaa00'; // 橙色
        } else {
            focusDisplay.style.color = '#44ff44'; // 绿色
        }
    }

    // 更新职业信息显示
    updateCareerDisplay() {
        const careerDisplay = document.getElementById('career-display');
        if (!careerDisplay) return;
        
        const career = window.gameState.career;
        const currentJob = CAREERS[career.currentJob];
        
        careerDisplay.innerHTML = `
            <div class="career-info">
                <span class="job-name">${currentJob.name}</span>
                <span class="job-level">Lv.${career.jobLevel}</span>
            </div>
        `;
    }

    // 显示通知
    showNotification(message, type = 'info') {
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // 触发升级事件
    triggerLevelUpEvent() {
        const event = new CustomEvent('careerLevelUp', {
            detail: {
                newLevel: window.gameState.career.jobLevel,
                job: window.gameState.career.currentJob
            }
        });
        document.dispatchEvent(event);
    }
    
    // 设置专注力调试倍率
    setFocusDebugMultiplier(multiplier) {
        const minMultiplier = CONFIG.focus.debugMultiplierRange.min;
        const maxMultiplier = CONFIG.focus.debugMultiplierRange.max;
        
        // 限制倍率范围
        this.focusDebugMultiplier = Math.max(minMultiplier, Math.min(maxMultiplier, multiplier));
        
        console.log(`专注力调试倍率设置为: ${this.focusDebugMultiplier}x`);
        
        // 显示通知
        this.showNotification(`专注力变化速率: ${this.focusDebugMultiplier}x`, 'info');
    }
    
    // 获取专注力调试倍率
    getFocusDebugMultiplier() {
        return this.focusDebugMultiplier;
    }

    // 获取系统信息
    getSystemInfo() {
        const career = window.gameState.career;
        const currentJob = CAREERS[career.currentJob];
        
        return {
            currentJob: career.currentJob,
            jobLevel: career.jobLevel,
            jobExp: career.jobExp,
            focus: career.focus,
            totalIncome: career.totalWorkIncome,
            isWorking: this.isWorking,
            availableJobs: this.getAvailableJobs().length,
            nextLevelExp: this.getRequiredJobExp(career.jobLevel)
        };
    }

    // 暂停系统
    pause() {
        // 保存当前时间
        this.lastUpdateTime = Date.now();
    }

    // 恢复系统
    resume() {
        // 恢复时更新专注力
        this.updateFocusRecovery();
    }

    // 销毁系统
    destroy() {
        this.pause();
        // 清理工作状态
        this.isWorking = false;
    }
}

// 创建全局打工系统实例
let careerSystem = null;

// 初始化打工系统
function initializeCareerSystem() {
    if (!careerSystem) {
        careerSystem = new CareerSystem();
    }
    return careerSystem;
}

// 导出打工系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CareerSystem, initializeCareerSystem };
}
