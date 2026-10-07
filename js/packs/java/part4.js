/* ============ 第 8-9 章:IO 流 + 多线程与并发 ============ */
window.COURSE_PARTS = window.COURSE_PARTS || [];
window.COURSE_PARTS.push([

  {
    id: 'ch8', title: 'IO 流与文件操作', icon: '🌊', stage: 4,
    desc: 'File 类、字节流、字符流、缓冲流、序列化——数据进出的管道。',
    sections: [
      {
        id: 'io-file', title: 'File 类', stage: 4,
        desc: '文件与目录的抽象表示',
        blocks: [
          { type: 'code', title: 'File 常用操作', code: `import java.io.File;
import java.io.IOException;

File f = new File("D:/test/hello.txt");   // File 对象只是"路径的封装",不代表文件真实存在

System.out.println(f.exists());           // 是否存在
System.out.println(f.isFile());           // 是文件?
System.out.println(f.isDirectory());     // 是目录?
System.out.println(f.getName());          // hello.txt
System.out.println(f.getAbsolutePath()); // 绝对路径
System.out.println(f.length());           // 字节数

f.createNewFile();                        // 创建文件(路径不存在会抛 IOException)
new File("D:/test/a/b").mkdirs();         // 创建多级目录
f.delete();                               // 删除(删目录要求目录为空)` },
          { type: 'code', title: '递归遍历目录(经典案例)', code: `import java.io.File;

public class FileWalker {
    public static void main(String[] args) {
        walk(new File("D:/projects"), 0);
    }

    static void walk(File dir, int depth) {
        File[] files = dir.listFiles();     // 目录不存在或IO错误返回 null,务必判空!
        if (files == null) return;
        for (File f : files) {
            System.out.println("  ".repeat(depth) + f.getName());
            if (f.isDirectory()) walk(f, depth + 1);   // 递归进入子目录
        }
    }
}
// 变体:删除非空目录(先删子,再删自己)、按后缀过滤(listFiles(FileFilter))` },
        ]
      },
      {
        id: 'io-byte-stream', title: '字节流:读写一切数据', stage: 4,
        desc: 'InputStream / OutputStream 与文件复制',
        blocks: [
          { type: 'text', html: `<p>Java IO 的四个抽象基类:<strong>字节流</strong> <code class="ic">InputStream / OutputStream</code>(8 位,能读写图片、视频等一切文件)与<strong>字符流</strong> <code class="ic">Reader / Writer</code>(16 位,专为文本设计)。命名规律:功能 + 基类名,如 <code class="ic">FileInputStream</code>。</p>` },
          { type: 'code', title: '文件复制标准模板(背下来)', code: `import java.io.*;

public class CopyFile {
    public static void main(String[] args) {
        // try-with-resources:括号里声明的资源用完自动 close,杜绝忘记关流
        try (FileInputStream in = new FileInputStream("cat.jpg");
             FileOutputStream out = new FileOutputStream("cat_copy.jpg")) {

            byte[] buf = new byte[1024];       // 缓冲区:一次搬 1KB
            int len;                           // 实际读到的字节数
            while ((len = in.read(buf)) != -1) {   // read 返回 -1 表示读完了
                out.write(buf, 0, len);        // 注意写 0~len,不能把整个 buf 写进去
            }
            System.out.println("复制完成");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}` },
          { type: 'points', title: '关键细节', items: [
            'read() 单字节读效率极低,务必用 <b>字节数组缓冲</b>循环读写。',
            '<code class="ic">write(buf)</code> 若不加 0,len,最后一次可能把缓冲区的"脏数据"也写进去(文件变大)。',
            '输出流 <code class="ic">new FileOutputStream(path)</code> 默认<b>覆盖</b>已有文件;构造第二个参数传 <code class="ic">true</code> 则追加。',
            '中文乱码的根源:读写<b>编码不一致</b>(UTF-8 的一个中文 3 字节,GBK 2 字节,字节流按字节切会把一个汉字切碎)。',
          ] },
        ]
      },
      {
        id: 'io-char-buffer', title: '字符流与缓冲流', stage: 4,
        desc: '读文本、按行读、高效读写',
        blocks: [
          { type: 'code', title: '字符流与指定编码', code: `import java.io.*;

// FileWriter 写文本文件
try (FileWriter w = new FileWriter("note.txt", true)) {   // true 追加模式
    w.write("第一行\\n");
    w.write("第二行\\n");
} catch (IOException e) { e.printStackTrace(); }

// FileReader 读文本
try (FileReader r = new FileReader("note.txt")) {
    int c;
    while ((c = r.read()) != -1) System.out.print((char) c);
}

// 转换流:指定字符集读文件(防止乱码)
try (Reader r = new InputStreamReader(
        new FileInputStream("gbk.txt"), "GBK")) {
    ...
}` },
          { type: 'code', title: '缓冲流:自带 8KB 缓冲,效率飞跃', code: `import java.io.*;

// BufferedReader 独门绝技:readLine() 按行读
try (BufferedReader br = new BufferedReader(new FileReader("note.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {   // 不含换行符,自己补
        System.out.println(line);
    }
}

// BufferedWriter 独门绝技:newLine() 跨平台换行
try (BufferedWriter bw = new BufferedWriter(new FileWriter("log.txt"))) {
    bw.write("2026-10-03 启动");
    bw.newLine();
    bw.write("加载完成");
}

// 缓冲字节流包装,大文件复制提速数倍~数十倍
new BufferedInputStream(new FileInputStream("big.zip"))` },
          { type: 'warn', html: '<b>装饰器模式</b>:缓冲流不直接连文件,而是"包"在节点流外面增强功能——这就是 IO 流可以层层套娃的原因。关闭时只关最外层即可。' },
        ]
      },
      {
        id: 'io-serialize', title: '对象序列化', stage: 4,
        desc: '对象 ↔ 字节的转换',
        blocks: [
          { type: 'code', title: '把对象存进文件、再读回来', code: `import java.io.*;

// 1. 实体类必须实现 Serializable 接口(标记接口,无方法)
public class User implements Serializable {
    // 2. 显式声明版本号:类结构变化时,新旧版本不兼容会抛 InvalidClassException
    private static final long serialVersionUID = 1L;

    private String name;
    private transient String password;   // transient:该字段不参与序列化(安全敏感字段)

    public User(String name, String password) {
        this.name = name;
        this.password = password;
    }
    @Override public String toString() { return name + "/" + password; }
}

// 序列化:对象 -> 文件
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.bin"))) {
    oos.writeObject(new User("张三", "123456"));
}

// 反序列化:文件 -> 对象
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.bin"))) {
    User u = (User) ois.readObject();
    System.out.println(u);       // 张三/null(password 未被序列化)
}` },
          { type: 'note', html: '<b>延伸</b>:Java 原生序列化只在 Java 程序间使用,跨语言/跨系统传输现在普遍用 JSON(Gson、Jackson、FastJSON)——把对象转成可读文本。思路一致:序列化与反序列化。' },
        ]
      }
    ]
  },

  {
    id: 'ch9', title: '多线程与并发', icon: '⚡', stage: 4,
    desc: '让程序同时做多件事:线程创建、同步、通信、线程池。',
    sections: [
      {
        id: 'thread-create', title: '线程的创建与启动', stage: 4,
        desc: 'Thread / Runnable / Callable',
        blocks: [
          { type: 'text', html: `<p><strong>进程</strong>是运行中的程序(资源分配单位),<strong>线程</strong>是进程内的执行单元(CPU 调度单位)。一个 Java 程序启动时至少有 main 线程和 GC 线程。<strong>并发</strong>指交替执行(单核也行),<strong>并行</strong>指同时执行(多核)。</p>` },
          { type: 'code', title: '三种创建方式', code: `import java.util.concurrent.*;

// 方式一:继承 Thread(简单,但占用唯一的继承名额)
class MyThread extends Thread {
    @Override
    public void run() {                       // 任务写在 run 里
        System.out.println(getName() + " 执行中");
    }
}

// 方式二:实现 Runnable(推荐:不影响继承,任务与线程解耦)
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " 跑任务");
    }
}

// 方式三:Callable + FutureTask(有返回值、能抛异常)
class CalcTask implements Callable<Integer> {
    @Override
    public Integer run() throws Exception {   // 注意方法名是 call
        Thread.sleep(100);
        return 100 + 1;
    }
}

public class Demo {
    public static void main(String[] args) throws Exception {
        new MyThread().start();               // start() 开新线程,run() 只是普通方法调用!

        new Thread(new MyTask(), "打工线程").start();

        // Lambda 写 Runnable(最常用)
        new Thread(() -> System.out.println("lambda 线程")).start();

        FutureTask<Integer> ft = new FutureTask<>(new CalcTask());
        new Thread(ft).start();
        System.out.println("结果:" + ft.get());   // 阻塞等待结果:101
    }
}` },
          { type: 'points', title: '线程常用方法与生命周期', items: [
            '<code class="ic">start()</code> 启动线程并由 JVM 调用 run;直接调 run 是单线程顺序执行,常见低级错误。',
            '<code class="ic">Thread.sleep(ms)</code> 静态方法,<b>当前线程</b>暂停,不释放锁;时间到自动继续。',
            '<code class="ic">t.join()</code>:等待 t 执行完再走(插队);<code class="ic">t.setDaemon(true)</code> 守护线程(如 GC,用户线程全结束它就结束)。',
            '<b>六种状态</b>:NEW → RUNNABLE ⇄ BLOCKED / WAITING / TIMED_WAITING → TERMINATED。',
            '<b>线程优先级</b>只是建议(1~10),不能依赖它保证执行顺序。',
          ] },
        ]
      },
      {
        id: 'thread-sync', title: '线程安全与 synchronized', stage: 4,
        desc: '竞态条件、锁、Lock',
        blocks: [
          { type: 'text', html: `<p>多个线程同时读写同一份数据且包含写操作时,可能出现<strong>竞态条件</strong>:比如经典的"卖票超卖"——ticket-- 看似一步,实际是"读→减→写"三步,线程可能在任意两步之间被打断。</p>` },
          { type: 'code', title: '问题现场与 synchronized 解决', code: `public class Ticket implements Runnable {
    private int tickets = 100;

    @Override
    public void run() {
        while (true) {
            synchronized (this) {          // 锁住"同一把锁"(这里是 this,多个线程共用一个 Ticket 对象)
                if (tickets <= 0) break;
                try { Thread.sleep(10); } catch (InterruptedException e) { }
                System.out.println(Thread.currentThread().getName()
                        + " 卖出第 " + tickets-- + " 张");
            }                              // 出了同步代码块,锁自动释放
        }
    }
}

new Thread(t, "窗口1").start();   // 三个窗口(线程)共享 t 的 100 张票
new Thread(t, "窗口2").start();
new Thread(t, "窗口3").start();
// 锁对了:不会出现卖出重复票或 0 票、-1 票` },
          { type: 'points', title: 'synchronized 三种用法与规则', items: [
            '同步<b>代码块</b> <code class="ic">synchronized(锁对象){}</code>:粒度最小,锁对象必须<b>所有线程可见且唯一</b>(不能用 String 常量、包装类缓存对象当锁)。',
            '同步<b>实例方法</b>:锁的是 this;同步<b>静态方法</b>:锁的是类的 Class 对象(全局锁)。',
            'Java 的锁是<b>可重入</b>的:同一线程可以重复获取自己已持有的锁,不会把自己锁死。',
            '<b>牺牲性能换安全</b>:锁的范围越小越好,能用代码块别锁整个方法。',
          ] },
          { type: 'code', title: 'Lock 接口(JDK5+)', code: `import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();                 // 手动加锁
        try {
            count++;
        } finally {
            lock.unlock();           // 必须在 finally 里解锁,防止异常导致死锁
        }
    }
}
// Lock 相比 synchronized 的优势:tryLock() 尝试获取(拿不到先干别的)、
// 可中断、可指定公平锁、可配合 Condition 精确唤醒 —— 灵活但要求手动管理` },
        ]
      },
      {
        id: 'thread-communication', title: '线程通信与死锁', stage: 4,
        desc: 'wait / notify、生产者消费者',
        blocks: [
          { type: 'code', title: 'wait 与 notify:交替打印', code: `public class AlternatePrint {
    private static final Object LOCK = new Object();
    private static int num = 1;

    public static void main(String[] args) {
        new Thread(() -> print(true), "奇数线程").start();
        new Thread(() -> print(false), "偶数线程").start();
    }

    static void print(boolean odd) {
        synchronized (LOCK) {
            while (num <= 10) {
                if ((num % 2 == 1) != odd) {
                    try {
                        LOCK.wait();      // 不是自己的数,等待并释放锁
                    } catch (InterruptedException e) { }
                } else {
                    System.out.println(Thread.currentThread().getName() + ": " + num++);
                    LOCK.notifyAll();     // 唤醒对方
                }
            }
        }
    }
}
// 规则:wait/notify/notifyAll 必须在 synchronized 块内、通过锁对象调用,否则 IllegalMonitorStateException
// 区别:sleep 抱着锁睡,wait 放下锁等;wait 会被 notify 唤醒` },
          { type: 'points', title: '死锁与 volatile', items: [
            '<b>死锁</b>:线程1 持锁A等锁B,线程2 持锁B等锁A。预防:所有线程<b>按相同顺序</b>获取锁;用 tryLock 设超时。jstack 工具可检测死锁。',
            '<code class="ic">volatile</code>:保证<b>可见性</b>(一个线程改了,其他线程立刻看到新值)和禁止指令重排,<b>但不保证原子性</b>——count++ 依然会丢,适合一个写多个读的标志位。',
            '需要原子性自增:用原子类 <code class="ic">AtomicInteger.incrementAndGet()</code>(底层 CAS 无锁算法,比锁快)。',
          ] },
        ]
      },
      {
        id: 'thread-pool', title: '线程池', stage: 4,
        desc: '复用线程,控制并发的正规军',
        blocks: [
          { type: 'text', html: `<p>每来一个任务就 new 一个线程,高并发下线程频繁创建销毁、数量失控,系统直接被压垮。<strong>线程池</strong>提前创建一批线程反复使用:降低资源消耗、提高响应速度、便于统一管理。</p>` },
          { type: 'code', title: '创建与使用', code: `import java.util.concurrent.*;

public class PoolDemo {
    public static void main(String[] args) {
        // 阿里规范:不要用 Executors 快捷方法(无界队列会 OOM),
        // 手动 new ThreadPoolExecutor,把参数想清楚
        ExecutorService pool = new ThreadPoolExecutor(
                2,                              // corePoolSize 核心线程数(常驻)
                4,                              // maximumPoolSize 最大线程数
                60, TimeUnit.SECONDS,           // 临时线程空闲 60s 回收
                new ArrayBlockingQueue<>(100),  // 任务等待队列(有界!)
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy()   // 拒绝策略:队列满+线程满时抛异常
                // 其他策略:CallerRunsPolicy(调用者自己跑)、DiscardPolicy(丢弃)、DiscardOldestPolicy(丢最老)
        );

        for (int i = 1; i <= 5; i++) {
            final int id = i;
            pool.execute(() -> {                       // 提交 Runnable
                System.out.println(Thread.currentThread().getName() + " 处理订单 " + id);
                try { Thread.sleep(500); } catch (InterruptedException e) { }
            });
        }

        Future<String> f = pool.submit(() -> "计算结果");   // 提交 Callable,拿返回值
        try { System.out.println(f.get()); } catch (Exception e) { }

        pool.shutdown();          // 不再接新任务,已提交的执行完后关闭
    }
}` },
          { type: 'points', title: '任务提交流程(面试)', items: [
            '核心线程没满 → 创建核心线程执行;满了 → 任务进<b>队列</b>排队。',
            '队列满了 → 创建<b>临时线程</b>;临时线程也到最大数 → 触发<b>拒绝策略</b>。',
            '核心参数:核心线程数、最大线程数、空闲存活时间、时间单位、任务队列、线程工厂、拒绝策略。',
            '<b>参数经验</b>:CPU 密集型 ≈ 核数+1;IO 密集型 ≈ 核数×2 或按"核数/(1-阻塞比)"估算,压测定案。',
          ] },
          { type: 'tip', html: '<b>阶段检验</b>:写出"两个线程交替打印 1-100"、"生产者-消费者(缓冲区满则等,空则产)"、"10 万个数多线程求和(拆分+Future 汇总)"三个案例,并发基础就扎实了。' },
        ]
      }
    ]
  }
]);
