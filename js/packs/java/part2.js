/* ============ 第 3-4 章:面向对象 + 常用 API ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch3', title: '面向对象编程(核心)', icon: '🧱', stage: 2,
    desc: '类、对象、封装、继承、多态、抽象类、接口——Java 思想精髓,全章都是重点。',
    sections: [
      {
        id: 'oop-class-object', title: '类与对象', stage: 2,
        desc: '万物皆对象:类的定义与实例化',
        blocks: [
          { type: 'text', html: `<p><strong>类</strong>是对一类事物的抽象描述(模板/图纸),<strong>对象</strong>是根据类创建出来的具体实例。比如"手机设计图"是类,你手里那台手机是对象。</p><p>类由两部分组成:<strong>成员变量(属性)</strong>描述"有什么",<strong>成员方法(行为)</strong>描述"能做什么"。</p>` },
          { type: 'code', title: '定义类并创建对象', code: `// Phone.java —— 定义一个手机类
public class Phone {
    // 成员变量(属性)
    String brand;      // 品牌
    double price;      // 价格

    // 成员方法(行为)
    public void call(String who) {
        System.out.println("给" + who + "打电话");
    }
}

// Test.java —— 测试类
public class Test {
    public static void main(String[] args) {
        Phone p = new Phone();   // new 在堆内存中创建对象,p 是引用(存地址)
        p.brand = "华为";
        p.price = 5999;
        p.call("妈妈");           // 给妈妈打电话

        Phone p2 = p;            // 不是复制对象!p2 和 p 指向同一个对象
        p2.price = 4999;
        System.out.println(p.price);   // 4999.0
    }
}` },
          { type: 'points', title: '成员变量 vs 局部变量', items: [
            '<b>成员变量</b>:类中方法外,有默认值(int→0、boolean→false、引用→null),随对象存放在<b>堆</b>中。',
            '<b>局部变量</b>:方法内或参数上,<b>没有默认值,必须先赋值再使用</b>,存放在<b>栈</b>中。',
            '<b>对象内存图</b>:<code class="ic">new Phone()</code> 在堆里开辟空间 → 成员变量带默认值 → 把地址赋给栈上的引用变量 p。',
          ] },
        ]
      },
      {
        id: 'oop-encap-constructor', title: '封装与构造方法', stage: 2,
        desc: 'private + getter/setter + this',
        blocks: [
          { type: 'text', html: `<p><strong>封装</strong>是面向对象三大特性之首:把属性用 <code class="ic">private</code> 私有化,对外提供公开的 <code class="ic">getter/setter</code> 方法访问。好处:<strong>隐藏内部细节、可在方法里加校验逻辑、降低耦合</strong>。</p>` },
          { type: 'code', title: '标准 JavaBean 写法(必会)', code: `public class Student {
    private String name;    // 私有属性,外部不能直接访问
    private int age;

    // 无参构造
    public Student() {
    }

    // 有参构造:创建对象的同时给属性赋值
    public Student(String name, int age) {
        this.name = name;    // this.name 是成员变量,name 是参数
        this.age = age;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }

    // setter 里可以加业务校验,这是封装最大的价值
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            System.out.println("年龄非法,已忽略");
            return;
        }
        this.age = age;
    }
}

// 使用
Student s = new Student("张三", 18);
s.setAge(-5);        // 年龄非法,已忽略 —— 外部无法绕过校验
System.out.println(s.getName());` },
          { type: 'points', title: '构造方法规则', items: [
            '方法名<b>与类名完全相同</b>、<b>没有返回值类型</b>(连 void 都不写)。',
            '不写任何构造方法时,编译器<b>自动赠送无参构造</b>;一旦手写了有参构造,赠送立即消失(需要无参就得自己补)。',
            '<code class="ic">this</code> 代表当前对象;构造方法内 <code class="ic">this(...)</code> 可调用本类其他构造方法,且<b>必须放在第一行</b>。',
            'IDEA 快捷键:Alt + Insert 一键生成构造方法与 getter/setter。',
          ] },
        ]
      },
      {
        id: 'oop-inheritance', title: '继承 extends', stage: 2,
        desc: '代码复用、方法重写、super',
        blocks: [
          { type: 'text', html: `<p><strong>继承</strong>让子类自动拥有父类的成员,是代码复用的重要手段。Java 是<strong>单继承</strong>:一个类只能有一个直接父类;所有类都直接或间接继承 <code class="ic">Object</code>。语义上是 <strong>is-a</strong> 关系:Dog <em>is a</em> Animal。</p>` },
          { type: 'code', title: '继承与方法重写', code: `public class Animal {
    protected String name;

    public Animal(String name) { this.name = name; }

    public void eat() {
        System.out.println(name + "在吃东西");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);              // 调用父类构造方法,必须第一行
    }

    @Override                     // 注解:标记这是一个重写方法,写错签名会编译报错
    public void eat() {
        System.out.println(name + "在啃骨头");
        super.eat();              // 还想复用父类逻辑,可用 super 调用
    }
}

Animal a = new Dog("旺财");       // 多态(下一节)
a.eat();                          // 旺财在啃骨头(运行的是子类重写后的方法)` },
          { type: 'points', title: '重写(Override)的两同两小一大', items: [
            '<b>两同</b>:方法名相同、参数列表相同。',
            '<b>两小</b>:返回值类型 ≤ 父类(相同或是其子类);抛出异常 ≤ 父类。',
            '<b>一大</b>:访问权限 ≥ 父类(父类 private 方法不叫重写;final 方法不能被重写)。',
            '<b>区别记忆</b>:重载 Overload 在同一个类里(参数不同);重写 Override 在父子类间(参数相同)。',
          ] },
          { type: 'code', title: '代码块执行顺序(经典面试题)', code: `class Father {
    static { System.out.println("1. 父类静态代码块"); }   // 只在类加载时执行一次
    { System.out.println("3. 父类实例代码块"); }          // 每次创建对象都执行
    public Father() { System.out.println("4. 父类构造方法"); }
}
class Son extends Father {
    static { System.out.println("2. 子类静态代码块"); }
    { System.out.println("5. 子类实例代码块"); }
    public Son() { System.out.println("6. 子类构造方法"); }
}
new Son();
// 输出:1 2 3 4 5 6 —— 静态先行、父类优先、实例块在构造前` },
        ]
      },
      {
        id: 'oop-polymorphism', title: '多态', stage: 2,
        desc: '一个引用多种形态:编译看左,运行看右',
        blocks: [
          { type: 'text', html: `<p><strong>多态</strong>:父类引用指向子类对象 <code class="ic">Animal a = new Dog();</code>。同一句 <code class="ic">a.eat()</code>,引用 Dog 时执行狗的吃,引用 Cat 时执行猫的吃——<strong>同一个行为有不同的表现形式</strong>。它是"解耦、可扩展"的根基:新增一种动物,调用方代码一行不用改。</p>` },
          { type: 'code', title: '多态的条件与转型', code: `public class Cat extends Animal {
    public Cat(String name) { super(name); }

    @Override
    public void eat() { System.out.println(name + "在吃鱼"); }

    public void catchMouse() { System.out.println(name + "抓老鼠"); }  // 子类特有
}

// 调用方:面向 Animal 编程
public static void feed(Animal a) {   // 传 Dog、Cat 都可以 —— 这就是多态
    a.eat();                          // 编译看左边(Animal 有 eat 才能调用),运行看右边(执行子类实现)
}

Animal a = new Cat("咪咪");
a.eat();                              // 咪咪在吃鱼 ✔
// a.catchMouse();                    // 编译错误!Animal 类型里没有该方法
Cat c = (Cat) a;                      // 向下转型(强转)后才能调用子类特有方法
c.catchMouse();                       // 咪咪抓老鼠 ✔

if (a instanceof Cat) {               // 转型前务必判断,否则可能 ClassCastException
    ((Cat) a).catchMouse();
}
// JDK 16+ 模式匹配写法:if (a instanceof Cat cat) { cat.catchMouse(); }` },
          { type: 'warn', html: '<b>成员变量没有多态</b>!访问成员变量"编译和运行都看左边"(父类);只有成员方法才"运行看右边"。<code class="ic">Father f = new Son(); f.num</code> 拿到的是父类的 num。' },
        ]
      },
      {
        id: 'oop-static-final', title: 'static 与 final', stage: 2,
        desc: '静态成员、静态方法、常量',
        blocks: [
          { type: 'text', html: `<p><code class="ic">static</code> 表示"属于类,而不属于某个对象":静态成员被<strong>所有对象共享</strong>,推荐用类名直接访问。例如所有玩家的服务器人数统计、工具类方法。</p>` },
          { type: 'code', title: 'static 的三种用法', code: `public class Player {
    static int onlineCount = 0;          // 1. 静态变量:全类共享一份
    String name;                          // 实例变量:每个对象一份

    public Player(String name) {
        this.name = name;
        onlineCount++;                    // 每创建一个玩家,在线数 +1
    }

    // 2. 静态方法:不能访问实例变量/实例方法(没有 this),不能出现 this/super
    public static int getOnlineCount() {
        return onlineCount;
    }

    // 3. 静态代码块:类加载时执行一次,用于初始化静态资源(如读配置、加载驱动)
    static {
        System.out.println("Player 类被加载");
    }
}

new Player("A");
new Player("B");
System.out.println(Player.onlineCount);          // 2 —— 推荐用类名访问
System.out.println(Player.getOnlineCount());     // 2` },
          { type: 'points', title: 'final 关键字', items: [
            '修饰<b>类</b>:类不能被继承(如 String、Integer)。',
            '修饰<b>方法</b>:方法不能被重写。',
            '修饰<b>变量</b>:变常量,只能赋值一次。基本类型值不变;引用类型是<b>地址不变</b>(内容仍可改)。',
            '常量命名规范:全大写 + 下划线,<code class="ic">public static final double TAX_RATE = 0.13;</code>',
          ] },
          { type: 'note', html: '<b>权限修饰符一览</b>(由小到大):<code class="ic">private</code>(本类)<code class="ic">&lt;</code> 默认(同包)<code class="ic">&lt;</code> <code class="ic">protected</code>(同包 + 子类)<code class="ic">&lt;</code> <code class="ic">public</code>(任何地方)。' },
        ]
      },
      {
        id: 'oop-abstract-interface', title: '抽象类与接口', stage: 2,
        desc: '设计层面的"是什么"与"能做什么"',
        blocks: [
          { type: 'text', html: `<p><strong>抽象类</strong>(<code class="ic">abstract class</code>)表达"是什么"(is-a),用于抽取子类共性;它可以包含普通方法,也可以声明<strong>没有方法体的抽象方法</strong>强制子类去实现。<strong>接口</strong>(<code class="ic">interface</code>)表达"能做什么"(can-do),是一份能力契约,一个类可以实现多个接口。</p>` },
          { type: 'code', title: '抽象类', code: `public abstract class Shape {              // 抽象类不能实例化(new 报错)
    protected String name;

    public abstract double area();          // 抽象方法:没有方法体,分号结尾

    public void show() {                    // 抽象类可以有普通方法
        System.out.println(name + " 面积 = " + area());
    }
}

public class Circle extends Shape {
    private double r;
    public Circle(double r) { this.r = r; this.name = "圆"; }

    @Override
    public double area() { return Math.PI * r * r; }   // 必须实现抽象方法,否则自己也要声明为 abstract
}` },
          { type: 'code', title: '接口', code: `public interface Flyable {
    int MAX_HEIGHT = 10000;                 // 成员变量默认 public static final(常量)

    void fly();                             // 抽象方法默认 public abstract

    // JDK 8+ 新增:default 默认方法(实现类可直接继承使用,不必重写)
    default void land() {
        System.out.println("缓缓降落");
    }

    // JDK 8+ 新增:静态方法,接口名调用 Flyable.check()
    static boolean checkWeather() { return true; }
}

// 类只支持单继承,却可以实现多个接口 —— 完美弥补单继承的局限
public class Bird extends Animal implements Flyable, Comparable<Bird> {
    @Override
    public void fly() { System.out.println("扇动翅膀飞行"); }
}` },
          { type: 'table', head: ['对比项', '抽象类', '接口'],
            rows: [
              ['关系语义', 'is-a,事物的本质', 'can-do,附加的能力'],
              ['成员变量', '任意', '只能 public static final 常量'],
              ['构造方法', '有(供子类 super 调用)', '没有'],
              ['方法', '抽象 + 普通均可', 'JDK8 前只能抽象;8+ 可 default/static;9+ 可 private'],
              ['继承/实现', '单继承', '可实现多个'],
              ['典型应用', '模板方法模式、抽取共性', '定义规范、解耦调用方与实现方'],
            ] },
          { type: 'tip', html: '<b>经验法则</b>:多个类有共同属性和部分公共逻辑 → 抽象类;希望某类具备某种能力/制定标准 → 接口。两者常常组合使用。' },
        ]
      },
      {
        id: 'oop-inner-enum', title: '内部类与枚举', stage: 2,
        desc: '匿名内部类、枚举类型',
        blocks: [
          { type: 'text', html: `<p><strong>内部类</strong>是定义在另一个类内部的类,主要用于"只在 A 类内部使用"的场景。最常用的是<strong>匿名内部类</strong>——不用先定义子类/实现类,直接 new 接口或抽象类并实现方法,一步到位。</p>` },
          { type: 'code', title: '匿名内部类(重点)', code: `public interface Swimmer {
    void swim();
}

public class Test {
    public static void main(String[] args) {
        // 传统写法:先写 DuckSwimmer 类实现接口,再 new —— 太啰嗦
        // 匿名内部类:new 接口的同时给出实现,产物是一个"没有名字的子类对象"
        Swimmer s = new Swimmer() {
            @Override
            public void swim() {
                System.out.println("狗刨式游泳");
            }
        };
        s.swim();

        // 传参场景最常见(如按钮监听、排序比较器)
        java.util.Arrays.sort(new Integer[]{3, 1, 2}, new java.util.Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
                return b - a;   // 降序
            }
        });
    }
}` },
          { type: 'code', title: '枚举 enum:一组有限的常量', code: `public enum Season {
    SPRING("春天", "温暖"),
    SUMMER("夏天", "炎热"),
    AUTUMN("秋天", "凉爽"),
    WINTER("冬天", "寒冷");        // 枚举项必须写在最前面,以分号结束

    private final String cnName;
    private final String desc;

    Season(String cnName, String desc) {   // 枚举构造方法天然 private
        this.cnName = cnName;
        this.desc = desc;
    }

    public String getCnName() { return cnName; }
    public String getDesc() { return desc; }
}

// 使用
Season s = Season.SUMMER;
switch (s) {                       // switch 支持枚举,case 不用加前缀
    case SPRING -> System.out.println("春暖花开");
    case SUMMER -> System.out.println("夏日炎炎");
    default -> System.out.println("其他季节");
}
for (Season x : Season.values()) {         // 遍历所有枚举项
    System.out.println(x.name() + " " + x.ordinal());   // 名字与序号(从0)
}` },
          { type: 'tip', html: '<b>为什么用枚举</b>:用 <code class="ic">int 1/2/3</code> 表示状态,任何非法数字都能传进来;用枚举则把取值范围"锁死",编译期就能查错,且自带类型安全。' },
        ]
      }
    ]
  },

  {
    id: 'ch4', title: '常用 API 与字符串', icon: '🧰', stage: 2,
    desc: 'Object、String 三兄弟、包装类、日期时间——日常开发天天在用。',
    sections: [
      {
        id: 'api-object', title: 'Object 类', stage: 2,
        desc: 'toString / equals / hashCode',
        blocks: [
          { type: 'text', html: `<p><code class="ic">Object</code> 是所有类的根父类,任何对象都能调用它的方法。最重要的是三个可重写的方法:</p>` },
          { type: 'code', title: '重写 toString 与 equals', code: `public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 不重写 toString:打印得到 "Person@1b6d3586"(类名@地址)
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }

    // 不重写 equals:比较的是地址,两个内容相同的新对象也不相等
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                 // 同一对象直接 true
        if (o == null || getClass() != o.getClass()) return false;
        Person p = (Person) o;
        return age == p.age && java.util.Objects.equals(name, p.name);
    }

    // 规范:重写 equals 必须同时重写 hashCode(相等对象必须有相同哈希值)
    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, age);
    }
}

Person a = new Person("张三", 18);
Person b = new Person("张三", 18);
System.out.println(a == b);          // false(== 比较地址)
System.out.println(a.equals(b));     // true(重写后比较内容)` },
          { type: 'points', title: '', items: [
            '<code class="ic">==</code>:基本类型比值;引用类型比<b>地址</b>。',
            '<code class="ic">equals</code>:Object 默认实现就是 ==;String 等类已重写为比内容;自定义类要不要重写看业务。',
            'IDEA:Alt + Insert 可自动生成 equals/hashCode/toString,避免手写出错。',
          ] },
        ]
      },
      {
        id: 'api-string', title: 'String 详解', stage: 2,
        desc: '不可变、常量池、常用方法',
        blocks: [
          { type: 'text', html: `<p><code class="ic">String</code> 是使用频率最高的类,两个核心特性必须理解:<strong>①不可变性</strong>——字符串一旦创建,内容永不改变,所有"修改"方法都返回新串;<strong>②字符串常量池</strong>——相同字面量在池中只有一份,节省内存。</p>` },
          { type: 'code', title: '创建方式与 == 陷阱', code: `String s1 = "abc";              // 字面量:进常量池
String s2 = "abc";              // 复用池中同一个对象
String s3 = new String("abc");  // new:堆中新开对象

System.out.println(s1 == s2);       // true(同一地址)
System.out.println(s1 == s3);       // false
System.out.println(s1.equals(s3));  // true(比内容用 equals)

String s4 = "ab";
String s5 = s4 + "c";           // 变量拼接在运行时产生新对象
System.out.println(s1 == s5);       // false!
System.out.println(s1 == "ab" + "c");  // true:常量拼接在编译期就合并了` },
          { type: 'code', title: '高频方法(背下来)', code: `String s = "Hello,Java,World";

s.length();                      // 15 长度
s.charAt(1);                     // 'e' 指定下标字符
s.indexOf("Java");               // 6 首次出现下标,没有返回 -1
s.substring(7);                  // "Java,World" 从下标7截到末尾
s.substring(0, 5);               // "Hello" [0,5) 含头不含尾
s.replace("Java", "Python");     // 替换,返回新串
s.split(",");                    // ["Hello","Java","World"] 切割成数组
s.toUpperCase(); / s.toLowerCase();
"  hi  ".trim();                 // 去两端空格(JDK11 strip() 更强,支持全角空格)
s.contains("Java");              // true
s.startsWith("Hello");           // true
String.valueOf(100);             // 其他类型转字符串
char[] cs = s.toCharArray();     // 转字符数组

// 遍历统计:统计字符串中大写字母个数
int count = 0;
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (c >= 'A' && c <= 'Z') count++;
}` },
          { type: 'code', title: 'StringBuilder:高频拼接的正确姿势', code: `// 反例:String 循环拼接,每次都产生新对象,内存与性能灾难
String bad = "";
for (int i = 0; i < 10000; i++) bad += i;    // 慢!

// 正解:StringBuilder 底层是可变字符数组,默认容量16,自动扩容
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String good = sb.toString();

sb.append("abc").append(123).append(true);   // 链式调用
sb.reverse();                                 // 内容反转(经典面试:回文判断)

// StringBuffer 与 StringBuilder API 完全一致,方法加了 synchronized:
// 多线程环境用 StringBuffer(安全但慢),单线程一律 StringBuilder` },
          { type: 'warn', html: '<b>面试常问</b>:String 为什么设计成不可变?——① 常量池复用需要不可变保证安全;② 不可变天然线程安全;③ String 的 hashCode 被大量缓存(如 HashMap 的 key),重新计算代价大。' },
        ]
      },
      {
        id: 'api-wrapper', title: '包装类与自动装箱', stage: 2,
        desc: 'int 与 Integer 的转换、Integer 缓存',
        blocks: [
          { type: 'text', html: `<p>泛型与集合只能存对象,不能存基本类型,所以 8 种基本类型各有一个<strong>包装类</strong>:<code class="ic">int → Integer</code>、<code class="ic">char → Character</code>,其余是首字母大写(<code class="ic">long → Long</code>)。JDK 5 起支持<strong>自动装箱/拆箱</strong>,转换几乎无感。</p>` },
          { type: 'code', title: '装箱、拆箱与转换', code: `Integer a = 100;             // 自动装箱:Integer.valueOf(100)
int b = a;                   // 自动拆箱:a.intValue()
Integer c = a + 10;          // 混合运算:先拆箱成 int 计算,再装箱

// 字符串与数字互转(超常用)
int i = Integer.parseInt("123");        // String -> int(重点)
Integer big = Integer.valueOf("123");
String s = String.valueOf(456);          // int -> String
String s2 = 456 + "";                    // 拼接写法,也可

// 进制转换
Integer.toBinaryString(10);   // "1010"
Integer.parseInt("ff", 16);   // 255:按十六进制解析` },
          { type: 'code', title: 'Integer 缓存陷阱(高频面试题)', code: `Integer x = 127, y = 127;
System.out.println(x == y);      // true!valueOf 对 -128~127 有缓存,返回同一对象

Integer m = 128, n = 128;
System.out.println(m == n);      // false!超出缓存范围,new 了新对象
System.out.println(m.equals(n)); // true  —— 包装类比较内容一律用 equals

// 自动拆箱的空指针陷阱
Integer p = null;
// int q = p;                   // 拆箱调用 intValue() => NullPointerException!` },
          { type: 'warn', html: '<b>铁律</b>:包装类(包括 String)之间比较内容,永远用 <code class="ic">equals</code>,不要用 <code class="ic">==</code>。阿里巴巴 Java 开发手册强制规定。' },
        ]
      },
      {
        id: 'api-date', title: '日期时间与 Math', stage: 2,
        desc: 'Date / SimpleDateFormat / 新时间 API',
        blocks: [
          { type: 'code', title: '传统 API:Date 与 SimpleDateFormat', code: `import java.util.Date;
import java.text.SimpleDateFormat;

Date now = new Date();                    // 当前时间(内部是毫秒值)
System.out.println(now.getTime());        // 毫秒时间戳

// 格式化与解析
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String text = sdf.format(now);            // "2026-10-03 14:30:00"
Date d = sdf.parse("2026-01-01 00:00:00");// 解析(格式不匹配会抛 ParseException)

// 传统 API 的问题:SimpleDateFormat 线程不安全、Date 月份从 0 开始、可变设计易出错` },
          { type: 'code', title: 'Java 8 新时间 API(推荐)', code: `import java.time.*;
import java.time.format.DateTimeFormatter;

LocalDate today = LocalDate.now();          // 2026-10-03(只有日期)
LocalTime t = LocalTime.of(14, 30);         // 14:30(只有时间)
LocalDateTime dt = LocalDateTime.now();     // 日期+时间

LocalDate birthday = LocalDate.of(2000, 6, 1);
int age = Period.between(birthday, today).getYears();      // 26 岁计算
LocalDate nextWeek = today.plusWeeks(1);    // 不可变对象:plus/minus 返回新对象
LocalDate offwork = today.withDayOfMonth(15);

// 格式化(线程安全,可做成静态常量复用)
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm");
String s = dt.format(fmt);

// Duration 算时间差、Instant 时间戳:
long minutes = Duration.between(LocalTime.of(9,0), LocalTime.now()).toMinutes();` },
          { type: 'code', title: 'Math 与 System 常用方法', code: `Math.abs(-5);        // 5 绝对值
Math.ceil(3.1);      // 4.0 向上取整
Math.floor(3.9);     // 3.0 向下取整
Math.round(3.5);     // 4 四舍五入(加0.5向下取整)
Math.pow(2, 10);     // 1024.0 幂
Math.sqrt(16);       // 4.0 平方根
Math.random();       // [0.0, 1.0) 随机数
int dice = (int)(Math.random() * 6) + 1;   // 掷骰子 1~6
// 生成随机数更推荐 new Random().nextInt(100);  => [0,100)

long start = System.currentTimeMillis();   // 毫秒时间戳(测代码耗时)
// ... 被测代码 ...
System.out.println("耗时:" + (System.currentTimeMillis() - start) + "ms");
// System.exit(0);   正常退出 JVM(0)/异常退出(非0)` },
        ]
      }
    ]
  }
]);
