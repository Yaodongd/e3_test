const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const { listTasks } = require("./tasks");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const publicRoot = path.resolve(__dirname, "..", "public");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

function safePublicPath(pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(publicRoot, `.${requested}`);
  return resolved.startsWith(publicRoot + path.sep) ? resolved : null;
}

async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/api/tasks") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ tasks: listTasks() }));
    return;
  }

  if (request.method !== "GET") {
    response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }

  const filePath = safePublicPath(url.pathname);
  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    throw error;
  }
}

const server = http.createServer((request, response) => {
  handler(request, response).catch((error) => {
    console.error(error);
    response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "internal_error" }));
  });
});

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`E3 test board listening at http://${host}:${port}`);
  });
}

module.exports = { handler, server };

