const LINUX_NEW = [
  {
    "q": "以下哪个命令用于切换当前工作目录？",
    "level": "基础",
    "options": [
      "cd",
      "ls",
      "pwd",
      "cp"
    ],
    "answer": 0,
    "explain": "cd (Change Directory) 命令用于切换当前工作目录，是Linux最常用的命令之一。"
  },
  {
    "q": "以下哪个命令用于列出目录内容？",
    "level": "基础",
    "options": [
      "cd",
      "ls",
      "pwd",
      "mkdir"
    ],
    "answer": 1,
    "explain": "ls (List) 命令用于列出目录中的文件和子目录，支持多种参数如-l显示详细信息、-a显示隐藏文件等。"
  },
  {
    "q": "以下哪个命令用于显示当前工作目录的绝对路径？",
    "level": "基础",
    "options": [
      "cd",
      "ls",
      "pwd",
      "rm"
    ],
    "answer": 2,
    "explain": "pwd (Print Working Directory) 命令用于显示当前所在工作目录的完整绝对路径。"
  },
  {
    "q": "以下哪个命令用于复制文件或目录？",
    "level": "基础",
    "options": [
      "mv",
      "touch",
      "rm",
      "cp"
    ],
    "answer": 3,
    "explain": "cp (Copy) 命令用于复制文件或目录，复制目录时需要加-r参数进行递归复制。"
  },
  {
    "q": "以下哪个命令用于移动或重命名文件？",
    "level": "基础",
    "options": [
      "mv",
      "cp",
      "rm",
      "ln"
    ],
    "answer": 0,
    "explain": "mv (Move) 命令既可用于移动文件/目录到另一个位置，也可用于在同一目录下重命名文件。"
  },
  {
    "q": "以下哪个命令用于删除文件或目录？",
    "level": "基础",
    "options": [
      "rmdir",
      "rm",
      "mv",
      "rm -r"
    ],
    "answer": 1,
    "explain": "rm (Remove) 命令用于删除文件，删除目录需加-r参数递归删除，-f参数强制删除不提示。"
  },
  {
    "q": "以下哪个命令用于创建空目录？",
    "level": "基础",
    "options": [
      "touch",
      "rmdir",
      "mkdir",
      "cat"
    ],
    "answer": 2,
    "explain": "mkdir (Make Directory) 命令用于创建新目录，-p参数可递归创建多级目录如mkdir -p a/b/c。"
  },
  {
    "q": "以下哪个命令用于删除空目录？",
    "level": "基础",
    "options": [
      "rm",
      "rm -f",
      "mkdir",
      "rmdir"
    ],
    "answer": 3,
    "explain": "rmdir (Remove Directory) 命令只能删除空目录，删除非空目录需使用rm -r命令。"
  },
  {
    "q": "chmod命令用于修改文件的什么属性？",
    "level": "基础",
    "options": [
      "权限",
      "所属组",
      "所有者",
      "大小"
    ],
    "answer": 0,
    "explain": "chmod (Change Mode) 命令用于修改文件或目录的访问权限，支持数字法(如755)和符号法(如u+x)两种设置方式。"
  },
  {
    "q": "以下哪个命令用于修改文件所有者？",
    "level": "基础",
    "options": [
      "chmod",
      "chown",
      "chgrp",
      "chage"
    ],
    "answer": 1,
    "explain": "chown (Change Owner) 命令用于修改文件的所有者和所属组，格式为chown 用户:组 文件。"
  },
  {
    "q": "以下哪个命令用于在文件中搜索指定字符串？",
    "level": "基础",
    "options": [
      "find",
      "locate",
      "grep",
      "cat"
    ],
    "answer": 2,
    "explain": "grep (Global Regular Expression Print) 命令用于在文本文件中搜索匹配指定模式的行，支持正则表达式。"
  },
  {
    "q": "以下哪个命令用于在文件系统中查找文件？",
    "level": "基础",
    "options": [
      "grep",
      "wc",
      "cat",
      "find"
    ],
    "answer": 3,
    "explain": "find命令用于在指定目录下递归查找符合条件的文件，支持按名称、大小、时间、权限等多种条件搜索。"
  },
  {
    "q": "以下哪个命令用于打包多个文件或目录？",
    "level": "基础",
    "options": [
      "tar",
      "gzip",
      "zip",
      "compress"
    ],
    "answer": 0,
    "explain": "tar命令用于将多个文件或目录打包成一个归档文件，常与压缩命令结合使用如tar -czvf产生.tar.gz文件。"
  },
  {
    "q": "以下哪个命令用于压缩单个文件？",
    "level": "基础",
    "options": [
      "tar",
      "gzip",
      "zip",
      "rar"
    ],
    "answer": 1,
    "explain": "gzip命令用于压缩单个文件，压缩后产生.gz后缀的压缩文件，原文件会被删除，配合tar使用可压缩目录。"
  },
  {
    "q": "以下哪个命令用于创建ZIP格式压缩包？",
    "level": "基础",
    "options": [
      "gzip",
      "tar",
      "zip",
      "bzip2"
    ],
    "answer": 2,
    "explain": "zip命令用于创建ZIP格式的压缩包，可压缩多个文件和目录，Windows和Linux都原生支持该格式。"
  },
  {
    "q": "以下哪个命令用于解压ZIP格式压缩包？",
    "level": "基础",
    "options": [
      "gunzip",
      "tar",
      "unrar",
      "unzip"
    ],
    "answer": 3,
    "explain": "unzip命令用于解压.zip格式的压缩包，-l参数可列出压缩包内容而不解压。"
  },
  {
    "q": "以下哪个命令用于显示文件全部内容？",
    "level": "基础",
    "options": [
      "cat",
      "less",
      "more",
      "head"
    ],
    "answer": 0,
    "explain": "cat (Concatenate) 命令用于显示文件全部内容到终端，适合查看小文件，也可用于合并多个文件。"
  },
  {
    "q": "以下哪个命令用于分页显示文件内容（只能向下翻页）？",
    "level": "基础",
    "options": [
      "cat",
      "more",
      "less",
      "tail"
    ],
    "answer": 1,
    "explain": "more命令用于分页显示文件内容，按空格翻下一页、按回车翻下一行，但不支持向上翻页。"
  },
  {
    "q": "以下哪个命令用于分页显示文件内容（支持上下翻页）？",
    "level": "基础",
    "options": [
      "cat",
      "more",
      "less",
      "head"
    ],
    "answer": 2,
    "explain": "less命令是more的增强版，支持PageUp/PageDown上下翻页，支持搜索，功能更灵活，查看大文件效率更高。"
  },
  {
    "q": "以下哪个命令用于查看文件开头若干行？",
    "level": "基础",
    "options": [
      "tail",
      "top",
      "cat",
      "head"
    ],
    "answer": 3,
    "explain": "head命令用于显示文件开头部分，默认显示前10行，-n参数可指定行数如head -20 file。"
  },
  {
    "q": "以下哪个命令用于查看文件末尾若干行或实时追踪日志？",
    "level": "基础",
    "options": [
      "tail",
      "head",
      "cat",
      "grep"
    ],
    "answer": 0,
    "explain": "tail命令用于显示文件末尾内容，默认最后10行，-f参数可实时追踪文件新增内容，常用于查看日志。"
  },
  {
    "q": "以下哪个命令用于统计文件的行数、单词数、字符数？",
    "level": "基础",
    "options": [
      "cut",
      "wc",
      "sort",
      "uniq"
    ],
    "answer": 1,
    "explain": "wc (Word Count) 命令用于统计文件信息，-l统计行数、-w统计单词数、-c统计字节数、-m统计字符数。"
  },
  {
    "q": "以下哪个命令用于按列提取文本内容？",
    "level": "基础",
    "options": [
      "wc",
      "sort",
      "cut",
      "paste"
    ],
    "answer": 2,
    "explain": "cut命令用于按列切割文本，-d指定分隔符、-f指定要提取的字段，常用于处理CSV等格式文本。"
  },
  {
    "q": "以下哪个命令用于对文本行进行排序？",
    "level": "基础",
    "options": [
      "wc",
      "uniq",
      "cut",
      "sort"
    ],
    "answer": 3,
    "explain": "sort命令用于对文本内容按行排序，-n按数值排序、-r倒序排序、-u去重排序、-t指定分隔符-k指定列。"
  },
  {
    "q": "以下哪个命令用于去除文本中连续重复的行？",
    "level": "基础",
    "options": [
      "uniq",
      "sort",
      "cut",
      "tr"
    ],
    "answer": 0,
    "explain": "uniq命令用于去除连续重复的行，通常先通过sort排序后再使用，-c可统计重复次数、-d只显示重复行。"
  },
  {
    "q": "以下哪个命令可以同时在屏幕显示内容并保存到文件？",
    "level": "基础",
    "options": [
      "cat",
      "tee",
      "more",
      "wc"
    ],
    "answer": 1,
    "explain": "tee命令从标准输入读取数据，同时输出到标准输出和指定文件，相当于分流，如ls | tee out.txt。"
  },
  {
    "q": "以下哪个命令用于查找命令文件所在位置？",
    "level": "基础",
    "options": [
      "whereis",
      "find",
      "which",
      "locate"
    ],
    "answer": 2,
    "explain": "which命令用于查找PATH环境变量中指定的可执行命令的绝对路径，只显示第一个匹配结果。"
  },
  {
    "q": "以下哪个命令用于查找命令的二进制、源码和man手册位置？",
    "level": "基础",
    "options": [
      "which",
      "grep",
      "find",
      "whereis"
    ],
    "answer": 3,
    "explain": "whereis命令用于查找指定命令的二进制文件、源代码文件和man手册页的位置，搜索范围比which更广。"
  },
  {
    "q": "以下哪个命令用于查看命令的帮助手册？",
    "level": "基础",
    "options": [
      "man",
      "help",
      "info",
      "whatis"
    ],
    "answer": 0,
    "explain": "man (Manual) 命令用于查看命令的详细帮助手册，分为多个章节，1是用户命令、5是配置文件、8是系统管理命令。"
  },
  {
    "q": "以下哪个命令用于查看命令的info格式文档？",
    "level": "基础",
    "options": [
      "man",
      "info",
      "help",
      "apropos"
    ],
    "answer": 1,
    "explain": "info命令提供GNU风格的超文本文档，内容比man更详尽，支持节点跳转，适合查看GNU工具。"
  },
  {
    "q": "以下哪个命令用于切换到其他用户身份？",
    "level": "基础",
    "options": [
      "sudo",
      "passwd",
      "su",
      "chsh"
    ],
    "answer": 2,
    "explain": "su (Switch User) 命令用于切换用户身份，su - 用户名会完全切换环境变量，不加-则保留当前环境。"
  },
  {
    "q": "以下哪个命令用于以超级管理员权限执行单个命令？",
    "level": "基础",
    "options": [
      "su",
      "passwd",
      "su -",
      "sudo"
    ],
    "answer": 3,
    "explain": "sudo (SuperUser DO) 命令允许授权用户以root或其他用户身份执行命令，需通过/etc/sudoers配置，输入当前用户密码。"
  },
  {
    "q": "以下哪个命令用于修改用户密码？",
    "level": "基础",
    "options": [
      "passwd",
      "useradd",
      "chmod",
      "chage"
    ],
    "answer": 0,
    "explain": "passwd命令用于修改用户密码，root可修改任何用户密码，普通用户只能修改自己的密码且需符合复杂度要求。"
  },
  {
    "q": "以下哪个命令用于创建新用户？",
    "level": "基础",
    "options": [
      "userdel",
      "useradd",
      "usermod",
      "passwd"
    ],
    "answer": 1,
    "explain": "useradd命令用于创建新用户账户，-m自动创建家目录、-s指定登录shell、-g指定主组、-G指定附加组。"
  },
  {
    "q": "以下哪个命令用于删除用户？",
    "level": "基础",
    "options": [
      "useradd",
      "usermod",
      "userdel",
      "groupdel"
    ],
    "answer": 2,
    "explain": "userdel命令用于删除用户账户，加-r参数可同时删除用户的家目录和邮件池，推荐userdel -r 用户名。"
  },
  {
    "q": "以下哪个命令用于创建用户组？",
    "level": "基础",
    "options": [
      "groupmod",
      "useradd",
      "groupdel",
      "groupadd"
    ],
    "answer": 3,
    "explain": "groupadd命令用于创建新的用户组，-g可指定GID，组信息保存在/etc/group文件中。"
  },
  {
    "q": "Linux文件系统中根目录用什么符号表示？",
    "level": "基础",
    "options": [
      "/",
      "~",
      ".",
      ".."
    ],
    "answer": 0,
    "explain": "Linux文件系统采用单根树形结构，根目录用/表示，所有文件和目录都在/之下，没有Windows的盘符概念。"
  },
  {
    "q": "当前用户的家目录通常用什么符号表示？",
    "level": "基础",
    "options": [
      "/",
      "~",
      ".",
      ".."
    ],
    "answer": 1,
    "explain": "波浪号~表示当前用户的家目录，root用户家目录是/root，普通用户是/home/用户名，也可~用户名表示指定用户的家目录。"
  },
  {
    "q": "当前目录用什么符号表示？",
    "level": "基础",
    "options": [
      "..",
      "/",
      ".",
      "~"
    ],
    "answer": 2,
    "explain": "单个点.表示当前工作目录，常用于指定当前路径下的文件，如./script.sh表示执行当前目录下的脚本。"
  },
  {
    "q": "上级目录用什么符号表示？",
    "level": "基础",
    "options": [
      ".",
      "~",
      "/",
      ".."
    ],
    "answer": 3,
    "explain": "两个点..表示上一级目录，cd ..可返回上级目录，嵌套如../..表示上两级目录。"
  },
  {
    "q": "Linux文件权限中rwx各代表什么？",
    "level": "基础",
    "options": [
      "读/写/执行",
      "读/执行/写",
      "写/读/执行",
      "执行/写/读"
    ],
    "answer": 0,
    "explain": "r(read)=读权限、w(write)=写权限、x(execute)=执行权限，对于目录x表示可进入该目录。"
  },
  {
    "q": "数字权限755对应的符号权限是？",
    "level": "基础",
    "options": [
      "rwxrwxrwx",
      "rwxr-xr-x",
      "rw-r--r--",
      "rwxrwxr-x"
    ],
    "answer": 1,
    "explain": "7=4+2+1=rwx，5=4+0+1=r-x，所以755对应所有者rwx、组r-x、其他用户r-x。"
  },
  {
    "q": "数字权限644对应的符号权限是？",
    "level": "基础",
    "options": [
      "r--r--r--",
      "rwxr-xr-x",
      "rw-r--r--",
      "rw-rw-rw-"
    ],
    "answer": 2,
    "explain": "6=4+2+0=rw-，4=4+0+0=r--，所以644对应所有者rw-、组r--、其他用户r--，普通文件默认权限。"
  },
  {
    "q": "以下哪个命令用于查看当前进程快照？",
    "level": "基础",
    "options": [
      "top",
      "jobs",
      "kill",
      "ps"
    ],
    "answer": 3,
    "explain": "ps (Process Status) 命令用于查看系统当前进程的快照信息，常用ps aux或ps -ef查看所有进程。"
  },
  {
    "q": "以下哪个命令用于实时动态显示进程信息？",
    "level": "基础",
    "options": [
      "top",
      "ps",
      "kill",
      "pstree"
    ],
    "answer": 0,
    "explain": "top命令用于实时动态显示系统进程状态、CPU、内存等资源使用情况，按q退出，P按CPU排序、M按内存排序。"
  },
  {
    "q": "以下哪个命令用于终止进程？",
    "level": "基础",
    "options": [
      "ps",
      "kill",
      "top",
      "nice"
    ],
    "answer": 1,
    "explain": "kill命令用于向进程发送信号终止进程，默认发送15(SIGTERM)优雅终止，-9(SIGKILL)强制杀死不可被忽略。"
  },
  {
    "q": "以下哪个命令用于查看网络接口配置信息（传统命令）？",
    "level": "基础",
    "options": [
      "ping",
      "ip",
      "ifconfig",
      "netstat"
    ],
    "answer": 2,
    "explain": "ifconfig是传统的网络接口配置查看命令，属于net-tools包，新系统已被ip命令取代，需手动安装net-tools。"
  },
  {
    "q": "以下哪个是新一代网络配置命令？",
    "level": "基础",
    "options": [
      "ifconfig",
      "arp",
      "route",
      "ip"
    ],
    "answer": 3,
    "explain": "ip命令是iproute2包提供的新一代网络管理工具，可查看IP(ip addr)、路由(ip route)、链路(ip link)等，功能强大。"
  },
  {
    "q": "以下哪个命令用于测试网络连通性？",
    "level": "基础",
    "options": [
      "ping",
      "netstat",
      "ifconfig",
      "telnet"
    ],
    "answer": 0,
    "explain": "ping命令通过发送ICMP ECHO_REQUEST包测试与目标主机的网络连通性，-c指定发送次数如ping -c 4 baidu.com。"
  },
  {
    "q": "以下哪个命令用于查看网络连接、路由表、接口统计等信息？",
    "level": "基础",
    "options": [
      "ping",
      "netstat",
      "traceroute",
      "host"
    ],
    "answer": 1,
    "explain": "netstat命令用于查看网络连接状态、路由表、接口统计等，-tulnp查看TCP/UDP监听端口及对应进程，已逐步被ss命令替代。"
  },
  {
    "q": "RPM包管理中哪个命令用于安装软件包？",
    "level": "基础",
    "options": [
      "rpm -q",
      "rpm -e",
      "rpm -i",
      "rpm -U"
    ],
    "answer": 2,
    "explain": "rpm -i (Install) 用于安装RPM软件包，-v显示详情、-h显示进度条，常组合为rpm -ivh 包名.rpm。"
  },
  {
    "q": "RPM包管理中哪个命令用于卸载已安装的软件包？",
    "level": "基础",
    "options": [
      "rpm -F",
      "rpm -i",
      "rpm -q",
      "rpm -e"
    ],
    "answer": 3,
    "explain": "rpm -e (Erase) 用于卸载已安装的RPM软件包，--nodeps可忽略依赖强制卸载（不推荐）。"
  },
  {
    "q": "YUM包管理中哪个命令用于安装软件？",
    "level": "基础",
    "options": [
      "yum install",
      "yum remove",
      "yum update",
      "yum search"
    ],
    "answer": 0,
    "explain": "yum install命令用于从配置的YUM仓库安装软件包，自动解决依赖关系，-y参数对所有提问自动回答yes。"
  },
  {
    "q": "YUM包管理中哪个命令用于卸载已安装的软件？",
    "level": "基础",
    "options": [
      "yum install",
      "yum remove",
      "yum clean",
      "yum list"
    ],
    "answer": 1,
    "explain": "yum remove命令用于卸载已安装的软件包，会一并卸载依赖该软件的其他包，使用时需注意确认。"
  },
  {
    "q": "Debian/Ubuntu系中哪个命令用于安装软件包？",
    "level": "基础",
    "options": [
      "apt remove",
      "dpkg -i",
      "apt install",
      "apt-cache search"
    ],
    "answer": 2,
    "explain": "apt install是Debian/Ubuntu系的安装命令，从APT仓库下载并安装软件，自动解决依赖关系，替代老的apt-get install。"
  },
  {
    "q": "Debian/Ubuntu系中哪个命令用于安装本地.deb包？",
    "level": "基础",
    "options": [
      "apt-get",
      "apt install",
      "dpkg -r",
      "dpkg -i"
    ],
    "answer": 3,
    "explain": "dpkg -i用于安装本地的.deb格式软件包，不会自动解决依赖，依赖缺失可随后apt install -f修复。"
  },
  {
    "q": "以下哪个命令用于显示系统内核信息？",
    "level": "基础",
    "options": [
      "uname",
      "hostname",
      "uptime",
      "date"
    ],
    "answer": 0,
    "explain": "uname命令用于显示系统内核信息，-a显示全部信息包括内核名称、主机名、内核版本、架构、发行版等。"
  },
  {
    "q": "以下哪个命令用于显示或设置主机名？",
    "level": "基础",
    "options": [
      "uname",
      "hostname",
      "host",
      "hostnamectl"
    ],
    "answer": 1,
    "explain": "hostname命令显示当前主机名，CentOS7/Ubuntu16+推荐使用hostnamectl set-hostname永久修改主机名。"
  },
  {
    "q": "以下哪个命令用于查看系统运行时间和负载？",
    "level": "基础",
    "options": [
      "df",
      "free",
      "uptime",
      "du"
    ],
    "answer": 2,
    "explain": "uptime命令显示系统已运行时间、当前登录用户数、以及过去1分钟、5分钟、15分钟的平均负载。"
  },
  {
    "q": "以下哪个命令用于查看内存使用情况？",
    "level": "基础",
    "options": [
      "top",
      "df",
      "du",
      "free"
    ],
    "answer": 3,
    "explain": "free命令用于查看系统物理内存和交换分区的使用情况，-h以人类可读单位(GB/MB)显示，-m以MB显示。"
  },
  {
    "q": "以下哪个命令用于查看磁盘空间使用情况？",
    "level": "基础",
    "options": [
      "df",
      "du",
      "free",
      "mount"
    ],
    "answer": 0,
    "explain": "df (Disk Free) 命令用于查看文件系统磁盘空间整体使用情况，-h自动选择合适单位显示，-T显示文件系统类型。"
  },
  {
    "q": "以下哪个命令用于查看目录或文件占用的磁盘空间？",
    "level": "基础",
    "options": [
      "df",
      "du",
      "free",
      "ls"
    ],
    "answer": 1,
    "explain": "du (Disk Usage) 命令用于统计目录或文件实际占用的磁盘空间，-h人类可读、-s只显示总计、--max-depth指定深度。"
  },
  {
    "q": "Vim编辑器中从正常模式进入插入模式的按键是？",
    "level": "基础",
    "options": [
      "Esc",
      ":wq",
      "i",
      "dd"
    ],
    "answer": 2,
    "explain": "在Vim正常模式下按i键可在当前光标位置前进入插入模式，此外a(光标后)、o(下一行)、I(行首)、A(行尾)也可进入插入模式。"
  },
  {
    "q": "Vim编辑器中保存并退出的命令是？",
    "level": "基础",
    "options": [
      ":q",
      "ZZ",
      ":q!",
      ":wq"
    ],
    "answer": 3,
    "explain": ":wq在底行模式下保存(write)并退出(quit)，也可用:x或正常模式下ZZ，:wq!强制保存退出（只读文件需权限）。"
  },
  {
    "q": "Vim编辑器中强制退出不保存的命令是？",
    "level": "基础",
    "options": [
      ":q!",
      ":q",
      ":wq",
      "ZQ"
    ],
    "answer": 0,
    "explain": ":q!强制退出Vim不保存任何修改，正常模式下ZQ同样效果，:q仅在无修改时才能退出。"
  },
  {
    "q": "Shell脚本的第一行通常写什么指定解释器？",
    "level": "基础",
    "options": [
      "//bash",
      "#!/bin/bash",
      "@echo off",
      "import bash"
    ],
    "answer": 1,
    "explain": "#!称为Shebang，后面跟解释器的绝对路径，#!/bin/bash指定用Bash解释，执行时chmod +x后可直接运行。"
  },
  {
    "q": "执行Shell脚本时以下哪种方式不需要脚本有可执行权限？",
    "level": "基础",
    "options": [
      "./script.sh",
      "/path/script.sh",
      "bash script.sh",
      "script.sh"
    ],
    "answer": 2,
    "explain": "bash script.sh方式将脚本作为bash命令的参数运行，不需要脚本有x权限，而./方式必须先chmod +x。"
  },
  {
    "q": "系统日志通常存放在哪个目录？",
    "level": "基础",
    "options": [
      "/etc",
      "/var/lib",
      "/tmp",
      "/var/log"
    ],
    "answer": 3,
    "explain": "/var/log目录是Linux系统默认的日志存放目录，包含系统日志/var/log/messages、安全日志secure、内核日志dmesg等。"
  },
  {
    "q": "Linux系统启动流程中，BIOS之后第一个被加载的是？",
    "level": "基础",
    "options": [
      "MBR",
      "GRUB",
      "init",
      "内核"
    ],
    "answer": 0,
    "explain": "传统BIOS启动顺序为：BIOS自检→加载MBR(主引导记录)→GRUB引导加载器→加载内核Kernel→运行init/systemd。"
  },
  {
    "q": "Systemd系统中用于管理服务的主要命令是？",
    "level": "基础",
    "options": [
      "service",
      "systemctl",
      "chkconfig",
      "init"
    ],
    "answer": 1,
    "explain": "systemctl是Systemd系统的核心服务管理命令，可start/stop/restart/status/enable/disable服务，统一了service和chkconfig功能。"
  },
  {
    "q": "设置环境变量永久生效，通常修改哪个用户级文件？",
    "level": "基础",
    "options": [
      "/etc/profile",
      "/etc/bashrc",
      "~/.bashrc",
      "~/.bash_history"
    ],
    "answer": 2,
    "explain": "用户级环境变量永久生效可修改~/.bashrc或~/.bash_profile，/etc/profile是全局系统级对所有用户生效，修改后需source。"
  },
  {
    "q": "以下哪种方式创建的链接可以跨分区、指向目录？",
    "level": "基础",
    "options": [
      "硬链接",
      "两种都不可以",
      "两种都可以",
      "软链接"
    ],
    "answer": 3,
    "explain": "软链接(符号链接)类似Windows快捷方式，可以跨分区、指向目录，删除原文件后软链接失效，ln -s 原文件 链接名 创建。"
  },
  {
    "q": "硬链接的特点以下哪个正确？",
    "level": "基础",
    "options": [
      "inode与原文件相同",
      "可以指向目录",
      "跨分区",
      "删除原文件链接失效"
    ],
    "answer": 0,
    "explain": "硬链接通过ln创建，与原文件共享同一个inode，不能跨分区、不能对目录创建、删除原文件硬链接仍可访问内容。"
  },
  {
    "q": "Linux中标准输出重定向到文件用什么符号？",
    "level": "基础",
    "options": [
      "<",
      ">",
      "|",
      "&"
    ],
    "answer": 1,
    "explain": ">符号用于将标准输出(stdout)重定向到文件并覆盖原有内容，>>是追加不覆盖，2>是重定向错误输出。"
  },
  {
    "q": "Linux中将一个命令的输出作为另一个命令的输入用什么？",
    "level": "基础",
    "options": [
      ">",
      "&&",
      "|",
      "||"
    ],
    "answer": 2,
    "explain": "|管道符将前一个命令的标准输出作为后一个命令的标准输入，如cat file | grep keyword是常用组合。"
  },
  {
    "q": "Shell脚本中定义变量的正确方式是？",
    "level": "进阶",
    "options": [
      "$name = value",
      "name = value",
      "var $name=value",
      "name=value"
    ],
    "answer": 3,
    "explain": "Shell中变量定义等号两边不能有空格，格式为name=value，引用时用$name或${name}，习惯上环境变量大写、局部变量小写。"
  },
  {
    "q": "Shell脚本中读取位置参数$1、$2，$#表示什么？",
    "level": "进阶",
    "options": [
      "参数个数",
      "所有参数",
      "脚本名",
      "最后一个参数"
    ],
    "answer": 0,
    "explain": "$#表示传递给脚本或函数的位置参数的个数，$0是脚本名，$*和$@是所有参数，$$是当前进程PID，$?是上一命令退出状态。"
  },
  {
    "q": "Shell条件判断中if的语法正确格式是？",
    "level": "进阶",
    "options": [
      "if (条件); then",
      "if [ 条件 ]; then",
      "if {条件}; do",
      "if 条件 then ; fi"
    ],
    "answer": 1,
    "explain": "if条件判断标准语法是if [ 条件 ]; then ... fi，[ ]是test命令的简写，内部两边必须有空格，-eq等于、-gt大于、-d是目录、-f是文件。"
  },
  {
    "q": "Shell中for循环遍历数组的正确写法？",
    "level": "进阶",
    "options": [
      "for i to 10 do",
      "for($i=0;$i<10;$i++)",
      "for i in ${arr[@]}; do ... done",
      "foreach($arr as $i)"
    ],
    "answer": 2,
    "explain": "for i in ${arr[@]}; do ... done是Bash遍历数组标准写法，C风格for((i=0;i<10;i++))也支持，需双方括号。"
  },
  {
    "q": "Shell脚本中定义函数的正确方式？",
    "level": "进阶",
    "options": [
      "func name() {}",
      "sub name {}",
      "def name(): ...",
      "function name() { ... }"
    ],
    "answer": 3,
    "explain": "Shell函数定义语法为function 函数名() { 函数体; }或直接函数名() { ... }，function关键字可选，参数通过$1$2传递不写在括号里。"
  },
  {
    "q": "awk命令中用于指定字段分隔符的选项是？",
    "level": "进阶",
    "options": [
      "-F",
      "-f",
      "-v",
      "-O"
    ],
    "answer": 0,
    "explain": "awk -F指定字段分隔符，如awk -F: '{print $1}' /etc/passwd以冒号分隔打印第1列，默认分隔符是空白字符。"
  },
  {
    "q": "awk中内置变量NR表示什么？",
    "level": "进阶",
    "options": [
      "字段数",
      "当前记录数(行号)",
      "当前文件名",
      "字段分隔符"
    ],
    "answer": 1,
    "explain": "awk内置变量NR=Number of Record表示当前处理的是第几条记录(行号)，NF是字段数，$0是整行内容，FS是输入分隔符。"
  },
  {
    "q": "sed命令中实现替换功能的命令是？",
    "level": "进阶",
    "options": [
      "p",
      "d",
      "s",
      "a"
    ],
    "answer": 2,
    "explain": "sed的s(Substitute)命令用于替换，格式sed 's/原字符串/新字符串/g'，g代表全局替换否则只替换每行第一个，定界符/可换成其他字符。"
  },
  {
    "q": "sed中删除第3到第5行的命令？",
    "level": "进阶",
    "options": [
      "sed '3,5rm' file",
      "sed '3-5d' file",
      "sed '/3,5/d' file",
      "sed '3,5d' file"
    ],
    "answer": 3,
    "explain": "sed '3,5d' file表示删除(delete)第3到第5行输出到屏幕，sed -i '3,5d' file直接修改文件内容。"
  },
  {
    "q": "LVM中用于创建逻辑卷的命令是？",
    "level": "进阶",
    "options": [
      "lvcreate",
      "pvcreate",
      "vgcreate",
      "lvextend"
    ],
    "answer": 0,
    "explain": "LVM三层结构：pvcreate创建物理卷→vgcreate创建卷组→lvcreate创建逻辑卷，lvcreate -L大小 -n名称 卷组名。"
  },
  {
    "q": "LVM中用于扩展逻辑卷大小的命令是？",
    "level": "进阶",
    "options": [
      "lvcreate",
      "lvextend",
      "lvreduce",
      "vgextend"
    ],
    "answer": 1,
    "explain": "lvextend用于扩展逻辑卷容量，-L +大小如lvextend -L +10G /dev/vg/root，扩展后还需用resize2fs或xfs_growfs扩容文件系统。"
  },
  {
    "q": "RAID1表示的是什么级别？",
    "level": "进阶",
    "options": [
      "条带化无冗余",
      "条带+校验",
      "镜像",
      "条带+双校验"
    ],
    "answer": 2,
    "explain": "RAID0是条带化性能最高无冗余，RAID1是镜像至少2块盘100%冗余，RAID5是条带+分布式校验至少3块盘，RAID6是双校验至少4块盘。"
  },
  {
    "q": "RAID5至少需要几块磁盘？",
    "level": "进阶",
    "options": [
      "2",
      "5",
      "4",
      "3"
    ],
    "answer": 3,
    "explain": "RAID5采用条带化+分布式奇偶校验，数据和校验信息分布在所有磁盘上，至少需要3块磁盘，可容忍1块盘损坏。"
  },
  {
    "q": "传统MBR分区中用于磁盘分区的交互式命令是？",
    "level": "进阶",
    "options": [
      "fdisk",
      "parted",
      "mkfs",
      "mount"
    ],
    "answer": 0,
    "explain": "fdisk是传统MBR分区的交互式分区工具，支持最多4个主分区或3主1扩展分区内多逻辑分区，n新建、d删除、p查看、w保存、q不保存退出。"
  },
  {
    "q": "支持GPT大磁盘分区的命令是？",
    "level": "进阶",
    "options": [
      "fdisk",
      "parted",
      "sfdisk",
      "cfdisk"
    ],
    "answer": 1,
    "explain": "parted支持GPT分区表和大于2TB的大磁盘，同时也支持MBR，fdisk不支持GPT和2TB+大分区，parted支持命令行非交互模式适合脚本。"
  },
  {
    "q": "创建ext4文件系统的命令是？",
    "level": "进阶",
    "options": [
      "mount",
      "mkfs.xfs",
      "mkfs.ext4",
      "fdisk"
    ],
    "answer": 2,
    "explain": "mkfs.ext4或mkfs -t ext4用于在分区上创建ext4文件系统（格式化），mkfs.xfs创建XFS，-f参数可覆盖已有文件系统（慎用）。"
  },
  {
    "q": "CentOS7默认的文件系统类型是？",
    "level": "进阶",
    "options": [
      "ext4",
      "btrfs",
      "ext3",
      "xfs"
    ],
    "answer": 3,
    "explain": "CentOS7/RHEL7默认使用XFS作为默认文件系统，相比ext4支持更大的单个文件和分区，元数据日志性能更好，适合大数据场景。"
  },
  {
    "q": "将/dev/sdb1挂载到/data目录的命令？",
    "level": "进阶",
    "options": [
      "mount /dev/sdb1 /data",
      "mount /data /dev/sdb1",
      "mount -a /dev/sdb1",
      "umount /dev/sdb1"
    ],
    "answer": 0,
    "explain": "mount命令格式为mount 设备 挂载点，即mount /dev/sdb1 /data，挂载点目录必须先存在，umount用于卸载。"
  },
  {
    "q": "实现开机自动挂载需要编辑哪个配置文件？",
    "level": "进阶",
    "options": [
      "/etc/mtab",
      "/etc/fstab",
      "/etc/grub.conf",
      "/etc/inittab"
    ],
    "answer": 1,
    "explain": "/etc/fstab是开机自动挂载配置文件，6个字段分别是：设备、挂载点、文件系统类型、挂载参数、dump备份、fsck检查顺序，mount -a可立即生效测试。"
  },
  {
    "q": "inode中存储的内容不包括？",
    "level": "进阶",
    "options": [
      "文件权限",
      "文件大小",
      "文件名",
      "创建时间"
    ],
    "answer": 2,
    "explain": "inode存储文件元数据：权限、所有者、大小、时间戳、block指针等，但文件名存放在目录的directory entry中而非inode，所以硬链接可多个文件共享同一inode。"
  },
  {
    "q": "向进程发送强制杀死信号的信号编号是？",
    "level": "进阶",
    "options": [
      "15",
      "19",
      "1",
      "9"
    ],
    "answer": 3,
    "explain": "信号9即SIGKILL是强制终止信号不可被捕获忽略，信号15 SIGTERM是默认优雅终止可被处理，信号1 HUP挂起重载，信号19 SIGSTOP暂停。"
  },
  {
    "q": "调整进程优先级的命令nice范围是？",
    "level": "进阶",
    "options": [
      "-20到19",
      "0到99",
      "-10到10",
      "1到100"
    ],
    "answer": 0,
    "explain": "nice值范围-20到19，数值越小优先级越高，默认0，nice -n -10 command启动时设置，renice -5 -p PID修改已运行进程，只有root可设负值。"
  },
  {
    "q": "修改已运行进程优先级的命令是？",
    "level": "进阶",
    "options": [
      "nice",
      "renice",
      "top",
      "ps"
    ],
    "answer": 1,
    "explain": "nice用于启动新进程时指定优先级，renice用于修改已在运行进程的nice值，renice 新值 -p PID，也可指定用户或组批量调整。"
  },
  {
    "q": "Systemd服务单元文件后缀名为？",
    "level": "进阶",
    "options": [
      ".conf",
      ".init",
      ".service",
      ".unit"
    ],
    "answer": 2,
    "explain": "Systemd单元文件根据类型有不同后缀：.service服务、.socket套接字、.target目标组、.timer定时、.mount挂载、.path路径监听，存放在/usr/lib/systemd/system和/etc/systemd/system。"
  },
  {
    "q": "设置服务开机自启的systemctl命令？",
    "level": "进阶",
    "options": [
      "systemctl start",
      "systemctl restart",
      "systemctl status",
      "systemctl enable"
    ],
    "answer": 3,
    "explain": "systemctl enable 服务名设置开机自启（创建符号链接），disable取消自启，is-enabled查看是否自启，start是当前启动不影响开机。"
  },
  {
    "q": "CentOS7中配置静态IP通常编辑哪个网卡配置文件？",
    "level": "进阶",
    "options": [
      "/etc/sysconfig/network-scripts/ifcfg-ens33",
      "/etc/network/interfaces",
      "/etc/resolv.conf",
      "/etc/hosts"
    ],
    "answer": 0,
    "explain": "RHEL/CentOS网卡配置文件在/etc/sysconfig/network-scripts/ifcfg-网卡名，BOOTPROTO=static，ONBOOT=yes，指定IPADDR、NETMASK、GATEWAY、DNS1等。"
  },
  {
    "q": "Debian/Ubuntu中DNS服务器配置文件是？",
    "level": "进阶",
    "options": [
      "/etc/hosts",
      "/etc/resolv.conf",
      "/etc/hostname",
      "/etc/nsswitch.conf"
    ],
    "answer": 1,
    "explain": "/etc/resolv.conf是DNS解析配置文件，nameserver指定DNS服务器IP，search指定搜索域名，注意该文件在使用NetworkManager时可能被自动覆盖。"
  },
  {
    "q": "iptables中用于配置NAT地址伪装的表是？",
    "level": "进阶",
    "options": [
      "filter表",
      "mangle表",
      "nat表",
      "raw表"
    ],
    "answer": 2,
    "explain": "iptables四张表：filter默认过滤INPUT/FORWARD/OUTPUT，nat表做SNAT/DNAT/MASQUERADE地址转换，mangle修改数据包标记，raw处理连接跟踪前。"
  },
  {
    "q": "iptables中允许来自192.168.1.0/24访问22端口的规则？",
    "level": "进阶",
    "options": [
      "iptables -F INPUT 192.168.1.0/24 ssh ACCEPT",
      "iptables -A OUTPUT -s 192.168.1.0/24 --dport 22 ACCEPT",
      "iptables -A FORWARD -d 192.168.1.0/24 --port 22 -j ALLOW",
      "iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 22 -j ACCEPT"
    ],
    "answer": 3,
    "explain": "iptables语法：-A追加规则、-s源地址、-d目的地址、-p协议tcp/udp、--dport目标端口、--sport源端口、-j动作ACCEPT/DROP/REJECT，注意--dport需配合-p使用。"
  },
  {
    "q": "SSH服务配置文件路径是？",
    "level": "进阶",
    "options": [
      "/etc/ssh/sshd_config",
      "/etc/ssh/ssh_config",
      "~/.ssh/config",
      "/etc/ssh/known_hosts"
    ],
    "answer": 0,
    "explain": "服务端SSH配置文件是/etc/ssh/sshd_config（注意末尾d），修改后需systemctl restart sshd，客户端配置是/etc/ssh/ssh_config或用户级~/.ssh/config。"
  },
  {
    "q": "SELinux三种模式不包括？",
    "level": "进阶",
    "options": [
      "enforcing",
      "audit",
      "disabled",
      "permissive"
    ],
    "answer": 1,
    "explain": "SELinux三种模式：enforcing强制模式违反即拦截并记录、permissive宽容模式只记录不拦截用于调试、disabled完全禁用，配置文件/etc/selinux/config。"
  },
  {
    "q": "临时切换SELinux为宽容模式的命令？",
    "level": "进阶",
    "options": [
      "getenforce",
      "setenforce 1",
      "setenforce 0",
      "selinux=0"
    ],
    "answer": 2,
    "explain": "setenforce 0临时设为Permissive宽容模式，setenforce 1设为Enforcing强制模式，重启失效，永久修改需改/etc/selinux/config，getenforce查看当前模式。"
  },
  {
    "q": "PAM是什么的缩写？",
    "level": "进阶",
    "options": [
      "进程访问管理",
      "密码认证模块",
      "特权访问模块",
      "可插拔认证模块"
    ],
    "answer": 3,
    "explain": "PAM(Pluggable Authentication Modules)是可插拔认证模块体系，将认证机制与应用程序解耦，配置文件在/etc/pam.d/，提供auth/account/password/session四种管理类型。"
  },
  {
    "q": "sudo配置文件路径是？",
    "level": "进阶",
    "options": [
      "/etc/sudoers",
      "/etc/sudo.conf",
      "/etc/passwd",
      "/etc/shadow"
    ],
    "answer": 0,
    "explain": "sudo配置文件是/etc/sudoers，推荐使用visudo命令编辑（自带语法检查），可配置用户/组的主机、可执行命令、是否需要密码等权限。"
  },
  {
    "q": "用户管理进阶中，锁定用户账户使其无法登录的命令？",
    "level": "进阶",
    "options": [
      "usermod -U 用户名",
      "passwd -l 用户名",
      "userdel -r",
      "chage -E 0"
    ],
    "answer": 1,
    "explain": "passwd -l锁定用户、passwd -u解锁，usermod -L锁定、usermod -U解锁，锁定后/etc/shadow密码字段前加!，还可用chage设置过期时间。"
  },
  {
    "q": "ACL访问控制列表中查看ACL的命令是？",
    "level": "进阶",
    "options": [
      "ls -l",
      "setfacl",
      "getfacl",
      "chmod"
    ],
    "answer": 2,
    "explain": "getfacl 文件名查看ACL详细权限列表，setfacl设置ACL，setfacl -m u:用户:权限 文件为指定用户设置，setfacl -b清除所有ACL。"
  },
  {
    "q": "给用户tom对/data目录有rwx权限的ACL命令？",
    "level": "进阶",
    "options": [
      "acl u:tom:rwx /data",
      "chmod u:tom:rwx /data",
      "chown tom:rwx /data",
      "setfacl -m u:tom:rwx /data"
    ],
    "answer": 3,
    "explain": "setfacl -m修改ACL，u:用户名:权限是用户ACL条目，g:组名:权限是组ACL，m::设置有效权限掩码，-R递归设置，-x u:用户删除特定ACL。"
  },
  {
    "q": "Systemd的日志系统journalctl查看所有日志的命令？",
    "level": "进阶",
    "options": [
      "journalctl",
      "journalctl -u sshd",
      "journalctl -f",
      "journalctl --disk-usage"
    ],
    "answer": 0,
    "explain": "journalctl查看systemd-journald采集的所有系统日志，-u服务名过滤指定服务日志如journalctl -u nginx，-f实时追踪类似tail -f，-n指定行数。"
  },
  {
    "q": "rsyslog服务的主配置文件？",
    "level": "进阶",
    "options": [
      "/etc/syslog.conf",
      "/etc/rsyslog.conf",
      "/etc/journald.conf",
      "/var/log/messages"
    ],
    "answer": 1,
    "explain": "rsyslog主配置文件/etc/rsyslog.conf，子配置在/etc/rsyslog.d/，每行格式为设施.优先级 动作，如*.info;mail.none /var/log/messages。"
  },
  {
    "q": "vmstat命令中第一列r表示什么？",
    "level": "进阶",
    "options": [
      "空闲内存",
      "阻塞进程数",
      "运行队列进程数",
      "CPU使用率"
    ],
    "answer": 2,
    "explain": "vmstat(Virtual Memory Statistics)输出中r是运行队列中等待CPU的进程数（判断CPU负载重要指标），b是等待IO的阻塞进程数，si/so是swap换入换出，bi/bo是块IO读写。"
  },
  {
    "q": "iostat命令主要用于监控什么？",
    "level": "进阶",
    "options": [
      "CPU负载",
      "内存使用",
      "网络流量",
      "磁盘IO"
    ],
    "answer": 3,
    "explain": "iostat用于监控CPU使用情况和磁盘IO统计，-d只显示磁盘、-x显示扩展统计信息如await(平均等待时间)、%util(磁盘繁忙百分比)，是磁盘性能调优核心工具。"
  },
  {
    "q": "sar命令的主要作用？",
    "level": "进阶",
    "options": [
      "历史性能数据采集分析",
      "实时进程监控",
      "网络抓包",
      "磁盘分区"
    ],
    "answer": 0,
    "explain": "sar(System Activity Reporter)系统活动报告工具，通过cron定期采集系统CPU、内存、磁盘、网络等历史性能数据，可回看历史负载定位间歇性问题。"
  },
  {
    "q": "anacron与crontab的主要区别？",
    "level": "进阶",
    "options": [
      "anacron适合服务器，crontab适合桌面",
      "anacron可在关机错过后补执行",
      "anacron精确到秒级",
      "crontab只能系统级"
    ],
    "answer": 1,
    "explain": "crontab按精确时间点运行，系统关机错过的任务不会补跑；anacron按天/周/月周期运行，记录上次执行时间，开机后发现超过周期就补执行，适合笔记本/非24小时开机机器。"
  },
  {
    "q": "设置一次性定时任务10分钟后执行的命令？",
    "level": "进阶",
    "options": [
      "sleep 10m &&",
      "crontab 10 * * * *",
      "at now +10 minutes",
      "at +10"
    ],
    "answer": 2,
    "explain": "at命令用于一次性定时任务，at now +10 minutes表示10分钟后，at 20:00指定时间，atq查看待执行队列，atrm删除，需atd服务运行。"
  },
  {
    "q": "CentOS中配置YUM仓库的.repo文件存放在？",
    "level": "进阶",
    "options": [
      "/usr/lib/yum-plugins",
      "/etc/yum.conf",
      "/var/cache/yum",
      "/etc/yum.repos.d/"
    ],
    "answer": 3,
    "explain": "YUM仓库配置文件.repo放在/etc/yum.repos.d/目录下，主配置/etc/yum.conf，每个repo文件含[name]、name、baseurl、gpgcheck、enabled等配置项。"
  },
  {
    "q": "源码编译安装软件的标准三部曲？",
    "level": "进阶",
    "options": [
      "./configure → make → make install",
      "rpm -i → yum install → make",
      "apt build → make → install",
      "cmake → build → setup"
    ],
    "answer": 0,
    "explain": "绝大多数GNU源码包编译步骤：1./configure检测环境生成Makefile，--prefix指定安装目录、--with指定依赖；2.make编译；3.make install复制文件到安装目录。"
  },
  {
    "q": "查看内核模块是否加载的命令是？",
    "level": "进阶",
    "options": [
      "modprobe",
      "lsmod",
      "insmod",
      "rmmod"
    ],
    "answer": 1,
    "explain": "lsmod列出当前已加载的内核模块，显示模块名、大小、被谁依赖，modprobe智能加载/卸载模块并处理依赖，insmod需手动指定.ko文件不处理依赖，rmmod卸载。"
  },
  {
    "q": "临时修改内核参数的命令？",
    "level": "进阶",
    "options": [
      "sysctl -w 参数=值",
      "echo 写入 /proc/sys/",
      "两者都可以",
      "sysctl.conf"
    ],
    "answer": 2,
    "explain": "临时修改内核参数两种方式：sysctl -w net.ipv4.ip_forward=1 或 echo 1 > /proc/sys/net/ipv4/ip_forward，永久生效写入/etc/sysctl.conf然后sysctl -p加载。"
  },
  {
    "q": "创建swap分区后启用它的命令是？",
    "level": "进阶",
    "options": [
      "free -m",
      "swapoff",
      "mkswap",
      "swapon"
    ],
    "answer": 3,
    "explain": "swap创建流程：1.fdisk分区类型82或创建swap文件dd；2.mkswap格式化；3.swapon /dev/sdb1启用，永久生效写入/etc/fstab，swapoff停用，swapon -s查看。"
  },
  {
    "q": "磁盘配额quota需要文件系统挂载时加什么参数？",
    "level": "进阶",
    "options": [
      "usrquota,grpquota",
      "defaults,acl",
      "ro,sync",
      "noexec,nosuid"
    ],
    "answer": 0,
    "explain": "开启磁盘配额需在/etc/fstab挂载选项中加usrquota(用户配额)和grpquota(组配额)，然后quotacheck -cugm创建配额数据库，edquota编辑用户配额。"
  },
  {
    "q": "Linux内核编译正确顺序？",
    "level": "高级",
    "options": [
      "make config → make → make install",
      "make mrproper → make menuconfig → make bzImage → make modules → make modules_install → make install",
      "./configure → make → make install",
      "apt source kernel → dpkg-buildpackage → dpkg -i"
    ],
    "answer": 1,
    "explain": "标准内核编译流程：1.make mrproper清理源码树；2.make menuconfig/nconfig配置内核选项；3.make bzImage编译内核镜像；4.make modules编译模块；5.make modules_install安装模块到/lib/modules；6.make install复制内核到/boot更新grub。"
  },
  {
    "q": "内存Overcommit策略中vm.overcommit_memory=2表示？",
    "level": "高级",
    "options": [
      "启发式过量提交",
      "允许任何过量提交",
      "严格按CommitLimit禁止超量",
      "关闭内存分配"
    ],
    "answer": 2,
    "explain": "vm.overcommit_memory参数：0=默认启发式合理允许、1=永远允许有OOM风险、2=严格模式申请的虚拟内存不能超过CommitLimit(物理内存*overcommit_ratio + swap)，数据库如Redis/Oracle生产常用。"
  },
  {
    "q": "cgroup v1中限制进程内存使用量的子系统是？",
    "level": "高级",
    "options": [
      "cpuset",
      "cpu",
      "blkio",
      "memory"
    ],
    "answer": 3,
    "explain": "cgroup子系统：memory子系统限制内存使用量和OOM行为、cpu子系统用CFS配额或RT调度限制CPU、blkio限制块设备IO、cpuset绑定CPU和内存节点、freezer冻结/恢复进程组、devices黑白名单设备访问。"
  },
  {
    "q": "磁盘IO调优中修改磁盘调度算法为deadline的方式？",
    "level": "高级",
    "options": [
      "echo deadline > /sys/block/sda/queue/scheduler",
      "hdparm -d1 /dev/sda",
      "sysctl -w vm.dirty_ratio=10",
      "blockdev --setra 256 /dev/sda"
    ],
    "answer": 0,
    "explain": "IO调度器(cfq/noop/deadline/kyber/bfq/mq-deadline)可通过/sys/block/磁盘/queue/scheduler动态切换，SSD推荐noop或mq-deadline，机械盘数据库场景推荐deadline，永久生效需加elevator=内核参数。"
  },
  {
    "q": "TCP调优中开启tcp_tw_reuse的作用？",
    "level": "高级",
    "options": [
      "开启TCP快速打开",
      "允许TIME_WAIT状态套接字重用",
      "开启窗口缩放",
      "启用SYN Cookie"
    ],
    "answer": 1,
    "explain": "net.ipv4.tcp_tw_reuse=1允许将TIME_WAIT状态的socket重新用于新的TCP连接（客户端），缓解短连接高并发下TIME_WAIT过多占用端口问题，注意与tcp_tw_recycle的区别，recycle已在内核4.10+移除。"
  },
  {
    "q": "系统发生kernel panic时哪个参数可自动重启？",
    "level": "高级",
    "options": [
      "vm.panic_on_oom=1",
      "kernel.oops=panic",
      "kernel.panic=30",
      "kernel.sysrq=1"
    ],
    "answer": 2,
    "explain": "kernel.panic=N设置内核panic后N秒自动重启，0表示不重启；kernel.panic_on_oops=1将Oops升级为panic；vm.panic_on_oom=1在OOM killer执行后触发panic确保一致性，都是高可用方案。"
  },
  {
    "q": "strace工具的主要作用？",
    "level": "高级",
    "options": [
      "内核调试",
      "跟踪库函数调用",
      "性能采样分析",
      "跟踪系统调用和信号"
    ],
    "answer": 3,
    "explain": "strace跟踪进程的系统调用(system call)和接收的信号，-p PID附着运行进程、-c统计调用次数时间、-o输出到文件、-f跟踪子进程、-e trace=open,read只跟踪指定调用，是排错神器。"
  },
  {
    "q": "ltrace与strace的区别是？",
    "level": "高级",
    "options": [
      "ltrace跟踪库函数、strace跟踪系统调用",
      "两者功能相同",
      "ltrace内核调用、strace用户态",
      "ltrace是图形化工具"
    ],
    "answer": 0,
    "explain": "strace跟踪进程与内核之间的系统调用(进入内核)，ltrace跟踪进程调用动态链接库的函数调用(用户态库函数)，两者常配合使用，ltrace -S可同时显示系统调用。"
  },
  {
    "q": "perf工具记录CPU性能数据生成报告的步骤？",
    "level": "高级",
    "options": [
      "perf stat PID → perf top",
      "perf record -g -p PID → perf report",
      "perf trace → perf report",
      "perf lock → perf data"
    ],
    "answer": 1,
    "explain": "perf是Linux官方性能分析框架：perf record采样性能数据到perf.data(-g记录调用栈)；perf report交互分析热点函数；perf top实时显示热点符号；perf stat计数统计事件；perf list列出支持的硬件/软件事件。"
  },
  {
    "q": "Systemd自定义target如何创建？",
    "level": "高级",
    "options": [
      "用chkconfig --add",
      "直接修改default.target",
      "创建.service和.target单元文件，target中Requires=和After=指定服务",
      "在rc.local中添加"
    ],
    "answer": 2,
    "explain": "自定义target需创建.target单元文件，[Unit]段Description描述、Requires=依赖的服务列表、After=在哪些服务之后启动、AllowIsolate=yes允许systemctl isolate切换，然后systemctl daemon-reload生效。"
  },
  {
    "q": "nmcli添加一个以太网静态IP连接的命令？",
    "level": "高级",
    "options": [
      "ip addr add 192.168.1.100/24 dev eth0",
      "nmcli eth0 static 192.168.1.100",
      "nmcli device set eth0 ip 192.168.1.100",
      "nmcli con add con-name myeth ifname eth0 type ethernet ipv4.addresses 192.168.1.100/24 ipv4.gateway 192.168.1.1 ipv4.dns 192.168.1.1 ipv4.method manual autoconnect yes"
    ],
    "answer": 3,
    "explain": "nmcli是NetworkManager命令行工具，con add创建连接，con-name连接名、ifname物理网卡名、type类型ethernet/wifi、ipv4.method manual=静态auto=DHCP、autoconnect yes开机自动连接、con up激活。"
  },
  {
    "q": "iptables自定义链的创建命令？",
    "level": "高级",
    "options": [
      "iptables -N MYCHAIN",
      "iptables -C MYCHAIN",
      "iptables -A MYCHAIN",
      "iptables --new-chain MYCHAIN INPUT"
    ],
    "answer": 0,
    "explain": "iptables -N 链名创建自定义用户链、-X删除空的自定义链、-E重命名，创建后需要在默认链(如INPUT)中通过-j 自定义链跳转，自定义链可模块化组织规则便于维护。"
  },
  {
    "q": "iptables conntrack模块--ctstate ESTABLISHED,RELATED作用？",
    "level": "高级",
    "options": [
      "统计连接数",
      "允许已建立连接和关联连接的返回流量",
      "新建连接限速",
      "标记数据包"
    ],
    "answer": 1,
    "explain": "iptables -m conntrack --ctstate匹配连接跟踪状态：NEW新连接、ESTABLISHED已建立双向通信、RELATED关联连接(如FTP数据连接)、INVALID无效，常用规则允许入站ESTABLISHED,RELATED实现状态防火墙。"
  },
  {
    "q": "IPv6地址配置中，fe80::开头的地址是？",
    "level": "高级",
    "options": [
      "唯一本地地址ULA",
      "全局单播地址",
      "链路本地地址",
      "组播地址"
    ],
    "answer": 2,
    "explain": "IPv6地址类型：fe80::/10链路本地地址(同一链路二层可达，类似169.254私有)、2000::/3全局单播公网、fc00::/7唯一本地ULA(内网类似私有IPv4)、ff00::/8组播、::1/128回环、::/128未指定。"
  },
  {
    "q": "Kickstart无人值守安装的配置文件通常命名为？",
    "level": "高级",
    "options": [
      "answerfile.ini",
      "autoinst.xml",
      "preseed.cfg",
      "ks.cfg"
    ],
    "answer": 3,
    "explain": "Kickstart是RHEL/CentOS系自动安装配置文件，通常ks.cfg，在anaconda安装器时通过内核参数ks=指定文件位置(HTTP/NFS/FTP/本地)，可定义分区、软件包选择、网络、root密码、%post安装后脚本等，可用system-config-kickstart图形生成。"
  },
  {
    "q": "PXE网络启动的必要服务组合是？",
    "level": "高级",
    "options": [
      "DHCP + TFTP + HTTP/NFS(安装源)",
      "DNS + NTP + HTTP",
      "FTP + SAMBA + DNS",
      "LDAP + Kerberos + NIS"
    ],
    "answer": 0,
    "explain": "PXE(Preboot Execution Environment)网络安装流程：1.DHCP分配IP并告知TFTP服务器和bootloader文件名；2.客户端TFTP下载pxelinux.0/syslinux.efi引导程序、内核vmlinuz、initrd及配置；3.通过HTTP/NFS/FTP拉取安装源(含ks.cfg)完成安装。"
  },
  {
    "q": "Docker网络中None网络模式特点？",
    "level": "高级",
    "options": [
      "与宿主机共享网络栈",
      "容器无网络栈只有lo接口",
      "独立Network Namespace桥接",
      "容器共享其他容器网络"
    ],
    "answer": 1,
    "explain": "Docker网络模式：--network=none无网络只有loopback，完全隔离适合安全敏感计算；--network=host与宿主机共享网络命名空间性能好；--network=bridge默认Docker0网桥NAT；--network=container:id共享指定容器的网络栈。"
  },
  {
    "q": "Linux网络命名空间netns添加一个新命名空间？",
    "level": "高级",
    "options": [
      "netns create ns1",
      "ip namespace add ns1",
      "ip netns add ns1",
      "docker network create ns1"
    ],
    "answer": 2,
    "explain": "ip netns是iproute2操作网络命名空间的工具，add创建、del删除、list列出、exec ns1 ip a在命名空间内执行命令，veth pair虚拟以太网线对可连接两个netns实现通信，是Docker等容器网络基础。"
  },
  {
    "q": "LUKS磁盘加密创建加密分区的第一步命令是？",
    "level": "高级",
    "options": [
      "mount /dev/mapper/cryptdata /mnt",
      "cryptsetup luksOpen /dev/sdb1 cryptdata",
      "mkfs.ext4 /dev/mapper/cryptdata",
      "cryptsetup luksFormat /dev/sdb1"
    ],
    "answer": 3,
    "explain": "LUKS(Linux Unified Key Setup)加密流程：1.cryptsetup luksFormat格式化分区(设置密码，破坏性操作)；2.cryptsetup luksOpen打开映射为/dev/mapper/名；3.mkfs创建文件系统；4.mount挂载；关闭前先umount再cryptsetup luksClose。"
  },
  {
    "q": "高级ACL中设置默认ACL(针对新文件继承)的命令？",
    "level": "高级",
    "options": [
      "setfacl -m d:u:tom:rwx /data",
      "setfacl -m u:tom:rwx /data",
      "setfacl -R -m u:tom:rwx /data",
      "chmod +setuid /data"
    ],
    "answer": 0,
    "explain": "ACL的d:前缀(default)表示设置目录的默认ACL条目，仅对目录有效，该目录下新建的文件/子目录会自动继承这些ACL权限，默认ACL不影响目录本身当前权限，结合-R递归与普通ACL配合用。"
  },
  {
    "q": "Linux审计系统auditd添加规则监控/etc/passwd修改？",
    "level": "高级",
    "options": [
      "auditctl -a /etc/passwd watch",
      "auditctl -w /etc/passwd -p wa -k passwd_change",
      "watch /etc/passwd",
      "inotifywait -m /etc/passwd"
    ],
    "answer": 1,
    "explain": "auditctl -w添加文件系统监控watch，-p指定权限(r读/w写/a属性修改/x执行)，-k设置过滤关键词便于ausearch -k passwd_change搜索，-l列出规则、-D删除所有规则，永久规则写/etc/audit/rules.d/下。"
  },
  {
    "q": "生成CPU性能火焰图的工具链通常是？",
    "level": "高级",
    "options": [
      "top -bH → sed → flame",
      "strace -c → gprof → svg",
      "perf record -g -F 99 → perf script | stackcollapse-perf.pl → flamegraph.pl > cpu.svg",
      "sar -u → awk → graph"
    ],
    "answer": 2,
    "explain": "火焰图FlameGraph由Brendan Gregg发明，标准流程：perf record高频率采样(99Hz避免锁步)并记录调用栈→perf script输出样本→stackcollapse折叠堆栈→flamegraph.pl生成交互式SVG，x轴是样本比例宽度越大越热、y轴是调用栈深度。"
  },
  {
    "q": "epoll与select的主要区别错误的是？",
    "level": "高级",
    "options": [
      "epoll支持ET边缘触发、select只有水平触发",
      "epoll无最大连接数硬限制、select默认FD_SETSIZE=1024",
      "epoll是事件驱动只返回活跃fd、select需遍历全部fd",
      "select比epoll性能更好支持更多连接"
    ],
    "answer": 3,
    "explain": "epoll是Linux高性能IO多路复用：比select/poll性能好得多，尤其大并发少量活跃场景；select用FD_SET位图有1024限制且每次需拷贝、轮询全部fd；epoll通过红黑树+就绪链表，epoll_wait只返回已就绪fd，ET边缘触发(只通知一次状态变)LT水平触发(有数据就通知)。"
  },
  {
    "q": "Linux OOM Killer选择杀死进程的主要依据是？",
    "level": "高级",
    "options": [
      "进程的oom_score分数越高越先杀",
      "进程启动时间越早越先杀",
      "进程CPU使用率越高越先杀",
      "root用户进程永远不会被杀"
    ],
    "answer": 0,
    "explain": "OOM Killer计算每个进程的oom_score=内存占用比例调整+oom_score_adj(可/proc/PID/oom_score_adj -1000到1000设，-1000完全免杀)，得分最高者被杀，root进程会有3%左右减免但不会完全豁免，/proc/sys/vm/panic_on_oom可配置OOM后panic而非杀进程。"
  },
  {
    "q": "内核参数net.ipv4.tcp_syncookies=1的作用？",
    "level": "高级",
    "options": [
      "启用TCP快速重传",
      "开启SYN Cookie防御SYN Flood攻击",
      "开启TCP窗口缩放",
      "启用ECN显式拥塞通知"
    ],
    "answer": 1,
    "explain": "tcp_syncookies开启后，当TCP半连接队列(syn backlog)溢出时，服务器不丢弃SYN包，而是回复带特殊编码Cookie的SYN+ACK，客户端返回ACK时验证Cookie合法才真正建立连接分配资源，有效防御SYN Flood攻击消耗服务器资源。"
  }
];