/* ============ Java 学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'java',
  meta: {
    title: 'Java 学习中心 — 系统化 Java 知识体系',
    name: 'Java 学习中心',
    icon: '☕',
    sub: '从零到精通的知识体系',
    tag: 'JAVA · 从零到精通',
    heroTitle: 'Java 知识体系全景图',
    heroBody: '从语法基础、面向对象,到集合、多线程、JVM,再到 Spring 框架。',
    heroTail: '每个知识点都配有可运行的代码示例、避坑要点与随堂小测。',
    footerTip: '建议搭配 JDK 17 实操练习,代码看懂了更要敲出来',
    searchHint: '搜索知识点,如:多态、HashMap、线程…',
    typeWords: ['面向对象', '集合框架与泛型', '多线程并发', 'JVM 虚拟机', 'Spring 框架', '面试高频考点']
  },
  stages: [
    { name: '第一阶段 · 入门筑基', desc: '认识 Java,掌握语法地基' },
    { name: '第二阶段 · 面向对象', desc: 'Java 的思想精髓' },
    { name: '第三阶段 · 核心 API 与数据结构', desc: '字符串、集合、异常、泛型' },
    { name: '第四阶段 · 进阶必杀', desc: 'IO 流与多线程并发' },
    { name: '第五阶段 · 深入底层', desc: '反射、函数式、JVM 与路线' },
    { name: '第六阶段 · 主流框架', desc: 'Spring 核心:IoC、AOP、事务、MVC 与 Boot' }
  ],
  files: [
    'part1.js', 'part2.js', 'part3.js', 'part4.js', 'part5.js', 'part6.js',
    'quiz.js', 'demos.js', 'glossary.js'
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
