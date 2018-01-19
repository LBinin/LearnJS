### Set

> ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有「重复的值」。

Set 本身是一个构造函数，用来生成 Set 数据结构：

```javascript
const s = new Set()

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x))

for (let i of s) {
  console.log(i)
}
// 2 3 5 4
```

Set 函数可以接受一个数组（ 或者具有 iterable 接口的其他数据结构 ）作为参数，用来初始化：

```javascript
// 例一
const set = new Set([1, 2, 3, 4, 4])
[...set] // [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5])
items // {1, 2, 3, 4, 5}

// 例三
function divs () {
  return [...document.querySelectorAll('div')]
}

const set = new Set(divs())
set.size // 56

// 类似于
divs().forEach(div => set.add(div))
set.size // 56
```

利用这种特性，提供了一种去除数组重复成员的方法：比如：

```javascript
var array = [1, 1, 2, 2, 3, 3, 4, 5, 5, 5, 5, 5]
[...new Set(array)] // [1, 2, 3, 4, 5]
```

需要注意的是：向 Set 加入值的时候，不会发生「类型转换」，所以 `5` 和 `"5"` 是两个不同的值。

Set 内部判断两个值是否不同，使用的算法叫做「Same-value equality」，它类似于精确相等运算符（ `===` ），主要的区别是 `NaN` 等于自身，而精确相等运算符认为 `NaN` 不等于自身。

另外，两个对象总是不相等的。

```javascript
let set = new Set()
set.add(NaN)
set.add(NaN)
set.add(5)
set.add('5')
set.add({})
set.add({})
set // {NaN, 5, "5", {…}, {…}}
```

---

### Set 实例的属性和方法

**Set 类型的实例有以下属性：**

- `Set.prototype.constructor`：构造函数，默认就是 `Set` 函数。
- `Set.prototype.size`：返回 `Set` 实例的成员总数。

**Set 类型的实例有以下属性：**

Set 实例的方法分为两大类：操作方法（ 用于操作数据 ）和遍历方法（ 用于遍历成员 ）。下面先介绍四个操作方法。

- `add(value)`：添加某个值，返回「Set 结构本身」。
- `delete(value)`：删除某个值，返回一个「布尔值」，表示删除是否成功。
- `has(value)`：返回一个「布尔值」，表示该值是否为 Set 的成员。
- `clear()`：清除所有成员，没有返回值。

```javascript
s.add(1).add(2).add(2) // {1, 2}
// 注意 2 被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2)
s.has(2) // false

s.clear()
s.size // 0
```

`Array.from` 方法可以将 Set 结构转为数组：

```javascript
const items = new Set([1, 2, 3, 4, 5])
const array = Array.from(items)
```

---

### Set 的遍历操作

- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回键值对的遍历器。
- `forEach()`：使用回调函数遍历每个成员。

需要注意的是，Set 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

#### keys()，values()，entries()

`keys` 方法、`values` 方法、`entries` 方法返回的都是「遍历器对象」（ 详见 [Iterator](./Iterator和for...of循环.md) 一章）。

由于 Set 结构没有键名，只有键值（ 或者可以说键名和键值是同一个值 ），所以 `keys` 方法和 `values` 方法的行为完全一致。

```javascript
var set = new Set(['red', 'green', 'blue'])

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item)
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

可以看到，`entries` 方法返回的「遍历器」，同时包括**键名**和**键值**，所以每次输出一个数组，它的两个成员完全相等。

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 `values` 方法：

```javascript
Set.prototype[Symbol.iterator] === Set.prototype.values // true
```

也就是说，我们也使用的时候可以省略 `values` 方法，直接用 `for...of` 循环遍历 Set：

```javascript
let set = new Set(['red', 'green', 'blue'])

for (let x of set) {
  console.log(x)
}
// red
// green
// blue
```

因为 `for...of` 调用的数据结构的  terator 接。也就是说，`for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法，所以可以直接省略 `values()`。

#### forEach()

Set 结构的实例与数组一样，也拥有 `forEach` 方法，用于对每个成员执行某种操作，没有返回值，也不可打断。比如：

```javascript
set = new Set([1, 4, 9])
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```

这里需要注意，Set 结构的键名就是「键值」（ 两者是同一个值 ），因此**第一个参数**与**第二个参数**的值永远都是一样的。

#### 遍历的应用

1. 扩展运算符（ `...` ）内部使用 `for...of` 循环，所以也可以用于 Set 结构：

    ```javascript
    var set = new Set(['red', 'green', 'blue'])
    var arr = [...set] // ['red', 'green', 'blue']
    ```

2. 扩展运算符和 Set 结构相结合，就可以去除数组的重复成员。

    ```javascript
    var arr = [1, 2, 3, 4, 5, 5, 5]
    var unique = [...new Set(arr)] // [1, 2, 3, 4, 5]
    ```

3. 数组的 `map` 和 `filter` 方法也可以间接用于 Set 了，相当于先把 Set 转换成数组结构，然后在用 Set 的构造函数。

    ```javascript
    let set = new Set([1, 2, 3])
    set = new Set([...set].map(x => x * 2))
    // 返回Set结构：{2, 4, 6}

    let set = new Set([1, 2, 3, 4, 5])
    set = new Set([...set].filter(x => (x % 2) == 0))
    // 返回Set结构：{2, 4}
    ```

    所以，如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用Array.from方法。

    ```javascript
    // 方法一
    let set = new Set([1, 2, 3])
    set = new Set([...set].map(val => val * 2))
    // set的值是2, 4, 6

    // 方法二
    let set = new Set([1, 2, 3])
    set = new Set(Array.from(set, val => val * 2))
    // set的值是2, 4, 6
    ```

4. 使用 Set 可以很容易地实现并集（ Union ）、交集（ Intersect ）和差集（ Difference ）。

    ```javascript
    var a = new Set([1, 2, 3])
    var b = new Set([4, 3, 2])

    // 并集
    var Union = new Set([...a, ...b])
    // Set {1, 2, 3, 4}

    // 交集
    var Intersect = new Set([...a].filter(value => b.has(value)))
    // set {2, 3}

    // 差集
    var Difference = new Set([...a].filter(value => !b.has(value)))
    // Set {1}
    ```

---

### WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的**成员**只能是「对象」，而不能是其他类型的值。

其次，WeakSet 中的对象都是「弱引用」，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。

因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet「不可遍历」。

#### 语法

和 Set 类似，WeakSet 是一个「构造函数」，可以使用 `new` 命令，创建 WeakSet 数据结构：

```javascript
const ws = new WeakSet()
```

此外，WeakSet 可以接受一个「数组」或「类数组对象」作为参数。（ 实际上，任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数 ）该数组的所有成员，都会自动成为 WeakSet 实例对象的成员：

```javascript
const a = [[1, 2], [3, 4]]
const ws = new WeakSet(a)
// WeakSet {[1, 2], [3, 4]}
```

需要注意的是：`a` 数组的成员成为 WeakSet 的成员，而不是 `a` 数组本身。这意味着，数组的成员只能是对象。

#### WeakSet 的静态方法

- `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员，返回「WeekSet 结构本身」。
- `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员，返回一个「布尔值」，表示是否删除成功。
- `WeakSet.prototype.has(value)`：返回一个「布尔值」，表示某个值是否在 WeakSet 实例之中。

```javascript
const ws = new WeakSet()
const obj = {}
const foo = {}

ws.add(window)
ws.add(obj)

ws.has(window) // true
ws.has(foo)    // false

ws.delete(window) // true
ws.has(window)    // false
```

#### WeakSet 的属性

WeakSet 没有 `size` 属性，也没有 `forEach`，没有办法遍历它的成员。

那说到底，这东西有什么用 -=-

阮老师举了一个例子：

> WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

---

### Map

JavaScript 的对象（ Object ），本质上是键值对的集合（ Hash 结构 ），但是传统上只能用「字符串」当作键。这给它的使用带来了很大的限制。

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是「键」的范围不限于字符串，**各种类型**的值（ 包括对象 ）都可以当作键。

也就是说，Object 结构提供了「字符串 — 值」的对应，Map 结构提供了「值 — 值」的对应，是一种更完善的 Hash 结构实现。如果你需要「键值对」的数据结构，Map 比 Object 更合适。

```javascript
const m = new Map()
const o = {p: 'Hello World'}

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

作为构造函数，Map 也可以接受一个「数组」作为参数：该数组的成员是一个个表示键值对的**数组**。

举个栗子 🌰

```javascript
const map = new Map([
  ['name', '张三'], // 一个数组代表一个键值对
  ['title', 'Author'] // 第一个参数是键名，第二个是键值
])

// 实际上相当于进行了如下操作
const map = new Map()
const items = [
  ['name', '张三'],
  ['title', 'Author']
]
items.forEach( ([key, value]) => map.set(key, value) )


map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作 Map 构造函数的参数。这就是说，Set 和 Map 都可以用来生成新的 Map：

```javascript
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

需要注意的是：只有对「同一个对象的引用」，Map 结构才将其视为同一个键。这一点要非常小心。

Map 的键实际上是跟「内存地址」绑定的，只要**内存地址**不一样，就视为两个键。

这就解决了同名属性碰撞（ clash ）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。当然，你也可以用 Symbo :)

因为内部的键名判断类似于「严格相等运算符」，所以，如 `true` 和 `"true"` 是不一样的键名，但是 `NaN` 是一样的。和 Set 的内部判断重复是一样的算法。

---

### Map 实例的属性和操作方法

Map 结构的实例有以下属性和操作方法：

#### 1. size 属性

> 返回 Map 结构的成员总数。

```javascript
const map = new Map()
map.set('foo', true)
map.set('bar', false)

map.size // 2
```

#### 2. set(key, value)

> 设置键名 `key` 对应的键值为 `value`，然后返回整个 Map 结构。如果 `key` 已经有值，则键值会被更新，否则就新生成该键：

```javascript
const m = new Map()

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
```

小技巧：`set` 方法返回的是当前的 `Map` 对象，因此可以采用链式写法：

```javascript
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c')
```

#### 3. get(key)

> 读取 `key` 对应的键值，如果找不到 `key`，返回 `undefined`：

```javascript
const m = new Map()

const hello = function() {console.log('hello')}
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!
```

#### 4. has(key)

> 返回一个布尔值，表示某个键是否在当前 Map 对象之中。

```javascript
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
```

#### 5. delete(key)

> 删除某个键，返回true。如果删除失败，返回false。

```javascript
const m = new Map()
m.set(undefined, 'nah')
m.has(undefined) // true

m.delete(undefined)
m.has(undefined) // false
```

#### 6. clear()

> 清除所有成员，没有返回值。

```javascript
let map = new Map()
map.set('foo', true)
map.set('bar', false)

map.size // 2
map.clear()
map.size // 0
```

---

### Map 的遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回所有成员的遍历器。
- `forEach()`：遍历 Map 的所有成员。

Map 结构的默认遍历器接口（ `Symbol.iterator` 属性），就是 `entries()` 方法。

```javascript
map[Symbol.iterator] === map.entries // true
```

所以，我们在使用 `entries()` 方法进行遍历的时候，可以省略方法名：

```javascript
for (let [key, value] of map.entries()) {
  console.log(key, value)
}
// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value)
}
```

Map 依然可以使用扩展运算符（ `...` ）将 Map 结构转为数组结构。

所以，可以结合数组的 `map` 方法、`filter` 方法，可以实现 Map 的遍历和过滤（ Map 本身没有 `map` 和 `filter` 方法）。

此外，Map 还有一个 `forEach` 方法，与数组的 `forEach` 方法类似，也可以实现遍历：

```javascript
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value)
})
```

---

### WeakMap

`WeakMap` 结构与 Map 结构类似，也是用于生成键值对的集合：

**`WeakMap` 与 Map 的区别有两点：**

1. `WeakMap` 只接受对象作为键名（ **null** 除外），不接受其他类型的值作为键名。
2. `WeakMap` 的键名所指向的对象，不计入垃圾回收机制。

简而言之，`WeakMap` 的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap` 结构有助于防止内存泄漏。

---

### WeakMap 的应用

WeakMap 应用的典型场合就是 DOM 节点作为键名：

```javascript
let myElement = document.getElementById('logo')
let myWeakmap = new WeakMap()

myWeakmap.set(myElement, {timesClicked: 0})

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement)
  logoData.timesClicked++
}, false)
```

上面代码中，`myElement` 是一个 DOM 节点，每当发生 `click` 事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是 `myElement`。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

另一个用处是部署私有属性：

```javascript
const _counter = new WeakMap()
const _action = new WeakMap()

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter)
    _action.set(this, action)
  }
  dec() {
    let counter = _counter.get(this)
    if (counter < 1) return
    counter--
    _counter.set(this, counter)
    if (counter === 0) {
      _action.get(this)()
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'))

c.dec()
c.dec()
// DONE
```

`Countdown` 类的两个内部属性 `_counter` 和 `_action`，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。