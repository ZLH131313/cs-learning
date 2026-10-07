/* ============ 算法中心 · 第 4 章:排序与算法思想 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'algo-ch4', title: '排序与算法思想', icon: '🧩', stage: 4,
    desc: '归并与快排,以及动态规划、贪心、回溯三大思想。',
    sections: [
      {
        id: 'algo-sort', title: '进阶排序:归并、快排与堆排', stage: 4,
        desc: 'n log n 三巨头',
        blocks: [
          { type: 'table', head: ['算法', '平均', '最坏', '空间', '稳定'],
            rows: [
              ['归并排序', 'O(n log n)', 'O(n log n)', 'O(n)', '✔'],
              ['快速排序', 'O(n log n)', 'O(n²)(已有序+取首)', 'O(log n) 栈', '✘'],
              ['堆排序', 'O(n log n)', 'O(n log n)', 'O(1)', '✘'],
              ['桶/计数排序', 'O(n)', '看数据分布', 'O(k)', '✔'],
            ] },
          { type: 'code', lang: 'Java', title: '快排与归并的灵魂对照', code: `// 快排:选基准分区,小的去左大的去右(自顶向下)
void quick(int[] a, int l, int r) {
    if (l >= r) return;
    int p = partition(a, l, r);      // 基准落位,左右递归
    quick(a, l, p - 1); quick(a, p + 1, r);
}

// 归并:对半分,排好再合并(自底向上)
void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(a, l, mid); mergeSort(a, mid + 1, r);
    merge(a, l, mid, r);             // 双指针合并两个有序段
}
// 快排=先处理再分;归并=先分再处理
// 归并的 merge 是"数逆序对/统计跨越对"的天然载体(经典变形)` },
          { type: 'points', title: '工程视角', items: [
            '库排序都是混合策略(IntroSort/TimSort):小段插排、深处转堆排,防最坏。',
            '<b>稳定性</b>的意义:按多关键字排序时保序(先按分数排,再按班级稳定排,班级内分数序保留)。',
            '面试手写优先级:快排 partition(含三路去重)> 归并 merge > 堆的 sift。',
          ] }
        ]
      },
      {
        id: 'algo-dp', title: '动态规划:五步法', stage: 4,
        desc: '从爬楼梯到背包',
        blocks: [
          { type: 'code', lang: 'Text', title: '解题五步法(背下来)', code: `① 定义状态:dp[i] / dp[i][j] 的含义(最难也最关键)
② 状态转移方程:dp[i] 由哪些更小子状态推出
③ 初始化:边界 dp[0]… 是什么
④ 遍历顺序:保证算 dp[i] 时依赖已就绪
⑤ 答案在哪:dp[n] 或 max(dp[*])

例:爬楼梯(斐波那契)
  ① dp[i] = 爬到第 i 阶的方法数
  ② dp[i] = dp[i-1] + dp[i-2]      (最后一步跨 1 或 2 阶)
  ③ dp[0]=1, dp[1]=1
  ④ 从小到大        ⑤ dp[n]

例:0-1 背包(容量 C,物品 w/v)
  dp[j] = 容量 j 下的最大价值
  一维滚动:for 物品 i → for j=C..w(倒序防重复选!)
    dp[j] = max(dp[j], dp[j-w[i]] + v[i])` },
          { type: 'points', title: '识别与优化', items: [
            'DP 信号:<b>求最值/计数/存在性</b> + <b>可选 choices</b> + <b>重叠子问题</b>;贪心不成立时上 DP。',
            '两大模板:线性序列(打家劫舍/最长上升子序列)与区间/双串(LCS/编辑距离)。',
            '空间优化:二维压一维(滚动数组),注意遍历方向(0-1 背包倒序、完全背包正序)。',
            'DP ≈ 带备忘录的递归:先写记忆化搜索再转递推,思路更顺。',
          ] }
        ]
      },
      {
        id: 'algo-greedy-backtrack', title: '贪心与回溯', stage: 4,
        desc: '一个大胆,一个全面',
        blocks: [
          { type: 'code', lang: 'Java', title: '贪心:区间调度;回溯:全排列', code: `// 贪心:最多不重叠区间(按右端点排序,能选就选)
Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
int end = Integer.MIN_VALUE, count = 0;
for (int[] in : intervals) {
    if (in[0] >= end) { count++; end = in[1]; }   // 贪心:尽早结束
}
// 贪心成立需要"局部最优 ⇒ 全局最优"(可用交换论证说明)

// 回溯:全排列(做选择 → 递归 → 撤销选择)
void backtrack(int[] nums, List<Integer> path,
               boolean[] used, List<List<Integer>> res) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);      // 选择
        backtrack(nums, path, used, res);
        used[i] = false; path.remove(path.size() - 1);   // 撤销
    }
}` },
          { type: 'points', title: '分野与信号', items: [
            '<b>贪心</b>:每步取局部最优且不可反悔——区间问题、跳跃游戏、Huffman;证明不了就别贪。',
            '<b>回溯</b>:系统性穷举决策树 + 剪枝——排列/子集/N 皇后/解数独;复杂度天然指数级。',
            '选择困难时的顺序:暴力 → 贪心(可证)→ DP(有重叠子问题)→ 回溯(要所有解)。',
            '回溯三要素:路径、选择列表、结束条件;剪枝是性能生命线。',
          ] },
          { type: 'tip', html: '<b>学完本中心</b>:复杂度 → 双指针/二分 → 链表栈哈希 → 树图 → 排序/DP/回溯,主线已经闭环。接下来就是去力扣按标签刷:先把"双指针+哈希+二分"各刷 10 题练手感 🎯。' }
        ]
      }
    ]
  }
]);
