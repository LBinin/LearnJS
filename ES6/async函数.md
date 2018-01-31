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