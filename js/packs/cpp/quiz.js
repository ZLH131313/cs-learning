/* ============ C++ 中心 · 随堂小测题库 ============ */
window.QUIZ_BANK = {

  'cpp-intro': [
    { q: 'C++ 与 Java 在运行方式上的根本区别是?',
      options: ['C++ 跑在虚拟机上', 'C++ 编译为本地机器码直接运行,Java 编译为字节码跑在 JVM 上', 'C++ 是解释执行', '两者完全相同'],
      answer: 1,
      explain: 'C++ 由编译器直接生成目标平台机器码,无虚拟机层——这是它性能优势与跨平台弱势的根源。' },
    { q: '编译 C++ 时推荐的命令行习惯是?',
      options: ['从不加任何选项', 'g++ -std=c++17 -Wall 指定标准并开警告', '只用 gcc 不用 g++', '先转成 Java 再编译'],
      answer: 1,
      explain: '-std=c++17 明确语言版本,-Wall 打开警告让隐患早现;g++ 而非 gcc 才自动链 C++ 标准库。' }
  ],
  'cpp-basics': [
    { q: 'cin >> n 输入失败(如输入字母给 int)时,正确说法是?',
      options: ['程序自动崩溃', '流进入错误状态,后续读取都会失败,应检查并恢复', 'n 自动变成 0 并继续', '会弹出对话框'],
      answer: 1,
      explain: '流置 fail 态后所有后续读取立即失败;需 if(cin>>n) 检查,必要时 clear()+忽略缓冲。' },
    { q: 'endl 与 "\\n" 的区别是?',
      options: ['完全一样', 'endl 额外刷新输出缓冲,高频输出时 "\\n" 更快', '\\n 会清屏', 'endl 是 C 语法'],
      answer: 1,
      explain: 'endl = 换行+flush;大量输出时频繁刷新拖慢速度,循环里用 "\\n",收尾处再刷新。' }
  ],
  'cpp-function-ref': [
    { q: '函数重载的判定依据是?',
      options: ['返回类型不同', '参数个数/类型不同(返回类型不参与)', '函数名长度', '参数名不同'],
      answer: 1,
      explain: '仅看参数列表;只有返回类型不同不算重载(调用处无法区分)。' },
    { q: '大对象(如 string)作为只读参数的最佳传递方式是?',
      options: ['值传递拷贝一份', 'const 引用 const string&:免拷贝且防修改', '全局变量', '宏定义'],
      answer: 1,
      explain: 'const 引用兼得效率与安全,是 C++ 传参的标准姿势;值传递对大对象昂贵。' }
  ],
  'cpp-class': [
    { q: '栈对象离开作用域时的行为是?',
      options: ['等待 GC 回收', '立即自动调用析构函数(确定性销毁)', '变成悬垂对象', '需要手动 delete'],
      answer: 1,
      explain: 'C++ 栈对象确定性析构——RAII 的基石;这与 Java 等 GC 语言"不知何时回收"截然不同。' },
    { q: '构造函数初始化列表( : member(v) )相对构造体内赋值的优势是?',
      options: ['语法更酷', '直接初始化成员,const/引用成员必须用它', '可以访问静态变量', '运行更快且能递归'],
      answer: 1,
      explain: '初始化列表在对象构造时"原地初始化";const 成员与引用成员只能这样初始化。' }
  ],
  'cpp-memory': [
    { q: 'unique_ptr 与 shared_ptr 的所有权区别是?',
      options: ['都能随便复制', 'unique_ptr 独占不可复制;shared_ptr 引用计数共享', 'shared_ptr 更快', 'unique_ptr 可以悬垂'],
      answer: 1,
      explain: 'unique=独生子(可 move 不可 copy);shared=合租计数,最后一个指针销毁时释放;weak_ptr 旁观破循环。' },
    { q: 'RAII 的含义是?',
      options: ['随机访问内存接口', '资源获取即初始化:构造获取资源、析构自动释放', '一种设计模式的名字', '运行时自动继承'],
      answer: 1,
      explain: '把资源生命周期绑定对象生命周期,异常/提前 return 都不泄漏;try-with-resources 的思想源头。' },
    { q: '现代 C++ 中裸 new/delete 的定位是?',
      options: ['推荐日常使用', '基本被 make_unique/make_shared 取代,仅在底层库出现', '已被语言禁止', '只能用于 int'],
      answer: 1,
      explain: '现代准则:能栈不堆,要堆用智能指针;make_unique/make_shared 更安全且一次分配。' }
  ],
  'cpp-copy': [
    { q: '默认(浅)拷贝导致 double-free 的原因是?',
      options: ['编译器 bug', '两个对象的指针成员指向同一块内存,析构时各 delete 一次', '内存太小', '构造函数写错名字'],
      answer: 1,
      explain: '逐成员拷贝只复制指针值;需要深拷贝(自配资源)或直接禁用拷贝,或用 Rule of Zero。' },
    { q: '"三法则"指的是哪三个函数?',
      options: ['main/printf/scanf', '析构、拷贝构造、拷贝赋值', 'new/delete/malloc', '构造、继承、多态'],
      answer: 1,
      explain: '管理裸资源时三者常常需要一起自定义;C++11 加入移动构造/移动赋值扩为五法则。' }
  ],
  'cpp-oo': [
    { q: 'C++ 实现运行时多态的必要条件是?',
      options: ['函数同名即可', '基类函数加 virtual,并通过基类指针/引用调用', '使用 friend 关键字', '类必须是模板'],
      answer: 1,
      explain: 'C++ 成员函数默认静态绑定;virtual 开启动态绑定,且多态只在指针/引用调用时生效。' },
    { q: '将通过基类指针 delete 派生类对象,基类析构函数必须是?',
      options: ['private', 'virtual(虚析构),否则派生部分不析构', 'static', '纯格式化输出'],
      answer: 1,
      explain: '非虚析构只调基类析构,派生新增资源泄漏——"基类析构要虚"是高频考点。' },
    { q: 'override 关键字的作用是?',
      options: ['强制内联', '让编译器检查该函数确实重写了基类虚函数', '重载运算符专用', '替代 virtual'],
      answer: 1,
      explain: '签名写错(如 const 丢失)时编译器报错,是防低级重写失误的安全带。' }
  ],
  'cpp-template': [
    { q: 'C++ 模板与 Java 泛型的实现差异是?',
      options: ['完全一样', 'C++ 编译期为每个类型实例化代码;Java 运行时擦除', 'Java 性能更好', 'C++ 模板运行时反射'],
      answer: 1,
      explain: 'C++ 模板是编译期代码生成(零运行时开销、可特化);Java 泛型擦除后共享一份代码。' },
    { q: '类模板使用时的正确写法是?',
      options: ['Box b;', 'Box<int> b; 需显式指定模板实参', 'template Box b;', 'auto b = Box;'],
      answer: 1,
      explain: '函数模板可实参推导,类模板(C++17 前)必须显式指定,如 vector<int>、map<string,int>。' }
  ],
  'cpp-stl': [
    { q: '需要"平均 O(1)"按键查找,应选?',
      options: ['vector', 'list', 'unordered_map', 'stack'],
      answer: 2,
      explain: '哈希表实现的 unordered_map 平均 O(1);map(红黑树)O(logn) 但有序。' },
    { q: 'vector 扩容后,之前保存的迭代器?',
      options: ['依然有效', '失效(内存重分配),需重新获取', '自动更新', '变成指针'],
      answer: 1,
      explain: '扩容搬新家,旧迭代器指向已释放内存——修改容器后重新获取迭代器是铁律。' },
    { q: 'STL 中 sort/find/accumulate 属于?',
      options: ['成员函数', '与容器解耦的泛型算法(经迭代器操作容器)', '宏', '只能用于 vector'],
      answer: 1,
      explain: '算法库通过迭代器操作任意容器,配合 lambda/谓词无限组合——泛型编程的精髓。' }
  ],
  'cpp-modern': [
    { q: 'std::move 的真实作用是?',
      options: ['立刻移动内存数据', '把表达式转为右值引用,启用移动构造/赋值', '删除原对象', '强制内联'],
      answer: 1,
      explain: 'move 只是类型转换标记;真正搬运资源的是移动构造/赋值——之后原对象处于有效但未指定状态。' },
    { q: 'lambda 表达式 [](int a, int b){ return a > b; } 中 [] 的作用是?',
      options: ['表示数组', '捕获列表:指定外部变量如何带入', '类型推导', '异常说明'],
      answer: 1,
      explain: '[] 不捕获、[x] 按值、[&x] 按引用、[=]/[&] 批量捕获——就地回调的便携写法。' }
  ],
  'cpp-compile': [
    { q: '"undefined reference to ..." 是哪个阶段的错误?',
      options: ['预处理', '编译', '链接(声明了但没找到定义/没链库)', '运行时'],
      answer: 2,
      explain: '链接器找不到符号定义:漏写 .cpp、漏链库或声明与定义不匹配——按这几条排查。' },
    { q: '#pragma once 的作用是?',
      options: ['优化编译速度', '防止头文件被重复包含', '强制内联', '声明主函数'],
      answer: 1,
      explain: '同一翻译单元内该头文件只包含一次,替代传统 include guard,现代编译器均支持。' },
    { q: '头文件中应该放什么?',
      options: ['所有函数的完整定义', '声明(原型/class 定义/extern);定义放 .cpp,模板与 inline 除外', '只放注释', 'main 函数'],
      answer: 1,
      explain: '声明进头、定义进源,避免多处包含导致重复定义(ODR);模板需完整定义可见故留头文件。' }
  ]
};
