**安装**

```Bash
$ npm i --save vuex
```

**使用**

```JavaScript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

---

考虑使用 Vuex 的两个场景：

* 多个视图依赖于同一状态。
* 来自不同视图的行为需要变更同一状态。

---

Vuex 和单纯的全局对象有以下两点不同：

* Vuex 的状态存储是响应式的。当 Vue 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

* 你不能直接改变 `store` 中的状态。改变 `store` 中的状态的唯一途径就是显式地**提交 (commit) mutation**。这样使得 Vuex 可以方便地跟踪每一个状态的变化，从而让 Vuex 能够实现一些工具帮助 Vuex 更好地了解应用。

---

## 核心概念

* [State](#State)
* [Getter](#Getter)
* [Mutation](#Mutation)
* [Action](#Action)
* [Module](#Module)

先举个简单的 Story 例子：

```JavaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

然后可以通过 `store.state` 来**获取状态对象**，以及通过 `store.commit` 方法触发**状态变更**：

```JavaScript
store.commit('increment') // 触发 mutations 中的 increment 方法

console.log(store.state.count) // -> 1
```

### State

在 Vue 组件中获取状态：

```JavaScript
// 创建一个 Counter 组件
// 在 Counter 获取上面 store 中的状态
const Counter = {
  template: `<div>{{ count }}</div>`,
  // 在计算属性中返回 store 中的某个状态
  computed: {
    count () {
      // 放回 store.state 中的 count 属性作为返回值
      return store.state.count
    }
  }
}
```

不过如果每个属性的获取都要这样什么计算属性的话，难免代码会变得冗余。

所以，我们可以通过 Vuex 提供的 `mapState` 函数来辅助我们**生成计算属性**：

```JavaScript
// 引入 Vuex.mapState
import { mapState } from 'Vuex'

export default {
  // ...
  computed: mapState({
    /* 通过函数获取 state.count */
    count: state => state.count,

    /* 通过字符串获取 state.count，等同于上方 */
    count: 'count',

    /* 如果需要获取实例的其他局部状态，必须使用常规函数了 */
    count(state) {
      return state.count + this.localCount
    }
  })
}
```

❗️需要注意的是：这些属性的 `getter` 方法都会接受 `state` 作为其第一个参数。

甚至，如果计算属性的名称与状态（ state ）中的属性名称相同的话，可以简写成：

```JavaScript
/* 给 mapState 传入一个数组 */
computed: mapState([
  'count' // 隐射 this.count 为 store.state.count
])
```

因为 `mapState` 会生成一个对象，对象里面每个属性都是计算属性，所以直接将返回的对象赋值给 `computed` 的话，我们就无法添加局部的计算属性，解决方法有两个：

- 将多个对象合并为一个对象，许多方法都可以做到。
- 使用 ECMASCript 提案 stage-3 阶段的「对象展开运算符」：

    举个例子：

    ```JavaScript
    computed: {
      localComputed () { /* ... */ }, // 局部计算属性

      /* 使用对象展开运算符将此对象展开后混入到外部对象中 */
      ...mapState({
        // ...
      })
    }
    ```

---

### Getter

这个属性的目的是为了处理一些从 `state` 中派生出的一些状态，比如：

```JavaScript
computed: {
  doneTodosCount () {
    // 返回从 state.todos 中过滤出已完成的内容
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

上面是在某个组件中，根据 `state` 中的内容获得的 `doneTodosCount`，如果在多个组件中都需要用到该属性，一次次的复制肯定是不理想的方法。

所以，我们可以在 store 中定义 `getter`，就像**计算属性**一样，`getter` 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。`getter` 可以认为是 `store` 的计算属性。

就算在 Vue 中介绍计算属性的时候说的那样：

> 任何复杂逻辑，你都应当使用计算属性。

```JavaScript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

当我们使用 `store.getters.doneTodos` 的时候，就会得到已经过滤过的内容。

❗️需要注意的一点是：和 `mapState` 参数对象中的属性一样，**Getter** 接受 `state` 作为其第一个参数。

当然他也接收第二个参数：其他的 `getter`。

举个例子：

```JavaScript
state: {
  todos: [
    { id: 1, text: '...', done: true },
    { id: 2, text: '...', done: false }
  ]
},
getters: {
  // ...
  doneTodos: state => {
    return state.todos.filter(todo => todo.done)
  },
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}

// 在其他组件中
this.$store.getters.doneTodosCount // -> 1
```

如果我们想给 `getter` 传参数应该如何做呢？

其实我们可以让 `getter` 放回一个函数，该函数接收参数就 ok 啦：

```JavaScript
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

同样的，像 `mapState` 一样，为了解决重复地书写计算属性，`getter` 也有对应的 `mapGetters` 辅助函数，用来将 `store` 中的 `getter` 映射到局部计算属性：

```JavaScript
// 引入 mapGetters 方法
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount', // 映射 this.doneTodosCount 为 this.$store.getters.doneTodosCount
      'anotherGetter',
      // ...
    ]),
    ...mapGetters({
      doneCount: 'doneTodosCount' // 改名也是 ok 的
    })
  }
}
```

---

### Mutation

之前介绍过了：更改 Vuex 的 `store` 中的状态的唯一方法是提交 **mutation**。

每个 `mutation` 都有一个字符串的 **事件类型 ( type )** 也就是函数名，和一个 **回调函数 (handler)**，也就是函数体。

这个回调函数就是我们实际进行状态更改的地方，并且它会接受 `state` 作为第一个参数：

```JavaScript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

如果我们想要触发 `increment` 方法，只能通过 `store.commit('increment')` 相应的 **type** 去触发。

当然，我们也可以向 `mutation` 中传入参数，这称为 `mutation` 的 载荷（ payload ）：

```JavaScript
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```

---

### Action

---

### Module
