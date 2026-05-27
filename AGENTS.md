# AGENTS.md — 科科机器人科技团队

## 项目概述

科科机器人科技团队官网，一个基于 **纯静态 HTML/CSS/JS** 的单页面应用（SPA），中文内容，展示机器人产品与服务。

## 设计系统

参考宇树科技（Unitree）风格，以**深色沉浸式 + 渐变色彩**为核心设计语言：

| 产品线 | 渐变色 | 应用场景 |
|---|---|---|
| 教育机器人 | `#a78bfa → #6366f1 → #3b82f6`（紫蓝） | `.field-card:nth-child(1)`, EduBot 产品区 |
| 工业机器人 | `#06b6d4 → #3b82f6 → #1d4ed8`（青蓝） | `.field-card:nth-child(2)`, Arm Pro 产品区 |
| 服务机器人 | `#10b981 → #06b6d4 → #6366f1`（绿青） | `.field-card:nth-child(3)`, Serve Mini 产品区 |
| Hero/通用 | `#60a5fa → #a78bfa → #06b6d4`（蓝紫青） | 轮播高亮文字、CTA 区域 |

- 渐变文字：`-webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;`
- 深色背景：`#0a0f1e` → `#1a2744` → `#1e3a5f`，配合 `::before` 径向光晕
- 卡片顶部渐变条：`::before { height: 3px; background: var(--grad-xxx); }`，hover 时扩展到 5px

## 技术栈

- **无框架** — 原生 HTML5 + CSS3 + Vanilla JS（ES5 兼容风格）
- **无构建工具** — 直接在浏览器打开 `index.html` 即可运行
- 外部依赖：Google Fonts（`Inter` + `Noto Sans SC`）

## 项目结构

```
index.html          ← 唯一入口，包含所有 6 个"页面"section
css/style.css       ← 全局样式，CSS 自定义属性驱动
js/main.js          ← 所有交互逻辑（页面切换、轮播、动画、表单）
images/             ← 图片资源
news/               ← 新闻数据及正文
team/               ← 团队成员数据及正文
```

## 核心架构模式

### 页面切换（SPA 路由）

6 个页面在 HTML 中对应 `<section class="page" id="page-{name}">`，通过 `main.js` 中的 `switchPage(name, anchorId)` 控制显隐。导航链接和按钮使用 `data-page="name"` 属性绑定，支持 `data-anchor` 定位到页面内特定区域。

导航栏包含两级结构：顶部一级链接（首页、联系我们）和 hover 下拉菜单（关于我们 → 公司介绍/核心团队/新闻动态，产品服务 → 三个产品+定制方案）。

**添加新页面步骤：**
1. 在 `index.html` 中新增 `<section class="page" id="page-xxx">`
2. 在 `css/style.css` 添加对应样式
3. 在导航中添加 `<a class="nav-link" data-page="xxx">` 或加入下拉菜单

### CSS 约定

- 使用 `:root` 变量定义颜色/间距/圆角/过渡，禁止硬编码
- **产品线专属渐变色**：`--grad-edu`（紫蓝，教育）、`--grad-industry`（青蓝，工业）、`--grad-service`（绿青，服务）
- 渐变文字使用 `-webkit-background-clip: text` + `background-clip: text` 组合
- 深色沉浸式区域（如产品区）使用 `#0a0f1e` → `#1a2744` 渐变背景 + `::before` 径向光晕
- 命名：语义化类名（如 `home-stats`、`product-specs`、`contact-grid-layout`）
- 响应式断点：`1024px`（平板）、`640px`（手机）
- 动画统一使用 `@keyframes` 和 `--transition` / `--transition-slow`

### JS 约定

- `DOMContentLoaded` 包裹全部代码
- 函数命名：`camelCase`（`switchPage`、`animateCounters`）
- 动画：`requestAnimationFrame` 数字滚动 + `IntersectionObserver` 滚动渐入
- 渐入动画含缩放回弹效果 + 错开延迟（`transitionDelay`）营造层次感
- 表单提交使用 [Web3Forms](https://web3forms.com/) 发送到指定邮箱（需配置 `YOUR_ACCESS_KEY_HERE`）

### 新闻添加（数据驱动）

新闻由 `news/news-data.js` 中的 `newsData` 数组驱动，每条新闻有独立文件夹存放正文和图片。添加新新闻：

1. 在 `news/` 下创建文件夹（如 `news/2026-06-15/`），放入 `content.json` 和图片
2. 在 `news-data.js` 数组最前面插入一条对象，用 `folder` 字段指向该文件夹

```js
// news-data.js 中的条目格式
{
    date: '2026-06-15',      // 日期，格式 YYYY-MM-DD
    tag: '公司新闻',           // 分类标签
    title: '新闻标题',
    desc: '新闻摘要，1-2句话。',
    icon: '📰',               // emoji 图标（封面占位）
    img: 'news/2026-06-15/cover.jpg',  // 可选封面图
    folder: 'news/2026-06-15' // 指向文件夹，内含 content.json
}
```

```json
// content.json 格式
{ "paragraphs": ["段1", "段2", "..."] }
```

首条自动作为置顶新闻（跨列显示）。`NEWS_PER_PAGE` 控制每次加载条数。详见 `news/README.md`。

### 团队成员添加（数据驱动，纯文件操作）

团队成员由 `team/team-data.js` 中的 `teamData` 数组驱动，JS 自动渲染卡片。**无需修改 `index.html`**，只需操作 `team/` 文件夹：

1. 在 `team/` 下创建文件夹（如 `team/li-ming/`），放入 `content.json`
2. 在 `team-data.js` 数组末尾插入一条对象，用 `folder` 字段指向该文件夹

```js
// team-data.js 中的条目格式
{
    id: 'li-ming',             // 唯一标识
    name: '李明',               // 姓名
    title: '算法工程师',         // 职位
    avatarInitial: '李',        // 头像文字（无照片时显示）
    avatarGradient: 'grad-edu', // 头像渐变色：grad-edu/grad-industry/grad-service/grad-hero
    shortBio: '简介1-2句话。',   // 简短介绍
    photo: 'team/li-ming/avatar.jpg',  // 可选照片路径，有则覆盖渐变色头像
    folder: 'team/li-ming'      // 指向文件夹，内含 content.json
}
```

```json
// content.json 格式
{
    "sections": [
        { "heading": "个人简介", "content": "段落内容..." },
        { "heading": "教育背景", "content": "段落内容..." }
    ]
}
```

## 开发方式

- 无 watch/build/lint 流程，直接编辑 → 刷新浏览器
- 建议使用 VS Code Live Server 或类似工具获得热刷新体验
- `.gitignore` 已忽略系统文件、编辑器配置和临时文件
