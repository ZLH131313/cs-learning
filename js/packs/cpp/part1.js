/* ============ C++ 中心 · 第 1-2 章:起步 + 语言核心 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'cpp-ch1', title: 'C++ 起步', icon: '🔧', stage: 1,
    desc: '认识 C++、跑通程序、掌握与 C 的第一层差异。',
    sections: [
      {
        id: 'cpp-intro', title: 'C++ 是什么', stage: 1,
        desc: '一门"多范式"的系统级语言',
        blocks: [
          { type: 'text', html: `<p><strong>C++</strong>(1979 年 Bjarne Stroustrup 创造)在 C 之上扩展出<strong>面向对象、泛型模板、STL 标准库</strong>,同时保留了对内存与硬件的精细控制——它是操作系统、游戏引擎、高频交易、浏览器等性能敏感领域的基石(你用的 Chrome、你学的 JVM,内核都是 C++)。</p>` },
          { type: 'table', head: ['范式', '一句话', '示例'],
            rows: [
              ['过程式', '像 C 一样写函数', '函数、循环、指针'],
              ['面向对象', '类封装、继承多态', 'class、virtual'],
              ['泛型', '类型作参数的模板', 'template、STL'],
              ['函数式(现代)', 'lambda 与算法组合', '[](int x){...}'],
            ] },
          { type: 'code', lang: 'C++', title: '第一个程序与编译运行', code: `#include <iostream>          // 标准输入输出头文件
using namespace std;          // 暂时偷懒打开 std 命名空间

int main() {                  // 入口仍是 main
    cout << "Hello, C++!" << endl;   // 流式输出
    return 0;
}

// 编译运行(g++):
//   g++ -std=c++17 -Wall hello.cpp -o hello
//   ./hello
// -std=c++17 指定语言版本,-Wall 打开常用警告(建议常开)` },
          { type: 'points', title: '与 Java 的直观对比', items: [
            'C++ 编译成<strong>本地机器码</strong>直接跑(无虚拟机);Java 编译成字节码跑在 JVM 上。',
            'C++ <strong>手动管理内存</strong>(new/delete,现代用智能指针);Java 有 GC。',
            'C++ 头文件 + 声明/定义分离;Java 一个文件走天下。',
            '多继承、运算符重载、模板元编程——C++ 的自由与危险都更多。',
          ] }
        ]
      },
      {
        id: 'cpp-basics', title: '基础语法:与 C 的第一层差异', stage: 1,
        desc: 'iostream、bool、string 与引用初见',
        blocks: [
          { type: 'code', lang: 'C++', title: '常见的"更 C++"写法', code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    bool ok = true;                       // C++ 原生布尔
    string name = "C++";                  // string 类,告别 char[] 
    int n;
    cin >> n;                             // 流式输入
    if (n > 0) cout << "正数\\n";
    for (int i = 0; i < n; i++)           // 就地声明循环变量
        cout << i << ' ';

    // 推荐的 C++11 范围 for + auto
    string s = "abc";
    for (char c : s) cout << c;
    auto x = 3.14;                        // 自动类型推导
    return 0;
}` },
          { type: 'points', title: '输入输出流要点', items: [
            '<code class="ic">cin >> x</code>:空白分隔读入,失败时流置错态(需检查)。',
            '<code class="ic">cout &lt;&lt; endl</code> 换行并刷新缓冲;<code class="ic">"\\n"</code> 只换行——高频输出用后者更快。',
            '与 C 混用 <code class="ic">printf/scanf</code> 也可以,但同一程序内保持风格统一。',
          ] }
        ]
      },
      {
        id: 'cpp-function-ref', title: '函数重载、默认参数与引用', stage: 1,
        desc: 'C++ 函数的三件新武器',
        blocks: [
          { type: 'code', lang: 'C++', title: '重载 / 默认参数 / 引用', code: `// 1. 函数重载:参数列表不同即可同名(返回类型不参与判定)
int    maxVal(int a, int b);
double maxVal(double a, double b);

// 2. 默认参数:从右往左连续给
void greet(string name, string prefix = "Hello");

// 3. 引用:变量的"别名",无解引用语法
void swapVal(int &a, int &b) {     // 传引用 = 拿到本体
    int t = a; a = b; b = t;
}
int main() {
    int x = 1, y = 2;
    swapVal(x, y);                 // 无需取地址,天然"双向"
}` },
          { type: 'points', title: '值 / 指针 / 引用三种传参', items: [
            '<b>值传递</b>:拷贝一份,改动不影响外界(对象大时昂贵)。',
            '<b>指针传递</b>:传地址,C 风格,可能为空、需要解引用。',
            '<b>引用传递</b>:别名字面操作本体;不可为空、必须初始化——C++ 更推荐的"双向/高效"方式。',
            '<b>const 引用</b> <code class="ic">const string&amp;</code>:只读且免拷贝,大对象传参的标准姿势。',
          ] },
          { type: 'warn', html: '<b>易错</b>:重载与默认参数混用可能产生二义性(<code class="ic">f(int)</code> 与 <code class="ic">f(int,int=2)</code> 同调 f(1));引用必须绑定已存在的变量,不能"引用字面量"(const 引用除外)。' }
        ]
      }
    ]
  },

  {
    id: 'cpp-ch2', title: '类、内存与面向对象', icon: '🧱', stage: 2,
    desc: '构造析构、深浅拷贝、继承多态与模板——C++ 的灵魂章节。',
    sections: [
      {
        id: 'cpp-class', title: '类与对象:构造与析构', stage: 2,
        desc: 'RAII 的地基',
        blocks: [
          { type: 'code', lang: 'C++', title: '一个完整的类', code: `class Student {
private:
    string name;
    int score;
public:
    Student(string n, int s) : name(n), score(s) {   // 初始化列表(推荐)
    }
    ~Student() {                                    // 析构:对象销毁时自动调用
        cout << name << " 离场\\n";
    }
    int getScore() const { return score; }          // const 成员函数:承诺只读
};

int main() {
    Student s("张三", 90);
    {
        Student t("李四", 85);      // 块结束 → t 析构(确定性销毁!)
    }                                // 这里 t 已经"离场"
    cout << s.getScore();
}    // main 结束 → s 析构` },
          { type: 'points', title: '与 Java 最大的不同', items: [
            '<b>栈对象</b>:不 new 也能创建,离开作用域<b>自动析构</b>——时机确定(RAII),不靠 GC。',
            '<b>初始化列表</b>直接初始化成员,比构造体内赋值高效(const/引用成员必须用它)。',
            '成员函数默认<strong>内联候选</strong>;<code class="ic">const</code> 修饰的成员函数内不能修改成员。',
            '析构顺序与构造顺序<strong>相反</strong>(栈的后进先出)。',
          ] }
        ]
      },
      {
        id: 'cpp-memory', title: '内存管理与智能指针', stage: 2,
        desc: '从 new/delete 到 RAII',
        blocks: [
          { type: 'code', lang: 'C++', title: '裸 new/delete 与它的坑', code: `int* p = new int(42);        // 堆上分配并初始化
Student* s = new Student("张三", 90);
delete p;  delete s;          // 必须手动归还

三大经典坑:
  忘 delete        → 内存泄漏
  delete 两次      → 未定义行为
  delete 后继续用  → 悬垂指针

现代 C++ 的答案:让"对象管理资源"(RAII)` },
          { type: 'code', lang: 'C++', title: '智能指针(现代 C++ 标配)', code: `#include <memory>

auto p = make_unique<Student>("张三", 90);  // 独占所有权
// 出作用域自动 delete,不可复制、可 move

auto s = make_shared<Student>("李四", 85);  // 引用计数共享
auto s2 = s;                                // 计数 +1
// 最后一个 shared_ptr 消失时自动释放

// unique_ptr 像独生子;shared_ptr 像合租(最后一个走的人关灯)
// 还有 weak_ptr:旁观不增加计数,破循环引用` },
          { type: 'points', title: 'RAII:资源获取即初始化', items: [
            '把资源(内存/文件/锁)绑进对象:构造获取、析构释放——<b>异常与提前 return 也不漏</b>。',
            'Java 的 try-with-resources、Python 的 with,思想同源;C++ 把它做成了语言根基。',
            '现代准则:<strong>能用栈对象就不用堆;要堆就 make_unique/make_shared;裸 new 基本淘汰</strong>。',
          ] }
        ]
      },
      {
        id: 'cpp-copy', title: '拷贝控制与三/五法则', stage: 2,
        desc: '深浅拷贝:埋葬野指针的地方',
        blocks: [
          { type: 'code', lang: 'C++', title: '浅拷贝之祸与深拷贝', code: `class Buffer {
    int* data;
    int size;
public:
    Buffer(int n) : data(new int[n]), size(n) {}
    ~Buffer() { delete[] data; }

    // 不写拷贝构造 → 编译器默认"逐成员浅拷贝"
    // 两个对象 data 指向同一块 → 析构 delete 两次 → 崩!

    // 深拷贝:自己分配自己的
    Buffer(const Buffer& o) : data(new int[o.size]), size(o.size) {
        copy(o.data, o.data + o.size, data);
    }
    Buffer& operator=(const Buffer& o) {   // 拷贝赋值
        if (this != &o) { delete[] data; data = new int[o.size];
                          size = o.size;
                          copy(o.data, o.data + size, data); }
        return *this;
    }
};` },
          { type: 'points', title: '三法则 / 五法则', items: [
            '自定义了 <b>析构 / 拷贝构造 / 拷贝赋值</b> 之一,通常三个都需要(管理裸资源时)。',
            'C++11 追加 <b>移动构造/移动赋值</b> 成五法则:转移所有权而非拷贝,性能飞跃。',
            '<code class="ic">= default</code> 显式要默认实现;<code class="ic">= delete</code> 禁止拷贝(如 unique_ptr)。',
            '成员用 string/vector/智能指针的组合,编译器默认行为即正确——<b>Rule of Zero</b>,最优雅。',
          ] }
        ]
      },
      {
        id: 'cpp-oo', title: '继承、虚函数与多态', stage: 2,
        desc: '运行时多态的钥匙是 virtual',
        blocks: [
          { type: 'code', lang: 'C++', title: 'virtual 与虚析构', code: `class Animal {
public:
    virtual void speak() const { cout << "..."; }  // 虚函数
    virtual ~Animal() = default;                  // ★ 虚析构
};
class Dog : public Animal {
public:
    void speak() const override { cout << "汪"; } // override 显式重写
};

int main() {
    Animal* a = new Dog;
    a->speak();          // 汪 —— virtual 才走"运行看右边"
    delete a;            // 虚析构保证先调 ~Dog 再 ~Animal
}` },
          { type: 'points', title: '与 Java 的关键差异', items: [
            'C++ 成员函数<b>默认不是虚函数</b>(Java 方法默认虚):不写 virtual 就没有多态——性能取舍。',
            '通过<b>基类指针/引用</b>调用才体现多态;对象直接调用在编译期绑定。',
            '<b>基类析构必须 virtual</b>:否则 delete 基类指针只调基类析构,派生部分泄漏(高频考点)。',
            '<code class="ic">override</code> 让编译器检查重写;<code class="ic">=0</code> 纯虚函数定义抽象类(同 Java abstract)。',
            'C++ 支持多继承与菱形继承(virtual 继承解冲突),Java 只有单继承+接口。',
          ] }
        ]
      },
      {
        id: 'cpp-template', title: '模板:泛型编程', stage: 2,
        desc: '类型作为参数',
        blocks: [
          { type: 'code', lang: 'C++', title: '函数模板与类模板', code: `template <typename T>
T myMax(T a, T b) { return a > b ? a : b; }

myMax(3, 5);        // T=int(实参推导)
myMax(2.5, 1.8);    // T=double

template <typename T>
class Box {
    T item;
public:
    void put(const T& v) { item = v; }
    T get() const { return item; }
};
Box<int> bi;  Box<string> bs;    // 类模板需显式指定

// STL 全是模板:vector<int>、map<string,int> …
// 模板在编译期实例化 → 零运行时开销(对比 Java 泛型擦除)` },
          { type: 'points', title: '要点', items: [
            '模板是<b>编译期</b>生成代码的"代码模具"——泛型的另一条路线(Java 擦除、C++ 实例化)。',
            '模板定义通常放头文件(实例化点需要看到完整定义)。',
            '出错信息出了名的长:看<b>第一条</b>与模板实例化相关的错误最有效。',
          ] }
        ]
      }
    ]
  }
]);
