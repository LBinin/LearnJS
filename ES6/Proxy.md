### 概述

> Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种「元编程」（ meta programming ），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层「拦截」，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行**过滤**和**改写**。Proxy 这个词的原意是代理，用在这里表示由它来「代理」某些操作，可以译为「代理器」。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例：

```javascript
var proxy = new Proxy(target, handler)
```

Proxy 对象的所有用法，都是上面这种形式，不同的只是 `handler` 参数的写法。其中，`new Proxy()` 表示生成一个 Proxy 实例，`target` 参数表示所要拦截的目标对象，`handler` 参数也是一个对象，用来定制拦截行为。

接下来咱们举个栗子 🌰

```javascript
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35
  }
})

proxy.time // 35
proxy.name // 35
proxy.title // 35
```

有关 get 的信息请看 [handler.get() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get)

咱们先来说说 Proxy 的参数。

作为**构造函数**，Proxy 接受两个参数：

1. 第一个参数是所要代理的目标对象（ 上例是一个空对象 ），即如果没有 Proxy 的介入，操作原来要访问的就是这个对象；
2. 第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的「处理函数」，该函数将拦截对应的操作。

比如，上面代码中，配置对象有一个 `get` 方法，用来拦截对目标对象属性的访问请求。`get` 方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回 35，所以访问任何属性都得到 35。

如果 `handler` 没有设置任何拦截，那就等同于直接通向原对象。

```javascript
var target = {}
var handler = {}
var proxy = new Proxy(target, handler)
proxy.a = 'b'
target.a // "b"
```

上面代码中，`handler` 是一个空对象，没有任何拦截效果，访问 `proxy` 就等同于访问 `target`。

个人感觉就是执行 `var proxy = target`，所以对 `proxy` 操作，就相当于对目标对象进行操作；但是 `handler` 只对 `Proxy` 实例（ 上例的 `proxy` ）有效，而对目标对象（ 上例的 `target` ）无效。

---

### Proxy 拦截操作

官方资料 [Proxy handler - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)

Proxy 的 `handler` 一共支持以下 13 种拦截操作：

1. `get(target, propKey, receiver)`：拦截对象属性的读取，比如 `proxy.foo` 和 `proxy['foo']`。
1. `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如 `proxy.foo = v` 或 `proxy['foo'] = v`，返回一个「布尔值」。
1. `has(target, propKey)`：拦截 `propKey in proxy` 的操作，返回一个「布尔值」。
1. `deleteProperty(target, propKey)`：拦截 `delete proxy[propKey]` 的操作，返回一个「布尔值」。
1. `ownKeys(target)`：拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`，返回一个「数组」。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的**可遍历**属性。
1. `getOwnPropertyDescriptor(target, propKey)`：拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`，返回「属性的描述对象」。
1. `defineProperty(target, propKey, propDesc)`：拦截 `Object.defineProperty(proxy, propKey, propDesc)`、`Object.defineProperties(proxy, propDescs)`，返回一个「布尔值」。
1. `preventExtensions(target)`：拦截 `Object.preventExtensions(proxy)`，返回一个「布尔值」。
1. `getPrototypeOf(target)`：拦截 `Object.getPrototypeOf(proxy)`，返回一个「对象」。
1. `isExtensible(target)`：拦截 `Object.isExtensible(proxy)`，返回一个「布尔值」。
1. `setPrototypeOf(target, proto)`：拦截 `Object.setPrototypeOf(proxy, proto)`，返回一个「布尔值」。如果目标对象是**函数**，那么还有「以下两种」额外操作可以拦截。
1. `apply(target, object, args)`：拦截 Proxy 实例作为**函数**调用的操作，比如 `proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
1. `construct(target, args)`：拦截 Proxy 实例作为**构造函数**调用的操作，比如 `new proxy(...args)`。

---

### 选记

#### get()

`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为「目标对象」、「属性名」和 「Proxy 实例本身」（ 即 `this` 关键字指向的那个对象 ），其中最后一个参数可选。

**实例：**

> 使用get拦截，实现数组读取负数的索引。

```javascript
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey) // 获取下标
      if (index < 0) { // 遇到负数下标，从尾开始计数
        propKey = String(target.length + index)
      }
      return Reflect.get(target, propKey, receiver) // 完成 target 原有默认的操作
    }
  }

  let target = []
  target.push(...elements)
  return new Proxy(target, handler)
}

let arr = createArray('a', 'b', 'c')
arr[-1] // c
```

> 将读取属性的操作（ get ），转变为执行某个函数，从而实现属性的链式操作。

```javascript
var pipe = function(value) {
  var funcStack = [] // 存储操作
  // 过滤器
  var oproxy = new Proxy({} , {
    get(pipeObject, fnName) { // pipeObject 为上一层传下来的 Proxy 实例
      if (fnName === 'get') { // 如果属性名为 get
        return funcStack.reduce((val, fn) => {
          return fn(val) // 依次调用 funcStack 中的函数，初始值为 value
        }, value)
      }
      funcStack.push(myMath[fnName]) // 不为 get 的话就将操作存入数组
      return oproxy // 返回 Proxy 实例给下一层使用
    }
  })

  return oproxy
}

var myMath = {
  double:     val => val * 2,
  pow:        val => val * val,
  reverseInt: val => Number(val.toString().split('').reverse().join('') | 0)
}

pipe(3).double.pow.reverseInt.get // 63
```

---

#### Set()

`set` 方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

**实例：**

> 假定 `Person` 对象有一个 `age` 属性，该属性应该是一个不大于 200 的整数，那么可以使用 Proxy 保证 `age` 的属性值符合要求。

```javascript
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer')
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid')
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value
  }
}

let person = new Proxy({}, validator)

person.age = 100

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

**to be continue ...**