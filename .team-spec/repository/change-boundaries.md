# 变更边界

本文档记录当前任务 `versioned:v1.0.0/task-filter-persistence` 的明确变更约束。

## 当前任务边界

### 规则：[RULE-BOUNDARY-001] 允许修改的路径

- **分类**：Explicit
- **范围**：整个仓库
- **触发条件**：实施 `versioned:v1.0.0/task-filter-persistence` 任务
- **规则**：只能修改以下路径：
  - `public/**`（包括新增文件）
  - `test/**`（仅限与本任务直接相关的测试）
  - 与任务直接相关的文档修正
- **原因**：保持任务范围聚焦，避免意外影响服务端逻辑
- **证据**：`AGENTS.md:14-18`、`docs/tasks/task-filter-persistence/DESIGN.md:15-22`
- **影响**：筛选功能必须在前端实现；不得修改 `src/**`
- **检查**：`git status --porcelain | grep -v '^?? \(public/\|test/\|docs/\)'` 应无输出

### 规则：[RULE-BOUNDARY-002] 禁止修改的内容

- **分类**：Explicit
- **范围**：全仓库
- **触发条件**：实施任何任务
- **规则**：MUST NOT 进行以下修改：
  - `src/tasks.js` 的任务数据结构
  - `/api/tasks` 的 API 协议
  - 添加数据库、认证、分析、部署配置
  - 添加第三方运行时依赖
  - 访问或修改远程系统
- **原因**：保持测试环境简单、可控、可复现
- **证据**：`AGENTS.md:20`、`docs/product/PRD-001-task-filter.md:32`、`docs/tasks/task-filter-persistence/DESIGN.md:24-28`
- **影响**：所有新功能必须使用原生 API；状态持久化仅限浏览器本地存储或 URL
- **检查**：人工审查 `git diff` 和 `package.json`

### 规则：[RULE-BOUNDARY-003] 前端变更的局部性

- **分类**：Observed
- **范围**：`public/**`
- **触发条件**：修改前端代码
- **规则**：前端变更 SHOULD 优先通过新增模块实现，而不是大幅重写 `app.js`
- **原因**：降低回归风险，便于代码审查
- **证据**：`docs/tasks/task-filter-persistence/DESIGN.md:5-6`（建议独立筛选模块）
- **影响**：筛选逻辑可以放在 `public/filter.js` 等独立文件中
- **检查**：审查 `git diff public/app.js` 的行数变化

## 跨边界触发条件

以下情况可能需要跨越当前边界：

### 触发条件：服务端筛选需求

- **技术范围**：Cross-runtime（前端 → 后端）
- **当前状态**：PRD 明确排除
- **触发方式**：如果未来需要支持大数据集的分页或索引筛选
- **受影响方**：`src/server.js`、`src/tasks.js`、前端调用方
- **证据**：`docs/product/PRD-001-task-filter.md:38`（不在范围内）

### 触发条件：第三方依赖引入

- **技术范围**：External
- **当前状态**：明确禁止
- **触发方式**：需要复杂前端框架或工具链
- **受影响方**：`package.json`、构建流程、CI/CD
- **证据**：`AGENTS.md:20`、`README.md:26`

## 部署与 CI 边界

### 规则：[RULE-BOUNDARY-004] 禁止触发部署

- **分类**：Explicit
- **范围**：所有操作
- **触发条件**：任何可能触发自动部署或 Pipeline 的操作
- **规则**：MUST NOT 触发部署、访问生产系统或启动 CI Pipeline
- **原因**：这是测试环境，未经授权的部署可能影响真实系统
- **证据**：`HANDOFF.md:21`、`README.md:27`
- **影响**：只能本地验证 `npm test` 和浏览器手动测试
- **检查**：人工确认无 CI 配置变更、无部署命令执行

## Git 操作边界

### 规则：[RULE-BOUNDARY-005] 保留用户本地改动

- **分类**：Explicit
- **范围**：Git 操作
- **触发条件**：任何 Git 命令
- **规则**：MUST NOT 提交、推送、合并、重置或删除用户的本地改动
- **原因**：让用户完全控制版本历史和提交时机
- **证据**：当前系统指令
- **影响**：完成任务后应报告状态，由用户决定 commit 和 push
- **检查**：`git log --oneline -5`（HEAD 应保持在初始 commit）

## 测试边界

### 规则：[RULE-BOUNDARY-006] 必须执行的验证

- **分类**：Explicit
- **范围**：任务完成前
- **触发条件**：声称任务完成
- **规则**：MUST 执行以下检查并报告结果：
  - `npm test`（退出码必须为 0）
  - 浏览器手动验证（PRD 第 7 节的 10 项功能需求）
  - 控制台无新增错误
  - 窄屏布局可用
  - 变更路径符合 Change Boundary
- **原因**：验收标准明确定义
- **证据**：`HANDOFF.md:19-20`、`docs/product/PRD-001-task-filter.md:43-48`、`docs/tasks/task-filter-persistence/DESIGN.md:29-42`
- **影响**：无法自动化的浏览器检查需要人工确认
- **检查**：逐项执行并记录结果

## 未解决决策

### Pending-002：第三方依赖审批流程

- **问题**：如果未来任务确实需要第三方库（如测试库、打包工具），审批和例外流程是什么？
- **影响**：当前是绝对禁止，但可能限制测试覆盖率或开发效率
- **上下文**：当前使用 Node.js 内置测试运行器，无外部测试框架

### Pending-003：长期部署授权

- **问题**：谁有权限批准将此项目（或其衍生版本）部署到非本地环境？
- **影响**：如果测试成功后需要演示或集成，需要明确审批链
- **上下文**：README.md:27 提到"除非测试负责人另行批准"
