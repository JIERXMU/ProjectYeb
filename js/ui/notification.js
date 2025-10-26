// 通知系统
// 负责管理游戏中的各种通知和提示信息

class NotificationSystem {
    constructor() {
        this.notificationQueue = [];
        this.maxNotifications = 5; // 最大同时显示通知数量
        this.notificationDuration = 5000; // 默认显示5秒
        this.notificationCounter = 0;
        
        this.initialize();
    }

    // 初始化通知系统
    initialize() {
        this.createNotificationArea();
        console.log('通知系统初始化完成');
    }

    // 创建通知区域
    createNotificationArea() {
        let notificationArea = document.getElementById('notification-area');
        
        if (!notificationArea) {
            notificationArea = document.createElement('div');
            notificationArea.id = 'notification-area';
            notificationArea.className = 'notification-area';
            document.body.appendChild(notificationArea);
        }
        
        this.notificationArea = notificationArea;
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notificationId = `notification-${Date.now()}-${this.notificationCounter++}`;
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">✕</button>
            </div>
        `;
        
        // 添加到通知区域（置顶显示）
        this.notificationArea.insertBefore(notification, this.notificationArea.firstChild);
        
        // 触发动画显示
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
        
        // 设置关闭事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notificationId);
        });
        
        // 自动移除（5秒后）
        setTimeout(() => {
            this.removeNotification(notificationId);
        }, this.notificationDuration);
        
        // 限制最大通知数量
        this.limitNotificationCount();
        
        console.log(`显示通知: ${message} (${type})`);
    }

    // 移除通知
    removeNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;
        
        notification.classList.add('notification-hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300); // 等待动画完成
    }

    // 限制通知数量
    limitNotificationCount() {
        const notifications = this.notificationArea.querySelectorAll('.notification');
        if (notifications.length > this.maxNotifications) {
            // 移除最旧的通知（最后一个）
            const oldestNotification = notifications[notifications.length - 1];
            this.removeNotification(oldestNotification.id);
        }
    }

    // 移除所有通知
    removeAllNotifications() {
        const notifications = this.notificationArea.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });
    }

    // 显示成功通知
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // 显示错误通知
    showError(message) {
        this.showNotification(message, 'error');
    }

    // 显示警告通知
    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    // 显示信息通知
    showInfo(message) {
        this.showNotification(message, 'info');
    }

    // 清除所有通知
    clearAllNotifications() {
        this.removeAllNotifications();
        console.log('清除所有通知');
    }

    // 设置通知显示时长
    setNotificationDuration(duration) {
        this.notificationDuration = Math.max(1000, Math.min(10000, duration)); // 限制在1-10秒之间
        console.log(`通知显示时长设置为: ${this.notificationDuration}ms`);
    }

    // 设置最大通知数量
    setMaxNotifications(maxCount) {
        this.maxNotifications = Math.max(1, Math.min(10, maxCount)); // 限制在1-10之间
        console.log(`最大通知数量设置为: ${this.maxNotifications}`);
    }

    // 获取通知统计信息
    getNotificationStats() {
        const currentCount = this.notificationArea.querySelectorAll('.notification').length;
        
        return {
            current: currentCount,
            maxAllowed: this.maxNotifications,
            duration: this.notificationDuration
        };
    }

    // 暂停通知系统
    pause() {
        // 通知系统不需要特殊的暂停逻辑
    }

    // 恢复通知系统
    resume() {
        // 通知系统不需要特殊的恢复逻辑
    }

    // 销毁通知系统
    destroy() {
        this.clearAllNotifications();
        if (this.notificationArea && this.notificationArea.parentNode) {
            this.notificationArea.parentNode.removeChild(this.notificationArea);
        }
    }
}

// 创建全局通知系统实例
let notificationSystem = null;

// 初始化通知系统
function initializeNotificationSystem() {
    if (!notificationSystem) {
        notificationSystem = new NotificationSystem();
    }
    return notificationSystem;
}

// 导出通知系统供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationSystem, initializeNotificationSystem };
}
