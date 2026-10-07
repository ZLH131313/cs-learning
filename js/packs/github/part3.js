/* ============ GitHub 中心 · 第 5-6 章:进阶功能 + 生态与求职 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'gh-ch5', title: 'GitHub 进阶功能', icon: '⚙️', stage: 4,
    desc: 'Pages 免费建站、Actions 自动化、团队协作护栏。',
    sections: [
      {
        id: 'gh-pages', title: 'GitHub Pages 免费建站', stage: 3,
        desc: '一个仓库,一个免费网站',
        blocks: [
          { type: 'text', html: `<p><strong>GitHub Pages</strong> 把仓库变成免费静态网站:<code class="ic">用户名.github.io/仓库名</code> 即可访问,支持自定义域名——个人主页、项目文档、作品集的零成本方案。</p>` },
          { type: 'code', lang: 'Text', title: '三种常见用法', code: `① 个人主页仓库:仓库名必须是 用户名.github.io
   → 访问 https://用户名.github.io(根站点)

② 任意项目仓库:Settings → Pages → 选分支与目录
   → 访问 https://用户名.github.io/仓库名

③ 静态站点框架(VitePress/Hugo/Hexo):
   构建产物推到 gh-pages 分支,或在 Actions 里自动发布` },
          { type: 'points', title: '要点', items: [
            '只能托管<b>静态内容</b>(HTML/CSS/JS),没有后端——正好放你本学习站的成果。',
            '免费、全球 CDN、HTTPS 自动配好;国内访问速度一般,可再套自定义域名。',
            '仓库公开免费,私有仓库 Pages 需要付费档位。',
          ] }
        ]
      },
      {
        id: 'gh-actions', title: 'GitHub Actions 入门', stage: 3,
        desc: 'push 一下,机器人替你干活',
        blocks: [
          { type: 'text', html: `<p><strong>Actions</strong> 是 GitHub 内置的自动化引擎(CI/CD):push 代码、收到 PR、定时……都能<strong>触发</strong>一段在云端虚拟机(<strong>Runner</strong>)上执行的流程(<strong>Workflow</strong>)——跑测试、构建、部署全自动。</p>` },
          { type: 'code', lang: 'YAML', title: '最小可用的 Workflow', code: `# .github/workflows/ci.yml
name: CI
on:                       # 何时触发
  push:
    branches: [ main ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest      # 云端跑在 Ubuntu 上
    steps:
      - uses: actions/checkout@v4     # 拉代码(现成动作)
      - uses: actions/setup-java@v4   # 装 JDK
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: mvn -B test             # 跑测试
      - run: echo "构建完成 ✅"` },
          { type: 'table', head: ['概念', '含义'],
            rows: [
              ['Workflow 工作流', '一个 YAML 文件定义的一套自动化流程'],
              ['Event 触发器', 'push / pull_request / schedule / 手动 workflow_dispatch'],
              ['Job 任务', '一组步骤,默认并行,可依赖排序(needs)'],
              ['Step 步骤', '具体动作:uses 引用现成 Action,run 执行命令'],
              ['Runner 执行器', 'GitHub 免费提供的虚拟机(public 仓库免费额度充足)'],
            ] },
          { type: 'points', title: '新手最实用的三个场景', items: [
            '<b>跑测试</b>:每个 PR 自动跑测试,红叉禁止合并——质量护栏。',
            '<b>自动部署 Pages</b>:文档站提交即发布。',
            '<b>定时任务</b>:<code class="ic">schedule + cron</code> 定时爬数据、发报告。',
          ] }
        ]
      },
      {
        id: 'gh-protect', title: '团队协作护栏', stage: 3,
        desc: '分支保护与代码归属',
        blocks: [
          { type: 'points', title: '分支保护规则(Branch Protection)', items: [
            'Settings → Branches → 给 main 加规则:<b>禁止直接 push</b>,必须走 PR。',
            '<b>必需状态检查</b>:CI 不绿不许合并;可以要求 "branch up to date"(先同步主线)。',
            '<b>必需评审</b>(Require approvals):至少 1~2 人批准才能合并,配合 <b>CODEOWNERS</b> 自动指派负责人。',
            '禁止强推(force push)与删除分支——保护公共历史。',
          ] },
          { type: 'code', lang: 'YAML', title: 'CODEOWNERS:改动自动请对应负责人评审', code: `# CODEOWNERS(放仓库根目录或 .github/ 下)
# 格式:规则路径 @拥有者
*.java        @backend-team @zhangsan
/docs/        @tech-writers
*.md          @maintainers
# 命中路径的 PR 自动把拥有者加为必需评审人` },
          { type: 'note', html: '<b>协作礼仪速记</b>:不 force push 公共分支、不在别人的 PR 下吵技术(拿代码说话)、Issue 先搜再提、README 写清楚别人怎么跑起来你的项目。' }
        ]
      }
    ]
  },

  {
    id: 'gh-ch6', title: '个人品牌与开源参与', icon: '🚀', stage: 4,
    desc: '让 GitHub 成为你的技术简历。',
    sections: [
      {
        id: 'gh-profile', title: '个人主页与 Profile README', stage: 3,
        desc: '三秒第一印象',
        blocks: [
          { type: 'code', lang: 'MD', title: 'Profile README:主页自动展示的自我介绍', code: `# 操作:建一个与用户名同名的仓库 用户名/用户名,勾选 Public + Add README
# 仓库根的 README.md 会展示在你的个人主页上

# 内容建议结构:
## 👋 你是谁(一句话定位:后端开发 / 大三学生 / 开源爱好者)
## 🛠 技术栈(语言/框架/工具)
## 🔥 正在做(GitHub Stats 统计卡片,用现成 Action 生成)
## 📌 置顶仓库(Pinned:把最能打的项目钉在主页,最多 6 个)` },
          { type: 'points', title: '让主页加分的细节', items: [
            '头像清晰、昵称专业(别用 xx_杀马特_007);Bio 一句话说明方向。',
            '<b>置顶仓库</b>精而不多:2~4 个有完整 README、能跑、有截图/演示链接的项目。',
            '持续的小绿格子 > 突击刷绿:招聘方看的是<b>真实且持续</b>的提交。',
            'README 里放上线地址/演示 GIF/技术选型说明,比一堆代码更能打动人。',
          ] }
        ]
      },
      {
        id: 'gh-open-source', title: '参与开源的正确姿势', stage: 3,
        desc: '从 Good First Issue 到贡献者名单',
        blocks: [
          { type: 'code', lang: 'Text', title: '新手贡献路线图', code: `第 0 步:选项目——用你每天都在用的工具(文档、框架、库)
第 1 步:从小事入手
   · 搜 label:good first issue / help wanted / documentation
   · 修文档错别字、补示例、翻译,同样是正经贡献
第 2 步:认真读 CONTRIBUTING.md(每个项目的贡献指南)
第 3 步:开 Issue 说明意图 → 得到维护者回应再动手(避免白干)
第 4 步:Fork → 分支开发 → 小步提交 → 发 PR
第 5 步:耐心响应评审;被要求修改是常态,不是否定
第 6 步:合并!你的头像进入 Contributors 名单 🎉` },
          { type: 'points', title: '开源礼仪', items: [
            'PR 小而聚焦:一个 PR 修一个问题;风格遵循项目现有约定(缩进、命名、注释语言)。',
            '提问/求助前先读文档与历史 Issue;问得具体,附上你已尝试的方案。',
            '尊重维护者的时间:他们大多是志愿者,善意与耐心是唯一通行证。',
          ] },
          { type: 'tip', html: '<b>为什么值得参与开源</b>:真实工程的代码评审(比任何课程都接近生产)、可见的公开履历、全球范围的技术社交——很多实习生 offer 就来自一次高质量 PR。从今天改文档错别字开始 🌱。' }
        ]
      }
    ]
  }
]);
