## 环境

**webpack** : 3.10 +

---

## webpack 简介

- 概述

    详见 [Webpack 概念](../概念.md)。

- 版本更迭、功能进化

    - webpack v1.0.0 —— 2014.2.20

        1. 编译、打包
        2. HMR（ 热模块更新 ）
        3. 代码分割
        4. 文件处理（ Loader、Plugin ）

    - webpack v2.2.0 —— 2017.1.18

        1. Tree Shaking
        2. ES module（ 在之前的版本需要使用 Babel，只是 module 语法 ）
        3. 动态 Import（ `import()` ）
        4. 新官网、新文档

    - webpack v3.0.0 —— 2017.6.19

        1. Scopr Hoisting（ 作用域提升 ）
        2. Magic Comments（ 配合动态 `import` 使用 ）

---

## 知识点

- [基础知识](#基础知识)

    - 前端发展历史
    - 模块化开发

- [文件处理](#文件处理)

    - [编译 ES6 / 7](#%E7%BC%96%E8%AF%91-es6--7)
    - 编译 TypeScript
    - 打包公共代码
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

    其中更详细的细节可以参考：[AMD, CMD, CommonJS和UMD](https://www.jianshu.com/p/bd4585b737d7)

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
    
    2. CommonJS（ 服务端 - 掌握 ）

        一个文件就是一个模块，外部文件无法读取内部变量以及方法，只能通过 `module.exports` 暴露接口。外部文件通过 `require` 方法引入模块以获得内容。

        由于 CommonJS 运行在 NodeJS 服务端，这些 `require` 命令相当于是读取本地文件，以至于 `require` 命令是「同步执行」的。

    3. AMD、CMD、UMD（ 浏览器端 - 了解 ）

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

        **CMD 推荐写法**：

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

        Universal Module Definition（ 通用模块定义 ），是通用的模块解决方案。

        UMD 实际上做三件事情：

        1. 判断是否支持 AMD。
        2. 判断是否支持 CommonJS 和 UMD。
        3. 如果上述两步都不支持，则声明为全局变量。

        ---

        AMD 和 CMD 的区别：对于依赖的模块，AMD 是提前执行（ 编译后相当于把所有 `require` 前置 ），CMD 是延迟执行（ 也就是执行到需要的模块才执行 `require` ）。CMD 推崇依赖就近，AMD 推崇依赖前置。

    4. ES 6 module（ 掌握 ）

        ESM（ EcmaScript Module ），一个文件就是一个模块，使用 `import` 和 `export` 引入模块和暴露内容。具体内容可以查看 [Module 语法](../../ES6/Module的语法.md)。

        ```javascript
        import theDefault, { named1, named2 } from 'src/mylib'
        // 等同
        import theDefault from 'src/mylib'
        import { named1, named2 } from 'src/mylib'

        // 重命名
        import { named1 as myNamed1, named2 } from 'src/mylib'

        // 加载所有暴露的方法、变量
        import * as mylib from 'src/mylib'

        // 引用
        import 'src/mylib'
        ```

- CSS 模块化

    CSS 模块化 实际上就是 CSS 的设计模式，现如今大致有如下设计模式：

    - OOCSS

        Object Oriented CSS（ 面向对象的 CSS ），资料：[OOCSS——概念篇](https://www.w3cplus.com/css/oocss-concept)。目的为了结构和设计的分离，容器和内容的分离。开发人员可以获得在不同地方使用相同的 CSS 类。

    - SMACSS
    - Atomic CSS
    - MCSS
    - AMCSS
    - BEM

---

## 文件处理

### 编译 ES6 / 7

编译 ES6 / 7 我们需要使用 **Babel** 生成静态文件，使用的 loader 的是 **Babel-loader**。

结合 webpack 使用说明：[使用 Babel | Babel中文网](https://babeljs.cn/docs/setup/#installation)。

**Babel Polyfill**：

> 由于各个浏览器对于标准的实现不一致，所以我们需要它保持开发中相同的 API（ 会污染全局环境 ）。

- 全局垫片
- 为应用准备

**# 安装**

```bash
npm i --save babel-polyfill
```

**# 使用**

```javascript
// index.js
import 'babel-polyfill'
```

```javascript
// webpack.config.js
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                target: {
                                    browsers: ['last 2 version']
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    }
}
// 或者使用 .babelrc
```

**Babel Runtime Transform**：

> 相对于 `Babel Polyfill`，生成局部的方法或变量，不会污染全局变量。而且在使用的

- 局部垫片
- 为开发框架准备

**# 安装**

```bash
$ npm i --save-dev babel-plugin-transform-runtime
$ npm i --save babel-runtime
```

或者

```bash
$ npm i --save-dev @babel/plugin-transform-runtime
$ npm i --save @babel/runtime
```

**# 使用**

新建文件 `.babelrc`，内容如下： 

```json
{
    "presets": [
        ["env", {
            "target": {
                "browsers": ["last 2 version"]
            }
        }]
    ],
    "plugins": ["transform-runtime"]
}
```

或者（ 对应上面的第二种安装方法 ）

```json
{
    "presets": [
        ["@babel/preset-env", {
            "target": {
                "browsers": ["last 2 version"]
            }
        }]
    ],
    "plugins": ["@babel/transform-runtime"]
}
```

---

### 编译 TypeScript

**# 安装**

```bash
$ npm i --save-dev typescript
$ npm i --save-dev ts-loader
$ npm i --save-dev awesome-typescript-loader
```

**# 配置**

创建并配置 `tsconfig.json` 文件，详细内容：[Tsconfig Json - TypeScript 中文手册](https://typescript.bootcss.com/tsconfig-json.html)

其中的配置选项详情：[Compiler Options - TypeScript 中文手册](https://typescript.bootcss.com/compiler-options.html)

```javascript
// webpack.config.js
module.exports = {
    entry: {
        app: './src/app.ts'
    },
    output: {
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                }
            }
        ]
    }
}
```

在 `tsconfig.json` 中配置如下选项：

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "allowJs": true
    },
    "include": [
        "./src/*"
    ],
    "exclude": [
        "./node_modules"
    ]
}
```

**# 声明文件**

当我们引入并使用第三方类库的时候，各个类库都有自己的一套类型标准，也就是声明文件，我们可以安装对应类库的声明文件来检查我们是否正确使用第三方类库：

```bash
npm i --save @types/lodash
npm i --save @types/vue
```

这样我们就可以在比如：传错参数的时候，在构建过程（ `webpack` 命令 ）能够得到明确的错误的反馈。

**# Typings**

作用和上方的「声明文件」相同

```bash
npm i -g typings
typings install lodash --save
```

这时候在我们发项目根目录发现生成了一个 `typings.json` 的文件以及 `typings` 文件夹，类似 `node_modules`。

**问**：如何使用呢？

**答**：在 `tsconfig.json` 文件中，在 `compilerOptions.typeRoots` 数组下添加 `./typings/modules`，告诉编译器到该目录下寻找声明文件。

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "typeRoots": [
            "./node_modules/@type",
            "./typings/modules"
        ]
    }
}
```

---

### 打包公共代码、代码分割、懒加载

- 打包公共代码、代码分割详见：[代码分离](../代码分离.md)

- 懒加载（ lazy load ）

> 让用户在尽可能更短的时间内看到想要的页面。避免带宽浪费、长时间加载。

1. webpack methods（ webpack 内置方法 `require.ensure` 和 `require.include` ）

    详情：[Module Method | webpack](https://www.webpackjs.com/api/module-methods/#require-ensure)

2. ES 2015 load spec（ 2015 规范 ）

---

## 开发环境

---

## 打包优化

---

## 框架配合
