### Symbol

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（ mixin 模式 ），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入 Symbol 的原因。

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（ Boolean ）、字符串（ String ）、数值（ Number ）、对象（ Object ）。

Symbol 值通过 `Symbol()` 函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的「字符串」，另一种就是新增的「Symbol 类型」。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

```javascript
let s = Symbol()

typeof s // "symbol"
```

注意，Symbol 函数前不能使用 `new` 命令，否则会报错。这是因为生成的 Symbol 是一个「原始类型」的值，**不是对象**。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种**类似于字符串的数据类型**。

Symbol 函数可以接受一个**字符串**作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

如果 Symbol 的参数是一个对象，就会调用该对象的 `toString()` 方法，将其转为字符串，然后才生成一个 Symbol 值。

注意，Symbol 函数的参数**只**是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的：

```javascript
let s1 = Symbol()
let s2 = Symbol()

s1 === s2 // false
```

Symbol 值不能与其他类型的值进行运算，会报错：

```javascript
let sym = Symbol('My symbol')

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

---

### 作为属性名的 Symbol

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的「属性名」，就能保证不会出现**同名的属性**。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

Symbol 作为属性名称提供三种写法：

```javascript
let mySymbol = Symbol()
let a = {}

// 第一种写法
a[mySymbol] = 'Hello!'

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
}

// 第三种写法
let a = {}
Object.defineProperty(a, mySymbol, { value: 'Hello!' })

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

也就是说，除了 `Object.defineProperty()` 方法以外，将对象的属性名指定为一个 Symbol 值必须使用「方括号」结构；同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值也必须放在方括号之中。

**!!! 注意**，Symbol 值作为对象属性名时，不能用点运算符，因为点运算符后面总是「字符串」，所以不会读取该 Symbol 值作为标识名所指代的那个值，导致对象的属性名实际上是一个「以 Symbol 变量名为内容的字符串」，而不是一个 Symbol 值。

Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。（ 相当于 Swift 中的枚举类型 ）

来，咱们来举个栗子 🌰

**在说这个栗子之前，我们先来说一下什么是「魔术字符串」**

魔术字符串指的是：在代码之中**多次出现**、与代码形成**强耦合**的某一个**具体的**字符串或者数值。

所以我们要行程风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替，下面是栗子：

```javascript
function getArea(shape, options) {
  let area = 0

  switch (shape) {
    case 'Triangle': // 魔术字符串
      area = .5 * options.width * options.height
      break
    /* ... more code ... */
  }

  return area
}

getArea('Triangle', { width: 100, height: 100 }) // 魔术字符串
```

上面代码中，字符串 `Triangle` 就是一个「魔术字符串」。它多次出现，与代码形成**强耦合**，不利于将来的修改和维护。

所以，我们需要把魔术字符串给消除，方法就是把它写成一个变量：

```javascript
const shapeType = {
  triangle: 'Triangle'
}

function getArea(shape, options) {
  let area = 0
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height
      break
  }
  return area
}

getArea(shapeType.triangle, { width: 100, height: 100 })
```

这样我们相当于就可以通过统一管理 `shapeType` 来控制以达到解耦的要求。

不过，我们又会发现一些问题，如果我是还是直接传的字符串 `Triangle` 也能达到效果，而且，实际上我只需要这个属性，而并不需要它究竟指代的是什么字符串。

这时候，我们就可以使用 **Symbol** 值来实现我们的目的：

```javascript
const shapeType = {
  triangle: Symbol()
}
```

这样，就达到了「消除魔术字符串」的效果。

---

### 属性名的遍历

Symbol 作为属性名，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。但是，它也不是私有属性，是公有属性，有一个 `Object.getOwnPropertySymbols()` 方法可以获取指定对象的所有 Symbol 属性名。

#### 1. Object.getOwnPropertySymbols()

> 返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```javascript
const obj = {}
let a = Symbol('a')
let b = Symbol('b')

obj[a] = 'Hello'
obj[b] = 'World'

Object.getOwnPropertySymbols(obj) // [Symbol(a), Symbol(b)]
```

还有另一个新的 API：`Reflect.ownKeys()` 方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。（ 详细请见 「Reflect」 一文 ）

```javascript
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
}

Reflect.ownKeys(obj) //  ["enum", "nonEnum", Symbol(my_key)]
```

---

### Symbol.for()，Symbol.keyFor()

有时，我们就是希望重新使用同一个 Symbol 值那要怎么办呢！

`Symbol.for()` 方法可以做到这一点。它接受一个字符串作为**参数**，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回「这个 Symbol 值」，否则就「新建并返回」一个以该字符串为名称的 Symbol 值。

```javascript
let s1 = Symbol.for('foo')
let s2 = Symbol.for('foo')

s1 === s2 // true
```

`Symbol.for()` 与  `Symbol()` 这两个方法**都会生成新**的 Symbol。

它们的区别是：前者会被登记在全局环境中供搜索，后者不会。

`Symbol.for()` 不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用 `Symbol.for("cat")` 30 次，每次都会返回同一个 Symbol 值，但是调用 `Symbol("cat")` 30 次，会返回 30 个不同的 Symbol 值。

`Symbol.keyFor()` 方法返回一个**已登记**的 Symbol 类型值的 key：

```javascript
let s1 = Symbol.for("foo")
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo")
Symbol.keyFor(s2) // undefined
```

这里的已登记是表明已经使用过 `Symbol.for()` 方法生成的 Symbol 值，使用 `Symbol()` 不会被登记的全局变量中，所以返回的是 `undenfined`。

---

### 单例模式

接下来，我们利用 Symbol 的特点，来实现 JavaScript 中的 [单例模式](https://baike.baidu.com/item/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/5946627?fr=aladdin)。

我们都知道，对于 Node 来说，模块文件可以看成是一个类。但是，我们要怎么保证每次执行这个模块文件，返回的都是同一个实例呢？

很容易想到，可以把实例放到顶层对象 global，现在，我们有一个模块 `mod.js`：

```javascript
// mod.js
function A() {
  this.foo = 'hello'
}

if (!global._foo) {
  global._foo = new A()
}

module.exports = global._foo // { foo: 'hello' }
```

然后，在新的文件中加载 `mod.js`：

```javascript
// app.js
const a = require('./mod.js')
console.log(a.foo)
```

上面代码中，变量 `a` 任何时候加载的都是 `A` 的同一个实例。

但是，这里有一个问题，全局变量 `global._foo` 是可写的，任何文件都可以修改：

```javascript
// app.js
const a = require('./mod.js')
global._foo = 123
```

所以！为了防止这种情况出现，我们就可以使用 Symbol：

```javascript
// mod.js
const FOO_KEY = Symbol.for('foo')

function A() {
  this.foo = 'hello'
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A()
}

module.exports = global[FOO_KEY]
```

上面代码中，可以保证 `global[FOO_KEY]` 不会被**无意间覆盖**，但还是**可以被改写**。

```javascript
// app.js
const a = require('./mod.js')
global[Symbol.for('foo')] = 123 // 还是可以被改写，可以使用 for 找到对应的 Symbol 值
```

如果我们的需求是不论如何都不会被改写，那么可以使用 `Symbol()` 方法，这样，外部将无法引用这个值，当然也就无法改写：

```javascript
// mod.js
const FOO_KEY = Symbol('foo')
```

题外话：上面代码将导致其他脚本都无法引用 `FOO_KEY`。但这样也有一个问题，就是如果多次执行这个脚本，每次得到的 `FOO_KEY` 都是不一样的。虽然 Node 会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是完全可靠。

---

### Symbol.hasInstance

对象的 `Symbol.hasInstance` **属性**，指向一个内部方法。

```javascript
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

举上面的例子来说，这个内部方法接收一个参数，用来判断是否是 `instanceof` 运算符右边的对象的实例。

因为实际上使用 `instanceof` 运算符的时候，调用的就是运算符右边的对象的内部方法，比如，`foo instanceof Foo` 在语言内部，实际调用的是 `Foo[Symbol.hasInstance](foo)`，参数就是运算符左边的对象。

---

### Symbol.toPrimitive

对象的 `Symbol.toPrimitive` 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

`Symbol.toPrimitive` 被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。

- **Number**：该场合需要转成数值。
- **String**：该场合需要转成字符串。
- **Default**：该场合可以转成数值，也可以转成字符串。

```javascript
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123
      case 'string':
        return 'str'
      case 'default':
        return 'default'
      default:
        throw new Error()
     }
   }
}

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```