/* ============ 计算机专业英语学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'cse',
  meta: {
    title: '专业英语学习中心 — 计算机英语知识体系',
    name: '专业英语学习中心',
    icon: '📖',
    sub: '读懂文档、报错与论文',
    tag: 'CS ENGLISH · 计算机专业英语',
    heroTitle: '计算机专业英语知识体系',
    heroBody: '从前缀词根构词法与分类词汇,到科技英语长难句、官方文档与报错阅读,再到写作、论文与面试实战。',
    heroTail: '每个知识点都配有真实语料、高频词表与随堂小测,把英语变成生产力工具。',
    footerTip: '每天读 5 分钟英文官方文档(Spring/MDN),半年后你会回来谢自己',
    searchHint: '搜索知识点,如:构词法、被动语态、deprecated、摘要句式…',
    typeWords: ['前缀与词根', '硬件软件词汇', '长难句拆解', '读报错堆栈', '论文摘要', '英文面试']
  },
  stages: [
    { name: '第一阶段 · 词汇基石', desc: '构词法与硬件软件分类词汇' },
    { name: '第二阶段 · 阅读能力', desc: '语法三板斧、文档与报错' },
    { name: '第三阶段 · 场景实战', desc: '命名与写作、论文、面试' }
  ],
  files: [
    'part1.js', 'part2.js',
    'quiz.js', 'glossary.js'
  ]
};
window.SITE_PACK_ID = window.PACK_MANIFEST.id;
window.SITE_META = window.PACK_MANIFEST.meta;
window.SITE_STAGES = window.PACK_MANIFEST.stages;

(function () {
  var m = window.PACK_MANIFEST, v = window.__PACK_VER || '';
  m.files.forEach(function (f) {
    document.write('<script src="js/packs/' + m.id + '/' + f + v + '"><\/script>');
  });
  document.write('<script src="js/app.js' + v + '"><\/script>');
})();
