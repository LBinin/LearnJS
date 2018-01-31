### Generator 函数的异步应用

由于 Javascript 语言的执行环境是「单线程」，**异步编程**对 JavaScript 语言简直不要太重要 😌 当然这也是 JavaScript 中亘古不变的话题。

为什么要把 JavaScript 的异步应用和 Generator 挂钩在一起呢，因为它，JavaScript 的**异步编程**进入一个全新的时代。

在 ES6 诞生以前，**异步编程**的方法，大概有下面四种：

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

「事件监听」和「发布/订阅」比较常见，现在分别来讲讲这回调函数和 Promise 的大致内容。

#### 回调函数

> 所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。回调函数的英语名字 `callback`，直译过来就是「重新调用」。

JavaScript 语言对异步编程的实现，就是回调函数。

举一个 **Node** 中「文件操作」的例子：

```javascript
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err
  console.log(data)
})
```

上面代码中，`readFile` 函数的第三个参数，就是「回调函数」，也就是任务的第二段。等到操作系统返回了 `/etc/passwd` 这个文件以后，回调函数才会执行。

BTW，一个有趣的问题：为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（ 如果没有错误，该参数就是 `null` ）？

> **答**：Node 采用 V8 引擎处理 JavaScript 脚本，最大特点就是单线程运行，一次只能运行一个任务。这导致 Node 大量采用异步操作（ asynchronous opertion ），即任务不是马上执行，而是插在任务队列的尾部，等到前面的任务运行完后再执行。
> 
> 由于这种特性，某一个任务的后续操作，往往采用回调函数（ callback ）的形式进行定义。所以不适用于 `try catch` 捕获错误，约定回调函数的第一个参数为为 `error` 对象。
> 
> 也就是说，执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

#### Promise 对象

我们都知道，回调函数的问题出现在多个回调函数嵌套。假定读取A文件之后，再读取B文件，代码如下：

```javascript
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  })
})
```

这种多重嵌套使得代码**横向发展**，多个异步操作形成了强耦合。

Promise 对象就是为了解决这个问题而提出的。

它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成「链式调用」：

```javascript
var readFile = require('fs-readfile-promise')

readFile(fileA)
.then(function (data) {
  console.log(data.toString())
})
.then(function () {
  return readFile(fileB)
})
.then(function (data) {
  console.log(data.toString())
})
.catch(function (err) {
  console.log(err)
})
```

可以看到，Promise 的写法只是回调函数的改进，使用 `then` 方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆 `then`，原来的语义变得很不清楚。

那么，有没有更好的写法呢？

---

### Generator 函数

#### 协程

> 传统的编程语言，早有异步编程的解决方案（ 其实是多任务的解决方案 ）。其中有一种叫做「协程」（ coroutine ），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下：

- 第一步，协程 `A` 开始执行。
- 第二步，协程 `A` 执行到一半，进入暂停，执行权转移到协程 `B` 。
- 第三步，（一段时间后）协程 `B` 交还执行权。
- 第四步，协程 `A` 恢复执行。

Generator 就是「协程」在 ES6 中的实现，接下来举个栗子 🌰

```javascript
// 封装一个异步操作
var fetch = require('node-fetch')

function* gen(){
  var url = 'https://api.github.com/users/github'
  var result = yield fetch(url)
  console.log(result.bio)
}

// 执行操作
var g = gen()
var result = g.next()

result.value.then(function(data){
  return data.json()
}).then(function(data){
  g.next(data)
})
```

内容都挺简单的，我就不一步步描述了。可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（ 即何时执行第一阶段、何时执行第二阶段 ）。

---

### Thunk 函数

> 自动执行 Generator 函数的一种方法。

所谓「传名调用」，即直接将函数参数中的表达式传入函数体，只在用到它的时候求值。避免了在表达式中进行了无用的计算降低性能。

编译器的**传名调用**实现，往往是将参数放到一个「临时函数」之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

我们来看看 JavaScript 中的 Thunk 函数：

```javascript
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback)

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback)
  }
}

var readFileThunk = Thunk(fileName)
readFileThunk(callback)
```

上面的 `Thunk` 就是一个**临时函数**，然后通过临时函数的参数传入函数体。

---

### Generator 函数的流程管理

前面说到 Thunk 函数，不过 Thunk 函数对异步编程有什么用呢？

以前确实没什么用，但是 ES6 有了 Generator 函数，Thunk 函数现在可以用于 Generator 函数的「自动流程管理」。

先说 Generator，它可以完成自动执行：

```javascript
function* gen() {
  // ...
}

var g = gen()
var res = g.next()

while(!res.done){
  console.log(res.value)
  res = g.next()
}
```

但是通过上面的代码可以看出来，Generator 可以完成自动执行所有任务，但是并不满足**执行完上一步后再执行下一步**，不适合异步操作。

### Thunk 函数的自动流程管理

所以这时候 Thunk 函数就派上用场了。由于 Thunk 函数可以在回调函数里，将执行权交还给 Generator 函数。Thunk 函数真正的威力，在于可以自动执行 Generator 函数。下面就是一个基于 Thunk 函数的 Generator 执行器。

```javascript
function run(fn) {
  var gen = fn()

  function next(err, data) {
    var result = gen.next(data)
    if (result.done) return
    result.value(next)
  }

  next()
}

function* g() {
  // ...
}

run(g)
```

上面代码的 `run` 函数，就是一个 Generator 函数的自动执行器。

内部的 `next` 函数就是 Thunk 的**回调函数**。

`next` 函数先将指针移到 Generator 函数的下一步（ `gen.next` 方法 ），然后判断 Generator 函数是否结束（ `result.done` 属性 ），如果没结束，就将 `next` 函数再传入 Thunk 函数（ `result.value` 属性 ），否则就直接退出。

当然，前提是每一个**异步操作**，都要是 Thunk 函数，也就是说，跟在 `yield` 命令后面的必须是 Thunk 函数，才能在上面把 `next` 传入到返回的信息数组 `value` 中。

### co 模块

当然，tj大神早就在 2013 年就写了一个小工具 —— 「[co](https://github.com/tj/co)」，用于 Generator 函数的自动执行。

用 **co** 写一个小例子，用于依次读取两个文件：

```javascript
var gen = function* () {
  var f1 = yield readFile('/etc/fstab')
  var f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

**co** 模块可以让我们不用编写 Generator 函数的执行器，只要将 Generator 函数只要传入co函数，就会自动执行：

```javascript
var co = require('co')
co(gen)
```

此外，**co** 函数返回一个 **Promise** 对象，因此可以用 `then` 方法添加回调函数。

```javascript
co(gen).then(function (){
  console.log('Generator 函数执行完成')
})
```

上面代码中，等到 Generator 函数执行结束，就会输出一行提示。