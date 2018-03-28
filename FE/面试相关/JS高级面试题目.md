## 基础知识

- ES6 常见语法
- 原型高级应用
- 异步全面讲解

## 框架原理

- 虚拟 DOM
- MVVM vue
- 组件化 React

## 混合开发

- hybrid
- hybrid vs H5
- 客户端通讯

## 热爱编程

- 读书、博客
- 开源

---

题目分类

- ES6
  - 模块化的使用和编译环境
  - Clas 和 JS 构造函数的区别
  - Promise 的使用
  - ES6 其他常用功能
- 异步
  - 什么是单线程，和异步有什么关系
  - 什么是 enevt-loop
  - 目前解决 JS 异步的方案有哪些
  - 如果只用 jQuery 如何解决异步
  - Promise 的标准
  - async / await 的使用（ ES7 ）
- 原型
  - 原型如何实际应用
  - 原型如何满足扩展
- vdom
  - 什么是 vdom，为何要用 vdom
  - vdom 如何使用，核心函数有哪些
  - 了解 diff 算法吗
- MVVM
  - 之前使用 jQuery 和现在使用 Vue 或 React 框架的区别
  - 如何理解 MVVM
  - Vue 如何实现响应式
  - Vue 如何解析模板
  - 介绍 Vue 的实现流程
- 组件化
  - 对组件化的理解
  - JSX 是什么？
  - JSX 和 vdom 有什么关系
  - 简述 React 的 `setState`
  - 阐述自己如何比较 React 和 Vue（ 技术选型 ）
- hybrid
  - hybrid 是什么，为什么要用 hybrid
  - hybrid 如何更新上线
  - hybrid 和 H5 有何区别
  - JS 如何与客户端通信
- 其他
  - 如何写博客
  - 如何做开源

---

### ES6 常见语法

**内容**：Class、Module、Promise 等

> ES6 开发环境已经普及，浏览器环境却支持不好（ 所以需要开发环境编译 ）。内容很多，重点了解常用语法。

**面试内容**：开发环境的使用 + 重点语法的掌握

**题目**：

**1. ES6 模块化如何使用，开发环境如何打包？**

  - 模块化的基本语法

    `import` 以及 `export`：

    ```JavaScript
    // util1.js
    export default {
      a: 100
    }

    // util2.js
    export function fn1() {
      alert('fn1')
    }
    export function fn2() {
      alert('fn2')
    }

    // index.js
    import util1 from './util1.js'
    import { fn1, fn2 } from './util2.js'
    ```

  - 开发环境配置

    **Babel**、**webpack**、**rollup**

    **webpack** 和 **rollup** 比较：**rollup** 功能单一，用于打包模块化文件；**webpack** 功能强大；在实际过程中如果需要快速开发小型应用，可以使用 **rollup**，因为工具要尽量功能单一，可集成，可扩展，可以和其他工具配置使用，如：**gulp**。

    无论使用 **webpack** 还是 **rollup** 都需要 **Babel** 来编译 ES6 语法( 一般不会询问配置的问题 )。

    ❗️在面试过程中可以主要说 **webpack**，但是一定要提及 **rollup**( 就算没有用过 )。

  - 关于 JS 众多模块化标准

    没有模块化 -> AMD 成为标准( require.js ) -> 打包工具( grunt、gulp )的出现，使得 NodeJS 模块化( CommonJS )可以被使用-> ES6 出现，想统一现在所有模块化的标准( NodeJS 正在积极支持，但是浏览器尚未统一 )

    参考资料：

    > [模块化开发](https://github.com/LBinin/LearnJS/blob/master/webpack/%E5%AE%9E%E6%88%98/note.md#%E6%A8%A1%E5%9D%97%E5%8C%96%E5%BC%80%E5%8F%91-webpack-%E7%9B%B8%E5%85%B3-)
    >
    > [Module 的语法](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/Module%E7%9A%84%E8%AF%AD%E6%B3%95.md)

  - **解答**：

    1. 语法为 `import` 和 `export`( 注意有无 `default` )
    2. 环境需要 `babel` 来编译 ES6 语法，模块化可用 **webpack**、**rollup**( 一定要提及 **rollup** )

        ```JavaScript
        import babel from 'rollup-plugin-babel'
        import resolve from 'rollup-plugin-node-resolve'

        export from {
          entry: 'src/index.js',
          format: 'umd',
          plugin: [
            resolve(),
            babel({
              exclude: 'node-modules/**'
            })
          ],
          dest: 'build/bundle.js'
        }
        ```

    3. 扩展的话，可以说说自己对模块化标准统一的期待。

**2. Class 和普通构造函数有什么区别？**

  - JS 构造函数( 什么是构造函数 )

    ```JavaScript
    function MathHandle(x, y) { // => 这里就是构造函数
      this.x = x
      this.y = y
    }

    MathHandle.prototype.add = function() {
      return this.x + this.y
    }

    var m = new MathHandle(1, 2) // => 这里就是调用 MathHandle 的构造函数
    console.log(m.add())
    ```

  - Class 基本语法

    ```JavaScript
    class MathHandle {
      constructor(x, y) {
        this.x = x
        this.y = y
      }

      add() { // => 相当于在原型链上定义
        return this.x + this.y
      }
    }

    const m = new MathHandle(1, 2) // => 调用 constructor 构造函数
    m.add() // 3
    ```

    参考资料：[Class 的基本语法](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/Class%E7%9A%84%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95.md)

  - 关系

    Class 与 JS 构造函数的关系：Class 为 JS 构造函数的「语法糖」。

    ```JavaScript
    class MathHandle {
      // ...
    }
    var m = new MathHandle()

    typeof MathHandle // "function"
    MathHandle === MathHandle.prototype.constructor // true
    m.__proto__ === MathHandle.prototype // true
    ```

    个人观点：这种语法糖的形式，让看起来和实际原理不一样，形式上强行模仿 Java 或 C#，却失去了它的本性和个性。**前提是明白语法糖背后的原理**。

  - 继承

    参考资料：[Class 的继承](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/Class%E7%9A%84%E7%BB%A7%E6%89%BF.md)

  - **解答**：

    1. `Class` 在语法上更贴合面向对象的写法
    2. `Class` 实现继承更加易读、易理解
    3. 更易于写 Java 等后端语言使用
    4. 本质还是语法糖，使用的是 `prototype`
    5. 有了 `Class`，还是需要学习原型相关内容，任何语法糖都需要了解本质，不能仅限于表面功夫会用就好，了解背后的原因和本质。

**3. Promise 的基本使用和原理**

  - Callback Hell( 回调地狱 )

  - Promise 语法

  - **解答**：

    - new Promise 实例，而且要 return
    - new Promise 时需要传入函数，函数有 `resolve` `reject` 两个回调函数作为参数
    - 成功时候执行 `resolve()`，失败时执行 `reject()`
    - 用 `then()` 监听结果

**4. 总结一下 ES6 的其他常用功能**

  - let / const [👉🏻 参考](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/let%E5%92%8Cconst%E5%91%BD%E4%BB%A4.md)

    1. 不存在变量提升
    2. 暂时性死区
    3. 不允许重复声明
    4. const 需要注意的一个是：const 实际上保证的**并不是**「指向的值」不得改动，而是变量指向的那个「内存地址」不得改动。

  - 多行字符串 / 模板变量 [👉🏻 参考](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%89%A9%E5%B1%95.md#4-%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)

    1. 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
    2. 模板字符串中嵌入变量，需要将变量名写在 `${}` 之中。
    3. 大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性，甚至能够调用函数。因为模板字符串的大括号内部，就是执行 JavaScript 代码，因此如果大括号内部是一个字符串，将会原样输出。

  - 函数默认参数 [👉🏻 参考](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/%E5%87%BD%E6%95%B0%E7%9A%84%E6%89%A9%E5%B1%95.md#1-%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%9A%84%E9%BB%98%E8%AE%A4%E5%80%BC)
  - 箭头函数 [👉🏻 参考](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/%E5%87%BD%E6%95%B0%E7%9A%84%E6%89%A9%E5%B1%95.md#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)

    1. 如果只有一个「参数」，参数不需要**括号**，其他时候需要；
    2. 如果函数体只有一句「代码」，则箭头后不需要**大括号**，否则添加需要大括号并添加 `return` 语句（ 如果直接返回的是对象需要在对象的大括号外包裹一层小括号 ）
    3. 函数体内的 `this` 对象，就是**定义时**所在的对象，而不是**使用时**所在的对象。
    4. 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误。（ 实际上是因为箭头函数内部不会生成自己的 `this` 值 ）
    5. 不可以使用 `arguments` 对象，因为该对象在箭头函数体内不存在。如果要用，可以用 `rest` 参数代替。
    6. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。

  - 块级作用域 [👉🏻 参考](https://github.com/LBinin/LearnJS/blob/f5a9b1926a2661a4dd9eaa97b3071465fe126f66/ES6/let%E5%92%8Cconst%E5%91%BD%E4%BB%A4.md#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F)
  - 解构赋值

  - **解答**：

    1. let / const
    2. 多行字符串 / 模板变量
    3. 解构赋值
    4. 块级作用域
    5. 函数默认参数
    6. 箭头函数

---

### 原型高级应用

内容：结合 jQuery 和 zepto 源码

---

### 异步全面讲解

内容：从原理到 jQuery 到 Promise

---

### 虚拟 DOM

内容：存在价值、如何使用以及 diff 算法

---

### Vue

内容：MVVM，Vue 响应式、模板解析、渲染

---

### React

内容：组件化、JSX、vdom、setState

---

### Vue、React 对比

---

### hybrid

内容：基础、和 H5 对比，上线流程

---

### 客户端通讯

内容：通讯原理，JS-Bridge 封装

---

### 读书、博客、开源

热爱编程