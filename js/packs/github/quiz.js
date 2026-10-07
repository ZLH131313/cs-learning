/* ============ GitHub 中心 · 随堂小测题库(按小节 id 组织) ============ */
window.QUIZ_BANK = {

  'gh-overview': [
    { q: 'Git 与 GitHub 的关系,正确说法是?',
      options: ['同一个东西的两个名字', 'Git 是版本控制工具,GitHub 是托管仓库的云端协作平台', 'GitHub 是工具,Git 是平台', '都是微软开发的同一产品'],
      answer: 1,
      explain: 'Git 是本地运行的版本控制系统(引擎),GitHub 是托管 Git 仓库的云端平台(社交协作层);同类平台还有 GitLab、Gitee。' },
    { q: 'Git 属于哪类版本控制系统?',
      options: ['集中式(如 SVN)', '分布式,每个开发者本地拥有完整历史', '本地单机版', '云端在线版'],
      answer: 1,
      explain: '分布式:clone 后整个仓库历史都在本地,提交/分支/日志离线全可用;中央服务器只是交换修改的集散地。' },
    { q: '以下哪项不是 Git 的特点?',
      options: ['分支创建几乎零成本', '完全离线也能提交与查看历史', '必须联网才能 commit', '每次提交都有全局唯一哈希'],
      answer: 2,
      explain: 'commit 完全在本地进行,联网只在 push/pull 时需要——这是分布式版本控制的核心优势。' }
  ],
  'gh-setup': [
    { q: '配置提交署名的正确命令是?',
      options: ['git set user.name "张三"', 'git config --global user.name "张三"', 'git commit --name "张三"', 'git sign 张三'],
      answer: 1,
      explain: 'git config --global user.name/user.email 全局配置身份;--global 一次配置对本机所有仓库生效。' },
    { q: '配置 SSH Key 的主要目的是?',
      options: ['加速 clone', '推送代码时免密认证', '让提交变绿', '获取 GitHub 会员'],
      answer: 1,
      explain: '把公钥贴到 GitHub 后,ssh 方式的 push/pull 免去每次输密码/令牌;顺便注意提交邮箱与账号一致才会计入贡献图。' }
  ],
  'gh-repo-basics': [
    { q: 'Git 仓库的"历史与配置"实际存放在?',
      options: ['README.md', '项目根目录的 .git 隐藏目录', 'GitHub 服务器上,本地没有', '.gitignore 文件'],
      answer: 1,
      explain: '.git 目录就是本地版本库,保存全部历史;删掉它历史即消失(工作区文件仍在)。' },
    { q: '迷路时最应该先敲的命令是?',
      options: ['git push', 'git status', 'git commit', 'git clone'],
      answer: 1,
      explain: 'git status 展示当前分支、改动文件、暂存状态——90% 的"我刚才干了什么"都能由它回答。' }
  ],
  'gh-three-areas': [
    { q: 'git add 的作用是把文件从哪里移到哪里?',
      options: ['版本库 → 工作区', '工作区 → 暂存区', '暂存区 → 版本库', '远程 → 本地'],
      answer: 1,
      explain: 'add 把工作区的改动放入暂存区(下一次提交的快照);暂存区 → 版本库由 commit 完成。' },
    { q: '设置"暂存区"的主要意义是?',
      options: ['提高运行速度', '挑选并组合出一次有意义的提交内容', '备份文件', '同步远程'],
      answer: 1,
      explain: '暂存区让你从一堆改动中挑出相关部分组成一个语义完整的提交;git add -p 甚至可按代码块挑选。' },
    { q: 'git commit 提交的是哪个区域的内容?',
      options: ['工作区', '暂存区', '远程仓库', '全部改动'],
      answer: 1,
      explain: 'commit 只打包暂存区快照——"改了却没提交上"多半是忘了 add。' }
  ],
  'gh-commit': [
    { q: '已跟踪文件"改动+提交"一步完成的命令是?',
      options: ['git commit -m "x"', 'git commit -am "x"', 'git add -m "x"', 'git push -am "x"'],
      answer: 1,
      explain: '-a 自动暂存已跟踪文件的修改再提交;对新建(untracked)文件无效,新文件仍需先 add。' },
    { q: '查看"将要提交的内容"(暂存区与最近提交的差异)用?',
      options: ['git diff', 'git diff --staged', 'git log', 'git status'],
      answer: 1,
      explain: 'git diff 看工作区 vs 暂存区;--staged(或 --cached)看暂存区 vs 最近一次提交。' }
  ],
  'gh-undo': [
    { q: '放弃工作区某文件未暂存的修改(找不回)用?',
      options: ['git restore 文件', 'git commit 文件', 'git push 文件', 'git stash pop'],
      answer: 0,
      explain: 'git restore 让文件回到最近暂存/提交的样子,未暂存的修改将丢失——下手前想清楚。' },
    { q: '对已推送到远程的提交,安全的回退方式是?',
      options: ['git reset --hard', 'git revert', 'git push -f', '删除仓库重建'],
      answer: 1,
      explain: 'revert 生成一个"反向提交"抵消目标提交,不改写历史,协作者安全;reset/强推会改写公共历史,是大忌。' },
    { q: 'git reset --hard 的风险是?',
      options: ['只是撤销暂存', '暂存区与工作区的未提交修改全部丢失', '只删除日志', '无风险'],
      answer: 1,
      explain: '--hard 连工作区一起清空;--soft 只挪 HEAD、--mixed 额外清暂存区,两者都保留工作区修改。' }
  ],

  'gh-branch': [
    { q: 'Git 分支的本质是?',
      options: ['一份文件的完整拷贝', '指向某个提交的可移动指针', '一个单独的仓库', '一个压缩包'],
      answer: 1,
      explain: '分支只是指向提交的指针,新建分支几乎零成本——这是 Git 相对 SVN 的降维优势。' },
    { q: '创建并切换到新分支 feature/x 的推荐命令是?',
      options: ['git branch feature/x', 'git switch -c feature/x', 'git merge feature/x', 'git clone feature/x'],
      answer: 1,
      explain: 'switch -c 创建并一步切换(新语法);旧写法 git checkout -b 等价。' }
  ],
  'gh-merge': [
    { q: '产生合并冲突的原因是?',
      options: ['网络断开', '两个分支修改了同一处代码', '分支名字相同', '没有配置邮箱'],
      answer: 1,
      explain: '三方合并发现双方对同一位置有不同修改时,Git 无法裁决,标记 <<<<<<< ======= >>>>>>> 交人工解决。' },
    { q: '解决冲突后的正确收尾是?',
      options: ['直接 commit 另一个分支', 'git add 标记已解决后 git commit 完成合并', '删除 .git 目录', '重新 clone'],
      answer: 1,
      explain: '编辑文件保留正确内容并删掉标记 → add 标记解决 → commit 完成合并;反悔可 git merge --abort。' },
    { q: '关于 rebase 的黄金律是?',
      options: ['永远优先 rebase 而不是 merge', '不要对已推送的公共分支 rebase', 'rebase 会自动解决冲突', 'rebase 比 merge 更安全'],
      answer: 1,
      explain: 'rebase 改写提交历史,对公共分支使用会让协作者的历史错乱;公开历史用 merge/revert 保平安。' }
  ],
  'gh-branch-strategy': [
    { q: 'GitHub Flow 的核心思想是?',
      options: ['五类分支严格分层', 'main 常绿可部署 + 短命特性分支走 PR 合并', '所有人直接提交 main', '只使用 tag 发布'],
      answer: 1,
      explain: 'GitHub Flow:main 随时可部署,新工作开分支、PR 评审、合并即部署——简单,适合持续交付的 Web 团队。' }
  ],
  'gh-remote': [
    { q: 'git pull 与 git fetch 的区别是?',
      options: ['没有区别', 'fetch 只下载远程更新不动本地分支,pull = fetch + merge', 'pull 只下载不合并', 'fetch 会覆盖本地文件'],
      answer: 1,
      explain: 'fetch 仅更新远程跟踪分支(origin/main),想看看发生了什么再决定;pull 直接合并进当前分支。' },
    { q: 'push 被拒绝(Non-fast-forward),通常的解决顺序是?',
      options: ['git push -f 强推', '先 git pull --rebase 再 push', '删掉远程仓库', '重新 init'],
      answer: 1,
      explain: '远程有本地没有的新提交,先拉取变基到最新再推;强推会覆盖他人提交,公共分支严禁。' }
  ],
  'gh-pr': [
    { q: 'Pull Request 的本质是?',
      options: ['把别人的仓库下载下来', '请求目标仓库拉取并评审我的分支改动', '一种推送命令', '提 bug 的工单'],
      answer: 1,
      explain: 'PR 把"合并"变成公开评审流程:展示 diff、讨论、跑 CI、批准后合入——GitHub 协作的核心。' },
    { q: '向不属于自己的开源项目贡献代码,第一步通常是?',
      options: ['直接 push 到对方 main', 'Fork 仓库到自己账号', '给维护者发邮件要权限', 'clone 后不再上传'],
      answer: 1,
      explain: 'Fork 得到自己的副本 → 分支开发 → push 到副本 → 向原仓库发跨仓库 PR;用 upstream 远程同步原仓库更新。' },
    { q: 'PR 开出后又 push 了新提交到同一分支,会发生什么?',
      options: ['PR 自动关闭', 'PR 自动包含新提交', '需要重新开 PR', '新提交丢失'],
      answer: 1,
      explain: 'PR 跟踪的是分支,后续 push 自动出现在 PR 里——评审修改的迭代就是不断 push。' }
  ],
  'gh-issues': [
    { q: '提交说明里写 "Fixes #12" 的效果是?',
      options: ['只是注释,无作用', '该提交合并进默认分支时自动关闭 Issue #12', '给 Issue 加星', '把 Issue 转成 PR'],
      answer: 1,
      explain: 'close/fix/resolve + 编号 是自动关闭 Issue 的关键词;Refs #12 则只关联不关闭。' },
    { q: '想找开源项目里适合新手的任务,应搜索的标签是?',
      options: ['wontfix', 'good first issue', 'duplicate', 'invalid'],
      answer: 1,
      explain: 'good first issue / help wanted 是项目维护者标记的入门友好任务,是参与开源的标准入口。' }
  ],

  'gh-pages': [
    { q: '个人主站(用户名.github.io)要求仓库名为?',
      options: ['任意名字', '与用户名同名:用户名.github.io', 'index', 'homepage'],
      answer: 1,
      explain: '用户名.github.io 是特殊的个人主页仓库,访问根域名;项目仓库则是 用户名.github.io/仓库名。' },
    { q: 'GitHub Pages 能托管的内容类型是?',
      options: ['任意动态网站(含后端)', '仅静态内容(HTML/CSS/JS)', '仅 Markdown', '仅图片'],
      answer: 1,
      explain: 'Pages 只提供静态托管;需要后端逻辑请用 Cloudflare Workers、Vercel Functions 等补充。' }
  ],
  'gh-actions': [
    { q: 'GitHub Actions 中 "on: push" 的含义是?',
      options: ['运行在本地', '工作流的触发条件是 push 事件', '打开电源', '强制推送'],
      answer: 1,
      explain: 'on 定义触发器:push / pull_request / schedule(定时)/ workflow_dispatch(手动)。' },
    { q: 'workflow 文件应放在仓库的哪个位置?',
      options: ['根目录', '.github/workflows/ 目录下的 .yml 文件', 'docs/ 目录', '任意位置'],
      answer: 1,
      explain: '.github/workflows/xxx.yml 是 Actions 的固定约定路径,文件即工作流。' },
    { q: 'steps 中 uses 与 run 的区别是?',
      options: ['完全相同', 'uses 引用现成的 Action,run 执行自定义命令', 'uses 执行命令,run 引用动作', 'run 只能跑 Java'],
      answer: 1,
      explain: 'uses: actions/checkout@v4 复用社区动作;run: mvn test 直接执行 shell 命令。' }
  ],
  'gh-protect': [
    { q: '分支保护规则的主要目的是?',
      options: ['加密代码', '让 main 只能通过评审+CI 的 PR 合并,禁止直推', '提高网速', '防止 fork'],
      answer: 1,
      explain: '保护规则(必需评审、必需状态检查、禁强推)是团队协作的质量护栏,在 Settings → Branches 配置。' },
    { q: 'CODEOWNERS 文件的作用是?',
      options: ['声明版权协议', '按路径自动把对应负责人加为 PR 必需评审人', '加密目录', '统计代码行数'],
      answer: 1,
      explain: '命中路径的改动会自动请 owning 团队评审,让"谁懂的代码谁把关"制度化。' }
  ],
  'gh-profile': [
    { q: '让个人主页展示自我介绍(Profile README)的方法是?',
      options: ['付费开通', '创建与用户名同名的公开仓库并写 README.md', '修改个人 Bio', '发一条 Issue'],
      answer: 1,
      explain: '用户名/用户名 仓库的 README 会渲染在主页顶部;配合置顶仓库与统计卡片打造技术名片。' },
    { q: '招聘视角看 GitHub 主页,最有分量的是?',
      options: ['绿格子越多越好(刷出来的也行)', '少量真实持续、README 完整可运行的项目', '关注人数', '注册时间早'],
      answer: 1,
      explain: '真实持续的提交 + 能跑起来、有说明、有演示的项目,远比突击刷绿有说服力。' }
  ],
  'gh-open-source': [
    { q: '给开源项目提交 PR 前的推荐流程是?',
      options: ['直接改完就发 PR', '先读 CONTRIBUTING.md、开 Issue 沟通意图,得到回应再动手', '先 push 到对方 main', '给维护者打钱'],
      answer: 1,
      explain: '先沟通避免方向不一致白干;CONTRIBUTING.md 是每个项目的贡献指南,必读。' },
    { q: 'PR 被维护者要求修改时,正确心态与做法是?',
      options: ['关掉 PR 走人', '在原分支继续修改并 push,礼貌响应评审意见', '与维护者辩论到底', '重开 100 个 PR'],
      answer: 1,
      explain: '评审意见是开源协作的日常,不是否定;在原分支迭代 push 即可,PR 会自动更新。' }
  ]
};
