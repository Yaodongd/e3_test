# Design：任务看板筛选与状态记忆

## 建议方案

1. 将纯筛选及查询参数解析/序列化逻辑放在独立 JavaScript 模块中，保证可由 Node.js 测试。
2. `app.js` 负责加载任务、绑定控件和渲染。
3. 使用 `URLSearchParams` 和 History API 同步 URL，不刷新页面。
4. 监听 `popstate`，处理浏览器前进和后退。
5. 在已有样式体系内增加筛选区和空状态。

实现可以调整文件拆分，但必须满足 PRD 和 Change Boundary。

## Change Boundary

允许修改：

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `public/` 下新增的筛选逻辑模块
- `test/` 下与本需求直接相关的测试

禁止修改：

- `src/tasks.js` 中的任务数据结构
- API 协议
- 部署配置和外部系统

## 必须执行的检查

```bash
npm test
```

浏览器检查：

- 关键词、状态及组合筛选；
- 刷新、复制 URL、前进、后退；
- 清除筛选和无结果状态；
- 窄屏布局；
- 控制台错误。

