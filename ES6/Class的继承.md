思前想后，还是把继承单独放在一篇笔记中来说。

### 简介

ES6 中，Class 通过 `extends` 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y) // 调用父类的constructor(x, y)
    this.color = color
  }

  toString() {
    return this.color + ' ' + super.toString() // 调用父类的toString()
  }
}
```

---

### Object.getPrototypeOf()

> 用来从子类上获取父类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point // true
```

可以使用这个方法判断：一个类是否继承了另一个类。

---

### super 关键字

`super` 这个关键字，既可以当作「函数」使用，也可以当作「对象」使用。

在这两种情况下，它的用法完全不同：

1. 第一种情况，super作为「函数」调用时，代表**父类的构造函数**。

    ES6 要求，在子类的构造函数中必须执行一次 `super` 函数。

    注意，`super` 虽然代表了父类 **A** 的构造函数，但是**返回**的是子类 **B** 的实例，即 `super` 内部的 `this` 指的是 **B**，因此 `super()` 在这里相当于 `A.prototype.constructor.call(this)`。

    作为函数时，`super()` 只能用在子类的**构造函数**之中，用在其他地方就会报错。

2. 第二种情况，`super` 作为「对象」时，在普通方法中，指向**父类的原型对象**；在静态方法中，指向**父类**。

    这里需要注意，由于 `super` 指向**父类的原型对象**，也就是类，所以定义在**父类实例上**的**方法或属性**，是无法通过 `super` 调用的。记住是实例，即 `this` 对象。

    先说在普通方法中：

    ES6 规定，通过 `super` 调用父类的方法时，父类方法内部的 `this` 指向的是子类。

    由于 `this` 指向子类，所以如果通过 `super` 对某个**属性**赋值，这时 `super` 就是指代 `this`，赋值的属性会变成子类实例的属性，说白了就是父子都是一个属性。

    举个例子：

    ```javascript
    class A {
      constructor() {
        this.x = 1 // A 的实例对象的 x 为 1
      }
    }

    class B extends A {
      constructor() {
        super()
        this.x = 2 // B 的实例对象的 x 为 2
        super.x = 3 // 由于 super 中的 this 这时候指向的是子类，所以相当于 this.x = 3
        console.log(super.x) // undefined 因为访问的相当于是 A.prototype.x，A 的原型对象上并没有该属性，所以返回的是 undefined
        console.log(this.x) // 3 返回的是 B 的实例对象的 x
      }
    }

    let b = new B()
    ```

    接下来说一下在静态方法中：

    在静态方法之中，这时 `super` 将指向**父类**，而不是父类的**原型对象**。

    ```javascript
    class Parent {
      static myMethod(msg) {
        console.log('static', msg)
      }

      myMethod(msg) {
        console.log('instance', msg)
      }
    }

    class Child extends Parent {
      static myMethod(msg) {
        super.myMethod(msg)
      }

      myMethod(msg) {
        super.myMethod(msg)
      }
    }

    Child.myMethod(1) // static 1

    var child = new Child()
    child.myMethod(2) // instance 2
    ```
---

### Mixin 模式的实现

Mixin 指的是：将多个对象合成为一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下：

```javascript
const a = {
  a: 'a'
}
const b = {
  b: 'b'
}
const c = {...a, ...b} // {a: 'a', b: 'b'}
```

下面是一个更完备的实现，将多个类的接口「混入」（ Mixin ）另一个类：

```javascript
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin) // 拷贝实例属性
    copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
  }

  return Mix
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key)
      Object.defineProperty(target, key, desc)
    }
  }
}

// 调用
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

---

### 注意点

1. 子类没有自己的 `this` 对象，需要从父类中获得，所以必须在使用 `this` 前调用一次父类的**构造函数**，以继承父类的 `this` 对象，否则报错。

    **确切的说**，子类必须在构造函数中调用一次 `super` 方法，否则新建实例时会报错，而且只有在调用之后才能使用 `this` 对象。

    从另外一个调度来理解，子类实例的构建，实际上是**基于对父类实例加工**，只有 `super` 方法才能返回父类实例。

2. 父类的**静态方法**，也会被子类继承。
3. 作为函数时，`super()` 只能用在子类的**构造函数**之中，用在其他地方就会报错。