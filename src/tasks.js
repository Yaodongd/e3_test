const TASKS = Object.freeze([
  Object.freeze({ id: "REQ-101", title: "准备项目工程规约", status: "todo" }),
  Object.freeze({ id: "REQ-102", title: "验证异步开发工作区", status: "in_progress" }),
  Object.freeze({ id: "REQ-103", title: "记录验收结果", status: "done" }),
  Object.freeze({ id: "REQ-104", title: "检查异常状态恢复", status: "todo" })
]);

function listTasks() {
  return TASKS.map((task) => ({ ...task }));
}

module.exports = { listTasks };

