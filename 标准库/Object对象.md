JavaScript 原生提供 `Object` 对象（注意起首的 **O** 是大写），所有其他对象都继承自这个对象。`Object` 本身也是一个构造函数，可以直接通过 `var obj = new Object()` 来生成新对象。

`Object` 作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个**原始类型**的值，则返回该值对应的「包装对象」。

---

### Object()

> 可以将任意值转为对象。这个方法常用于保证某个值一定是对象。

1. 如果参数是**原始类型**的值，Object方法返回对应的 [包装对象](./包装对象.md) 的实例。

    ```javascript
    Object() // 返回一个空对象
    Object() instanceof Object // true

    Object(undefined) // 返回一个空对象
    Object(undefined) instanceof Object // true

    Object(null) // 返回一个空对象
    Object(null) instanceof Object // true

    Object(1) // 等同于 new Number(1)
    Object(1) instanceof Object // true
    Object(1) instanceof Number // true

    Object('foo') // 等同于 new String('foo')
    Object('foo') instanceof Object // true
    Object('foo') instanceof String // true

    Object(true) // 等同于 new Boolean(true)
    Object(true) instanceof Object // true
    Object(true) instanceof Boolean // true
    ```

2. 如果参数是一个**对象**，它总是返回「原对象」。

    ```javascript
    var arr = []
    Object(arr) // 返回原数组
    Object(arr) === arr // true

    var obj = {}
    Object(obj) // 返回原对象
    Object(obj) === obj // true

    var fn = function () {}
    Object(fn) // 返回原函数
    Object(fn) === fn // true
    ```

---

### Object 对象的静态方法和实例方法

所谓「静态方法」，是指部署在 `Object` 对象自身的方法。

所谓「实例方法」，是指部署在 `Object.prototype` 对象上的方法，所有 `Object` 的实例对象都继承了这些方法。

1. 静态方法

    **Object.keys()**

    **Object.getOwnPropertyNames()**

    有关这两者的资料请查看 [Object对象与继承 / Object.getOwnPropertyNames()](https://github.com/LBinin/LearnJS/blob/master/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/Object%E5%AF%B9%E8%B1%A1%E4%B8%8E%E7%BB%A7%E6%89%BF.md#objectgetownpropertynames)

    除了上面的两种方法，Object 还提供了许多其他方法。

    1. 对象属性模型的相关方法

        > `Object.getOwnPropertyDescriptor()`：获取某个属性的 attributes 对象。
        > 
        > `Object.defineProperty()`：通过 attributes 对象，定义某个属性。
        > 
        > `Object.defineProperties()`：通过 attributes 对象，定义多个属性。
        > 
        > `Object.getOwnPropertyNames()`：返回直接定义在某个对象上面的全部自身属性的名称。

    2. 控制对象状态的方法

        > `Object.preventExtensions()`：防止对象扩展。
        >
        > `Object.isExtensible()`：判断对象是否可扩展。
        >
        > `Object.seal()`：禁止对象配置。
        >
        > `Object.isSealed()`：判断一个对象是否可配置。
        >
        > `Object.freeze()`：冻结一个对象。
        >
        > `Object.isFrozen()`：判断一个对象是否被冻结。

    3. 原型链相关方法

        > `Object.create()`：该方法可以指定原型对象和属性，返回一个新的对象。
        >
        > `Object.getPrototypeOf()`：获取对象的Prototype对象。

1. 实例方法

    `Object` 实例对象的方法，主要有以下六个：

    > `valueOf()`：返回当前对象对应的值。
    >
    > `toString()`：返回当前对象对应的字符串形式。
    >
    > `toLocaleString()`：返回当前对象对应的本地字符串形式。
    >
    > `hasOwnProperty()`：判断某个属性是否为当前对象自身的属性（ 返回 true ），还是继承自原型对象的属性（ 返回 false ）。
    >
    > `isPrototypeOf()`：判断当前对象是否为另一个对象的原型。
    >
    > `propertyIsEnumerable()`：判断某个属性是否可枚举。

    1. Object.prototype.valueOf()

    > 返回一个对象的「值」，默认情况下返回对象本身。

    ```javascript
    var o = new Object()
    o.valueOf() === o // true
    ```

    `valueOf()` 方法的主要用途是，JavaScript 自动类型转换时会默认调用这个方法。

    2. Object.prototype.toString()

    > 返回一个对象的字符串形式，默认情况下返回类型字符串。

    ```javascript
    var o1 = new Object()
    o1.toString() // "[object Object]"

    var o2 = {a:1}
    o2.toString() // "[object Object]"
    ```

    3. toString()的应用：判断数据类型

    ```javascript
    var o = {}
    o.toString() // "[object Object]"
    ```

    上面代码调用空对象的 `toString()` 方法，结果返回一个字符串 `object Object`，其中第二个 `Object` 表示该值的「构造函数」。这是一个十分有用的判断数据类型的方法。

    通过函数的 `call` 方法，可以在任意值上调用 `Object.prototype.toString` 方法，帮助我们判断这个值的类型。

    ```javascript
    var a = new Number(1)
    Object.prototype.toString.call(a) // "[object Number]"
    ```

    不同数据类型的 `Object.prototype.toString` 方法返回值如下。

    > **数值**：返回[object Number]。
    >
    > **字符串**：返回[object String]。
    >
    > **布尔值**：返回[object Boolean]。
    >
    > **undefined**：返回[object Undefined]。
    >
    > **null**：返回[object Null]。
    >
    > **数组**：返回[object Array]。
    >
    > **arguments对象**：返回[object Arguments]。
    >
    > **函数**：返回[object Function]。
    >
    > **Error对象**：返回[object Error]。
    >
    > **Date对象**：返回[object Date]。
    >
    > **RegExp对象**：返回[object RegExp]。
    >
    > **其他对象**：返回[object Object]。