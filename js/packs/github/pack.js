/* ============ GitHub 学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'github',
  meta: {
    title: 'GitHub 学习中心 — Git 与开源协作知识体系',
    name: 'GitHub 学习中心',
    icon: '🐙',
    sub: '版本控制与开源协作之道',
    tag: 'GIT & GITHUB · 协作之道',
    heroTitle: 'Git 与 GitHub 知识体系',
    heroBody: '从版本控制概念、Git 三区模型、分支合并,到 Pull Request 协作、Actions 自动化与开源参与。',
    heroTail: '每个知识点都配有命令示例、避坑要点与随堂小测,求职协作两相宜。',
    footerTip: '建议边学边在本机安装 Git 实操——命令敲过一遍才算真的学会',
    searchHint: '搜索知识点,如:分支、合并冲突、PR、Actions…',
    typeWords: ['版本控制', '三区模型', '分支与合并', 'Pull Request', 'GitHub Actions', '开源协作']
  },
  stages: [
    { name: '第一阶段 · 初识 Git', desc: '概念、安装配置与仓库基础' },
    { name: '第二阶段 · 核心操作', desc: '三区、提交、撤销与分支合并' },
    { name: '第三阶段 · GitHub 协作', desc: '远程仓库、PR 与 Issue' },
    { name: '第四阶段 · 进阶与实战', desc: 'Pages、Actions、护栏与开源参与' }
  ],
  files: [
    'part1.js', 'part2.js', 'part3.js',
    'quiz.js', 'glossary.js'
  ]
};
window.SITE_PACK_ID = window.PACK_MANIFEST.id;
window.SITE_META = window.PACK_MANIFEST.meta;
window.SITE_STAGES = window.PACK_MANIFEST.stages;

/* 按清单顺序加载本包数据文件,最后加载共享应用逻辑 */
(function () {
  var m = window.PACK_MANIFEST, v = window.__PACK_VER || '';
  m.files.forEach(function (f) {
    document.write('<script src="js/packs/' + m.id + '/' + f + v + '"><\/script>');
  });
  document.write('<script src="js/app.js' + v + '"><\/script>');
})();
