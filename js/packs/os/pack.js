/* ============ 操作系统学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'os',
  meta: {
    title: '操作系统学习中心 — 现代操作系统知识体系',
    name: '操作系统学习中心',
    icon: '🧮',
    sub: '看懂程序运行的舞台',
    tag: 'OPERATING SYSTEMS · 现代操作系统',
    heroTitle: '现代操作系统知识体系',
    heroBody: '从 OS 定位与系统调用,到进程调度、同步死锁、虚拟内存、文件系统与磁盘 IO。',
    heroTail: '每个知识点都配有图解、考点模板与随堂小测,考研 408 与面试双修。',
    footerTip: '配合《现代操作系统》(Tanenbaum)/《操作系统导论》(OSTEP)食用更佳',
    searchHint: '搜索知识点,如:进程、信号量、页面置换、银行家…',
    typeWords: ['进程与线程', '调度算法', '信号量与死锁', '虚拟内存', '页面置换', '文件系统']
  },
  stages: [
    { name: '第一阶段 · 初识 OS', desc: '定位、内核结构与系统调用' },
    { name: '第二阶段 · 进程世界', desc: '进程线程、调度、同步与死锁' },
    { name: '第三阶段 · 内存管理', desc: '地址空间、分页与虚拟内存' },
    { name: '第四阶段 · 文件与设备', desc: '文件系统、磁盘调度与 IO' }
  ],
  files: [
    'part1.js', 'part2.js', 'part3.js',
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
