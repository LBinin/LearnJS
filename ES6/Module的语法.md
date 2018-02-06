### 简介

常用的 **CommonJS** 和 **AMD** 模块，都只能在运行时确定模块的依赖关系、变量的输入输出这些东西。比如，**CommonJS** 模块就是「对象」，输入时必须查找对象属性。

但是在 ES6 中，模块的引入如下：

```javascript
// ES6模块
import { stat, exists, readFile } from 'fs'
```

- 实质

    从 **fs** 模块加载 3 个方法，其他方法不加载。这种加载称为「编译时加载」或者「静态加载」，即 ES6 可以在编译时就完成模块加载，效率要比 **CommonJS** 模块的加载方式高。

    当然，这也导致了没法引用 ES6 模块本身，因为它不是**对象**。

- 好处

    由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入**宏**（ macro ）和**类型检验**（ type system ）这些只能靠静态分析实现的功能。

    除了静态加载带来的各种好处，ES6 模块还有以下**好处**：

    1. 不再需要 UMD 模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
    2. 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者 `navigator` 对象的属性。
    3. 不再需要对象作为命名空间（ 比如 `Math` 对象 ），未来这些功能可以通过模块提供。

---

### 严格模式

之前在「Class 的基本语法」中说到过：

> **类和模块**的内部，默认就是「严格模式」，所以不需要使用 `use strict` 指定运行模式。只要你的代码写在**类或模块**之中，就**只有**严格模式可用。

大致上，严格模式主要有以下限制：

- 变量必须声明后再使用。
- 函数的参数不能有同名属性，否则报错。
- 不能使用 `with` 语句。
- 不能对只读属性赋值，否则报错。
- 不能使用前缀 0 表示八进制数，否则报错。
- 不能删除不可删除的属性，否则报错。
- 不能删除变量 `delete prop`，会报错，只能删除属性 `delete global[prop]`。
- `eval` 不会在它的外层作用域引入变量。
- `eval` 和 `arguments` 不能被重新赋值。
- `arguments` 不会自动反映函数参数的变化。
- 不能使用 `arguments.callee` 和 `arguments.caller`。
- 禁止 `this` 指向全局对象。
- 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈。
- 增加了保留字（ 比如 `protected`、`static` 和 `interface` ）。

---

### 命令

模块功能主要由两个命令构成：`export` 和 `import`。

`export` 命令用于**规定模块的对外接口**，`import` 命令用于**输入其他模块提供的功能**。

#### export 命令

一个模块就是一个独立的文件。该文件内部的所有变量，外部**无法获取**。

如果你希望外部能够读取模块内部的某个变量，就必须使用 `export` 关键字输出该变量。

1. 输出变量

    下面是一个 JS 文件，使用 `export` 命令输出变量：

    ```javascript
    // profile.js
    export var firstName = 'Michael'
    export var lastName = 'Jackson'
    export var year = 1958

    // 等价于
    var firstName = 'Michael'
    var lastName = 'Jackson'
    var year = 1958

    export {firstName, lastName, year}
    ```

    上面代码保存在 `profile.js` 文件，保存了用户信息。ES6 将其视为一个模块，里面用 `export` 命令对外部输出了三个变量。

    应该优先考虑使用第二种写法。因为这样就可以在脚本尾部，一眼看清楚输出了哪些变量。

2. 输出函数或者类

    举个例子：

    ```javascript
    export function multiply(x, y) {
      return x * y
    }
    ```

通常情况下，`export` 输出的变量就是本来的名字，但是可以使用 `as` 关键字重命名：

```javascript
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
}
```

**export default 命令**

> 用来为模块指定默认输出。

```javascript
// export-default.js
export default function () { // 输出一个匿名函数
  console.log('foo')
}

// import-default.js
import customName from './export-default' // 可为匿名函数指定名称
customName() // 'foo'
```

当然，也可以输出非匿名函数，但是外部加载的时候仍视作匿名函数：

```javascript
// export-default.js
export default function foo() {
  console.log('foo')
}

// 或者写成
function foo() {
  console.log('foo')
}
export default foo
```

`export default` 也可以用来输出类：

```javascript
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass'
let o = new MyClass()
```

需要注意的是：

- 一个模块只能有一个默认输出，因此 `export default` 命令只能使用一次。所以，`import` 命令后面才不用加大括号，因为只可能唯一对应 `export default` 命令。
- 本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字。

    同时，正是因为 `export default` 命令其实只是输出一个叫做 `default` 的变量，所以它后面**不能跟变量声明语句**。

    ```javascript
    export var a = 1 // 正确
    
    var a = 1
    export default a // 正确
    
    export default var a = 1 // 错误
    ```

    换句话说，`export default a` 的含义是将变量 `a` 的值赋给变量 `default`，所以后面可以直接跟一个值：

    ```javascript
    export 42 // 报错

    export default 42 // 正确
    ```

**这里有关 `export` 有两点需要特别注意：**

1. `export` 命令规定的是对外的接口，必须与模块内部的变量**建立一一对应关系**。也就是说，外部可以通过这个接口取到对应的值，而不是直接取到值。

    ```javascript
    // 错误写法一
    export 1

    // 错误写法二
    var m = 1
    export m

    // 正确写法一
    export var m = 1

    // 正确写法二
    var m = 1
    export {m}

    // 正确写法三
    var n = 1
    export {n as m}
    ```

    以上的错误写法是因为输出的都是直接输出 1，但是 1 只是一个值，不是接口。

    所以我们需要将一个接口暴露出去，让外部可以通过接口访问到这个 1，也就是上面三个正确的写法中的接口 `m`。

    同样的，函数和类也要遵循这样的写法：

    ```javascript
    // 报错
    function f() {}
    export f

    // 正确
    export function f() {}

    // 正确
    function f() {}
    export {f}
    ```

    注意和 `export default` 区别开来。

2. `export` 语句输出的接口，与其对应的值是**动态绑定关系**，即通过该接口，可以取到模块内部**实时的值**。

    ```javascript
    export var foo = 'bar'
    setTimeout(() => foo = 'baz', 500)
    ```

    这应该就不需要多说了。

#### import

使用 `export` 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 `import` 命令加载这个模块。

根据前面的 `profile.js` 文件，举一个 `import` 的例子：

```javascript
// main.js
import {firstName, lastName, year} from './profile.js'

function setName(element) {
  element.textContent = firstName + ' ' + lastName
}
```

可以看到，`import` 命令接受一对大括号，在 `from` 后面指定要从其他模块导入的变量名。

不过需要注意的是：大括号里面的变量名，必须与被导入模块（ `profile.js` ）对外接口的**名称相同**。

同样的，如果想为输入的变量重新取一个名字，`import` 命令可以使用 `as` 关键字，将输入的变量重命名：

```javascript
import { lastName as surname } from './profile.js'
```

除了指定加载某个输出值，还可以使用**整体加载**，即用星号（ * ）指定一个对象，所有输出值都加载在这个对象上面，举个例子：

```javascript
// circle.js
export function area(radius) {
  return Math.PI * radius * radius
}

export function circumference(radius) {
  return 2 * Math.PI * radius
}

// main.js
import * as circle from './circle'
console.log('圆面积：' + circle.area(4))
console.log('圆周长：' + circle.circumference(14))
```

如果我们想要引入模块输出的默认方法，我们可以自定义其输出的方法名称，因为在 `import` 中，会将模块的默认输出方法当做一个匿名函数看待：

```javascript
import 自定义的变量名 from '模块路径'
```

如果想在一条 `import` 语句中，同时输入默认方法和其他接口，可以写成下面这样：

```javascript
import _ from 'lodash' // 只引入默认方法
import _, { each, each as forEach } from 'lodash' // 同时引入默认方法和其他接口
```

以下是几个注意点：

- **变量只读**

    `import` 命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

    但是，如果读入的变量是一个对象，改写其属性是允许的，并且**其他模块也可以读到改写后的值**。然鹅这种写法很难查错，所以建议凡是输入的变量，都当作**完全只读**，轻易不要改变它的属性。

    ```javascript
    import {a} from './xxx.js'

    a = {} // Syntax Error : 'a' is read-only
    a.foo = 'hello' // 合法操作
    ```

- **import 命令提升**

    `import` 命令具有提升效果，会提升到整个模块的头部，首先执行。

    因为这种行为的本质是：`import` 命令是编译阶段执行的，在代码运行之前执行。

- **不能使用表达式和变量**

    由于 `import` 是静态执行，所以不能使用表达式和变量，也就是那些只有在运行时才能得到结果的语法结构。

    ```javascript
    // 报错
    import { 'f' + 'oo' } from 'my_module'

    // 报错
    let module = 'my_module'
    import { foo } from module

    // 报错
    if (x === 1) {
      import { foo } from 'module1'
    } else {
      import { foo } from 'module2'
    }
    ```

- **不输入任何值**

    ```javascript
    import 'lodash'
    ```

    上面代码仅仅执行 `lodash` 模块，但是不输入任何值。

- **只执行一次**

    如果多次重复执行同一句 `import` 语句，那么只会执行一次，而不会执行多次。

- **单例模式**

    ```javascript
    import { foo } from 'my_module'
    import { bar } from 'my_module'

    // 等同于
    import { foo, bar } from 'my_module'
    ```

    上面代码中，虽然 `foo` 和 `bar` 在两个语句中加载，但是它们对应的是同一个 `my_module` 实例。也就是说，`import` 语句是单例模式。

---

### export 与 import 的复合写法

> 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。

```javascript
export { foo, bar } from 'my_module'

// 可以简单理解为
import { foo, bar } from 'my_module'
export { foo, bar }
```

需要注意的是，写成一行以后，`foo` 和 `bar` 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用 `foo` 和 `bar`。

在这种写法中，默认方法统一用 `default` 变量名表示：

```javascript
export { es6 as default } from './someModule' // 引入 es6 模块后，输出默认接口
export { default as es6 } from './someModule' // 引入默认接口后，输出 es6 模块
```

#### import、export 总结

最后，`export` 命令可以出现在模块的任何位置，只要处于**模块的顶层**就可以。如果处于块级作用域内，就会报错，`import` 命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

---

### 模块之间的继承

直接先举个例子，假设有一个 `circlePlus` 模块，继承自 `circle` 模块：

```javascript
// circleplus.js
export * from 'circle'
export var e = 2.71828182846
export default function(x) {
  return Math.exp(x)
}
```

可以看到，在 `circleplus` 模块中对 `circle` 所有属性和方法进行了转发。

注意，`export *` 命令会忽略 `circle` 模块的 `default` 方法。然后，上面代码又输出了自定义的 `e` 变量和**默认方法**。

