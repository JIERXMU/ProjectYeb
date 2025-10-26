// 家具系统
// 负责管理家具的购买、放置、交互和行为解锁

class FurnitureSystem {
    constructor() {
        this.furnitureList = CONFIG.furniture.examples;
        this.playerFurniture = []; // 玩家拥有的家具
        this.placedFurniture = []; // 房间中放置的家具
        this.isDecorationMode = false; // 装修模式
        
        this.initialize();
    }

    // 初始化家具系统
    initialize() {
        this.loadGameState();
        this.setupEventListeners();
        this.updateFurnitureDisplay();
    }

    // 加载游戏状态
    loadGameState() {
        // 测试阶段：每次刷新重置
        if (CONFIG.idle.resetOnRefresh) {
            this.resetToInitial();
            return;
        }
        
        try {
            const saved = localStorage.getItem('projectyeb_furniture_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.playerFurniture = data.playerFurniture || [];
                this.placedFurniture = data.placedFurniture || [];
            } else {
                this.resetToInitial();
            }
        } catch (error) {
            console.error('加载家具数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.playerFurniture = [];
        this.placedFurniture = [];
        this.isDecorationMode = false;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 房屋按钮点击事件 - 由main.js统一管理
        // 这里不需要重复设置事件监听器
    }

    // 切换装修模式
    toggleDecorationMode() {
        this.isDecorationMode = !this.isDecorationMode;
        
        // 更新按钮样式
        const houseBtn = document.getElementById('house-btn');
        if (houseBtn) {
            if (this.isDecorationMode) {
                houseBtn.style.backgroundColor = '#666';
                houseBtn.style.borderColor = '#888';
                houseBtn.textContent = '装修中...';
            } else {
                houseBtn.style.backgroundColor = '';
                houseBtn.style.borderColor = '';
                houseBtn.textContent = '房屋';
            }
        }
        
        // 更新家具显示
        this.updateFurnitureDisplay();
        
        console.log(`装修模式${this.isDecorationMode ? '开启' : '关闭'}`);
    }

    // 购买家具
    buyFurniture(furnitureId) {
        const furniture = this.furnitureList[furnitureId];
        if (!furniture) {
            console.error(`家具不存在: ${furnitureId}`);
            return false;
        }
        
        // 检查是否已拥有
        if (this.hasFurniture(furnitureId)) {
            console.log(`已经拥有家具: ${furniture.name}`);
            return false;
        }
        
        // 检查金币是否足够
        if (window.gameState.coins < furniture.price) {
            console.log(`金币不足，无法购买: ${furniture.name}`);
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    `金币不足，无法购买${furniture.name}`,
                    'error'
                );
            }
            return false;
        }
        
        // 扣除金币
        window.gameState.coins -= furniture.price;
        if (window.gameSystems?.idleSystem) {
            window.gameSystems.idleSystem.updateCurrencyDisplay();
        }
        
        // 添加家具到背包
        this.playerFurniture.push({
            id: furnitureId,
            name: furniture.name,
            type: furniture.type,
            price: furniture.price,
            moodEffect: furniture.moodEffect,
            behaviors: furniture.behaviors || []
        });
        
        // 保存游戏状态
        this.saveGameState();
        
        // 购买成功通知由商店系统统一显示
        // 这里不重复显示通知
        
        console.log(`购买家具成功: ${furniture.name}`);
        return true;
    }

    // 放置家具到房间
    placeFurniture(furnitureId, position = null) {
        const furniture = this.getPlayerFurniture(furnitureId);
        if (!furniture) {
            console.error(`未拥有该家具: ${furnitureId}`);
            return false;
        }
        
        // 检查是否已放置
        if (this.isFurniturePlaced(furnitureId)) {
            console.log(`家具已放置: ${furniture.name}`);
            return false;
        }
        
        // 创建放置记录
        const placedFurniture = {
            ...furniture,
            position: position || this.getRandomPosition(),
            placedAt: Date.now()
        };
        
        this.placedFurniture.push(placedFurniture);
        
        // 更新显示
        this.updateFurnitureDisplay();
        
        // 保存游戏状态
        this.saveGameState();
        
        // 触发家具放置事件
        this.onFurniturePlaced(placedFurniture);
        
        console.log(`放置家具: ${furniture.name}`);
        return true;
    }

    // 从房间收回家具
    removeFurniture(furnitureId) {
        const index = this.placedFurniture.findIndex(f => f.id === furnitureId);
        if (index === -1) {
            console.error(`家具未放置: ${furnitureId}`);
            return false;
        }
        
        const furniture = this.placedFurniture[index];
        this.placedFurniture.splice(index, 1);
        
        // 更新显示（不显示家具背包）
        this.updateFurnitureDisplay(false);
        
        // 保存游戏状态
        this.saveGameState();
        
        // 触发家具收回事件
        this.onFurnitureRemoved(furniture);
        
        console.log(`收回家具: ${furniture.name}`);
        return true;
    }

    // 家具放置事件
    onFurniturePlaced(furniture) {
        // 解锁对应行为
        if (furniture.behaviors && furniture.behaviors.length > 0) {
            furniture.behaviors.forEach(behavior => {
                if (window.gameSystems?.behaviorSystem) {
                    window.gameSystems.behaviorSystem.unlockBehavior(behavior);
                }
            });
        }
        
        // 立即心情加成（单次互动型家具）
        if (furniture.type === 'single' && furniture.moodEffect > 0) {
            if (window.gameSystems?.moodSystem) {
                window.gameSystems.moodSystem.changeMood(furniture.moodEffect, 'furniture_placement');
            }
        }
        
        // 显示放置通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `放置了${furniture.name}`,
                'furniture'
            );
        }
    }

    // 家具收回事件
    onFurnitureRemoved(furniture) {
        // 显示收回通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `收回了${furniture.name}`,
                'furniture'
            );
        }
    }

    // 家具交互
    interactWithFurniture(furnitureId) {
        const furniture = this.getPlacedFurniture(furnitureId);
        if (!furniture) {
            console.error(`家具未放置: ${furnitureId}`);
            return false;
        }
        
        // 显示家具详情页面
        this.showFurnitureDetail(furniture);
        
        console.log(`查看家具详情: ${furniture.name}`);
        return true;
    }

    // 高亮显示家具
    highlightFurniture(furnitureId) {
        const furnitureElement = document.querySelector(`[data-furniture-id="${furnitureId}"]`);
        if (furnitureElement) {
            furnitureElement.classList.add('furniture-highlight');
        }
    }

    // 持续高亮家具（在整个行为期间）
    highlightFurnitureContinuous(furnitureId) {
        const furnitureElement = document.querySelector(`[data-furniture-id="${furnitureId}"]`);
        if (furnitureElement) {
            furnitureElement.classList.add('furniture-highlight');
        }
    }

    // 取消家具高亮
    unhighlightFurniture(furnitureId) {
        const furnitureElement = document.querySelector(`[data-furniture-id="${furnitureId}"]`);
        if (furnitureElement) {
            furnitureElement.classList.remove('furniture-highlight');
        }
    }

    // 结束家具互动
    endFurnitureInteraction(furnitureId) {
        const furniture = this.getPlacedFurniture(furnitureId);
        if (!furniture || furniture.type !== 'continuous') {
            return false;
        }
        
        // 恢复心情自然衰减
        if (window.gameSystems?.moodSystem) {
            window.gameSystems.moodSystem.resumeNaturalDecay();
        }
        
        console.log(`结束家具互动: ${furniture.name}`);
        return true;
    }

    // 更新家具显示
    updateFurnitureDisplay(showBackpack = true) {
        const furnitureArea = document.getElementById('furniture-area');
        if (!furnitureArea) return;
        
        // 清空显示区域
        furnitureArea.innerHTML = '';
        
        // 显示已放置的家具
        this.placedFurniture.forEach(furniture => {
            const furnitureElement = this.createFurnitureElement(furniture);
            furnitureArea.appendChild(furnitureElement);
        });
        
        // 在装修模式下显示家具背包（仅在需要时显示）
        if (this.isDecorationMode && showBackpack) {
            this.showFurnitureBackpack();
        }
    }

    // 显示家具背包
    showFurnitureBackpack() {
        const furnitureArea = document.getElementById('furniture-area');
        if (!furnitureArea) return;
        
        // 获取未放置的家具
        const unplacedFurniture = this.playerFurniture.filter(furniture => 
            !this.isFurniturePlaced(furniture.id)
        );
        
        if (unplacedFurniture.length === 0) {
            return;
        }
        
        // 创建家具背包容器
        const backpackContainer = document.createElement('div');
        backpackContainer.className = 'furniture-backpack';
        backpackContainer.innerHTML = `
            <div class="backpack-header">家具背包</div>
            <div class="backpack-items">
                ${unplacedFurniture.map(furniture => `
                    <div class="backpack-item" data-furniture-id="${furniture.id}">
                        <div class="backpack-item-icon">${this.getFurnitureIcon(furniture.id)}</div>
                        <div class="backpack-item-info">
                            <div class="backpack-item-name">${furniture.name}</div>
                            <div class="backpack-item-details">
                                <div class="backpack-item-type">${furniture.type === 'continuous' ? '持续互动型' : '单次互动型'}</div>
                                <div class="backpack-item-effect">${this.getFurnitureEffectDescription(furniture)}</div>
                                ${furniture.behaviors && furniture.behaviors.length > 0 ? `
                                <div class="backpack-item-behaviors">解锁行为: ${furniture.behaviors.join(', ')}</div>
                                ` : ''}
                            </div>
                        </div>
                        <button class="place-btn">放置</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        furnitureArea.appendChild(backpackContainer);
        
        // 添加放置事件
        const placeBtns = backpackContainer.querySelectorAll('.place-btn');
        placeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const furnitureId = btn.closest('.backpack-item').dataset.furnitureId;
                this.placeFurniture(furnitureId);
            });
        });
    }

    // 创建家具元素
    createFurnitureElement(furniture) {
        const element = document.createElement('div');
        element.className = 'furniture-item';
        element.dataset.furnitureId = furniture.id;
        
        // 家具图标和名称
        element.innerHTML = `
            <div class="furniture-icon">${this.getFurnitureIcon(furniture.id)}</div>
            <div class="furniture-name">${furniture.name}</div>
        `;
        
        // 添加点击事件
        element.addEventListener('click', () => {
            if (this.isDecorationMode) {
                // 装修模式下点击直接收回家具
                this.removeFurniture(furniture.id);
            } else {
                // 正常模式下点击显示家具效果窗口
                this.showFurnitureEffectWindow(furniture);
            }
        });
        
        return element;
    }

    // 显示家具详情页面
    showFurnitureDetail(furniture) {
        // 创建详情页面容器
        const detailContainer = document.createElement('div');
        detailContainer.className = 'furniture-detail-container';
        detailContainer.innerHTML = `
            <div class="furniture-detail-content">
                <div class="detail-header">
                    <div class="detail-icon">${this.getFurnitureIcon(furniture.id)}</div>
                    <div class="detail-title">${furniture.name}</div>
                    <button class="detail-close">×</button>
                </div>
                <div class="detail-info">
                    <div class="detail-section">
                        <h3>家具介绍</h3>
                        <p>${this.getFurnitureDescription(furniture.id)}</p>
                    </div>
                    <div class="detail-section">
                        <h3>具体效果</h3>
                        <p>${this.getFurnitureEffectDescription(furniture)}</p>
                    </div>
                    <div class="detail-section">
                        <h3>家具类型</h3>
                        <p>${furniture.type === 'continuous' ? '持续互动型' : '单次互动型'}</p>
                    </div>
                    ${furniture.behaviors && furniture.behaviors.length > 0 ? `
                    <div class="detail-section">
                        <h3>解锁行为</h3>
                        <p>${furniture.behaviors.join(', ')}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(detailContainer);
        
        // 添加关闭事件
        const closeBtn = detailContainer.querySelector('.detail-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(detailContainer);
        });
        
        // 点击外部关闭
        detailContainer.addEventListener('click', (event) => {
            if (event.target === detailContainer) {
                document.body.removeChild(detailContainer);
            }
        });
    }

    // 获取家具描述
    getFurnitureDescription(furnitureId) {
        const descriptions = {
            'switch': '一台Switch游戏机，Yui喜欢用它来玩游戏放松心情。',
            'treadmill': '一台跑步机，Yui可以通过运动来保持健康和活力。',
            'bed': '一张舒适的床，Yui可以在这里休息和睡觉。',
            'mp3': '一个MP3播放器，Yui喜欢听音乐来调节心情。',
            'harry_potter': '一套哈利波特书籍，Yui喜欢阅读魔法故事。',
            'desk': '一张书桌，Yui可以在这里学习和工作。',
            'bookshelf': '一个书架，存放着Yui喜欢的各种书籍。',
            'plant': '一盆绿植，为房间增添生机和活力。',
            'lamp': '一盏台灯，提供温暖的照明。'
        };
        
        return descriptions[furnitureId] || '一件普通的家具，可以为房间增添一些装饰。';
    }

    // 获取家具效果描述
    getFurnitureEffectDescription(furniture) {
        if (furniture.type === 'continuous') {
            return '互动期间暂停心情自然衰减，让Yui保持当前的心情状态。';
        } else if (furniture.type === 'single') {
            return `立即提升Yui的心情 ${furniture.moodEffect} 点。`;
        }
        return '这件家具没有特殊效果。';
    }

    // 显示家具效果窗口
    showFurnitureEffectWindow(furniture) {
        // 创建效果窗口容器
        const effectContainer = document.createElement('div');
        effectContainer.className = 'furniture-effect-container';
        effectContainer.innerHTML = `
            <div class="furniture-effect-content">
                <div class="effect-header">
                    <div class="effect-icon">${this.getFurnitureIcon(furniture.id)}</div>
                    <div class="effect-title">${furniture.name}</div>
                    <button class="effect-close">×</button>
                </div>
                <div class="effect-info">
                    <div class="effect-section">
                        <h3>家具效果</h3>
                        <p>${this.getFurnitureEffectDescription(furniture)}</p>
                    </div>
                    <div class="effect-section">
                        <h3>家具类型</h3>
                        <p class="effect-type ${furniture.type}">${furniture.type === 'continuous' ? '持续互动型' : '单次互动型'}</p>
                    </div>
                    ${furniture.behaviors && furniture.behaviors.length > 0 ? `
                    <div class="effect-section">
                        <h3>解锁行为</h3>
                        <p class="effect-behaviors">${furniture.behaviors.map(behavior => TEXTS.behaviors[behavior] || behavior).join(', ')}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(effectContainer);
        
        // 添加关闭事件
        const closeBtn = effectContainer.querySelector('.effect-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(effectContainer);
        });
        
        // 点击外部关闭
        effectContainer.addEventListener('click', (event) => {
            if (event.target === effectContainer) {
                document.body.removeChild(effectContainer);
            }
        });
    }

    // 显示家具效果描述
    showFurnitureEffect(furniture) {
        let effectDescription = '';
        
        if (furniture.type === 'continuous') {
            effectDescription = `持续互动型家具\n互动期间暂停心情自然衰减`;
        } else if (furniture.type === 'single') {
            effectDescription = `单次互动型家具\n立即提升心情 ${furniture.moodEffect} 点`;
        }
        
        // 添加行为解锁信息
        if (furniture.behaviors && furniture.behaviors.length > 0) {
            effectDescription += `\n解锁行为: ${furniture.behaviors.join(', ')}`;
        }
        
        // 显示效果描述通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                effectDescription,
                'info',
                3000 // 3秒后自动消失
            );
        }
    }

    // 获取家具图标
    getFurnitureIcon(furnitureId) {
        const icons = {
            'switch': '🎮',
            'treadmill': '🏃‍♀️',
            'bed': '🛏️',
            'mp3': '🎵',
            'harry_potter': '📚',
            'desk': '🪑',
            'bookshelf': '📚',
            'plant': '🌿',
            'lamp': '💡'
        };
        
        return icons[furnitureId] || '🪑';
    }

    // 获取随机位置
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * 5) + 1,
            y: Math.floor(Math.random() * 5) + 1  // 增加y轴范围到5行
        };
    }

    // 检查是否拥有家具
    hasFurniture(furnitureId) {
        return this.playerFurniture.some(f => f.id === furnitureId);
    }

    // 检查家具是否已放置
    isFurniturePlaced(furnitureId) {
        return this.placedFurniture.some(f => f.id === furnitureId);
    }

    // 获取玩家拥有的家具
    getPlayerFurniture(furnitureId) {
        return this.playerFurniture.find(f => f.id === furnitureId);
    }

    // 获取已放置的家具
    getPlacedFurniture(furnitureId) {
        return this.placedFurniture.find(f => f.id === furnitureId);
    }

    // 获取所有可购买的家具
    getAvailableFurniture() {
        return Object.values(this.furnitureList).filter(furniture => 
            !this.hasFurniture(furniture.id)
        );
    }

    // 获取已拥有的家具
    getOwnedFurniture() {
        return this.playerFurniture;
    }

    // 获取已放置的家具
    getPlacedFurnitureList() {
        return this.placedFurniture;
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            playerFurniture: this.playerFurniture,
            placedFurniture: this.placedFurniture
        };
        
        try {
            localStorage.setItem('projectyeb_furniture_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存家具数据失败:', error);
        }
        
        // 通知其他系统保存游戏状态
        if (window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 销毁家具系统
    destroy() {
        this.saveGameState();
    }
}

// 创建全局家具系统实例
let furnitureSystem = null;

// 初始化家具系统
function initializeFurnitureSystem() {
    if (!furnitureSystem) {
        furnitureSystem = new FurnitureSystem();
    }
    return furnitureSystem;
}

// 导出家具系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FurnitureSystem, initializeFurnitureSystem };
}
