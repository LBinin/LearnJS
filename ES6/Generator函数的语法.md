### 基本概念

**Generator** 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。这里介绍的事 Generator 函数的语法和 API，它的异步编程应用记录在「Generator 函数的异步应用」。

Generator 函数有多种理解角度。

语法上，首先可以把它理解成，**Generator** 函数是一个状态机，封装了多个内部状态。执行 **Generator** 函数会返回一个遍历器对象，也就是说，**Generator** 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 **Generator** 函数内部的每一个状态。

形式上，**Generator** 函数虽然是一个普通函数，但是有两个特征。一是，`function` 关键字与函数名之间有一个星号；二是，函数体内部使用 `yield` 表达式，定义不同的内部状态（ **yield** 在英语里的意思就是「产出」）。

接下来我们来举个栗子 🌰

```javascript
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

var hw = helloWorldGenerator()
```

上面代码定义了一个 **Generator** 函数 `helloWorldGenerator`，它内部有两个 `yield` 表达式（ `hello` 和 `world` ），即该函数有**三个状态**：`hello`，`world` 和 `return` 语句（ 结束执行 ）。

然后，**Generator** 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 **Generator** 函数后，该函数**并不执行**，返回的也不是**函数运行结果**，而是一个指向函数**内部状态**的「指针对象」，也就是之前介绍的「遍历器对象」。

下一步，必须调用遍历器对象的 `next` 方法，使得指针移向**下一个状态**。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（ 或 `return` 语句 ）为止。换言之，**Generator** 函数是分段执行的，`yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行。

接下来我们来执行看看：

```javascript
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

---

### 格式

ES6 没有规定，`function` 关键字与函数名之间的星号，写在哪个位置。所以导致下面的写法都能通过：

```javascript
function * foo(x, y) { ··· }
function *foo(x, y) { ··· }
function* foo(x, y) { ··· }
function*foo(x, y) { ··· }
```

---

### yield 表达式

由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态。

所以 Generator 其实提供了一种可以「暂停执行」的函数。`yield` 表达式就是「暂停标志」。

在调用了 `next` 方法后，操作流程是这样的：

1. 遇到 `yield` 表达式，就**暂停执行后续的操作**，并将紧跟在 `yield` 后面的那个**表达式**的值，作为返回的信息对象的 `value` 属性值。
1. 下一次调用遍历器的 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。
1. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值，同时 `done` 属性输出为 `true`。
1. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`，同时 `done` 属性输出为 `true`。

这里需要注意的一个是：`yield` 表达式后面的表达式，只有当调用 `next` 方法、内部指针**指向该语句**时才会执行，因此等于为 JavaScript 提供了手动的「惰性求值」（ Lazy Evaluation ）的语法功能。

另外，`yield` 表达式如果用在另一个表达式之中，必须放在**圆括号**里面。

```javascript
function* demo() {
  console.log('Hello' + yield) // SyntaxError
  console.log('Hello' + yield 123) // SyntaxError

  console.log('Hello' + (yield)) // OK
  console.log('Hello' + (yield 123)) // OK
}
```

---

### 与 Iterator 接口的关系

因为上面用到了 `next` 方法，有没有觉得和之前说的 **Iterator** 有几分相似？

接下来咱们就说说它们之间的关系~

之前说过，任意一个对象的 `Symbol.iterator` 方法，等于该对象的**遍历器生成函数**，调用该函数会返回该对象的一个「遍历器对象」。

由于 Generator 函数就是**遍历器生成函数**，因此可以把 Generator 赋值给对象的 `Symbol.iterator` 属性，从而使得该对象具有 Iterator 接口。

所以说，`Symbol.iterator` 方法的最简单实现，还是使用 Generator 函数：

```javascript
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1
    yield 2
    yield 3
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello'
    yield 'world'
  }
}

for (let x of obj) {
  console.log(x)
}
// "hello"
// "world"
```

上面代码中，`Symbol.iterator` 方法几乎不用部署任何代码，只要用 `yield` 命令给出每一步的返回值即可。

这里有一个有意思的地方就是：Generator 函数执行后，返回一个「遍历器对象」。该对象本身也具有 `Symbol.iterator` 属性，执行后返回**自身**。

---

### next 方法的参数

在 `next` 方法中添加参数这个功能有很重要的语法意义。

Generator 函数从暂停状态到恢复运行，它的上下文状态（ context ）是不变的。

但是通过 `next` 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部**注入值**。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而**调整函数行为**。

先来说说 `yield` 表达式，它本身没有**返回值**的，或者说总是返回 `undefined`。`next` 方法可以带一个参数，该参数就会被当作当前 `yield` 表达式的返回值。

注意，在阮老师的文章中，这里说的是「`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值。」然鹅我换了一种方式方便理解：

先来看看第一个小例子：

```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i
    if(reset) { i = -1 }
  }
}

var g = f()

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

第一个 `next`，运行到 `yield` 的时候，这时程序暂停，返回的「信息对象」中的 `value` 返回第一个 `i`，也就是 **0**，**记住**，这时候是暂停在 `yield` 这里，但是当前这条语句并没有结束，也就是说这时候的 `yield` 并没有开始返回 `undefined`。

第二个 `next` 的内容和第一个一样，主要我们要讲下一个。

第三个 `next` 有参数，注意这时候第二次循环的 `var reset = yield i` 还没有结束，只是返回了 `value: 1`；此时 `yield` 还没有返回 `undefined`。

这时候传递一个 `true` 给 `next` 方法，这个参数就会被当做 `yield` 的返回；也就是说这时候执行 `next` 的话，`yield` 的返回值为 `true` 给 `reset`。

之后程序从「暂停」状态开始继续执行，运行到 `if` 语句使得 `i = -1`，注意，此时停留在第二次循环，循环尾部 `i++` 后，`i` 便等于 **0** 了，所以第三次返回的信息对象中的 `value` 便是 **0**。

再来举一个例子：

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1))
  var z = yield (y / 3)
  return (x + y + z)
}

var a = foo(5)
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5)
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

上面代码中，第二次运行 `next` 方法的时候不带参数，导致 `y` 的值等于 `2 * undefined`（ 即 `NaN` ），除以 **3** 以后还是 `NaN`，因此返回对象的 `value` 属性也等于 `NaN`。

第三次运行 `Next` 方法的时候不带参数，所以 `z` 等于 `undefined`，返回对象的 `value` 属性等于 `5 + NaN + undefined`，即 `NaN`。

下面的三个就好理解了，我就不赘述了。

关于 `next` 的参数有一个需要说的是：不知道你注意到没有一般第一个 `next` 方法都是没有参数的，这是因为在第一次使用前没有执行到 `yield` 语言，这时候 `next` 方法不知道要把参数赋给那个 `yield` 作为返回值，所以第一个 `next` 方法带不带参数效果都是一样的。因为这个特性，**V8** 引擎甚至直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用 `next` 方法开始，参数才是有效的。

从语义上讲，第一个 `next` 方法用来启动**遍历器对象**，所以不用带有参数。

---

### 与 for...of

在之前说过：`for...of` 循环可以自动遍历 Generator 函数时生成的 Iterator 对象，且此时不再需要调用 `next` 方法，举个例子：

```javascript
function* foo() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}

for (let v of foo()) {
  console.log(v)
}
// 1 2 3 4 5
```

可以看到 `for...of` 循环中并没有打印出 **6**，这是因为：一旦 `next` 方法的返回对象的 `done` 属性为 `true`，`for...of` 循环就会中止，且不包含该返回对象，所以上面代码的 `return` 语句返回的 **6**，不包括在 `for...of` 循环之中。

---

### Generator.prototype.throw()

> Generator 函数返回的遍历器对象，都有一个 `throw` 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

`throw` 方法可以接受一个参数，该参数会被 `catch` 语句接收，建议抛出 **Error** 对象的实例。

```javascript
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log(e)
  }
}

var i = g()
i.next()
i.throw(new Error('出错了！'))
// Error: 出错了！(…)
```

注意，不要混淆遍历器对象的 `throw` 方法和全局的 `throw` 命令。上面代码的错误，是用遍历器对象的 `throw` 方法抛出的，而不是用 `throw` 命令抛出的。后者只能被函数体外的 `catch` 语句捕获。

这种函数体内捕获错误的机制，大大方便了对错误的处理。多个 `yield` 表达式，可以只用一个 `try...catch` 代码块来捕获错误。如果使用回调函数的写法，想要捕获多个错误，就不得不为每个函数内部写一个错误处理语句，现在只在 Generator 函数内部写一次 `catch` 语句就可以了：在 Generator 函数中写一个无限循环，不断接收错误。比如：

```javascript
var g = function* () {
  while (true) {
    yield
    console.log('内部捕获', e)
  }
}

var i = g()
```

还有，如果在 Generator 函数中没有部署 `try...catch` 代码块，那么使用 `throw` 会被外部的 `catch` 捕获，如果外部也没有部署，当然就是直接报错啦~

此外，`throw` 方法被捕获以后，会附带执行下一条 `yield` 表达式。也就是说，会附带执行一次 `next` 方法。

---

### Generator.prototype.return()

> Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

```javascript
function* gen() {
  yield 1
  yield 2
  yield 3
}

var g = gen()

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

如果 `return` 方法调用时，不提供参数，则返回值的 `value` 属性为 `undefined`：

```javascript
function* gen() {
  yield 1
  yield 2
  yield 3
}

var g = gen()

g.next()        // { value: 1, done: false }
g.return() // { value: undefined, done: true }
```