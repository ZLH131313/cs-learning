/* ============ 算法中心 · 第 1 章:复杂度与数组基础 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'algo-ch1', title: '复杂度与数组基础', icon: '📐', stage: 1,
    desc: '用大 O 度量算法,从双指针、滑动窗口到二分——刷题的起手式。',
    sections: [
      {
        id: 'algo-complexity', title: '时间与空间复杂度', stage: 1,
        desc: '大 O:算法的"度量衡"',
        blocks: [
          { type: 'text', html: `<p><strong>大 O 记号</strong>描述输入规模 n 增长时算法耗时的<strong>增长趋势</strong>,忽略常数与低阶项——它决定算法能否扛住大数据。面试开口先报复杂度,是基本素养。</p>` },
          { type: 'table', head: ['复杂度', '典型场景', 'n=10⁶ 时的量级'],
            rows: [
              ['O(1)', '哈希查找、数组下标访问', '1 步'],
              ['O(log n)', '二分查找、平衡树操作', '~20 步'],
              ['O(n)', '一次遍历', '10⁶'],
              ['O(n log n)', '归并/快排/堆排', '~2×10⁷'],
              ['O(n²)', '双重循环暴力', '10¹²(必超时)'],
              ['O(2ⁿ)/O(n!)', '暴力子集/全排列', '天文数字'],
            ] },
          { type: 'code', lang: 'Text', title: '快速估算三招', code: `① 数循环层数,看每层循环变量是否相互独立
   一层 O(n)、嵌套独立 O(n²)、内层折半 O(n log n)
② 递归:复杂度 = 递归次数 × 每次工作量
   二分:log n 次 × O(1) = O(log n)
   遍历二叉树:n 个点各 O(1) = O(n)
③ 空间复杂度只算"额外"空间:递归栈深度、开的数组
   原地排序 O(1);归并要借数组 O(n)

经验值:1 秒约 10⁸~10⁹ 次基本运算
  n≤20 可指数;n≤5000 可 O(n²);n≥10⁵ 必须 O(n log n) 以内` },
          { type: 'warn', html: '<b>高频误区</b>:O(1) 不是"只执行一条语句",而是"与 n 无关";字符串拼接在循环里是 O(n²) 级(每次复制整个串)——Java 用 StringBuilder、C++ 用 string 拼接同理。' }
        ]
      },
      {
        id: 'algo-two-pointers', title: '双指针与滑动窗口', stage: 1,
        desc: '把 O(n²) 降到 O(n) 的第一神器',
        blocks: [
          { type: 'code', lang: 'Java', title: '对撞指针:两数之和 II(有序数组)', code: `// 有序数组找 a[i]+a[j]=target:两端向中间夹
int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;    // 和太小,左端右移
    else right--;                     // 和太大,右端左移
}
// O(n) 时空:O(1)。核心:每一步都能"确定地淘汰一个候选"` },
          { type: 'code', lang: 'Java', title: '滑动窗口:最长无重复子串', code: `// 右端扩张探索,左端收缩合规:一进一出扫一遍
Set<Character> set = new HashSet<>();
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    while (set.contains(s.charAt(right))) {   // 出现重复
        set.remove(s.charAt(left));           // 左端收缩直到合规
        left++;
    }
    set.add(s.charAt(right));
    best = Math.max(best, right - left + 1);
}
// O(n):每个字符最多进出窗口各一次
// 适用信号:连续子串/子数组 + "最长/最短/计数"` },
          { type: 'points', title: '识别套路', items: [
            '<b>对撞指针</b>:有序 + 两端往中间凑(反转数组、容器盛水、三数之和的内层)。',
            '<b>快慢同向</b>:原地删元素(27)、移零;链表找中点/判环(下一章)。',
            '<b>滑动窗口</b>:连续区间 + 某种约束下的最值——先想暴力双循环,再看"窗口滑动的单调性"。',
          ] }
        ]
      },
      {
        id: 'algo-binary', title: '二分查找及其变体', stage: 1,
        desc: '看似简单,细节最多',
        blocks: [
          { type: 'code', lang: 'Java', title: '标准模板与边界变体', code: `// 基础:精确查找(闭区间 [left, right])
int l = 0, r = n - 1;
while (l <= r) {
    int mid = l + (r - l) / 2;        // 防溢出写法
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
}
return -1;

// 变体一:找第一个 >= target 的位置(左边界)
while (l < r) { int mid = l + (r - l) / 2;
    if (nums[mid] >= target) r = mid; else l = mid + 1; }
// 变体二:找最后一个 <= target(右边界)对称改
// 记忆:区间缩到只剩答案;l<r + 判定收紧哪端` },
          { type: 'points', title: '二分的正确姿势', items: [
            '<code class="ic">l + (r - l) / 2</code> 防止 (l+r) 溢出。',
            '明确"循环不变量"(哪段区间可能含答案),边界的 Bug 全来自不变量含糊。',
            '不只数组有序:<strong>答案的单调性</strong>即可二分——"最小的满足条件的 x"(二分答案,Koko 吃香蕉、木材切割)。',
            '旋转数组/山峰数组:先判断哪半有序再决定方向。',
          ] }
        ]
      }
    ]
  }
]);
