参考资料：

> [Koa 框架教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/08/koa.html)
>
> [koa 入门 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001471087582981d6c0ea265bf241b59a04fa6f61d767f6000)
>
> [Koajs 中文文档](https://koa.bootcss.com/#introduction)

---

## 安脏

```Bash
$ npm i koa
```

---

## Context 对象

> **Koa** 提供一个 `Context` 对象，表示一次对话的上下文，包括 `HTTP` 请求（ Request ）和 `HTTP` 回复（ Response ）。

通过加工 `Context` 这个对象，就可以控制返回给用户的内容：

```JavaScript
const Koa = require('koa')
const app = new Koa()

// 定义 main 函数来设置响应内容
const main = ctx => {
  // ctx 为 Koa 提供的对话上下文
  // ctx.response 为本次 HTTP 响应
  // 通过 ctx.response.body 可以定义发送给客户端的内容
  ctx.response.body = 'Hello World'
}

// 使用 use 加载 main 函数
app.use(main)
// 监听 3000 端口
app.listen(3000)
```

更多有关 Context 内容：[Koajs 中文文档 - API](https://koa.bootcss.com/#api)

## Response 类型

**Koa** 默认的返回类型是 `text/plain`，如果想返回其他类型的内容，可以先用 `ctx.request.accepts` 判断一下客户端能够接受什么样的数据（ 也就是根据 HTTP Request 的 `Accept` 字段 ）。

然后使用 `ctx.response.type` 指定返回类型：

```JavaScript
const main = ctx => {
  if (ctx.request.accepts('xml')) {
    ctx.response.type = 'xml'
    ctx.response.body = '<data>Hello World</data>'
  } else if (ctx.request.accepts('json')) {
    ctx.response.type = 'json'
    ctx.response.body = { data: 'Hello World' }
  } else if (ctx.request.accepts('html')) {
    ctx.response.type = 'html'
    ctx.response.body = '<p>Hello World</p>'
  } else {
    ctx.response.type = 'text'
    ctx.response.body = 'Hello World'
  }
}
```

---

## 网页模板

**Koa** 可以读取「模板文件」，然后将这个模板返回给用户：

```JavaScript
const fs = require('fs')

const main = ctx => {
  ctx.response.type = 'html'
  // 读取文件内容并设置为响应内容
  ctx.response.body = fs.createReadStream('./demos/template.html')
}
```

---

## 路由

- 原生

    通过 `ctx.request.path` 可以获取用户请求的路径，由此实现简单的路由：

    ```JavaScript
    const main = ctx => {
      if (ctx.request.path !== '/') {
        ctx.response.type = 'html'
        ctx.response.body = '<a href="/">Index Page</a>'
      } else {
        ctx.response.body = 'Hello World'
      }
    }
    ```

- **koa-route** 模块

    原生路由不仅看着不直观，而且难以维护，所以我们可以使用封装好的 [`Koa-router`](https://github.com/alexmingoia/koa-router) 模块：

    **安脏**：

    ```Bash
    $ npm i koa-router
    ```

    ```JavaScript
    const KoaRouter = require('koa-router')
    const router = new KoaRouter()

    const about = ctx => {
      ctx.response.type = 'html'
      ctx.response.body = '<a href="/">Index Page</a>'
    }

    const main = ctx => {
      ctx.response.body = 'Hello World'
    }
    router.get('/', main) // 根路径 `/` 的处理函数是 main
    router.get('/about', about) // `/about` 路径的处理函数是 about

    app.use(router.routes())
    app.use(main)
    ```

---

## 静态资源

如果网站提供静态资源，一个个写路由会很麻烦，也没必要。

[`koa-static`](https://github.com/koajs/static) 模块封装了这部分的请求：

```JavaScript
const path = require('path')
const serve = require('koa-static')

const main = serve(path.join(__dirname)) // 以 __dirname 为准访问相对路径的静态资源
app.use(main)
```

---

## 重定向

`ctx.response.redirect()` 方法可以发出一个 302 跳转，将用户导向另一个路由：

```JavaScript
const redirect = ctx => {
  ctx.response.redirect('/') // 直接重定向到 `/` 根页面
  ctx.response.body = '<a href="/">Index Page</a>' // 实际上看不到 -=-
}

app.use(route.get('/redirect', redirect))
```

---

## 中间件

**问**：什么是「中间件」？

**答**：它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能，所以叫做「中间件」（ middleware ）。

基本上，**Koa** 所有的功能都是通过中间件实现的，前面所有例子中的 `main` 函数也是个中间件。

每个中间件默认接受**两个参数**，第一个参数是 `Context` 对象，第二个参数是 `next` 函数。

- `Context` 也就是对话上下文，前面已经解释过了。
- 关于 `next` 参数，它是个函数。只要调用 `next` 函数，就可以把执行权转交给**下一个中间件**。

我们可以通过 `app.use()` 方法用来加载中间件：

```JavaScript
const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`)
  next()
}
const main = ctx => {
  console.log('这里是 main')
  ctx.response.body = 'Hello World'
}
app.use(logger)
app.use(main)
```

运行后在命令行中输出：

```
1521803782430 GET /
这里是 main
```

我们可以看到 `logger` 这个中间件先被运行了，先打印出了 `1521803782430 GET /`，然后由于执行了 `next` 函数，执行权到了 `main` 函数，输出了 `这里是 main`，并且页面内容显示 `Hello World`。

---

## 中间件栈

既然前面说了，调用 `next` 函数可以把执行权转交给下一个中间件，所以这就说明：如果有多个中间件，那么就会形成一个「中间件栈」，它是一个栈结构，以**先进后出**的顺序执行。

1. 最外层的中间件首先执行。
1. 调用 `next` 函数，把执行权交给下一个中间件。
1. ...
1. 最内层的中间件最后执行。
1. 执行结束后，把执行权交回上一层的中间件。
1. ...
1. 最外层的中间件收回执行权之后，执行 `next` 函数后面的代码。

来个例子方便理解下：

```JavaScript
const one = (ctx, next) => {
  console.log('>> one')
  next()
  console.log('<< one')
}

const two = (ctx, next) => {
  console.log('>> two')
  next() 
  console.log('<< two')
}

const three = (ctx, next) => {
  console.log('>> three')
  next()
  console.log('<< three')
}

app.use(one)
app.use(two)
app.use(three)
```

运行后访问，可以看到控制台输出：

```
>> one
>> two
>> three
<< three
<< two
<< one
```

所以，我们可以将 `next` 看成下一个中间件，`next()` 就是执行下一个中间件，中间件执行完毕后，执行权将回到原本的中间件手中（ 如果 `next()` 不在函数尾 ）。

---

## 异步中间件

如果有异步操作（ 比如读取数据库 ），中间件就必须写成 `async` 函数：

```JavaScript
const fs = require('fs.promised')
const Koa = require('koa')
const app = new Koa()

const main = async function (ctx, next) {
  ctx.response.type = 'html'
  ctx.response.body = await fs.readFile('./demos/template.html', 'utf8')
}

app.use(main)
app.listen(3000)
```

---

## 中间件的合成

有关中间件的合成，我们需要使用到 [koa-compose](https://github.com/koajs/compose) 这个模块，它可以将模块可以将多个中间件合成为一个：

**安脏**：

```Bash
$ npm i koa-compose
```

**使用**：

```JavaScript
const compose = require('koa-compose')

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`)
  next()
}

const main = ctx => {
  ctx.response.body = 'Hello World'
}

const middlewares = compose([logger, main]) // 传递一个数组，每个元素都是一个中间件
app.use(middlewares)
```

需要注意的是 `compose()` 方法传递的数组中的内容依然要**按顺序**放入的，才能依次执行。

---

## 错误处理

**Koa** 提供了 `ctx.throw()` 方法，用来抛出错误，`ctx.throw(500)` 就是抛出500错误：

```JavaScript
const main = ctx => {
  ctx.throw(500)
}
```

---

## 有关 404

如果将 `ctx.response.status` 设置成404，就相当于 `ctx.throw(404)`，返回 404 错误。

```JavaScript
const main = ctx => {
  ctx.response.status = 404 // 等同于 ctx.throw(404)
  ctx.response.body = 'Page Not Found'
}
```

---

## 处理可能存在错误的中间件

为了方便处理错误，最好使用 `try...catch` 将其捕获。

为每个中间件都写 `try...catch` 太麻烦，我们可以让最外层的中间件，负责**所有中间件**的错误处理：

```JavaScript
const handler = async (ctx, next) => {
  try {
    await next() // 只要接下来的中间件执行除了错误，就会被 catch 到
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      message: err.message
    }
  }
}

const main = ctx => {
  ctx.throw(500)
}

app.use(handler)
app.use(main)
```

---

## 监听和触发事件

**Koa** 允许在运行过程中监听触发的事件，以出错为例：

```JavaScript
// 监听错误事件
app.on('error', (err, ctx) =>
  console.error('server error', err)
)

// 触发事件
ctx.app.emit('error', err, ctx)
```

当运行过程出现错误，**Koa** 会触发一个 `error` 事件，我们可以监听这个事件以便我们做出相应的处理。

但是，如果出错的过程被 `try...catch` 结构捕获的话，**Koa** 就不会触发 `error` 事件，所以我们需要手动释放出 `error` 事件，能够让监听函数生效：

```JavaScript
const handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.type = 'html'
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>'
    ctx.app.emit('error', err, ctx)
  }
}

const main = ctx => {
  ctx.throw(500)
}

app.on('error', (err, ctx) =>
  console.error('server error', err)
)

app.use(handler)
app.use(main)
```

---

## 有关 Web app

- **Cookies 相关**

    我们可以使用 `ctx.cookies` 用来读写 Cookie：

    ```JavaScript
    const main = function(ctx) {
      const n = Number(ctx.cookies.get('view') || 0) + 1
      ctx.cookies.set('view', n) // set 接受两个参数：键名，键值
      ctx.response.body = n + ' views'
    }
    ```

    上面代码可以实现本地记录浏览次数。

- **表单**

    我们可以使用 [koa-bodyparser](https://github.com/koajs/bodyparser) 模块，用来从 **POST** 请求的数据体里面提取键值对：

    ```JavaScript
    const bodyParser = require('koa-bodyparser')

    const main = async function(ctx) {
      const body = ctx.request.body
      if (!body.name) ctx.throw(400, '.name required')
      ctx.body = { name: body.name }
    }

    app.use(bodyParser()) // bodyparser 解析之后，在 ctx.request.body 中就能直接获取到数据。
    app.use(main)
    ```

- **文件上传**

    同款 [koa-body](https://github.com/dlau/koa-body) 模块也可以用来处理文件上传：

    ```JavaScript
    const os = require('os')
    const path = require('path')
    const koaBody = require('koa-body')

    const main = async function(ctx) {
      const tmpdir = os.tmpdir()
      const filePaths = []
      const files = ctx.request.body.files || {}

      for (let key in files) {
        const file = files[key]
        const filePath = path.join(tmpdir, file.name)
        const reader = fs.createReadStream(file.path)
        const writer = fs.createWriteStream(filePath)
        reader.pipe(writer)
        filePaths.push(filePath)
      }

      ctx.body = filePaths
    }

    app.use(koaBody({ multipart: true }))
    ```