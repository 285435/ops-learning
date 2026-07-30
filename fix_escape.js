// 修复 add_examples_and_shell.js 中模板字面量的 ${} 转义问题
const fs = require('fs');
let content = fs.readFileSync('/workspace/add_examples_and_shell.js', 'utf8');

// 在处理标记之前的部分（EXAMPLES 和 SHELL_TOPICS），转义 ${
const marker = '// ========== 处理';
const idx = content.indexOf(marker);
if (idx < 0) { console.error('marker not found'); process.exit(1); }

let part1 = content.substring(0, idx);
let part2 = content.substring(idx);

// 将 part1 中的 ${ 替换为 \${ （在模板字面量中，\$ 产生 $，避免被解释为插值）
part1 = part1.split('${').join('\\${');

fs.writeFileSync('/workspace/add_examples_and_shell.js', part1 + part2);

// 统计
const count = (part1.match(/\\\${/g) || []).length;
console.log('已转义 ' + count + ' 处 ${');
