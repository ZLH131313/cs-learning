/* ============ 第 5-7 章:集合框架 + 异常处理 + 泛型 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch5', title: '集合框架', icon: '📦', stage: 3,
    desc: 'List / Set / Map 全家桶,存取组织数据的利器,面试重灾区。',
    sections: [
      {
        id: 'col-overview', title: '集合体系总览', stage: 3,
        desc: 'Collection 与 Map 双雄',
        blocks: [
          { type: 'text', html: `<p>数组定长、类型单一,而集合<strong>长度可变、只能存引用类型、提供丰富的操作方法</strong>。集合框架分为两大体系:</p>` },
          { type: 'code', title: '体系结构图', code: `Collection(单列:一个个存)
 ├── List(有序、可重复)
 │    ├── ArrayList   ★ 数组实现,查询快,增删慢
 │    └── LinkedList  双向链表,头尾增删快
 └── Set(不重复)
      ├── HashSet      ★ 哈希表,无序
      ├── LinkedHashSet 哈希表+链表,存取有序
      └── TreeSet      红黑树,自动排序

Map(双列:键值对存)
 ├── HashMap        ★ 键无序、可空
 ├── LinkedHashMap  键存取有序
 ├── TreeMap        键自动排序
 └── Hashtable      老版线程安全(基本不用,用 ConcurrentHashMap)` },
          { type: 'code', title: '第一个集合程序', code: `import java.util.ArrayList;
import java.util.List;

List<String> list = new ArrayList<>();     // 多态:接口指向实现类(规范写法)
list.add("Java");
list.add("Python");
list.add("Java");                           // List 允许重复
list.remove("Python");
list.set(0, "Go");
String first = list.get(0);                 // 按下标取
int size = list.size();                     // 元素个数(方法,注意与数组 length 区分)
System.out.println(list);                   // [Go, Java] —— 集合打印直接看到内容` },
          { type: 'note', html: '<b>为什么声明用接口类型</b>:<code class="ic">List&lt;String&gt; list = new ArrayList&lt;&gt;()</code> 而不是 <code class="ic">ArrayList</code> —— 依赖抽象而非实现,以后换成 LinkedList 调用方代码零修改。' },
        ]
      },
      {
        id: 'col-list', title: 'List:ArrayList 与 LinkedList', stage: 3,
        desc: '有序可重复,以及两种实现的取舍',
        blocks: [
          { type: 'code', title: '学生案例(增删改查)', code: `import java.util.ArrayList;
import java.util.List;

List<String> books = new ArrayList<>();
books.add("Java核心技术");
books.add("深入理解Java虚拟机");
books.add("Effective Java");

System.out.println(books.contains("Java核心技术"));  // true 是否包含
System.out.println(books.indexOf("Effective Java")); // 2 下标
books.remove(1);                        // 按下标删除
books.clear();                          // 清空

// 存自定义对象:经典的"集合遍历筛选"
record Student(String name, int score) {}   // record 是 JDK16+ 简化数据类(自动生成构造/getter等)

List<Student> stus = new ArrayList<>();
stus.add(new Student("张三", 90));
stus.add(new Student("李四", 55));
stus.add(new Student("王五", 78));

// 删除不及格的(注意:遍历时删除要用迭代器或倒序,否则下标错位!)
for (int i = stus.size() - 1; i >= 0; i--) {
    if (stus.get(i).score() < 60) stus.remove(i);
}
System.out.println(stus.size());   // 2` },
          { type: 'table', head: ['对比', 'ArrayList', 'LinkedList'],
            rows: [
              ['底层结构', 'Object[] 数组', '双向链表'],
              ['随机访问 get(i)', 'O(1) 直接定位 ★', 'O(n) 从头遍历'],
              ['头部/中间增删', 'O(n) 要移动元素', 'O(1) 改指针 ★'],
              ['内存', '连续空间,有预留浪费', '每个节点额外存两个指针'],
              ['结论', '绝大多数场景 ★ 默认选它', '频繁头尾操作、当队列/栈用'],
            ] },
          { type: 'points', title: 'ArrayList 扩容机制(面试)', items: [
            '<code class="ic">new ArrayList&lt;&gt;()</code> 底层数组初始为空,首次 add 时扩到容量 <b>10</b>。',
            '容量不足时扩为原来的 <b>1.5 倍</b>(Arrays.copyOf 复制到新数组)。',
            '已知要存 10 万条数据时,<code class="ic">new ArrayList&lt;&gt;(100000)</code> 指定容量,避免反复扩容拷贝。',
          ] },
        ]
      },
      {
        id: 'col-set', title: 'Set:不重复的魔法', stage: 3,
        desc: 'HashSet 去重原理、TreeSet 排序',
        blocks: [
          { type: 'code', title: '三种 Set', code: `import java.util.*;

Set<String> set = new HashSet<>();
set.add("Java"); set.add("Python"); set.add("Java");
System.out.println(set);          // [Java, Python] 重复添加自动忽略,add 返回 false
System.out.println(set.size());   // 2

Set<String> linked = new LinkedHashSet<>();   // 存入顺序保留
Set<String> tree = new TreeSet<>();           // 元素自动排序(字典序)
tree.add("banana"); tree.add("apple");
System.out.println(tree);         // [apple, banana]

// 经典应用:List 快速去重
List<Integer> list = List.of(3, 1, 3, 2, 1);
Set<Integer> dedup = new HashSet<>(list);
System.out.println(dedup);        // [1, 2, 3]` },
          { type: 'points', title: 'HashSet 去重原理(必考)', items: [
            'add 时先调 <code class="ic">hashCode()</code> 算哈希值定位到桶,桶为空直接存。',
            '桶非空则调 <code class="ic">equals()</code> 逐个比较:都相等 → 判定重复,拒绝存入;不相等 → 同一桶中链表存储。',
            '所以:<b>重写 equals 必须重写 hashCode</b>,否则"内容相同的两个对象"会被当成两个元素——Set 去重失效。',
          ] },
          { type: 'code', title: 'TreeSet 自定义排序', code: `import java.util.*;

// 方式一:实体类实现 Comparable(自然排序,类自身规则)
record Score(int chinese, int math) implements Comparable<Score> {
    @Override
    public int compareTo(Score o) {
        int diff = o.chinese + o.math - (this.chinese + this.math);  // 总分降序
        return diff != 0 ? diff : this.math - o.math;                // 同分按数学升序
    }
}

// 方式二:Comparator 比较器(临时规则,推荐,不改实体类)
TreeSet<Integer> nums = new TreeSet<>((a, b) -> b - a);   // 降序
nums.addAll(List.of(5, 1, 9, 3));
System.out.println(nums);        // [9, 5, 3, 1]

// 记住口诀:比较结果为正 => 交换位置(升序:升序 return a-b,降序 return b-a)` },
        ]
      },
      {
        id: 'col-map', title: 'Map:键值对与 HashMap 原理', stage: 3,
        desc: '存"映射关系",剖析底层哈希表',
        blocks: [
          { type: 'code', title: 'Map 增删改查', code: `import java.util.*;

Map<String, Integer> menu = new HashMap<>();
menu.put("宫保鸡丁", 38);          // 添加 / 相同 key 则覆盖旧值
menu.put("鱼香肉丝", 32);
menu.put("麻婆豆腐", 28);

System.out.println(menu.get("鱼香肉丝"));  // 32,key 不存在返回 null
System.out.println(menu.getOrDefault("烤鸭", 0));  // 0 防空指针
menu.remove("麻婆豆腐");
System.out.println(menu.containsKey("宫保鸡丁"));   // true
System.out.println(menu.size());            // 2

// getOrDefault 的经典应用:统计出现次数
String[] words = {"a", "b", "a", "c", "b", "a"};
Map<String, Integer> count = new HashMap<>();
for (String w : words) {
    count.put(w, count.getOrDefault(w, 0) + 1);
}
System.out.println(count);        // {a=3, b=2, c=1}` },
          { type: 'code', title: '三种遍历方式', code: `Map<String, Integer> m = Map.of("语文", 90, "数学", 95, "英语", 88);

// ① entrySet 整组取(推荐:一次拿 key+value)
for (Map.Entry<String, Integer> e : m.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}

// ② keySet 先拿键再取值
for (String key : m.keySet()) {
    System.out.println(key + " = " + m.get(key));
}

// ③ JDK8 forEach + Lambda
m.forEach((k, v) -> System.out.println(k + " = " + v));` },
          { type: 'points', title: 'HashMap 底层原理(JDK 8,面试必背)', items: [
            '结构:<b>数组 + 链表 + 红黑树</b>。数组每个位置称为"桶"。',
            'put 流程:对 key 的 hashCode 做<b>扰动</b>后与 (容量-1) 位与,算出桶下标 → 桶空直接放 → 哈希冲突则链表尾插,同时比较 equals 判断是否覆盖。',
            '链表长度 <b>&gt; 8 且数组长度 ≥ 64</b> 时,链表转<b>红黑树</b>(查询 O(n) → O(logn));缩到 6 退化回链表。',
            '默认容量 <b>16</b>,负载因子 <b>0.75</b>:元素数超过 容量×0.75 就<b>2倍扩容</b>并 rehash。所以预估大容量请指定初始容量。',
            '为什么 capacity 一定是 2 的幂?—— 为了让 <code class="ic">(n-1) &amp; hash</code> 等价于取模且分布均匀。',
          ] },
        ]
      },
      {
        id: 'col-tools', title: 'Collections 工具类与不可变集合', stage: 3,
        desc: '排序、洗牌、同步包装',
        blocks: [
          { type: 'code', title: 'Collections 与 List.of', code: `import java.util.*;

List<Integer> nums = new ArrayList<>(List.of(5, 2, 8, 1, 9));

Collections.sort(nums);                        // 排序 [1,2,5,8,9]
Collections.sort(nums, (a, b) -> b - a);       // 降序
Collections.reverse(nums);                     // 反转
Collections.shuffle(nums);                     // 洗牌(随机打乱,斗地主发牌)
System.out.println(Collections.max(nums));     // 最大值
System.out.println(Collections.frequency(nums, 5));  // 元素出现次数

// 二分查找:必须先排序
Collections.sort(nums);
System.out.println(Collections.binarySearch(nums, 5));

// List.of / Set.of / Map.of(JDK9+):创建"不可变集合",改内容直接抛异常
List<String> fixed = List.of("a", "b", "c");   // 常用于返回固定配置
// fixed.add("d");   // UnsupportedOperationException
// 不可变集合做防御性编程:对外提供的常量数据谁也改不了` },
          { type: 'tip', html: '<b>阶段检验</b>:能独立完成"斗地主洗牌发牌 + 看牌排序"、"统计字符串中每个字符出现次数"、"Map 嵌套 List 存班级学生"三个案例,集合就算过关了。' },
        ]
      }
    ]
  },

  {
    id: 'ch6', title: '异常处理', icon: '🛡️', stage: 3,
    desc: '让程序在出错时优雅地活着,而不是崩溃。',
    sections: [
      {
        id: 'exception-system', title: '异常体系', stage: 3,
        desc: 'Throwable 家族与两大类异常',
        blocks: [
          { type: 'code', title: '异常家族图谱', code: `Throwable(一切错误与异常的顶级父类)
 ├── Error(严重错误,程序无法处理,不该捕获)
 │    ├── OutOfMemoryError      内存溢出
 │    └── StackOverflowError    栈溢出(如无限递归)
 └── Exception(可以处理的异常)
      ├── 编译时异常(受检 checked):编译器强制处理
      │    ├── IOException / FileNotFoundException
      │    ├── SQLException
      │    └── ClassNotFoundException
      └── RuntimeException(运行时异常,非受检,可处理可不处理)
           ├── NullPointerException         空指针 ★ 最常见
           ├── ArrayIndexOutOfBoundsException 数组越界
           ├── ClassCastException           类型转换错误
           ├── ArithmeticException          除数为 0
           └── NumberFormatException        "abc" 转数字失败` },
          { type: 'points', title: '两大类怎么区分', items: [
            '<b>编译时异常</b>:编译器"看得见"的外部风险(文件不存在、网络中断),必须 try-catch 或 throws,否则编译不过。',
            '<b>运行时异常</b>:多为<b>编程逻辑 bug</b>(忘判空、下标算错),编译器不强制,靠细心与防御性编程消灭。',
            '把异常"处理掉"不等于"吞掉":捕获后至少要打印日志或给出用户提示。',
          ] },
        ]
      },
      {
        id: 'exception-try-catch', title: 'try-catch-finally', stage: 3,
        desc: '捕获处理的标准姿势',
        blocks: [
          { type: 'code', title: '基本用法与执行流程', code: `public class TryDemo {
    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[5]);          // 抛出越界异常,try 内后续代码不再执行
            System.out.println("这行不会执行");
        } catch (ArrayIndexOutOfBoundsException e) {
            // 捕获并处理:程序不崩,继续往下走
            System.out.println("出错了:" + e.getMessage());   // Index 5 out of bounds...
            e.printStackTrace();                 // 打印完整异常堆栈(排查问题的第一手资料)
        } finally {
            // 无论是否异常都执行:用于释放资源(关流、还连接)
            System.out.println("finally 一定执行");
        }
        System.out.println("程序继续运行");
    }
}` },
          { type: 'points', title: '细节与规则', items: [
            '多 catch 时:<b>父类异常放最后</b>,子类在前,否则编译报错(后面的永远够不着)。',
            'JDK7+ 合并写法:<code class="ic">catch (IOException | SQLException e)</code>。',
            '<b>finally 不执行的两种情况</b>:JVM 退出 <code class="ic">System.exit()</code>、进程被杀。finally 中 return 会"吞掉"try/catch 的返回值与异常——<b>禁止在 finally 里写 return</b>。',
            'JDK7+ <b>try-with-resources</b>:实现 AutoCloseable 的资源写在 try 括号里,自动关闭:<code class="ic">try (FileInputStream in = new FileInputStream("a.txt")) { ... }</code>',
          ] },
          { type: 'code', title: '常见异常速查与防御写法', code: `// NPE 防御:用之前先判空
String s = map.get("key");
if (s != null) System.out.println(s.length());

// 数字解析:防 NumberFormatException
String input = "12a";
try {
    int n = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.out.println("请输入合法数字");
}

// 拿到异常对象的信息
catch (Exception e) {
    e.getMessage();     // 异常描述
    e.toString();       // 类型+描述
    e.printStackTrace(); // 堆栈(定位到具体类与行号)
}` },
        ]
      },
      {
        id: 'exception-throw-custom', title: 'throws、throw 与自定义异常', stage: 3,
        desc: '向上声明、主动抛出、业务异常',
        blocks: [
          { type: 'points', title: 'throws 与 throw(一字之差)', items: [
            '<code class="ic">throws</code> 用在<b>方法签名</b>上:声明本方法可能抛出的异常,交给调用者处理。',
            '<code class="ic">throw</code> 用在<b>方法体内</b>:主动抛出一个具体的异常对象,<code class="ic">throw new IllegalArgumentException("参数非法");</code>',
            'main 方法 throws 的异常没人接了就直接崩溃,所以实际项目在框架层统一兜底。',
          ] },
          { type: 'code', title: '自定义异常:业务校验的标准做法', code: `// 继承 RuntimeException => 运行时异常(调用方可以不强制处理,业务系统常用)
// 继承 Exception => 编译时异常(强制调用方处理,多用于底层库)
public class AgeOutOfBoundsException extends RuntimeException {
    public AgeOutOfBoundsException(String message) {
        super(message);
    }
}

public class Person {
    private int age;

    public void setAge(int age) {
        if (age < 0 || age > 150) {
            // 主动抛出,把非法状态扼杀在入口
            throw new AgeOutOfBoundsException("年龄必须在 0~150 之间,收到:" + age);
        }
        this.age = age;
    }
}

// 调用方
try {
    Person p = new Person();
    p.setAge(300);
} catch (AgeOutOfBoundsException e) {
    System.out.println("捕获业务异常:" + e.getMessage());
}` },
          { type: 'tip', html: '<b>最佳实践</b>:① 能处理的(可预期、有补救)就捕获;处理不了的(如配置错误)就往上抛,别空 catch 吞异常;<code class="ic">catch (Exception e) {}</code> 是排障时的头号大敌。② 抛异常要带上有意义的 message,方便日志定位。' },
        ]
      }
    ]
  },

  {
    id: 'ch7', title: '泛型', icon: '🔺', stage: 3,
    desc: '编译期的类型安全护栏:把 ClassCastException 消灭在写代码的时候。',
    sections: [
      {
        id: 'generic-basics', title: '泛型类、接口、方法', stage: 3,
        desc: '一套代码适配多种类型',
        blocks: [
          { type: 'text', html: `<p>没有泛型的年代,集合里只能存 <code class="ic">Object</code>,取出来还得强转,类型错了到<strong>运行时</strong>才炸。泛型把类型检查提前到<strong>编译期</strong>,一套代码安全适配多种类型。</p>` },
          { type: 'code', title: '自定义泛型类', code: `// E 是类型参数(Elements),随使用传入实际类型
public class MyBox<E> {
    private E content;

    public void put(E content) { this.content = content; }
    public E get() { return content; }        // 取出即是指定类型,无需强转
}

MyBox<String> box1 = new MyBox<>();     // <> 菱形推断,JDK7+ 可省略右边类型
box1.put("苹果");
String s = box1.get();                   // 不用 (String) 强转
// box1.put(123);                        // 编译直接报错 —— 类型安全!

MyBox<Integer> box2 = new MyBox<>();
box2.put(999);

// 约定俗成的参数名:E(Element) T(Type) K(Key) V(Value) R(Result)` },
          { type: 'code', title: '泛型方法与泛型接口', code: `public class Util {
    // 泛型方法:<T> 写在返回值类型之前
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static <T> T firstOrNull(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }
}

Integer[] a = {3, 1, 2};
Util.swap(a, 0, 2);          // T 自动推断为 Integer
String[] b = {"x", "y"};
Util.swap(b, 0, 1);          // 同一套代码,安全处理 String

// 泛型接口 + 实现类指定具体类型
public interface Converter<F, T> {
    T convert(F from);
}
Converter<String, Integer> len = String::length;   // 配合方法引用
System.out.println(len.convert("hello"));   // 5` },
          { type: 'warn', html: '<b>注意</b>:泛型不支持基本类型(<code class="ic">List&lt;int&gt;</code> ✘,要用 <code class="ic">List&lt;Integer&gt;</code>);泛型数组 <code class="ic">new T[10]</code> ✘(类型擦除导致)。' },
        ]
      },
      {
        id: 'generic-wildcard', title: '通配符与类型擦除', stage: 3,
        desc: '?、extends、super 与 PECS',
        blocks: [
          { type: 'code', title: '通配符三兄弟', code: `import java.util.*;

// 问题:虽然 Cat 是 Animal 的子类,但 List<Cat> 不是 List<Animal> 的子类!
// List<Object> list = new ArrayList<String>();   // 编译错误,泛型没有"父子继承"

// ?  无界通配符:任意类型(只读不可写)
public static void printAll(List<?> list) {
    for (Object o : list) System.out.println(o);
    // list.add(anything);  // ✘ 不知道里面是什么类型,禁止写入
}

// ? extends Animal  上边界:Animal 或其子类 => 生产者,适合"读取"
public static double totalWeight(List<? extends Animal> animals) {
    double sum = 0;
    for (Animal a : animals) sum += a.getWeight();  // 读出来一定是 Animal
    return sum;
}

// ? super Cat      下边界:Cat 或其父类 => 消费者,适合"写入"
public static void addCats(List<? super Cat> list) {
    list.add(new Cat());     // 放 Cat 及子类都安全
}` },
          { type: 'points', title: 'PECS 原则(Producer Extends, Consumer Super)', items: [
            '该集合主要<b>往外提供</b>数据(你只读它)→ 用 <code class="ic">? extends T</code>。',
            '该集合主要<b>接收写入</b>数据(你只往里放 T)→ 用 <code class="ic">? super T</code>。',
            '日常业务少手写通配符,但读懂 JDK 源码(如 <code class="ic">Collections.copy</code>)必须掌握。',
          ] },
          { type: 'code', title: '类型擦除(面试)', code: `List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true!

// 编译后泛型信息被"擦除",两者运行时都是 ArrayList,
// 泛型只存在于编译期,是给编译器看的类型检查。
// 因此运行时无法获得 T 的实际类型、无法 new T()、无法 T.class;
// 除非通过"类型令牌" Class<T> 把类型信息显式传进来。` },
          { type: 'tip', html: '<b>小结</b>:泛型是"编译期的契约"。写业务多用 <code class="ic">List&lt;实体&gt;</code>、<code class="ic">Map&lt;K,V&gt;</code> 即可;通配符和擦除是读懂框架源码的门槛。' },
        ]
      }
    ]
  }
]);
