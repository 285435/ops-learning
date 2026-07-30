// === SHELL EXT4 ===
shell_ext4_topics: [
  {
    "id": "shell-modern-cli",
    "title": "现代 CLI 工具链（fzf/bat/fd/ripgrep）",
    "level": "进阶",
    "content": "**现代 CLI 工具革命**\n- Rust/Go 重写传统 Unix 工具\n- 更快、更安全、更友好的输出\n\n**核心工具**\n\n1. **fzf（模糊查找器）**\n   - 交互式模糊匹配\n   - 与 Shell 历史、文件、进程深度集成\n   - Ctrl+R 历史搜索、Alt+C 目录跳转\n   - 预览窗口支持\n\n2. **ripgrep（rg）**\n   - 递归搜索代码\n   - 自动遵循 .gitignore\n   - 多线程、内存映射、极快\n\n3. **fd**\n   - find 的直观替代\n   - 默认忽略隐藏文件和 gitignore\n   - 彩色输出、并行执行\n\n4. **bat**\n   - cat 的语法高亮版\n   - Git 集成（显示修改标记）\n   - 自动分页\n\n5. **eza**\n   - ls 的现代替代\n   - 图标、Git 状态、树形视图\n\n6. **zoxide**\n   - cd 的智能替代\n   - 基于访问频率的目录跳转\n   - z foo 即可跳转到最常访问的 foo 目录",
    "example": "# fzf 实战\n# 1. 历史命令搜索（绑定 Ctrl+R）\n# eval \"$(fzf --bash)\"\n\n# 2. 文件查找并编辑\nvim $(fzf)\n\n# 3. 进程 kill\nkill $(ps aux | fzf | awk '{print $2}')\n\n# 4. 带预览的文件搜索\nfzf --preview 'bat --color=always {}'\n\n# 5. git branch 切换\ngit branch | fzf | xargs git checkout\n\n# zoxide\nz /var/log  # 跳转到 /var/log\nz log       # 模糊匹配跳转到最常访问的 log 目录\nzi          # 交互式选择目录\n\n# fd + bat 组合\nfd '.*\\.py$' | xargs bat --theme=Dracula\n\n# rg 高级用法\nrg 'class\\s+\\w+' -t py --stats  # Python 中搜索类定义\nrg -C 3 'TODO|FIXME'            # 上下文3行"
  },
  {
    "id": "shell-k8s-ops",
    "title": "Kubernetes 运维脚本实战",
    "level": "高级",
    "content": "**K8s Shell 运维场景**\n\n1. **Pod 诊断**\n   - kubectl get pods --all-namespaces -o wide\n   - kubectl describe pod / logs / events\n   - kubectl exec -it <pod> -- /bin/sh\n\n2. **批量操作**\n   - kubectl get pods -l app=frontend -o name | xargs kubectl delete\n   - 跨命名空间操作\n\n3. **资源清理**\n   - 清理 Evicted/Completed/Failed Pod\n   - 清理未使用的 ConfigMap/Secret\n   - 清理旧版本 ReplicaSet\n\n4. **监控与告警**\n   - kubectl top nodes/pods\n   - 自定义资源使用报表\n\n5. **调试技巧**\n   - 临时 debug 容器（kubectl debug）\n   - 网络诊断 Pod（nicolaka/netshoot）\n   - 复制问题 Pod（kubectl cp）\n\n**工具集成**\n- kubectx / kubens：快速切换集群/命名空间\n- stern：多 Pod 日志聚合\n- k9s：终端 UI 管理 K8s\n- helm：包管理",
    "example": "#!/bin/bash\n# K8s 运维脚本集\n\n# 1. 清理所有 Evicted Pod\nkubectl get pods --all-namespaces --field-selector=status.phase=Failed | grep Evicted | \\\n  awk '{print $2 \" --namespace=\" $1}' | xargs -L1 kubectl delete pod\n\n# 2. 查看 CrashLoopBackOff 原因\nkubectl get pods --all-namespaces | grep CrashLoopBackOff | \\\n  while read ns pod rest; do\n    echo \"=== $ns/$pod ===\"\n    kubectl logs -n $ns $pod --previous 2>/dev/null | tail -20\n  done\n\n# 3. 资源使用 Top 10 Pod\nkubectl top pods --all-namespaces --sort-by=cpu | head -11\n\n# 4. 查找没有资源限制的 Pod\nkubectl get pods --all-namespaces -o json | \\\n  jq '.items[] | select(.spec.containers[].resources.limits == null) | .metadata.name'\n\n# 5. 批量进入 Pod 执行命令\nkubectl get pods -l app=worker -o name | \\\n  xargs -I {} kubectl exec {} -- ps aux\n\n# 6. 网络诊断\nkubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash\n# 在容器内：tcpdump, ngrep, curl, iperf 等\n\n# 7. stern 聚合日志\nstern -l app=frontend --since 10m"
  },
  {
    "id": "shell-terraform-ansible",
    "title": "IaC 脚本：Terraform 与 Ansible",
    "level": "高级",
    "content": "**基础设施即代码（IaC）**\n- 用代码定义和管理基础设施\n- 版本控制、可复现、可审计\n\n**Terraform**\n- HashiCorp 出品，多云编排\n- HCL 声明式语言\n- 状态管理（terraform.tfstate）\n- 执行计划（plan）后应用（apply）\n- 模块化管理\n\n**Ansible**\n- RedHat 出品，无代理（SSH/PowerShell）\n- YAML 剧本（Playbook）\n- 幂等性：多次执行结果一致\n- 角色（Role）组织复用\n- 动态库存（Dynamic Inventory）\n\n**Terraform vs Ansible**\n- Terraform：资源编排（创建/销毁基础设施）\n- Ansible：配置管理（安装软件、配置文件）\n- 最佳实践：Terraform 创建资源 -> Ansible 配置应用\n\n**现代工具**\n- Pulumi：编程语言定义基础设施（TS/Python/Go）\n- CDKTF：Terraform 的 CDK\n- Crossplane：K8s 原生 IaC",
    "example": "# Terraform 快速示例\n# main.tf\n# provider \"aws\" {\n#   region = \"us-east-1\"\n# }\n# resource \"aws_instance\" \"web\" {\n#   ami           = \"ami-0c55b159cbfafe1f0\"\n#   instance_type = \"t3.micro\"\n#   tags = { Name = \"web-server\" }\n# }\n\nterraform init\nterraform plan\nterraform apply\nterraform destroy\n\n# Ansible Playbook\n# ---\n# - hosts: webservers\n#   become: yes\n#   tasks:\n#     - name: Install nginx\n#       apt: name=nginx state=present\n#     - name: Start nginx\n#       service: name=nginx state=started enabled=yes\n\nansible-playbook -i inventory.ini site.yml\n\n# Terraform + Ansible 组合\n# Terraform 输出 IP，Ansible 动态库存使用\nterraform output -json | jq -r '.web_ips.value[]' > inventory"
  },
  {
    "id": "shell-gitops",
    "title": "GitOps 与 CI/CD Shell 脚本",
    "level": "高级",
    "content": "**GitOps 理念**\n- 以 Git 为唯一可信源（Single Source of Truth）\n- 声明式基础设施和应用配置\n- 自动同步：Git 变更 -> 自动部署\n- 回滚 = Git revert\n\n**GitOps 工具**\n\n1. **ArgoCD**\n   - K8s 原生 GitOps\n   - 自动/手动同步\n   - 多集群管理\n   - 支持 Helm/Kustomize/Jsonnet\n\n2. **Flux**\n   - CNCF 毕业项目\n   - 控制器模式\n   - 与 GitHub/GitLab 深度集成\n\n3. **Tekton / Jenkins / GitHub Actions**\n   - CI 流水线\n   - 构建镜像 -> 推送 -> 更新 Git 配置\n\n**CI/CD 脚本实践**\n- 语义化版本自动打 tag\n- 镜像构建多阶段、多架构\n- 变更检测：只部署修改的服务\n- 蓝绿/金丝雀发布脚本\n- 健康检查与自动回滚",
    "example": "#!/bin/bash\n# GitOps 部署脚本示例\n\n# 1. 更新镜像 tag 并提交\nAPP=$1\nVERSION=$2\n\nsed -i \"s|image: ${APP}:.*|image: ${APP}:${VERSION}|g\" k8s/${APP}/deployment.yaml\ngit add k8s/${APP}/deployment.yaml\ngit commit -m \"deploy(${APP}): bump to ${VERSION}\"\ngit push origin main\n\n# 2. ArgoCD 同步（手动触发）\nargocd app sync ${APP}\nargocd app wait ${APP} --health\n\n# 3. CI 中的镜像构建\ndocker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  -t registry/${APP}:${VERSION} \\\n  --push .\n\n# 4. 金丝雀发布（使用 Flagger）\nkubectl apply -f canary.yaml\n# Flagger 自动分析 Prometheus 指标，渐进式切换流量\n\n# 5. 自动回滚脚本\n#!/bin/bash\nfor i in {1..10}; do\n  http_code=$(curl -s -o /dev/null -w \"%{http_code}\" http://app/health)\n  if [ \"$http_code\" != \"200\" ]; then\n    echo \"Health check failed, rolling back...\"\n    git revert HEAD --no-edit\n    git push\n    exit 1\n  fi\n  sleep 5\ndone"
  },
  {
    "id": "shell-container-ops",
    "title": "容器与容器运行时脚本",
    "level": "高级",
    "content": "**容器运行时演进**\n- Docker -> containerd -> 各种 OCI 运行时\n- runc：标准 OCI 运行时\n- crun：C 编写，更快启动\n- gVisor：用户态内核，额外隔离\n- Kata Containers：轻量 VM，强隔离\n- Firecracker：AWS 开源 microVM\n\n**containerd 操作**\n- ctr：containerd 原始 CLI（调试用）\n- nerdctl：Docker 兼容 CLI for containerd\n- crictl：CRI 工具（K8s 调试）\n\n**Podman**\n- Daemonless（无守护进程）\n- Rootless（无 root 运行容器）\n- Docker CLI 兼容\n- Systemd 集成（podman generate systemd）\n\n**镜像优化**\n- 多阶段构建\n- distroless / scratch 基础镜像\n- 镜像层缓存优化\n- BuildKit 高级特性\n- 镜像安全扫描（Trivy、Snyk）",
    "example": "# 容器运维脚本\n\n# 1. nerdctl（containerd 的 docker 兼容工具）\nnerdctl run -d --name nginx -p 80:80 nginx\nnerdctl ps\nnerdctl exec -it nginx sh\n\n# 2. Podman rootless\npodman run -d --name web --userns=keep-id -p 8080:80 nginx\npodman generate systemd --new --name web > ~/.config/systemd/user/web.service\nsystemctl --user enable --now web\n\n# 3. 清理 dangling 镜像\ndocker image prune -f\nnerdctl image prune -f\n\n# 4. 批量导出镜像\ndocker images --format '{{.Repository}}:{{.Tag}}' | grep myapp | \\\n  while read img; do docker save $img > $(echo $img | tr '/:' '_').tar; done\n\n# 5. 镜像安全扫描\ntrivy image nginx:latest\n\n# 6. BuildKit 多平台构建\ndocker buildx create --use --name multi\ndocker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest --push .\n\n# 7. crictl 调试 K8s\ncrictl ps\ncrictl pods\ncrictl logs <container-id>\ncrictl exec -it <container-id> /bin/sh"
  },
  {
    "id": "shell-terminal-modern",
    "title": "现代终端与 Shell 环境",
    "level": "进阶",
    "content": "**现代终端工具**\n\n1. **Zellij / tmux**\n   - 终端复用器：分屏、会话持久化\n   - Zellij：Rust 编写，插件系统，布局配置\n   - tmux：经典，高度可定制\n\n2. **Starship**\n   - 跨 Shell 极简提示符\n   - 显示 Git 分支、语言版本、执行时间\n   - 配置简单，速度快\n\n3. **Warp / Fig**\n   - 现代终端 IDE\n   - AI 辅助命令补全\n   - 块编辑、协作功能\n\n4. **Direnv**\n   - 进入目录自动加载环境变量\n   - .envrc 文件管理项目环境\n   - 离开目录自动卸载\n\n5. **Mise（原 rtx）**\n   - 多语言版本管理器（替代 asdf）\n   - 项目级 .tool-versions\n   - 自动安装和切换\n\n6. **Atuin**\n   - Shell 历史同步和搜索\n   - 云端/自托管同步\n   - 智能补全\n\n**Shell 选择**\n- Bash：默认兼容\n- Zsh + Oh My Zsh：丰富插件\n- Fish：开箱即用，语法不同\n- Nushell：结构化数据",
    "example": "# 现代终端配置\n\n# Zellij 布局\n# layout.kdl\n# layout {\n#     pane split_direction=\"vertical\" {\n#         pane\n#         pane split_direction=\"horizontal\" {\n#             pane\n#             pane\n#         }\n#     }\n# }\n\n# Starship 配置 ~/.config/starship.toml\n# [directory]\n# truncation_length = 3\n# [git_branch]\n# symbol = \"\\ue0a0 \"\n\n# Direnv\n# cd /project && direnv allow\n# .envrc:\n# export AWS_PROFILE=dev\n# export DATABASE_URL=postgres://localhost/dev\n# layout python\n\n# Mise\n# echo 'nodejs 20' > .tool-versions\n# mise install\n# node -v  # 20.x\n\n# Atuin\neval \"$(atuin init bash)\"\n# Ctrl+R 调出 Atuin 历史搜索界面\n\n# Tmux 会话管理\ntmux new -s work\ntmux attach -t work\ntmux split-window -h\ntmux list-sessions"
  }
],

shell_ext4_questions: [
  {
    "q": "fzf 的主要功能是？",
    "level": "进阶",
    "options": ["文件搜索","模糊查找器/交互式过滤","进程管理","网络诊断"],
    "answer": 1,
    "explain": "fzf 是通用交互式模糊查找器，可与历史命令、文件、进程等集成。"
  },
  {
    "q": "kubectl debug 的作用是？",
    "level": "高级",
    "options": ["删除 Pod","在 Pod 中启动临时调试容器","查看日志","缩放副本"],
    "answer": 1,
    "explain": "kubectl debug 用于在目标 Pod 中启动临时 debug 容器（ephemeral container），便于排查问题。"
  },
  {
    "q": "Terraform 的核心工作流是？",
    "level": "高级",
    "options": ["write -> plan -> apply","build -> test -> deploy","init -> run -> destroy","compile -> link -> execute"],
    "answer": 0,
    "explain": "Terraform 标准工作流：编写配置 -> plan（预览变更）-> apply（应用变更）。"
  },
  {
    "q": "GitOps 的核心理念是？",
    "level": "高级",
    "options": ["手动部署","Git 为唯一可信源，自动同步","瀑布式开发","无版本控制"],
    "answer": 1,
    "explain": "GitOps 将 Git 仓库作为基础设施和应用的单一可信源，变更自动同步到目标环境。"
  },
  {
    "q": "Podman 相比 Docker 的主要优势是？",
    "level": "进阶",
    "options": ["更快的镜像拉取","Daemonless 和 Rootless","更多的镜像","更好的 GUI"],
    "answer": 1,
    "explain": "Podman 无需守护进程（daemonless），支持无 root 运行容器（rootless），更安全。"
  },
  {
    "q": "zoxide 是 cd 的替代品，其特点是？",
    "level": "进阶",
    "options": ["更快","基于访问频率的智能目录跳转","支持网络路径","内置编辑器"],
    "answer": 1,
    "explain": "zoxide 学习目录访问习惯，通过 z <name> 模糊跳转到最常访问的匹配目录。"
  },
  {
    "q": "Ansible Playbook 使用什么格式？",
    "level": "进阶",
    "options": ["JSON","YAML","XML","TOML"],
    "answer": 1,
    "explain": "Ansible Playbook 使用 YAML 格式定义任务列表，具有幂等性。"
  },
  {
    "q": "ArgoCD 属于哪类工具？",
    "level": "高级",
    "options": ["CI 工具","K8s GitOps 持续交付","监控工具","日志工具"],
    "answer": 1,
    "explain": "ArgoCD 是 Kubernetes 原生的 GitOps 持续交付工具，自动将 Git 仓库状态同步到集群。"
  },
  {
    "q": "nerdctl 是 containerd 的什么工具？",
    "level": "进阶",
    "options": ["监控工具","Docker 兼容 CLI","网络插件","存储驱动"],
    "answer": 1,
    "explain": "nerdctl 是 containerd 的 Docker 兼容 CLI，提供类似 docker 的命令体验。"
  },
  {
    "q": "Starship 是什么类型的工具？",
    "level": "基础",
    "options": ["终端复用器","跨 Shell 提示符","Shell 本身","包管理器"],
    "answer": 1,
    "explain": "Starship 是跨 Shell 的极简提示符，显示 Git 状态、语言版本、执行时间等信息。"
  },
  {
    "q": "BuildKit 的多平台构建需要？",
    "level": "高级",
    "options": ["多个物理机","buildx + QEMU/binfmt","虚拟机","容器编排"],
    "answer": 1,
    "explain": "docker buildx 结合 QEMU 用户态模拟（binfmt_misc）可实现单机多架构镜像构建。"
  },
  {
    "q": "direnv 的主要功能是？",
    "level": "进阶",
    "options": ["环境变量加密","进入目录自动加载/离开卸载环境变量","进程隔离","网络代理"],
    "answer": 1,
    "explain": "direnv 在进入目录时自动加载 .envrc 中的环境变量，离开目录时自动卸载。"
  },
  {
    "q": "Kata Containers 提供什么级别的隔离？",
    "level": "高级",
    "options": ["进程级","轻量虚拟机级","物理机级","命名空间级"],
    "answer": 1,
    "explain": "Kata Containers 为每个容器启动一个轻量级 VM，提供接近虚拟机的强隔离，同时保持容器体验。"
  },
  {
    "q": "以下哪个不是容器运行时？",
    "level": "进阶",
    "options": ["runc","containerd","crun","systemd"],
    "answer": 3,
    "explain": "systemd 是初始化系统，不是容器运行时。runc、containerd、crun 都是容器运行时生态组件。"
  },
  {
    "q": "Pulumi 与传统 IaC 工具的主要区别是？",
    "level": "高级",
    "options": ["免费","使用编程语言（TS/Python/Go）定义基础设施","只支持 AWS","不需要状态文件"],
    "answer": 1,
    "explain": "Pulumi 允许使用 TypeScript、Python、Go 等通用编程语言定义基础设施，而非专用 DSL。"
  },
  {
    "q": "Flux 是哪个组织的项目？",
    "level": "进阶",
    "options": ["CNCF","Apache","Linux Foundation","OpenStack"],
    "answer": 0,
    "explain": "Flux 是 CNCF 毕业项目，Kubernetes 原生的 GitOps 实现。"
  },
  {
    "q": "Trivy 的主要用途是？",
    "level": "进阶",
    "options": ["性能测试","容器镜像安全扫描","网络抓包","日志分析"],
    "answer": 1,
    "explain": "Trivy 是 Aqua Security 开源的漏洞扫描器，可扫描容器镜像、文件系统、Git 仓库等。"
  },
  {
    "q": "tmux 的主要功能是？",
    "level": "基础",
    "options": ["文本编辑","终端复用（分屏、会话持久化）","文件传输","远程登录"],
    "answer": 1,
    "explain": "tmux 是终端复用器，支持分屏、会话持久化（断开连接后程序继续运行）。"
  },
  {
    "q": "crictl 主要用于调试？",
    "level": "进阶",
    "options": ["Docker","containerd/CRI","Podman","systemd"],
    "answer": 1,
    "explain": "crictl 是 CRI（Container Runtime Interface）工具，主要用于 Kubernetes 的 containerd 调试。"
  },
  {
    "q": "Flagger 在 GitOps 中用于实现？",
    "level": "高级",
    "options": ["镜像构建","金丝雀发布","日志收集","密钥管理"],
    "answer": 1,
    "explain": "Flagger 是渐进式交付工具，在 GitOps 流程中实现金丝雀、A/B 测试、蓝绿发布。"
  },
  {
    "q": "Mise（原 rtx）是？",
    "level": "进阶",
    "options": ["容器运行时","多语言版本管理器","IDE","云服务商"],
    "answer": 1,
    "explain": "Mise 是多语言版本管理器（asdf 的 Rust 重写替代品），管理 Node、Python、Go 等版本。"
  },
  {
    "q": "Podman 的 podman generate systemd 用于？",
    "level": "高级",
    "options": ["生成容器镜像","生成 systemd 服务文件管理容器","生成 Compose 文件","生成 Kubernetes YAML"],
    "answer": 1,
    "explain": "podman generate systemd 可为容器生成 systemd 单元文件，实现开机自启和 systemd 管理。"
  },
  {
    "q": "以下哪个不是 Rust 重写的现代 CLI 工具？",
    "level": "进阶",
    "options": ["ripgrep","fd","htop","bat"],
    "answer": 2,
    "explain": "htop 是 C 语言编写的（经典 top 替代品），ripgrep、fd、bat 都是 Rust 重写的现代工具。"
  },
  {
    "q": "Atuin 的主要功能是？",
    "level": "进阶",
    "options": ["进程监控","Shell 历史同步和搜索","网络测速","磁盘清理"],
    "answer": 1,
    "explain": "Atuin 替换默认 Shell 历史，提供加密同步、模糊搜索、统计等增强功能。"
  },
  {
    "q": "Firecracker 是 AWS 开源的？",
    "level": "高级",
    "options": ["容器运行时","MicroVM 虚拟化","网络插件","存储系统"],
    "answer": 1,
    "explain": "Firecracker 是 AWS 开源的 microVM 虚拟化技术，用于 Lambda 和 Fargate，启动极快。"
  },
  {
    "q": "Terraform 状态文件默认名称是？",
    "level": "进阶",
    "options": ["terraform.tfstate","state.json","main.state","infra.lock"],
    "answer": 0,
    "explain": "Terraform 默认将状态保存在 terraform.tfstate 文件中，远程状态需配置 backend。"
  },
  {
    "q": "Ansible 的幂等性（Idempotence）是指？",
    "level": "高级",
    "options": ["只执行一次","多次执行结果一致","自动回滚","并发执行"],
    "answer": 1,
    "explain": "幂等性意味着无论执行多少次，系统最终状态相同，Ansible 模块设计遵循此原则。"
  },
  {
    "q": "gVisor 的运行时安全模型是？",
    "level": "高级",
    "options": ["共享内核","用户态内核拦截系统调用","硬件虚拟化","纯容器"],
    "answer": 1,
    "explain": "gVisor 使用用户态内核（Sentry）拦截并重实现大部分系统调用，提供额外隔离层。"
  },
  {
    "q": "Zellij 相比 tmux 的主要特色是？",
    "level": "进阶",
    "options": ["更快","Rust 编写、插件系统、布局配置","无需配置","支持图形"],
    "answer": 1,
    "explain": "Zellij 是 Rust 编写的现代终端复用器，支持插件系统（WASM）、声明式布局配置。"
  },
  {
    "q": "以下哪个命令用于查看 K8s 节点资源使用？",
    "level": "基础",
    "options": ["kubectl get nodes","kubectl top nodes","kubectl describe nodes","kubectl logs nodes"],
    "answer": 1,
    "explain": "kubectl top nodes 显示节点的 CPU 和内存使用情况（需要 metrics-server）。"
  }
]
