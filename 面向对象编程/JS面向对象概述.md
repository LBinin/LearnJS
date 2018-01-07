至于什么是面向对象，不是笔记的主要内容，这里就不做相应记录了，咱们直接进入正题~

### 构造函数

大家都知道，面向对象编程的第一步，就是要生成对象。

典型的面向对象编程语言（ 比如 **C++** 和 **Java** ），存在「类」（ class ）这个概念，对象就是「类」的实例。但是，JavaScript 语言的对象体系，不是基于「类」的，而是基于构造函数（ constructor ）和原型链（ prototype ）。

JavaScript 语言使用构造函数（ constructor ）作为「类」。所谓「构造函数」，就是专门用来生成对象的函数。它提供模板，描述对象的基本结构。一个构造函数，可以生成多个对象，这些对象都有相同的结构。

构造函数的写法就是一个**普通的函数**，但是有自己的特征和用法。

```javascript
var Vehicle = function () {
  this.price = 1000
}
```

上面代码中，**Vehicle** 就是构造函数，它提供模板，用来**生成实例对象**。为了与普通函数区别，一般构造函数名字的第一个字母通常**大写**。

构造函数的特点有两个：

1. 函数体内部使用了 **this** 关键字，指向了所生成的对象实例。
2. 生成对象的时候，必需用 **new** 命令，调用构造函数。

### **new** 命令

> 执行构造函数，返回一个**实例对象**。

`new` 命令执行时，构造函数内部的 **this**，就代表了新创建的实例对象

`new` 命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号

```javascript
var v = new Vehicle()
// 等同于
var v = new Vehicle
```

如果忘了使用 **new** 命令，构造函数就变成了普通函数，并不会生成实例对象，并且函数中的 `this` 这时代表**全局对象**

```javascript
var Vehicle = function (){
  this.price = 1000
}

var v = Vehicle()
v.price
// Uncaught TypeError: Cannot read property 'price' of undefined
// 因为并没有生成对应的实例对象，使得变量 v 变成了 undefined。

price
// 1000
// 意味这时候声明的一个全局变量
```

当然，这种问题也有解决办法：

1. 为了保证构造函数必须与 **new** 命令一起使用，在构造函数内部使用「严格模式」，即第一行加上 `use strict`。

    ```javascript
    function Fubar(foo, bar){
      'use strict'
      this._foo = foo
      this._bar = bar
    }

    Fubar()
    // TypeError: Cannot set property '_foo' of undefined
    ```

    上面代码的 **Fubar** 为构造函数，`use strict` 命令保证了**该函数在严格模式下运行**。由于在严格模式中，函数内部的 **this** 不能指向全局对象，默认等于 `undefined`，导致不加 **new** 调用会报错（ JavaScript 不允许对undefined添加属性 ）。

2. 第二种解决办法，就是在函数内部判断是否使用了 **new** 命令（ 即判断函数的 **this** 值是否是当前构造函数的对象 ），如果发现没有使用 **new** 命令，就返回一个当前构造函数的实例对象。

    ```javascript
    function Fubar(foo, bar) {
      if (!(this instanceof Fubar)) {
        return new Fubar(foo, bar)
      }

      this._foo = foo
      this._bar = bar
    }

    /* 不管加不加 new 命令，都会得到同样的结果 */
    Fubar(1, 2)._foo // 1
    (new Fubar(1, 2))._foo // 1
    ```

3. 当然，还有另外一种方法，见下方的 [new.target](#2-new.target)。

#### 1. **new** 原理

说了上面有关 **new** 命令的使用和需要注意的问题后，接下来就理解一下 **new** 的原理，做到知其然知其所以然。

使用 new 命令时，紧跟其后的参数，也就是后面的函数，这是它的调用是不正常的调用，而是依次执行下面的步骤：

1. 创建一个「空对象」，作为**将要返回**的对象实例；
1. 将这个空对象的原型，指向该「构造函数」的 **prototype** 属性；
1. 将这个空对象赋值给「函数内部」的 **this** 关键字；
1. 开始执行构造函数内部的代码。

也就是说，在构造函数内部，`this` 其实指的是一个**新生成的空对象**，所有针对 `this` 的操作，都会发生在这个空对象上。构造函数之所以叫「构造函数」，就是说这个函数的目的，其实就是操作一个空对象（即 `this` 对象），将其「构造」为需要的样子。

**如果**构造函数内部有 **return** 语句，而且 **return** 后面跟着一个「对象」，**new** 命令会返回 **return** 语句指定的对象，并且返回的对象不会在该构造函数的原型链上（ **instanceof** 运算符返回 `false` ）；否则，就会不管 **return** 语句，返回 **this** 对象。

```javascript
var Vehicle = function () {
  this.price = 1000
  return 1000
}
var Vehicle2 = function () {
  this.price = 1000
  return {type: 'jeep'}
}

var a = new Vehicle()
var b = new Vehicle2()

a === 1000 // false
a // Vehicle {price: 1000}

b instanceof Vehicle2 // false
b // {type: "jeep"}
```

还有一个需要注意的是，如果对「普通函数」（ 即内部没有 **this** 关键字的函数，并且返回值不是对象 ）使用 **new** 命令，则 **new** 命令会忽略了 **return** 语句，会返回一个「空对象」。

```javascript
function getMessage() {
  return 'this is a message'
}

var msg = new getMessage()

msg // {}
typeof msg // "object"
```

下面是代码表示的是 **new** 命令简化后的内部流程：

```javascript
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ param1) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments)
  // 取出构造函数
  var constructor = args.shift()
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype)
  // 执行构造函数
  var result = constructor.apply(context, args)
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context
}

// 实例
var actor = _new(Person, '张三', 28)
```

#### 2. new.target

> 函数内部可以使用 `new.target` 属性。如果当前函数是 **new** 命令调用，`new.target` 指向当前函数，否则为 `undefined`。

```javascript
function f() {
  console.log(new.target === f)
}

f() // false
new f() // true
```

使用这个属性，可以判断函数调用的时候，是否使用 **new** 命令。

```javascript
function f() {
  if (!new.target) {
    throw new Error('请使用 new 命令调用！')
  }
  // ...
}

f() // Uncaught Error: 请使用 new 命令调用！
```

### 使用 **Object.create()** 创建实例对象

现在，我们知道通过「构造函数」作为模板，可以生成**实例对象**。但是，有时只能拿到实例对象，而该对象根本就不是由构造函数生成的，这时可以使用Object.create()方法，直接**以某个实例对象作为模板**，生成一个新的实例对象。

```javascript
var person1 = {
  name: '张三',
  age: 38,
  greeting: function() {
    console.log('Hi! I\'m ' + this.name + '.')
  }
}

var person2 = Object.create(person1)

person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

有关 `Object.create()` 方法详见 [prototype对象 / Object.create](#)