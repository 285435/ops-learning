/**
 * 读取 data_content.txt 解析实例和Shell知识点
 * 合并到 data.js
 */
const fs = require('fs');

// 1. 解析 data_content.txt
const raw = fs.readFileSync('/workspace/data_content.txt', 'utf8');
const examples = {};  // topicId -> example string
const shellTopics = [];  // {id, title, level, content, example}

const sections = raw.split(/@@@(?=EXAMPLE:|TOPIC:|END)/);
for (const section of sections) {
  const trimmed = section.trim();
  if (trimmed.startsWith('EXAMPLE:')) {
    const id = trimmed.substring('EXAMPLE:'.length).split('\n')[0].trim().replace(/@@@$/, '');
    const content = trimmed.substring(trimmed.indexOf('\n') + 1);
    examples[id] = content;
  } else if (trimmed.startsWith('TOPIC:')) {
    const id = trimmed.substring('TOPIC:'.length).split('\n')[0].trim().replace(/@@@$/, '');
    const body = trimmed.substring(trimmed.indexOf('\n') + 1);

    // 解析 TITLE, LEVEL, CONTENT, EXAMPLE
    const titleMatch = body.match(/^TITLE:\s*(.+)$/m);
    const levelMatch = body.match(/^LEVEL:\s*(.+)$/m);

    const contentStart = body.indexOf('CONTENT:');
    const exampleStart = body.indexOf('EXAMPLE:');
    const contentEnd = exampleStart > -1 ? exampleStart : body.length;

    const content = body.substring(contentStart + 'CONTENT:'.length, contentEnd).trim();
    const example = exampleStart > -1
      ? body.substring(exampleStart + 'EXAMPLE:'.length).trim()
      : '';

    shellTopics.push({
      id,
      title: titleMatch ? titleMatch[1].trim() : id,
      level: levelMatch ? levelMatch[1].trim() : '基础',
      content,
      example,
    });
  }
}

console.log(`解析完成: ${Object.keys(examples).length} 个实例, ${shellTopics.length} 个Shell知识点`);

// 2. 读取原始 data.js
const dataRaw = fs.readFileSync('/workspace/data.js', 'utf8');
eval(dataRaw.replace('const KNOWLEDGE', 'global.__K__').replace('const QUESTIONS', 'global.__Q__'));
const K = global.__K__;
const Q = global.__Q__;

// 2.5 移除已存在的 shell 分类（避免重复添加）
if (K.shell) delete K.shell;
if (Q.shell) delete Q.shell;

// 3. 为现有知识点添加 example
let added = 0;
for (const catKey of Object.keys(K)) {
  for (const topic of K[catKey].topics) {
    if (examples[topic.id]) {
      topic.example = examples[topic.id];
      added++;
    }
  }
}
console.log(`已为 ${added} 个现有知识点添加实例`);

// 4. 添加 Shell 学科
K.shell = {
  name: 'Shell脚本',
  icon: '🖥️',
  color: '#8b5cf6',
  topics: shellTopics,
};
console.log(`已添加 Shell 学科: ${shellTopics.length} 个知识点`);

// 5. 合并 Shell 题目
const shellQsRaw = fs.readFileSync('/workspace/shell_questions.js', 'utf8').replace(/^const /m, 'global.');
eval(shellQsRaw);
Q.shell = global.SHELL_NEW;
console.log(`已添加 Shell 题目: ${Q.shell.length} 道`);

// 6. 序列化
function serializeTopic(t) {
  let parts = [];
  parts.push(`        id: ${JSON.stringify(t.id)}`);
  parts.push(`        title: ${JSON.stringify(t.title)}`);
  parts.push(`        level: ${JSON.stringify(t.level)}`);
  parts.push(`        content: ${JSON.stringify(t.content)}`);
  if (t.example) {
    parts.push(`        example: ${JSON.stringify(t.example)}`);
  }
  return '      {\n' + parts.join(',\n') + '\n      }';
}

function serializeKnowledge(K) {
  let out = 'const KNOWLEDGE = {\n';
  for (const key of Object.keys(K)) {
    const cat = K[key];
    out += `  ${key}: {\n`;
    out += `    name: ${JSON.stringify(cat.name)},\n`;
    out += `    icon: ${JSON.stringify(cat.icon)},\n`;
    out += `    color: ${JSON.stringify(cat.color)},\n`;
    out += `    topics: [\n`;
    out += cat.topics.map(serializeTopic).join(',\n');
    out += `\n    ]\n`;
    out += `  },\n`;
  }
  out = out.replace(/,\n$/, '\n');
  out += '};\n';
  return out;
}

function serializeQuestions(Q) {
  let out = '\nconst QUESTIONS = {\n';
  for (const key of Object.keys(Q)) {
    const qs = Q[key];
    const items = qs.map(q => {
      const qStr = JSON.stringify(q.q);
      const lStr = JSON.stringify(q.level);
      const oStr = '[' + q.options.map(o=>JSON.stringify(o)).join(', ') + ']';
      const eStr = JSON.stringify(q.explain);
      return `    {q:${qStr}, level:${lStr}, options:${oStr}, answer:${q.answer}, explain:${eStr}}`;
    });
    out += `  ${key}: [\n${items.join(',\n')}\n  ],\n`;
  }
  out = out.replace(/,\n$/, '\n');
  out += '};\n';
  return out;
}

const finalContent = serializeKnowledge(K) + serializeQuestions(Q);
fs.writeFileSync('/workspace/data.js', finalContent, 'utf8');
console.log('已写入 /workspace/data.js');

// 7. 验证
try {
  eval(fs.readFileSync('/workspace/data.js', 'utf8')
    .replace('const KNOWLEDGE', 'global.__V_K__')
    .replace('const QUESTIONS', 'global.__V_Q__'));
  const VK = global.__V_K__;
  const VQ = global.__V_Q__;
  console.log('\n===== 验证结果 =====');
  let totalTopics = 0, totalQs = 0, totalExamples = 0;
  for (const k of Object.keys(VK)) {
    const cat = VK[k];
    const withExample = cat.topics.filter(t => t.example).length;
    const qs = VQ[k] ? VQ[k].length : 0;
    totalTopics += cat.topics.length;
    totalQs += qs;
    totalExamples += withExample;
    console.log(`${cat.icon} ${cat.name}: ${cat.topics.length}知识点(含实例${withExample}) | ${qs}题`);
  }
  console.log(`\n总计: ${totalTopics}知识点(含实例${totalExamples}), ${totalQs}道题`);
  console.log('语法检查: 通过');
} catch(e) {
  console.error('语法错误:', e.message);
  process.exit(1);
}
