# 部署到自建服务器（CI/CD）

项目使用 **GitHub Actions** 在 `main` 分支有 push 时自动构建并 SSH 部署到你的服务器。

---

## 一、在 GitHub 仓库里配置 Secrets

在仓库 **Settings → Secrets and variables → Actions** 里新增以下 Secrets（名字必须一致）：

| Secret 名称       | 说明 |
|-------------------|------|
| `DEPLOY_HOST`     | 服务器 IP 或域名，例如 `123.45.67.89` 或 `my-server.com` |
| `DEPLOY_USER`     | SSH 登录用户名，例如 `root` 或 `deploy` |
| `DEPLOY_SSH_KEY`  | 用于登录的 SSH **私钥** 全文（含 `-----BEGIN ... KEY-----` 和 `-----END ... KEY-----`） |
| `DEPLOY_PATH`     | 服务器上的部署目录绝对路径，例如 `/var/www/paperfolio`；CI 会把构建产物同步到这里 |

可选（若 SSH 端口不是 22）：在 workflow 里为 `easingthemes/ssh-deploy` 和 `appleboy/ssh-action` 增加 `REMOTE_PORT` / `port`，并在 Secrets 里加 `DEPLOY_PORT` 后引用。

---

## 二、服务器环境要求

1. **Node.js**：建议 18 或 20（与 CI 里 `node-version` 一致即可）。
2. **PM2**：用于启动/重启 Next 进程。
   ```bash
   npm install -g pm2
   ```
3. **部署目录**：`DEPLOY_PATH` 需存在且 `DEPLOY_USER` 有写权限。
   ```bash
   sudo mkdir -p /var/www/paperfolio
   sudo chown -R $USER:$USER /var/www/paperfolio
   ```
4. **SSH**：该用户能用对应私钥登录（把公钥放进 `~/.ssh/authorized_keys`）。

---

## 三、首次在服务器上准备目录

```bash
# 创建目录并授权（路径按你设置的 DEPLOY_PATH 改）
sudo mkdir -p /var/www/paperfolio
sudo chown -R $(whoami):$(whoami) /var/www/paperfolio
```

首次部署由 CI 通过 rsync 把 `.next/standalone/` 内容同步到 `DEPLOY_PATH`，之后每次 push 到 `main` 都会自动同步并执行 `pm2 restart paperfolio`（若未存在则 `pm2 start server.js --name paperfolio`）。

---

## 四、对外访问（可选）

Next 默认监听 3000 端口。若要用域名访问，可在服务器上装 **Nginx**，反向代理到 `http://127.0.0.1:3000`，并配置 SSL（如 Let’s Encrypt）。示例 Nginx 配置：

```nginx
server {
  listen 80;
  server_name your-domain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

---

## 五、流程小结

1. 在 GitHub 配置好 `DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_SSH_KEY`、`DEPLOY_PATH`。
2. 服务器上安装 Node、PM2，创建 `DEPLOY_PATH` 并授权，保证 SSH 用私钥可登录。
3. 本地 `git push origin main` 后，Actions 自动：安装依赖 → 构建 → 打包 standalone → rsync 到服务器 → SSH 执行 `pm2 restart paperfolio`。

构建产物为 Next 的 **standalone** 输出（`next.config.mjs` 里已设置 `output: "standalone"`），无需在服务器上执行 `pnpm install` 或 `pnpm build`。
