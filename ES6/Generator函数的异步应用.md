### Generator 函数的异步应用

由于 Javascript 语言的执行环境是「单线程」，**异步编程**对 JavaScript 语言简直不要太重要 😌 当然这也是 JavaScript 中亘古不变的话题。

为什么要把 JavaScript 的异步应用和 Generator 挂钩在一起呢，因为它，JavaScript 的**异步编程**进入一个全新的时代。

在 ES6 诞生以前，**异步编程**的方法，大概有下面四种：

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

现在分别来讲讲这四个方法的大致内容。

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

---

#### 事件监听

---

#### 发布/订阅

---

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

---