# ProjectYeb 系统扩展实施计划

## 🎯 实施原则
- **保持核心体验**：不破坏Yui养成系统的完整性和流畅性
- **渐进集成**：每个阶段都构建在稳定基础上
- **数据兼容**：确保现有存档数据无缝迁移
- **模块化思路**：新功能作为可选扩展模块

---

## 📋 阶段实施计划

### 阶段一：基础框架与调试工具

#### 核心思路
在现有配置系统基础上扩展数据结构，建立新系统的数值基础

#### 实施步骤
1. **扩展配置系统**
   - 在 `js/config/gameData.js` 中添加：
     ```javascript
     // 职业系统配置
     const CAREERS = {
         'intern': { name: '实习生', baseIncome: 10, focusCost: 2 },
         'assistant': { name: '助理', baseIncome: 20, focusCost: 3 },
         // ... 更多职业
     };
     
     // 技能树配置
     const SKILLS = {
         'efficiency': { name: '工作效率', maxLevel: 10, effect: 0.05 },
         'focus': { name: '专注力', maxLevel: 5, effect: -0.1 },
         // ... 更多技能
     };
     ```

2. **扩展游戏状态**
   - 在 `window.gameState` 中添加：
     ```javascript
     // 打工系统状态
     career: {
         currentJob: 'intern',
         jobLevel: 1,
         jobExp: 0,
         focus: 100,
         lastWorkTime: Date.now()
     },
     
     // 技能系统状态
     skills: {
         efficiency: 0,
         focus: 0,
         // ... 其他技能
     },
     
     // 任务系统状态
     tasks: {
         daily: [],
         promotion: [],
         achievements: []
     }
     ```

3. **扩展调试面板**
   - 在 `js/ui/debugPanel.js` 中添加新系统的调试控件
   - 支持修改职业等级、专注力、技能等级等

#### 验收标准
- ✅ 现有Yui心情、对话、行为系统完全正常
- ✅ 调试工具可以查看和修改新数值
- ✅ 游戏存档加载不受影响
- ✅ 新状态字段有合理的默认值

---

### 阶段二：打工系统核心功能

#### 核心思路
将打工系统作为现有挂机系统的补充，而不是替代

#### 实施步骤
1. **创建打工系统**
   - 新建 `js/systems/careerSystem.js`
   - 参考 `idleSystem` 的时间计算机制
   - 实现专注力消耗和恢复机制

2. **打工收益计算**
   ```javascript
   class CareerSystem {
       calculateWorkIncome() {
           const career = CAREERS[this.currentJob];
           const baseIncome = career.baseIncome;
           const skillBonus = this.calculateSkillBonus();
           const comfortBonus = this.calculateComfortBonus();
           
           return Math.floor(baseIncome * (1 + skillBonus + comfortBonus));
       }
       
       updateFocus() {
           // 专注力自然恢复
           const timeDiff = Date.now() - this.lastUpdateTime;
           const focusRecovery = timeDiff / (1000 * 60) * 0.5; // 每分钟恢复0.5
           this.focus = Math.min(100, this.focus + focusRecovery);
       }
   }
   ```

3. **UI集成**
   - 在信息区添加打工状态显示
   - 使用现有UI组件风格保持一致

#### 验收标准
- ✅ 打工收益自动计算正确
- ✅ 专注力消耗和恢复机制工作
- ✅ 不影响Yui的日常行为和心情变化
- ✅ 打工状态在UI中正确显示

---

### 阶段三：技能树与舒适度加成

#### 核心思路
将技能和舒适度作为打工系统的增强，同时保持与家具系统的关联

#### 实施步骤
1. **扩展家具系统**
   - 在 `FURNITURE` 配置中添加舒适度字段：
     ```javascript
     const FURNITURE = {
         "switch": {
             name: "Switch游戏机", 
             type: "continuous",
             price: 500,
             moodEffect: 2,
             comfortValue: 5,  // 新增舒适度
             behaviors: ["playing_games"]
         }
         // ... 其他家具
     };
     ```

2. **创建技能系统**
   - 新建 `js/systems/skillSystem.js`
   - 实现技能加点逻辑和效果应用

3. **舒适度计算**
   ```javascript
   class ComfortSystem {
       calculateTotalComfort() {
           const placedFurniture = this.getPlacedFurniture();
           return placedFurniture.reduce((total, furniture) => {
               return total + (furniture.comfortValue || 0);
           }, 0);
       }
       
       getComfortBonus() {
           const totalComfort = this.calculateTotalComfort();
           return Math.min(0.5, totalComfort * 0.01); // 每点舒适度提供1%加成，最多50%
       }
   }
   ```

#### 验收标准
- ✅ 技能加点正确应用效果
- ✅ 家具舒适度正确计算并影响打工效率
- ✅ Yui的家具互动行为完全正常
- ✅ 技能树界面操作流畅

---

### 阶段四：任务系统集成

#### 核心思路
任务系统作为连接各个系统的纽带，提供目标导向

#### 实施步骤
1. **创建任务系统**
   - 新建 `js/systems/taskSystem.js`
   - 参考对话系统的分支结构设计任务数据

2. **任务数据结构**
   ```javascript
   const TASKS = {
       daily: [
           {
               id: 'daily_pat_head',
               name: '日常关怀',
               description: '对Yui进行5次摸摸头',
               type: 'interaction',
               target: 5,
               reward: { coins: 50, exp: 10 }
           }
       ],
       promotion: [
           {
               id: 'promotion_level5',
               name: '职场晋升',
               description: '达到职业等级5级',
               type: 'career_level',
               target: 5,
               reward: { coins: 500, skillPoint: 1 }
           }
       ]
   };
   ```

3. **任务进度跟踪**
   - 利用现有的事件监听机制
   - 在相关系统中触发任务进度更新事件

#### 验收标准
- ✅ 任务进度自动正确跟踪
- ✅ 任务奖励发放正常
- ✅ 不影响现有对话触发和选项系统
- ✅ 任务界面显示清晰

---

### 阶段五：系统整合与优化

#### 核心思路
确保所有系统协同工作，提供完整统一的游戏体验

#### 实施步骤
1. **个人资料系统**
   - 新建 `js/systems/profileSystem.js`
   - 整合所有系统的统计和成就

2. **跨系统平衡测试**
   - 测试数值平衡性
   - 优化各系统间的交互

3. **性能优化**
   - 确保新增系统不影响游戏流畅度
   - 优化内存使用和渲染性能

4. **最终用户体验测试**
   - 确保新老系统无缝融合
   - 验证核心体验完整性

#### 验收标准
- ✅ 所有系统协同工作正常
- ✅ 游戏性能保持良好
- ✅ Yui养成核心体验完整无损
- ✅ 用户界面统一协调

---

## 🔧 技术集成要点

### 数据兼容策略
```javascript
// 存档兼容处理
function migrateSaveData(oldData) {
    return {
        ...oldData,
        career: oldData.career || {
            currentJob: 'intern',
            jobLevel: 1,
            jobExp: 0,
            focus: 100,
            lastWorkTime: Date.now()
        },
        skills: oldData.skills || {},
        tasks: oldData.tasks || {}
    };
}
```

### 系统通信机制
```javascript
// 使用现有事件系统
class CareerSystem {
    levelUp() {
        // 触发职业升级事件
        const event = new CustomEvent('careerLevelUp', {
            detail: { newLevel: this.jobLevel }
        });
        document.dispatchEvent(event);
    }
}

// 任务系统监听事件
class TaskSystem {
    constructor() {
        document.addEventListener('careerLevelUp', (event) => {
            this.updatePromotionTasks(event.detail.newLevel);
        });
    }
}
```

### UI集成策略
```javascript
// 在现有布局中添加新UI
function integrateCareerUI() {
    const infoPanel = document.querySelector('.info-panel');
    const careerDisplay = createCareerDisplay();
    infoPanel.appendChild(careerDisplay);
}
```

---

## 📊 阶段性检查清单

### 通用检查项（每个阶段）
- [ ] Yui心情系统的自然衰减和互动影响正常
- [ ] 对话系统的正常触发和选项分支正常
- [ ] 家具互动行为的正常执行
- [ ] 现有存档的加载和保存功能正常
- [ ] 调试面板功能完整

### 阶段特定检查
**阶段一**：
- [ ] 配置系统扩展完整
- [ ] 新状态字段默认值合理
- [ ] 调试工具控件工作正常

**阶段二**：
- [ ] 打工收益计算准确
- [ ] 专注力机制工作正常
- [ ] UI状态显示正确

**阶段三**：
- [ ] 技能效果正确应用
- [ ] 舒适度加成计算准确
- [ ] 家具系统兼容性良好

**阶段四**：
- [ ] 任务进度自动跟踪
- [ ] 任务奖励发放正确
- [ ] 任务界面操作流畅

**阶段五**：
- [ ] 系统间协同工作正常
- [ ] 性能指标达标
- [ ] 用户体验一致性好

---

## 🚀 风险控制与应急预案

### 技术风险
- **数据兼容问题**：实施存档迁移策略，保留旧版本兼容
- **性能下降**：每个阶段进行性能测试，及时优化
- **系统冲突**：保持模块独立性，通过事件松散耦合

### 用户体验风险
- **功能过于复杂**：采用渐进式功能解锁
- **界面拥挤**：使用折叠、标签页管理界面复杂度
- **学习成本高**：提供清晰的新手引导

### 应急预案
1. **回滚机制**：每个阶段完成后创建代码快照
2. **功能开关**：新系统可以通过配置开关启用/禁用
3. **用户反馈**：建立快速反馈渠道，及时调整实施方案

---

## 📈 成功指标

### 技术指标
- 游戏启动时间增加不超过10%
- 内存使用增加不超过15%
- 帧率保持在60fps以上

### 用户体验指标
- 新系统学习时间不超过5分钟
- 核心Yui养成体验无感知影响
- 用户满意度评分保持4.5/5以上

### 功能完整性指标
- 所有系统功能100%可用
- 数据保存和加载100%可靠
- 跨系统交互100%正确

---

*本实施计划基于现有ProjectYeb技术架构，确保平稳扩展和用户体验连续性*
