// === LINUX EXT4 ===
linux_ext4_topics: [
  {
    "id": "linux-ebpf",
    "title": "eBPF Linux 内核可观测与编程",
    "level": "高级",
    "content": "**eBPF 概述**\n- Extended Berkeley Packet Filter，Linux 内核字节码虚拟机\n- 无需修改内核源码或加载内核模块\n- 安全：加载前通过验证器（Verifier）检查\n- 高效：JIT 编译为本地机器码\n\n**eBPF 程序类型**\n- kprobe/kretprobe：内核函数跟踪\n- uprobe/uretprobe：用户态函数跟踪\n- tracepoint：内核静态跟踪点\n- fentry/fexit：BPF 跟踪函数入口/退出\n- XDP：网卡驱动层包处理\n- tc：流量控制\n- cgroup/skb：cgroup 网络过滤\n- LSM：Linux 安全模块钩子\n\n**工具链**\n- BCC（BPF Compiler Collection）：Python/C++ 前端\n- bpftrace：类 DTrace 的高级语言\n- libbpf：C/C++ 库，支持 CO-RE（Compile Once Run Everywhere）\n- bpftool：查看和管理 BPF 程序/映射\n\n**应用场景**\n- 性能分析：CPU、内存、IO、网络延迟\n- 安全监控：系统调用审计、异常行为检测\n- 网络加速：DDoS 防护、负载均衡\n- 容器可观测：Cilium、Pixie",
    "example": "# eBPF 快速入门\n\n# 1. 查看系统支持的程序类型\nbpftool feature\n\n# 2. BCC 工具集（系统级诊断）\nexecsnoop-bpfcc    # 跟踪新进程执行\nopensnoop-bpfcc    # 跟踪文件打开\nbiosnoop-bpfcc     # 跟踪磁盘 IO\ntcpconnect-bpfcc   # 跟踪 TCP 连接\n\n# 3. bpftrace 一行命令\nbpftrace -e 'tracepoint:syscalls:sys_enter_openat { printf(\"%s opened %s\\n\", comm, str(args->filename)); }'\n\n# 4. 自定义 eBPF 程序（C）\n# // hello.bpf.c\n# #include <linux/bpf.h>\n# #include <bpf/bpf_helpers.h>\n# SEC(\"tracepoint/syscalls/sys_enter_execve\")\n# int hello(void *ctx) {\n#     bpf_printk(\"Hello eBPF!\");\n#     return 0;\n# }\n# char _license[] SEC(\"license\") = \"GPL\";\n\n# 5. 加载并查看输出\n# clang -target bpf -c hello.bpf.c -o hello.bpf.o\n# bpftool prog load hello.bpf.o /sys/fs/bpf/hello\n# cat /sys/kernel/debug/tracing/trace_pipe"
  },
  {
    "id": "linux-iouring",
    "title": "io_uring 异步 IO 革命",
    "level": "高级",
    "content": "**io_uring 背景**\n- Linux 5.1 引入，由 Jens Axboe 设计\n- 解决传统 Linux AIO 的诸多限制\n- 统一块设备和网络异步 IO\n- 性能可超越 SPDK（用户态驱动）\n\n**核心设计**\n\n1. **双环形队列**\n   - Submission Queue（SQ）：用户提交请求\n   - Completion Queue（CQ）：内核返回结果\n   - 共享内存，避免系统调用开销\n\n2. **Polling 模式**\n   - IORING_SETUP_IOPOLL：设备轮询，绕过中断\n   - IORING_SETUP_SQPOLL：内核线程轮询提交队列\n   - 极致性能下可实现零系统调用\n\n3. **Buffer Ring（Linux 5.19+）**\n   - 预注册缓冲区，避免内存拷贝\n   - 支持多缓冲区接收（recvmultishot）\n\n**性能对比**\n| 方案 | 延迟 | 吞吐量 | CPU 占用 |\n|------|------|--------|----------|\n| sync read | 高 | 低 | 高 |\n| aio | 中 | 中 | 中 |\n| io_uring | 极低 | 极高 | 低 |\n\n**应用场景**\n- 高性能数据库（如 ScyllaDB）\n- 游戏服务器\n- 高频交易\n- 代理/缓存服务器（如 nginx 实验性支持）",
    "example": "# io_uring 示例（liburing）\n\n# 1. 基本读写\nstruct io_uring ring;\nio_uring_queue_init(32, &ring, 0);\n\nstruct io_uring_sqe *sqe = io_uring_get_sqe(&ring);\nio_uring_prep_read(sqe, fd, buf, size, offset);\nio_uring_sqe_set_data(sqe, userdata);\nio_uring_submit(&ring);\n\nstruct io_uring_cqe *cqe;\nio_uring_wait_cqe(&ring, &cqe);\n// 处理完成事件\nio_uring_cqe_seen(&ring, cqe);\nio_uring_queue_exit(&ring);\n\n# 2. 高级特性：链式操作\n# sqe1 -> sqe2（sqe2 在 sqe1 完成后执行）\n# io_uring_sqe_set_flags(sqe2, IOSQE_IO_LINK);\n\n# 3. 批量提交\n# io_uring_submit_and_wait(&ring, min_complete);\n\n# 4. 用户态轮询\n# io_uring_queue_init(4096, &ring, IORING_SETUP_SQPOLL);\n\n# 5. 查看 io_uring 性能\n# fio --ioengine=io_uring --iodepth=256 --direct=1 --rw=randread"
  },
  {
    "id": "linux-cgroup-v2",
    "title": "Cgroup v2 与统一资源管理",
    "level": "高级",
    "content": "**Cgroup v2 演进**\n- Linux 4.5 引入，统一 v1 的多个独立层次结构\n- RHEL 9 / Ubuntu 22.04 默认启用\n- 解决 v1 中控制器归属混乱问题\n\n**v1 vs v2 核心差异**\n\n| 特性 | v1 | v2 |\n|------|-----|-----|\n| 层次结构 | 每个控制器独立 | 统一单树 |\n| 进程归属 | 可属于不同 cgroup | 只能属于一个 cgroup |\n| 根进程 | 可移出 | 必须属于某个 cgroup |\n| 委托 | 复杂 | 支持安全委托给非特权用户 |\n| 新功能 | 有限 | PSI、更精细的内存控制 |\n\n**v2 关键控制器**\n- cpu：CFS 带宽、权重\n- cpuset：CPU 和内存节点绑定\n- memory：内存限制、swap 控制、OOM 策略\n- io：块设备 IO 限制\n- pids：进程数限制\n- rdma：RDMA 资源限制\n- misc：其他资源\n\n**PSI（Pressure Stall Information）**\n- Linux 4.20+/v2 支持\n- 实时反馈 CPU/内存/IO 资源压力\n- /proc/pressure/cpu, memory, io\n- 用于智能资源调度和扩容决策",
    "example": "# Cgroup v2 操作\n\n# 1. 查看当前 cgroup 文件系统\nmount | grep cgroup\n# cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime)\n\n# 2. 创建 cgroup 并限制资源\nmkdir /sys/fs/cgroup/myapp\necho \"+cpu +memory +io\" > /sys/fs/cgroup/myapp/cgroup.subtree_control\n\n# 3. 设置限制\necho \"100000000\" > /sys/fs/cgroup/myapp/memory.max  # 100MB\necho \"50000 100000\" > /sys/fs/cgroup/myapp/cpu.max  # 0.5 CPU\necho \"8:0 rbps=1048576\" > /sys/fs/cgroup/myapp/io.max  # 限制 sda 读取 1MB/s\n\n# 4. 将进程加入 cgroup\necho 12345 > /sys/fs/cgroup/myapp/cgroup.procs\n\n# 5. 查看 PSI\ncat /proc/pressure/memory\n# some avg10=0.00 avg60=0.00 avg300=0.00 total=1234567\n\n# 6. systemd 管理（自动使用 v2）\n# systemctl set-property nginx.service CPUQuota=50% MemoryMax=100M\n\n# 7. Docker 使用 cgroup v2\n# docker run --memory=100m --cpus=0.5 nginx"
  },
  {
    "id": "linux-namespaces-advanced",
    "title": "Linux Namespace 深度与容器隔离",
    "level": "高级",
    "content": "**Linux Namespaces（8种）**\n\n1. **Mount（mnt）**\n   - 隔离文件系统挂载点\n   - pivot_root / chroot 实现容器根文件系统\n\n2. **UTS**\n   - 隔离主机名和域名\n   - sethostname 在容器内独立\n\n3. **IPC**\n   - 隔离 System V IPC 和 POSIX 消息队列\n   - 容器间共享内存隔离\n\n4. **PID**\n   - 隔离进程 ID 空间\n   - PID 1 的特性和信号处理\n   - PID namespace 嵌套\n\n5. **Network（net）**\n   - 隔离网络设备、IP、端口、路由表\n   - veth pair + bridge 连接容器网络\n   - iptables/nftables 隔离\n\n6. **User**\n   - 隔离用户和组 ID\n   - UID/GID 映射：容器内 root 映射到宿主机普通用户\n   - 提升容器安全性\n\n7. **Cgroup（cgroup_ns）**\n   - 隐藏 cgroup 路径\n   - 防止容器内看到宿主机 cgroup 信息\n\n8. **Time**\n   - Linux 5.6+ 支持\n   - 隔离 boot time 和 monotonic clock\n\n**Namespace 操作**\n- clone() 带 CLONE_NEW* 标志\n- unshare() 脱离当前 namespace\n- setns() 加入现有 namespace\n- /proc/<pid>/ns/ 查看 namespace",
    "example": "# Namespace 实验\n\n# 1. 创建新 PID namespace\nunshare --fork --pid --mount-proc /bin/sh\n# 在容器内 ps 只看到自己和内核线程\n\n# 2. 创建新 Network namespace\nip netns add testns\nip netns exec testns ip link set lo up\nip netns exec testns ip addr add 10.0.0.1/24 dev lo\n\n# 3. veth pair 连接两个 namespace\nip link add veth0 type veth peer name veth1\nip link set veth1 netns testns\nip addr add 10.0.0.2/24 dev veth0\nip link set veth0 up\nip netns exec testns ip addr add 10.0.0.3/24 dev veth1\nip netns exec testns ip link set veth1 up\n\n# 4. 查看进程的 namespace\nls -la /proc/self/ns/\nls -la /proc/1/ns/\n\n# 5. 进入容器的 namespace\nnsenter --target <pid> --mount --uts --ipc --net --pid /bin/sh\n\n# 6. UID 映射（rootless 容器）\n# echo \"0 1000 1\" > /proc/<pid>/uid_map  # 容器 root = 宿主机 UID 1000"
  },
  {
    "id": "linux-systemd-new",
    "title": "systemd 新特性与现代管理",
    "level": "高级",
    "content": "**systemd 演进（2020+）**\n- systemd 250+ 版本新特性\n- 现代 Linux 系统的标准初始化系统\n\n**新特性概览**\n\n1. **systemd-homed（systemd 245+）**\n   - 用户主目录的 portable 管理\n   - 支持 LUKS 加密、自动挂载\n   - 用户记录可随目录迁移\n\n2. **systemd-oomd**\n   - 用户空间 OOM 杀手\n   - 基于 cgroup 的内存压力监控\n   - 更智能的进程选择策略\n   - 替代早期内核 OOM killer\n\n3. **systemd-repart**\n   - 开机时自动调整 GPT 分区大小\n   - 适合无状态/镜像化部署\n\n4. **systemd-cryptsetup + TPM2**\n   - 支持 TPM2 自动解密 LUKS\n   -  measured boot + PCR 策略\n   - 无密码自动解锁加密磁盘\n\n5. **Portable Services**\n   - 类似容器的系统服务打包\n   - 一个镜像包含服务 + 依赖\n   - 通过 systemd-portabled 管理\n\n6. **Unified Kernel Images（UKI）**\n   - systemd-stub + kernel + initrd + cmdline 合一\n   - 安全启动友好\n   - systemd 253+ 支持\n\n**systemd 性能优化**\n- systemd-analyze：启动分析\n- systemd-cgtop：cgroup 资源监控\n- systemd-run：临时运行单元\n- systemd-sysext：系统扩展层",
    "example": "# systemd 现代特性实战\n\n# 1. systemd-homed 管理用户\nhomectl create alice --real-name=\"Alice\" --storage=luks\nhomectl activate alice\nhomectl inspect alice\n\n# 2. systemd-oomd 配置\n# /etc/systemd/oomd.conf\n# [OOM]\n# DefaultMemoryPressureDurationSec=30s\n# systemctl enable systemd-oomd\n# systemctl start systemd-oomd\n\n# 3. systemd-run 临时服务\nsystemd-run --unit=myjob --timer-property=AccuracySec=1us --on-calendar='*:0/5' /usr/local/bin/backup.sh\n\n# 4. Portable Service\n# systemd-sysext list\n# systemd-sysext merge  # 合并系统扩展\n\n# 5. TPM2 自动解密\n# systemd-cryptenroll --tpm2-device=auto /dev/sda3\n# 重启后自动用 TPM2 解锁 LUKS\n\n# 6. UKI 构建\n# objcopy \\\n#   --add-section .osrel=/etc/os-release \\\n#   --add-section .cmdline=cmdline.txt \\\n#   --add-section .linux=vmlinuz \\\n#   --add-section .initrd=initrd.img \\\n#   /usr/lib/systemd/boot/efi/linuxx64.efi.stub \\\n#   unified.efi"
  },
  {
    "id": "linux-rust-tools",
    "title": "Rust 现代系统工具链",
    "level": "进阶",
    "content": "**Rust 系统工具生态**\n- 内存安全、零成本抽象、高性能\n- 正在重写大量核心系统工具\n\n**文件与文本工具**\n- **ripgrep（rg）**：grep 替代，递归搜索极快，默认忽略 .gitignore\n- **fd**：find 替代，语法直观，彩色输出，快速\n- **bat**：cat 替代，语法高亮、Git 集成、行号\n- **exa/eza**：ls 替代，彩色、图标、Git 状态、树形\n- **delta**：diff 增强，语法高亮、并排对比\n\n**Shell 与终端**\n- **nushell**：结构化数据 Shell（表格操作）\n- **atuin**：Shell 历史同步与搜索\n- **zellij / tmux**：终端复用器\n- **starship**：跨 Shell 提示符\n\n**系统工具**\n- **bandwhich**：进程级带宽监控\n- **procs**：ps 替代，彩色、树形、搜索\n- **bottom（btm）**：top 替代，图形化、跨平台\n- **dust**：du 替代，可视化磁盘使用\n- **hyperfine**：命令行基准测试\n- **sd**：sed 替代，直观语法\n- **choose**：cut/awk 替代\n\n**容器/K8s**\n- **crictl**：CRI 工具\n- **kind/minikube**：本地 K8s\n- **helm**：K8s 包管理",
    "example": "# Rust 现代工具实战\n\n# ripgrep\nrg 'pattern' --type py -C 3  # Python 文件中搜索，上下文3行\nrg -u 'TODO'  # 不忽略隐藏文件\n\n# fd\nfd '.*\\.log$' /var/log  # 查找日志文件\nfd -e py -x black {}  # 对所有 py 文件执行 black\n\n# bat\nbat app.py --theme=TwoDark  # 带语法高亮查看\nbat --diff  # 显示 Git diff\n\n# exa\neza -la --git --icons  # 彩色+Git状态+图标\neza -T --level=2  # 树形显示\n\n# procs\nprocs --tree  # 进程树\nprocs --watch  # 实时刷新\n\n# dust\ndust -d 2 /var  # 限制深度2\n\n# bottom\nbtm --basic  # 基础模式\n\n# 一键安装（cargo）\ncargo install ripgrep fd-find bat exa procs bottom dust hyperfine sd choose\n\n# 或大部分发行版已打包\n# apt install ripgrep fd-find bat exa  # Debian/Ubuntu"
  },
  {
    "id": "linux-confidential-computing",
    "title": "机密计算与可信执行环境",
    "level": "高级",
    "content": "**机密计算（Confidential Computing）**\n- 保护使用中数据（Data in Use）\n- CPU 级别的硬件可信执行环境（TEE）\n- 即使 root/管理员也无法窥探内存\n\n**主流 TEE 技术**\n\n1. **Intel SGX（Software Guard Extensions）**\n   - 用户态 Enclave\n   - 小内存限制（EPC 128MB 原始，后来扩展）\n   - 需 SDK 开发\n\n2. **AMD SEV（Secure Encrypted Virtualization）**\n   - 全虚拟机加密\n   - SEV-SNP：防止管理程序篡改内存\n   - 对应用透明\n\n3. **ARM TrustZone / CCA**\n   - TrustZone：安全世界 vs 正常世界\n   - CCA（Confidential Compute Architecture）：Realm\n\n4. **Intel TDX / AMD SEV-TES**\n   - 机密虚拟机\n   - 整个 VM 内存加密\n\n**云厂商支持**\n- AWS Nitro Enclaves\n- Azure Confidential Computing（DCsv3/ECasv5）\n- 阿里云神龙机密计算\n- 华为云擎天 Enclave\n\n**应用场景**\n- 金融：加密交易处理\n- 医疗：隐私数据计算\n- AI：联邦学习、隐私保护推理\n- 区块链：可信预言机、MPC",
    "example": "# 机密计算实践\n\n# 1. 检查 CPU 支持\ncpuid | grep -i sgx  # Intel SGX\ndmesg | grep -i sev  # AMD SEV\n\n# 2. Linux SGX 驱动\nls /dev/sgx*  # /dev/sgx_enclave, /dev/sgx_provision\n\n# 3. Gramine（SGX 运行时）\n# 无需修改代码即可在 SGX 中运行应用\ngramine-sgx ./app\n\n# 4. AMD SEV 虚拟机\n# qemu-system-x86_64 \\\n#   -enable-kvm \\\n#   -cpu EPYC-Milan-v2 \\\n#   -machine confidential-guest-support=sev0 \\\n#   -object sev-guest,id=sev0,cbitpos=47,reduced-phys-bits=1\n\n# 5. AWS Nitro Enclaves\n# aws ec2 run-instances \\\n#   --enclave-options 'Enabled=true' \\\n#   --image-id ami-xxxx\n\n# 6. 机密容器（Confidential Containers）\n# Kata Containers + SEV/SEV-SNP/TDX\n# kubectl apply -f cc-runtimeclass.yaml"
  },
  {
    "id": "linux-live-patching",
    "title": "Linux 内核热补丁技术",
    "level": "高级",
    "content": "**内核热补丁（Live Patching）**\n- 不停机修复内核安全漏洞\n- 替换运行中的内核函数\n- 适用于高可用场景\n\n**主流技术**\n\n1. **kpatch（Red Hat）**\n   - 基于 ftrace\n   - 使用 livepatch 子系统\n   - 官方支持 RHEL、CentOS Stream、Fedora\n\n2. **KernelCare（CloudLinux）**\n   - 商业方案\n   - 支持更多发行版\n   - 自动补丁分发\n\n3. **SUSE Kgraft**\n   - SUSE 方案\n   - 类似 kpatch\n\n4. **livepatch 子系统（内核内置）**\n   - CONFIG_LIVEPATCH=y\n   - /sys/kernel/livepatch/\n\n**限制与风险**\n- 只能修改函数实现，不能修改数据结构\n- 复杂补丁可能无法热更新\n- 需要充分测试兼容性\n- 多个补丁叠加可能产生冲突\n\n**现代演进**\n- 自动热补丁分发（Canonical Livepatch、KernelCare）\n- eBPF 辅助验证补丁安全性\n- 容器场景：节点热补丁无需影响 Pod",
    "example": "# kpatch 使用\n\n# 1. 安装\n# yum install kpatch-dnf\n# kpatch install kernel-5.14.0-xxx\n\n# 2. 手动加载补丁模块\nkpatch load /path/to/kpatch-module.ko\n\n# 3. 查看已加载补丁\nkpatch list\ncat /sys/kernel/livepatch/*/enabled\n\n# 4. 卸载补丁\nkpatch unload kpatch_xxx\n\n# 5. 生成补丁模块（开发）\n# kpatch-build -t vmlinux patch.diff\n\n# 6. Canonical Livepatch（Ubuntu）\n# sudo canonical-livepatch enable <token>\n# canonical-livepatch status\n\n# 7. 检查补丁是否生效\n# 对比 /proc/kallsyms 中函数地址\ncat /proc/kallsyms | grep patched_function"
  }
],

linux_ext4_questions: [
  {
    "q": "eBPF 程序在加载前需要通过什么检查？",
    "level": "高级",
    "options": ["编译器优化","验证器（Verifier）","签名验证","病毒扫描"],
    "answer": 1,
    "explain": "eBPF 程序必须通过内核验证器（Verifier）的安全检查，确保不会导致内核崩溃或无限循环。"
  },
  {
    "q": "io_uring 的双环形队列是？",
    "level": "高级",
    "options": ["RX/TX","SQ/CQ","IN/OUT","PUSH/POP"],
    "answer": 1,
    "explain": "io_uring 使用 SQ（Submission Queue）提交请求，CQ（Completion Queue）接收完成事件。"
  },
  {
    "q": "Cgroup v2 相比 v1 的主要改进是？",
    "level": "高级",
    "options": ["更多控制器","统一层次结构","支持更多进程","更快的 IO"],
    "answer": 1,
    "explain": "Cgroup v2 将 v1 的多个独立控制器层次结构统一为单棵树，解决了进程归属混乱问题。"
  },
  {
    "q": "Linux 中，哪个 namespace 隔离用户和组 ID？",
    "level": "进阶",
    "options": ["PID","User","UTS","IPC"],
    "answer": 1,
    "explain": "User namespace 隔离用户和组 ID，支持 UID/GID 映射，是 rootless 容器的基础。"
  },
  {
    "q": "systemd-oomd 的主要作用是？",
    "level": "高级",
    "options": ["内存压缩","用户空间 OOM 处理","swap 管理","缓存清理"],
    "answer": 1,
    "explain": "systemd-oomd 是用户空间的 OOM 杀手，基于 cgroup 内存压力监控，比内核 OOM killer 更智能。"
  },
  {
    "q": "ripgrep（rg）相比 grep 的主要优势是？",
    "level": "进阶",
    "options": ["支持正则","默认递归、忽略 .gitignore、极速","支持二进制","支持管道"],
    "answer": 1,
    "explain": "ripgrep 默认递归搜索，自动读取 .gitignore，基于 Rust 实现，性能远超传统 grep。"
  },
  {
    "q": "AMD SEV 技术保护的是什么？",
    "level": "高级",
    "options": ["静态数据","传输中数据","使用中数据（内存加密）","备份数据"],
    "answer": 2,
    "explain": "AMD SEV（Secure Encrypted Virtualization）对虚拟机内存进行硬件加密，保护使用中数据。"
  },
  {
    "q": "kpatch 基于哪个内核机制实现热补丁？",
    "level": "高级",
    "options": ["kprobe","ftrace/livepatch","BPF","kexec"],
    "answer": 1,
    "explain": "kpatch 基于内核的 ftrace 和 livepatch 子系统，通过替换函数指针实现不停机修复。"
  },
  {
    "q": "io_uring 的 IORING_SETUP_SQPOLL 模式的作用是？",
    "level": "高级",
    "options": ["设备轮询","内核线程轮询提交队列","用户轮询完成队列","中断驱动"],
    "answer": 1,
    "explain": "SQPOLL 模式让内核线程轮询提交队列，用户态提交无需系统调用，实现零 syscall IO。"
  },
  {
    "q": "PSI（Pressure Stall Information）提供什么信息？",
    "level": "高级",
    "options": ["进程状态","资源压力（CPU/内存/IO）","网络延迟","磁盘健康"],
    "answer": 1,
    "explain": "PSI 实时反馈 CPU、内存、IO 的资源压力程度，帮助系统做出智能调度决策。"
  },
  {
    "q": "systemd-homed 的主要功能是？",
    "level": "进阶",
    "options": ["系统主页加密","用户主目录可移植管理","密码管理","备份工具"],
    "answer": 1,
    "explain": "systemd-homed 提供用户主目录的可移植管理，支持 LUKS 加密和自动挂载。"
  },
  {
    "q": "bat 命令是 cat 的替代工具，主要特点是？",
    "level": "基础",
    "options": ["更快","语法高亮、Git 集成、行号","支持压缩","支持网络"],
    "answer": 1,
    "explain": "bat 提供语法高亮、Git 修改标记、自动分页、行号等功能，是 cat 的现代替代品。"
  },
  {
    "q": "Linux 5.6+ 新增的 Time namespace 用于隔离什么？",
    "level": "高级",
    "options": ["时区","系统启动时间和单调时钟","NTP 同步","定时器"],
    "answer": 1,
    "explain": "Time namespace 隔离 boot time 和 monotonic clock，允许容器内看到独立的时间基准。"
  },
  {
    "q": "Cilium 作为 K8s CNI 主要基于？",
    "level": "高级",
    "options": ["iptables","OVS","eBPF","VPP"],
    "answer": 2,
    "explain": "Cilium 基于 eBPF 实现 K8s 的网络、安全策略和可观测性，性能远高于 iptables 方案。"
  },
  {
    "q": "nushell 的核心理念是？",
    "level": "进阶",
    "options": ["更快","结构化数据 Shell","兼容 bash","更小体积"],
    "answer": 1,
    "explain": "nushell 将一切数据视为结构化表格，支持类 SQL 的筛选、排序、聚合操作。"
  },
  {
    "q": "Intel TDX 提供的是？",
    "level": "高级",
    "options": ["进程级 TEE","机密虚拟机","磁盘加密","网络加密"],
    "answer": 1,
    "explain": "Intel TDX（Trust Domain Extensions）提供机密虚拟机，整个 VM 内存加密，对应用透明。"
  },
  {
    "q": "以下哪个工具用于可视化磁盘使用？",
    "level": "基础",
    "options": ["df","du","dust","fdisk"],
    "answer": 2,
    "explain": "dust（du + rust）是 du 的现代替代品，提供可视化的目录大小展示。"
  },
  {
    "q": "eBPF 的 CO-RE 全称是？",
    "level": "高级",
    "options": ["Core Object Runtime Environment","Compile Once Run Everywhere","Common Object Resource Engine","Concurrent Operation Runtime Extension"],
    "answer": 1,
    "explain": "CO-RE = Compile Once Run Everywhere，通过 BTF 信息实现 eBPF 程序跨内核版本兼容。"
  },
  {
    "q": "systemd UKI（Unified Kernel Image）将什么打包在一起？",
    "level": "高级",
    "options": ["内核和模块","内核、initrd、cmdline","所有 systemd 服务","整个根文件系统"],
    "answer": 1,
    "explain": "UKI 将 systemd-stub、kernel、initrd、cmdline 打包为单个 EFI 可执行文件，利于安全启动。"
  },
  {
    "q": "Cgroup v2 中，控制内存限制的文件是？",
    "level": "进阶",
    "options": ["memory.limit_in_bytes","memory.max","memory.high","memory.soft_limit_in_bytes"],
    "answer": 1,
    "explain": "Cgroup v2 使用 memory.max 设置硬内存限制，替代 v1 的 memory.limit_in_bytes。"
  },
  {
    "q": "bottom（btm）是以下哪个命令的替代品？",
    "level": "基础",
    "options": ["ps","top","df","free"],
    "answer": 1,
    "explain": "bottom（btm）是 top 的现代替代品，提供图形化、可定制、跨平台的系统监控。"
  },
  {
    "q": "AMD SEV-SNP 相比 SEV 增加了什么能力？",
    "level": "高级",
    "options": ["更大内存","防止管理程序篡改内存","支持更多 VM","更快加密"],
    "answer": 1,
    "explain": "SEV-SNP（Secure Nested Paging）增加了完整性保护，防止恶意管理程序篡改客户机内存。"
  },
  {
    "q": "unshare 命令的作用是？",
    "level": "进阶",
    "options": ["共享 namespace","创建并进入新的 namespace","查看 namespace","删除 namespace"],
    "answer": 1,
    "explain": "unshare 用于创建并进入新的 namespace，是容器技术的底层工具。"
  },
  {
    "q": "以下哪个不是 eBPF 的程序类型？",
    "level": "高级",
    "options": ["kprobe","tracepoint","iptables","XDP"],
    "answer": 2,
    "explain": "iptables 是传统 netfilter 框架的工具，不是 eBPF 程序类型。kprobe、tracepoint、XDP 都是 eBPF 类型。"
  },
  {
    "q": "io_uring 支持的 Polling 模式不包括？",
    "level": "高级",
    "options": ["IORING_SETUP_IOPOLL","IORING_SETUP_SQPOLL","IORING_SETUP_CQPOLL","IORING_SETUP_IOPOLL 和 IORING_SETUP_SQPOLL 都支持"],
    "answer": 2,
    "explain": "io_uring 支持 IOPOLL（设备轮询）和 SQPOLL（提交队列轮询），没有 CQPOLL 这种模式。"
  },
  {
    "q": "Gramine 在机密计算中的作用是？",
    "level": "高级",
    "options": ["生成密钥","无需修改代码在 SGX 中运行应用","加密磁盘","管理 TPM"],
    "answer": 1,
    "explain": "Gramine 是一个 SGX 运行时库 OS，允许未经修改的应用程序在 Intel SGX enclave 中运行。"
  },
  {
    "q": "systemd-run 的作用是？",
    "level": "进阶",
    "options": ["重启 systemd","临时运行一个 systemd 单元","查看运行中单元","停止服务"],
    "answer": 1,
    "explain": "systemd-run 用于在运行时临时创建并启动一个 transient（临时）systemd 单元。"
  },
  {
    "q": "Linux 机密计算主要保护哪类数据？",
    "level": "高级",
    "options": ["静态数据","传输中数据","使用中数据（内存）","归档数据"],
    "answer": 2,
    "explain": "机密计算通过 TEE 保护使用中数据（Data in Use），弥补静态加密和传输加密的空白。"
  },
  {
    "q": "fd 命令相比 find 的主要优势是？",
    "level": "基础",
    "options": ["支持更多条件","默认忽略 .gitignore、彩色输出、直观语法","支持网络搜索","支持正则"],
    "answer": 1,
    "explain": "fd 默认读取 .gitignore，提供彩色输出和更直观的查询语法，是 find 的现代替代品。"
  },
  {
    "q": "Cgroup v2 中，cgroup.subtree_control 的作用是？",
    "level": "高级",
    "options": ["显示进程","启用子 cgroup 的控制器","设置资源限制","查看统计"],
    "answer": 1,
    "explain": "cgroup.subtree_control 用于在父 cgroup 中启用要向子树传播的控制器（如 +cpu +memory）。"
  }
]
