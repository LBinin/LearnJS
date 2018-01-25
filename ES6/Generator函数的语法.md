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

```javascript
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}

[...myIterable] // [1, 2, 3]
```

---

### Iterator 接口与 Generator 函数

Symbol.iterator方法的最简单实现，还是使用 Generator 函数：

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