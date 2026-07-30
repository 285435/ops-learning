// ============ 运维学习平台 - 主应用逻辑 ============

// ============ 状态管理 ============
const state = {
    currentPage: 'home',
    learnCategory: 'network',
    learnLevel: 'all',
    learnTopicId: null,
    quiz: {
        category: null,
        questions: [],
        current: 0,
        score: 0,
        answered: false,
        selectedOption: null,
        results: []  // 每题对错记录
    }
};

// ============ 存储工具 ============
const Store = {
    get(key, def = null) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : def;
        } catch { return def; }
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
};

// 用户数据
function getUserData() {
    const user = Store.get('ops_user');
    if (!user) return null;
    let data = Store.get('ops_data_' + user);
    if (!data) {
        data = {
            learnedTopics: [],     // 已学知识点 id
            answeredQuestions: [], // {category, index, correct}
            quizHistory: [],       // {category, score, total, date}
            loginDays: [],         // 登录日期
            achievements: []       // 已解锁成就 id
        };
        Store.set('ops_data_' + user, data);
    }
    return data;
}
function saveUserData(data) {
    const user = Store.get('ops_user');
    if (user) Store.set('ops_data_' + user, data);
}

// ============ Toast ============
function toast(msg, type = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    setTimeout(() => el.classList.remove('show'), 2500);
}

// ============ 页面导航 ============
function navigate(page) {
    state.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
    window.scrollTo(0, 0);
    if (page === 'home') renderHome();
    if (page === 'learn') renderLearn();
    if (page === 'quiz') renderQuizHome();
    if (page === 'progress') renderProgress();
}

// ============ 简易 Markdown 渲染 ============
function renderMarkdown(text) {
    let html = text;
    // 转义 HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 代码块 ```...```
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (m, lang, code) => `<pre><code>${code.replace(/\n$/, '')}</code></pre>`);
    // 行内代码 `code`
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    // 标题
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h3>$1</h3>');
    // 粗体
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // 有序列表
    html = html.replace(/^(\d+)\. (.+)$/gm, '<oli>$2</oli>');
    html = html.replace(/(<oli>[\s\S]*?<\/oli>)(?!\s*<oli>)/g, m => '<ol>' + m.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>') + '</ol>');
    // 无序列表
    html = html.replace(/^[-*] (.+)$/gm, '<uli>$1</uli>');
    html = html.replace(/(<uli>[\s\S]*?<\/uli>)(?!\s*<uli>)/g, m => '<ul>' + m.replace(/<uli>/g, '<li>').replace(/<\/uli>/g, '</li>') + '</ul>');
    // 段落（连续非标签行）
    html = html.split(/\n\n+/).map(block => {
        if (/^<(h3|pre|ol|ul)/.test(block.trim())) return block;
        if (block.trim() === '') return '';
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    // 清理 <br> 在块级元素后
    html = html.replace(/<\/(h3|pre|ol|ul)>\n<br>/g, '</$1>');
    return html;
}

// ============ 统计 ============
function getStats() {
    let topicCount = 0, questionCount = 0;
    Object.values(KNOWLEDGE).forEach(cat => topicCount += cat.topics.length);
    Object.values(QUESTIONS).forEach(qs => questionCount += qs.length);
    return { topicCount, questionCount };
}

// ============ 首页 ============
function renderHome() {
    const stats = getStats();
    document.getElementById('statTopics').textContent = stats.topicCount;
    document.getElementById('statQuestions').textContent = stats.questionCount;

    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = Object.entries(KNOWLEDGE).map(([key, cat]) => {
        const qCount = QUESTIONS[key] ? QUESTIONS[key].length : 0;
        return `
            <div class="category-card" style="--cat-color:${cat.color}" data-cat="${key}">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-desc">${getCategoryDesc(key)}</div>
                <div class="category-meta">
                    <span>📚 ${cat.topics.length} 知识点</span>
                    <span>✍️ ${qCount} 题</span>
                </div>
            </div>`;
    }).join('');
    grid.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            state.learnCategory = card.dataset.cat;
            navigate('learn');
        });
    });
}

function getCategoryDesc(key) {
    const map = {
        network: 'OSI 模型、TCP/IP、HTTP、子网划分、DNS 等',
        linux: '命令、权限、进程、磁盘、Shell 脚本、性能调优',
        frontend: 'HTML、CSS、JavaScript、Vue/React、性能优化',
        backend: 'Python、Flask、MySQL、Redis、Docker、Nginx、CI/CD',
        shell: 'Shell 语法、变量、条件循环、函数、sed/awk、脚本工程化'
    };
    return map[key] || '';
}

// ============ 学习中心 ============
function renderLearn() {
    // 侧边栏分类
    const tabs = document.getElementById('learnTabs');
    tabs.innerHTML = Object.entries(KNOWLEDGE).map(([key, cat]) => `
        <div class="tab-item ${key === state.learnCategory ? 'active' : ''}" data-cat="${key}">
            <span class="tab-icon">${cat.icon}</span>
            <span>${cat.name}</span>
        </div>`).join('');
    tabs.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            state.learnCategory = tab.dataset.cat;
            state.learnTopicId = null;
            renderLearn();
        });
    });

    // 难度筛选
    document.querySelectorAll('input[name="level"]').forEach(r => {
        r.checked = r.value === state.learnLevel;
        r.addEventListener('change', e => {
            state.learnLevel = e.target.value;
            renderLearn();
        });
    });

    // 知识点列表
    const cat = KNOWLEDGE[state.learnCategory];
    const userData = getUserData();
    const learnedSet = userData ? new Set(userData.learnedTopics) : new Set();
    let topics = cat.topics;
    if (state.learnLevel !== 'all') {
        topics = topics.filter(t => t.level === state.learnLevel);
    }
    const list = document.getElementById('topicList');
    if (topics.length === 0) {
        list.innerHTML = '<div class="empty-detail"><div class="empty-icon">🔍</div><p>该难度暂无知识点</p></div>';
    } else {
        list.innerHTML = topics.map(t => `
            <div class="topic-item ${state.learnTopicId === t.id ? 'active' : ''} ${learnedSet.has(t.id) ? 'learned' : ''}" data-id="${t.id}">
                <div class="topic-title">${t.title}</div>
                <div class="topic-meta">
                    <span class="level-badge ${t.level}">${t.level}</span>
                    <span style="color:#9ca3af;font-size:12px;">${cat.icon} ${cat.name}</span>
                </div>
            </div>`).join('');
        list.querySelectorAll('.topic-item').forEach(item => {
            item.addEventListener('click', () => {
                state.learnTopicId = item.dataset.id;
                renderLearn();
                // 移动端弹窗显示
                if (window.innerWidth <= 1024) {
                    showTopicModal(item.dataset.id);
                }
            });
        });
    }

    // 详情面板（桌面端）
    const detail = document.getElementById('learnDetail');
    if (state.learnTopicId && window.innerWidth > 1024) {
        const topic = cat.topics.find(t => t.id === state.learnTopicId);
        if (topic) {
            const isLearned = learnedSet.has(topic.id);
            detail.innerHTML = `
                <div class="detail-header">
                    <div class="detail-title">${topic.title}</div>
                    <div class="topic-meta">
                        <span class="level-badge ${topic.level}">${topic.level}</span>
                        <span style="color:#9ca3af;font-size:12px;">${cat.icon} ${cat.name}</span>
                    </div>
                </div>
                <div class="detail-body">${renderMarkdown(topic.content)}</div>
                ${topic.example ? `
                <div class="detail-example">
                    <div class="example-header">💡 实战实例</div>
                    <pre class="example-code"><code>${topic.example.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
                </div>` : ''}
                <div class="detail-actions">
                    <button class="btn ${isLearned ? 'btn-ghost' : 'btn-primary'} mark-learned" data-id="${topic.id}">
                        ${isLearned ? '✓ 已学习' : '标记为已学习'}
                    </button>
                </div>`;
            detail.querySelector('.mark-learned').addEventListener('click', () => {
                toggleLearned(topic.id);
            });
        }
    } else {
        detail.innerHTML = `<div class="empty-detail"><div class="empty-icon">📖</div><p>点击左侧知识点查看详细内容</p></div>`;
    }
}

function showTopicModal(topicId) {
    const cat = KNOWLEDGE[state.learnCategory];
    const topic = cat.topics.find(t => t.id === topicId);
    if (!topic) return;
    const userData = getUserData();
    const isLearned = userData && userData.learnedTopics.includes(topic.id);
    const body = document.getElementById('topicModalBody');
    body.innerHTML = `
        <div class="detail-header">
            <div class="detail-title">${topic.title}</div>
            <div class="topic-meta">
                <span class="level-badge ${topic.level}">${topic.level}</span>
                <span style="color:#9ca3af;font-size:12px;">${cat.icon} ${cat.name}</span>
            </div>
        </div>
        <div class="detail-body">${renderMarkdown(topic.content)}</div>
        ${topic.example ? `
        <div class="detail-example">
            <div class="example-header">💡 实战实例</div>
            <pre class="example-code"><code>${topic.example.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
        </div>` : ''}
        <div class="detail-actions">
            <button class="btn ${isLearned ? 'btn-ghost' : 'btn-primary'} mark-learned" data-id="${topic.id}">
                ${isLearned ? '✓ 已学习' : '标记为已学习'}
            </button>
        </div>`;
    body.querySelector('.mark-learned').addEventListener('click', () => {
        toggleLearned(topic.id);
        document.getElementById('topicModal').classList.remove('active');
        renderLearn();
    });
    document.getElementById('topicModal').classList.add('active');
}

function toggleLearned(topicId) {
    let data = getUserData();
    if (!data) {
        toast('请先登录后再记录学习进度', 'error');
        return;
    }
    const idx = data.learnedTopics.indexOf(topicId);
    if (idx >= 0) {
        data.learnedTopics.splice(idx, 1);
        toast('已取消标记');
    } else {
        data.learnedTopics.push(topicId);
        toast('已标记为已学习', 'success');
    }
    saveUserData(data);
    checkAchievements();
    renderLearn();
}

// ============ 题库 ============
const LEVELS = ['基础', '进阶', '高级'];
const LEVEL_INFO = {
    '基础': { icon: '🟢', desc: '概念定义与基本识别，适合入门巩固' },
    '进阶': { icon: '🟡', desc: '机制理解与配置应用，适合进阶训练' },
    '高级': { icon: '🔴', desc: '深度原理与排错分析，适合高手挑战' }
};

function renderQuizHome() {
    document.getElementById('quizHome').classList.remove('hidden');
    document.getElementById('quizDifficulty').classList.add('hidden');
    document.getElementById('quizPlayer').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');

    const grid = document.getElementById('quizCategoryGrid');
    grid.innerHTML = Object.entries(QUESTIONS).map(([key, qs]) => {
        const cat = KNOWLEDGE[key];
        // 统计各难度题数
        const counts = {};
        LEVELS.forEach(l => counts[l] = qs.filter(q => q.level === l).length);
        return `
            <div class="quiz-category-card" style="--cat-color:${cat.color}" data-cat="${key}">
                <h3>${cat.icon} ${cat.name}</h3>
                <p>共 ${qs.length} 道题目，可自选难度练习</p>
                <div class="quiz-level-stats">
                    <span class="qls-item qls-基础">基础 ${counts['基础']}</span>
                    <span class="qls-item qls-进阶">进阶 ${counts['进阶']}</span>
                    <span class="qls-item qls-高级">高级 ${counts['高级']}</span>
                </div>
                <div class="quiz-category-meta">
                    <span>选择难度开始</span>
                    <strong>→</strong>
                </div>
            </div>`;
    }).join('');
    grid.querySelectorAll('.quiz-category-card').forEach(card => {
        card.addEventListener('click', () => showDifficulty(card.dataset.cat));
    });
}

// 显示难度选择面板
function showDifficulty(category) {
    state.quiz.category = category;
    const cat = KNOWLEDGE[category];
    const qs = QUESTIONS[category];

    document.getElementById('quizHome').classList.add('hidden');
    document.getElementById('quizDifficulty').classList.remove('hidden');

    const counts = {};
    LEVELS.forEach(l => counts[l] = qs.filter(q => q.level === l).length);

    const panel = document.getElementById('diffPanel');
    let cards = LEVELS.map(level => `
        <div class="diff-card diff-${level}" data-level="${level}">
            <div class="diff-icon">${LEVEL_INFO[level].icon}</div>
            <div class="diff-name">${level}</div>
            <div class="diff-count">${counts[level]} 题</div>
            <div class="diff-desc">${LEVEL_INFO[level].desc}</div>
        </div>`).join('');

    panel.innerHTML = `
        <div class="diff-header">
            <h2>${cat.icon} ${cat.name} · 选择难度</h2>
            <p>选择适合自己的难度开始练习</p>
        </div>
        <div class="diff-grid">
            ${cards}
            <div class="diff-card diff-all" data-level="all">
                <div class="diff-icon">🎯</div>
                <div class="diff-name">全部难度</div>
                <div class="diff-count">${qs.length} 题</div>
                <div class="diff-desc">混合各难度题目，综合挑战</div>
            </div>
        </div>`;
    panel.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', () => startQuiz(category, card.dataset.level));
    });
}

function startQuiz(category, level = 'all') {
    state.quiz.category = category;
    state.quiz.level = level;
    // 按难度筛选
    let pool = QUESTIONS[category];
    if (level !== 'all') {
        pool = pool.filter(q => q.level === level);
    }
    // 若该难度题目不足 10 道，则用全部；若为空则提示
    if (pool.length === 0) {
        toast('该难度暂无题目，已切换为全部题目', 'error');
        pool = QUESTIONS[category];
        level = 'all';
        state.quiz.level = 'all';
    }
    const take = Math.min(10, pool.length);
    state.quiz.questions = [...pool].sort(() => Math.random() - 0.5).slice(0, take);
    state.quiz.current = 0;
    state.quiz.score = 0;
    state.quiz.answered = false;
    state.quiz.selectedOption = null;
    state.quiz.results = [];

    document.getElementById('quizHome').classList.add('hidden');
    document.getElementById('quizDifficulty').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    // 先重置内容再显示，避免残留上一局状态
    document.getElementById('quizFooter').classList.add('hidden');
    document.getElementById('quizBody').innerHTML = '';
    document.getElementById('quizTotal').textContent = state.quiz.questions.length;
    // 显示难度标签
    const tag = document.getElementById('quizLevelTag');
    const lvLabel = level === 'all' ? '全部' : level;
    tag.textContent = lvLabel;
    tag.className = 'quiz-level-tag' + (level !== 'all' ? ' qlt-' + level : '');
    renderQuizQuestion();
    document.getElementById('quizPlayer').classList.remove('hidden');
}

function renderQuizQuestion() {
    const q = state.quiz.questions[state.quiz.current];
    document.getElementById('quizCurrent').textContent = state.quiz.current + 1;
    document.getElementById('quizScore').textContent = state.quiz.score;
    const progress = ((state.quiz.current) / state.quiz.questions.length) * 100;
    document.getElementById('quizProgressFill').style.width = progress + '%';

    const labels = ['A', 'B', 'C', 'D', 'E'];
    const body = document.getElementById('quizBody');
    body.innerHTML = `
        <div class="quiz-question">${state.quiz.current + 1}. ${q.q}</div>
        <div class="quiz-options">
            ${q.options.map((opt, i) => `
                <div class="quiz-option" data-i="${i}">
                    <span class="option-label">${labels[i]}</span>
                    <span>${opt}</span>
                </div>`).join('')}
        </div>
        <div class="quiz-explain hidden" id="quizExplain">
            <div class="quiz-explain-title">💡 解析</div>
            <div id="explainContent"></div>
        </div>`;
    body.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', () => answerQuestion(parseInt(opt.dataset.i)));
    });
    document.getElementById('quizFooter').classList.add('hidden');
    state.quiz.answered = false;
}

function answerQuestion(index) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;
    state.quiz.selectedOption = index;
    const q = state.quiz.questions[state.quiz.current];
    const correct = index === q.answer;
    state.quiz.results.push(correct);

    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
        opt.style.cursor = 'default';
        if (i === q.answer) opt.classList.add('correct');
        if (i === index && !correct) opt.classList.add('wrong');
    });

    const explain = document.getElementById('quizExplain');
    document.getElementById('explainContent').textContent = q.explain;
    explain.classList.remove('hidden');

    if (correct) {
        state.quiz.score++;
        toast('回答正确！', 'success');
    } else {
        toast('回答错误', 'error');
    }

    // 记录答题
    recordAnswer(state.quiz.category, state.quiz.current, correct);

    const footer = document.getElementById('quizFooter');
    footer.classList.remove('hidden');
    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.textContent = state.quiz.current === state.quiz.questions.length - 1 ? '查看结果' : '下一题';
}

function nextQuestion() {
    if (state.quiz.current < state.quiz.questions.length - 1) {
        state.quiz.current++;
        renderQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const total = state.quiz.questions.length;
    const score = state.quiz.score;
    const percent = (score / total) * 100;
    const level = state.quiz.level || 'all';
    const cat = KNOWLEDGE[state.quiz.category];

    // 保存历史
    let data = getUserData();
    if (data) {
        data.quizHistory.push({
            category: state.quiz.category,
            level: level,
            score: score,
            total: total,
            date: new Date().toISOString()
        });
        saveUserData(data);
        checkAchievements();
    }

    document.getElementById('quizPlayer').classList.add('hidden');
    document.getElementById('quizResult').classList.remove('hidden');
    document.getElementById('resultScore').textContent = score;
    document.getElementById('resultTotal').textContent = total;

    // 显示本次练习的学科与难度
    const lvLabel = level === 'all' ? '全部难度' : level;
    const subEl = document.getElementById('resultSub');
    if (subEl) subEl.textContent = `${cat.icon} ${cat.name} · ${lvLabel} · 共 ${total} 题`;

    let emoji, msg;
    if (percent === 100) { emoji = '🏆'; msg = '满分！你是真正的运维大神！'; }
    else if (percent >= 80) { emoji = '🎉'; msg = '优秀！掌握得很扎实，继续保持！'; }
    else if (percent >= 60) { emoji = '👍'; msg = '及格了，还有提升空间，加油！'; }
    else { emoji = '💪'; msg = '需要再学习一下相关知识，相信你可以的！'; }
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultMsg').textContent = msg;
}

function recordAnswer(category, index, correct) {
    let data = getUserData();
    if (!data) return;
    // 用 category+原始题目index 去重记录
    const origIndex = QUESTIONS[category].findIndex(q => q.q === state.quiz.questions[index].q);
    const key = category + '_' + origIndex;
    const existing = data.answeredQuestions.find(a => a.key === key);
    if (!existing) {
        data.answeredQuestions.push({ key, category, correct });
    } else if (!existing.correct && correct) {
        existing.correct = true;
    }
    saveUserData(data);
}

// ============ 进度页 ============
function renderProgress() {
    const data = getUserData();
    const stats = getStats();

    if (!data) {
        document.getElementById('learnedCount').textContent = 0;
        document.getElementById('answeredCount').textContent = 0;
        document.getElementById('correctRate').textContent = '0%';
        document.getElementById('streakDays').textContent = 0;
    } else {
        document.getElementById('learnedCount').textContent = data.learnedTopics.length;
        document.getElementById('answeredCount').textContent = data.answeredQuestions.length;
        const correctCount = data.answeredQuestions.filter(a => a.correct).length;
        const rate = data.answeredQuestions.length ? Math.round((correctCount / data.answeredQuestions.length) * 100) : 0;
        document.getElementById('correctRate').textContent = rate + '%';
        document.getElementById('streakDays').textContent = calcStreak(data.loginDays);
    }

    // 各学科进度
    const cp = document.getElementById('categoryProgress');
    cp.innerHTML = Object.entries(KNOWLEDGE).map(([key, cat]) => {
        const learned = data ? data.learnedTopics.filter(id => cat.topics.some(t => t.id === id)).length : 0;
        const total = cat.topics.length;
        const percent = total ? Math.round((learned / total) * 100) : 0;
        return `
            <div class="cp-item">
                <div class="cp-header">
                    <div class="cp-name">${cat.icon} ${cat.name}</div>
                    <div class="cp-percent">${percent}%</div>
                </div>
                <div class="cp-bar">
                    <div class="cp-bar-fill" style="width:${percent}%;background:${cat.color};"></div>
                </div>
                <div class="cp-detail">已学 ${learned} / ${total} 知识点 · 题库 ${QUESTIONS[key].length} 题</div>
            </div>`;
    }).join('');

    // 徽章
    renderBadges(data);
}

function calcStreak(loginDays) {
    if (!loginDays || !loginDays.length) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const set = new Set(loginDays);
    let streak = 0;
    let d = new Date();
    // 如果今天没登录，从昨天开始算
    if (!set.has(today)) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

// ============ 成就系统 ============
const ACHIEVEMENTS = [
    { id: 'first_learn', icon: '🌱', name: '初学者', desc: '学习第一个知识点' },
    { id: 'learn_5', icon: '📚', name: '勤学者', desc: '学习 5 个知识点' },
    { id: 'learn_all_one', icon: '🎓', name: '专科毕业', desc: '学完一个学科全部知识点' },
    { id: 'first_quiz', icon: '✍️', name: '初试身手', desc: '完成第一次练习' },
    { id: 'quiz_10', icon: '🎯', name: '题海战术', desc: '累计答题 10 道' },
    { id: 'quiz_30', icon: '💪', name: '答题达人', desc: '累计答题 30 道' },
    { id: 'perfect', icon: '🏆', name: '满分达人', desc: '获得一次满分' },
    { id: 'streak_3', icon: '🔥', name: '坚持三天', desc: '连续学习 3 天' },
    { id: 'streak_7', icon: '⭐', name: '周练达人', desc: '连续学习 7 天' },
    { id: 'all_master', icon: '👑', name: '运维大师', desc: '学完全部知识点' }
];

function checkAchievements() {
    let data = getUserData();
    if (!data) return;
    const unlocked = new Set(data.achievements);
    const newOnes = [];

    const learnedCount = data.learnedTopics.length;
    const answeredCount = data.answeredQuestions.length;
    const streak = calcStreak(data.loginDays);
    const perfect = data.quizHistory.some(h => h.score === h.total && h.total > 0);
    const allOneCat = Object.values(KNOWLEDGE).some(cat =>
        cat.topics.every(t => data.learnedTopics.includes(t.id)));
    const allMaster = Object.values(KNOWLEDGE).every(cat =>
        cat.topics.every(t => data.learnedTopics.includes(t.id)));

    const checks = {
        first_learn: learnedCount >= 1,
        learn_5: learnedCount >= 5,
        learn_all_one: allOneCat,
        first_quiz: data.quizHistory.length >= 1,
        quiz_10: answeredCount >= 10,
        quiz_30: answeredCount >= 30,
        perfect: perfect,
        streak_3: streak >= 3,
        streak_7: streak >= 7,
        all_master: allMaster
    };

    Object.entries(checks).forEach(([id, ok]) => {
        if (ok && !unlocked.has(id)) {
            unlocked.add(id);
            newOnes.push(id);
        }
    });

    if (newOnes.length) {
        data.achievements = Array.from(unlocked);
        saveUserData(data);
        newOnes.forEach((id, i) => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            setTimeout(() => toast(`🏆 解锁成就：${ach.name}！`, 'success'), i * 1200);
        });
    }
}

function renderBadges(data) {
    const unlocked = data ? new Set(data.achievements) : new Set();
    document.getElementById('badgeGrid').innerHTML = ACHIEVEMENTS.map(a => `
        <div class="badge ${unlocked.has(a.id) ? 'unlocked' : ''}">
            <div class="badge-icon">${a.icon}</div>
            <div class="badge-name">${a.name}</div>
            <div class="badge-desc">${a.desc}</div>
        </div>`).join('');
}

// ============ 登录 ============
function checkLogin() {
    const user = Store.get('ops_user');
    if (user) {
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('userName').textContent = user;
        document.getElementById('userAvatar').textContent = user.charAt(0).toUpperCase();
        // 记录登录日期
        const data = getUserData();
        const today = new Date().toISOString().slice(0, 10);
        if (!data.loginDays.includes(today)) {
            data.loginDays.push(today);
            saveUserData(data);
            checkAchievements();
        }
    } else {
        document.getElementById('loginBtn').classList.remove('hidden');
        document.getElementById('userInfo').classList.add('hidden');
    }
}

function login(username, password) {
    if (!username || username.length < 2) {
        return '用户名至少 2 个字符';
    }
    if (!password || password.length < 4) {
        return '密码至少 4 个字符';
    }
    // 演示版：保存用户列表
    const users = Store.get('ops_users', {});
    if (users[username]) {
        if (users[username] !== password) return '密码错误';
    } else {
        users[username] = password;
        Store.set('ops_users', users);
    }
    Store.set('ops_user', username);
    return null;
}

function logout() {
    Store.set('ops_user', null);
    toast('已退出登录');
    checkLogin();
    if (state.currentPage === 'progress') renderProgress();
}

// ============ 事件绑定 ============
function bindEvents() {
    // 导航
    document.querySelectorAll('.nav-item').forEach(n => {
        n.addEventListener('click', e => { e.preventDefault(); navigate(n.dataset.page); });
    });
    document.getElementById('startLearnBtn').addEventListener('click', () => navigate('learn'));

    // 登录
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('active');
    });
    document.getElementById('loginCloseBtn').addEventListener('click', () => {
        document.getElementById('loginModal').classList.remove('active');
    });
    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value;
        const err = login(u, p);
        const errEl = document.getElementById('loginError');
        if (err) {
            errEl.textContent = err;
            errEl.classList.remove('hidden');
        } else {
            errEl.classList.add('hidden');
            document.getElementById('loginModal').classList.remove('active');
            toast('登录成功，欢迎 ' + u + '！', 'success');
            checkLogin();
            if (state.currentPage === 'progress') renderProgress();
        }
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // 知识点弹窗
    document.getElementById('topicCloseBtn').addEventListener('click', () => {
        document.getElementById('topicModal').classList.remove('active');
    });

    // 题库
    document.getElementById('quizBackBtn').addEventListener('click', () => {
        // 答题中返回 -> 回到难度选择面板（保留学科）
        if (state.quiz.category) showDifficulty(state.quiz.category);
        else renderQuizHome();
    });
    document.getElementById('diffBackBtn').addEventListener('click', () => renderQuizHome());
    document.getElementById('quizNextBtn').addEventListener('click', nextQuestion);
    document.getElementById('quizRetryBtn').addEventListener('click', () => startQuiz(state.quiz.category, state.quiz.level || 'all'));
    document.getElementById('quizChangeLevelBtn').addEventListener('click', () => {
        if (state.quiz.category) showDifficulty(state.quiz.category);
        else renderQuizHome();
    });
    document.getElementById('quizHomeBtn').addEventListener('click', () => renderQuizHome());

    // 点击弹窗外关闭
    document.getElementById('loginModal').addEventListener('click', e => {
        if (e.target.id === 'loginModal') e.target.classList.remove('active');
    });
    document.getElementById('topicModal').addEventListener('click', e => {
        if (e.target.id === 'topicModal') e.target.classList.remove('active');
    });

    // 窗口变化重渲染详情
    window.addEventListener('resize', () => {
        if (state.currentPage === 'learn') renderLearn();
    });
}

// ============ 启动 ============
function init() {
    bindEvents();
    checkLogin();
    navigate('home');
}

document.addEventListener('DOMContentLoaded', init);
