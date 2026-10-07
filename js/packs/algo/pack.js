/* ============ 算法学习中心 · 课程包清单 ============ */
window.PACK_MANIFEST = {
  id: 'algo',
  meta: {
    title: '算法学习中心 — 数据结构与算法知识体系',
    name: '算法学习中心',
    icon: '📐',
    sub: '刷题与思维的双修之路',
    tag: 'ALGORITHMS · 数据结构与算法',
    heroTitle: '数据结构与算法知识体系',
    heroBody: '从复杂度分析、双指针与二分,到链表栈哈希、树与图,再到排序、动态规划、贪心与回溯。',
    heroTail: '每个知识点都配有模板代码、识别信号与随堂小测,面向刷题与面试实战。',
    footerTip: '配合力扣(leetcode.cn)按标签刷题:学一节,刷 5 题,手感自然来',
    searchHint: '搜索知识点,如:滑动窗口、单调栈、背包、Dijkstra…',
    typeWords: ['大 O 复杂度', '双指针与二分', '链表与单调栈', 'BFS 与 Dijkstra', '动态规划五步法', '回溯与剪枝']
  },
  stages: [
    { name: '第一阶段 · 复杂度与数组', desc: '大 O、双指针、滑动窗口与二分' },
    { name: '第二阶段 · 线性结构', desc: '链表、栈队列、哈希与前缀和' },
    { name: '第三阶段 · 树与图', desc: '遍历、堆、BFS/DFS、最短路' },
    { name: '第四阶段 · 思想进阶', desc: '排序三巨头、DP、贪心与回溯' }
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
