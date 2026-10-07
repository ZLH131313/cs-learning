/* ============ Java 学习中心 · 应用逻辑 ============ */
(function () {
  'use strict';

  /* ---------- 课程包识别:不同中心加载不同数据,学习记录互相隔离 ---------- */
  const PACK_ID = window.SITE_PACK_ID || 'java';
  const META = window.SITE_META || {
    title: 'Java 学习中心 — 系统化 Java 知识体系',
    name: 'Java 学习中心',
    icon: '☕',
    sub: '从零到精通的知识体系',
    tag: 'JAVA · 从零到精通',
    heroTitle: 'Java 知识体系全景图',
    heroBody: '从语法基础、面向对象,到集合、多线程、JVM,再到 Spring 框架。',
    heroTail: '每个知识点都配有可运行的代码示例、避坑要点与随堂小测。',
    footerTip: '建议搭配 JDK 17 实操练习,代码看懂了更要敲出来',
    searchHint: '搜索知识点,如:多态、HashMap、线程…',
    typeWords: ['面向对象', '集合框架与泛型', '多线程并发', 'JVM 虚拟机', 'Spring 框架', '面试高频考点']
  };

  /* ---------- 数据准备 ---------- */
  const CHAPTERS = (window.COURSE_PARTS || []).flat();
  const SECTIONS = [];                       // 全站小节扁平化(用于上下篇导航)
  CHAPTERS.forEach(ch => ch.sections.forEach(sec => {
    sec._chapter = ch;
    SECTIONS.push(sec);
  }));
  const SEC_BY_ID = {};
  SECTIONS.forEach(s => { SEC_BY_ID[s.id] = s; });
  /* 概念特训题池:全部小测题打平,带稳定 id */
  const DRILL_POOL = [];
  Object.keys(window.QUIZ_BANK || {}).forEach(secId => {
    (window.QUIZ_BANK[secId] || []).forEach((q, i) => {
      DRILL_POOL.push({ id: secId + '#' + i, secId: secId, q: q.q, options: q.options, answer: q.answer, explain: q.explain });
    });
  });

  /* ---------- 工具 ---------- */
  const $ = sel => document.querySelector(sel);
  const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const stripTags = html => html.replace(/<[^>]+>/g, ' ');
  const REDUCE_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const STORE_KEY = PACK_ID + '-progress-v1';
  const READING_KEY = PACK_ID + '-reading-v1';
  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  };
  const loadReading = () => {
    try {
      const r = JSON.parse(localStorage.getItem(READING_KEY));
      if (r && typeof r === 'object') {
        return {
          font: [0, 1, 2, 3].indexOf(r.font) >= 0 ? r.font : 1,
          last: r.last || null,
          pos: r.pos || {},
          voice: typeof r.voice === 'string' ? r.voice : null,
          rate: typeof r.rate === 'number' ? Math.min(2, Math.max(0.5, r.rate)) : 0.95,
          tts: (r.tts && typeof r.tts.idx === 'number' && typeof r.tts.sec === 'string') ? r.tts : null
        };
      }
    } catch (e) { /* 忽略 */ }
    return { font: 1, last: null, pos: {}, voice: null, rate: 0.95, tts: null };
  };
  let progress = loadProgress();
  let reading = loadReading();
  const saveProgress = () => localStorage.setItem(STORE_KEY, JSON.stringify(progress));
  const saveReading = () => localStorage.setItem(READING_KEY, JSON.stringify(reading));
  const doneCount = () => SECTIONS.filter(s => progress[s.id]).length;
  let currentQuiz = [];
  let currentSectionId = null;
  let doneNextTimer = null;      // 打卡后自动进入下一节的延时器

  const DRILL_KEY = PACK_ID + '-drill-v1';
  const loadDrill = () => {
    try {
      const d = JSON.parse(localStorage.getItem(DRILL_KEY));
      if (d && typeof d === 'object') {
        return { rounds: d.rounds || 0, correct: d.correct || 0, wrong: d.wrong || 0, items: d.items || {} };
      }
    } catch (e) { /* 忽略 */ }
    return { rounds: 0, correct: 0, wrong: 0, items: {} };
  };
  let drill = loadDrill();
  const saveDrill = () => localStorage.setItem(DRILL_KEY, JSON.stringify(drill));

  /* ---------- Java 语法高亮 ---------- */
  const KEYWORDS = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
    'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
    'volatile', 'while', 'var', 'record', 'yield', 'true', 'false', 'null'
  ];
  const HL_RE = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +          // 1 注释
    '|("(?:\\\\.|[^"\\\\])*")' +                        // 2 字符串
    '|(@[A-Za-z]\\w*)' +                                // 3 注解
    '|\\b(' + KEYWORDS.join('|') + ')\\b' +             // 4 关键字
    '|\\b(\\d[\\d_]*(?:\\.[\\d_]+)?[fFdDlL]?)\\b' +     // 5 数字
    '|\\b([A-Z][A-Za-z0-9_]*)\\b',                      // 6 大写开头类型名
    'g'
  );
  function highlightJava(code) {
    return escapeHtml(code).replace(HL_RE, (m, cmt, str, anno, kw, num, type) => {
      if (cmt) return '<span class="tok-comment">' + cmt + '</span>';
      if (str) return '<span class="tok-string">' + str + '</span>';
      if (anno) return '<span class="tok-anno">' + anno + '</span>';
      if (kw) return '<span class="tok-keyword">' + kw + '</span>';
      if (num) return '<span class="tok-number">' + num + '</span>';
      if (type) return '<span class="tok-type">' + type + '</span>';
      return m;
    });
  }

  /* ---------- 搜索索引 ---------- */
  const SEARCH_INDEX = SECTIONS.map(sec => ({
    sec: sec,
    title: sec.title,
    chapter: sec._chapter.title,
    text: sec.blocks.map(b => {
      if (b.type === 'code') return b.code;
      if (b.type === 'points') return (b.items || []).join(' ');
      if (b.type === 'table') return (b.head || []).concat(...(b.rows || [])).join(' ');
      return b.html || '';
    }).map(stripTags).join(' ').replace(/\s+/g, ' ')
  }));

  /* ---------- 路由 ---------- */
  function navigate() {
    clearTimeout(doneNextTimer);        // 用户已手动跳转,取消自动进阶
    hideGlossaryPop();
    saveCurrentPos();
    stopSpeech();
    const hash = location.hash || '#/home';
    const m = hash.match(/^#\/lesson\/([\w-]+)$/);
    if (m && SEC_BY_ID[m[1]]) renderLesson(SEC_BY_ID[m[1]]);
    else if (hash === '#/drill') renderDrill();
    else renderHome();
    closeMobileSidebar();
    updateProgressBar();
    refreshTocActive();
  }
  window.addEventListener('hashchange', navigate);

  /* ---------- 侧边栏目录 ---------- */
  function renderToc() {
    let html = '';
    CHAPTERS.forEach(ch => {
      const chDone = ch.sections.filter(s => progress[s.id]).length;
      html += '<div class="toc-chapter open" data-ch="' + ch.id + '">'
        + '<button class="toc-ch-head" type="button">'
        + '<span class="ch-icon">' + ch.icon + '</span>'
        + '<span>' + escapeHtml(ch.title) + '</span>'
        + (chDone === ch.sections.length ? '<span style="margin-left:6px">✅</span>' : '')
        + '<span class="ch-arrow">▶</span></button>'
        + '<div class="toc-sections">';
      ch.sections.forEach(sec => {
        html += '<a class="toc-sec" data-sec="' + sec.id + '" href="#/lesson/' + sec.id + '">'
          + '<span class="dot"></span><span>' + escapeHtml(sec.title) + '</span></a>';
      });
      html += '</div></div>';
    });
    $('#toc').innerHTML = html;

    $('#toc').addEventListener('click', e => {
      const head = e.target.closest('.toc-ch-head');
      if (head) head.parentElement.classList.toggle('open');
    });
  }
  function refreshTocActive() {
    document.querySelectorAll('.toc-sec').forEach(a => {
      const id = a.dataset.sec;
      a.classList.toggle('active', location.hash === '#/lesson/' + id);
      a.classList.toggle('done', !!progress[id]);
    });
  }

  /* ---------- 首页 ---------- */
  const STAGES = window.SITE_STAGES || [
    { name: '第一阶段 · 入门筑基', desc: '认识 Java,掌握语法地基' },
    { name: '第二阶段 · 面向对象', desc: 'Java 的思想精髓' },
    { name: '第三阶段 · 核心 API 与数据结构', desc: '字符串、集合、异常、泛型' },
    { name: '第四阶段 · 进阶必杀', desc: 'IO 流与多线程并发' },
    { name: '第五阶段 · 深入底层', desc: '反射、函数式、JVM 与路线' },
    { name: '第六阶段 · 主流框架', desc: 'Spring 核心:IoC、AOP、事务、MVC 与 Boot' },
  ];
  function renderHome() {
    currentSectionId = null;
    stopSpeech();
    demoStopAll();
    const dockSpeak = document.getElementById('rd-speak');
    if (dockSpeak) dockSpeak.style.display = 'none';
    const dockStop = document.getElementById('rd-stop');
    if (dockStop) dockStop.style.display = 'none';
    window.scrollTo(0, 0);

    const total = SECTIONS.length;
    const done = doneCount();
    const pct = Math.round(done / total * 100);
    const resume = reading.last && SEC_BY_ID[reading.last] ? SEC_BY_ID[reading.last] : null;
    const next = resume || SECTIONS.find(s => !progress[s.id]) || SECTIONS[0];

    let html = '<div class="content-wrap">';

    // Hero
    html += '<section class="hero">'
      + '<span class="hero-tag">' + escapeHtml(META.tag) + '</span>'
      + '<h1>' + escapeHtml(META.heroTitle) + '</h1>'
      + '<div class="hero-type">' + META.icon + ' 正在点亮<b id="hero-type"></b><i class="caret">▍</i></div>'
      + '<p>' + CHAPTERS.length + ' 章系统化知识框架:' + escapeHtml(META.heroBody) + escapeHtml(META.heroTail) + '</p>'
      + '<div class="hero-stats">'
      + '<div class="hstat"><div class="n"><span class="cnt" data-t="' + CHAPTERS.length + '">0</span><em> 章</em></div><div class="l">知识模块</div></div>'
      + '<div class="hstat"><div class="n"><span class="cnt" data-t="' + total + '">0</span><em> 节</em></div><div class="l">知识点精讲</div></div>'
      + '<div class="hstat"><div class="n"><span class="cnt" data-t="' + done + '">0</span><em> / ' + total + '</em></div><div class="l">已完成学习</div></div>'
      + '<div class="hstat"><div class="n"><span class="cnt" data-t="' + pct + '">0</span><em>%</em></div><div class="l">总体进度</div></div>'
      + '</div>'
      + '<div class="hero-actions">'
      + '<a class="btn-start" href="#/lesson/' + next.id + '">'
      + (resume ? '📍 继续上次阅读' : (done ? '📖 继续学习' : '🚀 开始学习')) + '</a>'
      + '<a class="btn-ghost" href="#/drill">🧠 概念特训</a>'
      + (resume ? '<span class="last-read">上次读到:' + escapeHtml(resume._chapter.title) + ' · ' + escapeHtml(resume.title) + '</span>' : '')
      + (done ? '<button class="btn-ghost" id="btn-reset">↺ 重置进度</button>' : '')
      + '</div></section>';

    // 学习路线
    html += '<section class="home-sec"><h2>🗺️ 学习路线 · ' + STAGES.length + ' 大阶段</h2><div class="sub">按阶段循序渐进,每个阶段都是下一阶段的基石</div><div class="roadmap">';
    STAGES.forEach((st, i) => {
      const chapters = CHAPTERS.filter(ch => ch.stage === i + 1);
      if (!chapters.length) return;
      html += '<div class="rm-row">'
        + '<div class="rm-stage"><span class="rm-badge">' + st.name.replace('第', '第 ') + '</span>'
        + '<h4>' + st.desc + '</h4><div class="chips">'
        + chapters.map(ch => '<span class="chip">' + ch.icon + ' ' + escapeHtml(ch.title) + '</span>').join('')
        + '</div></div>'
        + '</div>';
    });
    html += '</div></section>';

    // 章节卡片
    html += '<section class="home-sec"><h2>📚 章节目录</h2><div class="sub">点击任意章节开始,进度自动保存</div><div class="chapter-grid">';
    CHAPTERS.forEach((ch, ci) => {
      const chDone = ch.sections.filter(s => progress[s.id]).length;
      const cp = Math.round(chDone / ch.sections.length * 100);
      html += '<a class="ch-card" href="#/lesson/' + ch.sections[0].id + '">'
        + (cp === 100 ? '<span class="cc-done-badge">✅</span>' : '')
        + '<div class="cc-icon">' + ch.icon + '</div>'
        + '<h3>第 ' + (ci + 1) + ' 章 · ' + escapeHtml(ch.title) + '</h3>'
        + '<div class="cc-desc">' + escapeHtml(ch.desc) + '</div>'
        + '<div class="cc-meta"><span>' + ch.sections.length + ' 节 · 已学 ' + chDone + '</span>'
        + '<span class="cc-progress"><i style="width:' + cp + '%"></i></span></div>'
        + '</a>';
    });
    html += '</div></section>';

    html += renderExtLinksHtml();

    html += '<div class="footer">' + META.icon + ' ' + escapeHtml(META.name) + ' · 系统化知识框架 · 学习数据保存在本地浏览器<br>' + escapeHtml(META.footerTip) + '</div>';
    html += '</div>';

    const main = $('#main');
    main.innerHTML = html;
    const reset = $('#btn-reset');
    if (reset) reset.addEventListener('click', () => {
      if (confirm('确定清空全部学习进度吗?')) {
        progress = {};
        saveProgress();
        renderHome();
        refreshTocActive();
        updateTopProgress();
      }
    });
    bindExtLinks();
    refreshTocActive();
    startHeroFx();
    observeReveal();
  }

  /* ---------- 知识点页 ---------- */
  function renderBlocks(sec) {
    let html = '';
    sec.blocks.forEach(b => {
      switch (b.type) {
        case 'text':
          html += '<div class="prose">' + b.html + '</div>';
          break;
        case 'code':
          html += '<div class="code-block"><div class="code-head">'
            + '<span class="code-lang">' + (b.lang || 'Java') + '</span>'
            + (b.title ? '<span class="code-title">' + escapeHtml(b.title) + '</span>' : '')
            + '<button class="btn-copy" type="button">复制</button></div>'
            + '<pre><code>' + highlightJava(b.code) + '</code></pre></div>';
          break;
        case 'points':
          html += '<div class="callout note"><div class="co-title">💡 ' + (b.title || '要点') + '</div><ul>'
            + b.items.map(i => '<li>' + i + '</li>').join('') + '</ul></div>';
          break;
        case 'note':
          html += '<div class="callout note"><div class="co-title">📌 说明</div>' + b.html + '</div>';
          break;
        case 'warn':
          html += '<div class="callout warn"><div class="co-title">⚠️ 避坑</div>' + b.html + '</div>';
          break;
        case 'tip':
          html += '<div class="callout tip"><div class="co-title">✅ 建议</div>' + b.html + '</div>';
          break;
        case 'table':
          html += '<div class="prose"><table><thead><tr>'
            + b.head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>'
            + b.rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('')
            + '</tbody></table></div>';
          break;
      }
    });
    return html;
  }

  function renderLesson(sec, keepScroll) {
    demoStopAll();
    const ch = sec._chapter;
    const idx = SECTIONS.indexOf(sec);
    const prev = SECTIONS[idx - 1];
    const next = SECTIONS[idx + 1];
    const chIdx = CHAPTERS.indexOf(ch) + 1;
    const isDone = !!progress[sec.id];

    let html = '<div class="content-wrap">';
    html += '<div class="crumbs"><a href="#/home">知识总览</a> / ' + escapeHtml(ch.title) + ' / <b>' + escapeHtml(sec.title) + '</b></div>';
    html += '<div class="lesson-head"><span class="lesson-no">' + ch.icon + ' 第 ' + chIdx + ' 章</span><h1>' + escapeHtml(sec.title) + '</h1></div>';
    html += '<div class="lesson-desc"><span class="read-time" title="按内容量估算">⏱ 约 ' + readingMinutes(sec) + ' 分钟</span>' + escapeHtml(sec.desc) + '</div>';
    html += renderBlocks(sec);
    if (sec === ch.sections[0]) html += renderBuildDemo(sec);   // 每章首节:从零构建演示
    currentQuiz = (window.QUIZ_BANK && window.QUIZ_BANK[sec.id]) || [];
    html += renderQuiz(sec);

    html += '<div class="lesson-foot">'
      + '<button class="btn-done' + (isDone ? ' is-done' : '') + '" id="btn-done">'
      + (isDone ? '✅ 已掌握,点此取消' : '☑️ 我已掌握本节') + '</button>'
      + '<div class="nav-prev-next">'
      + (prev ? '<a class="nav-pn" href="#/lesson/' + prev.id + '"><div class="pn-label">← 上一节</div><div class="pn-title">' + escapeHtml(prev.title) + '</div></a>'
              : '<div class="nav-pn mute"></div>')
      + (next ? '<a class="nav-pn next" href="#/lesson/' + next.id + '"><div class="pn-label">下一节 →</div><div class="pn-title">' + escapeHtml(next.title) + '</div></a>'
              : '<div class="nav-pn mute"></div>')
      + '</div></div></div>';

    const main = $('#main');
    main.innerHTML = html;

    currentSectionId = sec.id;
    reading.last = sec.id;
    saveReading();

    const dockSpeak = document.getElementById('rd-speak');
    if (dockSpeak) dockSpeak.style.display = '';
    updateSpeakBtn();             // 有断点时按钮自动变为 ▶ 继续态

    // 恢复上次阅读位置(有有效记录且不在页首/页尾时)
    const savedY = reading.pos[sec.id] || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (savedY > 150 && savedY < maxScroll - 80) {
      window.scrollTo(0, savedY);
      if (!keepScroll) showToast('📍 已回到上次阅读位置');
    } else {
      window.scrollTo(0, 0);
    }
    updateProgressBar();
    observeReveal();

    // 名词自动高亮(代码块/测验/演示区除外)
    linkGlossary(main);

    // 章首:绑定从零构建演示
    bindBuildDemo(sec);

    // 复制按钮
    main.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.closest('.code-block').querySelector('code').textContent;
        const ok = () => { btn.textContent = '已复制 ✓'; setTimeout(() => btn.textContent = '复制', 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(ok, () => fallbackCopy(code, ok));
        } else fallbackCopy(code, ok);
      });
    });

    // 标记已学:打卡成功后自动进入下一节
    $('#btn-done').addEventListener('click', e => {
      clearTimeout(doneNextTimer);
      if (progress[sec.id]) {
        delete progress[sec.id];
        saveProgress();
        renderLesson(sec, true);
      } else {
        progress[sec.id] = true;
        confettiBurst(e.clientX || 0, e.clientY || 0);
        saveProgress();
        renderLesson(sec, true);
        const idx = SECTIONS.indexOf(sec);
        const next = SECTIONS[idx + 1];
        showToast(next ? '✅ 已掌握!即将进入:' + next.title : '🎉 恭喜!全部小节已学完');
        if (next) {
          doneNextTimer = setTimeout(() => {
            location.hash = '#/lesson/' + next.id;
          }, 1000);
        }
      }
      refreshTocActive();
      updateTopProgress();
    });

    refreshTocActive();
    updateTopProgress();
  }

  function fallbackCopy(text, ok) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* ---------- 随堂小测 ---------- */
  function renderQuiz(sec) {
    const quiz = currentQuiz;
    if (!quiz.length) return '';
    let html = '<section class="quiz-wrap"><h3 class="quiz-title">📝 随堂小测'
      + '<span class="quiz-count">共 ' + quiz.length + ' 题 · 点击选项即判分</span></h3>';
    quiz.forEach((item, qi) => {
      html += '<div class="quiz-item" data-qi="' + qi + '">'
        + '<div class="quiz-q"><span class="q-no">' + (qi + 1) + '.</span>' + escapeHtml(item.q) + '</div>'
        + '<div class="quiz-opts">'
        + item.options.map((opt, oi) =>
            '<button type="button" class="quiz-opt" data-oi="' + oi + '"><b>' + 'ABCD'[oi] + '</b><span>' + escapeHtml(opt) + '</span></button>'
          ).join('')
        + '</div>'
        + '<div class="quiz-explain">💡 ' + escapeHtml(item.explain) + '</div>'
        + '</div>';
    });
    html += '<div class="quiz-score" id="quiz-score"></div>'
      + '<button type="button" class="btn-quiz-reset" id="btn-quiz-reset">🔄 重做本节测验</button>'
      + '</section>';
    return html;
  }

  function handleQuizAnswer(optBtn) {
    const item = optBtn.closest('.quiz-item');
    if (!item || item.classList.contains('answered')) return;
    const qi = +item.dataset.qi;
    const data = currentQuiz[qi];
    if (!data) return;
    const chosen = +optBtn.dataset.oi;
    item.classList.add('answered');
    item.dataset.correct = chosen === data.answer ? '1' : '0';
    if (chosen === data.answer) {
      optBtn.classList.add('is-right');
    } else {
      optBtn.classList.add('is-wrong');
      item.classList.remove('shake');
      void item.offsetWidth;                          // 重置动画,连续答错也能每次抖动
      item.classList.add('shake');
      const right = item.querySelector('.quiz-opt[data-oi="' + data.answer + '"]');
      if (right) right.classList.add('is-right');
    }
    updateQuizScore();
  }

  function updateQuizScore() {
    const wrap = document.querySelector('.quiz-wrap');
    const scoreEl = $('#quiz-score');
    if (!wrap || !scoreEl) return;
    const items = Array.from(wrap.querySelectorAll('.quiz-item'));
    const answered = items.filter(i => i.classList.contains('answered'));
    if (answered.length < items.length) {
      scoreEl.textContent = '已答 ' + answered.length + ' / ' + items.length + ' 题';
      return;
    }
    const right = items.filter(i => i.dataset.correct === '1').length;
    if (right === items.length) {
      scoreEl.textContent = '🎉 全部答对(' + right + '/' + items.length + '),本节掌握得很扎实!';
      const r = scoreEl.getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top + 8);
    } else {
      scoreEl.textContent = '得分 ' + right + ' / ' + items.length + ' ——看看解析,点下方按钮重做一遍吧';
    }
  }

  /* ---------- 引导式代码构建演示 ---------- */
  let demoTimers = [];
  function demoStopAll() {
    demoTimers.forEach(t => clearTimeout(t));
    demoTimers = [];
  }

  function renderBuildDemo(sec) {
    const demo = window.BUILD_DEMOS && window.BUILD_DEMOS[sec._chapter.id];
    if (!demo) return '';
    return '<section class="demo-wrap">'
      + '<h3 class="quiz-title">🧑‍💻 从零构建:' + escapeHtml(demo.title)
      + '<span class="quiz-count">跟着步骤一起写 · 规范同步讲解</span></h3>'
      + '<div class="demo-card">'
      + '<div class="demo-stage">'
      + '<div class="code-head"><span class="code-lang">Java</span><span class="code-title">编辑器</span></div>'
      + '<pre class="demo-pre"><code class="demo-codearea"></code></pre>'
      + '</div>'
      + '<div class="demo-side">'
      + '<div class="demo-stepno">步骤 0/' + demo.steps.length + '</div>'
      + '<div class="demo-explain">点击「下一步」开始:代码将在左侧逐行敲出,右侧同步讲解每一步在做什么、为什么这么写。</div>'
      + '<div class="demo-std" style="display:none"></div>'
      + '<div class="demo-dots"></div>'
      + '<div class="demo-ctrl">'
      + '<button class="demo-btn" type="button" data-demo-act="prev">← 上一步</button>'
      + '<button class="demo-btn primary" type="button" data-demo-act="next">下一步 →</button>'
      + '<button class="demo-btn" type="button" data-demo-act="auto">▶ 自动演示</button>'
      + '<button class="demo-btn ghost" type="button" data-demo-act="reset">↺ 重置</button>'
      + '</div></div></div></section>';
  }

  function bindBuildDemo(sec) {
    const demo = window.BUILD_DEMOS && window.BUILD_DEMOS[sec._chapter.id];
    const root = document.querySelector('.demo-wrap');
    if (!demo || !root) return;
    const codeEl = root.querySelector('.demo-codearea');
    const preEl = root.querySelector('.demo-pre');
    const stepEl = root.querySelector('.demo-stepno');
    const explainEl = root.querySelector('.demo-explain');
    const stdEl = root.querySelector('.demo-std');
    const dotsEl = root.querySelector('.demo-dots');
    const autoBtn = root.querySelector('[data-demo-act="auto"]');
    const nextBtn = root.querySelector('[data-demo-act="next"]');
    const prevBtn = root.querySelector('[data-demo-act="prev"]');
    const N = demo.steps.length;
    let idx = 0;               // 已展示步数
    let cur = '';              // 当前代码文本
    let typing = false;
    let auto = false;
    let typeGen = 0;

    const codeOf = n => demo.steps.slice(0, n).map(s => s.c).join('\n');

    function paint(text, caret) {
      codeEl.innerHTML = highlightJava(text) + (caret ? '<span class="type-caret">▍</span>' : '');
      preEl.scrollTop = preEl.scrollHeight;
    }
    function panel() {
      stepEl.textContent = '步骤 ' + idx + '/' + N;
      nextBtn.disabled = idx >= N;
      prevBtn.disabled = idx <= 0;
      dotsEl.innerHTML = demo.steps.map((_, i) => '<i class="' + (i < idx ? 'on' : '') + '"></i>').join('');
      if (idx === 0) {
        explainEl.textContent = '点击「下一步」开始:代码将在左侧逐行敲出,右侧同步讲解每一步在做什么、为什么这么写。';
        stdEl.style.display = 'none';
      } else {
        const s = demo.steps[idx - 1];
        explainEl.textContent = s.t;
        if (s.std) { stdEl.style.display = ''; stdEl.textContent = s.std; }
        else stdEl.style.display = 'none';
      }
    }
    function typeTo(target, done) {
      typing = true;
      const gen = ++typeGen;
      if (REDUCE_MOTION) { cur = target; paint(cur, false); typing = false; done && done(); return; }
      let i = cur.length;
      const tick = () => {
        if (gen !== typeGen || !root.isConnected) { typing = false; return; }
        i = Math.min(target.length, i + 2);
        cur = target.slice(0, i);
        paint(cur, i < target.length);
        if (i < target.length) demoTimers.push(setTimeout(tick, 13));
        else { typing = false; done && done(); }
      };
      tick();
    }
    function stopAuto(finished) {
      auto = false;
      autoBtn.textContent = '▶ 自动演示';
      autoBtn.classList.remove('on');
      if (finished) showToast('🎉 演示完毕,试着合上页面自己敲一遍吧');
    }
    function scheduleAuto() {
      if (!auto) return;
      demoTimers.push(setTimeout(() => {
        if (!auto) return;
        if (idx < N) step(1);
        else stopAuto(true);
      }, 1600));
    }
    function step(dir) {
      if (dir > 0) {
        if (idx >= N) return;
        if (typing) {                 // 打字中按下一步 = 快进补全当前步
          typeGen++;
          typing = false;
          cur = codeOf(idx);
          paint(cur, false);
          return;
        }
        idx++;
        panel();
        typeTo(codeOf(idx), () => scheduleAuto());
      } else {
        if (idx <= 0 || typing) return;
        typeGen++;
        typing = false;
        stopAuto();
        idx--;
        cur = codeOf(idx);
        panel();
        paint(cur, false);
      }
    }
    root.addEventListener('click', e => {
      const btn = e.target.closest('.demo-btn');
      if (!btn) return;
      const act = btn.dataset.demoAct;
      if (act === 'next') step(1);
      else if (act === 'prev') step(-1);
      else if (act === 'reset') {
        typeGen++;
        typing = false;
        stopAuto();
        idx = 0;
        cur = '';
        panel();
        paint('', false);
      } else if (act === 'auto') {
        if (auto) { stopAuto(); return; }
        auto = true;
        autoBtn.textContent = '⏸ 暂停演示';
        autoBtn.classList.add('on');
        if (typing) return;           // 当前步打完自然衔接
        if (idx < N) step(1);
        else stopAuto(true);
      }
    });
    panel();
    paint('', false);
  }

  /* ---------- 名词高亮与注释弹层 ---------- */
  let glReg = null, glKeyMap = null;
  function initGlossary() {
    const G = window.GLOSSARY || {};
    const keys = Object.keys(G).sort((a, b) => b.length - a.length);
    if (!keys.length) return;
    glKeyMap = {};
    keys.forEach(k => { glKeyMap[k.toLowerCase()] = k; });
    glReg = new RegExp('(?<![A-Za-z0-9_])('
      + keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
      + ')(?![A-Za-z0-9_])', 'gi');
  }
  function linkGlossary(root) {
    if (!glReg || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => {
        const p = n.parentElement;
        if (!p || !n.nodeValue || !/\S/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        if (p.closest('pre, code, textarea, button, a, .gl-term, .quiz-wrap, .demo-stage, .demo-side, .lesson-foot, .nav-prev-next, #glossary-pop')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue;
      glReg.lastIndex = 0;
      if (!glReg.test(text)) return;
      glReg.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = glReg.exec(text)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const key = glKeyMap[m[1].toLowerCase()] || m[1];
        const sp = document.createElement('span');
        sp.className = 'gl-term';
        sp.dataset.term = key;
        sp.title = '点击查看:「' + key + '」的解释';
        sp.textContent = m[1];
        frag.appendChild(sp);
        last = m.index + m[1].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function hideGlossaryPop() {
    const pop = document.getElementById('glossary-pop');
    if (pop) pop.style.display = 'none';
  }
  function showGlossaryPop(el) {
    const key = el.dataset.term;
    const item = (window.GLOSSARY || {})[key];
    if (!item) return;
    let pop = document.getElementById('glossary-pop');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'glossary-pop';
      document.body.appendChild(pop);
      pop.addEventListener('click', e => { if (e.target.closest('.gp-close')) hideGlossaryPop(); });
      document.addEventListener('click', e => {
        if (!e.target.closest('#glossary-pop') && !e.target.closest('.gl-term')) hideGlossaryPop();
      }, true);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') hideGlossaryPop(); });
      window.addEventListener('scroll', hideGlossaryPop, { passive: true });
    }
    pop.innerHTML = '<div class="gp-head"><b>' + escapeHtml(key) + '</b>'
      + (item.cat ? '<span class="gp-cat">' + escapeHtml(item.cat) + '</span>' : '')
      + '<button class="gp-close" type="button" title="关闭">✕</button></div>'
      + '<div class="gp-def">' + escapeHtml(item.def) + '</div>';
    pop.style.display = 'block';
    pop.style.maxWidth = Math.min(360, window.innerWidth - 24) + 'px';
    const r = el.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    let x = Math.max(12, Math.min(r.left, window.innerWidth - pr.width - 12));
    let y = r.bottom + 8;
    if (y + pr.height > window.innerHeight - 10) y = Math.max(10, r.top - pr.height - 8);
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
  }

  /* ---------- 概念学习(智能加权抽题特训) ---------- */
  let drillRoundList = [], drillIdx = 0, drillAnswered = false, drillLastResult = null;
  const drillArea = () => document.getElementById('drill-area');

  function drillItemWeight(id) {
    const st = drill.items[id];
    if (!st) return 13;                                   // 没做过的新题权重最高
    const c = st.c || 0, w = st.w || 0;
    return Math.max(1, 10 - c * 3) + w * 2;              // 连对权重递减,答错加权回归
  }
  function pickDrillRound(n, source) {
    const pool = (source || DRILL_POOL).map(it => ({ it, w: drillItemWeight(it.id) }));
    const picked = [];
    while (picked.length < n && pool.length) {
      const total = pool.reduce((s, x) => s + x.w, 0);
      let r = Math.random() * total, i = 0;
      for (; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) break; }
      picked.push(pool.splice(Math.min(i, pool.length - 1), 1)[0].it);   // 抽出后不放回:当轮不重复
    }
    return picked;
  }
  function updateDrillHeader() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const total = drill.correct + drill.wrong;
    set('ds-rounds', drill.rounds);
    set('ds-total', total);
    set('ds-correct', drill.correct);
    set('ds-wrong', drill.wrong);
    set('ds-rate', (total ? Math.round(drill.correct / total * 100) : 0) + '%');
  }

  function renderDrill() {
    currentSectionId = null;
    stopSpeech();
    demoStopAll();
    hideGlossaryPop();
    const ds = document.getElementById('rd-speak'); if (ds) ds.style.display = 'none';
    const sb = document.getElementById('rd-stop'); if (sb) sb.style.display = 'none';
    window.scrollTo(0, 0);
    updateProgressBar();
    const total = drill.correct + drill.wrong;
    const rate = total ? Math.round(drill.correct / total * 100) : 0;
    const conceptMastered = Object.keys(drill.items).filter(id => (drill.items[id].c || 0) >= 3).length;
    const scopedPool = DRILL_POOL.filter(it => progress[it.secId]);       // 出题范围:已掌握的小节
    const sectionCount = Object.keys(progress).filter(k => progress[k] && SEC_BY_ID[k]).length;
    let html = '<div class="content-wrap">'
      + '<div class="crumbs"><a href="#/home">知识总览</a> / <b>概念学习</b></div>'
      + '<div class="lesson-head"><span class="lesson-no">🧠 专项训练</span><h1>概念学习</h1></div>'
      + '<div class="lesson-desc">只从你「已掌握」的小节中出题:每轮最多 10 道,当轮不重复;多次答对的概念出现概率降低,答错的会更常回归——把练习时间花在薄弱概念上。</div>'
      + '<div class="drill-stats">'
      + '<div class="drill-stat"><div class="n" id="ds-rounds">' + drill.rounds + '</div><div class="l">学习轮数</div></div>'
      + '<div class="drill-stat"><div class="n" id="ds-total">' + total + '</div><div class="l">累计答题</div></div>'
      + '<div class="drill-stat"><div class="n good" id="ds-correct">' + drill.correct + '</div><div class="l">答对次数</div></div>'
      + '<div class="drill-stat"><div class="n bad" id="ds-wrong">' + drill.wrong + '</div><div class="l">答错次数</div></div>'
      + '<div class="drill-stat"><div class="n" id="ds-rate">' + rate + '%</div><div class="l">总正确率</div></div>'
      + '</div>'
      + '<div id="drill-area"></div></div>';
    $('#main').innerHTML = html;
    drillArea().addEventListener('click', e => {
      const opt = e.target.closest('.drill-opt');
      if (opt) { answerDrill(+opt.dataset.oi, opt); return; }
      const act = e.target.closest('[data-drill-act]');
      if (!act) return;
      if (act.dataset.drillAct === 'start' || act.dataset.drillAct === 'again') startDrillRound();
      else if (act.dataset.drillAct === 'next') {
        drillIdx++;
        if (drillIdx < drillRoundList.length) renderDrillQuestion();
        else finishDrillRound();
      }
    });
    renderDrillIdle(conceptMastered, scopedPool.length, sectionCount);
    refreshTocActive();
  }

  function renderDrillIdle(conceptMastered, scopedSize, sectionCount) {
    let html;
    if (drillLastResult) {
      const r = drillLastResult;
      drillLastResult = null;
      html = '<div class="drill-card" style="text-align:center">'
        + '<div style="font-size:40px;margin-bottom:6px">' + (r.correct === r.total ? '🎉' : '✅') + '</div>'
        + '<h3 style="margin-bottom:8px;font-size:19px">' + (r.correct === r.total ? '满分通过!' : '本轮完成') + '</h3>'
        + '<p style="color:var(--text-sub);font-size:14px;margin-bottom:18px">本轮答对 <b style="color:var(--ok);font-size:17px">' + r.correct + '</b> / ' + r.total
        + (r.correct < r.total ? ',答错的概念下轮会优先出现' : ',一个都没错,太强了!') + '</p>'
        + '<div class="drill-actions" style="justify-content:center">'
        + '<button class="drill-btn primary" data-drill-act="again" type="button">🔄 再来一轮</button>'
        + '<a class="drill-btn" href="#/home" style="display:inline-flex;align-items:center;text-decoration:none">返回首页</a>'
        + '</div></div>';
    } else if (!scopedSize) {
      const target = SECTIONS.find(s => !progress[s.id]) || SECTIONS[0];
      html = '<div class="drill-card" style="text-align:center">'
        + '<div style="font-size:44px;margin-bottom:6px">🧠</div>'
        + '<h3 style="margin-bottom:8px;font-size:19px">还没有可出题的范围</h3>'
        + '<p style="color:var(--text-sub);font-size:13.5px;line-height:1.9">概念特训只从你「已掌握」的小节出题。<br>学完任意一节并点击底部的 <b>「☑️ 我已掌握本节」</b>,这里就会开始出题。</p>'
        + '<div class="drill-actions" style="justify-content:center;margin-top:18px">'
        + '<a class="drill-btn primary" href="#/lesson/' + target.id + '" style="display:inline-flex;align-items:center;text-decoration:none">📖 去学习</a>'
        + '<a class="drill-btn" href="#/home" style="display:inline-flex;align-items:center;text-decoration:none">返回首页</a>'
        + '</div></div>';
    } else {
      const roundN = Math.min(10, scopedSize);
      html = '<div class="drill-card" style="text-align:center">'
        + '<div style="font-size:44px;margin-bottom:6px">🧠</div>'
        + '<h3 style="margin-bottom:8px;font-size:19px">概念巩固特训</h3>'
        + '<p style="color:var(--text-sub);font-size:13.5px;line-height:1.9">出题范围:你已掌握的 <b style="color:var(--accent)">' + sectionCount + '</b> 个小节,共 <b>' + scopedSize + '</b> 道概念题;范围内已稳定掌握 <b style="color:var(--ok)">' + conceptMastered + '</b> 个概念(累计答对 ≥3 次)。<br>智能抽题:没做过的优先见面,连对的逐渐淡出,答错的频繁回归;掌握更多小节,题库自动扩大。</p>'
        + '<div class="drill-actions" style="justify-content:center;margin-top:18px">'
        + '<button class="drill-btn primary" data-drill-act="start" type="button">▶ 开始新一轮(' + roundN + ' 题)</button>'
        + '</div></div>';
    }
    drillArea().innerHTML = html;
  }

  function startDrillRound() {
    const scoped = DRILL_POOL.filter(it => progress[it.secId]);
    if (!scoped.length) return;
    drillRoundList = pickDrillRound(Math.min(10, scoped.length), scoped);
    drillIdx = 0;
    renderDrillQuestion();
  }
  function renderDrillQuestion() {
    drillAnswered = false;
    const item = drillRoundList[drillIdx];
    const sec = SEC_BY_ID[item.secId];
    const from = sec && sec._chapter ? sec._chapter.title : '';
    let dots = '';
    for (let i = 0; i < drillRoundList.length; i++) {
      dots += '<i class="' + (i < drillIdx ? (drillRoundList[i]._r ? 'done' : 'wrong') : (i === drillIdx ? 'cur' : '')) + '"></i>';
    }
    drillArea().innerHTML = '<div class="drill-card">'
      + '<div class="drill-prog">' + dots + '<span>第 ' + (drillIdx + 1) + ' / ' + drillRoundList.length + ' 题</span></div>'
      + (from ? '<div class="drill-meta">出自:' + escapeHtml(from) + '</div>' : '')
      + '<div class="drill-q">' + escapeHtml(item.q) + '</div>'
      + '<div class="drill-opts">' + item.options.map((o, i) =>
          '<button type="button" class="drill-opt" data-oi="' + i + '"><b>' + 'ABCD'[i] + '</b><span>' + escapeHtml(o) + '</span></button>'
        ).join('') + '</div>'
      + '<div class="drill-explain">💡 ' + escapeHtml(item.explain) + '</div>'
      + '<div class="drill-actions"><button class="drill-btn primary" data-drill-act="next" type="button" style="visibility:hidden">'
      + (drillIdx === drillRoundList.length - 1 ? '查看本轮结果 →' : '下一题 →') + '</button></div>'
      + '</div>';
  }
  function answerDrill(oi, optBtn) {
    if (drillAnswered) return;
    drillAnswered = true;
    const item = drillRoundList[drillIdx];
    const card = drillArea().querySelector('.drill-card');
    const right = oi === item.answer;
    item._r = right;
    if (right) {
      drill.correct++;
      optBtn.classList.add('is-right');
    } else {
      drill.wrong++;
      optBtn.classList.add('is-wrong');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      const rb = card.querySelector('.drill-opt[data-oi="' + item.answer + '"]');
      if (rb) rb.classList.add('is-right');
    }
    const st = drill.items[item.id] || (drill.items[item.id] = { c: 0, w: 0 });
    st[right ? 'c' : 'w']++;
    saveDrill();
    updateDrillHeader();
    card.querySelector('.drill-explain').classList.add('show');
    card.querySelector('[data-drill-act="next"]').style.visibility = 'visible';
  }
  function finishDrillRound() {
    drill.rounds++;
    const correct = drillRoundList.filter(x => x._r).length;
    drillLastResult = { correct: correct, total: drillRoundList.length };
    saveDrill();
    if (correct === drillRoundList.length) {
      const r = drillArea().getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top + 60);
    }
    renderDrill();
  }

  /* ---------- 学习资源快捷入口(三个中心共享) ---------- */
  const LINKS_KEY = 'cs-links-v1';
  const DEFAULT_LINKS = [
    { icon: '🧩', name: 'PTA 拼题A', url: 'https://pintia.cn' },
    { icon: '🔤', name: '百词斩', url: 'https://www.baicizhan.com' },
    { icon: '🧠', name: '力扣 LeetCode', url: 'https://leetcode.cn' },
    { icon: '🐂', name: '牛客网', url: 'https://www.nowcoder.com' },
    { icon: '📚', name: '菜鸟教程', url: 'https://www.runoob.com' },
    { icon: '🎓', name: '中国大学 MOOC', url: 'https://www.icourse163.org' },
    { icon: '🐙', name: 'GitHub', url: 'https://github.com' },
    { icon: '❓', name: 'Stack Overflow', url: 'https://stackoverflow.com' }
  ];
  const loadLinks = () => {
    try {
      const a = JSON.parse(localStorage.getItem(LINKS_KEY));
      if (Array.isArray(a) && a.length) return a.filter(x => x && x.name && x.url);
    } catch (e) { /* 忽略 */ }
    return DEFAULT_LINKS.slice();
  };
  let extLinks = loadLinks();
  const saveLinks = () => localStorage.setItem(LINKS_KEY, JSON.stringify(extLinks));
  function domainOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; }
  }
  function renderExtLinksHtml() {
    let html = '<section class="home-sec" id="ext-sec"><h2>🔗 学习资源 · 一键直达</h2>'
      + '<div class="sub">点击新标签页打开 · 可添加自己的常用站点(全站共享)</div>'
      + '<div class="link-grid">';
    extLinks.forEach((l, i) => {
      html += '<a class="ext-link" href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener">'
        + '<button class="el-del" data-i="' + i + '" title="删除" type="button">✕</button>'
        + '<span class="el-icon">' + (l.icon || '🌐') + '</span>'
        + '<span class="el-name">' + escapeHtml(l.name) + '</span>'
        + '<span class="el-domain">' + escapeHtml(domainOf(l.url)) + '</span>'
        + '</a>';
    });
    html += '<button class="ext-link add" id="btn-add-link" type="button">'
      + '<span class="el-icon">➕</span><span class="el-name">添加网站</span>'
      + '<span class="el-domain">自定义快捷入口</span></button>';
    html += '</div>'
      + '<div class="link-form" id="link-form" style="display:none">'
      + '<input id="lf-icon" placeholder="图标(emoji,可空)" maxlength="4">'
      + '<input id="lf-name" placeholder="网站名称,如:PTA" maxlength="20">'
      + '<input id="lf-url" placeholder="网址,如:pintia.cn">'
      + '<button class="drill-btn primary" id="lf-save" type="button">保存</button>'
      + '<button class="drill-btn" id="lf-cancel" type="button">取消</button>'
      + '<button class="drill-btn" id="lf-reset" type="button">↺ 恢复默认</button>'
      + '</div></section>';
    return html;
  }

  function bindExtLinks() {
    const sec = document.getElementById('ext-sec');
    if (!sec) return;
    const addBtn = sec.querySelector('#btn-add-link');
    const form = sec.querySelector('#link-form');
    if (!addBtn) return;
    addBtn.addEventListener('click', () => {
      form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      if (form.style.display === 'flex') sec.querySelector('#lf-name').focus();
    });
    const on = (id, fn) => { const el = sec.querySelector('#' + id); if (el) el.addEventListener('click', fn); };
    on('lf-cancel', () => { form.style.display = 'none'; });
    on('lf-save', () => {
      const name = (sec.querySelector('#lf-name').value || '').trim();
      let url = (sec.querySelector('#lf-url').value || '').trim();
      const icon = (sec.querySelector('#lf-icon').value || '').trim() || '🌐';
      if (!name || !url) { showToast('请填写网站名称和网址'); return; }
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      extLinks.push({ icon: icon, name: name, url: url });
      saveLinks();
      refreshExtLinks();
      showToast('已添加:' + name);
    });
    on('lf-reset', () => {
      extLinks = DEFAULT_LINKS.slice();
      saveLinks();
      refreshExtLinks();
      showToast('已恢复默认链接');
    });
    sec.querySelector('.link-grid').addEventListener('click', e => {
      const del = e.target.closest('.el-del');
      if (!del) return;
      e.preventDefault();
      e.stopPropagation();
      extLinks.splice(+del.dataset.i, 1);
      saveLinks();
      refreshExtLinks();                      // 只刷新本区块,不整页重渲染、不滚顶
      showToast('已删除该快捷入口');
    });
  }
  function refreshExtLinks() {
    const sec = document.getElementById('ext-sec');
    if (!sec) return;
    sec.outerHTML = renderExtLinksHtml();
    bindExtLinks();
  }

  function resetQuiz() {
    document.querySelectorAll('.quiz-item').forEach(item => {
      item.classList.remove('answered');
      delete item.dataset.correct;
      item.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('is-right', 'is-wrong'));
    });
    const scoreEl = $('#quiz-score');
    if (scoreEl) scoreEl.textContent = '';
  }

  /* ---------- 阅读功能:进度条 / 字号 / 位置记忆 / 朗读 ---------- */
  let progressBar = null;
  let toastEl = null, toastTimer = null;
  const FONT_NAMES = ['小', '标准', '大', '特大'];

  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'read-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.style.display = 'none'; }, 2600);
  }

  function applyFontScale(level, silent) {
    level = Math.max(0, Math.min(3, level));
    document.body.classList.remove('rfs-0', 'rfs-1', 'rfs-2', 'rfs-3');
    document.body.classList.add('rfs-' + level);
    reading.font = level;
    saveReading();
    if (!silent) showToast('字号:' + FONT_NAMES[level] + (level === 0 ? '(最小)' : level === 3 ? '(最大)' : ''));
  }

  /* --- 顶部阅读进度条 + 阅读位置记忆 --- */
  let savePosTimer = null;
  function updateProgressBar() {
    if (!progressBar) return;
    if (!currentSectionId) { progressBar.style.display = 'none'; return; }
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(100, Math.round(window.scrollY / h * 100)) : 0;
    progressBar.style.display = 'block';
    progressBar.firstElementChild.style.width = pct + '%';
  }
  function saveCurrentPos() {
    if (!currentSectionId) return;
    clearTimeout(savePosTimer);
    reading.pos[currentSectionId] = window.scrollY;
    saveReading();
  }
  function scheduleSavePos() {
    clearTimeout(savePosTimer);
    savePosTimer = setTimeout(saveCurrentPos, 400);
  }

  /* --- 朗读(听书模式)--- */
  const SPEECH_SEL = '.lesson-head h1, .lesson-desc, .prose h3, .prose p, .callout, .code-title';
  const SPEECH_SAMPLE = '你好,这是当前语音的试听效果。听读结合,把 Java 学得更明白。';
  let speaking = false, paused = false, speechQueue = [], speechIdx = 0, speechTimer = null, speakToken = 0;
  let speechResume = reading.tts || null;          // 断点:{ sec, idx },跨刷新仍可续读

  function getVoiceList() {
    return ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
  }
  /* 朗读前清理:emoji、表情符号、箭头、装饰符一律移除,避免被读成"时钟""图钉" */
  const EMOJI_RE = /[\p{Extended_Pictographic}\u{FE00}-\u{FE0F}\u{200B}-\u{200D}\u{FEFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1FAFF}]/gu;
  function sanitizeSpeechText(t) {
    return String(t).replace(EMOJI_RE, ' ').replace(/\s+/g, ' ').trim();
  }
  /* 语音自然度评分:神经网络/在线自然音色最接近真人,自动优先选用 */
  function voiceScore(v) {
    const n = (v.name || '').toLowerCase();
    if (!v.lang || v.lang.toLowerCase().indexOf('zh') !== 0) return -1;
    let s = 0;
    if (/natural|online|neural/.test(n)) s += 100;
    if (/xiaoxiao|yunxi|yunyang|xiaoyi|lijian/.test(n)) s += 40;
    if (/yaoyao|kangkang|huihui/.test(n)) s += 20;
    if (v.localService === false) s += 10;
    return s;
  }
  function resolveVoice() {
    const vs = getVoiceList();
    if (reading.voice) {
      const hit = vs.find(v => v.voiceURI === reading.voice);
      if (hit) return hit;
    }
    const zh = vs.map(v => ({ v, s: voiceScore(v) })).filter(x => x.s >= 0).sort((a, b) => b.s - a.s);
    return zh.length ? zh[0].v : null;
  }
  function splitSpeechText(t) {
    t = String(t).replace(/\s+/g, ' ').trim();
    if (!t) return [];
    const sentences = [];
    let buf = '';
    for (const ch of t) {
      buf += ch;
      if ('。!?;!?;…'.indexOf(ch) >= 0 || buf.length >= 140) { sentences.push(buf); buf = ''; }
    }
    if (buf.trim()) sentences.push(buf);
    // 过短的句子向后合并,保持自然语群与停顿节奏
    const merged = [];
    sentences.forEach(s => {
      if (merged.length && (merged[merged.length - 1].length + s.length) < 42) merged[merged.length - 1] += s;
      else merged.push(s);
    });
    return merged;
  }
  function highlightSpeech(el) {
    document.querySelectorAll('.speaking').forEach(n => n.classList.remove('speaking'));
    if (!el) return;
    el.classList.add('speaking');
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 60) {
      el.scrollIntoView({ block: 'center' });
    }
  }
  function resumeForCurrent() {
    return !!(speechResume && speechResume.sec === currentSectionId);
  }
  function saveTts(v) {
    speechResume = v;
    reading.tts = v;
    saveReading();
  }
  function updateSpeakBtn() {
    const btn = document.getElementById('rd-speak');
    if (btn) {
      if (!speaking) {
        const canResume = resumeForCurrent();
        btn.textContent = canResume ? '▶' : '🔊';
        btn.classList.remove('active');
        btn.title = canResume ? '从上次停下的位置继续朗读' : '朗读本节(听书模式)';
      } else if (paused) {
        btn.textContent = '▶';
        btn.classList.add('active');
        btn.title = '继续朗读';
      } else {
        btn.textContent = '⏸';
        btn.classList.add('active');
        btn.title = '暂停朗读';
      }
    }
    const stopBtn = document.getElementById('rd-stop');
    if (stopBtn) {
      // 播放/暂停中:停止并记住位置;空闲但有断点:清除断点(下次从头)
      stopBtn.style.display = (speaking || resumeForCurrent()) ? '' : 'none';
      stopBtn.title = speaking ? '停止并记住位置' : '清除断点,下次从头朗读';
    }
  }
  function startSpeech() {
    if (!('speechSynthesis' in window)) { showToast('当前浏览器不支持朗读'); return; }
    const main = $('#main');
    const els = Array.from(main.querySelectorAll(SPEECH_SEL))
      .filter(el => (el.textContent || '').trim());
    speechQueue = [];
    els.forEach(el => {
      let raw = el.textContent || '';
      if (el.classList.contains('lesson-desc')) {
        // 时长徽标("约 N 分钟")不属于正文内容,不朗读
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.read-time').forEach(n => n.remove());
        raw = clone.textContent || '';
      }
      let text = sanitizeSpeechText(raw);
      if (!text) return;
      if (el.classList.contains('code-title')) text = '代码示例 ' + text;
      splitSpeechText(text).forEach(t => speechQueue.push({ el, text: t }));
    });
    if (!speechQueue.length) { showToast('本节没有可朗读的内容'); return; }
    // 有断点则续读,否则从头开始
    let fromIdx = 0;
    if (resumeForCurrent() && speechResume.idx > 0) {
      fromIdx = Math.min(speechResume.idx, speechQueue.length - 1);
    }
    speechIdx = fromIdx;
    speaking = true;
    paused = false;
    speakToken++;
    updateSpeakBtn();
    showToast(fromIdx > 0 ? '📍 从上次停下的位置继续朗读' : '🔊 开始朗读,共 ' + els.length + ' 段');
    speakNext(fromIdx > 0 ? 260 : 120);
  }
  function speakNext(delay) {
    clearTimeout(speechTimer);
    if (!speaking || paused) return;
    if (speechIdx >= speechQueue.length) { finishSpeech(); return; }
    speechTimer = setTimeout(() => {
      if (!speaking || paused) return;
      const tok = speakToken;                 // 会话令牌:停止/变速后旧回调全部作废
      const item = speechQueue[speechIdx];
      const u = new SpeechSynthesisUtterance(item.text);
      const v = resolveVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'zh-CN'; }
      u.rate = reading.rate;
      u.onstart = () => { if (speaking && !paused && tok === speakToken) highlightSpeech(item.el); };
      u.onend = () => {
        if (!speaking || paused || tok !== speakToken) return;
        speechIdx++;
        saveTts({ sec: currentSectionId, idx: speechIdx });   // 每句都记录断点
        const next = speechQueue[speechIdx];
        // 句间小停顿、段落间大停顿,听感更接近真人朗读
        speakNext(next && next.el === item.el ? 160 : 430);
      };
      u.onerror = () => {
        if (!speaking || paused || tok !== speakToken) return;
        speechIdx++;
        speakNext(120);
      };
      window.speechSynthesis.speak(u);
    }, delay || 0);
  }
  function pauseSpeech() {
    if (!speaking || paused) return;
    paused = true;
    clearTimeout(speechTimer);
    speakToken++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    updateSpeakBtn();
  }
  function resumeSpeech() {
    if (!speaking || !paused) return;
    paused = false;
    updateSpeakBtn();
    speakNext(120);              // 从当前句开头重新朗读(同时应用最新语速)
  }
  function applyRateNow() {
    if (!speaking || paused) return;   // 暂停中:恢复时自然用新语速
    speakToken++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speakNext(60);               // 立即以新语速重说当前句
  }
  function finishSpeech() {
    saveTts(null);               // 读完了:清除断点,下次从头
    speaking = false;
    paused = false;
    speakToken++;
    speechQueue = [];
    speechIdx = 0;
    document.querySelectorAll('.speaking').forEach(n => n.classList.remove('speaking'));
    updateSpeakBtn();
    showToast('🎧 本节朗读完毕');
  }
  function stopSpeech(preserve) {
    if (speaking && currentSectionId && preserve !== false) {
      saveTts({ sec: currentSectionId, idx: speechIdx });   // 记住位置
    } else if (preserve === false) {
      saveTts(null);
    }
    speaking = false;
    paused = false;
    speakToken++;
    clearTimeout(speechTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speechQueue = [];
    speechIdx = 0;
    document.querySelectorAll('.speaking').forEach(n => n.classList.remove('speaking'));
    updateSpeakBtn();
  }

  /* --- 语音设置面板:选音色(试听)+ 语速 --- */
  function syncSpeedUI() {
    const b = document.getElementById('vp-rate-val');
    const r = document.getElementById('vp-range');
    if (b) b.textContent = reading.rate.toFixed(2) + '×';
    if (r) r.value = reading.rate;
  }
  function adjustRate(d) {
    reading.rate = Math.round(Math.min(2, Math.max(0.5, reading.rate + d)) * 100) / 100;
    syncSpeedUI();
    saveReading();
    applyRateNow();              // 播放中立即生效
  }
  function previewVoice(v) {
    if (!('speechSynthesis' in window) || !v) return;
    stopSpeech();
    const u = new SpeechSynthesisUtterance(SPEECH_SAMPLE);
    u.voice = v;
    u.lang = v.lang || 'zh-CN';
    u.rate = reading.rate;
    window.speechSynthesis.speak(u);
  }
  function buildVoicePanel(dock) {
    const panel = document.createElement('div');
    panel.className = 'voice-panel';
    panel.id = 'voice-panel';
    dock.appendChild(panel);
    panel.addEventListener('click', e => {
      if (e.target.closest('#vp-auto')) {
        reading.voice = null;
        saveReading();
        renderVoicePanel();
        previewVoice(resolveVoice());
        return;
      }
      const item = e.target.closest('.vp-item[data-uri]');
      if (item && item.dataset.uri) {
        const v = getVoiceList().find(x => x.voiceURI === item.dataset.uri);
        if (v) {
          reading.voice = v.voiceURI;
          saveReading();
          renderVoicePanel();
          previewVoice(v);
        }
        return;
      }
      if (e.target.closest('#vp-slow')) {
        adjustRate(-0.05);
      } else if (e.target.closest('#vp-fast')) {
        adjustRate(0.05);
      }
    });
    // 滑块拖动:连续调节语速(播放中即时生效)
    panel.addEventListener('input', e => {
      if (e.target.id === 'vp-range') {
        reading.rate = parseFloat(e.target.value);
        syncSpeedUI();
        saveReading();
        applyRateNow();
      }
    });
    // 长按 − / + :连续调节
    let holdT = null, holdI = null;
    panel.addEventListener('pointerdown', e => {
      const b = e.target.closest('.vp-mini');
      if (!b) return;
      const d = b.id === 'vp-fast' ? 0.05 : -0.05;
      const stop = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = null; };
      document.addEventListener('pointerup', stop, { once: true });
      document.addEventListener('pointercancel', stop, { once: true });
      holdT = setTimeout(() => { holdI = setInterval(() => adjustRate(d), 110); }, 420);
    });
    return panel;
  }
  function renderVoicePanel() {
    const panel = document.getElementById('voice-panel');
    if (!panel) return;
    const vs = getVoiceList();
    if (!vs.length) {
      panel.innerHTML = '<div class="vp-title">🎙 语音选择</div><div class="vp-empty">未检测到系统语音,可尝试用 Edge/Chrome 打开本站</div>';
      return;
    }
    const zh = vs.filter(v => voiceScore(v) >= 0).sort((a, b) => voiceScore(b) - voiceScore(a));
    const other = vs.filter(v => voiceScore(v) < 0);
    const row = v => {
      const natural = /natural|online|neural/i.test(v.name || '');
      const cur = reading.voice === v.voiceURI;
      return '<div class="vp-item' + (cur ? ' sel' : '') + '" data-uri="'
        + String(v.voiceURI || '').replace(/"/g, '&quot;') + '">'
        + '<span class="vp-name">' + escapeHtml(v.name) + '</span>'
        + (natural ? '<span class="vp-badge natural">自然声</span>'
                   : '<span class="vp-badge">' + escapeHtml(v.lang || '') + '</span>')
        + '</div>';
    };
    let html = '<div class="vp-title">🎙 语音选择<span class="vp-badge natural">已按自然度排序</span></div>';
    html += '<div class="vp-item' + (reading.voice ? '' : ' sel') + '" id="vp-auto"><span class="vp-name">自动(推荐:优先自然音色)</span></div>';
    zh.forEach(v => { html += row(v); });
    if (other.length) {
      html += '<div class="vp-group">其他语言</div>';
      other.slice(0, 5).forEach(v => { html += row(v); });
    }
    html += '<div class="vp-speed">语速 <b id="vp-rate-val">' + reading.rate.toFixed(2) + '×</b>'
      + '<button class="vp-mini" id="vp-slow" type="button" title="放慢(可长按连续调)">−</button>'
      + '<button class="vp-mini" id="vp-fast" type="button" title="加快(可长按连续调)">+</button>'
      + '<span class="vp-tip">拖滑块或长按</span></div>'
      + '<input type="range" class="vp-range" id="vp-range" min="0.5" max="2" step="0.05" value="' + reading.rate + '" title="拖动连续调节语速">';
    panel.innerHTML = html;
  }

  /* ---------- 页面动效:滚动显现 / 庆祝粒子 / 数字滚动 / 打字机 / 卡片倾斜 ---------- */
  let revealIO = null;
  function observeReveal() {
    if (REDUCE_MOTION || !('IntersectionObserver' in window)) return;
    if (!revealIO) {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach((en, i) => {
          if (!en.isIntersecting) return;
          en.target.style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';   // 同屏依次浮现
          en.target.classList.add('in');
          revealIO.unobserve(en.target);
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    }
    document.querySelectorAll('#main .prose > *, #main .code-block, #main .callout, #main .demo-card, #main .quiz-item, #main .rm-stage, #main .lesson-foot')
      .forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        revealIO.observe(el);
      });
  }

  function confettiBurst(x, y) {
    if (REDUCE_MOTION) return;
    const colors = ['#e76f00', '#5382a1', '#16a34a', '#f59e0b', '#3b82f6', '#ef4444'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('i');
      p.className = 'confetti';
      const ang = Math.random() * Math.PI * 2;
      const v = 70 + Math.random() * 130;
      const size = 5 + Math.random() * 5;
      p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;'
        + 'background:' + colors[i % colors.length] + ';'
        + '--dx:' + Math.round(Math.cos(ang) * v) + 'px;--dy:' + Math.round(Math.sin(ang) * v - 70) + 'px;';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function countUp(el, target, dur) {
    if (REDUCE_MOTION) { el.textContent = target; return; }
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));   // ease-out
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  let typeTimer = null, typeIdx = 0, typeDel = false;
  const TYPE_WORDS = META.typeWords;
  function typeLoop() {
    const el = document.getElementById('hero-type');
    if (!el) { clearTimeout(typeTimer); return; }          // 离开首页自动停
    const word = TYPE_WORDS[typeIdx % TYPE_WORDS.length];
    const cur = el.textContent;
    if (!typeDel) {
      el.textContent = word.slice(0, cur.length + 1);
      if (el.textContent === word) { typeDel = true; clearTimeout(typeTimer); typeTimer = setTimeout(typeLoop, 1500); return; }
    } else {
      el.textContent = word.slice(0, Math.max(0, cur.length - 1));
      if (!el.textContent) { typeDel = false; typeIdx++; clearTimeout(typeTimer); typeTimer = setTimeout(typeLoop, 350); return; }
    }
    clearTimeout(typeTimer);
    typeTimer = setTimeout(typeLoop, typeDel ? 40 : 105);
  }

  function bindCardTilt() {
    document.querySelectorAll('.ch-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
        card.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  function startHeroFx() {
    clearTimeout(typeTimer);
    typeIdx = 0; typeDel = false;
    typeLoop();
    document.querySelectorAll('.cnt').forEach(el => countUp(el, +el.dataset.t || 0, 1100));
    if (!REDUCE_MOTION && window.matchMedia('(hover:hover)').matches) bindCardTilt();
  }

  /* --- 预计阅读时长 --- */
  function readingMinutes(sec) {
    let chars = 0, codeLines = 0;
    sec.blocks.forEach(b => {
      if (b.type === 'code') codeLines += b.code.split('\n').length;
      else if (b.type === 'points') chars += (b.items || []).join('').length;
      else if (b.type === 'table') chars += (b.rows || []).flat().join('').length;
      else if (b.html) chars += stripTags(b.html).length;
    });
    return Math.max(1, Math.round(chars / 380 + codeLines / 22));
  }

  /* --- 阅读工具条初始化 --- */
  function initReadingUI() {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<i></i>';
    document.body.appendChild(progressBar);

    const dock = document.createElement('div');
    dock.className = 'reading-dock';
    dock.innerHTML = '<button class="rd-btn" id="rd-speak" type="button" title="朗读本节(听书模式)">🔊</button>'
      + '<button class="rd-btn" id="rd-stop" type="button" title="停止并记住位置" style="display:none">⏹</button>'
      + '<button class="rd-btn" id="rd-voice" type="button" title="语音设置(选择音色 / 语速)">🎙</button>'
      + '<button class="rd-btn" id="rd-font-dec" type="button" title="减小字号">A−</button>'
      + '<button class="rd-btn" id="rd-font-inc" type="button" title="增大字号">A+</button>';
    document.body.appendChild(dock);
    buildVoicePanel(dock);
    dock.addEventListener('click', e => {
      const b = e.target.closest('.rd-btn');
      if (!b) return;
      if (b.id === 'rd-speak') {
        if (!speaking) startSpeech();
        else if (paused) resumeSpeech();
        else pauseSpeech();
      }
      else if (b.id === 'rd-stop') {
        if (speaking) {
          stopSpeech();                                    // 停止并记住位置
          showToast('已停止 · 已记住位置,下次点 ▶ 继续');
        } else if (resumeForCurrent()) {
          saveTts(null);                                   // 清除断点,下次从头
          updateSpeakBtn();
          showToast('已清除断点,下次将从开头朗读');
        }
      }
      else if (b.id === 'rd-voice') {
        const panel = document.getElementById('voice-panel');
        const open = !panel.classList.contains('show');
        if (open) renderVoicePanel();
        panel.classList.toggle('show', open);
      }
      else if (b.id === 'rd-font-inc') { applyFontScale(reading.font + 1); }
      else if (b.id === 'rd-font-dec') { applyFontScale(reading.font - 1); }
    });
    document.addEventListener('click', e => {
      const panel = document.getElementById('voice-panel');
      if (panel && panel.classList.contains('show') && !e.target.closest('.reading-dock')) {
        panel.classList.remove('show');
      }
    });

    applyFontScale(reading.font, true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        const panel = document.getElementById('voice-panel');
        if (panel && panel.classList.contains('show')) renderVoicePanel();
      };
    }
    window.addEventListener('scroll', () => {
      updateProgressBar();
      scheduleSavePos();
    }, { passive: true });
    updateProgressBar();
  }

  /* ---------- 顶栏进度 ---------- */
  function updateTopProgress() {
    const done = doneCount();
    const pct = Math.round(done / SECTIONS.length * 100);
    $('#progress-mini').innerHTML = '📚 <span>' + done + '/' + SECTIONS.length + '</span>'
      + '<span class="progress-bar"><i style="width:' + pct + '%"></i></span>';
  }

  /* ---------- 搜索 ---------- */
  function bindSearch() {
    const input = $('#search-input');
    const box = $('#search-results');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 1) { box.classList.remove('show'); return; }

      const hits = SEARCH_INDEX.filter(it =>
        it.title.toLowerCase().includes(q)
        || it.chapter.toLowerCase().includes(q)
        || it.text.toLowerCase().includes(q)
      ).slice(0, 10);

      let html = '';
      if (!hits.length) {
        html = '<div class="search-empty">没有找到 "' + escapeHtml(input.value) + '" 相关知识点</div>';
      } else {
        hits.forEach(hit => {
          const i = hit.text.toLowerCase().indexOf(q);
          const ctx = i >= 0
            ? hit.text.slice(Math.max(0, i - 18), i + 40).replace(/\s+/g, ' ')
            : hit.text.slice(0, 50);
          html += '<a class="search-item" href="#/lesson/' + hit.sec.id + '">'
            + '<span class="s-ch">' + hit.chapter.replace(/^第\s*\d+\s*章\s*·?\s*/, '') + '</span>'
            + '<span class="s-title">' + escapeHtml(hit.title) + '</span>'
            + '<div class="s-sub">…' + escapeHtml(ctx) + '…</div></a>';
        });
      }
      box.innerHTML = html;
      box.classList.add('show');
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = box.querySelector('.search-item');
        if (first) location.hash = first.getAttribute('href');
        box.classList.remove('show');
      }
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-box')) box.classList.remove('show');
    });
  }

  /* ---------- 主题与侧栏 ---------- */
  function initTheme() {
    const saved = localStorage.getItem('java-theme');
    const dark = saved ? saved === 'dark'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#btn-theme').textContent = dark ? '☀️' : '🌙';
    $('#btn-theme').addEventListener('click', e => {
      const nowDark = document.documentElement.dataset.theme !== 'dark';
      const apply = () => {
        document.documentElement.dataset.theme = nowDark ? 'dark' : 'light';
        localStorage.setItem('java-theme', nowDark ? 'dark' : 'light');
        $('#btn-theme').textContent = nowDark ? '☀️' : '🌙';
      };
      // 支持 View Transitions 的浏览器:从点击处圆形扩散切换主题
      if (!document.startViewTransition || REDUCE_MOTION) { apply(); return; }
      const x = e.clientX || window.innerWidth - 40, y = e.clientY || 30;
      const vt = document.startViewTransition(apply);
      vt.ready.then(() => {
        const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        document.documentElement.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 480, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => { /* 忽略 */ });
    });
  }

  function initSidebarToggle() {
    $('#btn-menu').addEventListener('click', () => {
      const sb = $('#sidebar');
      if (window.innerWidth <= 860) sb.classList.toggle('mobile-open');
      else sb.classList.toggle('hidden');
    });
    $('#sidebar-mask').addEventListener('click', closeMobileSidebar);
    $('#sidebar').addEventListener('click', e => {
      if (e.target.closest('.toc-sec')) closeMobileSidebar();
    });
  }
  function closeMobileSidebar() {
    $('#sidebar').classList.remove('mobile-open');
    $('#sidebar-mask').style.display = '';
  }

  /* ---------- 启动 ---------- */
  document.title = META.title;
  const logoB = document.querySelector('.logo-text b'); if (logoB) logoB.textContent = META.name;
  const logoI = document.querySelector('.logo-text i'); if (logoI) logoI.textContent = META.sub;
  const sInput = document.getElementById('search-input'); if (sInput) sInput.placeholder = META.searchHint;
  $('#main').addEventListener('click', e => {
    const opt = e.target.closest('.quiz-opt');
    if (opt) { handleQuizAnswer(opt); return; }
    if (e.target.closest('#btn-quiz-reset')) resetQuiz();
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('.gl-term');
    if (t) showGlossaryPop(t);
  });
  initGlossary();
  renderToc();
  initTheme();
  initSidebarToggle();
  bindSearch();
  initReadingUI();
  updateTopProgress();
  navigate();
})();
