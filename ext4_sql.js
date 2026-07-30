// === SQL EXT4 ===
sql_ext4_topics: [
  {
    "id": "sql-data-warehouse",
    "title": "现代数据仓库 SQL（Snowflake/BigQuery）",
    "level": "高级",
    "content": "**云数据仓库特点**\n- 存算分离：存储（对象存储）与计算独立扩展\n- 弹性伸缩：按需分配计算资源\n- 零运维：自动分区、自动优化、自动备份\n\n**Snowflake 核心概念**\n\n1. **存储层**\n   - 基于对象存储（S3/Azure Blob/GCS）\n   - 列式存储 + 微分区（Micro-partitions）\n   - 自动压缩和克隆（Zero-copy cloning）\n\n2. **计算层（Virtual Warehouse）**\n   - 独立的计算集群\n   - 按秒计费，自动启停\n   - 多集群弹性扩展（Multi-cluster）\n\n3. **云服务层**\n   - 元数据管理、查询优化、认证\n\n**BigQuery 核心概念**\n- Serverless，无需管理集群\n- 按查询扫描数据量计费\n- 分区（Partitioning）和聚簇（Clustering）优化成本\n- 物化视图（Materialized Views）\n- 支持流式插入\n\n**现代数仓 SQL 特性**\n- QUALIFY：窗口函数过滤（替代子查询）\n- FLATTEN/UNNEST：处理半结构化数据\n- 时间旅行（Time Travel）：查询历史数据\n- 零拷贝克隆：CLONE 表/数据库",
    "example": "-- Snowflake SQL\n-- 1. 创建虚拟仓库\nCREATE WAREHOUSE dev_wh WITH\n  WAREHOUSE_SIZE = 'SMALL'\n  AUTO_SUSPEND = 300\n  AUTO_RESUME = TRUE;\n\n-- 2. 零拷贝克隆（瞬间完成，不占用额外存储）\nCREATE TABLE orders_clone CLONE orders;\n\n-- 3. 时间旅行查询\nSELECT * FROM orders AT (OFFSET => -60*5);  -- 5分钟前\nSELECT * FROM orders BEFORE (STATEMENT => 'query_id');\n\n-- 4. QUALIFY（过滤窗口函数结果）\nSELECT dept, name, salary,\n  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk\nFROM employees\nQUALIFY rnk <= 3;\n\n-- BigQuery SQL\n-- 5. 分区表（按日期）\nCREATE TABLE project.dataset.events (\n  event_id STRING,\n  event_time TIMESTAMP,\n  payload JSON\n)\nPARTITION BY DATE(event_time);\n\n-- 6. 聚簇优化\nCREATE TABLE orders (\n  order_id INT64,\n  customer_id INT64,\n  order_date DATE\n)\nPARTITION BY order_date\nCLUSTER BY customer_id;\n\n-- 7. 数组展开\nSELECT name, tag\nFROM users, UNNEST(tags) AS tag;\n\n-- 8. 物化视图\nCREATE MATERIALIZED VIEW project.dataset.mv_daily_sales AS\nSELECT DATE(order_time) AS day, SUM(amount) AS total\nFROM orders\nGROUP BY 1;"
  },
  {
    "id": "sql-lakehouse",
    "title": "Lakehouse 架构与 SQL 分析",
    "level": "高级",
    "content": "**Lakehouse 定义**\n- Databricks 提出的架构范式\n- 数据湖（Data Lake）+ 数据仓库（Data Warehouse）的融合\n- 低成本存储（对象存储）+ 高性能分析（列式格式 + 元数据层）\n\n**核心组件**\n\n1. **对象存储**\n   - Delta Lake / Iceberg / Hudi：表格式（Table Format）\n   - 基于 Parquet 文件\n   - ACID 事务、版本控制、时间旅行\n\n2. **元数据层**\n   - Delta Log / Iceberg Manifest\n   - 记录文件列表、分区信息、统计信息\n   - 使对象存储具备表语义\n\n3. **计算引擎**\n   - Spark / Trino / Dremio / DuckDB\n   - 读取表格式元数据，执行查询\n\n**Lakehouse SQL 能力**\n- ACID 事务：MERGE、UPDATE、DELETE\n- Schema 演化：添加/修改列\n- 增量处理：读取变更数据\n- 统一批流：同一套 SQL，批处理和流处理\n\n**对比传统方案**\n| 特性 | 数据湖 | 数据仓库 | Lakehouse |\n|------|--------|----------|-----------|\n| 存储成本 | 低 | 高 | 低 |\n| 格式灵活 | 高 | 低 | 高 |\n| ACID | 无 | 有 | 有 |\n| Schema 强制 | 无 | 强 | 灵活 |\n| 性能 | 低 | 高 | 高 |",
    "example": "-- Delta Lake SQL (Spark SQL / Databricks)\n\n-- 1. 创建 Delta 表\nCREATE TABLE events USING DELTA\nLOCATION 's3://bucket/events/';\n\n-- 2. MERGE（UPSERT）\nMERGE INTO target t\nUSING source s\nON t.id = s.id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *;\n\n-- 3. 时间旅行\nSELECT * FROM events TIMESTAMP AS OF '2024-01-01';\nSELECT * FROM events VERSION AS OF 1;\n\n-- 4. 优化（文件合并）\nOPTIMIZE events ZORDER BY (user_id);\n\n-- 5. 清理旧版本\nVACUUM events RETAIN 168 HOURS;\n\n-- Iceberg SQL (Trino / Spark)\nCREATE TABLE iceberg_table (\n  id BIGINT,\n  data STRING,\n  ts TIMESTAMP\n) USING iceberg\nPARTITIONED BY (days(ts));\n\n-- Schema 演化\nALTER TABLE iceberg_table ADD COLUMN new_col INT;\n\n-- DuckDB 直接查询 Parquet / Delta\nSELECT * FROM read_parquet('s3://bucket/*.parquet');\nSELECT * FROM delta_scan('s3://bucket/delta-table/');"
  },
  {
    "id": "sql-vector-db",
    "title": "向量数据库与 AI 检索 SQL",
    "level": "高级",
    "content": "**向量检索基础**\n- Embedding：将文本/图像/音频映射到高维向量空间\n- 相似度度量：余弦相似度、欧氏距离、点积\n- 近似最近邻（ANN）：HNSW、IVF_FLAT、IVF_PQ\n\n**主流向量数据库**\n\n1. **Milvus / Zilliz**\n   - 专为向量设计\n   - 分布式、高性能\n   - 支持多种索引类型\n\n2. **Pinecone**\n   - 全托管 SaaS\n   - 无需调参\n   - 元数据过滤\n\n3. **Weaviate**\n   - 开源，GraphQL + 向量\n   - 模块化 AI 集成\n\n4. **pgvector**\n   - PostgreSQL 扩展\n   - 最成熟的 SQL 向量方案\n\n5. **Chroma / Qdrant**\n   - 轻量级，适合小型项目\n\n**混合检索**\n- 向量相似度 + 元数据过滤\n- 重排序（Rerank）：粗排（向量）+ 精排（Cross-encoder）\n- RAG（检索增强生成）：向量检索 + LLM 生成",
    "example": "-- pgvector SQL\n-- 1. 启用扩展\nCREATE EXTENSION vector;\n\n-- 2. 创建向量表\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding vector(1536)\n);\n\n-- 3. 创建 HNSW 索引\nCREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)\nWITH (m = 16, ef_construction = 64);\n\n-- 4. 向量相似度查询\nSELECT id, content,\n  1 - (embedding <=> '[0.1, 0.2, ...]') AS cosine_similarity\nFROM documents\nWHERE category = 'tech'  -- 元数据过滤\nORDER BY embedding <=> '[0.1, 0.2, ...]'\nLIMIT 10;\n\n-- Milvus (通过 SDK，伪 SQL)\n-- CREATE COLLECTION docs (\n--   id INT64,\n--   content VARCHAR,\n--   embedding FLOAT_VECTOR(1536)\n-- );\n-- CREATE INDEX idx ON docs(embedding) USING HNSW;\n\n-- Weaviate GraphQL\n-- {\n--   Get {\n--     Document(\n--       nearVector: {vector: [0.1, 0.2, ...]}\n--       where: {path: [\"category\"], operator: Equal, valueText: \"tech\"}\n--     ) {\n--       content\n--       _additional { certainty }\n--     }\n--   }\n-- }\n\n-- RAG 流程\n-- 1. 用户查询 -> Embedding -> 向量检索 -> Top-K 文档\n-- 2. 构建 Prompt = 系统提示 + 检索文档 + 用户问题\n-- 3. LLM 生成回答"
  },
  {
    "id": "sql-streaming",
    "title": "流处理 SQL（Flink SQL / Kafka Streams）",
    "level": "高级",
    "content": "**流处理 SQL 理念**\n- 用 SQL 处理实时数据流\n- 统一批处理和流处理语义\n- 事件时间（Event Time） vs 处理时间（Processing Time）\n\n**Apache Flink SQL**\n- 真正的流处理引擎\n- 精确一次（Exactly-Once）语义\n- 基于事件时间的窗口\n- 状态后端：RocksDB / Heap\n\n**核心概念**\n\n1. **动态表（Dynamic Table）**\n   - 流 = 表的 changelog\n   - INSERT/UPDATE/DELETE 持续流入\n\n2. **窗口类型**\n   - TUMBLE：滚动窗口（固定大小，不重叠）\n   - HOP：滑动窗口（固定大小，可重叠）\n   - SESSION：会话窗口（活动间隙）\n   - OVER：逐行计算窗口\n\n3. **Watermark**\n   - 容忍乱序数据\n   - 触发窗口计算\n\n4. **CDC（Change Data Capture）**\n   - Debezium + Kafka + Flink\n   - 数据库变更实时流入流处理\n\n**其他流 SQL**\n- Kafka Streams / ksqlDB\n- Spark Structured Streaming\n- Materialize / RisingWave（流式物化视图）",
    "example": "-- Flink SQL\n\n-- 1. 创建 Kafka 源表\nCREATE TABLE user_events (\n  user_id STRING,\n  event_type STRING,\n  amount DECIMAL(10,2),\n  event_time TIMESTAMP(3),\n  WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND\n) WITH (\n  'connector' = 'kafka',\n  'topic' = 'user_events',\n  'properties.bootstrap.servers' = 'kafka:9092',\n  'format' = 'json'\n);\n\n-- 2. 滚动窗口聚合\nSELECT\n  TUMBLE_START(event_time, INTERVAL '1' HOUR) AS window_start,\n  TUMBLE_END(event_time, INTERVAL '1' HOUR) AS window_end,\n  event_type,\n  COUNT(*) AS cnt,\n  SUM(amount) AS total\nFROM user_events\nGROUP BY\n  TUMBLE(event_time, INTERVAL '1' HOUR),\n  event_type;\n\n-- 3. Top-N（每组取最新）\nSELECT * FROM (\n  SELECT *,\n    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_time DESC) AS rn\n  FROM user_events\n) WHERE rn <= 3;\n\n-- 4. CDC 同步（MySQL -> Kafka -> Flink）\nCREATE TABLE mysql_orders (\n  id INT,\n  status STRING,\n  PRIMARY KEY (id) NOT ENFORCED\n) WITH (\n  'connector' = 'mysql-cdc',\n  'hostname' = 'mysql',\n  'database-name' = 'db',\n  'table-name' = 'orders'\n);\n\n-- RisingWave（流式物化视图）\nCREATE MATERIALIZED VIEW mv_hourly_sales AS\nSELECT window_start, SUM(amount)\nFROM TUMBLE(events, event_time, INTERVAL '1' HOUR)\nGROUP BY window_start;"
  },
  {
    "id": "sql-data-governance",
    "title": "数据治理与 SQL 血缘追踪",
    "level": "高级",
    "content": "**数据治理核心**\n- 数据质量：准确性、完整性、一致性\n- 元数据管理：数据字典、业务术语\n- 数据血缘：数据从哪来、到哪去、如何转换\n- 数据安全：分级分类、脱敏、权限\n- 生命周期管理：归档、销毁\n\n**SQL 血缘追踪**\n\n1. **静态血缘（SQL 解析）**\n   - 解析 SQL 语句提取表/列依赖\n   - 工具：Apache Atlas、DataHub、OpenLineage\n   - 支持复杂场景：CTE、子查询、视图嵌套\n\n2. **动态血缘（执行追踪）**\n   - 通过执行日志/Hook 追踪实际数据流\n   - 更精确但开销大\n\n**数据质量 SQL**\n- 空值率：COUNT(*) - COUNT(col) / COUNT(*)\n- 唯一性：COUNT(DISTINCT col) / COUNT(*)\n- 范围检查：MIN/MAX/PERCENTILE\n- 格式验证：正则匹配\n- 参照完整性：外键/关联检查\n\n**数据分类与标签**\n- 敏感字段自动识别（PII：姓名、身份证、手机号）\n- 列级/行级权限控制\n- 动态数据脱敏：根据用户角色返回脱敏数据",
    "example": "-- 数据质量检查 SQL\n\n-- 1. 空值率检查\nSELECT\n  'users.phone' AS column_name,\n  COUNT(*) AS total_rows,\n  COUNT(phone) AS non_null,\n  ROUND((COUNT(*) - COUNT(phone)) * 100.0 / COUNT(*), 2) AS null_pct\nFROM users;\n\n-- 2. 唯一性检查\nSELECT\n  COUNT(*) AS total,\n  COUNT(DISTINCT email) AS unique_emails,\n  ROUND(COUNT(DISTINCT email) * 100.0 / COUNT(*), 2) AS uniqueness_pct\nFROM users;\n\n-- 3. 数值范围异常\nSELECT * FROM orders\nWHERE amount < 0 OR amount > 1000000;\n\n-- 4. 格式验证（手机号）\nSELECT * FROM users\nWHERE phone IS NOT NULL AND phone NOT REGEXP '^1[3-9][0-9]{9}$';\n\n-- 5. 数据血缘查询（DataHub/OpenLineage）\n-- 查询某张表的上游依赖\n-- MATCH (a:Dataset)-[:DOWNSTREAM_OF]->(b:Dataset {name: 'orders'})\n-- RETURN a.name\n\n-- 6. 动态脱敏（PostgreSQL row-level security + 视图）\nCREATE VIEW users_public AS\nSELECT\n  id,\n  name,\n  CASE WHEN current_user = 'admin' THEN phone ELSE CONCAT(LEFT(phone,3),'****',RIGHT(phone,4)) END AS phone\nFROM users;\n\n-- 7. 数据分类标记\n-- UPDATE information_schema.columns\n-- SET tags = '[\"PII\", \"SENSITIVE\"]'\n-- WHERE column_name IN ('phone', 'id_card', 'email');"
  },
  {
    "id": "sql-performance-modern",
    "title": "现代数据库 SQL 性能优化",
    "level": "高级",
    "content": "**现代 SQL 优化技术**\n\n1. **向量化执行**\n   - 批量处理数据（一次处理 1024/4096 行）\n   - 减少解释器开销\n   - DuckDB / ClickHouse / Snowflake 采用\n\n2. **代码生成（Code Generation）**\n   - 为查询生成专门的机器码\n   - 消除虚函数调用\n   - Spark Tungsten / HyPer / Umbra\n\n3. **自适应查询执行（AQE）**\n   - Spark 3.0+：运行时优化 Join 策略、分区合并\n   - 根据实际统计调整计划\n\n4. **查询结果缓存**\n   - 云数仓自动缓存热点查询结果\n   - 物化视图自动刷新\n\n5. **索引新技术**\n   - Learned Index：用机器学习替代 B+Tree\n   - Filtered Index：带条件的索引\n   - BRIN：块范围索引（时序数据）\n\n6. **执行引擎演进**\n   - Pull 模型（传统） -> Push 模型（向量化）\n   - Volcano -> Vectorized -> CodeGen\n\n**优化诊断**\n- EXPLAIN ANALYZE：实际执行时间\n- Query Profile：算子级耗时\n- 等待事件分析",
    "example": "-- 现代 SQL 性能优化\n\n-- 1. ClickHouse 向量化查询\nSELECT user_id, COUNT(*)\nFROM events\nWHERE event_time >= '2024-01-01'\nGROUP BY user_id\nORDER BY COUNT(*) DESC\nLIMIT 10;\n-- 内部按 65536 行批量处理\n\n-- 2. DuckDB 并行 CSV 加载\nCOPY orders FROM 's3://bucket/*.csv' (FORMAT CSV, PARALLEL true);\n\n-- 3. Snowflake 查询加速（Result Cache）\n-- 相同查询在 24 小时内再次执行直接返回缓存结果\n\n-- 4. Spark AQE\n-- SET spark.sql.adaptive.enabled = true;\n-- SET spark.sql.adaptive.coalescePartitions.enabled = true;\n\n-- 5. PostgreSQL BRIN 索引（时序数据）\nCREATE INDEX idx_events_time_brin ON events USING BRIN (event_time)\nWITH (pages_per_range = 128);\n\n-- 6. 物化视图刷新策略\n-- Snowflake: 自动后台刷新\n-- PostgreSQL: REFRESH MATERIALIZED VIEW CONCURRENTLY\n\n-- 7. 查询 Profile 分析\n-- Snowflake: EXPLAIN USING TABULAR / EXPLAIN USING JSON\n-- 查看每个算子的实际行数、耗时、分区扫描数"
  },
  {
    "id": "sql-distributed",
    "title": "分布式数据库 SQL（TiDB/OceanBase/CockroachDB）",
    "level": "高级",
    "content": "**分布式数据库核心挑战**\n- 数据分片（Sharding）：水平拆分数据\n- 分布式事务：ACID 跨节点保证\n- 全局时钟：事务排序和一致性\n- 在线扩缩容：无停机调整集群\n\n**TiDB 架构**\n\n1. **TiDB Server**\n   - 无状态 SQL 层\n   - 兼容 MySQL 协议\n   - 查询解析、优化、执行\n\n2. **TiKV / TiFlash**\n   - TiKV：行存，基于 RocksDB，分布式 KV\n   - TiFlash：列存，MPP 引擎，加速分析\n   - HTAP：一套数据，两种存储\n\n3. **PD（Placement Driver）**\n   - 元数据管理和调度\n   - 全局时间戳（TSO）\n   - 负载均衡和故障恢复\n\n**OceanBase**\n- 蚂蚁集团自研\n-  Paxos 共识协议\n-  存算分离/一体可选\n-  高度兼容 Oracle 和 MySQL\n\n**CockroachDB**\n-  PostgreSQL 协议兼容\n-  分布式 KV + 分布式 SQL\n-  强一致性（Raft）\n-  成本优化器（CBO）\n\n**SQL 差异**\n- 自增 ID：分布式环境下使用雪花算法\n- 全局索引：跨分片索引维护\n- 乐观锁/悲观锁选择\n- 分区策略：Hash/Range/List",
    "example": "-- TiDB SQL\n\n-- 1. 查看执行计划（是否走 TiFlash）\nEXPLAIN ANALYZE SELECT region, SUM(amount)\nFROM orders\nGROUP BY region;\n-- ExchangeReceiver/ExchangeSender 表示 MPP 模式\n\n-- 2. 指定引擎\nSET SESSION tidb_isolation_read_engines = 'tiflash';\n\n-- 3. 在线 DDL（TiDB 特色）\nALTER TABLE orders ADD COLUMN new_col INT;\n-- 不锁表，业务无感知\n\n-- 4. 自动分片（无需手动）\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  name VARCHAR(100)\n) SHARD_ROW_ID_BITS = 4;\n\n-- 5. 全局事务\nBEGIN;\nINSERT INTO orders VALUES (...);\nINSERT INTO payments VALUES (...);\nCOMMIT;\n-- 跨 TiKV 节点的分布式事务\n\n-- OceanBase\n-- 多租户架构\n-- CREATE TENANT IF NOT EXISTS t1;\n-- 一个集群多个租户，资源隔离\n\n-- CockroachDB\n-- 地理分区\n-- CREATE TABLE orders (\n--   id UUID DEFAULT gen_random_uuid(),\n--   region STRING\n--) PARTITION BY LIST (region) (\n--   PARTITION us VALUES IN ('us-east', 'us-west'),\n--   PARTITION eu VALUES IN ('eu-west')\n-- );\n-- ALTER PARTITION eu CONFIGURE ZONE USING constraints='[+region=eu-west]';"
  },
  {
    "id": "sql-graph-fts",
    "title": "图数据库与全文检索 SQL",
    "level": "高级",
    "content": "**图数据库**\n- 节点（Vertex）+ 边（Edge）+ 属性（Property）\n- 适合关系密集型数据：社交网络、推荐、知识图谱、风控\n- 查询语言：Gremlin、Cypher（Neo4j）、GQL（ISO 标准）\n\n**主流图数据库**\n- Neo4j：最成熟，Cypher 语言\n- TigerGraph：原生分布式，GSQL\n- NebulaGraph：开源，国产，适合超大规模\n- JanusGraph：基于存储后端（Cassandra/HBase）\n\n**全文检索（FTS）**\n- 倒排索引：词 -> 文档列表\n- 相关性评分：TF-IDF、BM25\n- 分词：中文（IK/Jieba）、英文（标准分析器）\n\n**搜索引擎**\n- Elasticsearch：分布式，REST API，生态丰富\n- OpenSearch：ES 分支（AWS 主导）\n- Meilisearch：轻量，Rust 编写\n- Typesense：开源，低延迟\n\n**SQL 与搜索结合**\n- PostgreSQL：tsvector + tsquery\n- MySQL：FULLTEXT INDEX\n- MSSQL：CONTAINS/FREETEXT\n- 专用引擎：ClickHouse 倒排索引",
    "example": "-- Neo4j Cypher（图查询语言）\n-- 1. 查找好友的好友\nMATCH (me:Person {name: 'Alice'})-[:FRIEND]->()-[:FRIEND]->(foaf:Person)\nWHERE foaf <> me\nRETURN foaf.name;\n\n-- 2. 最短路径\nMATCH p=shortestPath(\n  (a:Person {name: 'Alice'})-[:FRIEND*]-(b:Person {name: 'Bob'})\n)\nRETURN p;\n\n-- PostgreSQL 全文检索\n-- 1. 创建搜索向量\nUPDATE articles SET search_vec = to_tsvector('chinese', title || ' ' || content);\n\n-- 2. 创建 GIN 索引\nCREATE INDEX idx_fts ON articles USING GIN (search_vec);\n\n-- 3. 查询\nSELECT title, ts_rank(search_vec, query) AS rank\nFROM articles, plainto_tsquery('chinese', '数据库优化') query\nWHERE search_vec @@ query\nORDER BY rank DESC;\n\n-- Elasticsearch SQL（有限支持）\nPOST _sql?format=txt\n{\n  \"query\": \"SELECT * FROM logs WHERE status = 500 LIMIT 10\"\n}\n\n-- MySQL FULLTEXT\nCREATE TABLE articles (\n  id INT PRIMARY KEY,\n  title VARCHAR(200),\n  body TEXT,\n  FULLTEXT INDEX ft_idx (title, body) WITH PARSER ngram\n) ENGINE=InnoDB;\n\nSELECT * FROM articles\nWHERE MATCH(title, body) AGAINST('数据库 优化' IN BOOLEAN MODE);"
  }
],

sql_ext4_questions: [
  {
    "q": "Snowflake 的 Zero-copy Clone 主要用于？",
    "level": "高级",
    "options": ["数据备份","瞬间复制表/数据库而不占用额外存储","数据压缩","跨地域复制"],
    "answer": 1,
    "explain": "Zero-copy Clone 通过共享底层微分区数据并仅复制元数据，实现瞬间克隆且不占用额外存储（修改前）。"
  },
  {
    "q": "Lakehouse 架构的核心思想是？",
    "level": "高级",
    "options": ["纯数据湖","纯数据仓库","数据湖低成本存储 + 数仓高性能分析","仅支持批处理"],
    "answer": 2,
    "explain": "Lakehouse 融合数据湖的低成本灵活存储和数据仓库的高性能分析能力，通过表格式（Delta/Iceberg/Hudi）实现。"
  },
  {
    "q": "pgvector 扩展用于 PostgreSQL 的什么能力？",
    "level": "高级",
    "options": ["全文检索","向量存储与相似度搜索","时序数据","图计算"],
    "answer": 1,
    "explain": "pgvector 为 PostgreSQL 添加 VECTOR 类型和近似最近邻索引（HNSW/ivfflat），支持向量检索。"
  },
  {
    "q": "Flink SQL 中的 Watermark 作用是？",
    "level": "高级",
    "options": ["数据加密","容忍乱序并触发窗口计算","连接 Kafka","压缩数据"],
    "answer": 1,
    "explain": "Watermark 表示事件时间的进度，允许系统处理乱序数据并决定何时触发窗口计算。"
  },
  {
    "q": "Delta Lake 的 VACUUM 命令用于？",
    "level": "高级",
    "options": ["加速查询","清理旧版本文件","创建索引","分区重组"],
    "answer": 1,
    "explain": "VACUUM 清理不再被时间旅行需要的旧版本 Parquet 文件，释放存储空间。"
  },
  {
    "q": "TiDB 的 HTAP 指的是？",
    "level": "高级",
    "options": ["高可用事务处理","混合事务/分析处理","高性能聚合","水平扩展"],
    "answer": 1,
    "explain": "HTAP = Hybrid Transactional/Analytical Processing，TiDB 通过 TiKV（行存）和 TiFlash（列存）同时支持事务和分析。"
  },
  {
    "q": "BigQuery 按什么计费？",
    "level": "进阶",
    "options": ["存储容量","计算节点数","查询扫描的数据量","查询次数"],
    "answer": 2,
    "explain": "BigQuery 主要按查询扫描的数据量（on-demand pricing）计费，也支持固定容量定价（flat-rate）。"
  },
  {
    "q": "HNSW 索引在向量数据库中的优势是？",
    "level": "高级",
    "options": ["精确匹配","高召回率下的快速近似搜索","压缩存储","强一致性"],
    "answer": 1,
    "explain": "HNSW 是多层图索引，在向量检索中提供高召回率和极快的近似最近邻搜索速度。"
  },
  {
    "q": "RisingWave 的核心概念是？",
    "level": "高级",
    "options": ["批处理","流式物化视图","数据湖","图数据库"],
    "answer": 1,
    "explain": "RisingWave 是流处理数据库，核心概念是流式物化视图（Streaming Materialized View），持续增量更新。"
  },
  {
    "q": "Neo4j 使用的查询语言是？",
    "level": "进阶",
    "options": ["SQL","Cypher","Gremlin","SPARQL"],
    "answer": 1,
    "explain": "Cypher 是 Neo4j 的声明式图查询语言，使用 ASCII 艺术表示节点和关系模式。"
  },
  {
    "q": "数据血缘追踪的主要目的是？",
    "level": "高级",
    "options": ["加速查询","理解数据从哪来、如何变换","压缩数据","加密数据"],
    "answer": 1,
    "explain": "数据血缘追踪数据的来源、转换过程和去向，是数据治理和合规审计的核心能力。"
  },
  {
    "q": "Iceberg 的 Time Travel 通过什么实现？",
    "level": "高级",
    "options": ["备份文件","快照（Snapshot）元数据","binlog","RAFT 日志"],
    "answer": 1,
    "explain": "Apache Iceberg 通过维护表级别的快照（Snapshot）列表实现时间旅行，每个快照指向一组数据文件。"
  },
  {
    "q": "Elasticsearch 默认的相关性评分算法是？",
    "level": "进阶",
    "options": ["TF-IDF","BM25","Cosine Similarity","Dot Product"],
    "answer": 1,
    "explain": "Elasticsearch 5.0+ 默认使用 BM25（Best Match 25）作为文本相关性评分算法。"
  },
  {
    "q": "以下哪个不是流处理窗口类型？",
    "level": "高级",
    "options": ["TUMBLE","HOP","SESSION","MERGE"],
    "answer": 3,
    "explain": "Flink SQL 支持 TUMBLE（滚动）、HOP（滑动）、SESSION（会话）、CUMULATE（累积）窗口，没有 MERGE 窗口。"
  },
  {
    "q": "OceanBase 使用的共识协议是？",
    "level": "高级",
    "options": ["Raft","Paxos","ZAB","PBFT"],
    "answer": 1,
    "explain": "OceanBase 基于 Paxos 共识协议实现多副本强一致和高可用。"
  },
  {
    "q": "DuckDB 的主要定位是？",
    "level": "进阶",
    "options": ["分布式 OLAP","嵌入式分析数据库","图数据库","时序数据库"],
    "answer": 1,
    "explain": "DuckDB 是嵌入式分析型数据库，类似 SQLite 但面向 OLAP，支持复杂查询和 Parquet/Delta 直接读取。"
  },
  {
    "q": "向量化执行引擎一次处理多少行？",
    "level": "高级",
    "options": ["1 行","100 行","1024/4096 行","全表"],
    "answer": 2,
    "explain": "向量化引擎（如 DuckDB、ClickHouse）通常一次处理一个 batch（1024 或 4096 行），减少解释器开销。"
  },
  {
    "q": "CockroachDB 的分布式 SQL 使用什么保证一致性？",
    "level": "高级",
    "options": ["两阶段提交","Raft + 租约","Gossip","Paxos"],
    "answer": 1,
    "explain": "CockroachDB 使用 Raft 共识协议保证 Range 级别的一致性，结合租约（Lease）优化读取性能。"
  },
  {
    "q": "PostgreSQL 全文检索使用什么索引？",
    "level": "进阶",
    "options": ["B-Tree","GIN","Hash","BRIN"],
    "answer": 1,
    "explain": "PostgreSQL 全文检索通常使用 GIN（Generalized Inverted Index）索引加速 tsvector 查询。"
  },
  {
    "q": "Spark AQE（Adaptive Query Execution）在什么时候优化查询？",
    "level": "高级",
    "options": ["编译时","运行时","提交时","启动时"],
    "answer": 1,
    "explain": "AQE 在查询运行时根据实际数据统计动态优化执行计划，如调整 Join 策略和合并小分区。"
  },
  {
    "q": "Milvus 是什么类型的数据库？",
    "level": "进阶",
    "options": ["时序数据库","向量数据库","图数据库","文档数据库"],
    "answer": 1,
    "explain": "Milvus 是专为 AI 应用设计的开源向量数据库，支持高维向量存储和近似最近邻搜索。"
  },
  {
    "q": "数据质量检查中，空值率计算公式是？",
    "level": "进阶",
    "options": ["COUNT(*) / COUNT(col)","(COUNT(*) - COUNT(col)) / COUNT(*)","COUNT(col) / COUNT(*)","SUM(col) / COUNT(*)"],
    "answer": 1,
    "explain": "空值率 = (总行数 - 非空行数) / 总行数，即 (COUNT(*) - COUNT(col)) / COUNT(*)。"
  },
  {
    "q": "TiDB 的 TSO 由哪个组件提供？",
    "level": "高级",
    "options": ["TiDB Server","TiKV","PD","TiFlash"],
    "answer": 2,
    "explain": "PD（Placement Driver）负责提供全局单调递增的时间戳（TSO），用于分布式事务排序。"
  },
  {
    "q": "以下哪个是图遍历查询语言的特征？",
    "level": "高级",
    "options": ["JOIN 操作","节点-关系-节点模式匹配","GROUP BY","子查询嵌套"],
    "answer": 1,
    "explain": "图查询语言（如 Cypher）的核心是节点-关系-节点模式匹配，例如 (a)-[:KNOWS]->(b)。"
  },
  {
    "q": "MySQL ngram 全文解析器主要用于？",
    "level": "进阶",
    "options": ["英文分词","中文等无空格语言分词","数字解析","JSON 检索"],
    "answer": 1,
    "explain": "ngram 解析器按固定长度（默认 2）切分字符，适合中文、日文等无空格分隔的语言全文检索。"
  },
  {
    "q": "数据脱敏中，动态脱敏的特点是？",
    "level": "高级",
    "options": ["物理修改数据","根据用户角色实时返回脱敏结果","删除敏感列","加密整表"],
    "answer": 1,
    "explain": "动态脱敏在查询时根据访问者角色和策略实时返回脱敏后的数据，原始数据不改变。"
  },
  {
    "q": "BRIN 索引最适合什么场景？",
    "level": "高级",
    "options": ["高基数字段","时序数据等自然有序数据","全文检索","精确匹配"],
    "answer": 1,
    "explain": "BRIN（Block Range INdex）存储每个块的最小/最大值，非常适合时序数据等自然有序的大表。"
  },
  {
    "q": "Canal/Debezium 在数据同步中的作用是？",
    "level": "高级",
    "options": ["全量导出","CDC 捕获变更数据","压缩数据","索引构建"],
    "answer": 1,
    "explain": "Canal 和 Debezium 是 CDC（Change Data Capture）工具，实时捕获数据库的变更日志（binlog）并同步到下游。"
  },
  {
    "q": "以下哪个不是数据治理的核心维度？",
    "level": "高级",
    "options": ["数据质量","元数据管理","数据安全","数据加密算法设计"],
    "answer": 3,
    "explain": "数据治理核心维度包括数据质量、元数据管理、数据安全、数据标准、生命周期管理等，但不包括具体的加密算法设计（属于安全实施层面）。"
  }
]
