// === FRONTEND EXT4 ===
frontend_ext4_topics: [
  {
    "id": "frontend-next-nuxt",
    "title": "Next.js 14 / Nuxt 3 全栈框架",
    "level": "高级",
    "content": "**Next.js 14 新特性**\n- App Router（稳定）：基于 React Server Components\n- Server Actions：服务端函数直接在前端调用\n- 部分预渲染（Partial Prerendering，实验性）\n- Turbopack（Rust 编写，替代 Webpack）\n- Image/Font/Script 优化组件\n\n**React Server Components（RSC）**\n- 服务端渲染组件，不打包到客户端\n- 可直接访问数据库/文件系统\n- 减少客户端 JavaScript 体积\n- 'use client' 标记客户端组件\n\n**Nuxt 3 特性**\n- Vue 3 + Vite + Nitro（服务端引擎）\n- 文件系统路由、自动导入\n- 混合渲染：SSR/SSG/CSR/ISR\n- Nuxt Islands：部分 hydration\n- Nitro：跨平台部署（Node/Deno/Workers）\n\n**对比**\n| 特性 | Next.js 14 | Nuxt 3 |\n|------|------------|--------|\n| 框架 | React | Vue |\n| 路由 | App Router | 文件系统 |\n| 服务端 | Node/Vercel | Nitro（多平台） |\n| RSC | 有 | Nuxt Islands |\n| 构建 | Webpack/Turbopack | Vite |",
    "example": "// Next.js 14 App Router\n// app/page.tsx (Server Component)\nimport { db } from '@/lib/db'\n\nexport default async function Home() {\n  const posts = await db.query('SELECT * FROM posts')\n  return (\n    <main>\n      {posts.map(post => <PostCard key={post.id} post={post} />)}\n    </main>\n  )\n}\n\n// Server Action\n// app/actions.ts\n'use server'\nexport async function createPost(formData: FormData) {\n  await db.query('INSERT INTO posts ...', [...])\n  revalidatePath('/')\n}\n\n// Nuxt 3\n// pages/index.vue\n<script setup>\nconst { data: posts } = await useFetch('/api/posts')\n</script>\n<template>\n  <div>\n    <PostCard v-for=\"post in posts\" :key=\"post.id\" :post=\"post\" />\n  </div>\n</template>\n\n// server/api/posts.get.ts\nexport default defineEventHandler(async (event) => {\n  return await useStorage().getItem('posts')\n})\n\n// 混合渲染配置\n// nuxt.config.ts\nexport default defineNuxtConfig({\n  routeRules: {\n    '/': { prerender: true },\n    '/admin/**': { ssr: false }\n  }\n})"
  },
  {
    "id": "frontend-wasm",
    "title": "WebAssembly 与 Rust 前端",
    "level": "高级",
    "content": "**WebAssembly（Wasm）**\n- 浏览器内运行接近原生性能的二进制格式\n- 与 JavaScript 互操作\n- 安全沙箱、可移植、紧凑\n- Wasm 2.0：SIMD、多内存、异常处理\n\n**适用场景**\n- 高性能计算：图像/视频处理、游戏、加密\n- 复用现有代码库（C/C++/Rust）\n- 插件系统（Figma、AutoCAD Web）\n\n**Rust 前端生态**\n- **WASM-BINDGEN**：Rust <-> JS 绑定\n- **WASM-PACK**：构建和发布 Wasm 包\n- **Yew**：React-like 框架（Rust）\n- **Leptos**：现代 Rust 全栈框架\n- **Dioxus**：跨平台 Rust UI（Web/桌面/移动）\n\n**Wasm 运行时**\n- WASI（WebAssembly System Interface）：服务端 Wasm\n- WasmEdge：云原生 Wasm 运行时\n- WAMR：轻量嵌入式\n\n**组件模型（Component Model）**\n- WebAssembly 的模块化标准\n- 语言无关的可组合组件\n- 未来跨语言复用",
    "example": "# Rust + Wasm 示例\n\n# 1. 安装工具\ncargo install wasm-pack\n\n# 2. Rust 库\n# src/lib.rs\nuse wasm_bindgen::prelude::*;\n\n#[wasm_bindgen]\npub fn fibonacci(n: u32) -> u32 {\n    match n {\n        0 => 0,\n        1 => 1,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}\n\n# 3. 构建\nwasm-pack build --target web\n\n# 4. 前端使用\n# import init, { fibonacci } from './pkg/fibonacci.js';\n# await init();\n# console.log(fibonacci(40));  // 比 JS 快数倍\n\n# Yew 框架\n# use yew::prelude::*;\n# #[function_component(App)]\n# fn app() -> Html {\n#     html! { <h1>{\"Hello Yew!\"}</h1> }\n# }\n# yew::Renderer::<App>::new().render();\n\n# Leptos\n# #[component]\n# fn App() -> impl IntoView {\n#     let (count, set_count) = create_signal(0);\n#     view! { <button on:click=move |_| set_count.update(|n| *n + 1)>\"Click me\"</button> }\n# }\n\n# WasmEdge 服务端\n# wasmedge app.wasm"
  },
  {
    "id": "frontend-micro-frontend",
    "title": "微前端架构实践",
    "level": "高级",
    "content": "**微前端定义**\n- 将前端应用拆分为独立部署的子应用\n- 团队自治、技术栈独立、独立发布\n- 类比微服务的前端版本\n\n**集成方案**\n\n1. **iframe**\n   - 简单隔离，但体验差、通信麻烦\n\n2. **Web Components**\n   - 原生组件化，Shadow DOM 隔离样式\n   - Lit、Stencil 框架\n\n3. **Module Federation（Webpack 5）**\n   - 运行时动态加载远程模块\n   - 共享依赖（react、vue 单例）\n   - 最主流方案\n\n4. **qiankun / single-spa**\n   - 国产（qiankun）和国外（single-spa）框架\n   - JS Sandbox（Proxy）隔离\n   - 样式隔离（Shadow DOM / Scoped CSS）\n   - 应用间通信\n\n**挑战**\n- 共享依赖版本冲突\n- 全局样式污染\n- 路由协调\n- 公共依赖提取\n- 构建优化",
    "example": "# 微前端实践\n\n# 1. Module Federation\n# shell/webpack.config.js\nconst { ModuleFederationPlugin } = require('webpack').container;\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'shell',\n      remotes: {\n        app1: 'app1@http://localhost:3001/remoteEntry.js',\n        app2: 'app2@http://localhost:3002/remoteEntry.js',\n      },\n      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },\n    }),\n  ],\n};\n\n// 使用远程组件\nconst RemoteButton = React.lazy(() => import('app1/Button'));\n\n# 2. qiankun\nimport { registerMicroApps, start } from 'qiankun';\n\nregisterMicroApps([\n  {\n    name: 'vue-app',\n    entry: '//localhost:8080',\n    container: '#container',\n    activeRule: '/vue',\n  },\n  {\n    name: 'react-app',\n    entry: '//localhost:3000',\n    container: '#container',\n    activeRule: '/react',\n  },\n]);\nstart();\n\n# 3. Web Components\nclass MyElement extends HTMLElement {\n  connectedCallback() {\n    this.attachShadow({ mode: 'open' });\n    this.shadowRoot.innerHTML = `<style>:host { color: red; }</style><slot></slot>`;\n  }\n}\ncustomElements.define('my-element', MyElement);"
  },
  {
    "id": "frontend-state-modern",
    "title": "现代状态管理（Zustand/Jotai/Signal）",
    "level": "高级",
    "content": "**状态管理演进**\n- Redux：中心化、可预测，但样板代码多\n- MobX：响应式，自动追踪依赖\n- Context API：React 内置，适合低频更新\n- 现代轻量方案：Zustand、Jotai、Valtio\n\n**Zustand**\n- 极简 API，无 Provider 包裹\n- 基于 hooks\n- 支持中间件：持久化、日志、immer\n- TypeScript 友好\n\n**Jotai**\n- 原子化状态管理\n- Recoil 的轻量替代\n- 派生原子（derived atoms）\n- 支持异步原子\n\n**Signals**\n- SolidJS / Preact / Angular 16+\n- 细粒度响应式，不依赖 VDOM diff\n- 自动订阅/取消订阅\n- 性能极佳\n\n**React Compiler（React 19 实验）**\n- 自动记忆化，无需 useMemo/useCallback\n- 编译时优化而非运行时\n\n**对比**\n| 库 | 大小 | 范式 | 适用 |\n|----|------|------|------|\n| Redux | 大 | 集中式 | 复杂应用 |\n| Zustand | 极小 | 集中式 | 中小型 |\n| Jotai | 小 | 原子化 | 派生状态多 |\n| Valtio | 小 | 代理式 | 可变状态 |",
    "example": "// Zustand\nimport { create } from 'zustand'\nimport { persist } from 'zustand/middleware'\n\nconst useStore = create(persist(\n  (set) => ({\n    count: 0,\n    inc: () => set((state) => ({ count: state.count + 1 })),\n  }),\n  { name: 'my-store' }\n))\n\nfunction Counter() {\n  const { count, inc } = useStore()\n  return <button onClick={inc}>{count}</button>\n}\n\n// Jotai\nimport { atom, useAtom } from 'jotai'\n\nconst countAtom = atom(0)\nconst doubledAtom = atom((get) => get(countAtom) * 2)\n\nfunction Counter() {\n  const [count, setCount] = useAtom(countAtom)\n  const [doubled] = useAtom(doubledAtom)\n  return <div>{count} * 2 = {doubled}</div>\n}\n\n// Preact Signals\nimport { signal, computed } from '@preact/signals-react'\n\nconst count = signal(0)\nconst doubled = computed(() => count.value * 2)\n\nfunction Counter() {\n  return <button onClick={() => count.value++}>{doubled}</button>\n}\n\n// React Compiler（实验性）\n// 自动优化，无需手动 useMemo\n// 'use memo' 指令（React 19）"
  },
  {
    "id": "frontend-build-tools",
    "title": "现代构建工具（Vite/Turbopack/Rsbuild）",
    "level": "高级",
    "content": "**构建工具演进**\n- Webpack：功能全面，但配置复杂、构建慢\n- Vite：ESM 原生，极速 HMR，生产 Rollup\n- Turbopack：Webpack 继任者，Rust 编写\n- Rsbuild：Rspack 的封装，Webpack 替代\n- Bun：内置 bundler，超快\n\n**Vite 核心**\n- 开发：esbuild 预构建依赖，原生 ESM\n- 生产：Rollup 打包，高度优化\n- HMR 极速（模块级替换）\n- 插件生态兼容 Rollup\n\n**Rspack / Rsbuild**\n- 字节跳动开源\n- Rust 编写的 Webpack 兼容 bundler\n- 支持 Loader/Plugin 生态迁移\n- Rsbuild：开箱即用的构建工具（类似 Vite）\n\n**Turbopack**\n- Next.js 14 默认（开发模式）\n- Rust + 增量计算\n- 声称比 Webpack 快 700x，比 Vite 快 10x\n- 目前仅 Next.js 深度集成\n\n**Bun**\n- 全能 JS 运行时 + 打包器 + 测试运行器\n- Zig 编写，极致性能\n- 兼容 Node.js API\n- 内置 bundler、transpiler、package manager",
    "example": "# 现代构建工具\n\n# Vite\nnpm create vite@latest my-app -- --template react-ts\ncd my-app && npm install && npm run dev\n\n# vite.config.ts\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({\n  plugins: [react()],\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['react', 'react-dom'],\n        },\n      },\n    },\n  },\n})\n\n# Rsbuild\nnpm create rsbuild@latest\n\n# Turbopack（Next.js）\nnext dev --turbo\n\n# Bun\nbun install\nbun run dev\nbun build ./index.tsx --outdir ./out\n\n# 构建性能对比（大致）\n# Webpack: 30s\n# Vite: 3s\n# Rspack: 5s\n# Turbopack: 1s\n# Bun: 2s"
  },
  {
    "id": "frontend-pwa-optimization",
    "title": "PWA、性能优化与 Core Web Vitals",
    "level": "高级",
    "content": "**PWA（Progressive Web App）**\n- Service Worker：离线缓存、后台同步、推送通知\n- Web App Manifest：安装到主屏幕\n- Workbox：Google 的 Service Worker 工具库\n\n**Core Web Vitals（CWV）**\n- Google 搜索排名因素\n\n1. **LCP（Largest Contentful Paint）**\n   - 最大内容绘制 < 2.5s（良好）\n   - 优化：图片压缩、预加载、CDN、字体优化\n\n2. **INP（Interaction to Next Paint）**\n   - 交互到下一次绘制 < 200ms\n   - 替代 FID（First Input Delay）\n   - 优化：减少主线程阻塞、事件委托优化\n\n3. **CLS（Cumulative Layout Shift）**\n   - 累积布局偏移 < 0.1\n   - 优化：图片/视频指定尺寸、字体预加载、避免插入内容\n\n**性能优化技术**\n- 代码分割：React.lazy、动态 import\n- 资源预加载：preload、prefetch、modulepreload\n- 图片优化：WebP/AVIF、srcset、懒加载\n- 字体优化：font-display: swap、子集化\n- 减少重排重绘：CSS containment、will-change\n- 长任务拆分：yield to main（scheduler）",
    "example": "// PWA + 性能优化\n\n// 1. Service Worker（Workbox）\n// sw.ts\nimport { precacheAndRoute } from 'workbox-precaching'\nimport { NetworkFirst } from 'workbox-strategies'\nimport { registerRoute } from 'workbox-routing'\n\nprecacheAndRoute(self.__WB_MANIFEST)\nregisterRoute(\n  ({ request }) => request.destination === 'image',\n  new NetworkFirst({ cacheName: 'images' })\n)\n\n// 2. Web App Manifest\n// manifest.json\n{\n  \"name\": \"My App\",\n  \"short_name\": \"MyApp\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",\n  \"icons\": [{ \"src\": \"/icon.png\", \"sizes\": \"192x192\" }]\n}\n\n// 3. 图片优化\n<img\n  src=\"image.webp\"\n  srcSet=\"image-400.webp 400w, image-800.webp 800w\"\n  sizes=\"(max-width: 600px) 400px, 800px\"\n  loading=\"lazy\"\n  decoding=\"async\"\n  width=\"800\"\n  height=\"600\"\n/>\n\n// 4. 代码分割\nconst HeavyChart = React.lazy(() => import('./HeavyChart'))\n\n// 5. 字体优化\n<link rel=\"preload\" href=\"/font.woff2\" as=\"font\" type=\"font/woff2\" crossorigin>\n<style>\n  @font-face {\n    font-family: 'MyFont';\n    src: url('/font.woff2') format('woff2');\n    font-display: swap;\n  }\n</style>\n\n// 6. 长任务拆分\nimport { scheduleCallback } from 'scheduler'\n\nfunction processLargeArray(items) {\n  const chunk = items.splice(0, 100)\n  chunk.forEach(processItem)\n  if (items.length > 0) {\n    scheduleCallback(processLargeArray, items)\n  }\n}"
  }
],

frontend_ext4_questions: [
  {
    "q": "Next.js 14 的 App Router 基于什么技术？",
    "level": "高级",
    "options": ["React Client Components","React Server Components","Vue SSR","Angular Universal"],
    "answer": 1,
    "explain": "Next.js 14 App Router 基于 React Server Components，允许组件在服务端渲染并直接访问后端资源。"
  },
  {
    "q": "WebAssembly 的运行环境是？",
    "level": "进阶",
    "options": ["Node.js 独占","浏览器 + 服务端（WasmEdge/WASI）","仅 Linux","仅 Windows"],
    "answer": 1,
    "explain": "Wasm 可在浏览器中运行，也可通过 WASI 在服务端运行（如 WasmEdge、Wasmtime）。"
  },
  {
    "q": "qiankun 是？",
    "level": "高级",
    "options": ["React 框架","微前端框架","构建工具","状态管理库"],
    "answer": 1,
    "explain": "qiankun 是蚂蚁集团开源的微前端框架，基于 single-spa，提供 JS Sandbox 和应用间通信。"
  },
  {
    "q": "Zustand 相比 Redux 的主要优势是？",
    "level": "高级",
    "options": ["更多功能","极简 API、无 Provider、TypeScript 友好","官方支持","更大社区"],
    "answer": 1,
    "explain": "Zustand 以极小体积、简单 API、无需 Provider 包裹、优秀的 TS 支持著称，适合中小型项目。"
  },
  {
    "q": "Vite 开发服务器快的原因是？",
    "level": "进阶",
    "options": ["更强大的 CPU","基于 ESM 原生和 esbuild 预构建","缓存更多","代码更少"],
    "answer": 1,
    "explain": "Vite 利用浏览器原生 ESM 支持，开发时不对源码打包，依赖用 esbuild 预构建，实现极速冷启动和 HMR。"
  },
  {
    "q": "Turbopack 是用什么语言编写的？",
    "level": "进阶",
    "options": ["C++","Rust","Go","Zig"],
    "answer": 1,
    "explain": "Turbopack 是 Rust 编写的增量打包工具，被宣传为 Webpack 的继任者。"
  },
  {
    "q": "Core Web Vitals 中，LCP 指的是？",
    "level": "进阶",
    "options": ["最长任务","最大内容绘制","累积布局偏移","首次输入延迟"],
    "answer": 1,
    "explain": "LCP = Largest Contentful Paint，测量视口中最大内容元素的渲染时间，目标 < 2.5s。"
  },
  {
    "q": "Module Federation 首次出现在？",
    "level": "高级",
    "options": ["Vite","Webpack 5","Rollup","Parcel"],
    "answer": 1,
    "explain": "Module Federation 是 Webpack 5 的核心特性，允许在运行时动态加载远程模块。"
  },
  {
    "q": "React Server Components 中，'use client' 表示？",
    "level": "高级",
    "options": ["服务端组件","客户端组件","API 路由","中间件"],
    "answer": 1,
    "explain": "在 RSC 架构中，'use client' 指令标记组件在客户端渲染，可使用 useState/useEffect 等客户端 API。"
  },
  {
    "q": "Yew 是用什么语言编写的前端框架？",
    "level": "进阶",
    "options": ["Go","Rust","C++","TypeScript"],
    "answer": 1,
    "explain": "Yew 是 Rust 编写的现代前端框架，灵感来自 React 和 Elm，编译为 WebAssembly 运行。"
  },
  {
    "q": "Workbox 是 Google 提供的什么工具？",
    "level": "进阶",
    "options": ["构建工具","Service Worker 工具库","测试框架","状态管理"],
    "answer": 1,
    "explain": "Workbox 是 Google 开源的 Service Worker 工具库，简化 PWA 的离线缓存和后台同步。"
  },
  {
    "q": "Preact Signals 的响应式粒度是？",
    "level": "高级",
    "options": ["组件级","信号/值级","应用级","路由级"],
    "answer": 1,
    "explain": "Signals 提供细粒度响应式，状态变更时直接更新关联的 DOM 节点，无需组件级重新渲染。"
  },
  {
    "q": "Nuxt 3 的服务端引擎是？",
    "level": "进阶",
    "options": ["Express","Nitro","Fastify","H3"],
    "answer": 1,
    "explain": "Nuxt 3 使用 Nitro 作为服务端引擎，支持多平台部署（Node、Deno、Cloudflare Workers 等）。"
  },
  {
    "q": "Rsbuild 是基于什么构建的？",
    "level": "高级",
    "options": ["Webpack","Rspack","Vite","esbuild"],
    "answer": 1,
    "explain": "Rsbuild 是字节跳动基于 Rspack（Rust 编写的 Webpack 兼容 bundler）封装的开箱即用构建工具。"
  },
  {
    "q": "CLS（Cumulative Layout Shift）优化方法不包括？",
    "level": "进阶",
    "options": ["图片指定尺寸","字体预加载","延迟加载所有 JS","避免插入无尺寸内容"],
    "answer": 2,
    "explain": "延迟加载所有 JS 不是 CLS 优化方法，反而可能延迟渲染。CLS 优化关键是预留空间和避免布局突变。"
  },
  {
    "q": "Shadow DOM 主要用于？",
    "level": "进阶",
    "options": ["SEO","样式和 DOM 封装隔离","性能监控","网络请求"],
    "answer": 1,
    "explain": "Shadow DOM 提供 DOM 和样式的封装隔离，是 Web Components 的核心技术，也是微前端样式隔离方案之一。"
  },
  {
    "q": "Bun 用什么语言编写？",
    "level": "进阶",
    "options": ["Rust","Zig","Go","C++"],
    "answer": 1,
    "explain": "Bun 是 Zig 语言编写的全能 JS 运行时，包含打包器、测试运行器、包管理器。"
  },
  {
    "q": "Next.js 的 Server Actions 允许？",
    "level": "高级",
    "options": ["仅服务端调用","前端直接调用服务端函数","数据库直连","仅 API 路由"],
    "answer": 1,
    "explain": "Server Actions 允许在客户端直接调用标记为 'use server' 的异步函数，无需手动编写 API 路由。"
  },
  {
    "q": "Jotai 的状态管理范式是？",
    "level": "高级",
    "options": ["集中式 Store","原子化（Atom）","代理（Proxy）","事件总线"],
    "answer": 1,
    "explain": "Jotai 采用原子化状态管理，将状态拆分为原子（atom），通过组合派生原子构建状态图。"
  },
  {
    "q": "WebAssembly Component Model 的目标是？",
    "level": "高级",
    "options": ["替代 JavaScript","跨语言的可组合组件标准","图形渲染","网络通信"],
    "answer": 1,
    "explain": "Component Model 是 Wasm 的模块化标准，目标是实现语言无关的可组合组件，支持跨语言复用。"
  },
  {
    "q": "INP（Interaction to Next Paint）取代了？",
    "level": "进阶",
    "options": ["LCP","FID","CLS","TTFB"],
    "answer": 1,
    "explain": "INP（Interaction to Next Paint）于 2024 年取代 FID（First Input Delay）成为 Core Web Vitals 交互指标。"
  },
  {
    "q": "Service Worker 的生命周期不包括？",
    "level": "进阶",
    "options": ["install","activate","fetch","destroy"],
    "answer": 3,
    "explain": "Service Worker 生命周期包括 install、activate、idle、fetch/message，没有 destroy 阶段（通过 skipWaiting/unregister 更新）。"
  },
  {
    "q": "以下哪个不是 Rust 前端框架？",
    "level": "进阶",
    "options": ["Yew","Leptos","Dioxus","Svelte"],
    "answer": 3,
    "explain": "Svelte 是编译型 JavaScript 框架，不是 Rust 框架。Yew、Leptos、Dioxus 都是 Rust 前端框架。"
  },
  {
    "q": "Vite 生产构建使用的打包器是？",
    "level": "进阶",
    "options": ["esbuild","Rollup","Webpack","Rspack"],
    "answer": 1,
    "explain": "Vite 开发用 esbuild，生产构建使用 Rollup 进行代码分割和优化打包。"
  },
  {
    "q": "PWA 的 manifest.json 中 display: standalone 表示？",
    "level": "基础",
    "options": ["浏览器打开","独立窗口运行（类似原生应用）","全屏","最小化"],
    "answer": 1,
    "explain": "display: standalone 让 PWA 以独立应用形式运行，没有浏览器地址栏，类似原生应用体验。"
  },
  {
    "q": "React Compiler 的主要作用是？",
    "level": "高级",
    "options": ["打包优化","编译时自动记忆化，减少 useMemo/useCallback","类型检查","代码压缩"],
    "answer": 1,
    "explain": "React Compiler（原 React Forget）在编译时自动添加记忆化优化，减少手动 useMemo/useCallback 需求。"
  },
  {
    "q": "CSS containment（contain 属性）用于？",
    "level": "高级",
    "options": ["居中布局","隔离渲染子树，减少重排影响范围","字体加载","动画优化"],
    "answer": 1,
    "explain": "CSS containment 将元素的渲染子树隔离，其内部变化不会导致外部重排重绘，提升性能。"
  },
  {
    "q": "Nuxt Islands 提供什么能力？",
    "level": "高级",
    "options": ["SSR","组件级选择性 hydration","SSG","CSR"],
    "answer": 1,
    "explain": "Nuxt Islands 允许页面中部分组件服务端渲染且不做 hydration，减少客户端 JS 体积。"
  },
  {
    "q": "HTTP 的 modulepreload 用于？",
    "level": "进阶",
    "options": ["图片预加载","JS 模块预加载","CSS 预加载","字体预加载"],
    "answer": 1,
    "explain": "<link rel=\"modulepreload\"> 用于预加载 JavaScript 模块及其依赖树，加速 ESM 加载。"
  }
]
