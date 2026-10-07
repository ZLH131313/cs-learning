/* ============ 计组学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'co',
  meta: {
    title: '计组学习中心 — 计算机组成原理知识体系',
    name: '计组学习中心',
    icon: '🖥️',
    sub: '看懂计算机的底层世界',
    tag: 'COMPUTER ORGANIZATION · 由表及里',
    heroTitle: '计算机组成原理知识体系',
    heroBody: '从数据的表示与运算,到存储层次、指令系统、CPU 流水线,再到总线与输入输出。',
    heroTail: '每个知识点都配有图解、要点总结与随堂小测,为考研 408 与技术面试打底。',
    footerTip: '配合《计算机组成原理》教材(唐朔飞 / 袁春风版)学习效果更佳',
    searchHint: '搜索知识点,如:补码、Cache、流水线、DMA…',
    typeWords: ['冯·诺依曼结构', '补码与浮点数', 'Cache 映射', '指令流水线', '中断与 DMA', '408 高频考点']
  },
  stages: [
    { name: '第一阶段 · 系统概述与数据表示', desc: '认识整机,掌握数据的机器表示' },
    { name: '第二阶段 · 存储与指令', desc: '存储层次、Cache 与指令系统' },
    { name: '第三阶段 · CPU 与流水线', desc: '控制器、数据通路、指令流水' },
    { name: '第四阶段 · 总线与输入输出', desc: '总线、中断与 DMA' }
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
