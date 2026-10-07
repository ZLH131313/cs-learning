/* ============ C++ 学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'cpp',
  meta: {
    title: 'C++ 学习中心 — 从 C 到现代 C++ 知识体系',
    name: 'C++ 学习中心',
    icon: '🔧',
    sub: '性能与抽象的平衡艺术',
    tag: 'C++ · 从 C 到现代 C++',
    heroTitle: 'C++ 知识体系全景图',
    heroBody: '从基础语法、类与对象、内存与智能指针,到继承多态、模板泛型、STL 与移动语义。',
    heroTail: '每个知识点都配有可编译的代码示例、避坑要点与随堂小测,并处处与 Java 对照。',
    footerTip: '建议本机装好 g++ 边学边敲:g++ -std=c++17 -Wall 是你的起手式',
    searchHint: '搜索知识点,如:虚函数、智能指针、深拷贝、lambda…',
    typeWords: ['引用与重载', '构造与析构', '智能指针', '虚函数多态', '模板与 STL', '移动语义']
  },
  stages: [
    { name: '第一阶段 · C++ 起步', desc: '语法、函数与引用' },
    { name: '第二阶段 · 类与内存', desc: '构造析构、拷贝控制、多态与模板' },
    { name: '第三阶段 · STL 与现代 C++', desc: '容器算法、lambda、移动与编译链接' }
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
