### 何为 Promise

**Promise** 是 JavaScript 异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 **Promise** 对象。

所谓 **Promise**，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，**Promise** 是一个对象，从它可以获取异步操作的消息。**Promise** 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

---

### Promise 接口

`Promise` 接口的基本思想是，异步任务返回一个 `Promise` 对象。

`Promise` 对象只有三种状态：

- 异步操作「未完成」（ pending ）
- 异步操作「已完成」（ resolved，又称 fulfilled ）
- 异步操作「失败」（ rejected ）

这三种的状态的**变化途径**只有两种：

- 异步操作从「未完成」到「已完成」
- 异步操作从「未完成」到「失败」。

这种变化**只能发生一次**，一旦当前状态变为「已完成」或「失败」，就意味着不会再有新的状态变化了。因此，`Promise` 对象的最终结果只有两种：

- 异步操作成功，`Promise` 对象传回一个值，状态变为 `resolved`。
- 异步操作失败，`Promise` 对象抛出一个错误，状态变为 `rejected`。

`Promise` 对象使用 `then` 方法添加回调函数。`then` 方法可以接受两个回调函数，第一个是异步操作成功时（ 变为 `resolved` 状态 ）时的回调函数，第二个是异步操作失败（ 变为 `rejected` ）时的回调函数（ 可以省略 ）。一旦状态改变，就调用相应的回调函数：

```javascript
// po是一个Promise对象
po
  .then(step1)
  .then(step2)
  .then(step3)
  .then(
    console.log,
    console.error
  )
```

上面代码中，`po` 的状态一旦变为 `resolved`，就依次调用后面每一个 `then` 指定的回调函数，每一步都必须等到前一步完成，才会执行。

最后一个 `then` 方法的回调函数 `console.log` 和 `console.error`，用法上有一点重要的区别。`console.log` 只显示回调函数 `step3` 的返回值，而 `console.error` 可以显示 `step1`、`step2`、`step3` 之中任意一个发生的错误。也就是说，假定 `step1` 操作失败，抛出一个错误，这时 `step2` 和 `step3` 都不会再执行了（ 因为它们是操作成功的回调函数，而不是操作失败的回调函数 ）。`Promises` 对象开始寻找，接下来第一个操作失败时的回调函数，在上面代码中是 `console.error`。这就是说，`Promises` 对象的错误有传递性。

---

### Promise 对象的生成

ES6 提供了原生的 `Promise` 构造函数，用来生成 `Promise` 实例。

`Promise` 构造函数接受一个**函数**作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve` 函数的作用是：将 `Promise` 对象的状态从「未完成」变为「成功」（ 即从 `Pending` 变为 `Resolved` ），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

`reject` 函数的作用是：将 `Promise` 对象的状态从「未完成」变为「失败」（ 即从 `Pending` 变为 `Rejected` ），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

下面是生成一个 `Promise` 实例的例子：

```javascript
var promise = new Promise(function(resolve, reject) {
  // 异步操作的代码

  if (/* 异步操作成功 */){
    resolve(value)
  } else {
    reject(error)
  }
})
```

`Promise` 实例生成以后，可以用 `then` 方法分别指定 `Resolved` 状态（ 第一个参数 ）和 `Reject` 状态（ 第二个参数 ）的回调函数。

```javascript
promise.then(function(value) {
  // success
}, function(value) {
  // failure
})
```

---

### 用法辨析

`Promise` 的用法，简单说就是一句话：使用 `then` 方法添加回调函数。但是，不同的写法有一些细微的差别，现在有如下四种写法：

其中：`doSomethingElse` 为某函数名称，`finalHandler` 为下一个 `then` 方法的一个回调函数

```javascript
// 写法一
doSomething().then(function () {
  return doSomethingElse()
}).then(finalHandler)
/* finalHandler 回调函数的参数，是 doSomethingElse 函数的运行结果 */

// 写法二
doSomething().then(function () {
  doSomethingElse()
}).then(finalHandler)
/* finalHandler 回调函数的参数是 undefined */

// 写法三
doSomething().then(doSomethingElse()).then(finalHandler)
/* finalHandler 回调函数的参数，是 doSomethingElse 函数返回的回调函数的运行结果 */

// 写法四
doSomething().then(doSomethingElse).then(finalHandler)
/* 与写法一只有一个差别：doSomethingElse 会接收到 doSomething() 返回的结果 */
/* 其实和 finalHandler 会接收到上一个 then 的返回结果当做参数一个道理 */
```

---

### Promise 的应用

1. 加载图片

    ```javascript
    var preloadImage = function (path) {
        return new Promise(function (resolve, reject) {
            var image = new Image()
            image.onload  = resolve
            image.onerror = reject
            image.src = path
        })
    }

    // 使用：path 为某 url
    preloadImage(path).then(console.log, console.error)
    ```

2. Ajax 操作

    ```javascript
    function search(term) {
        var url = 'http://example.com/search?q=' + term
        var xhr = new XMLHttpRequest()
        var result

        var p = new Promise(function (resolve, reject) {
            xhr.open('GET', url, true)
            xhr.onload = function (e) {
                if (this.status === 200) {
                    result = JSON.parse(this.responseText)
                    resolve(result)
                }
            }
            xhr.onerror = function (e) {
                reject(e)
            }
            xhr.send()
        })

        return p
    }
    
    // 使用
    search("Hello World").then(console.log, console.error)
    ```

---

### 小结

`Promise` 对象的优点在于，让回调函数变成了规范的链式写法，程序流程可以看得很清楚。它的一整套接口，可以实现许多强大的功能，比如为多个异步操作部署一个回调函数、为多个回调函数中抛出的错误统一指定处理方法等等。

而且，它还有一个前面三种方法都没有的好处：如果一个任务已经完成，再添加回调函数，该回调函数会立即执行。所以，你不用担心是否错过了某个事件或信号。这种方法的缺点就是，编写和理解都相对比较难。

更多详细操作将在 ES6 笔记中记录 😆