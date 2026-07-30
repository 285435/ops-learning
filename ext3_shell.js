// === SHELL EXT3 ===
shell_ext3_topics: [
  {
    "id": "shell-parallel",
    "title": "Shell 并行处理与 xargs 高级用法",
    "level": "高级",
    "content": "**并行处理方案对比**\n\n1. **xargs 并行**\n   - xargs -P N：启动 N 个并行进程\n   - xargs -I {} 不能与 -P 同时使用（用 -P + 占位符解决）\n   - 示例：find . -name '*.log' | xargs -P 4 -I {} gzip {}\n\n2. **GNU Parallel**\n   - 更强大的并行工具，支持更灵活的替换符\n   - parallel -j 4 gzip ::: *.log\n   - parallel --pipe 可以并行处理管道数据\n\n3. **后台进程 + wait**\n   - 在脚本中启动多个后台任务，最后 wait 等待全部完成\n   - 需要控制并发数时，使用文件描述符作为信号量\n\n4. **coproc 协程（bash 4+）**\n   - coproc NAME { command; }\n   - 通过 ${NAME[0]} 和 ${NAME[1]} 读写\n\n**xargs 高级技巧**\n- -d '\\n'：按换行分隔（处理含空格的文件名）\n- -0：配合 find -print0，处理任意文件名\n- -n N：每批 N 个参数\n- -L N：每批 N 行输入\n- --max-chars：限制命令行长度\n- -a file：从文件读取输入而非 stdin\n\n**并发控制脚本模板**\n```bash\n#!/bin/bash\nMAX_JOBS=4\nJOBS=0\nfor f in *.log; do\n   process_log \"$f\" &\n   JOBS=$((JOBS + 1))\n   if [[ $JOBS -ge $MAX_JOBS ]]; then\n       wait -n  # bash 4.3+ 等待任一后台任务完成\n       JOBS=$((JOBS - 1))\n   fi\ndone\nwait\n```",
    "example": "# xargs 并行压缩 4 个文件同时处理\nfind . -name '*.log' -print0 | xargs -0 -P 4 gzip\n\n# GNU Parallel 并行执行\nseq 1 100 | parallel -j 8 echo 'Processing {}'\n\n# 后台进程并发控制\nfor host in $(cat hosts.txt); do\n  ssh $host 'hostname' &\ndone\nwait  # 等待所有后台任务\n\n# 限制并发数\nMAX=5\nfor i in {1..20}; do\n  ((i % MAX == 0)) && wait\n  sleep 1 &\ndone\nwait\n\n# coproc 示例\ncoproc BC { bc -l; }\necho 'scale=10; 4*a(1)' >&${BC[1]}\nread PI <&${BC[0]}\necho $PI\n\n# xargs 多参数替换\necho -e 'a\\nb' | xargs -n1 -I{} cp {} /backup/\n\n# 配合 find 处理特殊文件名\nfind . -type f -print0 | xargs -0 -P 4 chmod 644"
  },
  {
    "id": "shell-security",
    "title": "Shell 脚本安全与最佳实践",
    "level": "高级",
    "content": "**严格模式（Defensive Programming）**\n```bash\nset -euo pipefail\n```\n- -e：命令失败立即退出\n- -u：使用未定义变量报错\n- -o pipefail：管道中任一命令失败，整个管道返回非零\n- 配合 IFS=$'\\n\\t' 防止单词分割问题\n\n**输入验证**\n- 所有外部输入必须验证（位置参数、环境变量、文件内容）\n- 使用正则表达式匹配预期格式\n- 数字检查：`[[ $var =~ ^[0-9]+$ ]]`\n- 路径检查：禁止包含 .. 或以 / 开头（除非预期）\n\n**命令注入防护**\n- 永远不要把用户输入直接拼接到命令中\n- 使用数组传参：`cmd \"$@\"` 而非 `cmd $@`\n- 避免 eval 执行用户输入\n- 使用 printf '%q' 转义参数\n\n**敏感数据处理**\n- 密码通过 read -s 读取\n- 使用 mktemp 创建临时文件\n- 设置 umask 077 限制临时文件权限\n- trap 清理临时文件\n- 历史记录中隐藏敏感命令：命令前加空格（需 HISTCONTROL=ignorespace）\n\n**权限与SUID/SGID**\n- 脚本不宜设置 SUID/SGID（竞争条件风险）\n- 如需提权，使用 sudo + 白名单\n- 检查文件所有权和权限后再操作\n\n**审计与日志**\n- 记录脚本执行日志\n- 记录操作人、时间、参数、结果\n- 敏感操作需确认机制\n\n**常见陷阱**\n- 文件名含空格：始终用引号包围变量\n- 通配符未匹配时保持原样（shopt -s nullglob）\n- [ 和 [[ 的区别\n- 整数溢出：Shell 整数有精度限制\n- 递归深度限制",
    "example": "#!/bin/bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\n# 输入验证\nvalidate_input() {\n  local input=$1\n  if [[ ! $input =~ ^[a-zA-Z0-9_-]+$ ]]; then\n    echo \"Invalid input: $input\" >&2\n    exit 1\n  fi\n}\n\n# 安全临时文件\nTMPFILE=$(mktemp /tmp/script.XXXXXX)\ntrap 'rm -f \"$TMPFILE\"' EXIT\n\n# 隐藏密码输入\nread -rsp \"Enter password: \" PASSWORD\necho\n\n# 安全执行命令（数组方式）\ncmd=(ls -la \"/path with spaces\")\n\"${cmd[@]}\"\n\n# 参数转义\nuser_input='; rm -rf /'\nsafe_arg=$(printf '%q' \"$user_input\")\necho \"Safe arg: $safe_arg\"\n\n# 检查命令存在\ncommand -v jq >/dev/null 2>&1 || { echo \"jq required\" >&2; exit 1; }\n\n# 路径安全检查\npath='/etc/passwd'\nif [[ $path == *..* || $path == */* ]]; then\n  echo \"Path contains unsafe components\" >&2\n  exit 1\nfi\n\n# 设置严格的 umask\numask 077"
  },
  {
    "id": "shell-expect",
    "title": "Expect 自动交互与无人值守脚本",
    "level": "高级",
    "content": "**Expect 基础**\n- 基于 Tcl，用于自动化交互式程序\n- spawn：启动程序\n- expect：等待特定输出\n- send：发送输入\n- interact：交还控制权给用户\n\n**核心语法**\n```tcl\nspawn ssh user@host\nexpect {\n  \"password:\" {\n    send \"mypassword\\r\"\n  }\n  \"(yes/no)?\" {\n    send \"yes\\r\"\n    exp_continue\n  }\n  timeout {\n    puts \"Connection timed out\"\n    exit 1\n  }\n}\n```\n\n**高级特性**\n- exp_continue：匹配后继续 expect\n- timeout 全局设置等待时间\n- expect_background：后台匹配\n- log_file：记录会话\n- send_user：输出到用户终端\n\n**与 Shell 结合**\n- expect 脚本中可嵌入 shell 变量（注意转义）\n- 使用 -c 参数直接执行 expect 命令\n- 通过环境变量或参数传递动态值\n\n**替代方案**\n- sshpass：简单的 ssh 密码自动输入\n- SSH 密钥（推荐）：免密码登录更安全\n- here document：简单交互\n- socat：更灵活的管道交互\n\n**使用场景**\n- 自动化 SSH/SCP/SFTP\n- 自动配置网络设备\n- 自动化 FTP 上传下载\n- 软件安装自动应答\n- 批量修改密码",
    "example": "#!/usr/bin/expect -f\n\n# 自动 SSH 登录并执行命令\nset host [lindex $argv 0]\nset user [lindex $argv 1]\nset pass [lindex $argv 2]\nset timeout 30\n\nspawn ssh $user@$host\nexpect {\n  \"(yes/no)?\" {\n    send \"yes\\r\"\n    exp_continue\n  }\n  \"password:\" {\n    send \"$pass\\r\"\n  }\n  timeout {\n    puts \"Timeout\"\n    exit 1\n  }\n}\nexpect \"$ \"\nsend \"uname -a\\r\"\nexpect \"$ \"\nsend \"exit\\r\"\nexpect eof\n\n# Shell 中调用 expect\n#!/bin/bash\nHOST=$1\nUSER=$2\nPASS=$3\nexpect <<EOF\nspawn ssh $USER@$HOST \"df -h\"\nexpect \"password:\"\nsend \"$PASS\\r\"\nexpect eof\nEOF\n\n# 自动 FTP\nspawn ftp ftp.example.com\nexpect \"Name\"\nsend \"anonymous\\r\"\nexpect \"Password\"\nsend \"user@example.com\\r\"\nexpect \"ftp>\"\nsend \"get file.txt\\r\"\nexpect \"ftp>\"\nsend \"bye\\r\""
  },
  {
    "id": "shell-log-analysis",
    "title": "日志分析与处理实战",
    "level": "高级",
    "content": "**日志处理三剑客组合**\n\n1. **实时日志监控**\n   - tail -f /var/log/nginx/access.log | awk '{print $1, $9}'\n   - multitail：多文件同时监控\n   - lnav：带语法高亮的日志查看器\n\n2. **日志统计与聚合**\n   - awk '{ips[$1]++} END {for(i in ips) print ips[i], i}' | sort -rn | head\n   - 统计状态码、URL、响应时间分布\n\n3. **时间范围过滤**\n   - sed -n '/2024-01-01 10:00/,/2024-01-01 11:00/p'\n   - awk '$4 >= \"[01/Jan/2024:10:00\" && $4 <= \"[01/Jan/2024:11:00\"'\n\n**常见日志分析场景**\n- **Top IP**：awk + sort + uniq -c\n- **错误率统计**：grep ' 5xx ' | wc -l\n- **慢请求**：awk '$NF > 2 {print}'（假设最后字段是响应时间）\n- **UV/PV**：去重统计独立 IP/总请求数\n- **流量统计**：累加响应大小字段\n\n**高级技巧**\n- 使用 awk 的多维数组做复杂聚合\n- join 命令关联多个日志文件\n- comm 命令对比两个排序后的日志\n- ts 命令（moreutils）给日志加时间戳\n- pv 命令显示处理进度\n\n**性能优化**\n- 大文件避免管道过多，减少进程创建\n- 使用 awk 替代 grep | sed | awk 组合\n- 预过滤减少数据量\n- 并行处理大日志文件（split + parallel）\n\n**日志轮转与归档**\n- logrotate 配置\n- 按日期切割日志\n- 压缩旧日志\n- 清理过期日志",
    "example": "# Top 10 访问 IP\nawk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10\n\n# 统计每小时请求量\nawk -F: '{print $2\":\"$3}' access.log | sort | uniq -c\n\n# 状态码分布\nawk '{print $9}' access.log | sort | uniq -c | sort -rn\n\n# 慢查询日志分析（MySQL）\nawk '/Query_time/ {print $3}' slow.log | sort -rn | head -20\n\n# 实时错误监控\ntail -f app.log | grep --line-buffered ERROR | while read line; do\n  echo \"$(date): $line\" >> error_alert.log\ndone\n\n# 多文件关联分析\nawk 'NR==FNR{a[$1]=$2; next} {print $0, a[$1]}' users.txt logs.txt\n\n# 大文件并行处理\nsplit -l 1000000 huge.log chunk_\nfor f in chunk_*; do\n  awk '{count[$1]++} END {for(i in count) print count[i], i}' \"$f\" > \"$f.stats\" &\ndone\nwait\ncat chunk_*.stats | awk '{a[$2]+=$1} END {for(i in a) print a[i], i}' | sort -rn | head\n\n# 日志加时间戳\ntail -f logfile | ts '[%Y-%m-%d %H:%M:%S]'\n\n# 计算 95 分位响应时间\nawk '{print $NF}' access.log | sort -n | awk 'BEGIN{c=0} {a[c++]=$1} END{print a[int(c*0.95)]}'"
  },
  {
    "id": "shell-monitor-scripts",
    "title": "系统监控脚本实战",
    "level": "高级",
    "content": "**监控指标采集**\n\n1. **CPU 监控**\n   - top -bn1 | grep \"Cpu(s)\"\n   - /proc/stat 计算 CPU 使用率\n   - mpstat、pidstat（sysstat 包）\n\n2. **内存监控**\n   - free -m\n   - /proc/meminfo\n   - 计算内存使用率、可用内存\n\n3. **磁盘监控**\n   - df -h\n   - iostat -x 1 3\n   - 磁盘 IO 饱和度\n\n4. **网络监控**\n   - ss -tuln\n   - netstat -s\n   - /proc/net/dev\n\n**告警机制**\n- 阈值判断 + 邮件/钉钉/企业微信/webhook\n- 告警抑制：同一问题 N 分钟内只发一次\n- 告警分级：WARNING、CRITICAL\n- 自动恢复通知\n\n**脚本设计模式**\n- 守护进程模式：while true + sleep\n- cron 模式：定时执行\n- Systemd Timer：更现代的定时方案\n- 多指标聚合报表\n\n**数据存储**\n- 写入 CSV/TSV 便于分析\n- rrdtool 轮询数据库\n- 发送到 Prometheus/Grafana\n- 写入 SQLite 本地数据库\n\n**可视化**\n- gnuplot 绘制趋势图\n- 生成 HTML 报表\n- 对接 Grafana",
    "example": "#!/bin/bash\n# 系统监控脚本\nLOG=/var/log/system_monitor.log\nALERT_CPU=80\nALERT_MEM=90\nALERT_DISK=85\n\n# 采集 CPU\nCPU_IDLE=$(top -bn1 | grep \"Cpu(s)\" | awk '{print $8}')\nCPU_USE=$(echo \"100 - $CPU_IDLE\" | bc)\n\n# 采集内存\nMEM_INFO=$(free | grep Mem)\nMEM_TOTAL=$(echo $MEM_INFO | awk '{print $2}')\nMEM_USED=$(echo $MEM_INFO | awk '{print $3}')\nMEM_USE=$(echo \"scale=2; $MEM_USED * 100 / $MEM_TOTAL\" | bc)\n\n# 采集磁盘\nDISK_USE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')\n\n# 记录日志\necho \"$(date '+%Y-%m-%d %H:%M:%S') CPU=${CPU_USE}% MEM=${MEM_USE}% DISK=${DISK_USE}%\" >> $LOG\n\n# 告警判断\nalert() {\n  local msg=\"$1\"\n  echo \"$msg\" | mail -s \"Server Alert\" admin@example.com\n  # 或发送钉钉 webhook\n}\n\nif (( $(echo \"$CPU_USE > $ALERT_CPU\" | bc -l) )); then\n  alert \"CPU usage ${CPU_USE}% exceeds ${ALERT_CPU}%\"\nfi\n\nif (( $(echo \"$MEM_USE > $ALERT_MEM\" | bc -l) )); then\n  alert \"Memory usage ${MEM_USE}% exceeds ${ALERT_MEM}%\"\nfi\n\nif (( DISK_USE > ALERT_DISK )); then\n  alert \"Disk usage ${DISK_USE}% exceeds ${ALERT_DISK}%\"\nfi\n\n# 生成日报\ngenerate_report() {\n  echo \"=== Daily Report $(date -d yesterday +%Y-%m-%d) ===\"\n  awk -v d=\"$(date -d yesterday +%Y-%m-%d)\" '$0 ~ d' $LOG | awk '\n    {cpu_sum+=$2; mem_sum+=$3; disk_sum+=$4; count++}\n    END {\n      print \"Avg CPU:\" cpu_sum/count \"%\"\n      print \"Avg MEM:\" mem_sum/count \"%\"\n      print \"Avg DISK:\" disk_sum/count \"%\"\n    }\n  '\n}"
  },
  {
    "id": "shell-text-processing",
    "title": "文本处理高级技巧与实战",
    "level": "高级",
    "content": "**高级文本处理场景**\n\n1. **多文件批量处理**\n   - find + sed -i 批量替换\n   - 备份原文件：sed -i.bak\n   - 跨目录递归处理\n\n2. **CSV/TSV 处理**\n   - awk -F, 处理 CSV\n   - 处理含引号的字段（复杂 CSV）\n   - 推荐使用 csvkit（Python）或 mlr（Miller）\n\n3. **JSON 处理**\n   - jq：命令行 JSON 处理器\n   - jq '.key | .nested' 提取字段\n   - jq '.[] | select(.age > 18)' 过滤\n   - jq -s 'add' 合并多个 JSON\n\n4. **XML/HTML 处理**\n   - xmlstarlet\n   - pup（HTML）\n   - hxselect\n   - 简单提取可用 grep/sed/awk（不推荐复杂 HTML）\n\n5. **YAML 处理**\n   - yq（类似 jq）\n   - Python + PyYAML\n\n**文本编码处理**\n- file -i 检测编码\n- iconv 转换编码\n- enca 智能检测编码\n- dos2unix/unix2dos 换行符转换\n\n**文本-diff 与补丁**\n- diff -u 统一格式\n- patch 应用补丁\n- wdiff 单词级 diff\n- colordiff 彩色输出\n\n**随机与采样**\n- shuf 随机打乱\n- sort -R 随机排序\n- awk 'NR % 10 == 0' 每隔 N 行采样\n- head/tail 组合提取中间行",
    "example": "# 批量替换多文件中的字符串\nfind . -name '*.conf' -exec sed -i 's/old_domain/new_domain/g' {} +\n\n# JSON 处理（jq）\ncurl -s api.example.com/data | jq '.users[] | {name: .name, email: .email}'\n\n# 处理 CSV 并计算平均值\nawk -F, 'NR>1 {sum+=$3; count++} END {print \"Avg:\" sum/count}' data.csv\n\n# 文本编码转换\niconv -f GBK -t UTF-8 input.txt > output.txt\n\n# 随机抽取 100 行\nshuf large_file.txt | head -n 100\n\n# diff 并生成补丁\ndiff -u file1.txt file2.txt > patch.diff\npatch file1.txt < patch.diff\n\n# 提取中间行（1000-2000 行）\nsed -n '1000,2000p' large_file.txt\nawk 'NR>=1000 && NR<=2000' large_file.txt\n\n# 多列排序\nsort -t, -k2,2nr -k1,1 data.tsv\n\n# 去重并保持顺序\nawk '!seen[$0]++' file.txt\n\n# 用 printf 格式化输出\nawk '{printf \"%-10s %5d %8.2f\\n\", $1, $2, $3}' data.txt"
  }
],

shell_ext3_questions: [
  {
    "q": "xargs 的哪个参数可以实现并行处理？",
    "level": "高级",
    "options": ["-n","-I","-P","-d"],
    "answer": 2,
    "explain": "-P N 参数指定同时运行 N 个进程实现并行处理。-n 指定每批参数个数，-I 定义替换字符串，-d 指定分隔符。"
  },
  {
    "q": "Shell 严格模式 set -euo pipefail 中，-o pipefail 的作用是？",
    "level": "高级",
    "options": ["管道超时退出","管道中任一命令失败则整个管道返回非零","管道输出到文件","管道使用 FIFO"],
    "answer": 1,
    "explain": "-o pipefail 使得管道中只要有一个命令返回非零状态，整个管道的退出状态就是非零，而非默认的最后一个命令状态。"
  },
  {
    "q": "Expect 脚本中，exp_continue 的作用是？",
    "level": "高级",
    "options": ["退出脚本","匹配后继续 expect","发送继续信号","忽略错误"],
    "answer": 1,
    "explain": "exp_continue 表示匹配到当前模式后，不退出 expect，而是继续等待匹配其他模式，常用于处理多重提示。"
  },
  {
    "q": "以下哪个命令可以安全地创建临时文件？",
    "level": "进阶",
    "options": ["touch /tmp/tmpfile","mktemp /tmp/script.XXXXXX","echo > /tmp/file","cat > /tmp/tmp"],
    "answer": 1,
    "explain": "mktemp 以原子方式创建具有随机后缀的唯一临时文件，避免命名冲突和竞争条件。"
  },
  {
    "q": "如何统计日志文件中访问量 Top 10 的 IP？",
    "level": "进阶",
    "options": ["awk '{print $1}' | sort | uniq -c | sort -rn | head","cat | grep IP | head","awk '{print $1}' | head","sort | uniq | head"],
    "answer": 0,
    "explain": "标准流程：awk 提取 IP 字段，sort 排序，uniq -c 统计，sort -rn 按数量倒序，head 取前 10。"
  },
  {
    "q": "Shell 中防止单词分割的正确做法是？",
    "level": "进阶",
    "options": ["使用 $var","使用 \"$var\"","使用 ${var}","使用 $var|"],
    "answer": 1,
    "explain": "始终用双引号包围变量引用 \"$var\"，防止空格、制表符、换行导致的单词分割。"
  },
  {
    "q": "jq 命令 '.users[] | select(.age > 18)' 的作用是？",
    "level": "高级",
    "options": ["排序用户","选择 age 大于 18 的用户","统计用户数量","删除 age 字段"],
    "answer": 1,
    "explain": "这是 jq 的过滤语法：遍历 users 数组，选择 age 大于 18 的元素。"
  },
  {
    "q": "iconv 命令的主要用途是？",
    "level": "进阶",
    "options": ["压缩文件","转换文本编码","改变文件权限","网络传输"],
    "answer": 1,
    "explain": "iconv 用于在不同字符编码之间转换文本文件，如 GBK 转 UTF-8。"
  },
  {
    "q": "如何设置脚本在退出时自动清理临时文件？",
    "level": "进阶",
    "options": ["rm -f tmpfile","trap 'rm -f tmpfile' EXIT","exit 0","clear"],
    "answer": 1,
    "explain": "trap 'rm -f tmpfile' EXIT 会在脚本正常退出、被信号终止等情况下执行清理命令。"
  },
  {
    "q": "Shell 脚本中，${#array[@]} 表示？",
    "level": "进阶",
    "options": ["数组所有元素拼接","数组元素个数","数组最后一个元素","数组第一个元素"],
    "answer": 1,
    "explain": "${#array[@]} 返回数组元素的数量。${#array[*]} 效果相同。"
  },
  {
    "q": "以下哪种方式可以并行执行多个后台任务并等待全部完成？",
    "level": "进阶",
    "options": ["cmd1; cmd2","cmd1 & cmd2 & wait","cmd1 && cmd2","cmd1 || cmd2"],
    "answer": 1,
    "explain": "cmd1 & 和 cmd2 & 将命令放入后台执行，wait 会等待所有后台任务完成。"
  },
  {
    "q": "Expect 的 spawn 命令用于？",
    "level": "高级",
    "options": ["生成随机数","启动一个新的程序","创建文件","发送信号"],
    "answer": 1,
    "explain": "spawn 用于启动一个新的交互式程序，后续 expect/send 与该程序交互。"
  },
  {
    "q": "如何限制 xargs 每批处理的参数数量？",
    "level": "进阶",
    "options": ["-P","-n","-I","-t"],
    "answer": 1,
    "explain": "-n N 限制每批传递给命令的参数个数为 N。"
  },
  {
    "q": "Shell 中 HISTCONTROL=ignorespace 的作用是？",
    "level": "高级",
    "options": ["忽略历史记录","以空格开头的命令不记录到历史","清空历史","显示历史时间戳"],
    "answer": 1,
    "explain": "设置 HISTCONTROL=ignorespace 后，命令行前加空格执行时不会记录到 bash 历史中，适合隐藏敏感命令。"
  },
  {
    "q": "awk 'NR % 10 == 0' file.txt 的作用是？",
    "level": "进阶",
    "options": ["每隔 10 行输出一行","输出前 10 行","输出行号","删除第 10 行"],
    "answer": 0,
    "explain": "NR 是当前行号，NR % 10 == 0 匹配行号能被 10 整除的行，即每隔 10 行输出一行。"
  },
  {
    "q": "Shell 脚本中，IFS=$'\\n\\t' 的作用是？",
    "level": "高级",
    "options": ["设置输出格式","设置字段分隔符为换行和制表符","设置输入提示","设置编码"],
    "answer": 1,
    "explain": "IFS（Internal Field Separator）设置单词分割的分隔符为换行和制表符，避免空格导致的分割问题。"
  },
  {
    "q": "tail -f 配合什么命令可以给输出加上时间戳？",
    "level": "进阶",
    "options": ["date","ts","time","timestamp"],
    "answer": 1,
    "explain": "ts 命令来自 moreutils 包，可以实时给管道输出添加时间戳，如 tail -f log | ts。"
  },
  {
    "q": "如何检查一个命令是否存在？",
    "level": "进阶",
    "options": ["which cmd","command -v cmd","find cmd","locate cmd"],
    "answer": 1,
    "explain": "command -v cmd 是 POSIX 标准方式，可以检查命令是否存在且支持别名、函数、内建命令。"
  },
  {
    "q": "dos2unix 命令的主要作用是？",
    "level": "进阶",
    "options": ["DOS 转 UNIX 文件权限","转换 CRLF 换行符为 LF","转换文件编码","转换文件名"],
    "answer": 1,
    "explain": "dos2unix 将 Windows 风格的 CRLF（\\r\\n）换行符转换为 Unix 风格的 LF（\\n）。"
  },
  {
    "q": "awk '!seen[$0]++' file.txt 的作用是？",
    "level": "高级",
    "options": ["统计行数","去重并保持原始顺序","排序","反转行顺序"],
    "answer": 1,
    "explain": "seen 数组记录每行是否出现过，!seen[$0]++ 只在第一次遇到某行时为真并输出，实现去重且保持原始顺序。"
  },
  {
    "q": "在 Shell 脚本中，使用数组传参的正确语法是？",
    "level": "高级",
    "options": ["cmd $@","cmd \"$@\"","cmd $*","cmd $#"],
    "answer": 1,
    "explain": "\"$@\" 将每个参数作为独立的带引号的字符串传递，是安全的数组传参方式。$@ 和 $* 不引号时会导致空格分割问题。"
  },
  {
    "q": "logrotate 的主要功能是？",
    "level": "进阶",
    "options": ["实时查看日志","日志轮转、压缩和清理","分析日志内容","搜索日志"],
    "answer": 1,
    "explain": "logrotate 是 Linux 日志管理工具，负责按大小/时间轮转日志、压缩旧日志、删除过期日志。"
  },
  {
    "q": "Shell 中如何隐藏用户输入的密码？",
    "level": "进阶",
    "options": ["read pass","read -s pass","read -p pass","read -n pass"],
    "answer": 1,
    "explain": "read -s 选项关闭回显，适合读取密码等敏感输入，用户输入不会在屏幕上显示。"
  },
  {
    "q": "shuf 命令的作用是？",
    "level": "进阶",
    "options": ["排序","随机打乱行顺序","去重","统计"],
    "answer": 1,
    "explain": "shuf（shuffle）随机打乱输入行的顺序，常用于随机抽样。"
  },
  {
    "q": "如何计算文件的 MD5 校验和？",
    "level": "基础",
    "options": ["md5 file","md5sum file","checksum file","hash file"],
    "answer": 1,
    "explain": "md5sum 命令计算文件的 MD5 哈希值，常用于文件完整性校验。"
  },
  {
    "q": "Shell 中，$? 变量表示？",
    "level": "基础",
    "options": ["当前进程 ID","上一个命令的退出状态","脚本参数个数","当前行号"],
    "answer": 1,
    "explain": "$? 保存上一个命令/管道的退出状态码，0 通常表示成功，非零表示失败。"
  },
  {
    "q": "awk 的 BEGIN 块什么时候执行？",
    "level": "进阶",
    "options": ["处理每一行前","处理任何输入前","文件结束时","遇到错误时"],
    "answer": 1,
    "explain": "BEGIN 块在 awk 开始处理任何输入之前执行一次，常用于初始化变量。"
  },
  {
    "q": "sed -i.bak 's/foo/bar/g' file 的作用是？",
    "level": "进阶",
    "options": ["直接修改文件并创建 .bak 备份","只输出不修改","修改并删除原文件","修改并压缩"],
    "answer": 0,
    "explain": "-i.bak 表示直接修改文件，同时创建 file.bak 的原始备份。"
  },
  {
    "q": "Shell 中如何定义关联数组（字典）？",
    "level": "高级",
    "options": ["declare -a dict","declare -A dict","typeset dict","local dict"],
    "answer": 1,
    "explain": "declare -A dict 定义关联数组（Associative Array），可以用字符串作为下标，类似字典/Map。"
  },
  {
    "q": "以下哪个不是 Expect 的命令？",
    "level": "高级",
    "options": ["spawn","expect","send","fork"],
    "answer": 3,
    "explain": "Expect 的核心命令包括 spawn、expect、send、interact 等，fork 不是 Expect 的命令（fork 是系统调用/C 函数）。"
  }
]
