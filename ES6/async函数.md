### 有关 async

ES2017 标准引入了 **async** 函数，使得异步操作变得更加方便。

**async** 函数是什么？其实就是一句话：**它就是 Generator 函数的语法糖**。

直接举一个例子先简单认识一下：

```javascript
const fs = require('fs')

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

const gen = function* () {
  const f1 = yield readFile('/etc/fstab')
  const f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

把上面的内容写成 `async` 函数如下：

```javascript
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab')
  const f2 = await readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

一比较就会发现，`async` 函数就是将 Generator 函数的星号（ `*` ）替换成 `async`，将 `yield` 替换成 `await`，仅此而已。

`async` 函数对 Generator 函数的改进，体现在以下四点：

1. 内置执行器

    Generator 函数的执行必须靠执行器，所以才有了 **co** 模块，而 `async` 函数自带执行器。也就是说，`async` 函数的执行，与普通函数一模一样，只要一行。

    拿上面的例子来说，函数的执行只需要 `asyncReadFile()` 一句话即可自动执行。而不需要像之前那样，需要调用 `next()` 方法或者使用 **co** 模块，才能真正执行。

2. 更好的语义

    可想而知，`async` 和 `await`，比起星号和 `yield`，语义更清楚了。`async` 表示**函数里有异步操作**，`await` 表示**紧跟在后面的表达式需要等待结果**。

3. 更广的适用性

    **co** 模块约定，`yield` 命令后面只能是 **Thunk** 函数或 **Promise** 对象，而 `async` 函数的 `await` 命令后面，可以是 **Promise** 对象和**原始类型**的值（ 数值、字符串和布尔值，但这时等同于同步操作 ）。

4. 返回值是 **Promise**

    `async` 函数的返回值是 **Promise** 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 `then` 方法指定下一步的操作。

    进一步说，`async` 函数完全可以看作多个异步操作，包装成的一个 **Promise** 对象，而 `await` 命令就是内部 `then` 命令的语法糖。

---

### 基本用法

`async` 函数返回一个 **Promise** 对象，可以使用 `then` 方法添加回调函数。

当函数执行的时候，一旦遇到 `await` 就会先**返回**，等到异步操作**完成后**，再接着执行函数体内**后面的语句**。

举一个获取股票报价的例子：

```javascript
// 使用 async 声明函数
async function getStockPriceByName(name) {
  // 获取股票 symbol，并等待返回值
  const symbol = await getStockSymbol(name)

  // 等待上面 symbol 获取成功后，获取报价并等待返回值
  const stockPrice = await getStockPrice(symbol)

  // 等待报价成功返回后，函数返回股票报价
  return stockPrice
}

// 使用方法，因为返回的是一个 Promise 对象，所以可以给它添加 then 的回调函数
getStockPriceByName('goog').then(function (result) {
  console.log(result)
})
```

还有 `async` 其他的一些用法：

```javascript
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {}

// 对象的方法
let obj = { async foo() {} }
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars')
  }

  async getAvatar(name) {
    const cache = await this.cachePromise
    return cache.match(`/avatars/${name}.jpg`)
  }
}

const storage = new Storage()
storage.getAvatar('jake').then(…)

// 箭头函数
const foo = async () => {}
```

其实说到底还是和普通函数一样的方式声明，只是在 `function` 命令前面加上了 `async` 关键字。

---

### 语法

#### Promise 对象的状态变化

`async` 函数返回的 **Promise** 对象，必须等到内部所有 `await` 命令后面的 **Promise** 对象执行完，才会发生状态改变，除非遇到 `return` 语句或者**抛出错误**。

也就是说，只有 `async` 函数内部的所有操作（ 包括异步和同步 ）执行完，才会执行 `then` 方法指定的回调函数。

#### await 命令

一般来说正常情况下，`await` 命令后面是一个 **Promise** 对象。如果不是，会被转成一个立即 `resolve` 的 **Promise** 对象。详见 [Promise.resolve()](https://github.com/LBinin/LearnJS/blob/master/ES6/Promise.md#promiseresolve)。

`await` 命令后面的 **Promise** 对象如果变为 `reject` 状态，则 `reject` 的参数会被 `catch` 方法的回调函数接收到。

❗️**需要注意的是**：只要一个 `await` 语句后面的 **Promise** 变为 `reject`，那么整个 `async` 函数都会中断执行，后面的语句将不再执行。可以理解为该 `async` 要返回的 **Promise** 对象已经转换成了 `reject` 状态。但是 `async` 函数额外规定的是后面的语句不再执行。

```javascript
async function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(() => { resolve('haha') }, ms)
  })
}

async function asyncPrint(value, ms) {
  var str = await timeout(ms)
  await Promise.reject('error')
  console.log(value + str)
}

asyncPrint('hello world', 1500).then(() => {
  console.log('success')
}, value => {
  console.log(value)
})
```

这里只会输出 `error`，其他的 `console.log()` 都不会执行。

但是如果在上面的例子中添加 `catch` 方法后，即可继续执行后续操作：

```javascript
async function asyncPrint(value, ms) {
  var str = await timeout(ms)
  await Promise.reject('error').catch(value => {
    console.log('内部捕获：' + value)
  })
  console.log(value + str)
}
```

当然，你也可以使用 `try...catch` 结构来捕获异常，以便程序继续往下执行。

```javascript
async function f() {
  try {
    await Promise.reject('出错了')
  } catch(e) {
  }
  return await Promise.resolve('hello world')
}

f()
.then(v => console.log(v))
// hello world
```

---

### 错误处理

其实总结一下前面说的错误处理，无非就是：如果内部的 **Promise** 没有被 `catch` 的话就会导致 `async` 函数返回的 **Promise** 对象被 `reject`，可以在 `async` 函数返回的 **Promise** 对象的 `catch` 方法中被捕获。

所以，需要注意的是：

如果 `await` 命令后面的 **Promise** 对象，运行结果可能是 `rejected`，最好把 `await` 命令放在 `try...catch` 代码块中，或者使用 `catch` 方法。

---

### 使用注意点

1. 像之前说过的，如果需要对 `async` 函数内部进行错误的捕获与处理，需要添加 `try...catch` 代码快，或者使用 `catch` 方法。
2. 如果多个 `await` 命令后面的操作不存在继发关系，就是前后顺序无所谓，没有必要一定要等前面一个任务执行完毕才执行，也就是可以同时触发的话，

    举个例子：

    ```javascript
    let foo = await getFoo()
    let bar = await getBar()
    ```

    上面两个是相互独立的异步操作，没有必要的前后关系，被写成继发关系的话就会比较耗时，完全可以让他们同时触发，现在有两种写法：

    ```javascript
    // 写法一，利用 Promise 的 all 方法
    let [foo, bar] = await Promise.all([getFoo(), getBar()])

    // 写法二
    let fooPromise = getFoo()
    let barPromise = getBar()
    let foo = await fooPromise
    let bar = await barPromise
    ```

3. `await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错。

---

### 实例操作

说了这么多不如来一个实例明白的快，现在我们来写一段，内容：读取数组里的 URL，然后依次请求，最后按顺序输出。

先举一个 **Promise** 的例子，让我们看看可读性：

```javascript
function logInOrder(urls) {
  // 远程读取所有URL
  const textPromises = urls.map(url => {
    // 获取所有 url 的内容，返回每个 Promise 对象给 textPromises 数组
    return fetch(url).then(response => response.text())
  })

  // 按次序输出
  textPromises.reduce((chain, textPromise) => {
    return chain.then(() => textPromise) // 返回一个 Promise，该 Promise 成功的参数就是 textPromise 成功的参数。
      .then(text => console.log(text)) // 处理 resolve 中的参数，也就是 fetch 的结果。
  }, Promise.resolve())
}
```

---

### 📝 小笔记

- `await` 后面跟的可以是 **Promise** 对象和**原始类型**的值。资料：]    [await - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
  - 如果 `await` 操作符后接的值是一个 **Promise**，`await` 将等待 **Promise** 正常处理完成并返回其处理结果。
  - 如果 `await` 操作符后接的值是**数值**、**字符串**和**布尔值**，这时等同于同步操作。
  - 如果 `await` 操作符后接的值不是一个 **Promise**，那么该值将被转换为一个已正常处理的 **Promise**。
- 在使用 `async/await` 用 **babel** 转义的时候，记得引入「babel-polyfill」以支持 `async/await`。详见 so 上的：[Babel 6 regeneratorRuntime is not defined](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined)