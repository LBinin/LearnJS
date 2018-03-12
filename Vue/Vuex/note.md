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

🤔 不过一般推荐载荷应该是一个对象，这样可以包含多个字段并且记录的 `mutation` 会更易读：

```JavaScript
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})
```

提交 `mutation` 的另一种方式是直接使用包含 `type` 属性（ 也就是函数名 ）的对象：

```JavaScript
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交方式，整个对象都作为载荷传给 `mutation` 函数，因此 handler 保持不变：

```JavaScript
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

关于编程风格，可以用常量替代 `mutation` 事件类型：

```JavaScript
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

在其他组件中，可以使用 `this.$store.commit('xxx')` 提交 `mutation`。

或者使用 `mapMutations` 辅助函数，将组件中的 `methods` 映射为 `store.commit` 调用（ **需要在根节点注入 store** ）。

```JavaScript
// 引入 mapMutations
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

❗️一条重要的原则就是：要记住 `mutation` 必须是「同步函数」，否则状态的改变都是不可追踪的。

如果需要异步操作，请选择 Action 👇🏻

---

### Action

于 `mutation` 的不同在于：

- **Action** 提交的是 `mutation`，而不是直接变更状态。
- **Action** 可以包含任意异步操作。

**Action** 函数接受一个与 `store` 实例**具有相同方法和属性**的 `context` 对象（ **注意！不是 store 实例本身** ），因此你可以调用 `context.commit` 提交一个 `mutation`，或者通过 `context.state` 和 `context.getters` 来获取 `state` 和 `getters`。

同时，如果你需要大量使用 commit 的时候，可以使用参数解构：

```JavaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    },
    // 使用结构
    increment ({ commit }) {
      commit('increment')
    }
  }
})
```

这样一来，可以使用 `dispatch` 方法触发：

```JavaScript
store.dispatch('increment')
```

为什么这样写呢，直接用 `commit` 调用不是更方便吗？

上文也说到了，`mutation` 必须是**同步执行的**，如果我们修改 `action` 里的内容可能会更好理解一点：

```JavaScript
actions: {
  increment ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

这样，普通的 `mutation` 就无法做到了，这就是 `action` 和 `mutation` 的区别。

和 `mutation` 一样，支持载荷方式和对象方式进行分发：

```JavaScript
// 以载荷方式分发
store.dispatch('increment', {
  amount: 10
})
// 以对象形式分发
store.dispatch({
  type: 'increment',
  amount: 10
})
```

同 `mapMutations` 一样，Action 可以使用 `mapActions` 辅助函数将组件的 `methods` 映射为 `store.dispatch`h 调用（ 需要先在根节点注入 `store` ）：

```JavaScript
// 引入 mapActions
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

如果我们需要知道 `action` 何时结束，并在之后做出相应的操作，可以在 `action` 中返回一个 Promise：

```JavaScript
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

然后我们就可以在调用 `action` 后调用 `then` 方法：

```JavaScript
store.dispatch('actionA').then(() => {
  // ...
})
```

---

### Module

当应用变得非常复杂时，`store` 对象就有可能变得相当臃肿。这时候，为了解决以上问题，Vuex 允许我们将 `store` 分割成模块（ module ）。

举个基本的例子：

```JavaScript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的所有状态
store.state.b // -> moduleB 的所有状态
```

对于 `getter` 和 `mutation`，接收的第一个参数是模块的 `state`「局部状态对象」，第二个参数为 `getters`「局部计算属性对象」，第三个参数为 `rootState`「根模块状态对象」，第四个为 `rootGetters`「根模块计算属性对象」：

```JavaScript
modules: {
  // ...
  foo: {
    namespaced: true,

    getters: {
      // 第一、二个参数为局部内容
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },
  }
}
```

对于 `action`，参数仍然是 `context` 与 `store` 实例**具有相同方法和属性**，该对象中，`state` 为「局部状态对象」，`rootState` 为「根模块状态对象」，`getters` 为「局部计算属性对象」，`rootGetters` 为「根模块计算属性对象」，`commit` 为「`mutation` 分发方法」，`dispatch` 为「`action` 分发方法」：

```JavaScript
modules: {
  foo: {
    namespaced: true,

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        // 对局部内容的 `someOtherAction` 方法进行分发
        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        // 对根模块的 `someOtherAction` 方法进行分发
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        // 同上
        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      // 载荷方法
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

模块内部的 `action`、`mutation` 和 `getter` 是**默认**注册在**全局命名空间**的，这样使得多个模块能够对同一 `mutation` 或 `action` 作出响应。

可以通过添加 `namespaced: true` 的方式使其成为**命名空间模块**。当模块被注册后，它的所有 `getter`、`action` 及 `mutation` 都会自动根据模块注册的路径调整命名：

```JavaScript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间，不设置 namespaced
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

上面的例子需要注意的几个点：

- 不设置 `namespaced` 的话，将会继承父模块的命名空间。
- 对于设置 `namespaced` 的非根模块，将会进一步嵌套命名空间。
- 对于根模块中的内容已经是嵌套的了，设置 `namespaced` 对根模块内容不起作用。

---

推荐的项目结构：

    ├── index.html
    ├── main.js
    ├── api
    │   └── ... # 抽取出API请求
    ├── components
    │   ├── App.vue
    │   └── ...
    └── store
        ├── index.js          # 我们组装模块并导出 store 的地方
        ├── actions.js        # 根级别的 action
        ├── mutations.js      # 根级别的 mutation
        └── modules
            ├── cart.js       # 购物车模块
            └── products.js   # 产品模块

---

Vuex 的 `store` 接受 `plugins` 选项，这个选项暴露出每次 `mutation` 的钩子。

Vuex 插件就是一个函数，它接收 `store` 作为唯一参数：

```JavaScript
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

---

在创建 `store` 的时候传入 `strict: true` 以开启严格模式：

```JavaScript
const store = new Vuex.Store({
  // ...
  strict: true
})
```

❗️**不要在发布环境下启用严格模式！**

严格模式会深度监测状态树来检测不合规的状态变更。所以请确保在发布环境下关闭严格模式，以避免性能损失。

所以需要做一些修改：

```JavaScript
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

---

在表单处理中，如果直接使用 `v-model` 命令去绑定一个 Vuex `store` 对象的某个属性，你会发现因为 Vuex 不允许直接修改 `state` 中的状态，`v-model` 直接的修改会导致报错。

解决方法：根据 `v-model` 的原理，更换绑定的值和监听的事件。

```HTML
<input :value="message" @input="updateMessage">
```

```JavaScript
import { mapState } from 'vuex'

// ...
computed: {
  ...mapState({
    message: state => state.obj.message // obj 为某一状态对象
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

`mutation` 函数内容：

```JavaScript
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

或者你认为这样变得非常的繁杂，也可以使用带有 `setter` 的双向绑定计算属性（ 个人推荐 ）：

```HTML
<input v-model="message">
```

```JavaScript
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```