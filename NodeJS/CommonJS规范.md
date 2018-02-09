### 概述

之前说过，**Node** 应用由模块组成，采用 CommonJS 模块规范。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是**私有**的，对其他文件不可见。

- 所有代码都运行在**当前模块的作用域**，不会污染全局作用域。
- 模块可以多次加载，但是**只会在第一次加载时运行一次**，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的**顺序**，按照其在代码中出现的顺序。

---

### module对象

**Node** 内部提供一个 `Module` 构建函数。所有模块都是 `Module` 的实例。

CommonJS 规范规定，每个模块内部都有一个 `module` 对象变量代表当前模块。

`module` 对象有以下属性：

- `module.id` 模块的「识别符」，通常是带有**绝对路径的模块文件名**。
- `module.filename` 模块的「文件名」，带有**绝对路径**。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 表示模块对外输出的值。

举个例子：

```javascript
// example.js
var jquery = require('jquery')
exports.$ = jquery
console.log(module)
```

我们使用 `node example.js` 查看一下运行结果：

```javascript
{ id: '.',
  exports: { '$': [Function] }, // 模块对外输出的值
  parent: null, // 调用该模块的模块，因为是用 node 命令行调用的
  filename: '/path/to/example.js', // 模块的文件名
  loaded: false, // 表示是否加载完毕
  children: // 该模块要用到的其他模块也就是 jquery 以下就是其 module 信息
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths: // 阮老师没说，不过看上去是定义扫描模块的路径
   [ '/Users/abc1/Documents/JS/node_modules',
     '/Users/abc1/Documents/node_modules',
     '/Users/abc1/node_modules',
     '/Users/node_modules',
     '/node_modules' ]
}
```

#### module.parent 属性

如果在命令行下调用某个模块，比如 `node something.js`，那么 `module.parent` 就是 `null`。

如果是在脚本之中调用，比如 `require('./something.js')`，那么 `module.parent` 就是**调用它的模块**。

利用这一点，可以判断当前模块是否为入口脚本。

```javascript
if (!module.parent) {
    // ran with `node something.js`
    app.listen(8088, function() {
        console.log('app listening on port 8088')
    })
} else {
    // used with `require('/.something.js')`
    module.exports = app
}
```

#### module.exports 属性

它的 `exports` 属性（ 即 `module.exports` ）是对外的接口。

加载某个模块，其实是加载该模块的 `module.exports` 属性。

- `exports` 变量

    为了方便，**Node** 为每个模块提供一个 `exports` 变量，指向 `module.exports`。这等同在每个模块头部，都有一行 `var exports = module.exports` 这样的命令。

    网上区别 `exports` 与 `module.exports` 的问题实在太多了，就理解好上面那段代码就好了，如果实在不能理解或者记不住，就不要用 `exports` 了，方便又省事~

---

### require 命令

`require` 方法用于加载模块，它的基本功能是：

> 读入并执行一个 JavaScript 文件，然后返回**该模块**的 `exports` 对象。如果没有发现指定模块，会报错。

- 加载规则

    1. 如果参数字符串以 `/` 开头，则表示加载的是一个位于**绝对路径**的模块文件。

        比如，`require('/home/marco/foo.js')` 将加载 `/home/marco/foo.js`。

    1. 如果参数字符串以 `./` 开头，则表示加载的是一个位于**相对路径**（ 跟当前执行脚本的位置相比 ）的模块文件。比如，`require('./circle')` 将加载当前脚本同一目录的 `circle.js`。

    1. 如果参数字符串不以 `./` 或 `/` 开头，则表示加载的是一个默认提供的**核心模块**（ 位于 **Node** 的**系统安装目录**中 ），或者一个位于各级 `node_modules` 目录的已安装模块（ 全局安装或局部安装 ）。

        举例来说，脚本 `/home/user/projects/foo.js` 执行了 `require('bar.js')` 命令，**Node** 会依次搜索以下文件。

        - `/usr/local/lib/node/bar.js`
        - `/home/user/projects/node_modules/bar.js`
        - `/home/user/node_modules/bar.js`
        - `/home/node_modules/bar.js`
        - `/node_modules/bar.js`

        这样设计的目的是：使得不同的模块可以将所依赖的模块**本地化**。

    1. 如果参数字符串不以 `./` 或 `/` 开头，而且是一个路径，比如 `require('example-module/path/to/file')`，则将先找到 `example-module` 的位置，然后再以它为参数，找到后续路径。

    1. 如果指定的模块文件没有发现，**Node** 会尝试为文件名添加 `.js`、`.json`、`.node` 后，再去搜索。

        `.js` 件会以文本格式的 JavaScript 脚本文件解析，`.json` 文件会以 JSON 格式的文本文件解析，`.node` 文件会以编译后的二进制文件解析。

    1. 如果想得到 `require` 命令加载的确切文件名，使用 `require.resolve()` 方法。

- 目录的加载规则

    通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个**入口文件**，让 `require` 方法可以通过这个入口文件，加载**整个目录**。

    **做法**：

    在这个目录中放置一个 `package.json` 文件，并且将**入口文件**写入 `main` 字段：

    ```javascript
    // package.json
    { 
      "name": "some-library",
      "main": "./lib/some-library.js"
    }
    ```

    `require` 方法发现参数字符串指向一个「目录」以后，会自动查看该目录的 `package.json` 文件，然后加载 `main` 字段指定的**入口文件**。
    
    如果 `package.json` 文件没有 `main` 字段，或者根本就没有 `package.json` 文件，则会加载该目录下的 `index.js` 文件或 `index.node` 文件。

- 模块的缓存

    第一次加载某个模块时，**Node** 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 `module.exports` 属性。

    所有缓存的模块保存在 `require.cache` 之中，如果想删除模块的缓存，可以像下面这样写：

    ```javascript
    // 删除指定模块的缓存
    delete require.cache[moduleName]

    // 删除所有模块的缓存
    Object.keys(require.cache).forEach(function(key) {
      delete require.cache[key];
    })
    ```

---

### require 的内部处理流程

`require` 命令是 CommonJS 规范之中，用来加载其他模块的命令。

它其实不是一个全局命令，而是指向当前模块的 `module.require` 命令，而后者又调用 **Node** 的内部命令 `Module._load` 方法，该方法内部过程如下：

```javascript
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的 Module 实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载 / 解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
}
```

其中第四步说到的 `module.compile` 方法内部过程逻辑如下：

```javascript
Module.prototype._compile = function(content, filename) {
  // 1. 生成一个 require 函数，指向 module.require
  // 2. 加载其他辅助方法到 require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
}
```

`require` 函数及其辅助方法主要如下：

- `require()`：加载外部模块
- `require.resolve()`：将模块名解析到一个绝对路径
- `require.main`：指向主模块
- `require.cache`：指向所有缓存的模块
- `require.extensions`：根据文件的后缀名，调用不同的执行函数

一旦 `require` 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。

该函数的参数包括 `require`、`module`、`exports`，以及其他一些参数。