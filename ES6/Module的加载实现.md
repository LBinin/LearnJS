### ES6 模块与 CommonJS 模块的差异

讨论 Node 加载 ES6 模块之前，必须了解 ES6 模块与 CommonJS 模块完全不同。有关 CommonJS 可以查看阮老师在 ES5 中的隐藏副本 [CommonJS 规范](../NodeJS/CommonJS规范.md)。

它们有两个重大差异：

- CommonJS 模块输出的是一个**值的拷贝**，ES6 模块输出的是**值的引用**。
- CommonJS 模块是**运行时加载**，ES6 模块是**编译时输出接口**。

第一个差异是因为 CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

第二个差异是因为 CommonJS 加载的是一个对象（ 即 `module.exports` 属性 ），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

---

### Node 加载

Node 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。

目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。

> Node 要求 ES6 模块采用 `.mjs` 后缀文件名。也就是说，只要脚本文件里面使用 `import` 或者 `export` 命令，那么就必须采用 `.mjs` 后缀名。`require` 命令不能加载 `.mjs` 文件，会报错，只有 `import` 命令才可以加载 `.mjs` 文件。反过来，`.mjs` 文件里面也不能使用 `require` 命令，必须使用 `import`。

---

### ES6 模块加载 CommonJS 模块

CommonJS 模块的输出都定义在 `module.exports` 这个属性上面。Node 的 `import` 命令加载 CommonJS 模块，Node 会自动将 `module.exports` 属性，当作模块的默认输出，即等同于 `export default xxx`。

举个例子：

这里有一个 CommonJS 模块 `a.js`

```javascript
// a.js
module.exports = {
  foo: 'hello',
  bar: 'world'
}

// 等同于
export default {
  foo: 'hello',
  bar: 'world'
}
```

接下来介绍三种方法，可以拿到 CommonJS 的 `module.exports`：

```javascript
// 方法一
import baz from './a'
// baz = {foo: 'hello', bar: 'world'}

// 方法二
import {default as baz} from './a'
// baz = {foo: 'hello', bar: 'world'}

// 方法三
import * as baz from './a'
// baz = {
//   get default() {return module.exports},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }
```

由于 ES6 模块是编译时确定输出接口，CommonJS 模块是运行时确定输出接口，所以采用 `import` 命令加载 CommonJS 模块时，不允许采用下面的写法：

```javascript
// 不正确
import { readfile } from 'fs'

// 正确的写法一
import * as express from 'express'
const app = express.default()

// 正确的写法二
import express from 'express'
const app = express()
```

这是因为 `fs` 是 CommonJS 格式，只有在运行时才能确定 `readfile` 接口，而 `import` 命令要求编译时就确定这个接口，所以解决方法就是改为整体输入。

---

### CommonJS 模块加载 ES6 模块

CommonJS 模块加载 ES6 模块，不能使用 `require` 命令，而要使用 `import()` 函数。ES6 模块的所有输出接口，会成为**输入对象的属性**。

```javascript
// es.mjs
let foo = { bar: 'my-default' }
export default foo
foo = null

// cjs.js
const es_namespace = await import('./es')
// es_namespace = {
//   get default() {
//     ...
//   }
// }
console.log(es_namespace.default)
// { bar:'my-default' }
```

上面代码中，`default` 接口变成了 `es_namespace.default` 属性。另外，由于存在缓存机制， `es.mjs` 对 `foo` 的重新赋值没有在模块外部反映出来。

---

### CommonJS 模块的加载原理

CommonJS 的一个模块，就是一个**脚本文件**。`require` 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```javascript
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

上面的那个对象就是 Node 内部加载模块后生成的一个对象。

属性介绍：

- `id` 属性是「模块名」。
- `exports` 属性是模块输出的各个接口。
- `loaded` 属性是一个布尔值，表示该模块的脚本是否执行完毕。

其他还有很多属性，这里都省略了。

以后需要用到这个模块的各种接口的时候，就会到该对象的 `exports` 属性上面取值。

即使再次执行 `require` 命令，也不会再次执行该模块，而是到缓存之中取值。

也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

---

### CommonJS 模块的循环加载

CommonJS 模块的重要特性是「加载时执行」，即脚本代码在 `require` 的时候，就会全部执行。

一旦出现某个模块被「循环加载」，就只输出**已经执行的部分**，还未执行的部分不会输出。

**Q:** 何为「循环加载」？

**A:** 「循环加载」（ circular dependency ）指的是，假设 `a` 脚本的执行依赖 `b` 脚本，而 `b` 脚本的执行又依赖 `a` 脚本。

通常，「循环加载」表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。

但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目，很容易出现 `a` 依赖 `b`，`b` 依赖 `c`，`c` 又依赖 `a` 这样的情况。这意味着，模块加载机制必须考虑「循环加载」的情况。

举一个例子说说明一下什么是「加载时执行」：

这里有三个文件：`a.js`、`b.js`、`main.js`

```javascript
// a.js
exports.done = false
var b = require('./b.js')
console.log('在 a.js 之中，b.done = %j', b.done)
exports.done = true
console.log('a.js 执行完毕')

// b.js
exports.done = false
var a = require('./a.js')
console.log('在 b.js 之中，a.done = %j', a.done)
exports.done = true
console.log('b.js 执行完毕')

// main.js
var a = require('./a.js')
var b = require('./b.js')
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done)
```

现在执行 `main.js`，看看输出的结果：

```bash
$ node main.js

在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

咱们一步步的看：

1. `require('./a.js')` 这句代码表示加载 `a.js`，根据「加载时执行」，`a` 的 `export.done` 变为了 `false`，开始加载 `b.js`，这时候，`a.js` 的代码就在 `var b = require('./b.js')` 这里停止了。
2. 这时候开始加载 `b.js`，执行其中的代码，`b` 的 `export.done` 变为了 `false`，然后开始加载 `a.js` 的内容，这时候就发生了「循环加载」。
3. 这时候，系统会去 `a.js` 模块对应对象的 `exports` 属性取值。可是因为 `a.js` 还**没有执行完**，从 `exports` 属性只能取出**已经执行的部分，而不是最后的值**，也就是 `a.done = false` 这段已经被执行的语句。
4. 因此，对于 `b.js` 来说，它从 `a.js` 只输入一个变量 `done`，值为 `false`。然后 `b.js` 继续往下执行，输出内容，等到全部执行完毕，再把执行权交还给 `a.js`。
5. `a.js` 接着往下执行，直到执行完毕。
6. `a.js` 执行完毕后，执行权交还给 `main.js`，直到 `main.js` 执行完毕。

过程已经描述完毕，现在我们通过结果可以知道两件事情：

1. 在 `b.js` 之中，`a.js` 没有执行完毕，只执行了第一行。
2. `main.js` 执行到第二行时，不会再次执行 `b.js`，而是输出缓存的 `b.js` 的执行结果，即它的第四行 `exports.done = true`。

**总结**：CommonJS 输入的是被输出**值的拷贝**，不是引用。