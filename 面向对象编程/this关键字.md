### this 介绍

在 JavaScript 中，`this` 关键字是一个非常重要的语法点，阮老师在课上说过这么一句话

> 不理解它的含义，大部分开发任务都将无法完成。 —— 阮老师

简单来说，`this` 总是返回一个对象，这个对象是「当前」属性或方法所在的对象。比如：

```javascript
this.property // 这里的的 this 指的就是 property 所在的对象
```

由于对象的属性可以赋值给另一个对象，所以属性所在的当前对象是可变的，即 `this` 的指向是可变的。

```javascript
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name
  }
}

var B = {
  name: '李四'
}

B.describe = A.describe
B.describe()
// "姓名：李四"
```

上面代码中，`A.describe` 属性被赋给 **B**，于是 `B.describe` 就表示 **describe** 方法所在的当前对象是 **B**，所以在 **B** 中 `this.name` 就是指向 `B.name`。

等同于下面的代码：

```javascript
function f() {
  return '姓名：'+ this.name
}

var A = {
  name: '张三',
  describe: f
}

var B = {
  name: '李四',
  describe: f
}

A.describe() // "姓名：张三"
B.describe() // "姓名：李四"
```

所以，只要函数被**赋给另一个对象**（ 切记，是另一个**对象**，如果赋值给**变量**，是不会改变 this 指向的 ），函数中 `this` 的指向就会变。

在 JavaScript 语言之中「一切皆对象」，运行环境也是对象，所以函数都是在某个对象之中运行，`this` 就是这个对象（环境）。

这本来并不会让用户糊涂，但是 JavaScript 支持运行环境动态切换，也就是说，`this` 的指向是**动态**的，没有办法事先确定到底指向哪个对象，这才是最让初学者感到困惑的地方。

其实说到底，可以近似地认为：把 `this` 看做是所有函数运行时的一个**隐藏参数**，指向函数的运行环境。

---

### 使用场合

#### 1. 全局环境

> 不管是不是在函数内部，只要是在全局环境下运行，`this` 就是指顶层对象 **window**。

```javascript
this === window // true

function f() {
  console.log(this === window) // true
}
```

#### 2. 构造函数

> 构造函数中的 `this`，指的是实例对象。

```javascript
var Obj = function (p) {
  this.p = p
}

Obj.prototype.m = function() {
  return this.p
}

var o = new Obj('Hello World!')

o.p // "Hello World!"
o.m() // "Hello World!"
```

上面代码定义了一个构造函数 **Obj**。由于 `this` 指向实例对象，所以在构造函数内部定义 `this.p`，就相当于定义实例对象有一个 `p` 属性；然后该对象的 `m` 方法可以返回这个 `p` 属性。

#### 3. 对象的方法

当 **A** 对象的方法被赋予 **B** 对象，该方法中的 `this` 就从指向 **A** 对象变成了指向 **B** 对象。所以要特别小心，将某个对象的方法赋值给另一个对象，会改变 `this` 的指向。

```javascript
var obj ={
  name: 'JS',
  foo: function () {
    console.log('Hello ' + this.name)
  }
}
var name = 'World'

/* obj.foo 方法执行时，它内部的 this 指向 obj */
obj.foo() // Hello JS
```

只有直接在 **obj** 对象上调用 `foo` 方法的情况下，`this` 指向 **obj**；其他用法时， `this` 都指向代码块当前所在对象（ 浏览器为 `window` 对象 ）。

```javascript
// 情况一
(obj.foo = obj.foo)() // Hello World
// 等同于
(function () {
  console.log('Hello ' + this.name)
})()

// 情况二
(false || obj.foo)() // Hello World
// 等同于
(false || function () {
  console.log('Hello ' + this.name)
})()

// 情况三
(1, obj.foo)() // Hello World
// 等同于
(1, function () {
  console.log('Hello ' + this.name)
})()
```

上面代码中，将 `obj.foo` 先进行运算（ 放在表达式中 ）再执行，即使值根本没有变化，`this` 也不再指向 `obj` 了。这是因为这时它就脱离了运行环境 `obj`，而是在全局环境执行，即 `this` 指向全局对象。

可以这样理解，在 JavaScript 引擎内部，`obj` 和 `obj.foo` 储存在两个内存地址，简称为 **M1** 和 **M2**。只有 `obj.foo()` 这样调用时，是从 **M1** 调用 **M2** ，因此 `this` 指向 `obj`。但是，上面三种情况，都是直接从全局环境中取出 **M2** 进行运算，然后就在全局环境执行运算结果（还是 **M2** ），因此 `this` 指向全局环境。

如果某个方法位于**多层对象**的内部，这时 `this` 只是指向当前一层的对象，而不会继承上层对象。

```javascript
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p)
    }
  }
}

a.b.m() // undefined

// 等同于

var b = {
  m: function() {
   console.log(this.p)
  }
}

var a = {
  p: 'Hello',
  b: b
}

(a.b).m() // 等同于 b.m()
```

`a.b.m` 方法在a对象的第二层，该方法内部的 `this` 不是指向 **a**，而是指向 `a.b`。

总而言之，注意对象所在的运行环境，因为 `this` 是的指向是动态变化，所以使用的时候务必小心。

---

### 注意点

#### 1. 避免多层 this

```javascript
var o = {
  f1: function () {
    console.log(this)
    var f2 = function () {
      console.log(this)
    }()
  }
}

o.f1()
// Object
// Window

// 等同于
var temp = function () {
  console.log(this)
}

var o = {
  f1: function () {
    console.log(this)
    var f2 = temp()
  }
}
```

可以声明一个新的变量来存储 `this` 值以便调用来解决问题（ 这是非常常见的做法，有大量应用 ）。

```javascript
var o = {
  f1: function() {
    console.log(this)
    var that = this
    var f2 = function() {
      console.log(that)
    }()
  }
}

o.f1()
// Object
// Object
```

当然，JavaScript 提供了「严格模式」，也可以硬性避免这种问题。在严格模式下，如果函数内部的 `this` 指向顶层对象，就会报错。

```javascript
var counter = {
  count: 0
}
counter.inc = function () {
  'use strict'
  this.count++
}
var f = counter.inc
f()
// TypeError: Cannot read property 'count' of undefined
```

#### 2. 避免数组处理方法中的this

数组的 `map` 和 `foreach` 方法，允许提供一个函数作为**参数**。这个函数内部不应该使用 `this`。

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item)
    })
  }
}

o.f()
// undefined a1
// undefined a2

// 等同于
var temp = function (item) {
  console.log(this.v + ' ' + item)
}
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(temp)
  }
}
```

`foreach` 方法的**回调函数中**的 `this`，其实是指向 `window` 对象（ 因为原 this 指向没有改变 ）。

可以使用声明一个中间变量来解决这种问题。

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    var that = this
    this.p.forEach(function (item) {
      console.log(that.v + ' ' + item)
    })
  }
}
```

还有一种方法就是将 `this` 当作 `foreach` 方法的第二个参数，固定它运行的上下文环境。

参考资料：[Array.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)，例子：

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item)
    }, this)
  }
}

o.f()
// hello a1
// hello a2
```

#### 3. 避免回调函数中的 this

回调函数中的 `this` 往往会改变指向，最好避免使用。

```javascript
var o = new Object()

o.f = function () {
  console.log(this === o)
}

o.f() // true

$('#button').on('click', o.f)
$('#button').trigger("click") // false
```

上面两次输出值不同的原因是：当 `o.f` 方法被绑定到按钮上的时候，此时 `this` 不再指向 **o** 对象，而是指向按钮的 DOM 对象，因为 **f** 方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误。

为了解决这种问题，可以采用下面的一些方法对 `this` 进行绑定，也就是使 `this` 固定指向某个对象，以减少不确定性。

---

### 绑定 this 的方法