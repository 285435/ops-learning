const SHELL_NEW = [
  {
    "q": "在Shell脚本中，shebang行 #!/bin/bash 的作用是什么？",
    "level": "基础",
    "options": [
      "指定脚本的字符编码",
      "声明脚本的版本号",
      "设置脚本的环境变量",
      "指定解释执行该脚本的程序"
    ],
    "answer": 3,
    "explain": "shebang(#!)开头的第一行告诉操作系统使用哪个解释器执行脚本，#!/bin/bash表示用bash解释器执行。"
  },
  {
    "q": "关于 bash、sh、zsh 的区别，下列说法正确的是？",
    "level": "基础",
    "options": [
      "sh和bash是完全相同的shell",
      "zsh是bash的早期版本，功能较少",
      "bash是sh的超集，zsh兼容bash并扩展了更多交互功能",
      "zsh只能用于脚本，不能交互使用"
    ],
    "answer": 2,
    "explain": "bash是Bourne shell(sh)的超集，zsh兼容bash语法并提供了更强的补全和交互功能，常作为交互式shell使用。"
  },
  {
    "q": "Shell脚本中定义变量时，下列哪种写法是正确的？",
    "level": "基础",
    "options": [
      "name = value",
      "name => value",
      "name:=value",
      "name=value"
    ],
    "answer": 3,
    "explain": "Shell变量赋值格式为 name=value，等号两边不能有空格，否则会被解释为命令执行。"
  },
  {
    "q": "引用变量var的值，下列哪种写法在所有情况下最安全？",
    "level": "基础",
    "options": [
      "$var",
      "var$",
      "$var$",
      "${var}"
    ],
    "answer": 3,
    "explain": "使用 ${var} 花括号形式最安全，能避免歧义，例如 ${var}abc 不会与变量名混淆，而 $varabc 会被识别为变量 varabc。"
  },
  {
    "q": "使用 export 命令的作用是？",
    "level": "基础",
    "options": [
      "删除一个变量",
      "将变量声明为只读",
      "将变量导出为环境变量，使其可被子进程继承",
      "将变量转换为局部变量"
    ],
    "answer": 2,
    "explain": "export 将变量导出为环境变量，子进程可以继承该变量；未export的变量仅在当前shell有效。"
  },
  {
    "q": "位置参数 $0 表示什么？",
    "level": "基础",
    "options": [
      "脚本的第一个参数",
      "脚本参数的个数",
      "脚本退出状态码",
      "脚本本身的名称或路径"
    ],
    "answer": 3,
    "explain": "$0 表示脚本本身的名字或调用路径，$1才是第一个参数。"
  },
  {
    "q": "特殊变量 $# 的含义是？",
    "level": "基础",
    "options": [
      "当前进程PID",
      "上一条命令的退出状态",
      "位置参数的个数",
      "所有位置参数列表"
    ],
    "answer": 2,
    "explain": "$# 表示传递给脚本或函数的位置参数个数。"
  },
  {
    "q": "关于 $@ 和 $* 的区别，下列说法正确的是？",
    "level": "基础",
    "options": [
      "两者完全相同，无区别",
      "$*保留每个参数独立，$@合并为一个字符串",
      "$@只能用于函数，$*只能用于脚本",
      "加引号时 '$@' 保留每个参数独立，'$*' 合并为一个字符串"
    ],
    "answer": 3,
    "explain": "加双引号时 '$@' 会将每个参数作为独立字符串保留，'$*' 将所有参数用IFS第一个字符连接为单个字符串。"
  },
  {
    "q": "特殊变量 $$ 表示什么？",
    "level": "基础",
    "options": [
      "后台进程PID",
      "上一条命令返回值",
      "脚本参数个数",
      "当前shell的进程PID"
    ],
    "answer": 3,
    "explain": "$$ 表示当前shell进程的PID，常用于创建临时文件名保证唯一性。"
  },
  {
    "q": "特殊变量 $? 表示什么？",
    "level": "基础",
    "options": [
      "当前shell的PID",
      "脚本名称",
      "上一条命令的退出状态码",
      "参数个数"
    ],
    "answer": 2,
    "explain": "$? 保存上一条命令的退出状态码，0表示成功，非0表示失败。"
  },
  {
    "q": "如何获取字符串 str 的长度？",
    "level": "基础",
    "options": [
      "${str.length}",
      "${len(str)}",
      "length($str)",
      "${#str}"
    ],
    "answer": 3,
    "explain": "${#str} 返回字符串str的长度，这是bash内置语法，无需调用外部命令。"
  },
  {
    "q": "要从字符串 str='HelloWorld' 中截取前5个字符，正确写法是？",
    "level": "基础",
    "options": [
      "${str:0:5}",
      "${str:5}",
      "${str:0-5}",
      "substr($str,0,5)"
    ],
    "answer": 0,
    "explain": "${str:offset:length} 截取子串，${str:0:5} 从位置0开始截取5个字符，得到 'Hello'。"
  },
  {
    "q": "将字符串 str 中的第一个 'old' 替换为 'new'，正确写法是？",
    "level": "基础",
    "options": [
      "${str/old/new}",
      "${str//old/new}",
      "${str/old/new/}",
      "replace($str,old,new)"
    ],
    "answer": 0,
    "explain": "${str/old/new} 替换第一个匹配，${str//old/new} 替换所有匹配。"
  },
  {
    "q": "将字符串 str 中所有 'old' 替换为 'new'，正确写法是？",
    "level": "基础",
    "options": [
      "${str/old/new}",
      "${str/g/old/new}",
      "${str/old/new/all}",
      "${str//old/new}"
    ],
    "answer": 3,
    "explain": "使用双斜杠 ${str//old/new} 替换所有匹配项，单斜杠只替换第一个。"
  },
  {
    "q": "if 语句的正确结束关键字是？",
    "level": "基础",
    "options": [
      "end",
      "endif",
      "fi",
      "done"
    ],
    "answer": 2,
    "explain": "if 语句以 fi 结束，这是将 if 反转拼写，符合Shell的设计风格。"
  },
  {
    "q": "test 命令的另一种写法 [ ] 中，括号与表达式之间的要求是？",
    "level": "基础",
    "options": [
      "括号内不能有空格",
      "只能用双括号",
      "括号必须紧贴变量",
      "括号两侧必须有空格"
    ],
    "answer": 3,
    "explain": "[ 是test命令的别名，必须与表达式之间有空格分隔，例如 [ -f file ]，否则会报错。"
  },
  {
    "q": "[[ ]] 与 [ ] 相比的优势是？",
    "level": "基础",
    "options": [
      "[[ ]] 只能用于数字比较",
      "[[ ]] 是 POSIX 标准的一部分",
      "[[ ]] 支持模式匹配和逻辑运算且更安全，不会因空变量产生单词分裂",
      "[[ ]] 不能用于字符串比较"
    ],
    "answer": 2,
    "explain": "[[ ]] 是bash扩展，支持通配符匹配、&&/||逻辑运算，且不会对变量进行单词分裂和路径展开，更安全。"
  },
  {
    "q": "文件测试 -f 的含义是？",
    "level": "基础",
    "options": [
      "文件存在且为目录",
      "文件存在且非空",
      "文件存在且可读",
      "文件存在且为普通文件"
    ],
    "answer": 3,
    "explain": "-f 测试文件存在且为普通文件(regular file)，-d测试目录，-e测试存在(任何类型)。"
  },
  {
    "q": "文件测试 -d 的含义是？",
    "level": "基础",
    "options": [
      "文件存在且为普通文件",
      "文件存在且为块设备",
      "文件存在且为目录",
      "文件存在且为链接"
    ],
    "answer": 2,
    "explain": "-d 测试路径存在且为目录(directory)。"
  },
  {
    "q": "字符串测试 -z str 的含义是？",
    "level": "基础",
    "options": [
      "字符串非空",
      "字符串是数字",
      "字符串长度大于0",
      "字符串为空"
    ],
    "answer": 3,
    "explain": "-z 测试字符串长度为零(空字符串)，-n 测试字符串长度非零。"
  },
  {
    "q": "字符串测试 -n str 的含义是？",
    "level": "基础",
    "options": [
      "字符串为空",
      "字符串为null",
      "字符串非空",
      "字符串为数字"
    ],
    "answer": 2,
    "explain": "-n 测试字符串长度非零(not zero)，即字符串非空。"
  },
  {
    "q": "在 [[ ]] 中比较两个字符串相等，正确写法是？",
    "level": "基础",
    "options": [
      "[[ $a = $b ]] 或 [[ $a == $b ]]",
      "[[ $a -eq $b ]]",
      "[[ $a equals $b ]]",
      "[[ $a ~= $b ]]"
    ],
    "answer": 0,
    "explain": "字符串相等用 = 或 == (在[[ ]]中两者等价)，数字相等才用 -eq。"
  },
  {
    "q": "数字比较 -eq 的含义是？",
    "level": "基础",
    "options": [
      "大于",
      "小于",
      "等于",
      "不等于"
    ],
    "answer": 2,
    "explain": "-eq (equal) 表示数字相等，用于整数比较，对应的有 -ne(不等)、-lt(小于)、-gt(大于)、-le、-ge。"
  },
  {
    "q": "数字比较 -ge 的含义是？",
    "level": "基础",
    "options": [
      "大于",
      "小于等于",
      "大于等于",
      "不等于"
    ],
    "answer": 2,
    "explain": "-ge (greater or equal) 表示大于或等于。"
  },
  {
    "q": "逻辑与运算符在 [ ] 中的正确用法是？",
    "level": "基础",
    "options": [
      "[ $a -gt 0 && $b -gt 0 ]",
      "[ $a -gt 0 & $b -gt 0 ]",
      "[ $a -gt 0 and $b -gt 0 ]",
      "[ $a -gt 0 -a $b -gt 0 ]"
    ],
    "answer": 3,
    "explain": "在 [ ] 中使用 -a 表示逻辑与，-o 表示逻辑或；&& 和 || 只能在 [[ ]] 或命令间使用。"
  },
  {
    "q": "命令间使用 && 表示什么含义？",
    "level": "基础",
    "options": [
      "两条命令都执行",
      "前一条命令失败时才执行后一条命令",
      "前一条命令成功时才执行后一条命令",
      "并行执行两条命令"
    ],
    "answer": 2,
    "explain": "cmd1 && cmd2 表示短路逻辑与，仅当 cmd1 成功(返回0)时才执行 cmd2。"
  },
  {
    "q": "命令间使用 || 表示什么含义？",
    "level": "基础",
    "options": [
      "两条命令都执行",
      "前一条成功时执行后一条",
      "前一条失败时才执行后一条命令",
      "按顺序执行"
    ],
    "answer": 2,
    "explain": "cmd1 || cmd2 表示短路逻辑或，仅当 cmd1 失败(返回非0)时才执行 cmd2。"
  },
  {
    "q": "case 语句的结束关键字是？",
    "level": "基础",
    "options": [
      "endcase",
      "done",
      "fi",
      "esac"
    ],
    "answer": 3,
    "explain": "case 语句以 esac 结束，是 case 的反转拼写；每个分支以 ;; 结束。"
  },
  {
    "q": "case 语句中匹配任意单个字符的通配符是？",
    "level": "基础",
    "options": [
      "*",
      "[]",
      "?",
      "."
    ],
    "answer": 2,
    "explain": "在 case 模式中，* 匹配任意字符串，? 匹配任意单个字符，[] 匹配括号内字符之一。"
  },
  {
    "q": "for 循环遍历列表的正确语法是？",
    "level": "基础",
    "options": [
      "for i in 1 2 3; do echo $i; done",
      "for (i=0;i<3;i++) { echo $i }",
      "foreach i in {1,2,3}",
      "for i = 1 to 3 do echo $i end"
    ],
    "answer": 0,
    "explain": "Shell for 循环语法为 for var in list; do commands; done，do和done界定循环体。"
  },
  {
    "q": "while 循环的结束关键字是？",
    "level": "基础",
    "options": [
      "endwhile",
      "wend",
      "done",
      "fi"
    ],
    "answer": 2,
    "explain": "while 和 for 循环都以 done 结束循环体。"
  },
  {
    "q": "until 循环与 while 循环的区别是？",
    "level": "基础",
    "options": [
      "两者完全相同",
      "while 当条件为假时执行",
      "until 只能执行一次",
      "until 当条件为假时执行循环，while 当条件为真时执行"
    ],
    "answer": 3,
    "explain": "while 在条件为真时循环，until 在条件为假时循环，两者逻辑相反。"
  },
  {
    "q": "在循环中立即跳出整个循环使用哪个命令？",
    "level": "基础",
    "options": [
      "exit",
      "continue",
      "break",
      "return"
    ],
    "answer": 2,
    "explain": "break 立即跳出当前循环，continue 跳过本次循环剩余部分进入下一次迭代，exit 退出整个脚本。"
  },
  {
    "q": "跳过当前循环迭代进入下一次迭代使用哪个命令？",
    "level": "基础",
    "options": [
      "break",
      "next",
      "skip",
      "continue"
    ],
    "answer": 3,
    "explain": "continue 跳过循环体剩余命令，直接进入下一次循环条件判断。"
  },
  {
    "q": "C风格 for 循环的正确语法是？",
    "level": "基础",
    "options": [
      "for ((i=0; i<5; i++)); do echo $i; done",
      "for (i=0;i<5;i++) do echo $i",
      "for i=0;i<5;i++ { echo $i }",
      "cfor i in 0..4 do echo $i done"
    ],
    "answer": 0,
    "explain": "bash 支持 C 风格 for 循环 for ((expr1; expr2; expr3)); do ...; done，注意双括号。"
  },
  {
    "q": "seq 1 5 输出什么？",
    "level": "基础",
    "options": [
      "1 到 5 的整数序列，每行一个",
      "数字 15",
      "1 5 两个数字",
      "5 4 3 2 1"
    ],
    "answer": 0,
    "explain": "seq 1 5 输出从1到5的整数序列(1 2 3 4 5)，默认每行一个，常配合 for 循环使用。"
  },
  {
    "q": "定义函数的关键字 function 的使用，下列正确的是？",
    "level": "基础",
    "options": [
      "function myfunc() { ... } 或 myfunc() { ... }",
      "def myfunc() { ... }",
      "function myfunc { } 和 myfunc() { } 都可以",
      "func myfunc { }"
    ],
    "answer": 2,
    "explain": "bash 支持两种函数定义：function name { ... } 和 name() { ... }，function 关键字可省略。"
  },
  {
    "q": "函数内访问第一个参数使用？",
    "level": "基础",
    "options": [
      "$0",
      "$function",
      "$1",
      "$arg1"
    ],
    "answer": 2,
    "explain": "函数内 $1 $2 等表示传入函数的参数，$0 仍是脚本名而非函数名。"
  },
  {
    "q": "函数中使用 return 的作用是？",
    "level": "基础",
    "options": [
      "返回字符串结果给调用者",
      "跳过循环",
      "退出整个脚本",
      "返回整数状态码(0-255)，并结束函数"
    ],
    "answer": 3,
    "explain": "return 只能返回0-255的整数状态码并结束函数，不能返回字符串；函数的标准输出通过命令替换捕获。"
  },
  {
    "q": "在函数内声明局部变量使用？",
    "level": "基础",
    "options": [
      "local var",
      "my var",
      "private var",
      "var local"
    ],
    "answer": 0,
    "explain": "local 关键字声明函数内局部变量，避免污染全局作用域，局部变量在函数结束时销毁。"
  },
  {
    "q": "定义普通数组 arr 包含 a b c 的正确写法是？",
    "level": "基础",
    "options": [
      "arr = (a b c)",
      "array[a,b,c]",
      "arr=(a b c)",
      "arr={a,b,c}"
    ],
    "answer": 2,
    "explain": "数组定义用 arr=(a b c)，元素用空格分隔，等号两边不能有空格。"
  },
  {
    "q": "读取数组 arr 的第一个元素，正确写法是？",
    "level": "基础",
    "options": [
      "$arr",
      "$arr[0]",
      "${arr[1]}",
      "${arr[0]}"
    ],
    "answer": 3,
    "explain": "${arr[0]} 读取数组第一个元素(索引从0开始)，需用花括号。"
  },
  {
    "q": "获取数组 arr 的元素个数，正确写法是？",
    "level": "基础",
    "options": [
      "${arr}",
      "${#arr}",
      "${#arr[@]}",
      "length(${arr})"
    ],
    "answer": 2,
    "explain": "${#arr[@]} 或 ${#arr[*]} 返回数组元素个数，与字符串长度语法 ${#str} 类似。"
  },
  {
    "q": "遍历数组 arr 所有元素的正确写法是？",
    "level": "基础",
    "options": [
      "for i in ${arr[@]}; do echo $i; done",
      "for i in arr; do echo $i; done",
      "foreach i in arr",
      "for i = arr do echo $i end"
    ],
    "answer": 0,
    "explain": "${arr[@]} 展开为所有元素，配合 for in 遍历；推荐加引号 '${arr[@]}' 以正确处理含空格元素。"
  },
  {
    "q": "声明关联数组(键值对)使用？",
    "level": "基础",
    "options": [
      "declare -A assoc",
      "declare -a assoc",
      "declare -i assoc",
      "array assoc"
    ],
    "answer": 0,
    "explain": "declare -A 声明关联数组(bash 4+)，使用字符串作为键；-a 声明普通索引数组。"
  },
  {
    "q": "将命令输出重定向到文件 file(覆盖)的正确写法是？",
    "level": "基础",
    "options": [
      "cmd > file",
      "cmd >> file",
      "cmd < file",
      "cmd 2> file"
    ],
    "answer": 0,
    "explain": "> 覆盖写入文件，>> 追加写入，< 是输入重定向，2> 是标准错误重定向。"
  },
  {
    "q": "将命令输出追加到文件 file 的正确写法是？",
    "level": "基础",
    "options": [
      "cmd > file",
      "cmd >+ file",
      "cmd >>> file",
      "cmd >> file"
    ],
    "answer": 3,
    "explain": ">> 追加到文件末尾，不会覆盖原有内容；> 会先清空文件再写入。"
  },
  {
    "q": "将标准错误重定向到文件(覆盖)的正确写法是？",
    "level": "基础",
    "options": [
      "cmd > file",
      "cmd &> file",
      "cmd 2> file",
      "cmd 2>> file"
    ],
    "answer": 2,
    "explain": "2> 将标准错误(文件描述符2)重定向到文件，覆盖模式；2>> 是追加模式。"
  },
  {
    "q": "将标准输出和标准错误都重定向到文件，下列哪种写法正确？",
    "level": "基础",
    "options": [
      "cmd &> file",
      "cmd 1> file",
      "cmd 2> file",
      "cmd > file 2> /dev/null"
    ],
    "answer": 0,
    "explain": "&> (bash扩展) 将stdout和stderr都重定向到同一文件；也可写 cmd > file 2>&1。"
  },
  {
    "q": "here document 的语法格式是？",
    "level": "基础",
    "options": [
      "cmd << EOF ... EOF",
      "cmd >> EOF ... EOF",
      "cmd < EOF ... EOF",
      "cmd <<< EOF ... EOF"
    ],
    "answer": 0,
    "explain": "<< 标记 here document 开始，后跟分隔符(如EOF)，直到再次出现单独的分隔符行结束，内容作为标准输入传递。"
  },
  {
    "q": "here string 的语法是？",
    "level": "基础",
    "options": [
      "cmd << str",
      "cmd <<EOF str",
      "cmd < str",
      "cmd <<< str"
    ],
    "answer": 3,
    "explain": "<<< 将右侧字符串作为标准输入传递给命令，如 grep pattern <<< \"$str\"，是单行版本的here document。"
  },
  {
    "q": "管道符 | 的作用是？",
    "level": "基础",
    "options": [
      "将前一个命令的标准输出作为后一个命令的标准输入",
      "将两个命令并行执行",
      "将前一个命令的输出保存到文件",
      "逻辑或运算"
    ],
    "answer": 0,
    "explain": "管道将左侧命令的标准输出连接到右侧命令的标准输入，实现命令间的数据流传递。"
  },
  {
    "q": "命令替换 $(cmd) 的作用是？",
    "level": "基础",
    "options": [
      "执行cmd并将错误输出捕获",
      "并行执行cmd",
      "执行cmd并将其标准输出替换到当前位置",
      "将cmd作为后台进程"
    ],
    "answer": 2,
    "explain": "$(cmd) 或反引号 `cmd` 执行命令并将其标准输出结果插入到当前命令行中。"
  },
  {
    "q": "命令替换 $() 与反引号 `` 相比的优势是？",
    "level": "基础",
    "options": [
      "没有区别",
      "$() 只能用于数字",
      "反引号功能更强",
      "$() 支持嵌套且更易读，反引号嵌套需转义"
    ],
    "answer": 3,
    "explain": "$() 可读性更好且支持嵌套(如 $(cmd1 $(cmd2)))，反引号嵌套需用反斜杠转义，易出错。"
  },
  {
    "q": "算术扩展 $((expr)) 的作用是？",
    "level": "基础",
    "options": [
      "执行命令expr",
      "计算算术表达式并替换结果",
      "声明变量expr",
      "字符串拼接"
    ],
    "answer": 0,
    "explain": "$((expr)) 计算整数算术表达式并将结果替换到当前位置，如 $((2+3)) 结果为5。"
  },
  {
    "q": "let 命令的作用是？",
    "level": "基础",
    "options": [
      "执行循环",
      "声明函数",
      "进行整数算术运算并赋值给变量",
      "读取输入"
    ],
    "answer": 2,
    "explain": "let 用于整数算术运算，如 let i=i+1 或 let 'a=5*3'，不需 $ 前缀引用变量。"
  },
  {
    "q": "expr 命令 3 + 4 的输出是？",
    "level": "基础",
    "options": [
      "7",
      "3+4",
      "报错，需要空格分隔",
      "34"
    ],
    "answer": 0,
    "explain": "expr 3 + 4 输出7，注意运算符和操作数之间必须有空格分隔，否则作为字符串处理。"
  },
  {
    "q": "bc 命令主要用于？",
    "level": "基础",
    "options": [
      "整数运算",
      "文件压缩",
      "字符串处理",
      "浮点数和高精度计算"
    ],
    "answer": 3,
    "explain": "bc 是任意精度计算器，支持浮点运算，弥补 bash 算术只支持整数的不足，如 echo 'scale=2; 10/3' | bc 得到 3.33。"
  },
  {
    "q": "read 命令的作用是？",
    "level": "基础",
    "options": [
      "读取文件内容到变量",
      "执行循环",
      "从标准输入读取一行并赋值给变量",
      "声明数组"
    ],
    "answer": 2,
    "explain": "read 从标准输入读取一行，按IFS分割后赋值给指定变量，如 read name 读取输入到变量name。"
  },
  {
    "q": "echo -n 选项的作用是？",
    "level": "基础",
    "options": [
      "输出换行符",
      "输出错误信息",
      "输出数字n",
      "输出后不换行"
    ],
    "answer": 3,
    "explain": "-n 选项使 echo 输出后不追加换行符，常用于同一行提示输入。"
  },
  {
    "q": "echo -e 选项的作用是？",
    "level": "基础",
    "options": [
      "启用转义字符解释",
      "输出到标准错误",
      "执行命令",
      "加密输出"
    ],
    "answer": 0,
    "explain": "-e 启用反斜杠转义字符解释，如 \\n 换行、\\t 制表符；不加 -e 则原样输出。"
  },
  {
    "q": "printf 相比 echo 的优势是？",
    "level": "基础",
    "options": [
      "printf 自动换行",
      "printf 只能输出数字",
      "printf 支持格式化输出且行为跨平台一致",
      "printf 不需要参数"
    ],
    "answer": 2,
    "explain": "printf 支持 C 风格格式化输出(%s %d %f等)，不自动换行，且行为在不同实现间更一致。"
  },
  {
    "q": "Shell 脚本中的注释符号是？",
    "level": "基础",
    "options": [
      "//",
      "/* */",
      "--",
      "#"
    ],
    "answer": 3,
    "explain": "# 开头的行(或行中#之后内容)为注释，解释器会忽略；注意 shebang 行 #! 是特例。"
  },
  {
    "q": "特殊变量 $! 表示什么？",
    "level": "基础",
    "options": [
      "当前shell的PID",
      "脚本名",
      "最近一个后台运行进程的PID",
      "参数个数"
    ],
    "answer": 2,
    "explain": "$! 保存最近放入后台运行的进程的PID，可用于后续 wait 或 kill 该进程。"
  },
  {
    "q": "通配符 * 在Shell中的含义是？",
    "level": "基础",
    "options": [
      "匹配任意单个字符",
      "表示乘法运算",
      "匹配0或1个字符",
      "匹配任意数量的任意字符(包括空)"
    ],
    "answer": 3,
    "explain": "* 匹配任意长度的任意字符(包括空字符串)，如 *.txt 匹配所有txt文件。"
  },
  {
    "q": "通配符 ? 在Shell中的含义是？",
    "level": "基础",
    "options": [
      "匹配任意数量的字符",
      "表示条件判断",
      "匹配任意单个字符",
      "表示可选参数"
    ],
    "answer": 2,
    "explain": "? 匹配任意单个字符，如 file?.txt 匹配 file1.txt 但不匹配 file12.txt。"
  },
  {
    "q": "通配符 [abc] 的含义是？",
    "level": "基础",
    "options": [
      "匹配字符串 abc",
      "表示数组",
      "匹配除abc外的字符",
      "匹配 a、b、c 中任意一个字符"
    ],
    "answer": 3,
    "explain": "[abc] 匹配方括号内列出的任意单个字符，[a-z] 匹配范围内的字符，[!abc] 或 [^abc] 匹配不在列表中的字符。"
  },
  {
    "q": "单引号 ' ' 内的内容会如何处理？",
    "level": "基础",
    "options": [
      "变量和命令会被展开",
      "仅展开变量",
      "原样输出，不进行任何展开或转义",
      "仅执行命令替换"
    ],
    "answer": 2,
    "explain": "单引号内所有字符原样保留，变量($)、命令替换($)、转义(\\)均不生效，是最强引用。"
  },
  {
    "q": "双引号 \" \" 内的内容会如何处理？",
    "level": "基础",
    "options": [
      "所有内容原样输出",
      "仅转义字符生效",
      "仅命令替换生效",
      "变量、命令替换、转义字符会被展开，其余原样保留"
    ],
    "answer": 3,
    "explain": "双引号内会展开变量($)、命令替换($()和``)和部分转义字符，但通配符不展开，是部分引用。"
  },
  {
    "q": "反引号 ` ` 的作用是？",
    "level": "基础",
    "options": [
      "原样输出内容",
      "声明变量",
      "命令替换，执行其中的命令并返回输出",
      "注释"
    ],
    "answer": 2,
    "explain": "反引号是旧式命令替换语法，等价于 $()，执行其中的命令并将输出插入当前位置。"
  },
  {
    "q": "type 命令的作用是？",
    "level": "基础",
    "options": [
      "显示文件类型",
      "格式化输出",
      "显示变量类型",
      "显示命令的类型(别名/函数/内置/外部文件)"
    ],
    "answer": 3,
    "explain": "type 显示命令会如何被解释：是内置命令、别名、函数还是外部可执行文件。"
  },
  {
    "q": "command 命令的作用是？",
    "level": "基础",
    "options": [
      "创建新命令",
      "执行系统命令",
      "禁用别名和函数查找，直接执行外部命令或内置命令",
      "定义别名"
    ],
    "answer": 2,
    "explain": "command name 执行命令时忽略别名和函数，直接查找内置命令或外部命令，常用于避免别名干扰。"
  },
  {
    "q": "alias 命令的作用是？",
    "level": "基础",
    "options": [
      "删除文件",
      "显示文件属性",
      "设置环境变量",
      "为命令定义别名(快捷方式)"
    ],
    "answer": 3,
    "explain": "alias name='value' 定义命令别名，如 alias ll='ls -la'，别名仅在当前shell有效，持久化需写入配置文件。"
  },
  {
    "q": "history 命令的作用是？",
    "level": "基础",
    "options": [
      "查看系统日志",
      "查看文件修改时间",
      "查看当前用户执行过的命令历史",
      "查看进程历史"
    ],
    "answer": 2,
    "explain": "history 显示命令历史列表，可用 !n 执行第n条历史命令，!! 执行上一条命令。"
  },
  {
    "q": "source 命令(或 . )执行脚本的特点是？",
    "level": "基础",
    "options": [
      "在子shell中执行脚本",
      "删除脚本",
      "只执行脚本第一行",
      "在当前shell环境中执行脚本，脚本中的变量和函数在当前shell生效"
    ],
    "answer": 3,
    "explain": "source file 或 . file 在当前shell中执行脚本，不创建子进程，脚本中定义的变量、函数会保留在当前shell中。"
  },
  {
    "q": "直接用 bash script.sh 和 source script.sh 的主要区别是？",
    "level": "基础",
    "options": [
      "没有区别",
      "bash 只能执行一行",
      "bash 创建子shell执行，脚本中变量不影响当前shell；source 在当前shell执行",
      "source 速度更快"
    ],
    "answer": 2,
    "explain": "bash script.sh 启动子shell执行，变量函数不回传当前环境；source 在当前shell执行，定义会保留。"
  },
  {
    "q": "使脚本可执行需要使用的命令是？",
    "level": "基础",
    "options": [
      "chmod +x script.sh",
      "chmod 777 script.sh",
      "exec script.sh",
      "run script.sh"
    ],
    "answer": 0,
    "explain": "chmod +x script.sh 为脚本添加可执行权限，之后可直接用 ./script.sh 运行。"
  },
  {
    "q": "变量赋值时等号两边加空格(如 x = 5)会发生什么？",
    "level": "基础",
    "options": [
      "正常赋值",
      "创建环境变量",
      "变量变为空",
      "报错或被当作命令 x 带参数 = 和 5 执行"
    ],
    "answer": 3,
    "explain": "Shell 变量赋值等号两边不能有空格，x = 5 会被解析为执行命令 x 并传入参数 = 和 5。"
  },
  {
    "q": "环境变量 PATH 的作用是？",
    "level": "基础",
    "options": [
      "存储当前目录",
      "存储用户密码",
      "定义命令搜索路径，shell执行命令时按此路径查找可执行文件",
      "定义文件权限"
    ],
    "answer": 2,
    "explain": "PATH 是冒号分隔的目录列表，shell执行命令时按PATH顺序查找可执行文件，找到第一个匹配即执行。"
  },
  {
    "q": "read -p 'prompt' var 中 -p 选项的作用是？",
    "level": "基础",
    "options": [
      "设置密码模式",
      "暂停执行",
      "读取多个变量",
      "显示提示字符串后再读取输入"
    ],
    "answer": 3,
    "explain": "-p prompt 在读取输入前显示提示字符串，常用于交互式输入，如 read -p 'Enter name: ' name。"
  },
  {
    "q": "read -a arr 的作用是？",
    "level": "基础",
    "options": [
      "读取一行存入数组",
      "追加读取",
      "读取所有行",
      "读取数字"
    ],
    "answer": 0,
    "explain": "-a 将读取的一行按IFS分割后存入数组，如 read -a nums 输入 1 2 3 后 nums=(1 2 3)。"
  },
  {
    "q": "exit 命令的作用是？",
    "level": "基础",
    "options": [
      "退出当前循环",
      "暂停脚本",
      "退出整个脚本并返回指定状态码",
      "跳过本次循环"
    ],
    "answer": 2,
    "explain": "exit [n] 立即终止脚本执行并返回状态码n，n省略时返回上一条命令的退出码。"
  },
  {
    "q": "脚本正常退出应返回的状态码是？",
    "level": "基础",
    "options": [
      "1",
      "255",
      "-1",
      "0"
    ],
    "answer": 3,
    "explain": "按照惯例，返回0表示成功，非0表示不同类型的错误，便于其他脚本或工具判断执行结果。"
  },
  {
    "q": "在 [[ ]] 中使用通配符模式匹配，正确的写法是？",
    "level": "基础",
    "options": [
      "[[ $str == hello* ]]",
      "[[ $str = ~hello ]]",
      "[[ $str match hello* ]]",
      "[[ $str ~= hello ]]"
    ],
    "answer": 0,
    "explain": "在 [[ ]] 中右侧不加引号时，== 或 = 启用模式匹配，hello* 匹配以hello开头的字符串。"
  },
  {
    "q": "while read line 循环逐行读取文件的标准写法是？",
    "level": "基础",
    "options": [
      "cat file | while read line; do ...; done",
      "while read line < file; do ...; done",
      "while read line; do ...; done < file",
      "for line in file; do ...; done"
    ],
    "answer": 2,
    "explain": "while read line; do ...; done < file 通过输入重定向逐行读取文件，每行存入line变量。"
  },
  {
    "q": "case 语句中分支结束符是？",
    "level": "基础",
    "options": [
      ":",
      "&",
      "|",
      ";;"
    ],
    "answer": 3,
    "explain": "case 中每个模式分支以 ;; 结束，;; 表示匹配并执行该分支后跳出整个case结构。"
  },
  {
    "q": "if [ -r file ]; then ... 中 -r 测试什么？",
    "level": "基础",
    "options": [
      "文件存在",
      "文件是只读的",
      "文件存在且当前用户可读",
      "文件是常规文件"
    ],
    "answer": 2,
    "explain": "-r 测试文件存在且当前用户对其有读权限，-w 测试写权限，-x 测试执行权限。"
  },
  {
    "q": "在 (( )) 中进行数字比较，正确的运算符是？",
    "level": "基础",
    "options": [
      "(( a > b ))",
      "(( a -gt b ))",
      "(( a greater b ))",
      "(( a gt b ))"
    ],
    "answer": 0,
    "explain": "在 (( )) 算术上下文中使用 C 风格运算符 > < >= <= == !=，而非 -gt -lt 等。"
  },
  {
    "q": "echo ${str:-default} 的作用是？",
    "level": "基础",
    "options": [
      "如果str为空则使用default值，但不赋值给str",
      "删除str中的default",
      "将str设为default",
      "报错"
    ],
    "answer": 0,
    "explain": "${str:-default} 当str未设置或为空时，展开为default值，但str本身不变；:= 会同时赋值给str。"
  },
  {
    "q": "声明只读变量使用？",
    "level": "基础",
    "options": [
      "readonly var 或 declare -r var",
      "const var",
      "final var",
      "static var"
    ],
    "answer": 0,
    "explain": "readonly 或 declare -r 声明只读变量，赋值后不可修改，尝试修改会报错。"
  },
  {
    "q": "向数组追加元素 arr=(a b)，使其变为(a b c)的正确写法是？",
    "level": "基础",
    "options": [
      "arr+=c",
      "arr.add(c)",
      "arr[2]=c",
      "arr+=(c)"
    ],
    "answer": 3,
    "explain": "arr+=(c) 向数组末尾追加元素c，+= 配合数组用于追加而非字符串拼接。"
  },
  {
    "q": "for i in {1..5}; do echo $i; done 输出什么？",
    "level": "基础",
    "options": [
      "1 2 3 4 5",
      "{1..5}",
      "1..5",
      "5 4 3 2 1"
    ],
    "answer": 0,
    "explain": "{1..5} 是bash的序列展开，生成1到5的序列，配合for循环输出1 2 3 4 5。"
  },
  {
    "q": "printf '%-10s|' 'hi' 的输出特点？",
    "level": "基础",
    "options": [
      "左对齐宽度10，后跟|",
      "右对齐宽度10",
      "居中对齐",
      "输出hi|无格式"
    ],
    "answer": 0,
    "explain": "%-10s 中 - 表示左对齐，10表示最小宽度10，不足右侧补空格，再输出|。"
  },
  {
    "q": "test 命令 [ -e file ] 中 -e 的含义是？",
    "level": "基础",
    "options": [
      "文件存在(任何类型)",
      "文件为空",
      "文件可执行",
      "文件是目录"
    ],
    "answer": 0,
    "explain": "-e 测试文件存在(不区分类型)，-f 测试普通文件，-d 测试目录，-e 最宽泛。"
  },
  {
    "q": "将命令的退出状态取反，正确的写法是？",
    "level": "基础",
    "options": [
      "! cmd",
      "cmd !",
      "not cmd",
      "~cmd"
    ],
    "answer": 0,
    "explain": "! cmd 或 ! [ condition ] 对命令退出状态取反，成功变失败，失败变成功，注意!后有空格。"
  },
  {
    "q": "declare -i n=5 中 -i 的作用是？",
    "level": "基础",
    "options": [
      "声明整数变量，赋值时自动进行算术运算",
      "声明索引数组",
      "声明交互式变量",
      "声明忽略变量"
    ],
    "answer": 0,
    "explain": "declare -i 声明整数属性变量，赋值时会自动进行算术运算，如 n=2+3 后 n 为5。"
  },
  {
    "q": "下列哪个不是 Shell 的内置命令？",
    "level": "基础",
    "options": [
      "echo",
      "cd",
      "pwd",
      "grep"
    ],
    "answer": 3,
    "explain": "grep 是外部命令(/usr/bin/grep)，而 echo、cd、pwd 是shell内置命令，执行无需查找PATH。"
  },
  {
    "q": "在脚本中获取当前日期时间，正确的命令是？",
    "level": "基础",
    "options": [
      "date",
      "time",
      "now",
      "datetime"
    ],
    "answer": 0,
    "explain": "date 命令显示或格式化当前日期时间，如 date '+%Y-%m-%d %H:%M:%S'。"
  },
  {
    "q": "命令 cmd1 | cmd2 | cmd3 中管道的执行方式是？",
    "level": "基础",
    "options": [
      "串行依次执行，前一个完成后再执行下一个",
      "只执行cmd1",
      "三个命令同时启动，通过管道连接数据流",
      "随机执行一个"
    ],
    "answer": 2,
    "explain": "管道中的命令同时启动运行，通过管道缓冲区连接数据流，生产者产出数据供消费者读取。"
  },
  {
    "q": "unset var 的作用是？",
    "level": "基础",
    "options": [
      "清空变量值但保留变量",
      "导出变量",
      "设置变量为只读",
      "删除变量，使其不再存在"
    ],
    "answer": 3,
    "explain": "unset 删除变量(包括数组元素)，变量不再存在；与赋空值 var= 不同，后者变量仍存在但值为空。"
  },
  {
    "q": "grep -E 选项的作用是？",
    "level": "进阶",
    "options": [
      "扩展正则表达式",
      "基本正则表达式",
      "仅匹配整行",
      "忽略大小写"
    ],
    "answer": 0,
    "explain": "grep -E (或 egrep) 启用扩展正则(ERE)，支持 + ? | () {} 而无需转义；默认grep使用基本正则(BRE)。"
  },
  {
    "q": "grep -v 选项的作用是？",
    "level": "进阶",
    "options": [
      "显示行号",
      "递归搜索",
      "反向匹配，输出不包含模式的行",
      "只输出匹配部分"
    ],
    "answer": 2,
    "explain": "-v 反转匹配，输出不匹配模式的行，常用于过滤排除特定内容。"
  },
  {
    "q": "grep -o 选项的作用是？",
    "level": "进阶",
    "options": [
      "只输出文件名",
      "输出匹配次数",
      "忽略大小写",
      "只输出匹配的部分而非整行"
    ],
    "answer": 3,
    "explain": "-o (only-matching) 只输出匹配模式的部分而非整行，一行可有多个匹配分别输出。"
  },
  {
    "q": "grep -c 选项的作用是？",
    "level": "进阶",
    "options": [
      "显示匹配行数",
      "递归搜索子目录",
      "显示上下文",
      "只输出匹配部分"
    ],
    "answer": 0,
    "explain": "-c (count) 输出匹配的行数，而非匹配内容本身。"
  },
  {
    "q": "sed 命令中 s/pattern/replacement/g 的 g 标志含义是？",
    "level": "进阶",
    "options": [
      "全局替换每行所有匹配，而非仅第一个",
      "忽略大小写",
      "仅替换第一个匹配",
      "删除匹配行"
    ],
    "answer": 0,
    "explain": "g (global) 标志替换一行中所有匹配项，不加g只替换每行第一个匹配。"
  },
  {
    "q": "sed -n '2p' file 的作用是？",
    "level": "进阶",
    "options": [
      "删除第2行",
      "打印除第2行外的所有行",
      "只打印第2行",
      "替换第2行"
    ],
    "answer": 2,
    "explain": "-n 抑制自动输出，'2p' 显式打印第2行，组合后只输出第2行内容。"
  },
  {
    "q": "sed 中删除第3到5行的命令是？",
    "level": "进阶",
    "options": [
      "sed '3,5p' file",
      "sed 'd 3,5' file",
      "sed '3-5d' file",
      "sed '3,5d' file"
    ],
    "answer": 3,
    "explain": "sed '3,5d' 删除第3到5行(含)，d 表示删除模式空间并进入下一循环。"
  },
  {
    "q": "sed 在匹配行后追加新行文本，使用的命令是？",
    "level": "进阶",
    "options": [
      "a (append)",
      "i (insert)",
      "c (change)",
      "p (print)"
    ],
    "answer": 0,
    "explain": "a\\ text 在匹配行之后追加文本，i 在之前插入，c 替换整行，p 打印。"
  },
  {
    "q": "awk 中 NR 变量的含义是？",
    "level": "进阶",
    "options": [
      "当前行的字段数",
      "字段分隔符",
      "当前行号(记录号)",
      "当前字段内容"
    ],
    "answer": 2,
    "explain": "NR (Number of Records) 表示当前处理的行号，从1递增；NF 是当前行的字段数。"
  },
  {
    "q": "awk 中 NF 变量的含义是？",
    "level": "进阶",
    "options": [
      "当前行号",
      "文件名",
      "记录总数",
      "当前行的字段数"
    ],
    "answer": 3,
    "explain": "NF (Number of Fields) 表示当前行的字段(列)数，$NF 表示最后一个字段的值。"
  },
  {
    "q": "awk 中 $0 和 $1 分别表示？",
    "level": "进阶",
    "options": [
      "$0是第一个字段，$1是整行",
      "$0是行号，$1是字段数",
      "$0是整行内容，$1是第一个字段",
      "$0是文件名，$1是第一行"
    ],
    "answer": 2,
    "explain": "$0 表示当前整行内容，$1 $2 ... 表示第1、2个字段(按分隔符分割)。"
  },
  {
    "q": "awk -F: 的作用是？",
    "level": "进阶",
    "options": [
      "设置字段分隔符为冒号",
      "设置记录分隔符为冒号",
      "过滤包含冒号的行",
      "输出冒号分隔"
    ],
    "answer": 0,
    "explain": "-F: 设置字段分隔符(FS)为冒号，常用于处理 /etc/passwd 等冒号分隔文件；也可用 -F'[ :]' 多分隔符。"
  },
  {
    "q": "awk 中 BEGIN 块的作用是？",
    "level": "进阶",
    "options": [
      "每行处理前都执行",
      "匹配特定行时执行",
      "处理完所有行后执行",
      "在处理任何输入前执行一次，常用于初始化"
    ],
    "answer": 3,
    "explain": "BEGIN 块在读取输入前执行一次，用于初始化变量、设置FS、输出表头等。"
  },
  {
    "q": "awk 中 END 块的作用是？",
    "level": "进阶",
    "options": [
      "每行处理后执行",
      "开始处理前执行",
      "处理完所有输入行后执行一次，常用于汇总输出",
      "匹配失败时执行"
    ],
    "answer": 2,
    "explain": "END 块在所有输入处理完成后执行一次，常用于输出统计汇总，如求和、计数结果。"
  },
  {
    "q": "awk 的基本语法结构是？",
    "level": "进阶",
    "options": [
      "pattern { action }",
      "if-then-else",
      "for-loop",
      "select-case"
    ],
    "answer": 0,
    "explain": "awk 程序由 pattern { action } 组成，匹配pattern的行执行action；pattern或action可省略其一。"
  },
  {
    "q": "正则表达式 d 在grep基本正则中匹配什么？",
    "level": "进阶",
    "options": [
      "匹配数字，grep直接支持",
      "匹配任意字符",
      "匹配字母d",
      "grep基本正则不支持\\d，需用 [0-9] 或 [[:digit:]]"
    ],
    "answer": 3,
    "explain": "grep的BRE/ERE不支持Perl风格\\d，匹配数字用 [0-9] 或 POSIX字符类 [[:digit:]]，-P选项才支持\\d。"
  },
  {
    "q": "POSIX字符类 [[:space:]] 匹配什么？",
    "level": "进阶",
    "options": [
      "仅空格",
      "仅制表符",
      "所有空白字符(空格、制表符、换行等)",
      "仅换行符"
    ],
    "answer": 2,
    "explain": "[[:space:]] 匹配所有空白字符，包括空格、制表符、换行符、回车等，等价于 [ \\t\\n\\r\\f\\v]。"
  },
  {
    "q": "扩展正则(ERE)中 + 的含义是？",
    "level": "进阶",
    "options": [
      "匹配0或1次",
      "匹配恰好1次",
      "匹配0或多次",
      "匹配1次或多次(前一个元素)"
    ],
    "answer": 3,
    "explain": "+ 匹配前一个元素1次或多次(至少1次)，区别于 * 的0次或多次；ERE中无需转义。"
  },
  {
    "q": "扩展正则(ERE)中 ? 的含义是？",
    "level": "进阶",
    "options": [
      "匹配1次或多次",
      "匹配任意字符",
      "匹配0次或1次(可选)",
      "表示非贪婪"
    ],
    "answer": 2,
    "explain": "? 匹配前一个元素0次或1次，表示该元素可选。"
  },
  {
    "q": "正则表达式 ^ 和 $ 分别匹配什么？",
    "level": "进阶",
    "options": [
      "^匹配行尾，$匹配行首",
      "都匹配行尾",
      "都匹配行首",
      "^匹配行首，$匹配行尾"
    ],
    "answer": 3,
    "explain": "^ 锚定行首(或字符串开头)，$ 锚定行尾(或字符串结尾)，如 ^Error 匹配以Error开头的行。"
  },
  {
    "q": "正则中的反向引用 \\1 的作用是？",
    "level": "进阶",
    "options": [
      "匹配数字1",
      "表示开始",
      "引用第1个捕获分组匹配的内容，用于匹配重复文本",
      "表示转义"
    ],
    "answer": 2,
    "explain": "\\1 引用第1个括号捕获分组匹配到的文本，如 (ab)\\1 匹配 abab，常用于匹配成对重复内容。"
  },
  {
    "q": "find 命令中 -name 选项的匹配方式是？",
    "level": "进阶",
    "options": [
      "使用正则表达式",
      "忽略大小写匹配",
      "精确匹配",
      "使用shell通配符模式(* ? [])"
    ],
    "answer": 3,
    "explain": "-name 使用shell通配符(glob)匹配文件名，如 -name '*.txt'；正则匹配需用 -regex。"
  },
  {
    "q": "find . -type f -name '*.log' 的作用是？",
    "level": "进阶",
    "options": [
      "查找当前目录及子目录下所有.log普通文件",
      "删除所有.log文件",
      "查找并显示.log文件内容",
      "查找目录名为.log"
    ],
    "answer": 0,
    "explain": "-type f 限定普通文件，-name '*.log' 匹配log文件，递归查找当前目录(.)下所有匹配文件。"
  },
  {
    "q": "find 中 -mtime -7 的含义是？",
    "level": "进阶",
    "options": [
      "修改时间恰好7天前",
      "修改时间超过7天",
      "修改时间在7天以内(少于7天)",
      "未来7天修改"
    ],
    "answer": 2,
    "explain": "-mtime -7 表示修改时间在7天以内，+7表示超过7天，7(无符号)表示恰好7天前那天。"
  },
  {
    "q": "find -exec cmd {} \\; 中 {} 的作用是？",
    "level": "进阶",
    "options": [
      "表示当前目录",
      "表示执行结果",
      "表示空命令",
      "占位符，替换为找到的每个文件路径"
    ],
    "answer": 3,
    "explain": "{} 是占位符，被替换为find找到的每个文件路径，\\; 结束-exec命令；也可用 + 批量传递。"
  },
  {
    "q": "find -exec 与 xargs 配合的主要区别是？",
    "level": "进阶",
    "options": [
      "完全相同",
      "xargs只能处理一个文件",
      "-exec对每个文件执行一次命令；xargs将多个文件作为参数批量传递，效率更高",
      "-exec速度更快"
    ],
    "answer": 2,
    "explain": "-exec对每个匹配文件单独执行命令(参数少时方便)；xargs将多个文件合并为少量命令调用，减少进程创建开销，处理大量文件更高效。"
  },
  {
    "q": "find 中组合多个条件使用 -a (与) 和 -o (或)，默认运算顺序是？",
    "level": "进阶",
    "options": [
      "从左到右，-a优先于-o",
      "-o优先于-a",
      "从右到左",
      "无优先级，需括号"
    ],
    "answer": 0,
    "explain": "find中 -a (and) 优先级高于 -o (or)，类似数学中乘法优先于加法；建议用 \\( \\) 显式分组避免歧义。"
  },
  {
    "q": "xargs -I {} 的作用是？",
    "level": "进阶",
    "options": [
      "忽略错误",
      "并行执行",
      "限制输入行数",
      "指定替换字符串{}，可将输入插入命令任意位置"
    ],
    "answer": 3,
    "explain": "-I {} 定义替换字符串，xargs将每行输入替换到命令中{}位置，可灵活构造命令，如 xargs -I{} cp {} /dest。"
  },
  {
    "q": "xargs -n 2 的作用是？",
    "level": "进阶",
    "options": [
      "每次传递2个参数给命令",
      "只处理前2行输入",
      "并行2个进程",
      "超时2秒"
    ],
    "answer": 0,
    "explain": "-n 2 每次从输入取2个参数传给命令，用于控制单次命令调用的参数数量。"
  },
  {
    "q": "xargs -P 4 的作用是？",
    "level": "进阶",
    "options": [
      "传递4个参数",
      "暂停4秒",
      "并行运行4个进程同时执行命令",
      "输出4次"
    ],
    "answer": 2,
    "explain": "-P 4 允许同时并行运行最多4个命令进程，用于并行加速处理，适合独立任务。"
  },
  {
    "q": "sort 命令默认按什么排序？",
    "level": "进阶",
    "options": [
      "数字大小排序",
      "按行长度",
      "按文件修改时间",
      "字典序(ASCII)排序，大写在小写前"
    ],
    "answer": 3,
    "explain": "sort 默认按字典序(ASCII值)排序，大写字母排在小写前；数字排序需 -n，逆序用 -r。"
  },
  {
    "q": "sort -n 的作用是？",
    "level": "进阶",
    "options": [
      "按数值大小排序",
      "按行逆序",
      "去除重复",
      "按自然顺序"
    ],
    "answer": 0,
    "explain": "-n 按数值大小排序，正确处理 2 < 10(字典序会误判10在2前)；-r 逆序。"
  },
  {
    "q": "uniq 命令的作用是？",
    "level": "进阶",
    "options": [
      "去除相邻的重复行，需先sort才能去重全部",
      "对行排序",
      "删除所有空行",
      "统计行数"
    ],
    "answer": 0,
    "explain": "uniq 只去除相邻的重复行，因此通常先 sort 排序再 uniq，即 sort file | uniq，才能去除所有重复行。"
  },
  {
    "q": "uniq -c 的作用是？",
    "level": "进阶",
    "options": [
      "压缩行",
      "删除重复行",
      "统计每行重复出现的次数并显示",
      "按计数排序"
    ],
    "answer": 2,
    "explain": "-c 在每行前显示该行重复出现的次数，常配合 sort 统计词频：sort | uniq -c | sort -rn。"
  },
  {
    "q": "cut -d: -f1 /etc/passwd 的作用是？",
    "level": "进阶",
    "options": [
      "删除第一个字段",
      "统计字段数",
      "以冒号分隔，删除第1个字段",
      "以冒号分隔，提取第1个字段"
    ],
    "answer": 3,
    "explain": "-d: 设置分隔符为冒号，-f1 提取第1个字段，常用于提取用户名等。"
  },
  {
    "q": "tr 命令 tr 'a-z' 'A-Z' 的作用是？",
    "level": "进阶",
    "options": [
      "将小写字母转换为大写字母",
      "删除小写字母",
      "统计字母数",
      "反转大小写"
    ],
    "answer": 0,
    "explain": "tr 'a-z' 'A-Z' 将输入中的小写字母逐一对应转换为大写字母，tr用于字符替换或删除。"
  },
  {
    "q": "tr -d ' ' 的作用是？",
    "level": "进阶",
    "options": [
      "将空格替换为制表符",
      "删除空行",
      "删除所有空格",
      "统计空格数"
    ],
    "answer": 2,
    "explain": "-d 选项删除指定字符集合，tr -d ' ' 删除所有空格字符。"
  },
  {
    "q": "tee 命令的作用是？",
    "level": "进阶",
    "options": [
      "将输入同时输出到屏幕和文件",
      "去除重复行",
      "排序文件",
      "合并两个文件"
    ],
    "answer": 3,
    "explain": "tee 读取标准输入并同时写入标准输出和指定文件，实现数据流分流，如 cmd | tee log.txt 既显示又保存。"
  },
  {
    "q": "wc -l file 的作用是？",
    "level": "进阶",
    "options": [
      "统计文件行数",
      "统计字节数",
      "统计单词数",
      "显示文件名"
    ],
    "answer": 0,
    "explain": "wc -l 统计行数，-w 统计单词数，-c 统计字节数，-m 统计字符数。"
  },
  {
    "q": "diff file1 file2 的作用是？",
    "level": "进阶",
    "options": [
      "逐行比较两个文件差异",
      "合并两个文件",
      "拼接文件",
      "统计两文件相同行"
    ],
    "answer": 0,
    "explain": "diff 逐行比较两个文件并输出差异，常用于版本对比；-u 输出统一格式。"
  },
  {
    "q": "command & 将命令放入后台运行，如何将其调回前台？",
    "level": "进阶",
    "options": [
      "bg",
      "jobs",
      "fg",
      "wait"
    ],
    "answer": 2,
    "explain": "fg 将最近的后台作业(或指定作业号)调回前台运行，bg使暂停的作业在后台继续，jobs列出作业。"
  },
  {
    "q": "Ctrl+Z 在终端中的作用是？",
    "level": "进阶",
    "options": [
      "终止当前进程",
      "关闭终端",
      "复制粘贴",
      "将当前前台进程暂停(挂起)并放入后台"
    ],
    "answer": 3,
    "explain": "Ctrl+Z 发送SIGTSTP信号暂停前台进程并放入后台，可用fg恢复前台或bg转后台继续运行；Ctrl+C发SIGINT终止。"
  },
  {
    "q": "jobs 命令的作用是？",
    "level": "进阶",
    "options": [
      "查看系统所有进程",
      "查看当前shell的后台作业列表",
      "查看磁盘使用",
      "查看网络连接"
    ],
    "answer": 1,
    "explain": "jobs 列出当前shell会话中的后台作业及状态(运行/停止)，显示作业号，配合fg/bg使用。"
  },
  {
    "q": "kill -9 PID 中的信号9是？",
    "level": "进阶",
    "options": [
      "SIGTERM",
      "SIGKILL，强制终止进程且不可被捕获或忽略",
      "SIGHUP",
      "SIGINT"
    ],
    "answer": 1,
    "explain": "9 对应 SIGKILL，立即强制终止进程，内核直接处理，进程无法捕获或忽略；应优先尝试SIGTERM(15)优雅退出。"
  },
  {
    "q": "kill -l 命令的作用是？",
    "level": "进阶",
    "options": [
      "列出所有可用信号名称及编号",
      "列出所有进程",
      "终止所有进程",
      "显示kill帮助"
    ],
    "answer": 0,
    "explain": "kill -l 列出系统支持的所有信号名称和编号，如 9) SIGKILL、15) SIGTERM、2) SIGINT。"
  },
  {
    "q": "nohup 命令的作用是？",
    "level": "进阶",
    "options": [
      "提高进程优先级",
      "使进程忽略SIGHUP信号，终端关闭后继续运行",
      "暂停进程",
      "重启进程"
    ],
    "answer": 1,
    "explain": "nohup cmd 使进程忽略挂断信号(SIGHUP)，即使关闭终端会话进程仍继续运行，输出默认重定向到nohup.out。"
  },
  {
    "q": "trap 'cleanup' EXIT 中 EXIT 的作用是？",
    "level": "进阶",
    "options": [
      "仅在脚本出错时触发",
      "在shell退出时(无论正常或异常)执行cleanup",
      "循环退出时触发",
      "函数返回时触发"
    ],
    "answer": 1,
    "explain": "EXIT 是伪信号，在shell退出时触发(正常结束exit、收到信号等)，常用于确保清理函数执行。"
  },
  {
    "q": "trap '' SIGINT 的作用是？",
    "level": "进阶",
    "options": [
      "发送SIGINT信号",
      "忽略(屏蔽)SIGINT信号(Ctrl+C无效)",
      "默认处理SIGINT",
      "终止脚本"
    ],
    "answer": 1,
    "explain": "trap '' SIGNAL 设置空命令，使脚本忽略该信号，trap - SIGNAL 恢复默认处理。"
  },
  {
    "q": "trap - SIGINT 的作用是？",
    "level": "进阶",
    "options": [
      "发送SIGINT",
      "恢复SIGINT的默认处理行为",
      "忽略SIGINT",
      "暂停脚本"
    ],
    "answer": 1,
    "explain": "trap - SIGNAL (或 trap SIGNAL) 移除之前设置的信号处理，恢复系统默认行为。"
  },
  {
    "q": "bash -n script.sh 的作用是？",
    "level": "进阶",
    "options": [
      "执行脚本但不输出",
      "只检查语法错误，不执行脚本",
      "以调试模式执行",
      "详细输出执行过程"
    ],
    "answer": 1,
    "explain": "-n (noexec) 仅进行语法检查不执行，用于提交前验证脚本语法正确性。"
  },
  {
    "q": "bash -x script.sh 的作用是？",
    "level": "进阶",
    "options": [
      "检查语法",
      "跟踪执行，打印每条命令(以+开头)及其展开结果后再执行",
      "静默执行",
      "只执行第一行"
    ],
    "answer": 1,
    "explain": "-x (xtrace) 在执行每条命令前打印该命令(经展开后)，前缀由PS4控制，是调试脚本最常用方式。"
  },
  {
    "q": "set -e 的作用是？",
    "level": "进阶",
    "options": [
      "开启调试输出",
      "任何命令返回非0时立即退出脚本",
      "忽略错误继续执行",
      "设置环境变量e"
    ],
    "answer": 1,
    "explain": "set -e (errexit) 使脚本在任一命令失败(返回非0)时立即退出，避免错误累积；注意管道中默认只看最后命令。"
  },
  {
    "q": "set -u 的作用是？",
    "level": "进阶",
    "options": [
      "未定义变量使用时报错并退出",
      "将变量设为未定义",
      "忽略未定义变量",
      "导出所有变量"
    ],
    "answer": 1,
    "explain": "set -u (nounset) 引用未定义变量时报错退出，防止因变量名拼写错误导致的空值问题。"
  },
  {
    "q": "set -o pipefail 的作用是？",
    "level": "进阶",
    "options": [
      "管道失败时重试",
      "管道中任一命令失败则整个管道返回失败状态",
      "关闭管道",
      "管道仅返回最后命令状态"
    ],
    "answer": 1,
    "explain": "默认管道退出码为最后一个命令的；pipefail 使任一命令失败则管道返回最右侧失败命令的码，配合set -e可捕获管道错误。"
  },
  {
    "q": "getopts 命令的作用是？",
    "level": "进阶",
    "options": [
      "获取系统选项",
      "解析脚本命令行选项参数(短选项)",
      "获取环境变量",
      "设置选项默认值"
    ],
    "answer": 1,
    "explain": "getopts 是shell内置命令，用于循环解析短选项(如 -a -b val)，将选项存入变量，参数存入OPTARG，位置存入OPTIND。"
  },
  {
    "q": "getopts 解析选项时，OPTARG 变量存储什么？",
    "level": "进阶",
    "options": [
      "当前选项字母",
      "当前选项的参数值(若该选项带参数)",
      "选项总数",
      "剩余参数"
    ],
    "answer": 1,
    "explain": "OPTARG 保存当前带参数选项的参数值，如 -o file 中 OPTARG 为 file；OPTIND 保存下一个待处理参数索引。"
  },
  {
    "q": "shift 命令的作用是？",
    "level": "进阶",
    "options": [
      "移位数组",
      "将位置参数左移，$1丢弃，原$2变为$1，依次递减",
      "反转参数顺序",
      "清空所有参数"
    ],
    "answer": 1,
    "explain": "shift [n] 将位置参数左移n位(默认1)，丢弃前n个参数，常用于手动解析参数后处理剩余参数。"
  },
  {
    "q": "子shell ( cmd1; cmd2 ) 的特点是什么？",
    "level": "进阶",
    "options": [
      "在当前shell执行",
      "在子进程中执行，内部变量改变不影响当前shell",
      "不能包含多条命令",
      "等同于管道"
    ],
    "answer": 1,
    "explain": "圆括号 () 在子shell中执行命令组，内部变量定义和修改不影响父shell，常用于隔离环境。"
  },
  {
    "q": "命令分组 { cmd1; cmd2; } 的特点是什么？",
    "level": "进阶",
    "options": [
      "在子shell中执行",
      "在当前shell中执行，变量改变会保留，注意{后和}前需空格及结尾分号",
      "不能包含多条命令",
      "等同于子shell"
    ],
    "answer": 1,
    "explain": "花括号 {} 在当前shell执行命令组(非子shell)，内部变量修改影响当前环境；语法要求{后有空格、}前有分号或换行。"
  },
  {
    "q": "here document 使用 <<-EOF 的作用是？",
    "level": "进阶",
    "options": [
      "去除结束符前的制表符(tab)，便于脚本缩进对齐",
      "左对齐文本",
      "删除所有空格",
      "反转文本"
    ],
    "answer": 1,
    "explain": "<<- 删除结束分隔符行和正文行前的前导制表符(tab)，使脚本中的here document可缩进对齐，注意只去除tab不含空格。"
  },
  {
    "q": "${var%%pattern} 的作用是？",
    "level": "进阶",
    "options": [
      "从右侧删除最短匹配pattern的部分",
      "从右侧删除最长匹配pattern的部分",
      "从左侧删除最长匹配",
      "替换pattern"
    ],
    "answer": 1,
    "explain": "%% 从变量值末尾删除最长匹配pattern的部分(greedy)，% 删除最短匹配；常用于去除文件扩展名如 ${file%%.*}。"
  },
  {
    "q": "${var##pattern} 的作用是？",
    "level": "进阶",
    "options": [
      "从左侧删除最短匹配",
      "从左侧删除最长匹配pattern的部分",
      "从右侧删除最长匹配",
      "替换所有匹配"
    ],
    "answer": 1,
    "explain": "## 从变量值开头删除最长匹配pattern的部分，# 删除最短匹配；如 ${path##*/} 取文件名(删除到最后/)。"
  },
  {
    "q": "${var/pattern/str} 与 ${var//pattern/str} 的区别是？",
    "level": "进阶",
    "options": [
      "前者替换所有匹配，后者替换第一个",
      "前者替换第一个匹配，后者替换所有匹配",
      "两者相同",
      "前者删除匹配"
    ],
    "answer": 1,
    "explain": "单斜杠 / 替换第一个匹配，双斜杠 // 替换所有匹配；pattern可用通配符。"
  },
  {
    "q": "${var:-default} 与 ${var:=default} 的区别是？",
    "level": "进阶",
    "options": [
      "完全相同",
      "前者仅使用default值不赋值，后者同时将default赋给var",
      "前者赋值后者不赋值",
      "前者用于数组"
    ],
    "answer": 1,
    "explain": ":- 当var为空时展开为default但不修改var；:= 当var为空时展开default并同时赋值给var。"
  },
  {
    "q": "${var:+alt} 的作用是？",
    "level": "进阶",
    "options": [
      "var为空时使用alt",
      "var非空时展开为alt，否则为空",
      "删除var中的alt",
      "var设置为alt"
    ],
    "answer": 1,
    "explain": ":+ 当var非空(已设置且非空)时展开为alt，为空时展开为空，常用于条件性传参。"
  },
  {
    "q": "${var:?error msg} 的作用是？",
    "level": "进阶",
    "options": [
      "var为空时报错并输出msg，脚本退出",
      "删除var",
      "设置var为msg",
      "忽略var"
    ],
    "answer": 0,
    "explain": ":? 当var为空或未设置时，输出msg到stderr并以非0状态退出，用于强制参数校验。"
  },
  {
    "q": "${var^} 和 ${var^^} 的作用分别是？",
    "level": "进阶",
    "options": [
      "前者首字母大写，后者全部转大写",
      "前者全部大写，后者首字母大写",
      "两者都转小写",
      "删除大写字母"
    ],
    "answer": 0,
    "explain": "${var^} 将首个字母转大写，${var^^} 将所有字母转大写(bash4+)；对应,和,,转小写。"
  },
  {
    "q": "mapfile 或 readarray 命令的作用是？",
    "level": "进阶",
    "options": [
      "将文件内容按行读入数组",
      "将数组写入文件",
      "映射文件名",
      "读取文件首行"
    ],
    "answer": 0,
    "explain": "mapfile/readarray 将标准输入按行读入数组，每行一个元素，比 while read 循环更高效，常用 mapfile -t arr < file 去除换行符。"
  },
  {
    "q": "关于Shell安全编程中避免使用 eval 的原因，下列说法正确的是？",
    "level": "高级",
    "options": [
      "eval 执行速度慢",
      "eval 会对字符串进行二次解析展开，易导致命令注入，应避免对不可信输入使用",
      "eval 只能用于数字",
      "eval 已被废弃"
    ],
    "answer": 1,
    "explain": "eval 将参数拼接后再次经过shell解析执行，若包含用户输入可被注入任意命令，是重大安全风险，应尽量避免或严格校验输入。"
  },
  {
    "q": "检查命令是否存在的安全做法是？",
    "level": "高级",
    "options": [
      "which cmd",
      "command -v cmd 返回非空表示存在",
      "type cmd 一定准确",
      "ls /usr/bin/cmd"
    ],
    "answer": 1,
    "explain": "command -v cmd 是POSIX推荐方式，返回命令路径(存在)或空(不存在)，退出码可靠；which是外部命令且行为不一。"
  },
  {
    "q": "创建临时文件的安全做法是？",
    "level": "高级",
    "options": [
      "touch /tmp/mytemp",
      "mktemp 创建随机命名文件避免竞态和冲突",
      "echo > /tmp/temp$$",
      "cat > /tmp/temp"
    ],
    "answer": 1,
    "explain": "mktemp 创建唯一随机命名的临时文件，避免预测路径导致的符号链接竞态攻击和命名冲突，是安全创建临时文件的标准做法。"
  },
  {
    "q": "set -euo pipefail 组合被称为严格模式，其中 u 的作用是？",
    "level": "高级",
    "options": [
      "未定义变量引用报错退出",
      "导出所有变量",
      "忽略未定义变量",
      "设置变量为未定义"
    ],
    "answer": 0,
    "explain": "set -u (nounset) 使引用未定义变量时报错退出，配合 -e(出错即退) -o pipefail(管道错误传播) 形成严格模式，提升脚本健壮性。"
  },
  {
    "q": "在引用变量时防止单词分裂和路径展开，推荐做法是？",
    "level": "高级",
    "options": [
      "变量不加引号",
      "始终用双引号包裹变量，如 \"$var\"",
      "用单引号包裹变量",
      "用反引号包裹"
    ],
    "answer": 1,
    "explain": "双引号包裹变量防止值中含有空格被分裂为多个参数、防止通配符被展开，是防御性编程的基本要求，避免注入和意外行为。"
  },
  {
    "q": "ssh 远程执行命令时，关于安全下列做法正确的是？",
    "level": "高级",
    "options": [
      "将密码硬编码在脚本中",
      "使用基于密钥认证(SSH key)而非密码，并限制密钥权限",
      "使用telnet替代ssh",
      "关闭ssh认证"
    ],
    "answer": 1,
    "explain": "应使用SSH密钥对认证，私钥文件权限设为600，配合ssh-agent和受限命令(force command)提升安全；绝不应在脚本中硬编码密码。"
  },
  {
    "q": "性能优化中，用 ${#str} 替代 echo $str | wc -c 的原因是？",
    "level": "高级",
    "options": [
      "两者完全相同",
      "${#str} 是bash内置操作，不创建子进程，更快且不计末尾换行",
      "wc -c 不准确",
      "echo 更快"
    ],
    "answer": 1,
    "explain": "${#str} 由bash直接计算，无子进程开销；echo|wc -c 创建管道和子进程，且wc -c会多算echo添加的换行符，性能和准确性都较差。"
  },
  {
    "q": "性能优化中，用 ${str//x/y} 替代 echo $str | sed 's/x/y/g' 的原因是？",
    "level": "高级",
    "options": [
      "功能不同",
      "${str//x/y} 是内置参数展开，无子进程开销，适合简单替换",
      "sed 不支持全局替换",
      "echo 速度更快"
    ],
    "answer": 1,
    "explain": "bash内置参数展开 ${str//x/y} 不启动子进程，对于简单字面替换远快于管道调用sed；复杂正则才需sed。"
  },
  {
    "q": "并行执行多个独立任务，下列哪种方式效率较高？",
    "level": "高级",
    "options": [
      "for循环串行执行",
      "后台&启动多个任务后用wait等待，或xargs -P 并行",
      "逐个执行并sleep",
      "用管道串行"
    ],
    "answer": 1,
    "explain": "cmd1 & cmd2 & wait 或 xargs -P N 并行启动多个进程，独立任务并发执行可充分利用多核，显著缩短总时间。"
  },
  {
    "q": "避免在管道中使用 while 循环的原因是？",
    "level": "高级",
    "options": [
      "管道不支持循环",
      "管道中的while在子shell中执行，循环内变量修改不会回传当前shell",
      "while不能读取管道",
      "速度太慢"
    ],
    "answer": 1,
    "explain": "cmd | while read 在子shell中运行循环体，内部变量赋值在循环结束后丢失；应改用进程替换 while read < <(cmd) 或 here string。"
  },
  {
    "q": "用 mapfile 替代 while read 循环读取文件的好处是？",
    "level": "高级",
    "options": [
      "功能更多",
      "mapfile 是内置命令一次性读取，避免逐行循环创建子shell和反复read调用，更快",
      "while read 不支持大文件",
      "mapfile 自动排序"
    ],
    "answer": 1,
    "explain": "mapfile -t arr < file 一次将文件读入数组，在当前shell执行，无子进程，比 while read 逐行循环更快，尤其大文件。"
  },
  {
    "q": "trap ERR 信号的作用是？",
    "level": "高级",
    "options": [
      "仅在脚本退出时触发",
      "在命令失败(返回非0)时触发执行指定命令，需配合set -e使用",
      "每条命令后都触发",
      "忽略所有错误"
    ],
    "answer": 1,
    "explain": "ERR 是伪信号，在命令失败(配合set -e使脚本即将退出)时触发，常用于统一错误处理和日志记录，比EXIT更能获取错误上下文。"
  },
  {
    "q": "设计 cleanup 清理函数的最佳触发方式是？",
    "level": "高级",
    "options": [
      "在脚本每行后手动调用",
      "trap cleanup EXIT INT TERM 绑定多个信号确保各种退出情况都清理",
      "只在脚本末尾调用",
      "用cron定时清理"
    ],
    "answer": 1,
    "explain": "trap cleanup EXIT INT TERM 在正常退出、Ctrl+C、终止信号等多种情况下都触发清理，确保临时文件释放等无论何种退出都执行。"
  },
  {
    "q": "封装日志函数 log_error() 时，输出到stderr的正确写法是？",
    "level": "高级",
    "options": [
      "echo msg",
      "echo msg >&2 将stdout重定向到stderr",
      "echo msg 2>1",
      "printf msg >> /dev/stderr"
    ],
    "answer": 1,
    "explain": ">&2 将标准输出重定向到文件描述符2(stderr)，使日志信息不混入正常数据流(stdout)，便于分离处理。"
  },
  {
    "q": "awk 中实现多维数组的常用方式是？",
    "level": "高级",
    "options": [
      "直接 arr[i][j]",
      "用复合键 arr[i SUBSEP j]，SUBSEP为分隔符模拟多维",
      "awk不支持",
      "用多个一维数组"
    ],
    "answer": 1,
    "explain": "awk无真正多维数组，常用 arr[i SUBSEP j] 复合字符串键模拟，SUBSEP(默认\\034)作分隔符，遍历时用split拆解键。"
  },
  {
    "q": "awk 中定义自定义函数的正确语法是？",
    "level": "高级",
    "options": [
      "function name(arg) { return expr }",
      "def name(arg) { }",
      "func name(arg) => expr",
      "function name(arg) { } 可有局部变量"
    ],
    "answer": 0,
    "explain": "awk用 function name(params, localvars) { body; return expr } 定义函数，参数后可声明局部变量(约定多加空格区分)。"
  },
  {
    "q": "sed 保持空间 g 命令的作用是？",
    "level": "高级",
    "options": [
      "将模式空间追加到保持空间",
      "将保持空间内容覆盖到模式空间",
      "删除保持空间",
      "交换两空间内容"
    ],
    "answer": 1,
    "explain": "g (get) 将保持空间内容覆盖到模式空间，G 追加；配合h/H/x可实现倒序输出(tac)、保留特定行等高级文本操作。"
  },
  {
    "q": "awk BEGINFILE 和 ENDFILE 块的作用是？",
    "level": "高级",
    "options": [
      "处理文件首行和末行",
      "在处理每个文件开始(BEGINFILE)和结束(ENDFILE)时执行，用于多文件独立处理",
      "等同于BEGIN和END",
      "读取文件名"
    ],
    "answer": 1,
    "explain": "BEGINFILE/ENDFILE (gawk扩展) 在每个文件处理前后触发，可在多文件处理时按文件做初始化和收尾，如重置计数器。"
  },
  {
    "q": "用 awk 处理CSV文件时，处理字段内含逗号(引号包裹)的难点在于？",
    "level": "高级",
    "options": [
      "awk不支持CSV",
      "标准awk按-F, 分割会错误拆分引号内逗号，需用FPAT或gawk的CSV扩展处理",
      "CSV必须先转换",
      "awk无法读取CSV"
    ],
    "answer": 1,
    "explain": "标准 -F, 会将 'a,\"b,c\",d' 错误拆分；gawk可用 FPAT='([^,]*)|(\"[^\"]+\")' 定义字段内容模式，或4.0+的 --csv 选项正确处理。"
  },
  {
    "q": "实现行列转换(矩阵转置)的常见awk思路是？",
    "level": "高级",
    "options": [
      "用sort排序",
      "将每行字段按列存入二维数组，END中按列输出为行",
      "用cut命令",
      "用tr替换"
    ],
    "answer": 1,
    "explain": "转置需将 input[i][j] 存为 arr[j,i]，在END块按列号顺序逐行输出原列数据，awk多维数组(复合键)实现。"
  },
  {
    "q": "读取 /proc/loadavg 获取系统负载的正确方式是？",
    "level": "高级",
    "options": [
      "cat /proc/loadavg 读取前三个数为1/5/15分钟平均负载",
      "cat /proc/cpuinfo",
      "ls /proc",
      "read /proc/loadavg"
    ],
    "answer": 0,
    "explain": "/proc/loadavg 文件前三个字段为1、5、15分钟平均负载(运行队列进程数)，是Linux系统负载监控的轻量数据源。"
  },
  {
    "q": "编写 systemd 服务单元文件时，ExecStart 指令的作用是？",
    "level": "高级",
    "options": [
      "设置服务依赖",
      "指定服务启动时执行的命令及其参数",
      "定义停止命令",
      "设置环境变量"
    ],
    "answer": 1,
    "explain": "ExecStart 指定服务启动时执行的命令(绝对路径)，是[Service]段核心指令；ExecStop定义停止命令，Restart定义重启策略。"
  },
  {
    "q": "logrotate 配置中 rotate 7 的含义是？",
    "level": "高级",
    "options": [
      "每天轮转",
      "保留7个历史归档文件，超出则删除最旧的",
      "轮转7次后停止",
      "压缩7个文件"
    ],
    "answer": 1,
    "explain": "rotate N 指定保留N个轮转归档文件，超出数量的最旧文件被删除；配合daily/weekly设置轮转周期。"
  },
  {
    "q": "shellcheck 工具的作用是？",
    "level": "高级",
    "options": [
      "执行shell脚本",
      "对shell脚本进行静态分析，发现常见错误和不良实践",
      "加密shell脚本",
      "压缩脚本"
    ],
    "answer": 1,
    "explain": "shellcheck 是shell脚本静态分析工具，检测未引用变量、无用cat、错误条件判断等问题，是shell脚本质量保证和CI集成的标准工具。"
  },
  {
    "q": "bats (Bash Automated Testing System) 是什么？",
    "level": "高级",
    "options": [
      "bash调试器",
      "bash脚本的测试框架，支持编写和运行单元测试",
      "bash版本管理工具",
      "bash性能分析器"
    ],
    "answer": 1,
    "explain": "bats 是bash脚本测试框架，提供 @test 测试用例语法、assert断言，可像其他语言单元测试一样为shell脚本编写自动化测试。"
  },
  {
    "q": "在测试中 Mock 一个命令(如date)的常见做法是？",
    "level": "高级",
    "options": [
      "修改源码",
      "在PATH前置目录中创建同名脚本函数覆盖，或用function覆盖后还原",
      "无法Mock",
      "重新编译bash"
    ],
    "answer": 1,
    "explain": "通过在PATH靠前位置放置同名脚本，或用 function date() { ... } 在测试中覆盖命令行为，测试后用 unset -f date 还复，实现依赖隔离。"
  },
  {
    "q": "bash 4+ 中 ${var^^} 和 ${var,,} 的作用分别是？",
    "level": "高级",
    "options": [
      "前者全大写，后者全小写",
      "前者全小写，后者全大写",
      "前者首字母大写，后者首字母小写",
      "删除大小写字母"
    ],
    "answer": 0,
    "explain": "${var^^} 将所有字母转为大写，${var,,} 转为小写(bash4+)；单^/,只转换首字母，是内置操作无需调用tr。"
  },
  {
    "q": "declare -r var 与 readonly var 的关系是？",
    "level": "高级",
    "options": [
      "完全不同",
      "功能等价，都声明只读变量，赋值后不可修改",
      "declare -r只能用于函数",
      "readonly 只能用于全局"
    ],
    "answer": 1,
    "explain": "declare -r 和 readonly 都声明只读变量，效果基本等价；readonly是POSIX内置，declare -r是bash扩展，两者赋值后均不可更改。"
  },
  {
    "q": "enable -n cmd 的作用是？",
    "level": "高级",
    "options": [
      "启用内置命令",
      "禁用指定的shell内置命令",
      "删除命令",
      "重命名命令"
    ],
    "answer": 1,
    "explain": "enable -n cmd 禁用shell内置命令(使其不可用)，enable cmd 重新启用；用于强制使用同名外部命令或限制功能。"
  },
  {
    "q": "PROMPT_COMMAND 变量的作用是？",
    "level": "高级",
    "options": [
      "设置提示符样式",
      "指定在显示主提示符(PS1)前执行的命令",
      "定义命令别名",
      "设置历史记录格式"
    ],
    "answer": 1,
    "explain": "PROMPT_COMMAND 的值在每次显示PS1提示符前作为命令执行，常用于动态更新提示符(如显示git分支)或记录命令历史到文件。"
  },
  {
    "q": "在Docker容器中运行Shell脚本，关于严格模式下列说法合理的是？",
    "level": "高级",
    "options": [
      "容器中无需set -e",
      "仍应使用set -euo pipefail并设置合理ENTRYPOINT/CMD，容器以脚本退出码决定整体状态",
      "容器中脚本不能失败",
      "必须用nohup"
    ],
    "answer": 1,
    "explain": "Docker容器退出码由前台进程(常为脚本)决定，应使用严格模式使错误正确传播，配合ENTRYPOINT封装初始化，确保容器状态(healthy/exited)准确反映脚本结果。"
  },
  {
    "q": "Shell脚本调用REST API并解析JSON，常用组合是？",
    "level": "高级",
    "options": [
      "curl + grep",
      "curl 获取响应，jq 解析处理JSON数据",
      "wget + sed",
      "fetch + awk"
    ],
    "answer": 1,
    "explain": "curl 发送HTTP请求获取API响应，jq 是专业的命令行JSON处理器，支持查询、过滤、修改JSON，二者组合是Shell调用API的标准实践。"
  }
];
