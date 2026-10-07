/* ============ 专业英语中心 · 第 1 章:词汇基石 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'cse-ch1', title: '词汇基石:构词法与分类词汇', icon: '📖', stage: 1,
    desc: '掌握词根词缀这把"万能钥匙",再按领域分块积累核心词汇。',
    sections: [
      {
        id: 'cse-word-build', title: '构词法:前缀、词根与后缀', stage: 1,
        desc: '一个词根解锁一串单词',
        blocks: [
          { type: 'text', html: `<p>计算机英语 80% 的术语由<strong>希腊/拉丁词根 + 前后缀</strong>拼装而成。掌握几十个高频零件,生词也能猜出八九不离十——这比死记硬背高效得多。</p>` },
          { type: 'table', head: ['零件', '含义', '词汇家族'],
            rows: [
              ['com-/con-', '共同、一起', 'compile 编译、concatenate 拼接、connect 连接'],
              ['de-', '去除、向下', 'deallocate 释放、decrement 减、debug 调试(去 bug)'],
              ['in-/im-', '进入/否定', 'input 输入;infinite 无限;immutable 不可变'],
              ['re-', '再次、返回', 'return 返回、retry 重试、recursive 递归的'],
              ['sub-/sup-', '下面、次级', 'subroutine 子程序、substring 子串、subclass 子类'],
              ['pre-/post-', '前 / 后', 'prefix 前缀、preprocess 预处理;postfix 后缀'],
              ['-er/-or', '执行者', 'compiler 编译器、processor 处理器、container 容器'],
              ['-tion/-sion', '名词化', 'execution 执行、compression 压缩、transaction 事务'],
              ['-able/-ible', '可…的', 'portable 可移植的、scalable 可扩展的、reversible 可逆的'],
            ] },
          { type: 'code', lang: 'Text', title: '词根轰炸:port(携带)、spect(看)、mit/miss(送)', code: `port → import 进口/导入  export 出口/导出
      transport 传输   portable 便携的   opportunity 机会
spect → inspect 检查(in 往里看)  respect 尊重(反复看)
       prospect 前景(向前看)   spectator 观众
mit/miss → transmit 传输  submit 提交(从下往上送)
          permission 许可  mission 任务

记忆法:terminal(终端)= termin(终点)+ -al(形容词缀)
       → terminate 终止、terminator 终结者,一串全收` },
          { type: 'points', title: '高效积累姿势', items: [
            '<b>按词族背</b>而不是按字母表背:一个词根串起 5~10 个词。',
            '读代码时顺手收集:identifier 标识符、literal 字面量、operand 操作数——出现在语境里的词最容易被记住。',
            '发音别偷懒:重音错位不影响交流但影响听讲(如 variable /ˈveəriəbl/)。',
          ] }
        ]
      },
      {
        id: 'cse-words-hw', title: '硬件与体系词汇', stage: 1,
        desc: '对应计组/OS 的英文地图',
        blocks: [
          { type: 'table', head: ['英文', '中文', '一句记忆'],
            rows: [
              ['processor / CPU', '处理器', 'process 处理 + -or 执行者'],
              ['memory / storage', '内存 / 存储', 'memory 易失的内存;storage 持久存储'],
              ['register', '寄存器', 'register 本义"登记簿"——最快的小本本'],
              ['cache', '高速缓存', '法语词"隐藏的存贮";命中率 hit rate'],
              ['interrupt', '中断', 'inter(中间)+rupt(断裂):打断 CPU'],
              ['bus', '总线', '公共汽车——数据公共汽车'],
              ['bandwidth', '带宽', 'band 带 + width 宽度'],
              ['throughput', '吞吐量', 'through 通过 + put 放:单位时间通过的量'],
              ['latency', '延迟', 'late 迟 + -ency 名词缀:等多久才响应'],
            ] },
          { type: 'points', title: '易混对儿', items: [
            '<b>latency vs throughput</b>:延迟=单次多快(多久一次来回);吞吐=整体多能装(每秒多少个)。',
            '<b>memory vs storage</b>:memory 掉电丢(RAM);storage 掉电留(磁盘/SSD)。',
            '<b>clock / cycle / frequency</b>:时钟、周期、频率(主频)——计组三件套英文。',
          ] }
        ]
      },
      {
        id: 'cse-words-sw', title: '软件与开发词汇', stage: 1,
        desc: '写代码读文档的主力词',
        blocks: [
          { type: 'table', head: ['英文', '中文', '一句记忆'],
            rows: [
              ['compile / interpret', '编译 / 解释', 'com(一起)+pile(堆)→汇编成整体'],
              ['syntax / semantic', '语法 / 语义', 'syntax error 语法错;semantic 语义错(能跑但不对)'],
              ['runtime / compile-time', '运行时 / 编译期', '两个"时间点"限定了错误的发现时机'],
              ['exception', '异常', 'except(除外)+ -ion:计划外的情况'],
              ['inherit / override', '继承 / 重写', 'over(上)+ride(骑):骑在父类方法之上'],
              ['deprecated', '已弃用', '文档常客:能用但不推荐,将被移除'],
              ['idempotent', '幂等的', 'idem(相同)+potent(能力):重复执行结果不变'],
              ['verbose', '冗长的', '命令行 --verbose 输出详细信息'],
            ] },
          { type: 'code', lang: 'Text', title: '一句话认全家族', code: `The compiler compiles the source code into bytecode,
and the interpreter executes it at runtime.
If a syntax error occurs, the program fails to compile;
a runtime exception may still crash it later.

compile→compiler(编译器)→compilation(编译过程)
interpret→interpreter(解释器)→interpretation
execute→execution(执行)→executable(可执行文件)
语法对的坑:occurs/fails/crashes 第三人称单数别丢 s` }
        ]
      }
    ]
  }
]);
