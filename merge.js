const fs = require('fs');

// ======= 各学科150道新题目（从general_purpose_task输出获取）=======
const NET_NEW = [/* network新题占位，下面填充 */];
const LIN_NEW = [/* linux新题占位，下面填充 */];
const FE_NEW  = [/* frontend新题占位，下面填充 */];
const BE_NEW  = [/* backend新题占位，下面填充 */];

// 读取原始data.js
let code = fs.readFileSync('/workspace/data.js', 'utf8');

// 通过匹配 QUESTIONS对象的结构，定位每个数组结尾位置
// network: 第1534行 network: [  ... 到第1657行 ],
// linux:  第1659行 linux: [ ... 到第1788行 ],
// frontend: ... 
// backend: 最后一个 backend:[... ] 没有逗号

// 使用正则在数组结束标记前插入新题目
function mergeCategory(catName, extraQuestions) {
  // 构造锚点：匹配 `},
  //   ],
  // 
  //   catName: [`
  // 最后一个题目是以 } 结尾，后面是 ], 或空格 ]
  // 简化方法：找到最后一道题后插入新题

  // 匹配 catName: [ 到最近的下一个顶级键 或 QUESTIONS结尾
  // 用非贪婪找到数组闭合的 ], 下一个顶级键或 }
  const regex = new RegExp(
    `(${catName}:\\\\s*\\\\[)([\\\\s\\\\S]*?)(\\\\])(\\\\s*,?\\\\s*\\\\n\\\\s*(?:'(?:network|linux|frontend|backend)'|\\\\}))`
  );
  console.log('Testing regex for', catName);
}

// 更简单：将原始代码中的 QUESTIONS 对象替换掉：
// 1. 截取前面的 KNOWLEDGE 部分（不含QUESTIONS）
// 2. 重新生成整个QUESTIONS对象

// 方案：执行原代码（用替换后的var）获取QUESTIONS原始数据，追加后再序列化写回

eval(code.replace(/^const /gm, 'var ').replace(/^const /gm, 'var '));

console.log('原始题目数量：');
console.log('  network:', QUESTIONS.network.length);
console.log('  linux:', QUESTIONS.linux.length);
console.log('  frontend:', QUESTIONS.frontend.length);
console.log('  backend:', QUESTIONS.backend.length);

// 注意：上面NET_NEW等是空数组，下面需要运行时填入
// 由于我们已经知道输出，使用脚本参数传递太麻烦，改为写子脚本
