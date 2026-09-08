# 安全与配置

## 安全边界

### 规则：[RULE-SEC-001] 路径遍历防护

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：提供静态文件服务
- **规则**：静态文件访问 MUST 验证解析后的路径在 `publicRoot` 内
- **原因**：防止攻击者通过 `../` 访问敏感文件（如 `src/`、`.env`）
- **证据**：
  - `src/server.js:16-20`：`safePublicPath()` 检查 `resolved.startsWith(publicRoot + path.sep)`
  - `src/server.js:37-42`：无效路径返回 404
- **影响**：修改静态文件服务逻辑时必须保留此检查
- **检查**：手动测试 `curl http://localhost:3000/../package.json` 应返回 404

### 规则：[RULE-SEC-002] 无认证和授权机制

- **分类**：Explicit
- **范围**：整个应用
- **触发条件**：任何访问控制需求
- **规则**：当前 MUST NOT 实现认证、授权或用户账号系统
- **原因**：这是非生产测试环境，刻意保持简单
- **证据**：
  - `AGENTS.md:20`：禁止添加认证
  - `README.md:25`：不接入真实用户信息
  - 代码中无认证中间件
- **影响**：所有数据和功能对本地网络完全开放
- **检查**：代码审查 `src/server.js`

### 规则：[RULE-SEC-003] 无敏感数据存储

- **分类**：Explicit
- **范围**：整个应用
- **触发条件**：存储任何数据
- **规则**：MUST NOT 存储敏感信息（密码、令牌、个人身份信息）
- **原因**：测试环境无安全保障
- **证据**：
  - `README.md:25`：不接入真实用户信息或生产服务
  - `src/tasks.js:1-6`：仅包含测试用的虚拟任务数据
- **影响**：所有数据必须是虚构的测试数据
- **检查**：代码审查和数据审查

### 规则：[RULE-SEC-004] 无远程系统访问

- **分类**：Explicit
- **范围**：所有代码
- **触发条件**：发起网络请求或外部 API 调用
- **规则**：MUST NOT 访问或修改远程系统（数据库、API、云服务）
- **原因**：限制测试环境的爆炸半径
- **证据**：
  - `AGENTS.md:20`：不修改远程系统
  - `README.md:25-26`：不接入生产服务
  - 代码中无外部 HTTP 客户端
- **影响**：所有功能必须在本地实现
- **检查**：代码审查网络调用

## 配置管理

### 规则：[RULE-SEC-005] 服务器配置通过环境变量

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：修改服务器配置
- **规则**：运行时配置 SHOULD 通过环境变量提供，并有合理默认值
- **原因**：不同环境可能需要不同端口；避免硬编码
- **证据**：
  - `src/server.js:7`：`const port = Number(process.env.PORT || 3000)`
  - `src/server.js:6`：`const host = "127.0.0.1"`（硬编码，仅限本地）
- **影响**：新配置项应遵循相同模式
- **检查**：`PORT=4000 npm start` 验证

### 规则：[RULE-SEC-006] 禁止 .env 文件提交

- **分类**：Explicit
- **范围**：Git 版本控制
- **触发条件**：创建配置文件
- **规则**：`.env` 文件 MUST 在 `.gitignore` 中排除
- **原因**：防止意外提交敏感配置
- **证据**：
  - `.gitignore:4`：`.env`
- **影响**：当前项目无 `.env` 文件，但模式已定义
- **检查**：`git status` 不应显示 `.env`

### 规则：[RULE-SEC-007] 服务器仅监听本地回环

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：启动 HTTP 服务器
- **规则**：开发服务器 SHOULD 监听 `127.0.0.1`，不监听 `0.0.0.0`
- **原因**：防止外部网络访问未加固的测试服务
- **证据**：
  - `src/server.js:6`：`const host = "127.0.0.1"`
  - `src/server.js:70`：`server.listen(port, host, ...)`
- **影响**：同一局域网的其他设备无法访问
- **检查**：`netstat -an | grep :3000` 应显示 `127.0.0.1:3000`

## 错误处理与信息泄漏

### 规则：[RULE-SEC-008] 生产错误不泄漏堆栈

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：处理服务器错误
- **规则**：HTTP 500 错误 SHOULD 返回通用错误消息，不包含堆栈跟踪
- **原因**：防止向客户端泄漏内部实现细节
- **证据**：
  - `src/server.js:62`：`console.error(error)`（服务端日志）
  - `src/server.js:64`：仅返回 `{ error: "internal_error" }`，无堆栈
- **影响**：新错误处理应遵循
- **检查**：手动触发错误并检查响应体

### 规则：[RULE-SEC-009] 404 响应不泄漏文件系统路径

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：文件未找到
- **规则**：404 响应 SHOULD 返回通用消息，不包含绝对路径
- **原因**：避免泄漏服务器文件系统结构
- **证据**：
  - `src/server.js:39-42`：404 仅返回 `"Not found"`
  - `src/server.js:52-55`：`ENOENT` 错误同样返回通用 404
- **影响**：新路由应遵循
- **检查**：`curl http://localhost:3000/nonexistent` 检查响应

## HTTP 安全头

### 规则：[RULE-SEC-010] 内容类型显式声明

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：返回 HTTP 响应
- **规则**：响应 SHOULD 显式设置 `Content-Type` 头，包含字符编码
- **原因**：防止浏览器 MIME 嗅探；确保正确的字符解码
- **证据**：
  - `src/server.js:10-14`：为每种文件类型定义 `content-type` 和 `charset`
  - `src/server.js:26`：JSON 响应包含 `charset=utf-8`
  - `src/server.js:47-49`：静态文件包含正确的 `content-type`
- **影响**：新响应应遵循
- **检查**：`curl -I http://localhost:3000/` 检查头

## 输入验证

### 规则：[RULE-SEC-011] HTTP 方法验证

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：处理 HTTP 请求
- **规则**：不支持的 HTTP 方法 SHOULD 返回 405 Method Not Allowed
- **原因**：明确 API 契约；防止意外行为
- **证据**：
  - `src/server.js:31-35`：非 GET 请求返回 405
- **影响**：新端点应验证 HTTP 方法
- **检查**：`curl -X POST http://localhost:3000/api/tasks` 应返回 405

### 规则：[RULE-SEC-012] URL 参数解析使用标准 API

- **分类**：Observed
- **范围**：`src/server.js`
- **触发条件**：解析请求 URL
- **规则**：URL 解析 SHOULD 使用 `URL` 构造函数，不手动拆分字符串
- **原因**：防止解析错误和注入攻击
- **证据**：
  - `src/server.js:23`：`new URL(request.url, ...)`
  - `src/server.js:25`：`url.pathname`
- **影响**：新端点应使用相同模式
- **检查**：代码审查

## 依赖管理

### 规则：[RULE-SEC-013] 无运行时依赖减少攻击面

- **分类**：Explicit
- **范围**：`package.json`
- **触发条件**：添加依赖
- **规则**：MUST NOT 添加第三方运行时依赖
- **原因**：减少供应链攻击风险；简化安全审计
- **证据**：
  - `package.json:1-13`：无 `dependencies` 字段
  - `AGENTS.md:20`、`README.md:26`：明确禁止
- **影响**：所有功能必须使用 Node.js 或浏览器原生 API
- **检查**：`npm ls --production` 应为空

## 日志

### 规则：[RULE-SEC-014] 错误日志不包含敏感信息

- **分类**：Observed
- **范围**：所有日志输出
- **触发条件**：记录错误或调试信息
- **规则**：日志 SHOULD 避免包含密码、令牌或个人身份信息
- **原因**：防止日志泄漏
- **证据**：
  - `src/server.js:62`：`console.error(error)`（当前无敏感数据）
  - `public/app.js:41`：`console.error(error)`（HTTP 错误对象）
- **影响**：如果未来处理用户输入，需要过滤敏感字段
- **检查**：代码审查和日志审查

## 未解决决策

### Pending-007：CSP（内容安全策略）

- **问题**：是否应添加 Content-Security-Policy 头？
- **影响**：当前无 CSP；添加可防止 XSS，但需要仔细配置内联脚本策略
- **上下文**：`public/app.js` 作为外部脚本加载，符合 CSP 最佳实践

### Pending-008：HTTPS 和证书管理

- **问题**：本地开发是否需要 HTTPS？
- **影响**：当前使用 HTTP；某些浏览器特性（如 Service Worker）需要 HTTPS
- **上下文**：`localhost` 被浏览器视为安全上下文，大多数特性可用
