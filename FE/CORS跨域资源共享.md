## 目录

- [简介](#%E7%AE%80%E4%BB%8B)
- [简单请求](#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82)
- [非简单请求](#%E9%9D%9E%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82)
- [与 JSONP 的比较](#%E4%B8%8E-jsonp-%E7%9A%84%E6%AF%94%E8%BE%83)
- [参考资料](#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

## 简介

[⬆️ 回到目录](#%E7%9B%AE%E5%BD%95)

「CORS」是一个 W3C 标准，全称是「跨域资源共享」（ Cross-origin resource sharing ）。

它允许浏览器向跨源服务器，发出 **XMLHttpRequest** 请求，从而克服了 AJAX 只能同源使用的限制。

当然，这也需要浏览器和服务器同时支持。目前，除了 IE10 以下的浏览器，其他所有浏览器都支持该功能。服务端则需要设置 `Access-Control-Allow-Origin` 字段。

## 简单请求

[⬆️ 回到目录](#%E7%9B%AE%E5%BD%95)

浏览器将CORS请求分成两类：「简单请求」（ simple request ）和「非简单请求」（ not-so-simple request ）。

---

**问**：什么是简单请求？

**答**：

- HTTP 动词为 `HEAD`、`GET`、`POST` 三者之一；

- 请求头信息为只包含一下内容（ 不能超出范围 ）

    - `Accept` 
    - `Accept-Language` 
    - `Content-Language` 
    - `Last-Event-ID` 
    - `Content-Type` 

这样的请求方式便为「简单请求」。

---

浏览器会在发现当前的 AJAX 请求是跨域的，并且是「简答请求」，便会在请求头上加上一个 `Origin` 字段，表示**本次请求来自哪个域**（ 包括协议 + 域名 + 端口 ），让服务器来决定是否同意这个请求。

无论是否当前域是否被包含在允许列表内（ 即 `Access-Control-Allow-Origin` 字段 ），都会发回一个响应头。

- 不在许可范围内

    如果在响应头中没有 `Access-Control-Allow-Origin` 字段，浏览器变知道请求出错，便会抛出一个错误，这个错误能被 `onerror` 回调函数所捕获。

    ❗️需要注意的是，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。

- 在许可范围内

    如果 `Origin` 指定的域名在许可范围内，服务器返回的响应，会多出如下几个头信息字段：

    ```
    Access-Control-Allow-Origin: http://api.bob.com
    Access-Control-Allow-Credentials: true
    Access-Control-Expose-Headers: FooBar
    Content-Type: text/html; charset=utf-8
    ```

    1. `Access-Control-Allow-Origin`：该字段是必须的，表示接受任意域名的请求。

        它的值要么是请求时 `Origin` 字段的值，要么是一个 `*`。

    1. `Access-Control-Allow-Credentials`：它的值是一个布尔值，表示是否允许发送Cookie；该字段可选。

        默认情况下，Cookie 不包括在 CORS 请求之中。
        
        如果**服务端**设为 `true`，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。
        
        这个值也**只能设为 `true`**，如果服务器不要浏览器发送 Cookie，删除该字段即可。

        另一方面，开发者必须在 AJAX 请求中打开 **XMLHttpRequest** 的 `withCredentials` 属性：

        ```javascript
        var xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        ```

        如果客户端没有设置改属性为 `true`，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

        ❗️为了避免不同浏览器有不同的处理，如需禁止发送 Cookie，最好**显式**地关闭 `withCredentials`：

        ```js
        xhr.withCredentials = false;
        ```

        ❗️另外需要注意的一点：如果要发送 Cookie，`Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的 Cookie 并不会上传，且（ 跨源 ）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie。

    1. `Access-Control-Expose-Headers`：头信息中暴露的其他字段；该字段可选。

        CORS 请求时，XMLHttpRequest 对象的 `getResponseHeader()` 方法只能拿到6个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。如：`getResponseHeader('FooBar')` 可以返回 `FooBar` 字段的值。

## 非简单请求

[⬆️ 回到目录](#%E7%9B%AE%E5%BD%95)

除了简单请求外的请求都是「非简单请求」。

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为「预检」请求（ preflight ）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 **XMLHttpRequest** 请求，否则就报错。

🌰 举个栗子：

```js
var url = 'http://api.alice.com/cors'
var xhr = new XMLHttpRequest()
xhr.open('PUT', url, true) // 使用 PUT 动词
xhr.setRequestHeader('X-Custom-Header', 'value') // 设置自定义头信息字段
xhr.send()
```

这时候，浏览器会发现，这是一个「非简单请求」，遍会先发送一个「预检请求」：

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

我们可以看到，该请求用的方法是 `OPTIONS`，表示这个请求是用来询问服务器的。

在头信息里面，关键字段是 `Origin`，表示当前请求是来自哪个源。

除了 `Origin` 字段，「预检」请求的头信息包括两个特殊字段：

- `Access-Control-Request-Method`：该字段是用来列出浏览器即将发出的的 CORS 请求会用到哪些 HTTP 方法；该字段是必须的。
- `Access-Control-Request-Headers`：该字段是一个**逗号**分隔的字符串，用来指定浏览器 CORS 请求会额外发送的头信息字段。

接下来，服务器收到「预检」请求以后，将会检查 `Origin`、`Access-Control-Request-Method` 和 `Access-Control-Request-Headers` 字段

检查以后

- 如果确认允许跨源请求

    服务器就可以做出回应，比如：

    ```
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 01:15:39 GMT
    Server: Apache/2.0.61 (Unix)
    Access-Control-Allow-Origin: http://api.bob.com
    Access-Control-Allow-Methods: GET, POST, PUT
    Access-Control-Allow-Headers: X-Custom-Header
    Content-Type: text/html; charset=utf-8
    Content-Encoding: gzip
    Content-Length: 0
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    Content-Type: text/plain
    ```

    这里面的关键字段是 `Access-Control-Allow-Origin`，同样的，它的值要么是请求时 `Origin` 字段的值，要么是一个 `*`。

    一旦通过了「预检」请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。
    
    服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

- 如果浏览器否定了「预检」请求

    服务器会返回一个正常的 HTTP 回应，但是没有任何 CORS 相关的头信息字段。
    
    这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 **XMLHttpRequest** 对象的 `onerror` 回调函数捕获。控制台会打印出如下的报错信息：

    ```
    XMLHttpRequest cannot load http://api.alice.com.
    Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
    ```

## 与 JSONP 的比较

[⬆️ 回到目录](#%E7%9B%AE%E5%BD%95)

CORS 与 JSONP 的使用目的相同，都是为了跨域，但是比 JSONP 更强大。

JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求。JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。

## 参考资料

[跨域资源共享 CORS 详解 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/04/cors.html)