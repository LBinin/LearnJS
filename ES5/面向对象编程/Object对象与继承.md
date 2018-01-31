通过原型链（ Prototype chain ），对象的属性分成两种：自身的属性和继承的属性。JavaScript 语言在 **Object** 对象上面，提供了很多相关方法，来处理这两种不同的属性。

### Object.getOwnPropertyNames()

> 返回一个数组，成员是对象本身的所有属性的键名，**不包含**继承的属性键名。

```javascript
Object.getOwnPropertyNames(Date)
// ["length", "name", "prototype", "now", "parse", "UTC"]

var a = {
    name: 'World',
    print: function () {
        console.log('Hello ' + this.name)
    }
}
var b = Object.create(a)
b.sayHi = function() {
    console.log('Hi~')
}
Object.getOwnPropertyNames(b) // ["sayHi"]
```

对象本身的属性之中，有的是「可枚举的」（ enumerable ），有的是「不可枚举」的。

`Object.getOwnPropertyNames` 方法所有键名。

`Object.keys` 方法只返回所有可以枚举的属性的键名（ 自身的属性 ）。

由于JavaScript没有提供计算对象属性个数的方法，所以可以用这两个方法代替：

```javascript
Object.keys(o).length
Object.getOwnPropertyNames(o).length
```

---

### Object.prototype.hasOwnProperty()

> 该返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

```javascript
Date.hasOwnProperty('length') // true

Date.hasOwnProperty('toString') // false
```

`hasOwnProperty` 方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。

---

### in 运算符和 for…in 循环

两者获取的属性都包含自身以及继承的属性。

**in 运算符**

> 返回一个布尔值，表示一个对象是否具有某个属性。它**不区分**该属性是对象自身的属性，还是继承的属性。

```javascript
'length' in Date // true
'toString' in Date // true
```

**for...in 循环**

> 获得对象的所有**可枚举属性**（不管是自身的还是继承的）。

所以，为了在 `for...in` 循环中获得对象自身的属性，可以采用 `hasOwnProperty` 方法判断一下。

```javascript
for ( var name in object ) {
  if ( object.hasOwnProperty(name) ) {
    /* loop code */
  }
}
```

### 获取一个对象所有属性

下面的函数可以获取一个对象所有的属性，包括可枚举 + 不可枚举 + 自身 + 继承。

```javascript
function inheritedPropertyNames(obj) {
  var props = {}
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true
    })
    obj = Object.getPrototypeOf(obj)
  }
  return Object.getOwnPropertyNames(props)
}
```

分析：

获取当前传入对象的所有自身属性（ 不论是否可以枚举 ），然后存入 `props` 对象中；使用标准获取原型对象函数 `Object.getPrototypeOf()` 方法获取当前对象的原型对象，进入下一次循环，直到获取到的原型对象为 `null` 的时候停止，返回 `props` 对象中所有属性。

接下来咱们获取一下 `Date` 对象的所有属性：

```javascript
inheritedPropertyNames(Date)

// ["length", "name", "prototype", "now", "parse", "UTC", "arguments", "caller", "constructor", "apply", "bind", "call", "toString", "__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "isPrototypeOf", "propertyIsEnumerable", "valueOf", "toLocaleString"]
```

---

### 对象的拷贝

首先我们要明确拷贝一个对象需要做到什么目标：

1. 确保拷贝后的对象，与原对象具有**同样的 prototype 原型对象**。
1. 确保拷贝后的对象，与原对象具有**同样的属性**。

```javascript
function copyObject(orig) {
  /* 先创建一个与原对象具有相同的 */
  var copy = Object.create(Object.getPrototypeOf(orig))

  /* 调用 copyOwnPropertiesFrom 复制所有属性 */
  copyOwnPropertiesFrom(copy, orig)

  /* 返回复制后的对象 */
  return copy
}

function copyOwnPropertiesFrom(target, source) {
  Object
  /* 获取原对象自身的所有属性（包括不可枚举） */
  .getOwnPropertyNames(source)

  /* 遍历所有获取到的属性 */
  .forEach(function(propKey) {

    /* 获取当前自有属性对应的属性描述符 */
    var desc = Object.getOwnPropertyDescriptor(source, propKey)

    /* 在 target 对象上定义一个新的属性 */
    Object.defineProperty(target, propKey, desc)
  })

  /* 返回复制完属性后的对象 */
  return target
}
```


此外，利用 ES2017 引入标准的 `Object.getOwnPropertyDescriptors` 方法，提供更简单的写法：

```javascript
function copyObject(orig) {
  return Object.create(
    Object.getPrototypeOf(orig),

    /* Object.create() 的第二个参数，添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性），getOwnPropertyDescriptors 为获取指定对象所有的属性描述符，是一个对象 */
    Object.getOwnPropertyDescriptors(orig)
  )
}
```

参考资料：

[Object.create() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

[Object.getOwnPropertyDescriptor() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

[Object.getOwnPropertyDescriptors() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

---

### 小笔记

| 名称                                | 可枚举 | 可枚举 + 不可枚举 | 自身  | 自身 + 继承 |
| :---------------------------------: | :----: | :---------------: | :---: | :---------: |
| `Object.getOwnPropertyNames()`      |        | √                 | √     |             |
| `Object.hasOwnProperty()` |        | √                 | √     |             |
| `Object.keys`                       | √      |                   | √     |             |
| `for...in` 循环                     | √      |                   |       | √           |
| `in` 运算符                         |        | √                 |       | √           |