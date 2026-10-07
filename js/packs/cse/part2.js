/* ============ 专业英语中心 · 第 2-3 章:阅读能力 + 场景实战 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'cse-ch2', title: '阅读能力:语法、文档与报错', icon: '🔎', stage: 2,
    desc: '科技英语的长难句套路,以及读文档、读报错的实战方法。',
    sections: [
      {
        id: 'cse-grammar', title: '科技英语语法三板斧', stage: 2,
        desc: '被动语态、名词化与定语从句',
        blocks: [
          { type: 'code', lang: 'Text', title: '① 被动语态:科技文的第一人称是 it', code: `The memory is allocated by the allocator.
(内存由分配器分配)—— 谁做的不重要,"被做"才重要

被动语态公式:be + 过去分词(常见 is/are/was/be/can be + V-ed)
  The file is written to disk.        文件被写入磁盘
  The request will be retried twice.  请求将被重试两次
  Threads are scheduled by the OS.    线程由 OS 调度

阅读技巧:见到 is/are/be + V-ed,先找"谁被怎么样"——
主语是受事者,真正的主语常躲在 by 后面` },
          { type: 'code', lang: 'Text', title: '② 长难句拆解:先找主谓,再挂修饰', code: `原句(典型文档风):
The process | that was spawned by the shell | reads the input,
| which is stored in the buffer, | before writing output to stdout.

拆解五步:
1) 找主干动词:reads … before writing(先读后写)
2) 主语中心词:process(进程)
3) that 从句修饰 process:由 shell 启动的那个进程
4) which 从句修饰 input:存在缓冲区里的输入
5) 串起来:shell 启动的进程先读取存在缓冲区的输入,
   然后把输出写到标准输出

套路:科技英语 = 短主干 + 层层后置修饰
     (that/which/分词/介词短语),从中心词往右拆!` },
          { type: 'points', title: '③ 名词化(nominalization):动词全变名词', items: [
            '日常英语 execute the command → 科技英语 <b>the execution of the command</b>。',
            '见到 -tion/-ment/-ance 结尾的长名词串,先在脑中还原成"谁做了什么"。',
            '<code class="ic">the invocation of the method may trigger the allocation of memory</code> = 调用方法可能触发内存分配。',
          ] }
        ]
      },
      {
        id: 'cse-doc-reading', title: '读官方文档与 API 手册', stage: 2,
        desc: 'Javadoc/MDN 的固定栏目',
        blocks: [
          { type: 'code', lang: 'Text', title: '文档的固定结构(以 Javadoc 为例)', code: `java.util.HashMap<K,V>

Method Summary 里的每一行:
put(K key, V value)     —— 签名:方法名+参数
  Inserts / Associates the specified value with the specified key
  (把指定值与指定键关联——动词开头说"做什么")
Specified by: Map.put  (实现了哪个接口的方法)
Parameters:
  key - key with which the value is to be associated(参数说明)
Returns: the previous value, or null(返回值说明)
Throws: NullPointerException - if the key is null(什么情况抛异常)
Since: 1.2   See Also: get(Object)` },
          { type: 'points', title: '高效读文档四步', items: [
            '看<b>签名</b>(名字/参数/返回类型)——这一步其实已经知道 70%。',
            '读第一句<b>功能描述</b>(动词开头:Returns/Inserts/Removes…)。',
            '读 <b>Parameters / Returns / Throws</b> 三段——边界条件都在这。',
            '再看 Since(@Deprecated 直接找替代方案)与示例(Example)。',
          ] },
          { type: 'note', html: '<b>高频文档词汇</b>:deprecated 已弃用、mandatory 必填的、optional 可选的、default 默认、specify 指定、behave 行为、guarantee 保证、arbitrary 任意的、respect 遵守(如 respect the order)、collapse 折叠/坍缩、override 覆盖。' }
        ]
      },
      {
        id: 'cse-error-reading', title: '读报错与搜索答案', stage: 2,
        desc: 'Exception 一长串怎么下手',
        blocks: [
          { type: 'code', lang: 'Text', title: '解剖一条 Java 报错', code: `Exception in thread "main" java.lang.NullPointerException
    at com.demo.Main.process(Main.java:42)
    at com.demo.Main.main(Main.java:18)

阅读顺序(自下而上找入口,自上而下看类型):
① 异常类型:NullPointerException —— "什么病"
② 第一行 at:Main.process(Main.java:42) —— "病发在第 42 行"
③ 后续 at:调用链(谁把 42 行调起来的)

高频报错单词:
  null pointer 空指针 | index out of bounds 下标越界
  class not found 找不到类 | illegal argument 非法参数
  unresolved reference 未解析引用(Kotlin/C++)
  segmentation fault 段错误(C/C++ 访问非法内存)
  timeout / connection refused 超时 / 连接被拒绝` },
          { type: 'points', title: '搜问题的正确姿势', items: [
            '搜索时<b>带上关键上下文</b>:框架名 + 报错核心短语 + 关键版本(如 "Spring BeanNotFoundException @Autowired")。',
            '<b>先读官方 issue/文档再读博客</b>;Stack Overflow 里 high vote 的答案 + 它对应的官方链接最可信。',
            '贴代码问问题时给出:完整报错、最小复现、已尝试的东西(minimal reproducible example)。',
          ] }
        ]
      }
    ]
  },

  {
    id: 'cse-ch3', title: '场景实战:写作、论文与面试', icon: '✍️', stage: 3,
    desc: '把英语用起来:commit/PR 写作、论文摘要与英文面试。',
    sections: [
      {
        id: 'cse-writing', title: '命名、注释与协作写作', stage: 3,
        desc: '代码与提交里的英语礼仪',
        blocks: [
          { type: 'table', head: ['场景', '规范', '正/反例'],
            rows: [
              ['变量命名', '小驼峰,名词或形容词', 'userCount ✔ / data2 ✘'],
              ['函数命名', '动词开头,说清做什么', 'fetchUserInfo ✔ / getIt ✘'],
              ['布尔命名', 'is/has/can + 形容词', 'isEnabled、hasNext ✔'],
              ['常量命名', '全大写下划线', 'MAX_RETRY_COUNT ✔'],
              ['commit', '祈使句一行 ≤50 字符', '"Fix login timeout" ✔ / "update" ✘'],
              ['注释', '解释 why 而非 what', '英文不佳时简洁 > 花哨'],
            ] },
          { type: 'code', lang: 'Text', title: '一个合格的 PR 描述模板', code: `## What
Add pagination to the user list API.

## Why
The endpoint returns all users at once, which times out
for large datasets (>100k rows).

## How
- Introduce page and pageSize query parameters
- Add an index on created_at for stable ordering

## Testing
- [x] Unit tests for the paginator
- [x] Manually verified on staging

高频动词:add / fix / remove / refactor / introduce / deprecate
高频句型:This PR adds... / We introduce... to solve...` },
          { type: 'points', title: '中式英语自救', items: [
            '别直译"进行一个 X 的操作":直接说 do X / X。',
            '少用 very/really;多用精确词:significant、slightly、substantially。',
            '不确定的搭配查 collocation(如 "high performance" 不是 "big performance")。',
          ] }
        ]
      },
      {
        id: 'cse-paper', title: '论文摘要高频句式', stage: 3,
        desc: '看懂 Abstract 的骨架',
        blocks: [
          { type: 'code', lang: 'Text', title: 'Abstract 的固定五段式', code: `① 背景:As X becomes increasingly important, ...
② 问题:However, existing approaches fail to / suffer from ...
③ 方法:In this paper, we propose X, which ... (leverage 利用
        / exploit 借助 / approximate 近似 / optimize 优化)
④ 结果:Experiments on ... demonstrate that our method
        outperforms(优于) state-of-the-art baselines by ...
⑤ 代码:Our code is available at github.com/...

高频词:approach 方法 | baseline 基线 | benchmark 基准
      outperform 超过 | dataset 数据集 | metric 指标
      novel 新颖的 | empirical 实证的 | ablation 消融实验` },
          { type: 'points', title: '看论文的取巧顺序', items: [
            '标题 → 摘要 → 图表 → 结论 → (有必要再)方法细节——20 分钟判断一篇值不值得精读。',
            'Introduction 第一段与 Contribution 列表,基本就是"人话版摘要"。',
            '记住 50 个高频词就能读懂 80% 的摘要;难词多在方法部分的数学描述里。',
          ] }
        ]
      },
      {
        id: 'cse-interview', title: '英文技术面试生存指南', stage: 3,
        desc: '自我介绍与高频问答',
        blocks: [
          { type: 'code', lang: 'Text', title: '一分钟自我介绍骨架', code: `Hi, I'm ___. I'm a (year) student majoring in Computer Science.

I mainly work with Java and Spring Boot. Recently I built
a course-selection system that handles about 5,000 requests
per second, using Redis for caching.

I'm interested in backend development and distributed systems,
and I'm currently learning JVM internals.

骨架:我是谁 → 技术栈 → 一个量化项目 → 兴趣方向
要点:动词过去式(built/optimized/led)+ 数字(量化)!` },
          { type: 'code', lang: 'Text', title: '高频问答与万能句', code: `Q: Tell me about a challenge you faced.
A: One challenge was ... The root cause was ... So I ...
   As a result, ...   (挑战-原因-行动-结果)

听不懂时:Pardon? / Could you rephrase that?
             Do you mean ...?
争取时间:That's a good question. Let me think for a second.
没做过:To be honest I haven't worked with that,
        but I understand it's similar to ...(诚实+迁移)

高频术语读法:Linux /ˈlɪnəks/、cache /kæʃ/(别读 cache-é)、
            SQL "sequel"或逐字母、JSON "J-son"、GUI "gooey"` },
          { type: 'tip', html: '<b>学完本中心</b>:构词法打底 → 三板斧拆长句 → 文档/报错/论文/面试四场景实战。坚持每天读一段英文文档(如 Spring 官方 5 分钟),半年后你会回来谢自己的 🎓。' }
        ]
      }
    ]
  }
]);
