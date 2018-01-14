### document.readyState

> 返回当前文档的状态，共有三种可能的值。

- `loading`：加载HTML代码阶段（尚未完成解析）
- `interactive`：加载外部资源阶段时
- `complete`：加载完成时

比如：

```javascript
// 基本检查
if (document.readyState === 'complete') {
  // ...
}

// 轮询检查
var interval = setInterval(function() {
  if (document.readyState === 'complete') {
    clearInterval(interval)
    // ...
  }
}, 100)
```

---

### document.location

> 返回 location 对象，提供了当前文档的 URL 信息。

`document.location` 属性与 `window.location` 属性等价。历史上，IE曾经不允许对document.location赋值，为了保险起见，建议优先使用 `window.location`。

```javascript
// 当前网址为 http://user:passwd@www.example.com:4097/path/a.html?x=111#part1
document.location.href // "http://user:passwd@www.example.com:4097/path/a.html?x=111#part1"
document.location.protocol // "http:"
document.location.host // "www.example.com:4097"
document.location.hostname // "www.example.com"
document.location.port // "4097"
document.location.pathname // "/path/a.html"
document.location.search // "?x=111"
document.location.hash // "#part1"
document.location.user // "user"
document.location.password // "passwd"
```

`location` 对象有以下方法：

```javascript
// 跳转到另一个网址
document.location.assign('http://www.google.com')
// 优先从服务器重新加载
document.location.reload(true)
// 优先从本地缓存重新加载（ 默认值 ）
document.location.reload(false)
// 跳转到新网址，并将取代掉 history 对象中的当前记录
document.location.replace('http://www.google.com')
// 将 location 对象转为字符串，等价于 document.location.href
document.location.toString()
```

如果将新的网址赋值给 `location` 对象，网页就会自动跳转到新网址，其实相当于给 `href` 属性赋值：

```javascript
document.location = 'http://www.example.com'
// 等同于
document.location.href = 'http://www.example.com'

/* 也可以是相对 URL 或者锚标签 */
document.location = 'page2.html'
document.location = '#top'
```

需要注意的是：采用上面的方法重置 **URL**，跟用户**点击**链接跳转的效果是一样的。上一个网页依然将保存在浏览器历史记录之中，点击**后退**按钮就可以回到前一个网页。

如果不希望用户看到前一个网页，可以使用 `location.replace` 方法，浏览器 `history` 对象就会用新的网址，取代当前网址，这样的话，**后退**按钮就不会回到当前网页了。

`location.replace` 的一个应用就是：当脚本发现当前是移动设备时，就立刻跳转到移动版网页。

---

### document.querySelector()，document.querySelectorAll()

> 这两个方法都接受一个 CSS 选择器作为参数，返回匹配该选择器的元素节点。

这两个方法都支持复杂的 CSS 选择器。

```javascript
// 选中data-foo-bar属性等于someval的元素
document.querySelectorAll('[data-foo-bar="someval"]')

// 选中myForm表单中所有不通过验证的元素
document.querySelectorAll('#myForm :invalid')

// 选中div元素，那些class含ignore的除外
document.querySelectorAll('DIV:not(.ignore)')

// 同时选中div，a，script三类元素
document.querySelectorAll('DIV, A, SCRIPT')
```

---

### HTML 属性操作

元素节点提供四个方法，用来操作属性：

- `getAttribute()`
- `setAttribute()`
- `hasAttribute()`
- `removeAttribute()`

以上四个方法是标准方法，当然也可以通过对象的属性来更改 HTML 元素的属性，因为 HTML 元素节点的标准属性（ 即在标准中定义的属性 ），会自动成为元素节点对象的属性。

但是需要注意的是：HTML 元素的属性名是**大小写不敏感**的，但是 JavaScript 对象的属性名是**大小写敏感**的。转换规则是，转为 JavaScript 属性名时，一律采用「小写」。如果属性名包括多个单词，则采用「小驼峰命名法」，即从第二个单词开始，每个单词的首字母采用大写，比如 `onClick`。

有些 HTML 属性名是 JavaScript 的保留字，转为 JavaScript 属性时，必须改名。主要是以下两个：

- `for` 属性改为 `htmlFor`。
- `class` 属性改为 `className`。

此外，HTML 属性值一般都是字符串，但是 JavaScript 属性会自动转换类型。比如，将字符串 `true` 转为布尔值，将 `onClick` 的值转为一个函数，将 `style` 属性的值转为一个 `CSSStyleDeclaration` 对象。

---

### dataset 属性

有时，需要在 HTML 元素上附加数据，供 JavaScript 脚本使用。一种解决方法是自定义属性：

```html
<div id="mydiv" foo="bar">
```

上面代码为 `div` 元素自定义了 `foo` 属性，然后可以用 `getAttribute()` 和 `setAttribute()` 读写这个属性。这种方法虽然可以达到目的，但是会使得 HTML 元素的属性不符合标准，导致网页的 HTML 代码通不过校验。更好的解决方法是，使用标准提供的 `data-*` 属性：

```html
<div id="mydiv" data-foo="bar">
```

然后，使用元素节点对象的 `dataset` 属性，它指向一个对象，可以用来操作 HTML 元素标签的 `data-*` 属性：

```javascript
var n = document.getElementById('mydiv')
n.dataset.foo // bar
n.dataset.foo = 'baz'
```

当然，除了 `dataset` 属性，也可以用 `getAttribute('data-foo')`、`removeAttribute('data-foo')`、`setAttribute('data-foo')`、`hasAttribute('data-foo')` 等方法操作 `data-*` 属性。

需要额外注意的一点是：`data-` 后面的属性名有限制，**只能包含**字母、数字、连词线（ - ）、点（ . ）、冒号（ : ）和下划线（ _ )。而且，属性名不应该使用**大写字母**，比如不能有 `data-helloWorld` 这样的属性名，而要写成 `data-hello-world`。

转成 `dataset` 的键名时，连词线后面如果跟着一个小写字母，那么连词线会被移除，该小写字母转为大写字母，其他字符不变。反过来，`dataset` 的键名转成属性名时，所有大写字母都会被转成「连词线 + 该字母的小写」形式，其他字符不变。比如，`dataset.helloWorld` 会转成 `data-hello-world`。

---

### 事件传播

当一个事件发生以后，它会在不同的 DOM 节点之间传播（ propagation ）。

这种传播分成三个阶段：

- 第一阶段：从 `window` 对象传导到目标节点，称为「捕获阶段」（ capture phase ）。

- 第二阶段：在目标节点上触发，称为「目标阶段」（ target phase ）。

- 第三阶段：从目标节点传导回 `window` 对象，称为「冒泡阶段」（ bubbling phase ）。

我们来举个栗子 🌰

假设现在有如下 HTML：

```html
<div>
  <p>Click Me</p>
</div>
```

有如下 JavaScript：

现在我们在 `div` 和 `p` 标签上都监听点击事件（ 包括捕获阶段 ）后，开始点击 `p` 标签（ 嵌套最深的节点 ）：

```javascript
var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
}

var div = document.querySelector('div')
var p = document.querySelector('p')

div.addEventListener('click', callback, true)
p.addEventListener('click', callback, true)
div.addEventListener('click', callback, false)
p.addEventListener('click', callback, false)

function callback(event) {
  var tag = event.currentTarget.tagName
  var phase = phases[event.eventPhase]
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'")
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'
```

阶段分析：

- **捕获阶段**：事件从 `<div>` 向 `<p>` 传播时，触发 `<div>` 的 **click** 事件；
- **目标阶段**：事件从 `<div>` 到达 `<p>` 时，触发 `<p>` 的 **click** 事件；
- **目标阶段**：事件离开 `<p>` 时，触发 `<p>` 的 **click** 事件；
- **冒泡阶段**：事件从 `<p>` 传回 `<div>` 时，再次触发 `<div>` 的 **click** 事件。

以为点击的是 `p` ，所以 `p` 标签显示的是 `target` 阶段。

**接下来说说「事件的代理」**

什么是事件的代理？

> 由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（ delegation ）。

比如，我现在需要监听 `ul` 下的 `li` 标签：

```javascript
var ul = document.querySelector('ul')

ul.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'li') {
    // some code
  }
})
```

上面代码的 **click** 事件的监听函数定义在 `<ul>` 节点，但是实际上，它处理的是子节点 `<li>` 的 **click** 事件。

这样做的好处是：只要定义一个监听函数，就能处理多个子节点的事件，而且以后再添加子节点，监听函数依然有效。

如果希望事件到某个节点为止，不再传播，可以使用事件对象的 `stopPropagation()` 和 `stopImmediatePropagation` 方法。

他们两者都是用来阻止事件在「冒泡阶段」到达对应节点后继续上升。

`stopPropagation()` 方法只会阻止当前监听函数的传播，不会阻止当前节点上的其他相同事件的监听函数。

`stopImmediatePropagation()` 阻止当前节点的所有相同事件的传播。

```javascript
/* stopPropagation */
p.addEventListener('click', function(event) {
  event.stopPropagation()
})
p.addEventListener('click', function(event) {
 // 会被触发
})

/* stopImmediatePropagation */
p.addEventListener('click', function(event) {
 event.stopImmediatePropagation()
})

p.addEventListener('click', function(event) {
 // 不会被触发
})
```

---

### 事件监听

DOM提供三种方法，可以用来为事件绑定监听函数：

1. **HTML 标签的 on- 属性**

    使用这个方法指定的监听函数，只会在「冒泡阶段」触发。

    注意，使用这种方法时，`on-` 属性的值是将会执行的代码，而不是一个函数。

    ```html
    <!-- 正确 -->
    <body onload="doSomething()">
    <div onclick="console.log('触发事件')">

    <!-- 错误 -->
    <body onload="doSomething">
    ```

2. **Element 节点的事件属性**

    ```javascript
    window.onload = doSomething

    div.onclick = function(event){
        console.log('触发事件')
    }
    ```

3. **addEventListener()**

    `addEventListener()` 接收三个参数

    - `type`：事件名称，大小写敏感。
    - `listener`：监听函数。事件发生时，会调用该监听函数。
    - `useCapture`：布尔值，表示监听函数是否在捕获阶段（ capture ）触发，默认为false（ 监听函数只在冒泡阶段被触发 ）。老式浏览器规定该参数必写，较新版本的浏览器允许该参数可选。为了保持兼容，建议总是写上该参数。

    ```javascript
    window.addEventListener('load', doSomething, false)
    ```


三种方法总结：

在上面三种方法中，第一种「HTML 标签的 `on-` 属性」，违反了 HTML 与 JavaScript 代码相分离的原则；第二种「Element 节点的事件属性」的缺点是，同一个事件只能定义一个监听函数，也就是说，如果定义两次 `onclick` 属性，后一次定义会覆盖前一次。因此，这两种方法都**不推荐使用**，除非是为了程序的兼容问题，因为所有浏览器都支持这两种方法。

`addEventListener` 是推荐的指定监听函数的方法。它有如下优点：

- 可以针对同一个事件，添加多个监听函数。

- 能够指定在哪个阶段（ 捕获阶段还是冒泡阶段 ）触发回监听函数。

- 除了 DOM 节点，还可以部署在 window、XMLHttpRequest 等对象上面，等于统一了整个 JavaScript 的监听函数接口。

---

### 监听事件的 this 对象的指向问题

`addEventListener` 方法指定的监听函数，内部的 `this` 对象总是指向触发事件的那个节点。

```html
<p id="para">Hello</p>
```

```javascript
var id = 'doc'
var para = document.getElementById('para')

function hello(){
  console.log(this.id)
}

para.addEventListener('click', hello, false)

// 相当于
para.onclick = hello
```

执行上面代码，点击 `<p>` 节点会输出 `para`。这是因为监听函数被「拷贝」成了节点的一个属性，所以 `this` 指向节点对象。使用下面的写法，会看得更清楚。

**但是：**

如果将监听函数部署在 `Element` 节点的 `on-` 属性上面，`this` 不会指向触发事件的元素节点：

```html
<p id="para" onclick="hello()">Hello</p>
<!-- 或者使用 JavaScript 代码  -->
<script>
  pElement.setAttribute('onclick', 'hello()')
</script>
```

执行上面代码，点击 `<p>` 节点会输出 `doc`。这是因为这里只是调用 `hello` 函数，而 `hello` 函数实际是在全局作用域执行，相当于下面的代码：

```javascript
para.onclick = function () {
  hello()
}
```

**总结一下**：

以下写法的 `this` 对象都指向 `Element` 节点：

```javascript
// JavaScript 代码
element.onclick = print
element.addEventListener('click', print, false)
element.onclick = function () {console.log(this.id)}

// HTML 代码
<element onclick="console.log(this.id)">
```

以下写法的 `this` 对象都指向全局对象：

```javascript
// JavaScript代码
element.onclick = function (){ doSomething() }
element.setAttribute('onclick', 'doSomething()')

// HTML代码
<element onclick="doSomething()">
```

---

### 事件的模拟

有时，需要在脚本中模拟触发某种类型的事件，这时就必须使用事件的构造函数。

下面是一个通过 `MouseEvent` 构造函数，模拟触发 `click` 鼠标事件的例子。

```javascript
var event = new MouseEvent('click', {
    'bubbles': true,
    'cancelable': true
})
var cb = document.getElementById('checkbox')
cb.dispatchEvent(event)
```