JavaScript 原生提供 `Object` 对象（注意起首的 **O** 是大写），所有其他对象都继承自这个对象。`Object` 本身也是一个构造函数，可以直接通过 `var obj = new Object()` 来生成新对象。

`Object` 作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个**原始类型**的值，则返回该值对应的「包装对象」。

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
    var arr = [];
    Object(arr) // 返回原数组
    Object(arr) === arr // true

    var obj = {};
    Object(obj) // 返回原对象
    Object(obj) === obj // true

    var fn = function () {};
    Object(fn) // 返回原函数
    Object(fn) === fn // true
    ```

### Object 对象的静态方法和实例方法

所谓「静态方法」，是指部署在 `Object` 对象自身的方法。

所谓「实例方法」，是指部署在 `Object.prototype` 对象上的方法，所有 `Object` 的实例对象都继承了这些方法。

1. 静态方法

    **Object.keys()**

    **Object.getOwnPropertyNames()**

    有关这两者的资料请查看 [Object对象与继承 / Object.getOwnPropertyNames()](https://github.com/LBinin/LearnJS/blob/master/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/Object%E5%AF%B9%E8%B1%A1%E4%B8%8E%E7%BB%A7%E6%89%BF.md#objectgetownpropertynames)