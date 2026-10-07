/* ============ C++ 中心 · 第 3 章:STL 与现代 C++ ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'cpp-ch3', title: 'STL 与现代 C++', icon: '🚀', stage: 3,
    desc: '标准模板库、lambda 与移动语义,以及工程的编译链接常识。',
    sections: [
      {
        id: 'cpp-stl', title: 'STL 容器与算法', stage: 3,
        desc: '写 C++ 的日常兵器谱',
        blocks: [
          { type: 'table', head: ['容器', '底层', '一句话'],
            rows: [
              ['vector', '动态数组', '默认首选:尾部 O(1) 增删,随机访问快'],
              ['list', '双向链表', '任意位置 O(1) 增删(有迭代器),不支持随机访问'],
              ['map / set', '红黑树', '有序、查找 O(logn);重复版 multimap/multiset'],
              ['unordered_map/set', '哈希表', '平均 O(1) 查找,无序——对应 Java HashMap/HashSet'],
              ['string', '字符数组封装', '拼接/查找/子串,优于 C 字符串'],
            ] },
          { type: 'code', lang: 'C++', title: '容器 + 算法组合拳', code: `#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

vector<int> v = {5, 2, 8, 1, 9};

sort(v.begin(), v.end());                 // 排序(默认升序)
sort(v.begin(), v.end(), greater<>());    // 降序:传可调用对象
auto it = find(v.begin(), v.end(), 8);    // 查找
int total = accumulate(v.begin(), v.end(), 0);   // 求和

for (int x : v) cout << x << ' ';         // 范围 for 遍历

// 迭代器是"泛型指针":算法通过它操作任意容器
// v.push_back(42);  v.size();  v.pop_back();` },
          { type: 'points', title: '使用要点', items: [
            '<b>选型</b>:默认 vector;键值查找用 unordered_map;需要有序遍历才 map。',
            '<b>迭代器失效</b>:vector 扩容/中间插入会使旧迭代器失效——修改后重新获取(高频坑)。',
            '算法与容器解耦:sort/find/accumulate 等对所有容器通用,配合 lambda 无限组合。',
          ] }
        ]
      },
      {
        id: 'cpp-modern', title: '现代 C++:auto、lambda 与移动', stage: 3,
        desc: 'C++11 以后的三大红利',
        blocks: [
          { type: 'code', lang: 'C++', title: '现代写法速览', code: `// auto:让编译器推导(类型很长时是救星)
auto v = vector<int>{1, 2, 3};
for (auto& x : v) x *= 2;          // 引用遍历可修改

// lambda:就地定义可调用对象
auto add = [](int a, int b) { return a + b; };
sort(v.begin(), v.end(), [](int a, int b){ return a > b; });
int base = 10;
auto f = [base](int x) { return x + base; };   // 捕获外部变量

// 移动语义:转移所有权,免深拷贝
string a = "很长的字符串……";
string b = move(a);       // a 的资源"搬"给 b(a 变空壳)

// nullptr 替代 NULL;constexpr 编译期计算` },
          { type: 'points', title: '为什么要有移动', items: [
            '拷贝 = 复制资源(贵);移动 = 接管指针(廉):vector 扩容、返回大对象全靠它提速。',
            '<code class="ic">std::move</code> 只是"转为右值"的类型转换标记,真正搬运的是移动构造/赋值。',
            '回调/谓词就地写 lambda,替代旧时代的函数指针与仿函数。',
          ] }
        ]
      },
      {
        id: 'cpp-compile', title: '编译、链接与头文件', stage: 3,
        desc: '从源码到可执行文件',
        blocks: [
          { type: 'code', lang: 'Text', title: '四阶段与两种错误', code: `hello.cpp ──预处理──► hello.i(展开 #include/#define)
         ──编译──►   hello.s(汇编)
         ──汇编──►   hello.o(目标文件:机器码+符号表)
         ──链接──►   hello(可执行)

编译错误:语法/类型问题(好定位)
链接错误:undefined reference to ...(声明了没定义/没链库)
          multiple definition ...(头文件里放了定义,违反 ODR)

实战多文件:
  a.h 声明  a.cpp 定义  main.cpp #include "a.h"
  g++ main.cpp a.cpp -o app        // 一起编译链接` },
          { type: 'points', title: '头文件规矩(必背)', items: [
            '头文件放<b>声明</b>(函数原型、class 定义、extern、template);定义放 .cpp——避免重复定义。',
            '<code class="ic">#pragma once</code>(或 include guard)防头文件被重复包含。',
            '模板与 inline 例外:定义需随头文件可见。',
            '调第三方库:include 路径(-I)+ 库(-lxxx -L 路径);CMake 是工程的现代化答案。',
          ] },
          { type: 'tip', html: '<b>学完本中心</b>:你已经能读懂大多数 C++ 代码、写出安全的现代 C++ 小项目。下一步:CMake 工程、并发(std::thread/atomic,呼应 OS 与 Java 并发)、一本《Effective C++》。🎉' }
        ]
      }
    ]
  }
]);
