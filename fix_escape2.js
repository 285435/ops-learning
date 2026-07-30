// 修复双重转义：将 \\${ 修复为 \${
const fs = require('fs');
let content = fs.readFileSync('/workspace/add_examples_and_shell.js', 'utf8');

const marker = '// ========== 处理';
const idx = content.indexOf(marker);
let part1 = content.substring(0, idx);
let part2 = content.substring(idx);

// 先修复双重转义 \\${ → \${ （注意要在 part1 中操作）
part1 = part1.split('\\\\${').join('\\${');

fs.writeFileSync('/workspace/add_examples_and_shell.js', part1 + part2);
console.log('修复完成');
