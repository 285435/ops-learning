// === CPP EXT5 ===
cpp_ext5_topics: [
  { id:"cpp-ext5-cpp2x-features", title:"C++20/23/26 新特性深入", desc:"深入掌握Modules模块化、协程coroutine、std::format、std::expected、ranges/views、Contracts展望等现代C++工业级特性。", icon:"📚", level:"advanced" },
  { id:"cpp-ext5-cmake-build", title:"CMake 现代 C++ 构建实践", desc:"基于target的现代CMake、FetchContent依赖拉取、vcpkg/conan包管理集成、交叉编译配置。", icon:"🔨", level:"advanced" },
  { id:"cpp-ext5-perf-opt", title:"C++ 性能剖析与优化", desc:"perf/Linux perf_events、Intel VTune、Hotspot/火焰图、microbenchmark(Google Benchmark)热点定位与低延迟优化。", icon:"⚡", level:"advanced" },
  { id:"cpp-ext5-safety-sa", title:"C++ 安全与静态分析", desc:"Clang-Tidy规则定制、ASan/UBSan/MSan/TSan内存与线程检测、C++ Core Guidelines自动化落地。", icon:"🛡️", level:"advanced" },
  { id:"cpp-ext5-test-ci", title:"C++ 单元测试与 CI/CD", desc:"Google Test/Mock、Catch2、CTest集成、gcov/lcov覆盖率、GitHub Actions C++ pipeline自动化。", icon:"🧪", level:"advanced" },
  { id:"cpp-ext5-interop", title:"C++ 与其他语言互操作", desc:"与C/Rust/Python互操作：pybind11绑定、bindgen/cxx-rs Rust桥接、JNI Java调用、extern C ABI兼容。", icon:"🔗", level:"advanced" }
],
cpp_ext5_questions: [
  {
    id:"cpp-ext5-q001",
    topicId:"cpp-ext5-cpp2x-features",
    title:"C++20 Modules：用 module/import 替代头文件的完整工程化方案",
    content:`### 核心背景
C++20引入Modules是自1985年以来最重大的编译模型变革。传统#include存在三大痛点：
- **文本级包含**：头文件被反复解析，一份<iostream>在100个TU中被解析100次
- **宏泄漏**：头文件中的#define会污染后续包含者，导致ODR和name collision
- **依赖传递**：A包含B包含C，导致修改C时A/B全部重新编译

### Modules核心概念
- **模块单元(Module Unit)**：以module; / export module xxx;声明的编译单元，输出BMI(Binary Module Interface)
- **导入声明import xxx;**：编译器直接读取BMI，不再做文本展开
- **分区(Partition)**：模块内部用module xxx:yyy;拆分，便于大型模块组织
- **私有模块片段GMF**：module; ... 用于兼容legacy头文件
- **export导出语法**：export namespace / export class / export template / export { ... }

### 工程化组织建议
1. **分层策略**：Foundation→Core→App，自底向上依赖
2. **与legacy头文件共存**：在GMF中#include老代码，模块只对外暴露稳定API
3. **标准库模块**：import std.compat;(C++23)或import<vector>;(C++23 header-unit)代替#include
4. **模板与模块**：export template需要在BMI中保留定义，注意显式实例化与export的关系
5. **构建系统**：CMake 3.28+支持CXX_MODULES，需配置CMAKE_CXX_STANDARD=20及编译器路径

### 常见坑
- MSVC的BMI是.ifc，GCC是.gcm，Clang是.pcm，彼此不兼容
- module内static/inline语义与TU内一致，注意内部链接符号
- 循环模块依赖是ill-formed NDR，必须用分区或抽象层打破`,
    example:`// math_functions.cppm - 模块接口文件
module;
#include <cmath>
#include <concepts>
export module math_functions;
import <string>;
import <iostream>;
export namespace mathfunc {
template <typename T> concept Number = std::integral<T> || std::floating_point<T>;
template <Number T> T clamp(T value, T lo, T hi) { return value < lo ? lo : value > hi ? hi : value; }
inline constexpr double PI = 3.141592653589793;
export class Vec3 {
public:
    double x{}, y{}, z{};
    constexpr Vec3() = default;
    constexpr Vec3(double a,double b,double c):x(a),y(b),z(c){}
    constexpr double length_sq() const noexcept { return x*x+y*y+z*z; }
    double length() const { return std::sqrt(length_sq()); }
};
namespace detail { inline int call_count = 0; }
export std::string version() { detail::call_count++; return "math_functions 1.0.0"; }
}`
  },
  {
    id:"cpp-ext5-q002",
    topicId:"cpp-ext5-cpp2x-features",
    title:"C++20 协程：co_await / co_return / co_yield 实现异步任务与生成器",
    content:`### 协程核心模型
C++20 Coroutines是无栈协程(stackless)，由编译器做CPS变换。关键点：
- **Promise Type**：协程内部状态机，定义return_void/return_value/yield_value/initial_suspend/final_suspend等hook
- **Coroutine Handle**：co_await操作者持有，用于resume / destroy / done
- **Awaitable**：支持co_await的对象，必须有await_ready/await_suspend/await_resume
- **分配优化**：编译器可通过HALO省略堆分配

### Promise与Awaiter契约
- promise_type::get_return_object()返回协程句柄包装(例如Task<T>)
- initial_suspend()初始挂起点：std::suspend_never(eager)/suspend_always(lazy)
- return_value(x)/return_void()对应co_return
- yield_value(x)对应co_yield，一般返回suspend_always
- unhandled_exception()捕获异常，通常std::current_exception()保存
- final_suspend() noexcept最终挂起，一般suspend_always由调用者destroy

### 三个典型场景
1. **Generator<T>**：同步生成器，co_yield生产值，迭代器驱动resume
2. **Task<T>/Lazy<T>**：惰性异步任务，co_await等待其他Task完成
3. **AsyncStream<T>**：异步序列，需要自定义await_transform

### 性能要点
- 尽量在栈上存放小协程帧，使用operator new/delete自定义分配器
- eager Task适合短任务，lazy Task适合长链异步
- Symmetric Transfer在await_suspend中return handle直接跳转，避免回到调用者`,
    example:`#include <coroutine>
#include <memory>
#include <exception>
#include <vector>
#include <string>
#include <iostream>
template <typename T> struct Generator {
    struct promise_type;
    using handle_t = std::coroutine_handle<promise_type>;
    struct promise_type {
        T const* value_ptr = nullptr;
        std::exception_ptr ex;
        Generator get_return_object() { return Generator{handle_t::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(T const& v) noexcept { value_ptr = std::addressof(v); return {}; }
        void return_void() noexcept {}
        void unhandled_exception() { ex = std::current_exception(); }
    };
    struct iterator {
        handle_t h; bool done;
        iterator& operator++() { h.resume(); done = h.done(); return *this; }
        T const& operator*() const { return *h.promise().value_ptr; }
        bool operator!=(iterator const& o) const { return done != o.done; }
    };
    handle_t h;
    Generator(handle_t hh):h(hh){}
    ~Generator(){ if(h) h.destroy(); }
    Generator(Generator const&)=delete;
    Generator(Generator&& o) noexcept:h(std::exchange(o.h,{})){}
    iterator begin(){ if(h) h.resume(); return {h, !h||h.done()}; }
    iterator end()  { return {nullptr, true}; }
};
template <typename T> struct Task {
    struct promise_type;
    using handle_t = std::coroutine_handle<promise_type>;
    struct promise_type {
        T result;
        std::exception_ptr ex;
        std::coroutine_handle<> waiter;
        Task get_return_object() { return Task{handle_t::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { if(waiter) waiter.resume(); return {}; }
        template <typename U> void return_value(U&& v) { result = std::forward<U>(v); }
        void unhandled_exception() { ex = std::current_exception(); }
    };
    handle_t h;
    Task(handle_t hh):h(hh){}
    ~Task(){ if(h) h.destroy(); }
    Task(Task const&)=delete;
    Task(Task&& o) noexcept:h(std::exchange(o.h,{})){}
    bool await_ready() noexcept { return h.done(); }
    void await_suspend(std::coroutine_handle<> caller) noexcept { h.promise().waiter = caller; h.resume(); }
    T await_resume() { auto& p=h.promise(); if(p.ex) std::rethrow_exception(p.ex); return std::move(p.result); }
    T blocking_get() { h.resume(); auto& p=h.promise(); if(p.ex) std::rethrow_exception(p.ex); return std::move(p.result); }
};
Generator<int> fib(int n) { int a=0,b=1; for(int i=0;i<n;++i){ co_yield a; int c=a+b; a=b; b=c; } }
Task<int> add_async(int a,int b) { co_return a+b; }
Task<std::string> pipeline() { auto x=co_await add_async(2,3); auto y=co_await add_async(x,10); co_return "result="+std::to_string(y); }
int main() {
    std::cout << "fib: ";
    for(auto v : fib(10)) std::cout << v << ' ';
    std::cout << std::endl << pipeline().blocking_get() << std::endl;
}`
  },
  {
    id:"cpp-ext5-q003",
    topicId:"cpp-ext5-cpp2x-features",
    title:"C++20 std::format / C++23 std::print / 扩展 formatter 完整实践",
    content:`### std::format设计哲学
{fmt}库标准化的产物，C++20起成为标准。核心优势：
- **类型安全**：编译期检查格式串(C++26强制，主流实现通过consteval扩展)
- **性能**：比printf快2~10倍，比iostream快5~20倍，零动态分配可选
- **可扩展**：任何用户类型都可定制std::formatter<T>
- **本地化**：支持L类型specifier与std::locale

### 格式串语法
- 基本：{}自动序号, {0}{1}命名/编号, {name}命名参数
- 格式说明符(冒号后): [fill][align][sign][#][0][width][.prec][L][type]
  - fill/align: _<左对齐、*>右对齐填星号、=^居中填等号
  - sign: +总显示符号、空格正号留空、-仅负号(默认)
  - #: 0b/0x/0前缀(alternate form)
  - type: d十进制、o八进制、x/X十六进制、b/B二进制、e/E/f/F/g/G浮点、a/A十六进制浮点、p指针、s字符串、c字符、?调试转义

### 扩展用户类型三步曲
1. 特化std::formatter<T>
2. 提供parse()：解析格式说明符，用constexpr配合format_parse_context
3. 提供format(const T&, format_context&)：写入输出迭代器，返回迭代器末尾

### C++23新增
- **std::print/println**：直接输出到FILE*/std::ostream，println追加换行
- **std::vprint_unicode**：Windows下正确输出到控制台的Unicode版本
- **编译期格式串检查**：避免运行时抛format_error`,
    example:`#include <format>
#include <print>
#include <iostream>
#include <string>
#include <chrono>
struct Point3D { double x,y,z; std::string label; };
template <> struct std::formatter<Point3D> {
    enum Style { Compact, Verbose, JSON } style = Compact;
    int precision = 2;
    constexpr auto parse(std::format_parse_context& ctx) {
        auto it = ctx.begin(), end = ctx.end();
        while(it != end && *it != '}') {
            switch(*it) {
                case 'c': style=Compact; break;
                case 'v': style=Verbose; break;
                case 'j': style=JSON; break;
                case 'p':
                    ++it; precision = 0;
                    while(it!=end && std::isdigit(static_cast<unsigned char>(*it)))
                        precision = precision*10 + (*it++-'0');
                    --it; break;
                default: throw std::format_error("invalid Point3D format");
            }
            ++it;
        }
        return it;
    }
    auto format(const Point3D& p, std::format_context& ctx) const {
        auto out = ctx.out();
        switch(style) {
            case Compact:
                return std::format_to(out,"({:.{}f},{:.{}f},{:.{}f})",p.x,precision,p.y,precision,p.z,precision);
            case Verbose:
                return std::format_to(out,"Point3D[label={},x={:.{}f},y={:.{}f},z={:.{}f}]",p.label,p.x,precision,p.y,precision,p.z,precision);
            case JSON:
                return std::format_to(out,"{{\"label\":\"{}\",\"x\":{:.{}f},\"y\":{:.{}f},\"z\":{:.{}f}}}",p.label,p.x,precision,p.y,precision,p.z,precision);
        }
        return out;
    }
};
int main() {
    std::println("|{:_<15}|","left");
    std::println("{0:d} = 0b{0:b} = 0x{0:#X} = {0:+010d}", 42);
    std::println("PI ~ {:.10f}", 3.1415926535);
    Point3D p{1.23456, 9.87654, 0.11111, "origin"};
    std::println("default : {}", p);
    std::println("verbose : {:v}", p);
    std::println("JSON p4 : {:jp4}", p);
    using namespace std::chrono_literals;
    auto now = std::chrono::system_clock::now();
    std::println("now = {:%Y-%m-%d %H:%M:%S}", std::chrono::zoned_time{std::chrono::current_zone(), now});
}`
  },
  {
    id:"cpp-ext5-q004",
    topicId:"cpp-ext5-cpp2x-features",
    title:"C++23 std::expected / std::optional / std::variant 错误处理与模式匹配",
    content:`### 三种类型的定位
- **std::optional<T>**：可能没有值(T或nullopt)，适用于缺失但不算错误的场景
- **std::expected<T,E>**：C++23新增，成功为T，失败为E，替代传统错误码/异常二选一
- **std::variant<Ts...>**：多个可选类型之一(C++17)，tagged union，访问用std::visit

### std::expected设计要点
1. **类模板签名**：template<class T, class E> class expected; E必须满足Destructible
2. **构造**：直接用T构造成功态；std::unexpected<E>{e}或std::unexpected(e)构造失败态(CTAD)
3. **访问**：operator*/operator->/value()(抛bad_expected_access)/value_or(fallback)
4. **错误侧**：error()返回E引用，仅当!has_value()时undefined
5. **Monadic操作(C++23必需)**：
   - .and_then(F)：若成功则F(*this)返回新expected，否则转发错误
   - .or_else(F)：若失败则F(error())返回新expected，否则转发成功
   - .transform(F)：对成功值F(T)映射为expected<result_t<E>, E>
   - .transform_error(F)：对错误值F(E)映射为expected<T, result_of_F>

### monadic链式编程的工业价值
- 替代多层if-else嵌套错误检查
- 与协程co_await结合可实现类似Rust?运算符的快速失败(需自定义awaitable)
- transform/and_then的组合避免重复样板代码

### C++26展望：Pattern Matching
- **inspect/match关键字**：对variant/expected/optional做类型安全分支
- **可组合式子模式**：wildcard_、结构体绑定、守卫(if expr)、替代|`,
    example:`#include <expected>
#include <optional>
#include <variant>
#include <iostream>
#include <string>
#include <string_view>
#include <vector>
#include <charconv>
#include <functional>
enum class ParseErr { EmptyInput, InvalidChar, OutOfRange };
std::string_view to_string(ParseErr e) {
    switch(e) {
        case ParseErr::EmptyInput: return "empty input";
        case ParseErr::InvalidChar: return "invalid character";
        case ParseErr::OutOfRange: return "out of int range";
    }
    return "unknown";
}
std::expected<int, ParseErr> parse_int(std::string_view s) {
    if(s.empty()) return std::unexpected(ParseErr::EmptyInput);
    int v = 0;
    auto [ptr,ec] = std::from_chars(s.data(), s.data()+s.size(), v);
    if(ec == std::errc::invalid_argument) return std::unexpected(ParseErr::InvalidChar);
    if(ec == std::errc::result_out_of_range) return std::unexpected(ParseErr::OutOfRange);
    if(ptr != s.data()+s.size()) return std::unexpected(ParseErr::InvalidChar);
    return v;
}
std::expected<double, ParseErr> safe_div(int a,int b) {
    if(b==0) return std::unexpected(ParseErr::OutOfRange);
    return static_cast<double>(a)/b;
}
std::expected<int, std::string> complex_pipeline(std::string_view s) {
    return parse_int(s)
        .transform_error([](ParseErr e) -> std::string { return std::string("parse failed: ")+std::string(to_string(e)); })
        .and_then([](int v) -> std::expected<int, std::string> { if(v<=0) return std::unexpected("must be positive"); return v*2; })
        .transform([](int v) { return v+100; });
}
std::optional<int> find_even(const std::vector<int>& v) {
    for(int x : v) if(x%2==0) return x;
    return std::nullopt;
}
struct Circle { double r; };
struct Rect   { double w,h; };
using Shape = std::variant<Circle, Rect>;
double area(const Shape& s) {
    return std::visit([](auto&& sh) -> double {
        using T = std::decay_t<decltype(sh)>;
        if constexpr (std::is_same_v<T, Circle>) return 3.1415926*sh.r*sh.r;
        else                                     return sh.w*sh.h;
    }, s);
}
#define TRY(var, expr) \
    auto _try_##var = (expr); \
    if(!_try_##var) return std::unexpected(_try_##var.error()); \
    auto var = *_try_##var;
std::expected<double, ParseErr> arithmetic_script(std::string_view a, std::string_view b) {
    TRY(ia, parse_int(a));
    TRY(ib, parse_int(b));
    return safe_div(ia, ib);
}
int main() {
    for(auto s : {"123","abc","","999999999999999"}) {
        auto r = parse_int(s);
        if(r) std::cout << "parse_int("<<s<<")="<<*r<<std::endl;
        else  std::cout << "parse_int("<<s<<") ERR: "<<to_string(r.error())<<std::endl;
    }
    auto chain = complex_pipeline("21");
    if(chain) std::cout << "pipeline => "<<*chain<<std::endl;
    else      std::cout << "pipeline ERR: "<<chain.error()<<std::endl;
    std::vector<int> nums{1,3,5,6,7};
    auto even = find_even(nums).transform([](int x){return x*x;}).and_then([](int x)->std::optional<int>{return x>10?x:std::nullopt;}).value_or(-1);
    std::cout << "even pipeline: " << even << std::endl;
    std::vector<Shape> shapes{Circle{2.0}, Rect{3.0,4.0}};
    for(auto& sh : shapes) std::cout << "area=" << area(sh) << std::endl;
    auto r = arithmetic_script("20","4");
    std::cout << "arithmetic_script: " << r.value_or(-666.0) << std::endl;
}`
  },
  {
    id:"cpp-ext5-q005",
    topicId:"cpp-ext5-cpp2x-features",
    title:"C++20 Ranges & Views：延迟计算流水线、自定义 view 和 Projection 实战",
    content:`### Ranges解决的痛点
传统STL算法要求begin/end显式配对，难以链式：sort(filter(transform(data)))需要多份临时容器。C++20 Ranges引入三大抽象：

### 1. Range/View/Action分层
- **Range**：可迭代范围，有begin()/end()。std::vector/std::string/std::span/int[10]都是Range
- **View**：惰性、零拷贝、可组合的Range适配器。关键：视图的构造与析构都是O(1)，真正计算发生在迭代时
  - 标准Views：views::all/transform/filter/take/drop/reverse/join/split/keys/values/enumerate/zip/iota/...
- **Action**：立即求值，来自range-v3(C++26展望)，例如actions::sort/actions::unique

### 2. 管道运算符|
ranges::to<>(C++23)实现View到容器的eager转换：
auto v = data | views::filter(f) | views::transform(g) | ranges::to<std::vector>();

### 3. Projection投影(C++20算法新签名)
几乎所有ranges::算法支持最后一个投影参数proj：
ranges::sort(employees, {}, &Employee::salary);
// {}默认less，第三个参数是投影：按salary排序，不改变元素本身

### 4. 自定义View三步
1. 推导指引+接口类：继承ranges::view_interface<Derived>，拿到front/back/operator[]/empty/size等
2. 迭代器+sentinel：实现一个iterator(input_iterator足够)和可比较sentinel
3. Range adaptor closure：配合views::all_t用|管道组合

### 5. 性能注意
- Views是惰性，避免把超大view多次遍历(例如size非随机访问是O(n))
- 编译器可充分内联transform/filter，手写循环性能几乎相当
- views::filter会破坏SizedRange属性，之后不能直接取size()，需views::common`,
    example:`#include <ranges>
#include <algorithm>
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <numeric>
#include <format>
namespace rv = std::ranges::views;
namespace rg = std::ranges;
struct Employee { std::string name; int level; double salary; };
int main() {
    std::vector<Employee> staff{
        {"Alice",3,25000.0},{"Bob",5,48000.0},{"Carol",4,36000.0},{"Dave",3,22000.0},{"Eve",6,72000.0}
    };
    rg::sort(staff, [](double a,double b){return a>b;}, &Employee::salary);
    auto senior_names = staff
        | rv::filter([](const Employee& e){return e.level>=4;})
        | rv::transform([](const Employee& e){return e.name;})
        | rg::to<std::vector<std::string>>();
    for(auto& n : senior_names) rg::for_each(n, [](char& c){c=char(std::toupper(unsigned char(c)));});
    for(auto& n : senior_names) std::cout << n << ' ';
    std::cout << std::endl;
    auto total = (rv::iota(1,101)
                  | rv::filter([](int x){return x%3==0;})
                  | rv::transform([](int x){return x*x;})
                  | std::views::common)
                  | std::accumulate(rg::begin, rg::end, 0LL);
    std::println("sum of squares of multiples of 3 in [1,100]: {}", total);
    std::vector<std::string> names{"A","B","C","D"};
    std::vector<int>         scores{88,72,95,60};
    for(auto [i,n,s] : rv::zip(rv::iota(0), names, scores))
        std::println("[{}] {} -> score {}", i, n, s);
    auto seq = rv::iota(1,8);
    for(auto [a,b,c] : seq | rv::adjacent<3>)
        std::println("({},{},{})",a,b,c);
    std::map<std::string,int> inventory{{"apple",5},{"orange",3},{"banana",10}};
    auto keys = inventory | rv::keys | rg::to<std::vector>();
    for(auto k: keys) std::cout << k << ' ';
    std::cout << std::endl;
}`
  },
  {
    id:"cpp-ext5-q006",
    topicId:"cpp-ext5-cmake-build",
    title:"现代 CMake (3.25+)：Target-based 构建、PUBLIC/PRIVATE/INTERFACE 语义",
    content:`### CMake历史包袱与Target化
旧式CMake的核心问题：
- **全局变量污染**：include_directories/link_libraries/add_definitions对后续所有target生效
- **依赖不可传递**：A依赖Boost，B依赖A，B还要自己再include一遍Boost目录
- **配置耦合**：Debug/Release、编译器选项、平台差异散落在脚本各处

现代CMake(3.0+)全部围绕target组织，每个target是一个节点，具备：
- **属性(Properties)**：INCLUDE_DIRECTORIES/COMPILE_DEFINITIONS/COMPILE_OPTIONS/LINK_LIBRARIES/SOURCES/CXX_STANDARD
- **可见性(Usage Requirements)**：PRIVATE/PUBLIC/INTERFACE控制属性的传播方向

### PUBLIC/PRIVATE/INTERFACE精确定义
对target A：
- **PRIVATE**：属性仅在编译A自身时用，不会传给依赖A的别人
- **INTERFACE**：属性不参与编译A，只会传播给#include/link A的消费者
- **PUBLIC** = PRIVATE + INTERFACE：编译A用，同时也传下去

典型规则口诀：
- 实现文件.cpp用到的→PRIVATE
- 头文件.h中用到(模板/inline体/签名类型)→PUBLIC
- 纯转发/纯接口库→INTERFACE(没有源文件的target)

### 常用target_* API
- target_include_directories(T SYSTEM BEFORE PUBLIC \${CMAKE_CURRENT_SOURCE_DIR}/include)
  - SYSTEM：告诉编译器此头文件的警告忽略；BEFORE：插入到列表头部
- target_compile_features(T PUBLIC cxx_std_20)：传播C++标准
- target_compile_definitions(T PRIVATE APPNAME=\"X\")
- target_compile_options(T PRIVATE -Wall -Wextra $<$<CXX_COMPILER_ID:MSVC>:/W4>)
- target_sources(T PRIVATE a.cpp b.cpp)
- target_link_libraries(APP PUBLIC Core PRIVATE Utils)

### 常见反模式
- 仍在使用include_directories/link_libraries→改成target_*
- 硬编码-std=c++20→改用target_compile_features
- file(GLOB SRC *.cpp)→建议显式列源文件
- set(CMAKE_CXX_FLAGS \"...\")→用target_compile_options + generator expression`,
    example:`# ================ 根 CMakeLists.txt ================
cmake_minimum_required(VERSION 3.25 FATAL_ERROR)
project(ModernCMakeApp VERSION 1.2.3 DESCRIPTION "Demo of modern target-based CMake" LANGUAGES CXX)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
option(MCA_BUILD_TESTS "Build tests with Catch2" ON)
option(MCA_USE_SIMD "Enable SIMD intrinsics" ON)
include(CTest)
add_subdirectory(libs/utils)
add_subdirectory(libs/core)
add_subdirectory(apps/main)
if(MCA_BUILD_TESTS) add_subdirectory(tests) endif()

# ============== libs/utils/CMakeLists.txt (Header-only INTERFACE) ==============
add_library(Utils INTERFACE)
add_library(MCA::Utils ALIAS Utils)
target_include_directories(Utils INTERFACE
    $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
target_compile_features(Utils INTERFACE cxx_std_20)
target_compile_definitions(Utils INTERFACE MCA_UTILS_VERSION=100)

# ============== libs/core/CMakeLists.txt ==============
add_library(Core STATIC src/core_impl.cpp src/network.cpp src/serializer.cpp)
add_library(MCA::Core ALIAS Core)
target_include_directories(Core
    PUBLIC  $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include> $<INSTALL_INTERFACE:include>
    PRIVATE \${CMAKE_CURRENT_SOURCE_DIR}/src
)
target_compile_features(Core PUBLIC cxx_std_20)
target_link_libraries(Core PUBLIC MCA::Utils PRIVATE m pthread)
target_compile_options(Core PRIVATE
    $<$<OR:$<CXX_COMPILER_ID:GNU>,$<CXX_COMPILER_ID:Clang>>:-Wall -Wextra -Wpedantic -Wconversion>
    $<$<CXX_COMPILER_ID:MSVC>:/W4 /permissive- /Zc:__cplusplus>
)
target_compile_definitions(Core
    PUBLIC  MCA_CORE_PUBLIC=1
    PRIVATE $<$<BOOL:\${MCA_USE_SIMD}>:MCA_SIMD_ENABLED>
)
target_precompile_headers(Core PRIVATE <vector> <string> <memory> <optional> <expected>)

# ============== apps/main/CMakeLists.txt ==============
add_executable(app_main main.cpp entry.cpp)
target_link_libraries(app_main PRIVATE MCA::Core)
set_target_properties(app_main PROPERTIES OUTPUT_NAME mca-app DEBUG_POSTFIX _d)
`
  },
  {
    id:"cpp-ext5-q007",
    topicId:"cpp-ext5-cmake-build",
    title:"FetchContent + vcpkg 结合：零外部依赖安装的 C++ 工程",
    content:`### 两种依赖管理的定位
- **FetchContent(CMake内置)**：编译期从Git/URL下载源码，直接作为add_subdirectory加入工程。适合：需要改源码、补丁、使用特殊编译选项、调试能进的依赖。
- **vcpkg/Conan**：包管理器，提供预编译二进制或从port编译，跨工程复用build cache。适合：Boost/OpenCV/Qt等大型依赖。

### FetchContent标准姿势
Include(FetchContent)
FetchContent_Declare(catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.5.3 GIT_SHALLOW TRUE SYSTEM
  FIND_PACKAGE_ARGS NAMES Catch2)
FetchContent_MakeAvailable(catch2)

### FetchContent高级
- **FetchContent_GetProperties**：手动调用Populate，灵活控制
- **依赖覆盖**：上层工程声明的同名依赖会覆盖下层的声明
- **Patch**：在FETCHCONTENT_BASE_DIR下对已下载内容执行patch_command
- **SOURCE_SUBDIR**：指定某个子目录作为add_subdirectory的入口(monorepo常见)

### vcpkg manifest模式(vcpkg.json)
现代vcpkg推荐用工程下的vcpkg.json声明依赖，CMake自动集成：
~~~json
{
  "name": "myapp", "version-string": "1.0.0",
  "dependencies": ["boost-regex","fmt",{"name":"opencv4","features":["contrib"]},"catch2"]
}
~~~
触发方式：
- CLI：cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
- CMakePresets.json内定死CMAKE_TOOLCHAIN_FILE

### 两者结合的工程实践
1. **小而纯CMake的依赖(Catch2, spdlog, fmt)**→优先FetchContent，锁定GIT_TAG
2. **巨大的依赖(Boost, OpenCV, Qt)**→vcpkg/conan，省时间
3. **团队内部私有库**→FetchContent + 私有Git URL + CI缓存FETCHCONTENT_BASE_DIR
4. **避免重复**：Catch2在vcpkg也有，FetchContent用FIND_PACKAGE_ARGS NAMES Catch2会先查找本地vcpkg`,
    example:`# ================ CMakePresets.json ================
{
  "version": 6,
  "cmakeMinimumRequired": { "major":3, "minor":25, "patch":0 },
  "configurePresets": [
    {
      "name": "base", "hidden": true,
      "generator": "Ninja",
      "binaryDir": "\${sourceDir}/build/\${presetName}",
      "toolchainFile": "/opt/vcpkg/scripts/buildsystems/vcpkg.cmake",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "RelWithDebInfo",
        "FETCHCONTENT_BASE_DIR": "/tmp/fc-cache"
      }
    },
    { "name": "linux-x64", "inherits": "base", "architecture": { "value": "x64" } }
  ],
  "buildPresets": [
    { "name": "linux-x64", "configurePreset": "linux-x64" }
  ]
}

# ============== vcpkg.json ==============
{
  "name": "photo-pipeline", "version-semver": "2.0.0",
  "dependencies": ["fmt","boost-program-options","opencv4","tbb"],
  "default-features": ["shared"]
}

# ============== CMakeLists.txt (完整实战) ==============
cmake_minimum_required(VERSION 3.25)
project(photo-pipeline VERSION 2.0.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
include(FetchContent)
find_package(fmt    CONFIG REQUIRED)
find_package(OpenCV CONFIG REQUIRED)
find_package(TBB    CONFIG REQUIRED)
FetchContent_Declare(spdlog
  GIT_REPOSITORY https://github.com/gabime/spdlog.git
  GIT_TAG v1.13.0 GIT_SHALLOW TRUE SYSTEM
  FIND_PACKAGE_ARGS NAMES spdlog CONFIG)
FetchContent_Declare(CLI11
  GIT_REPOSITORY https://github.com/CLIUtils/CLI11.git
  GIT_TAG v2.4.2 GIT_SHALLOW TRUE SYSTEM
  FIND_PACKAGE_ARGS NAMES CLI11 CONFIG)
FetchContent_Declare(Catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.5.3 GIT_SHALLOW TRUE SYSTEM
  FIND_PACKAGE_ARGS NAMES Catch2 CONFIG)
FetchContent_MakeAvailable(spdlog CLI11 Catch2)
add_library(pp_core STATIC src/filter/resize.cpp src/filter/denoise.cpp src/pipeline.cpp src/worker_tbb.cpp)
target_include_directories(pp_core PUBLIC include PRIVATE src)
target_link_libraries(pp_core
    PUBLIC  opencv_core opencv_imgproc opencv_imgcodecs TBB::tbb fmt::fmt spdlog::spdlog
    PRIVATE CLI11::CLI11)
add_executable(photo-cli app/cli.cpp)
target_link_libraries(photo-cli PRIVATE pp_core CLI11::CLI11)
enable_testing()
add_executable(pp_tests tests/test_filter.cpp)
target_link_libraries(pp_tests PRIVATE pp_core Catch2::Catch2WithMain)
include(Catch)
catch_discover_tests(pp_tests)
`
  },
  {
    id:"cpp-ext5-q008",
    topicId:"cpp-ext5-cmake-build",
    title:"交叉编译：Android NDK / iOS / ARM Linux toolchain 完整方案",
    content:`### 交叉编译三要素
- **Host/Target/Build**：Build=当前机器，Host=运行编译后工具的机器，Target=最终产物运行的机器。交叉时Target≠Build
- **Toolchain文件**：描述编译器/链接器/系统根目录(sysroot)/标志的cmake脚本，通过-DCMAKE_TOOLCHAIN_FILE=...加载
- **sysroot**：目标系统的头文件和库目录(include/, lib/)，编译时查找头文件优先-isysroot，链接时查找库优先-L

### 常见Toolchain配置项(交叉核心变量)
1. **CMAKE_SYSTEM_NAME**：目标操作系统名(Linux/Android/iOS/Generic)
2. **CMAKE_SYSTEM_PROCESSOR**：目标CPU(aarch64/armv7/x86_64/...)
3. **CMAKE_C_COMPILER/CMAKE_CXX_COMPILER**：交叉编译器绝对路径
4. **CMAKE_SYSROOT**：sysroot路径(iOS的SDKRoot，Android NDK的sysroot)
5. **CMAKE_FIND_ROOT_PATH_MODE_PROGRAM=NEVER**：find_program只找host的
6. **CMAKE_FIND_ROOT_PATH_MODE_LIBRARY=ONLY**：find_library只在sysroot下找
7. **CMAKE_FIND_ROOT_PATH_MODE_INCLUDE=ONLY**：find_path同理
8. **CMAKE_STAGING_PREFIX**：安装到临时目录(Android打包)

### Android NDK交叉
- NDK已自带toolchain file：<ndk>/build/cmake/android.toolchain.cmake
- 关键变量：ANDROID_ABI=arm64-v8a/armeabi-v7a/x86_64; ANDROID_PLATFORM=android-30; ANDROID_STL=c++_shared

### iOS/macOS交叉
- 使用ios-cmake第三方成熟toolchain
- 关键变量：PLATFORM=OS64/SIMULATORARM64/MAC/CATALYST; DEPLOYMENT_TARGET=15.0

### ARM Linux交叉(aarch64-linux-gnu)
- 需要安装toolchain：sudo apt install gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
- 自定义toolchain文件最为灵活`,
    example:`# ================ 1. aarch64-linux-gnu.toolchain.cmake ================
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(CMAKE_C_COMPILER   /usr/bin/aarch64-linux-gnu-gcc-13)
set(CMAKE_CXX_COMPILER /usr/bin/aarch64-linux-gnu-g++-13)
set(CMAKE_AR           /usr/bin/aarch64-linux-gnu-gcc-ar-13)
set(CMAKE_RANLIB       /usr/bin/aarch64-linux-gnu-gcc-ranlib-13)
set(CMAKE_STRIP        /usr/bin/aarch64-linux-gnu-strip)
set(TARGET_SYSROOT /opt/sysroot-rpi-bookworm)
set(CMAKE_SYSROOT \${TARGET_SYSROOT})
set(CMAKE_IGNORE_PATH /usr/lib /usr/lib/x86_64-linux-gnu)
set(CMAKE_FIND_ROOT_PATH \${TARGET_SYSROOT}/opt/vendor)
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
set(CMAKE_CXX_FLAGS_INIT "-O2 -fPIC")
set(CMAKE_EXE_LINKER_FLAGS_INIT "-Wl,-rpath,$ORIGIN/../lib -Wl,--build-id=sha1")
set(CMAKE_CXX_STANDARD_LIBRARIES "-static-libstdc++ -static-libgcc -latomic \${CMAKE_CXX_STANDARD_LIBRARIES}")

# ================ 2. 调用示例 CMakePresets ================
{
  "configurePresets": [
    {
      "name": "rpi-arm64", "generator": "Ninja",
      "toolchainFile": "\${sourceDir}/cmake/aarch64-linux-gnu.toolchain.cmake",
      "binaryDir": "\${sourceDir}/build-rpi",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "VCPKG_TARGET_TRIPLET": "arm64-linux",
        "VCPKG_CHAINLOAD_TOOLCHAIN_FILE": "\${sourceDir}/cmake/aarch64-linux-gnu.toolchain.cmake",
        "CMAKE_TOOLCHAIN_FILE": "/opt/vcpkg/scripts/buildsystems/vcpkg.cmake"
      }
    },
    {
      "name": "android-arm64", "generator": "Ninja",
      "binaryDir": "\${sourceDir}/build-android",
      "cacheVariables": {
        "CMAKE_TOOLCHAIN_FILE": "/opt/android-ndk-r26b/build/cmake/android.toolchain.cmake",
        "ANDROID_ABI": "arm64-v8a",
        "ANDROID_PLATFORM": "android-30",
        "ANDROID_STL": "c++_shared",
        "VCPKG_TARGET_TRIPLET": "arm64-android",
        "VCPKG_CHAINLOAD_TOOLCHAIN_FILE": "/opt/android-ndk-r26b/build/cmake/android.toolchain.cmake"
      }
    }
  ]
}

# ================ 3. find_package 样例 ================
cmake_minimum_required(VERSION 3.25)
project(demo-cross VERSION 1.0 LANGUAGES C CXX)
set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)
find_package(OpenCV 4 REQUIRED COMPONENTS core imgproc)
find_package(fmt CONFIG REQUIRED)
add_executable(demo-cross main.cpp)
target_link_libraries(demo-cross PRIVATE opencv_core opencv_imgproc fmt::fmt)
include(GNUInstallDirs)
set(CMAKE_INSTALL_PREFIX /opt/demo-cross CACHE PATH "" FORCE)
install(TARGETS demo-cross
    RUNTIME DESTINATION \${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
)
`
  },
  {
    id:"cpp-ext5-q009",
    topicId:"cpp-ext5-cmake-build",
    title:"CMake install() / export / 生成 Config.cmake 让别人能 find_package",
    content:`### 目标：让下游工程写三行就能用
find_package(MyCoolLib 1.2 CONFIG REQUIRED)
target_link_libraries(myapp PRIVATE MyCoolLib::Core)
要支持CONFIG模式find_package，你需要安装三件套：
1. **MyCoolLibTargets.cmake**：由install(EXPORT ...)导出的target定义(含include/lib路径、选项)
2. **MyCoolLibConfig.cmake**：手写入口文件，include上面的Targets文件，处理find_dependency
3. **MyCoolLibConfigVersion.cmake**：由write_basic_package_version_file生成，做版本匹配

### install()各种签名速查
- **install(TARGETS Core App EXPORT MyCoolLibTargets ...)**：把TARGET的产物与EXPORT绑定
  - RUNTIME DESTINATION bin; LIBRARY DESTINATION lib(so/dylib); ARCHIVE DESTINATION lib(a/lib)
  - PUBLIC_HEADER DESTINATION include; INCLUDES DESTINATION include(告诉下游自动加-I路径)
- **install(DIRECTORY include/ DESTINATION include FILES_MATCHING PATTERN *.h)**
- **install(EXPORT MyCoolLibTargets NAMESPACE MyCoolLib:: DESTINATION lib/cmake/MyCoolLib)**
- **install(FILES MyCoolLibConfig.cmake ConfigVersion.cmake DESTINATION lib/cmake/MyCoolLib)**

### ConfigVersion.cmake三种兼容策略
- **SameMajorVersion**：主版本相同即可(推荐，语义化版本)
- **SameMinorVersion**：主副都相同；**ExactVersion**：严格一致

### 处理自身依赖：find_dependency
Config.cmake中如果你要找Boost，不能用find_package：
应该用include(CMakeFindDependencyMacro) + find_dependency(Boost ...)
因为find_dependency会把REQUIRED与QUIET等参数从外层find_package透传。

### 构建树内使用(export)
不想install也能find_package：
export(EXPORT MyCoolLibTargets NAMESPACE MyCoolLib:: FILE MyCoolLibTargets.cmake)
配合export(PACKAGE MyCoolLib)注册到~/.cmake/packages/，下游在构建树就能找到。`,
    example:`# ================ CMakeLists.txt (库工程) ================
cmake_minimum_required(VERSION 3.25)
project(MyCoolLib VERSION 1.5.2 DESCRIPTION "Cool library for modern C++" LANGUAGES CXX)
include(GNUInstallDirs)
include(CMakePackageConfigHelpers)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
option(MCL_BUILD_SHARED "Build shared library" OFF)
add_library(Core STATIC src/core/vector.cpp src/core/matrix.cpp src/network/socket.cpp)
add_library(MyCoolLib::Core ALIAS Core)
target_include_directories(Core
    PUBLIC  $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include> $<INSTALL_INTERFACE:\${CMAKE_INSTALL_INCLUDEDIR}>
    PRIVATE \${CMAKE_CURRENT_SOURCE_DIR}/src)
target_compile_features(Core PUBLIC cxx_std_20)
find_package(OpenSSL REQUIRED)
target_link_libraries(Core PUBLIC OpenSSL::SSL OpenSSL::Crypto)
add_library(Containers INTERFACE)
add_library(MyCoolLib::Containers ALIAS Containers)
target_include_directories(Containers INTERFACE
    $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/containers>
    $<INSTALL_INTERFACE:\${CMAKE_INSTALL_INCLUDEDIR}>)
set(MCL_CMAKECONFIG_DIR \${CMAKE_INSTALL_LIBDIR}/cmake/MyCoolLib)
install(TARGETS Core Containers EXPORT MyCoolLibTargets
    LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION \${CMAKE_INSTALL_BINDIR}
    INCLUDES DESTINATION \${CMAKE_INSTALL_INCLUDEDIR})
install(DIRECTORY include/mcl    DESTINATION \${CMAKE_INSTALL_INCLUDEDIR})
install(DIRECTORY containers/mcl DESTINATION \${CMAKE_INSTALL_INCLUDEDIR})
install(EXPORT MyCoolLibTargets NAMESPACE MyCoolLib::
    DESTINATION \${MCL_CMAKECONFIG_DIR} FILE MyCoolLibTargets.cmake)
write_basic_package_version_file(
    "\${CMAKE_CURRENT_BINARY_DIR}/MyCoolLibConfigVersion.cmake"
    VERSION \${PROJECT_VERSION} COMPATIBILITY SameMajorVersion)
configure_package_config_file(
    "\${CMAKE_CURRENT_SOURCE_DIR}/cmake/MyCoolLibConfig.cmake.in"
    "\${CMAKE_CURRENT_BINARY_DIR}/MyCoolLibConfig.cmake"
    INSTALL_DESTINATION \${MCL_CMAKECONFIG_DIR})
install(FILES
    "\${CMAKE_CURRENT_BINARY_DIR}/MyCoolLibConfig.cmake"
    "\${CMAKE_CURRENT_BINARY_DIR}/MyCoolLibConfigVersion.cmake"
    DESTINATION \${MCL_CMAKECONFIG_DIR})

# ================ cmake/MyCoolLibConfig.cmake.in ================
@PACKAGE_INIT@
include(CMakeFindDependencyMacro)
find_dependency(OpenSSL REQUIRED)
include("\${CMAKE_CURRENT_LIST_DIR}/MyCoolLibTargets.cmake")
check_required_components(MyCoolLib)

# ================ 下游 Consumer ================
cmake_minimum_required(VERSION 3.25)
project(ConsumerApp)
set(CMAKE_CXX_STANDARD 20)
find_package(MyCoolLib 1.5 CONFIG REQUIRED)
add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE MyCoolLib::Core MyCoolLib::Containers)
`
  },
  {
    id:"cpp-ext5-q010",
    topicId:"cpp-ext5-cmake-build",
    title:"CMake 性能优化：Unity Build + PCH + ccache + Ninja 构建加速全解",
    content:`### 大型C++工程的四个编译瓶颈
1. **预处理**：#include同一头文件被1000个TU解析1000次
2. **解析/语义分析**：template实例化、constexpr计算、SFINAE、概念检查
3. **代码生成与优化**：LTO/IPO阶段非常慢
4. **链接**：静态库合并、符号解析、debug info巨大

### 1. Unity/Jumbo Build(CMake 3.16+)
将多个源文件拼接为少量jumbo TU，减少重复解析头文件：
- CMAKE_UNITY_BUILD=ON全局开启
- set_target_properties(T PROPERTIES UNITY_BUILD ON UNITY_BUILD_BATCH_SIZE 20)每20个.cpp合并
- 源文件属性SKIP_UNITY_BUILD_INCLUDE：某些文件含namespace {}、static、匿名全局冲突时单独跳过

### 2. Precompiled Headers(PCH)
把最常用的稳定头文件预编译一次：
- target_precompile_headers(T PRIVATE <vector> <string> <fmt/core.h> ...)
- REUSE_FROM可以让一个target复用另一个的PCH，要求编译选项完全一致

### 3. ccache/sccache对象缓存
相同输入(预处理后源码+flags+编译器哈希)命中直接取缓存：
- CMake 3.22+推荐：CMAKE_CXX_COMPILER_LAUNCHER=ccache或sccache
- ccache.conf：max_size=50G; sloppiness=include_file_mtime,pch_defines,time_macros,locale
- sccache相比ccache：支持Rust + 云端存储(S3/GCS/Azure)

### 4. 链接器切换
- mold链接器(Linux)比ld快20~80倍，CMAKE_EXE_LINKER_FLAGS=-fuse-ld=mold
- lld(LLVM)：-fuse-ld=lld；Windows：/DEBUG:FASTLINK + lld-link

### 5. LTO/IPO的权衡
- CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE=ON：Release才开
- ThinLTO(Clang)：-flto=thin，分布式并发比Full LTO快5x

### 综合实践建议
Release: ccache + Ninja + mold + Unity Build + PCH + ThinLTO
Debug:   ccache + Ninja + mold + PCH(不要Unity/IPO)`,
    example:`cmake_minimum_required(VERSION 3.25 FATAL_ERROR)
project(BigProject LANGUAGES CXX VERSION 5.0.0)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
# ---- 1. ccache/sccache ----
find_program(CCACHE_PROGRAM ccache)
find_program(SCCACHE_PROGRAM sccache)
if(SCCACHE_PROGRAM)
    set(CMAKE_C_COMPILER_LAUNCHER "\${SCCACHE_PROGRAM}")
    set(CMAKE_CXX_COMPILER_LAUNCHER "\${SCCACHE_PROGRAM}")
elseif(CCACHE_PROGRAM)
    set(CMAKE_C_COMPILER_LAUNCHER "\${CCACHE_PROGRAM}")
    set(CMAKE_CXX_COMPILER_LAUNCHER "\${CCACHE_PROGRAM}")
endif()
# ---- 2. Unity Build ----
option(ENABLE_UNITY "Enable Unity/Jumbo Build" OFF)
if(ENABLE_UNITY)
    set(CMAKE_UNITY_BUILD ON CACHE BOOL "" FORCE)
    set(CMAKE_UNITY_BUILD_BATCH_SIZE 16 CACHE STRING "" FORCE)
endif()
# ---- 3. 链接器切换 (mold > lld > gold > bfd) ----
if(UNIX AND NOT APPLE)
    foreach(ld_name mold lld gold)
        execute_process(COMMAND \${CMAKE_CXX_COMPILER} -fuse-ld=\${ld_name} -Wl,--version
                        ERROR_QUIET OUTPUT_QUIET RESULT_VARIABLE has_ld)
        if(has_ld EQUAL 0)
            add_link_options("LINKER:--gdb-index")
            add_link_options(-fuse-ld=\${ld_name})
            break()
        endif()
    endforeach()
endif()
# ---- 4. ThinLTO/IPO (Release ONLY) ----
include(CheckIPOSupported)
check_ipo_supported(RESULT ipo_ok)
if(ipo_ok)
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE ON)
    if(CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
        add_compile_options($<$<CONFIG:Release>:-flto=thin>)
        add_link_options   ($<$<CONFIG:Release>:-flto=thin>)
    endif()
endif()
# ---- 5. Core库：PCH + Unity分组 ----
set(CORE_SOURCES src/a.cpp src/b.cpp src/c.cpp src/d.cpp src/e.cpp
                 src/f.cpp src/g.cpp src/h.cpp src/i.cpp src/j.cpp)
add_library(Core STATIC \${CORE_SOURCES})
target_precompile_headers(Core PRIVATE <vector> <string> <memory> <unordered_map>
    <algorithm> <ranges> <fmt/format.h> <spdlog/spdlog.h>)
set_target_properties(Core PROPERTIES UNITY_BUILD_MODE GROUP)
set_source_files_properties(src/a.cpp src/b.cpp src/c.cpp PROPERTIES UNITY_GROUP "g1")
set_source_files_properties(src/d.cpp src/e.cpp src/f.cpp PROPERTIES UNITY_GROUP "g2")
set_source_files_properties(src/l.cpp PROPERTIES SKIP_UNITY_BUILD_INCLUDE ON)
target_include_directories(Core PUBLIC include)
# ---- 6. 可执行：复用PCH ----
add_executable(server apps/server_main.cpp apps/server_config.cpp)
target_link_libraries(server PRIVATE Core)
target_precompile_headers(server REUSE_FROM Core)
`
  },
  {
    id:"cpp-ext5-q011",
    topicId:"cpp-ext5-perf-opt",
    title:"Linux perf：采样剖析CPU热点、Call Graph、火焰图完整工作流",
    content:`### perf(perf_events)核心能力
Linux官方profiling工具，基于CPU硬件性能计数器(PMC)，内核态无侵入。四大能力：
- **CPU采样统计**：统计哪些函数消耗多少CPU时间(top)
- **硬件事件计数**：cache-misses/branch-misses/instructions/cycles/TLB-misses
- **软件事件计数**：page-fault/context-switches/sched-switch/syscalls
- **追踪(Tracing)**：perf trace/ftrace前端，追踪系统调用、函数进入退出

### 典型工作流
1. perf top -g：实时看系统热点(全系统或单进程)
2. perf record -F 997 -g -p <pid> -- sleep 10：采样10秒后生成perf.data
3. perf report -n --stdio：文本报告
4. perf annotate：热点函数的汇编/源码混合注释(看指令级别延迟)
5. perf script | stackcollapse-perf.pl | flamegraph.pl > heat.svg：生成火焰图
6. perf diff：两次perf.data对比，找性能回退

### 关键参数
- **频率-F 997**：采样频率，质数避免与周期性任务节拍共振
- **调用栈-g dwarf/--call-graph fp/lbr**：
  - fp(frame pointer)：快速，需要编译-fno-omit-frame-pointer
  - dwarf：调试信息展开调用栈，慢但准，--call-graph dwarf,16384
  - lbr(Last Branch Record, Intel)：硬件记录跳转，极快，但受深度限制(~32条)
- **事件-e**：cpu-cycles/instructions/cache-misses/branches/page-faults/sched:sched_switch

### 指标解读
- **Top 10占比**：如果单个函数>30%几乎必是优化对象
- **Instructions/Cycle(IPC)**：现代CPU 1.0算差，2.0好，3.0非常好，<0.5通常是memory-bound
- **Cache miss rate**：cache-misses/cache-references，D$ miss<5%，I$ miss<1%
- **Branch miss rate**：<1%好，>5%说明分支预测失败，考虑无分支实现`,
    example:`// hotspots_demo.cpp: 编译
// g++ -std=c++20 -O2 -g -fno-omit-frame-pointer -march=native hotspots_demo.cpp -o hotspots_demo -lfmt
#include <vector>
#include <algorithm>
#include <random>
#include <fmt/core.h>
#include <numeric>
#include <cmath>
static std::vector<double> sort_bench() {
    std::mt19937 rng{42};
    std::vector<double> v(1 << 18);
    std::uniform_real_distribution<double> dist{0.0,1.0};
    std::generate(v.begin(), v.end(), [&]{return dist(rng);});
    std::sort(v.begin(), v.end());
    return v;
}
static double math_bench(const std::vector<double>& sorted) {
    double s = 0.0;
    for(std::size_t i=0;i<sorted.size();++i) {
        double x = sorted[i];
        if(x>0.7) s += std::sqrt(x)*std::log(x+1.0);
        else       s += std::sin(x)+std::cos(x*1.7);
    }
    return s;
}
static double simple_sum(const std::vector<double>& v) {
    return std::accumulate(v.begin(), v.end(), 0.0);
}
int main() {
    double sink = 0.0;
    for(int iter=0; iter<200; ++iter) {
        auto v = sort_bench();
        sink += math_bench(v);
        sink += simple_sum(v);
    }
    fmt::println("sink = {}", sink);
}
/* ===== perf 命令 (bash) =====
1. 实时:  perf top -g -F 997 -p $(pgrep hotspots_demo)
2. 采样:  perf record -F 997 -g --call-graph dwarf,16384 \
            -e cycles:u,instructions:u,cache-misses:u,branch-misses:u \
            -- ./hotspots_demo
          perf report -n --stdio --no-children
          perf annotate math_bench --stdio
3. 统计:  perf stat -e task-clock,cpu-clock,cycles,instructions,\
            cache-references,cache-misses,branches,branch-misses,\
            page-faults,context-switches ./hotspots_demo
4. 火焰图:
   git clone https://github.com/brendangregg/FlameGraph ~/FlameGraph
   perf script | ~/FlameGraph/stackcollapse-perf.pl | ~/FlameGraph/flamegraph.pl > flame.svg
5. perf diff 优化前后:
   perf record -o perf_after.data -F 997 -g -- ./hotspots_demo_v2
   perf diff perf.data perf_after.data
6. cache miss归因: perf record -e cache-misses -g -- ./hotspots_demo
*/`
  },
  {
    id:"cpp-ext5-q012",
    topicId:"cpp-ext5-perf-opt",
    title:"Google Benchmark：标准 microbenchmark 编写、统计显著性与不被优化掉的实践",
    content:`### Google Benchmark(benchmark)定位
GTest团队开发的C++微基准测试库。解决：
- **手动计时不准**：自己写需要warmup、统计median/stdev、避免CPU频率干扰
- **防死代码消除**：benchmark::DoNotOptimize/KeepRunningBatch防止编译器把被测循环整体删除
- **标准化输出**：JSON/CSV，方便导入性能回归CI

### 基本骨架
static void BM_Sort(benchmark::State& state) {
    std::vector<int> v(state.range(0));
    for(auto _ : state) {
        std::fill(v.begin(), v.end(), 42);
        benchmark::DoNotOptimize(v.data());
        benchmark::ClobberMemory();
        std::sort(v.begin(), v.end());
        benchmark::DoNotOptimize(v);
    }
    state.SetComplexityN(state.range(0));
}
BENCHMARK(BM_Sort)->Range(1<<10,1<<20)->Complexity();
BENCHMARK_MAIN();

### 关键API
- state.range(n)：第n维参数
- state.PauseTiming()/ResumeTiming()：准备数据不计时
- **DoNotOptimize(x)**：告诉编译器x是被使用的，禁止把它的生产者整个优化掉
- **ClobberMemory()**：编译屏障+告诉编译器所有内存值可能被改变
- SetBytesProcessed(state.iterations()*N)→输出MB/s吞吐量
- SetItemsProcessed→输出items/s
- **Complexity**：自动拟合O(N),O(N log N),O(N^2)

### benchmark命令行参数
- --benchmark_min_time=0.5s：每case至少跑0.5s
- --benchmark_filter=\"BM_Sort/.*4096\"：用正则选case
- --benchmark_format=json：JSON输出
- --benchmark_repetitions=10：跑10次输出median/stdev
- --benchmark_cpu_time=true：除wall time也统计user CPU时间

### 统计显著性
单次benchmark抖动>10%是常事，需要：
1. 固定机器环境：CPU performance governor，绑核taskset -c 2，关闭turbo boost
2. 至少5次重复：用benchmark自带repetitions或外部脚本
3. 双样本t检验：官方compare.py脚本比较两个JSON是否显著差异`,
    example:`// 编译: g++ -std=c++20 -O3 -march=native my_bench.cpp -lbenchmark -lpthread -o bench
// 运行: taskset -c 2 ./bench --benchmark_repetitions=5 --benchmark_report_aggregates_only=true
#include <benchmark/benchmark.h>
#include <vector>
#include <algorithm>
#include <random>
#include <string>
#include <unordered_map>
#include <map>
#include <numeric>
#include <cstring>
template <typename T>
static std::vector<T> random_vec(std::size_t n, unsigned seed=42) {
    std::mt19937 rng{seed};
    std::uniform_int_distribution<T> dist{};
    std::vector<T> v(n);
    for(auto& e:v) e=dist(rng);
    return v;
}
static void BM_std_sort(benchmark::State& state) {
    auto N = static_cast<std::size_t>(state.range(0));
    auto src = random_vec<int>(N);
    std::vector<int> buf(N);
    for(auto _ : state) {
        state.PauseTiming();
        buf = src;
        state.ResumeTiming();
        std::sort(buf.begin(), buf.end());
        benchmark::DoNotOptimize(buf.data());
        benchmark::ClobberMemory();
    }
    state.SetBytesProcessed(state.iterations()*N*sizeof(int));
    state.SetComplexityN(N);
}
BENCHMARK(BM_std_sort)->RangeMultiplier(2)->Range(1<<10,1<<18)->Complexity(benchmark::oNLogN);
static void BM_umap_find(benchmark::State& state) {
    auto N = static_cast<std::size_t>(state.range(0));
    std::mt19937 rng{42};
    std::uniform_int_distribution<int> dist;
    std::unordered_map<int,int> m;
    std::vector<int> keys(N), queries(N*2);
    for(std::size_t i=0;i<N;++i){ auto k=dist(rng); keys[i]=k; m[k]=static_cast<int>(i); }
    for(auto& q:queries) { auto r=dist(rng); q=(r%2==0)?keys[rng()%N]:r; }
    std::size_t idx=0;
    for(auto _:state) {
        int q = queries[idx++%queries.size()];
        auto it = m.find(q);
        benchmark::DoNotOptimize(it==m.end()?0:it->second);
    }
    state.SetItemsProcessed(state.iterations());
}
BENCHMARK(BM_umap_find)->Range(1<<10,1<<16);
static void BM_rbtree_find(benchmark::State& state) {
    auto N = static_cast<std::size_t>(state.range(0));
    std::mt19937 rng{42};
    std::uniform_int_distribution<int> dist;
    std::map<int,int> m;
    std::vector<int> keys(N), queries(N*2);
    for(std::size_t i=0;i<N;++i){ auto k=dist(rng); keys[i]=k; m[k]=static_cast<int>(i); }
    for(auto& q:queries) { auto r=dist(rng); q=(r%2==0)?keys[rng()%N]:r; }
    std::size_t idx=0;
    for(auto _:state) {
        int q = queries[idx++%queries.size()];
        auto it = m.find(q);
        benchmark::DoNotOptimize(it==m.end()?0:it->second);
    }
    state.SetItemsProcessed(state.iterations());
}
BENCHMARK(BM_rbtree_find)->Range(1<<10,1<<16);
static void BM_memcpy_bandwidth(benchmark::State& state) {
    auto N = state.range(0)*1024;
    std::vector<char> src(N), dst(N);
    std::mt19937_64 rng{7};
    for(auto& c:src) c=static_cast<char>(rng());
    for(auto _:state) {
        std::memcpy(dst.data(), src.data(), N);
        benchmark::DoNotOptimize(dst.data());
        benchmark::ClobberMemory();
    }
    state.SetBytesProcessed(state.iterations()*N);
}
BENCHMARK(BM_memcpy_bandwidth)->RangeMultiplier(2)->Range(1,4<<10)->Unit(benchmark::kMicrosecond);
BENCHMARK_MAIN();
`
  },
  {
    id:"cpp-ext5-q013",
    topicId:"cpp-ext5-perf-opt",
    title:"内存性能优化：Cache-line对齐、false sharing、Object Pool、SOA实战",
    content:`### 现代CPU内存金字塔速度对比
- L1d: ~1.2ns, L2: ~4ns, L3: ~12ns, DDR5 DRAM: ~70~120ns
- 一次L3 miss约等于100次L1。优化关键是局部性(temporal+spatial)。

### 1. Cache Line对齐
- x86_64典型cache line 64B(可通过std::hardware_destructive_interference_size查询，C++17)
- 两个经常被不同核读写的共享变量如果落在同一条64B line，会出现**伪共享(false sharing)**：每次写触发line失效，总线风暴
- 解决方案：alignas(hardware_destructive_interference_size) + padding

### 2. AOS vs SOA
- **AOS(Array of Structs)**：struct Particle { float x,y,z,vx,vy,vz; }; vector<Particle>
- **SOA(Structure of Arrays)**：struct Particles { vector<float> x,y,z,vx,vy,vz; };
- 做计算时如果只用其中2~3个字段，SOA能显著减少cache line浪费(一次读64B全是相同字段)
- SIMD友好：SOA直接_mm256_load_ps一次装8个float，AOS需要复杂的gather/scatter

### 3. Object Pool(对象池)与Arena
- new/delete malloc/free有锁且有碎片
- 分配方式：线性bump allocator(纯顺序分配，reset一下全释放，无析构)/slub(按size class)
- C++20 std::pmr::monotonic_buffer_resource是标准线性分配器
- pool配合pmr::polymorphic_allocator用于STL容器无侵入

### 4. 其他技巧
- **预取__builtin_prefetch(addr, rw, locality)**：提前几个循环开始触发HW prefetch
- **Stream写(非临时写)**：写极大buffer(>L3)时用movntps绕过cache，避免污染
- **大页(HugePage)**：2MB/1GB页减少TLB miss，透明大页THP或libhugetlbfs
- **紧凑结构**：按访问频率排序字段+位域+小整数类型→减少内存占用→提高cache density`,
    example:`#include <iostream>
#include <vector>
#include <thread>
#include <memory_resource>
#include <array>
#include <algorithm>
#include <numeric>
#include <chrono>
#include <random>
static constexpr std::size_t CL =
#if defined(__cpp_lib_hardware_interference_size)
std::hardware_destructive_interference_size;
#else
64;
#endif
struct CountersBad { uint64_t c[6] = {}; };
struct alignas(CL) CountersGood {
    struct alignas(CL) Slot { uint64_t v=0; };
    Slot c[6];
};
static void worker_bad(CountersBad* obj,int idx,int iters){ for(int i=0;i<iters;++i) obj->c[idx]++; }
static void worker_good(CountersGood* obj,int idx,int iters){ for(int i=0;i<iters;++i) obj->c[idx].v++; }
struct ParticleAOS { float x,y,z,vx,vy,vz,mass,temp; uint32_t id; };
struct SceneAOS { std::vector<ParticleAOS> ps; };
struct SceneSOA {
    std::vector<float> x,y,z,vx,vy,vz,mass,temp;
    std::vector<uint32_t> id;
};
static void integrate_aos(SceneAOS& s, float dt) {
    for(auto& p:s.ps) {
        p.vy += -9.8f*dt;
        p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt;
    }
}
static void integrate_soa(SceneSOA& s, float dt) {
    const auto n = s.x.size();
    auto* X=s.x.data(); auto* Y=s.y.data(); auto* Z=s.z.data();
    auto* VX=s.vx.data(); auto* VY=s.vy.data(); auto* VZ=s.vz.data();
    const float gy = -9.8f*dt;
    for(std::size_t i=0;i<n;++i) {
        VY[i] += gy;
        X[i] += VX[i]*dt; Y[i] += VY[i]*dt; Z[i] += VZ[i]*dt;
    }
}
struct Node { int k; float v; Node* next; char extra[24]; };
static void pmr_demo() {
    alignas(std::max_align_t) std::array<std::byte,1<<18> buf;
    std::pmr::monotonic_buffer_resource arena(buf.data(), buf.size());
    std::pmr::polymorphic_allocator<Node> alloc(&arena);
    std::pmr::vector<Node*> nodes(&arena);
    nodes.reserve(2000);
    for(int i=0;i<2000;++i) {
        void* p = alloc.allocate(1);
        auto* n = new(p) Node{i,float(i),nullptr,{}};
        nodes.push_back(n);
    }
    arena.release();
}
int main() {
    using clk = std::chrono::high_resolution_clock;
    CountersBad bad{}; CountersGood good{};
    auto go_bad = [&]{ std::vector<std::jthread> t; for(int i=0;i<6;++i) t.emplace_back(worker_bad,&bad,i,5000000); };
    auto go_good= [&]{ std::vector<std::jthread> t; for(int i=0;i<6;++i) t.emplace_back(worker_good,&good,i,5000000); };
    auto t0=clk::now(); go_bad();
    auto t1=clk::now(); go_good();
    auto t2=clk::now();
    std::cout << "false share bad : " << std::chrono::duration<double>(t1-t0).count() << "s\n";
    std::cout << "false share good: " << std::chrono::duration<double>(t2-t1).count() << "s\n";
    const std::size_t N = 2000000;
    SceneAOS aos; aos.ps.assign(N, ParticleAOS{0,0,0,1.0f,-0.1f,0.1f,1.0f,25.0f,0});
    SceneSOA soa;
    soa.x.assign(N,0); soa.y.assign(N,0); soa.z.assign(N,0);
    soa.vx.assign(N,1.0f); soa.vy.assign(N,-0.1f); soa.vz.assign(N,0.1f);
    soa.mass.assign(N,1); soa.temp.assign(N,25); soa.id.assign(N,0);
    t0=clk::now(); for(int i=0;i<100;++i) integrate_aos(aos,1/60.f);
    t1=clk::now(); for(int i=0;i<100;++i) integrate_soa(soa,1/60.f);
    t2=clk::now();
    std::cout << "AOS 100 steps: " << std::chrono::duration<double,std::milli>(t1-t0).count() << "ms\n";
    std::cout << "SOA 100 steps: " << std::chrono::duration<double,std::milli>(t2-t1).count() << "ms\n";
    pmr_demo();
    return 0;
}`
  },
  {
    id:"cpp-ext5-q014",
    topicId:"cpp-ext5-perf-opt",
    title:"Branchless/SIMD编程：x86_64 SSE4/AVX2实战+编译器向量化要点",
    content:`### CPU指令级并行ILP
现代x86_64 CPU每周期可发射4~6条指令、执行8+次浮点运算。两大杀手：
- **数据依赖**：上一条结果没出来，下一条无法发射
- **控制依赖(分支)**：预测错误→流水线冲刷(penalty 15~20周期)

### 1. 消除分支的技巧
- **查找表(LUT)**：if (c=='a'||c=='e')改成bool lut[256]={...}，一次查表
- **无分支最大最小**：max = a ^ ((a^b)&-(a<b))或std::max(编译器会生成cmov)
- **CMOV(条件传送)**：无分支选x或y
- **Bitwise/算术掩码**：mask=-(cond); x=(x&mask)|(y&~mask);
- **饱和算术**：无分支clamp

### 2. SIMD基础概念
- **128bit SSE**：__m128(4xfloat)/__m128d(2xdouble)/__m128i
- **256bit AVX2**：__m256一次8 floats，大多数CPU 2014年后支持
- **512bit AVX-512**：16 floats

### 3. 常用Intrinsics模式
- Load/Store：_mm256_load_ps/_mm256_storeu_ps(u代表unaligned)
- 算术：_mm256_add_ps/_mm256_mul_ps/_mm256_fmadd_ps(FMA=a*b+c)
- 比较掩码：_mm256_cmp_ps(a,b,_CMP_GT_OQ)→返回__m256，每个lane全0/全1
- Blend：_mm256_blendv_ps(a,b,mask)按mask选a或b，类似CMOV
- Gather(AVX2)：_mm256_i32gather_ps(base,idx8,4)

### 4. 自动向量化(编译器帮你写SIMD)
让Clang/GCC自动向量化的前提：
1. **-O3 -march=native/x86-64-v3**
2. 循环次数可数，不要有break/return数据依赖分支
3. **无别名**：__restrict(C++扩展)或-fno-strict-aliasing
4. **对齐提示**：std::assume_aligned<64>(a.data()); C++20
5. **OpenMP SIMD**：#pragma omp simd reduction(+:sum)`,
    example:`// 编译: g++ -std=c++20 -O3 -march=haswell simd_bench.cpp -o simd_bench -lpthread
#include <iostream>
#include <vector>
#include <immintrin.h>
#include <cmath>
#include <chrono>
#include <random>
static void clamp_branchy(std::vector<float>& v,float lo,float hi) {
    for(auto& x:v){ if(x<lo)x=lo; else if(x>hi)x=hi; }
}
static void clamp_branchless(std::vector<float>& v,float lo,float hi) {
    for(auto& x:v) x = std::clamp(x,lo,hi);
}
static void clamp_avx2(std::vector<float>& v,float lo,float hi) {
    const auto n = v.size(); std::size_t i=0;
    const __m256 vlo = _mm256_set1_ps(lo);
    const __m256 vhi = _mm256_set1_ps(hi);
    for(;i+8<=n;i+=8) {
        __m256 x = _mm256_loadu_ps(&v[i]);
        x = _mm256_max_ps(x,vlo);
        x = _mm256_min_ps(x,vhi);
        _mm256_storeu_ps(&v[i],x);
    }
    for(;i<n;++i) v[i]=std::clamp(v[i],lo,hi);
}
static float dot_scalar(const float* a,const float* b,std::size_t n) {
    float s=0; for(std::size_t i=0;i<n;++i) s+=a[i]*b[i]; return s;
}
#ifdef __AVX2__
static float dot_avx2_fma(const float* a,const float* b,std::size_t n) {
    __m256 acc = _mm256_setzero_ps();
    std::size_t i=0;
    for(;i+32<=n;i+=32) {
        __m256 a0=_mm256_load_ps(a+i+0),  b0=_mm256_load_ps(b+i+0);
        __m256 a1=_mm256_load_ps(a+i+8),  b1=_mm256_load_ps(b+i+8);
        __m256 a2=_mm256_load_ps(a+i+16), b2=_mm256_load_ps(b+i+16);
        __m256 a3=_mm256_load_ps(a+i+24), b3=_mm256_load_ps(b+i+24);
        acc = _mm256_fmadd_ps(a0,b0,acc);
        acc = _mm256_fmadd_ps(a1,b1,acc);
        acc = _mm256_fmadd_ps(a2,b2,acc);
        acc = _mm256_fmadd_ps(a3,b3,acc);
    }
    for(;i+8<=n;i+=8) {
        __m256 ai=_mm256_load_ps(a+i), bi=_mm256_load_ps(b+i);
        acc = _mm256_fmadd_ps(ai,bi,acc);
    }
    alignas(32) float tmp[8]; _mm256_store_ps(tmp,acc);
    float s = tmp[0]+tmp[1]+tmp[2]+tmp[3]+tmp[4]+tmp[5]+tmp[6]+tmp[7];
    for(;i<n;++i) s+=a[i]*b[i];
    return s;
}
#endif
#if defined(__clang__)
#define VEC_LOOP _Pragma("clang loop vectorize(enable) interleave(enable)")
#elif defined(__GNUC__)
#define VEC_LOOP _Pragma("GCC ivdep")
#else
#define VEC_LOOP
#endif
static float sum_with_pragma(const float* __restrict a, std::size_t n) {
    float s=0;
    VEC_LOOP
    for(std::size_t i=0;i<n;++i) s+=a[i];
    return s;
}
template<typename F, typename... Args>
static auto bench(const char* name, int reps, F&& f, Args&&... args) {
    using clk = std::chrono::high_resolution_clock;
    auto t0 = clk::now();
    for(int i=0;i<reps;++i) f(args...);
    auto ms = std::chrono::duration<double,std::milli>(clk::now()-t0).count();
    std::cout << name << " => " << ms << "ms / " << reps << "iter\n";
    return ms;
}
int main() {
    std::mt19937 rng{1234};
    const std::size_t N = 4*1024*1024;
    std::uniform_real_distribution<float> uf(-10.f,10.f);
    std::vector<float> A(N), B(N);
    for(std::size_t i=0;i<N;++i){ A[i]=uf(rng); B[i]=uf(rng); }
    auto C = A;
    bench("clamp_branchy", 50, clamp_branchy, std::ref(C), -1.f, 1.f);
    C = A; bench("clamp_cmov",   50, clamp_branchless, std::ref(C), -1.f, 1.f);
    C = A; bench("clamp_avx2",   50, clamp_avx2,       std::ref(C), -1.f, 1.f);
    bench("dot_scalar", 20, dot_scalar, A.data(), B.data(), N);
#ifdef __AVX2__
    bench("dot_avx2_fma", 20, dot_avx2_fma, A.data(), B.data(), N);
#endif
    bench("sum pragma", 50, sum_with_pragma, A.data(), N);
    float d1 = dot_scalar(A.data(), B.data(), N);
#ifdef __AVX2__
    float d2 = dot_avx2_fma(A.data(), B.data(), N);
    std::cout << "dot match: " << (std::abs(d1-d2)<1e-3f?"YES":"NO") << " d1="<<d1<<" d2="<<d2<<"\n";
#endif
    return 0;
}`
  },
  {
    id:"cpp-ext5-q015",
    topicId:"cpp-ext5-perf-opt",
    title:"Intel VTune深度剖析：Hotspot、Microarchitecture Exploration、Memory Access",
    content:`### VTune相比perf的价值
- **GUI可视化全平台(Win/Linux/macOS原生)**
- **多种预定义分析类型**，不用记PMC事件组合
- **调优建议自动生成**：告诉你哪里cache miss高→改善数据布局
- **深入到微架构**：端口压力、指令分配、前端后端瓶颈
- **多语言支持**：C++/Rust/Java/Python混合

### 三大必用分析类型
#### A. Hotspots Analysis(基础)
- **User-Mode Sampling(UMS)**：低侵入~1%开销，类似perf top，但有调用栈+源码
- **Hardware Event-Based Sampling(EBS)**：用PMC，更精确，需要driver
- **Bottom-Up vs Top-Down Tree**：Bottom-Up找到最耗时函数，Top-Down看谁调用了它

#### B. Microarchitecture Exploration(ME)
基于Intel Top-Down Microarchitecture Method(TMA)分层：
- **Front-End Bound**：指令供应不足(ICache/iTLB miss、跳转过多、代码体积大)
- **Bad Speculation**：分支误预测/机器清除
- **Back-End Bound(Memory/Core)**：
  - Memory Bound：L1/L2/L3/DRAM bound，带宽/延迟瓶颈
  - Core Bound：端口饱和、DIV单元、长链指令依赖
- **Retiring**：理想状态，越高越好
> 例如Retiring只有20%，Memory Bound 60%：明确告诉你是内存问题

#### C. Memory Access Analysis
- **Random vs Sequential**：标记每个分配对象的访问模式
- **Cache Miss归因到具体代码行**：perf只能归到函数，VTune能到源码行
- **DRAM Bandwidth**：查看是否跑满了内存控制器带宽上限

### 性能分析决策树
1. Hotspot → 先找到Top 5热点函数(占总CPU>60%的部分)
2. 如果这些热点在标准库/memcpy → 算法/数据结构有问题，转到ME
3. 如果是自己写的循环 → annotate看汇编级热点
4. 再用ME看Back-End还是Front-End瓶颈
5. Memory Bound→优化数据布局(SOA/紧凑结构)/预取
6. Core Bound→SIMD/循环展开/减少依赖链
7. Bad Speculation→消除分支(LUT/CMOV)`,
    example:`// ============= 示例: VTune典型分析的被测程序 =============
// 编译: icpx -O2 -g -march=skylake -ffast-math vtune_demo.cpp -o vtune_demo -lfmt -lpthread
#include <vector>
#include <random>
#include <fmt/core.h>
#include <algorithm>
#include <cmath>
// ---------- Case 1: Memory Bound (大矩阵按列访问) ----------
struct MatrixAOS {
    // 行优先存储, 但按列读取 => 步长 N 每次
    std::vector<float> data;
    int N;
    MatrixAOS(int n):N(n),data(n*n){}
    float& at(int r,int c){ return data[r*N+c]; }
    float col_sum(int c) const {
        float s=0;
        for(int r=0;r<N;++r) s += data[r*N+c]; // 这里 stride N，非常差的局部性
        return s;
    }
};
// ---------- Case 2: Core Bound + Branch Mispredict ----------
static float math_many_branches(const std::vector<float>& in) {
    float s=0;
    for(float x:in) {
        if     (x < 0.1f) s += std::log(x+1e-6f);
        else if(x < 0.4f) s += std::sqrt(x);
        else if(x < 0.7f) s += std::sin(x*10);
        else if(x < 0.9f) s += std::cos(x*5);
        else              s += std::exp(-x);
    }
    return s;
}
// ---------- Case 3: True Sharing(多线程原子加总抢一把锁) ----------
#include <atomic>
#include <thread>
static std::atomic<long long> global_total{0};
static void worker(std::vector<int> const& v, int s, int e) {
    long long local = 0;
    for(int i=s;i<e;++i) local += v[i] * v[i];
    global_total += local; // 原子加总: contended很少，但global cache line bouncing
}
int main() {
    std::mt19937 rng{99};
    std::uniform_real_distribution<float> fd(0,1);
    std::uniform_int_distribution<int> id(1,100);
    // Case 1
    MatrixAOS m(2048);
    for(auto& x:m.data) x=fd(rng);
    float sum1=0;
    for(int c=0;c<m.N;c+=4) sum1 += m.col_sum(c);
    // Case 2
    std::vector<float> big(4<<20);
    for(auto& x:big) x=fd(rng);
    float sum2 = math_many_branches(big);
    // Case 3
    std::vector<int> nums(12<<20);
    for(auto& x:nums) x=id(rng);
    std::vector<std::jthread> pool;
    int step = (int)nums.size()/6;
    for(int i=0;i<6;++i) pool.emplace_back(worker, std::cref(nums), i*step, (i+1)*step);
    pool.clear();
    fmt::println("sum1={} sum2={} total={}", sum1, sum2, global_total.load());
    return 0;
}
/*
===== VTune GUI 分析步骤 (Linux CLI 版 vtune) =====
1. Hotspots (定位热点函数):
   vtune -collect hotspots -knob sampling-mode=hw -knob enable-stack-collection=true \
         -r hs_result -- ./vtune_demo
   vtune -report hotspots -r hs_result
   -> Top 1: MatrixAOS::col_sum (stride访问, Memory Bound)
   -> Top 2: math_many_branches (branch miss + math kernel)
   -> Top 3: worker (std::atomic 竞争)

2. Microarchitecture Exploration (确认瓶颈类型):
   vtune -collect uarch-exploration -r ue_result -- ./vtune_demo
   vtune -report summary -r ue_result
   查看 TMA 摘要:
   - Back-End Bound: 65%
     - Memory Bound: 52% (确认了Case 1是主因)
   - Bad Speculation: 18% (确认了Case 2分支预测差)
   - Retiring: 17% (低)

3. Memory Access (具体看哪行代码 miss):
   vtune -collect memory-access -knob analyze-mem-objects=true -r mem_result -- ./vtune_demo
   vtune -report memory-access -r mem_result
   -> MatrixAOS::data 这个对象 Random Access 占比 96%, DRAM Bound 级别

4. HPC Performance Characterization (FLOPS vs 理论峰值):
   vtune -collect hpc-performance -r hpc_result -- ./vtune_demo
   -> GFLOPS = 12.3 (Skylake 理论 1T 左右 -> 效率低，不是计算瓶颈，是内存)
*/`
  },
  {
    id:"cpp-ext5-q016",
    topicId:"cpp-ext5-safety-sa",
    title:"Clang-Tidy 定制：自定义检查规则、.clang-tidy配置、CI集成阻断提交",
    content:`### Clang-Tidy能力全景
Clang-Tidy是基于Clang AST的linter/静态分析工具，能力远超-Wall/-Wextra：
- **纯语法检查**：命名规范、include顺序、modernize替换
- **语义分析**：使用移动后的值、未初始化变量、范围for引用错误
- **C++ Core Guidelines自动检查**：cppcoreguidelines-* 几百条规则
- **性能陷阱**：performance-*系列(noexcept move、隐式拷贝、string to int)
- **可维护性**：readability-*(函数长度、圈复杂度、参数数量)
- **可扩展性**：写自定义checker，AST Matcher写规则无需改Clang源码

### .clang-tidy配置文件(INI/YAML混合)
~~~yaml
Checks: >
  -*,
  bugprone-*,
  -bugprone-easily-swappable-parameters,
  cppcoreguidelines-*,
  -cppcoreguidelines-pro-type-reinterpret-cast,
  modernize-*,
  performance-*,
  readability-*,
  -readability-magic-numbers,
  clang-analyzer-*,
  portability-*,
WarningsAsErrors: "*"
HeaderFilterRegex: "include/myproject/.*"
FormatStyle: file
CheckOptions:
  - key:   readability-identifier-naming.ClassCase
    value: CamelCase
  - key:   readability-identifier-naming.FunctionCase
    value: lower_case
  - key:   readability-identifier-naming.VariableCase
    value: lower_case
  - key:   cppcoreguidelines-special-member-functions.AllowSoleDefault
    value: "1"
  - key:   performance-unnecessary-value-param.
    value: true
~~~

### 常用规则分类详解
- **bugprone-use-after-move**：检测std::move之后对象被再次使用(UB的最大来源之一)
- **cppcoreguidelines-owning-memory**：配合gsl::owner<T>标记裸指针谁释放
- **cppcoreguidelines-pro-bounds-pointer-arithmetic**：禁止裸指针算术，强制gsl::span
- **modernize-use-nodiscard**：给返回值未被忽略的函数加[[nodiscard]]
- **performance-unnecessary-copy-initialization**：发现const auto x = bigobj; 可改为&的场景
- **performance-move-const-arg**：发现std::move(一个const对象)无效的move

### CI集成的典型策略
1. **Diff模式**：只对本次改动的文件/行跑tidy(避免历史债务全报)
   - clang-tidy-diff.py、run-clang-tidy.py -checks=...
   - clang-tidy --checks=... -p build src/a.cpp --fix
2. **编译数据库**：需要compile_commands.json(开CMAKE_EXPORT_COMPILE_COMMANDS)
3. **Pre-commit hooks**：pre-commit框架 + clang-format/clang-tidy插件
4. **阻断提交**：CI中tidy的exit status非0即失败，-warnings-as-errors='*'`,
    example:`// ============= 示例代码: 典型被Clang-Tidy抓到的错误 =============
// 编译数据库生成: cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -S . -B build
// 运行: run-clang-tidy.py -p build -checks='bugprone-*,cppcoreguidelines-*,modernize-*,performance-*'
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <cstring>
// [cppcoreguidelines-avoid-non-const-global-variables]
std::vector<int> g_global_state;
// [readability-identifier-naming] 类名不匹配 CamelCase 配置
class bad_style_klass {
public:
    // [cppcoreguidelines-special-member-functions] 定义了析构但没定义/删除copy/move
    ~bad_style_klass() = default;
    // [readability-identifier-length] 单字母参数可读性差
    void do_something(int a, int b) {
        // [bugprone-use-after-move] 移动后又使用
        std::string s = "hello world";
        auto consumer = std::move(s);
        printf("%s\n", s.c_str());  // UB! s 已被 moved-from
        // [performance-unnecessary-copy-initialization] 可改成 const auto&
        auto vec_copy = g_global_state;
        (void)vec_copy;
        (void)a; (void)b;
    }
    // [modernize-use-nodiscard] 纯返回值建议加 [[nodiscard]]
    bool validate(int x) { return x > 0; }
    // [cppcoreguidelines-owning-memory] 裸指针 new 未标记 owner
    int* create_buf(std::size_t n) {
        // [cppcoreguidelines-no-malloc] C++ 不该混用 malloc/free
        int* p = (int*)std::malloc(n * sizeof(int));
        // [cppcoreguidelines-pro-bounds-pointer-arithmetic] 指针算术应换 span
        for(std::size_t i=0;i<n;++i) *(p+i) = (int)i;
        return p;
    }
};
// [performance-unnecessary-value-param] 传值可改为 const&
static int sum(std::vector<int> v) {
    int s=0;
    // [modernize-loop-convert] 可改为 range-for
    for(auto it=v.begin();it!=v.end();++it) s += *it;
    return s;
}
// [modernize-use-auto] 过长类型可用 auto
static std::vector<std::pair<std::string, std::shared_ptr<bad_style_klass>>>
make_pairs() {
    std::vector<std::pair<std::string, std::shared_ptr<bad_style_klass>>> r;
    // [readability-container-size-empty] 用 empty() 代替 size() == 0
    if (r.size() == 0) {
        // [modernize-make-unique] 用 make_unique 而不是 new
        r.emplace_back("a", std::shared_ptr<bad_style_klass>(new bad_style_klass()));
    }
    return r;
}
// [bugprone-easily-swappable-parameters] 两个同类型int参数顺序容易搞错
static int pow_int(int base, int exp) {
    int r = 1;
    // [modernize-use-nullptr] C NULL 宏应换 nullptr
    FILE* fp = fopen("/dev/null","rb"); if(fp != NULL) fclose(fp);
    for(int i=0;i<exp;++i) r *= base;
    return r;
}
int main() {
    bad_style_klass obj;
    obj.do_something(1,2);
    obj.validate(-5);
    std::vector<int> v{3,1,4,1,5};
    sum(v);
    auto pairs = make_pairs();
    // [readability-magic-numbers] 3.14159 魔数应定义为常量
    double area = 3.14159 * 2.0 * 2.0;
    pow_int(3,4);
    return (int)area;  // [cppcoreguidelines-pro-type-cstyle-cast] C风格强转
}
/* ===== CI 集成脚本 (GitHub Actions) =====
- name: Clang-Tidy Check
  run: |
    apt-get install -y clang-tidy-18 jq
    run-clang-tidy-18 -p build -quiet \
      -checks='-*,bugprone-*,cppcoreguidelines-*,modernize-*,performance-*,readability-identifier-naming' \
      src/ apps/ 2>&1 | tee tidy.log
    # 统计 error/warning 数量
    if grep -qE '^[0-9]+ (warning|error)s? generated' tidy.log; then
      grep -E 'warning|error' tidy.log | tail -n 20
      exit 1  # 阻断
    fi
===== pre-commit 配置 =====
repos:
- repo: https://github.com/pre-commit/mirrors-clang-format
  rev: v18.1.0
  hooks: [{id: clang-format, args: [-style=file]}]
- repo: local
  hooks:
  - id: clang-tidy-diff
    name: clang-tidy diff
    entry: bash -c 'clang-tidy-diff.py -p1 -p build -checks="+bugprone-*" < <(git diff -U0 HEAD^)'
    language: system
    always_run: true
*/`
  },
  {
    id:"cpp-ext5-q017",
    topicId:"cpp-ext5-safety-sa",
    title:"AddressSanitizer(ASan)：检测heap/buffer/use-after-free、LeakSanitizer内存泄漏",
    content:`### AddressSanitizer原理
编译期插桩+运行时shadow memory：
- **每字节内存分配**：8字节真实内存对应1字节shadow memory，标记状态
  - 0：可寻址；1~k：部分可寻址(红色区域，redzone)；-1：已释放
- **malloc/free包装**：每次分配前后加redzone，释放后放入隔离队列(不会立即重分配)
- **每个load/store指令前**：编译器插入__asan_load8/__asan_store8检查shadow
- 性能代价：代码x2慢，内存x2~x3开销 (开发/测试环境绝对值得)

### 启动方式
~~~bash
# Clang / GCC 都支持
clang++ -std=c++20 -O1 -g -fsanitize=address -fno-omit-frame-pointer a.cpp -o a
# 常见组合
-fsanitize=address,leak,undefined     # ASan + LSan + UBSan (非常好的开发配置)
# CMake
CMAKE_CXX_FLAGS="-fsanitize=address -fno-omit-frame-pointer"
CMAKE_EXE_LINKER_FLAGS="-fsanitize=address"
~~~

### ASan能检测的错误类型
1. **Heap-buffer-overflow**：堆缓冲区越界(new/malloc)前后访问redzone
2. **Stack-buffer-overflow**：栈上数组越界 (局部数组，redzone在栈帧里)
3. **Global-buffer-overflow**：全局数组越界
4. **Use-after-free**：指针已经delete/释放后再访问(shadow标记为隔离)
5. **Use-after-return/Use-after-scope**：栈局部变量返回后被用 / -fsanitize-address-use-after-scope
6. **Double-free** / Invalid-free (不是malloc来的指针被free)
7. **Memory leaks**：LeakSanitizer(LSan)，退出时扫描未释放内存
8. **Initialization-order-fiasco**：跨TU静态初始化顺序UB (部分情况)

### ASan运行时环境变量
- **ASAN_OPTIONS=detect_leaks=1:halt_on_error=0:log_path=asan.log**
  - detect_leaks=1 开启LSan(默认ASan自带)
  - halt_on_error=0 找多个bug而不是第一个就停
  - log_path=xxx 写到文件(并发进程可分开)
  - **malloc_context_size=30**：泄漏时堆栈深度，默认30，可加大
  - **detect_stack_use_after_return=1**：更贵但检查UAR
  - **allocator_may_return_null=1**：大分配失败允许nullptr (测试OOM场景)

### LeakSanitizer泄漏报告解读
~~~
Direct leak of 100 byte(s) in 1 object(s) allocated from:
    #0 operator new(unsigned long) /.../libsanitizer/asan_new_delete.cc:108
    #1 make_buf() at leak.cpp:5
    #2 main at leak.cpp:12
~~~
- Direct leak：直接没释放；Indirect leak：只持有一个链表里元素的指针，链表next全丢
- Stack traces要带-fno-omit-frame-pointer 或 -g才准确`,
    example:`// 编译: clang++ -std=c++20 -O1 -g -fsanitize=address,leak -fno-omit-frame-pointer asan_demo.cpp -o asan_demo
// 运行: ASAN_OPTIONS=detect_leaks=1:halt_on_error=0 ./asan_demo
#include <cstdlib>
#include <cstring>
#include <memory>
#include <vector>
#include <string>
#include <iostream>
// ============ Bug 1: Heap buffer overflow (越界写) ============
static void heap_overflow() {
    int* p = new int[10];
    for(int i=0;i<=10;++i) p[i] = i;  // i=10 overflow!
    delete[] p;
}
// ============ Bug 2: Stack buffer overflow (栈越界) ============
static int stack_overflow(int idx) {
    char buf[16];
    std::memset(buf, 'A', 16);
    return buf[idx];  // idx = 17/30 触发越界读
}
// ============ Bug 3: Use After Free ============
static void uaf_demo() {
    std::string s = "The quick brown fox";
    auto* p = new std::string(s);
    auto copy = std::move(*p);
    delete p;
    std::cout << *p << "\n";  // use-after-free!
    (void)copy;
}
// ============ Bug 4: Double free ============
static void double_free() {
    int* p = (int*)std::malloc(32*sizeof(int));
    std::free(p);
    std::free(p);  // double free!
}
// ============ Bug 5: Memory leak (LSan catches) ============
static char* leak_buf(const char* text) {
    char* p = new char[std::strlen(text)+1];  // never deleted => leak
    std::strcpy(p, text);
    return p;
}
static void leak_demo() {
    for(int i=0;i<10;++i) {
        auto p = leak_buf("hello leak");
        // 忘记 delete[] p;
        std::cout << (void*)p << '\n';
    }
    // 另外: unique_ptr 不会漏
    auto ok = std::make_unique<std::vector<int>>(100);
}
// ============ Bug 6: Use After Scope ============
static std::string::value_type const* uas_demo() {
    std::string tmp = "temporary string lives on stack";
    return tmp.c_str();  // returns ptr to destroyed stack string!
}
// ============ Bug 7: Initialization order / Global overflow ============
constexpr std::size_t BIG = 32;
static int global_arr[BIG];
static int& global_outofbounds(int i) { return global_arr[i]; }  // i=100 => overflow
int main() {
    // 注: 实际用 ASAN_OPTIONS=halt_on_error=0 让它们依次报错
    // heap_overflow();
    stack_overflow(30);
    // uaf_demo();
    // double_free();
    // leak_demo();
    auto bad_ptr = uas_demo();
    std::cout << "uas ptr: " << (void*)bad_ptr << "\n";
    global_outofbounds(500) = 42;
    return 0;
}
/* ===== 典型 ASan 报告片段 =====
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x614000000068 at pc 0x56...
WRITE of size 4 at 0x614000000068 thread T0
    #0 heap_overflow() at asan_demo.cpp:9
    #1 main at asan_demo.cpp:66
0x614000000068 is located 0 bytes after 40-byte region [0x614000000040,0x614000000068)
allocated by thread T0 here:
    #0 operator new[](unsigned long)
    #1 heap_overflow() at asan_demo.cpp:8
==12345==LeakSanitizer: detected memory leaks
Direct leak of 110 byte(s) in 10 object(s) allocated from:
    #0 operator new[](unsigned long)
    #1 leak_buf(char const*) at asan_demo.cpp:39
    #2 leak_demo()     at asan_demo.cpp:45
SUMMARY: AddressSanitizer: 110 byte(s) leaked in 10 allocation(s).
===== 与 CMake 集成(Debug/Asan profile) =====
add_executable(app main.cpp)
if(CMAKE_BUILD_TYPE STREQUAL "Asan")
    target_compile_options(app PRIVATE -O1 -g -fsanitize=address,leak,undefined -fno-omit-frame-pointer)
    target_link_options   (app PRIVATE     -fsanitize=address,leak,undefined)
endif()
*/`
  },
  {
    id:"cpp-ext5-q018",
    topicId:"cpp-ext5-safety-sa",
    title:"UBSan/MSan/TSan：未定义行为/未初始化内存/数据竞争检测器",
    content:`### Sanitizer全家桶总览
| Sanitizer 缩写 | 全名                           | 检测能力                                    | 速度开销 |
|----------------|--------------------------------|---------------------------------------------|----------|
| ASan           | AddressSanitizer               | 越界/UAF/泄漏/double free                   | x2       |
| UBSan          | UndefinedBehaviorSanitizer     | 整数溢出/空指针解引/对齐错/未定义移位       | x1.25    |
| MSan           | MemorySanitizer                | 未初始化内存读取 (origin追踪)               | x3       |
| TSan           | ThreadSanitizer                | data race / 死锁 (Go/C++/Rust通用)          | x5~x15   |

### 1. UBSan (UndefinedBehaviorSanitizer) - 找UB最轻松的工具
启用：-fsanitize=undefined 或细粒度列表
- **integer**：有/无符号整数溢出 (signed-integer-overflow, unsigned-integer-overflow)
- **nullability**：nullptr解引用、nullptr做成员偏移
- **alignment**：访问一个指针对齐不足(如int*对齐1字节)
- **object-size**：__builtin_object_size 已知size的越界访问
- **float-cast-overflow**：float/double转整数越界
- **vptr**：虚表指针被破坏(如bad_cast)
- **function**：函数指针类型不匹配调用
- **enum**：给enum赋了没定义的值
运行时变量UBSAN_OPTIONS：
- print_stacktrace=1：打印堆栈(默认只打一行)
- halt_on_error=1：第一个UB就终止
- fuzzer-detector=1：配合libFuzzer时的检测

### 2. MSan (MemorySanitizer) - 找未初始化值
痛点：valgrind在-O2下不准，MSan在-O1/-O2下准确。
启用方式：**必须全部代码统一MSan编译**，包括libc++/第三方库，否则极多假阳性。Clang提供MSan化的libc++版本。
- **-fsanitize=memory -fsanitize-memory-track-origins=2**
  - track-origins=1 记录哪次malloc未初始化，=2 保留完整栈
- 误报常见来源：自定义memcpy-like函数未插桩 → 包一层
- MSAN_OPTIONS=poison_in_dtor=1：析构后对象内存被标毒(可防use-after-dtor)

### 3. TSan (ThreadSanitizer) - 数据竞争&死锁
启用：-fsanitize=thread -fPIE -pie -g
- 检测：data race(无同步的并发写+写或写+读)、lock inversion(死锁模式)、signal handler unsafe操作
- TSan维护每块内存的"线程epoch + clock vector"，如果两个不同epoch都写或一读一写就报警
- TSAN_OPTIONS：
  - detect_deadlocks=1 (默认开启)
  - second_deadlock_stack=1
  - history_size=7 (大工程加，存更多栈)
  - suppressions=tsan_supp.txt：忽略第三方库已知race(注意是忽略，不是修复!)
注意：
- TSan内存开销高(x8~x10)，但数据race的准确率>95%
- **必须用-pthread或-std=gnu++**，TSan插桩pthread_mutex_lock等

### 组合建议(CI矩阵)
- **Debug + ASan + UBSan + LSan**：PR 必跑，抓90%内存UB
- **RelWithDebInfo + MSan**：每日nightly，抓剩下10%未初始化
- **Release(或Debug) + TSan**：高并发测试集 nightly，抓data race`,
    example:`// ====== 编译: clang++ -std=c++20 -O1 -g -fsanitize=undefined -fno-sanitize-recover=all ubsan_demo.cpp -o ubsan_demo
//          export UBSAN_OPTIONS=print_stacktrace=1:halt_on_error=0
#include <cstdint>
#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <vector>
#include <memory>
#include <cstring>
// ============ UBSan 能抓到的典型 UB ============
// 1. signed integer overflow (UB)
static int32_t add_overflow() {
    int32_t x = INT32_MAX;
    return x + 1;  // [runtime-error:signed-integer-overflow]
}
// 2. shift 超位数或移负数
static uint32_t bad_shift(uint32_t x, int s) {
    return x << s;  // s = 64 或 s = -1 => [shift]
}
// 3. nullptr deref
static int null_deref(int* p) {
    return *p + 1;  // p=nullptr => [null]
}
// 4. float 转整数溢出 (NaN -> int 也是 UB)
static int cast_overflow() {
    double d = 1e20;
    return (int)d;  // [float-cast-overflow]
}
// 5. alignment: 把 char* 当 int* 可能未对齐
static int unaligned_access() {
    char buf[8] = {1,2,3,4,5,6,7,8};
    int* p = reinterpret_cast<int*>(buf + 1);  // 对齐 1 字节, 需要 4
    return *p;  // [alignment-assumption] 或 SIGBUS
}
// 6. out of bounds enum
enum Color { Red=0, Green=1, Blue=2 };
static Color bad_enum() {
    return (Color)999;  // [enum]
}
// 7. 虚表/多态错用
struct Base { virtual void f(){} };
struct D : Base { void f() override {} };
static void bad_cast() {
    alignas(D) char mem[sizeof(D)];
    std::memset(mem, 0xcc, sizeof mem);
    auto* bp = reinterpret_cast<Base*>(mem);
    bp->f();  // [vptr] bad vptr!
}
// ============ TSan 示例：典型 data race ============
// 编译: clang++ -std=c++20 -fsanitize=thread -O1 -g tsan_demo.cpp -o tsan_demo -lpthread
//       TSAN_OPTIONS=detect_deadlocks=1 ./tsan_demo
static int shared_counter = 0;   // 未 protected!
static std::mutex mtx;
static void inc_nosync(int times) {
    for(int i=0;i<times;++i) shared_counter++; // race!
}
static void dec_ok(int times) {
    for(int i=0;i<times;++i) { std::lock_guard lk(mtx); shared_counter--; }
}
static int tsan_demo_main() {
    std::vector<std::jthread> pool;
    for(int i=0;i<4;++i) pool.emplace_back(inc_nosync, 200000);
    for(int i=0;i<4;++i) pool.emplace_back(dec_ok,    200000);
    pool.clear();
    return shared_counter;
}
// ============ MSan 示例：未初始化值 ============
// 编译: clang++ -stdlib=libc++ -fsanitize=memory -fsanitize-memory-track-origins=2 \
//      -O1 -g -fno-omit-frame-pointer msan_demo.cpp -o msan_demo
static int msan_bad_branch() {
    int uninitialized_on_stack;
    // 用未初始化变量做条件 => MSan: use-of-uninitialized-value
    if (uninitialized_on_stack > 5) {
        return 1;
    }
    return uninitialized_on_stack;
}
static int msan_malloc_used_without_write() {
    int* p = new int[10];
    int s = p[3]; // use of uninitialized heap value
    delete[] p;
    return s;
}
int main() {
    // UBSan cases
    std::cout << "overflow: " << add_overflow() << "\n";
    std::cout << "shift: "    << bad_shift(1u, 64) << "\n";
    // std::cout << "null: "  << null_deref(nullptr) << "\n";
    std::cout << "cast: "     << cast_overflow() << "\n";
    std::cout << "unaligned: "<< unaligned_access() << "\n";
    std::cout << "bad enum: " << (int)bad_enum() << "\n";
    // bad_cast();
    // TSan
    std::cout << "tsan: counter = " << tsan_demo_main() << "\n";
    // MSan
    std::cout << "msan branch: " << msan_bad_branch() << "\n";
    std::cout << "msan malloc: " << msan_malloc_used_without_write() << "\n";
    return 0;
}
/* ===== TSan race 报告节选 =====
WARNING: ThreadSanitizer: data race (pid=123)
  Write of size 4 at 0x562e00001170 by thread T2:
    #0 inc_nosync(int) tsan_demo.cpp:60
    #1 std::__invoke_impl<void, void (*)(int), int> /bits/invoke.h:61
  Previous write of size 4 at 0x562e00001170 by thread T1:
    #0 inc_nosync(int) tsan_demo.cpp:60
SUMMARY: ThreadSanitizer: data race tsan_demo.cpp:60 in inc_nosync(int)
===== MSan 未初始化值 报告节选 (origin追踪) =====
==42==WARNING: MemorySanitizer: use-of-uninitialized-value
    #0 msan_bad_branch() msan_demo.cpp:78
  Uninitialized value was stored to memory at
    #0 operator new[](unsigned long) msan_new_delete.cc:xx
    #1 msan_malloc_used_without_write() msan_demo.cpp:87
  Origin: heap-allocated
SUMMARY: MemorySanitizer: use-of-uninitialized-value msan_demo.cpp:78
*/`
  },
  {
    id:"cpp-ext5-q019",
    topicId:"cpp-ext5-safety-sa",
    title:"C++ Core Guidelines + GSL落地：owner/not_null/span 消除裸指针陷阱",
    content:`### C++ Core Guidelines是什么
Stroustrup + Sutter主导的200+条工业级C++最佳实践，核心原则：
- **Type safety**：无reinterpret_cast、无void*
- **Bounds safety**：无越界访问(用span代替指针+size)
- **Lifetime safety**：无悬垂引用/指针(用owner标记所有权，not_null禁止空)
- **Resource management**：无裸new/delete，用RAII/智能指针

### GSL(Guidelines Support Library) 必需品头文件
三家主流实现都可用：Microsoft.GSL / gsl-lite / Foonathan GSL
- **gsl::owner<T*>**：标记T*是拥有者，不转交给unique_ptr/shared_ptr时必须手动delete，Clang-Tidy(cppcoreguidelines-owning-memory)会检查匹配
- **gsl::not_null<T*>**：编译+运行期保证指针不会是nullptr，构造函数拒绝null，消除一半的nullptr检查
- **gsl::span<T, Extent>**：{指针+长度}安全视图，边界可配(debug断言/release忽略)，传参的首选
  - 替代：void process(int* p, std::size_t n) → void process(gsl::span<int> p)
- **gsl::at()**：带bound check的索引(比容器::at更通用，对span/array/vector都支持)
- **gsl::finally**：ScopeExit/FinalAction，保证scope结束时一定执行
- **gsl::narrow / narrow_cast**：窄化转换检查，失败抛 narrowing_error

### 核心编码规则(和对应的代码改造)
1. **I.11 Never transfer ownership by raw pointer/T&**：
   - 旧：Widget* create_widget(); → 新：std::unique_ptr<Widget> create_widget();
   - 旧：void register_observer(Observer*) → observer用裸指针表示不拥有，可用std::observer_ptr(C++20)或gsl::not_null<Observer*>
2. **F.24 Use span<T> or std::span<T>**：所有(pointer, count)参数都用span替代
3. **G.1 Never dereference an invalid pointer**：not_null<T*> + contracts(C++26)
4. **R.1 Manage resources automatically**：禁止裸new/delete，用make_unique/make_shared
5. **C.21 If you define or suppress any default operation, define or suppress them all**：五法则，避免默认copy不匹配资源

### 团队落地的分阶段策略
1. **第一周：Clang-Tidy启用10条核心规则 + 不阻断**(观察覆盖率)
2. **第一个月：所有新代码强制PR跑diff tidy，老代码增量推进**
3. **第二个月：替换所有(pointer+count)为span，函数返回拥有者都用unique_ptr**
4. **季度：开启cppcoreguidelines-*全规则，逐文件修复**`,
    example:`// ===== 依赖: vcpkg install ms-gsl 或 header-only gsl-lite =====
// CMake:  target_link_libraries(app PRIVATE Microsoft.GSL::GSL)
#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <fstream>
#include <cstring>
#include <gsl/gsl>  // Microsoft.GSL 或 gsl-lite
using namespace gsl;
// ============================================================
// RULE: F.24 Use span instead of (pointer, count)
// ============================================================
// ❌ Bad: (pointer + count)
static void bad_copy_nums(int* dst, const int* src, int n) {
    for(int i=0;i<n;++i) dst[i] = src[i];  // 如果 n > dst 容量, UB!
}
// ✅ Good: span + bounds check
static void good_copy_nums(span<int> dst, span<const int> src) {
    Expects(dst.size() >= src.size());   // contract: precondition
    std::copy(src.begin(), src.end(), dst.begin());
}
static int sum_span(span<const int> s) {
    int total = 0;
    for(std::size_t i=0;i<s.size();++i) total += at(s, i);  // bounds checked
    return total;
}
// ============================================================
// RULE: I.11 Never transfer ownership by raw pointer; use owner<T*>
// ============================================================
// ❌ Bad: 裸指针，不知谁释放
static int* bad_create_buffer(std::size_t n) {
    auto* p = new int[n];                 // who deletes?
    return p;
}
// ✅ Good 1: 最好直接 unique_ptr (首选!)
static std::unique_ptr<int[]> good_create_buffer(std::size_t n) {
    return std::make_unique<int[]>(n);
}
// ✅ Good 2: 如果必须兼容 legacy C API，用 owner<T*> 标注 + tidy 检查
static owner<int*> legacy_malloc_buf(std::size_t bytes) {
    // owner 明确说 "我拥有这块内存，调用者请释放"
    return static_cast<int*>(std::malloc(bytes));
}
static void legacy_free_buf(owner<int*> p) { std::free(p); }
// ============================================================
// RULE: F.23 Use not_null<T*> when pointer must never be null
// ============================================================
// ❌ Bad: 函数首行检查 nullptr, 否则 throw, 全是样板
static int bad_get_length(Widget* w) {
    if(!w) throw std::invalid_argument("w is null!");
    return (int)w->name.size();
}
// 模拟一个 Widget
struct Widget { std::string name; int id; };
// ✅ Good: not_null 让非法输入直接在调用点炸掉 (构造期Assert)
static int good_get_length(not_null<const Widget*> w) {
    // 进入函数时可默认 w != nullptr，不用再检查
    return (int)w->name.size();
}
// 推荐: 传参大多数时候用引用而非指针；必须指针才 not_null<T*>
static int best_get_length(const Widget& w) {
    return (int)w.name.size();
}
// ============================================================
// RULE: narrow / narrow_cast + finally
// ============================================================
static int64_t compute_length(const std::string& s) {
    return (int64_t)s.size() * 3;
}
static void narrow_demo(const std::string& s) {
    int64_t big = compute_length(s);
    // narrow: 运行时检查是否溢出, 溢出抛 narrowing_error
    try {
        int n = narrow<int>(big);
        std::cout << "narrow ok: " << n << "\n";
    } catch(const narrowing_error& e) {
        std::cout << "narrow fail! value=" << big << " > INT_MAX\n";
        // 如果你确定无所谓，就用 narrow_cast (无检查，等同 static_cast，用于 self-document)
        int n = narrow_cast<int>(big);
        std::cout << "narrow_cast: " << n << "\n";
    }
}
// finally: 类似 Go defer / scope_exit
static void process_file(const char* path) {
    FILE* fp = std::fopen(path, "rb");
    if(!fp) return;
    auto close_fp = finally([&]{ std::fclose(fp); }); // 作用域退出(包括异常)一定执行
    char buf[128];
    std::fread(buf, 1, sizeof buf, fp);
    // 即使这里抛异常也不会漏 fclose!
    // ...
}
// ============================================================
// 汇总: Clang-Tidy 规则集 .clang-tidy 推荐
// ============================================================
// Checks: >
//   cppcoreguidelines-owning-memory,
//   cppcoreguidelines-no-malloc,
//   cppcoreguidelines-pro-type-reinterpret-cast,
//   cppcoreguidelines-pro-type-static-cast-downcast,
//   cppcoreguidelines-pro-bounds-pointer-arithmetic,
//   cppcoreguidelines-pro-bounds-array-to-pointer-decay,
//   cppcoreguidelines-special-member-functions,
//   cppcoreguidelines-non-private-member-variables-in-classes,
//   cppcoreguidelines-avoid-magic-numbers,
//   cppcoreguidelines-init-variables,
//   cppcoreguidelines-macro-usage
int main() {
    std::vector<int> src{1,2,3,4,5,6};
    std::vector<int> dst(6);
    good_copy_nums(dst, src);
    std::cout << "sum span=" << sum_span(dst) << "\n";
    auto buf1 = good_create_buffer(100);
    auto buf2 = legacy_malloc_buf(256);
    legacy_free_buf(buf2);
    Widget w{"hello widget", 10};
    std::cout << "w length = " << good_get_length(&w) << " and " << best_get_length(w) << "\n";
    narrow_demo(std::string(1 << 20, 'x'));
    return 0;
}
/* ===== 静态断言 + contracts 展望 C++26 =====
Contracts (P2900R8, C++26 TS):
  int good_get_length(not_null<Widget*> w) [[expects: w != nullptr]]
    [[ensures Ret: Ret >= 0]] {
      return (int)w->name.size();
  }
编译期或运行期 (build profile) 自动触发，和 GSL Expects() 对齐。
*/`
  },
  {
    id:"cpp-ext5-q020",
    topicId:"cpp-ext5-safety-sa",
    title:"静态分析平台化：CodeQL/Infer/SonarQube多引擎CI联动与漏洞分级",
    content:`### 工业级安全分析的三层防线
| 层级 | 工具                    | 时机                  | 目标                               |
|------|-------------------------|-----------------------|------------------------------------|
| L1   | Clang-Tidy / CppCheck  | 本地 IDE + PR diff    | 低延迟，语法/规范级                |
| L2   | Infer(meta static) /   | CI 每 PR 全量          | 跨过程/跨TU数据流分析、空指针     |
|      | CodeQL(Semmle QL)      |                       | 污点传播、CWE-78注入、密码明文    |
| L3   | SonarQube 聚合面板     | 每日 nightly          | 技术债/漏洞趋势追踪、质量门禁     |

### 1. Facebook Infer (InferStatic)
- 语言：C/ObjC/Java/Kotlin/Swift，基于分离逻辑+bi-abduction
- 两大C/C++检查器：
  - **RacerD**：Java/ObjC/C++并发数据竞争检测，无需运行
  - **BufferOverrun**：符号执行+区间分析找越界
- 使用：infer run -- cmake --build build
  输出：infer-out/report.txt + sarif (GitHub可直接显示PR annotation)
- 相比Clang-Tidy：跨函数、跨文件分析；但慢(大型工程30min+)

### 2. GitHub CodeQL
- 把代码当数据库查询：用自定义QL查CWE
- C++ 内置 query packs: cpp-safety/cpp-security-extended/cpp-*
- 典型查询示例：查找所有strcpy调用(CWE-120)或用户输入未过滤就system()(CWE-78)
- CI集成：github/codeql-action@v3 init + autobuild + analyze，结果直接写入Security tab

### 3. SonarQube 平台化
- 角色：多引擎统一入口(内部集成SonarAnalyzer+可接Clang-Tidy/Infer/CodeQL SARIF)
- 质量门禁(Quality Gate)：
  - New Code Vulnerability = 0 (漏洞)
  - New Code Bugs = 0
  - New Code Coverage > 80%
  - 重复率 < 3%
- OWASP Top10 / CWE 映射：直接看到每个命中对应CVE风险分(CVSS 3.1)

### 多引擎结果去重与分级(SARIF归一化)
工具输出统一为SARIF(Static Analysis Results Interchange Format)后：
1. **Fingerprint**：(file+line+checker_id+signature)四元组，避免三个工具报同一bug记三次
2. **漏洞分级**(企业统一标准)：
   - **Critical (CVSS ≥ 9.0)**：SQL注入、远程RCE、硬编码AES密钥
   - **High (7.0-8.9)**：UAF、Double Free、整数溢出可被利用
   - **Medium (4.0-6.9)**：越界读、潜在TOCTOU、未初始化栈变量
   - **Low (0.1-3.9)**：魔数、命名不规范、const-correctness
3. **False Positive标记**：工具间交叉验证，至少两个工具报同一个才算New Bug

### 与CI Pipeline集成的参考
- PR 阶段(10min以内)：clang-tidy-diff + cppcheck --force + Infer增量
- 全量nightly(30min)：CodeQL全量 + SonarQube扫描 + Infer全量
- Release前必须跑：所有L2工具 + SAST阈值门禁`,
    example:`// ============= 示例代码：会被多引擎抓到的典型漏洞 =============
// 对应 CodeQL / Infer / SonarQube 的 CWE 分类
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
// ===== CWE-120: Buffer Copy without Checking Size ('classic overflow') =====
// Infer/CodeQL/CppCheck 都能抓
static void unsafe_copy(const char* user_input) {
    char fixed_buf[64];
    // [CWE-120] user_input 可长于 64 -> stack overflow!
    std::strcpy(fixed_buf, user_input);
    std::printf("%s\n", fixed_buf);
}
// ===== CWE-78: OS Command Injection =====
// CodeQL 污点追踪: main argv -> system() 无过滤
static void run_cmd(const std::string& user_filename) {
    std::string command = "cat " + user_filename;
    // [CWE-78]  user_filename="a; rm -rf /"  => RCE!
    std::system(command.c_str());
}
// ===== CWE-476: NULL Pointer Dereference =====
// Infer + Clang static analyzer 抓
static int nullable_len(const char* s) {
    if(std::rand() % 2 == 0) s = nullptr;
    return (int)std::strlen(s);  // [CWE-476] 50% 概率 crash
}
// ===== CWE-416: Use After Free =====
// ASan + CodeQL 抓; Infer 可能抓到模式类似
static int* uaf_pattern() {
    int* p = new int[10];
    for(int i=0;i<10;++i) p[i] = i*i;
    delete[] p;
    return p;  // 把已释放指针返回/后续访问
}
// ===== CWE-190: Integer Overflow or Wraparound =====
// CodeQL CWE-190 query, UBSan runtime
static int alloc_overflow(int count) {
    // [CWE-190] count > 0x40000000 时 8*count 溢出为小值 -> 分配过小
    int* p = (int*)std::malloc(8 * count);
    if(!p) return -1;
    for(int i=0;i<count;++i) p[i] = i;
    std::free(p);
    return 0;
}
// ===== CWE-377: Insecure Temporary File =====
// CodeQL CWE-377
static void write_temp(const char* payload) {
    // [CWE-377] 用固定名的 /tmp 存在竞态/symlink攻击，应用 mkstemp
    FILE* f = std::fopen("/tmp/app.cache", "wb");
    if(f) { std::fwrite(payload, 1, strlen(payload), f); std::fclose(f); }
}
// ===== CWE-798: Use of Hard-coded Credentials =====
// SonarQube/CodeQL 关键词扫描 + secret scanning
static void connect_db() {
    // [CWE-798] 明文密码提交到 Git = 泄露
    const char* db_uri = "postgresql://admin:MySuperSecret123@db.internal:5432/prod";
    std::cout << "connecting to " << db_uri << "\n";
}
// ===== CWE-252: Unchecked Return Value =====
// SonarQube / clang-tidy bugprone-unused-return-value
static void ignore_return() {
    std::vector<int> v{3,1,2};
    // remove 的返回值应传给 erase，忽略会导致尾元素保留未定义值
    std::remove(v.begin(), v.end(), 1);
}
int main(int argc, char** argv) {
    if(argc < 2) return 1;
    unsafe_copy(argv[1]);
    run_cmd(argv[1]);
    nullable_len("hello");
    auto* p = uaf_pattern();
    std::cout << *p << "\n";
    alloc_overflow(1024);
    write_temp(argv[1]);
    connect_db();
    ignore_return();
    return 0;
}
/* ====== 1. Infer 运行 ======
   infer compile -- cmake -S . -B build ; infer run -- cmake --build build
   infer report --format sarif > infer.sarif
   === 典型 Infer Outcome ===
   bug1: NULL_DEREFERENCE at nullable_len(s): s could be null
   bug2: BUFFER_OVERFLOW_L5 at unsafe_copy -> strcpy length unknown
   bug3: USE_AFTER_FREE uaf_pattern

   ====== 2. CodeQL 运行 (GitHub Actions) ======
- uses: github/codeql-action/init@v3
  with: { languages: 'cpp', queries: security-and-quality }
- uses: github/codeql-action/autobuild@v3
- uses: github/codeql-action/analyze@v3
   === 典型 CodeQL 命中 ===
   cpp/command-line-injection (CWE-78) run_cmd
   cpp/hardcoded-credentials (CWE-798) connect_db
   cpp/tainted-string-format-string  unsafe_copy

   ====== 3. SonarQube 汇总 ======
sonar-scanner \
  -Dsonar.projectKey=my-cpp-app \
  -Dsonar.sources=src \
  -Dsonar.cfamily.compile-commands=build/compile_commands.json \
  -Dsonar.externalIssuesReportPaths=infer.sarif,codeql.sarif,tidy.sarif
   === Quality Gate 结果 ===
   Vulnerabilities: 3 Critical / 5 High / 2 Medium  -> FAIL
   Coverage 71% < 80%   -> FAIL
   阻断合并，等待修复
*/`
  },
  {
    id:"cpp-ext5-q021",
    topicId:"cpp-ext5-test-ci",
    title:"Google Test + Google Mock：FRIEND_TEST、参数化测试、Fixture、死亡测试",
    content:`### GTest 四大能力
1. **断言宏(Assertion)**：
   - ASSERT_* → 失败立即终止当前函数(Fatal)；EXPECT_* → 失败继续(NonFatal)
   - 常见：EQ/NE/LT/LE/GT/GE/TRUE/FALSE/STREQ/STRCASEEQ/FLOAT_EQ/NEAR
   - 自定义匹配：MATCHER_P / ::testing::Matches + ExplainMatchResult
2. **Test Fixture**：多 case 共用 SetUp/TearDown / 共享数据
   - class XxxTest : public ::testing::Test { protected: void SetUp() override {...} };
   - TEST_F(XxxTest, case1) { ... }
3. **参数化测试**：
   - TEST_P + INSTANTIATE_TEST_SUITE_P(Values/ValuesIn/Combine/Bool)
   - 一次写N组输入，避免复制粘贴
4. **GMock**：打桩真实依赖
   - MOCK_METHOD(void, send, (const Packet&), (override,const,nodiscard))
   - EXPECT_CALL(mock_obj, Send(Matches(condition))).Times(3).WillOnce(Return(42))
   - ON_CALL 默认动作；EXPECT_CALL 是期望顺序/次数(严格验证)

### 进阶高级特性
- **FRIEND_TEST(SuiteName, TestName)**：测试类是friend，可以访问private成员(不用把测试接口塞到public API)
- **SCOPED_TRACE("case=", i)**：失败时打印上下文
- **TEST(Suite, Subtest) GTEST_ALLOW_UNINSTANTIATED_PARAMETERIZED_TEST(Suite)**：允许参数化没实例化
- **Death Tests**：ASSERT_DEATH/ASSERT_EXIT 验证被测代码正确调用exit/abort/打印了预期错误
- **Typed Tests / Type-Parameterized Tests**：对多种类型做同一份测试(模板库)
- **GTest Skips**：GTEST_SKIP() 动态跳过用例

### GMock 常见动作(WillOnce/WillRepeatedly)
- Return(x) / ReturnArg<N>() / SetArgReferee<N>(v) / SetArrayArgument<N>(data, end)
- Invoke(f)：调用任意可调用
- DoAll(a1, a2, ..., aN)：多个动作串行执行
- Throw(std::runtime_error("x"))：模拟抛异常

### 顺序与匹配器模式
- **InSequence s**：多个EXPECT_CALL在同一scope里按声明顺序匹配
- **NiceMock<MockX>/NaggyMock/StrictMock**：Nice忽略不关心的调用，Strict严格任何未期望调用都失败
- **参数匹配器**：_ / Eq(42) / Ge(0) / StartsWith("hi") / Field(&T::x, Eq(5)) / Truly(predicate)`,
    example:`#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <string>
#include <vector>
#include <memory>
#include <stdexcept>
#include <fstream>
#include <cstdio>
// ============ 被测业务代码 ============
class Database {
public:
    virtual ~Database() = default;
    virtual bool connect(const std::string& uri) = 0;
    virtual int  query_user_age(const std::string& name) = 0;
    virtual void close() noexcept = 0;
};
class AuthService {
    // 允许 GTest 访问私有成员
    FRIEND_TEST(AuthServiceTest, PrivateHashIsConsistent);
public:
    explicit AuthService(std::unique_ptr<Database> db) : db_(std::move(db)) {}
    bool login(const std::string& user, const std::string& pass) {
        if(user.empty() || pass.empty()) return false;
        if(!db_->connect("postgresql://localhost")) return false;
        int age = db_->query_user_age(user);
        bool ok = (age >= 18) && (hash_password(pass) == stored_hash_of(user));
        db_->close();
        return ok;
    }
    // 业务：按分段折扣算价格
    static double compute_discount(double total, int tier) {
        if(total < 0 || tier < 0 || tier > 5) throw std::invalid_argument("bad args");
        double rates[] = {0.0, 0.03, 0.05, 0.08, 0.12, 0.20};
        return total * (1.0 - rates[tier]);
    }
private:
    std::unique_ptr<Database> db_;
    static uint64_t hash_password(const std::string& s) {
        uint64_t h = 1469598103934665603ull;
        for(unsigned char c : s) { h ^= c; h *= 1099511628211ull; }
        return h;
    }
    static uint64_t stored_hash_of(const std::string& u) {
        if(u == "alice") return hash_password("secret123");
        return 0;
    }
};
// ============ Mock ============
class MockDB : public Database {
public:
    MOCK_METHOD(bool, connect, (const std::string& uri), (override));
    MOCK_METHOD(int,  query_user_age, (const std::string& name), (override));
    MOCK_METHOD(void, close, (), (noexcept, override));
};
// ============ Fixture ============
class AuthServiceTest : public ::testing::Test {
protected:
    void SetUp() override {
        auto mock_db = std::make_unique<MockDB>();
        mock_ = mock_db.get();
        svc_   = std::make_unique<AuthService>(std::move(mock_db));
    }
    // void TearDown() override { ... }
    MockDB* mock_;
    std::unique_ptr<AuthService> svc_;
};
// ============ 基础 TEST_F ============
TEST_F(AuthServiceTest, LoginReturnsFalseIfEmptyInput) {
    EXPECT_FALSE(svc_->login("", ""));
    EXPECT_FALSE(svc_->login("alice", ""));
    EXPECT_FALSE(svc_->login("", "pwd"));
}
TEST_F(AuthServiceTest, LoginSuccessHappyPath) {
    using ::testing::_;
    using ::testing::Return;
    // 顺序敏感: 先 connect -> query -> close
    ::testing::InSequence seq;
    EXPECT_CALL(*mock_, connect("postgresql://localhost")).WillOnce(Return(true));
    EXPECT_CALL(*mock_, query_user_age("alice")).WillOnce(Return(25));
    EXPECT_CALL(*mock_, close()).Times(1);
    EXPECT_TRUE(svc_->login("alice", "secret123"));
}
TEST_F(AuthServiceTest, LoginRejectsUnder18) {
    using ::testing::Return;
    ON_CALL(*mock_, connect).WillByDefault(Return(true));
    EXPECT_CALL(*mock_, query_user_age("bob")).WillOnce(Return(12));
    EXPECT_CALL(*mock_, close()).Times(1);
    EXPECT_FALSE(svc_->login("bob", "whatever"));
}
// ============ 参数化测试: compute_discount ============
struct DiscountParam { double total; int tier; double expected; };
class DiscountTest : public AuthServiceTest,
                     public ::testing::WithParamInterface<DiscountParam> {};
TEST_P(DiscountTest, CorrectFormula) {
    const auto& p = GetParam();
    EXPECT_NEAR(AuthService::compute_discount(p.total, p.tier),
                p.expected, 1e-9);
}
INSTANTIATE_TEST_SUITE_P(
    DiscountTables, DiscountTest,
    ::testing::Values(
        DiscountParam{100.00, 0, 100.0 * (1.0 - 0.00)},
        DiscountParam{100.00, 1, 100.0 * (1.0 - 0.03)},
        DiscountParam{100.00, 5, 100.0 * (1.0 - 0.20)},
        DiscountParam{  0.00, 3, 0.0}
    )
);
// ============ 抛异常测试 + 自定义匹配器 ============
TEST(AuthServiceNoFixture, DiscountThrowsOnBadInput) {
    EXPECT_THROW(AuthService::compute_discount(-1, 1), std::invalid_argument);
    EXPECT_THROW(AuthService::compute_discount(100, 6), std::invalid_argument);
    EXPECT_NO_THROW(AuthService::compute_discount(0,0));
}
MATCHER_P(StartsWithN, n, "string length >= n") {
    *result_listener << "len is " << arg.size();
    return arg.size() >= std::size_t(n);
}
TEST(MatcherDemo, CustomMatcher) {
    using ::testing::Matches;
    EXPECT_THAT(std::string("hello world"), StartsWithN(3));
}
// ============ FRIEND_TEST 直接测私有函数 ============
TEST_F(AuthServiceTest, PrivateHashIsConsistent) {
    auto h1 = AuthService::hash_password("abc");
    auto h2 = AuthService::hash_password("abc");
    auto h3 = AuthService::hash_password("abd");
    EXPECT_EQ(h1, h2);
    EXPECT_NE(h1, h3);
}
// ============ 死亡测试 ============
TEST(DeathDemo, AssertExitOnFatal) {
    // 被测代码里: if(x) { fprintf(stderr,"bad\n"); std::exit(1); }
    // ASSERT_DEATH([](){ std::abort(); }(), "");
}
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    ::testing::InitGoogleMock(&argc, argv);
    return RUN_ALL_TESTS();
}
/* ===== CMakeLists.txt 集成 =====
find_package(GTest CONFIG REQUIRED)
find_package(GMock CONFIG REQUIRED)
add_executable(my_tests test_auth.cpp)
target_link_libraries(my_tests PRIVATE GTest::gtest GTest::gmock GTest::gtest_main)
include(GoogleTest)
gtest_discover_tests(my_tests)   # 注册到 CTest
*/`
  },
  {
    id:"cpp-ext5-q022",
    topicId:"cpp-ext5-test-ci",
    title:"Catch2 v3：BDD风格 + SECTION、Approx浮点比较、基准测试",
    content:`### Catch2 vs GTest 选型对比
| 维度              | Catch2 v3                          | GTest/GMock                  |
|-------------------|------------------------------------|------------------------------|
| Header-only?      | 混合：默认静态库(也可HEADER_ONLY) | 必须编译库                    |
| 断言风格          | REQUIRE/CHECK 自然表达式，漂亮错误 | ASSERT_EQ/EXPECT_EQ 宏式     |
| 参数化/表驱动    | GENERATE + DataClass               | INSTANTIATE_TEST_SUITE_P     |
| BDD               | SCENARIO/GIVEN/WHEN/THEN 一等公民  | 第三方扩展                   |
| 内置benchmark     | BENCHMARK 宏(无需Google Benchmark) | 没有                         |
| Mock              | 用 Trompeloeil 或 FakeIt            | 内置GMock                    |

### Catch2 三大语法核心
1. **TestCase + SECTION(Fact/Fixture)**：
   - TEST_CASE("vector grow", "[vector][container]")
   - SECTION("push_back adds 1") { ... } 每次进入新section都重新执行test case前半段(set up)
2. **REQUIRE / CHECK / REQUIRE_FALSE / CHECK_FALSE**：
   - REQUIRE(expr)：失败终止case。CHECK失败继续
   - REQUIRE_NOTHROW(expr)/REQUIRE_THROWS(expr)/REQUIRE_THROWS_AS(expr, MyExc)
3. **Approx**浮点比较，比 EXPECT_NEAR 灵活：
   - REQUIRE(sum == Approx(3.14).epsilon(0.001).margin(0.01))
   - Approx::custom() 做自定义精度

### 参数化测试：GENERATE
~~~cpp
TEST_CASE("square of N", "[math]") {
    int n = GENERATE(1,2,3,5,10);
    int expected_sq = n*n;
    REQUIRE(n*n == expected_sq);
}
// 或表格: GENERATE_COPY(table<tuple<int,int>>({{1,1},{2,4},{3,9}}))
//         auto [a,b] = GENERATE_COPY(...)
~~~

### BDD 风格(推荐)
SCENARIO("user login flow", "[auth]") {
  GIVEN("a user with correct password") { ... create user }
  WHEN("she submits login form") { ... invoke }
  THEN("she gets a token with ttl=3600") { REQUIRE(token.ttl == 3600); }
}

### Benchmark内嵌
~~~cpp
TEST_CASE("vector push_back bench", "[!benchmark]") {
    std::vector<int> v;
    BENCHMARK("push_back 100k") {
        v.clear();
        for(int i=0;i<100000;++i) v.push_back(i);
        return v.size();
    };
}
~~~

### CTest集成
Include(Catch) + catch_discover_tests(my_tests) 同GTest用法。`,
    example:`// ======= 编译: g++ -std=c++20 -O2 -I catch2/single_include catch2_demo.cpp \
//                  -L catch2/build/src -lCatch2Main -lCatch2 -o catch2_demo
// 运行: ./catch2_demo -s  或  ./catch2_demo "[auth]" 过滤标签
#include <catch2/catch_all.hpp>
#include <vector>
#include <string>
#include <map>
#include <cmath>
#include <stdexcept>
#include <numeric>
#include <random>
// ============ 被测业务 ============
struct User {
    std::string name;
    std::string pass_hash;
    int         age;
    bool        active;
};
class UserStore {
    std::map<std::string, User> users_;
public:
    void add(User u) { users_.emplace(u.name, std::move(u)); }
    std::optional<User> find(std::string const& name) const {
        auto it = users_.find(name);
        return it == users_.end() ? std::nullopt : std::optional(it->second);
    }
    bool authenticate(const std::string& name, const std::string& pass) const {
        auto u = find(name);
        if(!u) return false;
        if(!u->active) return false;
        return u->pass_hash == hash(pass);
    }
    static std::string hash(const std::string& s) {
        uint64_t h = 0xcbf29ce484222325ull;
        for(unsigned char c:s) { h ^= c; h *= 0x100000001b3ull; }
        return std::to_string(h);
    }
};
// ============ SECTION 风格 ============
TEST_CASE("UserStore basics", "[store][user]") {
    UserStore s;
    s.add({"alice", UserStore::hash("alice-pass"), 25, true});
    s.add({"bob",   UserStore::hash("bob-pass"),   17, true});
    s.add({"chad",  UserStore::hash("chad-pass"),  33, false});

    SECTION("find finds users that exist") {
        auto a = s.find("alice");
        REQUIRE(a.has_value());
        REQUIRE(a->name == "alice");
        REQUIRE(a->age == 25);
    }
    SECTION("find returns nullopt for unknown") {
        REQUIRE_FALSE(s.find("dave").has_value());
    }
    SECTION("authenticate happy paths") {
        REQUIRE(s.authenticate("alice","alice-pass"));
    }
    SECTION("authenticate rejects inactive users") {
        REQUIRE_FALSE(s.authenticate("chad","chad-pass"));
    }
    SECTION("authenticate rejects bad pass") {
        REQUIRE_FALSE(s.authenticate("alice","wrong"));
    }
    SECTION("age >= 18 is adult") {
        auto alice = *s.find("alice");
        auto bob   = *s.find("bob");
        REQUIRE(alice.age >= 18);
        REQUIRE(bob.age < 18);
    }
}
// ============ BDD 风格 ============
SCENARIO("user login flow", "[auth][bdd]") {
    GIVEN("a UserStore with an active alice and inactive carol") {
        UserStore store;
        store.add({"alice", UserStore::hash("pw123"), 25, true});
        store.add({"carol", UserStore::hash("pw456"), 40, false});

        WHEN("alice logs in with correct password") {
            bool ok = store.authenticate("alice","pw123");
            THEN("login succeeds") { REQUIRE(ok); }
        }
        WHEN("alice uses wrong password") {
            bool ok = store.authenticate("alice","wrong");
            THEN("login is rejected") { REQUIRE_FALSE(ok); }
        }
        WHEN("carol logs in correctly but is inactive") {
            bool ok = store.authenticate("carol","pw456");
            THEN("login is rejected") { REQUIRE_FALSE(ok); }
        }
        WHEN("unknown user eve tries to login") {
            bool ok = store.authenticate("eve","anything");
            THEN("login is rejected") { REQUIRE_FALSE(ok); }
        }
    }
}
// ============ Approx 浮点比较 ============
TEST_CASE("floating point math", "[math]") {
    double a = std::sin(0.5) * std::sin(0.5) + std::cos(0.5) * std::cos(0.5);
    REQUIRE(a == Catch::Approx(1.0).epsilon(1e-12));
    double pi_approx = 22.0 / 7.0;
    REQUIRE(pi_approx == Catch::Approx(3.141592653589793).margin(0.002));
    std::vector<double> xs{1.0, 2.0, 3.0, 4.0};
    double mean = std::accumulate(xs.begin(), xs.end(), 0.0) / xs.size();
    REQUIRE_THAT(mean, Catch::Matchers::WithinAbs(2.5, 1e-9));
    REQUIRE_THAT(xs, Catch::Matchers::SizeIs(4));
}
// ============ GENERATE 参数化 ============
TEST_CASE("UserStore hash is deterministic", "[hash]") {
    auto input = GENERATE(as<std::string>{}, "hello", "", "12345678", "alice-pass");
    auto h1 = UserStore::hash(input);
    auto h2 = UserStore::hash(input);
    REQUIRE(h1 == h2);
    REQUIRE_FALSE(h1.empty());
}
// ============ 异常 + Matchers ============
TEST_CASE("matchers on containers", "[matchers]") {
    std::vector<int> v{1,2,3,4,5,6};
    using namespace Catch::Matchers;
    REQUIRE_THAT(v, Contains(3));
    REQUIRE_THAT(v, VectorContains(5));
    REQUIRE_THAT(v, SizeIs(6));
    REQUIRE_THAT("hello world", StartsWith("hello") && EndsWith("world"));
    REQUIRE_THAT(std::vector{1.0,2.0,3.0}, Approx(std::vector{1.0,2.0,3.0}).epsilon(0.000001));
}
// ============ Benchmark ============
TEST_CASE("insert 10k integers into map vs unordered_map", "[!benchmark]") {
    std::mt19937 rng{42};
    std::vector<int> keys(10000);
    std::iota(keys.begin(), keys.end(), 0);
    std::shuffle(keys.begin(), keys.end(), rng);

    BENCHMARK("std::map insert 10k") {
        std::map<int,int> m;
        for(int k: keys) m.emplace(k, k*k);
        return m.size();
    };
    BENCHMARK("std::unordered_map insert 10k") {
        std::unordered_map<int,int> m;
        for(int k: keys) m.emplace(k, k*k);
        return m.size();
    };
    BENCHMARK("std::vector sort 10k") {
        auto c = keys;
        std::sort(c.begin(), c.end());
        return c.front();
    };
}
// Catch2 默认已经提供 main (Catch2Main 库链接)
/* ===== CMakeLists.txt =====
find_package(Catch2 CONFIG REQUIRED)
add_executable(my_tests catch2_demo.cpp)
target_link_libraries(my_tests PRIVATE Catch2::Catch2WithMain)
include(Catch)
catch_discover_tests(my_tests)
ctest -N 查看所有case
*/`
  },
  {
    id:"cpp-ext5-q023",
    topicId:"cpp-ext5-test-ci",
    title:"C++代码覆盖率：gcov/lcov + gcovr + llvm-cov html报告集成",
    content:`### 覆盖率基础概念
代码覆盖率是CI质量门禁重要指标。主要维度：
- **Line 行覆盖率**：每行是否至少执行一次(最常用，入门首选)
- **Function 函数覆盖率**：每个函数是否被调用过
- **Branch 分支覆盖率**：每个if/else/switch case是否每个分支都走过
- **MC/DC(修改条件/决策覆盖)**：航空/医疗/车规级(DO-178C Level A)需要，工业级C++一般不做

### 工具链选择
| 编译器 | 插桩方式               | 后处理工具                       |
|--------|------------------------|----------------------------------|
| GCC    | --coverage (-ftest-coverage + -fprofile-arcs) | gcov → lcov → genhtml 或 gcovr |
| Clang  | -fprofile-instr-generate -fcoverage-mapping  | llvm-profdata merge → llvm-cov show/export |

### GCC + gcov/lcov 流程
1. 编译：-O0 -g --coverage -fkeep-inline-functions -fno-elide-constructors (关优化，防止行合并)
2. 跑测试：每个ctest会在源码目录旁生成.gcno(编译时) + .gcda(运行时计数)
3. 合并/过滤：lcov --capture --directory build --output-file coverage.info --rc lcov_branch_coverage=1
   - lcov --remove coverage.info '/usr/*' '*/tests/*' '*/3rdparty/*' '*/vcpkg_installed/*' -o coverage_filtered.info
4. 生成HTML：genhtml coverage_filtered.info --branch-coverage --output-directory coverage_html
5. 数值门禁：lcov --summary coverage_filtered.info → 取 lines: 80% 以上才 pass

### Clang + llvm-cov 流程 (更准，现代Clang推荐)
1. 编译：-O0 -g -fprofile-instr-generate -fcoverage-mapping
2. 运行时环境：LLVM_PROFILE_FILE="tests_%p_%m.profraw" (多进程合并)
3. 合并：llvm-profdata merge -sparse tests_*.profraw -o coverage.profdata
4. 导出：
   - llvm-cov show -format=html -instr-profile=coverage.profdata path/to/exe -output-dir=htmlcov
   - llvm-cov export -format=lcov > coverage.lcov (兼容GCC工具链)
   - llvm-cov report -use-color=false 打印摘要(CI阈值比较)

### CMake + gcovr 一键式 (最简单)
~~~cmake
if(CMAKE_BUILD_TYPE STREQUAL "Coverage")
  set(CMAKE_CXX_FLAGS "-O0 -g --coverage -fno-inline -fno-elide-constructors")
  add_custom_target(coverage
    COMMAND ctest --output-on-failure
    COMMAND gcovr -r \${CMAKE_SOURCE_DIR} --filter 'src/' --exclude '.*tests.*'
            --branches --html --html-details -o coverage.html
            --json coverage.json --txt -
    DEPENDS my_tests
    WORKING_DIRECTORY \${CMAKE_BINARY_DIR})
endif()
~~~

### CI门禁实践
- **New Code Coverage**：SonarQube只算diff改动的行覆盖率≥80%，历史债务不要求一次性还清
- **全量覆盖率**：项目总体≥70% (小模块更高)，每个PR的覆盖率不能下降超过1%
- **输出格式**：CI统一导出LCOV/ cobertura.xml → GitLab/GitHub coverage badge直接读

### 常见坑
- Release/O2下不准：inline/loop unroll/cse会让gcno行映射错乱，必须-O0/-O1
- 模板/头文件的行在多个TU计数，lcov会自动合并一次
- .gcda是追加写入，第二次跑没clean会是累计值→覆盖率永远偏高
- 多子工程需要把每个子目录的.gcda路径都传给lcov的--directory`,
    example:`// ===== 被测: calc.cpp (带典型分支) =====
// 编译: g++ -std=c++20 -O0 -g --coverage calc.cpp calc_test.cpp -o calc_tests -lgcov
#include <string>
#include <vector>
#include <cmath>
#include <stdexcept>
// lines coverage: 多分支容易没全盖
double calc_billing(double amount, int tier, bool is_vip) {
    if (amount <= 0) throw std::invalid_argument("amount <= 0");   // Line A: negative test
    if (tier < 0 || tier > 5) throw std::out_of_range("tier");     // Line B: boundary test
    double rates[] = {0.0, 0.03, 0.05, 0.08, 0.12, 0.20};          // Line C
    double subtotal = amount * (1.0 - rates[tier]);                // Line D
    if (is_vip) {                                                  // Line E: 两条分支
        subtotal *= 0.95;                                          // Line F: vip extra 5% off
    }
    if (subtotal > 10000.0) {                                      // Line G: 大额处理
        subtotal = 10000.0 + (subtotal - 10000.0) * 0.8;           // Line H
    }
    return std::round(subtotal * 100.0) / 100.0;                  // Line I
}
// ===== 测试: calc_test.cpp (用Catch2, 但为了简化手写) =====
#include <cassert>
#include <iostream>
int total_tests = 0, pass = 0;
#define TST(name, expr) do{++total_tests; try{ bool ok = !!(expr); if(ok)++pass; else std::cerr<<"FAIL: "#name"\n";}catch(...){std::cerr<<"EXC: "#name"\n";}}while(0)
int main() {
    TST(negative, []{try{calc_billing(-1,1,false);return false;}catch(...){return true;}}());
    TST(tier_bad, []{try{calc_billing(100,-1,false);return false;}catch(...){return true;}}());
    TST(tier_5_regular,  std::abs(calc_billing(100, 5, false) -  80.0) < 1e-9);
    TST(tier_5_vip,      std::abs(calc_billing(100, 5, true ) -  76.0) < 1e-9);
    TST(tier_0,          std::abs(calc_billing(200, 0, false) - 200.0) < 1e-9);
    TST(big_non_vip,     std::abs(calc_billing(20000, 0, false) - 18000.0) < 1e-9);
    TST(big_vip,         std::abs(calc_billing(20000, 2, true ) - (19000*0.95 - 0 /* large branch not covered without this test */ )) > -1e9);
    std::cout << "Passed: " << pass << "/" << total_tests << "\n";
    return (pass == total_tests) ? 0 : 1;
}
/* ===== 生成覆盖率报告的 shell 脚本 =====
#!/usr/bin/env bash
set -euo pipefail
SRC_DIR=$(pwd)
BUILD_DIR=\${SRC_DIR}/build-coverage
rm -rf "$BUILD_DIR" && mkdir -p "$BUILD_DIR" && cd "$BUILD_DIR"
# 1. 编译 (GCC 方式)
g++ -std=c++20 -O0 -g --coverage -fno-elide-constructors \
    "$SRC_DIR/calc.cpp" "$SRC_DIR/calc_test.cpp" -o calc_tests
# 2. 运行
./calc_tests
# 3A. lcov 方式生成 HTML
cd "$SRC_DIR"
lcov --capture --directory "$BUILD_DIR" \
     --rc lcov_branch_coverage=1 \
     --output-file "$BUILD_DIR/coverage.info" \
     --test-name "calc_tests"
# 移除外部库路径
lcov --remove "$BUILD_DIR/coverage.info" \
     '/usr/include/*' '/usr/lib/*' '*/c++/*' \
     --output-file "$BUILD_DIR/coverage.clean.info"
genhtml --branch-coverage \
        --output-directory "$BUILD_DIR/coverage_html" \
        --title "calc billing coverage" \
        "$BUILD_DIR/coverage.clean.info"
echo "Report at: file://$BUILD_DIR/coverage_html/index.html"
# 3B. gcovr 方式 (更现代，JSON/HTML/cobertura一键)
gcovr -r "$SRC_DIR" \
      --filter 'calc\.cpp' \
      --exclude '.*_test\.cpp' \
      --root "$BUILD_DIR" \
      --branches \
      --html-details "$BUILD_DIR/gcovr/index.html" \
      --json-summary "$BUILD_DIR/gcovr/summary.json" \
      --cobertura "$BUILD_DIR/gcovr/cobertura.xml" \
      --txt -  # stdout 打印表格式摘要
# 4. CI 阈值检查 (shell)
LINE_COV=$(python3 -c "import json;d=json.load(open('$BUILD_DIR/gcovr/summary.json'));print(int(d['totals']['lines']['percent']*1000)/10)")
BRANCH_COV=$(python3 -c "import json;d=json.load(open('$BUILD_DIR/gcovr/summary.json'));print(int(d['totals']['branches']['percent']*1000)/10)")
echo "Line Cov: $LINE_COV % , Branch Cov: $BRANCH_COV %"
if (( $(echo "$LINE_COV   < 80.0" | bc -l) )); then echo "Line coverage below 80%"; exit 1; fi
if (( $(echo "$BRANCH_COV < 60.0" | bc -l) )); then echo "Branch coverage below 60%"; exit 1; fi
*/`
  },
  {
    id:"cpp-ext5-q024",
    topicId:"cpp-ext5-test-ci",
    title:"GitHub Actions C++ pipeline：多编译器/多OS/Sanitizer矩阵+缓存+覆盖率上传",
    content:`### 工业级C++ CI流水线的五个Job
1. **Format & Static Analysis** (ubuntu + clang-format + clang-tidy diff)
2. **Debug + Sanitizer Build** (ubuntu latest + GCC ASan+UBSan+LSan)
3. **Release Build & Unit Test** (matrix: {ubuntu,macos,windows} x {gcc,clang,msvc})
4. **Nightly** (Thread Sanitizer + Memory Sanitizer + 全量 CodeQL)
5. **Package/Installer** (vcpkg install tree → tarball/zips)

### GHA 基础能力速查
- **runs-on**: ubuntu-latest, macos-14, windows-2022
- **actions/checkout@v4**: 拉取代码 + submodule ssh key
- **actions/cache@v4**: sccache/ccache/vcpkg/build缓存
- **ilammy/msvc-dev-cmd@v1**: Windows 配置VS开发者终端(用于cmake/cl)
- **actions/upload-artifact@v4**: 把可执行/coverage上传
- **hardpixel/actions-cpp-lcov**: 生成badge

### 典型矩阵
~~~yaml
matrix:
  os: [ubuntu-latest, macos-14, windows-2022]
  compiler: [{cc:gcc, cxx:g++}, {cc:clang, cxx:clang++}, {cc:cl, cxx:cl}]
  exclude:
    - {os: ubuntu-latest,  compiler: {cc:cl}}
    - {os: windows-2022, compiler: {cc:gcc}}
  config: [Debug, RelWithDebInfo]
~~~

### 缓存命中率要点
- ccache: 路径 ~/.cache/ccache → key = ccache-\${{runner.os}}-\${{hashFiles('**/CMakeLists.txt','**/*.cpp')}}
- vcpkg: 路径 ~/.cache/vcpkg/archives → key = vcpkg-\${{hashFiles('vcpkg.json')}}
- 避免hashFiles匹配所有文件，应该只选能让缓存失效的源

### Sanitizer Job 关键要点
- Debug + -O1 + ASan/UBSan/LSan 组合
- 必须 set ASAN_OPTIONS=detect_leaks=1:halt_on_error=0
- 必须加 --gtest_catch_exceptions=0 给GTest，否则异常在sanitizer前被吞
- 内存大的case要调容器内存限制：env UBSAN_OPTIONS=print_stacktrace=1

### 覆盖率上传到Codecov/SonarCloud
- uses: codecov/codecov-action@v4 with { files: coverage.lcov, fail_ci_if_error: true }
- uses: sonarsource/sonarcloud-github-action@v2 + sonar.token secret`,
    example:`# ============== .github/workflows/ci.yml ==============
name: C++ CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
  schedule: [{cron: '0 3 * * *'}]  # nightly 03:00 UTC

env:
  VCPKG_ROOT:     \${{github.workspace}}/vcpkg
  CCACHE_DIR:     \${{github.workspace}}/.ccache
  SCCACHE_DIR:    \${{github.workspace}}/.sccache
  CMAKE_BUILD_PARALLEL_LEVEL: 8
  CTEST_PARALLEL_LEVEL:        6

jobs:
  # ============== Job 1: Format & Static Analysis ==============
  format-static-analysis:
    name: Format / Tidy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install tools
        run: |
          sudo apt-get update && sudo apt-get install -y clang-format-18 clang-tidy-18
      - name: clang-format check
        run: |
          find src tests -name '*.cpp' -o -name '*.h' -o -name '*.hpp' \
            | xargs clang-format-18 --dry-run --Werror 2>&1 | tee fmt.log
          if grep -q "warning:" fmt.log; then echo "Format error, run clang-format"; exit 1; fi

  # ============== Job 2: Debug + Sanitizers (Ubuntu + GCC) ==============
  debug-sanitizers:
    name: Debug ASan+UBSan+LSan (GCC)
    runs-on: ubuntu-latest
    env:
      CC:  gcc-13
      CXX: g++-13
      ASAN_OPTIONS: detect_leaks=1:halt_on_error=0:fast_unwind_on_malloc=0
      UBSAN_OPTIONS: print_stacktrace=1:halt_on_error=0
    steps:
      - uses: actions/checkout@v4
      - uses: hendrikmuhs/ccache-action@v1.2.12
        with: { key: asan-\${{runner.os}}, max-size: 500M }
      - name: Bootstrap vcpkg
        run: |
          git clone --depth 1 https://github.com/microsoft/vcpkg $VCPKG_ROOT
          $VCPKG_ROOT/bootstrap-vcpkg.sh -disableMetrics
      - uses: actions/cache@v4
        with:
          path: $VCPKG_ROOT
          key: vcpkg-asan-\${{hashFiles('vcpkg.json')}}
          restore-keys: vcpkg-asan-
      - name: Configure
        run: |
          cmake -S . -B build -G Ninja \
            -DCMAKE_BUILD_TYPE=Debug \
            -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake \
            -DCMAKE_C_COMPILER_LAUNCHER=ccache \
            -DCMAKE_CXX_COMPILER_LAUNCHER=ccache \
            -DENABLE_ASAN=ON \
            -DENABLE_UBSAN=ON \
            -DBUILD_TESTS=ON
      - name: Build
        run: cmake --build build
      - name: CTest
        run: ctest --test-dir build --output-on-failure -T memcheck

  # ============== Job 3: Build Matrix (3 OS x 2 compilers x 2 configs) ==============
  build-test:
    name: \${{matrix.config}} \${{matrix.os}} \${{matrix.compiler.cxx}}
    needs: format-static-analysis
    runs-on: \${{matrix.os}}
    strategy:
      fail-fast: false
      matrix:
        include:
          - {os: ubuntu-22.04, compiler: {cc:gcc-13, cxx:g++-13}, config: Release, package: 'apt-get install gcc-13 g++-13'}
          - {os: ubuntu-22.04, compiler: {cc:clang-17,cxx:clang++-17}, config: Release, package: 'apt-get install clang-17'}
          - {os: macos-14,     compiler: {cc:clang,    cxx:clang++},   config: Release, package: ''}
          - {os: windows-2022,  compiler: {cc:cl,       cxx:cl},        config: RelWithDebInfo, package: ''}
    env:
      CC:  \${{matrix.compiler.cc}}
      CXX: \${{matrix.compiler.cxx}}
    steps:
      - uses: actions/checkout@v4
      - uses: ilammy/msvc-dev-cmd@v1
        if: runner.os == 'Windows'
        with: {arch: x64}
      - uses: hendrikmuhs/ccache-action@v1.2.12
        if: runner.os != 'Windows'
        with: { key: \${{matrix.os}}-\${{matrix.config}}-\${{matrix.compiler.cxx}}, max-size: 500M }
      - uses: mozilla-actions/sccache-action@v0.0.5
        if: runner.os == 'Windows'
      - name: Install extras (Linux)
        if: runner.os == 'Linux'
        run: |
          sudo apt-get update
          sudo \${{matrix.package}}
          sudo apt-get install -y ninja-build
      - name: Configure
        shell: bash
        run: |
          CACHE_LAUNCH=""
          if [ "$RUNNER_OS" != "Windows" ]; then
            CACHE_LAUNCH="-DCMAKE_C_COMPILER_LAUNCHER=ccache -DCMAKE_CXX_COMPILER_LAUNCHER=ccache"
          else
            CACHE_LAUNCH="-DCMAKE_C_COMPILER_LAUNCHER=sccache -DCMAKE_CXX_COMPILER_LAUNCHER=sccache"
          fi
          cmake -S . -B build -G Ninja \
            -DCMAKE_BUILD_TYPE=\${{matrix.config}} \
            -DBUILD_TESTS=ON $CACHE_LAUNCH
      - name: Build
        run: cmake --build build --config \${{matrix.config}}
      - name: CTest
        run: ctest --test-dir build --build-config \${{matrix.config}} --output-on-failure --timeout 120
      - uses: actions/upload-artifact@v4
        with:
          name: \${{matrix.os}}-\${{matrix.compiler.cxx}}-bin
          path: |
            build/bin/*\${{ endsWith(matrix.os, 'windows-2022') && '.exe' || '' }}
          retention-days: 7

  # ============== Job 4: Coverage ==============
  coverage:
    name: Coverage Report (GCC lcov)
    runs-on: ubuntu-latest
    needs: format-static-analysis
    steps:
      - uses: actions/checkout@v4
      - name: install gcovr lcov
        run: sudo apt-get install -y lcov gcovr ninja-build
      - name: Coverage build
        run: |
          cmake -S . -B buildcov -G Ninja \
            -DCMAKE_BUILD_TYPE=Coverage \
            -DBUILD_TESTS=ON
          cmake --build buildcov
          ctest --test-dir buildcov --output-on-failure
      - name: Generate reports
        run: |
          gcovr -r . --filter 'src/' \
                --exclude 'tests/' --exclude 'buildcov/' \
                --branches \
                --txt \
                --json buildcov/cov.json \
                --cobertura buildcov/cobertura.xml \
                --html-details buildcov/html/index.html
      - uses: codecov/codecov-action@v4
        with:
          files: buildcov/cobertura.xml
          fail_ci_if_error: true
        env:
          CODECOV_TOKEN: \${{secrets.CODECOV_TOKEN}}
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: buildcov/html
          retention-days: 14
`
  },
  {
    id:"cpp-ext5-q025",
    topicId:"cpp-ext5-test-ci",
    title:"CTest + CDash 仪表盘：submission、memcheck/coverage/schedule自动化",
    content:`### CTest 三件套：Configure → Build → Test → Submit
CTest是CMake分发的独立测试驱动程序，CDash是Kitware官方Dashboard。

### 四种标准CTest模式
- **ctest -D Experimental**：一次性提交到Dashboard
- **ctest -D Continuous**：每次PR/push跑(通常夜间模式的子集)
- **ctest -D Nightly**：每晚定时，跑完整流程
- **ctest -D NightlyMemoryCheck**：只跑memcheck(valgrind/ASan)

### 标准Dashboard脚本(ctest_script.cmake)
每个CI服务器跑一个.cmake脚本，比纯命令行更可维护：
~~~cmake
set(CTEST_SITE "ci-linux-amd64")
set(CTEST_BUILD_NAME "GCC12-Debug-ASan")
set(CTEST_SOURCE_DIRECTORY "/src")
set(CTEST_BINARY_DIRECTORY "/build")
set(CTEST_CMAKE_GENERATOR "Ninja")
set(CTEST_MEMORYCHECK_TYPE "AddressSanitizer")
ctest_start(Nightly)
ctest_update()
ctest_configure(OPTIONS "-DCMAKE_BUILD_TYPE=Debug;-DENABLE_ASAN=ON")
ctest_build(TARGET all FLAGS -j8)
ctest_test(PARALLEL_LEVEL 6 INCLUDE_LABEL "^unit_")
ctest_memcheck(INCLUDE_LABEL "^memcheck_")
ctest_coverage()
ctest_submit()
~~~

### Memcheck 集成 (Valgrind / Dr. Memory / Sanitizer)
- set(CTEST_MEMORYCHECK_TYPE "Valgrind") → 自动 valgrind --leak-check=full
- set(CTEST_MEMORYCHECK_TYPE "ThreadSanitizer") → 解析tsan日志
- set(CTEST_MEMORYCHECK_TYPE "AddressSanitizer") → 解析ASan abort栈
- 每个测试失败的堆栈会被CTest标记，提交到CDash的Defects栏

### 测试分组与标签 (LABELS)
给CTest每个case加标签，跑时筛选：
~~~cmake
add_test(NAME unit_core_startup COMMAND core_tests -tc=startup)
set_tests_properties(unit_core_startup PROPERTIES
    LABELS "unit;core;fast"
    TIMEOUT 30
    WILL_FAIL FALSE
    PASS_REGULAR_EXPRESSION "All tests passed"
    FAIL_REGULAR_EXPRESSION "CRITICAL ERROR"
)
~~~
运行：ctest -L unit -j4 只跑unit标签组；ctest -LE slow 排除slow标签

### Schedule：CTest脚本级定时循环
~~~cmake
# 每1小时触发一次 Continuous Dashboard
while(TRUE)
    ctest_run_script("Continuous.cmake")
    ctest_sleep(3600)
endwhile()
~~~

### CDash部署 + 数据可视化
- Docker：cdash 官方镜像 kitware/cdash，直接 docker-compose up
- 配置 config.php：$CDASH_BASE_URL / $CDASH_UPLOAD_MAXSIZE
- 每个Project有一个SubmitToken，CTest set(CTEST_TOKEN "...") 对应

### 与GTest/Catch2的发现者集成
- include(GoogleTest) → gtest_discover_tests(my_tests DISCOVERY_MODE POST_BUILD TEST_PREFIX unit::)
- include(Catch) → catch_discover_tests(my_tests REPORTER junit OUTPUT_DIR reports)`,
    example:`# ============== CMakeLists.txt 测试/CDash 集成模板 ==============
cmake_minimum_required(VERSION 3.25)
project(DashDemo VERSION 0.1 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- 1. 开启测试 & 启用 Dashboard ---
enable_testing()
include(CTest)                       # 创建 BUILD_TESTING 选项 + DartConfiguration.tcl
find_package(Catch2 CONFIG REQUIRED)
include(Catch)

# --- 2. 被测库 ---
add_library(calc STATIC src/billing.cpp src/order.cpp)
target_include_directories(calc PUBLIC include)

# --- 3. 测试1: unit tests ----
add_executable(calc_tests tests/test_billing.cpp tests/test_order.cpp)
target_link_libraries(calc_tests PRIVATE calc Catch2::Catch2WithMain)
catch_discover_tests(calc_tests
    TEST_PREFIX  "unit::"
    PROPERTIES   LABELS "unit;fast" TIMEOUT 15
    REPORTER     junit
    OUTPUT_DIR   \${CMAKE_BINARY_DIR}/reports
    OUTPUT_SUFFIX .xml
)

# --- 4. 测试2: 集成测试 (慢) ----
add_executable(integration tests/integration/api_flow.cpp)
target_link_libraries(integration PRIVATE calc)
add_test(NAME integration::full_flow
    COMMAND integration --env testdb
    WORKING_DIRECTORY \${CMAKE_SOURCE_DIR}/tests/fixtures)
set_tests_properties(integration::full_flow PROPERTIES
    LABELS "integration;slow"
    TIMEOUT 300
    DEPENDS "unit::calc_test"
    COST 100  # CTest scheduler 先跑贵的test
)

# --- 5. Memcheck/Valgrind 相关设置 (CTest识别) ---
find_program(VALGRIND valgrind)
if(VALGRIND)
    set(MEMORYCHECK_COMMAND "\${VALGRIND}" "--tool=memcheck"
                            "--leak-check=full" "--show-leak-kinds=all"
                            "--error-exitcode=1" "--errors-for-leak-kinds=all"
                            "--suppressions=\${CMAKE_SOURCE_DIR}/tests/valgrind.supp")
    set(MEMORYCHECK_TYPE Valgrind)
    set(CTEST_MEMORYCHECK_SUPPRESSIONS_FILE \${CMAKE_SOURCE_DIR}/tests/valgrind.supp)
    message(STATUS "Valgrind found: \${VALGRIND}")
endif()

# --- 6. 覆盖率 (CTest 调用时 ctest_coverage() 用) ---
if(CMAKE_BUILD_TYPE STREQUAL "Coverage")
    include(ProcessorCount)
    ProcessorCount(N)
    set(CTEST_COVERAGE_COMMAND gcov)
    set(CTEST_COVERAGE_EXTRA_FLAGS "-pb")
endif()

# ============== 脚本: dashboard.cmake (给 ctest -S dashboard.cmake 跑) ==============
# 写在 cmake/dashboard.cmake
# set(CTEST_SITE              "github-ci-\${GITHUB_RUN_ID}")
# set(CTEST_BUILD_NAME        "ubuntu-22.04-GCC13-\${CMAKE_BUILD_TYPE}")
# set(CTEST_SOURCE_DIRECTORY  "\${CMAKE_CURRENT_LIST_DIR}/..")
# set(CTEST_BINARY_DIRECTORY  "\${CTEST_SOURCE_DIRECTORY}/build-dash")
# set(CTEST_CMAKE_GENERATOR   "Ninja")
# set(CTEST_BUILD_CONFIGURATION RelWithDebInfo)
# set(CTEST_TOKEN             "$ENV{CDASH_TOKEN}")
# set(CTEST_SUBMIT_URL        "https://cdash.mycompany.com/submit.php?project=DashDemo")
#
# ctest_read_custom_files("\${CTEST_SOURCE_DIRECTORY}")
# ctest_start(Nightly)
# ctest_update(RETURN_VALUE upd_count CAPTURE_CMAKE_ERROR err)
# ctest_configure(BUILD "\${CTEST_BINARY_DIRECTORY}"
#     OPTIONS
#       "-DBUILD_TESTING=ON"
#       "-DCMAKE_BUILD_TYPE=RelWithDebInfo"
#     RETURN_VALUE cfg_rv)
# ctest_build(BUILD "\${CTEST_BINARY_DIRECTORY}"
#     TARGETS all APPEND FLAGS "-j 8" NUMBER_ERRORS build_err)
# ctest_test(BUILD "\${CTEST_BINARY_DIRECTORY}"
#     PARALLEL_LEVEL 6
#     INCLUDE_LABEL "unit|integration"
#     EXCLUDE_LABEL broken
#     SCHEDULE_RANDOM ON
#     STOP_TIME 7200)
# ctest_memcheck(BUILD "\${CTEST_BINARY_DIRECTORY}"
#     PARALLEL_LEVEL 2
#     INCLUDE_LABEL "unit")
# if(CMAKE_BUILD_TYPE STREQUAL "Coverage")
#     ctest_coverage(BUILD "\${CTEST_BINARY_DIRECTORY}")
# endif()
# ctest_submit(RETURN_VALUE submit_rv PARTS Build Test Coverage Notes)

# ============== GitHub Actions CDash 提交 ==============
# - name: Nightly CDash Submit
#   if: github.event_name == 'schedule'
#   run: |
#     ctest -S cmake/dashboard.cmake \
#           -DCTEST_TOKEN="\${{secrets.CDASH_TOKEN}}" \
#           --output-log ctest.log
#   - name: Upload CTest log
#     uses: actions/upload-artifact@v4
#     with: { name: ctest-log, path: ctest.log }

# ============== 典型 valgrind.supp (压制第三方库已知leak) ==============
# {
#    spdlog_static_init
#    Memcheck:Leak
#    match-leak-kinds: reachable
#    fun: _GLOBAL__sub_I_spdlog.cpp
# }
# {
#    libcurl_ca_bundle_init
#    Memcheck:Leak
#    match-leak-kinds: definite
#    fun: curl_global_init
# }
`
  },
  {
    id:"cpp-ext5-q026",
    topicId:"cpp-ext5-interop",
    title:"C/C++ extern C ABI：name mangling、调用约定、struct内存布局兼容",
    content:`### C++→C互操作的两种接口
1. **extern "C" C-linkage 导出函数**：C++源里用extern "C"定义函数，C编译器能通过.h直接调用
2. **Opaque Handle 模式**：C不暴露C++类，只暴露 typedef void* MyClassHandle; + 一组 create/destroy/method 函数包装

### name mangling (符号改名) 原理
- **C linkage**: extern "C" 函数直接输出原名 foo (或 _foo @ MSVC)
- **C++ linkage**: 同一函数foo(int)/foo(float)需要区分→mangling
  - Itanium ABI(GCC/Clang): _Z3fooi / _Z3foof → Z<len><name><types>
  - MSVC ABI: ?foo@@YAXH@Z / ?foo@@YAXM@Z
- **直接混用的坑**：C++的.o里符号是_Z3fooi，C的.o找foo→链接undef引用

### extern "C"的正确写法(头文件兼容)
~~~cpp
#ifdef __cplusplus
extern "C" {
#endif
    void foo(int x);
    typedef struct CHandle* CHandle;
    CHandle c_handle_create(int n);
#ifdef __cplusplus
}
#endif
~~~
宏 __cplusplus 只有C++编译器定义，C编译器会跳过extern "C" {}块但保留内部声明。

### 调用约定(Calling Convention)
| 约定      | 参数传递                          | 栈清理         | 主流场景             |
|-----------|-----------------------------------|----------------|----------------------|
| cdecl     | 从右向左压栈，可变参数专用        | Caller         | C/C++默认(GCC/Clang) |
| stdcall   | 从右向左压栈                      | Callee         | Win32 API            |
| fastcall  | 前2个参数 ECX/EDX，其余栈         | Callee         | Windows性能关键函数  |
| vectorcall| 前几个浮点/向量 XMM0-XMM3        | Callee         | SIMD参数             |
| sysv64    | RDI,RSI,RDX,RCX,R8,R9 + XMM0-7   | Caller         | Linux/macOS x86_64默认|
| win64     | RCX,RDX,R8,R9 前四个整数/指针    | Caller(shadow) | Windows x86_64 默认   |

- 跨语言必须明确约定：Windows DLL 导出用 CALLBACK(=stdcall) 或 WINAPI
- Rust/Golang 默认各自调用约定，bindgen要显式写 extern "C" fn(...)

### Struct内存布局与POD
POD(Plain Old Data)=trivial(可memcpy拷贝)+standard-layout(成员对齐一致)
跨语言必须 POD，否则不能保证字段偏移一致：
- 用 static_assert(sizeof(MyStruct)==32) 和 static_assert(offsetof(MyStruct,x)==8)
- 按字段大小降序排列成员 → 最小化padding对齐空洞
- 用 #pragma pack(push,1)/#pragma pack(pop) 或 __attribute__((packed)) 强制0 padding，但某些CPU非对齐读写会SIGBUS

### 动态库(DLL/SO)导出与可见性
- Linux: -fvisibility=hidden 默认不导出 + __attribute__((visibility("default"))) 在导出函数前缀
- Windows: __declspec(dllexport)/__declspec(dllimport) 宏切换
- 避免跨DLL边界传递 C++ 对象：std::string/vector不同编译器/不同STL版本ABI不兼容
- 跨边界传递char*：分配和释放必须在同一边(C分配C释放，C++分配C++释放)，或统一用传调用者buffer模式`,
    example:`// ============== lib.hpp (C++ 侧) ==============
#pragma once
#include <string>
#include <vector>
#include <cstdint>
// 导出宏: Windows DLL 切换 dllexport/dllimport, Linux/unix 仅控制 visibility
#if defined(_WIN32)
#   ifdef MYLIB_BUILD
#       define MYLIB_API __declspec(dllexport)
#   else
#       define MYLIB_API __declspec(dllimport)
#   endif
#else
#   define MYLIB_API __attribute__((visibility("default")))
#endif
// ---------- 内部 C++ 实现 ----------
namespace mylib {
class DocumentIndex {
    std::vector<std::string> tokens;
    std::vector<std::vector<uint32_t>> postings;
public:
    void add_document(const std::string& text);
    std::vector<uint32_t> search(const std::string& query) const;
    std::size_t doc_count() const noexcept { return postings.size(); }
};
} // namespace mylib
// ============== lib.h (C 头文件, extern "C") ==============
#pragma once
#include <stddef.h>
#include <stdint.h>
#ifdef __cplusplus
extern "C" {
#endif
// ---- Opaque Handle (C 侧完全不看内部实现) ----
typedef struct DocIndex DocIndex;
// ---- POD 结构体, offset 断言放 C++ TU ----
typedef struct MylibSearchHit {
    uint32_t doc_id;
    float    score;
} MylibSearchHit;
// 约定: 调用者自己提供输出数组的 buffer/size
// 返回值: 实际填充 hits 的数量
MYLIB_API DocIndex*     mylib_index_create(void);
MYLIB_API void          mylib_index_destroy(DocIndex* h);
MYLIB_API int           mylib_index_add(DocIndex* h, const char* text);
MYLIB_API size_t        mylib_index_count(const DocIndex* h);
MYLIB_API size_t        mylib_index_search(const DocIndex* h,
                                            const char* query,
                                            MylibSearchHit* out_hits,
                                            size_t out_capacity);
#ifdef __cplusplus
}
#endif
// ============== lib.cpp (C++ 实现 extern "C" 封装) ==============
// #include "lib.hpp"
// #include "lib.h"
extern "C" {
static_assert(sizeof(MylibSearchHit) == sizeof(uint32_t)+sizeof(float), "ABI size mismatch");
static_assert(offsetof(MylibSearchHit, doc_id) == 0);
static_assert(offsetof(MylibSearchHit, score)  == 4);
MYLIB_API DocIndex* mylib_index_create(void) {
    try {
        return reinterpret_cast<DocIndex*>(new mylib::DocumentIndex());
    } catch(...) {
        return nullptr; // C 调用方期望 null 表失败
    }
}
MYLIB_API void mylib_index_destroy(DocIndex* h) {
    delete reinterpret_cast<mylib::DocumentIndex*>(h);
}
MYLIB_API int mylib_index_add(DocIndex* h, const char* text) try {
    if(!h || !text) return -22; // EINVAL
    reinterpret_cast<mylib::DocumentIndex*>(h)->add_document(text);
    return 0;
} catch(...) { return -1; }
MYLIB_API size_t mylib_index_count(const DocIndex* h) {
    auto* p = reinterpret_cast<const mylib::DocumentIndex*>(h);
    return p ? p->doc_count() : 0;
}
MYLIB_API size_t mylib_index_search(const DocIndex* h, const char* query,
                                    MylibSearchHit* out, size_t cap) {
    if(!h || !query || (!out && cap>0)) return 0;
    try {
        auto docs = reinterpret_cast<const mylib::DocumentIndex*>(h)->search(query);
        size_t n = std::min(docs.size(), cap);
        for(size_t i=0;i<n;++i) {
            out[i].doc_id = docs[i];
            out[i].score  = 1.0f / (i+1.0f);  // fake score
        }
        return n;
    } catch(...) { return 0; }
}
} // extern "C"
// ============== main.c (C 调用方) ==============
// 编译 C:  gcc -std=c11 -c main.c -o main.o
// 编译 C++:g++ -std=c++20 -O2 -DMYLIB_BUILD -shared lib.cpp -o libmylib.so -fvisibility=hidden
// 链接:   gcc main.o -L. -lmylib -lstdc++ -o demo -Wl,-rpath,'$ORIGIN'
#if 0
#include <stdio.h>
#include <stdlib.h>
#include "lib.h"
int main(void) {
    DocIndex* idx = mylib_index_create();
    mylib_index_add(idx, "hello world c interop example");
    mylib_index_add(idx, "second document c example search");
    printf("docs=%zu\n", mylib_index_count(idx));
    MylibSearchHit hits[8];
    size_t n = mylib_index_search(idx, "c example", hits, 8);
    printf("got %zu hits\n", n);
    for(size_t i=0;i<n;++i) printf("  hit doc=%u score=%.3f\n", hits[i].doc_id, hits[i].score);
    mylib_index_destroy(idx);
    return 0;
}
#endif
// ============== CMakeLists.txt (生成C/C++ ABI库) ==============
#if 0
cmake_minimum_required(VERSION 3.25)
project(mylib LANGUAGES C CXX VERSION 1.0.0)
set(CMAKE_CXX_VISIBILITY_PRESET hidden)
set(CMAKE_VISIBILITY_INLINES_HIDDEN ON)
add_library(mylib SHARED lib.cpp)
target_compile_features(mylib PRIVATE cxx_std_20)
target_compile_definitions(mylib PRIVATE MYLIB_BUILD)
set_target_properties(mylib PROPERTIES
    VERSION \${PROJECT_VERSION}
    SOVERSION 1
    CXX_STANDARD_REQUIRED ON
)
# C 主程序
add_executable(demo main.c)
target_link_libraries(demo PRIVATE mylib)
#endif
`
  },
  {
    id:"cpp-ext5-q027",
    topicId:"cpp-ext5-interop",
    title:"pybind11：Python 绑定 C++ 类/STL/Eigen/智能指针与 GIL 管理",
    content:`### pybind11 设计哲学
纯header-only(C++11+)，仅需#include <pybind11/pybind11.h>。核心是编译期自省：
- 自动处理参数类型转换(支持任意STL容器、Eigen、Pybind11::array numpy)
- RAII生命周期：std::shared_ptr<T> 桥接为 Python reference counting
- 异常互转：C++ std::exception 抛出会转成 Python RuntimeError 子类
- 可选STL绑定：stl.h / stl/filesystem.h / chrono.h / eigen.h

### 典型Bindings结构
~~~cpp
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/eigen.h>
#include <pybind11/numpy.h>
namespace py = pybind11;
PYBIND11_MODULE(myext, m) {
    m.doc() = "My C++ extension for Python";
    py::class_<CppClass, std::shared_ptr<CppClass>>(m, "CppClass")
        .def(py::init<std::string,int>(), py::arg("name"), py::arg("id")=0)
        .def("method", &CppClass::method, py::arg("x"))
        .def_static("factory", &CppClass::create)
        .def_readwrite("name", &CppClass::name)
        .def_property("id", &CppClass::get_id, &CppClass::set_id);
    m.def("process_vector", &process_vector, "Process list[float]", py::arg("data"));
}
~~~

### 参数/返回值映射
- **py::arg("name")** → Python端kwargs支持+文档签名
- **py::return_value_policy**：
  - reference_internal / take_ownership / copy / move / reference / automatic
  - 默认return const std::string&会拷贝; policy::reference_internal需保证对象活得更久
- **py::keep_alive<Nurse,Patient>(1,2)**：让参数2的生命周期绑定在返回值1上，防止Dangling

### GIL与多线程
- 调用Python API必须持有GIL，但你的纯C++计算应该释放它：
  ~~~cpp
  m.def("big_compute", [](int n){
      py::gil_scoped_release release;   // 释放GIL，其他Python线程可跑
      auto r = really_long_cpp(n);
      return r;                         // 析构release自动重新拿GIL
  });
  ~~~
- **多线程回调**：C++异步回调Python时先拿GIL：py::gil_scoped_acquire acquire;

### Numpy/Eigen互通
- Eigen::MatrixXd ↔ np.ndarray: #include <pybind11/eigen.h> 自动双向转换(row-major/col-major处理)
- py::array_t<double> 直接拿数据指针：ptr = (double*)arr.mutable_data(); info→strides[0]

### 构建与发布
- CMake: pybind11_add_module(myext src/bind.cpp)
- Python打包: pyproject.toml → pip install . 使用scikit-build-core或nanobind/setuptools
- manylinux轮盘：cibuildwheel 生成 Linux/macOS/Windows 全平台wheel

### 常见坑
- Python传入list[int]到std::vector<long>：OK；但float→int不会自动强转→抛TypeError
- 跨库传递py::object必须保证GIL持有；std::thread中使用py::object必崩
- 类继承在Python端暴露时py::class_要指定父类py::class_<Derive, Base>(...)`,
    example:`// ============= bindings.cpp (pybind11 extension) =============
// 安装pybind11: pip install pybind11 或 vcpkg install pybind11
// 编译调试:
//   g++ -O3 -std=c++20 -shared -fPIC bindings.cpp \
//       $(python3 -m pybind11 --includes) \
//       -o myext$(python3-config --extension-suffix)
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/numpy.h>
#include <pybind11/eigen.h>
#include <pybind11/chrono.h>
#include <pybind11/functional.h>
#include <vector>
#include <string>
#include <memory>
#include <chrono>
#include <thread>
#include <stdexcept>
#include <Eigen/Dense>
namespace py = pybind11;
using namespace std::chrono_literals;
// ========= 纯 C++ 业务逻辑 =========
class Dataset {
    std::string name_;
    std::vector<double> data_;
public:
    Dataset(std::string name, std::vector<double> data)
        : name_(std::move(name)), data_(std::move(data)) {}
    const std::string& name() const noexcept { return name_; }
    void set_name(std::string s) { name_ = std::move(s); }
    std::size_t size() const noexcept { return data_.size(); }
    double sum()     const { double s=0; for(double x:data_) s+=x; return s; }
    double mean()    const { return empty() ? 0.0 : sum()/size(); }
    bool   empty()   const noexcept { return data_.empty(); }
    // map-reduce style, takes python callable
    template <typename F>
    std::vector<double> transform(F fn) const {
        std::vector<double> out(data_.size());
        for(std::size_t i=0;i<data_.size();++i) out[i] = fn(data_[i]);
        return out;
    }
    Eigen::VectorXd to_eigen() const {
        Eigen::VectorXd v((int)data_.size());
        for(std::size_t i=0;i<data_.size();++i) v(int(i)) = data_[i];
        return v;
    }
};
// 重型计算(放GIL外跑)
static double heavy_cpu(int n, double param, const std::function<void(double)>& progress_cb) {
    double s = 0.0;
    for(int i=0;i<n;++i) {
        s += std::sin(param * i) * std::cos(param + i);
        if(i % (n/20) == 0 && progress_cb) {
            // 调用 Python callback 需要重新拿 GIL
            py::gil_scoped_acquire acquire;
            progress_cb(double(i) / n);
        }
    }
    return s;
}
// numpy 原地修改: 把数组每个元素 ^2 倍
static void inplace_square(py::array_t<double, py::array::c_style | py::array::forcecast> arr) {
    py::buffer_info info = arr.request();
    if(info.ndim != 1) throw std::runtime_error("expected 1-D array");
    auto* ptr = static_cast<double*>(info.ptr);
    auto  n   = static_cast<std::size_t>(info.shape[0]);
    // 纯数值运算可以释放 GIL
    py::gil_scoped_release release;
    for(std::size_t i=0;i<n;++i) ptr[i] = ptr[i]*ptr[i];
}
// Eigen 矩阵乘法
static Eigen::MatrixXd matmul(const Eigen::MatrixXd& A, const Eigen::MatrixXd& B) {
    py::gil_scoped_release release;
    return A * B;
}
// ========== Pybind11 module definition ==========
PYBIND11_MODULE(myext, m) {
    m.doc() = "Example pybind11 C++ extension";
    // ---- Dataset class ----
    py::class_<Dataset, std::shared_ptr<Dataset>>(m, "Dataset",
        R"pbdoc(Holds a named 1-D dataset with summary ops)pbdoc")
        .def(py::init<std::string, std::vector<double>>(),
             py::arg("name"), py::arg("data"),
             "Create from list of floats")
        .def(py::init([](const std::string& name, py::array_t<double> arr){
                  py::buffer_info info = arr.request();
                  auto* p = static_cast<double*>(info.ptr);
                  std::size_t n = (std::size_t)info.shape[0];
                  return std::make_shared<Dataset>(name, std::vector<double>(p, p+n));
              }),
              py::arg("name"), py::arg("npdata"),
              "Create from numpy array (avoid copy wrapper constructor)")
        .def_property("name",
            py::cpp_function([](const Dataset& d){return d.name();},
                             py::return_value_policy::copy),
            &Dataset::set_name,
            "The dataset name")
        .def("__len__",      &Dataset::size)
        .def("__bool__",     [](const Dataset& d){return !d.empty();})
        .def("__repr__",     [](const Dataset& d){
            return "<Dataset '" + d.name() + "' size=" + std::to_string(d.size()) + ">";
        })
        .def("sum",         &Dataset::sum,    "Floating sum")
        .def("mean",        &Dataset::mean,   "Arithmetic mean")
        .def("transform",   &Dataset::transform<std::function<double(double)>>,
             py::arg("fn"), "Apply fn elementwise, return new list")
        .def("to_eigen",    &Dataset::to_eigen, "Return column vector as ndarray");
    // ---- free functions ----
    m.def("heavy_cpu", &heavy_cpu,
        py::arg("n")=10000000, py::arg("param")=0.01, py::arg("progress_cb")=py::none(),
        R"pbdoc(CPU-bound computation, releases GIL. Calls progress_cb with 0..1 updates.)pbdoc");
    m.def("inplace_square", &inplace_square,
        py::arg("arr").noconvert(),
        "Square every element in a float64 numpy array, IN PLACE, no GIL during compute");
    m.def("matmul", &matmul,
        py::arg("A"), py::arg("B"),
        "Matrix multiply A @ B via Eigen, no GIL during compute");
    // ---- 版本 & submodule example ----
    m.attr("__version__") = "1.0.0";
    auto sub = m.def_submodule("util", "Utility helpers");
    sub.def("sleep_ms", [](int ms){
        py::gil_scoped_release release;
        std::this_thread::sleep_for(std::chrono::milliseconds(ms));
    }, py::arg("ms"));
}
/* ============== Python 使用 test_myext.py ==============
import numpy as np
import myext
d = myext.Dataset("sales", [1.0, 2.0, 3.0, 4.0, 5.0])
print(d, "len=", len(d), "sum=", d.sum(), "mean=", d.mean())
print(d.transform(lambda x: x * x))
d2 = myext.Dataset.from_npdata("from_np", np.array([1.1, 2.2, 3.3]))
print(d2)
# inplace square
arr = np.array([1,2,3,4,5], dtype=np.float64)
myext.inplace_square(arr)
assert list(arr) == [1,4,9,16,25], arr
# eigen matmul
A = np.random.randn(32, 64).astype(np.float64)
B = np.random.randn(64, 16).astype(np.float64)
C = myext.matmul(A, B)
assert C.shape == (32, 16)
# heavy cpu w/ progress
def progress(p): print(f"progress {p*100:.0f}%")
print(myext.heavy_cpu(2_000_000, 0.01, progress))
# util sleep without blocking GIL
import threading, time
t0 = time.perf_counter()
ts = [threading.Thread(target=myext.util.sleep_ms, args=(500,)) for _ in range(4)]
for t in ts: t.start()
for t in ts: t.join()
print("elapsed", time.perf_counter() - t0, "s (expected ~0.5s for 4 parallel)")
====== CMakeLists.txt (scikit-build-core 风格) =====
cmake_minimum_required(VERSION 3.20)
project(myext)
find_package(pybind11 CONFIG REQUIRED)
find_package(Eigen3 CONFIG REQUIRED)
pybind11_add_module(myext bindings.cpp)
target_link_libraries(myext PRIVATE Eigen3::Eigen)
target_compile_features(myext PRIVATE cxx_std_20)
*/`
  },
  {
    id:"cpp-ext5-q028",
    topicId:"cpp-ext5-interop",
    title:"C++/Rust互操作：bindgen生成C绑定 + cxx-rs安全FFi桥 + corrosion混合构建",
    content:`### C++/Rust FFi 三种安全等级
1. **裸 extern "C" + bindgen**：手动.h声明，bindgen生成对应Rust unsafe extern块。最灵活，任何C/C(extern C)都能调，但调用者要写unsafe
2. **cxx crate (dtolnay)**：在Rust侧写#[cxx::bridge] mod { extern "C++"{...} unsafe extern "Rust" {...}}，编译期生成安全的双向绑定(类型检查+析构+继承支持)
3. **autocxx (Google)**：给cxx加上C++头文件解析，直接 include C++头不用手写声明，基于bindgen+cxx

### Rust 侧 bindgen 工作流 (针对纯 extern "C")
1. C++库导出extern "C"函数和Opaque T*
2. cxx.h 暴露 ffi.h
3. build.rs 调用 bindgen::Builder::default().header("ffi.h").generate().unwrap() → 生成 bindings.rs
4. Rust 调 unsafe extern { fn ffi_xxx() }，外面包一层 safe API

### cxx-rs 核心特性(推荐)
- **安全的共享类型**：Rust &[T]/Vec<T>/String ↔ C++ span/vector/std::string
- **共享枚举/结构体 POD**：Rust 的 struct T 与 C++ 的 class T 同布局，自动检查 size/align
- **函数双向调用**：Rust可以调C++方法，C++也能回调Rust函数
- **C++类型在Rust的UniquePtr<T>**：对应std::unique_ptr<T>，自动析构
- **Rust Result / C++异常**：C++抛异常被catch转成Rust Result::Err(String)

### corrosion：把CMake项目集成到cargo build
~~~toml
[build-dependencies]
corrosion = { version = "0.4", features = ["builtin"] }
~~~
build.rs 里 corrosion_import_crate / corrosion_import_cxx 把C++的cmake直接编译链接到Rust crate，不用写两个构建脚本。

### C++/Rust 内存所有权注意事项
- C++分配的内存必须由C++释放，反之亦然，不能Rust从C++拿了指针然后Box::from_raw释放(除非分配器相同)
- String 不能跨边界直接传，Rust String是Vec<u8>，C++ std::string是3指针，不兼容→转成const char* + len传
- 回调(closure)：Rust闭包传C++函数指针必须是 extern "C" fn，捕获外部变量需要通过void* user_data走
- Panic/Exception：Rust panic必须在extern "C"边界catch_unwind，否则UB；C++异常要在cxx里加catch

### ABI兼容性关键
- 所有结构体使用 #[repr(C)] (Rust) 或 standard-layout (C++)
- 枚举用 #[repr(i32)] 匹配C++默认int大小enum
- 指针宽度、usize = uintptr_t = size_t
- 浮点数 IEEE 754 (所有平台都遵守)
- 手动 static_assert 对应 core::mem::size_of::<T>() 断言`,
    example:`// ====== 完整项目结构 ======
// cpp_interop/
// ├── Cargo.toml
// ├── build.rs
// ├── src/
// │   ├── main.rs
// │   └── ffi.rs
// ├── cpp/
// │   ├── CMakeLists.txt
// │   ├── include/cpp_engine.h  (extern "C")
// │   └── src/cpp_engine.cpp

# // ====== Cargo.toml ======
# [package]
# name = "cpp-rust-demo"
# version = "0.1.0"
# edition = "2021"
#
# [dependencies]
# cxx = "1.0"
# thiserror = "1.0"
#
# [build-dependencies]
# cxx-build = "1.0"
# corrosion = { version = "0.4", features = ["builtin"] }

// ====== cpp/include/cpp_engine.h (导出 extern "C" 供 bindgen) ======
#pragma once
#include <stddef.h>
#include <stdint.h>
#ifdef __cplusplus
extern "C" {
#endif
typedef struct VecDualHandle VecDualHandle;  // Opaque
VecDualHandle* cpp_vecdual_create(size_t n);
void          cpp_vecdual_destroy(VecDualHandle* h);
size_t        cpp_vecdual_size(const VecDualHandle* h);
double        cpp_vecdual_dot(const VecDualHandle* a, const VecDualHandle* b);
// SIMD 加速的求和
void          cpp_vecdual_add_scaled(VecDualHandle* out, const VecDualHandle* a,
                                     double lambda);
#ifdef __cplusplus
}
#endif

// ====== cpp/src/cpp_engine.cpp (C++ 实现 extern "C") ======
// #include "cpp_engine.h"
#include <vector>
#include <cstdlib>
#include <immintrin.h>
struct VecDual {
    std::vector<double> x;
    std::vector<double> y;
};
static_assert(std::is_standard_layout_v<VecDual>); // 非必须，Opaque内部随意
extern "C" {
VecDualHandle* cpp_vecdual_create(size_t n) try {
    auto* p = new VecDual{std::vector<double>(n, 0.0), std::vector<double>(n, 0.0)};
    for(size_t i=0;i<n;++i){ p->x[i] = (double)i; p->y[i] = (double)(n-i); }
    return reinterpret_cast<VecDualHandle*>(p);
} catch(...) { return nullptr; }
void cpp_vecdual_destroy(VecDualHandle* h) {
    delete reinterpret_cast<VecDual*>(h);
}
size_t cpp_vecdual_size(const VecDualHandle* h) {
    return reinterpret_cast<const VecDual*>(h)->x.size();
}
double cpp_vecdual_dot(const VecDualHandle* a, const VecDualHandle* b) {
    const auto* A = reinterpret_cast<const VecDual*>(a);
    const auto* B = reinterpret_cast<const VecDual*>(b);
    const double* ax=A->x.data(), *ay=A->y.data();
    const double* bx=B->x.data(), *by=B->y.data();
    size_t n = A->x.size();
    double s = 0;
#ifdef __AVX2__
    __m256d acc = _mm256_setzero_pd();
    size_t i=0;
    for(;i+4<=n;i+=4) {
        __m256d axv = _mm256_loadu_pd(ax+i), ayv = _mm256_loadu_pd(ay+i);
        __m256d bxv = _mm256_loadu_pd(bx+i), byv = _mm256_loadu_pd(by+i);
        acc = _mm256_add_pd(acc, _mm256_add_pd(_mm256_mul_pd(axv,bxv), _mm256_mul_pd(ayv,byv)));
    }
    alignas(32) double tmp[4]; _mm256_store_pd(tmp,acc);
    s = tmp[0]+tmp[1]+tmp[2]+tmp[3];
    for(;i<n;++i) s += ax[i]*bx[i] + ay[i]*by[i];
#else
    for(size_t i=0;i<n;++i) s += A->x[i]*B->x[i] + A->y[i]*B->y[i];
#endif
    return s;
}
void cpp_vecdual_add_scaled(VecDualHandle* out, const VecDualHandle* a, double lambda) {
    auto* O = reinterpret_cast<VecDual*>(out);
    const auto* A = reinterpret_cast<const VecDual*>(a);
    size_t n = O->x.size();
    for(size_t i=0;i<n;++i){ O->x[i] += lambda * A->x[i]; O->y[i] += lambda * A->y[i]; }
}
} // extern "C"

# // ====== src/ffi.rs: 使用 cxx-rs 做安全桥 ======
# // 优点: cxx 检查 std::vector / String / UniquePtr 语义，不需要手动unsafe
# #[cxx::bridge]
# pub mod ffi {
#     unsafe extern "C++" {
#         include!("cpp_engine.h");
#         type VecDualHandle;
#
#         fn cpp_vecdual_create(n: usize) -> *mut VecDualHandle;
#         unsafe fn cpp_vecdual_destroy(h: *mut VecDualHandle);
#         fn cpp_vecdual_size(h: *const VecDualHandle) -> usize;
#         fn cpp_vecdual_dot(a: *const VecDualHandle, b: *const VecDualHandle) -> f64;
#         fn cpp_vecdual_add_scaled(out: *mut VecDualHandle, a: *const VecDualHandle, lambda: f64);
#     }
#     // Rust 回调给 C++ (示例)
#     extern "Rust" {
#         fn rust_on_progress(frac: f32);
#     }
# }
#
# use cxx::UniquePtr;
# use thiserror::Error;
# #[derive(Debug, Error)]
# pub enum FfiError { #[error("null handle from C++")] NullHandle }
#
# /// 安全封装: RAII 自动销毁
# pub struct VecDual {
#     ptr: *mut ffi::VecDualHandle,
# }
# impl VecDual {
#     pub fn new(n: usize) -> Result<Self, FfiError> {
#         let ptr = unsafe { ffi::cpp_vecdual_create(n) };
#         if ptr.is_null() { Err(FfiError::NullHandle) } else { Ok(Self{ptr}) }
#     }
#     pub fn len(&self) -> usize { unsafe { ffi::cpp_vecdual_size(self.ptr) } }
#     pub fn dot(&self, other: &VecDual) -> f64 { unsafe { ffi::cpp_vecdual_dot(self.ptr, other.ptr) } }
#     pub fn add_scaled(&mut self, other: &VecDual, lambda: f64) {
#         unsafe { ffi::cpp_vecdual_add_scaled(self.ptr, other.ptr, lambda) }
#     }
# }
# impl Drop for VecDual {
#     fn drop(&mut self) { unsafe { ffi::cpp_vecdual_destroy(self.ptr); } }
# }
# unsafe impl Send for VecDual {}  // 内部没有共享状态，可以跨线程
# unsafe impl Sync for VecDual {}
#
# // C++ 可调用 (在 extern Rust 块声明)
# #[export_name = "rust_on_progress"]
# pub extern "C" fn rust_on_progress(frac: f32) {
#     eprintln!("[rust] progress = {:.1}%", frac * 100.0);
# }

# // ====== src/main.rs ======
# mod ffi;
# use crate::ffi::VecDual;
# fn main() -> Result<(), Box<dyn std::error::Error>> {
#     let n = 1_000_000;
#     let a = VecDual::new(n)?;
#     let mut b = VecDual::new(n)?;
#     println!("a.len = {} b.len = {}", a.len(), b.len());
#     println!("a·b (before scaled) = {:.3e}", a.dot(&b));
#     b.add_scaled(&a, 0.25);
#     println!("a·b (after scaled)  = {:.3e}", a.dot(&b));
#     println!("OK");
#     Ok(())
# }

# // ====== build.rs: cxx-build 编译 C++ 侧 ======
# fn main() -> Result<(), Box<dyn std::error::Error>> {
#     // 1. cxx 生成/编译 bindings.cpp 并链接
#     cxx_build::bridge("src/ffi.rs")
#         .file("cpp/src/cpp_engine.cpp")
#         .include("cpp/include")
#         .flag_if_supported("-std=c++20")
#         .flag_if_supported("-O3")
#         .flag_if_supported("-mavx2")
#         .std("c++20")
#         .compile("cpp_engine");
#     // 2. 可选同时导入完整 CMake 工程 (corrosion)
#     // corrosion::import_cmake("cpp/CMakeLists.txt").no_imported_targets().build();
#     // 3. 重链接依赖: 若C++侧用了openblas / tbb 等
#     // println!("cargo:rustc-link-lib=openblas");
#     Ok(())
# }
#
# // ====== cpp/CMakeLists.txt (可选) 独立编译C++侧供单元测试 ======
# // cmake_minimum_required(VERSION 3.20)
# // project(cpp_engine CXX)
# // set(CMAKE_CXX_STANDARD 20)
# // add_library(cpp_engine STATIC src/cpp_engine.cpp)
# // target_include_directories(cpp_engine PUBLIC include)
# // target_compile_options(cpp_engine PRIVATE -O3 -mavx2)
#
# // ====== 内存所有权跨边界自检清单 (生产项目必须过) ======
# // 1. ✓ 创建/销毁函数成对 (create/destroy)，Rust侧用Drop保证调用
# // 2. ✓ 所有指针参数在 Rust 端非空断言或NonNull<T>
# // 3. ✓ 结构体 #[repr(C)] + static_assert(sizeof/align) 双向断言
# // 4. ✓ 从不跨边界 malloc/free, new/delete, Box::from_raw 混用
# // 5. ✓ extern "C" 边界 catch (...) + Rust 侧 catch_unwind 双重守护
# // 6. ✓ 回调函数为纯 fn(extern "C"), 捕获变量走 user_data + void*
# // 7. ✓ 编译选项一致: libc++ vs libstdc++, -fexceptions, -march 不要冲突`
  },
  {
    id:"cpp-ext5-q029",
    topicId:"cpp-ext5-interop",
    title:"C++/Python互操作：pybind11绑定STL/Eigen/NumPy零拷贝 + 异常与继承映射 + wheel打包发布",
    content:`### pybind11 定位 vs 其他方案
- **Boost.Python**：依赖Boost库，编译体积巨大，已被pybind11基本替代
- **Cython**：写.pyx语法混合Python/C，学习曲线陡；适合把Python代码转C
- **nanobind**：pybind11作者新作，更轻量更快，但生态还在建设中
- **SWIG**：支持多种语言，但生成代码臃肿，C++11之后支持滞后
- **pybind11**：header-only、C++17友好、STL/Eigen/NumPy开箱即用，是C++扩展Python的工业级首选

### pybind11 核心绑定机制(原理)
- **PyObject* 生命周期管理**：py::object 内部持有 PyObject*，构造时Py_INCREF，析构时Py_DECREF，RIIA安全
- **类型转换 caster**：py::detail::type_caster<T> 偏特化，pybind11内置常见类型(int/str/list/dict/std::vector/std::map/std::optional/std::variant/Eigen::Matrix)
- **函数重载**：pybind11用参数类型tuple做key，运行时遍历匹配第一个caster全部成功的重载
- **保持引用**：py::keep_alive<Nurse, Patient>() 在返回值/参数间建立生命周期依赖，防止Python端GC提前释放

### NumPy ↔ Eigen / 原始指针 零拷贝关键
- **py::array_t<T> 参数**：request()得到buf.raw_data指针 + shape/strides，要求itemsize匹配sizeof(T)
- **.noconvert() / .readonly()**：强制要求ndarray是连续且类型匹配，拒绝隐式拷贝
- **Eigen::Ref<MatrixXd> 绑定**：#include <pybind11/eigen.h> 自动做零拷贝映射，要求Eigen行主/列主序匹配
- **返回buffer所有权**：py::capsule 给numpy数组挂父对象析构器，当numpy被GC时自动释放C++侧buffer

### C++异常 / 继承 / 虚函数 跨边界
- **try/catch 转 Python 异常**：py::register_exception<MyErr>(m,"MyErr") 自定义异常链
- **std::exception 自动映射**：std::runtime_error→RuntimeError, std::invalid_argument→ValueError, std::out_of_range→IndexError
- **虚函数在Python端override**：class PyTrampoline : public Base { void foo() override { PYBIND11_OVERRIDE_PURE(void,Base,foo); } } 然后绑定trampoline
- **多态downcast**：绑定std::shared_ptr<Base>时启用 RTTI，Python能通过type(self)识别实际导出的Derived类型

### wheel打包发布
- cibuildwheel 在 GitHub Actions 生成 Linux/macOS/Windows × CPython3.8~3.13 共20+ wheel
- manylinux_2_28 镜像使用CentOS 8 glibc 2.28，可使用C++20完整特性
- auditwheel repair 修复libstdc++依赖，把私有动态库打进去变成独立wheel`,
    example:`// ====== CMakeLists.txt ======
cmake_minimum_required(VERSION 3.20)
project(mylib_py LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. 通过pip install pybind11 获取 pybind11_DIR
find_package(pybind11 CONFIG REQUIRED)
# 2. 或者 FetchContent 拉取
# include(FetchContent)
# FetchContent_Declare(pybind11 GIT_REPOSITORY https://github.com/pybind/pybind11.git GIT_TAG v2.12.0)
# FetchContent_MakeAvailable(pybind11)

# 3. C++ 核心库（纯头文件+STL+Eigen）
find_package(Eigen3 3.4 REQUIRED NO_MODULE)
add_library(cpp_core STATIC cpp_core.cpp)
target_link_libraries(cpp_core PUBLIC Eigen3::Eigen)
target_compile_options(cpp_core PRIVATE -O3 -march=native -DNDEBUG)

# 4. Python 模块 (不要加lib前缀)
pybind11_add_module(_mylib py_ext.cpp)
target_link_libraries(_mylib PRIVATE cpp_core)
set_target_properties(_mylib PROPERTIES CXX_VISIBILITY_PRESET hidden)

// ====== cpp_core.h: 纯C++核心，与Python无关 ======
#pragma once
#include <Eigen/Dense>
#include <vector>
#include <stdexcept>
#include <memory>
#include <string>

struct SolverResult {
    Eigen::VectorXd x;
    int iterations;
    double residual_norm;
    bool converged;
};

class __declspec(dllexport) LinearSolverBase {
public:
    virtual ~LinearSolverBase() = default;
    virtual Eigen::VectorXd solve(const Eigen::MatrixXd& A,
                                  const Eigen::VectorXd& b) const = 0;
    virtual std::string name() const = 0;
};

class JacobiSolver : public LinearSolverBase {
public:
    explicit JacobiSolver(int max_iter = 1000, double tol = 1e-10)
        : max_iter_(max_iter), tol_(tol) {}
    Eigen::VectorXd solve(const Eigen::MatrixXd& A,
                          const Eigen::VectorXd& b) const override;
    std::string name() const override { return "Jacobi"; }
    int max_iter() const { return max_iter_; }
private:
    int max_iter_;
    double tol_;
};

// 零拷贝处理大数据的接口（入参为裸指针 + stride）
std::vector<double> process_chunk(const double* in, size_t n, double scale);

// ====== py_ext.cpp: 绑定层 ======
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/eigen.h>
#include <pybind11/numpy.h>
#include "cpp_core.h"

namespace py = pybind11;
using namespace py::literals;

// --- 异常继承链映射 ---
struct SolverError : public std::runtime_error {
    using std::runtime_error::runtime_error;
};

// --- Trampoline 让 Python 能继承 LinearSolverBase 重写 solve() ---
class PyLinearSolver : public LinearSolverBase {
public:
    using LinearSolverBase::LinearSolverBase;
    Eigen::VectorXd solve(const Eigen::MatrixXd& A,
                          const Eigen::VectorXd& b) const override {
        PYBIND11_OVERRIDE_PURE(Eigen::VectorXd, LinearSolverBase, solve, A, b);
    }
    std::string name() const override {
        PYBIND11_OVERRIDE_PURE(std::string, LinearSolverBase, name, );
    }
};

PYBIND11_MODULE(_mylib, m) {
    m.doc() = "pybind11 example: Eigen/NumPy zero-copy + polymorphism";

    // 注册自定义异常 (放在其他绑定之前)
    py::register_exception<SolverError>(m, "SolverError", PyExc_RuntimeError);

    // --- 1. POD 结构体自动属性 ---
    py::class_<SolverResult>(m, "SolverResult")
        .def(py::init<>())
        .def_readwrite("x",              &SolverResult::x)
        .def_readwrite("iterations",     &SolverResult::iterations)
        .def_readwrite("residual_norm",  &SolverResult::residual_norm)
        .def_readwrite("converged",      &SolverResult::converged)
        .def("__repr__", [](const SolverResult& r){
            return "<SolverResult iters=" + std::to_string(r.iterations)
                 + " res="   + std::to_string(r.residual_norm)
                 + " conv="  + (r.converged?"True":"False") + ">";
        });

    // --- 2. 多态基类 + Trampoline ---
    py::class_<LinearSolverBase, PyLinearSolver /*trampoline*/,
               std::shared_ptr<LinearSolverBase>>
        (m, "LinearSolverBase")
        .def(py::init<>())
        .def("solve", &LinearSolverBase::solve, "A"_a, "b"_a,
             py::return_value_policy::take_ownership)
        .def("name",  &LinearSolverBase::name);

    // --- 3. 具体子类 ---
    py::class_<JacobiSolver, LinearSolverBase,
               std::shared_ptr<JacobiSolver>>
        (m, "JacobiSolver")
        .def(py::init<int, double>(),
             "max_iter"_a = 1000, "tol"_a = 1e-10,
             py::keep_alive<1, 2>())  // 例子：这里无实际引用，只是演示语法
        .def_property_readonly("max_iter", &JacobiSolver::max_iter)
        .def("__repr__", [](const JacobiSolver& s){
            return "<JacobiSolver max_iter=" + std::to_string(s.max_iter()) + ">";
        });

    // --- 4. 自由函数：Eigen 参数零拷贝 ---
    // 返回 C++ 分配的 std::vector<double> → Python list (自动)
    m.def("process_chunk_copy", [](const std::vector<double>& v, double s) {
        return process_chunk(v.data(), v.size(), s);
    }, "v"_a, "scale"_a = 1.0);

    // --- 5. numpy array 零拷贝只读版本 ---
    m.def("process_chunk_nocopy",
        [](py::array_t<double, py::array::c_style | py::array::forcecast> arr,
           double s) -> py::array_t<double>
        {
            py::buffer_info buf = arr.request();
            if (buf.ndim != 1) throw std::invalid_argument("need 1D array");
            size_t n = buf.shape[0];
            // 分配输出: 用 capsule 挂释放钩子
            auto* out = new std::vector<double>(n);
            auto res = process_chunk(static_cast<const double*>(buf.ptr), n, s);
            // 返回 C++ 分配内存，Python GC 时用 capsule delete
            py::capsule free_when_done(res.data(), [](void* p) {
                // capsule 持有数据所有权，这里我们要小心，见下面更安全方式
            });
            // 更安全模式：直接在 py::array 里管理
            std::unique_ptr<std::vector<double>> holder =
                std::make_unique<std::vector<double>>(std::move(res));
            double* ptr = holder->data();
            size_t sz  = holder->size();
            py::capsule cap(holder.get(), [](void* p){
                delete reinterpret_cast<std::vector<double>*>(p);
            });
            holder.release();
            return py::array_t<double>({sz},     // shape
                                       {sizeof(double)},  // strides (C style)
                                       ptr, cap);
        },
        "arr"_a.noconvert().readonly(), // 禁止隐式转换，要求 numpy 原生 double
        "scale"_a = 1.0,
        "Zero-copy numpy → Eigen::VectorXd → numpy"
    );

    // --- 6. Python 端派生示例工厂 ---
    m.def("run_solver", [](const LinearSolverBase& solver,
                           const Eigen::MatrixXd& A,
                           const Eigen::VectorXd& b) -> SolverResult {
        if (A.rows() != b.size()) throw SolverError("rows(A) != size(b)");
        if (A.rows() != A.cols()) throw SolverError("A not square");
        auto x = solver.solve(A, b);
        double rnorm = (A*x - b).norm();
        return {std::move(x), 0, rnorm, rnorm < 1e-9};
    }, "solver"_a, "A"_a, "b"_a);
}

// ====== cpp_core.cpp ======
#include "cpp_core.h"
#include <cmath>

Eigen::VectorXd JacobiSolver::solve(const Eigen::MatrixXd& A,
                                    const Eigen::VectorXd& b) const {
    const int n = (int)A.rows();
    const Eigen::VectorXd Dinv = A.diagonal().cwiseInverse();
    Eigen::VectorXd x = Eigen::VectorXd::Zero(n);
    for (int it = 0; it < max_iter_; ++it) {
        Eigen::VectorXd x_new = Dinv.cwiseProduct(
            b - (A.triangularView<Eigen::StrictlyLower>() * x)
              - (A.triangularView<Eigen::StrictlyUpper>() * x));
        if ((x_new - x).norm() < tol_) return x_new;
        x = x_new;
    }
    throw SolverError("Jacobi did not converge within max_iter");
}

std::vector<double> process_chunk(const double* in, size_t n, double scale) {
    std::vector<double> out(n);
    for (size_t i = 0; i < n; ++i) {
        double v = in[i] * scale;
        // 数值稳定的 soft-sign
        out[i] = v / (1.0 + std::fabs(v));
    }
    return out;
}

# ====== Python 端 __init__.py 包装 ======
# from ._mylib import (
#     LinearSolverBase, JacobiSolver, SolverResult,
#     process_chunk_copy, process_chunk_nocopy, run_solver,
#     SolverError
# )
# __all__ = ["LinearSolverBase","JacobiSolver","SolverResult",
#            "process_chunk_copy","process_chunk_nocopy","run_solver",
#            "SolverError"]
#
# # Python 端自定义派生 C++ 虚类: class MySolver(LinearSolverBase):
# #    def name(self): return "MyPythonSolver"
# #    def solve(self, A, b): return np.linalg.solve(A, b)
#
# ====== pyproject.toml 发布 wheel ======
# [build-system]
# requires = ["setuptools>=61","pybind11>=2.12","scikit-build-core>=0.9"]
# build-backend = "scikit_build_core.build"
# [project]
# name = "mylib"
# version = "0.1.0"
# requires-python = ">=3.8"`
  },
  {
    id:"cpp-ext5-q030",
    topicId:"cpp-ext5-interop",
    title:"C++/Java JNI互操作：RAII封装JNIEnv/引用管理、NIO DirectBuffer零拷贝、异常跨越JVM边界、线程附加分离",
    content:`### JNI 三大核心痛点
1. **引用手动管理**：LocalRef 每帧上限512个(JDK8默认)，忘记DeleteLocalRef会溢出；GlobalRef忘记DeleteGlobalRef导致Native堆泄漏
2. **JNIEnv* 线程绑定**：不能跨线程传递，任意线程必须AttachCurrentThread才能调用JVM方法
3. **异常吞掉UB**：JNI任何方法出错后如果不ExceptionCheck/Clear直接继续跑，后面调用全部JVM crash

### JNI 命名规则与签名(必须严格遵守)
- Java_com_example_myapp_MyClass_myMethod(JNIEnv*, jobject, ...) 静态方法第二个参数是jclass
- 签名编码：Z=bool, B=byte, C=char, S=short, I=int, J=long, F=float, D=double, V=void, Ljava/lang/String;=对象, [I=int[]
- 重载方法Java侧同名不同参，JNI可以同名，但GetMethodID要传不同签名

### RAII 四层封装消除资源泄漏
- **JNIEnv 访问器**：线程局部的 Attacher，进入时 Attach，退出时 Detach，daemon线程安全
- **LocalFrame**：JNI RAII Push/PopLocalFrame，作用域结束批量释放局部引用
- **GlobalRef 智能指针**：UniqueGlobalRef = std::unique_ptr<_jobject, GlobalRefDeleter>
- **String/Array 临界区**：GetStringCritical/GetPrimitiveArrayCritical 必须配对Release，禁用期间不能调任何其他JNI函数

### NIO DirectByteBuffer 零拷贝 vs jbyteArray
- **GetByteArrayElements**：要么拷贝要么pin，Release必调且模式要对(0=copy back, JNI_ABORT=不拷回)
- **GetDirectBufferAddress**：堆外内存，返回原始指针零拷贝，缓冲区分配在JVM堆外不受GC移动影响
- **大矩阵推荐**：Java侧 ByteBuffer.allocateDirect(n) → C++侧拿指针直接读写

### 异常双向跨越边界
- **C++ → Java**：在JNI函数尾部检测pending异常，ThrowNew抛给JVM；C++内部exception要catch住转成Java异常
- **Java → C++ 回调**：JVM调JNI，JNI里call Java方法，call完必须ExceptionCheck；否则后续调用JNINativeInterface任意函数都是Undefined Behavior
- **可抛出异常声明**：C++ JNIEXPORT函数建议noexcept(false)，内部catch(...)后转Java throw，绝不允许C++异常逃逸出JNI边界

### 线程与JVM生命周期
- JNI_OnLoad 保存 JavaVM* vm 全局指针，唯一允许跨线程的JNI对象
- 任意非JVM创建的线程(pthread / std::thread) 想回调Java：vm->AttachCurrentThread(&env,nullptr) + thread_local 自动 DetachCurrentThread
- 不要在信号处理器里调用JNI函数，JVM不是async-signal-safe的`,
    example:`// ====== JNI Wrapper 头文件: jni_raii.h (生产级封装) ======
#pragma once
#include <jni.h>
#include <cassert>
#include <memory>
#include <string>
#include <stdexcept>
#include <thread>
#include <mutex>
#include <vector>

// ---- 1. 全局保存 JavaVM* 指针 (JNI_OnLoad 设置) ----
extern JavaVM* g_jvm;
inline JavaVM* GetJVM() { return g_jvm; }
JNIEnv* GetEnvOrAttach(bool* attached = nullptr);
void  DetachCurrentThreadIfNeeded();

// ---- 2. 栈式 LocalFrame RAII ----
class JNILocalFrame {
public:
    explicit JNILocalFrame(JNIEnv* e, int capacity = 64) : env(e) {
        if (env && env->PushLocalFrame(capacity) < 0) {
            throw std::runtime_error("PushLocalFrame failed (OOM?)");
        }
    }
    ~JNILocalFrame() { if (env) env->PopLocalFrame(nullptr); }
    JNILocalFrame(const JNILocalFrame&) = delete;
    JNILocalFrame& operator=(const JNILocalFrame&) = delete;
private:
    JNIEnv* env;
};

// ---- 3. GlobalRef / WeakGlobalRef 智能指针 ----
struct GlobalRefDeleter {
    void operator()(_jobject* obj) const noexcept;
};
struct WeakGlobalRefDeleter {
    void operator()(_jobject* obj) const noexcept;
};
using JNIGlobalRef     = std::unique_ptr<_jobject, GlobalRefDeleter>;
using JNIWeakGlobalRef = std::unique_ptr<_jobject, WeakGlobalRefDeleter>;

template<class T> inline
std::unique_ptr<T, GlobalRefDeleter> MakeGlobal(JNIEnv* e, T obj) {
    if (!obj) return {nullptr, GlobalRefDeleter{}};
    auto* g = static_cast<T>(e->NewGlobalRef(obj));
    return std::unique_ptr<T, GlobalRefDeleter>(g, GlobalRefDeleter{});
}

// ---- 4. Java String 转 std::string (GetStringUTFChars 自动释放) ----
inline std::string JStringToStd(JNIEnv* e, jstring js) {
    if (!js) return {};
    const char* p = e->GetStringUTFChars(js, nullptr);
    if (!p) return {};
    std::string s(p);
    e->ReleaseStringUTFChars(js, p);
    return s;
}
inline jstring StdToJString(JNIEnv* e, const std::string& s) {
    return e->NewStringUTF(s.c_str());
}

// ---- 5. 异常抛出工具: 检测 pending + C++ exception 转 Java ----
inline bool JNIHasException(JNIEnv* e) { return e->ExceptionCheck(); }
inline void JNIClearException(JNIEnv* e) { e->ExceptionClear(); }
inline void JNIThrowRuntime(JNIEnv* e, const char* msg) {
    jclass c = e->FindClass("java/lang/RuntimeException");
    if (c) e->ThrowNew(c, msg);
    e->DeleteLocalRef(c);
}

// ---- 6. 类/方法ID 全局缓存 (找一次，后续O(1)用) ----
struct JNIClassIDs {
    jclass cls_MatrixResult;  // global ref
    jmethodID mid_MatrixResult_ctor;
    jfieldID  fid_MatrixResult_rows, fid_MatrixResult_cols, fid_MatrixResult_buf;
    bool Init(JNIEnv* e);
};
extern JNIClassIDs g_ids;

// ====== jni_raii.cpp ======
#include "jni_raii.h"
JavaVM* g_jvm = nullptr;
JNIClassIDs g_ids{};

JNIEnv* GetEnvOrAttach(bool* attached) {
    JNIEnv* env = nullptr;
    jint r = g_jvm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6);
    if (r == JNI_OK) {
        if (attached) *attached = false;
        return env;
    }
    if (r == JNI_EDETACHED) {
        JavaVMAttachArgs args{JNI_VERSION_1_6, nullptr, nullptr};
        if (g_jvm->AttachCurrentThread(reinterpret_cast<void**>(&env), &args) == JNI_OK) {
            if (attached) *attached = true;
            thread_local struct Detacher { ~Detacher(){
                if (g_jvm) g_jvm->DetachCurrentThread();
            }} _;
            return env;
        }
    }
    return nullptr;
}
void GlobalRefDeleter::operator()(_jobject* obj) const noexcept {
    if (!obj || !g_jvm) return;
    JNIEnv* e = nullptr;
    bool attached = false;
    if (g_jvm->GetEnv(reinterpret_cast<void**>(&e), JNI_VERSION_1_6) == JNI_EDETACHED) {
        if (g_jvm->AttachCurrentThread(reinterpret_cast<void**>(&e), nullptr) != JNI_OK) return;
        attached = true;
    }
    if (e) e->DeleteGlobalRef(obj);
    if (attached) g_jvm->DetachCurrentThread();
}
void WeakGlobalRefDeleter::operator()(_jobject* obj) const noexcept {
    if (!obj || !g_jvm) return;
    JNIEnv* e = nullptr;
    bool attached = false;
    if (g_jvm->GetEnv(reinterpret_cast<void**>(&e), JNI_VERSION_1_6) == JNI_EDETACHED) {
        if (g_jvm->AttachCurrentThread(reinterpret_cast<void**>(&e), nullptr) != JNI_OK) return;
        attached = true;
    }
    if (e) e->DeleteWeakGlobalRef(obj);
    if (attached) g_jvm->DetachCurrentThread();
}

bool JNIClassIDs::Init(JNIEnv* e) {
    jclass c = e->FindClass("com/example/MatrixResult");
    if (!c) return false;
    cls_MatrixResult = static_cast<jclass>(e->NewGlobalRef(c));
    mid_MatrixResult_ctor  = e->GetMethodID(c, "<init>", "(IILjava/nio/ByteBuffer;)V");
    fid_MatrixResult_rows  = e->GetFieldID(c, "rows", "I");
    fid_MatrixResult_cols  = e->GetFieldID(c, "cols", "I");
    fid_MatrixResult_buf   = e->GetFieldID(c, "buf",  "Ljava/nio/ByteBuffer;");
    e->DeleteLocalRef(c);
    return mid_MatrixResult_ctor && fid_MatrixResult_rows && fid_MatrixResult_cols && fid_MatrixResult_buf;
}

// ====== Native 侧具体业务: JNIEXPORT 函数 ======
#include "jni_raii.h"
#include <cmath>
#include <cstring>

// JNI 入口: 保存 JavaVM*
extern "C" jint JNI_OnLoad(JavaVM* vm, void*) {
    g_jvm = vm;
    JNIEnv* e = nullptr;
    if (vm->GetEnv(reinterpret_cast<void**>(&e), JNI_VERSION_1_6) != JNI_OK)
        return JNI_ERR;
    if (!g_ids.Init(e)) return JNI_ERR;
    return JNI_VERSION_1_6;
}

// 例1: byte[] 数组处理 (推荐: GetPrimitiveArrayCritical)
extern "C" JNIEXPORT jdouble JNICALL
Java_com_example_NativeLib_dotProduct(JNIEnv* e, jclass,
                                      jdoubleArray a, jdoubleArray b) noexcept try {
    if (!a || !b) { JNIThrowRuntime(e,"null arrays"); return 0.0; }
    jsize na = e->GetArrayLength(a), nb = e->GetArrayLength(b);
    if (na != nb) { JNIThrowRuntime(e,"arrays length mismatch"); return 0.0; }
    // Critical 区域: 禁止任何其他 JNI 调用 (含NewObject, FindClass等)
    jboolean a_copied, b_copied;
    double* pa = static_cast<double*>(e->GetPrimitiveArrayCritical(a, &a_copied));
    double* pb = static_cast<double*>(e->GetPrimitiveArrayCritical(b, &b_copied));
    if (!pa || !pb) {
        if (pa) e->ReleasePrimitiveArrayCritical(a, pa, JNI_ABORT);
        JNIThrowRuntime(e, "GetPrimitiveArrayCritical OOM");
        return 0.0;
    }
    double sum = 0.0;
    for (jsize i = 0; i < na; ++i) sum += pa[i] * pb[i];
    // 必须配对释放！模式: 不需要写回用JNI_ABORT
    e->ReleasePrimitiveArrayCritical(b, pb, JNI_ABORT);
    e->ReleasePrimitiveArrayCritical(a, pa, JNI_ABORT);
    return sum;
} catch (const std::exception& ex) {
    JNIThrowRuntime(e, ex.what());
    return 0.0;
} catch (...) {
    JNIThrowRuntime(e, "unknown C++ exception in dotProduct");
    return 0.0;
}

// 例2: NIO DirectByteBuffer 零拷贝返回大矩阵
extern "C" JNIEXPORT jobject JNICALL
Java_com_example_NativeLib_matrixMul(JNIEnv* e, jclass,
                                     jint Arows, jint AcolsBrows, jint Bcols,
                                     jobject Abuf, jobject Bbuf) noexcept try {
    JNILocalFrame lf(e, 16); // 预分配16个local引用槽位
    double* A = static_cast<double*>(e->GetDirectBufferAddress(Abuf));
    double* B = static_cast<double*>(e->GetDirectBufferAddress(Bbuf));
    jlong  A_size = e->GetDirectBufferCapacity(Abuf);
    jlong  B_size = e->GetDirectBufferCapacity(Bbuf);
    if (!A || !B) { JNIThrowRuntime(e,"buffer is not direct"); return nullptr; }
    if (A_size != (jlong)Arows * AcolsBrows * (jint)sizeof(double)) {
        JNIThrowRuntime(e, "A buffer size mismatch"); return nullptr;
    }
    if (B_size != (jlong)AcolsBrows * Bcols * (jint)sizeof(double)) {
        JNIThrowRuntime(e, "B buffer size mismatch"); return nullptr;
    }
    const int R = Arows, K = AcolsBrows, C = Bcols;
    const size_t out_bytes = (size_t)R * C * sizeof(double);
    // 分配 DirectByteBuffer (受 JVM 管理，GC 自动释放)
    jobject outBuf = e->NewDirectByteBuffer(new double[R*C], out_bytes);
    // 可选：注册 Deallocator，当 ByteBuffer 被 GC 时 delete[]
    // 简化实现：用 cleaner 或 在 Java 端注册
    double* O = static_cast<double*>(e->GetDirectBufferAddress(outBuf));
    // 简单三重循环矩阵乘法 (生产用 BLAS openblas)
    std::memset(O, 0, out_bytes);
    for (int i = 0; i < R; ++i)
        for (int k = 0; k < K; ++k) {
            const double a = A[i*K + k];
            for (int j = 0; j < C; ++j) O[i*C + j] += a * B[k*C + j];
        }
    // 返回包装 Java 对象: new MatrixResult(R, C, outBuf)
    return e->NewObject(g_ids.cls_MatrixResult,
                        g_ids.mid_MatrixResult_ctor,
                        Arows, Bcols, outBuf);
} catch (const std::exception& ex) {
    JNIThrowRuntime(e, ex.what());
    return nullptr;
} catch (...) {
    JNIThrowRuntime(e, "unknown C++ exception in matrixMul");
    return nullptr;
}

// 例3: C++ std::thread 异步回调 Java ProgressListener
static JNIGlobalRef g_listener_obj;
static jmethodID   g_listener_onProgress;
static jmethodID   g_listener_onDone;

extern "C" JNIEXPORT void JNICALL
Java_com_example_NativeLib_startAsync(JNIEnv* e, jclass, jobject listener) noexcept {
    JNILocalFrame lf(e, 8);
    jclass cls = e->GetObjectClass(listener);
    g_listener_obj = MakeGlobal(e, listener);
    g_listener_onProgress = e->GetMethodID(cls,"onProgress","(I)V");
    g_listener_onDone     = e->GetMethodID(cls,"onDone","(Z)V");
    std::thread([total = 100] {
        bool attached;
        JNIEnv* te = GetEnvOrAttach(&attached);
        if (!te || !g_listener_obj) return;
        JNILocalFrame lf2(te, 4);
        bool ok = true;
        for (int i = 1; i <= total; ++i) {
            // 模拟计算
            std::this_thread::sleep_for(std::chrono::milliseconds(5));
            te->CallVoidMethod(g_listener_obj.get(), g_listener_onProgress, i);
            if (JNIHasException(te)) { JNIClearException(te); ok=false; break; }
        }
        te->CallVoidMethod(g_listener_obj.get(), g_listener_onDone, ok ? JNI_TRUE : JNI_FALSE);
    }).detach();
}

# // ====== Java 侧代码: NativeLib.java ======
# package com.example;
# import java.nio.ByteBuffer;
# public class NativeLib {
#     static { System.loadLibrary("nativedemo"); }
#     public static native double dotProduct(double[] a, double[] b);
#     public static native MatrixResult matrixMul(int Arows, int AcolsBrows, int Bcols,
#                                                 ByteBuffer A, ByteBuffer B);
#     public static native void startAsync(ProgressListener listener);
#     public interface ProgressListener {
#         void onProgress(int percent);
#         void onDone(boolean ok);
#     }
#     public static ByteBuffer allocDoubles(int n) {
#         return ByteBuffer.allocateDirect(n * Double.BYTES);
#     }
# }
#
# // ====== MatrixResult.java ======
# package com.example;
# import java.nio.ByteBuffer;
# public class MatrixResult {
#     public final int rows, cols;
#     public final ByteBuffer buf;   // Direct: 双端直接访问
#     public MatrixResult(int r, int c, ByteBuffer b) { rows=r; cols=c; buf=b; }
#     public double get(int i, int j) {
#         return buf.getDouble((long)(i*cols + j) * Double.BYTES);
#     }
# }
#
# // ====== CMakeLists.txt (Android 也适用) ======
# cmake_minimum_required(VERSION 3.22)
# project(nativedemo)
# find_package(JNI REQUIRED)   # 桌面JVM
# add_library(nativedemo SHARED jni_raii.cpp native_lib.cpp)
# target_link_libraries(nativedemo PRIVATE JNI::JNI)
# target_compile_features(nativedemo PRIVATE cxx_std_20)
# target_compile_options(nativedemo PRIVATE -O2 -fno-exceptions -fno-rtti)
# # Android NDK 模式: find_package(JNI) 不需要，直接链接 android log`
  }
]