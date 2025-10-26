// 商店系统
// 负责管理商店的商品购买、库存管理和交易功能

class ShopSystem {
    constructor() {
        this.shopItems = CONFIG.shop.items;
        this.playerInventory = []; // 玩家背包
        this.shopHistory = []; // 购买历史
        
        this.initialize();
    }

    // 初始化商店系统
    initialize() {
        this.loadGameState();
        this.setupEventListeners();
    }

    // 加载游戏状态
    loadGameState() {
        // 测试阶段：每次刷新重置
        if (CONFIG.idle.resetOnRefresh) {
            this.resetToInitial();
            return;
        }
        
        try {
            const saved = localStorage.getItem('projectyeb_shop_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.playerInventory = data.playerInventory || [];
                this.shopHistory = data.shopHistory || [];
            } else {
                this.resetToInitial();
            }
        } catch (error) {
            console.error('加载商店数据失败:', error);
            this.resetToInitial();
        }
    }

    // 重置为初始状态
    resetToInitial() {
        this.playerInventory = [];
        this.shopHistory = [];
    }

    // 设置事件监听器
    setupEventListeners() {
        // 商城按钮点击事件 - 由main.js统一管理
        // 这里不需要重复设置事件监听器
    }

    // 打开商店
    openShop() {
        // 检查是否已有商店窗口
        const existingShop = document.querySelector('.shop-container');
        if (existingShop) {
            existingShop.remove();
        }
        this.createShopUI();
    }

    // 打开礼物背包
    openGiftBackpack() {
        this.createGiftBackpackUI();
    }

    // 创建礼物背包UI
    createGiftBackpackUI() {
        const gifts = this.getPlayerInventory('gifts');
        
        if (gifts.length === 0) {
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    '背包中没有礼物',
                    'info'
                );
            }
            return;
        }

        // 创建背包容器
        const backpackContainer = document.createElement('div');
        backpackContainer.className = 'backpack-container';
        backpackContainer.innerHTML = `
            <div class="backpack-header">
                <h3>🎁 礼物背包</h3>
                <button class="close-backpack">✕</button>
            </div>
            <div class="backpack-content">
                ${gifts.map(gift => `
                    <div class="backpack-item">
                        <div class="backpack-item-info">
                            <div class="backpack-item-icon">${this.getItemIcon(gift.id, 'gifts')}</div>
                            <div class="backpack-item-details">
                                <div class="backpack-item-name">${gift.name}</div>
                                <div class="backpack-item-category">礼物</div>
                                <div class="backpack-item-effects">${gift.effects || ''}</div>
                            </div>
                        </div>
                        <button class="gift-btn" data-gift-id="${gift.id}">赠送</button>
                    </div>
                `).join('')}
            </div>
        `;

        // 添加到页面
        document.body.appendChild(backpackContainer);

        // 设置事件监听器
        this.setupGiftBackpackEventListeners(backpackContainer);
    }

    // 设置礼物背包事件监听器
    setupGiftBackpackEventListeners(container) {
        // 关闭按钮
        const closeBtn = container.querySelector('.close-backpack');
        closeBtn.addEventListener('click', () => {
            container.remove();
        });

        // 赠送按钮
        const giftBtns = container.querySelectorAll('.gift-btn');
        giftBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const giftId = btn.dataset.giftId;
                this.giveGift(giftId);
                container.remove();
            });
        });

        // 点击外部关闭
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                container.remove();
            }
        });
    }

    // 创建商店UI
    createShopUI() {
        // 创建商店容器
        const shopContainer = document.createElement('div');
        shopContainer.className = 'shop-container';
        shopContainer.innerHTML = `
            <div class="shop-header">
                <h3>🎁 商店</h3>
                <button class="close-shop">✕</button>
            </div>
            <div class="shop-tabs">
                <button class="tab-btn active" data-tab="furniture">家具</button>
                <button class="tab-btn" data-tab="gifts">礼物</button>
                <button class="tab-btn" data-tab="items">道具</button>
            </div>
            <div class="shop-content">
                <div class="tab-content active" id="furniture-tab"></div>
                <div class="tab-content" id="gifts-tab"></div>
                <div class="tab-content" id="items-tab"></div>
            </div>
            <div class="shop-footer">
                <div class="player-coins">💰 金币: <span id="shop-coins">${Math.floor(window.gameState.coins)}</span></div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(shopContainer);

        // 设置事件监听器
        this.setupShopEventListeners(shopContainer);

        // 加载商品列表
        this.loadShopItems();
    }

    // 设置商店事件监听器
    setupShopEventListeners(shopContainer) {
        // 关闭按钮
        const closeBtn = shopContainer.querySelector('.close-shop');
        closeBtn.addEventListener('click', () => {
            shopContainer.remove();
        });

        // 标签页切换
        const tabBtns = shopContainer.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有激活状态
                tabBtns.forEach(b => b.classList.remove('active'));
                shopContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // 激活当前标签页
                btn.classList.add('active');
                const tabId = `${btn.dataset.tab}-tab`;
                shopContainer.querySelector(`#${tabId}`).classList.add('active');

                // 加载对应商品
                this.loadShopItems(btn.dataset.tab);
            });
        });

        // 点击外部关闭
        shopContainer.addEventListener('click', (e) => {
            if (e.target === shopContainer) {
                shopContainer.remove();
            }
        });
    }

    // 加载商品列表
    loadShopItems(category = 'furniture') {
        const tabContent = document.querySelector(`#${category}-tab`);
        if (!tabContent) return;

        tabContent.innerHTML = '';

        const items = this.getShopItemsByCategory(category);
        
        if (items.length === 0) {
            tabContent.innerHTML = '<div class="no-items">暂无商品</div>';
            return;
        }

        items.forEach(item => {
            const itemElement = this.createShopItemElement(item, category);
            tabContent.appendChild(itemElement);
        });
    }

    // 创建商品元素
    createShopItemElement(item, category) {
        const element = document.createElement('div');
        element.className = 'shop-item';
        
        const isOwned = this.hasItem(item.id);
        const canAfford = window.gameState.coins >= item.price;
        
        element.innerHTML = `
            <div class="shop-item-info">
                <div class="shop-item-icon">${this.getItemIcon(item.id, category)}</div>
                <div class="shop-item-details">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">💰 ${item.price}金币</div>
                    <div class="shop-item-description">${item.description || ''}</div>
                    ${item.effects ? `<div class="shop-item-effects">效果: ${item.effects}</div>` : ''}
                </div>
            </div>
            <button class="buy-btn ${isOwned ? 'owned' : ''} ${!canAfford ? 'disabled' : ''}" 
                    data-item-id="${item.id}" data-category="${category}">
                ${isOwned ? '已拥有' : '购买'}
            </button>
        `;

        // 添加购买事件
        const buyBtn = element.querySelector('.buy-btn');
        if (!isOwned && canAfford) {
            buyBtn.addEventListener('click', () => {
                this.buyItem(item.id, category);
            });
        }

        return element;
    }

    // 获取商品图标
    getItemIcon(itemId, category) {
        const icons = {
            furniture: {
                'switch': '🎮',
                'treadmill': '🏃‍♀️',
                'bed': '🛏️',
                'mp3': '🎵',
                'harry_potter': '📚',
                'desk': '🪑',
                'bookshelf': '📚',
                'plant': '🌿',
                'lamp': '💡'
            },
            gifts: {
                'chocolate': '🍫',
                'teddy_bear': '🧸',
                'flowers': '💐',
                'book': '📖',
                'music_cd': '💿',
                'jewelry': '💎'
            },
            items: {
                'mood_boost': '💖',
                'exp_boost': '⭐',
                'coin_boost': '💰',
                'time_skip': '⏩'
            }
        };

        return icons[category]?.[itemId] || '🎁';
    }

    // 按分类获取商品
    getShopItemsByCategory(category) {
        return Object.values(this.shopItems).filter(item => 
            item.category === category && !this.hasItem(item.id)
        );
    }

    // 购买商品
    buyItem(itemId, category) {
        const item = this.shopItems[itemId];
        if (!item) {
            console.error(`商品不存在: ${itemId}`);
            return false;
        }

        // 检查是否已拥有
        if (this.hasItem(itemId)) {
            console.log(`已经拥有商品: ${item.name}`);
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    `已经拥有${item.name}`,
                    'info'
                );
            }
            return false;
        }

        // 检查金币是否足够
        if (window.gameState.coins < item.price) {
            console.log(`金币不足，无法购买: ${item.name}`);
            if (window.gameSystems?.notificationSystem) {
                window.gameSystems.notificationSystem.showNotification(
                    `金币不足，无法购买${item.name}`,
                    'error'
                );
            }
            return false;
        }

        // 扣除金币
        window.gameState.coins -= item.price;
        if (window.gameSystems?.idleSystem) {
            window.gameSystems.idleSystem.updateCurrencyDisplay();
        }

        // 添加到背包
        this.playerInventory.push({
            id: itemId,
            name: item.name,
            category: item.category,
            price: item.price,
            effects: item.effects,
            purchasedAt: Date.now()
        });

        // 添加到购买历史
        this.shopHistory.push({
            itemId: itemId,
            itemName: item.name,
            price: item.price,
            purchasedAt: Date.now()
        });

        // 根据商品类型处理
        this.processPurchasedItem(item);

        // 保存游戏状态
        this.saveGameState();

        // 更新商店显示
        this.updateShopDisplay();

        // 显示购买成功通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `成功购买: ${item.name}`,
                'success'
            );
        }

        console.log(`购买商品成功: ${item.name}`);
        return true;
    }

    // 处理购买的商品
    processPurchasedItem(item) {
        switch (item.category) {
            case 'furniture':
                // 家具：添加到家具系统
                if (window.gameSystems?.furnitureSystem) {
                    window.gameSystems.furnitureSystem.buyFurniture(item.id);
                }
                break;

            case 'gifts':
                // 礼物：添加到礼物背包
                // 礼物系统会处理具体的赠送逻辑
                break;

            case 'items':
                // 道具：立即使用
                this.useItem(item.id);
                break;
        }
    }

    // 使用道具
    useItem(itemId) {
        const item = this.shopItems[itemId];
        if (!item || item.category !== 'items') {
            console.error(`道具不存在或不是道具类型: ${itemId}`);
            return false;
        }

        // 应用道具效果
        this.applyItemEffects(item);

        // 从背包中移除（一次性道具）
        this.removeFromInventory(itemId);

        // 显示使用通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `使用了: ${item.name}`,
                'item'
            );
        }

        console.log(`使用道具: ${item.name}`);
        return true;
    }

    // 应用道具效果
    applyItemEffects(item) {
        if (item.effects) {
            // 心情提升道具
            if (item.effects.includes('心情+')) {
                const moodBoost = parseInt(item.effects.match(/心情\+(\d+)/)?.[1]) || 0;
                if (moodBoost > 0 && window.gameSystems?.moodSystem) {
                    window.gameSystems.moodSystem.changeMood(moodBoost, 'item_use');
                }
            }

            // 经验加成道具
            if (item.effects.includes('经验+')) {
                const expBoost = parseInt(item.effects.match(/经验\+(\d+)/)?.[1]) || 0;
                if (expBoost > 0 && window.gameSystems?.levelSystem) {
                    window.gameSystems.levelSystem.addExperience(expBoost);
                }
            }

            // 金币加成道具
            if (item.effects.includes('金币+')) {
                const coinBoost = parseInt(item.effects.match(/金币\+(\d+)/)?.[1]) || 0;
                if (coinBoost > 0 && window.gameState) {
                    window.gameState.coins += coinBoost;
                    if (window.gameSystems?.idleSystem) {
                        window.gameSystems.idleSystem.updateCurrencyDisplay();
                    }
                }
            }

            // 时间跳过道具
            if (item.effects.includes('时间跳过')) {
                // 可以在这里实现时间跳过逻辑
                console.log('时间跳过道具效果');
            }
        }
    }

    // 赠送礼物
    giveGift(giftId) {
        const gift = this.getItemFromInventory(giftId);
        if (!gift || gift.category !== 'gifts') {
            console.error(`礼物不存在或不是礼物类型: ${giftId}`);
            return false;
        }

        // 应用礼物效果
        this.applyGiftEffects(gift);

        // 从背包中移除
        this.removeFromInventory(giftId);

        // 显示赠送通知
        if (window.gameSystems?.notificationSystem) {
            window.gameSystems.notificationSystem.showNotification(
                `赠送了: ${gift.name}`,
                'gift'
            );
        }

        // 触发礼物对话
        this.startGiftDialogue(gift);

        console.log(`赠送礼物: ${gift.name}`);
        return true;
    }

    // 开始礼物对话
    startGiftDialogue(gift) {
        const giftDialogues = {
            'chocolate': [
                {speaker: 'Yui', text: '哇！巧克力！谢谢你！', color: '#ff6b6b'},
                {speaker: '玩家', text: '希望你喜欢这个口味。', color: '#4ecdc4'},
                {speaker: 'Yui', text: '嗯...甜甜的，很好吃！', color: '#ff6b6b'}
            ],
            'teddy_bear': [
                {speaker: 'Yui', text: '好可爱的泰迪熊！', color: '#ff6b6b'},
                {speaker: '玩家', text: '让它陪着你吧。', color: '#4ecdc4'},
                {speaker: 'Yui', text: '我会好好照顾它的！', color: '#ff6b6b'}
            ],
            'flowers': [
                {speaker: 'Yui', text: '这些花好漂亮！', color: '#ff6b6b'},
                {speaker: '玩家', text: '和你一样漂亮。', color: '#4ecdc4'},
                {speaker: 'Yui', text: '(*/ω＼*) 谢谢...', color: '#ff6b6b'}
            ]
        };

        const dialogue = giftDialogues[gift.id] || [
            {speaker: 'Yui', text: '谢谢你送的礼物！', color: '#ff6b6b'},
            {speaker: '玩家', text: '不客气，希望你喜欢。', color: '#4ecdc4'}
        ];

        // 使用对话系统显示礼物对话
        if (window.gameSystems?.dialogueSystem) {
            window.gameSystems.dialogueSystem.startCustomDialogue(dialogue);
        }
    }

    // 应用礼物效果
    applyGiftEffects(gift) {
        if (gift.effects) {
            // 心情提升礼物
            if (gift.effects.includes('心情+')) {
                const moodBoost = parseInt(gift.effects.match(/心情\+(\d+)/)?.[1]) || 0;
                if (moodBoost > 0 && window.gameSystems?.moodSystem) {
                    window.gameSystems.moodSystem.changeMood(moodBoost, 'gift');
                }
            }
        }
    }

    // 更新商店显示
    updateShopDisplay() {
        // 更新金币显示
        const shopCoins = document.getElementById('shop-coins');
        if (shopCoins) {
            shopCoins.textContent = Math.floor(window.gameState.coins);
        }

        // 重新加载商品列表
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            this.loadShopItems(activeTab.dataset.tab);
        }
    }

    // 检查是否拥有商品
    hasItem(itemId) {
        return this.playerInventory.some(item => item.id === itemId);
    }

    // 从背包获取商品
    getItemFromInventory(itemId) {
        return this.playerInventory.find(item => item.id === itemId);
    }

    // 从背包移除商品
    removeFromInventory(itemId) {
        const index = this.playerInventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.playerInventory.splice(index, 1);
            this.saveGameState();
            return true;
        }
        return false;
    }

    // 获取玩家背包
    getPlayerInventory(category = null) {
        if (category) {
            return this.playerInventory.filter(item => item.category === category);
        }
        return this.playerInventory;
    }

    // 获取购买历史
    getShopHistory() {
        return this.shopHistory;
    }

    // 获取总消费金额
    getTotalSpent() {
        return this.shopHistory.reduce((total, purchase) => total + purchase.price, 0);
    }

    // 保存游戏状态
    saveGameState() {
        const data = {
            playerInventory: this.playerInventory,
            shopHistory: this.shopHistory
        };
        
        try {
            localStorage.setItem('projectyeb_shop_data', JSON.stringify(data));
        } catch (error) {
            console.error('保存商店数据失败:', error);
        }
        
        // 通知其他系统保存游戏状态
        if (window.gameSystems?.saveSystem) {
            window.gameSystems.saveSystem.saveGame();
        }
    }

    // 销毁商店系统
    destroy() {
        this.saveGameState();
    }
}

// 创建全局商店系统实例
let shopSystem = null;

// 初始化商店系统
function initializeShopSystem() {
    if (!shopSystem) {
        shopSystem = new ShopSystem();
    }
    return shopSystem;
}

// 导出商店系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShopSystem, initializeShopSystem };
}
