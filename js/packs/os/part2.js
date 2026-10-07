/* ============ OS 中心 · 第 2 章:进程与线程 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'os-ch2', title: '进程与线程', icon: '🔄', stage: 2,
    desc: 'CPU 上演的分身大戏:进程模型、调度、同步与死锁——OS 的核心中的核心。',
    sections: [
      {
        id: 'os-process', title: '进程模型与状态机', stage: 2,
        desc: '程序是静态的,进程是"运行中的程序"',
        blocks: [
          { type: 'text', html: `<p><strong>进程 = 程序 + 数据 + PCB(进程控制块)+ 资源</strong>。程序躺在磁盘上只是文件,被加载并获得执行环境后才成为进程。每个进程拥有独立的<strong>地址空间</strong>,互相隔离、互不干扰——这是 OS 立下的规矩。</p>` },
          { type: 'code', lang: 'Text', title: '五态模型(必背状态机)', code: `            ┌─── 时间片到/被剥夺 ───┐
            ▼                      │
   运行(Running)═══ 时间片完 ═══►就绪(Ready)
        │ ▲                           ▲ │
  等待某事件│ │ 事件完成(调度)          │ │ 被创建
        ▼ │                           │ │
      阻塞(Blocked)──────────────┘ └─ 新建(New)
        │                                   终止(Terminated)◄── 退出/被杀
        └─ 永不直接回运行!必须先回就绪排队 ──┘

PCB 记录:PID、状态、PC、寄存器现场、页表、打开文件、优先级…
  → 切换进程 = 保存旧 PCB 现场 + 恢复新 PCB 现场(上下文切换,纯开销)` },
          { type: 'points', title: '关键区分', items: [
            '<b>就绪 vs 阻塞</b>:就绪"万事俱备只欠 CPU";阻塞"等 I/O 等事件,给 CPU 也没用"。',
            '<b>并发 vs 并行</b>:并发是交替(单核也可),并行是真同时(需多核)。',
            '进程切换代价 &gt; 线程切换:换地址空间(刷 TLB)vs 只换寄存器现场。',
          ] }
        ]
      },
      {
        id: 'os-thread', title: '线程:进程里的执行流', stage: 2,
        desc: '分资源不分执行流',
        blocks: [
          { type: 'text', html: `<p><strong>线程</strong>是进程内的独立执行流:同进程的线程<strong>共享</strong>地址空间、文件等资源,各自持有<strong>私有</strong>的栈、寄存器与 PC。进程是资源分配单位,线程是 CPU 调度单位——这是现代 OS 的标准答案。</p>` },
          { type: 'table', head: ['对比', '进程', '线程'],
            rows: [
              ['地址空间', '独立(隔离)', '同进程内共享'],
              ['切换开销', '大(换页表/刷 TLB)', '小(换寄存器现场)'],
              ['通信', '管道/消息/共享内存(需内核)', '直接读写共享变量(需同步)'],
              ['崩了会', '不影响别的进程', '整个进程跟着挂'],
              ['Java 对应', 'JVM 进程', 'Thread / 虚拟线程'],
            ] },
          { type: 'points', title: '经典模型与实现', items: [
            '<b>多对一/一对一/多对多</b>:用户线程与内核线程的映射模型;Linux 用"轻量级进程"近似一对一。',
            '线程私有栈 → 局部变量安全;共享堆 → static 字段就是共享变量,并发 bug 的老家。',
            '<b>协程/虚拟线程</b>(Java 21):用户态调度的更轻执行流,阻塞成本进一步降低。',
          ] }
        ]
      },
      {
        id: 'os-schedule', title: 'CPU 调度算法', stage: 2,
        desc: '谁下一个上 CPU',
        blocks: [
          { type: 'table', head: ['算法', '规则', '特点'],
            rows: [
              ['FCFS 先来先服务', '按到达排队', '简单;短作业被长作业拖死(护航效应)'],
              ['SJF 短作业优先', '预计运行时间最短者先', '平均等待最优;可能饿死长作业'],
              ['RR 时间片轮转', '就绪队列循环,各跑一个时间片', '公平、响应好;时间片大小是艺术'],
              ['优先级调度', '优先级高者先(可抢占)', '灵活;低优先级饥饿(老化缓解)'],
              ['多级反馈队列', '多个队列+动态降级', '折中各家之长,实战主流(Linux CFS 是变体)'],
            ] },
          { type: 'code', lang: 'Text', title: '调度指标与计算', code: `周转时间 = 完成 - 到达          (作业在系统里待了多久)
带权周转 = 周转 / 运行时间      (≥1,越接近 1 越好)
等待时间 = 周转 - 运行          (纯排队时间)
响应时间 = 首次运行 - 到达      (交互系统最看重)

例:A(0 到达,跑 8) B(1,4) C(2,9) D(3,5)
FCFS 顺序 A→B→C→D:
  A 周转 8;B 周转 11(1 等到 12 完);C 21;D 22 → 平均 15.5
SJF(非抢占)A 跑完后选最短 B:D、C…
  → 平均周转显著降低:自己算一遍加深记忆` },
          { type: 'warn', html: '<b>抢占 vs 非抢占</b>:SJF 抢占版叫 SRTF(剩余最短优先);计算题先列甘特图,再逐个算指标——时间轴画错全盘皆输。' }
        ]
      },
      {
        id: 'os-sync', title: '同步与互斥', stage: 2,
        desc: '临界区、信号量与三大经典问题',
        blocks: [
          { type: 'text', html: `<p>多线程共享数据,<strong>竞态条件</strong>使结果取决于调度时机(<code class="ic">count++</code> 这种"读改写"三步随时被打断)。解决之道:把访问共享资源的代码段(<strong>临界区</strong>)保护起来,满足<strong>忙则等待、有空让进、有限等待</strong>。</p>` },
          { type: 'code', lang: 'C', title: '信号量:P/V 操作(Dijkstra)', code: `semaphore s = 1;          // 二值=互斥;计数=资源数

P(s): s--; if (s < 0) 阻塞自己进等待队列;   // 申请
V(s): s++; if (s <= 0) 唤醒一个等待者;      // 释放

// 经典:生产者-消费者(缓冲区容量 N)
semaphore mutex = 1;      // 互斥访问缓冲区
semaphore empty = N;      // 空槽数
semaphore full  = 0;      // 产品数

生产者:            消费者:
P(empty);           P(full);
P(mutex);           P(mutex);
  放产品;             取产品;
V(mutex);           V(mutex);
V(full);            V(empty);
// 顺序不能反!先 P(mutex) 再 P(empty) 会死锁` },
          { type: 'points', title: '三大经典问题(模板必背)', items: [
            '<b>生产者-消费者</b>:互斥 + 同步两个信号量,如上。',
            '<b>读者-写者</b>:读者可并行、写者独占——count + rw_mutex + 读者计数保护。',
            '<b>哲学家就餐</b>:5 人 5 筷;死锁经典——解法:限人数/奇偶手/一次拿齐(AND 信号量)。',
            '<b>管程</b>:把信号量操作封装进高级语言构造,Java 的 synchronized + wait/notify 就是管程思想。',
          ] }
        ]
      },
      {
        id: 'os-deadlock', title: '死锁', stage: 2,
        desc: '四个必要条件与银行家算法',
        blocks: [
          { type: 'points', title: '死锁的四个必要条件(缺一不可)', items: [
            '<b>互斥</b>:资源一次只能一人用;',
            '<b>持有并等待</b>:占着已有的还要等别的;',
            '<b>不可剥夺</b>:不能抢别人手里的;',
            '<b>循环等待</b>:A 等 B、B 等 A 首尾相接。',
          ] },
          { type: 'table', head: ['策略', '思路'],
            rows: [
              ['预防', '破坏某条件:一次性申请全部/按序申请资源编号(破循环等待最实用)'],
              ['避免', '动态判断:银行家算法——分配后仍存在安全序列才分'],
              ['检测+解除', '资源分配图找环;剥夺资源/回滚/杀进程'],
            ] },
          { type: 'code', lang: 'Text', title: '银行家算法(考点模板)', code: `Available / Max / Allocation / Need(=Max-Allocation)
安全性检查:
  Work=Available; Finish[i]=false
  找 Needᵢ≤Work 且 Finish=false 的进程:
    它能跑完并归还 → Work+=Allocationᵢ; Finishᵢ=true; 重复
  全部 Finish=true → 存在安全序列(系统安全)
否则不安全 → 拒绝本次分配

要点:算 Need 矩阵 → 试探分配 → 跑安全算法 → 判断
     安全 ≠ 没死锁;不安全 = 可能死锁(风险态)` }
        ]
      }
    ]
  }
]);
