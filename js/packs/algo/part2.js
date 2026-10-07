/* ============ 算法中心 · 第 2-3 章:线性结构 + 树与图 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'algo-ch2', title: '线性结构:链表、栈队列与哈希', icon: '🔗', stage: 2,
    desc: '数据结构的第一梯队:链表操作、单调栈、前缀和与哈希。',
    sections: [
      {
        id: 'algo-linked-list', title: '链表:反转、找环与虚拟头', stage: 2,
        desc: '指针题的全套心法',
        blocks: [
          { type: 'code', lang: 'Java', title: '三大必背模板', code: `class ListNode { int val; ListNode next; }

// ① 反转链表:三指针滚动
ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;  // 暂存
    cur.next = prev;           // 掉头
    prev = cur; cur = next;    // 双双前移
}
return prev;                   // 新头

// ② 快慢指针判环 / 找中点
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
    if (slow == fast) return true;    // 相遇即有环
}
// slow 此刻即中点(无环时)

// ③ 虚拟头节点:统一处理删头/头插
ListNode dummy = new ListNode(0, head);
// 删除倒数第 n 个:双指针先走 n 步再同行` },
          { type: 'points', title: '心法', items: [
            '<b>先画图再动手</b>:箭头改向一次只改一根,先存 next 再断链。',
            '<b>虚拟头(dummy)</b>消灭"删除/插入头节点"的特殊分支——链表题标配。',
            '快慢指针家族:中点、判环、倒数第 k(相当于 Java 里 JVM 可达性分析的同源思想)。',
            '多用纸笔模拟边界:n=0、单节点、两节点——链表题 90% 的 Bug 在边界。',
          ] }
        ]
      },
      {
        id: 'algo-stack-queue', title: '栈与队列:括号、单调栈', stage: 2,
        desc: '后进先出的妙用',
        blocks: [
          { type: 'code', lang: 'Java', title: '两道祖传题', code: `// 有效括号:最近匹配 → 栈
Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else if (st.isEmpty() || st.pop() != match(c)) return false;
}
return st.isEmpty();          // 栈空才全配对

// 单调栈:下一个更大元素 / 每日温度
int[] res = new int[n];
Deque<Integer> stk = new ArrayDeque<>();      // 存下标,栈内值单调递减
for (int i = 0; i < n; i++) {
    while (!stk.isEmpty() && temp[i] > temp[stk.peek()]) {
        res[stk.pop()] = i - stk.isEmpty() ? 0 : i - stk.peek(); // 弹出者已得答案
    }
    stk.push(i);
}
// 本质:被"更大者"弹出的瞬间即答案 —— O(n)` },
          { type: 'points', title: '识别信号', items: [
            '<b>匹配/嵌套/撤销</b>(括号、表达式、浏览器后退)→ 栈。',
            '<b>下一个更大/更小</b>、直方图最大矩形 → 单调栈(保持栈内单调,弹出即结算)。',
            '队列:广度优先(BFS)的载体;双端队列做滑动窗口最大值(单调双端队列)。',
          ] }
        ]
      },
      {
        id: 'algo-hash', title: '哈希表与前缀和', stage: 2,
        desc: '用空间换时间的艺术',
        blocks: [
          { type: 'code', lang: 'Java', title: '两数之和 + 和为 K 的子数组', code: `// 两数之和(无序):一边查一边存
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);              // O(n) 搞定"找配对"
}

// 前缀和 + 哈希:和恰为 k 的子数组个数
Map<Long, Integer> cnt = new HashMap<>(Map.of(0L, 1));
long sum = 0; int ans = 0;
for (int x : nums) {
    sum += x;                          // pre[i]
    ans += cnt.getOrDefault(sum - k, 0);  // 之前有多少 pre[j]=sum-k
    cnt.merge(sum, 1, Integer::sum);
}
// 前缀和:子数组问题转"两数之差",数组不变量的万金油` },
          { type: 'points', title: '使用心法', items: [
            '<b>空间换时间</b>:O(n²) 暴力先写,再问"每个元素要反复查什么" → 哈希掉。',
            '前缀和数组 pre[i] = 前 i 项和;区间和 = pre[r] − pre[l−1]。',
            '哈希 + 前缀和/双指针/滑动窗口的组合,覆盖一大数据结构题面。',
            '注意:自定义对象作键要重写 hashCode/equals(呼应 Java 中心 HashMap 原理)。',
          ] }
        ]
      }
    ]
  },

  {
    id: 'algo-ch3', title: '树与图', icon: '🌳', stage: 3,
    desc: '递归的主场:二叉树遍历、堆,以及图的搜索与最短路。',
    sections: [
      {
        id: 'algo-tree', title: '二叉树:遍历与递归套路', stage: 3,
        desc: '一切树的起点',
        blocks: [
          { type: 'code', lang: 'Java', title: '四种遍历', code: `// 递归版(前中后序只是"根"的位置不同)
void traverse(TreeNode root) {
    if (root == null) return;
    // 前:先做 root 的事
    traverse(root.left);
    // 中:左之后做 root 的事
    traverse(root.right);
    // 后:左右之后做 root 的事
}

// 层序(BFS):队列
Queue<TreeNode> q = new ArrayDeque<>(List.of(root));
while (!q.isEmpty()) {
    int size = q.size();                    // 当前层节点数
    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        if (n.left != null) q.add(n.left);
        if (n.right != null) q.add(n.right);
    }
}` },
          { type: 'code', lang: 'Java', title: '递归思维:最大深度', code: `int maxDepth(TreeNode root) {
    if (root == null) return 0;                       // base case
    return 1 + Math.max(maxDepth(root.left),          // 相信递归:子树深度已知
                        maxDepth(root.right));
}
// 树的递归三步:base case → 拆子问题 → 组合子答案
// "子结构"题(对称/平衡/路径和)全部这一套` },
          { type: 'points', title: '性质速记', items: [
            'n 个节点的二叉树有 n+1 个空指针;第 i 层至多 2^(i-1) 个节点。',
            '完全二叉树用数组存(k 的孩子 2k+1/2k+2),连续堆空间无浪费——堆正是这么实现。',
            '中序 + 任一其他序可重建二叉树;BST 的中序遍历即升序序列。',
          ] }
        ]
      },
      {
        id: 'algo-heap', title: 'BST 与堆', stage: 3,
        desc: '两个"有序"结构,各管一摊',
        blocks: [
          { type: 'table', head: ['对比', 'BST 二叉搜索树', '堆(优先队列)'],
            rows: [
              ['有序性', '左 < 根 < 右(全局序)', '只保证父优于子(偏序)'],
              ['核心操作', '查找/插入 O(h)', '取最值 O(1)、弹出 O(log n)'],
              ['退化风险', '失衡退化为链表 → AVL/红黑树', '完全二叉树,永不退化'],
              ['典型应用', '有序维护、范围查询', 'Top-K、调度、Dijkstra 取最近点'],
            ] },
          { type: 'code', lang: 'Java', title: 'Top-K 经典套路', code: `// 求最大的 K 个数:维护大小为 K 的小顶堆
PriorityQueue<Integer> heap = new PriorityQueue<>();   // 小顶堆
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();   // 弹掉最小的
}
// 堆里剩下的就是 Top-K;总代价 O(n log k)
// 大顶堆:new PriorityQueue<>((a, b) -> b - a)
// 取最大用小顶堆(淘汰最小),取最小用大顶堆 —— 反着来` },
        ]
      },
      {
        id: 'algo-graph', title: '图:存储、BFS/DFS 与最短路', stage: 3,
        desc: '从遍历到 Dijkstra 与拓扑排序',
        blocks: [
          { type: 'code', lang: 'Java', title: '建图与两种遍历', code: `// 邻接表建图(n 点 m 边)
List<List<Integer>> g = new ArrayList<>();
for (int i = 0; i < n; i++) g.add(new ArrayList<>());
for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }

// BFS:最短步数(无权图)—— 队列 + visited
Queue<Integer> q = new ArrayDeque<>();
boolean[] vis = new boolean[n];
q.add(start); vis[start] = true;
int step = 0;
while (!q.isEmpty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        int cur = q.poll();
        for (int nxt : g.get(cur))
            if (!vis[nxt]) { vis[nxt] = true; q.add(nxt); }
    }
    step++;
}

// DFS:一条道走到黑(回溯、连通分量)—— 递归/栈
void dfs(int u) { if (vis[u]) return; vis[u] = true;
    for (int v : g.get(u)) dfs(v); }` },
          { type: 'points', title: '三件进阶兵器', items: [
            '<b>Dijkstra</b>:带非负权最短路,小顶堆贪心取最近点,邻接表 O((V+E)logV);负权边要用 Bellman-Ford。',
            '<b>拓扑排序</b>:Kahn 算法(入度 0 进队列)——课程表、依赖解析;有环则排不出 → 判环利器。',
            '<b>并查集</b>:路径压缩 + 按秩合并,近乎 O(1) 的"合并集合/查同类"——连通性问题的瑞士军刀。',
          ] }
        ]
      }
    ]
  }
]);
