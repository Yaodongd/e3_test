const test = require("node:test");
const assert = require("node:assert/strict");
const { server } = require("../src/server");

test("GET /api/tasks returns the fixture", async (t) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/tasks`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.tasks.length, 4);
  assert.equal(payload.tasks[0].id, "REQ-101");
});

