const fs = require('fs');

// Load existing data.js
const code = fs.readFileSync('/workspace/data.js', 'utf8')
  .replace(/const KNOWLEDGE/g, 'global.KNOWLEDGE')
  .replace(/const QUESTIONS/g, 'global.QUESTIONS');
eval(code);

// Fix c subject's undefined entry (caused by a topic without proper fields)
if (KNOWLEDGE.c && Array.isArray(KNOWLEDGE.c.topics)) {
  const before = KNOWLEDGE.c.topics.length;
  KNOWLEDGE.c.topics = KNOWLEDGE.c.topics.filter(t => t && t.id && t.title && t.content);
  const after = KNOWLEDGE.c.topics.length;
  if (before !== after) {
    console.log(`Fixed c: removed ${before - after} invalid entries (undefined topics)`);
  }
}

// Extension files config: filename -> subject key
const extFiles = [
  ['ext_py.js', 'python'],
  ['ext_c.js', 'c'],
  ['ext_cpp.js', 'cpp'],
  ['ext_java.js', 'java'],
  ['ext_mysql.js', 'mysql'],
  ['ext_sql.js', 'sql'],
  ['ext_frontend.js', 'frontend'],
  ['ext_linux.js', 'linux'],
  ['ext_backend.js', 'backend'],
  ['ext_shell.js', 'shell'],
  ['ext_network.js', 'network'],
  // Second batch extensions
  ['ext2_py.js', 'python'],
  ['ext2_c.js', 'c'],
  ['ext2_cpp.js', 'cpp'],
  ['ext2_java.js', 'java'],
  ['ext2_mysql.js', 'mysql'],
  ['ext2_sql.js', 'sql'],
  // Third batch extensions
  ['ext3_linux.js', 'linux'],
  ['ext3_shell.js', 'shell'],
  ['ext3_mysql.js', 'mysql'],
  ['ext3_sql.js', 'sql'],
  // Fourth batch extensions
  ['ext4_network.js', 'network'],
  ['ext4_linux.js', 'linux'],
  ['ext4_shell.js', 'shell'],
  ['ext4_mysql.js', 'mysql'],
  ['ext4_sql.js', 'sql'],
  ['ext4_python.js', 'python'],
  ['ext4_backend.js', 'backend'],
  ['ext4_frontend.js', 'frontend'],
  // Fifth batch extensions
  ['ext5_c.js', 'c'],
  ['ext5_cpp.js', 'cpp'],
  ['ext5_java.js', 'java'],
];

// Parse a single ext file: returns { topics, questions }
// File format:
//   <subject>_ext_topics: [ ... ]
//   <subject>_ext_questions: [ ... ]
function parseExtFile(filename) {
  const content = fs.readFileSync('/workspace/' + filename, 'utf8');

  // Extract topics: <key>_ext_topics: [ ... ]
  // Find the start, then matching closing ]
  function extractArray(marker) {
    const startIdx = content.indexOf(marker);
    if (startIdx === -1) return null;
    const bracketStart = content.indexOf('[', startIdx);
    if (bracketStart === -1) return null;
    // Find matching ] - naive: last ] in file (since arrays are at top level)
    // Better: scan from bracketStart counting brackets
    let depth = 0;
    let i = bracketStart;
    let inString = false;
    let stringChar = '';
    let escaped = false;
    for (; i < content.length; i++) {
      const ch = content[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (inString) {
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          return content.substring(bracketStart, i + 1);
        }
      }
    }
    return null;
  }

  // Try topics marker (key varies by subject)
  // We just search for "_ext_topics:" and "_ext_questions:"
  const topicsMarkerMatch = content.match(/(\w+)_ext\d*_topics\s*:/);
  const questionsMarkerMatch = content.match(/(\w+)_ext\d*_questions\s*:/);

  let topicsArr = [];
  let questionsArr = [];

  if (topicsMarkerMatch) {
    const marker = topicsMarkerMatch[0];
    const arrStr = extractArray(marker);
    if (arrStr) {
      topicsArr = eval(arrStr);
    }
  }
  if (questionsMarkerMatch) {
    const marker = questionsMarkerMatch[0];
    const arrStr = extractArray(marker);
    if (arrStr) {
      questionsArr = eval(arrStr);
    }
  }

  return { topics: topicsArr, questions: questionsArr };
}

// Merge all extensions
let totalNewTopics = 0;
let totalNewQuestions = 0;

for (const [file, subject] of extFiles) {
  try {
    const { topics, questions } = parseExtFile(file);
    if (!KNOWLEDGE[subject]) {
      console.error(`Subject ${subject} not found in KNOWLEDGE`);
      continue;
    }
    // Dedup by topic id (avoid duplicate if re-run)
    const existingIds = new Set(KNOWLEDGE[subject].topics.map(t => t.id));
    const newTopics = topics.filter(t => !existingIds.has(t.id));
    KNOWLEDGE[subject].topics.push(...newTopics);

    // For questions, just append (could dedup by q text but simpler to append)
    // To avoid duplicates on re-run, dedup by q text
    const existingQs = new Set(QUESTIONS[subject].map(q => q.q));
    const newQs = questions.filter(q => !existingQs.has(q.q));
    QUESTIONS[subject].push(...newQs);

    console.log(`${subject}: +${newTopics.length} topics (total ${KNOWLEDGE[subject].topics.length}), +${newQs.length} questions (total ${QUESTIONS[subject].length})`);
    totalNewTopics += newTopics.length;
    totalNewQuestions += newQs.length;
  } catch (e) {
    console.error(`Error processing ${file} (${subject}): ${e.message}`);
    process.exit(1);
  }
}

console.log(`\nTotal: +${totalNewTopics} topics, +${totalNewQuestions} questions`);

// Write back
const output = 'const KNOWLEDGE = ' + JSON.stringify(KNOWLEDGE, null, 2) + ';\n\nconst QUESTIONS = ' + JSON.stringify(QUESTIONS, null, 2) + ';\n';
fs.writeFileSync('/workspace/data.js', output);

console.log('\n=== Final state ===');
let totalTopics = 0, totalQuestions = 0;
for (const [k, v] of Object.entries(KNOWLEDGE)) {
  console.log(k + ': ' + v.topics.length + ' topics');
  totalTopics += v.topics.length;
}
console.log('---');
for (const [k, v] of Object.entries(QUESTIONS)) {
  console.log(k + ': ' + v.length + ' questions');
  totalQuestions += v.length;
}
console.log(`\nGrand total: ${totalTopics} topics, ${totalQuestions} questions`);

// Auto-bump version.json so client-side update banner triggers
try {
  const vPath = '/workspace/version.json';
  let v = { version: 0, timestamp: '', message: '' };
  if (fs.existsSync(vPath)) {
    try { v = JSON.parse(fs.readFileSync(vPath, 'utf8')); } catch {}
  }
  v.version   = (v.version || 0) + 1;
  v.timestamp = new Date().toISOString();
  v.message   = `更新：${totalNewTopics} 个新知识点，${totalNewQuestions} 道新题目。总计 ${totalTopics} 知识点 / ${totalQuestions} 题目。`;
  fs.writeFileSync(vPath, JSON.stringify(v, null, 2) + '\n');
  console.log(`\nBumped version -> v${v.version}  (${v.timestamp})`);
} catch (e) {
  console.error('version.json update skipped:', e.message);
}
