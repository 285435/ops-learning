const fs = require('fs');

// Load data.js
let code = fs.readFileSync('/workspace/data.js', 'utf8')
  .replace(/const KNOWLEDGE/g, 'global.KNOWLEDGE')
  .replace(/const QUESTIONS/g, 'global.QUESTIONS');
eval(code);

// Fix nested arrays in QUESTIONS for all subjects
let totalFixed = 0;
let totalQuestionsBefore = 0;
let totalQuestionsAfter = 0;

for (const subject of Object.keys(QUESTIONS)) {
  const arr = QUESTIONS[subject];
  if (!Array.isArray(arr)) continue;
  totalQuestionsBefore += arr.length;

  // Detect nested arrays: an element that is itself an array of question objects
  const flattened = [];
  let nestedCount = 0;
  for (const item of arr) {
    if (Array.isArray(item)) {
      // Nested array - flatten it (filter out any invalid entries)
      nestedCount++;
      for (const q of item) {
        if (q && q.q && typeof q.q === 'string') {
          flattened.push(q);
        }
      }
    } else if (item && item.q && typeof item.q === 'string') {
      flattened.push(item);
    } else {
      // invalid entry, skip
      console.log(`[${subject}] skipping invalid question:`, JSON.stringify(item).slice(0, 100));
    }
  }

  if (nestedCount > 0) {
    console.log(`[${subject}] flattened ${nestedCount} nested array(s), ${arr.length} -> ${flattened.length} questions`);
    totalFixed += nestedCount;
  }

  // Dedup by question text (keep first occurrence)
  const seen = new Set();
  const deduped = [];
  let dupCount = 0;
  for (const q of flattened) {
    if (seen.has(q.q)) {
      dupCount++;
      continue;
    }
    seen.add(q.q);
    deduped.push(q);
  }
  if (dupCount > 0) {
    console.log(`[${subject}] removed ${dupCount} duplicate question(s)`);
  }

  QUESTIONS[subject] = deduped;
  totalQuestionsAfter += deduped.length;
}

console.log('---');
console.log(`Total nested arrays fixed: ${totalFixed}`);
console.log(`Total questions: ${totalQuestionsBefore} -> ${totalQuestionsAfter}`);

// Also verify KNOWLEDGE topics are clean
let badTopics = 0;
for (const subject of Object.keys(KNOWLEDGE)) {
  if (!Array.isArray(KNOWLEDGE[subject].topics)) continue;
  const before = KNOWLEDGE[subject].topics.length;
  KNOWLEDGE[subject].topics = KNOWLEDGE[subject].topics.filter(t => t && t.id && t.title && t.content);
  const after = KNOWLEDGE[subject].topics.length;
  if (before !== after) {
    console.log(`[${subject}] removed ${before - after} invalid topic(s)`);
    badTopics += before - after;
  }
}
console.log(`Invalid topics removed: ${badTopics}`);

// Final stats
let totalT = 0, totalQ = 0;
for (const s of Object.keys(KNOWLEDGE)) {
  const t = KNOWLEDGE[s].topics.length;
  const q = QUESTIONS[s].length;
  totalT += t; totalQ += q;
  console.log(`${s.padEnd(10)} topics: ${t}  questions: ${q}`);
}
console.log('---');
console.log(`Grand total: ${totalT} topics, ${totalQ} questions`);

// Write back
const output = 'const KNOWLEDGE = ' + JSON.stringify(KNOWLEDGE, null, 2) + ';\n\nconst QUESTIONS = ' + JSON.stringify(QUESTIONS, null, 2) + ';\n';
fs.writeFileSync('/workspace/data.js', output);
console.log('\nWritten to data.js');
