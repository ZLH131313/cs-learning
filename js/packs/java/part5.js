/* ============ 第 10-13 章:反射与注解 + 新特性 + JVM + 进阶路线 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch10', title: '反射与注解', icon: '🪞', stage: 5,
    desc: '框架世界的地基:在运行时"透视"和操控类。',
    sections: [
      {
        id: 'reflect-class', title: 'Class 对象与反射入门', stage: 5,
        desc: '一切框架的底层魔法',
        blocks: [
          { type: 'text', html: `<p>每个类被加载进 JVM 后,都会生成唯一一个 <code class="ic">Class</code> 对象,里面保存着这个类的<strong>构造器、方法、字段、注解</strong>等全部元信息。通过它可以在<strong>运行时</strong>动态地创建对象、调用方法、读写字段——这就是<strong>反射(Reflection)</strong>。Spring 的依赖注入、MyBatis 的结果映射,底层全是反射。</p>` },
          { type: 'code', title: '获取 Class 对象的三种方式', code: `// ① Class.forName("全类名") —— 最常用,配置文件里写类名字符串
Class<?> c1 = Class.forName("java.util.ArrayList");

// ② 类名.class —— 编译期就确定,最安全高效
Class<User> c2 = User.class;

// ③ 对象.getClass() —— 已有对象时用
User u = new User();
Class<?> c3 = u.getClass();

System.out.println(c1 == c2);   // 注意:比较"同一个类"时三者相等(同一份字节码)` },
          { type: 'code', title: '反射:构造对象、调方法、改字段', code: `import java.lang.reflect.*;

Class<User> clazz = User.class;

// 1. 获取构造器并创建实例
Constructor<User> cons = clazz.getDeclaredConstructor(String.class, int.class);
User u = cons.newInstance("张三", 18);

// 2. 获取并调用方法(参数是 方法名 + 参数类型列表)
Method sayHello = clazz.getDeclaredMethod("sayHello", String.class);
sayHello.setAccessible(true);            // 私有方法要"暴力破解"
String result = (String) sayHello.invoke(u, "李四");

// 3. 获取并修改字段
Field nameField = clazz.getDeclaredField("name");
nameField.setAccessible(true);           // 私有字段同理
nameField.set(u, "王五");

// 4. 常用 API 一览
clazz.getName();          // 全类名 com.demo.User
clazz.getSimpleName();    // User
clazz.getDeclaredFields();    // 所有字段(含私有)
clazz.getDeclaredMethods();   // 所有方法
clazz.getAnnotations();       // 所有注解` },
          { type: 'warn', html: '<b>双刃剑</b>:反射绕过了编译期检查、性能比直接调用慢,还会破坏封装。业务代码少用,但理解它是读懂 Spring 等框架源码的必修课。setAccessible(true) 对 JDK 9+ 模块化系统可能受限。' },
        ]
      },
      {
        id: 'annotation', title: '注解与动态代理', stage: 5,
        desc: '自定义注解 + 反射解析、Proxy',
        blocks: [
          { type: 'code', title: '元注解与自定义注解', code: `import java.lang.annotation.*;

// 两个最常用元注解:
// @Target:注解能用在哪里(METHOD 方法 / FIELD 字段 / TYPE 类和接口 / PARAMETER 参数)
// @Retention:注解保留到哪一环(SOURCE 源码 / CLASS 字节码 / RUNTIME 运行时,反射可读必须 RUNTIME)
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyLog {
    String value() default "";        // 属性以"抽象方法"形式声明,可设默认值
    String module() default "默认模块";
}

// 使用
public class OrderService {
    @MyLog(value = "创建订单", module = "订单中心")
    public void createOrder() { ... }
}` },
          { type: 'code', title: '反射解析注解(AOP 思想雏形)', code: `Method m = OrderService.class.getMethod("createOrder");
if (m.isAnnotationPresent(MyLog.class)) {          // 该方法上有没有这个注解?
    MyLog log = m.getAnnotation(MyLog.class);
    System.out.println("记录日志:模块=" + log.module() + ",操作=" + log.value());
    // 实际项目中:这里会统一把日志写入数据库 —— 业务代码零侵入
}` },
          { type: 'code', title: 'JDK 动态代理(面试重点)', code: `import java.lang.reflect.*;

// 需求:给所有 Service 方法自动加上耗时统计,不改一行业务代码
public class TimingProxy implements InvocationHandler {
    private final Object target;                    // 被代理的真实对象
    public TimingProxy(Object target) { this.target = target; }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        long start = System.nanoTime();
        Object result = method.invoke(target, args);  // 执行真实方法
        System.out.println(method.getName() + " 耗时 " + (System.nanoTime() - start) + "ns");
        return result;                                // 也可以在这里加事务、日志、权限...
    }

    @SuppressWarnings("unchecked")
    public static <T> T newProxy(T target) {
        return (T) Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new TimingProxy(target));
    }
}

// 使用:拿到的是"运行时生成"的代理类 $Proxy0 的实例
UserService svc = TimingProxy.newProxy(new UserServiceImpl());
svc.findAll();
// Spring AOP 的底层就是动态代理:有接口用 JDK Proxy,无接口用 CGLIB 字节码增强` },
        ]
      }
    ]
  },

  {
    id: 'ch11', title: 'Lambda 与 Stream(Java 8+)', icon: '🌊', stage: 5,
    desc: '函数式编程:少写 70% 的模板代码,集合处理一气呵成。',
    sections: [
      {
        id: 'lambda-functional', title: 'Lambda 与函数式接口', stage: 5,
        desc: '匿名内部类的极简形态',
        blocks: [
          { type: 'text', html: `<p>Lambda 表达式是<strong>函数式接口</strong>(只有一个抽象方法的接口,常带 <code class="ic">@FunctionalInterface</code> 注解)的实例,是匿名内部类的极致简化。语法:<code class="ic">(参数) -&gt; { 方法体 }</code>。</p>` },
          { type: 'code', title: '从匿名内部类到 Lambda 的进化', code: `// 进化过程:同样的"降序排序"
// ① 匿名内部类(5 行)
Arrays.sort(arr, new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) { return b - a; }
});

// ② Lambda 标准形态
Arrays.sort(arr, (Integer a, Integer b) -> { return b - a; });

// ③ 省略参数类型(可推断)
Arrays.sort(arr, (a, b) -> b - a);

// 无参数:() -> System.out.println("hi")
// 一个参数:小括号可省:s -> s.length()
// 单语句:大括号和 return 可省

// 方法引用:Lambda 只是"转发调用"时可进一步简写
Function<String, Integer> f1 = s -> Integer.parseInt(s);
Function<String, Integer> f2 = Integer::parseInt;       // 类::静态方法
Supplier<ArrayList> gen = ArrayList::new;               // 类::new 构造器引用
Consumer<String> print = System.out::println;           // 对象::实例方法` },
          { type: 'points', title: '四大核心函数式接口(必须记住)', items: [
            '<code class="ic">Supplier&lt;T&gt;</code> 供给型:<code class="ic">T get()</code> 只出不进——工厂、生成数据。',
            '<code class="ic">Consumer&lt;T&gt;</code> 消费型:<code class="ic">void accept(T t)</code> 只进不出——打印、入库。',
            '<code class="ic">Function&lt;T,R&gt;</code> 函数型:<code class="ic">R apply(T t)</code> 进 T 出 R——类型转换。',
            '<code class="ic">Predicate&lt;T&gt;</code> 断言型:<code class="ic">boolean test(T t)</code> 进 T 出真假——过滤判断。',
            '另外 <code class="ic">Runnable</code>、<code class="ic">Comparator</code> 也都是函数式接口,所以线程和排序都能用 Lambda。',
          ] },
        ]
      },
      {
        id: 'stream-api', title: 'Stream API', stage: 5,
        desc: 'filter / map / collect 一条流水线',
        blocks: [
          { type: 'text', html: `<p>Stream 是对集合数据的<strong>声明式流水线</strong>:你要什么(filter 条件、map 变换、collect 收集),而不是怎么循环。特点:<strong>不存数据、不改源集合、惰性求值、一次性使用</strong>。</p>` },
          { type: 'code', title: '流水线三步走:获取 → 中间操作 → 终结操作', code: `import java.util.*;
import java.util.stream.*;

record Employee(String name, String dept, double salary, int age) {}

List<Employee> emps = List.of(
    new Employee("张三", "开发", 15000, 28),
    new Employee("李四", "开发", 18000, 35),
    new Employee("王五", "测试", 12000, 26),
    new Employee("赵六", "产品", 14000, 30)
);

// 案例:开发部、月薪超过 13000 的员工姓名,按薪资降序
List<String> names = emps.stream()               // 1. 获取流
        .filter(e -> e.dept().equals("开发"))    // 2. 过滤(中间操作,惰性)
        .filter(e -> e.salary() > 13000)
        .sorted(Comparator.comparingDouble(Employee::salary).reversed())
        .map(Employee::name)                     // 3. 映射成姓名
        .collect(Collectors.toList());           // 4. 终结操作收集结果
System.out.println(names);       // [李四, 张三]

// 其他高频中间/终结操作
emps.stream().limit(2).skip(1);                  // 截取与跳过(分页)
emps.stream().mapToDouble(Employee::salary).average().ifPresent(System.out::println);  // 平均薪资
emps.stream().map(Employee::name).distinct().count();   // 去重计数
emps.stream().anyMatch(e -> e.age() > 33);       // 是否存在(短路)
emps.stream().max(Comparator.comparing(Employee::salary));  // 工资最高的` },
          { type: 'code', title: 'collect 收集器:分组与统计', code: `import static java.util.stream.Collectors.*;

// 按部门分组:Map<String, List<Employee>>
Map<String, List<Employee>> byDept = emps.stream()
        .collect(groupingBy(Employee::dept));

// 分组统计:每个部门人数
Map<String, Long> countByDept = emps.stream()
        .collect(groupingBy(Employee::dept, counting()));

// 拼接:所有员工姓名用逗号连接
String allNames = emps.stream().map(Employee::name).collect(joining(", "));

// 转 Map:id -> 对象(注意 key 冲突要给合并函数)
Map<String, Double> salaryMap = emps.stream()
        .collect(toMap(Employee::name, Employee::salary, (a, b) -> a));

// 数值统计:一次拿到最大最小平均总和
DoubleSummaryStatistics st = emps.stream()
        .mapToDouble(Employee::salary).summaryStatistics();
System.out.println(st.getMax() + " " + st.getAverage());

// 数值区间与流转换
IntStream.rangeClosed(1, 100).sum();             // 1~100 求和 = 5050
Stream.of(1, 2, 3).map(String::valueOf).toList(); // 流转集合(JDK16+)` },
          { type: 'code', title: 'Optional:优雅地对抗 null', code: `import java.util.Optional;

Optional<Employee> maxEmp = emps.stream()
        .max(Comparator.comparingDouble(Employee::salary));

// 老写法:if (emp != null) ... 容易忘;新写法:
maxEmp.ifPresent(e -> System.out.println("最高薪:" + e.name()));
Employee fallback = maxEmp.orElse(new Employee("默认", "-", 0, 0));
Employee orThrow = maxEmp.orElseThrow(() -> new RuntimeException("没有员工"));
String name = maxEmp.map(Employee::name).orElse("匿名");

// Optional.of(x)        x 为 null 直接抛异常(适合明确不能为 null)
// Optional.ofNullable(x) 允许 null(适合可能为 null 的场景)` },
          { type: 'warn', html: '<b>常见误用</b>:① 在 Stream 里用外部变量累加(有并发问题,应使用 reduce/collect);② 对同一个流用两次(一次性,IllegalStateException);③ 复杂逻辑硬塞进一行——可读性优先,该换行就换行。' },
        ]
      }
    ]
  },

  {
    id: 'ch12', title: 'JVM 基础', icon: '⚙️', stage: 5,
    desc: '内存区域、垃圾回收、类加载——从"会写"到"懂原理"的分水岭。',
    sections: [
      {
        id: 'jvm-memory', title: '运行时内存区域', stage: 5,
        desc: '堆、栈、方法区各管什么',
        blocks: [
          { type: 'code', title: 'JVM 运行时数据区', code: `线程私有(随线程生灭):
 ├── 程序计数器   记录当前执行到的字节码行号(唯一不会 OOM 的区域)
 ├── 虚拟机栈     每个方法调用压入一个"栈帧"(局部变量表、操作数栈...)
 │               递归太深 => StackOverflowError;栈扩展失败 => OOM
 └── 本地方法栈   为 native 方法(native 修饰)服务

线程共享:
 ├── 堆 Heap     对象实例的家,GC 的主战场,最大的一块 => OOM 高发区
 │    新生代(Eden + 2×Survivor)——朝生夕死的小对象
 │    老年代            ——活得久的对象、大对象
 └── 方法区       类元信息、常量、静态变量(JDK8 起由"元空间"实现,用本地内存)` },
          { type: 'code', title: '一段代码的内存之旅', code: `public class MemoryDemo {
    static int counter = 0;                  // 静态变量 => 方法区

    public static void main(String[] args) { // main 的栈帧 => 虚拟机栈
        User u = new User("张三");            // u 引用 => 栈;new User 对象 => 堆
        u.sayHello();                         // sayHello 栈帧入栈,执行完出栈
        counter++;                            // 修改方法区的静态变量
    }
}
// 判断对象是否存活:可达性分析——从 GC Roots(栈中引用、静态变量、常量...)
// 出发向下搜索,搜不到的对象就是"垃圾",等待回收。` },
          { type: 'points', title: '常见内存问题速查', items: [
            '<code class="ic">NullPointerException</code>:栈上的引用是 null,却去访问堆对象。',
            '<code class="ic">OutOfMemoryError: Java heap space</code>:对象太多或内存泄漏(如静态集合只加不删)。',
            '<code class="ic">StackOverflowError</code>:递归没有出口或栈帧过大。',
            '常用启动参数:<code class="ic">-Xms512m</code>(初始堆)、<code class="ic">-Xmx1024m</code>(最大堆)、<code class="ic">-Xss256k</code>(线程栈)、<code class="ic">-XX:+HeapDumpOnOutOfMemoryError</code>(OOM 时转储)。',
          ] },
        ]
      },
      {
        id: 'jvm-gc', title: '垃圾回收 GC', stage: 5,
        desc: '分代假设、回收算法、经典收集器',
        blocks: [
          { type: 'points', title: '三大基础算法', items: [
            '<b>标记-清除</b>:先标记垃圾再清除。简单,但产生内存碎片。',
            '<b>标记-复制</b>:内存分两半,存活对象整体搬到另一半。无碎片、快,但浪费空间 → 适合<b>新生代</b>(对象存活率低)。',
            '<b>标记-整理</b>:存活对象向一端移动再清理边界。无碎片、慢 → 适合<b>老年代</b>。',
            '<b>分代收集</b> = 以上组合:新生代用复制(Eden:Survivor ≈ 8:1:1,Minor GC 频繁且快),老年代用整理(Major/Full GC 慢,尽量少发生)。',
          ] },
          { type: 'code', title: '对象的一生(面试高频)', code: `User u = new User();   // ① 对象优先在 Eden 区分配

// ② Eden 满了 => 触发 Minor GC:
//    存活对象年龄+1,被复制到 Survivor 区(每次 GC 后总有一块 Survivor 空着)
//    死亡对象直接清空 —— "朝生夕死"的对象 98% 活不过第一次 GC

// ③ 每熬过一次 Minor GC,年龄 +1;年龄到 15(默认) => 晋升老年代
//    大对象(如大数组)直接进老年代,避免来回复制

// ④ 老年代空间不足 => Major GC / Full GC:整堆整理,STW(世界暂停)时间长` },
          { type: 'points', title: '收集器演进(了解即可)', items: [
            'Serial / Parallel:单线程 / 多线程,STW 明显,吞吐量优先。Parallel 是 JDK8 默认。',
            'CMS:并发标记清除,追求低停顿,已废弃。',
            '<b>G1</b>(JDK9+ 默认):把堆切成等大 Region,可预测停顿,大堆友好。',
            'ZGC / Shenandoah:亚毫秒级停顿,超低延迟,JDK 17+ 逐渐成熟。',
            '调优思路:大多是<b>调业务</b>(减少大对象、缩短对象生命周期)而非调参数;先用 <code class="ic">jstat</code>、<code class="ic">jvisualvm</code>、MAT 分析再动手。',
          ] },
        ]
      },
      {
        id: 'jvm-classloader', title: '类加载机制与双亲委派', stage: 5,
        desc: '类从 .class 到可用对象的过程',
        blocks: [
          { type: 'code', title: '类加载五部曲', code: `加载     读取 .class 字节流,在方法区生成 Class 对象
   ↓
验证     校验字节码合法性(防止恶意构造的字节码搞垮 JVM)
   ↓
准备     为静态变量分配内存并赋"零值"(int => 0,引用 => null)
         注意:static int a = 10; 此刻 a 是 0,不是 10!
   ↓
解析     符号引用转为直接引用(可选,可延迟)
   ↓
初始化   执行静态变量赋值 + static{} 代码块(按代码顺序,父类先于子类)

// 主动触发初始化:new 对象、访问静态变量/方法、反射 Class.forName、执行 main 的类` },
          { type: 'points', title: '双亲委派模型', items: [
            '三层加载器:Bootstrap(核心库 rt.jar)→ Platform/Ext(扩展)→ Application(你的类)。',
            '收到加载请求先<b>逐级向上委托</b>给父加载器;父加载器搞不定才自己加载。',
            '<b>两个价值</b>:① 安全——自己写个 <code class="ic">java.lang.String</code> 也不会顶替核心类;② 避免重复加载,保证同一个类只有一份。',
            '打破双亲委派的场景:SPI(JDBC Driver)、Tomcat 的 WebAppClassLoader、热部署框架。',
          ] },
          { type: 'tip', html: '<b>经典思考题</b>:<code class="ic">System.out.println(Child.a);</code> 只会初始化父类 Father 吗?—— 访问静态常量(<code class="ic">static final</code> 且编译期确定)不会触发初始化,访问静态变量会触发。想深挖推荐周志明《深入理解Java虚拟机》。' },
        ]
      }
    ]
  },

  {
    id: 'ch13', title: '进阶路线与实战指南', icon: '🗺️', stage: 5,
    desc: 'JavaSE 毕业后去哪里?一张图看懂后端工程师成长路线。',
    sections: [
      {
        id: 'road-next', title: 'JavaSE 之后的路线图', stage: 5,
        desc: '从语法到工程化到分布式',
        blocks: [
          { type: 'code', title: '后端学习路线(按顺序)', code: `JavaSE + Spring 核心(本站第 1~17 章)
     ↓
① 数据库:MySQL(必须)+ SQL 优化入门;JDBC 原生 API(理解连接与事务)
     ↓
② 工程化:Maven 依赖管理 + Git 版本控制(团队协作的通行证)
     ↓
③ JavaWeb:HTTP 协议、Servlet(理解请求-响应模型)、Tomcat
     ↓
④ 主流框架:Spring IoC/AOP/MVC/事务(本站第 14~17 章)
   搭配 MyBatis 操作数据库,再用 Spring Boot 一站式整合
     ↓
⑤ 中间件:Redis 缓存、RabbitMQ/Kafka 消息队列、Elasticsearch 搜索
     ↓
⑥ 分布式与微服务:Spring Cloud、Nacos、网关、分布式事务、Docker/K8s
     ↓
⑦ 底层深化:JVM 调优、并发编程深入(源码级)、设计模式、MySQL/Redis 源码级理解` },
          { type: 'points', title: '每一阶段的检验标准', items: [
            'JavaSE:能独立写"控制台学生管理系统"(增删改查+文件持久化)。',
            '数据库 + JDBC:能写"带数据库的记账本"。',
            'Spring Boot:能写"前后端分离的博客系统"(接口 + MySQL + 登录鉴权)。',
            '中间件 + 微服务:能给博客加缓存、消息、搜索,并部署上线。',
          ] },
          { type: 'note', html: '<b>求职提示</b>:面试核心 = Java 基础(本站内容)+ 集合源码 + 并发 + JVM + MySQL + Redis + 框架原理 + 项目。前四项正是 5-12 章反复强调的"面试重灾区",学的时候多问一个"为什么"。' },
        ]
      },
      {
        id: 'road-practice', title: '学习方法与资源', stage: 5,
        desc: '少走弯路的几条铁律',
        blocks: [
          { type: 'points', title: '高效学习法', items: [
            '<b>代码是敲出来的</b>:看懂 ≠ 会写。每个知识点至少手敲一遍,报错了自己先查 10 分钟。',
            '<b>费曼学习法</b>:学完一个概念,试着用自己的话讲出来(或写博客),讲不清就是没懂。',
            '<b>读源码三步走</b>:先用 → 猜原理 → 验证源码。直接从源码入门是劝退捷径。',
            '<b>善用官方文档</b>:Oracle Java 官方教程、类库 Javadoc 是最权威的一手资料。',
            '<b>刻意练习</b>:LeetCode 简单题练语法(数组、字符串、哈希),配合数据结构课程同步推进。',
          ] },
          { type: 'code', title: '毕业项目建议(由易到难)', code: `Lv1 控制台:银行账户模拟(封装/继承/集合/异常)
Lv2 文件版 :图书馆管理系统(集合 + IO 持久化 + 枚举)
Lv3 多线程:食堂排队模拟 / 多线程下载器(线程池 + 同步)
Lv4 综合战:网络爬虫(IO + 网络编程 + 正则)或 聊天室(Socket + 多线程)
Lv5 函数式:日志分析器(Stream + 正则 + 分组统计)

// 写完记得:抽接口、写注释、处理边界情况 —— 这就是"工程素养"的起点` },
          { type: 'tip', html: '<b>恭喜走完全部 13 章!</b>建议按"学习路线图"检验各阶段项目,全部通关即可自信宣布:JavaSE 毕业了 🎓。本站会持续记录你的学习进度,常回来看看。' },
        ]
      }
    ]
  }
]);
