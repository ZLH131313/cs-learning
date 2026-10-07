/* ============ GitHub 中心 · 第 3-4 章:分支合并 + 远程协作 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'gh-ch3', title: '分支与合并', icon: '🌿', stage: 2,
    desc: 'Git 的杀手锏:平行宇宙般的分支,以及合并时的冲突处理。',
    sections: [
      {
        id: 'gh-branch', title: '分支的创建与切换', stage: 2,
        desc: '一条分支只是一个可移动的指针',
        blocks: [
          { type: 'text', html: `<p><strong>分支</strong>就是指向某个提交的<strong>可移动指针</strong>。默认分支通常叫 <code class="ic">main</code>(旧称 master)。创建分支几乎零成本——只是多一个 41 字节的指针文件,这就是 Git 分支相比 SVN 的降维优势。</p>` },
          { type: 'code', lang: 'Text', title: '分支与 HEAD 的关系', code: `          main
           │
A ── B ── C          HEAD → main(当前在 main 分支)
           ▲
           └── 新建 dev:dev 也指向 C

git switch -c dev 之后:
          main
           │
A ── B ── C ── D      HEAD → dev(dev 前进到 D)
               ▲
              dev` },
          { type: 'code', lang: 'Bash', title: '分支日常命令', code: `git branch                    # 列出本地分支(* 号是当前分支)
git switch -c login-page      # 创建并切换到新分支(推荐新语法)
git switch main               # 切回 main
git branch -d login-page      # 删除已合并的分支
git branch -D login-page      # 强制删除(未合并也删)
git merge login-page          # 把 login-page 合并进当前分支
git log --oneline --graph     # 看分支合并图` },
          { type: 'points', title: '为什么要用分支', items: [
            '主线(main)永远保持<b>可发布</b>状态,实验性开发在分支上进行,搞砸了直接删掉。',
            '多人/多任务并行:一人一个分支互不干扰,完成后再合并。',
            '分支命名表意:<code class="ic">feature/登录页</code>、<code class="ic">fix/按钮错位</code>、<code class="ic">hotfix/支付超时</code>。',
          ] }
        ]
      },
      {
        id: 'gh-merge', title: '合并与冲突解决', stage: 2,
        desc: '快进合并、三方合并与手解冲突',
        blocks: [
          { type: 'text', html: `<p>合并两种情形:<strong>快进合并(Fast-forward)</strong>——目标分支没有新提交,指针直接前移,无冲突;<strong>三方合并</strong>——两分支各有新提交,Git 找共同祖先做三方比较,若改了<b>同一处</b>就产生<strong>冲突</strong>,需要人工裁决。</p>` },
          { type: 'code', lang: 'Text', title: '冲突长什么样', code: `<<<<<<< HEAD
这是你当前分支的代码
=======
这是被合并进来的另一分支的代码
>>>>>>> feature/login

# 三步解决:① 选对内容(留一版或融合两版,删掉 <<<<<<< ======= >>>>>>> 标记)
#          ② git add 该文件(标记冲突已解决)
#          ③ git commit 完成合并
git merge --abort    # 反悔:放弃本次合并回到合并前` },
          { type: 'points', title: '减少冲突的团队约定', items: [
            '勤拉勤推:小步提交、频繁 merge/rebase 主线,冲突越早暴露越小。',
            '自动化格式化(Prettier 等)统一风格,避免"格式之争"造成的假冲突。',
            '冲突文件很多、无从下手时——<code class="ic">git merge --abort</code> 退出,先沟通再合。',
          ] },
          { type: 'note', html: '<b>merge vs rebase</b>:merge 保留分叉历史(真实但图乱);rebase 把提交"搬到"目标分支之后,历史成一条直线(干净但改写了提交)。团队协作有一条黄金律:<b>对已推送的公共分支不要 rebase</b>。' }
        ]
      },
      {
        id: 'gh-branch-strategy', title: '分支策略', stage: 2,
        desc: 'GitHub Flow 与 Git Flow',
        blocks: [
          { type: 'table', head: ['策略', '分支模型', '适用'],
            rows: [
              ['<b>GitHub Flow</b>(推荐)', 'main + 短命特性分支,PR 合并后立即部署', 'Web 产品、持续部署团队,简单够用'],
              ['Git Flow', 'main/develop/feature/release/hotfix 五类分支', '有版本发布周期的传统软件(客户端、固件)'],
              ['Trunk Based', '人人直接提交 main,配合特性开关', '高成熟度工程文化的团队'],
            ] },
          { type: 'code', lang: 'Text', title: 'GitHub Flow 五步', code: `1. main 分支保持随时可部署
2. 新工作开分支:git switch -c feature/xxx
3. 小步提交、频繁推送到远程同名分支
4. 开 Pull Request,评审讨论、跑 CI
5. 审核通过 → 合并回 main → 立即部署 → 删除特性分支` },
          { type: 'warn', html: '<b>新人建议</b>:从 GitHub Flow 起步。策略服务于团队,不是越复杂越好——能支撑"主线常绿、随时可发布"的就是好策略。' }
        ]
      }
    ]
  },

  {
    id: 'gh-ch4', title: '远程协作与 GitHub 核心', icon: '🐙', stage: 3,
    desc: 'push/pull 之外的真正主角:Pull Request 工作流与 Issue。',
    sections: [
      {
        id: 'gh-remote', title: '远程仓库:push / pull / fetch', stage: 2,
        desc: '本地与云端交换修改',
        blocks: [
          { type: 'code', lang: 'Text', title: '本地与远程的关系', code: `本地仓库 ──git push──► 远程仓库(GitHub)
本地仓库 ◄──git fetch── 只下载,不合并(远程跟踪分支 origin/main)
本地仓库 ◄──git pull─── fetch + merge 一步到位

# 本地引用远程分支的形式:origin/分支名(远程跟踪分支,只读)
# 工作区里手上的分支(可写)` },
          { type: 'code', lang: 'Bash', title: '远程日常', code: `git remote -v                          # 查看远程地址(origin 是约定俗成的名字)
git push origin main                   # 推送本地 main 到远程
git push -u origin login               # 首推并建立跟踪(-u 之后直接 git push)
git pull origin main                   # 拉取并合并
git fetch --all                        # 只同步远程信息,不动本地分支

git branch -vv                         # 查看分支的跟踪关系` },
          { type: 'points', title: '高频场景', items: [
            '<b>push 被拒绝(Non-fast-forward)</b>:远程有你没有的新提交 → 先 <code class="ic">git pull --rebase</code> 再 push。',
            '<b>团队同步</b>:上班第一件事 pull,下班 push 前再 pull 一次,减少冲突。',
            'HTTPS 与 SSH 两种地址:HTTPS 每次要令牌,SSH 配一次终身爽(见第 1 章配置)。',
          ] }
        ]
      },
      {
        id: 'gh-pr', title: 'Pull Request 工作流', stage: 2,
        desc: 'GitHub 协作的核心仪式',
        blocks: [
          { type: 'text', html: `<p><strong>Pull Request(PR)</strong>="请求目标仓库拉取我的分支"。它把"合并代码"变成一次<b>公开的评审流程</b>:展示改动、讨论代码、跑自动化检查,通过后才合入主线——是开源与世界级团队的标准协作方式。</p>` },
          { type: 'code', lang: 'Text', title: '一次完整 PR(同仓库团队协作)', code: `1. 从 main 拉出特性分支并在其上提交
2. push 分支到远程
3. GitHub 页面点 "Compare & pull request"
4. 填标题/说明(改了什么、为什么、怎么验证)
5. 队友 Review:逐行评论 → 修改再 push(PR 自动更新)
6. CI 检查全绿 + 审批(Approve)→ Merge
7. 合并后删除特性分支` },
          { type: 'code', lang: 'Text', title: '给别人的开源项目贡献(Fork 模式)', code: `1. Fork 原仓库到自己账号(得到 your-name/项目 的副本)
2. clone 你的副本到本地,开分支写代码
3. push 到你的副本
4. 向原仓库发 PR(跨仓库 Pull Request)
5. 维护者评审合并 —— 你的 GitHub 头像进入项目贡献者名单

# 日常同步原仓库的最新改动:
git remote add upstream 原仓库地址
git fetch upstream && git merge upstream/main` },
          { type: 'points', title: 'PR 写作要点', items: [
            '标题即摘要;说明里讲清<b>动机</b>与<b>验证方式</b>(截图/复现步骤)。',
            '一个 PR 只做一件事——大而全的 PR 会被要求拆分。',
            '评审意见回复后继续 push 即可,PR 会自动带上新提交;不必关掉重发。',
          ] }
        ]
      },
      {
        id: 'gh-issues', title: 'Issue 与项目管理', stage: 2,
        desc: 'Bug 与想法的户籍系统',
        blocks: [
          { type: 'text', html: `<p><strong>Issue</strong> 是仓库的"事项追踪":bug 报告、功能建议、提问讨论都开 Issue,编号终身唯一(#1、#2…),可与提交、PR 互相引用联动。</p>` },
          { type: 'code', lang: 'MD', title: '联动语法(Markdown)', code: `在提交说明里写:  Fixes #12       → 合并该提交时自动关闭 Issue 12
在提交说明里写:  Refs #12        → 仅关联,不关闭
PR 描述里写:     Closes #12      → 合并 PR 时自动关闭

提交里可用关键词:close / closes / closed、fix / fixes / fixed、
                resolve / resolves / resolved` },
          { type: 'points', title: '用好 Issue 的姿势', items: [
            '<b>Labels 标签</b>:bug / enhancement / good first issue / help wanted——开源项目找任务的地图。',
            '<b>Milestones 里程碑</b>与 GitHub Projects 看板:把 Issue 组织成版本计划与任务流。',
            '提 Issue 前先搜索是否重复;报 bug 附<b>复现步骤、环境、期望/实际结果</b>,是基本礼仪。',
            '<code class="ic">@mention</code> 提及他人、<code class="ic">/assign</code> 认领任务。',
          ] }
        ]
      }
    ]
  }
]);
