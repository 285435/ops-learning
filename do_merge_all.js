const fs = require('fs');

// 读取原始data.js
let code = fs.readFileSync('/workspace/data.js', 'utf8');

// 提取QUESTIONS到内存（替换const为var便于eval）
let QUESTIONS, KNOWLEDGE;
eval(code.replace(/^const /gm, 'var ').replace(/^const\b/gm, 'var'));

// ====== Linux新题 ======
const LIN_NEW = [
{q:'pwd命令的作用是什么？',level:'基础',options:['显示当前工作目录','切换目录','列出文件','创建目录'],answer:0,explain:'pwd(Print Working Directory)显示当前工作目录的绝对路径。'},
{q:'切换到用户主目录的命令是？',level:'基础',options:['cd ~','cd /','cd root','cd home'],answer:0,explain:'cd ~或cd不带参数切换到当前用户的主目录。'},
{q:'ls -a显示什么？',level:'基础',options:['所有文件包括隐藏文件','仅目录','仅文件','详细信息'],answer:0,explain:'ls -a(all)显示包括以.开头的隐藏文件。'},
{q:'创建目录的命令是？',level:'基础',options:['mkdir','mkfile','touch','newdir'],answer:0,explain:'mkdir(Make Directory)创建新目录。'},
{q:'删除空目录的命令是？',level:'基础',options:['rmdir','rm -r','rm -f','deldir'],answer:0,explain:'rmdir删除空目录；非空目录需要rm -r递归删除。'},
{q:'创建空文件的命令是？',level:'基础',options:['touch','create','new','mk'],answer:0,explain:'touch创建空文件，若文件已存在则更新其时间戳。'},
{q:'复制文件用什么命令？',level:'基础',options:['cp','mv','copy','dup'],answer:0,explain:'cp(Copy)复制文件和目录。'},
{q:'递归复制整个目录需要cp的哪个参数？',level:'基础',options:['-r','-f','-i','-v'],answer:0,explain:'cp -r或-R递归复制目录及其所有内容。'},
{q:'移动/重命名文件的命令是？',level:'基础',options:['mv','move','cp','rename'],answer:0,explain:'mv(Move)既可移动文件也可重命名文件。'},
{q:'删除文件用？',level:'基础',options:['rm','del','erase','drop'],answer:0,explain:'rm(Remove)删除文件。'},
{q:'强制递归删除目录树的组合是？',level:'基础',options:['rm -rf','rm -r','rm -f','rm -ri'],answer:0,explain:'rm -rf：r递归，f强制不提示。谨慎使用！'},
{q:'分页查看大文件内容？',level:'基础',options:['less','cat','echo','tac'],answer:0,explain:'less分页查看，支持向前向后翻页，功能比more更强。'},
{q:'查看文件前N行？',level:'基础',options:['head','tail','top','first'],answer:0,explain:'head默认显示文件前10行，-n指定行数。'},
{q:'查看文件尾N行并实时追踪新增内容？',level:'基础',options:['tail -f','tail -n','head -f','cat -t'],answer:0,explain:'tail -f(Follow)实时追踪文件新增内容，常用于查看日志。'},
{q:'在文件中搜索匹配文本用？',level:'基础',options:['grep','find','search','look'],answer:0,explain:'grep搜索文件内容中匹配正则表达式的行。'},
{q:'按文件名查找文件用？',level:'基础',options:['find','grep','locate -n','which'],answer:0,explain:'find在目录树中按名/大小/时间等条件递归查找文件。'},
{q:'估算目录/文件占用磁盘空间？',level:'基础',options:['du','df','ls -s','disk'],answer:0,explain:'du(Disk Usage)估算文件或目录占用的磁盘空间。'},
{q:'显示文件系统总容量/已用/可用？',level:'基础',options:['df','du','fdisk','mount'],answer:0,explain:'df(Disk Free)显示各挂载文件系统的空间使用情况。'},
{q:'修改文件权限？',level:'基础',options:['chmod','chown','chgrp','perm'],answer:0,explain:'chmod(Change Mode)修改文件/目录访问权限。'},
{q:'修改文件所有者和组？',level:'基础',options:['chown','chmod','chgrp','own'],answer:0,explain:'chown(Change Owner)修改文件所有者，owner:group同时改组。'},
{q:'只修改文件所属组？',level:'基础',options:['chgrp','chown','chmod','group'],answer:0,explain:'chgrp(Change Group)专门修改文件所属组。'},
{q:'创建软链接(符号链接)用？',level:'基础',options:['ln -s','ln','link -s','softlink'],answer:0,explain:'ln -s创建软链接，默认ln创建硬链接。'},
{q:'显示当前登录用户名？',level:'基础',options:['whoami','who','w','id -u'],answer:0,explain:'whoami输出当前有效用户的用户名。'},
{q:'以root身份执行单条命令？',level:'基础',options:['sudo','su','root','admin'],answer:0,explain:'sudo授权用户以root(或其他用户)身份执行单条命令。'},
{q:'完整切换到另一个用户环境？',level:'基础',options:['su - user','sudo user','switch user','login user'],answer:0,explain:'su - (Switch User)加横杠会以登录shell切换，完整加载该用户的环境变量。'},
{q:'查看当前时刻的进程快照？',level:'基础',options:['ps','top','jobs','ptree'],answer:0,explain:'ps(Process Status)显示某一时刻的进程快照。'},
{q:'动态实时刷新进程和CPU/内存信息？',level:'基础',options:['top','ps aux','monitor','ht'],answer:0,explain:'top实时显示系统运行状态，动态刷新。'},
{q:'终止进程的基本命令？',level:'基础',options:['kill','stop','end','cancel'],answer:0,explain:'kill向指定PID的进程发送信号，默认SIGTERM。'},
{q:'查看内存使用情况？',level:'基础',options:['free','df','mem','cat /proc/cpu'],answer:0,explain:'free显示物理内存和交换空间总量、已用、空闲、缓冲/缓存。'},
{q:'查看系统运行时长和负载均值？',level:'基础',options:['uptime','time','load','status'],answer:0,explain:'uptime显示：当前时间、运行时长、登录用户数、1/5/15分钟负载均值。'},
{q:'查看内核版本？',level:'基础',options:['uname -r','uname -a','kernel','version'],answer:0,explain:'uname -r仅显示内核版本号，-a显示全部内核信息。'},
{q:'查看/设置主机名？',level:'基础',options:['hostname','host','machinename','uname -n'],answer:0,explain:'hostname命令查看主机名，hostnamectl set-hostname NAME永久设置(Systemd系统)。'},
{q:'查看所有用户账号信息存放在哪个文件？',level:'基础',options:['/etc/passwd','/etc/shadow','/etc/group','/etc/users'],answer:0,explain:'/etc/passwd存放用户基本信息，所有用户可读。/etc/shadow存加密密码。'},
{q:'添加新用户命令？',level:'基础',options:['useradd','adduser','newuser','createuser'],answer:0,explain:'useradd是创建新用户的底层命令。Debian系adduser是交互式包装脚本。'},
{q:'删除用户命令？',level:'基础',options:['userdel','deluser','rmuser','eraseuser'],answer:0,explain:'userdel删除用户，-r选项同时删除主目录和邮箱。'},
{q:'修改用户密码？',level:'基础',options:['passwd','password','chpwd','setpass'],answer:0,explain:'passwd修改用户密码，root可改任何人密码。'},
{q:'添加用户组？',level:'基础',options:['groupadd','addgroup','creategroup','newgrp'],answer:0,explain:'groupadd创建新用户组。'},
{q:'删除用户组？',level:'基础',options:['groupdel','delgroup','rmgrp','removegrp'],answer:0,explain:'groupdel删除用户组，组不能作为任何用户的主组才能删。'},
{q:'将用户追加到附加组，不覆盖原有组？',level:'基础',options:['usermod -aG group user','useradd -G group user','groupmod -a user group','adduser group'],answer:0,explain:'usermod -aG：a(append)追加，G指定附加组列表。切勿漏掉-a否则会覆盖之前的附加组。'},
{q:'修改用户账户属性(主目录/Shell/UID等)？',level:'基础',options:['usermod','chuser','moduser','alteruser'],answer:0,explain:'usermod修改用户各种属性，如-d主目录、-s登录Shell、-u UID等。'},
{q:'配置IP等网络接口的传统命令？',level:'基础',options:['ifconfig','ipconfig','netcfg','netconf'],answer:0,explain:'ifconfig是net-tools包的传统命令，现在已被ip addr取代。'},
{q:'现代Linux查看IP地址的推荐命令？',level:'基础',options:['ip addr show','ifup -a','ipconfig','showip'],answer:0,explain:'ip addr(简写ip a)是iproute2套件的现代命令，替代ifconfig。'},
{q:'查看路由表？',level:'基础',options:['ip route或route','netstat -s','arp -a','traceroute'],answer:0,explain:'ip route(现代)、route -n(传统)查看路由表。'},
{q:'测试主机连通性？',level:'基础',options:['ping','ssh','telnet','nc -l'],answer:0,explain:'ping发送ICMP Echo请求，测试网络层连通性和往返延迟。'},
{q:'查看当前TCP/UDP监听端口和对应进程？',level:'基础',options:['ss -tulnp','netstat','lsof -n','port'],answer:0,explain:'ss是iproute2工具，-t TCP -u UDP -l 监听 -n 数字 -p 进程，比netstat更快。'},
{q:'DNS正向/反向查询工具？',level:'基础',options:['nslookup / dig','dns','resolve','gethost'],answer:0,explain:'dig输出详细专业，nslookup更简单，都是DNS查询工具。'},
{q:'HTTP/HTTPS下载命令行工具？',level:'基础',options:['wget 或 curl','get','fetch','download'],answer:0,explain:'wget适合简单下载；curl更强大，支持各种协议/方法/header，调试接口常用。'},
{q:'挂载文件系统？',level:'基础',options:['mount','umount','fsck','attach'],answer:0,explain:'mount将设备上的文件系统挂接到指定目录(挂载点)。'},
{q:'卸载文件系统？',level:'基础',options:['umount','unmount','eject','detach'],answer:0,explain:'umount卸载，注意拼写，是umount不是unmount。有进程占用时需先lsof找占用者。'},
{q:'格式化ext4文件系统？',level:'基础',options:['mkfs.ext4','fsck.ext4','tune2fs','mkext4'],answer:0,explain:'mkfs.ext4 DEVICE格式化设备为ext4，等同于mkfs -t ext4。'},
{q:'检查修复文件系统错误？',level:'基础',options:['fsck','checkfs','repairfs','scan'],answer:0,explain:'fsck(File System ChecK)检查并修复文件系统，必须在文件系统未挂载时运行。'},
{q:'查看所有已挂载文件系统？',level:'基础',options:['mount无参数','df -hT','cat /proc/mounts','以上都可以'],answer:3,explain:'无参数mount、df -hT、/proc/mounts都能看到当前挂载列表。'},
{q:'块设备(磁盘/分区)树形列表？',level:'基础',options:['lsblk','fdisk -l','df -h','blkid'],answer:0,explain:'lsblk(List Block Devices)树状显示块设备，简洁直观。'},
{q:'开机自动挂载的配置文件？',level:'基础',options:['/etc/fstab','/etc/mtab','/proc/mounts','/etc/exports'],answer:0,explain:'/etc/fstab(File System TABle)定义开机自动挂载的文件系统及参数。'},
{q:'立即关机？',level:'基础',options:['poweroff 或 shutdown now','shutdown -r','reboot','init 6'],answer:0,explain:'poweroff立即断电；shutdown now进入单用户模式，现代系统等同关机。shutdown -r是重启。'},
{q:'重启？',level:'基础',options:['reboot 或 shutdown -r now','poweroff','halt','shutdown -h'],answer:0,explain:'reboot立即重启，shutdown -r now通过init优雅重启。'},
{q:'查看命令手册(最全面)？',level:'基础',options:['man command','help command','command --help','info'],answer:0,explain:'man是Unix/Linux标准手册页查看工具，章节齐全。'},
{q:'查找命令的可执行文件路径？',level:'基础',options:['which command','whereis','find / -name','type -t'],answer:0,explain:'which在$PATH中搜索命令，返回第一个匹配的可执行文件绝对路径。'},
{q':'将cmd1输出作为cmd2输入的符号是？',level:'基础',options:['| 管道','; 分号','&&','||'],answer:0,explain:'| (pipe)连接两个命令，左的stdout作右的stdin。'},
{q:'将stdout覆盖写入文件(文件不存在创建，存在清空)？',level:'基础',options:['>','>>','<','&>'],answer:0,explain:'> file 覆盖重定向。>> file 追加；< file 输入重定向。'},
{q':'stdout和stderr一起重定向到文件的简写(bash)？',level:'基础',options:['&> file','> file 2>1','both> file','out+err>'],answer:0,explain:'bash中&> file等价于> file 2>&1，标准输出错误输出都写入file。'},
{q':'黑洞设备，丢弃所有写入的是？',level:'基础',options:['/dev/null','/dev/zero','/tmp/null','/proc/null'],answer:0,explain:'/dev/null是空设备，所有写进去的数据都丢弃，常用来屏蔽不需要的输出。'},
{q':'读取时产生无限字节0的是？',level:'基础',options:['/dev/zero','/dev/null','/dev/full','/proc/zero'],answer:0,explain:'/dev/zero产生无限的0字节，常与dd配合创建固定大小的空文件。'},
{q':'查看当前shell所有环境变量？',level:'基础',options:['env 或 printenv','set -e','listenv','vars'],answer:0,explain:'env/printenv仅打印导出的环境变量；set打印所有变量(含shell局部)和函数。'},
{q':'定义环境变量并导出使子进程可见？',level:'基础',options:['export VAR=value','VAR=value','set VAR value','ENV VAR value'],answer:0,explain:'export把shell变量标记为环境变量，子进程会继承。'},
{q:'用户登录bash读取的个人配置文件(非登录交互式)？',level:'基础',options:['~/.bashrc','~/.bash_profile','/etc/profile','~/.profile'],answer:0,explain:'非登录交互式shell(如打开新终端)读取~/.bashrc；登录shell先读/etc/profile再读~/.bash_profile等。'},
{q:'编辑当前用户crontab？',level:'基础',options:['crontab -e','crontab -l','crontab -r','crontab -u'],answer:0,explain:'crontab -e(Edit)编辑定时任务，-l(List)列当前任务，-r(Remove)删除全部。'},
{q:'crontab五个字段顺序？',level:'基础',options:['分 时 日 月 周','时 分 日 月 周','分 时 周 月 日','日 月 周 分 时'],answer:0,explain:'m h dom mon dow：minute hour day-of-month month day-of-week，共五段。'},
{q':'每天凌晨2:00执行的cron表达式？',level:'基础',options:['0 2 * * *','2 0 * * *','* 2 * * *','0 0 2 * *'],answer:0,explain:'0(分) 2(时) * * *：每天2点0分。'},
{q':'SSH默认端口？',level:'基础',options:['22','21','23','8080'],answer:0,explain:'SSH默认TCP 22，FTP 21，Telnet 23。'},
{q':'SSH标准登录格式？',level:'基础',options:['ssh user@host','ssh host@user','ssh -u user host','connect user@host'],answer:0,explain:'ssh user@hostname_or_ip，默认端口22。-p PORT指定非默认端口。'},
{q':'sshd服务端配置文件？',level:'基础',options:['/etc/ssh/sshd_config','/etc/ssh/ssh_config','~/.ssh/sshd_config','/etc/sshd.conf'],answer:0,explain:'/etc/ssh/sshd_config是服务端(daemon)；/etc/ssh/ssh_config是客户端全局配置。'},
{q:'Systemd控制服务启动/停止/重启/状态的主命令？',level:'基础',options:['systemctl start/stop/restart/status','service ...','init.d scripts','systemd-cmd'],answer:0,explain:'systemctl是systemd系统与服务管理器的主命令。'},
{q:'服务开机自启/取消自启？',level:'基础',options:['systemctl enable / disable','systemctl start/stop','chkconfig on/off','systemd on/off'],answer:0,explain:'systemctl enable把服务软链接到相应.target.wants实现开机自启；disable移除。'},
{q':'YUM安装包(RHEL/CentOS 7)？',level:'基础',options:['yum install pkg','apt install pkg','rpm -i pkg','dpkg -i pkg'],answer:0,explain:'YUM(Yellowdog Updater Modified)是RHEL7及前的包管理器，自动解决依赖。'},
{q':'CentOS8+/RHEL8+推荐包管理器？',level:'基础',options:['dnf','yum','zypper','pacman'],answer:0,explain:'DNF(Dandified YUM)是YUM下一代，性能更好依赖解析更优，8系后默认。'},
{q':'Debian/Ubuntu安装包推荐？',level:'基础',options:['apt install pkg','yum install pkg','aptitude install pkg','dpkg -b'],answer:0,explain:'apt整合了apt-get/apt-cache常用功能，是Debian/Ubuntu推荐的交互式包管理命令。'},
{q':'直接安装.rpm包(不解决依赖)？',level:'基础',options:['rpm -ivh pkg.rpm','yum localinstall','rpm -Uvh','rpm2cpio'],answer:0,explain:'rpm -i安装v显示h进度条。-U升级。RPM包不会自动解决依赖。'},
{q':'直接安装.deb包？',level:'基础',options:['dpkg -i pkg.deb','apt install pkg.deb','deb -i','alien -i'],answer:0,explain:'dpkg -i直接装.deb；遇到未满足依赖时再apt install -f修复。'},
{q:'显示进程树(父子关系)？',level:'进阶',options:['pstree','ps -f','top -H','tree -p'],answer:0,explain:'pstree以ASCII树形显示所有进程的父子/兄弟关系，直观。'},
{q':'find处理含空格的文件名，安全与xargs配合？',level:'进阶',options:['find ... -print0 | xargs -0','find ... | xargs -n1','find ... -exec ... {} \\;','find ... -print | xargs'],answer:0,explain:'-print0输出文件名用NUL分隔，xargs -0按NUL解析，完美处理空格、换行、特殊字符。'},
{q:'awk内置变量，当前整行？',level:'进阶',options:['$0','$1','NF','NR'],answer:0,explain:'$0=当前整条记录；$1..$N=第N个字段；NF=字段数；NR=当前已处理记录数。'},
{q':'awk输出第1列？',level:'进阶',options:["awk '{print $1}'","awk '{print 1}'","awk '{print $a}'","awk '{print F1}"],answer:0,explain:'默认空白(空格/Tab)为分隔符，$1为第一列。-F:改冒号分隔。'},
{q':'sed替换每行所有匹配？',level:'进阶',options:["sed 's/old/new/g'","sed 's/old/new/'","sed 'y/old/new/'","sed -g 's/old/new/'"],answer:0,explain:'末尾的g(Global)代表整行所有匹配，无g只改每行第一个匹配。'},
{q':'sed删除第N到M行？',level:'进阶',options:["sed 'N,Md' file","sed 'N-Md' file","sed 'd N;M'","sed -rm N,M"],answer:0,explain:"'N,Md'删除行号范围N到M(含两端)。如sed '5,10d'删5-10行。"},
{q':'创建.tar.gz(归档并gzip压缩)？',level:'进阶',options:['tar -czvf arch.tar.gz src/','tar -xzvf arch.tar.gz','tar -cjvf arch.tar.bz2','zip -r arch.zip src'],answer:0,explain:'-c创建 -z用gzip -v显示过程 -f指定归档文件。'},
{q':'解压.tar.gz？',level:'进阶',options:['tar -xzvf arch.tar.gz','tar -czvf arch.tar.gz','gzip -d arch.tar.gz','untar arch.tar.gz'],answer:0,explain:'-x提取 -z识别gzip压缩。-j对应bz2，-J对应xz。'},
{q':'grep递归搜索子目录所有文件？',level:'进阶',options:['grep -r pattern dir/','grep -R pattern dir/','grep -d recurse pattern dir/','以上都等价'],answer:3,explain:'-r/-R/--directories=recurse三种写法GNU grep下都可递归。'},
{q':'反向匹配(只输出不匹配行)？',level:'进阶',options:['grep -v pattern','grep -i pattern','grep -n pattern','grep -c pattern'],answer:0,explain:'grep -v invert-match，输出不含pattern的行。'},
{q':'列出打开的文件/网络连接(万能排查工具)？',level:'进阶',options:['lsof','ls -f','fuser','of'],answer:0,explain:'lsof(List Open Files)列出进程打开的所有文件、目录、网络socket(Unix/TCP/UDP)。'},
{q':'查端口被哪个进程占用？',level:'进阶',options:['lsof -i :PORT 或 ss -tulnp|grep PORT','netstat -peanut','fuser PORT/tcp','以上都可以'],answer:3,explain:'lsof最直观直接显示进程名PID；ss -tp能看到对应进程；fuser也能返回占用PID。'},
{q':'跟踪进程的系统调用和信号？',level:'进阶',options:['strace','ltrace','gdb','ptrace'],answer:0,explain:'strace追踪syscall进入/返回及信号，是定位程序异常行为的神器。ltrace跟踪库函数。'},
{q':'进程nice值范围？',level:'进阶',options:['-20到19 越大越谦让','0到100 越高越优先','-100到100','1到32'],answer:0,explain:'nice∈[-20,19]，-20最高优先级(最不谦让)，19最低。普通用户只能调高nice值(谦让)。'},
{q':'修改运行中进程的nice？',level:'进阶',options:['renice','nice','chrt','renice 需要重启'],answer:0,explain:'renice -n 10 -p PID改已运行进程的调度优先级。nice是启动时指定。'},
{q':'SUID对可执行文件作用？',level:'进阶',options:['执行时临时拥有文件所有者权限','所有用户可编辑','禁止被删除','组用户可执行'],answer:0,explain:'Set-UID：任何执行该文件的用户，临时以文件所有者的有效UID身份运行。如passwd需要修改/etc/shadow。'},
{q':'目录SGID作用？',level:'进阶',options:['新建文件继承目录的所属组','目录下文件所有用户可读','组用户才能进入','禁止组用户写入'],answer:0,explain:'SGID目录：任何在该目录内创建的文件/目录，所属组自动设为该目录的GID，常用于项目协作。'},
{q':'目录Sticky Bit作用？',level:'进阶',options:['仅文件所有者(和root)可删除/重命名自己的文件','粘住内存不换出','禁止写入','只能追加'],answer:0,explain:'如/tmp：任何用户可写，但用户A不能删用户B的文件。ls表现为其他执行位变t/T。'},
{q':'chmod八进制：设置SUID+普通755=？',level:'进阶',options:['4755','2755','1755','6755'],answer:0,explain:'首位附加权限：4=SUID，2=SGID，1=Sticky。累加。4755即SUID+rwxr-xr-x。'},
{q':'符号权限：给所属组加执行权限？',level:'进阶',options:['chmod g+x file','chmod +x file','chmod u+x file','chmod a+e file'],answer:0,explain:'u=user所有者 g=group组 o=others其他 a=all。+/-/=加/减/设。'},
{q':'ls -l首字符b表示？',level:'进阶',options:['块设备(block)','字符设备','符号链接','FIFO管道'],answer:0,explain:'类型字符：-普通 d目录 l符号链接 b块设备 c字符设备 s套接字 p管道。'},
{q':'umask 022 新建文件默认权限？',level:'进阶',options:['644 rw-r--r--','755 rwxr-xr-x','666 rw-rw-rw-','777'],answer:0,explain:'文件初始最大权限666(无执行位安全)，减umask 022=644。目录初始777-022=755。'},
{q':'脚本首行shebang指定bash？',level:'进阶',options:['#!/bin/bash','#bash','@echo bash','# use bash'],answer:0,explain:'脚本第1行#!解释器绝对路径，告诉内核用哪个程序来执行本脚本。'},
{q':'bash取第N个命令行参数？',level:'进阶',options:['$N','%N','&N','#N'],answer:0,explain:'$0脚本名，$1-$9第1-9参数，第10+用${10}。'},
{q':'bash上条命令退出状态码？',level:'进阶',options:['$?','$!','$$','$#'],answer:0,explain:'$?保存最近一次前台命令的退出状态，0=成功非0=失败。'},
{q':'PV物理卷创建命令？',level:'进阶',options:['pvcreate /dev/sdb1','vgcreate vg0 /dev/sdb1','lvcreate -L 10G -n lv','mkfs'],answer:0,explain:'LVM流程：pvcreate→vgcreate→lvcreate→mkfs→mount。'},
{q':'扩容LVM逻辑卷+ext4文件系统？',level:'进阶',options:['lvextend -L +20G VG/LV 然后 resize2fs /dev/VG/LV','lvresize +20G VG/LV 就够','lvextend 然后 fsadm grow','扩大分区表就行不用管FS'],answer:0,explain:'lvextend只扩大块设备大小；文件系统必须单独扩容。xfs用xfs_growfs挂载点。'},
{q':'fdisk交互式命令，创建新分区？',level:'进阶',options:['n','d','p','w'],answer:0,explain:'fdisk子命令：n新建 p主分区表 d删除 t改类型 w写入 q放弃。'},
{q:'Swap空间作用？',level:'进阶',options:['物理内存不够时，部分内存页换出到磁盘虚拟内存','磁盘缓存','备份','临时文件系统'],answer:0,explain:'Swap提供虚拟内存扩展，避免OOM直接杀进程。但速度比内存慢N量级，频繁swap说明内存不足需升级。'},
{q:'iostat查看什么？',level:'进阶',options:['CPU及各磁盘I/O统计','网络接口统计','仅CPU使用率','进程CPU占用'],answer:0,explain:'iostat(sysstat包)报告CPU使用率、磁盘/分区读写速率、await、%util等等，分析磁盘瓶颈必备。'},
{q':'vmstat监控什么？',level:'进阶',options:['进程/内存/swap/IO/system/CPU整体','只虚拟内存','只磁盘','只网络'],answer:0,explain:'vmstat(Virtual Memory Stat)提供全系统视角，常用于快速判断系统整体瓶颈在哪。'},
{q':'top交互，按CPU排序？',level:'进阶',options:['大写P','大写M','大写T','k'],answer:0,explain:'top内：P按%CPU降序 M按%MEM T按累计CPU+ k杀进程。'},
{q':'批量按进程名杀全部同名进程？',level:'进阶',options:['pkill name 或 killall name','kill -9 $(pidof name)','ps | grep name | xargs kill','都行，但pkill最简洁'],answer:3,explain:'pkill/pgrep支持模式匹配；killall需完全匹配；组合命令也行但pkill一行搞定最常用。'},
{q:'/proc和/sys区别？',level:'进阶',options:['/proc进程+运行时参数；/sys设备驱动结构化视图','都是一样的伪FS','/proc只给root','/sys可写'],answer:0,explain:'两者都是内存伪文件系统：/proc更历史，含进程目录、sysctl参数；/sys(sysfs)是2.6内核引入，按总线/设备/驱动层次导出，更规范。'},
{q':'默认启动目标：图形界面？',level:'进阶',options:['systemctl set-default graphical.target','systemctl default 5','init 5 永久','runlevel 5'],answer:0,explain:'graphical.target对应旧runlevel 5，multi-user.target对应3。set-default改/etc/systemd/system/default.target软链。'},
{q':'journalctl只看sshd服务+本次启动+实时？',level:'进阶',options:['journalctl -u sshd -b -f','journalctl sshd -follow','tail -f /var/log/sshd.log','dmesg -u sshd'],answer:0,explain:'-u指定单元，-b本次启动，-f跟踪新增。journalctl是systemd日志。'},
{q':'iptables四张表默认过滤表是？',level:'进阶',options:['filter表(INPUT/FORWARD/OUTPUT链)','nat表','mangle表','raw表'],answer:0,explain:'filter是默认操作表，最常用。nat用于端口映射/地址转换。mangle修改分组头。raw跳过连接跟踪。'},
{q':'防火墙放行80/tcp到filter表INPUT链？',level:'进阶',options:["iptables -A INPUT -p tcp --dport 80 -j ACCEPT","iptables -I INPUT port 80 allow","firewall-add 80/tcp","ufw open 80"],answer:0,explain:'标准iptables语法：-A追加链 -p协议 --dport目标端口 -j跳转动作。'},
{q:'firewalld永久+重载开端口？',level:'进阶',options:["firewall-cmd --permanent --add-port=8080/tcp && firewall-cmd --reload","firewall-cmd --add-port=8080/tcp","systemctl restart firewalld","iptables-save > /etc/iptables"],answer:0,explain:'--permanent写入持久配置，需--reload才对运行时生效。不加permanent只改内存重启丢失。'},
{q':'firewalld默认zone？',level:'进阶',options:['public','home','work','trusted'],answer:0,explain:'public是默认zone，不信任网络中其他计算机。还有drop/block/internal/dmz等。'},
{q':'SELinux三种模式？',level:'进阶',options:['enforcing/permissive/disabled','on/off/trace','allow/deny/log','enabled/disabled/audit2allow'],answer:0,explain:'Enforcing强制拒绝+记录；Permissive仅记录不拒绝(测试用)；Disabled完全关闭。'},
{q':'临时切Permissive？',level:'进阶',options:['setenforce 0','setenforce 1','selinux=0','disable-selinux'],answer:0,explain:'setenforce 0→Permissive；setenforce 1→Enforcing。永久修改/etc/selinux/config后需重启。'},
{q':'SSH禁root密码登录的选项？',level:'进阶',options:['PermitRootLogin prohibit-password 或 no','DenyRootLogin yes','RootLogin no','NoRootShell yes'],answer:0,explain:'PermitRootLogin no禁止；prohibit-password禁密码但允许密钥。生产建议后者或干脆no。'},
{q':'SSH密钥登录第一步生成？',level:'进阶',options:['ssh-keygen -t ed25519','ssh-copy-id','ssh-agent start','ssh-add'],answer:0,explain:'ed25519是现代推荐算法，短小精悍安全性高。rsa -b 4096是传统备用。'},
{q':'SSH保持连接防断开(客户端)？',level:'进阶',options:['ssh -o ServerAliveInterval=60 user@host','ssh -keepalive','ssh -T','sftp -K'],answer:0,explain:'Client每60s发一个keepalive包，NAT设备不会把连接当死连接。可写入~/.ssh/config Host *永久生效。'},
{q':'临时设置内核参数net.ipv4.ip_forward=1？',level:'进阶',options:['sysctl -w net.ipv4.ip_forward=1','echo 1 > /proc/sys/net/ipv4/ip_forward','sysctl net.ipv4.ip_forward=1','前两种都可以'],answer:3,explain:'两种方法都是临时，重启失效。写入/etc/sysctl.conf并sysctl -p持久化。'},
{q:'SYN Flood防护参数？',level:'进阶',options:['net.ipv4.tcp_syncookies=1','net.ipv4.tcp_sack=1','net.core.somaxconn','net.ipv4.ip_forward'],answer:0,explain:'开启SYN Cookie，SYN队列满时内核用Cookie机制，不分配跟踪结构防SYN Flood。'},
{q':'查某命令文件来自哪个RPM包？',level:'进阶',options:['rpm -qf /usr/bin/xxx','rpm -ql xxx','yum provides xxx','rpm -qf和yum provides都常用'],answer:3,explain:'rpm -qf需给已存在的绝对路径；yum provides可按文件名搜索，文件不存在也能查。'},
{q':'列某个RPM安装了哪些文件？',level:'进阶',options:['rpm -ql 包名','rpm -qf 文件名','rpm -qi','rpm -Va'],answer:0,explain:'rpm -ql(Query List)列出该包安装的全部文件路径。'},
{q':'排查command not found的逻辑思路？',level:'进阶',options:['①拼写②which/whereis③echo $PATH④文件是否存在+x权限','重装系统','换root','重新登录'],answer:0,explain:'按顺序排：命令对不对→是否在PATH→文件是否存在→可执行位是否有。不要上来就重装。'},
{q':'iowait高CPU低说明？',level:'进阶',options:['I/O瓶颈(磁盘或网络)','CPU不足','内存泄漏','僵尸进程多'],answer:0,explain:'%iowait是CPU等待I/O完成的时间占比，高说明进程被磁盘/网络等IO卡住了，不是CPU不够。'},
{q':'Load高CPU使用率低，典型原因？',level:'进阶',options:['大量处于D(不可中断睡眠)的进程在等I/O','僵尸进程','用户态计算多','中断太多'],answer:0,explain:'Load Average包含R状态和D状态进程，I/O阻塞大量D状态进程会拉高Load但CPU其实空闲。'},
{q':'Copy和ADD Dockerfile区别？',level:'高级',options:['ADD支持URL下载+自动解压tar；COPY仅本地复制(更推荐)','ADD更快','COPY能排除文件','ADD只能用目录'],answer:0,explain:'除非需要ADD的自动解压或URL下载特性，Docker官方建议始终用COPY更透明可预测。'},
{q':'CMD与ENTRYPOINT？',level:'高级',options:['CMD参数会被docker run args覆盖；ENTRYPOINT不会被覆盖只加参数','两者完全相同','ENTRYPOINT只能有一条CMD多条','CMD主程序ENTRYPOINT默认参数'],answer:0,explain:'最佳实践：ENTRYPOINT固定主程序路径(不容易被误改)，CMD放默认参数可被用户覆盖替换。'},
{q':'多阶段构建作用？',level:'高级',options:['最终镜像不含编译工具/中间依赖，体积极小','并行加速','避免Dockerfile太长','跨架构'],answer:0,explain:'多个FROM：builder阶段装gcc/go/npm等编译，最终FROM alpine/scratch仅COPY二进制，几MB vs 几百MB。'},
{q:'CPU1核内存1G限制容器运行？',level:'高级',options:['docker run --cpus=1 --memory=1g img','--cpu=1 --ram=1g','--limit-cpu 1000m --limit-mem 1g','--resources cpu:1 mem:1g'],answer:0,explain:'--cpus=1等价--cpu-period=100000 --cpu-quota=100000；--memory 1g限制物理内存+swap总量。'},
{q':'Flame Graph火焰图，宽度=？',level:'高级',options:['占用CPU时间比例(越宽越热点)','调用次数','函数深度','字符串长度'],answer:0,explain:'x轴宽度不是时间流逝，是该栈帧在采样中出现次数/总采样数比例，即累计占CPU时间。最宽的平顶就是优化重点。'},
{q:'perf top和perf record/report？',level:'高级',options:['perf top实时看热点；perf record采样perf report分析离线火焰图','perf top更准','都是一样的','report记录top显示'],answer:0,explain:'perf top像top一样实时刷新符号；perf record -F 99 -a -g睡眠一段时间生成perf.data，再perf report或生成火焰图分析。'},
{q:'MemAvailable和MemFree区别？',level:'高级',options:['MemFree=完全空闲页；MemAvailable≈Free+可回收PageCache/Slab，更真实可用内存','MemAvailable包含Swap','MemFree=Available+Buffers+Cached','无区别'],answer:0,explain:'应用可申请的内存不止是Free，还有文件页缓存、可回收slab对象，MemAvailable是估算的给应用可分配的内存数。'},
{q:'SSD fstrim/discard作用？',level:'高级',options:['通知SSD哪些页已删除可回收，减少写入放大保持性能','加密数据','压缩','坏块标记'],answer:0,explain:'GC前SSD不知道哪些逻辑页对应数据已删，trim告诉SSD块可擦除。避免长期使用后性能下降。'},
{q:'Kpatch/Livepatch原理？',level:'高级',options:['ftrace在函数入口插跳转，重定向到补丁版新函数，不重启内核','重写磁盘内核二进制','加载内核模块覆盖旧函数','kexec快速重启'],answer:0,explain:'ftrace的mcount指令替换成跳转，不用重启内核。只能替换函数逻辑内部，不能改结构体成员。保持关键安全漏洞修复不停机。'},
{q':'Container网络模式：共享另一容器netns？',level:'高级',options:['--network container:NAME','--net=host','--net=container:same','--macvlan'],answer:0,explain:'典型Sidecar模式：业务容器+日志/网络代理容器，共享localhost互通，端口可见。'},
{q':'systemd沙箱选项ProtectSystem=strict意思？',level:'高级',options:['让/usr等只读、/etc不可写、服务文件系统访问最小化，减小攻击面','保护systemd不崩溃','禁止用户登录','开启全盘加密'],answer:0,explain:'ProtectSystem/PrivateTmp/ProtectHome/InaccessiblePaths/NoNewPrivileges/CapabilityBoundingSet组合可以把服务锁得死死的。'},
{q':'cgroup v2 memory.high vs memory.max？',level:'高级',options:['high软限制：超了就压缩回收尽量不超；max硬限制：超了直接OOM杀进程','max软，high硬','都硬，单位不同','high限制swap max物理'],answer:0,explain:'组合使用：memory.high略低于memory.max，给警告+回收。超过high进程进入内存压力状态(pressure stall信息)。'},
{q:'vm.swappiness=10含义？',level:'高级',options:['内核回收时更倾向回收文件页cache，尽量不用Swap(数据库服务器常用)','完全禁止swap','所有匿名页换出','swap使用率10%'],answer:0,explain:'swappiness∈[0,200]，值越小越优先保留匿名页、回收文件页cache。DB推荐5-10；桌面60默认。'},
{q:'SSH Multiplexing(连接复用)好处？',level:'高级',options:['多会话复用同一个TCP连接，免多次握手鉴权，批量操作显著加速','多路视频','VPN','更安全加密'],answer:0,explain:'ControlMaster=auto + ControlPath + ControlPersist秒数。首次建TCP，后续所有ssh/scp/sftp复用。'},
{q:'auditd监控/etc/passwd写操作加规则？',level:'高级',options:['auditctl -w /etc/passwd -p wa -k passwd_change','auditctl -a watch,always -F path=/etc/passwd','auditd watch /etc/passwd','inotifywatch /etc/passwd'],answer:0,explain:'-p wa监视写w和属性修改a；-k自定义键，后续ausearch -k按键名捞日志。规则持久化写/etc/audit/rules.d/。'},
{q:'LVM快照机制？',level:'高级',options:['写时复制(COW)：源块被改写前先备份到快照LV','写时重定向(ROW)','全量克隆','差异日志'],answer:0,explain:'创建快照不用立即复制数据；应用写源数据时旧块才被拷入快照区。快照大小只要能容纳变更窗口。写密集场景快照满了会失效。'},
{q:'MDRAID建RAID1两盘？',level:'高级',options:["mdadm --create /dev/md0 -l 1 -n 2 /dev/sda1 /dev/sdb1","mdadm -A /dev/md0 raid1","mdadm --build mirror","mdadm make raid1"],answer:0,explain:'-l level：0条带1镜像5单校验6双校验10条带+镜像 -n活动盘数 -x热备盘数。--assemble重组。'},
{q:'Cgroup v1 vs v2关键区别？',level:'高级',options:['v1每个子系统独立层次树混乱；v2统一单树一进程同一组所有控制器','v2兼容所有老系统','v1更现代','v2无CPU'],answer:0,explain:'v1一个进程在cpu子系统A组，mem子系统B组，语义混乱。v2统一层次，所有控制器共享一棵树，systemd 240+全面启用。'},
{q:'K8s pause(Infra)容器作用？',level:'高级',options:['Pod内第一个启动，保留共享的网络/IPC/UTS命名空间，业务容器加入，Pod IP不变','检查点','健康探针','日志转储'],answer:0,explain:'pause只做一件事：持有命名空间。即使业务容器全部崩溃重启，Pod级别的网络和共享资源依然保留。'},
{q:'PAM限制登录时间段？',level:'高级',options:['pam_time.so + /etc/security/time.conf','pam_limits.so','pam_access.so','pam_succeed_if'],answer:0,explain:'格式services;ttys;users;times 例如"sshd;*;jack;Wk0900-1800"限定工作日9-18点。'},
{q':'ECMP(等价多路径)哈希策略per-packet vs per-flow？',level:'高级',options:['per-packet负载更均衡但乱序，TCP吞吐差；per-flow按5元组同流同路径，避免乱序','两者无差别','per-packet更推荐','仅用于BGP'],answer:0,explain:'几乎所有现代实现默认per-flow哈希(src/dst/sport/dport/proto)。乱序会让TCP误以为丢包，频繁重传吞吐暴跌。'},
{q:'内核参数tcp_tw_recycle为何NAT后慎开？',level:'高级',options:['依赖源IP时间戳递增，NAT公网出口多个客户端时时间戳混乱，SYN被静默丢','会产生更多TIME_WAIT','只支持IPv4','不支持HTTPS'],answer:0,explain:'Linux 4.10+已移除该参数。替代方案：开启tcp_tw_reuse + tcp_timestamps 复用客户端侧TIME_WAIT连接。'}
];

// ====== 前端新题 ======
const FE_NEW = [
{q:'<nav>是HTML5什么标签？',level:'基础',options:['导航链接语义块','图像容器','表单容器','脚本加载'],answer:0,explain:'<nav>是HTML5语义标签，用于包裹页面主导航链接区。'},
{q:'哪一个不是HTML5新增input类型？',level:'基础',options:['email','date','range','datetime'],answer:3,explain:'HTML5有datetime-local但没有datetime，后者已被废弃。'},
{q:'box-sizing: border-box表示？',level:'基础',options:['宽高只算content','宽高包含content+padding+border','宽高含margin','盒模型默认值'],answer:1,explain:'border-box元素width/height包含内容、padding、border，布局计算更直觉。现代前端通用。'},
{q:'justify-content: space-between效果？',level:'基础',options:['两端对齐，项目之间间隔相等','所有项目居中','左右外边距相等','紧贴起点排列'],answer:0,explain:'首尾贴容器两端，其余每个项目之间的空白平均分配。space-around是每个项目两侧空白相等。'},
{q:'typeof null返回？',level:'基础',options:['null','undefined','object','number'],answer:2,explain:'JS历史遗留bug，typeof null === "object"。判断null用x===null。'},
{q:'哪个不是JS原始(基本)类型？',level:'基础',options:['string','number','array','bigint'],answer:2,explain:'array是Object的子类型。原始类型：string/number/boolean/undefined/null/symbol/bigint。'},
{q:'Vue3创建响应式基本类型？',level:'基础',options:['reactive(0)','ref(0)','computed(0)','watch(0)'],answer:1,explain:'ref()推荐用于基本类型，访问和赋值.value；reactive()用于对象/数组。'},
{q:'React函数组件中管理状态？',level:'基础',options:['useEffect','useState','useRef','useContext'],answer:1,explain:'useState(initial)返回[current, setter]。是最基础的React Hook。'},
{q:'浏览器正确渲染顺序？',level:'基础',options:['HTML→DOM→CSSOM→Layout→Paint→Composite','DOM→HTML→Layout→CSSOM→Paint','Paint→Layout→Composite','Composite→Paint→Layout'],answer:0,explain:'关键渲染路径：解析HTML生成DOM→解析CSS生成CSSOM→合成Render→Layout布局(几何)→Paint像素→Composite层叠加。'},
{q:'XSS全称？',level:'基础',options:['Cross-Site Scripting','Cross Server Script','Cross Site Security','Xing Style Sheet'],answer:0,explain:'Cross-Site Scripting跨站脚本，简写成XSS是避免和CSS重名。'},
{q:'Webpack指定入口文件配置？',level:'基础',options:['output','entry','module','context'],answer:1,explain:'entry指明打包起点；output指明输出目录和文件名。'},
{q:'Node.js核心创建HTTP服务器模块？',level:'基础',options:['fs','http','https','net'],answer:1,explain:'const http = require("http"); http.createServer((req,res)=>...).listen(port)。'},
{q:'CORS允许跨域源的响应头？',level:'基础',options:['Access-Control-Allow-Origin','Access-Control-Allow-Methods','Access-Control-Expose-Headers','Origin'],answer:0,explain:'Allow-Origin指定允许哪些源，可具体域名或*(通配不能带凭证)。'},
{q:'rem单位相对什么？',level:'基础',options:['父元素字体大小','根元素(html)的font-size','视口宽度','设备像素比'],answer:1,explain:'rem = root em，始终相对于html的font-size。em相对父元素。'},
{q:'微前端核心思想？',level:'基础',options:['单框架大型应用','把巨型应用拆成独立部署的小应用，技术栈可不同','全部iframe','必须同构SSR'],answer:1,explain:'独立开发、独立部署、独立运行时组合。iframe是其中一种实现方式但不是核心思想。'},
{q:'HTML5 2D绘图API标签？',level:'基础',options:['<canvas>','<svg>','<figure>','<paint>'],answer:0,explain:'<canvas>通过getContext("2d")绘制矢量/位图；<svg>是XML向量图，两者不同。'},
{q:'CSS圆角属性？',level:'基础',options:['border-style','border-radius','corner-radius','round-border'],answer:1,explain:'border-radius: 8px或分别四个角/两个值。'},
{q:'下列哪项不是ES6新特性？',level:'基础',options:['let/const块级作用域','箭头函数','Promise A+','jQuery'],answer:3,explain:'jQuery是第三方库，与ES语言标准无关。'},
{q:'Promise处理成功的第一个回调？',level:'基础',options:['catch()','then(fnSuccess, fnFail)','finally()','resolve()'],answer:1,explain:'then接收两个回调：第一个fulfilled成功，第二个rejected失败。catch只处理失败。'},
{q:'Vue v-for的key作用？',level:'基础',options:['装饰代码','帮助Diff算法识别节点，减少错误复用和渲染','绑定数据ID','只是惯例'],answer:1,explain:'Diff用key匹配新旧节点兄弟，保证组件状态对应正确，提升列表性能。勿用index或随机值！'},
{q:'不是Core Web Vitals三大指标？',level:'基础',options:['DCL DOMContentLoaded','LCP Largest Contentful Paint','FID/INP First Input Delay/Interaction Next Paint','CLS Cumulative Layout Shift'],answer:0,explain:'三大Core Web Vitals：LCP(加载)<2.5s，FID/INP(交互)<100/200ms，CLS(视觉)<0.1。'},
{q:'HTTP强缓存响应头(HTTP/1.1)？',level:'基础',options:['Cache-Control: max-age=xxx','ETag','Last-Modified','If-None-Match'],answer:0,explain:'强缓存：Cache-Control/Expires。协商缓存：ETag+If-None-Match，Last-Modified+If-Modified-Since。'},
{q:'CSRF全称？',level:'基础',options:['Cross-Site Request Forgery','Cross-Server Response Forgery','Client-Side Request Forge','Cross Site Reference'],answer:0,explain:'跨站请求伪造：利用用户已登录的Cookie在第三方站点诱导发起请求。'},
{q:'Vite开发模式速度快的核心？',level:'基础',options:['更先进的打包器','基于浏览器原生ES Modules按需编译，无需先打包整包','更少插件','只支持Vue'],answer:1,explain:'浏览器请求某文件才编译，冷启动极快。生产构建仍用Rollup打包。'},
{q:'Express中间件执行顺序？',level:'基础',options:['由路由匹配决定','按代码注册的先后顺序依次执行','随机','只执行匹配的第一个'],answer:1,explain:'洋葱模型，按顺序执行。next(err)跳过剩余非错误处理中间件，进入4参错误中间件。'},
{q:'position:absolute相对谁定位？',level:'基础',options:['视口','最近的position非static祖先元素','父元素','body'],answer:1,explain:'依次向上找最近已定位(非static)的祖先，找不到则以初始包含块(约等于视口)为参考。'},
{q:'Grid: grid-template-columns: repeat(3, 1fr)？',level:'基础',options:['3行1fr','3列，每列平分剩余可用宽度','重复3个1px','3个等高行轨道'],answer:1,explain:'repeat(n, pattern)简写；1fr是可伸缩单位，按比例分剩余空间。3列1:1:1。'},
{q:'== vs ===？',level:'基础',options:['==只比值，===比类型+值','==类型转换后比较宽松相等，===严格相等不做类型转换','完全一致','===慢'],answer:1,explain:'推荐默认用===；当你确实知道要宽松转换才用==，比如null==undefined。'},
{q:'JSX编译结果？',level:'基础',options:['HTML字符串','React.createElement(...)调用','VDOM对象字面量','模板字符串'],answer:1,explain:'Babel/TSC把<Div attr="x">child</Div>编译成函数调用，再执行返回虚拟DOM。'},
{q:'属于用户交互事件？',level:'基础',options:['load','click','DOMContentLoaded','error'],answer:1,explain:'click、keydown、input等用户动作触发的是交互事件。'},
{q:'CSP的作用？',level:'基础',options:['压缩资源','声明允许加载的资源源，大幅降低XSS/注入风险','缓存策略','页面保护水印'],answer:1,explain:'Content Security Policy通过白名单限制script-src/style-src/img-src等，即使注入了脚本也会被浏览器拦截。'},
{q:'Rollup最适合的场景？',level:'基础',options:['大型应用开发','JS库打包(Tree Shaking最优)','样式处理','图片压缩'],answer:1,explain:'Rollup以ESM为第一公民，Tree Shaking最干净，输出多种格式(esm/cjs/umd)，库作者首选。'},
{q:'Node.js默认模块系统？',level:'基础',options:['AMD','CommonJS(require/module.exports)','ES Modules','CMD'],answer:1,explain:'传统默认CommonJS；Node 12+ESM也可用(需package.json "type":"module"或.mjs)。'},
{q:'下列哪个不能解决跨域？',level:'基础',options:['CORS','Nginx反向代理','JSONP','localStorage'],answer:3,explain:'localStorage是Web存储API，和跨域策略的绕过无关。'},
{q:'移动端1px边框看起来粗的原因？',level:'基础',options:['CSS不支持小数px','高DPR屏DPR=2/3，CSS 1px对应物理2/3像素','移动端不支持1px','浏览器bug'],answer:1,explain:'解决：0.5px(部分系统)、transform: scaleY(0.5)、border-image、背景图渐变。'},
{q:'qiankun微前端框架基于什么封装？',level:'基础',options:['iframe','single-spa','Web Components','Module Federation'],answer:1,explain:'阿里开源qiankun，在single-spa之上补了HTML Entry、样式隔离、JS沙箱等能力。'},
{q:'localStorage vs sessionStorage？',level:'基础',options:['容量天差地别','localStorage永久(除非清理)；sessionStorage标签关闭清除','localStorage仅当前标签','都永久'],answer:1,explain:'同源容量皆约5MB。不同：生命周期与共享范围(同标签页vs同窗口多标签)。'},
{q':'CSS选择器特异性优先级从高到低？',level:'基础',options:['id > class/attr/伪类 > 元素/伪元素 > *','class > id > element','element > class > id','* > 一切'],answer:0,explain:'再加上!important(别滥用)；行内style比id还高。同级别按源码顺序后者生效。'},
{q:'以下不是循环语句的关键词？',level:'基础',options:['for','while','switch','do...while'],answer:2,explain:'switch是多路分支选择，不是循环。'},
{q:'解构 [a, b] = [1, 2]后？',level:'基础',options:['a=[1] b=[2]','a=1, b=2','a=[1,2], b=undefined','报错'],answer:1,explain:'数组解构按位置对应赋值。'},
{q:'Vue computed vs methods？',level:'基础',options:['computed可异步','computed有响应式依赖缓存，依赖不变不重算；methods每次调用都执行','methods更快','没有区别'],answer:1,explain:'计算属性是缓存派生数据，适合纯函数计算；methods适合事件处理、含副作用操作。'},
{q:'React useEffect([])空依赖数组？',level:'基础',options:['每次渲染都执行','仅组件挂载时执行一次(cleanup在卸载)','永远不执行','报错'],answer:1,explain:'空依赖=没有依赖会变化，只运行一次effect。不传依赖则每次渲染后都跑。'},
{q:'哪个优化能减少Reflow(重排)？',level:'基础',options:['频繁逐条修改style','先添加类名批量改样式，避免多次读offset族再写','用table布局','每次都获取offsetTop'],answer:1,explain:'批量写、离线文档片段、绝对定位脱流、避免读写交替触发强制同步布局。'},
{q:'HTTPS比HTTP的优势？',level:'基础',options:['更快','TLS加密传输+身份认证，防窃听篡改冒充','兼容更好','更省带宽'],answer:1,explain:'性能略开销换来机密性、完整性、服务器身份验证。HTTP/2也几乎都在HTTPS上。'},
{q:'Webpack loader是？',level:'基础',options:['打包优化','文件类型转换管道(如TS→JS，SCSS→CSS)，链式调用','代码压缩','开发服务器'],answer:1,explain:'loader把非JS模块翻译成JS可消费的形式，匹配test规则后use数组从右向左执行。plugins是贯穿整个生命周期更强大的扩展。'},
{q:'fs.readFileSync vs fs.readFile？',level:'基础',options:['都异步','readFile异步回调；readFileSync同步阻塞线程','都同步','没区别'],answer:1,explain:'Sync方法会阻塞事件循环，仅限启动阶段加载配置或CLI等场景；一般用异步/Promise API。'},
{q:'CORS非简单请求先发什么HTTP方法预检？',level:'基础',options:['GET','POST','OPTIONS','HEAD'],answer:2,explain:'OPTIONS(Preflight)带Access-Control-Request-Method/Headers询问服务器是否允许。'},
{q:'移动端<meta viewport width=device-width>?',level:'基础',options:['禁止缩放','布局视口宽度等于设备理想视口宽度，配合initial-scale=1实现响应式基础','限制元素宽度','固定为980px'],answer:1,explain:'这是响应式基础。否则移动端默认980px布局视口，页面会被缩小显示。'},
{q:'Module Federation(模块联邦)属于哪个构建器的特性？',level:'基础',options:['Webpack 5','Vite','Rollup','esbuild'],answer:0,explain:'Webpack 5重磅功能，让多个独立构建应用运行时动态共享/加载模块，微前端新范式。'},
{q:'HTML5让input必填的布尔属性？',level:'基础',options:['validate','required','mandatory','must'],answer:1,explain:'required提交时浏览器若值为空会阻止提交并弹出原生提示。'},
{q:'Flex容器默认flex-direction？',level:'基础',options:['column 垂直','row 水平左→右','row-reverse 右→左','column-reverse'],answer:1,explain:'默认row主轴水平，起点左；交叉轴垂直起点上。'},
{q:'以下数组方法会改变原数组？',level:'基础',options:['map()','filter()','splice()','concat()'],answer:2,explain:'splice原地增删改；push/pop/shift/unshift/sort/reverse/fill/copyWithin也会改原数组。map/filter/slice/concat返回新。'},
{q:'Promise.all特点？',level:'基础',options:['任何一个先成功就返回','全部成功返回按序的结果数组；任一reject就整体reject','按完成顺序返回数组','只执行第一个'],answer:1,explain:'allSettled等待全部；race取第一个完成；any取第一个成功。'},
{q:'Vue父子组件通信推荐？',level:'基础',options:['父→子props；子→父$emit事件','子直接改props','全局变量','localStorage传'],answer:0,explain:'单向数据流！组件props只读，子组件通过$emit('event', payload)通知父组件处理。'},
{q':'React中循环的key应该加在？',level:'基础',options:['循环最外层返回的那个元素/组件上','每个子节点都重复加','只在原生DOM，组件不用','随便加'],answer:0,explain:'React在协调Diff时按同层兄弟的key匹配，正确位置是map里JSX返回的最外层节点。'},
{q':'整个页面所有资源(图片/iframe)加载完触发？',level:'基础',options:['DOMContentLoaded','load','beforeunload','pageshow'],answer:1,explain:'window.onload = DOM解析+子资源加载完成。DOMContentLoaded=DOM解析完毕，更早。'},
{q:'哪一项不是XSS的常见分类？',level:'基础',options:['存储型','反射型','DOM型','会话型'],answer:3,explain:'三大类：持久化存储、非持久化反射、前端纯DOM注入。会话型不存在。'},
{q:'Vite生产环境打包器是？',level:'基础',options:['Webpack','Rollup','esbuild','Parcel'],answer:1,explain:'开发：esbuild预构建依赖 + 原生ESM。生产：Rollup打包成熟稳定+完善插件生态。'},
{q:'Express错误处理中间件签名？',level:'基础',options:['(req, res, next)','(err, req, res, next) 四参数','(err, res, next)','(req, res)'],answer:1,explain:'必须首参是err且4个参数。在所有路由之后挂载。next(err)跳进来。'},
{q:'防止JS读取Cookie的属性？',level:'基础',options:['Secure','HttpOnly','SameSite','Path'],answer:1,explain:'HttpOnly让document.cookie读不到，抵御XSS会话Cookie窃取。'},
{q:'不是移动端适配主流方案？',level:'基础',options:['rem + html字号','viewport单位vw/vh','媒体查询响应式','固定px硬编码'],answer:3,explain:'手机屏幕宽度多样，固定px完全不适应。'},
{q':'不是微前端样式隔离方案？',level:'基础',options:['CSS Modules编译哈希类名','Shadow DOM原生隔离','scoped运行时前缀重写','全局!important覆盖'],answer:3,explain:'!important反而破坏隔离，污染更严重。其他三项都是常见隔离手段。'},
{q:'<video>封面图属性？',level:'基础',options:['cover','poster','thumbnail','preview'],answer:1,explain:'poster=图片URL。controls显示控制条；autoplay自动播放；loop循环。'},
{q:'z-index生效条件？',level:'基础',options:['所有元素','只在display:flex','position非static的元素/flex子项/grid子项','只在position:fixed'],answer:2,explain:'创建了定位上下文的元素才参与堆叠排序。Flex/Grid的子项即使static也能用z-index。'},
{q:'闭包(Closure)？',level:'基础',options:['一种for循环','函数与其定义时的词法环境的组合，可在外部访问到内部变量','一种数组方法','模块语法'],answer:1,explain:'利用闭包可做模块模式、私有变量、柯里化、防抖节流。注意大变量持有造成内存泄漏。'},
{q:'属于微任务(microtask)的是？',level:'进阶',options:['setTimeout(fn, 0)','Promise.then/catch/finally + queueMicrotask','setInterval','requestAnimationFrame'],answer:1,explain:'微任务：Promise、MutationObserver、queueMicrotask、queueMicrotask。宏任务：定时器、I/O、UI渲染、requestIdleCallback。'},
{q:'Vue3 setup返回值？',level:'基础',options:['直接渲染为DOM','暴露给模板使用的响应式数据和方法/组件实例','返回HTML字符串','无需返回'],answer:1,explain:'setup() Composition API入口，返回对象的属性模板可直接用变量/函数。'},
{q:'React受控组件？',level:'基础',options:['ref直接操作DOM值','表单值由React state驱动(value+onChange)，状态单一可信源','只读组件','表单元素自定义'],answer:1,explain:'value绑定state，onChange调用setState更新。非受控：defaultValue + ref读取。'},
{q:'First Paint (FP首次绘制)属于？',level:'基础',options:['导航阶段','解析阶段','渲染阶段的第一次像素输出','加载完成'],answer:2,explain:'FP：浏览器第一个像素被画到屏幕上，白屏结束的时间点。'},
{q:'CDN作用？',level:'基础',options:['加密数据','全球边缘节点缓存静态资源，就近访问，提速+减压源站','防SQL注入','数据库索引'],answer:1,explain:'Content Delivery Network内容分发网络，加速静态资源访问+高可用。'},
{q':'Webpack 4+提取CSS为单独文件的插件？',level:'基础',options:['css-loader','style-loader','MiniCssExtractPlugin','postcss-loader'],answer:2,explain:'MiniCssExtractPlugin替代旧ExtractTextWebpackPlugin，生产环境抽离成.css文件；style-loader开发用注入style标签。'},
{q:'Node的process.env？',level:'基础',options:['进程CPU统计','读取/设置进程环境变量对象，常用于区分dev/prod配置','内存监控','当前登录用户'],answer:1,explain:'NODE_ENV=production node app.js，代码中process.env.NODE_ENV判断加载不同配置。'},
{q:'HTTP 304含义？',level:'基础',options:['永久重定向','资源未修改，使用浏览器本地缓存(协商缓存命中)','请求格式错','服务端错误'],answer:1,explain:'协商缓存命中，响应无Body。节省带宽，URL不变内容不变→304。'},
{q:'@media (max-width: 768px)匹配？',level:'基础',options:['宽>768px','视口宽度≤768px的设备','恰好等于768px','打印样式'],answer:1,explain:'max-width即上限，宽度不超过时生效。移动优先反过来用min-width从小到大。'},
{q:'哪一项和微前端实现无关？',level:'基础',options:['iframe','qiankun/single-spa','Web Components','SSR 服务端渲染'],answer:3,explain:'SSR是首屏/SEO方案。微前端是拆分组合独立应用的架构风格。'},
{q:'HTML5 <main>标签？',level:'进阶',options:['跟<body>一样','页面主内容唯一区域，不应放重复的导航/页脚/侧边栏','主脚本加载','主要样式容器'],answer:1,explain:'ARIA和无障碍建议一页只出现一个<main>，便于屏幕阅读器快速跳转到正文。'},
{q:'用transform: translateZ(0) hack目的？',level:'进阶',options:['在Z轴移动1px','无效果但会触发合成层创建，GPU加速减少重排重绘','设置透视','3D变换'],answer:1,explain:'俗称"硬件加速hack"。副作用是提升为独立Graphics Layer，动画时只合成不repaint。滥用显存增大需谨慎。'},
{q:'Object.defineProperty的enumerable描述符控制？',level:'进阶',options:['属性值可改','属性是否可被for...in/Object.keys枚举出来','属性可删','访问getter'],answer:1,explain:'三大描述符：writable值可改；enumerable可枚举；configurable可删/可改描述符。'},
{q:'await一个rejected Promise不try/catch会怎样？',level:'进阶',options:['静默忽略','抛出异常；async函数整体变为rejected','返回undefined','进程崩溃'],answer:1,explain:'未捕获的await抛错会让async函数返回rejected Promise，继续冒泡。可用.catch或全局unhandledrejection监听。'},
{q:'Vue3 shallowRef和ref区别？',level:'进阶',options:['shallowRef更快','shallowRef只跟踪.value替换，内部属性变更不触发更新，减少大对象代理开销','shallowRef用于DOM','没有区别'],answer:1,explain:'大型对象(几十万条数据)不需深层响应时用shallowRef/shallowReactive显著降低开销，更新整体.value替换即可。'},
{q:'React useCallback vs useMemo？',level:'进阶',options:['两者相同','useCallback(fn, deps)记忆函数引用；useMemo(()=>value, deps)记忆值','useMemo记忆函数，useCallback记忆值','useCallback是类组件API'],answer:1,explain:'本质：useCallback(fn, deps) ≡ useMemo(() => fn, deps)。useCallback给子组件props防无谓渲染；useMemo缓存昂贵派生值。'},
{q:'LCP优化中错误的是？',level:'进阶',options:['推迟首屏关键CSS/字体','图片width/height明确设置避免抖动','preload关键LCP资源(hero图/字体)','避免首屏大元素过大'],answer:0,explain:'关键CSS、LCP资源要尽快加载，preload/preconnect/font-display swap。推迟关键内容反而恶化。'},
{q:'ETag比Last-Modified优势？',level:'进阶',options:['ETag节省带宽','ETag基于内容哈希，精确到字节相同，可分辨1秒内多次修改、修改时间变内容不变等情形','ETag响应更快','兼容更老浏览器'],answer:1,explain:'Last-Modified秒级精度+内容相同时间戳不同的情况ETag完胜。HTTP规范ETag优先级也更高。'},
{q:'CSRF最有效组合防御？',level:'进阶',options:['输入过滤','SameSite=Strict Cookie + CSRRF Token(请求体/Header携带校验)','HTTPS','加密Cookie'],answer:1,explain:'多层防御：SameSite Cookie禁止跨站发送 + 后端下发Token每请求校验(双重Submit Cookie/Token Pattern)。'},
{q:'Webpack Tree Shaking生效前提？',level:'进阶',options:['CommonJS模块即可','源代码用ES Modules import/export + mode:production + package.json sideEffects标记无副作用文件','什么都不用配','需插件开启'],answer:1,explain:'依赖ESM静态结构分析。sideEffects:false或数组告知哪些文件无副作用，未用export整文件删除。'},
{q:'Node Event Loop阶段顺序？',level:'进阶',options:['timers→poll→check→close callbacks','timers→pending callbacks→idle/prepare→poll→check→close callbacks','poll→timers→check→pending','check→timers→poll→idle'],answer:1,explain:'6阶段：timers(set*) → pending I/O callbacks → idle/prepare(内部) → poll(IO等待，最长驻留) → check(setImmediate) → close callbacks。阶段之间先清空microtask！'},
{q':'Nginx反向代理解决跨域原理？',level:'进阶',options:['篡改浏览器同源策略','浏览器端看是同域请求(实际Nginx内部proxy_pass到另一台)，不受同源限制；服务器间通信无同源','修改响应CORS','隐藏IP'],answer:1,explain:'同源策略是浏览器安全限制，服务器之间没这个。Nginx做透明转发，前端零改动。'},
{q:'vw/vh单位错误描述？',level:'进阶',options:['1vw=视口宽1%','1vh=视口高1%','移动浏览器普遍不支持','vmin=取vw/vh中较小的'],answer:2,explain:'现代移动浏览器已全面支持。iOS Safari早期100vh有地址栏问题可用svh/dvh/lvh新单位修正。'},
{q:'qiankun JS沙箱原理？',level:'进阶',options:['iframe隔离','Proxy包装window子应用对全局读写+快照/增量记录，卸载时还原','Web Worker线程','修改浏览器源码'],answer:1,explain:'三种沙箱：Snapshot沙箱(快照diff)、LegacySandbox(基于proxy增删改记录)、ProxySandbox(多实例，fake window)。'},
{q:'History API pushState vs replaceState？',level:'进阶',options:['都刷新页面','pushState向历史栈新增一条；replaceState替换当前栈顶记录，不增加新历史。都不触发页面刷新和popstate','replaceState触发popstate','功能相同'],answer:1,explain:'两个方法只改URL和历史记录，不刷新浏览器不触发popstate。用户后退/前进才触发popstate。'},
{q:'CSS Grid grid-area作用？',level:'进阶',options:['背景色','grid-row/column的简写，或引用grid-template-areas命名区域定位','设置轨道大小','间距'],answer:1,explain:'grid-area: row-start / col-start / row-end / col-end; 当父元素grid-template-areas命名了"header main sidebar"之类，直接写名字即可。'},
{q:'Object.create(proto) vs {} vs Object.create(null)原型链？',level:'进阶',options:['都一样','Object.create(proto)新对象.__proto__ === proto；{}→Object.prototype；Object.create(null)纯净字典无原型','{}没有原型链','new Object()无原型'],answer:1,explain:'Object.create(null)常用来做高性能字典，避免for...in或key碰撞到toString之类的原型方法。'},
{q':'事件委托(代理)原理与优点？',level:'进阶',options:['事件捕获','利用冒泡，在父元素统一监听子元素事件(e.target匹配)，减少监听器数，动态新增子元素自动生效，减少内存','只能委托给document','只适用于click'],answer:1,explain:'列表/表格/菜单场景绝佳实践。注意：不要在document上委托太多、匹配条件精确、e.stopPropagation影响。'},
{q:'Vue双端Diff算法核心思想？',level:'进阶',options:['O(n³)全量对比','同层比较+首尾双指针(oldStart/oldEnd/newStart/newEnd)四组合对比+key哈希表兜底，尽量复用DOM移动','只比较key','暴力替换'],answer:1,explain:'优先头头、尾尾、头尾、尾头→都不命中才去oldChildren建key-index Map，减少搜索。整体O(n)。'},
{q:'React Fiber核心？',level:'进阶',options:['直接把VDOM变真实DOM','把递归式调和变成链表可中断的增量任务分片，按优先级调度，空时让出主线程','移除虚拟DOM','自动Memo'],answer:1,explain:'Fiber = 虚拟栈帧 = 可暂停/恢复/优先级调度。启用并发模式后长任务不阻塞输入。'},
{q':'CLS(布局偏移)优化错误说法？',level:'进阶',options:['图片/视频显式width/height','不要在已有内容上方插入/展开动态内容','font-display: optional或预加载字体防FOUT/FOIT','频繁变换transform提升CLS'],answer:3,explain:'transform只进入合成层不占文档流，不触发CLS。反而应该用transform代替top/left做动画。'},
{q:'HTTP/2相比HTTP/1.1不包括的？',level:'进阶',options:['多路复用单TCP连接多流','HPACK头部压缩','服务器推送','强制TLS加密是协议层要求'],answer:3,explain:'h2规范本身未强制加密，但所有浏览器h2都只在HTTPS上实现，所以实际上几乎等于强制TLS。'},
{q:'CSP default-src \'self\'？',level:'进阶',options:['只允许内联脚本','默认所有资源类型(script/style/img/frame等)只能同源加载','允许所有自写脚本','禁止第三方'],answer:0,explain:'是兜底规则，被更具体的script-src/style-src/img-src/frame-src等覆盖。'}+
{q:'Vite optimizeDeps预构建作用？',level:'进阶',options:['压缩减小包体积','1.把CommonJS/UMD依赖转ESM供浏览器直接import；2.把lodash-es之类碎文件合并成单模块减少数百请求，显著提速首屏','编译TS','Tree Shaking'],answer:1,explain:'解决浏览器原生ESM时对大量CommonJS包和碎片化导入的性能瀑布问题，缓存到node_modules/.vite。'},
{q:'Node.js Stream四类？',level:'进阶',options:['Readable/Writable/Duplex/Transform','Input/Output/Async/Sync','Reader/Writer/File/Net','Source/Dest/Filter/Pipe'],answer:0,explain:'Readable可读流(读数据)、Writable可写流(写)、Duplex双工(可读可写独立)、Transform转换流(读入转换写出)。'},
{q:'跨域带Cookie withCredentials=true配合服务端要求？',level:'进阶',options:['随便设置CORS即可','Access-Control-Allow-Credentials:true 且 Access-Control-Allow-Origin必须具体域名不能是*','只需Allow-Origin:*','只要HTTPS'],answer:1,explain:'浏览器规范：当xhr.withCredentials=true，Allow-Origin通配符*将无效，必须精确源。否则响应被拦。'},
{q:'lib-flexible(手淘) rem方案原理？',level:'进阶',options:['CSS媒体查询','JS读取clientWidth，把html的font-size设为屏宽1/10，设计稿单位px转rem等比缩放','vw单位封装','meta缩放'],answer:1,explain:'移动端750px设计稿：1rem = 75px。现在新方案直接用vw代替也很流行。'},
{q:'Web Worker描述正确？',level:'高级',options:['Worker能操作DOM','Worker独立后台线程与主线程通过postMessage通信，适合大数据/复杂计算避免阻塞UI','和主线程共享内存直接写','Worker不能importScripts'],answer:1,explain:'Web Worker无window/document/DOM。结构化克隆算法传递消息；SharedArrayBuffer+Atomics可共享内存但限制多。'},
{q':'CSS @layer作用？',level:'高级',options:['CSS变量','显式声明级联层，按定义顺序决定优先级，优雅解决第三方库/业务/覆盖样式冲突','CSS动画层','媒体查询语法'],answer:1,explain:'级联层顺序：未分层 > 后定义@layer > 先定义@layer。UI库放最前layer(libs)，业务base次之，覆盖override最后，不再!important大战。'},
{q:'WeakMap与Map对比与适用？',level:'高级',options:['只是API不同','WeakMap键必须是对象、弱引用不阻GC、无size不可枚举。适合DOM关联元数据、类私有属性、临时缓存避免内存泄漏','WeakMap性能更快','Map键只能对象'],answer:1,explain:'典型用例：以HTMLElement为键存额外状态，元素移除自动回收。传统Map手动删漏了就内存泄漏。'},
{q:'手写Promise核心要点？',level:'高级',options:['有个then就行','状态机(Pending→Fulfilled/Rejected不可逆) + then回调收集+异步执行 + 返回新Promise链式 + 值穿透 + resolvePromise处理嵌套thenable/循环引用','setTimeout包一下','只要支持回调'],answer:1,explain:'Promises/A+规范要点：三种状态、then两个参数、onFulfilled/onRejected必须微任务异步、穿透、返回值递归thenable解析。'},
{q:'Vue3 Proxy+Reflect vs Vue2 defineProperty？',level:'高级',options:['原理差不多','Vue2：仅能劫持get/set，数组索引/长度/新增属性监听不到，必须深度递归初始化。Vue3 Proxy 13种操作全拦截(get/set/has/deleteProperty/ownKeys...)，懒代理(访问才递归)，性能+完整性全面碾压','Vue3兼容性更好','都一样是ES'],answer:1,explain:'全面升级：不需要$set/$delete；数组原生方法不用打补丁；支持Map/Set；更少内存初始化成本。缺点：IE11不兼容。'},
{q':'React useReducer vs useState？',level:'高级',options:['永远优先useState','useReducer适合多字段状态、多个更新路径、子组件也需更新(传递dispatch比传N个回调稳定)，通过(action.type→reducer纯函数)得到可预测数据流，配Context就是轻量Redux','useReducer是Redux专属','useState不支持对象'],answer:1,explain:'经验法则：state字段>3、更新分散在多处、子组件多处触发更新→useReducer。简单toggle/计数器→useState够用。'},
{q:'INP(Interaction to Next Paint)优化思路？',level:'高级',options:['完全靠浏览器','拆分>50ms长任务(代码切片/setTimeout/scheduler.yield)、避免冗余渲染(React memo Vue computed VList)、避免强制同步布局(批量DOM读写)、延迟非关键脚本(defer/async)，给主线程留空快速响应输入','只需要Web Worker','压缩图片即可'],answer:1,explain:'INP替代FID：衡量所有交互(点击/键盘/滚动)的总延迟=输入延迟+处理时间+展示延迟。核心仍是主线程不被长任务霸占。'},
{q:'浏览器缓存决策顺序(Memory/Disk/SW/Push)？',level:'高级',options:['只有HTTP Cache','查找：Service Worker Cache API(若注册) → Memory Cache(内存tab关失效) → Disk Cache(磁盘持久化) → Push Cache(h2仅连接期间)，都没命中才网络(含CDN)','就是按LRU','只有Disk Cache'],answer:1,explain:'四级本地缓存(内存/SW/磁盘/推送) + 网络边缘CDN + 回源。命中强缓存不发请求；协商缓存发304。'},
{q:'CSP nonce + strict-dynamic组合机制？',level:'高级',options:['strict-dynamic没用','后端每次响应生成随机nonce→script-src \'nonce-xxx\' \'strict-dynamic\'：带nonce的可信脚本动态创建的<script>自动继承信任，不用维护巨大域名白名单；兼顾安全与第三方加载器。nonce一次性；HTTPS；防注入后仍无法执行','固定nonce','允许内联'],answer:1,explain:'strict-dynamic大大降低CSP维护成本(很多站因此放弃白名单)，但nonce必须后端注入随机，不可重用。'},
{q:'Webpack/Turbopack/Rspack对比？',level:'高级',options:['无区别','Webpack：JS写的生态最全但大型项目慢；Turbopack：Rust，Vite Next继任者，基于请求级缓存增量最快；Rspack：字节Rust写的Webpack兼容替代，5-10倍HMR/构建，兼容现有loader/plugin，大型项目迁移成本最低。Rspack最平滑升级','都用Vite即可','三者API相同随便换'],answer:1,explain:'选型：新项目Vite + 插件生态；超大型历史包袱重的Webpack栈→Rspack低风险无痛升级；Next→直接上Turbopack。'},
{q:'libuv I/O多路复用不同平台实现？',level:'高级',options:['全部epoll','跨平台封装：Linux epoll、macOS/BSD kqueue、Windows IOCP、Solaris event ports，统一API给Node；线程池处理文件I/O和DNS','纯JS实现','都用select'],answer:1,explain:'libuv就是Node跨平台异步I/O的基石，抽象了事件循环+线程池。网络I/O非阻塞I/O多路复用；文件/ DNS因平台接口阻塞，丢到线程池做完回主线程。'},
{q:'SameSite Cookie三值和跨域场景？',level:'高级',options:['SameSite没用','Strict：顶级导航跨站都不带(最严，外链跳登录态丢)；Lax(Chrome 80+默认)：顶级GET导航跨站带；None：任意跨站带，但必须同时Secure=True且仅HTTPS。登录跨站/CORS带凭证→None+Secure+HTTPS','Lax最松','没区别'],answer:1,explain:'防CSRF核心靠SameSite：Strict > Lax > None。注意OAuth三方登录回跳时Strict可能让Cookie丢失，需选择Lax。'},
{q:'IntersectionObserver vs scroll事件实现懒加载？',level:'高级',options:['没区别','scroll事件需要自己getBoundingClientRect+节流，主线程负担重；IntersectionObserver异步回调在合成线程判断交叉比，0开销；rootMargin可提前200px预加载；threshold数组控制曝光。支持：曝光埋点threshold>0.5+delay才稳','轮询最好','都在主线程跑'],answer:1,explain:'现代Web性能优化推荐首选IO系列：IO(可视)、IOU(可见性)、MO(子树改动)、RO(尺寸变化)。'}
];

// ====== 后端新题 ======
const BE_NEW = [
{q:'Java定义常量关键字？',level:'基础',options:['final','const','static','immutable'],answer:0,explain:'final定义常量，引用不可变(对象内容可变)。const是Java保留字但未启用。'},
{q:'Python不可变类型？',level:'基础',options:['list','dict','tuple','set'],answer:2,explain:'tuple元组、str、bytes、frozenset是不可变。list/dict/set可变。'},
{q:'Go声明变量关键字？',level:'基础',options:['var','let','const','define'],answer:0,explain:'var声明变量；也可用:=短变量声明(函数内)。'},
{q:'Node.js基于哪个JS引擎？',level:'基础',options:['SpiderMonkey','V8(Chrome)','Chakra','JSC'],answer:1,explain:'Ryan Dahl最初基于V8 + libuv打造Node。'},
{q:'HashMap默认初始容量(JDK)？',level:'基础',options:['8','16','32','64'],answer:1,explain:'默认16，负载因子0.75，超阈值扩容2倍。'},
{q:'Python捕获异常关键字？',level:'基础',options:['catch','try','throw','except'],answer:3,explain:'try...except...finally；raise抛出异常。'},
{q:'Go goroutine推荐通信方式？',level:'基础',options:['共享变量+锁','channel','socket','pipe'],answer:1,explain:'Go箴言：不要通过共享内存来通信，要通过通信来共享内存。channel实现CSP。'},
{q:'Node.js事件模型核心？',level:'基础',options:['多线程','事件驱动非阻塞I/O','阻塞I/O','共享内存多进程'],answer:1,explain:'单线程事件循环+非阻塞I/O，用回调/异步处理大量并发连接。'},
{q:'Java String在哪个包？',level:'基础',options:['java.util','java.io','java.lang(自动导入)','java.net'],answer:2,explain:'java.lang包所有类自动导入，无需显式import。'},
{q:'Python列表推导 [x*2 for x in range(5)] = ？',level:'基础',options:['[0,2,4,6,8]','[2,4,6,8,10]','[0,1,2,3,4]','Range对象'],answer:0,explain:'range(5)=0-4，每个乘2 → [0,2,4,6,8]。'},
{q:'Go返回局部变量指针安全吗？',level:'基础',options:['不安全崩溃','编译器逃逸分析自动决定堆分配/栈分配，返回指针安全','仅int安全','仅结构体能'],answer:1,explain:'Go编译器做逃逸分析，变量逃逸出函数作用域就放堆，用户不用手动malloc/free。'},
{q:'require()作用？',level:'基础',options:['发HTTP请求','加载CommonJS模块并返回其exports对象','创建子进程','读取环境变量'],answer:1,explain:'CommonJS标准API，有缓存。'},
{q:'Java实现多线程接口？',level:'基础',options:['Runnable','Serializable','Cloneable','Comparable'],answer:0,explain:'Runnable接口只有run()方法；也可用Callable(可返回值抛异常)。'},
{q:'Python字典键的要求？',level:'基础',options:['必须字符串','必须是整数','必须可哈希(不可变)','任意类型'],answer:2,explain:'hashable → str/int/tuple(内部也得可哈希)。list/dict不可哈希不能做键。'},
{q:'Go defer执行时机？',level:'基础',options:['函数开头','函数return之前按后进先出(LIFO)执行','遇到error时','goroutine退出时'],answer:1,explain:'常用：defer file.Close()、defer mu.Unlock()。参数在defer处立即求值。'},
{q:'process.env作用？',level:'基础',options:['读取CPU信息','读写当前进程环境变量，配置文件/部署环境区分','启动子进程','内存统计'],answer:1,explain:'典型：process.env.NODE_ENV, process.env.PORT。'},
{q:'Java受检异常(Checked)？',level:'基础',options:['NullPointerException','IOException 及其子类必须显式throws或try','ArrayIndexOutOfBoundsException','ClassCastException'],answer:1,explain:'Error与RuntimeException及其子类=不受检；除此之外=受检，编译期强制。'},
{q:'Python lambda限制？',level:'基础',options:['可以多行语句','只能有单个表达式，结果自动作为返回值','必须return','可定义类'],answer:1,explain:'lambda参数: 表达式。适合短小的key函数、map/filter参数。复杂逻辑def函数。'},
{q:'Go slice vs array？',level:'基础',options:['切片只能存字符串','数组长度是类型一部分固定；切片是视图(指针+len+cap)，动态长度可变','切片不占内存','两者互等'],answer:1,explain:'arr := [3]int{1,2,3}; sli := []int{1,2,3}。append自动扩容。'},
{q:'npm是什么？',level:'基础',options:['进程管理器','Node Package Manager 包管理器','Web服务器','ORM'],answer:1,explain:'世界最大软件注册中心。npm i安装依赖；npm run执行脚本。'},
{q:'MySQL变长字符串类型？',level:'基础',options:['CHAR(n)','VARCHAR(n)','TEXT','BLOB'],answer:1,explain:'CHAR定长；VARCHAR变长最常用；TEXT大文本不参与默认排序；BLOB存二进制。'},
{q:'PRIMARY KEY不是的特征？',level:'基础',options:['唯一','非空','一表可有多个主键约束','自动建立索引'],answer:2,explain:'主键约束一张表只能有一个(可以是多列复合)。UNIQUE NOT NULL可以建多个。'},
{q:'CREATE INDEX作用？',level:'基础',options:['创建表','创建索引加速查询，代价是写入慢占空间','创建视图','创建存储过程'],answer:1,explain:'平衡：查多写少才加索引。'},
{q:'MySQL InnoDB默认隔离级别？',level:'基础',options:['READ UNCOMMITTED','READ COMMITTED','REPEATABLE READ(Oracle是RC)','SERIALIZABLE'],answer:2,explain:'InnoDB默认RR配合Next-Key Lock防幻读。'},
{q:'LIMIT 10, 5含义？',level:'基础',options:['从第10行取5行(第11-15，offset从0)','取前10行中的5行','取10到15行(含两端)','报错'],answer:0,explain:'LIMIT offset, row_count。新版MySQL 8支持：LIMIT row_count OFFSET offset。'},
{q:'NOW()函数？',level:'基础',options:['只日期','只时间','当前日期时间 Y-m-d H:i:s','时间戳整数'],answer:2,explain:'CURDATE()只日期，CURTIME()只时间，NOW()/CURRENT_TIMESTAMP日期时间。'},
{q:'COUNT(*) vs COUNT(col)？',level:'基础',options:['一样','COUNT(*)总行数(包括NULL行)；COUNT(col)统计列非NULL行数','COUNT(*)慢','都忽略NULL'],answer:1,explain:'InnoDB下COUNT(*)是优化过的，通常比COUNT(col)快，语义也准确。'},
{q:'InnoDB vs MyISAM？',level:'基础',options:['InnoDB无索引','MyISAM支持事务行锁外键','InnoDB支持ACID事务+外键+行级锁+崩溃恢复；MyISAM不支持事务已不推荐','MyISAM才是默认'],answer:2,explain:'MySQL 5.5+默认InnoDB。MyISAM全表锁、无事务、崩溃易坏。'},
{q:'LEFT JOIN特性？',level:'基础',options:['两表交集','左表所有记录即使右表不匹配也返回，右表NULL填充','右表全返回','全笛卡尔积'],answer:1,explain:'LEFT = LEFT OUTER。RIGHT右表全，INNER只匹配，CROSS笛卡尔。'},
{q:'GROUP BY作用？',level:'基础',options:['排序','按列分组，配合聚合函数(SUM/COUNT/AVG)统计','去重','分页'],answer:1,explain:'分组+聚合。SELECT 非聚合列必须出现在GROUP BY中(ONLY_FULL_GROUP_BY模式)。'},
{q:'DDL语句？',level:'基础',options:['SELECT','INSERT','ALTER(建/改/删库表结构)','UPDATE'],answer:2,explain:'DDL数据定义：CREATE/ALTER/DROP/TRUNCATE。DML：SELECT/INSERT/UPDATE/DELETE。'},
{q:'UNION vs UNION ALL？',level:'基础',options:['完全相同','UNION自动去重排序(慢)；UNION ALL直接合并不去重(快)，确信无重复时用后者','UNION ALL会去重','UNION更快'],answer:1,explain:'性能差距大，去重会有额外DISTINCT开销。'},
{q:'什么是脏读？',level:'基础',options:['读到重复数据','读到其他事务尚未提交的数据，对方回滚→脏数据','已删除数据还在读','读到加密数据'],answer:1,explain:'RU脏读→RC不可重复读→RR幻读→Serializable完全串行。'},
{q:'EXPLAIN命令干嘛的？',level:'基础',options:['执行SQL','分析执行计划：是否走索引/扫描行数/Join顺序，SQL优化神器','修复表','校验语法'],answer:1,explain:'EXPLAIN + 慢SQL。关注type(ALL需警惕)、key(用到索引)、rows(预估扫描行)、Extra(Using filesort/temporary要优化)。'},
{q:'模糊查询关键字？',level:'基础',options:['MATCH','LIKE(配合% _通配符)','REGEXP','CONTAINS'],answer:1,explain:'%任意字符；_单个字符。左模糊%xxx无法用B+树索引，要避免。'},
{q:'Redis不支持的类型？',level:'基础',options:['String','List','Tree(没有Tree)','Set/ZSet'],answer:2,explain:'5基础：String/List/Hash/Set/ZSet；扩展：Geo/HyperLogLog/Stream/BitMap。'},
{q:'Redis默认端口？',level:'基础',options:['3306','6379','8080','27017'],answer:1,explain:'3306 MySQL；6379 MERZ手机键盘；8080 Tomcat；27017 MongoDB。'},
{q:'Redis String最大？',level:'基础',options:['1KB','1MB','512MB','1GB'],answer:2,explain:'String value最大512MB。'},
{q:'设置键过期时间(秒)？',level:'基础',options:['EXPIRE key seconds','TTL key','PERSIST','DELAY'],answer:0,explain:'EXPIRE秒/ PEXPIRE毫秒；SET key value EX N也可原子设置+过期。'},
{q:'Redis List特性？',level:'基础',options:['元素唯一','双向链表实现的有序可重复列表，两端push/pop O(1)','自动排序','键值对'],answer:1,explain:'可做栈(LPUSH+LPOP)/队列(LPUSH+RPOP)。缺点查找中间O(n)。'},
{q:'Redis Hash适用场景？',level:'基础',options:['超大文本','对象/结构体存多字段，可单字段读写节省空间和流量','集合去重','排行榜'],answer:1,explain:'HMSET user:1 name "a" age 20 → 小对象存储很划算。'},
{q:'Redis Set特性？',level:'基础',options:['有序可重复','无序元素唯一不重复，交并差集运算方便','按score排序','KV字典'],answer:1,explain:'去重、共同好友(SINTER)、推荐(SUNION)。'},
{q:'RDB持久化方式？',level:'基础',options:['每条命令追加','某时点二进制快照dump到磁盘，定时/手动触发，体积小恢复快但最近数据可能丢','纯内存','实时同步'],answer:1,explain:'RDB快照：SAVE/BGSAVE；AOF写命令日志。'},
{q:'AOF持久化？',level:'基础',options:['快照','以日志形式记录所有写命令，重启重放恢复数据。fsync可调策略更安全，文件大可用重写压缩','只存键名','只存读命令'],answer:1,explain:'appendfsync: always/everysec/no。默认everysec兼顾性能安全。'},
{q:'键存在判断命令？',level:'基础',options:['FIND','EXISTS key 返回1存在0不存在','TYPE','CHECK'],answer:1,explain:'EXISTS不取值只判断存在性，O(1)。'},
{q:'Kafka消息基本单位？',level:'基础',options:['Queue','Topic','Message(包含key/value/header/timestamp)','Partition'],answer:2,explain:'Message是Kafka一条记录；Topic是逻辑分类；Partition物理分区。'},
{q:'Kafka生产者发消息到？',level:'基础',options:['Queue','Topic(主题)','Exchange','ConsumerGroup'],answer:1,explain:'按Topic逻辑发布订阅；分区是Topic下的物理并行单位。'},
{q:'RabbitMQ路由消息到Queue靠？',level:'基础',options:['Queue','Exchange(交换机)+Binding路由键','Channel','Broker'],answer:1,explain:'Exchange类型：direct精确/fanout广播/topic通配符/headers匹配。'},
{q:'RabbitMQ AMQP默认端口？',level:'基础',options:['5672','6379','9092','15672'],answer:0,explain:'5672 AMQP，15672 Web管理。9092 Kafka。'},
{q:'MQ不包括的作用？',level:'基础',options:['异步解耦','应用削峰填谷','解耦上下游','数据冷备份'],answer:3,explain:'三大作用：解耦、异步、削峰。备份不是它的目标。'},
{q:'Docker镜像与容器？',level:'基础',options:['等同','镜像是静态模板；容器=镜像运行后的实例(进程+隔离+层)，一镜像多容器','容器生成后才叫镜像','没关系'],answer:1,explain:'类与对象的关系。'},
{q':'Dockerfile首条非注释指令？',level:'基础',options:['MAINTAINER','FROM(指定基础镜像)','RUN','COPY'],answer:1,explain:'ARG是唯一可以在FROM前的指令。否则FROM必须第一。'},
{q:'列当前运行容器？',level:'基础',options:['docker list','docker ps','docker show','docker ls -c'],answer:1,explain:'docker ps运行中；docker ps -a全部(含停止)。'},
{q:'CMD会不会被docker run参数覆盖？',level:'基础',options:['不会','会(CMD是默认命令/参数)；ENTRYPOINT不会被命令行覆盖而是追加参数','CMD只能一条ENTRYPOINT可以多条','完全一样'],answer:1,explain:'推荐搭配：ENTRYPOINT固定执行程序，CMD给默认参数用户可以覆盖。'},
{q:'构建镜像命令？',level:'基础',options:['docker create','docker build -t name:tag .','docker compile','docker image make'],answer:1,explain:'-t打标签；最后一个.是上下文路径。'},
{q:'数据卷(Volume)作用？',level:'基础',options:['网络加速','容器数据持久化，生命周期独立容器可共享，避免容器删除丢数据','镜像分层加速','加密'],answer:1,explain:'-v name:/path 命名卷；-v /host:/cont 绑定挂载。'},
{q:'EXPOSE指令？',level:'基础',options:['自动绑定宿主机端口','声明容器打算监听的端口，文档性质，不会自动发布，实际需-p/-P映射','防火墙开关','禁止访问'],answer:1,explain:'EXPOSE是镜像元数据，端口真正映射需要docker run -p或Docker Compose的ports。'},
{q:'K8s最小调度/部署单元？',level:'基础',options:['Container','Pod(一个或多个共享网络/存储的容器)','Node','Deployment'],answer:1,explain:'原子调度单位。Pod里容器共享localhost、共享卷。'},
{q:'Deployment作用？',level:'基础',options:['存储','管理无状态Pod副本数、滚动更新、回滚、扩缩容','网络','配置'],answer:1,explain:'Deployment控制ReplicaSet再控制Pod，支持声明式。'},
{q:'Service作用？',level:'基础',options:['创建Pod','为一组Pod提供稳定VIP/DNS、负载均衡，屏蔽PodIP变化','存储数据','用户权限'],answer:1,explain:'Service通过LabelSelector选中Pod。ClusterIP/NodePort/LoadBalancer/ExternalName。'},
{q:'Ingress？',level:'基础',options:['服务发现','七层HTTP/HTTPS路由：按域名/路径分发到不同Service，统一入口+SSL卸载','存储','配置中心'],answer:1,explain:'需要Ingress Controller实现(常用Nginx/Traefik/istio ingressgateway)。'},
{q:'kubectl列Pods？',level:'基础',options:['kubectl get pods','kubectl list pods','kubectl show pods','kubectl status'],answer:0,explain:'kubectl get RES [-n NS] [-o wide] [-w]。'},
{q:'Nginx默认HTTP端口？',level:'基础',options:['80','443','8080','8000'],answer:0,explain:'http 80；https 443。'},
{q:'反向代理指令？',level:'基础',options:['rewrite','proxy_pass http://upstream_name;','root','try_files'],answer:1,explain:'proxy_pass转发请求到后端。配合proxy_set_header传递Host/真实IP等。'},
{q:'负载均衡后端服务器池指令？',level:'基础',options:['server块','upstream name { server ...; }块','location','fastcgi_pass'],answer:1,explain:'upstream定义池+策略(默认轮询weight/ip_hash/least_conn...)，然后proxy_pass调用。'},
{q':'rewrite指令？',level:'基础',options:['重定向URL，正则重写或内部跳转','压缩','缓存','日志'],answer:0,explain:'rewrite regex replacement [flag]; last/break/redirect/permanent。简单永久跳转优先用return 301。'},
{q':'Nginx虚拟主机server块核心？',level:'基础',options:['全局配置','listen + server_name 区分不同站点/域名','include','worker_processes'],answer:1,explain:'一个server{}=一个虚拟主机。listen端口；server_name匹配Host头。'},
{q':'CI/CD中的CI是？',level:'基础',options:['Continuous Integration 持续集成：代码提交→自动build→test','Core Integration','Code Inspection','Component Interface'],answer:0,explain:'DevOps基本实践，小步频繁提交+自动化构建测试，尽早发现问题。'},
{q:'CD不包括哪个？',level:'基础',options:['Continuous Delivery','Continuous Deployment','Continuous Debugging','两者都是CD含义'],answer:2,explain:'CD双义：Delivery自动到预发、人工批生产；Deployment全自动到生产无需人工。'},
{q:'Jenkins是什么？',level:'基础',options:['代码托管','开源CI/CD自动化服务器，流水线构建/测试/部署','容器编排','日志系统'],answer:1,explain:'Java编写，扩展丰富插件生态。Declarative Pipeline脚本定义流水线。'},
{q':'Spring Boot核心设计理念？',level:'基础',options:['XML配置优先','约定优于配置(Convention Over Configuration)+自动配置+起步依赖','需要复杂XML','必须EJB容器'],answer:1,explain:'告别Spring以前繁琐XML。独立Java -jar启动内嵌Tomcat。'},
{q:'@SpringBootApplication组合了？',level:'基础',options:['@Configuration','@ComponentScan','@EnableAutoConfiguration','以上三个都是'],answer:3,explain:'三合一：配置类+组件扫描本包+启动自动装配魔法。'},
{q:'IOC思想？',level:'基础',options:['对象自己new依赖','控制反转：对象创建与依赖注入交给容器，解耦+易测试','依赖硬编码','只能接口注入'],answer:1,explain:'好莱坞原则：Don\'t call us, we\'ll call you。依赖注入DI是IOC的实现方式。'},
{q:'AOP是什么？',level:'基础',options:['OOP替代','面向切面：把日志/事务/权限等横切关注点与业务逻辑解耦复用','面向过程','函数式'],answer:1,explain:'Advice(通知) + Pointcut(切点) + Aspect(切面)。Spring默认JDK动态代理/CGLIB。'},
{q:'@Transactional作用？',level:'基础',options:['只读','声明式事务管理，AOP拦截开启/提交/回滚事务','加密','异步'],answer:1,explain:'默认只回滚RuntimeException与Error，rollbackFor自定义。同类内调用失效。'},
{q:'CAP定理不包括？',level:'基础',options:['Consistency','Availability','Partition Tolerance','Performance'],answer:3,explain:'分布式存储必选P。C一致性vs A可用性二选一。'},
{q:'Snowflake雪花算法分布式ID结构？',level:'基础',options:['32位随机数','64位：符号位1 + 时间戳41(ms) + 机器ID 10 + 序列号12，有序递增无单点','UUID 128位','时间+IP拼接'],answer:1,explain:'41位时间戳≈69年；10位1024节点；12位每ms 4096个ID。流行方案。'},
{q:'微服务 vs 单体优势？',level:'基础',options:['运维更简单','服务独立部署扩展、技术栈灵活、故障隔离、团队自治','调用链更短','无需分布式'],answer:1,explain:'代价：运维/分布式一致性/链路追踪/网络开销。选架构看规模团队。'},
{q:'REST GET语义？',level:'基础',options:['创建','获取(读)资源，幂等安全','更新','删除'],answer:1,explain:'POST创建；GET查询；PUT整体更新；PATCH部分更新；DELETE删除。'},
{q:'JWT三部分？',level:'基础',options:['头/体/尾','Header. Payload. Signature，Base64URL(非加密)，.分隔；签名防篡改','公钥/私钥/证书','user/pass/timestamp'],answer:1,explain':'可解码看Payload，所以别存敏感信息。服务端验签才判断合法性。'},
{q:'OAuth2.0作用？',level:'基础',options:['加密协议','授权框架：第三方应用无需用户名密码获取用户资源授权(扫码登录)','身份认证协议','消息摘要'],answer:1,explain:'四种授权模式：授权码(常用)、简化、密码、客户端凭证。授权码+PKCE最安全。'},
{q:'Java线程安全HashMap？',level:'进阶',options:['ArrayList','ConcurrentHashMap(JDK8 CAS+synchronized首节点+红黑树)','Hashtable','LinkedHashMap'],answer:1,explain:'JDK1.8+抛弃分段锁，粒度细到每个桶首节点。'},
{q:'Python GIL对任务类型影响？',level:'进阶',options:['完全无法并发','CPU密集多线程无法并行(需多进程multiprocessing)；I/O密集型(睡/网络/磁盘)释放GIL可并发，多线程有效','只影响IO','只在PyPy存在'],answer:1,explain:'CPU密集→ProcessPoolExecutor；IO密集→ThreadPoolExecutor/asyncio。'},
{q':'Go空接口interface{}？',level:'进阶',options:['只能nil','任意类型都实现了空接口，用于泛型容器/未知参数传值','空结构','错误'],answer:0,explain:'类似Java Object。收值后需类型断言switch x.(type)或反射。'},
{q:'Node Event Loop阶段不包括？',level:'进阶',options:['timers(set*)','poll(IO)','check(setImmediate)','Garbage Collection(垃圾回收不属于阶段)'],answer:3,explain:'GC由V8后台独立触发，不在六阶段里。'},
{q:'B+树索引 vs B树？',level:'进阶',options:['B+树非叶不存数据只存键，数据全在叶子(用链表相连范围扫描极佳)；B树每节点都存数据','B树查询更快','B+不支持范围','B树叶子有序'],answer:0,explain:'B+树优势：更矮胖IO少、范围查询不用中序、单页存更多键缓存友好。'},
{q:'MySQL索引失效场景？',level:'进阶',options:['=常量匹配','对索引列用函数/运算、隐式类型转换、LIKE左%、or非索引列、!=、<>等','where id=1','主键查询'],answer:1,explain:'口诀：模/型/函/范/最/跳/不。最左前缀必须满足。'},
{q:'幻读 vs 不可重复读？',level:'进阶',options:['幻读=读到脏数据','不可重复读=同一行两次值不同(UPDATE)；幻读=两次同样条件行数不同(INSERT/DELETE)','都一样','区别是回滚'],answer:1,explain:'锁角度：行锁解决不可重复读；Next-Key Lock(行+间隙)解决幻读。'},
{q:'覆盖索引？',level:'进阶',options:['索引列覆盖全表','查询所需列都在联合索引里，Extra Using index，无需回表查聚簇数据行','覆盖主键','视图索引'],answer:1,explain:'回表=先查二级索引得主键，再查聚簇索引拿完整行。覆盖索引省掉第二步。'},
{q:'缓存穿透(查不存在的key)？',level:'进阶',options:['热点key过期','恶意请求DB不存在的key，缓存miss每次打DB→空值缓存+布隆过滤器挡','数据不一致','内存不够'],answer:1,explain:'空值缓存设置短TTL；布隆过滤器不存在100%确定不查。'},
{q:'击穿 vs 雪崩？',level:'进阶',options:['击穿：热点单个key瞬间失效大并发打DB；雪崩：大量key同时过期/Redis挂→DB压力爆','恶意攻击','硬件故障','网络分区'],answer:0,explain:'击穿→互斥锁重建+热点永不过期异步刷新。雪崩→TTL加随机抖动+缓存集群高可用+限流降级。'},
{q:'Redis Sentinel哨兵？',level:'进阶',options:['分片','主从自动故障转移：监控主从、通知、自动选主切主','客户端负载','持久化'],answer:1,explain:'高可用：哨兵集群独立部署，Raft选主哨兵+仲裁。Cluster模式解决数据分片+故障转移。'},
{q:'Redis Cluster分片方式？',level:'进阶',options:['一致性哈希','固定16384哈希槽，CRC16(key) mod 16384 → 节点负责部分槽。可在线迁移槽扩容缩容','按范围分片','每节点全量'],answer:0,explain:'不是一致性哈希！固定槽位好处：迁移/扩缩容是槽的移动，逻辑清晰。'},
{q:'Kafka分区作用？',level:'进阶',options:['加密','物理分片：并行写不同Broker磁盘，并行消费，提升吞吐+容灾；分区内有序','压缩','故障恢复'],answer:1,explain:'消费并行度最大=分区数。同key路由到同分区保证顺序。'},
{q:'Kafka消费者组Consumer Group？',level:'进阶',options:['压缩消息','集群消费模式：同组Consumer分摊分区，一分区只分配给组内一个消费者；不同组各自独立消费一份全量消息','生产消息','服务端过滤'],answer:1,explain:'组内消费者数>分区数→多余人闲着。重平衡Rebalance是把分区重新分给消费者的过程。'},
{q:'RabbitMQ死信交换机DLX？',level:'进阶',options:['加密通道','消息NACK/TTL过期/队列满时，自动转到绑定的死信交换机做补偿处理','重复投递','加速消费'],answer:1,explain:'典型：订单超时自动取消。给队列加x-dead-letter-exchange，TTL到达自动成死信。'},
{q':'Docker多阶段构建优势？',level:'进阶',options:['更快','FROM多段：builder阶段装编译工具+编译，最终阶段alpine/scratch只COPY可执行文件，无编译依赖镜像从几百M降到几M','更少层','跨平台'],answer:1,explain:'Go/C++/Java前端编译环境巨大，运行环境很小。瘦身同时降低攻击面。'},
{q':'Docker网络模式不包括？',level:'进阶',options:['bridge默认','host共享宿主机网络栈','overlay跨主机','router路由模式'],answer:3,explain:'6模式：bridge/host/none/container/overlay(swarm)/macvlan。'},
{q':'Deployment与Pod关系？',level:'进阶',options:['直接管理Pod','不直接；Deployment声明→ReplicaSet(保证期望副本数)→Pod。滚动更新=新旧ReplicaSet此消彼长','平级','Pod管理Deployment'],answer:1,explain:'分层管理：Deployment(滚动/回滚策略) → RS(版本) → Pod(实例)。'},
{q':'Service的Type不包括？',level:'进阶',options:['ClusterIP(默认集群内)','NodePort节点端口暴露','LoadBalancer云厂商LB','BridgeIP桥接'],answer:3,explain:'4种标准类型：ClusterIP/NodePort/LoadBalancer/ExternalName。'},
{q':'Nginx负载均衡策略不包括？',level:'进阶',options:['round-robin轮询','weight加权','ip_hash','OSPF最短路径优先'],answer:3,explain:'内置：轮询/weight/ip_hash/least_conn/least_time。OSPF是路由协议，和Nginx无关。'},
{q':'Nginx try_files $uri $uri/ /index.html作用？',level:'进阶',options:['压缩','SPA前端路由兼容：按顺序检查文件→目录→最后内部重写到/index.html交给前端Router','加密','缓存所有页面'],answer:1,explain:'Vue/React BrowserHistory模式刷新404的标准解决。'},
{q:'Jenkins Pipeline agent？',level:'进阶',options:['步骤定义','指定流水线/阶段在哪个运行环境跑：any/docker/label/...，影响构建节点与环境','触发器','通知'],answer:1,explain:'全局agent，stage内可覆盖。常用docker{ image ... }确保构建环境一致。'},
{q:'@Autowired vs @Resource？',level:'进阶',options:['完全相同','@Autowired(Spring)默认byType，配合@Qualifier按名；@Resource(JSR-250)默认byName找不到再byType','@Autowired是JDK','都按名'],answer:1,explain:'面试常考。一个Spring注解一个J2EE注解。'},
{q':'Bean默认作用域？',level:'进阶',options:['prototype','singleton 单例(整个ApplicationContext一个实例)','request','session'],answer:1,explain:'单例注意成员变量(非线程安全)、循环依赖、初始化时机。'},
{q:'@Around通知？',level:'进阶',options:['方法前','环绕：能决定是否执行目标方法、修改参数、修改返回值、捕获异常，功能最强','仅异常后','方法返回后'],answer:1,explain:'ProceedingJoinPoint.proceed(args) 执行原方法。做性能统计、重试、权限控制都用它。'},
{q:'@Transactional传播行为REQUIRED？',level:'进阶',options:['总是新事务','默认：有事务则加入，无则新建事务；常用于Service方法','必须存在事务否则抛异常','非事务执行'],answer:1,explain:'传播7种：REQUIRED/SUPPORTS/MANDATORY/REQUIRES_NEW/NOT_SUPPORTED/NEVER/NESTED(嵌套savepoint)。'},
{q:'Raft vs Paxos关系？',level:'进阶',options:['完全不同算法','Raft是Paxos可理解实现版，分解为选举+日志复制+安全性三大子问题，更易工程落地','Paxos是Raft子集','同步异步区别'],answer:1,explain:'Paxos难以理解难实现；Raft面向教学易懂，现在是etcd/Consul/ZooKeeper(3.5+有)主流实现。'},
{q:'分布式锁不包括哪项？',level:'进阶',options:['Redis SET NX EX + 续期看门狗','ZooKeeper临时有序节点','DB select for update 悲观锁','HTTP长轮询'],answer:3,explain:'HTTP不是锁。常见三实现。Redisson红锁(N节点)多Redis节点高可用。'},
{q:'Spring Cloud Gateway vs Zuul1.x？',level:'进阶',options:['Zuul1更强','Gateway基于Spring5/WebFlux响应式异步非阻塞，性能好；Zuul1.x Servlet 2.5同步阻塞多线程模型','都是同步','Gateway过时'],answer:1,explain:'Servlet异步也是后来加的。Gateway性能/生态/扩展性综合更优。'},
{q:'熔断降级目的？',level:'进阶',options:['提升接口速度','防止级联故障雪崩：下游故障→快速失败+fallback→慢慢恢复，保护上游和整体系统','加密','减少请求数'],answer:1,explain:'Sentinel/Hystrix/Resilience4j。Closed→Open→Half-Open状态机。'},
{q:'REST vs GraphQL vs gRPC？',level:'进阶',options:['gRPC REST只能查询','REST HTTP+JSON通用；GraphQL按需查字段解决过度/不足；gRPC Protobuf+HTTP/2高性能IDL跨语言微服务','都一样','GraphQL增删改用REST'],answer:1,explain:'对外通用API→REST；前端需灵活取数→GraphQL；内部服务高性能调用→gRPC。没有银弹看场景。'},
{q:'Kafka Exactly Once语义？',level:'高级',options:['自动','生产者幂等(去重)+Kafka事务(跨分区原子写)+消费端处理+提交Offset原子化(幂等+事务) 端到端','只要手动ACK','broker保证'],answer:2,explain:'0.11+：幂等生产者enable.idempotence；事务配合幂等；消费者读-处理-提交offset原子操作。'},
{q:'Kafka ISR？',level:'高级',options:['死消息队列','In-Sync Replicas：与leader同步进度达阈值的副本集合，仅ISR成员可参选新leader，保证不丢数据','索引','压缩比'],answer:1,explain:'replica.lag.time.max.ms判断。ISR中leader挂了才从ISR选新leader，丢数据风险低。'},
{q:'Docker镜像层UnionFS？',level:'高级',options:['加密','联合文件系统，多层叠加对外像一体，写时复制，共享相同层(缓存省空间+拉取快)','分层网络','校验哈希'],answer:1,explain:'每层FROM/RUN/COPY生成只读层，最上容器层可写。相同基础镜像相同层复用，拉取+存储大提速。'},
{q:'K8s QoS等级不包括？',level:'高级',options:['Guaranteed (limits==requests)最高','Burstable (设了requests < limits)','BestEffort (未设置)最低','Premium(付费)'],answer:3,explain:'OOM Kill优先级BestEffort先被宰→Burstable→Guaranteed最后杀。'},
{q':'K8s调度器两步：Predicate + Priority？',level:'高级',options:['打分→过滤','先Predicate过滤不符合节点(CPU/内存/亲和/污点等)→Priority给合格节点打分选最高分绑定Pod','随机选','先选再验证'],answer:1,explain:'Kube-scheduler调度流水线：预选过滤掉不满足条件→优选打分选胜者→Bind写API。'},
{q:'worker_processes auto + worker_cpu_affinity Nginx配合？',level:'高级',options:['减少内存','worker进程数=CPU核数，且绑定到固定CPU核，减少进程切换，提升CPU缓存命中率，高并发性能提升显著','自动重启','多核超线程'],answer:1,explain:'利用CPU亲和性，进程不迁移→L1/L2缓存命中高。'},
{q:'Spring循环依赖三级缓存？',level:'高级',options:['直接实例化就注入','singletonObjects成品/earlySingletonObjects半成品/singletonFactories提前暴露AOP代理工厂。构造外依赖：实例化→第三级放ObjectFactory→getEarlyBeanReference返回AOP代理，解决相互引用','单级缓存足够','二级缓存就够'],answer:1,explain:'面试名题：为何三级？避免每个Bean都提前做AOP，使用时才调用factory生成，同时@Async事务代理等场景能拿到正确的早期引用。'},
{q':'BASE理论与CAP关系？',level:'高级',options:['BASE和CAP矛盾','BASE是CAP权衡(基本可用、软状态、最终一致)：多数互联网业务牺牲强一致换高可用，最终一致即可','BASE=CA','BASE延伸CP'],answer:1,explain':'Basically Available(牺牲部分可用性) + Soft state + Eventually consistent。'},
{q':'雪花算法时钟回拨问题与解法？',level:'高级',options:['无问题','依赖时钟，回拨可能生成重复ID。解决：上次时间>当前→误差小sleep等，误差大直接抛异常/或多出来的回拨比特位记录序号/用Zookeeper时间','加随机数','重试即可'],answer:1,explain:'分布式ID要考虑NTP校时导致的回拨。美团Leaf/百度UidGenerator均有回拨保护实现。'},
{q':'链路追踪核心概念Trace/Span？',level:'高级',options:['只需要日志','TraceId贯穿全链路一次用户请求；SpanId表示链路中某一步调用(含ParentSpanId)；服务间透传Header，把各服务Span按父子拼成全图','指标监控','异常收集'],answer:1,explain:'OpenTelemetry标准(OpenTracing+OpenCensus合并)。后端常用Jaeger/Zipkin/SkyWalking。'},
{q:'HTTPS TLS1.2握手顺序(简化)？',level:'高级',options:['直接加密','ClientHello → ServerHello+Certificate+ServerKeyExchange+ServerHelloDone → ClientKeyExchange+ChangeCipherSpec+Finished → Server ChangeCipherSpec+Finished','服务器先发','明文传输'],answer:1,explain:'客户端随机数+服务端随机数+预主密钥(非对称加密交换)=对称会话密钥。证书链验证服务端身份。'},
{q:'JWT vs OAuth 2.0关系？',level:'高级',options:['JWT替代OAuth','JWT是令牌格式(自包含可带声明)；OAuth 2.0是授权框架，AccessToken可以是JWT(自包含)也可以是不透明随机串(需服务端验)','竞争关系','OAuth必须JWT'],answer:1,explain:'规范不同层级：OAuth定义流程；JWT只是一种可以承载信息的token格式。'},
{q':'Spring @EnableAutoConfiguration原理？',level:'高级',options:['硬编码','加载classpath:META-INF/spring.factories(或新版org.springframework.boot.autoconfigure.AutoConfiguration.imports)里的自动配置类，结合@ConditionalOnClass/@ConditionalOnMissingBean按条件按需注册Bean','扫描所有包','XML配置'],answer:1,explain:'面试必背：SpringFactoriesLoader读取候选+@Conditional系列条件装配。起步依赖就是把一堆常见starter自动配好。'}
];

// 合并：确保没有重复题干
function uniqueByQuestion(arr) {
  const s = new Set();
  const out = [];
  for (const q of arr) {
    if (!s.has(q.q)) { s.add(q.q); out.push(q); }
  }
  return out;
}
const LIN_OLD = QUESTIONS.linux;
const FE_OLD  = QUESTIONS.frontend;
const BE_OLD  = QUESTIONS.backend;
const LIN_ALL = uniqueByQuestion(LIN_OLD.concat(LIN_NEW));
const FE_ALL  = uniqueByQuestion(FE_OLD.concat(FE_NEW));
const BE_ALL  = uniqueByQuestion(BE_OLD.concat(BE_NEW));
console.log(`Linux  ${LIN_OLD.length} + ${LIN_NEW.length} = 去重后${LIN_ALL.length}`);
console.log(`Frontend ${FE_OLD.length} + ${FE_NEW.length} = 去重后${FE_ALL.length}`);
console.log(`Backend  ${BE_OLD.length} + ${BE_NEW.length} = 去重后${BE_ALL.length}`);

// 每学科取200道（优先新题，不足则从旧题补齐）
function takeN(arr, n) {
  if (arr.length <= n) return arr;
  // 优先保留level分布，简单截断前n
  return arr.slice(0, n);
}
const LIN200 = takeN(LIN_ALL, 200);
const FE200  = takeN(FE_ALL, 200);
const BE200  = takeN(BE_ALL, 200);
console.log(`最终: Linux=${LIN200.length} 前端=${FE200.length} 后端=${BE200.length}`);

function lvCnt(arr) {
  const lv={基础:0,进阶:0,高级:0}; 
  arr.forEach(q=>lv[q.level]=(lv[q.level]||0)+1); 
  return lv;
}
console.log('Linux  level:', lvCnt(LIN200));
console.log('前端   level:', lvCnt(FE200));
console.log('后端   level:', lvCnt(BE200));

QUESTIONS.linux = LIN200;
QUESTIONS.frontend = FE200;
QUESTIONS.backend = BE200;

// 写回：精确将QUESTIONS替换
function formatQuestions(obj) {
  // 对QUESTIONS中各key生成替换文本
  let s = 'const QUESTIONS = {\n';
  const keys = Object.keys(obj);
  keys.forEach((k, i) => {
    s += `  ${k}: [\n`;
    s += obj[k].map(q => {
      const optStr = JSON.stringify(q.options).replace(/"/g, "'");
      return `    {q:${JSON.stringify(q.q).replace(/"/g,"'")}, level:'${q.level}', options:${optStr}, answer:${q.answer}, explain:${JSON.stringify(q.explain).replace(/"/g,"'")}}`;
    }).join(',\n');
    s += '\n  ]' + (i < keys.length - 1 ? ',' : '') + '\n';
  });
  s += '};\n';
  return s;
}

// 找到QUESTIONS = { ... }的位置（用括号匹配）
const startToken = 'const QUESTIONS = {';
const startIdx = code.indexOf(startToken);
if (startIdx === -1) throw new Error('找不到QUESTIONS起点');
let depth = 0, i = startIdx + startToken.length - 1, foundEnd = -1;
while (i < code.length) {
  const ch = code[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { foundEnd = i; break; }
  }
  i++;
}
if (foundEnd === -1) throw new Error('找不到QUESTIONS结束花括号');
const newCode = code.substring(0, startIdx) + formatQuestions(QUESTIONS) + code.substring(foundEnd + 1);

fs.writeFileSync('/workspace/data.js', newCode, 'utf8');
console.log('✅ data.js 写入，大小:', newCode.length);

// 语法检查
try {
  require('vm').createScript(newCode);
  console.log('✅ 语法检查通过');
} catch(e) {
  console.error('❌ 语法错误:', e.message);
  process.exit(1);
}
