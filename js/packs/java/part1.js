/* ============ 第 1-2 章:Java 概述 + 基础语法 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch1', title: 'Java 语言概述', icon: '🚀', stage: 1,
    desc: '认识 Java:它是什么、能做什么、为什么 27 年长盛不衰,并跑出第一个程序。',
    sections: [
      {
        id: 'intro-what-is-java', title: 'Java 是什么', stage: 1,
        desc: 'Java 的历史、特点与应用领域',
        blocks: [
          { type: 'text', html: `<p><strong>Java</strong> 是一门由 <strong>James Gosling</strong> 团队于 1995 年在 Sun 公司推出的<strong>面向对象编程语言</strong>,2010 年 Sun 被 Oracle(甲骨文)收购,Java 现由 Oracle 主导维护。它长期占据 TIOBE 编程语言排行榜前列,是企业级后端开发与 Android 开发的基石。</p>` },
          { type: 'text', html: `<p>Java 最著名的口号是 <strong>"Write Once, Run Anywhere"(一次编写,到处运行)</strong>:代码只写一份,编译成字节码后,Windows、Linux、macOS 上的 JVM(Java 虚拟机)都能执行它。</p>` },
          { type: 'table', head: ['特点', '含义'],
            rows: [
              ['跨平台', '字节码运行在 JVM 之上,与操作系统解耦'],
              ['面向对象', '以"类与对象"组织代码,贴近现实思维,易维护易扩展'],
              ['自动内存管理', 'GC(垃圾回收)自动回收无用对象,无需手动 malloc/free'],
              ['强类型', '每个变量必须声明类型,编译期就能发现大量错误'],
              ['多线程', '语言层面内置线程支持,轻松编写并发程序'],
              ['生态庞大', 'Maven、Spring、MyBatis 等框架与海量第三方库'],
            ] },
          { type: 'text', html: `<h3>Java 的三大版本</h3>` },
          { type: 'points', title: '', items: [
            '<b>JavaSE(Standard Edition)</b>:标准版,Java 技术的核心与基础,本站学习内容。',
            '<b>JavaEE(Enterprise Edition)</b>:企业版,在 SE 之上扩展了 Servlet、JSP 等 Web 开发技术(现称 Jakarta EE)。',
            '<b>JavaME(Micro Edition)</b>:微型版,面向嵌入式/移动设备,如今已较少使用。',
          ] },
          { type: 'note', html: '<b>☕ 应用领域</b>:大型网站后端(淘宝、京东)、大数据(Hadoop、Flink、Elasticsearch 皆由 Java/JVM 语言编写)、Android、企业级中间件等。学好 JavaSE 是通往这一切的必经之路。' },
        ]
      },
      {
        id: 'intro-jdk-jre-jvm', title: 'JDK、JRE 与 JVM', stage: 1,
        desc: '三者关系与跨平台原理',
        blocks: [
          { type: 'text', html: `<p>初学者最容易混淆的三个名词,它们是<strong>包含关系</strong>:JDK ⊃ JRE ⊃ JVM。</p>` },
          { type: 'table', head: ['名称', '全称', '作用'],
            rows: [
              ['JVM', 'Java Virtual Machine 虚拟机', '执行字节码(.class),是"跨平台"的关键'],
              ['JRE', 'Java Runtime Environment 运行环境', 'JVM + 核心类库,只运行程序装它即可'],
              ['JDK', 'Java Development Kit 开发工具包', 'JRE + 开发工具(javac 编译器、jdb 调试器等),开发者必装'],
            ] },
          { type: 'text', html: `<h3>跨平台原理</h3><p>源代码 <code class="ic">.java</code> 经 <code class="ic">javac</code> 编译成<strong>字节码</strong> <code class="ic">.class</code>,字节码不面向任何操作系统,而是面向 JVM。不同平台有各自的 JVM 实现,同一份字节码便可在任何平台运行。</p>` },
          { type: 'code', title: '编译与运行流程', code: `Hello.java --javac 编译--> Hello.class(字节码) --JVM 执行--> 各平台运行

# 命令行操作
javac Hello.java     # 编译:生成 Hello.class
java Hello           # 运行:JVM 加载并执行(不要写 .class 后缀)` },
          { type: 'warn', html: '<b>注意</b>:JVM 本身不是跨平台的——不同操作系统要安装对应版本的 JVM/JDK;"跨平台"的是 Java 程序。' },
          { type: 'points', title: '版本选择建议', items: [
            '目前主流企业版本为 <b>Java 8 / 11 / 17 / 21</b>(LTS 长期支持版)。',
            '学习阶段建议用 <b>JDK 17</b> 或 <b>JDK 8</b>:前者是未来趋势,后者与大量旧教程、老项目兼容。',
            'Oracle JDK 与 OpenJDK 语法完全一致,个人学习选任意发行版(如 Oracle、Temurin、阿里 Dragonwell)均可。',
          ] },
        ]
      },
      {
        id: 'intro-hello-world', title: '第一个程序 Hello World', stage: 1,
        desc: '环境搭建、编写、编译、运行',
        blocks: [
          { type: 'text', html: `<p>安装 JDK(配置好 <code class="ic">JAVA_HOME</code> 与 <code class="ic">Path</code>)后,用任意文本编辑器新建 <code class="ic">HelloWorld.java</code>:</p>` },
          { type: 'code', title: 'HelloWorld.java', code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}` },
          { type: 'code', title: '命令行编译并运行', code: `D:\\code> javac HelloWorld.java
D:\\code> java HelloWorld
Hello, World!` },
          { type: 'points', title: '逐行拆解(必须背下来)', items: [
            '<code class="ic">class HelloWorld</code>:定义一个类,类名采用<b>大驼峰命名</b>(每个单词首字母大写)。',
            '<code class="ic">public</code>:访问修饰符;<b>public 类名必须与文件名完全一致</b>(含大小写)。',
            '<code class="ic">main</code> 方法是 JVM 的<b>唯一入口</b>,签名固定:<code class="ic">public static void main(String[] args)</code>。',
            '<code class="ic">String[] args</code>:接收命令行参数;<code class="ic">System.out.println()</code>:向控制台打印一行。',
            '每条语句以 <b>分号 ;</b> 结束;大括号 {} 成对出现,代码块层层嵌套。',
          ] },
          { type: 'warn', html: '<b>常见报错</b>① 文件名与 public 类名不一致 → 编译失败;② 提示 "javac 不是内部或外部命令" → Path 未配置;③ 中文乱码 → 保存编码用 UTF-8 或 ANSI(与控制台一致)。' },
        ]
      },
      {
        id: 'intro-idea', title: '开发工具与注释', stage: 1,
        desc: '用 IDEA 高效写代码,规范写注释',
        blocks: [
          { type: 'text', html: `<p>实际开发几乎都用 <strong>IntelliJ IDEA</strong>(社区版免费):自动补全、错误提示、重构、调试一应俱全。VS Code + Java 插件包是轻量替代。写好文档注释后,还能用 JDK 自带的 <strong>javadoc</strong> 工具把它们一键生成 HTML 格式的 API 手册。IDEA 常用快捷键(Win):</p>` },
          { type: 'table', head: ['快捷键', '功能'],
            rows: [
              ['main + Tab / psvm', '快速生成 main 方法'],
              ['sout', '快速生成 System.out.println()'],
              ['Alt + Enter', '智能修复 / 导包'],
              ['Ctrl + D / Ctrl + Y', '复制行 / 删除行'],
              ['Shift + F6', '重命名变量(智能替换所有引用)'],
              ['Ctrl + Alt + L', '格式化代码'],
            ] },
          { type: 'code', title: '三种注释', code: `// 1. 单行注释:解释下一行代码

/* 2. 多行注释:
      可以写很多行 */

/**
 * 3. 文档注释(javadoc):可被 javadoc 工具提取生成 API 手册
 * @author 作者
 * @version 1.0
 */
public class CommentDemo {
    public static void main(String[] args) {
        System.out.println("注释不参与编译,不影响运行");
    }
}` },
          { type: 'tip', html: '<b>好习惯</b>:注释解释"为什么",而不是复述代码做什么。写代码前先想清楚注释,代码会自然清晰。' },
        ]
      }
    ]
  },

  {
    id: 'ch2', title: '基础语法与流程控制', icon: '🔤', stage: 1,
    desc: '变量、数据类型、运算符、流程控制、方法与数组——一切程序的地基。',
    sections: [
      {
        id: 'basics-types', title: '数据类型与变量', stage: 1,
        desc: '8 大基本类型、类型转换、常量',
        blocks: [
          { type: 'text', html: `<p>Java 是<strong>强类型语言</strong>:变量必须先声明类型再使用。类型分两大类:<strong>基本类型(8 种)</strong>与<strong>引用类型</strong>(类、接口、数组等,后续章节展开)。</p>` },
          { type: 'table', head: ['类型', '关键字', '占用', '范围/说明'],
            rows: [
              ['字节型', 'byte', '1 字节', '-128 ~ 127'],
              ['短整型', 'short', '2 字节', '-32768 ~ 32767'],
              ['整型', 'int', '4 字节', '约 ±21 亿(整数默认类型)'],
              ['长整型', 'long', '8 字节', '很大,字面量加 L:long a = 10L'],
              ['单精度', 'float', '4 字节', '字面量加 F:float f = 3.14F'],
              ['双精度', 'double', '8 字节', '小数默认类型'],
              ['字符型', 'char', '2 字节', '单引号单个字符:char c = \'A\' 或中文 \'好\''],
              ['布尔型', 'boolean', '~', '只有 true / false'],
            ] },
          { type: 'code', title: '变量与常量', code: `public class VarDemo {
    public static void main(String[] args) {
        int age = 25;                 // 变量:值可以改变
        double price = 99.9;
        char gender = '男';
        boolean online = true;
        final double PI = 3.14159;    // final 修饰 => 常量,不可重新赋值
        final int MAX_COUNT;

        age = 26;                     // 合法
        // PI = 3.15;                 // 编译错误:常量不能改

        String name = "张三";          // String 是引用类型,双引号
        System.out.println("姓名:" + name + ",年龄:" + age);
    }
}` },
          { type: 'text', html: `<h3>类型转换</h3>` },
          { type: 'points', title: '', items: [
            '<b>自动类型提升(小 → 大)</b>:byte/short/char → int → long → float → double,直接赋值。<code class="ic">int i = 10; double d = i;</code> ✔',
            '<b>强制转换(大 → 小)</b>:要加 <code class="ic">(类型)</code>,可能丢失精度。<code class="ic">int j = (int) 3.99;  // j = 3(直接截断,不是四舍五入)</code>',
            'byte/short/char 参与运算时<b>自动提升为 int</b>:<code class="ic">byte b1=1, b2=2; byte b3=(byte)(b1+b2);</code> 必须强转。',
          ] },
          { type: 'warn', html: '<b>经典陷阱</b>:<code class="ic">System.out.println(0.1 + 0.2);</code> 输出 0.30000000000000004——浮点数用二进制存储存在精度误差,金额计算请使用 BigDecimal 类。' },
        ]
      },
      {
        id: 'basics-operators', title: '运算符', stage: 1,
        desc: '算术、赋值、比较、逻辑、三元、位运算',
        blocks: [
          { type: 'table', head: ['类别', '运算符', '要点'],
            rows: [
              ['算术', '+ - * / %', '整数相除只留整数:7/2=2,7.0/2=3.5;7%2 取余=1'],
              ['自增自减', '++ --', 'b = a++ 先用后加;b = ++a 先加后用'],
              ['赋值', '= += -= *= /= %=', 's += 2 等价 s = s + 2,且隐含强转'],
              ['比较', '== != > < >= <=', '结果必为 boolean'],
              ['逻辑', '&amp;&amp; || !', '<b>短路</b>:&amp;&amp; 左为假则不算右;|| 左为真则不算右'],
              ['三元', '条件 ? 值1 : 值2', 'int max = a > b ? a : b'],
              ['位运算', '&amp; | ^ ~ &lt;&lt; &gt;&gt; &gt;&gt;&gt;', '针对二进制,面试常用:判断奇偶 n&amp;1、乘除 2 的幂'],
            ] },
          { type: 'code', title: '典型示例', code: `public class OperatorDemo {
    public static void main(String[] args) {
        int a = 10, b = 3;
        System.out.println(a / b);        // 3(整数除法)
        System.out.println(a % b);        // 1(取余)

        int c = 5;
        int d = c++;                      // 先把 c 的值 5 给 d,c 再变 6
        int e = ++c;                      // c 先变 7,再把 7 给 e
        System.out.println(d + "," + e);  // 5,7

        // 短路与:左边为 false 时右边不再计算
        int x = 1;
        // System.out.println(x != 0 && 10 / x > 0);  // 安全写法

        String s = (a > b) ? "a大" : "b大";
        System.out.println(s);            // a大

        // + 的字符串拼接:任意类型与字符串相加都变成字符串
        System.out.println("和为:" + a + b);   // 和为:103(注意逐个拼接!)
        System.out.println("和为:" + (a + b)); // 和为:13(先算括号)
    }
}` },
          { type: 'warn', html: '<b>易错点</b>:逻辑与是 <code class="ic">&amp;&amp;</code>,单个 <code class="ic">&amp;</code> 是位运算(不短路);<code class="ic">"和为:" + a + b</code> 从左到右拼接,结果是 "和为:103" 而非 "和为:13"。' },
        ]
      },
      {
        id: 'basics-flow', title: '流程控制', stage: 1,
        desc: 'if / switch / for / while / break / continue',
        blocks: [
          { type: 'text', html: `<p>程序默认从上到下顺序执行,流程控制让它学会"选择"和"循环"。</p>` },
          { type: 'code', title: '分支:if-else 与 switch', code: `// if-else:范围判断
int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}

// switch:等值判断(JDK 14+ 支持新写法,经典写法如下)
int day = 6;
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("工作日");
        break;                    // 忘记 break 会"穿透"继续执行!
    case 6:
    case 7:
        System.out.println("休息日");
        break;
    default:
        System.out.println("非法日期");
}` },
          { type: 'code', title: '循环:for / while / do-while', code: `// for:明确循环次数(1~100 求和)
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
System.out.println("sum = " + sum);   // 5050

// 嵌套循环:打印 9x9 乘法表
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(j + "*" + i + "=" + (i * j) + "\\t");
    }
    System.out.println();
}

// while:先判断后执行,适合未知次数(如读取用户输入)
// do-while:先执行一次再判断,至少执行一次
int n = 10;
do {
    System.out.println(n);
    n--;
} while (n >= 8);                     // 输出 10 9 8` },
          { type: 'points', title: '跳转语句', items: [
            '<code class="ic">break</code>:跳出<b>当前整个循环</b>;配合标签可跳出外层循环(break outer;)。',
            '<code class="ic">continue</code>:跳过本次循环体,进入下一次循环判断。',
            '<b>最佳实践</b>:循环次数已知用 for;次数未知用 while;死循环写法 <code class="ic">while(true)</code> 常用于菜单程序。',
          ] },
        ]
      },
      {
        id: 'basics-method', title: '方法(函数)', stage: 1,
        desc: '定义、重载、递归、参数传递',
        blocks: [
          { type: 'text', html: `<p>方法(method)是完成特定功能的代码块,把重复逻辑封装起来、一次定义处处调用。语法:<code class="ic">修饰符 返回值类型 方法名(参数列表) { 方法体; return ...; }</code></p>` },
          { type: 'code', title: '方法定义与调用', code: `public class MethodDemo {
    public static void main(String[] args) {
        int result = add(3, 5);           // 调用
        System.out.println(result);        // 8
        printLine();                       // 无返回值方法
    }

    // 有参数有返回值
    static int add(int a, int b) {
        return a + b;
    }

    // void:无返回值,return 可省略或单独写 return; 提前结束
    static void printLine() {
        System.out.println("----------------");
    }
}` },
          { type: 'points', title: '方法重载(Overload)', items: [
            '<b>同一个类</b>中,方法名相同、<b>参数列表不同</b>(个数、类型、顺序)的多个方法互为重载。',
            '与返回值类型、访问修饰符<b>无关</b>——仅返回值不同不算重载,会编译报错。',
            '典型例子:<code class="ic">System.out.println()</code> 有 int、double、String 等几十种重载。',
          ] },
          { type: 'code', title: '递归:阶乘(方法调用自身)', code: `static long factorial(int n) {
    if (n == 1) return 1;          // 递归出口,必须要有,否则栈溢出
    return n * factorial(n - 1);   // 5! = 5 * 4! = ... 
}

// 递归必须注意:① 有出口 ② 问题规模递减 ③ 深度过大会 StackOverflowError` },
          { type: 'note', html: '<b>重要结论</b>:Java 中参数传递是<b>值传递</b>——传基本类型拷贝"值",传对象拷贝"地址值"。方法内改基本类型参数不影响外面;但通过引用修改对象内容(如往数组里放元素)会影响外面。' },
        ]
      },
      {
        id: 'basics-array', title: '数组', stage: 1,
        desc: '一维/二维数组、遍历、Arrays 工具类',
        blocks: [
          { type: 'text', html: `<p>数组是<strong>同一种类型数据的定长容器</strong>,内存中连续存储,通过下标(从 <strong>0</strong> 开始)访问,访问效率极高。</p>` },
          { type: 'code', title: '数组的声明与使用', code: `public class ArrayDemo {
    public static void main(String[] args) {
        // 静态初始化:直接给定元素
        int[] arr1 = {3, 1, 4, 1, 5};
        // 动态初始化:指定长度,元素为默认值(0 / 0.0 / false / null)
        int[] arr2 = new int[5];
        String[] names = new String[3];   // 默认值 null

        arr1[0] = 100;                    // 下标赋值
        System.out.println(arr1.length);  // 5(length 是属性,不是方法)

        // 遍历一:普通 for(需要下标时用)
        for (int i = 0; i < arr1.length; i++) {
            System.out.println(arr1[i]);
        }
        // 遍历二:增强 for(只取值时更简洁)
        for (int x : arr1) {
            System.out.println(x);
        }

        // 最大值(打擂台思想)
        int max = arr1[0];
        for (int i = 1; i < arr1.length; i++) {
            if (arr1[i] > max) max = arr1[i];
        }
        System.out.println("最大值:" + max);
    }
}` },
          { type: 'code', title: '二维数组与 Arrays 工具类', code: `import java.util.Arrays;

public class ArrayTools {
    public static void main(String[] args) {
        // 二维数组:本质是"数组的数组"
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6}
        };
        for (int[] row : matrix) {
            for (int v : row) System.out.print(v + " ");
            System.out.println();
        }

        int[] a = {5, 2, 8, 1};
        Arrays.sort(a);                             // 排序 [1, 2, 5, 8]
        System.out.println(Arrays.toString(a));     // 打印数组必须用它
        int idx = Arrays.binarySearch(a, 5);        // 二分查找(需已排序)=> 2
        int[] b = Arrays.copyOf(a, 6);              // 复制并扩容 [1,2,5,8,0,0]
        System.out.println(Arrays.toString(b));
    }
}` },
          { type: 'warn', html: '<b>两个必考异常</b>:<code class="ic">ArrayIndexOutOfBoundsException</code>(下标越界)、<code class="ic">NullPointerException</code>(数组引用为 null 还去访问元素)。另外直接打印数组名得到的是地址哈希值,要看内容用 Arrays.toString()。' },
          { type: 'tip', html: '<b>阶段小结</b>:到这里你已经能写出"控制台版猜数字、学生成绩统计"等小程序了。动手写 3 个小项目再进入第三章面向对象,理解会顺畅得多。' },
        ]
      }
    ]
  }
]);
