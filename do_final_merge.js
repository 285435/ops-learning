// 合并新题库到data.js
const fs = require('fs');

// 1. 读取原始data.js
const dataContent = fs.readFileSync('/workspace/data.js', 'utf8');
const lines = dataContent.split('\n');

// 拆分：前面是KNOWLEDGE（第1行到1532行，注意索引从0开始），后面是QUESTIONS
const knowledgeLines = lines.slice(0, 1532);

// 2. eval原始QUESTIONS
const QUESTIONS_START = 1533;
eval(dataContent.replace('const KNOWLEDGE', 'global.__KNOW__').replace('const QUESTIONS', 'global.__Q__'));
const oldQs = global.__Q__;
console.log('原始题库:');
for (const k of Object.keys(oldQs)) {
  console.log('  ' + k + ': ' + oldQs[k].length);
}

// 3. 读取三个新题库
function loadArr(path, varName) {
  const c = fs.readFileSync(path, 'utf8').replace(/^const /m, 'global.');
  eval(c);
  return global[varName];
}
const LIN_NEW = loadArr('/workspace/linux_questions.js', 'LINUX_NEW');
const FE_NEW = loadArr('/workspace/frontend_questions.js', 'FRONTEND_NEW');
const BE_NEW = loadArr('/workspace/backend_questions.js', 'BACKEND_NEW');
console.log('新题库: LIN=' + LIN_NEW.length + ' FE=' + FE_NEW.length + ' BE=' + BE_NEW.length);

// 4. 按题干去重合并
function uniqueMerge(oldArr, newArr) {
  const s = new Set();
  const out = [];
  for (const q of oldArr) {
    if (!s.has(q.q)) { s.add(q.q); out.push(q); }
  }
  for (const q of newArr) {
    if (!s.has(q.q)) { s.add(q.q); out.push(q); }
  }
  return out;
}

// 合并（network保留，lin/fe/be合并）
const NET_ALL = oldQs.network; // 已经204
const LIN_ALL = uniqueMerge(oldQs.linux, LIN_NEW);
const FE_ALL  = uniqueMerge(oldQs.frontend, FE_NEW);
const BE_ALL  = uniqueMerge(oldQs.backend, BE_NEW);

// 如果不足200，就用已有的；超过200也保留（network 204就保留）
function limitTo(arr, n) {
  // 按level比例裁剪：优先保留难度均衡
  if (arr.length <= n) return arr;
  const b = arr.filter(q=>q.level==='基础');
  const m = arr.filter(q=>q.level==='进阶');
  const h = arr.filter(q=>q.level==='高级');
  // 目标比例：基础100 进阶68 高级32
  let need_b = Math.min(100, b.length);
  let need_m = Math.min(68, m.length);
  let need_h = Math.min(32, h.length);
  let total = need_b + need_m + need_h;
  while (total < n) {
    if (need_b < b.length) { need_b++; total++; continue; }
    if (need_m < m.length) { need_m++; total++; continue; }
    if (need_h < h.length) { need_h++; total++; continue; }
    break;
  }
  while (total > n) {
    if (need_b > 0 && total - need_b >= n - 68 - 32) { need_b--; total--; continue; }
    if (need_m > 0) { need_m--; total--; continue; }
    if (need_h > 0) { need_h--; total--; continue; }
    break;
  }
  return b.slice(0, need_b).concat(m.slice(0, need_m)).concat(h.slice(0, need_h));
}

const NET_FINAL = limitTo(NET_ALL, 200);
const LIN_FINAL = limitTo(LIN_ALL, 200);
const FE_FINAL  = limitTo(FE_ALL, 200);
const BE_FINAL  = limitTo(BE_ALL, 200);

console.log('\n合并后题库:');
function printStat(arr, name) {
  const lv = {基础:0,进阶:0,高级:0};
  for (const q of arr) if (lv[q.level]!==undefined) lv[q.level]++;
  console.log('  '+name+': '+arr.length+' (基础:'+lv['基础']+' 进阶:'+lv['进阶']+' 高级:'+lv['高级']+')');
}
printStat(NET_FINAL, 'network');
printStat(LIN_FINAL, 'linux');
printStat(FE_FINAL, 'frontend');
printStat(BE_FINAL, 'backend');
const total = NET_FINAL.length + LIN_FINAL.length + FE_FINAL.length + BE_FINAL.length;
console.log('  TOTAL: ' + total);

// 5. 把数组序列化成JS代码（保持单行对象格式紧凑，和data.js原有风格尽量一致，这里用多行美观的）
function serializeArr(arr) {
  const items = arr.map(q => {
    const qStr = JSON.stringify(q.q);
    const lStr = JSON.stringify(q.level);
    const oStr = '[' + q.options.map(o=>JSON.stringify(o)).join(', ') + ']';
    const aStr = q.answer;
    const eStr = JSON.stringify(q.explain);
    return '    {q:' + qStr + ', level:' + lStr + ', options:' + oStr + ', answer:' + aStr + ', explain:' + eStr + '}';
  });
  return '[\n' + items.join(',\n') + '\n  ]';
}

const newQuestionsStr =
`const QUESTIONS = {
  network: ${serializeArr(NET_FINAL)},
  linux: ${serializeArr(LIN_FINAL)},
  frontend: ${serializeArr(FE_FINAL)},
  backend: ${serializeArr(BE_FINAL)}
};
`;

// 6. 拼接并写入
const finalContent = knowledgeLines.join('\n') + '\n' + newQuestionsStr;
fs.writeFileSync('/workspace/data.js', finalContent, 'utf8');
console.log('\n已写入 /workspace/data.js');

// 7. 验证语法
try {
  eval(fs.readFileSync('/workspace/data.js','utf8').replace('const KNOWLEDGE','a').replace('const QUESTIONS','b'));
  console.log('语法检查: 通过');
} catch(e) {
  console.log('语法错误: ' + e.message);
  process.exit(1);
}
