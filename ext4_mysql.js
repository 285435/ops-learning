// === MYSQL EXT4 ===
mysql_ext4_topics: [
  {
    "id": "mysql-cloud-rds",
    "title": "云数据库 RDS 与托管服务",
    "level": "高级",
    "content": "**云数据库概述**\n- AWS RDS / Aurora、Azure Database、阿里云 RDS、腾讯云 CDB\n- 托管服务：自动备份、监控、补丁、高可用\n- 与自建数据库的对比\n\n**核心特性**\n\n1. **高可用架构**\n   - 主从自动切换（Multi-AZ）\n   - 跨可用区/跨地域容灾\n   - 读写分离（Proxy/中间件）\n\n2. **自动运维**\n   - 自动备份（时间点恢复 PITR）\n   - 自动补丁升级（小版本）\n   - 性能洞察（Performance Insights）\n   - 慢查询自动分析\n\n3. **扩展能力**\n   - 垂直扩展（升降配）\n   - 只读副本（Read Replica）\n   - 分片扩展（Aurora Limitless、PolarDB-X）\n\n4. **安全**\n   - IAM/角色集成\n   - SSL/TLS 强制\n   - 透明数据加密（TDE）\n   - 私有网络/VPC 隔离\n\n**Serverless 数据库**\n- Aurora Serverless / Azure SQL Serverless\n- 自动扩缩容、按使用量计费\n- 适合波动负载、开发测试环境",
    "example": "# AWS RDS 操作\n\n# 1. 创建 MySQL 实例\naws rds create-db-instance \\\n  --db-instance-identifier mydb \\\n  --db-instance-class db.t3.micro \\\n  --engine mysql \\\n  --master-username admin \\\n  --master-user-password secret123 \\\n  --allocated-storage 20 \\\n  --availability-zone us-east-1a\n\n# 2. 创建只读副本\naws rds create-db-instance-read-replica \\\n  --db-instance-identifier mydb-replica \\\n  --source-db-instance-identifier mydb\n\n# 3. 查看性能洞察\naws rds describe-db-instances --db-instance-identifier mydb\n\n# 4. 自动备份保留期\naws rds modify-db-instance \\\n  --db-instance-identifier mydb \\\n  --backup-retention-period 7 \\\n  --apply-immediately\n\n# 阿里云 RDS\n# aliyun rds DescribeDBInstances\n# aliyun rds CreateDBInstance\n\n# Terraform\n# resource \"aws_db_instance\" \"default\" {\n#   identifier           = \"mydb\"\n#   engine               = \"mysql\"\n#   instance_class       = \"db.t3.micro\"\n#   allocated_storage    = 20\n#   username             = \"admin\"\n#   password             = var.db_password\n#   skip_final_snapshot  = true\n# }"
  },
  {
    "id": "mysql-proxysql",
    "title": "ProxySQL 与数据库中间件",
    "level": "高级",
    "content": "**数据库中间件作用**\n- 读写分离\n- 连接池管理\n- SQL 路由和防火墙\n- 查询缓存\n- 故障转移\n\n**ProxySQL**\n- 高性能 MySQL 代理\n- 规则引擎：基于用户、schema、查询模式的流量路由\n- 连接复用（multiplexing）：减少后端连接数\n- 查询缓存（结果集缓存）\n- 自动故障检测和切换\n\n**MySQL Router**\n- MySQL 官方中间件\n- 集成 InnoDB Cluster\n- 元数据驱动路由\n- 读写分离、负载均衡\n\n**其他中间件**\n- MaxScale（MariaDB）\n- MyCAT / ShardingSphere-Proxy（分库分表）\n- Vitess（YouTube 开源，K8s 原生）\n\n**对比**\n| 特性 | ProxySQL | MySQL Router | ShardingSphere |\n|------|----------|--------------|----------------|\n| 读写分离 | 强 | 中 | 强 |\n| 分库分表 | 无 | 无 | 强 |\n| 查询缓存 | 有 | 无 | 有 |\n| 连接池 | 强 | 弱 | 中 |\n| K8s 友好 | 中 | 中 | 强 |",
    "example": "# ProxySQL 配置\n\n# 1. 后端服务器\nINSERT INTO mysql_servers(hostgroup_id, hostname, port) \\\n  VALUES (1, 'master.db', 3306), (2, 'slave1.db', 3306), (2, 'slave2.db', 3306);\nLOAD MYSQL SERVERS TO RUNTIME;\nSAVE MYSQL SERVERS TO DISK;\n\n# 2. 用户配置\nINSERT INTO mysql_users(username, password, default_hostgroup) \\\n  VALUES ('app_user', 'pass', 1);\nLOAD MYSQL USERS TO RUNTIME;\n\n# 3. 读写分离规则\nINSERT INTO mysql_query_rules (rule_id, active, match_pattern, destination_hostgroup, apply) \\\n  VALUES (1, 1, '^SELECT.*FOR UPDATE', 1, 1);\nINSERT INTO mysql_query_rules (rule_id, active, match_pattern, destination_hostgroup, apply) \\\n  VALUES (2, 1, '^SELECT', 2, 1);\nLOAD MYSQL QUERY RULES TO RUNTIME;\n\n# 4. 连接池监控\nSHOW STATS MYSQL CONNECTION_POOL;\nSHOW MYSQL STATUS;\n\n# 5. 查询缓存\nUPDATE mysql_query_rules SET cache_ttl=1000 WHERE rule_id=2;\n\n# MySQL Router\nmysqlrouter --bootstrap root@master:3306 --directory=/etc/mysqlrouter\nmysqlrouter --config /etc/mysqlrouter/mysqlrouter.conf"
  },
  {
    "id": "mysql-heat-cold",
    "title": "MySQL 冷热分离与归档策略",
    "level": "高级",
    "content": "**数据生命周期管理**\n- 热数据：频繁访问，SSD/内存数据库\n- 温数据：偶尔访问，普通磁盘\n- 冷数据：极少访问，对象存储/归档\n\n**冷热分离方案**\n\n1. **应用层双写**\n   - 写入时同时写热库和冷库\n   - 读取优先热库，未命中查冷库\n   - 逻辑复杂，一致性难保证\n\n2. **中间件路由**\n   - 根据时间戳/条件自动路由\n   - ShardingSphere、MyCAT 支持\n\n3. **分区表 + 表空间管理**\n   - 按时间分区\n   - 旧分区导出到慢存储\n   - 或 DROP PARTITION 归档\n\n4. ** Canal / Debezium 同步**\n   - 实时捕获 binlog\n   - 同步到 ClickHouse / HBase / OSS\n   - 热库删除，冷库保留\n\n**归档策略**\n- 逻辑归档：mysqldump / mydumper 导出\n- 物理归档：xtrabackup 备份旧分区\n- 归档到对象存储：S3 / OSS / MinIO\n- 使用 pt-archiver 低影响归档\n\n**压缩与列存**\n- InnoDB 透明页压缩\n- MyRocks（RocksDB 引擎）：高压缩比\n- 归档到 ClickHouse / Doris（列式分析）",
    "example": "# 冷热分离实践\n\n# 1. 时间分区表\nCREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  created_at DATETIME,\n  data JSON,\n  KEY idx_created (created_at)\n) PARTITION BY RANGE (YEAR(created_at)) (\n  PARTITION p2022 VALUES LESS THAN (2023),\n  PARTITION p2023 VALUES LESS THAN (2024),\n  PARTITION p2024 VALUES LESS THAN (2025)\n);\n\n# 2. 导出旧分区（归档）\nALTER TABLE orders EXCHANGE PARTITION p2022 WITH TABLE orders_2022_archive;\nmysqldump mydb orders_2022_archive > orders_2022.sql\n# 上传至 OSS/S3\naws s3 cp orders_2022.sql s3://backup-bucket/\n\n# 3. pt-archiver 低影响归档\npt-archiver \\\n  --source h=hot-db,D=mydb,t=orders \\\n  --dest h=cold-db,D=archive,t=orders \\\n  --where \"created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)\" \\\n  --limit 1000 \\\n  --commit-each \\\n  --no-delete\n\n# 4. 中间件路由配置（ShardingSphere）\n# 按 created_at 月份路由到不同数据源\n# 近3个月 -> 热库，历史 -> 冷库"
  },
  {
    "id": "mysql-vector",
    "title": "MySQL 向量扩展与 AI 应用",
    "level": "高级",
    "content": "**向量数据库背景**\n- AI 大模型时代，向量检索成为核心能力\n- 文本/图像/音频 embedding 为高维向量\n- 相似度检索：余弦相似度、欧氏距离、内积\n\n**MySQL 向量方案**\n\n1. **pgvector（PostgreSQL）**\n   - 业界最成熟的开源向量扩展\n   - 但非 MySQL 生态\n\n2. **MySQL 向量功能（MySQL 9.0 预览）**\n   - VECTOR 数据类型\n   - 向量距离函数\n   - 预计 9.x 正式版完善\n\n3. **MySQL + 专用向量引擎**\n   - MyScale：基于 ClickHouse + MySQL 协议\n   - TiDB Vector：TiDB 的向量索引\n   - 通过 Federated 引擎连接专用向量库\n\n4. **应用层方案**\n   - MySQL 存储元数据\n   - Milvus / Pinecone / Weaviate 存储向量\n   - 先查向量库获 ID，再查 MySQL 获详情\n\n**向量索引算法**\n- IVF（Inverted File Index）：聚类 + 倒排\n- HNSW（Hierarchical Navigable Small World）：图索引，高效近似最近邻\n- PQ（Product Quantization）：压缩向量",
    "example": "# MySQL 9.0 VECTOR 类型（预览）\nCREATE TABLE embeddings (\n  id INT PRIMARY KEY,\n  doc_id VARCHAR(64),\n  vec VECTOR(1536)  -- OpenAI embedding 维度\n);\n\n# 插入向量\nINSERT INTO embeddings VALUES (1, 'doc1', STRING_TO_VECTOR('[0.1, 0.2, ...]'));\n\n# 向量距离查询\nSELECT id, VEC_DISTANCE_EUCLIDEAN(vec, STRING_TO_VECTOR('[0.1, 0.2, ...]')) AS dist\nFROM embeddings\nORDER BY dist\nLIMIT 10;\n\n# 实际生产：MySQL + Milvus\n# 1. Milvus 存储向量并创建 HNSW 索引\n# 2. 相似度搜索返回 ID 列表\n# 3. MySQL IN 查询补全元数据\nSELECT * FROM documents WHERE doc_id IN ('id1', 'id2', 'id3');\n\n# TiDB Vector 示例\nCREATE TABLE docs (\n  id INT PRIMARY KEY,\n  content TEXT,\n  embedding VECTOR(768)\n);\nCREATE VECTOR INDEX idx_vec ON docs(embedding);\n\nSELECT * FROM docs\nORDER BY VEC_COSINE_DISTANCE(embedding, '[...]')\nLIMIT 5;"
  },
  {
    "id": "mysql-mgr",
    "title": "MySQL Group Replication 与 InnoDB Cluster",
    "level": "高级",
    "content": "**MySQL 高可用演进**\n- 异步复制 -> 半同步 -> Group Replication -> InnoDB Cluster\n\n**Group Replication（MGR）**\n- 基于 Paxos 的组通信\n- 单主模式（Single-Primary）或多主模式（Multi-Primary）\n- 自动成员管理和故障检测\n- 自动故障转移（需配合 Router）\n\n**InnoDB Cluster**\n- MySQL Shell + Group Replication + MySQL Router\n- 官方推荐的高可用方案\n- 一键部署和管理\n\n**架构组件**\n\n1. **MySQL Shell**\n   - JavaScript/Python 脚本接口\n   - dba.createCluster() 创建集群\n   - cluster.addInstance() 添加节点\n\n2. **Group Replication**\n   - 数据强一致（多数派提交）\n   - 写扩展性有限（单主模式）\n   - 网络分区处理： minority 自动退服\n\n3. **MySQL Router**\n   - 应用透明连接\n   - 自动路由到主节点（写）或从节点（读）\n   - 元数据驱动\n\n**对比传统主从**\n- 主从：异步延迟、手动切换、脑裂风险\n- MGR：强一致、自动切换、无脑裂",
    "example": "# InnoDB Cluster 部署\n\n# 1. 配置实例（每个节点）\n# my.cnf\n# server_id=1\n# gtid_mode=ON\n# enforce_gtid_consistency=ON\n# binlog_format=ROW\n# transaction_write_set_extraction=XXHASH64\n# loose-group_replication_group_name=\"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\"\n\n# 2. MySQL Shell 创建集群\nmysqlsh root@primary:3306\n\njs> dba.configureInstance('root@primary:3306')\njs> var cluster = dba.createCluster('myCluster')\njs> cluster.addInstance('root@secondary1:3306')\njs> cluster.addInstance('root@secondary2:3306')\njs> cluster.status()\n\n# 3. 查看集群状态\njs> cluster.describe()\njs> cluster.status()\n# {\n#   \"clusterName\": \"myCluster\",\n#   \"defaultReplicaSet\": {\n#     \"name\": \"default\",\n#     \"primary\": \"primary:3306\",\n#     \"status\": \"OK\",\n#     \"topology\": { ... }\n#   }\n# }\n\n# 4. MySQL Router 引导\nmysqlrouter --bootstrap root@primary:3306 --directory=/etc/mysqlrouter\n\n# 5. 应用连接 Router\nmysql -u app -P 6446 -h router_host  # 读写端口\nmysql -u app -P 6447 -h router_host  # 只读端口"
  },
  {
    "id": "mysql-observability",
    "title": "MySQL 可观测性与智能诊断",
    "level": "高级",
    "content": "**数据库可观测性三大支柱**\n- Metrics（指标）：QPS、延迟、连接数、缓存命中率\n- Logs（日志）：慢查询、错误日志、审计日志\n- Traces（链路）：SQL 执行链路追踪\n\n**监控工具**\n\n1. **Prometheus + Grafana**\n   - mysqld_exporter 采集指标\n   - 官方/社区 Dashboard\n   - 告警规则：连接数、复制延迟、慢查询增长\n\n2. **PMM（Percona Monitoring and Management）**\n   - 开源数据库监控平台\n   - Query Analytics（QAN）\n   - 内置 Advisor 建议\n\n3. **MySQL Enterprise Monitor**\n   - 官方商业方案\n\n4. **云厂商监控**\n   - AWS RDS Performance Insights\n   - 阿里云 DAS（数据库自治服务）\n   - 腾讯云 DBbrain\n\n**智能诊断**\n- 自动索引建议\n- SQL 优化建议\n- 异常检测（基线偏离）\n- 容量预测\n\n**慢查询治理**\n- pt-query-digest 分析模式\n- 可视化火焰图（bpftrace）\n- 全链路追踪：OpenTelemetry + ProxySQL",
    "example": "# MySQL 可观测实战\n\n# 1. mysqld_exporter 配置\n# my.cnf 启用状态统计\n# [mysqld]\n# performance_schema = ON\n# innodb_monitor_enable = all\n\n# docker run -d \\\n#   -p 9104:9104 \\\n#   -e DATA_SOURCE_NAME=\"user:pass@(db:3306)/\" \\\n#   prom/mysqld-exporter\n\n# 2. Prometheus 抓取\n# scrape_configs:\n#   - job_name: 'mysql'\n#     static_configs:\n#       - targets: ['db-exporter:9104']\n\n# 3. Grafana Dashboard\n# 导入 ID 7362（MySQL Overview）\n\n# 4. PMM 查询分析\npmm-admin add mysql --username=root --password=pass --server-url=https://pmm-server\n# Web 界面查看 QAN、Advisor\n\n# 5. 使用 bpftrace 跟踪慢查询内核路径\nbpftrace -e '\ntracepoint:mysql:query__exec__start\n/ str(args->query) != \"\"/\n{\n    @start[tid] = nsecs;\n    @query[tid] = str(args->query);\n}\n\ntracepoint:mysql:query__exec__done\n/@start[tid]/\n{\n    @latency_us = hist((nsecs - @start[tid]) / 1000);\n    delete(@start[tid]); delete(@query[tid]);\n}\n'\n\n# 6. OpenTelemetry 追踪\n# 在应用端配置 OTel JDBC Driver\n# 查看 SQL 执行全链路：应用 -> 网络 -> MySQL -> 磁盘"
  },
  {
    "id": "mysql-rocksdb",
    "title": "MyRocks 与 RocksDB 引擎",
    "level": "高级",
    "content": "**MyRocks 概述**\n- Facebook 基于 RocksDB 开发的 MySQL 存储引擎\n- 相比 InnoDB：更高压缩比、更低写入放大\n- 适合写密集型、空间敏感场景\n\n**RocksDB 核心特性**\n- LSM-Tree（Log-Structured Merge Tree）\n- 顺序写优化，极高写入吞吐\n- 分层压缩（Leveled Compaction）\n- 空间放大 vs 读取放大权衡\n\n**MyRocks vs InnoDB**\n| 特性 | InnoDB | MyRocks |\n|------|--------|---------|\n| 存储结构 | B+Tree | LSM-Tree |\n| 压缩比 | 2x | 3-5x |\n| 写入放大 | 高 | 低 |\n| 读取延迟 | 稳定 | 可能退化（compaction） |\n| 范围读 | 优秀 | 良好 |\n| TTL 支持 | 需应用实现 | 原生支持 |\n\n**适用场景**\n- 日志/时序数据（高写入、可接受读取波动）\n- 大规模数据归档（高压缩节省成本）\n- SSD 寿命敏感场景（减少写入放大）\n- 不适合：高并发随机读、小事务 OLTP\n\n**运维注意**\n- compaction 调优（write stall 问题）\n- bloom filter 优化点查\n- 监控 L0->L1 compaction 压力",
    "example": "# MyRocks 使用\n\n# 1. 安装（MariaDB 10.2+ 或 Percona Server）\nINSTALL PLUGIN rocksdb SONAME 'ha_rocksdb.so';\n\n# 2. 创建表\nCREATE TABLE events (\n  id BIGINT PRIMARY KEY,\n  ts TIMESTAMP,\n  data BLOB\n) ENGINE=RocksDB\n  DEFAULT CHARSET=latin1\n  COMMENT 'rocksdb_ttl=3600';  -- TTL 1小时\n\n# 3. 查看压缩比\nSELECT\n  ENGINE,\n  SUM(DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024 AS size_mb,\n  SUM(DATA_LENGTH) / 1024 / 1024 AS data_mb\nFROM information_schema.TABLES\nWHERE TABLE_SCHEMA = 'mydb'\nGROUP BY ENGINE;\n\n# 4. RocksDB 内部状态\nSHOW ENGINE ROCKSDB STATUS;\n\n# 5. 调优参数\n# rocksdb_max_background_jobs = 8\n# rocksdb_rate_limiter_bytes_per_sec = 100MB\n# rocksdb_write_buffer_size = 64MB\n\n# 6. 监控 compaction\n# 关注 RDB_COMPACTION_STATS\n# L0 文件过多会导致 read/write stall"
  },
  {
    "id": "mysql-new-versions",
    "title": "MySQL 8.4/9.0 新特性展望",
    "level": "高级",
    "content": "**MySQL 版本演进**\n- MySQL 8.0（2018）：窗口函数、CTE、JSON、直方图\n- MySQL 8.4（LTS）：稳定长期支持版\n- MySQL 9.0（Innovation）：快速迭代，新特性试验场\n\n**MySQL 8.4 关键特性**\n\n1. **认证插件变更**\n   - caching_sha2_password 成为默认\n   - mysql_native_password 不再默认启用\n   - 提升安全性\n\n2. **复制改进**\n   - 组复制增强\n   - 克隆插件改进\n   - 并行复制优化\n\n3. **优化器增强**\n   - 直方图改进\n   - 多范围读（MRR）优化\n\n**MySQL 9.0 新特性**\n\n1. **VECTOR 类型**\n   - 原生向量数据类型支持\n   - 为 AI 应用提供基础\n\n2. **JavaScript 存储程序（9.0 预览）**\n   - 使用 JavaScript 编写存储过程/函数\n   - 通过 GraalVM 集成\n\n3. **性能模式增强**\n   - 更细粒度等待事件\n   - 增强的语句采样\n\n4. **JSON 功能增强**\n   - 更多 JSON 函数\n   - 部分更新优化\n\n**升级注意事项**\n- 8.0 -> 8.4：主要平滑，注意认证插件\n- 8.4 -> 9.0：创新版，生产环境需谨慎\n- 使用 MySQL Shell Upgrade Checker 预检",
    "example": "# MySQL 9.0 新特性预览\n\n# 1. VECTOR 类型\nCREATE TABLE items (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  embedding VECTOR(768)\n);\n\n# 2. JavaScript 存储过程（预览）\nCREATE FUNCTION js_add(a INT, b INT)\n  RETURNS INT\n  LANGUAGE JAVASCRIPT\nAS \"\"\"\n  return a + b;\n\"\"\";\n\nSELECT js_add(1, 2);\n\n# 3. 升级检查\nmysqlsh -- util check-for-server-upgrade \\\n  --user=root --host=localhost\n\n# 4. 认证插件兼容性\n# 旧客户端连接 8.4+ 可能需要升级驱动\n# 或显式启用 mysql_native_password\n# [mysqld]\n# authentication_policy = 'mysql_native_password,caching_sha2_password'\n\n# 5. 克隆插件快速构建副本\nCLONE INSTANCE FROM 'root@source:3306' IDENTIFIED BY 'pass';\n\n# 6. 直方图自动更新\nANALYZE TABLE orders UPDATE HISTOGRAM ON status, region WITH 100 BUCKETS;"
  }
],

mysql_ext4_questions: [
  {
    "q": "AWS RDS Multi-AZ 的主要作用是？",
    "level": "高级",
    "options": ["读写分离","高可用自动故障切换","跨地域复制","自动扩容"],
    "answer": 1,
    "explain": "Multi-AZ 在同一地域的不同可用区部署主备实例，实现高可用和自动故障切换。"
  },
  {
    "q": "ProxySQL 的核心功能不包括？",
    "level": "高级",
    "options": ["读写分离","连接池复用","分库分表","查询缓存"],
    "answer": 2,
    "explain": "ProxySQL 支持读写分离、连接池、查询缓存，但不原生支持分库分表（需配合 ShardingSphere）。"
  },
  {
    "q": "MySQL 冷热分离中，pt-archiver 的作用是？",
    "level": "高级",
    "options": ["备份全库","低影响归档历史数据","索引优化","用户管理"],
    "answer": 1,
    "explain": "pt-archiver 是 Percona Toolkit 工具，用于低影响地将旧数据从热库归档到冷库。"
  },
  {
    "q": "HNSW 是哪种索引算法？",
    "level": "高级",
    "options": ["B+Tree","LSM-Tree","近似最近邻图索引","倒排索引"],
    "answer": 2,
    "explain": "HNSW（Hierarchical Navigable Small World）是高效的近似最近邻图索引算法，广泛用于向量数据库。"
  },
  {
    "q": "MySQL Group Replication 基于什么共识算法？",
    "level": "高级",
    "options": ["Raft","Paxos","ZAB","PBFT"],
    "answer": 1,
    "explain": "MGR 基于 Paxos 的组通信引擎（XCom）实现分布式一致性。"
  },
  {
    "q": "Prometheus 监控 MySQL 使用哪个 exporter？",
    "level": "进阶",
    "options": ["node_exporter","mysqld_exporter","redis_exporter","blackbox_exporter"],
    "answer": 1,
    "explain": "mysqld_exporter 是官方推荐的 MySQL Prometheus Exporter，采集 MySQL 状态和性能指标。"
  },
  {
    "q": "MyRocks 基于什么存储结构？",
    "level": "高级",
    "options": ["B+Tree","LSM-Tree","Hash","Bitmap"],
    "answer": 1,
    "explain": "MyRocks 基于 RocksDB，使用 LSM-Tree 结构，优化写入吞吐和压缩比。"
  },
  {
    "q": "MySQL 9.0 引入的原生 AI 支持数据类型是？",
    "level": "高级",
    "options": ["JSON","VECTOR","BLOB","SPATIAL"],
    "answer": 1,
    "explain": "MySQL 9.0 引入 VECTOR 数据类型，支持高维向量存储和距离计算，面向 AI 应用。"
  },
  {
    "q": "InnoDB Cluster 中，MySQL Router 的作用是？",
    "level": "高级",
    "options": ["数据同步","应用透明路由（读写分离/故障转移）","备份调度","监控告警"],
    "answer": 1,
    "explain": "MySQL Router 根据元数据自动将应用连接路由到主节点（写）或从节点（读），并处理故障转移。"
  },
  {
    "q": "云数据库 Serverless 的主要优势是？",
    "level": "进阶",
    "options": ["永久免费","自动扩缩容、按量计费","无限存储","无需网络"],
    "answer": 1,
    "explain": "Serverless 数据库根据负载自动扩缩容，按实际使用量计费，适合波动负载。"
  },
  {
    "q": "PMM 的 QAN 模块用于？",
    "level": "进阶",
    "options": ["查询分析（Query Analytics）","集群管理","备份恢复","用户审计"],
    "answer": 0,
    "explain": "QAN = Query Analytics，PMM 的核心模块，用于分析 SQL 性能、执行计划、统计信息。"
  },
  {
    "q": "Vitess 最初由哪家公司开发？",
    "level": "高级",
    "options": ["Google","YouTube","Facebook","Twitter"],
    "answer": 1,
    "explain": "Vitess 最初由 YouTube 开发，用于解决 MySQL 大规模分片问题，现为 CNCF 项目。"
  },
  {
    "q": "MySQL 8.4 默认的认证插件是？",
    "level": "进阶",
    "options": ["mysql_native_password","caching_sha2_password","sha256_password","auth_socket"],
    "answer": 1,
    "explain": "MySQL 8.4 默认使用 caching_sha2_password，mysql_native_password 不再默认启用。"
  },
  {
    "q": "RocksDB 的 LSM-Tree 主要优化什么？",
    "level": "高级",
    "options": ["随机读","顺序写","全表扫描","排序"],
    "answer": 1,
    "explain": "LSM-Tree 将随机写转换为顺序写，极大提升写入吞吐，适合写密集型负载。"
  },
  {
    "q": "MySQL 克隆插件（Clone Plugin）的作用是？",
    "level": "高级",
    "options": ["增量备份","快速物理复制实例","逻辑导出","压缩数据"],
    "answer": 1,
    "explain": "克隆插件可以从源实例快速复制物理数据文件，用于快速构建副本或恢复。"
  },
  {
    "q": "ShardingSphere-Proxy 的主要定位是？",
    "level": "高级",
    "options": ["监控工具","数据库中间件（分库分表/读写分离）","备份工具","迁移工具"],
    "answer": 1,
    "explain": "ShardingSphere-Proxy 是数据库中间件，提供分库分表、读写分离、数据加密等能力。"
  },
  {
    "q": "向量数据库相似度检索通常使用？",
    "level": "高级",
    "options": ["精确匹配","近似最近邻（ANN）","B+Tree 范围查询","全文检索"],
    "answer": 1,
    "explain": "高维向量检索通常使用近似最近邻（ANN）算法（如 HNSW、IVF），平衡精度和性能。"
  },
  {
    "q": "MySQL Enterprise Monitor 是哪个公司的产品？",
    "level": "进阶",
    "options": ["Percona","Oracle","MariaDB","Microsoft"],
    "answer": 1,
    "explain": "MySQL Enterprise Monitor 是 Oracle 官方的商业监控和管理工具。"
  },
  {
    "q": "以下哪个不是 MyRocks 的优点？",
    "level": "高级",
    "options": ["高压缩比","低写入放大","优秀的随机读性能","原生 TTL"],
    "answer": 2,
    "explain": "MyRocks 的 LSM-Tree 结构在随机读场景下性能不如 InnoDB 的 B+Tree，可能出现读取放大。"
  },
  {
    "q": "MGR 单主模式下，写操作发送到？",
    "level": "高级",
    "options": ["任意节点","主节点","所有节点","随机节点"],
    "answer": 1,
    "explain": "MGR 单主模式下，所有写操作必须通过主节点，从节点只读；多主模式才允许多节点写入。"
  },
  {
    "q": "阿里云 DAS 的核心能力是？",
    "level": "进阶",
    "options": ["数据库自治服务（智能诊断/优化）","数据迁移","备份存储","访问控制"],
    "answer": 0,
    "explain": "DAS（Database Autonomy Service）是阿里云的数据库自治服务，提供智能诊断、优化建议、异常检测。"
  },
  {
    "q": "Canal 的主要功能是？",
    "level": "高级",
    "options": ["数据库迁移","MySQL binlog 解析与数据同步","慢查询分析","备份恢复"],
    "answer": 1,
    "explain": "Canal 是阿里巴巴开源的 MySQL binlog 解析工具，用于实时数据同步（如同步到 ES、Kafka）。"
  },
  {
    "q": "MySQL 9.0 预览支持的存储程序语言是？",
    "level": "高级",
    "options": ["Python","JavaScript","Go","Rust"],
    "answer": 1,
    "explain": "MySQL 9.0 预览引入 JavaScript 存储程序支持，通过 GraalVM 集成。"
  },
  {
    "q": "在 MySQL 可观测性中，三大支柱是？",
    "level": "进阶",
    "options": ["CPU/内存/磁盘","Metrics/Logs/Traces","QPS/TPS/延迟","备份/恢复/复制"],
    "answer": 1,
    "explain": "可观测性三大支柱是 Metrics（指标）、Logs（日志）、Traces（链路追踪）。"
  },
  {
    "q": "对象存储归档（如 S3）适合存放？",
    "level": "进阶",
    "options": ["热数据","温数据","冷数据","缓存"],
    "answer": 2,
    "explain": "冷数据访问频率极低，适合低成本的对象存储归档，需要时再恢复。"
  },
  {
    "q": "MySQL Router 的读写端口分别是？",
    "level": "进阶",
    "options": ["3306/3307","6446/6447","3306/3306","8080/8081"],
    "answer": 1,
    "explain": "MySQL Router 默认 6446 为读写端口（指向主节点），6447 为只读端口（指向从节点）。"
  },
  {
    "q": "OpenTelemetry 在数据库场景用于？",
    "level": "高级",
    "options": ["备份","SQL 执行链路追踪","索引构建","权限控制"],
    "answer": 1,
    "explain": "OpenTelemetry 提供标准化的 SQL 执行链路追踪，帮助分析从应用到数据库的全链路延迟。"
  },
  {
    "q": "Kata Containers 在数据库场景提供？",
    "level": "高级",
    "options": ["更高性能","更强的安全隔离","自动备份","读写分离"],
    "answer": 1,
    "explain": "Kata Containers 为每个容器提供轻量 VM 隔离，适合多租户数据库场景的安全需求。"
  },
  {
    "q": "以下哪个是 MariaDB 的中间件？",
    "level": "进阶",
    "options": ["ProxySQL","MaxScale","MySQL Router","Vitess"],
    "answer": 1,
    "explain": "MaxScale 是 MariaDB 官方的数据库中间件，提供路由、负载均衡、防火墙等功能。"
  },
  {
    "q": "MySQL 8.4 属于什么版本类型？",
    "level": "进阶",
    "options": ["Innovation","LTS","Preview","Beta"],
    "answer": 1,
    "explain": "MySQL 8.4 是 LTS（长期支持）版本，提供 8 年的支持周期，适合生产环境。"
  }
]
