## 目录

- [简介](#%E7%AE%80%E4%BB%8B)
- [XMLHttpRequest 对象](#xmlhttprequest-%E5%AF%B9%E8%B1%A1)
- [readyState](#readystate)
- [status](#status)
- [responseType](#responsetype)
- [response](#response)
- [timeout](#timeout)
- [open(method, url, async?, user?, password?)](#openmethod-url-async-user-password)
- [setRequestHeader(header, value)](#setrequestheaderheader-value)
- [send()](#send)
- [abort()](#abort)
- [事件监听](#%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC)
- [参考文档](#%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3)

## 简介

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> **XMLHttpRequest** 是一个浏览器接口，使得 Javascript 可以进行 HTTP(S) 通信。

举个例子：

```javascript
var url = 'api.lbinin.com/cors/'
var xhr = new XMLHttpRequest() // 如果为了兼容变态的 IE 6 则需要为 `new ActiveXObject('Microsoft.XMLHTTP')`

xhr.open('GET', url) // 指定发送 HTTP 请求的参数

xhr.responseType = 'json' // 指定接收的数据类型

xhr.addEventListener('load', e => {
  // readystatechange 事件你很少用上的，但是不知何时起网上到处是 readystatechange 了
  // 实际上等同于 xhr.readyState == 4 && xhr.status == 200
  // 不要告诉我你老板让你兼容ie 8，写了长长的 if 就为了取得 load 的效果，除非你想兼容ie 8
  console.log(xhr, xhr.response)
})

xhr.addEventListener('error', e => {
  // 监听出错事件
  console.log(e)
})

xhr.send() // 发送请求
```

接下来我们从头解释。

## XMLHttpRequest 对象

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

该对象主要拥有如下属性：

- `readyState`：**XMLHttpRequest** 对象的状态，等于 4 表示数据已经接收完毕。
- `status`：服务器返回的状态码，等于 200 表示一切正常。
- `response`：服务器返回的文本数据
- `responseXML`：服务器返回的 XML 格式的数据
- `statusText`：服务器返回的状态文本。

## readyState

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> readyState 是一个「只读属性」，用一个整数和对应的常量，表示 XMLHttpRequest 请求当前所处的状态。

- `0`：对应常量 `UNSENT`，表示 XMLHttpRequest 实例已经生成，但是 `open()` 方法还没有被调用
- `1`：对应常量 `OPENED`，表示 `send()` 方法还没有被调用，仍然可以使用 `setRequestHeader()`，设定 HTTP 请求的头信息。
- `2`：对应常量 `HEADERS_RECEIVED`，表示 `send()` 方法已经执行，并且头信息和状态码已经收到。
- `3`：对应常量 `LOADING`，表示正在接收服务器传来的 body 部分的数据，如果 `responseType` 属性是 text 或者空字符串，`responseText` 就会包含已经收到的**部分**信息。
- `4`：对应常量 `DONE`，表示服务器数据已经完全接收，或者本次接收已经失败了（ 正是因为可能是失败的所以如果是通过 `readyState` 判断的话必须判断 `status` 是否为 200 ）。

## status

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> readyState 是一个「只读属性」，表示该请求的响应状态码（ 例如, 状态码200 表示一个成功的请求）。

## responseType

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> responseType 属性用来指定服务器返回数据（ response ）的类型。

- `''`：字符串（默认值）；
- `arraybuffer`：ArrayBuffer 对象；
- `blob`：Blob 对象；
- `document`：Document 对象；
- `json`：JSON 对象；
- `text`：字符串。

## response

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> response 为响应实体，它的类型由 responseType 来指定， 可以是 ArrayBuffer，Blob， Document，JavaScript 对象 (即 "json")，或者是字符串。如果请求未完成或失败，则该值为 null。

## timeout

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> XMLHttpRequest 第二版新增属性，为数值类型，用于设置 HTTP 请求的时限，单位 ms，默认为 0。

如果超出指定时限，则会触发 XMLHttpRequest 实例上的 `timeout` 事件。

## open(method, url, async?, user?, password?)

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> **XMLHttpRequest** 对象的 `open` 方法用于指定发送 HTTP 请求的参数。

方法可接受五个参数：

- `method`：表示 HTTP 动词，比如 `GET`、 `POST`、 `PUT` 和 `DELETE`。
- `url`：表示请求所要访问的网址。
- `async`：格式为布尔值，默认为 `true`，表示请求是否执行异步操作。如果设为 `false`，则 `send()` 方法只有等到收到服务器返回的结果，才会有返回值。
- `user`：表示用于认证的用户名，默认为「空字符串」。
- `password`：表示用于认证的密码，默认为「空字符串」。

如果对使用过 `open()` 方法的请求，再次使用这个方法，等同于调用 `abort()`。

## setRequestHeader(header, value)

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> 给指定的HTTP请求头赋值。

在这之前，你必须确认已经调用 `open()` 方法打开了一个 url，并且需要在 `send()` 方法之前调用。

该方法接受两个参数：

- `header`：将要被赋值的请求头名称。
- `value`：给指定的请求头赋的值。

举个例子：

```javascript
xhr.setRequestHeader('Content-Type', 'application/json')
```

## send()

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

send方法用于实际发出HTTP请求。如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是POST请求。

```javascript
var request = new XMLHttpRequest()
request.open('POST','/register')
request.responseType = 'json'
request.setRequestHeader('Content-Type','application/json')
request.addEventListener('progress', e => {
  console.log((e.loaded / e.total) * 100)
})
request.addEventListener('load', e => {
  console.log(request.response)
})
request.addEventListener('error', e => {
   console.log(e)
})
request.send(JSON.stringify({username: "lbinin", password: "123456"}))
```

## abort()

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

如果请求已经被发送，则立刻中止请求。

## 事件监听

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

XMLHttpRequest 对象事件：

- `onabort`：当请求失败时调用该方法；
- `onerror`：当请求发生错误时调用该方法；
- `onload`：当一个 HTTP 请求**正确加载**出内容后返回时调用；
- `onloadstart`：当一个 HTTP 请求开始加载数据时调用；
- `onprogress`：间歇调用该方法用来获取请求过程中的信息；
- `ontimeout`：当时间超时时调用；只有通过设置 XMLHttpRequest 对象的 `timeout` 属性来发生超时时，这个事件才会发生；
- `onloadend`：当内容加载完成，**不管失败与否**，都会调用该方法。

例如，可以通过 `xhr.onload = function() {}` 或者 `xhr.addEventListener('load', function() {})` 设置监听。

---

XMLHttpRequestUpload 对象（ `XMLHttpRequest.upload` 返回的对象，用来表示上传的进度 ）事件：

- `onloadstart`：获取开始；
- `onprogress`：数据传输进行中；
- `onabort`：获取操作终止；
- `onerror`：获取失败；
- `onload`：获取成功；
- `ontimeout`：获取操作因用户指定的延迟时间内未完成；
- `onloadend`：获取完成（ 不能成功与否 ）。


## 参考文档

- [XMLHttpRequest - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

- [XMLHttpRequest Level 2 使用指南 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html)

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)