# 仓库架构

## 运行时边界

本仓库包含三个独立运行时：

### 1. HTTP Server（Node.js）

- **入口**：`src/server.js`
- **启动命令**：`npm start`
- **职责**：
  - 提供 `public/` 下的静态资源（HTML、CSS、JavaScript）
  - 提供 `/api/tasks` JSON API 返回任务列表
  - 路径遍历防护
- **依赖**：
  - `src/tasks.js`（数据层）
  - Node.js 内置模块：`node:http`、`node:fs/promises`、`node:path`
- **证据**：`src/server.js:1-75`、`package.json:7`

### 2. Browser Client

- **入口**：`public/index.html` → `public/app.js`
- **职责**：
  - 从 `/api/tasks` 加载任务数据
  - 在页面渲染任务卡片
  - 处理用户交互（当前仅展示）
- **依赖**：
  - `/api/tasks` HTTP 端点
  - `public/styles.css`
- **证据**：`public/index.html:1-29`、`public/app.js:1-48`

### 3. Test Runner（Node.js）

- **入口**：`node --test`
- **启动命令**：`npm test`
- **覆盖范围**：
  - `src/tasks.js` 的数据不可变性
  - `src/server.js` 的 HTTP 集成
- **证据**：`test/tasks.test.js`、`test/server.test.js`、`package.json:8`

## 模块依赖关系

```
src/server.js
  ├─→ src/tasks.js (数据源)
  └─→ public/* (静态文件服务)

public/app.js
  └─→ /api/tasks (HTTP 客户端)

test/tasks.test.js → src/tasks.js
test/server.test.js → src/server.js
```

**依赖方向规则**：

### 规则：[RULE-ARCH-001] 前端不直接引用后端模块

- **分类**：Observed
- **范围**：`public/**`
- **触发条件**：前端代码需要访问后端逻辑或数据
- **规则**：Browser Client SHOULD 通过 HTTP API 与后端通信，不得使用 `require()` 或 `import` 引用 `src/**` 模块
- **原因**：前端代码运行在浏览器环境，无法访问 Node.js 模块系统
- **证据**：`public/app.js:36`（使用 `fetch`）、`src/server.js:26-28`（API 端点）
- **影响**：新增前端功能需要评估是否需要新的 API 端点
- **检查**：`npm test` 包含集成测试

### 规则：[RULE-ARCH-002] 测试可以直接引用被测模块

- **分类**：Observed
- **范围**：`test/**`
- **触发条件**：编写新的单元测试或集成测试
- **规则**：测试文件 SHOULD 使用 `require()` 直接引用 `src/**` 模块
- **原因**：降低测试复杂度，允许细粒度验证
- **证据**：`test/tasks.test.js:3`、`test/server.test.js:3`
- **影响**：测试可以验证内部行为，不仅限于外部契约
- **检查**：`node --test` 执行测试

## 公共契约

### HTTP API

#### GET /api/tasks

- **请求**：无参数
- **响应**：
  ```json
  {
    "tasks": [
      {
        "id": "string",
        "title": "string",
        "status": "todo" | "in_progress" | "done"
      }
    ]
  }
  ```
- **状态码**：200 OK
- **内容类型**：`application/json; charset=utf-8`
- **证据**：`src/server.js:25-29`、`test/server.test.js:10-16`

### 规则：[RULE-ARCH-003] API 响应结构稳定性

- **分类**：Explicit
- **范围**：`src/server.js`、`src/tasks.js`
- **触发条件**：修改 `/api/tasks` 的响应格式或任务对象字段
- **规则**：MUST NOT 在未协调前端的情况下修改 API 响应结构
- **原因**：前端依赖固定的 JSON Schema，破坏性变更会导致渲染失败
- **证据**：`AGENTS.md:20`（禁止修改 `/api/tasks` 数据结构）、`docs/tasks/task-filter-persistence/DESIGN.md:26-28`
- **影响**：前端代码 `public/app.js` 期望固定的字段
- **检查**：`npm test` 包含响应结构断言

## 数据流

1. **启动时**：`src/tasks.js` 定义固定的内存数据
2. **HTTP 请求**：Browser → `/api/tasks` → `src/server.js::handler` → `src/tasks.js::listTasks()`
3. **响应**：JSON 序列化后返回给浏览器
4. **渲染**：`public/app.js::renderTasks()` 生成 DOM

### 规则：[RULE-ARCH-004] 数据源是只读内存固件

- **分类**：Explicit
- **范围**：`src/tasks.js`
- **触发条件**：任何需要持久化任务状态的需求
- **规则**：当前数据源 MUST 保持为只读内存数组，MUST NOT 引入数据库或文件写入
- **原因**：这是一个非生产测试固件，显式排除后端写入
- **证据**：`AGENTS.md:20`、`docs/product/PRD-001-task-filter.md:32`、`README.md:25-26`
- **影响**：筛选、排序等功能必须在前端或只读后端逻辑中实现
- **检查**：人工审查 `src/tasks.js` 和依赖清单

## 外部依赖

### 规则：[RULE-ARCH-005] 零第三方运行时依赖

- **分类**：Explicit
- **范围**：`package.json::dependencies`
- **触发条件**：添加 npm 依赖
- **规则**：MUST NOT 添加第三方运行时依赖（`dependencies` 字段必须为空或不存在）
- **原因**：测试边界明确禁止引入第三方库
- **证据**：`AGENTS.md:20`、`README.md:26`、`package.json:1-13`（当前无 `dependencies` 字段）
- **影响**：所有功能必须使用 Node.js 或浏览器原生 API 实现
- **检查**：`cat package.json | grep -A 5 dependencies`

## 未解决决策

### Pending-001：长期架构演进路径

- **问题**：当前是否有计划从只读固件演进为真实的持久化应用？
- **影响**：如果有，需要提前考虑数据层抽象和 API 版本策略
- **上下文**：README 和 AGENTS.md 均强调这是"非生产"和"disposable"项目
