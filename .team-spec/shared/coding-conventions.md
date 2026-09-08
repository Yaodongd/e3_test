# 编码约定

## 文件组织

### 规则：[RULE-CODE-001] 后端模块职责单一

- **分类**：Observed
- **范围**：`src/**`
- **触发条件**：新增或重构后端模块
- **规则**：每个 `.js` 文件 SHOULD 专注于单一职责
- **原因**：便于测试和维护
- **证据**：
  - `src/tasks.js`：仅负责任务数据
  - `src/server.js`：仅负责 HTTP 服务和路由
- **影响**：新功能可能需要新增模块
- **检查**：人工审查模块边界

### 规则：[RULE-CODE-002] 导出明确的公共接口

- **分类**：Observed
- **范围**：`src/**`、`public/**`（仅限模块化 JS）
- **触发条件**：创建可复用模块
- **规则**：模块 SHOULD 通过 `module.exports` 显式导出公共接口
- **原因**：明确 API 边界，便于测试和重构
- **证据**：
  - `src/tasks.js:12`：`module.exports = { listTasks }`
  - `src/server.js:74`：`module.exports = { handler, server }`
- **影响**：新模块应遵循相同模式
- **检查**：`grep -r 'module.exports' src/`

## 命名约定

### 规则：[RULE-CODE-003] 函数使用 camelCase

- **分类**：Observed
- **范围**：`src/**`、`public/**`
- **触发条件**：定义新函数
- **规则**：函数名 SHOULD 使用 `camelCase`
- **原因**：符合 JavaScript 社区惯例
- **证据**：
  - `src/tasks.js:8`：`listTasks`
  - `src/server.js:16`：`safePublicPath`
  - `public/app.js:7`：`renderTasks`
  - `public/app.js:34`：`loadTasks`
- **影响**：所有新函数应遵循
- **检查**：代码审查

### 规则：[RULE-CODE-004] 常量使用 UPPER_SNAKE_CASE

- **分类**：Observed
- **范围**：`src/**`、`public/**`
- **触发条件**：定义模块级不可变数据
- **规则**：顶层不可变常量 SHOULD 使用 `UPPER_SNAKE_CASE`
- **原因**：清晰标识不可变配置
- **证据**：
  - `src/tasks.js:1`：`TASKS`
  - `src/server.js:6-8`：`host`、`port`（例外：配置值使用 `camelCase`）
- **影响**：新的固定数据结构应考虑此模式
- **检查**：代码审查

### 规则：[RULE-CODE-005] CSS 类名使用 kebab-case

- **分类**：Observed
- **范围**：`public/*.html`、`public/*.css`、`public/*.js`（DOM 操作）
- **触发条件**：定义或引用 CSS 类
- **规则**：CSS 类名 SHOULD 使用 `kebab-case`
- **原因**：HTML/CSS 社区惯例
- **证据**：
  - `public/app.js:14`：`task-card`
  - `public/app.js:18`：`task-id`
  - `public/app.js:25`：`status-${task.status}`
  - `public/index.html:17-22`：`section-heading`、`task-list`、`error`
- **影响**：新 UI 组件应遵循
- **检查**：代码审查

## 代码风格

### 规则：[RULE-CODE-006] 使用双引号表示字符串

- **分类**：Observed
- **范围**：`src/**`、`test/**`
- **触发条件**：编写新的字符串字面量
- **规则**：字符串字面量 SHOULD 优先使用双引号 `"`
- **原因**：保持代码库一致性
- **证据**：
  - `src/server.js:11-13`：所有字符串使用双引号
  - `test/tasks.test.js:16-17`：测试字符串使用双引号
- **影响**：前端代码 `public/app.js` 也遵循此模式
- **检查**：代码审查

### 规则：[RULE-CODE-007] 使用 const 和 let，避免 var

- **分类**：Observed
- **范围**：所有 `.js` 文件
- **触发条件**：声明变量
- **规则**：SHOULD 使用 `const`（默认）或 `let`，MUST NOT 使用 `var`
- **原因**：块级作用域更安全，符合现代 JavaScript 最佳实践
- **证据**：全仓库搜索无 `var` 声明
  - `src/server.js:6-8`：使用 `const`
  - `public/app.js` 使用 `const`、`let`（循环变量）
- **影响**：所有新代码应遵循
- **检查**：`grep -r '\bvar\s' src/ test/ public/` 应无输出

### 规则：[RULE-CODE-008] 分号结尾

- **分类**：Observed
- **范围**：所有 `.js` 文件
- **触发条件**：编写语句
- **规则**：语句 SHOULD 以分号 `;` 结尾
- **原因**：避免 ASI（自动分号插入）的边界情况
- **证据**：
  - `src/server.js:6-8`
  - `test/tasks.test.js:6-11`
  - `public/app.js:31`
- **影响**：所有新代码应遵循
- **检查**：代码审查

## 注释

### 规则：[RULE-CODE-009] 避免冗余注释

- **分类**：Observed
- **范围**：所有 `.js` 文件
- **触发条件**：添加代码注释
- **规则**：SHOULD 通过清晰的命名和结构表达意图，仅在非显而易见的逻辑处添加注释
- **原因**：代码即文档；冗余注释容易过时
- **证据**：当前代码库无内联注释，仅依赖描述性命名
  - `src/server.js:16`：`safePublicPath`（名称已表达意图）
  - `src/tasks.js:8`：`listTasks()`（名称清晰）
- **影响**：新代码应优先命名清晰性
- **检查**：代码审查

## 错误处理

### 规则：[RULE-CODE-010] HTTP 错误返回 JSON

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：处理 HTTP 错误响应
- **规则**：API 端点的错误响应 SHOULD 返回 JSON 格式，包含 `error` 字段
- **原因**：前端可以统一解析错误
- **证据**：
  - `src/server.js:33`：405 响应返回 `{ error: "method_not_allowed" }`
  - `src/server.js:64`：500 响应返回 `{ error: "internal_error" }`
- **影响**：新 API 端点应遵循相同模式
- **检查**：测试覆盖错误场景

### 规则：[RULE-CODE-011] 前端错误记录到控制台

- **分类**：Observed
- **范围**：`public/app.js`
- **触发条件**：捕获前端异步错误
- **规则**：前端错误 SHOULD 使用 `console.error()` 记录，并向用户显示友好提示
- **原因**：开发时便于调试，生产时提供用户反馈
- **证据**：
  - `public/app.js:41`：`console.error(error)`
  - `public/app.js:42-43`：更新 UI 显示错误状态
- **影响**：新的异步操作应遵循
- **检查**：浏览器控制台验证

## 不可变性

### 规则：[RULE-CODE-012] 数据防御性拷贝

- **分类**：Observed
- **范围**：`src/tasks.js`
- **触发条件**：返回内部状态给调用方
- **规则**：返回可变数据时 SHOULD 进行浅拷贝，防止外部修改
- **原因**：保护内部状态不被意外修改
- **证据**：
  - `src/tasks.js:1`：`Object.freeze(TASKS)`
  - `src/tasks.js:9`：`TASKS.map((task) => ({ ...task }))`（每次返回新对象）
  - `test/tasks.test.js:14-18`：验证不可变性
- **影响**：新的数据访问函数应考虑是否需要防御性拷贝
- **检查**：相关测试覆盖

## 未解决决策

### Pending-004：Linter 和格式化工具

- **问题**：是否应引入 ESLint 或 Prettier 自动化代码风格检查？
- **影响**：当前依赖人工代码审查；自动化工具可提高一致性但需要第三方依赖
- **上下文**：当前禁止第三方运行时依赖，但 devDependencies 可能例外
