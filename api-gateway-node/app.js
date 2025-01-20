const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
require("dotenv").config();

app.use(
  "/user",
  createProxyMiddleware({
    target: process.env.USER_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/user" + rewrittenPath;
    },
  })
);

app.use(
  "/organisation",
  createProxyMiddleware({
    target: process.env.ORG_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/organisation" + rewrittenPath;
    },
  })
);

app.use(
  "/project",
  createProxyMiddleware({
    target: process.env.PROJECT_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/project" + rewrittenPath;
    },
  })
);

app.use(
  "/task",
  createProxyMiddleware({
    target: process.env.TASK_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/task" + rewrittenPath;
    },
  })
);

app.use(
  "/sprint",
  createProxyMiddleware({
    target: process.env.SPRINT_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/sprint" + rewrittenPath;
    },
  })
);

app.use(
  "/attachment",
  createProxyMiddleware({
    target: process.env.SPRINT_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/attachment" + rewrittenPath;
    },
  })
);

app.use(
  "/comment",
  createProxyMiddleware({
    target: process.env.SPRINT_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/comment" + rewrittenPath;
    },
  })
);

app.use(
  "/email",
  createProxyMiddleware({
    target: process.env.SPRINT_API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewrittenPath = path.replace(/^\/user/, "");
      return "/email" + rewrittenPath;
    },
  })
);

app.listen(3000, () => {
  console.log("Node API Gateway Started!! in Port 3000");
});
