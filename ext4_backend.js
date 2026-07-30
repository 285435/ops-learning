// === BACKEND EXT4 ===
backend_ext4_topics: [
  {
    "id": "backend-microservices",
    "title": "微服务架构设计模式",
    "level": "高级",
    "content": "**微服务核心特征**\n- 单一职责：每个服务聚焦一个业务能力\n- 独立部署：服务间松耦合\n- 分布式数据：每个服务拥有自己的数据库\n- 去中心化治理：技术栈异构\n\n**设计模式**\n\n1. **API 网关**\n   - 统一入口：路由、认证、限流、熔断\n   - Kong、APISIX、Envoy、Spring Cloud Gateway\n\n2. **服务发现**\n   - 客户端发现：Eureka + Ribbon\n   - 服务端发现：Consul + Nginx/Envoy\n   - K8s DNS + Service\n\n3. **配置中心**\n   - Spring Cloud Config、Nacos、Apollo\n   - 配置热更新、版本管理、灰度发布\n\n4. **熔断与限流**\n   - 熔断：Hystrix/Resilience4j/Sentinel\n   - 限流：令牌桶、漏桶、分布式限流\n\n5. ** Saga 分布式事务**\n   - 编排式（Choreography）：事件驱动\n   - 协调式（Orchestration）：中央协调器\n   - 补偿事务处理一致性\n\n6. **CQRS 与事件溯源**\n   - 命令与查询分离\n   - Event Sourcing：状态由事件流重建",
    "example": "# 微服务架构示例\n\n# 1. API Gateway（Kong）配置\n# curl -X POST http://localhost:8001/services \\\n#   --data name=order-service \\\n#   --data url=http://order:8080\n# curl -X POST http://localhost:8001/services/order-service/routes \\\n#   --data 'paths[]=/orders'\n\n# 2. 服务注册（Consul）\n# service.json\n# {\n#   \"service\": {\n#     \"name\": \"payment\",\n#     \"tags\": [\"v1\"],\n#     \"port\": 8080,\n#     \"check\": {\"http\": \"http://localhost:8080/health\", \"interval\": \"10s\"}\n#   }\n# }\n\n# 3. Resilience4j 熔断（Java）\n# CircuitBreakerConfig config = CircuitBreakerConfig.custom()\n#   .failureRateThreshold(50)\n#   .waitDurationInOpenState(Duration.ofMillis(1000))\n#   .build();\n\n# 4. Saga 编排（Temporal/Camunda）\n# 定义工作流：创建订单 -> 扣减库存 -> 支付 -> 发货\n# 每一步失败执行补偿：退款 -> 恢复库存 -> 取消订单\n\n# 5. 事件总线（Kafka）\n# 订单服务发布 OrderCreated 事件\n# 库存服务订阅并处理\n# 支付服务订阅并处理"
  },
  {
    "id": "backend-service-mesh",
    "title": "服务网格 Istio 与 Envoy",
    "level": "高级",
    "content": "**服务网格（Service Mesh）**\n- 基础设施层，处理服务间通信\n- Sidecar 代理：与应用容器同 Pod 运行\n- 流量管理、安全、可观测性下沉到平台\n\n**Istio 架构**\n\n1. **数据平面**\n   - Envoy Proxy：Sidecar，L4/L7 代理\n   - 拦截所有入站/出站流量\n   - mTLS、负载均衡、熔断、重试\n\n2. **控制平面**\n   - istiod：Pilot（配置分发）+ Citadel（证书）+ Galley（配置验证）\n   - 通过 xDS API 向 Envoy 推送配置\n\n**核心能力**\n\n1. **流量管理**\n   - VirtualService：路由规则（权重、Header、重试）\n   - DestinationRule：负载均衡、连接池、异常检测\n   - Gateway：边缘入口\n\n2. **安全**\n   - 自动 mTLS（双向 TLS）\n   - AuthorizationPolicy：L4/L7 访问控制\n   - PeerAuthentication：加密策略\n\n3. **可观测性**\n   - 自动指标（Prometheus）\n   - 分布式追踪（Jaeger/Zipkin）\n   - 访问日志\n\n**替代方案**\n- Linkerd：更轻量，Rust 编写\n- Cilium Service Mesh：eBPF 加速，无 Sidecar",
    "example": "# Istio 配置示例\n\n# 1. 流量拆分（金丝雀）\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: reviews\nspec:\n  hosts:\n  - reviews\n  http:\n  - route:\n    - destination:\n        host: reviews\n        subset: v1\n      weight: 90\n    - destination:\n        host: reviews\n        subset: v2\n      weight: 10\n\n# 2. 自动 mTLS\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\nspec:\n  mtls:\n    mode: STRICT\n\n# 3. 访问控制\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: allow-frontend\nspec:\n  selector:\n    matchLabels:\n      app: api\n  action: ALLOW\n  rules:\n  - from:\n    - source:\n        principals: [\"cluster.local/ns/default/sa/frontend\"]\n\n# 4. 故障注入（混沌测试）\n# - fault:\n#     delay:\n#       percentage:\n#         value: 10.0\n#       fixedDelay: 5s\n\n# 5. 查看 Envoy 配置\nistioctl proxy-config cluster <pod>\nistioctl proxy-config route <pod>"
  },
  {
    "id": "backend-serverless",
    "title": "Serverless 与 FaaS 架构",
    "level": "高级",
    "content": "**Serverless 定义**\n- 无服务器：开发者不管理服务器\n- 自动扩缩容、按调用计费\n- 事件驱动，函数粒度\n\n**FaaS（Function as a Service）**\n- AWS Lambda、Azure Functions、Google Cloud Functions\n- 阿里云函数计算、腾讯云 SCF\n- Knative：K8s 原生 Serverless\n- OpenFaaS：开源 FaaS 平台\n\n**架构要点**\n\n1. **冷启动（Cold Start）**\n   - 首次调用需要初始化运行时\n   - 解决方案：Provisioned Concurrency、Keep-alive、精简运行时\n   - 自定义运行时（Custom Runtime）降低启动时间\n\n2. **状态管理**\n   - 函数无状态，状态外置\n   - DynamoDB / Redis / S3\n   - 临时磁盘（/tmp）有限\n\n3. **事件源**\n   - API Gateway、HTTP 触发\n   - 消息队列（SQS/Kafka/EventBridge）\n   - 对象存储事件（S3 上传）\n   - 定时触发（Cron）\n\n4. **限制与优化**\n   - 执行时长限制（通常 15 分钟）\n   - 内存/CPU 线性关系\n   - 打包体积优化（Layer、精简依赖）\n\n**Serverless 容器**\n- AWS Fargate、Azure Container Instances\n- 无需管理节点，按资源使用计费",
    "example": "# Serverless 实践\n\n# 1. AWS Lambda（Python）\n# lambda_function.py\ndef handler(event, context):\n    return {'statusCode': 200, 'body': 'Hello'}\n\n# 2. SAM / Serverless Framework 部署\n# template.yaml\n# Resources:\n#   HelloFunction:\n#     Type: AWS::Serverless::Function\n#     Properties:\n#       CodeUri: hello/\n#       Handler: app.handler\n#       Runtime: python3.11\n#       Events:\n#         HelloApi:\n#           Type: Api\n#           Properties:\n#             Path: /hello\n#             Method: get\n\n# 3. Knative Service\napiVersion: serving.knative.dev/v1\nkind: Service\nmetadata:\n  name: hello\nspec:\n  template:\n    spec:\n      containers:\n      - image: gcr.io/my/hello\n        env:\n        - name: TARGET\n          value: World\n\n# 4. 冷启动优化\n# - 使用 Lambda Power Tuning 找到最优内存配置\n# - 使用 Lambda Layers 共享依赖\n# - 使用 SnapStart（Java）预初始化\n\n# 5. OpenFaaS\n# faas-cli new --lang python hello\n# faas-cli up -f hello.yml"
  },
  {
    "id": "backend-event-driven",
    "title": "事件驱动架构与消息队列",
    "level": "高级",
    "content": "**事件驱动架构（EDA）**\n- 松耦合、可扩展、响应式\n- 生产者 -> 事件总线 -> 消费者\n- 事件溯源：状态由事件序列重建\n\n**消息队列选型**\n\n| 特性 | Kafka | RabbitMQ | RocketMQ | Pulsar |\n|------|-------|----------|----------|--------|\n| 吞吐量 | 极高 | 中 | 高 | 极高 |\n| 延迟 | ms | ms | ms | 极低 |\n| 持久化 | 磁盘日志 | 队列 | 磁盘 | 分层存储 |\n| 多租户 | 弱 | 中 | 强 | 强 |\n| 地理复制 | MirrorMaker | Shovel | 弱 | 原生 |\n| 流处理 | Kafka Streams | 无 | 无 | Pulsar Functions |\n| 协议 | 自有 | AMQP | 自有 | 自有 |\n\n**Kafka 深度**\n- Topic -> Partition -> Segment\n- ISR（In-Sync Replicas）：保证不丢消息\n- 消费者组：分区只能被组内一个消费者消费\n- Exactly-Once：幂等生产者 + 事务\n\n**云消息服务**\n- AWS SQS / SNS / EventBridge\n- Azure Service Bus / Event Grid\n- 阿里云 MNS / EventBridge",
    "example": "# Kafka 实践\n\n# 1. 创建 Topic\nkafka-topics.sh --create --topic orders --partitions 6 --replication-factor 3 --bootstrap-server kafka:9092\n\n# 2. 生产者\nfrom kafka import KafkaProducer\nproducer = KafkaProducer(bootstrap_servers='kafka:9092')\nproducer.send('orders', b'order-data', key=b'user-123')\n\n# 3. 消费者组\nfrom kafka import KafkaConsumer\nconsumer = KafkaConsumer('orders', group_id='payment-group', bootstrap_servers='kafka:9092')\nfor msg in consumer:\n    process(msg)\n\n# 4. 事务（Exactly-Once）\nproducer.init_transactions()\nproducer.begin_transaction()\nproducer.send('orders', ...)\nproducer.send('payments', ...)\nproducer.commit_transaction()\n\n# 5. 流处理（Kafka Streams / ksqlDB）\n# ksqlDB\nCREATE STREAM orders (id STRING, amount DOUBLE) WITH (kafka_topic='orders', value_format='json');\nCREATE TABLE hourly_sales AS\n  SELECT windowstart, SUM(amount) FROM orders\n  WINDOW TUMBLING (SIZE 1 HOUR)\n  GROUP BY windowstart;\n\n# 6. 死信队列（DLQ）\n# 消费失败 N 次后发送到 orders.dlq Topic\n# 人工或自动补偿处理"
  },
  {
    "id": "backend-api-gateway",
    "title": "API 网关与 BFF 模式",
    "level": "高级",
    "content": "**API 网关职责**\n- 统一入口：路由、版本管理\n- 横切关注点：认证、鉴权、限流、熔断\n- 协议转换：REST <-> gRPC <-> GraphQL\n- 缓存、日志、监控\n\n**主流网关**\n- Kong：OpenResty + Lua，插件丰富\n- Apache APISIX：国产，云原生，性能高\n- Envoy：C++，Service Mesh 数据面\n- Traefik：云原生，自动服务发现\n- Spring Cloud Gateway：Java 生态\n\n**BFF（Backend for Frontend）**\n- 为不同前端（Web/iOS/Android）定制 API\n- 聚合多个微服务数据\n- 减少前端请求次数\n- 处理前端特定逻辑（字段映射、格式化）\n\n**GraphQL BFF**\n- 前端灵活查询所需字段\n- 单一端点替代多个 REST API\n- Schema Stitching / Federation：多服务 Schema 合并\n\n**gRPC 网关**\n- 内部服务间 gRPC 通信\n- 对外暴露 REST/JSON（grpc-gateway）\n- Protobuf 定义统一契约",
    "example": "# API Gateway 配置\n\n# 1. Kong 路由+插件\ncurl -X POST http://localhost:8001/services \\\n  --data name=user-service \\\n  --data url=http://user:8080\n\ncurl -X POST http://localhost:8001/services/user-service/routes \\\n  --data 'paths[]=/api/users'\n\n# 添加限流插件\ncurl -X POST http://localhost:8001/services/user-service/plugins \\\n  --data name=rate-limiting \\\n  --data config.minute=100\n\n# 2. APISIX 路由\n# curl http://localhost:9180/apisix/admin/routes/1 \\\n#   -H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \\\n#   -X PUT -d '{\n#     \"uri\": \"/api/users/*\",\n#     \"upstream\": {\"type\": \"roundrobin\", \"nodes\": {\"user:8080\": 1}}\n#   }'\n\n# 3. GraphQL Schema\ntype Query {\n  user(id: ID!): User\n  orders(userId: ID!): [Order]\n}\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n}\n\n# 4. gRPC-gateway\n# api.proto\n# service UserService {\n#   rpc GetUser(GetUserRequest) returns (User) {\n#     option (google.api.http) = { get: \"/v1/users/{id}\" };\n#   }\n# }\n\n# 生成 REST 网关\n# protoc -I . --grpc-gateway_out . --grpc-gateway_opt logtostderr=true api.proto"
  },
  {
    "id": "backend-security-modern",
    "title": "现代后端安全实践",
    "level": "高级",
    "content": "**供应链安全**\n- 依赖漏洞：Log4j、xz 后门事件\n- SBOM（Software Bill of Materials）：软件物料清单\n- SLSA（Supply-chain Levels for Software Artifacts）\n- Sigstore：免费签名和验证（cosign）\n\n**认证与授权**\n- OAuth 2.1 / PKCE：授权码 + 挑战\n- OpenID Connect（OIDC）：身份层\n- JWT 安全：短有效期、刷新令牌、JWE 加密\n- mTLS：服务间双向认证\n\n**机密管理**\n- HashiCorp Vault：动态凭据、密钥轮转\n- AWS Secrets Manager / Azure Key Vault\n- 避免硬编码密钥（12-factor）\n\n**应用安全**\n- WAF（Web Application Firewall）：ModSecurity、Coraza\n- RASP（Runtime Application Self-Protection）\n- 输入验证、参数化查询、输出编码\n- 限速、防重放、防爆破\n\n**零信任后端**\n- 每个服务都需认证和授权\n- SPIFFE/SPIRE：工作负载身份\n- 短期凭据、自动轮换",
    "example": "# 现代后端安全实践\n\n# 1. Sigstore/cosign 签名镜像\ncosign generate-key-pair\ncosign sign --key cosign.key myregistry/myapp:v1.0\ncosign verify --key cosign.pub myregistry/myapp:v1.0\n\n# 2. SBOM 生成\nsyft packages myapp:latest -o spdx-json > sbom.spdx.json\n\n# 3. Vault 动态数据库凭据\nvault secrets enable database\nvault write database/config/my-mysql \\\n  plugin_name=mysql-rotate-root \\\n  connection_url=\"{{username}}:{{password}}@tcp(db:3306)/\" \\\n  allowed_roles=\"app\"\n\nvault read database/creds/app  # 获取临时 1h 有效凭据\n\n# 4. OAuth 2.1 + PKCE（SPA/移动应用）\n# 1. 生成 code_verifier + code_challenge\n# 2. /authorize?code_challenge=xxx&code_challenge_method=S256\n# 3. /token 交换时提交 code_verifier\n\n# 5. SPIFFE/SPIRE 工作负载身份\n# SPIRE Agent 为每个 Pod 发放 SVID（SPIFFE Verifiable Identity Document）\n# 服务间 mTLS 使用 SVID 自动认证\n\n# 6. 安全 Headers\n# X-Content-Type-Options: nosniff\n# X-Frame-Options: DENY\n# Content-Security-Policy: default-src 'self'\n# Strict-Transport-Security: max-age=31536000"
  }
],

backend_ext4_questions: [
  {
    "q": "Istio 的数据平面组件是？",
    "level": "高级",
    "options": ["istiod","Envoy","Pilot","Citadel"],
    "answer": 1,
    "explain": "Envoy 是 Istio 的数据平面代理（Sidecar），负责拦截和处理服务间流量。istiod 是控制平面。"
  },
  {
    "q": "Serverless 中的冷启动（Cold Start）指的是？",
    "level": "高级",
    "options": ["服务器关机","函数首次调用时的初始化延迟","代码编译","数据库连接"],
    "answer": 1,
    "explain": "冷启动指函数首次调用或长时间未用后再次调用时，需要初始化运行环境导致的延迟。"
  },
  {
    "q": "Kafka 中保证 Exactly-Once 语义需要？",
    "level": "高级",
    "options": ["仅幂等生产者","幂等生产者 + 事务 API","仅消费者手动提交","仅 acks=all"],
    "answer": 1,
    "explain": "Kafka Exactly-Once 需要幂等生产者（避免重复发送）和事务 API（跨分区原子提交）。"
  },
  {
    "q": "BFF（Backend for Frontend）模式的主要目的是？",
    "level": "高级",
    "options": ["统一数据库","为不同前端定制和聚合 API","负载均衡","缓存加速"],
    "answer": 1,
    "explain": "BFF 为 Web、iOS、Android 等不同前端提供定制化的 API 聚合层，减少前端复杂度。"
  },
  {
    "q": "Saga 分布式事务的补偿机制是？",
    "level": "高级",
    "options": ["锁机制","正向操作失败时执行反向补偿","两阶段提交","最终一致性等待"],
    "answer": 1,
    "explain": "Saga 模式通过为每个正向操作定义对应的补偿操作，在失败时按相反顺序执行补偿，达到最终一致。"
  },
  {
    "q": "APISIX 基于什么技术构建？",
    "level": "高级",
    "options": ["Java","OpenResty/Nginx + Lua","Go","Node.js"],
    "answer": 1,
    "explain": "Apache APISIX 基于 OpenResty/Nginx + Lua 构建，是国内主流的云原生 API 网关。"
  },
  {
    "q": "Knative 是？",
    "level": "高级",
    "options": ["容器编排","K8s 原生 Serverless 框架","服务网格","CI/CD 工具"],
    "answer": 1,
    "explain": "Knative 是 Kubernetes 上的 Serverless 框架，提供 Serving（自动扩缩容）和 Eventing（事件驱动）。"
  },
  {
    "q": "事件溯源（Event Sourcing）的核心思想是？",
    "level": "高级",
    "options": ["直接存储最终状态","存储状态变更事件，状态由事件流重建","使用缓存","双写数据库"],
    "answer": 1,
    "explain": "事件溯源不存储当前状态，而是存储所有变更事件，需要时通过重放事件重建状态。"
  },
  {
    "q": "SPIFFE 用于解决什么问题？",
    "level": "高级",
    "options": ["配置管理","工作负载身份标准化","日志收集","服务发现"],
    "answer": 1,
    "explain": "SPIFFE 是工作负载身份的标准化框架，解决微服务间安全认证的身份标识问题。"
  },
  {
    "q": "gRPC-gateway 的作用是？",
    "level": "高级",
    "options": ["替代 gRPC","将 gRPC 服务同时暴露为 REST API","服务网格","负载均衡"],
    "answer": 1,
    "explain": "gRPC-gateway 是 protoc 插件，根据 HTTP 注解从 gRPC 服务生成反向代理 REST API。"
  },
  {
    "q": "RabbitMQ 主要支持的协议是？",
    "level": "进阶",
    "options": ["Kafka 协议","AMQP","MQTT","HTTP"],
    "answer": 1,
    "explain": "RabbitMQ 核心支持 AMQP 0-9-1 协议，也支持 MQTT、STOMP 等。"
  },
  {
    "q": "以下哪个不是 API 网关的常见职责？",
    "level": "进阶",
    "options": ["路由","认证鉴权","业务逻辑处理","限流熔断"],
    "answer": 2,
    "explain": "业务逻辑处理应在后端服务中完成，网关负责横切关注点如路由、安全、流量控制。"
  },
  {
    "q": "Pulsar 相比 Kafka 的独特优势是？",
    "level": "高级",
    "options": ["更高吞吐","分层存储 + 多租户 + 地理复制","更低延迟","更简单"],
    "answer": 1,
    "explain": "Pulsar 提供分层存储（ offload 到 S3）、原生多租户、地理复制等 Kafka 不具备的特性。"
  },
  {
    "q": "SLSA 框架关注的是？",
    "level": "高级",
    "options": ["应用性能","软件供应链安全","服务级别协议","日志分析"],
    "answer": 1,
    "explain": "SLSA（Supply-chain Levels for Software Artifacts）是软件供应链安全框架，防止构建和分发过程中的篡改。"
  },
  {
    "q": "CQRS 模式将什么分离？",
    "level": "高级",
    "options": ["读和写","前端和后端","开发和运维","测试和生产"],
    "answer": 0,
    "explain": "CQRS（Command Query Responsibility Segregation）将读模型和写模型分离，可独立优化。"
  },
  {
    "q": "HashiCorp Vault 的动态凭据特性指？",
    "level": "高级",
    "options": ["固定密码","按需生成短期有效的数据库凭据","SSO 登录","API Key 管理"],
    "answer": 1,
    "explain": "Vault 可按需为应用生成短期有效的数据库凭据，并自动轮换，避免长期密码泄露风险。"
  },
  {
    "q": "Envoy 的 xDS API 不包括？",
    "level": "高级",
    "options": ["LDS（Listener）","RDS（Route）","CDS（Cluster）","BDS（Backend）"],
    "answer": 3,
    "explain": "Envoy xDS API 包括 LDS、RDS、CDS、EDS、SDS 等，没有 BDS。"
  },
  {
    "q": "OpenFaaS 是？",
    "level": "进阶",
    "options": ["商业 FaaS","开源 FaaS 平台","容器编排","服务网格"],
    "answer": 1,
    "explain": "OpenFaaS 是开源的 Function as a Service 平台，可在 K8s 或 Docker Swarm 上运行。"
  },
  {
    "q": "JWT 的 JWE 指的是？",
    "level": "高级",
    "options": ["JSON Web Encryption","JSON Web Endpoint","Java Web Engine","Joint Web Extension"],
    "answer": 0,
    "explain": "JWE = JSON Web Encryption，对 JWT payload 进行加密，防止敏感信息泄露。"
  },
  {
    "q": "Kong 网关的插件机制基于？",
    "level": "高级",
    "options": ["Go","Lua","Python","Java"],
    "answer": 1,
    "explain": "Kong 基于 OpenResty/Nginx，插件使用 Lua 编写，在请求生命周期各阶段执行。"
  },
  {
    "q": "Istio 的 AuthorizationPolicy 作用于？",
    "level": "高级",
    "options": ["L3/L4 网络层","L4/L7 网络层","仅 L7","物理层"],
    "answer": 1,
    "explain": "AuthorizationPolicy 可基于源身份、命名空间、IP、JWT 声明等执行 L4/L7 访问控制。"
  },
  {
    "q": "RocketMQ 最初由哪家公司开发？",
    "level": "高级",
    "options": ["腾讯","阿里巴巴","字节跳动","美团"],
    "answer": 1,
    "explain": "RocketMQ 最初由阿里巴巴开发，现为 Apache 顶级项目，捐赠给 Apache 基金会。"
  },
  {
    "q": "GraphQL Federation 用于？",
    "level": "高级",
    "options": ["单体应用","将多个服务的 Schema 组合为统一图","REST 转换","数据库分片"],
    "answer": 1,
    "explain": "Federation 允许将多个独立服务的 GraphQL Schema 组合为一个统一的超级图（Supergraph）。"
  },
  {
    "q": "以下哪个是服务网格的轻量级替代？",
    "level": "高级",
    "options": ["Istio","Linkerd","Kong","Nginx"],
    "answer": 1,
    "explain": "Linkerd 是更轻量的服务网格，Rust 编写，资源占用远低于 Istio，适合中小规模集群。"
  },
  {
    "q": "Serverless 容器的代表产品是？",
    "level": "进阶",
    "options": ["EC2","AWS Fargate","EKS","ECS"],
    "answer": 1,
    "explain": "AWS Fargate 是 Serverless 容器计算引擎，无需管理服务器节点，按容器资源使用计费。"
  },
  {
    "q": "Sigstore cosign 用于？",
    "level": "高级",
    "options": ["镜像扫描","容器镜像签名和验证","漏洞检测","SBOM 生成"],
    "answer": 1,
    "explain": "cosign 是 Sigstore 项目的工具，用于对容器镜像进行密钥less 或密钥签名和验证。"
  },
  {
    "q": "Kafka 消费者组中，一个分区可被几个消费者消费？",
    "level": "高级",
    "options": ["无限","组内一个","两个","与副本数相同"],
    "answer": 1,
    "explain": "Kafka 中一个分区在同一消费者组内只能被一个消费者消费，保证消息顺序和去重。"
  },
  {
    "q": "Temporal 在微服务中的定位是？",
    "level": "高级",
    "options": ["API 网关","持久化工作流编排","服务网格","消息队列"],
    "answer": 1,
    "explain": "Temporal（原 Cadence）是持久化工作流编排平台，用于管理 Saga、定时任务、长事务等复杂流程。"
  },
  {
    "q": "ModSecurity 是？",
    "level": "进阶",
    "options": ["WAF 引擎","负载均衡器","API 网关","入侵检测系统"],
    "answer": 0,
    "explain": "ModSecurity 是开源 WAF（Web Application Firewall）引擎，支持 OWASP CRS 规则集。"
  }
]
