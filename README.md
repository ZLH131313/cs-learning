# CS Learning · 多课程学习站点指南

一个纯静态的多课程学习网站:每个课程一个"中心",共享整套学习系统
(随堂小测、名词词典、朗读听书、阅读进度、概念特训、动效)。
无构建、无依赖,任何静态服务器(或直接双击 HTML)即可运行。

## 目录结构

```
cs-learning-site/
├── index.html            # ☕ Java 学习中心入口
├── co.html               # 🖥️ 计组(计算机组成原理)中心入口
├── README.md             # 本文件
├── css/
│   └── style.css         # 全站唯一样式(含深浅主题)
└── js/
    ├── loader.js         # 课程包加载器(把版本号透传给所有脚本)
    ├── app.js            # 共享应用逻辑(路由/渲染/测验/朗读/特训/动效…)
    └── packs/            # ★ 所有课程包,一个中心一个子目录
        ├── java/
        │   ├── pack.js       # 该中心的清单:id + meta + stages + files
        │   ├── part1~6.js    # 课程内容(chapters → sections → blocks)
        │   ├── quiz.js       # 随堂小测题库(按 section id 组织)
        │   ├── demos.js      # 可选:章首"从零构建"引导式演示
        │   └── glossary.js   # 可选:名词词典(正文自动高亮+点击释义)
        └── co/
            ├── pack.js
            ├── part1~3.js
            ├── quiz.js
            └── glossary.js
```

## 数据隔离

学习记录按中心前缀存 localStorage,互不干扰:

| 键 | 内容 |
|---|---|
| `<packId>-progress-v1` | 已掌握小节打卡 |
| `<packId>-reading-v1` | 阅读位置 / 字号 / 语音偏好 / 朗读断点 |
| `<packId>-drill-v1` | 概念特训统计(轮数/对错/逐题权重) |
| `java-theme` | 深浅主题(全站共享) |

## 如何新增一个学习中心(三步)

以"数据结构学习中心"为例:

1. **建数据目录** `js/packs/ds/`:
   - `part1.js…`:课程内容,顶部写
     `window.COURSE_PARTS = window.COURSE_PARTS || []; window.COURSE_PARTS.push([{ id:'ds-ch1', title:'…', icon:'📗', stage:1, desc:'…', sections:[{ id:'ds-xxx', title:'…', stage:1, desc:'…', blocks:[…] }] }, …]);`
     blocks 可用类型:`text(html)` / `code(title,code)` / `table(head,rows)` / `points(title,items)` / `note|warn|tip(html)`
   - `quiz.js`:`window.QUIZ_BANK = { '<sectionId>': [ { q, options, answer(下标), explain } ] }`
   - `glossary.js`(可选):`window.GLOSSARY = { '术语': { cat, def } }`
   - `demos.js`(可选):`window.BUILD_DEMOS = { '<chapterId>': { title, steps:[{c,t,std}] } }`
   - `pack.js`:复制 `java/pack.js` 改 `id/meta/stages/files` 即可(文件尾部注入逻辑保持不变)
2. **建入口页** `ds.html`:复制 `co.html`,改 title/logo/favicon/`loadPack('ds')`,以及
   `pack-switch` 导航(所有中心各一个 `<a class="pk">`,当前中心加 `active`)——
   并同步在其他中心的 HTML 里加一条指向 `ds.html` 的链接。
3. **完成**。打开 `ds.html` 即可,全站功能自动生效;学习记录自动落到 `ds-*` 键下。

## 版本号与缓存(重要)

浏览器会对静态资源做启发式缓存。**修改任何 js/css 后,必须把两个 HTML 里
`loader.js` 与 `style.css` 的 `?v=` 版本号 bump 一次**(如 2026100518 → 2026100519)。
loader 会把版本号透传给 pack.js → 全部数据文件 → app.js,一处修改、全站刷新。

## 本地运行

```bash
# 任选其一
python -m http.server 8620        # 然后访问 http://127.0.0.1:8620
# 或直接双击 index.html(file:// 亦可运行)
```

## 常用维护点

- **加题目/词条/演示步**:直接编辑对应包内文件(结构见上),bump 版本号即可
- **章首"从零构建"演示**:只对每章第一节生效(demos 按 chapterId 组织)
- **概念特训出题范围**:仅限已打卡("我已掌握本节")的小节;连对的题概率递减、
  答错的概率增加(权重 = max(1, 10-3×对) + 2×错)
- **朗读**:浏览器本地 TTS(Web Speech API),音色/语速在右下角 🎙 面板设置;
  Emoji 与界面徽标不会朗读;暂停/断点续读,断点跨刷新有效
