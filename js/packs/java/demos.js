/* ============ 从零构建演示题库:按章节 id 组织 ============
   每步 c=本轮敲入的代码 t=讲解 std=编码规范点(可选)      */
window.BUILD_DEMOS = {

  'ch1': { title: 'HelloWorld', steps: [
    { c: 'public class HelloWorld {\n\n}',
      t: '一切 Java 代码都写在类里:类是组织代码的基本单位,先用大括号圈出"这个类的地盘"。现在文件还是空的,我们从第一行敲起。',
      std: '📐 规范:类名用大驼峰(每个单词首字母大写);public 类名必须与文件名完全一致,即 HelloWorld.java。' },
    { c: '    public static void main(String[] args) {\n\n    }',
      t: 'main 方法是 JVM 的唯一入口,程序从这里开始执行。这个签名是固定搭配,先整体照抄记住,每个词的含义后面章节逐一拆解。',
      std: '📐 规范:每层代码缩进 4 个空格;大括号成对出现,先写完一对再往里填。' },
    { c: '        System.out.println("Hello, World!");',
      t: '向控制台打印一行文字。语句以分号结尾——分号就是 Java 的"句号",一行一条语句。',
      std: '📐 规范:字符串用双引号;一行只写一条语句,太长就换行对齐。' },
    { c: '        System.out.println("我的第一个 Java 程序");',
      t: '再打印一句,顺便验证:中文字符串完全支持。把引号里的内容换成你想说的话,保存重新运行试试。' },
    { c: '// 编译:javac HelloWorld.java\n// 运行:java HelloWorld\n// 输出:\n// Hello, World!\n// 我的第一个 Java 程序',
      t: '命令行两步走:先 javac 把源码编译成字节码,再 java 交给 JVM 运行。用 IDEA 的话,点左侧绿色三角即可。你的第一个程序完成了 🎉' }
  ]},

  'ch2': { title: '成绩评级小程序', steps: [
    { c: 'public class ScoreReport {\n    public static void main(String[] args) {\n\n    }\n}',
      t: '写任何程序都先搭"外壳":类 + main 方法。把结构先写完整,再往里填逻辑——这是避免括号错乱的好习惯。',
      std: '📐 规范:先写完整大括号结构再填内容;文件名与 public 类名一致。' },
    { c: '        int score = 85;',
      t: '声明变量存成绩:int 整型,声明与赋值一行完成。变量就是程序里"带名字的盒子"。',
      std: '📐 规范:变量名小驼峰且见名知义——用 score 而不是 s;一行声明一个变量。' },
    { c: '        if (score >= 90) {\n            System.out.println("优秀");\n        } else if (score >= 60) {\n            System.out.println("及格");\n        } else {\n            System.out.println("不及格");\n        }',
      t: '分级判断:if / else if / else 链,从高到低依次检查,命中即止——像漏斗层层筛选。',
      std: '📐 规范:区间判断统一方向(从大到小),避免条件重叠或漏掉边界。' },
    { c: '        for (int i = 1; i <= 3; i++) {\n            System.out.println("第 " + i + " 次查询完毕");\n        }',
      t: 'for 循环三要素:初始化(int i=1)、条件(i<=3)、步进(i++)。体会"同一段代码执行多次"。',
      std: '📐 规范:字符串拼接数值时加括号,如 ("第 " + (i + 1) + " 次"),否则会按字符串逐个拼接。' },
    { c: '// 输出:\n// 及格\n// 第 1 次查询完毕\n// 第 2 次查询完毕\n// 第 3 次查询完毕',
      t: '运行验证。动手把 score 改成 95、58 多跑几次——改参数观察分支变化,是最快的巩固方式。' }
  ]},

  'ch3': { title: 'Student 标准类', steps: [
    { c: 'public class Student {\n\n}',
      t: '定义学生类:类是"模板",描述学生有什么属性、什么行为。本次从零写一个规范的数据类。',
      std: '📐 规范:一个类一个 .java 文件;类名大驼峰、名词。' },
    { c: '    private String name;\n    private int age;',
      t: '属性(成员变量)用 private 封装:外界不能直接访问字段,必须通过方法——这是面向对象的第一原则。',
      std: '📐 规范:成员变量一律 private;命名小驼峰。' },
    { c: '    public Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }',
      t: '有参构造:创建对象的同时赋值。this.name 指成员变量,name 是参数——this 用来区分"我的"和"传进来的"。',
      std: '📐 规范:构造方法名=类名、无返回值类型;参数与属性同名时必须用 this.。' },
    { c: '    public int getAge() { return age; }\n\n    public void setAge(int age) {\n        if (age < 0 || age > 150) {\n            throw new IllegalArgumentException("年龄非法:" + age);\n        }\n        this.age = age;\n    }',
      t: 'getter/setter:读走 get、写走 set。setAge 里加校验,非法数据直接抛异常——数据只能按规则进门,这就是封装的价值。',
      std: '📐 规范:getXxx/setXxx 是 IDE 和框架识别的标准命名,不要自创拼法。' },
    { c: '    @Override\n    public String toString() {\n        return "Student{name=" + name + ", age=" + age + "}";\n    }',
      t: '重写 toString:打印对象时显示内容而不是地址。@Override 注解让编译器帮你核对签名,写错立刻报错。',
      std: '📐 规范:凡是重写父类方法,一律加 @Override。' },
    { c: '    public static void main(String[] args) {\n        Student stu = new Student("张三", 18);\n        System.out.println(stu);\n        stu.setAge(200);   // 将触发校验异常\n    }',
      t: 'main 自测:new 对象、打印、喂一个非法年龄验证校验。写完类永远写个 main 跑一遍——不要写完就交。',
      std: '📐 规范:自测代码可以放 main 里,验证通过后再删除或保留均可。' }
  ]},

  'ch4': { title: '字符串分析器', steps: [
    { c: 'public class TextAnalyzer {\n    public static void main(String[] args) {\n        String text = "Hello Java, hello World";\n\n    }\n}',
      t: '骨架 + 待分析文本。String 是引用类型,内容用双引号——本次用常用 API 对它做一串分析。' },
    { c: '        System.out.println("长度:" + text.length());',
      t: 'length() 取字符数。注意:字符串的长度是方法 length(),数组的长度是属性 length——两个最容易混的兄弟。',
      std: '📐 规范:输出信息带上说明文字("长度:"),而不是裸打印数字,便于阅读。' },
    { c: '        String lower = text.toLowerCase();\n        int count = 0;\n        for (int i = 0; i < lower.length(); i++) {\n            if (lower.charAt(i) == \'l\') {\n                count++;\n            }\n        }\n        System.out.println("字母 l 出现:" + count + " 次");',
      t: '统计字母 l:先统一转小写,再按下标遍历,charAt(i) 取出单个字符与 \'l\' 比较。计数器 count 从 0 起步。',
      std: '📐 规范:统计变量命名为 count/total/sum,初值 0;单字符用单引号 char,不用双引号。' },
    { c: '        boolean has = text.contains("Java");\n        System.out.println("包含 Java?" + has);\n\n        String replaced = text.replace("hello", "你好");\n        System.out.println(replaced);',
      t: 'contains 查包含、replace 替换。关键认知:String 不可变!这些方法都返回【新串】,必须用变量接住——原串永远不变。',
      std: '📐 规范:方法返回值要么接住使用,要么直接打印;调用后丢弃返回值是常见 bug。' },
    { c: '// 输出:\n// 长度:23\n// 字母 l 出现:5 次\n// 包含 Java?true\n// Hello Java, 你好 World',
      t: '运行对照输出。把统计目标改成 \'a\'、把 replace 的参数换掉再跑——每个 API 都亲手改一次才算学会。' }
  ]},

  'ch5': { title: '学生名单管理', steps: [
    { c: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class StudentManager {\n    public static void main(String[] args) {\n\n    }\n}',
      t: '集合类都在 java.util 包,用之前先 import。骨架照旧。',
      std: '📐 规范:import 放文件顶部;按需导入具体类,不使用 import java.util.*(阿里规约禁止星号导入)。' },
    { c: '        List<String> names = new ArrayList<>();',
      t: '声明用接口 List、创建用 ArrayList:面向接口编程,以后想换 LinkedList,这一行改个右边就完事。',
      std: '📐 规范:左边写接口类型 List<String>;泛型写明元素类型;右边尖括号可省略(菱形推断)。' },
    { c: '        names.add("张三");\n        names.add("李四");\n        names.add("王五");\n        System.out.println(names);',
      t: 'add 追加元素。集合重写过 toString,直接 println 就能看到内容——和数组打印地址的行为完全不同。' },
    { c: '        names.remove("李四");\n        names.set(0, "张三丰");\n        System.out.println(names.size() + " 人:" + names);',
      t: 'remove 按对象删、set 按下标改、size 看个数。集合长度是方法 size(),别写成 length。',
      std: '📐 规范:能用"按对象删除"就别记下标,下标容易错位。' },
    { c: '        for (String name : names) {\n            if (name.startsWith("张")) {\n                System.out.println("找到:" + name);\n            }\n        }',
      t: '增强 for 遍历 + 条件筛选——"遍历+判断"是集合最常用的组合拳,业务代码里天天写。',
      std: '📐 规范:只需要取值、不需要下标时,优先用增强 for,简洁且不会越界。' }
  ]},

  'ch6': { title: '健壮的成绩录入', steps: [
    { c: 'public class ScoreInput {\n    public static void main(String[] args) {\n        String[] inputs = {"95", "88", "abc", "76"};\n\n    }\n}',
      t: '模拟一批用户输入,故意混入脏数据 "abc"——真实程序的输入永远不可信,防御要从第一行写起。' },
    { c: '        int total = 0;\n        int valid = 0;',
      t: '两个统计变量:total 累加总分、valid 计有效条数。先声明初值,逻辑清清楚楚。',
      std: '📐 规范:累加器/计数器命名表意,初始化为 0 并紧跟使用处声明。' },
    { c: '        for (String input : inputs) {\n            try {\n                int score = Integer.parseInt(input);\n                total += score;\n                valid++;\n                System.out.println("录入成功:" + score);\n            } catch (NumberFormatException e) {\n                System.out.println("跳过非法输入:" + input);\n            }\n        }',
      t: '把"可能出错的解析"关进 try;一旦抛异常,catch 接住、跳过这条脏数据、循环继续——程序不崩,这就是健壮性。',
      std: '📐 规范:catch 精确到具体异常类型;catch 里必须有实际处理动作,严禁空 catch。' },
    { c: '        System.out.println("有效 " + valid + " 条,总分 " + total\n                + ",平均 " + (valid == 0 ? 0 : (double) total / valid));',
      t: '汇总输出,两处细节:三元运算防除零;(double) 强转保住小数——都是实战高频易错点。',
      std: '📐 规范:长表达式在运算符前换行并对齐缩进,提高可读性。' },
    { c: '// 输出:\n// 录入成功:95\n// 录入成功:88\n// 跳过非法输入:abc\n// 录入成功:76\n// 有效 3 条,总分 259,平均 86.33...',
      t: '运行对照:脏数据被跳过、合法数据全部入库。试着往数组里再加一个 "12x",验证防御依然有效。' }
  ]},

  'ch7': { title: '泛型箱子 MyBox<T>', steps: [
    { c: 'public class MyBox<T> {\n\n}',
      t: '定义泛型类:T 是类型占位符,创建对象时才确定装什么——同一个类,能安全地装任何类型。',
      std: '📐 规范:类型参数用单个大写字母:E 元素、T 类型、K/V 键值,见名知义。' },
    { c: '    private T content;',
      t: '属性类型写 T:定义时不知道是什么,但保证"同一个箱子,从生到死只有这一种类型"。' },
    { c: '    public void put(T content) { this.content = content; }\n\n    public T get() { return content; }',
      t: '参数、返回值都能用 T:存进去什么类型,取出来就是什么类型——全程无需强转。' },
    { c: '    public static void main(String[] args) {\n        MyBox<String> wordBox = new MyBox<>();\n        wordBox.put("泛型真香");\n        String s = wordBox.get();      // 无需强转\n\n        MyBox<Integer> numBox = new MyBox<>();\n        numBox.put(42);\n\n        // wordBox.put(123);   // 编译直接报错!\n    }',
      t: '使用泛型:尖括号指定真实类型。注意被注释的那行——放错类型,编译期当场标红,而不是运行时才炸。',
      std: '📐 规范:泛型只支持引用类型,List<int> 非法,要用 List<Integer>。' },
    { c: '// 没有泛型的世界:取出全是 Object,强转错了运行时才崩\n// 有泛型的世界:类型错误编译期就被拦下\n// 泛型 = 编译期的类型护栏',
      t: '总结这一章的核心:泛型把类型检查从"运行时爆炸"提前到"编译时报警"。下一章集合的 List<String> 全靠它撑腰。' }
  ]},

  'ch8': { title: '文件写入与按行读取', steps: [
    { c: 'import java.io.*;\n\npublic class NoteDemo {\n    public static void main(String[] args) {\n\n    }\n}',
      t: 'IO 家族都在 java.io 包。本次目标:把两行文字写进文件,再按行读回来。' },
    { c: '        try (FileWriter writer = new FileWriter("note.txt")) {\n            writer.write("第一行:学 IO 流\\n");\n            writer.write("第二行:自动关流\\n");\n        } catch (IOException e) {\n            System.out.println("写入失败:" + e.getMessage());\n        }',
      t: 'try-with-resources:资源写在括号里,作用域结束自动 close——从根上杜绝"忘记关流"。\\n 是换行符,两个字符。',
      std: '📐 规范:文件操作必须处理 IOException;优先 try-with-resources,不手写 finally close。' },
    { c: '        try (BufferedReader reader = new BufferedReader(\n                new FileReader("note.txt"))) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                System.out.println("读到:" + line);\n            }\n        } catch (IOException e) {\n            System.out.println("读取失败:" + e.getMessage());\n        }',
      t: '缓冲流按行读:readLine() 返回 null 表示文件读完,直接当循环条件。外层 FileReader 包进 BufferedReader——装饰器模式,越包越强。',
      std: '📐 规范:构造参数换行时缩进对齐,让"谁包谁"一目了然。' },
    { c: '// 控制台输出:\n// 读到:第一行:学 IO 流\n// 读到:第二行:自动关流\n//\n// 项目目录同时生成了 note.txt,打开对照',
      t: '运行后打开项目目录里的 note.txt 对照。试着把读取的文件名改成不存在的路径,观察 catch 分支输出——错误处理也是功能。' }
  ]},

  'ch9': { title: '线程安全卖票', steps: [
    { c: 'public class Ticket implements Runnable {\n    private int tickets = 50;\n\n    @Override\n    public void run() {\n\n    }\n}',
      t: '实现 Runnable 定义任务:tickets 是共享数据,50 张票由所有窗口(线程)一起卖。',
      std: '📐 规范:任务类实现 Runnable 而不是继承 Thread——不占用宝贵的继承名额。' },
    { c: '        while (true) {\n            synchronized (this) {\n                if (tickets <= 0) break;\n                System.out.println(Thread.currentThread().getName()\n                        + " 卖出第 " + tickets-- + " 张");\n            }\n        }',
      t: '同步代码块锁住"判断+打印+减票"三步:一个窗口卖票时其他窗口只能排队——杜绝卖出 0 票、-1 票。',
      std: '📐 规范:临界区必须完整,余票判断也要在锁内;锁对象对所有线程唯一(this 被三个线程共享)。' },
    { c: '    public static void main(String[] args) {\n        Ticket task = new Ticket();          // 一份票\n        new Thread(task, "窗口1").start();\n        new Thread(task, "窗口2").start();\n        new Thread(task, "窗口3").start();\n    }',
      t: '一个 Ticket 实例交给三个线程——共享才有竞争,有竞争才需要锁。注意是 start() 启动,写 run() 就变成单线程了!',
      std: '📐 规范:给线程命名("窗口1"),排查问题时日志才能分清谁是谁。' },
    { c: '// 输出(每次顺序不同,但票号绝不重复、绝不为负):\n// 窗口2 卖出第 50 张\n// 窗口1 卖出第 49 张\n// ...(交错进行)\n// 窗口3 卖出第 1 张',
      t: '多跑几次:卖票顺序随机(线程调度不可控),但结果正确性由 synchronized 保证。删掉 synchronized 再跑——亲眼看看超卖惨案。' }
  ]},

  'ch10': { title: '反射三连', steps: [
    { c: 'import java.lang.reflect.*;\n\npublic class ReflectDemo {\n    public static void main(String[] args) throws Exception {\n        Class<?> clazz = Class.forName("java.util.ArrayList");\n        System.out.println("类名:" + clazz.getName());\n    }\n}',
      t: '第一连:Class.forName 按全类名加载类。注意引号里是字符串——它完全可以来自配置文件,这就是框架"配置驱动"的起点。' },
    { c: '        Constructor<?> ctor = clazz.getConstructor();\n        Object list = ctor.newInstance();\n        System.out.println(list instanceof java.util.ArrayList);   // true',
      t: '第二连:拿构造器、newInstance 造对象。代码里没有一个 new ArrayList——对象照样造出来了,Spring 创建 Bean 就是这一步。' },
    { c: '        Method add = clazz.getMethod("add", Object.class);\n        add.invoke(list, "反射添加的元素");\n        System.out.println(list);',
      t: '第三连:getMethod 拿方法 + invoke 执行。连方法名都是字符串——运行期想调什么,完全可以由外部决定。' },
    { c: '// 反射三连:forName 找类 → newInstance 造对象 → invoke 调方法\n// 全程没有出现任何 ArrayList 的直接引用',
      t: '对照:普通写法一切在编译期写死;反射写法一切在运行期决定。Spring 靠"扫描注解 + 这三连"就能装配你写的所有 Bean。' }
  ]},

  'ch11': { title: 'Stream 流水线', steps: [
    { c: 'import java.util.*;\nimport java.util.stream.*;\n\nrecord Employee(String name, String dept, double salary) { }',
      t: '准备数据:record 一行定义员工类(JDK16+),自动生成构造器、getter、toString——样板代码直接消失。',
      std: '📐 规范:纯数据载体优先用 record,而不是手写 JavaBean。' },
    { c: 'List<Employee> emps = List.of(\n    new Employee("张三", "开发", 15000),\n    new Employee("李四", "测试", 9000),\n    new Employee("王五", "开发", 18000));',
      t: 'List.of 快速创建不可变列表——造测试数据的标准姿势,一行一个元素竖着排。' },
    { c: 'List<String> devs = emps.stream()\n    .filter(e -> e.dept().equals("开发"))\n    .map(Employee::name)\n    .collect(Collectors.toList());\nSystem.out.println(devs);   // [张三, 王五]',
      t: '传统写法要两层 for + 临时集合,流水线三步完事:filter 筛部门 → map 取姓名 → collect 收集。代码读起来就是需求本身。',
      std: '📐 规范:链式调用一行一步、像楼梯对齐,严禁挤成一行长链。' },
    { c: 'double avg = emps.stream()\n    .filter(e -> e.dept().equals("开发"))\n    .mapToDouble(Employee::salary)\n    .average()\n    .orElse(0);\nSystem.out.println("开发部平均:" + avg);   // 16500.0',
      t: '数值流 mapToDouble → average 求平均,orElse 给空结果兜底——Optional 让"可能没数据"的处理写进一行。' },
    { c: '// 命令式:循环 + 计数器 + if,5~8 行,关注"怎么做"\n// 声明式:filter/map/collect,3 行,声明"要什么"\n// 且无中间可变状态,天然适合并行',
      t: '两种范式对照:Stream 把"怎么做"交给库,你只负责"要什么"。改需求时只改链上的一个算子——这才是真正的好处。' }
  ]},

  'ch12': { title: '内存与 GC 观察', steps: [
    { c: 'public class MemoryWatch {\n    public static void main(String[] args) throws Exception {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println("JVM 最大内存:" + rt.maxMemory() / 1024 / 1024 + " MB");\n    }\n}',
      t: 'Runtime 是程序观察自己 JVM 的窗口:maxMemory 看上限。除两次 1024 把字节换算成 MB。' },
    { c: '    static void showMemory(String tag) {\n        Runtime rt = Runtime.getRuntime();\n        long used = (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024;\n        System.out.println(tag + " 已用堆:" + used + " MB");\n    }',
      t: '封装一个观察方法:已用 = 总内存 - 空闲。重复的观察逻辑抽成方法,main 里每次调用只需一行。',
      std: '📐 规范:重复两次以上的逻辑就封装成方法;工具方法命名动词开头(showMemory)。' },
    { c: '        showMemory("分配前");\n        byte[] big = new byte[50 * 1024 * 1024];   // 50MB\n        showMemory("分配 50MB 后");',
      t: '一口气 new 50MB 大对象,前后对比已用堆。这样的"大对象"会跳过新生代直接进入老年代——分代假设的体现。' },
    { c: '        big = null;                    // 断开引用\n        System.gc();                   // 礼貌性建议 GC(不保证立即执行)\n        Thread.sleep(300);\n        showMemory("置空并建议 GC 后");',
      t: '置 null 断开引用后 System.gc() 建议回收。观察内存回落——不可达对象正在被 GC 自动清理,这就是"自动内存管理"。' },
    { c: '// 输出(数值因环境而异):\n// JVM 最大内存:4096 MB\n// 分配前 已用堆:5 MB\n// 分配 50MB 后 已用堆:55 MB\n// 置空并建议 GC 后 已用堆:6 MB',
      t: '数值回落后说明:JVM 分代管理堆、GC 自动回收不可达对象。生产环境不会手动调 gc()——理解机制即可,交给 JVM 自己调度。' }
  ]},

  'ch13': { title: '控制台学生系统骨架', steps: [
    { c: 'import java.util.*;\n\npublic class StudentSystem {\n    private static final List<String> NAMES = new ArrayList<>();\n    private static final Scanner SCANNER = new Scanner(System.in);',
      t: '毕业项目起步:集合存数据、Scanner 收输入。static final 常量属于类,全程共享一份。',
      std: '📐 规范:常量命名全大写+下划线(NAMES、SCANNER);类只做调度,功能各自成方法。' },
    { c: '    public static void main(String[] args) {\n        while (true) {\n            System.out.println("\\n1.添加 2.列表 3.删除 0.退出");\n            String op = SCANNER.nextLine();\n            switch (op) {\n                case "1" -> add();\n                case "2" -> list();\n                case "3" -> remove();\n                case "0" -> { return; }\n                default -> System.out.println("无效选项");\n            }\n        }\n    }',
      t: '菜单主循环:while(true) + switch 分发——控制台系统的标准骨架。JDK14 箭头语法免 break,清爽不穿透。',
      std: '📐 规范:main 只做"调度",每个功能一个方法——从第一个项目就养成职责分离。' },
    { c: '    static void add() {\n        System.out.print("姓名:");\n        NAMES.add(SCANNER.nextLine());\n        System.out.println("已添加");\n    }',
      t: '增:收集输入存入集合。方法短小、名字即功能,读 main 就知道系统能干什么。' },
    { c: '    static void list() {\n        if (NAMES.isEmpty()) {\n            System.out.println("暂无学生");\n            return;\n        }\n        for (int i = 0; i < NAMES.size(); i++) {\n            System.out.println((i + 1) + ". " + NAMES.get(i));\n        }\n    }',
      t: '查:先判空提前 return(卫语句),主逻辑不缩进;列表带序号,为删除功能做铺垫。',
      std: '📐 规范:异常/边界情况用卫语句提前返回,避免主逻辑嵌套过深。' },
    { c: '    static void remove() {\n        list();\n        System.out.print("删除序号:");\n        int idx = Integer.parseInt(SCANNER.nextLine()) - 1;\n        if (idx >= 0 && idx < NAMES.size()) {\n            NAMES.remove(idx);\n            System.out.println("已删除");\n        } else {\n            System.out.println("序号非法");\n        }\n    }',
      t: '删:展示 → 输入 → 校验 → 操作。边界判断(0 <= idx < size)是新手 Bug 重灾区,永远先校验再动集合。',
      std: '📐 规范:任何用户输入使用前都过一遍合法性校验——与第 6 章的防御思想一脉相承。' },
    { c: '// 60 行,跑起来就是一个能交互的系统\n// 用到的知识:集合、循环、分支、方法封装、输入处理\n// 扩展方向:加成绩字段(Map 存储)、文件持久化、按姓名查找',
      t: '你已经具备写它的全部知识——把这个骨架扩展成自己的 Lv2 毕业项目吧,毕业近在眼前。' }
  ]},

  'ch14': { title: '把对象交给 Spring', steps: [
    { c: 'public class UserDaoMysqlImpl implements UserDao {\n    @Override\n    public void save() { System.out.println("mysql 保存成功"); }\n}',
      t: '先写实现类:面向 UserDao 接口编程,实现随时可换——这是后面一切解耦的前提。' },
    { c: '<!-- applicationContext.xml(XML 时代) -->\n<bean id="userDao" class="com.demo.UserDaoMysqlImpl"/>',
      t: 'XML 时代:类与 Bean 的映射写在配置文件。要换 Oracle 实现?改这一行 class 即可,Java 代码一行不动——解耦的雏形。' },
    { c: '@Repository                       // 注解时代\npublic class UserDaoMysqlImpl implements UserDao {\n    @Override\n    public void save() { System.out.println("mysql 保存成功"); }\n}',
      t: '注解时代:一个 @Repository 直接标在类上,XML 里的那一行就消失了。"我是数据层组件"一目了然。',
      std: '📐 规范:分层注解各归其位——@Controller 控制层、@Service 业务层、@Repository 数据层,别混用。' },
    { c: '@Configuration\n@ComponentScan("com.demo")\npublic class AppConfig { }',
      t: '告诉容器去哪扫描:一句 @ComponentScan("包名") 顶替一段 XML 配置。容器启动时会把这个包翻个底朝天。' },
    { c: 'ApplicationContext ctx =\n    new AnnotationConfigApplicationContext(AppConfig.class);\nUserDao dao = ctx.getBean(UserDao.class);\ndao.save();',
      t: '启动容器、按类型取 Bean。从这一行起,对象的创建权就交给了 Spring——这就是"控制反转"四个字的落地瞬间。' }
  ]},

  'ch15': { title: 'JavaConfig 装配车间', steps: [
    { c: '@Configuration\npublic class BeanConfig {\n\n}',
      t: '@Configuration 标记配置类:它等价于一份 XML 文件,但类型安全、能断点调试、放在包里好管理。' },
    { c: '    @Bean\n    public RestTemplate restTemplate() {\n        RestTemplate t = new RestTemplate();\n        t.setConnectTimeout(3000);\n        return t;\n    }',
      t: '@Bean 注册第三方类:jar 包里的类改不了源码、加不了 @Component,只能在"装配车间"里手工创建——方法返回值进容器。',
      std: '📐 规范:@Bean 方法名即 Bean 名,取名体现用途 restTemplate,而不是 template1 这种无意义名。' },
    { c: '    @Bean\n    public ObjectMapper objectMapper() {\n        return new ObjectMapper();\n    }',
      t: '再装一台:多个 @Bean 方法互不干扰。参数还能自动注入——车间里设备之间自动连线。' },
    { c: 'ApplicationContext ctx =\n    new AnnotationConfigApplicationContext(BeanConfig.class);\nRestTemplate rt = ctx.getBean(RestTemplate.class);\nSystem.out.println(rt.getClass());   // class RestTemplate',
      t: '启动验证。总结双轨制:自家的类贴 @Component 标签,第三方类进 @Configuration 车间——所有 Bean 殊途同归进容器。' }
  ]},

  'ch16': { title: '第一个日志切面', steps: [
    { c: '@Aspect\n@Component\npublic class LogAspect {\n\n}',
      t: '切面 = 切点 + 通知。@Aspect 声明身份,@Component 让容器管理——两个注解缺一不可,少一个切面就静默失效。',
      std: '📐 规范:切面类以 Aspect 结尾命名(LogAspect),职责写进名字。' },
    { c: '    @Pointcut("execution(* com.demo.service..*.*(..))")\n    public void servicePt() { }',
      t: '定义切点:service 包下所有类的所有方法。表达式先背框架:返回值.包..类.方法(参数),通配符 * 与 .. 各司其职。',
      std: '📐 规范:切点方法名简短表意(servicePt),供多个通知引用复用。' },
    { c: '    @Around("servicePt()")\n    public Object around(ProceedingJoinPoint pjp) throws Throwable {\n        long start = System.nanoTime();\n        try {\n            return pjp.proceed();               // 放行目标方法\n        } finally {\n            System.out.println(pjp.getSignature()\n                + " 耗时 " + (System.nanoTime() - start) + "ns");\n        }\n    }',
      t: '环绕通知包住目标方法:proceed() 之前/之后就是你的增强逻辑——计时、日志、事务都是这么织进去的。',
      std: '📐 规范:proceed() 必须调用且放在 try 中;返回值原样 return,异常别吞——否则业务结果全丢。' },
    { c: '// 业务代码一行未改,所有 service 方法自动带上了耗时统计\n// 这就是 AOP:横切逻辑与业务彻底解耦',
      t: '对比没有 AOP 的世界:每个方法头尾复制计时模板。切面写一次、全处生效——这是"声明式编程"的第一次亮相,下一节的 @Transactional 同款原理。' }
  ]},

  'ch17': { title: '第一个 REST 接口', steps: [
    { c: '@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}',
      t: '启动类:@SpringBootApplication 一个注解顶三件(配置 + 自动配置 + 扫描),main 一行拉起内嵌 Tomcat——不用装、不用配。' },
    { c: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n}',
      t: '接口层:@RestController 声明"我返回的是数据不是页面",返回值自动转 JSON;@RequestMapping 统一 URL 前缀。',
      std: '📐 规范:URL 用名词复数(/api/users)表达资源,风格全站统一。' },
    { c: '    @GetMapping\n    public List<String> list() {\n        return List.of("张三", "李四");\n    }',
      t: 'GET 查列表:返回 List,HttpMessageConverter 自动序列化成 JSON 数组——中间零配置。' },
    { c: '    @PostMapping\n    public String create(@RequestBody String name) {\n        return "已创建:" + name;\n    }',
      t: 'POST 收数据:@RequestBody 把请求体映射进参数。GET 参数在 URL、POST 数据在请求体——HTTP 语义各就各位。',
      std: '📐 规范:方法名与 HTTP 语义对应:list/create/update/delete,见名知意。' },
    { c: '// 启动后用 Postman 或浏览器测试:\n// GET  http://localhost:8080/api/users   => ["张三","李四"]\n// POST /api/users  (body:"王五")        => 已创建:王五',
      t: '一个能跑的 REST 服务就绪。加上 Service、数据库与统一响应结构,就是真实项目的雏形——后端之旅正式开始 🚀' }
  ]}
};
