# Spec：任务看板筛选与状态记忆

- taskRef：`versioned:v1.0.0/task-filter-persistence`
- 状态：Ready
- 来源：`docs/product/PRD-001-task-filter.md`

## 输入

- `/api/tasks` 返回的任务数组；
- URL 查询参数 `q` 和 `status`；
- 用户在筛选控件中的输入。

## 输出

- 符合全部筛选条件的任务卡片；
- 当前结果数量或无结果提示；
- 与筛选状态一致的 URL。

## 规则

- 合法状态仅为 `todo`、`in_progress`、`done`；空值表示全部。
- 关键词规范化为去除首尾空格后的字符串，匹配时忽略大小写。
- URL 更新不得触发整页刷新。
- 浏览器前进/后退后，控件和结果必须与 URL 一致。

## Ready 条件

- PRD、Spec、Design 和 HANDOFF 均存在；
- 基线测试通过；
- Change Boundary 明确；
- 不依赖远端写入。

