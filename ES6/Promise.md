一些基础的内容已经记录在 [专题 / Promise对象](https://github.com/LBinin/LearnJS/blob/master/%E4%B8%93%E9%A2%98/Promise%E5%AF%B9%E8%B1%A1.md) 笔记中，这里就不赘述了。

---

### 注意点

1. `resolve` 函数的参数除了正常的值以外，还可能是另一个 **Promise** 实例，比如像下面这样：

    ```javascript
    const p1 = new Promise(function (resolve, reject) {
      // ...
    })

    const p2 = new Promise(function (resolve, reject) {
      // ...
      resolve(p1)
    })
    ```

    上面代码中，`p1` 和 `p2` 都是 **Promise** 的实例，但是 `p2` 的 `resolve` 方法将 `p1` 作为参数，即一个异步操作的结果是返回**另一个异步操作**。

    这样就导致了：这时 `p1` 的状态就会传递给 `p2`，也就是说这时候 `p1` 的状态决定了 `p2` 的状态， `p2` 的状态失效了。

    如果 `p1` 的状态是 `pending`，那么 `p2` 的回调函数就会等待 `p1` 的状态改变；如果 `p1` 的状态已经是 `resolved` 或者 `rejected`，那么 `p2` 的回调函数（ `then` 中的方法 ）将会立刻执行。

    举个栗子 🌰

    ```javascript
    const p1 = new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error('fail')), 3000)
    })

    const p2 = new Promise(function (resolve, reject) {
      setTimeout(() => resolve(p1), 1000)
    })

    p2
      .then(result => console.log(result))
      .catch(error => console.log(error))
    // Error: fail
    ```

    上面代码中，`p1` 是一个 **Promise**，3 秒之后变为 `rejected`。`p2` 的状态在 1 秒之后改变，`resolve` 方法返回的是 `p1`。这时候，由于 `p2` 返回的是另一个 **Promise**，导致 `p2` 自己的状态失效，必须由 `p1` 的状态来决定，而不是此时 `p2` 的状态。所以，后面的 `then` 语句都变成针对后者（ `p1` ）。又过了 2 秒， `p1` 变为 `rejected`，导致触发 `catch` 方法指定的回调函数。


2. 调用 `resolve` 或 `reject` 并不会终结 **Promise** 的参数中函数剩余部分的执行：

    ```javascript
    new Promise((resolve, reject) => {
      resolve(1)
      console.log(2)
    }).then(r => {
      console.log(r)
    })
    // 2
    // 1
    ```

    可以看到，调用 `resolve(1)` 以后，后面的 `console.log(2)` 还是会执行，并且会首先打印出来。

    这是因为立即 `resolved` 的 **Promise** 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

    一般来说，调用 `resolve` 或 `reject` 以后，**Promise** 的使命就完成了，「后继操作」应该放到 `then` 方法里面，而不应该直接写在 `resolve` 或 `reject` 的后面。所以，最好在它们前面加上 **return** 语句，这样就不会有意外。

---

### Promise.prototype.then()

**Promise** 实例具有 `then` 方法，也就是说，`then` 方法是定义在原型对象 `Promise.prototype` 上的。它的作用是为 **Promise** 实例添加状态改变时的回调函数。

`then` 方法的第一个参数是 `resolved` 状态的回调函数，第二个参数（可选）是 `rejected` 状态的回调函数。

`then` 方法返回的是一个新的 **Promise** 实例（ 注意，不是原来那个 **Promise** 实例 ）。因此可以采用链式写法，即 `then` 方法后面再调用另一个 `then` 方法。

#### then 的返回值：

- 如果 `then` 中的回调函数返回一个值，那么 `then` 返回的 **Promise** 将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
- 如果 `then` 中的回调函数抛出一个错误，那么 `then` 返回的 **Promise** 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
- 如果 `then` 中的回调函数返回一个已经是接受状态的 **Promise** ，那么 `then` 返回的 **Promise** 也会成为接受状态，并且将那个 **Promise** 的接受状态的回调函数的参数值作为该被返回的 **Promise** 的接受状态回调函数的参数值。
- 如果 `then` 中的回调函数返回一个已经是拒绝状态的 **Promise** ，那么 `then` 返回的 **Promise** 也会成为拒绝状态，并且将那个 **Promise** 的拒绝状态的回调函数的参数值作为该被返回的 **Promise** 的拒绝状态回调函数的参数值。
- 如果 `then` 中的回调函数返回一个未定状态（ pending ）的 **Promise** ，那么 `then` 返回 **Promise** 的状态也是未定的，并且它的终态与那个 **Promise** 的终态相同；同时，它变为终态时调用的回调函数参数与那个 **Promise** 变为终态时的回调函数的参数是相同的。

举一个官网 [Promise.prototype.then() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 的实例：

```javascript
Promise.resolve("foo")
  // 1. 接收 "foo" 并与 "bar" 拼接，并将其结果做为下一个resolve返回。
  .then(function(string) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        string += 'bar'
        resolve(string)
      }, 1)
    })
  })
  // 2. 接收 "foobar", 放入一个异步函数中处理该字符串
  // 并将其打印到控制台中, 但是不将处理后的字符串返回到下一个。
  .then(function(string) {
    setTimeout(function() {
      string += 'baz'
      console.log(string)
    }, 1)
    return string
  })
  // 3. 打印本节中代码将如何运行的帮助消息，
  // 字符串实际上是由上一个回调函数之前的那块异步代码处理的。
  .then(function(string) {
    console.log("end")

    // 注意 `string` 这时不会存在 'baz'。
    // 因为这是发生在我们通过 setTimeout 模拟的异步函数中。
    console.log(string)
})
// end
// foobar
// foobarbaz
```

个人分析：

1. 第一步，**Promise** 对象调用成功的回调函数，并传入参数 `foo`
2. 由于上一个 **Promise** 对象返回的是一个字符串，所以第一个 `then` 接收到的是一个「接受状态」的 **Promise**，它的第一个参数（ 接受状态 ）的回调函数被执行，且参数为上一个 **Promise** 对象的返回值：`foo`，这时候 `return` 一个 **Promise** 对象。
3. 第二个 `then` 接收到的是一个「未定状态」的 **Promise**，所以这个 `then` 的最终状态是由接受到的 **Promise** 的最终状态决定的。
4. 1 ms 后，第二个 `then` 接收到的 **Promise** 变成接受状态，而且此时 `resolve` 的参数也添加了 `bar`；所以，第二个 `then` 方法中的第一个参数（ 接受状态 ）的回调函数被执行，接收到的参数为 `foobar`，并且创建了一个定时器，从而先执行的 `return` 语句，此时 `return` 的值为 `foobar`。
5. 由于上一个 **Promise** 对象返回的是一个字符串，所以第三个 `then` 接收到的是一个「接受状态」的 **Promise**，它的第一个参数（ 接受状态 ）的回调函数被执行，且参数为上一个 **Promise** 对象的返回值：`foobar`。
6. 所以，先输出的 `end`，然后输出的 `foobar`，最后才输出第二个定时器中的字符串 `foobarbaz`。

---

### Promise.prototype.catch()

> 返回一个Promise，只处理拒绝的情况。它的行为与调用 `Promise.prototype.then(undefined, onRejected)` 相同。

`promise` 抛出一个错误，就被 `catch` 方法指定的回调函数捕获。下面两种写法是等价的：

```javascript
// 写法一
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test')
  } catch(e) {
    reject(e)
  }
})
promise.catch(function(error) {
  console.log(error)
})

// 写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'))
})
promise.catch(function(error) {
  console.log(error)
})
```

**Promise** 对象的错误具有「冒泡」性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 语句捕获。

```javascript
promise.then(function(value) {
  return value
}).then(function(value) {
  // some code
}).catch(function(error) {
  // 处理前面三个 Promise 产生的错误
})
```

所以，一般来说，不要在 `then` 方法里面定义 Reject 状态的回调函数（ 即 `then` 的第二个参数 ），总是使用 `catch` 方法会更好一些。

跟传统的 `try/catch` 代码块不同的是，如果没有使用 `catch` 方法指定错误处理的回调函数，**Promise** 对象抛出的错误**不会传递到外层代码**，即不会有任何反应。这就是说，**Promise** 内部的错误不会影响到 **Promise** 外部的代码，通俗的说法就是「**Promise** 会吃掉错误」。举个例子：

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2)
  })
}

someAsyncThing().then(function() {
  console.log('everything is great')
})

setTimeout(() => { console.log(123) }, 2000)
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

上面代码中，`someAsyncThing` 函数产生的 **Promise** 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示 `ReferenceError: x is not defined`，但是**不会退出进程、终止脚本执行**，2 秒之后还是会输出 `123`。

---

### Promise.resolve()

> 将现有对象转为 Promise 对象

实际上，该方法等价于下面代码：

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve` 方法的参数分成四种情况：

1. 参数是 Promise 实例

    那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例。

2. 参数是一个 `thenable` 对象，`thenable` 对象指的是具有 `then` 方法的对象，比如：

    ```javascript
    let thenable = {
      then: function(resolve, reject) {
        resolve(42)
      }
    }

    let p1 = Promise.resolve(thenable)
    p1.then(function(value) {
      console.log(value)  // 42
    })
    ```

3. 参数不是具有 `then` 方法的对象，或根本就不是对象

    这时候，`Promise.resolve` 方法返回一个新的 **Promise** 对象，状态为 `resolved`，相当于：

    ```javascript
    Promise.resolve('foo')
    // 等价于
    new Promise(resolve => resolve('foo'))
    ```

4. 不带有任何参数

    `Promise.resolve` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 **Promise** 对象。


需要注意的是，立即 `resolve` 的 **Promise** 对象，是在本轮「事件循环」（event loop）的**结束时**，而不是在下一轮「事件循环」的**开始时**，来，我们来举个栗子 🌰

```javascript
setTimeout(() => console.log('three'))

Promise.resolve().then(() => console.log('two'))

console.log('one')
// one
// two
// three
```

因为 `setTimeout` 在下一轮的「事件循环」开始阶段，`resolve` 在本轮事件的结束阶段，所以这两个操作都会在本轮同步事件 `console.log('one')` 之后，才输出对应内容。

---

### Promise.reject()

> 返回一个新的 **Promise** 实例，该实例的状态为 `rejected`。

该方法会生成一个 **Promise** 对象的实例，状态为 `rejected`，回调函数会立即执行：

```javascript
var p = Promise.reject('出错了')
// 等同于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
})
// 出错了
```

注意，`Promise.reject()` 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。这一点与 `Promise.resolve()` 方法不一致。

---

### Promise.all()

> 将多个 Promise 实例，包装成一个新的 Promise 实例。

该方法接受一个数组作为参数，格式如下：

```javascript
var p = Promise.all([p1, p2, p3])
```

`p1`、`p2`、`p3` 都是 **Promise** 实例，如果不是，就会先调用 `Promise.resolve` 方法，将参数转为 **Promise** 实例。

`p` 的状态由 `p1`、`p2`、`p3` 决定，存在两种情况：

1. `resolve` 状态

    当且仅当 `p1`、`p2`、`p3` 都为 `resolve` 状态。此时 `p1`、`p2`、`p3` 的返回值将组成一个数组，传递给 `p` 的回调函数（ `resolve` 回调函数 ）。

1. `reject` 状态

    只要 `p1`、`p2`、`p3` 其中任意一个转为 `reject` 状态。此时，第一个转为 `reject` 的实例的返回值，将会被传递给 `p` 的回调函数（ `reject` 回调函数 ）。

注意，如果作为参数的 **Promise** 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法。

```javascript
var promise1 = Promise.resolve(3)
var promise2 = 42
var promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo')
})

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values)
})
// expected output: Array [3, 42, "foo"]
```

---

### Promise.race()

> 同样是将多个 **Promise** 实例，包装成一个新的 **Promise** 实例。

`Promise.race()` 方法的参数与 `Promise.all()` 方法一样，如果不是 **Promise** 实例，就会先调用之前讲到的 `Promise.resolve` 方法，将参数转为 **Promise** 实例，再进一步处理。

和 `Promise.all()` 的区别是：要 `p1`、`p2`、`p3` 之中有一个实例**率先**改变状态，`p` 的状态就跟着改变。那个率先改变的 **Promise** 实例的返回值，就传递给 `p` 的回调函数。