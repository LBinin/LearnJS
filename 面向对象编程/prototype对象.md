大部分面向对象的编程语言，都以「类」（ class ）为基础，实现对象的继承。

但 JavaScript 语言不是如此，它的对象继承以「原型对象」（ prototype ）为基础。

### prototype 概述

首先先抛出一个问题，构造函数有什么缺点？

我们知道 JavaScript 可以通过构造函数生成新对象。实例对象的属性和方法，可以定义在构造函数内部。

现在我们来看下面的例子：

```javascript
function Cat(name, color) {
  this.name = name
  this.color = color
  this.meow = function () {
    console.log('喵喵')
  }
}

var cat1 = new Cat('大毛', '白色')
var cat2 = new Cat('二毛', '黑色')

cat1.meow === cat2.meow // false
```

在上面代码中，`cat1` 和 `cat2` 是同一个构造函数的两个实例对象，它们都具有 `meow` 方法。由于 `meow` 方法是生成在每个实例对象上面，所以两个实例就生成了两次。

也就是说，每新建一个实例，就会新建一个 `meow` 方法。这既没有必要，又浪费系统资源，因为所有 `meow` 方法都是同样的行为，完全应该共享。

这就引出了这个问题的解决方法，就是 JavaScript 的原型对象（ prototype ），其本质为一个对象。

---

### prototype 属性的作用

JavaScript 的每个对象都继承自另一个对象，后者称为「原型」（ prototype ）对象。

任何一个对象，都可以充当其他对象的原型；由于原型对象也是对象，所以它也有自己的原型。

`null` 也可以充当原型，区别在于它没有自己的原型对象。

JavaScript 继承机制的设计就是：

> 原型的所有属性和方法，都能被子对象共享。

每一个构造函数都有一个 **prototype** 属性，这个属性会在生成实例对象的时候，成为实例对象的**原型对象**。

```javascript
function Animal(name) {
  this.name = name
}

Animal.prototype.color = 'white'

Animal.prototype.walk = function () {
  console.log(this.name + ' is walking')
}

var cat1 = new Animal('大毛')
var cat2 = new Animal('二毛')

cat1.color // 'white'
cat2.color // 'white'
cat1.walk() // 大毛 is walking
cat2.walk() // 二毛 is walking

/* 改变原型对象的属性 */
Animal.prototype.color = 'yellow'

cat1.color // "yellow"
cat2.color // "yellow"

/* 实例对象添加相关属性 */
cat1.color = 'black'

cat1.color // 'black'
cat2.color // 'yellow'
Animal.prototype.color // 'yellow'
```

上面代码中，构造函数 `Animal` 的 **prototype** 对象，就是实例对象 `cat1` 和 `cat2` 的原型对象。在原型对象上添加一个 `color` 属性，之后创建的所有实例对象都继承了该属性。

原型对象的属性不是实例对象独自拥有的属性。只要修改了**原型对象**，变动就立刻会体现在所有实例对象上。

实例对象本身没有 `color` 该属性，都是读取的原型对象上的属性。其实就是说，当实例对象本身没有某个属性或方法的时候，它会到构造函数的 **prototype** 属性指向的对象，去寻找该属性或方法；如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法。这就是原型对象的特殊之处。

**总结**：原型对象的作用，就是定义所有实例对象**共享**的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象。实际上所有函数都有 `prototype` 属性。

---

### 原型链

什么是原型链？

> 对象的属性和方法，有可能定义在自身，也有可能定义在它的原型对象。由于原型本身也是对象，又有自己的原型，所以形成了一条原型链（ prototype chain ）。比如，a对象是b对象的原型，b对象是c对象的原型，以此类推。

如果一层层地上溯，所有对象的原型最终都可以上溯到 `Object.prototype`，即 **Object** 构造函数的 `prototype` 属性。那么，`Object.prototype` 对象有没有它的原型呢？回答是有的，就是没有任何属性和方法的 `null` 对象，而 `null` 对象没有自己的原型。

```javascript
Object.getPrototypeOf(Object.prototype) // null
```

可以看到，`Object.prototype` 对象的原型是 `null`，由于 `null` 没有任何属性，所以原型链到此为止。

ok，现在可以知道，「原型链」的作用是：读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的**原型**去找，如果还是找不到，就到**原型的原型**去找。如果直到最顶层的 `Object.prototype` 还是找不到，则返回 `undefined`。

需要注意的是，一级级向上，在原型链寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链。

```javascript
var MyArray = function () {}

MyArray.prototype = new Array()

var mine = new MyArray()
mine.push(1, 2, 3)

mine.length // 3
mine instanceof Array // true
```

上面代码中，`mine` 是构造函数 `MyArray` 的实例对象，由于 `MyArray` 的 `prototype` 属性指向一个**数组实例**，使得其实例对象 `mine` 可以调用数组方法（ 这些方法定义在数组实例的 prototype 对象上面，MyArray 中找不到 `push` 方法，就会到其原型对象 —— **数组实例**中去寻找 ）。

`instanceof` 运算符用来比较一个对象是否为某个构造函数的实例，最后一行就表示 `mine` 为 `Array` 的实例。

---

### constructor 属性

`prototype` 对象有一个 `constructor` 属性，**默认**指向 `prototype` 对象所在的构造函数。

```javascript
function P() {}

P.prototype.constructor === P
// true
```

由于 `constructor` 属性定义在 `prototype` 对象上面，意味着可以被所有实例对象继承。

```javascript
function P() {}
var p = new P()

p.constructor // function P() {}

p.constructor === P.prototype.constructor // true

/* 实例对象自身是没有该属性的 */
p.hasOwnProperty('constructor') // false
```

`constructor` 属性的作用，是分辨原型对象到底属于哪个构造函数。
```javascript
function F() {}
var f = new F()

f.constructor === F // true
f.constructor === RegExp // false
```

有了constructor属性，就可以从实例新建另一个实例。

```javascript
function Constr() {}
var x = new Constr()

var y = new x.constructor()
y instanceof Constr // true
```

---

### instanceof 运算符

> **instanceof** 运算符返回一个**布尔值**，表示某个对象是否为指定的构造函数的实例。

**instanceof** 运算符的左边是实例对象，右边是构造函数。它会检查右边构建函数的原型对象（ prototype ），是否在左边对象的「原型链」上。

```javascript
var v = new Vehicle()
v instanceof Vehicle // true

// 等同于
Vehicle.prototype.isPrototypeOf(v)  // true
```

由于 **instanceof** 对整个原型链上的对象都有效，因此同一个实例对象，可能会对多个构造函数都返回 `true`。

```javascript
var d = new Date()
d instanceof Date // true
d instanceof Object // true
```

**instanceof** 的原理是检查原型链，对于那些不存在原型链的对象，就无法判断。

```javascript
typeof null // "object"
null instanceof Object // false
```

JavaScript 之中，只要是对象，就有对应的构造函数。因此，**instanceof** 运算符的一个用处，是判断值的类型。注意，**instanceof** 运算符只能用于对象，不适用原始类型的值。

```javascript
var x = [1, 2, 3]
var y = {}
var s = 'hello'
x instanceof Array // true
y instanceof Object // true
s instanceof String // false 字符串不是String对象的实例（因为字符串不是对象）
```

---

### Object.getPrototypeOf()

> 返回一个对象的原型。这是获取原型对象的标准方法。

```javascript
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true

// f 为 F 的实例对象，则 f 的原型是 F.prototype
var f = new F()
Object.getPrototypeOf(f) === F.prototype // true
```

---

### Object.setPrototypeOf()

> 为现有对象设置原型，返回一个新对象。

`Object.setPrototypeOf` 方法接受两个参数，第一个是现有对象，第二个是原型对象。

```javascript
var a = {x: 1}
var b = Object.setPrototypeOf({}, a)
// 等同于
// var b = {__proto__: a}

b.x // 1
```

上面代码中，`b` 对象是 `Object.setPrototypeOf` 方法返回的一个新对象：本身为空、原型为 `a` 的对象。所以 `b` 对象可以拿到 `a` 对象的所有属性和方法。`b` 对象本身并没有 `x` 属性，但是 JavaScript 引擎找到它的原型对象 `a`，然后读取 `a` 的 `x` 属性。

实际上，`new` 命令通过构造函数新建实例对象，实质就是将实例对象的原型，指向构造函数的 `prototype` 属性，然后在实例对象上执行构造函数。

---

### Object.create()

有时候，我们会遇到一个问题：当前只能拿到一个实例对象，它可能根本不是由构建函数生成的，那么能不能从一个实例对象，生成另一个实例对象呢？

```javascript
// 原型对象
var A = {
  print: function () {
    console.log('hello')
  }
}

// 实例对象
var B = Object.create(A)
B.print() // hello
B.print === A.print // true
B instanceof A // true
```

上面代码中l，我们可以通过 `Object.create` 方法以 **A** 对象为原型，生成了 **B** 对象。**B** 继承了 **A** 的所有属性和方法。

---

### Object.prototype.isPrototypeOf()

对象实例的 `isPrototypeOf` 方法

> 判断一个对象是否是另一个对象的原型。

```javascript
var o1 = {}
var o2 = Object.create(o1)
var o3 = Object.create(o2)

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true
```

---

### Object.prototype.__proto__

`__proto__` 属性（前后各两个下划线）可以改写某个对象的原型对象。

```javascript
var obj = {}
var p = {}

Object.getPrototypeOf(obj) === Object.prototype // true
obj.__proto__ = p
Object.getPrototypeOf(obj) === p // true
```

根据语言标准，`__proto__` 属性只有浏览器才需要部署，其他环境可以没有这个属性，而且前后的两根下划线，表示它本质是一个**内部属性**，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用 `Object.getPrototypeof()` （ 读取 ）和 `Object.setPrototypeOf()` （ 设置 ），进行原型对象的读写操作。