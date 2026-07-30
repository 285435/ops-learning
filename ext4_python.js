// === PYTHON EXT4 ===
python_ext4_topics: [
  {
    "id": "py-312-313",
    "title": "Python 3.12/3.13 新特性",
    "level": "进阶",
    "content": "**Python 3.12 主要新特性**\n\n1. **f-string 改进**\n   - 支持任意嵌套表达式，不再有限制\n   - 支持反斜杠和 Unicode 转义\n   - 调试 f-string 更好用\n\n2. **性能提升**\n   - 整体性能提升约 5-15%\n   -  PEP 709：内联推导式，减少函数调用开销\n\n3. **类型参数语法**\n   - def func[T](x: T) -> T: ...\n   - 不再需要 typing.TypeVar\n\n4. **改进的错误消息**\n   - 更精确的 SyntaxError 提示\n   - 建议可能的修复\n\n**Python 3.13 预览特性**\n\n1. **实验性 JIT 编译器**\n   - 基于 copy-and-patch 的 JIT\n   -  configure --enable-experimental-jit\n   -  未来可能带来 2-9% 性能提升\n\n2. **改进的交互式解释器**\n   - 彩色高亮输出\n   - 多行编辑历史\n\n3. **PEP 702：标记废弃参数**\n   - @warnings.deprecated\n\n4. **移除全局解释器锁（No-GIL）实验**\n   - --disable-gil 编译选项\n   - 真正的多线程并行",
    "example": "# Python 3.12+ 新特性\n\n# 1. 类型参数语法\ndef first[T](items: list[T]) -> T | None:\n    return items[0] if items else None\n\n# 2. f-string 任意嵌套\nvalues = [10, 20, 30]\nprint(f\"Sum: {sum(values)}, Max: {max(values)}\")\n\n# 3. PEP 709 内联推导式\n# {x: y for x, y in zip(keys, values)} 更快\n\n# 4. 改进错误消息\n# SyntaxError: invalid syntax. Did you forget parentheses?\n\n# 5. 类型别名语法\ntype Point = tuple[float, float]\ntype Vector = list[Point]\n\n# Python 3.13 JIT（实验性）\n# ./configure --enable-experimental-jit\n# make\n# python3.13 -X jit script.py\n\n# 6. @warnings.deprecated\nfrom warnings import deprecated\n@deprecated('Use new_func instead')\ndef old_func(): ...\n\n# 7. 多行 REPL 历史（3.13）\n# >>> def foo():\n# ...     return 1\n# ...\n# 上下箭头可编辑多行"
  },
  {
    "id": "py-fastapi-advanced",
    "title": "FastAPI 高级与异步生态",
    "level": "高级",
    "content": "**FastAPI 核心优势**\n- 基于 Starlette（ASGI）和 Pydantic\n- 自动 API 文档（OpenAPI + Swagger UI）\n- 类型提示驱动数据验证\n- 原生异步支持（async/await）\n\n**高级特性**\n\n1. **依赖注入系统**\n   - Depends：可嵌套、可缓存\n   - 安全依赖：OAuth2PasswordBearer\n   - 数据库会话管理\n\n2. **后台任务**\n   - BackgroundTasks：轻量后台执行\n   -  heavier：配合 Celery/ARQ\n\n3. **中间件与异常处理**\n   - 自定义 HTTPException\n   - 全局异常处理器\n   - CORS、GZip、TrustedHost\n\n4. **WebSocket 支持**\n   - 原生 WebSocket endpoint\n   - 结合 JWT 认证\n\n5. **Pydantic v2**\n   - Rust 核心，5-50 倍性能提升\n   - 新验证器模式\n   - ConfigDict 替代 Config 类\n\n**部署**\n- Uvicorn（ASGI）+ Gunicorn\n- Docker 多阶段构建\n- 生产环境配置：workers、keep-alive、proxy-headers",
    "example": "# FastAPI 高级示例\nfrom fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, WebSocket\nfrom pydantic import BaseModel, ConfigDict\nfrom typing import Annotated\n\napp = FastAPI()\n\n# 依赖注入\nasync def get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n@app.get('/items/{item_id}')\nasync def read_item(\n    item_id: int,\n    db: Annotated[Session, Depends(get_db)]\n):\n    item = db.query(Item).get(item_id)\n    if not item:\n        raise HTTPException(status_code=404, detail='Item not found')\n    return item\n\n# 后台任务\ndef send_email(email: str, message: str):\n    ...\n\n@app.post('/send-notification')\nasync def notify(\n    email: str,\n    tasks: BackgroundTasks\n):\n    tasks.add_task(send_email, email, 'Hello')\n    return {'message': 'Notification sent'}\n\n# WebSocket\n@app.websocket('/ws')\nasync def websocket_endpoint(websocket: WebSocket):\n    await websocket.accept()\n    while True:\n        data = await websocket.receive_text()\n        await websocket.send_text(f'Echo: {data}')\n\n# Pydantic v2\nclass User(BaseModel):\n    model_config = ConfigDict(strict=True)\n    name: str\n    age: int\n\n# 部署\n# gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"
  },
  {
    "id": "py-async-advanced",
    "title": "Python 异步编程深度",
    "level": "高级",
    "content": "**asyncio 深入**\n- 事件循环（Event Loop）：单线程调度协程\n- 协程（Coroutine）：async def，轻量并发\n- Task：协程的包装，事件循环调度执行\n- Future：低层级可等待对象\n\n**并发原语**\n\n1. **asyncio 同步原语**\n   - Lock、Semaphore、Event、Condition\n   - Queue：协程安全队列\n\n2. **并发执行**\n   - asyncio.gather：并行运行多个协程\n   - asyncio.wait：更灵活的控制\n   - asyncio.as_completed：按完成顺序处理\n   - asyncio.TaskGroup（3.11+）：结构化并发\n\n3. **与线程/进程结合**\n   - loop.run_in_executor：在线程池中运行同步代码\n   - ProcessPoolExecutor：CPU 密集型任务\n\n**高级模式**\n- 上下文变量（contextvars）：协程本地存储\n- 信号量限流：控制并发数\n- 优雅关闭：cancel、shutdown_asyncgens\n- 流式处理：async for、异步生成器\n\n**异步库生态**\n- HTTP：aiohttp、httpx\n- DB：asyncpg、aiomysql、motor（MongoDB）\n- Redis：aioredis\n- 任务队列：Celery、ARQ、RQ",
    "example": "# Python 异步高级\nimport asyncio\n\n# 1. 结构化并发（3.11+）\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        tg.create_task(fetch('url1'))\n        tg.create_task(fetch('url2'))\n    print('All done')\n\n# 2. 信号量限流\nsemaphore = asyncio.Semaphore(10)\n\nasync def fetch_limited(url):\n    async with semaphore:\n        return await fetch(url)\n\n# 3. 异步上下文管理器\nclass ManagedConnection:\n    async def __aenter__(self):\n        self.conn = await create_connection()\n        return self.conn\n    async def __aexit__(self, exc_type, exc, tb):\n        await self.conn.close()\n\n# 4. 异步生成器\nasync def ticker(delay, to):\n    for i in range(to):\n        yield i\n        await asyncio.sleep(delay)\n\nasync for i in ticker(1, 5):\n    print(i)\n\n# 5. 在线程池运行同步代码\nloop = asyncio.get_running_loop()\nresult = await loop.run_in_executor(None, requests.get, 'https://api.example.com')\n\n# 6. 优雅关闭\nasync def shutdown():\n    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]\n    for task in tasks:\n        task.cancel()\n    await asyncio.gather(*tasks, return_exceptions=True)\n\n# 7. uvloop（Cython 事件循环，加速 2-4 倍）\nimport uvloop\nuvloop.install()"
  },
  {
    "id": "py-mlops",
    "title": "Python MLOps 与 AI 工程化",
    "level": "高级",
    "content": "**MLOps 概述**\n- ML + DevOps，机器学习工程化\n- 覆盖模型开发、训练、部署、监控全生命周期\n\n**核心组件**\n\n1. **特征工程与存储**\n   - Feast：特征存储（Feature Store）\n   - Tecton：企业级特征平台\n   - 特征版本控制、在线/离线一致性\n\n2. **实验管理**\n   - MLflow：模型/实验/参数/指标追踪\n   - Weights & Biases（W&B）：可视化实验\n   - DVC：数据版本控制（Git for Data）\n\n3. **模型训练框架**\n   - PyTorch / TensorFlow / JAX\n   - Lightning：PyTorch 高级封装\n   - Hugging Face Transformers：预训练模型\n\n4. **模型服务**\n   - TorchServe / Triton Inference Server\n   - BentoML：模型服务框架\n   - vLLM：大模型推理加速（PagedAttention）\n\n5. **监控与漂移检测**\n   - Evidently：数据漂移检测\n   - Prometheus + Grafana 监控模型指标\n\n6. **大模型工程化**\n   - LangChain / LlamaIndex：RAG 应用\n   - Ollama：本地大模型运行\n   - Text Generation Inference（TGI）",
    "example": "# MLOps 实践\n\n# 1. MLflow 追踪实验\nimport mlflow\nmlflow.set_experiment('my-exp')\nwith mlflow.start_run():\n    mlflow.log_param('lr', 0.01)\n    mlflow.log_metric('accuracy', 0.95)\n    mlflow.sklearn.log_model(model, 'model')\n\n# 2. DVC 数据版本控制\n# dvc init\n# dvc add data/train.csv\n# git add data/train.csv.dvc\n# dvc push  # 上传到远程存储\n\n# 3. Feast 特征存储\nfrom feast import FeatureStore\nstore = FeatureStore(repo_path='.')\nfeatures = store.get_online_features(\n    features=['user:age', 'user:purchase_count'],\n    entity_rows=[{'user_id': 'u1'}]\n).to_dict()\n\n# 4. BentoML 服务模型\nimport bentoml\nbentoml.pytorch.save_model('resnet', model)\n\n# service.py\nimport bentoml\nmodel_ref = bentoml.pytorch.get('resnet:latest')\nmodel = bentoml.pytorch.load_model(model_ref)\n\n# 5. vLLM 大模型推理\nfrom vllm import LLM, SamplingParams\nllm = LLM(model='meta-llama/Llama-2-7b')\noutputs = llm.generate(['Hello, how are you?'], SamplingParams(temperature=0.7))\n\n# 6. LangChain RAG\nfrom langchain import OpenAI, VectorDBQA\nfrom langchain.embeddings import OpenAIEmbeddings\nqa = VectorDBQA.from_chain_type(\n    llm=OpenAI(),\n    chain_type='stuff',\n    vectorstore=vectorstore\n)\nqa.run('What is MLOps?')"
  },
  {
    "id": "py-polars",
    "title": "Polars 高性能数据处理",
    "level": "高级",
    "content": "**Polars 特点**\n- Rust 编写的 DataFrame 库\n- 比 Pandas 快 5-30 倍，内存效率更高\n- 惰性执行（Lazy Evaluation）：自动查询优化\n- 真正的多线程\n- 流式处理大文件\n\n**与 Pandas 对比**\n| 特性 | Pandas | Polars |\n|------|--------|--------|\n| 后端 | Cython | Rust + Arrow |\n| 执行模式 | Eager | Eager + Lazy |\n| 多线程 | 有限 | 原生 |\n| 大数据 | 内存限制 | 流式/分块 |\n| API | 成熟 | 现代、链式 |\n\n**核心概念**\n- DataFrame / LazyFrame\n- Expressions（表达式）：延迟计算图\n- Contexts：select、filter、group_by、with_columns\n\n**适用场景**\n- 大规模数据清洗（>10GB）\n- ETL 流水线\n- 替换 Pandas 性能瓶颈\n- 与 Apache Arrow 生态集成",
    "example": "# Polars 实战\nimport polars as pl\n\n# 1. 读取数据（比 pd.read_csv 快数倍）\ndf = pl.read_csv('large.csv')\ndf = pl.scan_parquet('s3://bucket/*.parquet')  # 惰性扫描\n\n# 2. 链式操作\nresult = (\n    df.lazy()\n    .filter(pl.col('age') > 18)\n    .group_by('category')\n    .agg([\n        pl.col('amount').sum().alias('total'),\n        pl.col('amount').mean().alias('avg'),\n        pl.col('id').count().alias('count')\n    ])\n    .sort('total', descending=True)\n    .limit(10)\n    .collect()  # 执行优化后的查询计划\n)\n\n# 3. 窗口函数\ndf.with_columns(\n    pl.col('sales').rank(method='dense').over('region').alias('rank')\n)\n\n# 4. 字符串处理\ndf.with_columns(\n    pl.col('email').str.extract(r'(.+)@', 1).alias('username')\n)\n\n# 5. 与 Pandas 互操作\npdf = result.to_pandas()\ndf = pl.from_pandas(pdf)\n\n# 6. 流式处理（内存不足时）\nquery = pl.scan_csv('huge.csv').group_by('key').agg(pl.all().sum())\nquery.sink_parquet('output.parquet')  # 流式输出，不加载全表到内存"
  },
  {
    "id": "py-type-hints",
    "title": "Python 类型提示与静态检查",
    "level": "进阶",
    "content": "**类型提示演进**\n- PEP 484（3.5）-> 现代类型系统\n- typing 模块 -> typing_extensions -> 内置类型\n\n**核心类型**\n- 基本：int、str、float、bool\n- 容器：list[T]、dict[K,V]、set[T]、tuple[T,...]\n- Union：T | None（3.10+）、Union[T1,T2]\n- Optional：Optional[T] = T | None\n- Callable、Iterable、Iterator\n- Generic：TypeVar、Generic[T]\n\n**现代工具**\n- **mypy**：静态类型检查器\n- **pyright / Pylance**：微软类型检查器\n- **Ruff**：超快 Python linter（Rust 编写）\n- **basedpyright**：pyright 增强版\n\n**高级类型**\n- Protocol（结构子类型，类似接口）\n- TypedDict：字典键类型\n- NamedTuple / @dataclass\n- @overload：函数重载\n- Self（3.11+）：返回自身类型\n- TypeAlias（3.10+）：类型别名\n\n**运行时类型检查**\n- Pydantic：数据验证\n- beartype：快速运行时检查\n- typeguard：装饰器检查",
    "example": "# Python 类型提示高级\nfrom typing import Protocol, TypedDict, overload, Self, TypeAlias\nfrom collections.abc import Iterable\n\n# Protocol（结构子类型）\nclass Drawable(Protocol):\n    def draw(self) -> None: ...\n\ndef render(items: Iterable[Drawable]) -> None:\n    for item in items:\n        item.draw()\n\n# TypedDict\nclass Movie(TypedDict):\n    name: str\n    year: int\n    rating: float\n\nm: Movie = {'name': 'Inception', 'year': 2010, 'rating': 9.0}\n\n# @overload\n@overload\ndef process(x: int) -> int: ...\n@overload\ndef process(x: str) -> str: ...\ndef process(x):\n    return x * 2\n\n# Self（3.11+）\nclass Builder:\n    def set_name(self, name: str) -> Self:\n        self.name = name\n        return self\n\n# TypeAlias\nJson: TypeAlias = dict[str, 'Json'] | list['Json'] | str | int | float | None\n\n# mypy 检查\n# mypy app.py --strict\n\n# Ruff（超快 linter + formatter）\n# ruff check .\n# ruff format .\n\n# Pydantic 运行时验证\nfrom pydantic import BaseModel, Field\nclass User(BaseModel):\n    name: str = Field(min_length=1)\n    age: int = Field(ge=0, le=150)\n    email: str\n\nuser = User(name='Alice', age=30, email='alice@example.com')"
  }
],

python_ext4_questions: [
  {
    "q": "Python 3.12 的类型参数语法允许？",
    "level": "进阶",
    "options": ["def func<T>(x: T)","def func[T](x: T)","def func{T}(x: T)","def func(T x)"],
    "answer": 1,
    "explain": "Python 3.12 引入 PEP 695，允许 def func[T](x: T) 语法，无需显式定义 TypeVar。"
  },
  {
    "q": "FastAPI 基于哪个 ASGI 框架？",
    "level": "进阶",
    "options": ["Django","Flask","Starlette","Tornado"],
    "answer": 2,
    "explain": "FastAPI 基于 Starlette（ASGI 工具集）和 Pydantic（数据验证）构建。"
  },
  {
    "q": "asyncio.TaskGroup（3.11+）提供什么能力？",
    "level": "高级",
    "options": ["线程池","结构化并发","进程池","事件循环替换"],
    "answer": 1,
    "explain": "TaskGroup 实现结构化并发，确保组内所有任务完成或异常时统一处理，类似 Go 的 errgroup。"
  },
  {
    "q": "Pydantic v2 相比 v1 的主要提升是？",
    "level": "高级",
    "options": ["更多字段类型","Rust 核心，5-50 倍性能提升","更多验证器","更小体积"],
    "answer": 1,
    "explain": "Pydantic v2 使用 Rust 编写的 pydantic-core，验证速度提升 5-50 倍。"
  },
  {
    "q": "Polars 相比 Pandas 的主要优势是？",
    "level": "高级",
    "options": ["更多函数","Rust + Arrow，更快更省内存，原生多线程","更易用","更成熟"],
    "answer": 1,
    "explain": "Polars 基于 Rust 和 Apache Arrow，提供惰性执行、查询优化、原生多线程，性能远超 Pandas。"
  },
  {
    "q": "Python 3.13 实验性的性能特性是？",
    "level": "进阶",
    "options": ["GIL 移除","JIT 编译器","AOT 编译","静态类型"],
    "answer": 1,
    "explain": "Python 3.13 引入实验性 JIT 编译器（基于 copy-and-patch），以及 --disable-gil 实验选项。"
  },
  {
    "q": "MLflow 的核心功能不包括？",
    "level": "高级",
    "options": ["实验追踪","模型注册","特征存储","模型打包"],
    "answer": 2,
    "explain": "MLflow 提供实验追踪、模型注册、模型打包和部署，特征存储通常由 Feast/Tecton 负责。"
  },
  {
    "q": "FastAPI 的 Depends 用于？",
    "level": "进阶",
    "options": ["数据库连接","依赖注入","中间件","后台任务"],
    "answer": 1,
    "explain": "Depends 是 FastAPI 的依赖注入系统，用于管理共享逻辑如数据库会话、认证、权限。"
  },
  {
    "q": "vLLM 加速大模型推理的核心技术是？",
    "level": "高级",
    "options": ["量化","PagedAttention","FlashAttention","模型并行"],
    "answer": 1,
    "explain": "vLLM 使用 PagedAttention 管理 KV Cache，类似操作系统虚拟内存，大幅提升推理吞吐。"
  },
  {
    "q": "DVC 的主要定位是？",
    "level": "高级",
    "options": ["CI/CD 工具","数据版本控制（Git for Data）","模型训练框架","监控工具"],
    "answer": 1,
    "explain": "DVC（Data Version Control）是数据和模型版本控制工具，与 Git 配合管理大文件和流水线。"
  },
  {
    "q": "Python 的 Protocol 类型（PEP 544）实现的是？",
    "level": "高级",
    "options": ["继承","结构子类型（鸭子类型静态化）","泛型","枚举"],
    "answer": 1,
    "explain": "Protocol 实现结构子类型，不需要显式继承，只要实现指定方法即可通过类型检查（静态鸭子类型）。"
  },
  {
    "q": "Ruff 是用什么语言编写的？",
    "level": "进阶",
    "options": ["C","Rust","Go","Python"],
    "answer": 1,
    "explain": "Ruff 是 Astral 公司用 Rust 编写的超快 Python linter 和代码格式化工具，兼容 Flake8/Black/isort。"
  },
  {
    "q": "LangChain 中 RAG 的全称是？",
    "level": "高级",
    "options": ["Random Access Generation","Retrieval-Augmented Generation","Recursive Auto Generation","Real-time API Gateway"],
    "answer": 1,
    "explain": "RAG = Retrieval-Augmented Generation，检索增强生成，结合向量检索和 LLM 生成回答。"
  },
  {
    "q": "asyncio.Semaphore 的作用是？",
    "level": "进阶",
    "options": ["线程同步","协程并发限流","进程通信","事件通知"],
    "answer": 1,
    "explain": "asyncio.Semaphore 用于限制同时运行的协程数量，实现并发限流。"
  },
  {
    "q": "Polars 的 lazy() 和 collect() 分别代表？",
    "level": "高级",
    "options": ["读取和写入","构建查询计划和执行","过滤和排序","分组和聚合"],
    "answer": 1,
    "explain": "lazy() 切换到惰性模式构建查询计划，collect() 触发执行并返回结果。"
  },
  {
    "q": "BentoML 的主要用途是？",
    "level": "高级",
    "options": ["模型训练","模型服务和部署","数据标注","特征工程"],
    "answer": 1,
    "explain": "BentoML 是模型服务框架，将训练好的模型打包为标准化服务，支持 REST API/gRPC。"
  },
  {
    "q": "Python 3.11 引入的 Self 类型用于？",
    "level": "进阶",
    "options": ["单例模式","返回自身类型（链式调用类型安全）","线程安全","内存安全"],
    "answer": 1,
    "explain": "typing.Self 表示类实例的自身类型，用于链式调用的类型标注，如 builder.set_a().set_b()。"
  },
  {
    "q": "Feast 在 MLOps 中的定位是？",
    "level": "高级",
    "options": ["模型训练","特征存储（Feature Store）","超参调优","模型监控"],
    "answer": 1,
    "explain": "Feast 是开源特征存储，解决特征在线/离线一致性问题，支持特征注册、版本和 serving。"
  },
  {
    "q": "FastAPI 的 BackgroundTasks 适合？",
    "level": "进阶",
    "options": ["CPU 密集型计算","轻量后台任务（如发邮件）","数据库事务","WebSocket"],
    "answer": 1,
    "explain": "BackgroundTasks 适合轻量后台操作，如发送邮件、写日志。CPU 密集型应使用 Celery/ARQ。"
  },
  {
    "q": "Python 3.12 f-string 改进不包括？",
    "level": "进阶",
    "options": ["支持反斜杠","支持任意嵌套","支持 Unicode 转义","支持多行 f-string"],
    "answer": 3,
    "explain": "Python 3.12 解除了 f-string 的嵌套限制，支持反斜杠和 Unicode 转义，但多行 f-string 之前就已支持。"
  },
  {
    "q": "Ollama 的主要功能是？",
    "level": "进阶",
    "options": ["云端大模型 API","本地运行大语言模型","模型微调","数据标注"],
    "answer": 1,
    "explain": "Ollama 是本地大模型运行工具，简化 LLM 的下载、配置和本地推理。"
  },
  {
    "q": "TypedDict 用于？",
    "level": "高级",
    "options": ["类定义","字典键的类型约束","列表类型","函数重载"],
    "answer": 1,
    "explain": "TypedDict 用于给字典的键添加类型注解，确保键名和值类型正确。"
  },
  {
    "q": "mypy --strict 模式会检查？",
    "level": "高级",
    "options": ["语法错误","所有类型注解严格匹配","导入错误","性能问题"],
    "answer": 1,
    "explain": "mypy --strict 启用最严格的类型检查，要求完整的类型注解，禁止隐式 Any。"
  },
  {
    "q": "asyncio.run_in_executor 用于？",
    "level": "高级",
    "options": ["运行异步代码","在线程池中运行阻塞代码","创建新进程","替换事件循环"],
    "answer": 1,
    "explain": "run_in_executor 将阻塞的同步代码（如 requests、文件 IO）提交到线程池，在异步程序中不阻塞事件循环。"
  },
  {
    "q": "Transformers 库来自哪个组织？",
    "level": "进阶",
    "options": ["OpenAI","Hugging Face","Google","Microsoft"],
    "answer": 1,
    "explain": "Hugging Face 的 Transformers 库是最流行的预训练模型库，支持 BERT、GPT、Llama 等。"
  },
  {
    "q": "Python 中 contextvars 的作用是？",
    "level": "高级",
    "options": ["全局变量","协程本地上下文变量","环境变量","配置文件"],
    "answer": 1,
    "explain": "contextvars 提供协程安全的上下文本地存储，在 async/await 中替代线程本地存储（threading.local）。"
  },
  {
    "q": "Pydantic 的 BaseModel 主要提供？",
    "level": "进阶",
    "options": ["ORM 映射","数据解析和运行时验证","Web 路由","缓存"],
    "answer": 1,
    "explain": "BaseModel 提供基于类型提示的数据解析、验证和序列化，是 FastAPI 的数据层基础。"
  },
  {
    "q": "ARQ 相比 Celery 的主要特点是？",
    "level": "高级",
    "options": ["更多功能","基于 asyncio 的异步任务队列","支持更多后端","图形界面"],
    "answer": 1,
    "explain": "ARQ 是 Samuel Colvin（Pydantic 作者）开发的异步任务队列，基于 Redis 和 asyncio，比 Celery 更轻量现代。"
  }
]
