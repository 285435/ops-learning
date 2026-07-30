// === NETWORK EXT4 ===
network_ext4_topics: [
  {
    "id": "network-sdn",
    "title": "SDN 软件定义网络与 OpenFlow",
    "level": "高级",
    "content": "**SDN 核心架构**\n\n1. **数据平面（Data Plane）**\n   - 交换机/路由器负责数据包转发\n   - 基于流表（Flow Table）进行匹配转发\n   - OpenFlow 协议：控制器与交换机之间的标准南向接口\n\n2. **控制平面（Control Plane）**\n   - SDN 控制器：网络的大脑，集中管理全网策略\n   - 主流控制器：OpenDaylight、ONOS、Ryu、Floodlight\n   - 北向接口（Northbound API）：向应用层提供网络编程接口\n\n3. **应用平面（Application Plane）**\n   - 负载均衡、流量工程、安全策略等应用\n   - 通过 REST API 与控制器交互\n\n**OpenFlow 流表结构**\n- Match Fields：入端口、VLAN、MAC、IP、TCP/UDP 端口等\n- Priority：流表项优先级\n- Counters：匹配计数器\n- Instructions：动作指令（转发、丢弃、修改头部、发送到控制器）\n- Timeout：空闲超时和硬超时\n- Cookie：控制器标识用\n\n**SDN 优势**\n- 集中控制，全局视图\n- 灵活编程，快速创新\n- 降低设备复杂度\n- 支持网络虚拟化（NV）和网络功能虚拟化（NFV）",
    "example": "# Open vSwitch (OVS) 基本操作\n# 创建网桥\novs-vsctl add-br br0\n\n# 添加端口\novs-vsctl add-port br0 eth0\novs-vsctl add-port br0 veth0\n\n# 设置控制器\novs-vsctl set-controller br0 tcp:192.168.1.10:6653\n\n# 查看流表\novs-ofctl dump-flows br0\n\n# 手动添加流表项\novs-ofctl add-flow br0 \"in_port=1,dl_dst=00:11:22:33:44:55,actions=output:2\"\n\n# 删除所有流表\novs-ofctl del-flows br0\n\n# Ryu 控制器简单应用（Python）\n# from ryu.base import app_manager\n# from ryu.controller import ofp_event\n# from ryu.controller.handler import set_ev_cls\n# class SimpleSwitch(app_manager.RyuApp):\n#     @set_ev_cls(ofp_event.EventOFPPacketIn)\n#     def packet_in_handler(self, ev):\n#         # 处理未知数据包\n#         pass"
  },
  {
    "id": "network-sase",
    "title": "SASE 安全访问服务边缘",
    "level": "高级",
    "content": "**SASE 定义**\n- Gartner 2019 年提出的网络与安全融合架构\n- Secure Access Service Edge\n- 将网络（SD-WAN）与安全（SWG、CASB、ZTNA、FWaaS）融合为云服务\n\n**SASE 核心组件**\n\n1. **SD-WAN**\n   - 软件定义广域网\n   - 智能选路、应用感知、链路聚合\n\n2. **SWG（Secure Web Gateway）**\n   - 安全 Web 网关\n   - URL 过滤、恶意软件检测、数据防泄漏\n\n3. **CASB（Cloud Access Security Broker）**\n   - 云访问安全代理\n   - 位于用户和云服务之间，监控和控制云应用访问\n\n4. **ZTNA（Zero Trust Network Access）**\n   - 零信任网络访问\n   - 永不信任，始终验证\n   - 基于身份和上下文的访问控制\n\n5. **FWaaS（Firewall as a Service）**\n   - 云原生防火墙服务\n   - 下一代防火墙能力云化交付\n\n**SASE 优势**\n- 简化架构，统一策略\n- 降低延迟（PoP 点就近接入）\n- 弹性扩展，按需订阅\n- 适合分布式办公和云原生企业",
    "example": "# SASE 架构部署示意\n# 1. 边缘 PoP 点全球分布\n#    - 用户通过最近 PoP 接入\n#    - PoP 提供 SD-WAN + 安全栈\n\n# 2. ZTNA 访问流程\n#    User -> Identity Provider (OIDC/SAML) -> ZTNA Controller -> Application\n#    - 设备信任评估\n#    - 用户身份验证\n#    - 最小权限授权\n#    - 持续风险评估\n\n# 3. CASB 部署模式\n#    - API 模式：扫描云应用数据\n#    - 代理模式：实时监控流量\n#    - 反向代理模式：免客户端部署\n\n# 主流 SASE 厂商\n# - Cloudflare One\n# - Zscaler\n# - Palo Alto Prisma\n# - Cato Networks\n# - Fortinet SASE"
  },
  {
    "id": "network-zero-trust",
    "title": "零信任网络架构",
    "level": "高级",
    "content": "**零信任核心原则**\n- 永不信任，始终验证（Never Trust, Always Verify）\n- 假设网络已被攻破\n- 最小权限原则\n- 微隔离（Micro-segmentation）\n\n**零信任三大支柱**\n\n1. **用户身份验证**\n   - MFA 多因素认证\n   - 自适应身份验证（基于风险）\n   - SSO 单点登录\n   - 持续会话验证\n\n2. **设备信任**\n   - 设备指纹识别\n   - EDR/XDR 集成\n   - 设备健康状态检查\n   - TPM/安全启动验证\n\n3. **网络微隔离**\n   - 基于身份的访问控制（非网络位置）\n   - 东西向流量管控\n   - 应用级分段\n   - 动态策略调整\n\n**零信任架构组件**\n- **Policy Engine**：策略决策引擎\n- **Policy Administrator**：策略执行点\n- **PEP（Policy Enforcement Point）**：网络/应用/数据层执行\n\n**实施路径**\n1. 识别关键资产和数据流\n2. 建立身份和设备基线\n3. 部署微隔离\n4. 实施持续监控和分析\n5. 自动化响应和修复",
    "example": "# 零信任网络实施示例\n\n# 1. 基于身份的防火墙规则（非 IP）\n# 传统：允许 10.0.1.0/24 访问 10.0.2.0/24:443\n# 零信任：允许 user:alice@company.com + device:managed-laptop 访问 app:finance-api\n\n# 2. Kubernetes 中的零信任（Istio + mTLS）\n# apiVersion: security.istio.io/v1beta1\n# kind: PeerAuthentication\n# metadata:\n#   name: default\n# spec:\n#   mtls:\n#     mode: STRICT  # 强制双向 TLS\n\n# 3. 网络微隔离（Calico NetworkPolicy）\n# apiVersion: networking.k8s.io/v1\n# kind: NetworkPolicy\n# metadata:\n#   name: api-allow-frontend\n# spec:\n#   podSelector:\n#     matchLabels:\n#       app: api\n#   ingress:\n#   - from:\n#     - podSelector:\n#         matchLabels:\n#           app: frontend\n\n# 4. BeyondCorp 模型（Google）\n# - 访问代理（Access Proxy）替代 VPN\n# - 设备信任库存（Device Inventory）\n# - 用户/设备/上下文综合评分"
  },
  {
    "id": "network-wireguard",
    "title": "WireGuard 现代 VPN 协议",
    "level": "进阶",
    "content": "**WireGuard 特点**\n- 极简代码库（约 4000 行 vs OpenVPN 10万+行）\n- 内核级实现（Linux 5.6+ 内置）\n- 现代加密：Curve25519、ChaCha20、Poly1305、BLAKE2s\n- 无状态连接，快速握手\n- 高性能，低延迟\n- 易于配置（类似 SSH 的密钥管理）\n\n**与传统 VPN 对比**\n- OpenVPN/IPSec：复杂配置，重协议栈\n- WireGuard：即插即用，轻量高效\n- 支持 roaming（IP 变化自动重连）\n\n**工作原理**\n1. 每个节点有公钥/私钥对\n2. 配置对端公钥和允许的 IP\n3. 发送数据时自动完成密钥交换\n4. 保持连接：定期发送 keepalive\n\n**部署场景**\n- 远程办公替代传统 VPN\n- 云服务器组网（Mesh VPN）\n- K8s CNI（如 Cilium 支持 WireGuard 加密）\n- 容器跨主机通信加密",
    "example": "# WireGuard 快速配置\n\n# 1. 生成密钥对\nwg genkey | tee privatekey | wg pubkey > publickey\n\n# 2. 服务端配置 /etc/wireguard/wg0.conf\n# [Interface]\n# PrivateKey = <服务器私钥>\n# Address = 10.200.200.1/24\n# ListenPort = 51820\n# PostUp = iptables -A FORWARD -i wg0 -j ACCEPT\n# PostDown = iptables -D FORWARD -i wg0 -j ACCEPT\n\n# [Peer]\n# PublicKey = <客户端公钥>\n# AllowedIPs = 10.200.200.2/32\n\n# 3. 启动\nwg-quick up wg0\nsystemctl enable wg-quick@wg0\n\n# 4. 查看状态\nwg show\n\n# 5. 跨平台客户端\n# - Windows/macOS: WireGuard 官方客户端\n# - iOS/Android: App Store 下载\n# - Linux: wg-quick\n\n# Mesh 组网工具：Tailscale / Headscale（基于 WireGuard）\n# tailscale up --login-server https://headscale.example.com"
  },
  {
    "id": "network-quic-http3",
    "title": "QUIC 与 HTTP/3 协议",
    "level": "高级",
    "content": "**QUIC 核心特性**\n- 基于 UDP 的传输协议\n- 内置 TLS 1.3（0-RTT 或 1-RTT 握手）\n- 连接迁移（Connection Migration）：IP 变化不影响连接\n- 无队头阻塞（Head-of-Line Blocking）：多流独立传输\n- 前向纠错（FEC）\n- 更快的握手速度\n\n**HTTP/3 = HTTP over QUIC**\n- IETF 标准化（RFC 9114）\n- 浏览器支持：Chrome、Firefox、Safari、Edge\n- 服务端支持：Nginx、Caddy、Cloudflare、Fastly\n\n**与 TCP+TLS+HTTP/2 对比**\n| 特性 | TCP+TLS+HTTP/2 | QUIC+HTTP/3 |\n|------|----------------|-------------|\n| 握手延迟 | 2-3 RTT | 0-1 RTT |\n| 队头阻塞 | TCP 层阻塞 | 流独立 |\n| 连接迁移 | 不支持 | 支持 |\n| 中间设备 | 友好 | 可能被 UDP 限制 |\n\n**部署挑战**\n- 企业防火墙可能限制 UDP\n- QUIC 流量可能被限速\n- 负载均衡需要支持 QUIC\n- 网络诊断工具需适配",
    "example": "# Nginx 启用 HTTP/3（1.25+）\nserver {\n    listen 443 quic reuseport;\n    listen 443 ssl;\n    \n    ssl_certificate     /path/to/cert.pem;\n    ssl_certificate_key /path/to/key.pem;\n    \n    # 启用 0-RTT\n    ssl_early_data on;\n    \n    # 通告客户端支持 HTTP/3\n    add_header Alt-Svc 'h=\":443\"; ma=86400';\n    \n    location / {\n        root /var/www;\n    }\n}\n\n# Caddy（原生支持 HTTP/3）\n# Caddyfile\nexample.com {\n    bind 0.0.0.0\n    tls /path/to/cert.pem /path/to/key.pem\n    file_server\n}\n\n# 测试 HTTP/3\ncurl --http3 -I https://cloudflare.com\n\n# Chrome 查看协议\n# DevTools -> Network -> Protocol 列显示 h3"
  },
  {
    "id": "network-ebpf-net",
    "title": "eBPF 网络可观测与加速",
    "level": "高级",
    "content": "**eBPF 网络应用**\n- Linux 内核字节码虚拟机\n- 无需修改内核或加载模块\n- 安全、高效、事件驱动\n\n**网络场景**\n\n1. **可观测性**\n   - tcpconnect/tcpaccept：跟踪 TCP 连接\n   - tcplife：跟踪 TCP 会话生命周期\n   - tcpretrans：跟踪 TCP 重传\n   - bpftrace 一行命令分析网络\n\n2. **性能加速**\n   - XDP（eXpress Data Path）：网卡驱动层包处理\n   - 绕过内核网络栈，DPDK 的轻量替代\n   - 高达 10-20 倍性能提升\n\n3. **安全**\n   - 实时网络策略执行\n   - DDoS 缓解\n   - L3-L7 过滤\n\n**工具生态**\n- BCC（BPF Compiler Collection）：Python/Lua 前端\n- bpftrace：类 awk 的高级跟踪语言\n- Cilium：基于 eBPF 的 K8s CNI\n- Katran：Facebook L4 负载均衡\n- Pixie：K8s 可观测平台",
    "example": "# eBPF 网络诊断工具\n\n# 1. 跟踪 TCP 连接\nbpftrace -e 'kprobe:tcp_connect { printf(\"PID=%d comm=%s\\n\", pid, comm); }'\n\n# 2. 统计 TCP 重传\ntcpretrans-bpfcc\n\n# 3. XDP 程序加载（丢弃所有 UDP）\n# clang -O2 -target bpf -c xdp_drop_udp.c -o xdp_drop_udp.o\n# ip link set dev eth0 xdp obj xdp_drop_udp.o sec xdp\n\n# 4. Cilium Hubble 观测 K8s 网络\nhubble observe --pod frontend --protocol http\nhubble observe --verdict DROPPED\n\n# 5. 网络延迟热力图（bpftrace）\nbpftrace -e '\nkprobe:tcp_sendmsg\n/arg1/\n{\n    @start[tid] = nsecs;\n}\n\nkretprobe:tcp_sendmsg\n/@start[tid]/\n{\n    @latency_us = hist((nsecs - @start[tid]) / 1000);\n    delete(@start[tid]);\n}\n'\n\n# 6. Katran 负载均衡（Facebook）\n# 基于 XDP 的 L4 LB，单机处理数千万连接"
  },
  {
    "id": "network-cloud-vpc",
    "title": "云网络 VPC 与混合云组网",
    "level": "高级",
    "content": "**VPC（Virtual Private Cloud）核心概念**\n- 公有云中的隔离私有网络\n- 完全控制 IP 地址范围、子网、路由表、网络 ACL\n- 主流云：AWS VPC、Azure VNet、阿里云 VPC、腾讯云 VPC\n\n**VPC 关键组件**\n\n1. **子网（Subnet）**\n   - 可用区级别资源\n   - 公网子网（含 NAT 网关/IGW 路由）\n   - 私网子网（仅内部通信）\n\n2. **路由表（Route Table）**\n   - 控制子网内流量走向\n   - 自定义路由：指向 NAT、VPN、对等连接、Transit Gateway\n\n3. **安全组 vs NACL**\n   - 安全组：实例级、有状态、仅允许规则\n   - NACL：子网级、无状态、允许+拒绝规则\n\n4. **NAT 网关**\n   - 私网实例访问公网\n   - 高可用、自动扩展、按流量计费\n\n**混合云连接方案**\n- **VPN**：IPSec/SSL VPN，低成本，高延迟\n- **专线**：AWS Direct Connect、Azure ExpressRoute，低延迟高可靠\n- **SD-WAN**：智能选路，混合链路\n- **云企业网（CEN）**：多云/多地域全互联",
    "example": "# AWS VPC 架构示例\n# 1. 创建 VPC\naws ec2 create-vpc --cidr-block 10.0.0.0/16\n\n# 2. 创建子网\naws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a\n\n# 3. 创建 Internet 网关并附加\naws ec2 create-internet-gateway\naws ec2 attach-internet-gateway --internet-gateway-id igw-xxx --vpc-id vpc-xxx\n\n# 4. 路由表配置\naws ec2 create-route --route-table-id rtb-xxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxx\n\n# 5. 安全组\naws ec2 create-security-group --group-name web-sg --description \"Web SG\" --vpc-id vpc-xxx\naws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 80 --cidr 0.0.0.0/0\n\n# Terraform 定义 VPC\n# resource \"aws_vpc\" \"main\" {\n#   cidr_block = \"10.0.0.0/16\"\n# }\n\n# 对等连接（VPC Peering）\n# 两个 VPC 之间私有通信，不经过公网"
  },
  {
    "id": "network-5g-core",
    "title": "5G 核心网与服务化架构",
    "level": "高级",
    "content": "**5G 核心网（5GC）演进**\n- 从 4G EPC 的专用硬件到 5G 的云原生微服务\n- SBA（Service Based Architecture）：基于服务的架构\n- 控制面与媒体面完全分离（CUPS）\n- 支持网络切片（Network Slicing）\n\n**5GC 关键网元**\n\n1. **AMF（Access and Mobility Management Function）**\n   - 接入和移动性管理\n   - 替代 4G MME 的部分功能\n\n2. **SMF（Session Management Function）**\n   - 会话管理、IP 地址分配\n   - 策略执行、UPF 选择\n\n3. **UPF（User Plane Function）**\n   - 用户面数据转发\n   - 可下沉到边缘（MEC）\n\n4. **PCF（Policy Control Function）**\n   - 策略控制\n\n5. **AUSF/UDM**\n   - 认证和用户数据管理\n\n**网络切片**\n- eMBB：增强移动宽带（高清视频、AR/VR）\n- uRLLC：超可靠低延迟（工业控制、自动驾驶）\n- mMTC：海量机器通信（物联网）\n- 同一物理基础设施，逻辑隔离的不同网络\n\n**边缘计算（MEC）**\n- UPF 下沉到边缘数据中心\n- 数据本地处理，降低延迟\n- 与云计算协同",
    "example": "# 5G 网络切片概念\n# 一个物理网络 -> 多个逻辑切片\n\n# 切片 1：eMBB（带宽型）\n# - 高带宽 UPF\n# - 宽松延迟策略\n\n# 切片 2：uRLLC（延迟敏感型）\n# - 边缘 UPF\n# - 本地分流，不回传核心\n# - 99.999% 可靠性\n\n# 切片 3：mMTC（物联网）\n# - 支持海量连接\n# - 低功耗优化\n\n# Kubernetes 管理 5G 核心网网元\n# helm install amf ./amf-chart\n# helm install smf ./smf-chart\n# helm install upf ./upf-chart\n\n# Open5GS 开源 5G 核心网\n# docker-compose up -d 快速部署测试环境\n\n# 边缘计算架构\n# UE -> gNB -> Edge UPF -> Edge App Server\n#       |-> 中心 UPF -> Internet/Cloud"
  }
],

network_ext4_questions: [
  {
    "q": "SDN 架构中，南向接口协议是？",
    "level": "高级",
    "options": ["REST API","OpenFlow","NETCONF","gRPC"],
    "answer": 1,
    "explain": "OpenFlow 是 SDN 控制器与交换机之间的标准南向接口协议，用于下发流表。REST API 通常是北向接口。"
  },
  {
    "q": "SASE 架构中，ZTNA 的全称是？",
    "level": "高级",
    "options": ["Zero Trust Network Access","Zone Trust Network Architecture","Zero Time Network Authentication","Zone Transfer Network Agent"],
    "answer": 0,
    "explain": "ZTNA = Zero Trust Network Access，零信任网络访问，是 SASE 的核心组件之一。"
  },
  {
    "q": "WireGuard 使用的密钥交换算法是？",
    "level": "进阶",
    "options": ["RSA-2048","Curve25519","ECDSA P-256","Diffie-Hellman"],
    "answer": 1,
    "explain": "WireGuard 使用 Curve25519 进行密钥交换，ChaCha20 加密，Poly1305 认证，均为现代高效算法。"
  },
  {
    "q": "HTTP/3 基于哪个传输协议？",
    "level": "进阶",
    "options": ["TCP","SCTP","QUIC","TLS"],
    "answer": 2,
    "explain": "HTTP/3 基于 QUIC 协议，而 QUIC 基于 UDP。"
  },
  {
    "q": "eBPF 中，XDP 在哪个层面处理数据包？",
    "level": "高级",
    "options": ["应用层","传输层","网络层","网卡驱动层"],
    "answer": 3,
    "explain": "XDP（eXpress Data Path）在网卡驱动层处理数据包，可实现极高性能的包过滤和转发。"
  },
  {
    "q": "云 VPC 中，安全组和 NACL 的主要区别是？",
    "level": "进阶",
    "options": ["安全组是子网级，NACL 是实例级","安全组是有状态的，NACL 是无状态的","安全组支持拒绝规则，NACL 不支持","没有区别"],
    "answer": 1,
    "explain": "安全组是实例级、有状态（自动允许返回流）、仅支持允许规则；NACL 是子网级、无状态、支持允许和拒绝规则。"
  },
  {
    "q": "5G 核心网采用的架构是？",
    "level": "高级",
    "options": ["单体架构","微服务化 SBA","SOA 面向服务","单体+插件"],
    "answer": 1,
    "explain": "5GC 采用 SBA（Service Based Architecture），控制面网元解耦为独立的云原生微服务。"
  },
  {
    "q": "QUIC 相比 TCP 的主要优势不包括？",
    "level": "高级",
    "options": ["0-RTT 握手","连接迁移","队头阻塞消除","更高的 MTU"],
    "answer": 3,
    "explain": "QUIC 的优势包括快速握手、连接迁移、消除队头阻塞，但 MTU 大小不是其特性（UDP 载荷限制反而更严格）。"
  },
  {
    "q": "以下哪个不是 SASE 的核心组件？",
    "level": "高级",
    "options": ["SD-WAN","SWG","IDS","ZTNA"],
    "answer": 2,
    "explain": "SASE 核心组件包括 SD-WAN、SWG、CASB、ZTNA、FWaaS。传统 IDS 不是 SASE 标准组件（虽可集成）。"
  },
  {
    "q": "Open vSwitch 中查看流表的命令是？",
    "level": "进阶",
    "options": ["ovs-vsctl show","ovs-ofctl dump-flows","ovsdb-client dump","ovs-appctl fdb/show"],
    "answer": 1,
    "explain": "ovs-ofctl dump-flows <bridge> 用于查看 OpenFlow 流表。"
  },
  {
    "q": "WireGuard 内置于 Linux 内核的版本是？",
    "level": "进阶",
    "options": ["4.19","5.4","5.6","6.0"],
    "answer": 2,
    "explain": "WireGuard 于 Linux 5.6 合并入主分支，成为内核原生支持的 VPN 协议。"
  },
  {
    "q": "零信任架构的核心原则是？",
    "level": "高级",
    "options": ["边界防御","永不信任，始终验证","最小加密","最大权限"],
    "answer": 1,
    "explain": "零信任核心原则是 Never Trust, Always Verify（永不信任，始终验证），假设网络已被攻破。"
  },
  {
    "q": "eBPF 程序运行在内核的哪个子系统？",
    "level": "高级",
    "options": ["用户空间","内核虚拟机","硬件抽象层","系统调用层"],
    "answer": 1,
    "explain": "eBPF 是内核中的字节码虚拟机，提供安全、高效的事件驱动编程能力。"
  },
  {
    "q": "5G 网络切片中，面向工业控制场景的是？",
    "level": "高级",
    "options": ["eMBB","uRLLC","mMTC","VoNR"],
    "answer": 1,
    "explain": "uRLLC（ ultra-Reliable Low Latency Communications）面向工业控制、自动驾驶等超低延迟高可靠场景。"
  },
  {
    "q": "HTTP/3 的传输层协议是？",
    "level": "基础",
    "options": ["TCP","UDP","SCTP","DCCP"],
    "answer": 1,
    "explain": "HTTP/3 基于 QUIC，QUIC 基于 UDP 传输。"
  },
  {
    "q": "以下哪个工具基于 eBPF 实现 K8s 网络策略？",
    "level": "高级",
    "options": ["Flannel","Calico eBPF","Weave Net","Kube-router"],
    "answer": 1,
    "explain": "Calico 支持 eBPF 数据平面，提供高性能的 K8s 网络策略和服务。"
  },
  {
    "q": "SD-WAN 的主要优势是？",
    "level": "进阶",
    "options": ["专用线路保障","智能选路与应用感知","免费带宽","无需配置"],
    "answer": 1,
    "explain": "SD-WAN 通过软件定义实现智能选路、应用感知、链路聚合，降低 MPLS 依赖。"
  },
  {
    "q": "混合云连接方案中，延迟最低的是？",
    "level": "进阶",
    "options": ["IPSec VPN","SD-WAN","专线（Direct Connect）","公网互联网"],
    "answer": 2,
    "explain": "专线（如 AWS Direct Connect、Azure ExpressRoute）提供专用物理连接，延迟最低、最稳定。"
  },
  {
    "q": "Tailscale 基于什么协议实现组网？",
    "level": "进阶",
    "options": ["IPSec","OpenVPN","WireGuard","GRE"],
    "answer": 2,
    "explain": "Tailscale 基于 WireGuard 协议实现零配置的 Mesh VPN 组网。"
  },
  {
    "q": "NAT 网关的主要作用是？",
    "level": "基础",
    "options": ["公网访问私网","私网实例访问公网","DNS 解析","负载均衡"],
    "answer": 1,
    "explain": "NAT 网关让私有子网的实例能够访问公网，同时阻止公网直接访问私网实例。"
  },
  {
    "q": "5G 核心网中，负责会话管理的是？",
    "level": "高级",
    "options": ["AMF","SMF","UPF","PCF"],
    "answer": 1,
    "explain": "SMF（Session Management Function）负责会话管理、IP 地址分配、UPF 选择。"
  },
  {
    "q": "QUIC 内置的加密协议是？",
    "level": "进阶",
    "options": ["TLS 1.2","TLS 1.3","DTLS","IPSec"],
    "answer": 1,
    "explain": "QUIC 内置 TLS 1.3，握手与连接建立合并，实现 0-RTT 或 1-RTT。"
  },
  {
    "q": "零信任中的微隔离（Micro-segmentation）主要控制？",
    "level": "高级",
    "options": ["南北向流量","东西向流量","外部流量","DNS 流量"],
    "answer": 1,
    "explain": "微隔离主要控制数据中心内部的东西向流量，防止攻击横向移动。"
  },
  {
    "q": "Cilium 作为 K8s CNI，其核心数据平面基于？",
    "level": "高级",
    "options": ["iptables","IPVS","eBPF","OVS"],
    "answer": 2,
    "explain": "Cilium 基于 eBPF 实现高性能的网络、安全和可观测性。"
  },
  {
    "q": "VPC 对等连接（Peering）的主要用途是？",
    "level": "进阶",
    "options": ["公网访问","跨 VPC 私有通信","NAT 转换","DNS 转发"],
    "answer": 1,
    "explain": "VPC Peering 实现两个 VPC 之间的私有网络互通，流量不经过公网。"
  },
  {
    "q": "XDP 程序可以执行的动作不包括？",
    "level": "高级",
    "options": ["XDP_PASS","XDP_DROP","XDP_TX","XDP_PROXY"],
    "answer": 3,
    "explain": "标准 XDP 动作包括 PASS（上送内核）、DROP（丢弃）、TX（从同一网卡发出）、REDIRECT（重定向到其他网卡/CPU），没有 XDP_PROXY。"
  },
  {
    "q": "SASE 将网络和安全融合为？",
    "level": "高级",
    "options": ["硬件盒子","本地化部署","云服务","虚拟机镜像"],
    "answer": 2,
    "explain": "SASE 将 SD-WAN 和安全功能（SWG、CASB、ZTNA、FWaaS）融合为统一的云服务交付。"
  },
  {
    "q": "5G MEC（多接入边缘计算）的主要价值是？",
    "level": "高级",
    "options": ["降低核心网负载","降低端到端延迟","提高带宽","替代云计算"],
    "answer": 1,
    "explain": "MEC 将计算和存储下沉到网络边缘，显著降低端到端延迟，适合实时应用。"
  },
  {
    "q": "WireGuard 的配置文件通常存放在？",
    "level": "基础",
    "options": ["/etc/openvpn/","/etc/wireguard/","/etc/ipsec/","/etc/ssl/"],
    "answer": 1,
    "explain": "WireGuard 配置文件通常位于 /etc/wireguard/<interface>.conf，通过 wg-quick 管理。"
  },
  {
    "q": "以下哪个不是 5G 网络切片的类型？",
    "level": "高级",
    "options": ["eMBB","uRLLC","mMTC","VoIP"],
    "answer": 3,
    "explain": "5G 标准定义了 eMBB、uRLLC、mMTC 三类切片场景，VoIP 不是网络切片类型。"
  }
]
