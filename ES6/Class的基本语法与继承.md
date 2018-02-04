### 简介

是否还记得，在 JavaScript 中生成实例对象的传统方法是通过构造函数。

```javascript
function Point(x, y) {
  this.x = x
  this.y = y
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')'
}

var p = new Point(1, 2)
```

不得不说，JavaScript 的面向对象编程方式和 **C** 或者 **JAVA** 有很大的出入，容易一头雾水。

在 ES6 中提供了更接近传统语言的写法，引入了 Class（ 类 ）这个概念，作为对象的模板。通过 `class` 关键字，可以定义类。

实际上，ES6 的 `class` 可以看作只是一个**语法糖**，它的绝大部分功能，ES5 都可以做到，新的 `class` 写法只是让对象原型的写法**更加清晰、更像面向对象编程**的语法而已。上面的代码用 ES6 的 `class` 改写，就是下面这样。

```javascript
//定义类
class Point {
  constructor(x, y) { // 构造方法
    this.x = x // this 表示实例对象
    this.y = y
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}
```

我们可以看到一些区别：

- ES5 中使用 `function Point(x, y) {}` 作为类的构造函数，对应 ES6 写法中 `class Point {}` 的 **Point** 类中的 `constructor` 作为构造函数。
- class 中可以直接使用「方法名 + 括号」的方式声明类中的方法，而不需要 `function` 关键字。
- class 中，在方法之间不需要逗号分隔，加了会报错。

实际上，在**类**中定义方法，和定义在**类**的 `prototype` 属性上是一样的，在类的实例上面调用方法，其实就是调用原型上的方法：

```javascript
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
}
```

另外需要注意的是：**类**的内部所有定义的方法，都是「不可枚举」的（ non-enumerable ）。这一点与 ES5 的行为不一致。

```javascript
/* ES6 */
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

/* ES5 */
var Point = function (x, y) {
  // ...
}

Point.prototype.toString = function() {
  // ...
}

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

还有一个比较实用的是：类的属性名，可以采用「表达式」。

```javascript
let methodName = 'getArea'

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

上面的表达式为什么用中括号括起来了呢？阮老师经常留下一些问题然后不解释让我们自己理解，想想就很吃鸡呀 😆

如果使用的是小括号，会报错 `SyntaxError: Unexpected token (`。

那为什么中括号就行呢？提示：数组。

因为数组中只有 `methodName` 一个变量，实际上就是 `['getArea'].toString()`。对就酱。

---

### constructor 方法

`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法。

一个类必须有 `constructor` 方法，如果没有显示添加该方法则会被默认添加一个空的 `constructor`。

`constructor` 方法默认返回实例对象（ 即 `return this` ）

---

### 类的实例对象

在实例对象中，除非显示声明实例对象的属性，即定义在 `this` 对象上，否则都是定义在**原型上**，即定义在 `class` 上。

```javascript
//定义类
class Point {

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }

}

var point = new Point(2, 3)

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

通过上面的代码，可以看到 `x` 和 `y` 都是定义在 `point` 实例上，而 `toString` 是被定义在原型对象上的属性。

---

### Class 表达式

与函数一样，类也可以使用**表达式**的形式定义：

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name
  }
}
```

上面使用表达式定义了一个类，需要注意的是：这个类的名字是 **MyClass** 而不是 **Me**，**Me** 只在 **Class** 的内部代码可用，指代**当前类**。

```javascript
let inst = new MyClass()
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

如果内部没有用到的话可以省略 `Me`，写成如下这样也是可以的：

```javascript
const MyClass = class {
  /* code */
}
```

利用表达式，可以写出**立即执行的类**：

```javascript
var person = new class {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }
}('小明')

person.sayName() // 小明
```

---

### 


---

### 切记

1. **类和模块**的内部，默认就是「严格模式」，所以不需要使用 `use strict` 指定运行模式。只要你的代码写在**类或模块**之中，就**只有**严格模式可用。

    考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。

2. 类必须使用 `new` 命令调用，否则报错。这也是与 ES5 中普通的构造函数的一个区别，后者可以不用通过 `new` 命令也能调用。

3. 不存在变量提升

    类不存在变量提升（ hoist ），这一点与 ES5 完全不同。

    举个例子：

    ```javascript
    new Foo() // ReferenceError
    class Foo {}
    ```

    因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与继承有关，必须保证子类在父类之后定义。
