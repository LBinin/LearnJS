## 环境

**webpack** : 3.10+

---

## 知识点

- [基础知识](#基础知识)

    - 前端发展历史
    - 模块化开发

- [文件处理](#文件处理)

    - 编译 ES6 / 7
    - 编译 TypeScript
    - 编译 Less / Sass
    - PostCss 处理浏览器前缀
    - Css nano 压缩 CSS
    - 自动生成 HTML 模板文件
    - 图片压缩 和 Base64 编码
    - 自动生成雪碧图

- [开发环境](#开发环境)

    - 配置 SourceMap
    - 配置远程接口代理
    - 配置动态 entry 更新
    - 配置模块热更新
    - 配置 ESLint 检查代码格式

- [打包优化](#打包优化)

    - 代码风格和懒加载
    - 提取公用代码
    - Tree-shaking
    - 长缓存配置

- [框架配合](#框架配合)

    - Vue-cli
    - Angular-cli
    - React

---

## 基本要求

- 对 NodeJS 有了解
- 有前端基础 HTML、CSS、JavaScript
- 了解基本的前端优化
- 对主流框架有一定的认识

## 目的

- 了解现代前端工程搭建和配置
- 了解现代前端优化手段
- 熟悉通过工具提高开发效率
- 掌握 **Webapck** 常见配置

---

## 基础知识

### 模块化开发（ **webpack** 相关 ）

- JS 模块化

    前端 JS 模块化的进化过程：

    1. 命名空间

        **库名.类别名.方法名**

        ```javascript
        var NameSpace = {}

        NameSpace.type = NameSpace.type || {} // 为了防止命名空间被覆盖
        // 定义方法
        NameSpace.type.method = function() {
          /* code */
        }
        ```
    
    2. CommonJS（ 服务端 ）

        一个文件就是一个模块，外部文件无法读取内部变量以及方法，只能通过 `module.exports` 暴露接口。外部文件通过 `require` 方法引入模块以获得内容。

        由于 CommonJS 运行在 NodeJS 服务端，这些 `require` 命令相当于是读取本地文件，以至于 `require` 命令是「同步执行」的。

    3. AMD、CMD、UMD（ 浏览器端 ）

        Async Module Definition（ 异步模块定义 ）。其使用 `definde` 命令定义模块，使用 `require` 命令引用模块。
        
        AMD 是 **RequireJS** 在推广过程中对模块定义的规范化产出。

        AMD 特点：依赖前置，提前执行。

        **AMD 推荐写法**：

        ```javascript
        define(
          // 模块名
          'alpha',
          // 依赖
          ['require', 'exports', 'beta'],
          // 模块输出( 参数为模块依赖，以在内部使用 )
          function (require, exports, beta) {
            exports.verb = function() {
              return beta.verb();
              // 或者
              return require('beta').verb()
            }
          }
        )
        ```

        ---

        Common Module Definition（ 通用模块定义 ），同样使用 `definde` 命令定义模块，使用 `require` 命令引用模块。

        CMD 是 **SeaJS** 在推广过程中对模块定义的规范化产出。

        **UMD 推荐写法**：

        ```javascript
        define(function(require, exports, module) {
          var a = require('./a')
          a.doSomething()
          var b = require('./b') // 依赖可以就近书写
          b.doSomething()
          // ... 
        })
        ```

        CMD 特点：尽可能的懒执行。

        ---

        AMD 和 CMD 的区别：对于依赖的模块，AMD 是提前执行（ 编译后相当于把所有 `require` 前置 ），CMD 是延迟执行（ 也就是执行到需要的模块才执行 `require` ）。CMD 推崇依赖就近，AMD 推崇依赖前置。

    4. ES 6 module

        ESM（ EcmaScript Module ），一个文件就是一个模块，使用 `import` 和 `export` 引入模块和暴露内容。

- CSS 模块化

---

## 文件处理

---

## 开发环境

---

## 打包优化

---

## 框架配合