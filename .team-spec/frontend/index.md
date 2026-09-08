# 前端开发规约

## UI 结构

### 规则：[RULE-FE-001] 语义化 HTML

- **分类**：Observed
- **范围**：`public/index.html`、`public/app.js`（DOM 生成）
- **触发条件**：编写 HTML 标记或生成 DOM
- **规则**：SHOULD 使用语义化 HTML5 元素表达文档结构
- **原因**：提升可访问性和 SEO
- **证据**：
  - `public/index.html:10`：`<main>`
  - `public/index.html:11`：`<header>`
  - `public/index.html:17`：`<section>`
  - `public/app.js:13`：`<article>`（任务卡片）
- **影响**：新 UI 组件应选择恰当的语义元素
- **检查**：HTML 验证器

### 规则：[RULE-FE-002] 可访问名称和关系

- **分类**：Explicit
- **范围**：`public/**`
- **触发条件**：添加交互控件或内容区域
- **规则**：控件 MUST 有可访问名称；区域 SHOULD 使用 ARIA 标签关联
- **原因**：PRD 明确要求键盘操作和可访问性
- **证据**：
  - `docs/product/PRD-001-task-filter.md:30`：控件必须有可访问名称
  - `public/index.html:17`：`aria-labelledby="task-heading"`
  - `public/index.html:20`：`aria-live="polite"`（实时更新通知）
- **影响**：筛选控件必须有 `<label>` 或 `aria-label`
- **检查**：屏幕阅读器测试、axe DevTools

### 规则：[RULE-FE-003] 字符编码声明

- **分类**：Observed
- **范围**：`public/index.html`
- **触发条件**：创建 HTML 页面
- **规则**：HTML 页面 MUST 在 `<head>` 中声明 `<meta charset="utf-8">`
- **原因**：确保中文等多字节字符正确显示
- **证据**：
  - `public/index.html:4`：`<meta charset="utf-8">`
  - `public/index.html:2`：`<html lang="zh-CN">`
- **影响**：新页面应遵循
- **检查**：浏览器检查中文显示

### 规则：[RULE-FE-004] 响应式视口

- **分类**：Observed
- **范围**：`public/index.html`
- **触发条件**：创建移动端友好页面
- **规则**：HTML 页面 SHOULD 包含 `viewport` meta 标签
- **原因**：在移动设备上正确缩放
- **证据**：
  - `public/index.html:5`：`<meta name="viewport" content="width=device-width, initial-scale=1">`
- **影响**：新页面应遵循
- **检查**：移动设备或模拟器测试

## JavaScript 模式

### 规则：[RULE-FE-005] DOM 操作等待加载完成

- **分类**：Observed
- **范围**：`public/*.js`
- **触发条件**：访问 DOM 元素
- **规则**：脚本 SHOULD 使用 `defer` 属性，或在 DOMContentLoaded 后执行
- **原因**：确保 DOM 元素已解析
- **证据**：
  - `public/index.html:26`：`<script src="/app.js" defer></script>`
  - `public/app.js:47`：顶层直接调用 `loadTasks()`（因为 `defer` 保证 DOM 就绪）
- **影响**：新脚本应添加 `defer` 或显式等待 DOMContentLoaded
- **检查**：移除 `defer` 后验证是否报错

### 规则：[RULE-FE-006] 使用 querySelector 精确选择

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：访问 DOM 元素
- **规则**：DOM 查询 SHOULD 使用 `querySelector()` 和明确的选择器
- **原因**：类型安全；减少歧义
- **证据**：
  - `public/app.js:8`：`document.querySelector("#task-list")`
  - `public/app.js:9`：`document.querySelector("#task-count")`
  - `public/app.js:43`：`document.querySelector("#error-message")`
- **影响**：新 DOM 访问应遵循
- **检查**：代码审查

### 规则：[RULE-FE-007] replaceChildren 清空容器

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：重新渲染列表
- **规则**：清空容器时 SHOULD 使用 `replaceChildren()` 而非 `innerHTML = ""`
- **原因**：性能更好；避免重新解析 HTML
- **证据**：
  - `public/app.js:10`：`list.replaceChildren()`
- **影响**：新渲染逻辑应遵循
- **检查**：性能分析

### 规则：[RULE-FE-008] 构造 DOM 使用 createElement

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：动态生成 HTML
- **规则**：动态内容 SHOULD 使用 `document.createElement()` 和 `textContent`，避免拼接 HTML 字符串
- **原因**：防止 XSS；类型安全
- **证据**：
  - `public/app.js:13-28`：完全使用 `createElement()` 和 `append()`
  - `public/app.js:19`：`id.textContent = task.id`（自动转义）
- **影响**：新 UI 渲染应遵循
- **检查**：代码审查

### 规则：[RULE-FE-009] 使用 hidden 属性控制可见性

- **分类**：Observed
- **范围**：`public/app.js`、`public/index.html`
- **触发条件**：显示/隐藏元素
- **规则**：元素显示状态 SHOULD 通过 `hidden` 布尔属性控制，而非 CSS `display`
- **原因**：语义清晰；CSS 重置安全
- **证据**：
  - `public/index.html:23`：`<p id="error-message" ... hidden>`
  - `public/app.js:43`：`document.querySelector("#error-message").hidden = false`
- **影响**：新的条件显示应遵循
- **检查**：浏览器 DevTools 检查属性

## 异步与网络

### 规则：[RULE-FE-010] 使用 async/await 处理异步

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：发起异步操作
- **规则**：异步函数 SHOULD 使用 `async/await` 语法
- **原因**：可读性；错误处理清晰
- **证据**：
  - `public/app.js:34`：`async function loadTasks()`
  - `public/app.js:36`：`await fetch(...)`
  - `public/app.js:38`：`await response.json()`
- **影响**：新异步操作应遵循
- **检查**：代码审查

### 规则：[RULE-FE-011] HTTP 错误检查响应状态

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：使用 `fetch()` 发起请求
- **规则**：`fetch()` 调用后 SHOULD 检查 `response.ok`
- **原因**：`fetch()` 不会为 HTTP 4xx/5xx 抛出异常
- **证据**：
  - `public/app.js:37`：`if (!response.ok) throw new Error(...)`
- **影响**：新 API 调用应遵循
- **检查**：手动触发 500 错误并验证处理

### 规则：[RULE-FE-012] 网络错误提供用户反馈

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：异步操作失败
- **规则**：网络或数据加载错误 SHOULD 更新 UI 提示用户，并记录到控制台
- **原因**：用户体验；开发调试
- **证据**：
  - `public/app.js:40-44`：更新 `#task-count` 和显示 `#error-message`
  - `public/app.js:41`：`console.error(error)`
- **影响**：新异步操作应遵循
- **检查**：断开网络后刷新页面

## 状态管理

### 规则：[RULE-FE-013] 当前任务需要 URL 状态同步

- **分类**：Explicit
- **范围**：`versioned:v1.0.0/task-filter-persistence`
- **触发条件**：实施筛选功能
- **规则**：筛选状态 MUST 与 URL 查询参数双向同步
  - 非空关键词 → `?q=<keyword>`
  - 非"全部"状态 → `?status=<status>`
  - URL 更新不得触发整页刷新
  - 监听 `popstate` 处理前进/后退
- **原因**：PRD 功能需求 7、8、9、10
- **证据**：
  - `docs/product/PRD-001-task-filter.md:23-26`
  - `docs/tasks/task-filter-persistence/DESIGN.md:7-8`
- **影响**：需要使用 `URLSearchParams` 和 History API
- **检查**：浏览器手动测试刷新、复制 URL、前进/后退

### 规则：[RULE-FE-014] 实时更新使用 aria-live

- **分类**：Observed
- **范围**：`public/index.html`
- **触发条件**：内容频繁变化且用户需要感知
- **规则**：实时更新区域 SHOULD 使用 `aria-live="polite"`
- **原因**：屏幕阅读器可以通告变化
- **证据**：
  - `public/index.html:20`：`<span id="task-count" aria-live="polite">`
- **影响**：筛选结果数量变化会自动通告
- **检查**：屏幕阅读器验证

## 数据本地化

### 规则：[RULE-FE-015] 状态字段使用映射表翻译

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：显示枚举值
- **规则**：后端枚举值 SHOULD 通过映射表转换为用户友好的本地化文本
- **原因**：API 使用英文标识符；UI 显示中文
- **证据**：
  - `public/app.js:1-5`：`statusLabels` 映射表
  - `public/app.js:26`：`statusLabels[task.status] || task.status`（降级为原值）
- **影响**：新枚举字段应遵循
- **检查**：浏览器检查显示文本

## 样式约定

### 规则：[RULE-FE-016] 外部样式表

- **分类**：Observed
- **范围**：`public/index.html`
- **触发条件**：添加 CSS
- **规则**：CSS SHOULD 放在外部 `.css` 文件中，避免内联样式
- **原因**：可维护性；CSP 兼容
- **证据**：
  - `public/index.html:7`：`<link rel="stylesheet" href="/styles.css">`
  - HTML 中无 `<style>` 或 `style` 属性
- **影响**：新样式应添加到 `styles.css`
- **检查**：代码审查

### 规则：[RULE-FE-017] 响应式布局支持窄屏

- **分类**：Explicit
- **范围**：`public/styles.css`
- **触发条件**：修改布局和样式
- **规则**：布局 MUST 在窄屏（移动设备）上保持可用
- **原因**：PRD 非功能要求和验收标准
- **证据**：
  - `docs/product/PRD-001-task-filter.md:33`：保持窄屏可用
  - `docs/tasks/task-filter-persistence/DESIGN.md:40`：窄屏布局检查
- **影响**：新 UI 需要在移动设备或模拟器上验证
- **检查**：Chrome DevTools 设备模拟

## 空状态处理

### 规则：[RULE-FE-018] 无结果时显示明确提示

- **分类**：Explicit
- **范围**：`public/app.js`（筛选后渲染）
- **触发条件**：筛选结果为空
- **规则**：无匹配结果时 MUST 显示明确的空状态提示，而不是空白区域
- **原因**：PRD 功能需求 6
- **证据**：
  - `docs/product/PRD-001-task-filter.md:22`
- **影响**：实施筛选时需要添加空状态 UI
- **检查**：输入不存在的关键词后检查 UI

## 模块化（当前任务）

### 规则：[RULE-FE-019] 纯筛选逻辑独立模块

- **分类**：Explicit
- **范围**：`public/`（新增文件）
- **触发条件**：实施筛选功能
- **规则**：纯筛选逻辑（不依赖 DOM）SHOULD 放在独立 JavaScript 模块中，以便 Node.js 测试
- **原因**：Design 建议；PRD 要求为筛选逻辑增加测试
- **证据**：
  - `docs/tasks/task-filter-persistence/DESIGN.md:5`
  - `docs/product/PRD-001-task-filter.md:46`
- **影响**：可能创建 `public/filter.js` 或类似文件
- **检查**：`node` 环境可以 `require()` 该模块

## 未解决决策

### Pending-009：前端构建工具链

- **问题**：是否应引入打包工具（如 esbuild、Rollup）支持模块化？
- **影响**：当前只能使用 `<script>` 标签或 ES modules（需浏览器支持）
- **上下文**：Node.js 20+ 支持 ES modules；但测试需要 CommonJS

### Pending-010：前端测试环境

- **问题**：如何在 Node.js 环境测试 DOM 操作代码？
- **影响**：当前只能手动测试浏览器行为；纯函数可以单元测试
- **上下文**：可能需要 jsdom（第三方依赖）或端到端测试框架
