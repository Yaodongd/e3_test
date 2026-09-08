# E3 / OEC 异步开发测试仓库

这是一个用于验证 OEC 异步开发流程的非生产项目。当前基线提供一个只读任务看板，后续测试任务要求增加筛选能力。

## 本地运行

```bash
npm test
npm start
```

然后访问 `http://localhost:3000`。

## 测试任务

- canonical taskRef：`versioned:v1.0.0/task-filter-persistence`
- PRD：`docs/product/PRD-001-task-filter.md`
- Spec：`docs/tasks/task-filter-persistence/SPEC.md`
- Design：`docs/tasks/task-filter-persistence/DESIGN.md`
- 交接说明：`HANDOFF.md`

## 安全边界

- 仅允许修改本仓库。
- 不接入数据库、真实用户信息或生产服务。
- 不引入第三方运行时依赖。
- 不触发部署或 Pipeline，除非测试负责人另行批准。

