#!/usr/bin/env bash
# ============================================================
# 运维学习平台 - 一键公网部署脚本
# 用法：在你的电脑上运行 bash deploy.sh
# 支持：GitHub Pages / Netlify / Vercel / Cloudflare Pages / Surge / 本地隧道
# ============================================================
set -e

# 颜色
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
cprint() { echo -e "${CYAN}$1${NC}"; }
okprint() { echo -e "${GREEN}✓ $1${NC}"; }
warnprint() { echo -e "${YELLOW}⚠ $1${NC}"; }
errprint() { echo -e "${RED}✗ $1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
cprint "========================================"
cprint "  运维学习平台 - 公网部署"
cprint "========================================"
echo ""
echo "请选择部署方式："
echo ""
echo "  1) GitHub Pages   — 免费，永久 URL（需 GitHub 账号）"
echo "  2) Netlify        — 免费，自动 HTTPS（需 Netlify 账号）"
echo "  3) Vercel         — 免费，全球 CDN（需 Vercel 账号）"
echo "  4) Cloudflare Pages — 免费，全球 CDN（需 Cloudflare 账号）"
echo "  5) Surge.sh       — 免费，无需注册（仅需邮箱）"
echo "  6) 本地隧道        — 临时公网 URL，无需账号（cloudflared）"
echo ""
read -p "请输入序号 (1-6): " choice

case "$choice" in
  1) deploy_github ;;
  2) deploy_netlify ;;
  3) deploy_vercel ;;
  4) deploy_cloudflare ;;
  5) deploy_surge ;;
  6) deploy_tunnel ;;
  *) errprint "无效选择"; exit 1 ;;
esac

# ------------------------------------------------------------
# 1. GitHub Pages
# ------------------------------------------------------------
deploy_github() {
  cprint "\n>>> GitHub Pages 部署"
  echo "需要：GitHub Personal Access Token（需 repo 权限）"
  echo "获取地址：https://github.com/settings/tokens/new?scopes=repo"
  echo ""
  read -p "GitHub 用户名: " gh_user
  read -p "仓库名 (默认 ops-learning): " gh_repo
  gh_repo="${gh_repo:-ops-learning}"
  read -s -p "GitHub Token: " gh_token
  echo ""

  # 创建仓库
  cprint "创建仓库 $gh_user/$gh_repo ..."
  curl -s -X POST "https://api.github.com/user/repos" \
    -H "Authorization: token $gh_token" \
    -H "Accept: application/vnd.github.v3+json" \
    -d "{\"name\":\"$gh_repo\",\"public\":true}" > /dev/null || {
    errprint "创建仓库失败，可能已存在或 token 无效"; }

  # 初始化 git 并推送
  cprint "推送代码到 GitHub ..."
  git init 2>/dev/null || true
  git config user.email "deploy@ops-learning.app"
  git config user.name "Deploy"
  git add -A
  git commit -m "Deploy ops learning platform" --allow-empty 2>/dev/null || true
  git branch -M main 2>/dev/null || true
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://$gh_token@github.com/$gh_user/$gh_repo.git"
  git push -u origin main --force 2>/dev/null || {
    errprint "推送失败，请检查 token 权限"; exit 1; }

  # 启用 GitHub Pages
  cprint "启用 GitHub Pages ..."
  curl -s -X POST "https://api.github.com/repos/$gh_user/$gh_repo/pages" \
    -H "Authorization: token $gh_token" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{"source":{"branch":"main","path":"/"}}' > /dev/null 2>&1 || true

  okprint "部署完成！"
  echo ""
  cprint "公网地址：https://$gh_user.github.io/$gh_repo/"
  echo "(首次部署需等待 1-2 分钟构建)"
  echo ""
}

# ------------------------------------------------------------
# 2. Netlify
# ------------------------------------------------------------
deploy_netlify() {
  cprint "\n>>> Netlify 部署"
  echo "需要：Netlify Personal Access Token"
  echo "获取地址：https://app.netlify.com/user/applications#personal-access-tokens"
  echo ""
  read -s -p "Netlify Token: " nf_token
  echo ""

  # 检查/安装 netlify-cli
  command -v npx >/dev/null || { errprint "需要 Node.js 和 npx"; exit 1; }

  cprint "部署到 Netlify ..."
  NETLIFY_AUTH_TOKEN="$nf_token" npx --yes netlify-cli deploy \
    --dir="$SCRIPT_DIR" --prod --json 2>/dev/null | \
    grep -o '"url":"[^"]*"' | head -1 || true

  okprint "部署完成！"
  echo ""
  cprint "登录 https://app.netlify.com 查看你的公网 URL"
  echo ""
}

# ------------------------------------------------------------
# 3. Vercel
# ------------------------------------------------------------
deploy_vercel() {
  cprint "\n>>> Vercel 部署"
  echo "首次运行会引导你登录 Vercel"
  echo ""
  command -v npx >/dev/null || { errprint "需要 Node.js 和 npx"; exit 1; }

  cprint "部署到 Vercel ..."
  npx --yes vercel "$SCRIPT_DIR" --prod --yes

  okprint "部署完成！查看上方输出的 URL"
  echo ""
}

# ------------------------------------------------------------
# 4. Cloudflare Pages
# ------------------------------------------------------------
deploy_cloudflare() {
  cprint "\n>>> Cloudflare Pages 部署"
  echo "需要：Cloudflare API Token（需 Cloudflare Pages 权限）"
  echo "获取地址：https://dash.cloudflare.com/profile/api-tokens"
  echo ""
  read -p "Cloudflare Account ID: " cf_account
  read -s -p "Cloudflare API Token: " cf_token
  echo ""
  read -p "项目名 (默认 ops-learning): " cf_project
  cf_project="${cf_project:-ops-learning}"

  command -v npx >/dev/null || { errprint "需要 Node.js 和 npx"; exit 1; }

  cprint "部署到 Cloudflare Pages ..."
  CLOUDFLARE_ACCOUNT_ID="$cf_account" CLOUDFLARE_API_TOKEN="$cf_token" \
    npx --yes wrangler pages deploy "$SCRIPT_DIR" --project-name="$cf_project" --commit-dirty=true

  okprint "部署完成！"
  echo ""
  cprint "公网地址：https://$cf_project.pages.dev"
  echo ""
}

# ------------------------------------------------------------
# 5. Surge.sh
# ------------------------------------------------------------
deploy_surge() {
  cprint "\n>>> Surge.sh 部署"
  echo "Surge 免费且无需预注册，输入邮箱密码即可自动创建账号"
  echo ""
  command -v npx >/dev/null || { errprint "需要 Node.js 和 npx"; exit 1; }

  read -p "邮箱: " surge_email
  read -p "想要的域名 (默认 ops-learning.surge.sh): " surge_domain
  surge_domain="${surge_domain:-ops-learning.surge.sh}"

  cprint "部署到 Surge.sh ..."
  npx --yes surge "$SCRIPT_DIR" "$surge_domain" --add \
    --email "$surge_email" 2>&1 || {
    errprint "Surge 部署失败，请检查网络"; exit 1; }

  okprint "部署完成！"
  echo ""
  cprint "公网地址：http://$surge_domain"
  echo ""
}

# ------------------------------------------------------------
# 6. 本地隧道 (pinggy SSH tunnel，支持 HTTP 代理)
# ------------------------------------------------------------
deploy_tunnel() {
  cprint "\n>>> 本地隧道部署 (pinggy)"

  # 启动本地 HTTP 服务（后台）
  cprint "启动本地 HTTP 服务 (端口 8000) ..."
  (cd "$SCRIPT_DIR" && python3 -m http.server 8000 --bind 127.0.0.1 &) 2>/dev/null || \
  (cd "$SCRIPT_DIR" && python -m http.server 8000 --bind 127.0.0.1 &) 2>/dev/null
  sleep 2

  # 构建 SSH 命令（自动检测 HTTP 代理）
  SSH_OPTS="-o StrictHostKeyChecking=no -o ServerAliveInterval=30 -p 443 -R0:localhost:8000 a.pinggy.io"
  if [ -n "$HTTPS_PROXY" ]; then
    PROXY_HOST=$(echo "$HTTPS_PROXY" | sed 's|http://||;s|https://||;s|/.*||')
    cprint "检测到 HTTP 代理 ($PROXY_HOST)，通过代理连接..."
    SSH_CMD="ssh -o ProxyCommand=\"nc -X connect -x $PROXY_HOST %h %p\" $SSH_OPTS"
  else
    SSH_CMD="ssh $SSH_OPTS"
  fi

  echo ""
  echo "========================================"
  echo "  等待分配公网 URL（约 10-15 秒）..."
  echo "  出现 URL 后即可分享给他人访问"
  echo "  按 Ctrl+C 停止后公网链接失效"
  echo "  免费隧道 60 分钟后过期"
  echo "========================================"
  echo ""
  eval "$SSH_CMD"
}
