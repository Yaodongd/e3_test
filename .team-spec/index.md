# 工程规约索引

## 分析信息

- **Revision**：`6aef239f3106c5ac2b48a76468793aaa517ce70c`
- **工作区状态**：Clean（除 `.claude/` 目录外无未提交改动）
- **分析时间**：2026-09-08
- **分析范围**：全仓库代码、测试、文档和配置

## 仓库概述

这是一个用于 OEC 异步开发流程验证的非生产测试项目，提供一个基于 Node.js 的任务看板 Web 应用。

### 运行时与包结构

| 运行时 | 入口 | 职责 | 证据 |
|--------|------|------|------|
| HTTP Server | `src/server.js` | 提供静态资源和 `/api/tasks` JSON API | `package.json::scripts.start` |
| Browser Client | `public/index.html` → `public/app.js` | 渲染任务列表 | `public/index.html:26` |
| Test Runner | Node.js Test Runner | 执行单元测试和集成测试 | `package.json::scripts.test` |

当前不存在独立的包边界或模块划分，所有代码位于同一仓库根目录的分层结构中。

## 规约文档

- [仓库架构](repository/architecture.md)：运行时、入口、依赖关系
- [变更边界](repository/change-boundaries.md)：当前任务的明确约束和影响范围
- [编码约定](shared/coding-conventions.md)：代码风格和命名模式
- [测试](shared/testing.md)：测试策略和模式
- [安全与配置](shared/security-and-configuration.md)：安全约束和配置规则
- [前端开发](frontend/index.md)：浏览器端开发规则

## 如何使用

1. 根据要修改的文件或运行时，查找相关的规约文档。
2. 检查 **分类** 字段：
   - `Explicit`：必须遵守的明确规则
   - `Observed`：当前代码库中观察到的模式，建议遵循以保持一致性
   - `Pending`：尚未明确的决策点，需要团队确认
3. 在实施前阅读 [变更边界](repository/change-boundaries.md)。

## 分类统计

| 分类 | 数量 | 说明 |
|------|------|------|
| Explicit | 8 | 由 AGENTS.md、HANDOFF.md、PRD、Spec、Design 明确规定 |
| Observed | 12 | 由当前代码重复模式支持 |
| Pending | 3 | 需要团队决策 |

## 未解决决策

见 [变更边界](repository/change-boundaries.md) 中的 `Pending` 规则。

主要待决问题：
1. 未来是否接受后端状态写入
2. 第三方运行时依赖的审批流程
3. 生产部署的边界和授权

## 排除和未扫描区域

- **外部系统**：无真实外部依赖
- **CI/CD**：当前无 CI 配置文件
- **部署配置**：显式排除在测试范围外
- **认证授权**：不在当前项目范围内

## 刷新指引

`Explicit` 内容来自团队文档，应原样保留。若仓库证据与其冲突，将冲突记录为 `Pending`，不要静默改写。`Observed` 内容仅在当前仓库证据支持时更新。
