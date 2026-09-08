const statusLabels = {
  todo: "待处理",
  in_progress: "进行中",
  done: "已完成"
};

function renderTasks(tasks) {
  const list = document.querySelector("#task-list");
  const count = document.querySelector("#task-count");
  list.replaceChildren();

  for (const task of tasks) {
    const article = document.createElement("article");
    article.className = "task-card";

    const identity = document.createElement("div");
    const id = document.createElement("span");
    id.className = "task-id";
    id.textContent = task.id;
    const title = document.createElement("h3");
    title.textContent = task.title;
    identity.append(id, title);

    const status = document.createElement("span");
    status.className = `status status-${task.status}`;
    status.textContent = statusLabels[task.status] || task.status;
    article.append(identity, status);
    list.append(article);
  }

  count.textContent = `共 ${tasks.length} 条`;
}

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    renderTasks(payload.tasks);
  } catch (error) {
    console.error(error);
    document.querySelector("#task-count").textContent = "加载失败";
    document.querySelector("#error-message").hidden = false;
  }
}

loadTasks();

