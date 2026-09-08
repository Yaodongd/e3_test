const test = require("node:test");
const assert = require("node:assert/strict");
const { listTasks } = require("../src/tasks");

test("listTasks returns the non-production fixture", () => {
  const tasks = listTasks();
  assert.equal(tasks.length, 4);
  assert.deepEqual(
    new Set(tasks.map((task) => task.status)),
    new Set(["todo", "in_progress", "done"])
  );
});

test("callers cannot mutate the shared fixture", () => {
  const first = listTasks();
  first[0].title = "changed";
  assert.equal(listTasks()[0].title, "准备项目工程规约");
});

