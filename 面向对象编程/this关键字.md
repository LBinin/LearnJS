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

上面两次输出值不同的原因是：当 `o.f` 方法被绑定到按钮上的时候，此时 `this` 不再指向 **o** 对象，而是指向按钮的 DOM 对象，因为 **f** 方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误，此例解决方法 [绑定回调函数的对象](#bindCallbackObject)。

为了解决这种问题，可以采用下面的一些方法对 `this` 进行绑定，也就是使 `this` 固定指向某个对象，以减少不确定性。

---

### 绑定 **this** 的方法

`this` 的动态切换，固然为 JavaScript 创造了巨大的灵活性，但也使得编程变得困难和模糊。

有时，需要固定 `this` 指向的对象，以避免出现意想不到的情况。

JavaScript 提供了 `call()`、`apply()`、`bind()` 这三个方法，来切换 / 固定 `this` 的指向。

#### 1. function.prototype.call()

```javascript
var obj = {}

var f = function () {
  return this
}

f() === this // true
f.call(obj) === obj // true
```

「函数实例」的 `call` 方法，可以指定函数内部 `this` 的指向（ 即函数执行时所在的作用域 ），然后在所指定的作用域中，调用该函数。

如果 `call` 方法传入的参数为「空」或者为 `undefined`、`null` 的时候，则函数默认调用全局对象。

```javascript
var n = 123
var obj = { n: 456 }

function a() {
  console.log(this.n)
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

如果 `call` 方法传入的参数为原始类型，那么该参数将被自动包装成对应类型的包装对象，然后传入 `call` 方法。

```javascript
var f = function () {
  return this
}

f.call(5)
// 5 将被 Number 包装成对象
// Number {[[PrimitiveValue]]: 5}
```

此外，`call` 方法还允许接收多个参数，第一个参数表示函数执行的上下文环境（ 即 `this` 的指向 ），后面便是需要传入函数的参数。

```javascript
var obj = {
  a: 3,
  b: 4
}
function add(x, y) {
  return (this.a + this.b) * (x + y)
}

add.call(obj, 2, 3) // 35
```

#### 2. function.prototype.apply()

`apply()` 方法的作用与 `call()` 方法类似，也是改变 `this` 指向，然后再调用该函数。唯一的区别就是，它接收一个「数组」作为函数执行时的参数。

```javascript
var obj = {
  a: 3,
  b: 4
}
function add(x, y) {
  return (this.a + this.b) * (x + y)
}

add.call(obj, 2, 3) // 35
add.apply(obj, [2, 3]) // 35
```

上面的 **add** 函数本来接受两个参数，使用 `apply()` 方法以后，就变成可以接受一个「数组」作为参数。

利用这一点，可以做一些有趣的应用~

1. 找出数组最大元素

    结合使用 `apply()` 方法和 `Math.max()` 方法，就可以返回数组的最大元素。

    原本的 `Math.max()` 函数是接受一组数值，返回这组数值中最大的数，但是不能传入数组。

    ```javascript
    var a = [10, 2, 4, 15, 9]

    Math.max(a) // NaN
    Math.max(10, 2, 4, 15, 9) // 15
    ```

    但是，使用 `Math.max()` 函数的 `apply()` 方法就可以传入一个数组啦~

    ```javascript
    var a = [10, 2, 4, 15, 9]

    Math.max.apply(null, a) // 15
    ```

2. 将数组的空元素变为 `undefined`

    ```javascript
    Array.apply(null, ["a",,"b"])
    // [ 'a', undefined, 'b' ]
    ```

    数组的「空元素」与 `undefined` 的区别在之前的「 [数组 / 空位需要注意的几点](https://github.com/LBinin/LearnJS/blob/master/%E8%AF%AD%E6%B3%95/%E6%95%B0%E7%BB%84.md#%E7%A9%BA%E4%BD%8D%E9%9C%80%E8%A6%81%E6%B3%A8%E6%84%8F%E7%9A%84%E5%87%A0%E7%82%B9) 」中提到过，就是数组的 `forEach` 方法、`for...in` 结构、以及 `Object.keys` 方法，都会跳过空元素，但是不会跳过 `undefined`。因此，遍历内部元素的时候，会得到不同的结果。

    ```javascript
    var a = ['a', , 'b']

    function print(i) {
    console.log(i)
    }

    a.forEach(print)
    // a
    // b

    Array.apply(null, a).forEach(print)
    // a
    // undefined
    // b
    ```

3. 将「 [类数组对象](https://github.com/LBinin/LearnJS/blob/master/%E8%AF%AD%E6%B3%95/%E6%95%B0%E7%BB%84.md#%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1) 」转换为数组。

    ```javascript
    var arr = Array.prototype.slice.call(arrayLike)
    var arr = Array.prototype.slice.apply(arrayLike)
    ```

<div id="bindCallbackObject"></div>

4. 绑定回调函数的对象

    ```javascript
    var o = new Object()

    o.f = function () {
    console.log(this === o)
    }

    var f = function (){
    o.f.apply(o)
    // 或者 o.f.call(o)
    }

    $('#button').on('click', f)
    $('#button').trigger('click') // true
    ```

---

由于 `apply()` 方法（ 或者 `call()` 方法 ）不仅绑定函数执行时所在的对象，还会立即执行函数，因此不得不把绑定语句写在一个函数体内。更简洁的写法是采用下面介绍的 `bind()` 方法。

#### 3. function.prototype.bind()

> `bind` 方法用于将函数体内的 `this` 绑定到某个对象，然后返回一个「新函数」。

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++
  }
}

var func = counter.inc
func()
counter.count // 0
count // NaN
```

上面代码中，函数 `func` 是在全局环境中运行的，这时 `inc` 内部的 `this` 指向顶层对象 `window`，所以 `counter.count` 是不会变的，反而创建了一个全局变量 `count`。因为 `window.count` 原来等于 `undefined`，进行递增运算后 `undefined++` 就等于 `NaN`。

```javascript
var func = counter.inc.bind(counter)
func()
counter.count // 1
```

`bind` 方法将 `inc` 方法绑定到 `counter` 以后，再运行 `func` 就会得到正确结果

如果 `bind` 方法的第一个参数是 **null** 或 **undefined**，等于将 `this` 绑定到全局对象，函数运行时 `this` 指向顶层对象（ 在浏览器中为 `window` ）。

`bind` 比 `call` 方法和 `apply` 方法更进一步的是，除了绑定 `this` 以外，还可以绑定「原函数的参数」。

```javascript
var add = function (x, y) {
  return x * this.m + y * this.n
}

var obj = {
  m: 2,
  n: 2
}

var newAdd = add.bind(obj, 5) // 绑定 this 和 x 的值

/* 现在 newAdd 只需要传入一个参数 y 的值 */
newAdd(5) // 20
newAdd(6) // 22
```

`bind` 函数的几个注意点：

1. 每绑定一次，就返回一个「新函数」

    前面利用 `bind` 方法绑定对象以解决 DOM 对象监听时间的回调函数的 `this` 指向问题是在 JavaScript 中调用 `f` 函数，在其中进行的对象绑定。但是**不能**在 DOM 监听事件的回调函数上绑定，如下：

    ```javascript
    element.addEventListener('click', o.m.bind(o))
    ```

    因为 `bind` 方法返回的是一个**新生成的一个匿名函数**。

    所以如果需要移除监听事件的回调函数的话，是行不通的。

    ```javascript
    /* 行不通 */
    element.removeEventListener('click', o.m.bind(o))
    ```

    正确的写法应该是将生成的匿名函数储存在变量中：
    
    ```javascript
    var listener = o.m.bind(o)
    element.addEventListener('click', listener)
    //  ...
    element.removeEventListener('click', listener)
    ```

2. 结合回调函数使用

    ```javascript
    var obj = {
      name: '张三',
      times: [1, 2, 3],
      print: function () {
        this.times.forEach(function (n) {
          console.log(this.name + ' ' + n)
        })
      }
    }

    obj.print()
    // undefined 1
    // undefined 2
    // undefined 3
    ```

    `obj.print` 内部 `this.times` 的 `this` 是指向 `obj` 的，但是，`forEach` 方法的回调函数内部的 `this.name` 却是指向「全局对象」，导致没有办法取到值。

    可以通过 `bind` 方法绑定 `this` 解决这个问题

    ```javascript
    obj.print = function () {
      this.times.forEach(function (n) {
        console.log(this.name + ' ' + n)
      }.bind(this))
    }

    // 或者

    obj.print = function () {
      this.times.forEach(function (n) {
        console.log(this.name + ' ' + n)
      }, this)
    }
    ```

3. 结合 call 方法使用

    首先，先引用之前的一个例子，「将类数组对象转换为数组」使用的是 **Array** 对象的 `slice()` 方法，使用其对应的 `call()` 方法传入一个参数以改变函数运行时的上下文环境。

    ```javascript
    [1, 2, 3].slice(0, 1) // [1]

    // 等同于

    Array.prototype.slice.call([1, 2, 3], 0, 1)
    ```

    `call` 方法实质上，是调用 `Function.prototype.call` 方法，因此上面的表达式可以用 `bind` 方法改写，如下代码所示：

    ```javascript
    var slice = Function.prototype.call.bind(Array.prototype.slice)

    slice([1, 2, 3], 0, 1) // [1]

    // 如果数组固定，可以等同于下面代码

    var slice = Array.prototype.slice.bind([1, 2, 3])
    slice(0, 2)
    // 或
    var slice = Function.prototype.call.bind(Array.prototype.slice, [1, 2, 3])
    slice(0, 1) // [1]
    ```

    **解析**：
    
    1. 首先 `Function.prototype.call` 将接收的第一个参数作为函数执行时候的上下文环境，也就是具体的函数。
    2. 其次用 `bind` 方法绑定对象，传入参数 `Array.prototype.slice` 相当于内部的 `this` 指向该函数。
    3. 最后，因为之前说过，每绑定一次就会生成一个匿名函数并返回，然后这个返回的函数被赋值给了变量 `slice`，该变量中的函数（ `Array.prototype.slice` ）等待接收的参数，也就是原来的 `Array.prototype.slice` 函数等待接收的参数。

    之所以要用到 `bind()` 方法，是为了能够返回一个匿名函数储存在变量内，方便之后调用。

    同样的，利用 `bind` 方法，还可以用于其他数组方法：

    ```javascript
    var push = Function.prototype.call.bind(Array.prototype.push)
    var pop = Function.prototype.call.bind(Array.prototype.pop)

    var a = [1 ,2 ,3]
    push(a, 4)
    a // [1, 2, 3, 4]

    pop(a)
    a // [1, 2, 3]
    ```