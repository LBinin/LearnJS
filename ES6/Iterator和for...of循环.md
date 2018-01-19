### Iterator（ 遍历器 ）

**概念**

> JavaScript 原有的表示「集合」的数据结构，主要是数组（ Array ）和对象（ Object ），ES6 又添加了 Map 和 Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是 Map，Map 的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。
> 
> 遍历器（ Iterator ）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：

1. 一是为各种数据结构，提供一个统一的、简便的访问接口；
2. 二是使得数据结构的成员能够按某种次序排列；
3. 三是 ES6 创造了一种新的遍历命令 `for...of` 循环，Iterator 接口主要供 `for...of` 消费。

Iterator 的遍历过程：

1. 创建一个「指针对象」，指向当前数据结构的**起始位置**。也就是说，遍历器对象本质上，就是一个「指针对象」。
1. 第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。
1. 第二次调用指针对象的 `next` 方法，指针就指向数据结构的第二个成员。
1. 不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置。

```javascript
var it = makeIterator(['a', 'b'])

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true}
    }
  }
}
```

每一次调用 `next` 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 `value` 和 `done` 两个属性的对象。其中，`value` 属性是当前成员的值，`done` 属性是一个布尔值，表示遍历是否结束。

对于遍历器对象来说，`done: false` 和 `value: undefined` 属性都是可以省略的，因此上面的 makeIterator 函数可以简写成下面的形式：

```javascript
function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++]} :
        {done: true}
    }
  }
}
```

由于 Iterator 只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说用遍历器对象模拟出数据结构。

下面是一个无限运行的遍历器对象的例子：

```javascript
var it = idMaker()

it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...

function idMaker() {
  var index = 0

  return {
    next: function() {
      return {value: index++, done: false}
    }
  }
}
```

---

### 默认 Iterator 接口

Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即 `for...of` 循环（详见下文）。当使用 `for...of` 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是「可遍历的」（ iterable ）。

ES6 规定，默认的 Iterator 接口部署在数据结构的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是「可遍历的」（ iterable ）。

`Symbol.iterator` 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名 `Symbol.iterator`，它是一个表达式，返回 Symbol 对象的 iterator 属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。

```javascript
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        }
      }
    }
  }
}
```

上面代码中，对象 `obj` 是可遍历的（ iterable ），因为具有 `Symbol.iterator` 属性（ 相当于已经部署了 Iterator 接口 ）。执行这个属性，会返回一个「遍历器对象」。

「遍历器对象」的**根本特征**是：具有 `next` 方法。每次调用 `next` 方法，都会返回一个代表当前成员的**信息**的对象，具有 `value` 和 `done` 两个属性。

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被 `for...of` 循环遍历。因为这些数据结构原生部署了 `Symbol.iterator` 属性（ 详见下文 ），另外一些数据结构没有（ 比如对象 ）。凡是部署了 `Symbol.iterator` 属性的数据结构，就称为**部署了遍历器接口**。调用这个接口，就会返回一个**遍历器对象**。

---

JavaScript 原生就具备 Iterator 接口的数据结构有：

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

下面的例子是数组的 `Symbol.iterator` 属性：

```javascript
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]()

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

对象（ Object ）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种**线性处理**，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。

一个对象如果要具备可被 `for...of` 循环调用的 Iterator 接口，就必须在 `Symbol.iterator` 的属性上部署遍历器生成方法（ 原型链上的对象具有该方法也可以 ）。

```javascript
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() { return this }

  next() {
    var value = this.value
    if (value < this.stop) {
      this.value++
      return {done: false, value: value}
    }
    return {done: true, value: undefined}
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

for (var value of range(0, 3)) {
  console.log(value) // 0, 1, 2
}
```

下面我们来举个栗子 🌰 ，为对象添加 Iterator 接口：

```javascript
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this
    let index = 0
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}
```

对于「类数组对象」（ 存在数值键名和 `length` 属性 ），部署 Iterator 接口，有一个简便方法，就是 `Symbol.iterator` 方法直接引用数组的 Iterator 接口：

```javascript
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]

[...document.querySelectorAll('div')] // 可以执行了
```

---

### 调用 Iterator 接口的场合

接下来举例几个会默认调用 Iterator 接口的场合：

#### 1. 解构赋值

> 对数组和 Set 结构进行解构赋值时，会默认调用 `Symbol.iterator` 方法。

```javascript
let set = new Set().add('a').add('b').add('c')

let [x,y] = set
// x='a' y='b'

let [first, ...rest] = set
// first='a' rest=['b','c']
```

#### 2. 扩展运算符

> 扩展运算符（ `...` ）也会调用默认的 Iterator 接口。

```javascript
// 例一
var str = 'hello'
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c']
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组：

```javascript
let arr = [...iterable]
```

所以上面的字符串之所以能够被用扩展运算符（ `...` ）转换成数组，也是因为 `String.prototype` 上部署了 Iterator 接口。

#### 3. yield*

`yield*` 后面跟的是一个可遍历的结构（ 详见 Generator ），它会调用该结构的遍历器接口：

```javascript
let generator = function* () {
  yield 1
  yield* [2,3,4]
  yield 5
}

var iterator = generator()

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

#### 4. 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组**作为参数**的场合，其实都调用了「遍历器接口」。下面是一些例子：

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
- Promise.all()
- Promise.race()

---

### 字符串的 Iterator 接口

字符串是一个「类数组对象」，也原生具有 Iterator 接口：

```javascript
var someString = "hi"
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]()

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

---

### for...of 循环

一个数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 iterator 接口，就可以用 `for...of` 循环遍历它的成员。也就是说，`for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法。

`for...of` 循环可以使用的范围包括**数组**、**Set** 和 **Map** 结构、某些类数组对象（ 比如 arguments 对象、DOM NodeList 对象 ）、Generator 对象，以及字符串。

#### 数组

需要注意的一个是：

`for...of` 循环调用遍历器接口，数组的遍历器接口只返回**具有数字索引**的属性。这一点跟 `for...in` 循环也不一样：

```javascript
let arr = [3, 5, 7]
arr.foo = 'hello'

for (let i in arr) {
  console.log(i) // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i) //  "3", "5", "7"
}
```

---

### Set 和 Map 结构

Set 和 Map 结构也原生具有 Iterator 接口，可以直接使用 `for...of` 循环。

```javascript
let map = new Map().set('a', 1).set('b', 2)
for (let pair of map) {
  console.log(pair)
}
// ['a', 1]
// ['b', 2]

for (let [key, value] of map) {
  console.log(key + ' : ' + value)
}
// a : 1
// b : 2
```

---

### 与其他遍历语法的比较

以数组为例，JavaScript 提供多种遍历语法。最原始的写法就是 `for` 循环：

```javascript
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index])
}
```

这种写法比较麻烦，因此数组提供内置的 `forEach` 方法：

```javascript
myArray.forEach(function (value) {
  console.log(value)
})
```

然鹅，这种写法的问题在于，无法中途跳出 `forEach` 循环，`break` 命令或 `return` 命令都不能奏效。

`for...in` 循环可以遍历数组的键名：

```javascript
for (var index in myArray) {
  console.log(myArray[index])
}
```

但是，`for...in` 循环有几个缺点：

- 数组的键名虽然都是数字，但是 `for...in` 循环是以**字符串**作为键名 `"1"`、`"2"`、`"3"` 等等。
- `for...in` 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
- 某些情况下，`for...in` 循环会以**任意顺序**遍历键名。

总之，`for...in` 循环主要是为遍历对象而设计的，**不适用于遍历数组**。

`for...of` 循环相比上面几种做法，有一些显著的优点：

- 有着同 `for...in` 一样的简洁语法，但是没有 `for...in` 那些缺点。
- 不同于 `forEach` 方法，它可以与 `break`、`continue` 和 `return` 配合使用。
- 提供了遍历所有数据结构的统一操作接口。

下面是一个使用 break 语句，跳出for...of循环的例子。

```javascript
for (var n of fibonacci) {
  if (n > 1000)
    break;
  console.log(n)
}
```

上面的例子，会输出斐波纳契数列小于等于 1000 的项。如果当前项大于 1000，就会使用break语句跳出for...of循环。