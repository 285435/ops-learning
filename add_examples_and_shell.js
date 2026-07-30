/**
 * 1. 为现有48个知识点添加 example 实例字段
 * 2. 新建 shell 学科知识点（含实例）
 * 3. 合并 Shell 200道题目到 QUESTIONS
 * 4. 全部写回 data.js
 */
const fs = require('fs');

// ========== 读取原始 data.js ==========
const raw = fs.readFileSync('/workspace/data.js', 'utf8');
eval(raw.replace('const KNOWLEDGE', 'global.__K__').replace('const QUESTIONS', 'global.__Q__'));
const K = global.__K__;
const Q = global.__Q__;

// ========== 实例定义（按 topicId 映射）==========
const EXAMPLES = {
  // ---- 网络 ----
  'net-osi': `# 用 tcpdump 抓包观察各层协议
# 数据链路层（ARP）
tcpdump -i eth0 arp -n
# 网络层（ICMP）
ping -c 3 8.8.8.8
# 传输层（TCP 三次握手）
tcpdump -i eth0 'host 8.8.8.8 and port 53' -n
# 应用层（HTTP）
curl -v http://example.com`,

  'net-tcp': `# 用 tcpdump 观察 TCP 三次握手
# 客户端 192.168.1.100 访问 8.8.8.8:53
tcpdump -i eth0 'host 8.8.8.8 and port 53' -n -S

# 输出示例：
# 1. SYN      192.168.1.100.12345 > 8.8.8.8.53: Flags [S], seq 123456
# 2. SYN+ACK  8.8.8.8.53 > 192.168.1.100.12345: Flags [S.], seq 789, ack 123457
# 3. ACK      192.168.1.100.12345 > 8.8.8.8.53: Flags [.], ack 790`,

  'net-tcp-udp': `# TCP 连接（可靠）
curl http://example.com        # HTTP 基于 TCP
ssh user@192.168.1.1           # SSH 基于 TCP

# UDP 连接（快速）
dig @8.8.8.8 example.com       # DNS 基于 UDP 端口 53
nc -u 192.168.1.1 514          # syslog 基于 UDP

# 查看 TCP/UDP 连接
ss -tlnp    # 查看 TCP 监听端口
ss -ulnp    # 查看 UDP 监听端口`,

  'net-http': `# HTTP 请求示例
curl -v -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbG..." \\
  -d '{"name":"Tom","email":"tom@test.com"}'

# 响应状态码：
# 200 OK        - 请求成功
# 201 Created   - 资源创建成功
# 301           - 永久重定向
# 404 Not Found - 资源不存在
# 500           - 服务器内部错误`,

  'net-subnet': `# 子网划分计算
# 将 192.168.1.0/24 划分为 4 个子网
# 借 2 位 → 子网掩码 /26 = 255.255.255.192

# 子网1: 192.168.1.0/26   范围 .1-.62   广播 .63
# 子网2: 192.168.1.64/26  范围 .65-.126 广播 .127
# 子网3: 192.168.1.128/26 范围 .129-.190 广播 .191
# 子网4: 192.168.1.192/26 范围 .193-.254 广播 .255

# 每个子网可用主机: 2^6 - 2 = 62 台

# 用 ipcalc 验证
ipcalc 192.168.1.0/26`,

  'net-dns': `# DNS 查询实例
dig www.example.com           # 查询 A 记录
dig www.example.com CNAME     # 查询 CNAME 记录
dig @8.8.8.8 example.com MX   # 指定 DNS 服务器查 MX
dig -x 8.8.8.8                # 反向解析 PTR

# nslookup 简单查询
nslookup www.example.com

# 查看 DNS 缓存
dig www.example.com +trace    # 跟踪完整解析过程`,

  'net-nat': `# iptables NAT 配置实例

# SNAT：内网 192.168.1.0/24 通过公网 IP 1.2.3.4 出网
iptables -t nat -A POSTROUTING \\
  -s 192.168.1.0/24 -o eth0 \\
  -j SNAT --to-source 1.2.3.4

# DNAT：公网 80 端口转发到内网 192.168.1.100:8080
iptables -t nat -A PREROUTING \\
  -i eth0 -p tcp --dport 80 \\
  -j DNAT --to-destination 192.168.1.100:8080

# MASQUERADE（动态公网 IP）
iptables -t nat -A POSTROUTING \\
  -o eth0 -j MASQUERADE`,

  'net-firewall': `# iptables 防火墙配置实例

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH（22）、HTTP（80）、HTTPS（443）
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# 允许回环
iptables -A INPUT -i lo -j ACCEPT

# 默认策略：拒绝其他所有入站
iptables -P INPUT DROP
iptables -P FORWARD DROP

# 保存规则
iptables-save > /etc/sysconfig/iptables`,

  // ---- Linux ----
  'linux-cmd': `# 常用 Linux 命令实例

# 文件操作
ls -lah /var/log          # 列出文件（含隐藏、人类可读大小）
cp -r /src /dest          # 递归复制
mv old.txt new.txt        # 移动/重命名
rm -rf /tmp/test          # 递归删除

# 查找与过滤
find /etc -name "*.conf" -type f    # 查找配置文件
grep -rn "error" /var/log/          # 递归搜索关键词
wc -l /etc/passwd                   # 统计行数

# 打包压缩
tar -czvf backup.tar.gz /data      # 打包压缩
tar -xzvf backup.tar.gz            # 解压`,

  'linux-permission': `# 文件权限操作实例

# 查看权限
ls -l file.txt    # -rw-r--r--

# chmod 修改权限
chmod 755 script.sh       # rwxr-xr-x
chmod u+x script.sh       # 给所有者加执行权限
chmod g-w file.txt        # 去掉组写权限
chmod a=r file.txt        # 所有人只读

# chown 修改所有者
chown user:group file.txt
chown -R user:group /data   # 递归修改

# ACL 精细控制
setfacl -m u:tom:rw file.txt   # 给 tom 读写权限
getfacl file.txt                # 查看 ACL`,

  'linux-process': `# 进程管理实例

# 查看进程
ps aux | grep nginx       # 查找 nginx 进程
ps -ef --forest           # 树形显示进程
top -c                    # 实时监控（按 P CPU排序，M 内存排序）
htop                      # 更友好的进程监控

# 终止进程
kill 1234                 # 发送 SIGTERM
kill -9 1234              # 强制杀死 SIGKILL
pkill -f "python app.py"  # 按命令名杀
killall nginx             # 按进程名杀

# 后台运行
nohup python app.py &     # 后台运行不挂断
jobs -l                   # 查看后台任务`,

  'linux-disk': `# 磁盘管理实例

# 查看磁盘使用
df -h                     # 文件系统使用情况
du -sh /var/log/*         # 目录大小
lsblk                     # 块设备列表

# 分区
fdisk /dev/sdb            # 交互式分区
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary 0% 100%

# 格式化与挂载
mkfs.ext4 /dev/sdb1       # 格式化为 ext4
mount /dev/sdb1 /data     # 挂载
# 永久挂载写入 /etc/fstab
echo "/dev/sdb1 /data ext4 defaults 0 2" >> /etc/fstab`,

  'linux-network': `# Linux 网络配置实例

# 查看网络接口
ip addr show              # 查看 IP 地址
ip link show              # 查看链路状态
ss -tlnp                  # 查看 TCP 监听端口

# 配置 IP
ip addr add 192.168.1.100/24 dev eth0
ip link set eth0 up

# 路由
ip route show             # 查看路由表
ip route add default via 192.168.1.1

# 网络测试
ping -c 4 8.8.8.8
traceroute example.com
mtr -n 8.8.8.8            # 持续 ping + traceroute`,

  'linux-shell': `# Shell 脚本实例：自动备份

#!/bin/bash
# 自动备份脚本 backup.sh
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)
SRC="/data/www"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 打包备份
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" "$SRC"

# 保留最近 7 天的备份
find "$BACKUP_DIR" -name "data_*.tar.gz" -mtime +7 -delete

echo "备份完成: data_$DATE.tar.gz"`,

  'linux-perf': `# 系统性能分析实例

# CPU 分析
top -bn1 | head -20        # CPU 使用快照
uptime                      # 负载平均值
mpstat 1 5                  # 多核 CPU 状态

# 内存分析
free -h                     # 内存使用
vmstat 1 5                  # 虚拟内存状态

# 磁盘 I/O
iostat -x 1 5              # 磁盘 I/O 统计
iotop                       # 哪个进程在读写磁盘

# 网络分析
iftop -n                    # 实时网络流量
nethogs                     # 按进程显示流量

# 综合分析
sar -u 1 5                  # CPU 历史
sar -d 1 5                  # 磁盘历史`,

  // ---- 前端 ----
  'fe-html': `<!-- HTML5 语义化页面实例 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>博客页面</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">首页</a>
      <a href="/about">关于</a>
    </nav>
  </header>
  <main>
    <article>
      <h1>文章标题</h1>
      <section>
        <h2>第一节</h2>
        <p>正文内容...</p>
      </section>
    </article>
    <aside>
      <h3>侧边栏</h3>
      <p>相关链接</p>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 博客</p>
  </footer>
</body>
</html>`,

  'fe-css': `/* CSS Flexbox + Grid 布局实例 */

/* Flexbox 居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Grid 响应式布局 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* CSS 变量 + 主题 */
:root {
  --primary: #3b82f6;
  --radius: 8px;
}
.card {
  background: var(--primary);
  border-radius: var(--radius);
  padding: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 1fr; }
}`,

  'fe-js': `// JavaScript ES6+ 实例

// 解构 + 默认参数
function fetchUser({ name = '匿名', age = 18 } = {}) {
  return { name, age, id: Date.now() };
}

// 展开运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1,2,3,4,5]

// 模板字符串
const user = fetchUser({ name: 'Tom' });
console.log(\`用户: \${user.name}, ID: \${user.id}\`);

// async/await
async function getData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error('请求失败:', err.message);
  }
}

// 箭头函数 + 数组方法
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
const sum = nums.reduce((a, b) => a + b, 0);`,

  'fe-dom': `// DOM 操作实例

// 获取元素
const btn = document.querySelector('#myBtn');
const items = document.querySelectorAll('.item');

// 事件监听（事件委托）
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('点击了:', e.target.textContent);
  }
});

// 动态创建元素
const div = document.createElement('div');
div.className = 'card';
div.innerHTML = '<p>动态内容</p>';
document.body.appendChild(div);

// 修改样式
btn.style.backgroundColor = '#3b82f6';
btn.classList.add('active');
btn.classList.toggle('hidden');`,

  'fe-vue': `<!-- Vue 3 组合式 API 实例 -->
<template>
  <div>
    <input v-model="name" placeholder="输入名字" />
    <p>你好, {{ name }}!</p>
    <button @click="count++">点击 {{ count }}</button>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.text }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const name = ref('')
const count = ref(0)
const list = ref([])

const upperName = computed(() => name.value.toUpperCase())

onMounted(async () => {
  const res = await fetch('/api/items')
  list.value = await res.json()
})
</script>`,

  'fe-react': `// React 函数组件 + Hooks 实例
import { useState, useEffect, useCallback } from 'react'

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  // 加载数据
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])

  const addTodo = useCallback(() => {
    if (!input.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: input }])
    setInput('')
  }, [input])

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </div>
  )
}

export default TodoApp`,

  'fe-perf': `// 前端性能优化实例

// 1. 图片懒加载
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // 替换真实 src
      imgObserver.unobserve(img)
    }
  })
})
document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img))

// 2. 防抖（搜索输入）
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
input.addEventListener('input', debounce(search, 300))

// 3. 虚拟列表（大数据量）
// 只渲染可视区域的 DOM 节点
const visibleItems = fullList.slice(startIndex, endIndex)`,

  'fe-pwa': `// PWA Service Worker 实例
// sw.js - 缓存优先策略
const CACHE_NAME = 'app-v1'
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js']

// 安装时缓存核心资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
})

// 请求拦截：缓存优先，网络回退
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, response.clone())
          return response
        })
      })
    })
  )
})`,

  'fe-canvas': `// Canvas 绘图实例
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 600

// 绘制矩形
ctx.fillStyle = '#3b82f6'
ctx.fillRect(50, 50, 200, 100)

// 绘制圆形
ctx.beginPath()
ctx.arc(400, 300, 80, 0, Math.PI * 2)
ctx.fillStyle = '#10b981'
ctx.fill()

// 绘制文字
ctx.font = '24px Arial'
ctx.fillStyle = '#333'
ctx.fillText('Hello Canvas', 300, 500)

// 动画：弹跳球
let x = 100, y = 100, dx = 3, dy = 3
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, Math.PI * 2)
  ctx.fill()
  x += dx; y += dy
  if (x > canvas.width || x < 0) dx = -dx
  if (y > canvas.height || y < 0) dy = -dy
  requestAnimationFrame(animate)
}
animate()`,

  'fe-webcomponents': `// Web Components 自定义元素实例
class MyCard extends HTMLElement {
  constructor() {
    super()
    // Shadow DOM 隔离样式
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = \`
      <style>
        .card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          max-width: 300px;
        }
        h3 { color: var(--card-color, #333); }
      </style>
      <div class="card">
        <h3>\${this.getAttribute('title') || '标题'}</h3>
        <slot></slot>
      </div>
    \`
  }
}

// 注册自定义元素
customElements.define('my-card', MyCard)

// HTML 中使用：
// <my-card title="卡片标题">内容通过 slot 插入</my-card>`,

  'fe-microfrontend': `// 微前端 Module Federation 实例
// webpack.config.js (宿主应用)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
}

// 宿主应用中加载远程组件
const RemoteButton = React.lazy(() => import('remoteApp/Button'))

function App() {
  return (
    <React.Suspense fallback="Loading...">
      <RemoteButton onClick={() => alert('来自远程应用')} />
    </React.Suspense>
  )
}`,

  'fe-ssr': `// Next.js SSR 实例
import { GetServerSideProps } from 'next'

export default function Article({ title, content }) {
  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}

// 服务端获取数据
export async function getServerSideProps(context) {
  const { id } = context.params
  const res = await fetch(\`https://api.example.com/articles/\${id}\`)
  const data = await res.json()
  return {
    props: {
      title: data.title,
      content: data.content,
    }
  }
}`,

  'fe-wasm': `// WebAssembly 加载实例
// C 代码 (add.c):
// int add(int a, int b) { return a + b; }
// 编译: emcc add.c -o add.js -s WASM=1

// JS 中加载并调用 WASM 模块
async function loadWasm() {
  // 加载 emscripten 生成的胶水代码
  const module = await import('./add.js')
  await module.default()

  // 调用 WASM 函数
  const result = module._add(10, 20)
  console.log('WASM 计算 10 + 20 =', result)  // 输出 30
}

loadWasm()

// 直接加载 .wasm 文件
const wasmBytes = await fetch('add.wasm').then(r => r.arrayBuffer())
const wasmModule = await WebAssembly.instantiate(wasmBytes)
console.log(wasmModule.instance.exports.add(5, 3))  // 输出 8`,

  // ---- 后端 ----
  'be-python': `# Python 后端基础实例
from flask import Flask, jsonify, request

app = Flask(__name__)

# 内存数据库
users = {}

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(list(users.values()))

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user_id = len(users) + 1
    user = {'id': user_id, **data}
    users[user_id] = user
    return jsonify(user), 201

@app.route('/users/<int:uid>', methods=['DELETE'])
def delete_user(uid):
    if uid in users:
        del users[uid]
        return '', 204
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,

  'be-flask': `# Flask 中间件与蓝图实例
from flask import Flask, Blueprint, g, request, jsonify
import time

app = Flask(__name__)

# 请求耗时中间件
@app.before_request
def before():
    g.start = time.time()

@app.after_request
def after(response):
    elapsed = time.time() - g.start
    response.headers['X-Response-Time'] = f'{elapsed:.3f}s'
    return response

# 蓝图模块化
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/health')
def health():
    return jsonify({'status': 'ok'})

app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run(port=5000)`,

  'be-mysql': `-- MySQL 查询实例

-- 创建表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  dept_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- 多表 JOIN 查询
SELECT u.name, d.dept_name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN departments d ON u.dept_id = d.id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2025-01-01'
GROUP BY u.id, u.name, d.dept_name
HAVING order_count > 5
ORDER BY order_count DESC
LIMIT 10;

-- 索引优化：查看执行计划
EXPLAIN SELECT * FROM users WHERE email = 'tom@test.com';`,

  'be-redis': `# Redis 常用操作实例

# String 操作
SET user:1:name "Tom"        # 设置
GET user:1:name              # 获取 → "Tom"
INCR counter                 # 自增
SETEX token:abc 3600 "valid" # 设置带过期（3600秒）

# Hash 操作
HSET user:1 name "Tom" age 25 email "tom@test.com"
HGET user:1 name             # → "Tom"
HGETALL user:1               # 获取全部字段

# List 操作（消息队列）
LPUSH tasks "send_email"     # 左侧入队
RPOP tasks                   # 右侧出队

# Set 操作（去重）
SADD online_users "user1" "user2"
SISMEMBER online_users "user1"  # → 1

# 缓存穿透防护（布隆过滤器）
BF.EXISTS filter "key123"    # 判断是否存在`,

  'be-docker': `# Dockerfile 实例（多阶段构建）
# 阶段1：构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

# 阶段2：运行（更小镜像）
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

# docker-compose.yml
# version: "3.8"
# services:
#   web:
#     build: .
#     ports: ["8080:80"]
#     restart: unless-stopped`,

  'be-nginx': `# Nginx 反向代理 + 负载均衡实例
upstream backend {
    server 192.168.1.101:8080 weight=3;
    server 192.168.1.102:8080 weight=2;
    server 192.168.1.103:8080 backup;
}

server {
    listen 80;
    server_name api.example.com;

    # HTTPS 重定向
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # 反向代理 + 负载均衡
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源缓存
    location /static/ {
        root /var/www;
        expires 30d;
    }
}`,

  'be-ci': `# GitLab CI/CD 流水线实例
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

# 测试阶段
test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm test
  only:
    - main
    - merge_requests

# 构建阶段
build:
  stage: build
  image: docker:20
  script:
    - docker build -t myapp:$CI_COMMIT_SHORT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHORT_SHA
  only:
    - main

# 部署阶段
deploy:
  stage: deploy
  script:
    - ssh deploy@prod "docker pull registry.example.com/myapp:$CI_COMMIT_SHORT_SHA"
    - ssh deploy@prod "docker-compose up -d"
  only:
    - main
  when: manual  # 手动触发部署`,

  'be-java-core': `// Java 集合与并发实例
import java.util.*;
import java.util.concurrent.*;

public class Demo {
    public static void main(String[] args) {
        // ArrayList vs LinkedList
        List<String> arrayList = new ArrayList<>(List.of("A", "B", "C"));

        // HashMap 基本操作
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 3);
        map.put("banana", 5);
        map.forEach((k, v) -> System.out.println(k + "=" + v));

        // ConcurrentHashMap 线程安全
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("count", 0);
        concurrentMap.compute("count", (k, v) -> v + 1);  // 原子操作

        // Stream API
        List<Integer> nums = List.of(1, 2, 3, 4, 5);
        int sum = nums.stream().filter(n -> n % 2 == 0).mapToInt(n -> n).sum();
        System.out.println("偶数和: " + sum);  // 输出 6
    }
}`,

  'be-go-basics': `// Go 并发实例
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        time.Sleep(100 * time.Millisecond)
        results <- j * j  // 返回平方
    }
}

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)
    var wg sync.WaitGroup

    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    // 发送任务
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // 等待完成
    go func() {
        wg.Wait()
        close(results)
    }()

    // 收集结果
    for r := range results {
        fmt.Println("结果:", r)
    }
}`,

  'be-node-express': `// Express 中间件实例
const express = require('express')
const app = express()

// 内置中间件
app.use(express.json())
app.use(express.static('public'))

// 自定义日志中间件
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`)
  next()
})

// 路由
app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/api/users', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  res.status(201).json({ id: 1, name })
})

// 错误处理中间件（4参数）
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(3000, () => console.log('Server on :3000'))`,

  'be-postgresql-vs-mysql': `-- PostgreSQL 特色查询实例

-- JSONB 查询（MySQL 也有 JSON 但 PG 更强）
SELECT * FROM products
WHERE attributes @> '{"color": "red"}';  -- JSONB 包含查询

-- 递归 CTE（MySQL 8.0+ 也支持）
WITH RECURSIVE org_tree AS (
  -- 基础查询：顶层
  SELECT id, name, parent_id, 0 AS depth
  FROM departments WHERE parent_id IS NULL
  UNION ALL
  -- 递归：查子部门
  SELECT d.id, d.name, d.parent_id, t.depth + 1
  FROM departments d
  JOIN org_tree t ON d.parent_id = t.id
)
SELECT * FROM org_tree ORDER BY depth;

-- 窗口函数（两者都支持）
SELECT name, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank
FROM employees;`,

  'be-mongodb-nosql': `// MongoDB 查询实例

// 插入文档
db.users.insertOne({
  name: "Tom",
  age: 25,
  hobbies: ["coding", "reading"],
  address: { city: "Beijing", zip: "100000" }
})

// 查询
db.users.find({ "address.city": "Beijing" })
db.users.find({ age: { $gte: 20, $lte: 30 } })
db.users.find({ hobbies: "coding" })  // 数组包含

// 聚合管道
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$user_id", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])

// 创建索引
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ name: "text" })  // 全文索引`,

  'be-mq-selection': `# RabbitMQ 生产者实例 (Python)
import pika

# 连接 RabbitMQ
connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# 声明队列
channel.queue_declare(queue='task_queue', durable=True)

# 发送消息
channel.basic_publish(
    exchange='',
    routing_key='task_queue',
    body='Hello RabbitMQ!',
    properties=pika.BasicProperties(delivery_mode=2)  # 持久化
)
print("消息已发送")
connection.close()

# --- Kafka 生产者实例 ---
# from kafka import KafkaProducer
# import json
# producer = KafkaProducer(
#     bootstrap_servers=['localhost:9092'],
#     value_serializer=lambda v: json.dumps(v).encode('utf-8')
# )
# producer.send('topic_name', {'key': 'value'})
# producer.flush()`,

  'be-auth-compare': `// JWT 实现实例 (Node.js)
const jwt = require('jsonwebtoken')
const SECRET = 'my-secret-key'

// 生成 Token
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    { expiresIn: '24h', issuer: 'myapp' }
  )
}

// 验证 Token（中间件）
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未提供 Token' })

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded  // 挂载用户信息
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token 无效或已过期' })
  }
}

// 使用
app.post('/api/login', (req, res) => {
  const user = authenticate(req.body)  // 验证用户
  if (user) {
    res.json({ token: generateToken(user) })
  } else {
    res.status(401).json({ error: '用户名或密码错误' })
  }
})

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})`,

  'be-websocket': `// WebSocket 服务端实例 (Node.js)
const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 8080 })
const clients = new Set()

wss.on('connection', (ws, req) => {
  const clientId = Date.now()
  ws.clientId = clientId
  clients.add(ws)
  console.log(\`客户端 \${clientId} 已连接\`)

  // 广播消息给所有客户端
  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    const broadcast = JSON.stringify({
      from: clientId,
      text: msg.text,
      time: new Date().toISOString()
    })
    clients.forEach(client => {
      if (client.readyState === 1) client.send(broadcast)
    })
  })

  // 心跳检测
  ws.on('pong', () => { ws.isAlive = true })

  // 断开连接
  ws.on('close', () => {
    clients.delete(ws)
    console.log(\`客户端 \${clientId} 断开\`)
  })
})

// 每 30 秒心跳检测
setInterval(() => {
  clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate()
    ws.isAlive = false
    ws.ping()
  })
}, 30000)`,

  'be-redis-persistence': `# Redis 持久化配置实例

# redis.conf 配置

# RDB 快照配置
save 900 1      # 900秒内1次修改触发快照
save 300 10     # 300秒内10次修改触发快照
save 60 10000   # 60秒内10000次修改触发快照
dbfilename dump.rdb
dir /var/lib/redis

# AOF 追加配置
appendonly yes                    # 开启 AOF
appendfilename "appendonly.aof"
appendfsync everysec              # 每秒刷盘（推荐）
auto-aof-rewrite-percentage 100   # AOF 重写触发条件
auto-aof-rewrite-min-size 64mb

# 混合持久化（Redis 4.0+）
aof-use-rdb-preamble yes

# 手动触发
redis-cli BGSAVE                  # 手动 RDB 快照
redis-cli BGREWRITEAOF            # 手动 AOF 重写`,

  'be-db-replication': `-- MySQL 主从复制配置实例

-- 主库 (Master) 配置 my.cnf:
# [mysqld]
# server-id = 1
# log-bin = mysql-bin
# binlog-format = ROW
# binlog-do-db = mydb

-- 创建复制用户
CREATE USER 'repl'@'192.168.1.%' IDENTIFIED BY 'Repl@123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'192.168.1.%';

-- 查看主库状态
SHOW MASTER STATUS;
-- 记录 File 和 Position

-- 从库 (Slave) 配置 my.cnf:
# [mysqld]
# server-id = 2
# relay-log = relay-bin
# read-only = 1

-- 从库配置主库信息
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='192.168.1.100',
  SOURCE_USER='repl',
  SOURCE_PASSWORD='Repl@123',
  SOURCE_LOG_FILE='mysql-bin.000001',
  SOURCE_LOG_POS=154;

-- 启动复制
START REPLICA;
SHOW REPLICA STATUS\\G`,

  'be-distributed-tx': `// Seata AT 模式实例 (Java Spring)
// 1. 引入依赖
// <dependency>
//   <groupId>io.seata</groupId>
//   <artifactId>seata-spring-boot-starter</artifactId>
// </dependency>

// 2. 配置 application.yml
// seata:
//   tx-service-group: my_tx_group
//   service:
//     vgroup-mapping:
//       my_tx_group: default

// 3. 业务代码使用 @GlobalTransactional
@Service
public class OrderService {

    @GlobalTransactional  // Seata 全局事务
    public void createOrder(OrderDTO dto) {
        // 1. 创建订单（本地事务）
        orderMapper.insert(dto);

        // 2. 扣减库存（远程调用库存服务）
        storageFeignClient.deduct(dto.getProductId(), dto.getCount());

        // 3. 扣减余额（远程调用账户服务）
        accountFeignClient.debit(dto.getUserId(), dto.getMoney());

        // 如果任一步骤失败，Seata 自动回滚所有分支
    }
}`,

  'be-spring-cloud': `# Spring Cloud Nacos 配置实例

# application.yml
spring:
  application:
    name: order-service
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.1.100:8848
      config:
        server-addr: 192.168.1.100:8848
        file-extension: yaml
    sentinel:
      transport:
        dashboard: 192.168.1.100:8858

# Feign 声明式调用
# @FeignClient(name = "storage-service", fallback = StorageFallback.class)
# public interface StorageClient {
#     @PostMapping("/deduct")
#     Result deduct(@RequestParam Long productId, @RequestParam Integer count);
# }

# Gateway 网关路由
# spring:
#   cloud:
#     gateway:
#       routes:
#         - id: order-service
#           uri: lb://order-service
#           predicates:
#             - Path=/api/order/**
#           filters:
#             - StripPrefix=1`,

  'be-shardingsphere': `# ShardingSphere 分库分表配置实例
# application.yml (Spring Boot)

spring:
  shardingsphere:
    datasource:
      names: ds0,ds1
      ds0:
        type: com.zaxxer.hikari.HikariDataSource
        jdbc-url: jdbc:mysql://192.168.1.101:3306/order_db_0
        username: root
        password: 123456
      ds1:
        type: com.zaxxer.hikari.HikariDataSource
        jdbc-url: jdbc:mysql://192.168.1.102:3306/order_db_1
        username: root
        password: 123456
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: ds$->{0..1}.t_order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: db-mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-mod
        sharding-algorithms:
          db-mod:
            type: MOD
            props:
              sharding-count: 2
          table-mod:
            type: MOD
            props:
              sharding-count: 4`,
};

// ========== Shell 学科知识点 ==========
const SHELL_TOPICS = [
  {
    id: 'shell-basic',
    title: 'Shell 脚本基础语法',
    level: '基础',
    content: `**Shell 脚本** 是一系列 Linux 命令的集合，通过解释器自动执行，实现自动化运维。

**Shebang 行**：脚本第一行指定解释器
- \`#!/bin/bash\` — 使用 bash 解释
- \`#!/bin/sh\` — 使用 sh 解释（功能较少）
- \`#!/usr/bin/env bash\` — 动态查找 bash 路径

**变量**：
- 定义：\`name="Tom"\`（等号两边不能有空格）
- 引用：\`$name\` 或 \`\${name}\`
- 只读：\`readonly name\`
- 删除：\`unset name\`

**注释**：以 \`#\` 开头

**执行方式**：
- \`bash script.sh\` — 不需要执行权限
- \`./script.sh\` — 需要 \`chmod +x\` 权限
- \`source script.sh\` 或 \`. script.sh\` — 在当前 shell 执行`,
    example: `#!/bin/bash
# 第一个 Shell 脚本 hello.sh
echo "Hello, World!"

# 变量定义与使用
name="Tom"
age=25
echo "姓名: $name, 年龄: \${age}岁"

# 命令替换
current_date=$(date +%Y-%m-%d)
echo "今天: $current_date"

# 算术运算
sum=$((1 + 2 + 3))
echo "1+2+3 = $sum"

# 执行方式
# chmod +x hello.sh
# ./hello.sh
# 输出:
# Hello, World!
# 姓名: Tom, 年龄: 25岁
# 今天: 2026-01-15
# 1+2+3 = 6`
  },
  {
    id: 'shell-variables',
    title: 'Shell 变量与特殊变量',
    level: '基础',
    content: `**变量类型**：
- **局部变量**：仅在当前脚本/函数中有效
- **环境变量**：\`export VAR=value\`，子进程可继承
- **位置变量**：\`$0\` 脚本名，\`$1\`-\`$9\` 第1-9个参数

**特殊变量**：
- \`$#\` — 参数个数
- \`$@\` — 所有参数（每个独立引号包裹）
- \`$*\` — 所有参数（合并为一个字符串）
- \`$?\` — 上一条命令的返回值（0=成功）
- \`$$\` — 当前脚本进程 PID
- \`$!\` — 最近一个后台进程 PID

**\`$@\` vs \`$*\` 区别**：
- \`"$@"\` → \`"$1" "$2" "$3"\`（各自独立）
- \`"$*"\` → \`"$1 $2 $3"\`（合并为一个）`,
    example: `#!/bin/bash
# 特殊变量演示 special.sh

echo "脚本名: $0"
echo "参数个数: $#"
echo "全部参数(\$@): $@"
echo "全部参数(\$*): $*"
echo "第一个参数: $1"
echo "第二个参数: $2"
echo "当前PID: $$"
echo "上一条命令返回值: $?"

# 遍历所有参数
for arg in "$@"; do
    echo "参数: $arg"
done

# 执行: ./special.sh apple banana cherry
# 输出:
# 脚本名: ./special.sh
# 参数个数: 3
# 全部参数($@): apple banana cherry
# 第一个参数: apple
# 第二个参数: banana
# 当前PID: 12345
# 上一条命令返回值: 0
# 参数: apple
# 参数: banana
# 参数: cherry`
  },
  {
    id: 'shell-string',
    title: 'Shell 字符串操作',
    level: '基础',
    content: `**字符串长度**：\`\${#str}\`

**子串截取**：
- \`\${str:position}\` — 从位置开始截取到末尾
- \`\${str:position:length}\` — 截取指定长度

**字符串替换**：
- \`\${str/old/new}\` — 替换第一个匹配
- \`\${str//old/new}\` — 替换所有匹配

**删除模式**（非贪婪/贪婪）：
- \`\${str#pattern}\` — 从开头删除最短匹配
- \`\${str##pattern}\` — 从开头删除最长匹配
- \`\${str%pattern}\` — 从结尾删除最短匹配
- \`\${str%%pattern}\` — 从结尾删除最长匹配

**大小写转换**（Bash 4+）：
- \`\${str^^}\` — 全部大写
- \`\${str,,}\` — 全部小写`,
    example: `#!/bin/bash
# 字符串操作演示
str="Hello World Hello"

# 长度
echo \${#str}           # 输出 17

# 截取
echo \${str:0:5}        # 输出 Hello
echo \${str:6}          # 输出 World Hello

# 替换
echo \${str/Hello/Hi}  # 输出 Hi World Hello（替换第一个）
echo \${str//Hello/Hi} # 输出 Hi World Hi（替换全部）

# 删除模式
path="/usr/local/bin/app.tar.gz"
echo \${path##*/}       # 输出 app.tar.gz（取文件名）
echo \${path%/*}        # 输出 /usr/local/bin（取目录）
echo \${path##*.}       # 输出 gz（取扩展名）
echo \${path%.*}        # 输出 /usr/local/bin/app.tar

# 默认值
unset var
echo \${var:-"默认值"}  # 输出 默认值（var为空时）
echo \${var:="新值"}    # 输出 新值（同时赋值给var）

# 大小写
name="Tom"
echo \${name^^}         # 输出 TOM
echo \${name,,}         # 输出 tom`
  },
  {
    id: 'shell-condition',
    title: 'Shell 条件判断',
    level: '基础',
    content: `**if 语句**：
\`\`\`bash
if [ 条件 ]; then
    ...
elif [ 条件 ]; then
    ...
else
    ...
fi
\`\`\`

**test 命令三种写法**：
- \`[ 条件 ]\` — 经典写法（方括号内空格必须）
- \`[[ 条件 ]]\` — 增强写法（支持正则 \`=~\`、逻辑 \`&&\`/\`||\`）
- \`test 条件\` — 命令形式

**文件测试**：\`-f\` 普通文件、\`-d\` 目录、\`-e\` 存在、\`-r\` 可读、\`-w\` 可写、\`-x\` 可执行
**字符串测试**：\`-z\` 空、\`-n\` 非空、\`==\` 相等、\`!=\` 不等
**数字比较**：\`-eq\` 等于、\`-ne\` 不等、\`-lt\` 小于、\`-gt\` 大于、\`-le\` 小于等于、\`-ge\` 大于等于

**case 语句**：
\`\`\`bash
case $var in
    模式1) 命令 ;;
    模式2) 命令 ;;
    *) 默认命令 ;;
esac
\`\`\``,
    example: `#!/bin/bash
# 条件判断演示 condition.sh

# 文件测试
file="/etc/passwd"
if [[ -f "$file" ]]; then
    echo "$file 是普通文件"
fi
if [[ -d "/tmp" ]]; then
    echo "/tmp 是目录"
fi

# 数字比较
score=85
if [[ $score -ge 90 ]]; then
    echo "优秀"
elif [[ $score -ge 60 ]]; then
    echo "及格"    # 输出: 及格
else
    echo "不及格"
fi

# 字符串比较
name="Tom"
if [[ "$name" == "Tom" ]]; then
    echo "欢迎 Tom!"  # 输出: 欢迎 Tom!
fi

# case 语句
case $1 in
    start)   echo "启动服务" ;;
    stop)    echo "停止服务" ;;
    restart) echo "重启服务" ;;
    status)  echo "查看状态" ;;
    *)       echo "用法: $0 {start|stop|restart|status}" ;;
esac

# 执行: ./condition.sh start
# 输出: 启动服务`
  },
  {
    id: 'shell-loop',
    title: 'Shell 循环结构',
    level: '基础',
    content: `**for 循环**：
\`\`\`bash
# 列表遍历
for item in apple banana cherry; do
    echo $item
done

# C 风格
for ((i=0; i<5; i++)); do
    echo $i
done
\`\`\`

**while 循环**：
\`\`\`bash
while [ 条件 ]; do
    命令
done
\`\`\`

**until 循环**：条件为假时执行
\`\`\`bash
until [ 条件 ]; do
    命令
done
\`\`\`

**循环控制**：
- \`break\` — 跳出循环
- \`continue\` — 跳过本次

**seq 生成序列**：\`seq 1 10\` → 1到10`,
    example: `#!/bin/bash
# 循环结构演示 loops.sh

# for 遍历列表
echo "=== 水果列表 ==="
for fruit in apple banana cherry; do
    echo "水果: $fruit"
done

# for C 风格
echo "=== 倒计时 ==="
for ((i=3; i>=1; i--)); do
    echo "$i..."
    sleep 1
done
echo "发射!"

# while 读取文件
echo "=== /etc/passwd 前3行 ==="
count=0
while IFS=: read -r user pw uid rest; do
    echo "用户: $user (UID: $uid)"
    ((count++))
    [[ $count -ge 3 ]] && break
done < /etc/passwd

# until 等待服务启动
echo "=== 等待服务 ==="
attempts=0
until ping -c1 -W1 8.8.8.8 &>/dev/null; do
    ((attempts++))
    echo "尝试 $attempts..."
    [[ $attempts -ge 3 ]] && { echo "连接失败"; exit 1; }
    sleep 2
done
echo "网络连通!"`
  },
  {
    id: 'shell-function',
    title: 'Shell 函数',
    level: '基础',
    content: `**函数定义**：
\`\`\`bash
# 方式1
function greet() {
    echo "Hello $1"
}

# 方式2（省略 function）
greet() {
    echo "Hello $1"
}
\`\`\`

**参数**：函数内 \`$1\`, \`$2\`... 对应调用时传入的参数
**返回值**：
- \`return 数字\` — 返回退出码（0-255）
- \`echo "结果"\` — 通过命令替换获取字符串结果
**局部变量**：\`local var=value\`，避免污染全局

**递归**：函数可以调用自身`,
    example: `#!/bin/bash
# 函数演示 functions.sh

# 基本函数
greet() {
    echo "Hello, $1!"
}
greet "Tom"    # 输出: Hello, Tom!

# 带返回值的函数
add() {
    local sum=$(( $1 + $2 ))
    echo $sum   # 通过 echo 返回结果
}
result=$(add 10 20)
echo "10 + 20 = $result"   # 输出: 10 + 20 = 30

# 检查函数返回码
check_file() {
    if [[ -f "$1" ]]; then
        return 0   # 文件存在
    else
        return 1   # 文件不存在
    fi
}
if check_file "/etc/passwd"; then
    echo "文件存在"
fi

# 递归：计算阶乘
factorial() {
    local n=$1
    if [[ $n -le 1 ]]; then
        echo 1
    else
        local prev=$(factorial $((n - 1)))
        echo $((n * prev))
    fi
}
echo "5! = $(factorial 5)"   # 输出: 5! = 120`
  },
  {
    id: 'shell-array',
    title: 'Shell 数组',
    level: '基础',
    content: `**普通数组**（索引数组）：
- 定义：\`arr=(a b c)\` 或 \`arr[0]=a; arr[1]=b\`
- 读取：\`\${arr[0]}\`，\`\${arr[@]}\`（全部元素）
- 长度：\`\${#arr[@]}\`
- 遍历：\`for item in "\${arr[@]}"\`

**关联数组**（Bash 4+，类似字典）：
- 声明：\`declare -A dict\`
- 赋值：\`dict[key]=value\`
- 读取：\`\${dict[key]}\`
- 所有键：\`\${!dict[@]}\`
- 所有值：\`\${dict[@]}\`

**数组切片**：\`\${arr[@]:start:count}\``,
    example: `#!/bin/bash
# 数组演示 arrays.sh

# 普通数组
fruits=("apple" "banana" "cherry" "date")
echo "第一个: \${fruits[0]}"       # apple
echo "全部: \${fruits[@]}"          # apple banana cherry date
echo "数量: \${#fruits[@]}"         # 4
echo "切片: \${fruits[@]:1:2}"      # banana cherry

# 遍历数组
echo "=== 遍历水果 ==="
for fruit in "\${fruits[@]}"; do
    echo "- $fruit"
done

# 追加元素
fruits+=("elderberry")
echo "追加后: \${fruits[@]}"        # 5个元素

# 关联数组
declare -A scores
scores["Tom"]=90
scores["Jerry"]=85
scores["Alice"]=95

echo "=== 成绩表 ==="
for name in "\${!scores[@]}"; do
    echo "$name: \${scores[$name]}分"
done

echo "学生人数: \${#scores[@]}"`
  },
  {
    id: 'shell-redirect',
    title: 'Shell 重定向与管道',
    level: '基础',
    content: `**输出重定向**：
- \`> file\` — 覆盖写入
- \`>> file\` — 追加写入
- \`2> file\` — 错误输出重定向
- \`&> file\` — 标准输出+错误都重定向
- \`2>&1\` — 错误重定向到标准输出

**输入重定向**：
- \`< file\` — 从文件读入
- \`<<EOF ... EOF\` — Here Document（多行输入）
- \`<<< "string"\` — Here String（单行输入）

**管道** \`|\`：将前一个命令的输出作为后一个命令的输入

**进程替换**：
- \`<(command)\` — 输出当文件用
- \`>(command)\` — 输入当文件用

**文件描述符**：0=stdin，1=stdout，2=stderr`,
    example: `#!/bin/bash
# 重定向与管道演示 redirect.sh

# 输出重定向
echo "Hello" > output.txt      # 覆盖写入
echo "World" >> output.txt     # 追加写入
cat output.txt                 # 输出: Hello\nWorld

# 错误重定向
ls /nonexistent 2> error.log   # 错误信息写入文件
ls /nonexistent 2>&1           # 错误合并到标准输出
ls /nonexistent &> all.log     # 全部输出到文件

# Here Document
cat <<EOF > config.txt
server:
  port: 8080
  host: localhost
EOF

# Here String
wc -w <<< "hello world shell"  # 输出: 3

# 管道组合
cat /etc/passwd | grep "bash" | wc -l     # 统计 bash 用户数
ps aux | sort -rk3 | head -5              # CPU 占用前5进程
find /etc -name "*.conf" | xargs grep "timeout"  # 搜索配置

# 进程替换
diff <(ls dir1) <(ls dir2)    # 比较两个目录的文件列表`
  },
  {
    id: 'shell-arith',
    title: 'Shell 算术运算与表达式',
    level: '基础',
    content: `**算术运算方式**：
- \`$((expr))\` — 推荐方式，支持 + - * / % **(幂)
- \`let "var=expr"\` — 赋值方式
- \`expr 1 + 2\` — 命令方式（需空格，特殊字符需转义）
- \`bc\` — 支持小数运算

**自增自减**：
- \`((i++))\` / \`((i--))\`
- \`((i+=5))\` / \`((i-=3))\`

**随机数**：\`$RANDOM\`（0-32767）

**条件表达式**（\`(( ))\` 内）：
- \`((a > b))\` — 数字比较，返回 0/1
- \`((a == b))\`、\`((a != b))\``,
    example: `#!/bin/bash
# 算术运算演示 arith.sh

# $(( )) 方式（推荐）
a=10
b=3
echo "加: $((a + b))"       # 13
echo "减: $((a - b))"       # 7
echo "乘: $((a * b))"       # 30
echo "除: $((a / b))"       # 3（整数除法）
echo "取余: $((a % b))"     # 1
echo "幂: $((a ** 2))"      # 100

# 自增自减
count=0
((count++))                  # count=1
((count += 10))              # count=11
echo "count = $count"        # 11

# 随机数
echo "随机数(0-99): $((RANDOM % 100))"

# bc 小数运算
echo "3.14 * 2 = $(echo "3.14 * 2" | bc)"       # 6.28
echo "10/3 = $(echo "scale=2; 10/3" | bc)"       # 3.33

# 数字比较
if ((a > b)); then
    echo "$a > $b"           # 10 > 3
fi

# expr 方式（了解即可）
echo $(expr 5 + 3)          # 8（注意空格）`
  },
  {
    id: 'shell-grep',
    title: '文本处理：grep 搜索',
    level: '进阶',
    content: `**grep** 全局正则表达式打印，用于文本搜索。

**常用选项**：
- \`-r\` 递归搜索目录
- \`-n\` 显示行号
- \`-i\` 忽略大小写
- \`-v\` 反向匹配（不包含）
- \`-c\` 统计匹配行数
- \`-o\` 只输出匹配部分
- \`-l\` 只输出文件名
- \`-E\` 扩展正则（等同 egrep）
- \`-A n\` 匹配行后 n 行
- \`-B n\` 匹配行前 n 行
- \`-C n\` 匹配行前后各 n 行
- \`--color\` 高亮匹配

**正则元字符**：
- \`.\` 任意单字符，\`*\` 前一个0次或多次
- \`^\` 行首，\`$\` 行尾
- \`[]\` 字符集，\`[^]\` 取反
- \`\\{n,m\\}\` 匹配次数（BRE需转义）`,
    example: `#!/bin/bash
# grep 搜索实例

# 基本搜索
grep "error" /var/log/messages        # 搜索 error
grep -i "ERROR" /var/log/messages     # 忽略大小写
grep -n "error" app.log               # 显示行号
grep -c "error" app.log               # 统计匹配行数
grep -v "debug" app.log               # 排除 debug 行

# 递归搜索
grep -rn "TODO" ./src/                # 递归搜索代码中的 TODO
grep -rl "password" /etc/             # 只显示包含密码的文件名

# 扩展正则 (-E)
grep -E "error|warning|critical" app.log    # 匹配多个关键词
grep -E "[0-9]{1,3}\\.[0-9]{1,3}..." access.log  # 匹配IP
grep -E "^import " *.py               # Python import 行

# 上下文
grep -A 2 "Exception" app.log         # 匹配行+后2行
grep -B 2 "Exception" app.log         # 匹配行+前2行
grep -C 3 "Exception" app.log         # 匹配行±3行

# 管道组合
ps aux | grep nginx | grep -v grep    # 查找nginx进程（排除grep自身）
dmesg | grep -i "usb" | head -10      # USB相关内核日志`
  },
  {
    id: 'shell-sed',
    title: '文本处理：sed 流编辑器',
    level: '进阶',
    content: `**sed** 流编辑器，按行处理文本，支持替换、删除、插入、追加。

**常用操作**：
- \`s/old/new/\` — 替换第一个匹配
- \`s/old/new/g\` — 替换所有匹配（全局）
- \`s/old/new/gi\` — 忽略大小写+全局
- \`d\` — 删除行
- \`p\` — 打印行（需 \`-n\` 配合）
- \`a\\ text\` — 行后追加
- \`i\\ text\` — 行前插入
- \`c\\ text\` — 替换整行

**地址定界**：
- \`1d\` — 第1行
- \`1,5d\` — 第1-5行
- \`/^err/d\` — 匹配正则的行
- \`$d\` — 最后一行

**选项**：
- \`-n\` — 安静模式（只输出被 p 的行）
- \`-i\` — 直接修改文件（原地编辑）
- \`-i.bak\` — 修改前备份
- \`-r\` / \`-E\` — 扩展正则

**保持空间**：\`h\` 复制到保持空间，\`g\` 取回，\`x\` 交换`,
    example: `#!/bin/bash
# sed 流编辑实例

# 替换
echo "hello world" | sed 's/world/shell/'   # hello shell
echo "a b c" | sed 's/ /_/g'                 # a_b_c（全局替换）
sed 's/localhost/127.0.0.1/g' /etc/hosts     # 替换文件内容
sed -i 's/debug=false/debug=true/' app.conf  # 直接修改文件

# 删除
sed '/^#/d' nginx.conf         # 删除注释行
sed '/^$/d' nginx.conf         # 删除空行
sed '1,3d' file.txt            # 删除前3行
sed '$d' file.txt              # 删除最后一行

# 插入与追加
sed '1i\\# START' file.txt     # 第1行前插入
sed '$a\\# END' file.txt       # 最后一行后追加

# 打印
sed -n '5,10p' file.txt        # 只打印5-10行
sed -n '/error/p' app.log      # 只打印包含error的行

# 多命令组合
sed -e 's/foo/bar/g' -e '/^$/d' file.txt   # 替换+删空行

# 提取IP地址
echo "IP: 192.168.1.100" | sed -E 's/.*([0-9]{1,3}\\.){3}[0-9]{1,3}.*/\\1&/'`
  },
  {
    id: 'shell-awk',
    title: '文本处理：awk 数据分析',
    level: '进阶',
    content: `**awk** 强大的文本分析工具，按行和列处理数据。

**基本语法**：\`awk 'pattern {action}' file\`
- 每行按分隔符分割为字段
- \`$0\` 整行，\`$1\` 第1列，\`$2\` 第2列
- \`NF\` 字段数，\`NR\` 行号
- \`-F:\` 指定分隔符（默认空格）

**BEGIN / END 块**：
- \`BEGIN{}\` — 处理前执行（初始化）
- \`{}\` — 每行执行
- \`END{}\` — 处理后执行（汇总）

**内置变量**：
- \`FS\` 输入分隔符，\`OFS\` 输出分隔符
- \`NR\` 当前行号，\`NF\` 当前行列数
- \`FNR\` 当前文件行号

**条件与循环**：
- \`if(cond){}\`、\`for(i=1;i<=NF;i++){}\`
- \`while(cond){}`

**数组**：\`arr[key]=value\`（关联数组）`,
    example: `#!/bin/bash
# awk 数据分析实例

# 基本用法
awk '{print $1}' file.txt              # 打印第1列
awk '{print $1, $3}' file.txt          # 打印第1和第3列
awk -F: '{print $1}' /etc/passwd       # 以:分割，打印用户名
awk -F: '{print $1, $3}' /etc/passwd   # 用户名和UID

# 统计
awk -F: 'END{print "用户总数:", NR}' /etc/passwd  # 统计行数
awk '{sum += $1} END{print "总和:", sum}' nums.txt  # 求和
awk '{sum += $2; count++} END{print "平均:", sum/count}' data.txt

# 条件过滤
awk -F: '$3 >= 1000 {print $1, "普通用户"}' /etc/passwd  # UID>=1000
awk '$3 > 80 {print $1, $3}' scores.txt                   # 第3列>80
awk '/error/{print}' app.log                              # 包含error的行

# BEGIN 初始化
awk 'BEGIN{FS=":"; OFS=" | "} {print $1, $3, $7}' /etc/passwd

# 数组统计（按字段分组求和）
awk '{count[$1]++} END{for(k in count) print k, count[k]}' access.log
# 统计每个IP的访问次数

# 多行格式化输出
awk -F: 'BEGIN{print "用户名\\tUID\\tShell"}
{printf "%-15s %5d  %s\\n", $1, $3, $7}
END{print "共 " NR " 行"}' /etc/passwd`
  },
  {
    id: 'shell-find',
    title: 'find 文件查找',
    level: '进阶',
    content: `**find** 递归查找文件，支持多种条件。

**按名称**：\`-name "*.txt"\`（区分大小写）、\`-iname\`（不区分）
**按类型**：\`-type f\` 文件、\`-type d\` 目录、\`-type l\` 符号链接
**按大小**：\`-size +10M\`（大于10M）、\`-size -1k\`（小于1K）
**按时间**：
- \`-mtime -7\` 7天内修改
- \`-mtime +30\` 30天前修改
- \`-mmin -60\` 60分钟内修改
- \`-newer file\` 比 file 新

**按权限**：\`-perm 644\`、\`-perm /u+x\`（任一用户有执行权限）
**按用户**：\`-user root\`、\`-group admin\`

**动作**：
- \`-exec cmd {} \\;\` — 对每个文件执行命令
- \`-exec cmd {} +\` — 批量执行（效率高）
- \`-delete\` — 删除匹配文件
- \`-ls\` — 列表显示

**组合条件**：\`-a\`（与，默认）、\`-o\`（或）、\`-not\`（非）`,
    example: `#!/bin/bash
# find 文件查找实例

# 按名称查找
find /etc -name "*.conf"                    # 查找所有 .conf 文件
find /var/log -iname "*.LOG"                # 不区分大小写
find . -name "*.tmp" -delete                # 查找并删除临时文件

# 按类型
find /home -type f -name "*.sh"             # 查找所有 sh 脚本
find / -type d -name "nginx"                # 查找 nginx 目录

# 按大小
find /var/log -size +100M                   # 大于100M的日志
find /tmp -size -1k -type f                 # 小于1K的文件
find / -size +500M -type f 2>/dev/null      # 大文件（忽略错误）

# 按时间
find /backup -mtime +7 -delete              # 删除7天前的备份
find /var/log -mmin -60 -type f             # 60分钟内修改的文件
find /src -newer /src/last_build            # 比上次构建新的文件

# 按权限和用户
find / -perm -4000 -type f 2>/dev/null      # 查找SUID文件（安全检查）
find /home -user tom -type f                # tom 用户的文件

# -exec 执行命令
find /var/log -name "*.log" -exec gzip {} \\;       # 压缩日志
find /tmp -name "*.tmp" -exec rm -f {} +            # 批量删除
find /etc -name "*.conf" -exec grep "port" {} +     # 搜索内容

# 与 xargs 配合（更高效）
find /src -name "*.js" | xargs wc -l                # 统计JS代码行数
find /log -name "*.log" -print0 | xargs -0 grep "error"  # 处理带空格文件名`
  },
  {
    id: 'shell-signal-trap',
    title: 'Shell 信号与 trap 陷阱',
    level: '进阶',
    content: `**信号机制**：Linux 通过信号通知进程事件。

**常见信号**：
- \`SIGINT (2)\` — Ctrl+C 中断
- \`SIGTERM (15)\` — 终止信号（kill 默认）
- \`SIGKILL (9)\` — 强制杀死（不可捕获/忽略）
- \`SIGSTOP (19)\` — 暂停（不可捕获）
- \`SIGCONT (18)\` — 继续
- \`SIGHUP (1)\` — 挂起（常用于重载配置）
- \`SIGUSR1/USR2\` — 用户自定义

**trap 命令**：捕获信号并执行指定动作
\`\`\`bash
trap '命令' 信号列表    # 捕获信号时执行命令
trap '' 信号           # 忽略信号
trap - 信号            # 恢复默认处理
trap -p                # 查看已设置的 trap
\`\`\`

**EXIT 伪信号**：脚本退出时触发，常用于清理

**ERR 伪信号**：命令失败时触发（需 \`set -e\`）`,
    example: `#!/bin/bash
# trap 信号捕获实例 cleanup.sh

# 定义清理函数
cleanup() {
    echo ""
    echo "正在清理临时文件..."
    rm -f /tmp/myapp_*.tmp
    echo "清理完成，退出脚本"
    exit 0
}

# 捕获 Ctrl+C (SIGINT) 和 SIGTERM
trap cleanup SIGINT SIGTERM

# 捕获退出（正常结束也清理）
trap cleanup EXIT

# 捕获错误
trap 'echo "错误发生在第 $LINENO 行"' ERR

# 创建临时文件
tmpfile=$(mktemp /tmp/myapp_XXXXXX.tmp)
echo "临时文件: $tmpfile"
echo "工作文件已创建，按 Ctrl+C 测试中断"

# 模拟长时间运行
echo "开始处理..."
for i in $(seq 1 100); do
    echo "处理进度: $i/100"
    sleep 1
done

echo "处理完成！"
# 无论正常结束还是 Ctrl+C，都会执行 cleanup`
  },
  {
    id: 'shell-debug',
    title: 'Shell 调试与错误处理',
    level: '进阶',
    content: `**调试选项**：
- \`bash -n script.sh\` — 语法检查（不执行）
- \`bash -x script.sh\` — 跟踪执行（打印每条命令）
- \`bash -v script.sh\` — 详细模式（打印输入行）

**set 命令**（在脚本内设置）：
- \`set -e\` — 命令失败立即退出（errexit）
- \`set -u\` — 使用未定义变量报错（nounset）
- \`set -o pipefail\` — 管道中任一命令失败则整体失败
- \`set -x\` — 调试输出（等价 bash -x）
- \`set -euo pipefail\` — 严格模式（推荐组合）

**手动错误处理**：
\`\`\`bash
command || { echo "失败"; exit 1; }
if ! command; then echo "错误"; exit 1; fi
\`\`\`

**PS4 变量**：自定义 \`-x\` 调试的提示符前缀

**DEBUG 陷阱**：\`trap '...' DEBUG\` 每条命令前执行`,
    example: `#!/bin/bash
# 调试与错误处理演示 debug.sh
set -euo pipefail   # 严格模式：出错即退+未定义报错+管道失败

# 自定义调试提示符
# PS4='+ $(date "+%H:%M:%S") \${BASH_SOURCE}:\${LINENO}: '

# 错误处理函数
error_handler() {
    local line=$1
    echo "错误: 第 \${line} 行命令执行失败"
    echo "命令: $(sed -n "\${line}p" "$0")"
    # 清理临时文件
    rm -f /tmp/debug_*.tmp
    exit 1
}
trap 'error_handler $LINENO' ERR

# 安全创建临时文件
tmpfile=$(mktemp /tmp/debug_XXXXXX.tmp) || {
    echo "无法创建临时文件"
    exit 1
}
echo "临时文件: $tmpfile"

# 逐步执行
echo "步骤1: 检查目录..."
[[ -d /etc ]] || { echo "/etc 不存在"; exit 1; }

echo "步骤2: 读取配置..."
config=$(cat /etc/hostname) || exit 1
echo "主机名: $config"

echo "步骤3: 写入临时文件..."
echo "$config" > "$tmpfile"

# 清理
rm -f "$tmpfile"
echo "完成！"

# 调试方法：
# bash -n debug.sh    # 语法检查
# bash -x debug.sh    # 跟踪执行
# bash -v debug.sh    # 详细输出`
  },
  {
    id: 'shell-params',
    title: 'Shell 参数解析 getopts',
    level: '进阶',
    content: `**getopts** 内置命令，解析命令行选项参数。

**基本语法**：
\`\`\`bash
while getopts "abc:" opt; do
    case $opt in
        a) echo "选项 -a" ;;
        b) echo "选项 -b" ;;
        c) echo "选项 -c 值: $OPTARG" ;;
        \\?) echo "未知选项: -$OPTARG"; exit 1 ;;
        :) echo "选项 -$OPTARG 需要参数"; exit 1 ;;
    esac
done
shift $((OPTIND - 1))  # 移除已解析的选项
\`\`\`

**选项字符串规则**：
- \`a\` — 无参数选项 \`-a\`
- \`c:\` — 带参数选项 \`-c value\`
- 大写字母也可用

**OPTARG**：当前选项的参数值
**OPTIND**：下一个待处理的参数索引

**手动解析**：用 \`while\` + \`case\` + \`shift\` 处理 \`--long\` 选项`,
    example: `#!/bin/bash
# 参数解析演示 getopts.sh
# 用法: ./getopts.sh -v -f file.txt -o output.txt args...

usage() {
    echo "用法: $0 [-v] [-f file] [-o output] [args...]"
    echo "  -v    详细输出"
    echo "  -f    输入文件"
    echo "  -o    输出文件"
    exit 1
}

verbose=false
infile=""
outfile=""

# getopts 解析短选项
while getopts ":vf:o:h" opt; do
    case $opt in
        v) verbose=true ;;
        f) infile="$OPTARG" ;;
        o) outfile="$OPTARG" ;;
        h) usage ;;
        :) echo "错误: -$OPTARG 需要参数"; usage ;;
        \\?) echo "错误: 未知选项 -$OPTARG"; usage ;;
    esac
done
shift $((OPTIND - 1))  # 移除已解析选项

# 剩余参数
echo "verbose: $verbose"
echo "输入文件: $infile"
echo "输出文件: $outfile"
echo "剩余参数: $@"

if [[ "$verbose" == true ]]; then
    echo "[DEBUG] 详细模式已开启"
fi

# 执行示例:
# ./getopts.sh -v -f input.txt -o out.txt arg1 arg2
# 输出:
# verbose: true
# 输入文件: input.txt
# 输出文件: out.txt
# 剩余参数: arg1 arg2
# [DEBUG] 详细模式已开启`
  },
  {
    id: 'shell-secure',
    title: 'Shell 安全编程',
    level: '高级',
    content: `**安全原则**：
1. **始终引用变量**：\`"$var"\` 防止空格/特殊字符注入
2. **避免 eval**：\`eval $var\` 极其危险，可用间接引用 \`\${!var}\` 替代
3. **输入验证**：检查用户输入格式
4. **最小权限**：不滥用 root/sudo
5. **临时文件安全**：用 \`mktemp\` 而非可预测文件名
6. **避免命令注入**：不将用户输入直接拼入命令
7. **敏感信息**：不硬编码密码，用环境变量或配置文件
8. **set -euo pipefail**：严格模式防止隐藏错误

**ShellCheck**：静态分析工具，检测安全隐患

**SUID 检查**：定期扫描 \`find / -perm -4000\``,
    example: `#!/bin/bash
# 安全编程实例 secure.sh
set -euo pipefail

# 1. 变量始终加引号
file="/etc/passwd"
cat "$file"          # 安全
# cat $file          # 危险（文件名含空格会出错）

# 2. 输入验证
read -p "请输入端口号: " port
if ! [[ "$port" =~ ^[0-9]+$ ]]; then
    echo "错误: 端口必须为数字" >&2
    exit 1
fi
if ((port < 1 || port > 65535)); then
    echo "错误: 端口范围 1-65535" >&2
    exit 1
fi
echo "有效端口: $port"

# 3. 安全临时文件
tmpfile=$(mktemp /tmp/secure_XXXXXX)
trap 'rm -f "$tmpfile"' EXIT  # 退出时清理
echo "临时文件: $tmpfile"

# 4. 避免命令注入（不安全 vs 安全）
user_input="; rm -rf /"
# 危险：echo $user_input | bash  ← 绝对不要这样做！
# 安全：直接当作字符串处理
echo "用户输入: $user_input"

# 5. 检查命令是否存在
if ! command -v curl &>/dev/null; then
    echo "错误: curl 未安装" >&2
    exit 1
fi

# 6. 敏感信息用环境变量
# 不安全: DB_PASS="password123"
# 安全: 从环境变量读取
db_pass="\${DB_PASSWORD:?请设置 DB_PASSWORD 环境变量}"
echo "数据库密码已配置（不显示）"

# 7. 用 shellcheck 检查
# 安装: apt install shellcheck
# 运行: shellcheck secure.sh`
  },
  {
    id: 'shell-perf',
    title: 'Shell 性能优化',
    level: '高级',
    content: `**优化策略**：

1. **减少子进程**：用 bash 内置替代外部命令
   - \`\${#str}\` 替代 \`echo $str | wc -c\`
   - \`\${str//old/new}\` 替代 \`echo $str | sed\`
   - \`((a+b))\` 替代 \`expr $a + $b\`

2. **并行执行**：
   - \`command1 & command2 & wait\`
   - \`xargs -P 4\` 并行处理
   - \`parallel\` 工具

3. **避免管道中的循环**：管道每段都启动子 shell
   - 用重定向替代：\`while read; do; done < file\`

4. **批量操作**：\`xargs\` 批量处理比循环逐个处理快

5. **缓存结果**：避免重复计算

6. **mapfile 替代 while read**：读取大文件更快

7. **减少 I/O**：合并写操作`,
    example: `#!/bin/bash
# 性能优化对比实例 perf.sh

# === 1. 内置 vs 外部命令 ===
str="hello world shell script"

# 慢：启动 3 个子进程
# len=$(echo "$str" | wc -c)

# 快：纯 bash 内置
len=\${#str}
echo "字符串长度: $len"

# === 2. 并行执行 ===
# 串行（慢）
echo "串行下载..."
time (
    curl -s http://httpbin.org/delay/2 -o /dev/null
    curl -s http://httpbin.org/delay/2 -o /dev/null
    curl -s http://httpbin.org/delay/2 -o /dev/null
)
# 约 6 秒

# 并行（快）
echo "并行下载..."
time (
    curl -s http://httpbin.org/delay/2 -o /dev/null &
    curl -s http://httpbin.org/delay/2 -o /dev/null &
    curl -s http://httpbin.org/delay/2 -o /dev/null &
    wait
)
# 约 2 秒

# === 3. xargs 并行 ===
echo "1 2 3 4" | tr ' ' '\\n' | xargs -P 4 -I{} bash -c '
    echo "处理 {} ..."
    sleep 2
    echo "{} 完成"
'

# === 4. mapfile 读取文件 ===
# 快：一次性读取
mapfile -t lines < /etc/passwd
echo "读取 \${#lines[@]} 行"

# === 5. 批量替换 ===
# 慢：逐行 sed
# while read line; do echo "$line" | sed 's/foo/bar/'; done < file

# 快：一次性 sed
# sed 's/foo/bar/g' file`
  },
  {
    id: 'shell-crontab',
    title: 'Shell 计划任务 crontab',
    level: '进阶',
    content: `**crontab** 定时执行任务。

**格式**：\`分 时 日 月 周 命令\`
\`\`\`
* * * * * command
│ │ │ │ │
│ │ │ │ └─ 星期 (0-7, 0和7都是周日)
│ │ │ └─── 日期 (1-31)
│ │ └───── 月份 (1-12)
│ └─────── 小时 (0-23)
└───────── 分钟 (0-59)
\`\`\`

**特殊符号**：
- \`*\` 任意值
- \`,\` 列表 (1,3,5)
- \`-\` 范围 (1-5)
- \`*/n\` 步长 (*/5 = 每5分钟)

**命令**：
- \`crontab -e\` 编辑
- \`crontab -l\` 查看
- \`crontab -r\` 删除
- \`crontab -u user -e\` 编辑指定用户

**at** 一次性任务：\`at 2:00 tomorrow\`

**anacron**：适合不常开机的机器`,
    example: `#!/bin/bash
# crontab 计划任务实例

# 查看当前 crontab
crontab -l

# === 常用 crontab 示例 ===
# 每5分钟执行
*/5 * * * * /opt/scripts/check_health.sh

# 每天凌晨2点备份数据库
0 2 * * * /opt/scripts/backup_db.sh >> /var/log/backup.log 2>&1

# 每周一上午9点清理日志
0 9 * * 1 /opt/scripts/clean_logs.sh

# 每月1号凌晨3点执行统计
0 3 1 * * /opt/scripts/monthly_report.sh

# 工作日(周一到周五)每小时同步
0 * * * 1-5 /opt/scripts/sync_data.sh

# === 脚本中设置 crontab ===
# 添加一条定时任务（不覆盖已有）
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/scripts/backup.sh") | crontab -

# === at 一次性任务 ===
echo "/opt/scripts/deploy.sh" | at 23:00
echo "/opt/scripts/report.sh" | at 2:00 tomorrow
atq                    # 查看待执行任务
atrm 3                 # 删除任务ID=3

# === 注意事项 ===
# 1. crontab 环境变量最少，需在脚本中 source /etc/profile
# 2. 路径要用绝对路径
# 3. 输出重定向到日志文件
# 4. 确保脚本有执行权限`
  },
  {
    id: 'shell-engineering',
    title: 'Shell 脚本工程化',
    level: '高级',
    content: `**工程化最佳实践**：

1. **严格模式**：\`set -euo pipefail\`
2. **日志函数**：封装 log_info/log_warn/log_error
3. **配置分离**：source 外部配置文件
4. **函数库**：公共函数抽成独立文件
5. **参数校验**：检查必需参数
6. **信号处理**：trap 捕获信号做清理
7. **退出码规范**：0成功，非0不同错误类型
8. **usage 帮助**：\`-h\` 显示用法
9. **锁机制**：防止脚本重复运行 (flock)
10. **ShellCheck**：CI 中集成静态检查

**目录结构**：
\`\`\`
project/
├── bin/          # 可执行脚本
├── lib/          # 函数库
├── conf/         # 配置文件
├── logs/         # 日志
└── tests/        # 测试
\`\`\``,
    example: `#!/bin/bash
# 工程化脚本模板 template.sh
set -euo pipefail

# ========== 常量 ==========
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF_FILE="$SCRIPT_DIR/conf/app.conf"
LOG_DIR="$SCRIPT_DIR/logs"
PID_FILE="/tmp/app_deploy.pid"

# ========== 加载函数库 ==========
source "$SCRIPT_DIR/lib/log.sh" 2>/dev/null || {
    # 内联日志函数
    log_info()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $*"; }
    log_warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  $*" >&2; }
    log_error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2; }
}

# ========== 加载配置 ==========
[[ -f "$CONF_FILE" ]] && source "$CONF_FILE"

# ========== 信号处理 ==========
cleanup() {
    log_info "清理资源..."
    rm -f "$PID_FILE"
    exit 0
}
trap cleanup EXIT INT TERM

# ========== 防重复运行 ==========
exec 9>"$PID_FILE"
if ! flock -n 9; then
    log_error "脚本已在运行中 (PID: $(cat "$PID_FILE"))"
    exit 1
fi
echo $$ > "$PID_FILE"

# ========== 参数校验 ==========
usage() {
    cat <<EOF
用法: $0 [选项]
  -e ENV    环境名 (dev/staging/prod) [必需]
  -v        详细输出
  -d        干运行（只打印不执行）
  -h        显示帮助
EOF
    exit 0
}

ENV=""
DRY_RUN=false
while getopts ":e:vdh" opt; do
    case $opt in
        e) ENV="$OPTARG" ;;
        v) set -x ;;
        d) DRY_RUN=true ;;
        h) usage ;;
        *) log_error "未知选项: -$opt"; usage ;;
    esac
done

[[ -z "$ENV" ]] && { log_error "请指定环境 (-e)"; usage; }
[[ ! "$ENV" =~ ^(dev|staging|prod)$ ]] && { log_error "无效环境: $ENV"; exit 1; }

# ========== 主逻辑 ==========
deploy() {
    log_info "开始部署到 $ENV 环境"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[干运行] 将执行: docker-compose up -d"
        return 0
    fi

    log_info "拉取最新代码..."
    git pull origin main

    log_info "构建镜像..."
    docker-compose build

    log_info "重启服务..."
    docker-compose up -d

    log_info "健康检查..."
    sleep 5
    if curl -sf http://localhost:8080/health | grep -q "ok"; then
        log_info "部署成功！"
    else
        log_error "健康检查失败！"
        exit 1
    fi
}

deploy`
  },
  {
    id: 'shell-text-tools',
    title: 'Shell 文本处理工具集',
    level: '进阶',
    content: `**文本处理工具**：

**sort** 排序：\`-n\` 数字、\`-r\` 倒序、\`-k\` 按列、\`-u\` 去重
**uniq** 去重：需先排序，\`-c\` 计数、\`-d\` 只显示重复行
**cut** 截取：\`-d:\` 分隔符、\`-f1\` 第1列、\`-c1-5\` 字符范围
**tr** 替换/删除：\`tr 'a-z' 'A-Z'\` 大写、\`tr -d ' '\` 删除空格
**tee** 分流：同时输出到屏幕和文件
**paste** 合并文件：按列合并
**join** 关联：按共同字段连接
**wc** 统计：\`-l\` 行数、\`-w\` 单词数、\`-c\` 字符数
**diff** 比较：\`-u\` 统一格式
**comm** 交集/差集：需排序后的文件
**split** 分割：\`-l 1000\` 每1000行一个文件
**xargs** 参数传递：\`-I{}\` 替换、\`-P4\` 并行`,
    example: `#!/bin/bash
# 文本处理工具集实例

# sort + uniq 统计
sort access.log | uniq -c | sort -rn | head -10
# 统计访问最多的前10个IP

# cut 截取
cut -d: -f1 /etc/passwd              # 所有用户名
cut -d' ' -f1-3 /var/log/nginx.log   # 日志前3列

# tr 替换/删除
echo "Hello World" | tr 'a-z' 'A-Z'  # HELLO WORLD
echo "a b c" | tr -d ' '             # abc（删除空格）
echo "hello" | tr 'a-z' 'n-za-m'     # uryyb（ROT13加密）

# tee 分流
echo "log entry" | tee -a app.log    # 同时输出屏幕和追加文件

# paste 合并
paste users.txt emails.txt           # 按列合并两个文件

# diff 比较
diff -u old.conf new.conf            # 统一格式比较
diff <(ls dir1) <(ls dir2)           # 比较两个目录

# comm 交集差集（需先排序）
sort file1.txt > s1.txt
sort file2.txt > s2.txt
comm -12 s1.txt s2.txt   # 交集
comm -23 s1.txt s2.txt   # 只在file1中
comm -13 s1.txt s2.txt   # 只在file2中

# split 分割大文件
split -l 1000 large.log chunk_      # 每1000行一个文件
split -b 10M bigfile.bin part_       # 每10MB一个文件

# xargs 参数传递
find /log -name "*.gz" | xargs -I{} gunzip {}
find /src -name "*.py" | xargs grep "import" | wc -l
echo "1 2 3 4" | xargs -n1 echo     # 每行一个

# 综合管道：统计Nginx访问量Top10 IP
awk '{print $1}' /var/log/nginx/access.log \\
  | sort | uniq -c | sort -rn | head -10`
  },
  {
    id: 'shell-subshell',
    title: 'Shell 子shell与进程管理',
    level: '进阶',
    content: `**子shell**：\`(命令)\` 在新进程中执行，不影响当前shell变量
**命令分组**：\`{ 命令; }\` 在当前shell中执行（注意空格和分号）

**进程替换**：
- \`<(command)\` — 输出作为临时文件供读取
- \`>(command)\` — 输入作为临时文件供写入

**后台执行**：
- \`command &\` — 后台运行
- \`nohup command &\` — 不挂断（终端关闭后继续）
- \`disown\` — 从作业表中移除

**作业控制**：
- \`jobs\` — 查看后台作业
- \`fg %n\` — 调到前台
- \`bg %n\` — 在后台继续
- \`Ctrl+Z\` — 暂停前台作业
- \`wait\` — 等待所有后台作业
- \`wait $PID\` — 等待指定进程

**命名管道**：\`mkfifo\` 创建FIFO文件`,
    example: `#!/bin/bash
# 子shell与进程管理实例

# === 子shell vs 命令分组 ===
count=0

# 子shell：变量修改不影响父shell
( count=100; echo "子shell中: count=$count" )
echo "父shell中: count=$count"      # 还是 0

# 命令分组：在当前shell执行
{ count=100; echo "分组中: count=$count"; }
echo "分组后: count=$count"          # 变成 100

# === 后台执行 ===
# 后台运行不阻塞
sleep 10 &
echo "后台PID: $!"                   # 获取后台进程PID

# nohup：终端关闭后继续运行
nohup python app.py > app.log 2>&1 &
echo "nohup PID: $!"

# === wait 等待 ===
# 并行执行多个任务，等待全部完成
echo "=== 并行任务 ==="
task1() { sleep 2; echo "任务1完成"; }
task2() { sleep 3; echo "任务2完成"; }
task3() { sleep 1; echo "任务3完成"; }

task1 &
task2 &
task3 &
wait                                # 等待所有后台任务
echo "所有任务完成"

# === 进程替换 ===
# 比较两个命令的输出
diff <(ls /dir1) <(ls /dir2)

# 同时写入多个文件
echo "data" | tee >(gzip > out.gz) >(wc -c > count.txt) > /dev/null

# === 命名管道 ===
pipe=/tmp/my_pipe
mkfifo "$pipe"

# 一个终端写入
# echo "hello" > "$pipe"
# 另一个终端读取
# cat < "$pipe"

rm -f "$pipe"`
  },
];

// ========== 处理：为现有知识点添加 example ==========
let added = 0;
for (const catKey of Object.keys(K)) {
  for (const topic of K[catKey].topics) {
    if (EXAMPLES[topic.id]) {
      topic.example = EXAMPLES[topic.id];
      added++;
    }
  }
}
console.log(`已为 ${added} 个现有知识点添加实例`);

// ========== 添加 Shell 学科到 KNOWLEDGE ==========
K.shell = {
  name: 'Shell脚本',
  icon: '🖥️',
  color: '#8b5cf6',
  topics: SHELL_TOPICS
};
console.log(`已添加 Shell 学科: ${SHELL_TOPICS.length} 个知识点`);

// ========== 合并 Shell 题目到 QUESTIONS ==========
const shellQsRaw = fs.readFileSync('/workspace/shell_questions.js', 'utf8')
  .replace(/^const /m, 'global.');
eval(shellQsRaw);
Q.shell = global.SHELL_NEW;
console.log(`已添加 Shell 题目: ${Q.shell.length} 道`);

// ========== 序列化写回 ==========
function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\t/g, '\\t');
}

function serializeTopic(t) {
  let out = '      {\n';
  out += `        id: '${t.id}',\n`;
  out += `        title: '${t.title}',\n`;
  out += `        level: '${t.level}',\n`;
  out += `        content: \`${t.content}\`,\n`;
  if (t.example) {
    out += `        example: \`${t.example}\`\n`;
  }
  out += '      }';
  return out;
}

function serializeKnowledge(K) {
  let out = 'const KNOWLEDGE = {\n';
  for (const key of Object.keys(K)) {
    const cat = K[key];
    out += `  ${key}: {\n`;
    out += `    name: '${cat.name}',\n`;
    out += `    icon: '${cat.icon}',\n`;
    out += `    color: '${cat.color}',\n`;
    out += `    topics: [\n`;
    out += cat.topics.map(serializeTopic).join(',\n');
    out += `\n    ]\n`;
    out += `  },\n`;
  }
  // 去掉最后一个逗号
  out = out.replace(/,\n$/, '\n');
  out += '};\n';
  return out;
}

function serializeQuestions(Q) {
  let out = '\nconst QUESTIONS = {\n';
  for (const key of Object.keys(Q)) {
    const qs = Q[key];
    const items = qs.map(q => {
      const qStr = JSON.stringify(q.q);
      const lStr = JSON.stringify(q.level);
      const oStr = '[' + q.options.map(o=>JSON.stringify(o)).join(', ') + ']';
      const aStr = q.answer;
      const eStr = JSON.stringify(q.explain);
      return `    {q:${qStr}, level:${lStr}, options:${oStr}, answer:${aStr}, explain:${eStr}}`;
    });
    out += `  ${key}: [\n${items.join(',\n')}\n  ],\n`;
  }
  out = out.replace(/,\n$/, '\n');
  out += '};\n';
  return out;
}

const finalContent = serializeKnowledge(K) + serializeQuestions(Q);
fs.writeFileSync('/workspace/data.js', finalContent, 'utf8');
console.log('已写入 /workspace/data.js');

// ========== 验证 ==========
try {
  eval(fs.readFileSync('/workspace/data.js', 'utf8')
    .replace('const KNOWLEDGE', 'global.__V_K__')
    .replace('const QUESTIONS', 'global.__V_Q__'));
  const VK = global.__V_K__;
  const VQ = global.__V_Q__;
  console.log('\n===== 验证结果 =====');
  let totalTopics = 0, totalQs = 0;
  for (const k of Object.keys(VK)) {
    const cat = VK[k];
    const topicsWithExample = cat.topics.filter(t => t.example).length;
    const qs = VQ[k] ? VQ[k].length : 0;
    totalTopics += cat.topics.length;
    totalQs += qs;
    console.log(`${cat.icon} ${cat.name}: ${cat.topics.length} 知识点(含实例${topicsWithExample}) | ${qs} 题`);
  }
  console.log(`\n总计: ${totalTopics} 知识点, ${totalQs} 道题`);
  console.log('语法检查: 通过');
} catch(e) {
  console.error('语法错误:', e.message);
  process.exit(1);
}
