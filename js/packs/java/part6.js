/* ============ 第 14-17 章:Spring 主流框架 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch14', title: 'Spring 概述与 IoC 思想', icon: '🌱', stage: 6,
    desc: '认识 Spring 全家桶,理解它安身立命的核心思想:控制反转与依赖注入。',
    sections: [
      {
        id: 'spring-overview', title: 'Spring 是什么', stage: 6,
        desc: '历史、生态与学习路线',
        blocks: [
          { type: 'text', html: `<p><strong>Spring</strong> 是 2003 年由 <strong>Rod Johnson</strong> 创建的开源轻量级企业级开发框架,核心只有两样东西:<strong>IoC(控制反转)</strong>与 <strong>AOP(面向切面)</strong>。它被称为"一站式框架"——对 MyBatis、JPA、MQ 等主流技术都提供了整合支持,是 Java 后端开发无可争议的事实标准。</p>` },
          { type: 'table', head: ['Spring 生态', '定位', '一句话理解'],
            rows: [
              ['Spring Framework', '核心基础', 'IoC 容器 + AOP + MVC 等一切的地基'],
              ['<b>Spring Boot</b>', '快速构建', '约定大于配置,开箱即用,企业新项目标配'],
              ['Spring MVC', 'Web 框架', '处理 HTTP 请求,前后端分离下负责出接口'],
              ['Spring Cloud', '微服务', '在 Boot 之上构建分布式系统'],
              ['Spring Data / Security', '数据访问 / 安全', '简化数据库操作与认证授权'],
            ] },
          { type: 'points', title: '为什么要学 Spring', items: [
            '<b>解耦</b>:对象的创建与组装交给容器,业务类之间不再硬编码 new。',
            '<b>声明式编程</b>:事务、缓存、日志一个注解搞定,不用侵入业务代码。',
            '<b>就业刚需</b>:招聘 JD 里出现频率最高的关键词,没有之一。',
            '<b>学习顺序</b>:先啃下 Spring 核心思想(IoC/AOP,本阶段前三章)→ 再上 Spring Boot 工程化(天天用)→ 最后 Spring Cloud。',
          ] },
          { type: 'warn', html: '<b>版本提示</b>:Spring 5.x 支持 JDK 8;Spring 6.x 要求 <b>JDK 17+</b>。学概念用哪个版本差别不大,本阶段示例按注解主流写法讲解。' },
        ]
      },
      {
        id: 'spring-ioc-concept', title: 'IoC 与 DI:控制反转', stage: 6,
        desc: '从 new 的痛点理解 Spring 的核心思想',
        blocks: [
          { type: 'text', html: `<p>先看传统开发的痛点:对象都自己 <code class="ic">new</code>,<strong>创建权在程序员手里</strong>,类与类之间强耦合。</p>` },
          { type: 'code', title: '传统方式:换实现就要改源码', code: `class UserService {
    private UserDao dao = new UserDaoMysqlImpl();   // 写死 mysql 实现

    public void register() { dao.save(...); }
}

// 有一天要切到 Oracle:必须回来修改 UserService 源码
// 一个项目成百上千处 new,牵一发而动全身 —— 这就是强耦合` },
          { type: 'text', html: `<p><strong>IoC(Inversion of Control,控制反转)</strong>:把对象的<strong>创建权</strong>从程序员手里"反转"给 Spring 容器——你不自己 new,而是向容器要。它带来的解耦思路是:<strong>面向接口编程 + 由第三方装配</strong>。</p><p><strong>DI(Dependency Injection,依赖注入)</strong>则是 IoC 的<strong>实现手段</strong>:容器创建 Bean 时,自动把它依赖的其他对象"注入"进来(赋给字段/构造参数)。所以常说:<strong>IoC 是思想,DI 是落地方式</strong>。</p>` },
          { type: 'code', title: 'IoC + DI 之后:面向接口,容器装配', code: `interface UserDao { void save(); }                    // 1. 定义接口
class UserDaoMysqlImpl implements UserDao {         // 2. 各实现互不干扰
    public void save() { ... }
}

@Service
class UserService {
    private final UserDao dao;                      // 3. 只依赖接口,不关心实现

    public UserService(UserDao dao) {               // 4. 依赖由容器注入(DI)
        this.dao = dao;
    }
}

// 想换 Oracle 实现?改一处配置(或一个 @Bean),UserService 一行不动 —— 解耦` },
          { type: 'table', head: ['对比', '传统 new', 'IoC 容器'],
            rows: [
              ['创建权', '程序员写死在代码里', 'Spring 容器统一管理'],
              ['耦合度', '类与实现强耦合', '只依赖接口,可整体替换'],
              ['依赖关系', '自己组装,层层传递', '容器自动注入(DI)'],
              ['测试', '难以替换真实依赖', '轻松注入 Mock 对象'],
            ] },
          { type: 'note', html: '<b>一句话理解</b>:以前你是"自己 new 对象的打工人",IoC 之后你是"向容器要对象的甲方"。这个"对象创建权转移"就是控制反转。' },
        ]
      },
      {
        id: 'spring-first-app', title: '第一个 Spring 程序', stage: 6,
        desc: 'XML 与注解两种姿势,认识容器 ApplicationContext',
        blocks: [
          { type: 'text', html: `<p>Spring 容器有两个核心接口:<code class="ic">BeanFactory</code>(最底层,懒加载)与 <code class="ic">ApplicationContext</code>(它的子接口,功能更全:国际化、事件发布、自动注册后处理器,<strong>常用</strong>)。下面用两种方式把对象交给容器管理。</p>` },
          { type: 'code', title: 'Maven 依赖', code: `<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.1.14</version>
</dependency>` },
          { type: 'code', title: '方式一:XML 配置(经典,理解原理用)', code: `<!-- resources/applicationContext.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" ...>
    <!-- id:Bean 的名字;class:全类名 -->
    <bean id="userDao" class="com.demo.dao.UserDaoMysqlImpl"/>
    <bean id="userService" class="com.demo.service.UserService">
        <constructor-arg ref="userDao"/>        <!-- 构造器注入,引用另一个 Bean -->
    </bean>
</beans>

// 启动容器并获取 Bean
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService service = ctx.getBean("userService", UserService.class);
service.register();` },
          { type: 'code', title: '方式二:注解 + Java 配置(现代主流)', code: `// 1. 交给容器管理:@Component 及其语义化注解
@Repository
public class UserDaoMysqlImpl implements UserDao { ... }

// 2. 告诉容器去哪个包扫描这些注解(Java 配置类)
@Configuration
@ComponentScan("com.demo")
public class AppConfig { }

// 3. 基于"注解配置"的容器实现类
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
UserService service = ctx.getBean(UserService.class);   // 按类型获取
service.register();` },
          { type: 'points', title: '容器做的事', items: [
            '读取配置(XML/注解/JavaConfig),知道要管理哪些类 → 这些对象统称 <b>Bean</b>。',
            '启动时(或首次获取时)<b>反射创建</b>所有单例 Bean(呼应第 10 章:Class.forName + newInstance)。',
            '按依赖关系<b>自动装配</b>(DI),并把 Bean 缓存在容器中供全局复用。',
            '<code class="ic">getBean</code>:按名字或按类型两种取法;容器关闭时回调销毁方法。',
          ] },
          { type: 'warn', html: '<b>常见报错</b>:① NoSuchBeanDefinitionException——忘了加 @Component 或没开 @ComponentScan;② NoClassDefFoundError——依赖没引全;③ Bean 名字重复冲突。报错先看"类在不在扫描路径下"。"控制反转"这个词理解后,后面所有注解都是围绕"怎么把类交给容器、怎么把依赖装配进来"两件事。' },
        ]
      }
    ]
  },

  {
    id: 'ch15', title: 'Bean 配置与依赖注入', icon: '🫘', stage: 6,
    desc: '三种装配方式、注入注解全家桶、作用域与生命周期——用 Spring 的日常。',
    sections: [
      {
        id: 'spring-bean-ways', title: 'Bean 的三种装配方式', stage: 6,
        desc: 'XML / 注解扫描 / JavaConfig',
        blocks: [
          { type: 'text', html: `<p>"把类变成 Bean"有三条路:<strong>XML 配置</strong>(老项目)、<strong>注解 + 组件扫描</strong>(自家代码,最常用)、<strong>JavaConfig(@Configuration + @Bean)</strong>(第三方类、需要定制逻辑时)。</p>` },
          { type: 'code', title: '① 注解扫描:自家类的默认选择', code: `@Component        // 通用组件
@Service          // 业务层(Service)
@Repository       // 数据层(Dao)
@Controller       // 控制层(Web)
// 四个注解对 Spring 而言完全等价,都表示"把我注册为 Bean",
// 语义化分层只是让代码更好读 —— 自己写的类,加哪个层级的注解就用哪个

// 开启扫描:XML 用 <context:component-scan base-package="com.demo"/>,
// 注解配置类用 @ComponentScan("com.demo")` },
          { type: 'code', title: '② JavaConfig:第三方类的唯一选择', code: `@Configuration                       // 标记:这是一个配置类,等价于 XML 文件
public class BeanConfig {

    @Bean                             // 方法返回值注册为 Bean,方法名即 Bean 名
    public RestTemplate restTemplate() {
        RestTemplate t = new RestTemplate();
        t.setConnectTimeout(3000);    // 需要定制创建过程时,必须走 @Bean
        return t;
    }

    @Bean
    public ObjectMapper objectMapper(RestTemplate rt) {  // 参数会自动注入(装配依赖)
        return new ObjectMapper();
    }
}
// 第三方 jar 里的类源码改不了,没法加 @Component —— 只能用 @Bean 手工装配` },
          { type: 'code', title: '③ XML:维护老项目时能看懂即可', code: `<bean id="userDao" class="com.demo.dao.UserDaoMysqlImpl">
    <!-- set 注入:name 是属性名,ref 引用其他 Bean,value 是普通值 -->
    <property name="name" value="primary"/>
</bean>

<!-- Spring 4.3+ 注解声明 Bean,与 XML 的 <bean> 等价 -->
<bean id="userService" class="com.demo.service.UserService"/>` },
          { type: 'points', title: '怎么选', items: [
            '自家代码:类上加 <code class="ic">@Component/@Service/@Repository/@Controller</code> + 扫描。',
            '第三方类 / 需要定制创建逻辑:<code class="ic">@Configuration + @Bean</code>。',
            'XML:新项目基本不用,但面试和老系统维护仍需读懂。',
          ] },
        ]
      },
      {
        id: 'spring-di-annotations', title: '依赖注入注解详解', stage: 6,
        desc: '@Autowired / @Qualifier / @Resource / @Value',
        blocks: [
          { type: 'code', title: '注入 Bean 依赖', code: `@Service
public class OrderService {

    // @Autowired:默认【按类型】装配;找不到报错,找到多个再按字段名匹配
    @Autowired
    private PayService payService;

    // 同一类型有多个实现(如 alipay/wechat)时:类型定位 + 名字二选一
    @Autowired
    @Qualifier("wechatPayService")
    private PayService pay;

    // @Resource:JDK 提供的注解,默认【按名称】注入,找不到再按类型
    @Resource(name = "alipayService")
    private PayService aliPay;

    // @Value:注入普通值或配置项(不是 Bean)
    @Value("\${app.name:默认值}")
    private String appName;
}` },
          { type: 'table', head: ['对比', '@Autowired', '@Resource'],
            rows: [
              ['来源', 'Spring 提供', 'JDK 标准(JSR-250)'],
              ['匹配策略', '先按类型 byType', '先按名称 byName'],
              ['多个候选时', '需配 @Qualifier("名字")', '直接 name 属性指定'],
              ['推荐', 'Spring 项目用它', '解耦 Spring,一般项目无差别'],
            ] },
          { type: 'code', title: 'Spring 官方推荐:构造器注入', code: `@Service
public class OrderService {
    private final PayService payService;      // 可以是 final:对象不可变,更安全

    // 只有一个构造器时,@Autowired 都可以省略
    public OrderService(PayService payService) {
        this.payService = payService;          // 构造完成时依赖已就绪,不会出现
    }                                          // "对象创建了但字段还是 null" 的空指针
}

// 三种位置对比:
// 字段注入(最常见):代码最少,但离开容器没法 new,单测不友好
// setter 注入:可选依赖场景
// 构造器注入(官方推荐):依赖不可变、强制显式声明、便于测试` },
          { type: 'warn', html: '<b>经典坑</b>:① 字段注入的对象在构造方法里是 null——容器先反射调构造器、之后才注入字段;② 两个 Bean 互相注入形成<strong>循环依赖</strong>,构造器注入会直接启动失败(Spring 对单例字段注入有三级缓存兜底);能用构造器注入 + 合理分层避免就避免。' },
        ]
      },
      {
        id: 'spring-bean-scope-life', title: '作用域与生命周期', stage: 6,
        desc: 'singleton / prototype 与 Bean 的一生',
        blocks: [
          { type: 'text', html: `<p>同一个 Bean 定义,容器里能有几个实例?由<strong>作用域(scope)</strong>决定:</p>` },
          { type: 'table', head: ['作用域', '含义', '场景'],
            rows: [
              ['<b>singleton</b>(默认)', '整个容器一份实例,全局共享', '无状态 Service/Dao/组件'],
              ['prototype', '每次 getBean 都新建一个', '有状态的、需要独立副本的对象'],
              ['request / session', 'Web 环境:每个请求 / 会话一个', '登录用户信息等'],
            ] },
          { type: 'code', title: '验证 singleton 与 prototype', code: `@Component
@Scope("prototype")
public class Task { }

// 验证
Task t1 = ctx.getBean(Task.class);
Task t2 = ctx.getBean(Task.class);
System.out.println(t1 == t2);       // prototype:false(两个对象)
// 若是 singleton 则为 true —— 同一个对象被所有使用方共享` },
          { type: 'warn', html: '<b>线程安全警示</b>:singleton 的 Bean 被所有请求共享,若定义<strong>可变的成员变量</strong>(如保存请求数据),并发下互相覆盖出 bug。Spring 的 Service 保持<b>无状态</b>(只有 final 依赖与局部变量)是铁律。' },
          { type: 'code', title: '生命周期:Bean 的一生(面试高频)', code: `@Component
public class CacheService {

    @PostConstruct                       // 初始化方法:属性注入完成后自动调用
    public void init() {
        System.out.println("2~3. 依赖就绪,预热缓存");
    }

    @PreDestroy                          // 销毁方法:容器关闭前调用(仅 singleton)
    public void close() {
        System.out.println("5. 释放资源");
    }
}

/* 完整流程(顺序背下来):
   ① 实例化(反射调构造器)
   ② 属性注入(DI,@Autowired/@Value 在这里发生)
   ③ Aware 回调(BeanNameAware / ApplicationContextAware...)
   ④ BeanPostProcessor 前置处理 postProcessBeforeInitialization
   ⑤ 初始化(@PostConstruct / InitializingBean / init-method)
   ⑥ BeanPostProcessor 后置处理 postProcessAfterInitialization   ← AOP 代理就在这里生成!
   ⑦ 使用中(容器里待命)
   ⑧ 容器关闭 → 销毁(@PreDestroy)            */` },
          { type: 'points', title: '两个必考追问', items: [
            '<b>BeanPostProcessor 是什么?</b>:对所有 Bean 初始化前后做统一增强的钩子——<strong>AOP 的代理对象就是它在"后置处理"阶段替换出来的</strong>(见下一章)。',
            '<b>为什么 @Autowired 字段在构造方法里是 null?</b>:顺序是"先构造 → 再注入",构造器执行时字段注入还没发生;需要"构造完就能用"就改构造器注入。',
          ] },
        ]
      }
    ]
  },

  {
    id: 'ch16', title: 'AOP 面向切面与事务', icon: '✂️', stage: 6,
    desc: '把日志、事务这些"横切"逻辑从业务里抽出来,一个注解搞定。',
    sections: [
      {
        id: 'spring-aop-concept', title: 'AOP 思想与术语', stage: 6,
        desc: '横切关注点与五大术语',
        blocks: [
          { type: 'text', html: `<p>日志、事务、权限校验、接口耗时统计……这些逻辑<strong>散落在几乎所有业务方法里</strong>,被称为<strong>横切关注点</strong>。<strong>AOP(Aspect Oriented Programming)</strong> 把它们抽成"切面",在容器创建 Bean 时动态织入,业务代码<strong>零侵入</strong>。</p>` },
          { type: 'code', title: '没有 AOP 的世界', code: `public void createOrder(Order o) {
    long start = System.nanoTime();
    log.info("开始下单");                       // 日志
    try {
        Transaction t = txManager.begin();      // 开事务
        orderDao.insert(o);                     // 业务就这一行
        t.commit();                             // 提交
    } catch (Exception e) {
        txManager.rollback();                   // 回滚
        throw e;
    } finally {
        log.info("耗时 {}", System.nanoTime() - start);   // 计时
    }
}
// 每个 service 方法都复制一遍这套模板 → 30 行里 1 行是业务` },
          { type: 'table', head: ['术语', '含义', '类比'],
            rows: [
              ['Joinpoint 连接点', '程序中可被拦截的点(Spring 中即方法)', '所有能插针的位置'],
              ['Pointcut 切点', '真正要拦截的方法(用表达式筛选)', '实际下针的穴位'],
              ['Advice 通知', '拦截到之后执行的增强逻辑', '针筒里打的药'],
              ['Aspect 切面', '切点 + 通知的组合', '带药的针(整体方案)'],
              ['Weaving 织入', '把切面应用到目标对象生成代理的过程', '扎针动作(运行时代理)'],
            ] },
          { type: 'note', html: '<b>底层原理</b>(呼应第 10 章):Spring AOP 是<b>运行时动态代理</b>——目标类有接口用 <b>JDK 动态代理</b>(Proxy + InvocationHandler),没有接口用 <b>CGLIB</b>(生成子类字节码)。容器里放的其实是"代理对象",调用方法时代理先执行通知逻辑,再调用你的真实方法。' },
          { type: 'tip', html: '<b>判断该不该用 AOP</b>:逻辑"横向重复出现在很多方法里"且"与业务无关"(日志/事务/权限/监控)→ 用 AOP;是业务本身的步骤 → 老老实实写在 Service 里。' },
        ]
      },
      {
        id: 'spring-aop-annotation', title: '注解式 AOP 实战', stage: 6,
        desc: '@Aspect、五种通知与切入点表达式',
        blocks: [
          { type: 'code', title: '一个完整的日志切面', code: `<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
</dependency>

@Aspect                                 // 1. 声明这是一个切面
@Component                              // 2. 切面自己也必须是 Bean,别忘加!
public class LogAspect {

    // 3. 抽取公共切点:拦截 service 包下所有类的所有方法
    @Pointcut("execution(* com.demo.service..*.*(..))")
    public void servicePt() { }

    // 4. 五种通知,各自插入到目标方法的不同时机
    @Before("servicePt()")                              // 前置:方法执行前
    public void before(JoinPoint jp) {
        System.out.println(">>> 进入 " + jp.getSignature());   // 能拿到方法签名/参数
    }

    @AfterReturning(value = "servicePt()", returning = "ret")  // 返回后:正常结束
    public void afterReturning(Object ret) {
        System.out.println("<<< 正常返回:" + ret);
    }

    @AfterThrowing(value = "servicePt()", throwing = "e")      // 异常后:抛异常时
    public void afterThrowing(Exception e) {
        System.out.println("!!! 异常:" + e.getMessage());
    }

    @After("servicePt()")                              // 后置:无论正常异常都执行
    public void after() { System.out.println("--- 结束"); }

    @Around("servicePt()")                             // 环绕:功能最强,包住整个方法
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            Object result = pjp.proceed();             // 放行执行目标方法
            System.out.println("耗时:" + (System.nanoTime() - start) + "ns");
            return result;                             // 必须把结果还回去
        } catch (Throwable e) {
            System.out.println("异常耗时:" + (System.nanoTime() - start));
            throw e;                                   // 异常也要抛出去,不能吞
        }
    }
}` },
          { type: 'text', html: `<h3>切入点表达式速读</h3><p><code class="ic">execution(修饰符 返回值 包名.类名.方法名(参数))</code>,通配符:<code class="ic">*</code> 任意一段,<code class="ic">..</code> 任意层级包或任意参数。</p>` },
          { type: 'code', title: '常用表达式', code: `execution(public * com.demo.service.*.*(..))
//            │      │            │ │ └─ 任意参数
//            │      │            │ └── 任意方法
//            │      │            └── 该包下任意类(* 子包要用 ..:com.demo.service..*)
//            │      └── 任意返回值
//            └── 修饰符可省略:execution(* com.demo..*.*(..))

@annotation(com.demo.annotation.OpLog)      // 第二常用:拦截"带某注解"的方法
// 自定义 @OpLog 注解 + 这个切点 = 想记日志的方法加个注解即可,精准优雅` },
          { type: 'warn', html: '<b>三个高频坑</b>:① @Around 里忘调 <code class="ic">proceed()</code> → 目标方法根本不执行;② 切面类忘加 @Component → 切面完全不生效(没报错,最难查);③ 通知里把异常 catch 住不抛 → 调用方以为没出错。' },
        ]
      },
      {
        id: 'spring-transaction', title: '声明式事务 @Transactional', stage: 6,
        desc: '一个注解管事务,以及它失效的那些坑',
        blocks: [
          { type: 'text', html: `<p>事务保证"要么全成功,要么全回滚"(ACID)。转账就是经典场景:扣钱和加钱必须同生共死。Spring 把"开事务、提交、回滚"这套模板做成了注解 —— 底层就是上一章的 <strong>AOP 环绕通知</strong>。</p>` },
          { type: 'code', title: '基本使用', code: `@Service
public class TransferService {

    @Transactional(rollbackFor = Exception.class)   // 加在方法或类上
    public void transfer(String from, String to, double money) {
        accountDao.decrease(from, money);   // 扣钱
        int x = 1 / 0;                      // 中途炸了
        accountDao.increase(to, money);     // 加钱(不会执行)
    }                                       // 异常抛出 => 两步全部回滚,钱不丢

    // 建议永远显式写 rollbackFor:默认只回滚 RuntimeException 与 Error,
    // 受检异常(IOException 等)默认【不回滚】—— 新手大坑!
}` },
          { type: 'table', head: ['常用参数', '作用', '说明'],
            rows: [
              ['rollbackFor', '哪些异常触发回滚', '建议 Exception.class'],
              ['propagation', '传播行为(嵌套事务怎么办)', '见下表'],
              ['isolation', '隔离级别', '并发下脏读/不可重复读/幻读的取舍'],
              ['readOnly', '只读事务', '查询方法标记,数据库可优化'],
              ['timeout', '超时时间', '防长事务,超时回滚'],
            ] },
          { type: 'points', title: '传播行为(记前两个即可)', items: [
            '<b>REQUIRED(默认)</b>:当前有事务就加入,没有就新建 —— 绝大多数场景。',
            '<b>REQUIRES_NEW</b>:挂起当前事务,开一个全新独立事务 —— "日志必须落库,主业务回滚也不能影响日志"。',
            'SUPPORTS:有就加入,没有就非事务跑;NESTED:嵌套事务(保存点)。',
          ] },
          { type: 'points', title: '事务失效八大场景(面试必考,理解原理即可全记住)', items: [
            '<b>同类自调用</b>:this.transferB() 不走代理,注解形同虚设(最常见!本质:AOP 靠代理对象拦截,自己调自己绕过了代理)。',
            '方法不是 <b>public</b>;或类没被 Spring 管理(没加 @Service)。',
            '异常被 <b>try-catch 吞掉</b>,代理感知不到异常,自然提交。',
            '抛的是受检异常且没配 rollbackFor(默认只回滚 RuntimeException)。',
            '数据库引擎不支持事务(如 MyISAM);多线程里新开的连接不在同一事务。',
          ] },
          { type: 'tip', html: '<b>理解失效的钥匙只有一句话</b>:@Transactional = AOP 代理在方法外帮你 commit/rollback。凡是不经过代理(自调用)、代理看不到异常(被吞)、数据库不配合(引擎/新连接)的写法,事务都会失效。' },
        ]
      }
    ]
  },

  {
    id: 'ch17', title: 'Spring MVC 与 Spring Boot', icon: '🛠️', stage: 6,
    desc: 'Web 接口怎么接请求,Boot 又把配置简化到了什么程度。',
    sections: [
      {
        id: 'springmvc-flow', title: 'Spring MVC 与请求流程', stage: 6,
        desc: 'DispatcherServlet、常用参数注解',
        blocks: [
          { type: 'text', html: `<p><strong>Spring MVC</strong> 是 Spring 的 Web 模块,负责"接收 HTTP 请求 → 调用业务 → 返回响应"。前后端分离时代,它的角色非常纯粹:<strong>接收参数、返回 JSON</strong>。</p>` },
          { type: 'code', title: '一次请求的完整流程', code: `浏览器 GET /users/1
   ↓
DispatcherServlet(前端控制器,一切请求的总入口)
   ↓ HandlerMapping          "这个 URL 该交给哪个方法?" → 找到 getUser
   ↓ HandlerAdapter          执行控制器方法(参数解析、数据绑定在这完成)
   ↓ Controller(@RestController 方法)        你的代码
   ↓ 返回对象 → Jackson 自动序列化为 JSON(HttpMessageConverter)
   ↓
浏览器收到 {"id":1,"name":"张三"}

// 记主线:所有请求先进 DispatcherServlet,它查表找人、调人、打包结果。` },
          { type: 'code', title: '接收参数的四种方式', code: `@RestController                        // = @Controller + @ResponseBody
                                       // 返回值不再是页面,而是直接写进响应体(JSON)
@RequestMapping("/users")
public class UserController {

    @GetMapping("/list")                // ① 查询参数:?page=1&size=10
    public List<User> list(@RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "10") int size) { ... }

    @GetMapping("/{id}")                // ② 路径变量:/users/1
    public User byId(@PathVariable Long id) { ... }

    @PostMapping                        // ③ JSON 请求体:{"name":"张三","age":18}
    public String create(@RequestBody User user) { ... }

    @GetMapping("/search")              // ④ 参数名一致时自动封装(可省注解/整个对象)
    public List<User> search(String keyword, User condition) { ... }
}` },
          { type: 'points', title: '高频对比', items: [
            '<code class="ic">@Controller</code> vs <code class="ic">@RestController</code>:后者多了 @ResponseBody,返回对象直接转 JSON;写接口用 @RestController。',
            '<code class="ic">@RequestParam</code>(?后的参数)vs <code class="ic">@PathVariable</code>(路径里的变量)vs <code class="ic">@RequestBody</code>(JSON 请求体)。',
            'GET 查 / POST 增 / PUT 改 / DELETE 删;<b>GET 传参在 URL,POST 的数据在请求体</b>。',
          ] },
        ]
      },
      {
        id: 'springmvc-rest', title: 'RESTful 接口设计', stage: 6,
        desc: '用 URL 表资源、HTTP 动词表操作',
        blocks: [
          { type: 'text', html: `<p><strong>RESTful</strong> 是一种接口设计风格:URL 只表示<b>资源</b>(名词),"做什么"交给 <b>HTTP 方法</b>(动词)表达。同一套 URL,四种动词四种操作,接口语义一目了然。</p>` },
          { type: 'table', head: ['操作', '方法 + URL', '传统风格(对比)'],
            rows: [
              ['查询列表', 'GET /users', 'GET /user/list'],
              ['查询单个', 'GET /users/1', 'GET /user/getById?id=1'],
              ['新增', 'POST /users', 'POST /user/add'],
              ['修改', 'PUT /users/1', 'POST /user/update'],
              ['删除', 'DELETE /users/1', 'GET /user/delete?id=1'],
            ] },
          { type: 'code', title: '一套标准 CRUD + 统一响应', code: `// 统一响应结构:前端只需判断 code,联调效率翻倍
public record Result<T>(int code, String msg, T data) {
    public static <T> Result<T> ok(T data) { return new Result<>(200, "success", data); }
    public static <T> Result<T> fail(String msg) { return new Result<>(500, msg, null); }
}

@RestController
@RequestMapping("/api/users")
public class UserApiController {

    @Resource private UserService userService;

    @GetMapping
    public Result<List<User>> list() { return Result.ok(userService.findAll()); }

    @GetMapping("/{id}")
    public Result<User> byId(@PathVariable Long id) {
        User u = userService.findById(id);
        return u != null ? Result.ok(u) : Result.fail("用户不存在");
    }

    @PostMapping
    public Result<Void> create(@RequestBody User user) {
        userService.save(user);
        return Result.ok(null);
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody User user) { ... }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) { ... }
}
// 测试不用等前端:Postman / Apifox 直接发请求验证每个接口` },
          { type: 'note', html: '<b>前后端分工</b>:后端只负责提供这类 JSON 接口(数据 + 状态码),页面渲染完全交给前端(Vue/React)。这也是"接口文档"的由来——URL、参数、返回结构约定好,两端并行开发。' },
        ]
      },
      {
        id: 'springboot-overview', title: 'Spring Boot 快速开发', stage: 6,
        desc: '约定大于配置、自动配置原理、yml',
        blocks: [
          { type: 'text', html: `<p>Spring 好用但配置繁琐:整合 MyBatis 要一堆 XML、依赖版本要自己配平、还要外置 Tomcat。<strong>Spring Boot</strong> 的三板斧解决一切:<strong>起步依赖(starter)</strong>一个坐标拉齐全家桶、<strong>自动配置</strong>把常见配置按约定默认好、<strong>内嵌 Tomcat</strong>打成 jar 直接跑。</p>` },
          { type: 'code', title: '一个最小可运行的 Web 服务', code: `// pom.xml 只要一个 starter(它会把 spring-mvc、tomcat、jackson 全带上)
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

@SpringBootApplication                 // 灵魂注解(拆解见下)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);   // 启动即内嵌 Tomcat
    }
}

@RestController
@RequestMapping("/hello")
public class HelloController {
    @GetMapping
    public String hello() { return "Hello, Spring Boot!"; }
}
// 浏览器访问 http://localhost:8080/hello —— 到此一个后端服务就跑起来了` },
          { type: 'code', title: '@SpringBootApplication 拆解', code: `@SpringBootConfiguration   // 本质是 @Configuration:本类是一个配置类
@EnableAutoConfiguration   // 开启自动配置(核心!)
@ComponentScan             // 扫描本包及子包的 @Component/@Service/...

// 自动配置通俗原理(面试简答版):
// ① 启动时读取 META-INF 里预置的"自动配置类清单"(一百多个 XxxAutoConfiguration)
// ② 每个配置类上都有条件注解:@ConditionalOnClass(类路径有它才生效)、
//    @ConditionalOnMissingBean(用户没自己配才生效)...
// ③ 于是"你引了什么 starter,我就自动配什么" —— 引了 spring-boot-starter-data-redis,
//    RedisTemplate 就自动就绪;不想用默认?自己写个 Bean 覆盖即可` },
          { type: 'code', title: 'application.yml:所有配置集中一处', code: `# src/main/resources/application.yml(约定好的配置文件名)
server:
  port: 8080                          # 改端口,不用碰代码

spring:
  datasource:                         # 引入 starter-jdbc/druid 后自动装配
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false
    username: root
    password: "123456"
    driver-class-name: com.mysql.cj.jdbc.Driver

# 代码里取值:@Value("\${server.port}") 或 @ConfigurationProperties(prefix="spring.datasource")` },
          { type: 'points', title: '常用 starter 速查', items: [
            '<code class="ic">spring-boot-starter-web</code>:Web 开发(MVC + Tomcat + JSON)。',
            '<code class="ic">spring-boot-starter-test</code>:单元测试(JUnit 5 + MockMvc)。',
            '<code class="ic">spring-boot-starter-data-redis</code> / <code class="ic">-cache</code>:缓存。',
            '整合 MyBatis 用 <code class="ic">mybatis-spring-boot-starter</code>(第三方提供的 starter,机制相同)。',
          ] },
          { type: 'tip', html: '<b>Boot 与 Spring 的关系一句话</b>:Boot 不是替代 Spring,而是"把 Spring 从配置地狱里捞出来"的脚手架——地基永远是 IoC + AOP。所以先学 Spring 原理再用 Boot,出问题才追得到根因;这也是本站把框架放在 JavaSE 之后的原因。🎉 恭喜:学到这里,你已经可以独立搭建"接口 + 数据库"的后端小项目了!' },
        ]
      }
    ]
  }
]);
