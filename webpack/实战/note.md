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
    - [编译 TypeScript](#%E7%BC%96%E8%AF%91-typescript)
    - [打包公共代码、代码分割、懒加载](#%E6%89%93%E5%8C%85%E5%85%AC%E5%85%B1%E4%BB%A3%E7%A0%81%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2%E6%87%92%E5%8A%A0%E8%BD%BD)
    - [编译 Less / Sass](#%E7%BC%96%E8%AF%91-less--sass)
    - [提取 CSS](#%E6%8F%90%E5%8F%96-css)
    - [PostCss in Webpack](#postcss-in-webpack)
    - [Browserslist](#browserslist)
    - [Tree shaking](#tree-shaking)
    - [图片处理](#图片处理)
    - [字体处理](#字体处理)
    - [处理第三方 JavaScript 库](#%E5%A4%84%E7%90%86%E7%AC%AC%E4%B8%89%E6%96%B9-javascript-%E5%BA%93)
    - [自动生成 HTML 模板文件](#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90-html-%E6%A8%A1%E6%9D%BF%E6%96%87%E4%BB%B6)
    - [在 HTML 中引入图片](#%E5%9C%A8-html-%E4%B8%AD%E5%BC%95%E5%85%A5%E5%9B%BE%E7%89%87)

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

[[ ⬆️ 回到目录]](#知识点)

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
              return beta.verb()
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

[[ ⬆️ 回到目录]](#知识点)

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

> 相对于 `Babel Polyfill`，生成局部的方法或变量，不会污染全局变量。

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

[[ ⬆️ 回到目录]](#知识点)

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

[[ ⬆️ 回到目录]](#知识点)

- 打包公共代码、代码分割详见：[代码分离](../代码分离.md)

- 懒加载（ lazy load ）

> 让用户在尽可能更短的时间内看到想要的页面。避免带宽浪费、长时间加载。

1. webpack methods（ webpack 内置方法 `require.ensure` 和 `require.include` ）

    - `require.ensure` 详情：[Module Method | webpack](https://www.webpackjs.com/api/module-methods/#require-ensure)

        ```javascript
        //预加载 懒执行
        require.ensure(['./mod.js'], function(require){ // 这里数组里是要预加载的模块，不写的话不会先下载
            var mod = require('./mod.js') // 执行 mod.js
            mod.show()
        }, 'chunkName')
        ```

        上面的例子表示：第一个参数「预加载的依赖」数组中的 `mod.js` 会被浏览器下载（ 预加载 ），但是 `mod.js` 的内容不会被立即执行（ 懒执行 ），在第二个参数「回调函数」中 `require` 调用的时候才会真正执行。构建后生成的 chunk 的 `Chunk Nmaes` 会被指定为第三个参数「chunk 的名称」。

    - `require.include` 详情：[Module Method | webpack](https://www.webpackjs.com/api/module-methods/#require-include)

        `require.include` 只接受一个参数，就是需要加载的模块。作用是只加载，但是不执行，和 `require.ensure` 类似，区别是它只接收一个参数，其中一个使用场景如下：

        > 当两个子模块都依赖「同一个」第三方模块的时候，可以在父模块中**提前加载**，子模块就不会再次加载该第三方模块。

2. ES 2015 load spec（ 2015 规范 ）

    `import()` 命令：该命令接受一个「字符串」参数，用于动态加载模块。该命令返回一个 **Promise** 对象。

    需要注意的是：通过该方法，默认不添加对应 chunk 的 `chunkName`，如果需要添加 `chunkName` 需要在 `import` 方法中添加注释，如：

    ```javascript
    import(/* webpackChunkName: "print" */ './print').then(module => {
        var print = module.default
        print()
    })
    ```

    这时候该 chunk 的 `chunkName` 便为注释中的 `print`（ 记得添加双引号 ），并在 `webpack.config.js` 中使用 `output.chunkFilename` 控制文件名。

    **注意**：通过上面两种方法引入的模块的 bundle 名称由 `output.chunkFilename` 属性控制，支持 `[name]` 等占位符。

---

### 编译 Less / Sass

[[ ⬆️ 回到目录]](#知识点)

说到结合 **webpack** 对 Less 和 Sass 进行编译之前，不得不先说说在 **webpack** 中对 CSS 的处理。

在 webpack 中加载 CSS 可以查看：[资源管理 / 加载 CSS](../资源管理.md#加载-CSS)。

该小结的主要内容：

- 引入
- CSS modules
- 配置 Less / Sass
- 提取 CSS 代码（ 利于缓存以及减小 bundle 大小 ）

这里处理 CSS 有两个关键的基础 loader：

- `style-loader` 主要用于向 HTML 文档流中创建 `<style>` 标签。

    `style-loader` 拥有以下两个插件：

    - `style-loader/url`：用于配合 `file-loader`，将引入的 CSS 单独打包成一个文件，然后在文档流添加一个 `<link>` 标签引入新生成的文件，不过弊端就是：引入了几个 CSS，就会生成几个 CSS 文件，导致更多的网络请求。

        ```javascript
        use: [
            {
                loader: 'style-loader/url',
            },
            {
                loader: 'file-loader',
            }
        ]
        ```

        如果生成后的文件路径出错记得修改 `output.publicPath` 属性。

    - `style-loader/useable`：用于控制样式是否使用。

        ```javascript
        use: [
            {
                loader: 'style-loader/useable',
            },
            {
                loader: 'css-loader',
            }
        ]
        ```

        然后在 `index.js` 中可以控制是否使用样式（ 实际上就是添加 / 删除对应的 `<style>` 标签 ）：

        ```javascript
        import base from './css/base.css'

        // 下面的方法可以在浏览器运行时使用
        base.use() // 使用该样式
        base.unuse() // 取消该样式
        ```

    **`style-loader` 配置选项**：

    - `insertAt`：控制 `<style>` 标签的插入位置。
    - `insertInto`：控制 `<style>` 标签插入到 DOM。（ CSS 选择器 ）
    - `singleton`：控制是否只使用**一个** `<style>` 标签。（ 布尔值 ）
    - `transform`：在用于 CSS 转化。是一个「文件路径」，该文件暴露一个函数，这个函数接收处理前的 CSS 内容为参数，需要 `return` 处理后的 CSS 内容。（ 在**每个** `<style>` 标签**插入**的时候执行的，而不是在打包的时候执行的，所以可以拿到 `window` 等参数 ）

    更多详情：[style-loader | webpack](https://www.webpackjs.com/loaders/style-loader/)

- `css-loader` 主要用于让 JavaScript 可以 `import` 一个 CSS 文件，以及处理 CSS 内容，并将处理后的内容传递给 `sytle-loader`。

    **`css-loader` 配置选项**：

    - `alias`：解析时候的别名。与 **webpack** 的 `resolve.alias` 的语法相同。
    - `importLoader`：用于配置「`css-loader` 作用于 `@import` 的资源之前」有多少个 loader。
    - `minimize`：用于控制是否压缩 CSS 内容。（ 基于 **cssnano** 的 minifier ）
    - `localIdentName`：控制选择器名称，如 `[path][name]__[local]--[hash:base64:5]`（ 当前 CSS 文件路径 + 当前 CSS 文件的名称 + 本地样式的名称 + 5 位的 Base64 ）。
    - `modules`：控制是否启用 CSS 模块规范。

        CSS 模块规范：

        - `:local`：定义局部作用域的一个样式。
        - `:global`：定义全局作用域的一个样式。
        - `compose:`：继承样式。
        - `compose: ... from path`：引入外部样式。

    更多详情：[css-loader | webpack](https://www.webpackjs.com/loaders/css-loader/)

**# 安装**

```bash
$ npm i --save-dev style-loader css-loader
```

**# 使用**

❗️需要注意的一个地方是：loader 是按「顺序」使用的。先使用的 loader 应该放在 `use` 数组的最后，**webpack** 会从前往后依次调用。

比如：我们需要先使用 `css-loader` 处理 CSS 后再使用 `style-loader` 插入到文档流中，所以 `use` 数组的第一个元素是 `{loader: 'style-loade', options: {}}`，然后才是 `{loader: 'css-loade', options: {}}`。等到我们之后处理 Less 或者 Sass 的时候，`less-loader` 或者 `sass-loader` 需要放在 `css-loader` 之后，将 Less / Sass 文件处理成正常的 CSS 文件后再交给 `css-loader` 进行处理。

```javascript
// webpack.config.js
module.exports = {
    // ...
    modules: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {}
                    },
                    {
                        loader: 'css-loader',
                        options: {}
                    }
                ]
            }
        ]
    }
}
```

**现在**，我们开始配置 Less / Sass：

首先安装 Less / Sass 以及对应的 loader：

```bash
$ npm i --save-dev less less-loader
$ npm i --save-dev node-sass sass-loader
```

然后在 `webpack.config.js` 中配置（ 以 less 文件为例，注意 loader 的顺序 ）：

```javascript
module: {
    rules: [
        {
            test: /\.less$/,
            use: [
                {
                    loader: 'style-loader',
                    options: {}
                },
                {
                    loader: 'css-loader',
                    options: {}
                },
                {
                    loader: 'less-loader',
                }
            ]
        }
    ]
}
```

然后就可以在模块中引入 `less` 文件啦。

---

### 提取 CSS

[[ ⬆️ 回到目录]](#知识点)

方式：

1. `extract-loader`，详情 [extract-loader | webpack](https://www.webpackjs.com/loaders/extract-loader/)
2. `ExtractTextWebpackPlugin` 插件，详情 [ExtractTextWebpackPlugin | webpack](https://www.webpackjs.com/plugins/extract-text-webpack-plugin/)

推荐使用 `ExtractTextWebpackPlugin` 插件，这种方法较为主流。

**# 安装**

```bash
$ npm i --save-dev extract-text-webpack-plugin
```

**# 配置 & 使用**

在 `webpack.config.js` 配置文件中添加以下内容：

```javascript
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"), // 输出文件名为 style.css
  ]
}
```

解析：

在 `plugins` 添加 `ExtractTextPlugin` 插件，参数为一个配置对象，如：

```javascript
plugins: {
    new ExtractTextPlugin({
        filename: '[name].min.js'
    })
}
```

然后在 `use` 字段使用 `ExtractTextPlugin` 的 `extract` 方法，如：

```javascript
rules: [
    {
        test: /\.css$/, // 对于 CSS 文件
        // 进行提取，extract 方法接收一个配置对象作为参数
        use: ExtractTextPlugin.extract({
            fallback: "style-loader", // 不提取时的使用方式
            use: "css-loader" // 处理内容的 loader
        })
    }
]
```

如果有多于一个 `ExtractTextPlugin` 示例的情形，则应该使用此方法每个实例上的 `extract` 方法：

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 创建多个实例
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css')
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ])
      },
    ]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
}
```

配合 Less 使用 `ExtractTextPlugin`：

```javascript
// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            }
        ]
    }
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}
```

❗️但是通过这中方式生成的 CSS 文件不会自动的插入到 HTML 文档流中，所以 HTML 中的 `<link>` 标签需要手动添加。

❗️此外，在 `plugins` 中实例化 `ExtractTextPlugin` 模块的时候，配置对象中还有一个需要注意的选项 `allChunk`。

该选项为一个「布尔值」，如果为 `true` 则会将所有 `import` 的 CSS 文件（ 以上面代码为例 ）都提取出来生成新的 CSS 文件。如果为 `false` （ 默认 ）的话，则仅从初始的 chunk 中提取（ 也就是入口文件同步加载的 CSS，排除了异步加载的 CSS 模块 ）其他动态加载的 CSS 会放在各自的模块中加载，也就是使用 `fallback` 中指定的方式。

当使用 `CommonsChunkPlugin` 并且在公共 chunk 中有来自 `ExtractTextPlugin.extract` 提取的 chunk 时，`allChunks` 必须设置为 `true`。

---

### PostCss in Webpack

[[ ⬆️ 回到目录]](#知识点)

何为 PostCSS ？

> 用 JavaScript 转换 CSS 的工具。

主流插件：

- `Autoprefixer`：用于添加各个厂商的前缀。
- `CSS-nano`：优化压缩 CSS。（ `css-loader` 的 `minimize` 引用的就是 `CSS-nano` ）
- `CSS-next`：相当于 Babel，让开发者可以使用未来的 CSS 的语法。
- `postcss-import`：处理 CSS 文件中使用 `@import` 引用的文件直接将其内容直接放置引用的源文件中。（ 但是相对路径可能发生变化，需要使用 `postcss-url` 转换 ）
- `postcss-url`：转换路径。
- `postcss-assets`：资源处理。

**# 安装**

```bash
npm i --save-dev postcss postcss-loader autoprefixer cssnano postcss-cssnext
```

**# 配置**

因为 **Postcss** 是用来处理 CSS 的，所以需要放在 Less / Sass 的 loader 之前（ 后调用 ）：

```javascript
use: [
    {
        loader: 'css-loader',
        options: {
            minimize: true, // 实际上这里使用的就是 CSS-nano
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            /* 添加 postcss 的插件 */
            ident: 'postcss', // ident 字段表明下方的插件是给 postcss 使用的
            plugins: [ // 插件列表，记得在 require 后调用一次
                require('autoprefixer')(),
                require('postcss-cssnext')()
            ]
        }
    },
    {
        loader: 'less-loader'
    }
]
```

需要注意的是：如果使用了 `postcss-cssnext` 后，可以不使用 `autoprefixer`，因为 **CSS-next** 内置了 `autoprefixer`。

---

### Browserslist

[[ ⬆️ 回到目录]](#知识点)

当然，当我们时候 **CSS-next** 编译我们的 CSS 文件的时候，也就是涉及「浏览器兼容性」问题的时候，就会有一个针对性的编译目标 `Browsers`。

在很多时候都会用到 **Browserslist** 配置我们的针对性的编译目标，我们可以使用以下两种方式配置我们**公共**的 **Browserslist**（ 所有插件共用 ）：

- 新建 `.browserslistrc` 文件，存放相关配置。
- 在 `package.json` 文件中添加相关字段。

拿 `package.json` 介绍：

在 `package.json` 中添加 `browserslist` 数组，用于存放编译目标配置（ 详细配置选项可见：[browserslist - queries | npm](https://www.npmjs.com/package/browserslist#queries) ）。

```javascript
{
  // ...
  "devDependencies": {
    "clean-webpack-plugin": "^0.1.18",
    "css-loader": "^0.28.9",
    "file-loader": "^1.1.7",
    "html-webpack-plugin": "^2.30.1",
    "style-loader": "^0.20.2",
    "webpack": "^3.11.0",
    "webpack-dev-server": "^2.11.1"
  },
  "browserslist": [
    "> = 1%", // 选择全球市场占有率大于等于 1% 的浏览器
    "last 2 versions", // 选择各个浏览器最新的 2 个版本
  ]
}
```

---

### Tree Shaking

[[ ⬆️ 回到目录]](#知识点)

问：什么是 **Tree Shaking** ？

> tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码( dead-code )。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

说白了就是「去除无关内容」。

- 有关 JavaScript 的 **Tree Shaking**

    使用 [UglifyjsWebpackPlugin](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/) 插件以达到我们对 JavaScript 进行 **Tree Shaking**：

    **安装**：

    ```bash
    $ npm i --save-dev uglifyjs-webpack-plugin
    ```

    **配置**

    ```javascript
    // webpack.config.js
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

    module.exports = {
        plugins: [
            new UglifyJsPlugin()
        ]
    }
    ```

    当然，**webpack** 自带了 **UglifyjsWebpackPlugin** 插件，可以通过 `webpack.optimize` 调用对应插件：

    ```javascript
    // webpack.config.js
    const webapck = require('webpack')

    module.exports = {
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    }
    ```

    详情：[Tree Shaking | webpack](https://www.webpackjs.com/guides/tree-shaking/)。

    额外的，一些框架可以通过 Babel 的对应插件以达到压缩引用代码的目的。

    以 **lodash** 为例，通过 **UglifyjsWebpackPlugin** 插件，压缩无法达到最小的情况，因为 **lodash** 书写的规范不利于 **UglifyjsWebpackPlugin** 进行 **Tree Shaking**，所以我们可以通过 Babel 的 **babel-plugin-lodash** 对我们引用的 **lodash** 进行压缩：

    安装 **Babel** 以及相应的插件

    ```bash
    npm i --save-dev babel babel-loader babel-core babel-preset-env
    npm i --save-dev babel-plugin-lodash
    ```

    配置

    ```javascript
    // webpack.config.js
    module.exports = {
        // ...
        module: {
            rules: [
                // ...
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['env'],
                                plugins: ['lodash']
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```

- 有关 CSS 的 **Tree Shaking**

    CSS 的 **Tree Shaking** 需要借助 **Purify CSS**。

    **# 安装**

    我们需要配合 **glob** 插件使用，**glob** 的作用是用于同步读取目录下指定文件。

    ```bash
    npm i --save-dev glob-all purifycss-webpack
    ```

    **# 配置**

    ```javascript
    // webpack.config.js
    const PurifyCSS = require('pruifycss-webpack')
    const glob = require('glob-all')
    const path = require('path')

    module.exports = {
        // ...
        plugins: [
            new ExtractTextWebpackPlugin({
                filename: '[name].min.css',
                allChunk: false
            }),
            // 如果要提取 CSS，记得放在 ExtractTextWebpackPlugin 后面
            new PurifyCSS({
                path: glob.sync([
                    // 检测下面文件中存在的 CSS 选择器
                    path.join(__dirname, './*.html'),
                    path.join(__dirname, './src/*.js')
                ])
            })
        ]
    }
    ```

    **purify css** 的配置选项：

    - `path`：指定需要进行 purify 的文件路径。参数可以使用 `glob.sync([])`。

---

### 图片处理

[[ ⬆️ 回到目录]](#知识点)

**场景**：

- CSS 中引入的图片
- 自动合成雪碧图
- 图片压缩
- Base64 编码

**工具**：

- `file-loader`：用于引入图片文件。
- `url-loader`：用于将图片转换为 Base64 编码。
- `img-loader`：用于压缩图片。
- `postcss-sprites`：用于合成雪碧图。

**# 安装**

```bash
npm i --save-dev file-loader url-loader img-loader postcss-sprites
```

**# 使用**

- 对图片文件（ `.png`，`.jpg`，`.jpeg`，`.gif` ）使用 `file-loader`

    ```javascript
    // webapck.config.js
    module.exports = {
        // ...
        module: {
            rules: [
                // ...
                {
                    // 对图片文件用 file-loader 处理
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                // ...
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```

- 当图片文件小于指定大小时使用 Base64 编码

    ```javascript
    // webpack.config.js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 100 * 1000, // 指定大小
                                /* 这里可以放置 file-loader 的参数 */
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```

    上面的配置表示：当图片大小**小于** 100kb 的时候，`url-loader` 会将图片转换为 Base64 编码。

    `url-loader` 会在图片大小**大于** 100kb 的时候，充当 `file-loader` 的角色，所以可以使用 `file-loader` 的参数，也没有必要再使用 `file-loader`。

- 压缩图片大小

    使用 `img-loader` 对图片进行优化处理，压缩各种图片的配置选项详见：[img-loader | GitHub](https://github.com/thetalecrafter/img-loader)。

    ```javascript
    // webpack.config.js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'img-loader',
                            options: {
                                // 对 png 处理
                                pngquant: {
                                    quality: 80
                                },
                                // 对 gif 处理
                                gifsicle: {
                                    optimizationLevel: 3,
                                },
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```

- 合成「雪碧图」

    ```javascript
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: {
                        loader: 'postcss-loader',
                        options: {
                            /* 添加 postcss 的插件 */
                            ident: 'postcss', // ident 字段表明下方的插件是给 postcss 使用的
                            plugins: [ // 插件列表，记得在 require 后调用一次
                                require('postcss-cssnext')(),
                                // 用于合成雪碧图
                                require('postcss-sprites')({
                                    spritePath: 'dist/assets/sprites/', // 指定雪碧图生成路径
                                })
                            ]
                        }
                    }
                }
            ]
        }
    }
    ```

- 配置 Retina

    首先，配置 `webpack.config.js`，在 `postcss-sprites` 添加 `Retina` 字段：

    ```javascript
    // webpack.config.js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-cssnext')(),
                                require('postcss-sprites')({
                                    spritePath: 'dist/assets/sprites/',
                                    // 配置 Retina
                                    retina: true
                                })
                            ]
                        }
                    }
                }
            ]
        }
    }
    ```

    然后，我们需要更改文件名称告诉 `postcss-sprites` 那些是需要处理的 Retina 图片：将图片名称后面添加 `@2x`、`@3x` 等后缀。（ 记得需要更改在外部文件的引用的名称 ）

---

### 字体处理

[[ ⬆️ 回到目录]](#知识点)

关于字体的处理我们可以通过 `url-loader` 来处理字体文件。

在 `webpack.config.js` 中添加：

```javascript
module.exports = {
    // ...
    module: {
        rules: [
            // ...
            {
                test: /\.(eot|woff2?|ttf|svg)/,
                use: {
                    loader: 'url-loader'
                }
            }
        ]
    }
}
```

通过以上的方式 `url-loader` 会将字体文件会转换成 Base64 编码打包进 CSS 文件，如果我们需要提取出来我们可以添加 `options`：

```javascript
// ...
use: {
    loader: 'url-loader',
    options: {
        name: '[name]-[hash:5].[ext]', // 配置字体文件名称
        limit: 5000, // 小于 5000b 大小的字体将转换为 Base64 编码打包进 CSS 文件
        useRelativePath: true // 根据相对目录生成对应路径
    }
}
```

通过以上配置就可以将字体文件提取出来啦~

---

### 处理第三方 JavaScript 库

[[ ⬆️ 回到目录]](#知识点)

处理场景：

- 第三方库存在于某 CDN 上。

    该场景可以通过直接在 HTML 中添加静态 `<script>` 标签。

- 第三方库存在于 npm 中。

    我们可以通过 `webpack.providePlugin` 插件处理第三方库的全局变量，以 **jQuery** 为例子：

    安装 **jQuery**：

    ```bash
    npm i --save jquery
    ```

    在 `webpack.config.js` 中配置：

    ```javascript
    // webpack.config.js
    const webpack = require('webpack')
    module.exports = {
        // ...
        plugins: [
            new webpack.ProvidePlugin({
                // 其中的参数以键值对的方式存在
                $: 'jquery' // 表示引入 jQuery 并注入到 $ 变量
            })
        ]
    }
    ```

    通过上述配置后，就可以在全局使用 `$` 变量。

- 第三方库存在于本地文件，不受 npm 管辖。

    我们可以通过 `imports-loader` 处理本地存在的第三方库：

    假设，我们本地存在一个 `src/libs/jquery.min.js` 文件，我们需要引入到我们的项目中作为一个全局变量。

    安装：

    ```bash
    npm i --save-dev imports-loader
    ```

    配置 `webpack.config.js`（ 两种方式选其一 ）：

    ```javascript
    // webpack.config.js
    path = require('path')
    module.exports = {
        // ...
        resolve: {
            // 我们可以通过 resolve.alias 字段设置「别名」
            alias: {
                jquery$: path.resolve(__dirname, './src/libs/jquery.min.js')
                // 上面表示将 jquery 关键字解析到某个文件下
                // 如果没有 $ 符号结尾，表示解析到某一目录下
            }
        },
        // 第一种方式，使用 imports-loader
        module: {
            rules: [
                {
                    // 对某一确定文件注入指定变量，所以 test 指向某一确定文件
                    test: path.resolve(__dirname, './src/app.js'),
                    use: [
                        {
                            loader: 'imports-loader',
                            options: {
                                $: 'jquery'
                            }
                        }
                    ]
                }
            ]
        }
        // 第二种方式，使用 ProvidePlugin
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery'
                // 仍然使用 ProvidePlugin 将前面的 jquery.min.js 注入到 $ 变量中
                // 不过这时候的 jquery 不再是 node_modules 目录下的 jquery，而是我们之前设置的 alias 下的别名
            })
        ]
    }
    ```

---

### 自动生成 HTML 模板文件

[[ ⬆️ 回到目录]](#知识点)

参考资料：[输出管理](../输出管理.md)

我们需要使用 `html-webpack-plugin` 插件来为我们自动生成 HTML 文档。

**# 安装**

```bash
npm i --save-dev html-webpack-plugin
```

**# 配置**

`html-webpack-plugin` 配置选项：

- `template`：需要生成的 HTML 的模板文件。（ `.html`、`.jade`、`.pug` ）
- `filename`：在输出目录中，生成的文件的文件名。
- `minify`：控制是否压缩生成的 HTML 文件。（ 内部借助的是 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 插件 ）
- `chunks`：选择需要插入到 HTML 的 chunk 的范围。
- `jnject`：是否将 `.js`、`.css` 文件以标签的形式插入到 HTML 文档中。

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './index.js'
    }
    // ...
    plugins: [
        // ...
        new HtmlWebpackPlugin({
            filename: 'index.html', // 默认的输出文件名就是 index.html
            template: './index.html', // 模板文件
            minify: { // 压缩 HTMl 文件
                collapseWhitespace: true // 压缩空格以及换行符
            },
            chunks: ['app'] // 指定 chunk
        })
    ]
}
```

---

### 在 HTML 中引入图片

[[ ⬆️ 回到目录]](#知识点)

有时候，我们在书写代码的时候与生成的 HTML 文档路径可能会不同，但是在 HTML 我们可能使用了相对路径，这时候生成的 HTML 便无法找到该图片，所以我们可以通过 `html-loader` 配置。同样的道理，我们也可以通过该插件用来处理其他标签的其他属性。

**# 安装**

```bash
npm i --save-dev html-loader
```

**# 配置参数**

- `attrs`：参数是一个数组，数组中的每一项是一个规则，规则分为左右两部分，左边代表标签，右边代表标签的属性如：`['img:src']` 表示第一条规则我们需要处理的是 `<img>` 标签的 `src` 属性。

**# 配置**

在 HTML 中：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <title>title</title>
</head>
<body>
    <!-- 这里有一个 img 标签，我们需要用 html-loader 处理它的 src 属性 -->
    <img src="src/assets/images/somepic.png" data-src="src/assets/images/somepic.png">
</body>
</html>
```

在 `webpack.config.js` 中配置：

```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // ...
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src'] // 默认存在 img:src
                    }
                }
            }
        ]
    }
}
```

这时候，我们打包成功后，`src` 和 `data-src` 中的路径都会变为生成后的图片的路径。

此外，还有一个办法，不需要使用 `html-loader`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <title>title</title>
</head>
<body>
    <!-- 通过 ${} 去 require 一个图片文件 -->
    <img src="${require('src/assets/images/somepic.png')}" data-src="${require('src/assets/images/somepic.png')}">
</body>
</html>
```

通过以上的方法也可以成功的把 HTML 中的图片交给 **webpack** 处理。

---

## 开发环境

### 搭建开发环境

关于搭建开发环境有三种方法：

1. webpack watch mode
2. webpack-dev-server
3. express + webpack-dev-middleware

参考资料：[开发工具 | 自动构建](../开发工具.md#自动构建)

---

## 打包优化

---

## 框架配合
