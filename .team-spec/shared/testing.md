# 测试

## 测试框架

### 规则：[RULE-TEST-001] 使用 Node.js 内置测试运行器

- **分类**：Explicit
- **范围**：所有自动化测试
- **触发条件**：编写或运行测试
- **规则**：MUST 使用 Node.js 内置的 `node:test` 模块，MUST NOT 引入第三方测试框架
- **原因**：避免第三方依赖，保持环境简洁
- **证据**：
  - `package.json:8`：`"test": "node --test"`
  - `test/tasks.test.js:1`：`require("node:test")`
  - `test/server.test.js:1`：`require("node:test")`
- **影响**：测试必须使用 `node:test` 和 `node:assert/strict` API
- **检查**：`npm test`

## 测试文件组织

### 规则：[RULE-TEST-002] 测试文件命名约定

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：创建新测试文件
- **规则**：测试文件 SHOULD 命名为 `<module-name>.test.js`，放置在 `test/` 目录
- **原因**：`node --test` 默认发现 `test/` 下的 `.test.js` 文件
- **证据**：
  - `test/tasks.test.js`：测试 `src/tasks.js`
  - `test/server.test.js`：测试 `src/server.js`
- **影响**：新测试应遵循命名模式
- **检查**：`node --test` 自动发现

### 规则：[RULE-TEST-003] 测试层级对应源码结构

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：为 `src/` 模块编写测试
- **规则**：测试文件 SHOULD 与被测模块同名（加 `.test` 后缀）
- **原因**：便于定位和维护
- **证据**：
  - `test/tasks.test.js` ↔ `src/tasks.js`
  - `test/server.test.js` ↔ `src/server.js`
- **影响**：`src/new-module.js` 应对应 `test/new-module.test.js`
- **检查**：目录对比

## 测试类型

### 单元测试

#### 规则：[RULE-TEST-004] 单元测试直接引用模块

- **分类**：Observed
- **范围**：`test/**`（单元测试）
- **触发条件**：测试纯函数或数据层
- **规则**：单元测试 SHOULD 使用 `require()` 直接引用被测模块并验证其行为
- **原因**：快速、无副作用、易于调试
- **证据**：
  - `test/tasks.test.js:3`：`const { listTasks } = require("../src/tasks")`
  - `test/tasks.test.js:5-12`：直接调用并断言
- **影响**：新数据层或工具函数应有单元测试
- **检查**：`npm test`

### 集成测试

#### 规则：[RULE-TEST-005] HTTP 集成测试使用临时端口

- **分类**：Observed
- **范围**：`test/server.test.js`
- **触发条件**：测试 HTTP 服务器行为
- **规则**：集成测试 SHOULD 使用端口 `0`（操作系统分配随机可用端口），并在测试后清理
- **原因**：避免端口冲突，支持并行测试
- **证据**：
  - `test/server.test.js:6`：`server.listen(0, "127.0.0.1", resolve)`
  - `test/server.test.js:7`：`t.after(() => new Promise(...))`（清理回调）
- **影响**：新的服务器测试应遵循
- **检查**：并发运行 `npm test` 无端口冲突

### 规则：[RULE-TEST-006] 集成测试验证真实 HTTP 交互

- **分类**：Observed
- **范围**：`test/server.test.js`
- **触发条件**：测试 HTTP 端点
- **规则**：集成测试 SHOULD 启动真实服务器并使用 `fetch()` 发起请求
- **原因**：验证完整请求/响应周期，包括序列化、路由和错误处理
- **证据**：
  - `test/server.test.js:6-7`：启动服务器
  - `test/server.test.js:10`：`await fetch(...)`
  - `test/server.test.js:13-15`：断言状态码和响应体
- **影响**：新 API 端点应有集成测试
- **检查**：`npm test`

## 断言风格

### 规则：[RULE-TEST-007] 使用 strict 模式断言

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：编写测试断言
- **规则**：SHOULD 使用 `node:assert/strict`，避免宽松相等
- **原因**：严格断言捕获更多潜在错误（如 `==` vs `===`）
- **证据**：
  - `test/tasks.test.js:2`：`require("node:assert/strict")`
  - `test/server.test.js:2`：`require("node:assert/strict")`
  - `test/tasks.test.js:7`：`assert.equal(tasks.length, 4)`（严格相等）
- **影响**：所有新断言应使用 strict 模式
- **检查**：代码审查

### 规则：[RULE-TEST-008] 结构断言使用 deepEqual

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：比较对象或数组
- **规则**：比较复杂数据结构时 SHOULD 使用 `assert.deepEqual()`
- **原因**：递归比较属性值
- **证据**：
  - `test/tasks.test.js:8-11`：`assert.deepEqual(new Set(...), new Set(...))`
- **影响**：验证 JSON 响应结构时应使用 `deepEqual`
- **检查**：代码审查

## 测试描述

### 规则：[RULE-TEST-009] 测试名称描述行为而非实现

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：编写测试用例
- **规则**：测试名称 SHOULD 描述"做什么"和"期望结果"，而非"如何实现"
- **原因**：测试即文档；行为导向的描述更稳定
- **证据**：
  - `test/tasks.test.js:5`：`"listTasks returns the non-production fixture"`
  - `test/tasks.test.js:14`：`"callers cannot mutate the shared fixture"`
  - `test/server.test.js:5`：`"GET /api/tasks returns the fixture"`
- **影响**：新测试应遵循相同风格
- **检查**：代码审查

## 测试覆盖范围

### 规则：[RULE-TEST-010] 关键契约必须有测试

- **分类**：Observed
- **范围**：所有公共 API 和数据层
- **触发条件**：导出新的公共函数或端点
- **规则**：公共契约（导出函数、HTTP 端点）SHOULD 有对应的自动化测试
- **原因**：防止意外破坏外部依赖方
- **证据**：
  - `src/tasks.js::listTasks` → `test/tasks.test.js`（2 个测试）
  - `src/server.js` → `test/server.test.js`（1 个集成测试）
- **影响**：新功能完成前应编写测试
- **检查**：`npm test` 和代码审查

### 规则：[RULE-TEST-011] 当前任务必须增加相关测试

- **分类**：Explicit
- **范围**：`versioned:v1.0.0/task-filter-persistence`
- **触发条件**：实施筛选功能
- **规则**：MUST 为纯筛选逻辑和 URL 参数处理增加自动化测试
- **原因**：PRD 验收标准明确要求
- **证据**：`docs/product/PRD-001-task-filter.md:46`
- **影响**：新增的 `public/filter.js` 或类似模块需要可测试设计
- **检查**：`npm test` 包含新测试用例

## 测试数据

### 规则：[RULE-TEST-012] 使用固定的测试固件

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：测试需要输入数据
- **规则**：测试 SHOULD 使用 `src/tasks.js` 中的固定数据或内联字面量，避免随机数据
- **原因**：可复现性；测试失败时易于调试
- **证据**：
  - `test/tasks.test.js:6-11`：断言固定的 `length` 和 `status` 值
  - `test/tasks.test.js:17`：断言固定的 `title` 值
  - `test/server.test.js:15`：断言固定的 `id` 值
- **影响**：新测试应使用确定性数据
- **检查**：代码审查

## 测试隔离

### 规则：[RULE-TEST-013] 集成测试清理资源

- **分类**：Observed
- **范围**：`test/server.test.js`
- **触发条件**：测试创建外部资源（服务器、文件、连接）
- **规则**：集成测试 SHOULD 使用 `t.after()` 注册清理回调
- **原因**：防止资源泄漏和测试间干扰
- **证据**：
  - `test/server.test.js:7`：`t.after(() => new Promise((resolve) => server.close(resolve)))`
- **影响**：新的资源创建测试应遵循
- **检查**：`npm test` 后无残留进程或端口占用

## 未解决决策

### Pending-005：测试覆盖率目标

- **问题**：是否应设定代码覆盖率目标（如 80% 行覆盖）？
- **影响**：当前无覆盖率报告；引入可能需要工具（如 `c8`）
- **上下文**：Node.js 20+ 内置 `--experimental-test-coverage`，但仍为实验性功能

### Pending-006：前端单元测试策略

- **问题**：如何测试 `public/**` 中的浏览器代码（DOM 操作、`fetch`）？
- **影响**：当前无前端单元测试；可能需要 jsdom 或 headless browser
- **上下文**：PRD 要求为筛选逻辑增加测试；纯函数部分可以在 Node.js 环境测试
