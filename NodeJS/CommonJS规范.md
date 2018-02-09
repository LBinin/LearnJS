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
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children:
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}
```

它的 `exports` 属性（ 即 `module.exports` ）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

require方法用于加载模块。