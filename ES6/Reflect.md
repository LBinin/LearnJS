### 概述

**Reflect** 对象与 **Proxy** 对象一样，也是 ES6 为了操作对象而提供的新 API。**Reflect** 对象的设计目的有以下几点：

1. 将 **Object** 对象的一些明显属于语言内部的方法（ 比如 `Object.defineProperty` ），放到 **Reflect** 对象上。
    
    现阶段，某些方法同时在 **Object** 和 **Reflect** 对象上部署，未来的新方法将**只部署**在 **Reflect** 对象上。也就是说，从 **Reflect** 对象上可以拿到语言内部的方法。

2. 修改某些 **Object** 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)` 在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)` 则会返回 `false`。

3. 让 **Object** 操作都变成函数行为。某些 **Object** 操作是命令式，比如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 让它们变成了函数行为。

4. **Reflect** 对象的方法与 **Proxy** 对象的方法一一对应，只要是 **Proxy** 对象的方法，就能在 **Reflect** 对象上找到对应的方法。

    这就让 **Proxy** 对象可以方便地调用对应的 **Reflect** 方法，完成「默认行为」，作为修改行为的基础。也就是说，不管 **Proxy** 怎么修改默认行为，你总可以在 **Reflect** 上获取默认行为。

    ```javascript
    Proxy(target, {
      set: function(target, name, value, receiver) {
        var success = Reflect.set(target,name, value, receiver)
        // 部署额外的功能
        if (success) { 
          log('property ' + name + ' on ' + target + ' set to ' + value)
        }
        return success
      }
    })
    ```

    或者是将每一个操作输出一行日志：

    ```javascript
    var loggedObj = new Proxy(obj, {
      get(target, name) {
        console.log('get', target, name)
        return Reflect.get(target, name)
      },
      deleteProperty(target, name) {
        console.log('delete' + name)
        return Reflect.deleteProperty(target, name)
      },
      has(target, name) {
        console.log('has' + name)
        return Reflect.has(target, name)
      }
    })
    ```

5. 有了Reflect对象以后，很多操作会更易读。

    ```javascript
    // 老写法
    Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

    // 新写法
    Reflect.apply(Math.floor, undefined, [1.75]) // 1
    ```

---

### Reflect 的静态方法

Reflect对象一共有 14 个静态方法。

1. `Reflect.apply(target, thisArg, args)`：对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 `Function.prototype.apply()` 功能类似。
1. `Reflect.construct(target, args)`：对构造函数进行 **new** 操作，相当于执行 `new target(...args)`。
1. `Reflect.get(target, name, receiver)`：获取对象身上某个属性的值，类似于 `target[name]`。
1. `Reflect.set(target, name, value, receiver)`：将值分配给属性的函数。返回一个「布尔值」，如果更新成功，则返回 `true`。
1. `Reflect.defineProperty(target, name, desc)`：和 `Object.defineProperty()` 类似。
1. `Reflect.deleteProperty(target, name)`：作为函数的 **delete** 操作符，相当于执行 `delete target[name]`。
1. `Reflect.has(target, name)`：判断一个对象是否存在某个属性，和 **`in` 运算符** 的功能完全相同。
1. `Reflect.ownKeys(target)`：返回一个包含所有自身属性（不包含继承属性）的数组。
1. `Reflect.isExtensible(target)`：类似于 `Object.isExtensible()`。
1. `Reflect.preventExtensions(target)`：类似于 `Object.preventExtensions()`。返回一个「布尔值」。
1. `Reflect.getOwnPropertyDescriptor(target, name)`：类似于 `Object.getOwnPropertyDescriptor()`。
1. `Reflect.getPrototypeOf(target)`：类似于 `Object.getPrototypeOf()`。
1. `Reflect.setPrototypeOf(target, prototype)`：类似于 `Object.setPrototypeOf()`。
2. `Reflect.enumerate()`：
该方法会返回一个包含有目标对象身上所有可枚举的自身字符串属性以及继承字符串属性的迭代器，`for...in` 操作遍历到的正是这些属性。

上面这些方法的作用，大部分与 **Object** 对象的同名方法的作用都是相同的，而且它与 **Proxy** 对象的方法是一一对应的。

详情请见：[Reflect - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)