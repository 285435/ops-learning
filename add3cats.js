const fs = require('fs');
let code = fs.readFileSync('/workspace/data.js', 'utf8');

// ======== Linux 新增150题 ========
const LIN_NEW = [
{q:'修改文件所有者为user1、所属组为group1的正确命令是？', level:'基础', options:['chown user1.group1 file','chown user1:group1 file','chgrp user1:group1 file','chmod user1:group1 file'], answer:1, explain:'chown冒号分隔所有者和组，格式chown user:group file。'},
{q:'关于软链接(ln -s)与硬链接，以下说法正确的是？', level:'基础', options:['硬链接可以跨文件系统','软链接删除源文件后仍可正常访问','硬链接的inode与源文件相同','软链接不能对目录创建'], answer:2, explain:'硬链接指向相同inode，不能跨分区、不能对目录；软链接是独立文件，可跨分区但源删除失效。'},
{q:'系统umask设为022时，新建普通文件的默认权限是？', level:'基础', options:['755','644','664','777'], answer:1, explain:'普通文件666减umask 022得644(rw-r--r--)；目录777减得755。'},
{q:'关于Linux inode，下列说法错误的是？', level:'基础', options:['inode存储文件元信息如权限和时间','inode号在同一文件系统内唯一','删除文件是删除文件名和inode引用关系','inode中直接存储文件数据内容'], answer:3, explain:'inode存元信息和数据块指针，实际数据在data block中。'},
{q:'查看系统内存使用情况（含缓冲区和缓存），最常用命令是？', level:'基础', options:['free -h','vmstat','iostat','sar'], answer:0, explain:'free -h人类可读格式显示物理内存、swap、buffers、cached。'},
{q:'查看系统运行时间和平均负载的命令是？', level:'基础', options:['w','uptime','last','dmesg'], answer:1, explain:'uptime显示当前时间、运行时长、登录用户数、1/5/15分钟负载。'},
{q:'只看文件前20行的正确命令是？', level:'基础', options:['head -n 20 file','tail -n 20 file','cat -20 file','wc -l 20 file'], answer:0, explain:'head -n 20取前20行；tail -n 20取后20行。'},
{q:'统计文件行数、单词数、字节数的命令是？', level:'基础', options:['wc file','sort file','uniq file','cut file'], answer:0, explain:'wc显示行数字单词数字节数；wc -l只统计行数。'},
{q:'判断一个文件类型（二进制/文本/图片等）应使用的命令是？', level:'基础', options:['strings file','type file','file file','which file'], answer:2, explain:'file通过magic number判断真实文件类型，不受扩展名影响。'},
{q:'挂载/dev/sdb1到/data目录，正确命令是？', level:'基础', options:['mount /dev/sdb1 /data','mount /data /dev/sdb1','umount /dev/sdb1 /data','fsck /dev/sdb1 /data'], answer:0, explain:'mount语法：mount 设备 挂载点；卸载是umount。'},
{q:'启动nginx服务的正确systemctl命令是？', level:'基础', options:['systemctl start nginx','systemctl enable nginx','systemctl on nginx','systemctl run nginx'], answer:0, explain:'systemctl start启动；enable设置开机自启；status看状态；restart重启。'},
{q:'/etc/passwd与/etc/shadow的区别正确的是？', level:'基础', options:['/etc/passwd存储加密密码','/etc/shadow只有root可读','/etc/passwd第二个字段是UID','两个文件功能完全相同'], answer:1, explain:'/etc/passwd存基本信息（密码占位x）所有可读；/etc/shadow存加密密码仅root可读。'},
{q:'su与sudo的主要区别是？', level:'基础', options:['su需要目标用户密码，sudo需要自己密码','sudo切换用户更彻底','su只能切root不能切普通用户','两者功能完全相同'], answer:0, explain:'su切换用户需目标用户密码；sudo以目标身份执行命令需输入自己密码，可配置粒度。'},
{q:'将用户tom添加到develop组（不离开原有组），正确命令是？', level:'基础', options:['usermod -G develop tom','usermod -aG develop tom','groupmod -a tom develop','newgrp develop tom'], answer:1, explain:'usermod -aG是追加到附加组；-G会覆盖所有附加组。'},
{q:'iptables中在链末尾追加规则与头部插入规则的参数分别是？', level:'基础', options:['-A 和 -I','-I 和 -A','-D 和 -R','-L 和 -N'], answer:0, explain:'iptables -A chain在链尾追加；-I chain插入（默认第1条）。'},
{q:'firewalld中永久开放8080/tcp端口，正确命令是？', level:'基础', options:['firewall-cmd --add-port=8080/tcp','firewall-cmd --permanent --add-port=8080/tcp','firewall-cmd --add-service=8080','firewall-cmd --open-port=8080/tcp'], answer:1, explain:'--permanent写永久规则，reload后生效。'},
{q:'Debian/Ubuntu中更新软件包索引列表的命令是？', level:'基础', options:['apt-get upgrade','apt install update','apt-get update','apt-get dist-upgrade'], answer:2, explain:'apt-get update更新软件源索引；upgrade升级已安装包。'},
{q:'RHEL/CentOS中查询某个命令属于哪个RPM包的命令是？', level:'基础', options:['rpm -qa | grep cmd','rpm -qf /usr/bin/cmd','rpm -ql package','rpm -e package'], answer:1, explain:'rpm -qf 文件路径 查询哪个包提供该文件。'},
{q:'查看当前已加载的内核模块列表的命令是？', level:'基础', options:['insmod','lsmod','modprobe -l','rmmod -a'], answer:1, explain:'lsmod读取/proc/modules显示已加载模块。'},
{q:'tee命令的主要作用是？', level:'进阶', options:['压缩文件','从标准输入读取并同时写入文件和标准输出','按行分割文件','合并多个文件'], answer:1, explain:'tee类似三通管道：一边写入文件一边显示；-a追加模式。'},
{q:'xargs命令的作用是？', level:'进阶', options:['做数学运算','将标准输入转化为命令行参数传递给其他命令','按列提取文本','排序并去重'], answer:1, explain:'xargs把管道输入转为参数，解决许多命令不支持管道输入问题。'},
{q:'取出/etc/passwd第1列（用户名）和第7列（shell）并以冒号分隔，正确cut命令是？', level:'进阶', options:['cut -d: -f1,7 /etc/passwd','cut -f1,7 /etc/passwd','cut -c1,7 /etc/passwd','cut -s: -f1 7 /etc/passwd'], answer:0, explain:'cut -d指定分隔符，-f指定字段（逗号分隔多个）。'},
{q:'将文件中行按字母降序排序并去重，正确组合是？', level:'进阶', options:['sort -u file','sort -r file | uniq','sort -ru file','uniq -r file | sort'], answer:2, explain:'sort -r降序；-u排序并去重；uniq只去除相邻重复行。'},
{q:'将文件中所有小写字母转大写，正确tr命令是？', level:'进阶', options:['tr a-z A-Z < file','tr [a-z] [A-Z] file',"tr 'A-Z' 'a-z' < file",'cat file | tr lower upper'], answer:0, explain:'tr处理字符集替换从STDIN读；-d删除字符，-s压缩重复。'},
{q:'rsync -avz /src/ user@host:/dst/ 中-vz含义是？', level:'进阶', options:['验证+压缩','详细输出+压缩传输','校验+分区','版本+零拷贝'], answer:1, explain:'rsync -a归档=-rlptgoD；-v详细输出；-z压缩减少带宽。'},
{q:'通过非默认端口2222将本地文件传到远程服务器，scp正确写法是？', level:'进阶', options:['scp -P 2222 file user@host:/path/','scp -p 2222 file user@host:/path/','scp file user@host:2222:/path/','scp --port 2222 file user@host:/path/'], answer:0, explain:'scp -P指定远程端口（大写）；ssh是-p小写。'},
{q:'用dd生成一个10MB内容全为0的测试文件，正确命令是？', level:'进阶', options:['dd if=/dev/null of=test bs=1M count=10','dd if=/dev/zero of=test bs=1M count=10','dd if=/dev/random of=test bs=10M count=1','dd of=test size=10M'], answer:1, explain:'if=输入文件，of=输出文件，bs=块大小，count=块数；/dev/zero产生零。'},
{q:'关于进程优先级与nice值，正确的是？', level:'进阶', options:['nice值范围-100到100','nice值-20优先级最高，19最低','renice只能降低优先级','普通用户可以设置负nice值'], answer:1, explain:'nice值-20(最高)~19(最低)；仅root能设负值。'},
{q:'kill -9、kill -15、kill -2分别对应信号是？', level:'进阶', options:['SIGKILL、SIGTERM、SIGINT','SIGTERM、SIGKILL、SIGINT','SIGINT、SIGTERM、SIGKILL','SIGKILL、SIGSTOP、SIGQUIT'], answer:0, explain:'默认15=SIGTERM温和终止；9=SIGKILL不可捕获强制；2=SIGINT等同Ctrl+C。'},
{q:'实时跟踪nginx服务journal日志并只看今天0点以来的命令是？', level:'进阶', options:['journalctl -u nginx -f --since today','journalctl -f nginx','journalctl --unit nginx --after now','journalctl tail nginx'], answer:0, explain:'journalctl -u指定unit；-f实时跟踪；--since支持today/yesterday/时间偏移。'},
{q:'cron表达式 */5 * * * * 的含义是？', level:'进阶', options:['每5秒执行','每5分钟执行','每小时第5分钟执行','每天5点执行'], answer:1, explain:'cron五字段：分 时 日 月 周；*/n每n单位。@hourly等是快捷别名。'},
{q:'ulimit命令的作用是？', level:'高级', options:['设置磁盘配额','控制shell启动进程的资源限制','修改用户UID范围','设置网卡带宽上限'], answer:1, explain:'ulimit -n文件描述符数(高并发必调)；-u最大进程数；/etc/security/limits.conf持久化。'},
{q:'sudoers中为用户tom配置免密执行所有sudo命令的正确行是？', level:'高级', options:['tom ALL=(ALL) NOPASSWD: ALL','tom NOPASSWD=ALL','tom ALL=NOPASSWD: ALL','tom ALL=(ALL) PASSWD: ALL'], answer:0, explain:'sudoers语法：用户 主机=(切换身份) 标签:命令。visudo编辑防语法错。'},
{q:'auditd添加审计规则监控/etc/shadow写操作并标记key为shadow_change，正确auditctl是？', level:'高级', options:['auditctl -w /etc/shadow -p wa -k shadow_change','auditctl -a /etc/shadow -k shadow_change','auditctl -m /etc/shadow -p r -k shadow','aureport -w /etc/shadow -k shadow_change'], answer:0, explain:'auditctl -w 路径 -p r/w/x/a(属性变更) -k 自定义key；ausearch -k按键查。'},
{q:'LVM中在已有卷组vg0上创建名为lv_data、大小50G的逻辑卷，再扩展10G并调整ext4文件系统，正确步骤是？', level:'高级', options:['lvcreate -L 50G -n lv_data vg0 → lvextend -L +10G /dev/vg0/lv_data → resize2fs /dev/vg0/lv_data','lvcreate +50G /dev/vg0 → lv_size +10G → mkfs.ext4','pvcreate vg0 50G → vgcreate lv_data → xfs_growfs','lvcreate -n lv_data -s 50G vg0 → lvresize -10G /dev/vg0/lv_data'], answer:0, explain:'LVM：pvcreate→vgcreate→lvcreate；-L指定大小；lvextend扩容量；ext4用resize2fs，xfs用xfs_growfs。'},
{q:'临时开启内核IP转发功能并通过sysctl -p永久生效，正确操作是？', level:'高级', options:['echo 1 > /proc/sys/net/ipv4/ip_forward + 写入net.ipv4.ip_forward=1到/etc/sysctl.conf后sysctl -p','sysctl -w net.ipv4.ip_forward = 0 + /etc/sysctl添加ip_forward=1','uname -a开启转发 + 修改/boot/grub/grub.cfg','insmod ip_forward + modprobe forward'], answer:0, explain:'sysctl -w参数=值临时修改；/proc/sys文件echo临时；/etc/sysctl.conf写永久。'},
{q:'SELinux临时切换为宽容模式(Permissive)并恢复httpd网站目录默认上下文的正确组合是？', level:'高级', options:['setenforce 0 + restorecon -Rv /var/www/html','setenforce 1 + chcon -t default_t /var/www/html','getenforce 0 + semanage restore /var/www','disable_selinux + fixfiles'], answer:0, explain:'setenforce 0临时Permissive；/etc/selinux/config改永久。restorecon按策略恢复上下文。'}
];

// ======== Frontend 新增150题 前半部分 ========
const FE_NEW_A = [
{q:'以下哪个HTML5标签用于定义页面独立的文章内容？', level:'基础', options:['section','article','nav','aside'], answer:1, explain:'article标签表示页面中独立、可单独引用的内容块，如博客文章。'},
{q:'HTML5表单中哪个属性用于指定输入值必须匹配的正则表达式模式？', level:'基础', options:['required','pattern','placeholder','disabled'], answer:1, explain:'pattern属性指定输入必须匹配的正则表达式，用于表单验证。'},
{q:'HTML5拖放API中，哪个事件在拖放元素经过目标元素时持续触发？', level:'基础', options:['dragstart','dragend','dragover','drop'], answer:2, explain:'dragover持续触发，需preventDefault才能触发drop。'},
{q:'History API中哪个方法用于修改浏览器历史记录而不触发页面刷新？', level:'基础', options:['pushState','go()','back()','forward()'], answer:0, explain:'pushState(state,title,url)向历史栈添加新记录，不刷新页面。'},
{q:'ARIA中哪个属性用于为元素提供可访问名称/标签？', level:'基础', options:['role','aria-label','aria-hidden','aria-live'], answer:1, explain:'aria-label为元素提供不可见的文本标签，供屏幕阅读器朗读。'},
{q:'meta viewport标签中initial-scale=1.0的作用是？', level:'基础', options:['禁止缩放','初始缩放比例1:1','最小缩放比例','最大缩放比例'], answer:1, explain:'initial-scale设置页面初始加载时的缩放比例，1.0按设备宽度1:1显示。'},
{q:'CSS选择器优先级从高到低排序正确的是？', level:'基础', options:['class>id>element>inline','inline>id>class>element','id>inline>class>element','element>class>id>inline'], answer:1, explain:'CSS特异性：内联样式(1000)>ID(100)>类/伪类/属性(10)>元素/伪元素(1)。'},
{q:'以下哪个条件不能创建BFC？', level:'基础', options:['overflow:hidden','float:left','display:inline-block','position:static'], answer:3, explain:'position非static(如absolute/fixed)、float非none、overflow非visible等触发BFC。'},
{q:'CSS position:sticky的特点是？', level:'基础', options:['始终固定在视口','相对父元素偏移','滚动到阈值前相对，之后固定','脱离文档流不占位'], answer:2, explain:'sticky先relative，滚动到阈值(top/bottom等)后变为fixed吸附。'},
{q:'transform:translate()动画相比top/left定位动画的优势是？', level:'基础', options:['语法更简单','触发GPU合成层不重排','兼容性更好','支持更多单位'], answer:1, explain:'transform/opacity在合成线程处理，GPU加速直接，不触发layout/paint更流畅。'},
{q:'CSS transition简写属性正确的顺序是？', level:'基础', options:['duration property timing delay','property duration timing-function delay','timing property duration delay','property timing duration delay'], answer:1, explain:'transition顺序：property duration timing-function delay，duration必须设置。'},
{q:'CSS @keyframes中animation-direction:reverse的效果是？', level:'基础', options:['正向循环','反向播放（从结束到开始）','先正后反交替','不循环播放一次'], answer:1, explain:'direction:reverse从结束帧反向播放到起始帧；alternate为交替方向。'},
{q:'以下哪个CSS渐变类型是沿圆周方向从中心点向外辐射？', level:'基础', options:['linear-gradient','radial-gradient','conic-gradient','repeating-linear'], answer:1, explain:'radial-gradient径向渐变，从中心向外辐射；conic-gradient圆锥渐变绕中心。'},
{q:'CSS自定义属性（变量）语法正确的是？', level:'基础', options:['--color:red; 使用var(--color)','$color:red; 使用$color','@color:red; 使用@color','color-var:red; 使用color-var'], answer:0, explain:'CSS变量以--前缀声明，通过var(--name,fallback)读取。'},
{q:'CSS Modules的主要作用是？', level:'基础', options:['压缩CSS代码','生成局部作用域类名避免冲突','自动添加浏览器前缀','将CSS转为JS对象'], answer:1, explain:'CSS Modules将类名编译成唯一哈希值，实现CSS局部作用域，避免冲突。'},
{q:'移动端优先（Mobile First）的媒体查询写法习惯是？', level:'基础', options:['@media (max-width:768px)','@media (min-width:768px)','@media (width:768px)','@media screen only 768px'], answer:1, explain:'移动端优先先写小屏样式，用min-width逐步向大屏叠加。'},
{q:'em和rem单位的区别正确的是？', level:'基础', options:['em相对根元素，rem相对父元素','em相对父元素字体，rem相对html根字体','两者完全等价','em固定16px，rem可变'], answer:1, explain:'em继承父元素font-size计算；rem始终相对html根元素font-size更可控。'},
{q:'CSS @supports规则的作用是？', level:'基础', options:['支持旧浏览器降级','检测浏览器是否支持某CSS特性再应用样式','加载外部样式文件','定义CSS变量作用域'], answer:1, explain:'@supports是CSS特性检测查询，类似JS的CSS.supports()。'},
{q:'JS原型链中，实例obj的__proto__指向？', level:'基础', options:['Object.prototype','Constructor.prototype','obj自身','Function.prototype'], answer:1, explain:'每个实例的[[Prototype]]指向其构造函数的prototype对象，构成原型链。'},
{q:'箭头函数与普通函数在this上的区别是？', level:'进阶', options:['箭头函数this指向调用者','箭头函数没有自己的this，继承外层作用域且不可bind','箭头函数this总指向window','两者this行为完全相同'], answer:1, explain:'箭头函数不绑定this/arguments，this从词法外层继承，call/bind无法改变。'},
{q:'Promise的三种状态转换描述正确的是？', level:'进阶', options:['pending可多次转换为fulfilled/rejected','pending→fulfilled或pending→rejected，状态不可逆','fulfilled可转回pending','rejected可直接转fulfilled'], answer:1, explain:'Promise状态只能从pending变更一次到fulfilled或rejected，之后凝固不可逆。'},
{q:'以下哪个Promise方法会等待全部Promise都完成（无论成功失败）？', level:'进阶', options:['Promise.all','Promise.race','Promise.allSettled','Promise.any'], answer:2, explain:'allSettled等待所有Promise完成返回结果数组；all任一失败即整体失败。'},
{q:'async/await串行与并行执行对比正确的是？', level:'进阶', options:['多个await默认并行执行','Promise.all([p1,p2])内部是串行执行','await p1;await p2; 是串行；Promise.all是并行','串行和并行耗时总是相同'], answer:2, explain:'连续多个await按顺序等待（串行）；Promise.all同时触发所有Promise并等待全部（并行）。'},
{q:'JS事件循环中微任务队列不包含以下哪个？', level:'进阶', options:['Promise.then回调','MutationObserver','queueMicrotask','setTimeout回调'], answer:3, explain:'微任务：Promise、MutationObserver、queueMicrotask；setTimeout/setInterval属于宏任务。'},
{q:'关于变量提升和TDZ，以下说法正确的是？', level:'进阶', options:['let/const不提升也无TDZ','var提升且初始化为undefined；let/const提升但进入TDZ不能访问','let和var提升行为完全相同','const可先使用后声明'], answer:1, explain:'var声明被提升并初始化为undefined；let/const同样提升但未初始化前处于TDZ临时死区，访问报错。'},
{q:'JS中==与===区别，以下哪个是falsy值？', level:'进阶', options:['0与"0"===相等','"false"转为布尔值为false','0、""、null、undefined、NaN、false都是falsy','[]转换为布尔值为false'], answer:2, explain:'falsy共6个：false/0/空串/null/undefined/NaN；===不做类型转换，==隐式转换。'},
{q:'深浅拷贝对比，structuredClone()的特点是？', level:'进阶', options:['只能拷贝基础类型','支持循环引用，可拷贝Date/RegExp/Map/Set等','和JSON.parse(JSON.stringify())完全等价','只能拷贝数组'], answer:1, explain:'structuredClone是JS原生深拷贝API，支持循环引用、Date/RegExp/Map/Set/ArrayBuffer；JSON法丢函数/循环引用。'},
{q:'Proxy相比Object.defineProperty的优势是？', level:'进阶', options:['兼容性更好','Proxy直接代理整个对象，可拦截数组下标/新增属性/删除等更多操作','语法更简单','不需要配合Reflect使用'], answer:1, explain:'defineProperty只能劫持单个属性，需递归+数组变异方法hack；Proxy代理整个对象，拦截13种操作。'},
{q:'WeakMap与Map的主要区别是？', level:'进阶', options:['WeakMap键可以是任意类型','WeakMap键必须是对象，且为弱引用不阻止GC，不可枚举','WeakMap有size属性','WeakMap支持clear()遍历所有键'], answer:1, explain:'WeakMap键仅接受对象且为弱引用（无其他引用时自动被GC回收），没有size、无法遍历。'},
{q:'Map相比普通Object的优势是？', level:'进阶', options:['Map存取更快永远比Object好','Map键可为任意类型、保持插入顺序、直接迭代、有size属性快速获取长度','Object的key不会被转字符串','Map语法更短'], answer:1, explain:'Map键保持插入顺序、支持任意类型键、迭代方便（for...of/entries）、size直接取长度。'},
{q:'DOM querySelector与getElementsByClassName的重要区别是？', level:'进阶', options:['querySelector返回的是静态NodeList，后者返回的是动态HTMLCollection','都是静态集合完全一样','querySelector性能总是更好','后者支持CSS选择器'], answer:0, explain:'getElementsBy*返回动态集合（DOM变化实时更新）；querySelectorAll返回静态NodeList。'},
{q:'Vue3中computed与watch的核心区别是？', level:'进阶', options:['computed有缓存、依赖声明式、返回值用；watch监听副作用、可immediate/deep','watch有缓存更适合算派生值','computed不可读取','watch不能监听嵌套属性'], answer:0, explain:'computed基于依赖缓存，多次访问只在依赖变时重算，用于派生数据；watch用于监听变化后执行副作用。'},
{q:'unknown与any的区别正确的是？', level:'高级', options:['完全一样都任意类型','unknown需先类型断言/收窄才能使用；any完全放弃检查随意用','any更安全推荐','unknown不能赋值给任何类型'], answer:1, explain:'unknown是类型安全的any，必须先类型判断（typeof/instanceof/守卫）才能操作；any跳过所有检查。'},
{q:'Core Web Vitals三大核心指标不包含？', level:'高级', options:['LCP最大内容绘制','FID首次输入延迟','CLS累积布局偏移','TBT总阻塞时间'], answer:3, explain:'三大Core Web Vitals是LCP（加载）、FID（交互→被INP替代中）、CLS（视觉）；TBT是辅助指标。'},
{q:'Tree Shaking生效的必要条件是？', level:'高级', options:['必须CommonJS模块','必须ES Module（import/export）静态语法，配合构建工具sideEffects声明','只要压缩就生效','所有格式均可'], answer:1, explain:'Tree Shaking依赖ESM静态结构分析（import/export不可动态），package.json的sideEffects标记无副作用文件。'},
{q:'XSS三种类型中DOM型XSS的特点？', level:'高级', options:['服务端拼接HTML返回导致','前端JS直接将不可信数据插入DOM（如innerHTML），全程不经过服务器','用户提交后数据库存储再渲染','仅IE浏览器存在'], answer:1, explain:'DOM型XSS是纯前端漏洞：location.hash/URL参数/userInput等未经转义直接赋值innerHTML/document.write/src等。'},
{q:'CORS预检请求OPTIONS包含哪个关键请求头？', level:'高级', options:['Access-Control-Allow-Origin','Access-Control-Request-Method / Access-Control-Request-Headers','Origin','以上都对'], answer:1, explain:'预检OPTIONS携带Request-Method（将用的非简单方法如PUT）和Request-Headers（自定义头）。'},
{q:'webpack loader与plugin的区别？', level:'高级', options:['loader处理文件转换（如babel转译JS）；plugin扩展构建流程任一环（打包优化/资源管理/注入变量）','plugin处理单个文件转换','loader可监听整个构建生命周期','两者功能完全一致'], answer:0, explain:'loader是文件转换器（链式调用）；plugin基于Tapable钩子在编译各阶段注入逻辑。'}
];

// ======== Frontend 新增150题 后半部分 补充 ========
const FE_NEW_B = [
{q:'HTML中DOCTYPE声明的作用是？', level:'基础', options:['引入样式','声明HTML版本，让浏览器用标准模式渲染','定义脚本','注释'], answer:1, explain:'DOCTYPE告知文档HTML版本，浏览器选标准/怪异模式。'},
{q:'<meta charset="UTF-8">作用是？', level:'基础', options:['页面标题','声明文档字符编码为UTF-8防乱码','关键字','作者'], answer:1, explain:'charset元信息声明字符编码，必须放head最前。'},
{q:'<a target="_blank">作用是？', level:'基础', options:['当前页打开','新标签/新窗口打开链接','无效果','同框架打开'], answer:1, explain:'_blank新窗口；_self当前。加rel=noopener更安全。'},
{q:'引入外部CSS的标签是？', level:'基础', options:['<style>','<link>','<script>','<css>'], answer:1, explain:'<link rel="stylesheet" href=...>外部引入；<style>内嵌。'},
{q:'引入外部JavaScript的标签是？', level:'基础', options:['<script src="a.js">','<link src="a.js">','<style src="a.js">','<javascript src="a.js">'], answer:0, explain:'<script>标签src属性引入外部JS。'},
{q:'defer和async加载脚本区别是？', level:'基础', options:['相同','defer按序在DOM解析后执行；async加载完立即执行乱序','async更慢','defer立刻执行'], answer:1, explain:'两者并行下载不阻塞HTML；defer顺序执行适合有依赖；async无依赖统计脚本适用。'},
{q:'HTML5新增语义化标签不包括？', level:'基础', options:['<header>','<nav>','<section>','<table>'], answer:3, explain:'<table>早就有；新增header/footer/nav/main/article/section/aside。'},
{q:'<img>必须的属性是？', level:'基础', options:['src','alt','src和alt都非常重要','width'], answer:2, explain:'src必填；alt替代文本无障碍SEO必需。'},
{q:'<ul>和<ol>区别是？', level:'基础', options:['相同','ul无序列表圆点；ol有序1.2.3.','ul横向；ol纵向','ul下拉；ol弹出'], answer:1, explain:'<ul>无序默认•；<ol>有序默认数字字母。'},
{q:'创建下拉菜单的标签是？', level:'基础', options:['<input>','<select><option>','<menu>','<dropdown>'], answer:1, explain:'<select multiple>多选或单选；<optgroup>分组。'},
{q:'CSS盒模型box-sizing:border-box表示？', level:'基础', options:['默认盒模型','宽高包含content+padding+border，布局更直观','仅border算宽','宽高只算content'], answer:1, explain:'*{box-sizing:border-box}现代前端常用；content-box宽高仅内容区。'},
{q:'margin合并(塌陷)发生在哪？', level:'基础', options:['所有元素','垂直方向相邻块级元素；父子块无padding/border/content分隔时','内联元素','水平方向'], answer:1, explain:'上下margin取大者；BFC(overflow:hidden/flex等)可防。'},
{q:'display:none和visibility:hidden区别？', level:'基础', options:['相同','display:none完全脱离文档流不占空间；visibility:hidden仍占空间仅视觉隐藏','前者性能好','后者更兼容'], answer:1, explain:'display:none重排+重绘；visibility仅重绘。过渡动画需非none开始。'},
{q:'Flex布局主轴对齐属性是？', level:'基础', options:['align-items','justify-content','flex-wrap','flex-direction'], answer:1, explain:'justify-content主轴(X默认)对齐；align-items交叉轴。'},
{q:'Flex:1是哪三个属性的简写？', level:'基础', options:['flex-grow+flex-shrink+flex-basis','flex-direction+flex-wrap+flex','auto+none+1','grow+shrink+width'], answer:0, explain:'flex:1 = grow:1 shrink:1 basis:0%；实现等比分配剩余空间。'},
{q:'媒体查询@media (max-width:768px)含义？', level:'基础', options:['大屏生效','视口宽度≤768px时应用里面样式(移动端适配)','打印样式','横屏'], answer:1, explain:'max-width=断点以下；min-width=以上。'},
{q:'CSS中em和rem区别是？', level:'基础', options:['相同','em相对父元素字号；rem相对根html字号做响应式自适应','rem相对父','em固定单位'], answer:1, explain:'html{font-size:16px}则1rem=16px；组件内边距可用em相对组件字号。'},
{q:'JS中==和===区别？', level:'基础', options:['相同','==允许类型转换后比较；===严格等同时比较类型和值(推荐)','===更快但不准','==更安全'], answer:1, explain:'推荐默认用===；NaN与任何不等，用Number.isNaN()判断。'},
{q:'var let const区别是？', level:'基础', options:['相同','var函数提升、可重复声明；let/const块级作用域、TDZ；const值不可变(对象内部可变)','const可变'], answer:1, explain:'现代优先const，需重新赋值才用let；避免var。'},
{q:'数组方法map和forEach区别是？', level:'基础', options:['都是遍历','map返回等长新数组不修改原数组；forEach仅遍历返回undefined','map更快','forEach更函数式'], answer:1, explain:'纯函数转换用map；副作用(打印/改外部/请求)用forEach。'},
{q:'typeof null的结果是？', level:'基础', options:['"null"','"object"(历史遗留bug)','"number"','undefined'], answer:1, explain:'typeof null==="object"是JS一版设计错误；Array/Date也object需Array.isArray判断。'},
{q:'Promise三种状态是？', level:'基础', options:['开始/中间/结束','pending(等待)/fulfilled(成功)/rejected(失败)，状态不可逆','new/old/error','sync/async/error'], answer:1, explain:'构造内resolve→fulfilled或reject→rejected；一旦确定凝固。'},
{q:'async function返回什么？', level:'基础', options:['undefined','返回Promise对象，可用await取值','Generator','直接值'], answer:1, explain:'async即使return 1也包装Promise<1>；await仅在async函数或ESM顶层可用。'},
{q:'事件冒泡和捕获区别是？', level:'基础', options:['相同','冒泡：从目标向根(document)传播；捕获：从根向目标；addEventListener第三参数true=捕获','冒泡更快','捕获旧浏览器才用'], answer:1, explain:'标准流：捕获→目标→冒泡。stopPropagation阻止继续传播。'},
{q:'事件委托/代理是什么？', level:'基础', options:['事件仅自己响应','父元素监听事件，通过e.target判断匹配子元素统一处理动态元素也有效','取消事件','多事件合并'], answer:1, explain:'适合列表/表格动态项；减少监听器数量提升性能。'},
{q:'localStorage和sessionStorage区别是？', level:'基础', options:['相同','localStorage同源持久化永久；sessionStorage同源同标签页关闭即清','localStorage容量小','sessionStorage跨标签'], answer:1, explain:'容量约5MB同源；只能存字符串对象要JSON.stringify。'},
{q:'AJAX核心对象是？', level:'基础', options:['ActiveX','XMLHttpRequest','HTTPRequest','AJAX'], answer:1, explain:'var xhr=new XMLHttpRequest(); open/send/onreadystatechange；现代多封装fetch/axios。'},
{q:'HTTP请求方法PUT和POST区别习惯？', level:'基础', options:['相同','PUT幂等多次调用结果相同(通常整体更新)；POST非幂等创建','POST改数据','PUT新建'], answer:1, explain:'RESTful规范：GET查/POST建/PUT整体改/PATCH局部改/DELETE删；幂等=N次=1次。'},
{q:'Cookie的HttpOnly属性作用是？', level:'基础', options:['只能HTTP用','禁止JS访问document.cookie读取，防XSS窃取会话Cookie','仅HTTPS','仅首页用'], answer:1, explain:'HttpOnly+Secure+SameSite配合是防会话劫持关键三属性。'},
{q:'Cookie的Secure属性作用是？', level:'基础', options:['防篡改','仅HTTPS传输发送Cookie，HTTP下不会携带防中间人','仅本地','仅签名'], answer:1, explain:'HTTPS链路TLS加密；Secure保证Cookie不被HTTP明文请求发出。'},
{q:'SameSite=Strict/Lax/None区别？', level:'基础', options:['相同','Strict完全禁止跨站Cookie；Lax允许顶层GET导航跨站；None允许但必须Secure一起','None=严格'], answer:1, explain:'现代浏览器默认Lax；第三方登录/嵌入需None+Secure。'},
{q:'Vue/React中"key"作用是？', level:'基础', options:['美观','Diff虚拟DOM算法中唯一标识项，提高列表更新准确率避免复用错误','数据绑定','样式标记'], answer:1, explain:'不要用随机key(每次渲染全重建)；不要用index(插入删除时兄弟错位)。'},
{q:'React Hooks中useEffect第二个参数[]依赖数组作用是？', level:'基础', options:['返回数组','空数组仅挂载1次卸载清；非空则依赖变化才重执行','参数数组','错误捕获'], answer:1, explain:'不写第二个参数=每次渲染后都执行；函数返回cleanup在下次前或卸载时调用。'},
{q:'浏览器重绘Repaint和重流Reflow区别？', level:'基础', options:['无','重绘=视觉属性改(颜色)不重排；重流=几何属性改需要重新计算布局(成本高)','重流比重绘便宜','相同'], answer:1, explain:'重流必引起重绘。批量改DOM/离线Fragment/绝对定位脱流/避免频繁读offset族。'},
{q:'SPA和MPA区别？', level:'基础', options:['无','SPA单页应用(客户端路由切换无刷新)；MPA多页面每次整页刷新。前者体验好后者首屏快SEO好','MPA性能更优','SPA利于SEO'], answer:1, explain:'Vue/React/Angular默认SPA；SEO重要可SSR(Next/Nuxt)或预渲染/SSG补偿。'},
{q:'SSR服务端渲染优点？', level:'基础', options:['减轻服务器','首屏HTML直出更快FCP/LCP+SEO爬虫拿到完整内容','开发简单','不需要JS'], answer:1, explain:'首屏有内容用户不看白屏；搜索引擎不执行JS也爬得到；以Nuxt/Next框架减少开发量。'},
{q:'Vite相比Webpack开发启动快的核心？', level:'基础', options:['一样快','开发用浏览器原生ESM不打包按需编译；rollup打包生产。esbuild预处理极快','Vite功能少','Webpack没缓存'], answer:1, explain:'冷启动Vite远胜；首次访问文件才转译。大型项目热更新按模块更新更稳。'},
{q:'前端性能优化中减少白屏时间FCP指？', level:'基础', options:['First Contentful Paint首次内容绘制，看到第一个可见内容时间','完全加载','首字节','DNS时间'], answer:0, explain:'Web Vitals：FCP/LCP/CLS/TTI/TBT/FID。'},
{q:'LCP(Largest Contentful Paint)衡量什么？', level:'基础', options:['脚本执行','最大文本/图片/视频块出现在视口时间，Core Web Vitals最重要','样式加载','网络时间'], answer:1, explain:'优化方向：图片压缩/CDN/预加载/懒加载、字体font-display:swap、减少阻塞CSS/JS。'},
{q:'图片懒加载原生HTML属性是？', level:'基础', options:['lazy="true"','<img loading="lazy"> 原生推迟加载视口外图片','data-src','defer'], answer:1, explain:'Chrome 77+支持原生；兼容性考虑IntersectionObserver兜底。'},
{q:'CORS跨域请求中简单请求和预检请求区别？', level:'进阶', options:['相同','简单请求(GET/HEAD/POST+无自定义头+特定Content-Type)直接发；其他先发OPTIONS预检服务端返回Access-Control-*才发真请求','预检更快','预检只一次'], answer:1, explain:'预检OPTIONS头Request-Method/Headers；响应Allow-Methods/Headers/Credentials/Max-Age缓存。'},
{q:'实现节流throttle和防抖debounce区别？', level:'进阶', options:['相同','防抖：短时间多次触发只执行最后一次(如搜索输入)；节流：固定时间窗内只执行一次(如滚动)','防抖=节流','防抖更省性能'], answer:1, explain:'leading/trailing配置首/尾执行；场景：resize防抖、scroll节流。'},
{q:'JS深拷贝常用方法与坑？', level:'进阶', options:['JSON.parse(JSON.stringify())万能','JSON法丢函数/undefined/Symbol/正则/Date等；structuredClone现代原生；lodash.cloneDeep更全','浅拷贝就是深拷贝','递归赋值就行'], answer:1, explain:'支持循环引用：structuredClone(Node17+/新浏览器)、lodash；JSON.stringify遇BigInt抛错。'},
{q:'原型链最终尽头是？', level:'进阶', options:['Function.prototype','Object.prototype.__proto__===null','undefined','window'], answer:1, explain:'对象[[Prototype]]→…→Object.prototype→__proto__=null。Object.create(null)创建字典无原型链。'},
{q:'闭包的典型应用场景？', level:'进阶', options:['内存泄漏','封装私有变量(模块模式)、柯里化、函数工厂、事件回调持久化状态','继承','类'], answer:1, explain:'return function仍访问外部作用域；循环var异步回调拿i要IIFE或let块级。'},
{q:'Event Loop宏任务微任务执行顺序？', level:'进阶', options:['微→宏乱序','同步代码→取出当前所有微任务清空→下一轮宏任务→再清空微任务……Promise/queueMicrotask是微任务；setTimeout/I/O/UI渲染是宏任务','宏=微','宏优先全跑'], answer:1, explain:'同一轮微任务先全部执行完再取一个宏任务，影响UI刷新时机。Vue/React调度用微任务批处理。'},
{q:'实现继承Class extends和寄生组合继承本质？', level:'进阶', options:['相同','ES6 Class extends本质原型继承+构造函数call，父原型链指向super.prototype(Object.setPrototypeOf)；ES5寄生组合优化原型共享constructor多余属性','寄生更差','Class原型拷贝'], answer:1, explain:'最佳实践：子类原型=Object.create(父类原型)，修正constructor。避免new Parent()导致父实例属性污染共享。'},
{q:'CSS BFC是什么及触发条件？', level:'进阶', options:['浏览器前缀','块级格式化上下文，内部布局不影响外部；触发：overflow非visible/flex/grid/position:absolute或fixed/inline-block等','字体格式','块流式'], answer:1, explain:'BFC典型：清除浮动父加overflow:hidden、阻止margin塌陷、两栏自适应避免文字环绕浮动。'},
{q:'实现三栏布局左右定宽中间自适应最佳现代？', level:'进阶', options:['圣杯布局','Flex: .wrap{display:flex}; .mid{flex:1}左右固定宽；或Grid grid-template-columns: 200px 1fr 200px','浮动','绝对定位'], answer:1, explain:'Flex简单；Grid更语义；圣杯/双飞翼是IE时代技巧，现代不必。'},
{q:'响应式断点移动端优先设计原则？', level:'进阶', options:['先写大屏','先写最小屏幕基础样式，再加min-width媒体查询向平板/桌面扩展；减少覆盖代码','只写媒体查询','像素必须px'], answer:1, explain:'移动端优先(min-width升序)比桌面优先(max-width)代码更少更简洁。'},
{q:'CSS变量(CSS自定义属性)优点？', level:'进阶', options:['兼容所有IE','--name定义var(--name)使用；可级联覆盖+JS动态读写+主题切换一行改全局+媒体查询改','性能比预处理器好','只能在:root定义'], answer:1, explain:'配合prefers-color-scheme自动深色模式；JS:document.documentElement.style.setProperty("--c","#000")。'},
{q:'V8如何优化JS执行？', level:'进阶', options:['解释执行','先Ignition解释字节码→热点函数TurboFan JIT编译优化机器码；内联缓存/隐藏类/逃逸分析优化','直接机器码','慢于旧引擎'], answer:1, explain:'保持对象形状稳定(同类属性顺序一致)利于隐藏类优化；避免arguments泄漏利于逃逸分析栈分配。'},
{q:'Code Splitting代码分割方法？', level:'进阶', options:['只有路由懒加载','入口分割+路由动态import()按组件分包+vendor分离；动态组件按需加载','只有vendor','必须手动'], answer:1, explain:'Webpack魔法注释/webpackChunkName命名；React.lazy+Suspense；Vue defineAsyncComponent异步组件。'},
{q:'preload和prefetch区别？', level:'进阶', options:['相同','<link rel=preload as=...>当前页优先级高立即加载；prefetch=闲时预取下页资源将来可能用','prefetch优先级更高','preload仅图片'], answer:1, explain:'滥用preload挤占带宽；首屏关键JS/CSS/字体用preload，下页路由切换prefetch。'},
{q:'HTTP/2与HTTP/1.1核心提升？', level:'进阶', options:['一样','二进制分帧、多路复用单TCP并发多流无队头阻塞(但TCP层面仍有)、HPACK头部压缩、服务器推送','仅加密','URL更好'], answer:1, explain:'域名分片、雪碧图、文件合并等HTTP/1技巧在HTTP/2反而可能不利。'},
{q:'Service Worker核心能力？', level:'进阶', options:['直接操作DOM','可拦截fetch请求、离线缓存策略、推送通知(PWA)；HTTPS必需/localhost例外，独立线程','后台任务仅定时器','同步Ajax'], answer:1, explain:'Cache Storage缓存：CacheFirst/NetworkFirst/Stale-While-Revalidate等；workbox简化复杂缓存。'},
{q:'WebSocket与SSE(EventSource)区别？', level:'进阶', options:['相同','SSE单向服务端→客户端HTTP长连接自动重连简单；WebSocket全双工双向适合高频互动(IM/游戏)','SSE双向','WS更简单'], answer:1, explain:'SSE优点：HTTP友好、断线自动重连、文本事件流。ws://wss://二进制需协议升级握手。'},
{q:'XSS攻击三类和防护核心？', level:'高级', options:['完全由浏览器防御','存储型(入库后渲染)/反射型(URL参注入)/DOM型(前端脚本自己拼)；核心：任何用户输入到HTML/JS/CSS/URL必须按上下文转义+CSP白名单限制脚本源','仅HttpOnly','仅输入校验'], answer:1, explain:'输出转义按场景：HTML实体/JS Unicode/URL编码/CSS转义；Vue/React默认转义；v-html需先sanitize；CSP严格模式极大降低损害。'},
{q:'CSRF攻击和防御核心？', level:'高级', options:['SameSite=Lax足够','核心：跨站请求浏览器自动带Cookie。防护：CSRF Token+SameSite=Strict/Lax+验证Origin/Referer+关键操作二次验证','只要HTTPS','仅验证码'], answer:1, explain:'CSRF只改读不到返回；JSON API只Content-Type:application/json本身带预检也是一层；但仍加Token更稳。'},
{q:'点击劫持(Clickjacking)防御？', level:'高级', options:['验证码','X-Frame-Options:DENY/SAMEORIGIN；CSP frame-ancestors指令；前端top!=self破框(可被sandbox阻止)','仅HTTPS','防JS'], answer:1, explain:'X-Frame-Options响应头禁止第三方iframe嵌套；CSP frame-ancestors更灵活多源白名单。'},
{q:'Vue3 Composition API和Options API核心区别？', level:'高级', options:['完全重写不兼容','Options API按选项(data/methods/computed)分散；Composition API按逻辑聚合更好TS类型、更好逻辑复用(组合函数代替mixin命名冲突)、更好Tree Shaking','Options已废弃','Composition慢'], answer:1, explain:'setup()或<script setup>；ref/reactive/computed/watch/watchEffect；provide/inject跨组件传；mixin因命名污染和来源不明不再推荐。'},
{q:'React Fiber架构本质？', level:'高级', options:['就是虚拟DOM','把渲染更新拆成可中断的增量单元，空闲时调度，避免长任务卡死主线程，从而实现时间切片和可优先级调度','只是性能','服务端渲染'], answer:1, explain:'Fiber=链表节点=虚拟堆栈帧；优先级Lanes模型；同步模式仍一次性提交，并发(concurrent)模式才真打断。'},
{q:'虚拟DOM Diff经典协调三策略？', level:'高级', options:['穷举对比','1.不同类型节点直接替换整树 2.同类型DOM节点复用+更新属性 3.列表用key一一复用和移动；O(n)非O(n³)','全量重建','深度优先'], answer:1, explain:'同层比较不跨层；两类型不同直接新树；key提高列表复用正确率减少DOM操作。key错误导致状态错乱。'},
{q:'Svelte与Vue/React的根本不同？', level:'高级', options:['相同语法','Svelte编译时框架，无虚拟DOM运行时，编译直接生成命令式DOM更新代码+细粒度订阅，包小性能优；Vue/React需要运行时+VDiff','Svelte必须TS','Svelte兼容性最好'], answer:1, explain:'Svelte包体积极小适合微件/活动页；大型项目运行时生态和成熟度比React/Vue略弱。'},
{q:'微前端qiankun的JS隔离和样式隔离原理？', level:'高级', options:['iframe天然隔离','JS沙箱：Proxy劫持window(快照/Proxy/Legacy沙箱)；样式：严格模式下shadow DOM或自定义前缀scoped/css modules或运行时动态作用域选择器','仅后缀命名','重写浏览器API'], answer:1, explain:'沙箱保证子应用window读写不污染全局；样式隔离推荐子应用严格按CSS Modules/约定前缀。'},
{q:'性能优化之Long Task(长任务)如何定位？', level:'高级', options:['看console.log','Chrome Performance面板看主线程红条+Bottom-Up/Call Tree找耗时函数；PerformanceObserver API监测longtask事件','只看Network','查看内存'], answer:1, explain:'任务>50ms算Long Task影响交互响应性(TBT/FID)；拆分重计算Web Worker离线程；React startTransition降低非紧急更新优先级。'}
];

// ======== Backend 新增150题 前半 ========
const BE_NEW_A = [
{q:'Python中list和tuple的主要区别是什么？', level:'基础', options:['list和tuple都是可变的','list可变(可增删改)，tuple不可变','list不可变，tuple可变','两者都不可变，仅语法不同'], answer:1, explain:'list可变序列支持增删改；tuple不可变序列，创建后不可修改，常用于不可变配置。'},
{q:'以下哪个是正确的Python推导式语法？', level:'基础', options:['[x*2 for x in range(5)] 是列表推导式','{x: x**2 for x in range(3)} 是集合推导式','{x for x in "abc"} 是字典推导式','推导式只能生成list类型'], answer:0, explain:'方括号[]列表推导，{k:v}字典推导，{v}集合推导，三种都支持推导式。'},
{q:'Python生成器(yield)的主要优势是什么？', level:'基础', options:['惰性生成值，每次返回一个并暂停，节省大量内存','一次性将所有值加载到内存中处理更快','yield和return功能完全相同','generator不能用for循环遍历'], answer:0, explain:'yield惰性求值，生成器一次只产一个值并暂停状态，特别适合处理大数据集/无限流。'},
{q:'Python装饰器中functools.wraps的作用是什么？', level:'基础', options:['保留被装饰函数的__name__、__doc__等元信息','让装饰器执行得更快','将函数变成类装饰器','让装饰器支持多层嵌套'], answer:0, explain:'不用wraps装饰的wrapper会覆盖原函数名和文档，@wraps(func)可将元信息从原函数复制到包装。'},
{q:'Python GIL全局解释器锁对任务类型的影响？', level:'基础', options:['GIL主要影响CPU密集型，IO密集型(网络/磁盘)可正常并发','GIL导致Python完全无法做任何并发','多线程可绕过GIL处理CPU密集','GIL只在PyPy解释器中存在'], answer:0, explain:'CPU密集用multiprocessing多进程利用多核；IO密集线程释放GIL等待外部IO，多线程/协程有效。'},
{q:'面向对象OOP的三大核心特性是？', level:'基础', options:['封装、继承、多态','抽象、组合、聚合','多态、递归、泛型','封装、重载、重写'], answer:0, explain:'三大特性：封装(访问控制隐藏实现)、继承(extends复用父类)、多态(Override/Overload不同表现)。'},
{q:'Java中抽象类(abstract class)和接口(interface)的区别？', level:'基础', options:['抽象类可以有具体方法实现，JDK8前接口只能有抽象方法','两者都可以用new直接实例化','一个类只能实现一个接口','抽象类不能有构造方法'], answer:0, explain:'抽象类可包含抽象+具体实现，类单继承；JDK8前接口只常量+抽象方法，类可多实现implements。'},
{q:'Java ArrayList和LinkedList在性能上的特点？', level:'基础', options:['ArrayList随机访问O(1)快，LinkedList中间插入删除更优','LinkedList随机访问O(1)','ArrayList中间插入删除O(1)','两者底层都是数组实现'], answer:0, explain:'ArrayList基于动态数组，下标访问快；LinkedList基于双向链表，头尾/中间插入只需改指针无需移动元素。'},
{q:'Go语言goroutine和OS线程的主要区别？', level:'基础', options:['goroutine由Go runtime调度，比OS线程轻量得多(初始栈2KB)','goroutine和OS线程一一对应','一个程序最多几百个goroutine','goroutine之间不能通信'], answer:0, explain:'goroutine用户态协程，M:N调度，小可轻松创建数万，channel实现CSP通信。'},
{q:'Go中多个defer语句的执行顺序？', level:'基础', options:['后进先出(LIFO)栈顺序，最后声明的先执行','按代码书写从上到下顺序','随机顺序执行','defer在函数开始前执行'], answer:0, explain:'defer将函数压栈，函数return前按逆序(后写先执行)弹出执行；参数在声明时即求值。'},
{q:'Go中make和new的区别？', level:'基础', options:['make创建slice/map/channel引用类型并初始化；new分配零值内存返回指针','make和new完全相同可互换','new返回的是值类型','make创建任何类型都可以'], answer:0, explain:'make仅用于三种内置引用类型，初始化内部数据结构；new(T)分配T类型零值内存返回*T指针。'},
{q:'SQL语言分类中，CREATE/ALTER/DROP属于哪一类？', level:'基础', options:['DDL数据定义语言','DML数据操纵语言','DCL数据控制语言','TCL事务控制语言'], answer:0, explain:'DDL定义库表结构；DML操作数据(INSERT/UPDATE/DELETE/SELECT)；DCL权限(GRANT/REVOKE)；TCL事务(COMMIT/ROLLBACK)。'},
{q:'PRIMARY KEY主键和UNIQUE NOT NULL的区别？', level:'基础', options:['一个表只能一个主键，但可以多个UNIQUE NOT NULL约束','主键允许NULL值','UNIQUE约束不会创建索引','两者完全等价无区别'], answer:0, explain:'主键=唯一+非空+一表一个+默认聚集索引；UNIQUE可多个、默认非聚集索引、单列时加NOT NULL语义类似。'},
{q:'数据库事务的ACID特性指的是？', level:'基础', options:['原子性Atomic、一致性Consistent、隔离性Isolated、持久性Durable','自动、并发、独立、可恢复','关联、完整、索引、持久','属性、约束、标识、默认值'], answer:0, explain:'A全成或全败；C数据约束不破坏；I并发事务互不干扰；D提交后永久保存即使宕机。'},
{q:'Redis中SETNX命令的典型应用场景？', level:'基础', options:['key不存在才设置成功，可实现分布式锁','批量设置多个key-value对','设置过期时间并返回旧值','将字符串类型转为数字'], answer:0, explain:'SETNX=SET if Not eXists，原子操作，返回1=成功0=失败；配合EXPIRE防止死锁。'},
{q:'缓存三大问题：穿透、击穿、雪崩，描述正确的是？', level:'基础', options:['穿透=查不存在key；击穿=热点key过期；雪崩=大量key同时过期','三者都是数据库挂了','三者都是黑客攻击','三者解决方式完全相同'], answer:0, explain:'穿透：布隆过滤器/空缓存；击穿：互斥锁/热点永不过期；雪崩：随机TTL/缓存高可用集群。'},
{q:'Docker中Volume和Bind Mount的区别？', level:'基础', options:['Volume由Docker管理生命周期(-v name:/path)，Bind Mount直接挂载宿主机路径(-v /host:/cont)','Bind Mount适合生产持久化数据库','Volume不能在容器间共享','两者是完全同一种东西'], answer:0, explain:'Volume(命名卷)Docker管理，生产推荐；Bind Mount(绑定挂载)适合开发挂载源码热更新。'},
{q:'Nginx location匹配的优先级从高到低？', level:'基础', options:['=精确 > ^~前缀跳过正则 > ~区分大小写正则 > ~*不区分 > 无前缀普通','正则最高，=精确最低','按代码书写顺序匹配','~*优先级高于^~'], answer:0, explain:'精确匹配=最高；^~匹配后不再找正则；正则按书写顺序；最后最长普通前缀匹配兜底。'},
{q:'典型CI/CD流水线Pipeline的标准阶段顺序是？', level:'基础', options:['build构建 → test测试 → deploy部署','deploy → build → test','test → deploy → build','deploy → test → build'], answer:0, explain:'标准顺序：checkout拉→build编译包→test单元/集成→deploy部署环境，前阶段失败则中止。'},
{q:'Python处理CPU密集型任务时，multiprocessing和threading的区别？', level:'进阶', options:['多进程有独立解释器可绕过GIL，多线程共享GIL无法并行CPU任务','多线程能并行CPU密集','多进程间数据共享比多线程简单','两者完全一样'], answer:0, explain:'multiprocessing每个子进程独立Python解释器独立GIL，真正多核并行；threading共享一个GIL串行执行CPU代码。'},
{q:'Flask和Django的主要架构差异？', level:'进阶', options:['Flask微框架需自选组件，Blueprint模块化；Django全栈自带ORM/Admin/MTV','两者都是微框架','两者都是全栈框架MTV','Django没有ORM'], answer:0, explain:'Flask微型灵活(核心少插件多)，Blueprint拆分模块，App Factory模式；Django全能框架自带ORM/admin/auth/form等。'},
{q:'Java Stream API中map、filter、collect的作用？', level:'进阶', options:['map转换每个元素，filter过滤，collect是终止操作收集结果为集合','三个都是中间操作','三个都是终止操作','filter用于聚合分组'], answer:0, explain:'中间操作(lazy):map/filter/flatMap/sorted；终止操作(eager触发计算):collect(Collectors.toList/groupingBy)/forEach/count。'},
{q:'Java中Checked Exception和RuntimeException的区别？', level:'进阶', options:['Checked必须显式throws或try-catch，RuntimeException不强制处理','NullPointerException属于Checked','IOException属于RuntimeException','两者都在编译期强制检查'], answer:0, explain:'受检异常(编译期):IOException/SQLException强制throws/try；运行时异常:NPE/ClassCast/IndexOutOfBounds可选处理。'},
{q:'Go无缓冲channel和有缓冲channel的区别？', level:'进阶', options:['无缓冲读写必须同时就绪否则阻塞；有缓冲满前写不阻塞空后读阻塞','有缓冲channel不会死锁','channel只能同步不能传数据','close后的channel不能再读任何数据'], answer:0, explain:'无缓冲=同步(握手)；有缓冲=异步队列；close后仍可读剩余数据，读完获零值ok=false，重复写panic。'},
{q:'Express中间件的执行顺序和错误处理中间件签名？', level:'进阶', options:['按注册顺序执行；错误中间件必须4参数(err,req,res,next)放在最后','中间件顺序无所谓','错误中间件和普通中间件签名相同','错误中间件放最前面'], answer:0, explain:'中间件洋葱模型先写先执行；错误中间件首参必须是err，next(err)才进入错误链路否则跳过。'},
{q:'MySQL联合索引(a,b,c)的最左前缀原则？', level:'进阶', options:['查询条件必须包含a(最左列)索引才可能生效，b+c单独查不走索引','查询含b和c就可用索引','最左前缀规则只适用于单列索引','范围查询后的列也可用索引'], answer:0, explain:'联合索引按a→b→c排序树；必须带a才能走；a+b+c全列中范围查询(a>=5)右边列索引失效。'},
{q:'MySQL InnoDB默认事务隔离级别及幻读解决方案？', level:'进阶', options:['默认REPEATABLE READ，用MVCC快照读+next-key lock间隙锁解决幻读','默认Read Committed','默认Serializable','InnoDB完全没解决幻读'], answer:0, explain:'4级别：RU脏读→RC不可重复读→RR(默认)→Serializable；RR下普通SELECT快照读MVCC，当前读加next-key lock防幻读。'},
{q:'Redis Cluster数据分片原理？', level:'进阶', options:['共16384固定哈希槽，CRC16(key)%16384定位槽，不同节点各自负责部分槽','用一致性哈希环分片','槽数可动态增减','每个节点都有全量数据'], answer:0, explain:'Redis Cluster固定槽分片，节点持有槽子集；扩容/缩容需迁移槽，不是一致性哈希，集群模式不支持跨槽多key操作。'},
{q:'Docker多阶段构建的核心作用？', level:'进阶', options:['多个FROM阶段编译，COPY --from提取产物，丢弃编译依赖大幅减小镜像','让镜像构建更快','多阶段会让镜像变大','只能编译Go语言'], answer:0, explain:'FROM ... AS builder编译阶段安装依赖+编译；FROM scratch/alpine运行阶段仅COPY二进制/文件，镜像从几百M降到几M。'},
{q:'常见HTTP状态码含义正确的一组是？', level:'进阶', options:['401未认证/403无权限/429限流/502BadGw/503不可用/504网关超时','403=用户未登录','500=上游服务挂了','404=服务器崩溃'], answer:0, explain:'4xx客户端:400参数/401鉴权/403登录没权限/404资源/409冲突/422校验/429限流；5xx服务端:500内部/502下游错/503停机/504超时。'},
{q:'HTTP方法中哪些是幂等的？', level:'进阶', options:['GET/PUT/DELETE/HEAD/OPTIONS幂等，POST非幂等','POST幂等','PUT每次创建不同结果所以非幂等','幂等=不修改数据'], answer:0, explain:'幂等=多次调用结果相同；安全=不修改。安全+幂等:GET/HEAD/OPTIONS；仅幂等:PUT(整体替换)/DELETE；非幂等:POST(多次创建多条)。'},
{q:'CAP定理在分布式系统中的取舍理解？', level:'高级', options:['P网络分区客观必选，C一致性和A可用性二选一：ZK/HBase选CP，Eureka/Cassandra选AP','可同时满足CAP三者','分区容错=磁盘分区','强一致系统一定高可用'], answer:0, explain:'CAP不可三角；网络故障分区必面对，CP牺牲部分可用性保数据一致(强一致需阻塞)，AP牺牲强一致保服务可用(最终一致)。'},
{q:'雪花算法Snowflake生成的分布式ID结构组成？', level:'高级', options:['64位:1位符号+41位毫秒时间戳+10位workerId+12位序列号，整体趋势递增','64位UUID随机数','32位IP+32位自增','纯字符串时间戳'], answer:0, explain:'Snowflake:1bit正号+41bit毫秒(约69年)+10bit机器号(1024节点)+12bit序列号(每ms 4096个)，long整数，趋势自增且去中心化。'},
{q:'熔断器Circuit Breaker的三种状态流转？', level:'高级', options:['Closed(正常统计)→失败率超阈值→Open(快速失败不调下游)→冷却→Half-open(放少量探测)→Closed/Open','状态流转随机','Open状态直接调下游','Half-open放所有请求'], answer:0, explain:'Sentinel/Hystrix熔断器防级联雪崩：Closed采样→Open熔断快速失败→Half-open探测恢复，防长时间熔断也防一恢复就冲垮。'},
{q:'REST、GraphQL、gRPC三种API风格的对比？', level:'高级', options:['REST HTTP+JSON通用；GraphQL按需查询灵活；gRPC Protobuf+HTTP2高性能微服务','GraphQL只能查询不能写','gRPC用JSON传输','REST必须用POST查询'], answer:0, explain:'REST资源导向简单通用；GraphQL单端点自定义字段减少过度获取；gRPC二进制序列化+多路复用，跨语言IDL生成代码，性能是REST 5-10倍。'},
{q:'Kafka消费者组(Consumer Group)的offset和投递语义？', level:'高级', options:['同组一分区只分配一个消费者；offset存__consumer_offsets；enable.auto.commit默认=至少一次(at-least-once)可能重复消费','offset存在consumer本地内存','同一分区可被组内多个消费者同时消费','自动提交=Exactly Once'], answer:0, explain:'Consumer Group实现广播/单播；分区数=组内最大并行度；手动提交offset或事务+幂等生产者可实现Exactly-Once语义。'},
{q:'常见发布策略蓝绿、金丝雀、滚动、重建的区别？', level:'高级', options:['蓝绿=两套环境切换；金丝雀=按比例逐步放量；滚动=逐个替换Pod；重建=先停旧再启新','四种完全等价','金丝雀和蓝绿完全相同','重建发布零停机'], answer:0, explain:'蓝绿(资源双份切换快成本高)；金丝雀灰度(1%→10%→50%→100%风险可控)；滚动(k8s默认maxSurge/maxUnavailable控制节奏)；重建(简单但停机)。'}
];

// ======== Backend 新增150题 后半补充 ========
const BE_NEW_B = [
{q:'HTTP与HTTPS区别核心？', level:'基础', options:['相同','HTTPS在HTTP下加TLS/SSL加密层，默认443端口HTTP是80，防窃听篡改伪装','HTTPS更快','HTTPS仅改端口'], answer:1, explain:'HTTPS握手+证书验证确认服务端身份；对称加密会话+非对称交换密钥+数字签名证书链验证。'},
{q:'JWT(JSON Web Token)三段结构是？', level:'基础', options:['头/体/签名','Header(算法+类型).Payload(声明).Signature(密钥签名)，Base64URL编码用.连接','用户/密码/时间戳','公钥/私钥/证书'], answer:1, explain:'Header alg+typ；Payload标准字段sub/iat/exp/nbf/iss/aud；签名=HMACSHA256(base64(header)+"."+base64(payload),secret)防篡改。'},
{q:'REST与RPC风格差异？', level:'基础', options:['相同','REST强调资源(名词)+HTTP动词(GET/POST/PUT/DELETE)操作资源；RPC强调动作(动词)调用远程方法如addUser，贴近语言函数调用','REST是协议','RPC必须HTTP'], answer:1, explain:'对外API推荐REST语义清晰；内部微服务gRPC效率高；GraphQL按需取字段比REST灵活。'},
{q:'MySQL InnoDB默认隔离级别？', level:'基础', options:['READ UNCOMMITTED','REPEATABLE READ(可重复读)','READ COMMITTED','SERIALIZABLE'], answer:1, explain:'MySQL默认RR(解决脏读+不可重复读，MVCC+间隙锁+Next-Key Lock防幻读)；Oracle/PostgreSQL默认RC。'},
{q:'MySQL聚簇索引和非聚簇索引区别？', level:'基础', options:['无','InnoDB聚簇索引(主键)B+树叶子=完整行数据；非聚簇(二级索引)叶子=主键值需回表；MyISAM都是非聚簇','聚簇慢','仅二级有B树'], answer:1, explain:'主键选自增ID利于顺序插入减少页分裂；覆盖索引不用回表直接从二级索引得到所需列。'},
{q:'索引最左前缀匹配原则含义？', level:'基础', options:['必须用最左列','联合索引(a,b,c)只有查询条件从最左列连续匹配才能用上索引；跳过a则索引用不上；范围列右侧无法用','仅字符串','倒序匹配'], answer:1, explain:'where a=1 and b=2 and c=3全用；a=1 and c=3仅用a列；a>1 and b=2仅用a。优化要把区分度高列放前面。'},
{q:'Nginx正向代理和反向代理区别？', level:'基础', options:['相同','正向代理用户知道代理服务器替客户端访问；反向代理客户端无感，代理替服务端接收转发(负载均衡/缓存)','正代理快','反代理用于翻墙'], answer:1, explain:'Nginx典型配置proxy_pass http://upstream;反向代理+负载均衡(轮询/加权轮询/ip_hash/least_conn等)。'},
{q:'Nginx rewrite和return 301区别？', level:'基础', options:['完全相同','return 301更直接高效停止后续规则；rewrite可做正则和内部重写/外部重定向性能略差','rewrite更规范','return仅301'], answer:1, explain:'能用return就不用rewrite；但正则拆分变量时仍需rewrite正则捕获重写。'},
{q:'Redis与Memcached对比Redis优点？', level:'基础', options:['仅存K/V','Redis支持丰富数据结构(String/Hash/List/Set/ZSet/Geo/HyperLogLog/Stream/Bitmap)、持久化(RDB/AOF)、发布订阅、Lua、事务、主从+集群','Memcached快','Memcached持久化'], answer:1, explain:'单线程事件循环Redis v6引入多线程IO(命令执行仍是单线程)；Memcached仅String内存缓存无持久。'},
{q:'Redis持久化RDB和AOF区别？', level:'基础', options:['相同','RDB快照fork子进程定时dump二进制，恢复快可能丢最近数据；AOF追加命令日志，fsync策略可调更安全；生产建议混合使用','仅RDB可用','AOF更快'], answer:1, explain:'Redis 4.0+混合持久化(AOF重写时插入RDB头)：结合RDB快速恢复+AOF减少丢失。aof-use-rdb-preamble yes。'},
{q:'Redis缓存穿透、缓存击穿、缓存雪崩区别？', level:'基础', options:['相同','穿透：查不存在键→DB(空值缓存/布隆过滤器)；击穿：热点key过期瞬发→DB(互斥锁/永不过期+后台异步刷新)；雪崩：大量key同时间过期或Redis宕→DB(过期时间随机/多副本/降级)','仅容量问题','全为网络问题'], answer:1, explain:'组合拳：布隆过滤器挡不存在→互斥锁击穿→抖动过期雪崩→兜底多级缓存(本地+Caffeine/Guava+Redis)。'},
{q:'消息队列解耦、异步、削峰三大场景？', level:'基础', options:['只存日志','解耦(下单通知库存物流不直接调)；异步(发短信邮件不阻塞主流程)；削峰(活动下单先入队列消费者慢处理保护DB)','加速DB查询','仅缓存'], answer:1, explain:'常见MQ：Kafka吞吐高日志流；RabbitMQ功能全死信延迟等；RocketMQ事务消息；Pulsar存算分离云原生。'},
{q:'Kafka中Topic/Partition/Offset/Consumer Group？', level:'基础', options:['相同概念','Topic主题；Partition分区顺序日志水平扩展；Offset消费位点；Consumer Group消费组内各消费者订阅同topic各分一个partition消费，组间互不影响','仅Offset重要','Group自动删除'], answer:1, explain:'同组消费者数>partition数多余空闲；少则一个消费多partition；重平衡Rebalance在成员变更时触发分配。'},
{q:'RabbitMQ四种主要交换机类型？', level:'基础', options:['TCP/UDP/IP/HTTP','direct(精确路由键匹配)/fanout(广播所有队列)/topic(路由键*.#通配)/headers(消息头匹配)','同步/异步/回调/轮询','push/pull/peek/pop'], answer:1, explain:'bindingKey绑定交换机和队列；publisher送消息指定routingKey；不同exchange匹配规则不同决定送到哪些队列。'},
{q:'Docker容器和虚拟机区别核心？', level:'基础', options:['相同','容器共享宿主机OS内核，轻量秒级启动，镜像MB级；VM独立GuestOS分钟级启动镜像GB级。容器是进程级隔离VM硬件级隔离','容器更安全','容器无法网络'], answer:1, explain:'Namespace(UTS/PID/IPC/NET/MNT/USER)+Cgroups(资源限制)是Linux容器底层核心；Docker daemon+containerd+runc实际运行容器。'},
{q:'Dockerfile中COPY和ADD区别？', level:'基础', options:['无','ADD多两个能力：1.自动解压tar.gz等本地归档到镜像 2.支持URL下载(下载的不解压)；COPY仅复制普通文件，更明确推荐优先用COPY','ADD速度快','COPY仅二进制'], answer:1, explain:'能用COPY就不要ADD；自动解压特性也常带来意外。多阶段构建减少镜像体积。'},
{q:'Kubernetes Pod/Deployment/Service/Ingress区别？', level:'基础', options:['相同概念','Pod最小调度单元(一个或多个紧密容器共享网络/存储)；Deployment声明式管理Pod副本/滚动更新；Service稳定访问入口集群内发现；Ingress七层HTTP路由入集群','仅Pod需要','Service=Pod'], answer:1, explain:'Service ClusterIP内部/NodePort节点端口/LoadBalancer云LB/ExternalName对接外部DNS；Ingress统一域名路径分流到不同Service。'},
{q:'K8s中ConfigMap和Secret区别？', level:'基础', options:['相同','ConfigMap存非敏感配置(明文)；Secret存密码/Token/TLS证书，默认Base64编码(仍需RBAC控制+生产建议加密etcd或外部Vault)','Secret更大','ConfigMap不能挂'], answer:1, explain:'二者均可卷挂载或环境变量注入；Secret env默认不打印日志。敏感数据用HashiCorp Vault/Sealed Secrets更安全。'},
{q:'CI/CD概念解释？', level:'基础', options:['服务器管理','CI持续集成(代码提交后自动构建/测试)；CD持续交付(可随时发布)或持续部署(自动部署生产)；工具Jenkins/GitLab CI/GitHub Actions/ArgoCD','数据库备份','网络加速'], answer:1, explain:'典型流程：开发者提交→流水线触发→静态检查→单元测试→构建镜像→推仓库→部署测试环境→集成测试→人工确认→部署生产。'},
{q:'Spring Boot @SpringBootApplication组合了哪三个？', level:'基础', options:['无','@SpringBootConfiguration=配置类+@EnableAutoConfiguration自动装配+@ComponentScan默认扫描本包及子包','@Web/@Service/@Repository','@Cache/@Async/@Scheduled'], answer:1, explain:'自动装配：SpringFactoriesLoader读取META-INF/spring.factories的EnableAutoConfiguration候选类，根据条件@ConditionalOnClass等按需注册Bean。'},
{q:'Spring IOC和DI本质？', level:'基础', options:['AOP','控制反转=对象创建依赖交给容器而非自己new；依赖注入=容器把依赖通过构造器/setter/字段赋值给对象。解耦方便测试扩展','事务','MVC'], answer:1, explain:'BeanFactory是底层接口；ApplicationContext高层含国际化/事件/BeanPostProcessor扩展；@Scope:singleton/prototype/request/session。'},
{q:'Spring AOP通知类型？', level:'基础', options:['增删改查','@Before前置/@After返回后(无论异常)/@AfterReturning成功返回/@AfterThrowing异常/@Around环绕最强大','只有@Before','仅事务'], answer:1, explain:'Aspect切面+Pointcut切点+JoinPoint连接点+Weave织入；事务@Transactional本质AOP环绕+ThreadLocal绑定连接。'},
{q:'Spring MVC请求处理流程核心组件？', level:'基础', options:['Socket监听','DispatcherServlet(前端控制器总调度)→HandlerMapping找Handler→HandlerAdapter适配调用Controller→ViewResolver解析视图→渲染返回','仅Servlet','Filter链'], answer:1, explain:'常用注解@RequestMapping/@GetMapping/@RestController=@Controller+@ResponseBody；@RequestBody Jackson自动JSON→对象。'},
{q:'Spring Bean默认作用域和线程安全问题？', level:'基础', options:['prototype总是安全','默认singleton(容器唯一实例)，如成员变量被多线程改→线程不安全。应避免在单例Bean保存请求级可变状态，改方法参数/局部变量/request scope','singleton绝对安全','默认request'], answer:1, explain:'Spring/Struts2区别：Struts2默认Action是prototype每次请求新实例，Spring MVC Controller默认singleton但存方法栈上无状态通常OK。'},
{q:'Spring @Transactional失效常见原因？', level:'基础', options:['都有效','1.非public方法 2.同类内部方法this调用不经过代理 3.异常非Runtime且未rollbackFor 4.多线程异步方法中事务不生效 5.数据库引擎非InnoDB','仅注解写了就生效','只有抛错才回滚'], answer:1, explain:'同类内调用失效因为AOP代理：外部类调用才会进代理增强；解决：注入自己/用ApplicationContext.getBean/拆两个Service/编程式事务。'},
{q:'Spring Security过滤器链中认证授权核心？', level:'基础', options:['拦截器','过滤器链：UsernamePasswordAuthenticationFilter(表单)/BasicAuthenticationFilter→SecurityContextHolder存认证对象→FilterSecurityInterceptor授权基于URL+角色@PreAuthorize','AOP','Servlet'], answer:1, explain:'JWT场景自定义过滤器从请求头Authorization Bearer解析token设SecurityContext；记住我RememberMe用持久化TokenRepository。'},
{q:'MyBatis #{}和${}区别？', level:'基础', options:['相同','#{}预编译占位符PreparedStatement，防SQL注入；${}字符串直接拼接(动态表名/列名/排序字段场景必须用但要校验白名单)','#{}更快','${}更安全'], answer:1, explain:'like模糊查询正确用法:name like concat("%",#{name},"%") 而不是like "%${name}%"。排序字段必须白名单校验防注入。'},
{q:'Go语言goroutine和线程区别？', level:'基础', options:['完全相同','goroutine用户态轻量协程(初始栈2KB可伸缩)；OS线程MB级栈+内核调度上下文切换重。GOMAXPROCS个M:N调度模型','goroutine更慢','goroutine=协程库'], answer:1, explain:'Goroutine由Go runtime调度GMP模型：G协程/M工作线程/P调度上下文(本地队列+全局队列+窃取)；channel通过CSP模型同步通信不要共享内存通信。'},
{q:'Go channel有缓冲和无缓冲区别？', level:'基础', options:['相同','无缓冲ch:=make(chan int)必须收发同时准备好(同步)；有缓冲ch:=make(chan int,10)写入到未满不阻塞空后读阻塞，用于解耦/限流/任务队列','有缓冲是数组','无缓冲死锁'], answer:1, explain:'for v:=range ch会持续收直到close(ch)；select多路选择非阻塞case default；关闭后读取立即得零值+ok=false；向关闭写panic。'},
{q:'Go defer执行顺序和return谁先？', level:'基础', options:['先defer后return','返回值赋值→defer执行(可改命名返回值)→RET指令返回。多个defer按LIFO后进先出执行。','先return后defer','同时'], answer:1, explain:'函数返回分三步：1.给返回值赋值 2.执行defer 3.RET；非命名返回值defer改不了，命名返回值defer修改会影响最终结果。'},
{q:'Java内存模型JMM堆/栈/方法区存什么？', level:'基础', options:['全存对象','堆=所有对象实例；栈=每个线程私栈帧(局部变量表/操作数栈/动态链接返回地址)；方法区/元空间=类信息/常量/静态变量/JIT编译代码；堆是GC主战场','仅栈有对象','方法区在栈上'], answer:1, explain:'JDK8永久代→元空间移到本地内存；String.intern()字符串常量池移到堆；TLAB(线程本地分配缓冲)减少多线程堆分配同步。'},
{q:'Java垃圾回收分代收集理论？', level:'基础', options:['全扫描','弱分代假说：绝大多数对象朝生夕死；强分代假说：熬过多次GC越难死。因此堆分年轻代(Eden/S0/S1复制算法)老年代(Mark-Sweep-Compact)','仅分代无意义','全部复制算法'], answer:1, explain:'Young GC(Minor GC)/Old GC(Major)/Full GC整堆。GC Roots:栈局部变量/方法区静态引用/常量引用/JNI引用/同步锁持有。'},
{q:'Java线程池ThreadPoolExecutor七大参数？', level:'进阶', options:['线程数/队列数','1.corePoolSize核心常驻 2.maximumPoolSize最大 3.keepAliveTime非核心线程空闲存活 4.TimeUnit 5.workQueue任务队列 6.threadFactory线程工厂 7.RejectedExecutionHandler拒绝策略','仅3个','最大线程=队列长'], answer:1, explain:'提交顺序：核心满→队列满→扩容到最大→队列又满→拒绝。常见队列：ArrayBlockingQueue有界/LSBlockingQueue无界(OOM风险)/SynchronousQueue不存/ScheduledThreadPool。'},
{q:'Java volatile关键字作用？', level:'进阶', options:['原子性+可见性','1.可见性：volatile写会立即刷主存读直接从主存拿，线程间立即可见 2.禁止指令重排(Happens-Before内存屏障)；但i++仍不原子需AtomicInteger','原子性','仅有序性'], answer:1, explain:'双重检查锁单例必须volatile禁止new指令分配内存/初始化/引用赋值重排导致其他线程拿到半初始化对象。'},
{q:'Java中synchronized和ReentrantLock区别？', level:'进阶', options:['相同','synchronized关键字JVM层面自动加解锁；ReentrantLock API层面可中断/可超时/公平锁/多条件Condition，灵活但需try/finally手动unlock。都是可重入。','Lock更快','synchronized更灵活'], answer:1, explain:'锁升级：无锁→偏向锁→轻量级锁(自旋CAS)→重量级锁(monitor)。偏向锁存线程ID；轻量级自旋失败才升级到OS挂起。'},
{q:'ConcurrentHashMap JDK8核心变化？', level:'进阶', options:['和JDK7一样分段锁','JDK8:Node数组+链表/红黑树(长度>8转红黑树)；CAS+synchronized只锁数组头节点(首节点)，不再是Segment分段锁，更细粒度并发更高','synchronized锁整个map','仅读写锁'], answer:1, explain:'put：空数组初始化→头空CAS放→否则synchronized(n)锁住首节点→链表插入or红黑插入→size通过CounterCell分段计数，LongAdder思路避免CAS热点。'},
{q:'MySQL索引失效常见场景？', level:'进阶', options:['任何场景都有效','1.where中索引列函数/运算/隐式类型转换 2.模糊like左% 3.!=或<> or is not null视情况 4.联合索引不满足最左前缀 5.字符串没加引号转数字 6.优化器觉得全表更快','只要建就会用','仅not null失效'], answer:1, explain:'explain type列:system>const>eq_ref>ref>range>index>ALL(需优化)；Extra:Using index覆盖索引/Using where需回表过滤/Using filesort需排序/Using temporary临时表。'},
{q:'MySQL大表加DDL(加字段/索引)注意？', level:'进阶', options:['直接锁表没事','In-Place+Online DDL：ALGORITHM=INPLACE尽量避免重建表；LOCK=NONE允许DML并发。大表生产用pt-online-schema-change或gh-ost外部工具：影子表+触发器拷贝+重命名零停机','直接ALTER就行','仅加索引锁表'], answer:1, explain:'大表直接ALTER会长时间锁元数据+阻塞写入；pt-osc原理在原表加触发器同步增量到新表，后台拷数据完成瞬间RENAME，低峰操作+外键不支持需注意。'},
{q:'数据库分库分表ShardingSphere思路？', level:'进阶', options:['只解决容量','水平分表按分片键路由(取模/时间/范围)到多节点；垂直分库按业务模块拆库；缺点：跨库join/分布式事务/分页/全局ID。代理端Sharding-Proxy/客户端Sharding-JDBC/侧车','仅垂直分','不用改应用'], answer:1, explain:'全局唯一ID：雪花算法(64bit时间戳+机器id+序列号)/Leaf/UUID(无序索引性能差)；跨库事务：Seata AT/TCC/Saga/XA可靠消息最终一致。'},
{q:'分布式事务CAP和BASE理论？', level:'进阶', options:['ACID变体','CAP:分布式系统一致性C/可用A/分区容错P三者不能同时，P必选，选CP或AP。BASE:基本可用+软状态+最终一致，大部分业务接受最终一致更强可用性','CAP同时满足','BASE要求强一致'], answer:1, explain:'典型最终一致方案：可靠消息+本地消息表+定时任务补偿；TCC三阶段Try/Confirm/Cancel侵入强；Seata AT一阶段写undo log二阶段提交/回滚。'},
{q:'分布式锁Redis实现思路和坑？', level:'进阶', options:['setnx=完美','SET key value NX PX 30000 原子加锁+超时；释放必须Lua脚本校验+del(防A线程超时误删B的锁)。集群模式下锁不同节点需Redlock算法；看门狗续期避免业务未执行完锁过期','仅setnx','只要setnx加expire两个命令就原子'], answer:1, explain:'value必须唯一标识(UUID+线程ID)；释放必须检查value==当前线程再DEL，必须Lua脚本保证原子；续期：看门狗(如Redisson自动续期)。'},
{q:'分布式锁ZooKeeper实现与Redis区别？', level:'高级', options:['相同','ZK临时有序节点：加锁=创建EPHEMERAL_SEQUENTIAL，判断自己是否序号最小；否则watch前一个节点；释放=会话断开自动删节点；强一致CP(zk挂了服务不可)；Redis高可用AP(可能丢锁)','ZK性能更好','Redis更一致'], answer:1, explain:'ZK适合一致性要求高、并发不极端场景；Redis适合高性能、可容忍极端小概率丢锁(配合唯一值校验+续期)场景。选哪款看业务对一致性/性能的优先级。'}
];

// ======== 开始合并：用正则精准在对应数组末尾插入 ========
// 由于network已经合并完，现在合并linux/frontend/backend
// 找每个数组结束的精确位置：先找当前数组结束标记和下个数组开始标记，在最后一题和"]"之间插入

function insertBeforeArrayClose(code, arrName, newItems, hasTrailingComma) {
  const endToken = hasTrailingComma ? '  ],' : '  ]';
  // 找到数组起点和后面同级结束
  // 简化方法：构造锚点：找下一个顶级数组名或QUESTIONS结尾
  // 因为题目里的对象不会出现"  xxx: ["这种模式
  const startRegex = new RegExp(`  ${arrName}: \\\\[`);
  const startMatch = code.match(startRegex);
  if (!startMatch) throw new Error(`找不到数组开始: ${arrName}`);
  const startIdx = startMatch.index + startMatch[0].length;
  
  // 找后面同级的结束：从startIdx向后，当深度到0时的"]"且后面是逗号或换行+下键/对象结束
  // 因为题目文本中不会出现独立的"  ],"或"  ]"在数组外
  // 简单而精确的做法：按深度匹配
  let depth = 1;
  let i = startIdx;
  let endIdx = -1;
  while (i < code.length && depth > 0) {
    if (code[i] === '[') depth++;
    else if (code[i] === ']') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
    i++;
  }
  if (endIdx === -1) throw new Error(`找不到数组结束: ${arrName}`);
  
  // 插入点：在最后一个"]"之前，且前面恰好是最后一道题
  // 把新题格式化成字符串（每行一道）
  const newStr = newItems.map(q => {
    // 每个对象转成紧凑单行字符串，用JSON.stringify改造
    const optStr = JSON.stringify(q.options).replace(/"/g, "'");
    return `{q:${JSON.stringify(q.q).replace(/"/g,"'")}, level:'${q.level}', options:${optStr}, answer:${q.answer}, explain:${JSON.stringify(q.explain).replace(/"/g,"'")}}`;
  }).join(',\n');
  
  // 在现有最后一个"]"之前插入",\n新题\n  "
  const commaPrefix = (code.substring(endIdx - 1, endIdx) === ']') ? ',\n' : '';
  // 实际更简单：直接在endIdx前插入逗号+新题+缩进
  const before = code.substring(0, endIdx);
  const after = code.substring(endIdx);
  return before + ',\n' + newStr + '\n  ' + after;
}

// 先把每个学科的新题合并
console.log('开始合并...');
const LIN_ALL = LIN_NEW;
const FE_ALL  = FE_NEW_A.concat(FE_NEW_B);
const BE_ALL  = BE_NEW_A.concat(BE_NEW_B);
console.log('Linux新题数:', LIN_ALL.length);
console.log('前端新题数:', FE_ALL.length);
console.log('后端新题数:', BE_ALL.length);

// 执行合并（从后往前合并，避免前一次修改影响后面的精确位置）
code = insertBeforeArrayClose(code, 'backend',  BE_ALL,  false);
console.log('backend合并完成');
code = insertBeforeArrayClose(code, 'frontend', FE_ALL, true);
console.log('frontend合并完成');
code = insertBeforeArrayClose(code, 'linux',    LIN_ALL,true);
console.log('linux合并完成');

fs.writeFileSync('/workspace/data.js', code, 'utf8');
console.log('写入完成，文件大小:', code.length);

// 语法检查
try {
  require('vm').createScript(code);
  console.log('语法检查通过 ✅');
} catch (e) {
  console.error('语法错误:', e.message);
  process.exit(1);
}
