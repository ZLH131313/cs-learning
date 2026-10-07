/* ============ GitHub 中心 · 第 1-2 章:初识 Git + 核心操作 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'gh-ch1', title: 'Git 与 GitHub 概述', icon: '🌱', stage: 1,
    desc: '为什么需要版本控制,Git 与 GitHub 各是什么,以及把环境搭起来。',
    sections: [
      {
        id: 'gh-overview', title: '版本控制与 Git/GitHub', stage: 1,
        desc: '两个名字,两件事',
        blocks: [
          { type: 'text', html: `<p><strong>版本控制</strong>解决一个古老问题:代码改乱了想退回去、多人同时改一份代码互相覆盖、"最终版_v2_真最终版.zip" 满天飞。<strong>Git</strong> 是目前最主流的<strong>分布式版本控制系统</strong>(2005 年 Linus Torvalds 为开发 Linux 内核而造);<strong>GitHub</strong> 则是托管 Git 仓库的<strong>云端平台+协作社区</strong>(2018 年被微软收购)。</p>` },
          { type: 'table', head: ['对比', 'Git', 'GitHub'],
            rows: [
              ['是什么', '版本控制工具(软件)', '托管仓库的平台(网站)'],
              ['运行在', '你的电脑本地', '云端'],
              ['离线可用', '完全可用(提交/分支/日志)', '需联网'],
              ['职责', '记录历史、管理分支、合并代码', '备份、协作、PR、Issue、CI/CD、开源社区'],
            ] },
          { type: 'points', title: 'Git 的分布式意味着什么', items: [
            '每个开发者本地都有<strong>完整的历史</strong>(整个仓库克隆到本地),提交、分支、查看日志全在本地完成,飞快。',
            '中央服务器(如 GitHub)只是"大家交换修改的集散地",挂了也不影响本地开发。',
            '同类对比:SVN 等集中式版本控制必须连服务器才能提交——这是 Git 胜出的关键。',
          ] },
          { type: 'note', html: '<b>一句话记住</b>:<b>Git 是引擎,GitHub 是社交平台</b>。会 Git 走遍天下,懂 GitHub 才能协作。国内可选 Gitee、GitLab 作为替代平台,概念完全相通。' }
        ]
      },
      {
        id: 'gh-setup', title: '安装与初始配置', stage: 1,
        desc: '三行 config + 一把 SSH 钥匙',
        blocks: [
          { type: 'text', html: `<p>从 <a href="https://git-scm.com" target="_blank">git-scm.com</a> 安装 Git(一路下一步),装完先用 <code class="ic">git --version</code> 验证。接着做一次性的全局身份配置——<strong>每次提交都会带上这个署名</strong>,它会永久写进历史。</p>` },
          { type: 'code', lang: 'Bash', title: '身份配置与常用查看命令', code: `git config --global user.name "你的名字"
git config --global user.email "you@example.com"

git config --global init.defaultBranch main        # 新仓库默认分支叫 main
git config --list                                  # 查看所有配置
git --version                                      # 版本` },
          { type: 'code', lang: 'Bash', title: '配置 SSH Key(免密推送)', code: `# 1. 生成密钥(一路回车)
ssh-keygen -t ed25519 -C "you@example.com"

# 2. 查看公钥并复制
cat ~/.ssh/id_ed25519.pub

# 3. 粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key

# 4. 测试连通
ssh -T git@github.com
# Hi xxx! You've successfully authenticated... 即成功` },
          { type: 'warn', html: '<b>高频坑</b>:邮箱要与你 GitHub 账号的邮箱一致(或已加入账号),否则提交不计入你的贡献绿格子;Windows 用户建议装 <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a> 自带的 Git Bash,命令与教程一致。' }
        ]
      },
      {
        id: 'gh-repo-basics', title: '仓库:创建与克隆', stage: 1,
        desc: '一切故事都发生在仓库里',
        blocks: [
          { type: 'text', html: `<p><strong>仓库(Repository)</strong>= 一个项目目录 + 它的全部修改历史。获取仓库只有两条路:把本地目录变成仓库(<code class="ic">init</code>),或从远方复制一份(<code class="ic">clone</code>)。</p>` },
          { type: 'code', lang: 'Bash', title: '创建与克隆', code: `# 方式一:把当前目录变成 Git 仓库(生成隐藏的 .git 目录)
git init
# GitHub 上新建仓库后,关联远程地址
git remote add origin git@github.com:user/repo.git
git push -u origin main

# 方式二:克隆已有仓库(历史一并到本地)
git clone git@github.com:user/repo.git
git clone git@github.com:user/repo.git mydir   # 指定目录名` },
          { type: 'points', title: '三个最常敲的查看命令', items: [
            '<code class="ic">git status</code>:当前哪些文件改了/新增了/待提交——<b>迷路时先敲它</b>。',
            '<code class="ic">git log --oneline --graph</code>:一行一条提交、图形化看分支。',
            '<code class="ic">git diff</code>:工作区里具体改了什么(对比暂存区)。',
          ] },
          { type: 'note', html: '<b>仓库的本质</b>:项目根目录下的 <code class="ic">.git</code> 隐藏目录就是"版本库",存着全部历史与配置——删掉它,历史即消失(但代码文件还在)。' }
        ]
      }
    ]
  },

  {
    id: 'gh-ch2', title: 'Git 核心操作', icon: '📝', stage: 1,
    desc: '三区模型、提交、查看历史与撤销——每天都在用的基本功。',
    sections: [
      {
        id: 'gh-three-areas', title: '三区模型(最重要的心智图)', stage: 1,
        desc: '工作区 → 暂存区 → 版本库',
        blocks: [
          { type: 'code', lang: 'Text', title: '文件的三种状态与流转', code: ` 工作区           暂存区            版本库(本地仓库)
(Working Dir)    (Stage/Index)     (Repository)
 你正在编辑         下一次提交        已永久记录的
  的文件             的快照            历史版本
     │  git add        │  git commit        │
     └────────────────►└───────────────────►│
     ◄─────────────────┼──── git reset ──────┘
        git restore    │  (撤销暂存/回退)
     ◄─────────────────┘

已跟踪文件的两种状态:
  Unmodified(干净)→ 编辑 → Modified(已修改)→ add → Staged(已暂存)
  Untracked(新文件,未跟踪)→ add 进入暂存` },
          { type: 'points', title: '为什么要有暂存区', items: [
            '让你<b>挑选</b>本次提交的内容:改了 5 个文件,只 add 其中 3 个,凑成一次完整的提交。',
            '提交应是"一个有意义的单元"(修一个 bug、加一个功能),而不是"一堆改动的大杂烩"。',
            '<code class="ic">git add -p</code> 甚至能按"代码块"挑着暂存,精细控制每一次提交。',
          ] },
          { type: 'warn', html: '<b>心智检查</b>:git commit 只提交<b>暂存区</b>里的内容——"我明明改了为什么没提交上?"九成是忘了 add。先 status 看一眼,永远不迷路。' }
        ]
      },
      {
        id: 'gh-commit', title: '提交与历史查看', stage: 1,
        desc: 'add / commit / log / diff 组合拳',
        blocks: [
          { type: 'code', lang: 'Bash', title: '日常提交流', code: `git status                     # 1. 看看改了什么
git add index.html             # 2. 暂存指定文件
git add .                      #    或暂存当前目录全部改动
git commit -m "修复登录页按钮错位"   # 3. 提交(带说明)

git commit -am "更新文档"        # 已跟踪文件的 改动+提交 一步完成
                               # (对新建文件无效,新文件仍需先 add)` },
          { type: 'points', title: '好的提交说明(协作礼仪)', items: [
            '一行说清"做了什么":<b>祈使句</b>——"修复…"、"添加…",而不是 "update" "fix" "111"。',
            '粒度适中:一次提交对应一个改动主题,方便日后回溯与回滚。',
            '<code class="ic">git log --oneline</code> 每条前的 7 位十六进制就是<b>提交哈希</b>(commit id),全局唯一。',
          ] },
          { type: 'code', lang: 'Bash', title: '历史与差异', code: `git log --oneline --graph --all    # 图形化查看全部分支历史
git log -3                         # 最近 3 条
git show a1b2c3d                   # 看某次提交的完整改动
git diff                           # 工作区 vs 暂存区(还没 add 的改动)
git diff --staged                  # 暂存区 vs 最近提交(将要提交的内容)` }
        ]
      },
      {
        id: 'gh-undo', title: '撤销与回退', stage: 1,
        desc: '改错了怎么办:restore / reset / revert',
        blocks: [
          { type: 'table', head: ['场景', '命令', '效果'],
            rows: [
              ['放弃工作区某文件的修改', 'git restore 文件', '回到最近 add/commit 的样子(找不回!)'],
              ['把暂存区的文件撤回工作区', 'git restore --staged 文件', '只是取消暂存,修改还在'],
              ['追加修补上一次提交', 'git commit --amend', '改说明/补文件,生成新哈希替代旧提交'],
              ['回退到某个提交(本地)', 'git reset --hard 哈希', '<b>之后的提交全部消失</b>(危险)'],
              ['回退已推送的提交', 'git revert 哈希', '生成一个"反向提交",历史安全'],
            ] },
          { type: 'points', title: 'reset 三种模式', items: [
            '<code class="ic">--soft</code>:只挪 HEAD,暂存区保留——"我只想重新提交一次"。',
            '<code class="ic">--mixed</code>(默认):挪 HEAD + 清暂存区——"重新挑选要提交的内容"。',
            '<code class="ic">--hard</code>:挪 HEAD + 清暂存区 + <b>清工作区</b>——彻底回到那个时刻,未提交修改全没了。',
          ] },
          { type: 'warn', html: '<b>两条铁律</b>:① 已推送到远程的提交,用 <code class="ic">revert</code> 回退,别用 reset(会改写公共历史,协作者会崩);② reset --hard 前先 <code class="ic">git stash</code> 或提交当前改动,手滑的代价是找不回。' }
        ]
      }
    ]
  }
]);
