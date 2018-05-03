## 安装

先用着 CDN 吧：

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

## JSX 简介

我们用 JSX 来声明一个变量：

```js
const element = <h1>Hello, world!</h1>
```

JSX 是一种 JavaScript 的语法扩展。

在 React 推荐中使用 JSX 来描述用户界面。JSX 乍看起来可能比较像是**模版语言**，但事实上它完全是在 JavaScript 内部实现的。

### 书写风格

1. 一般都会带上换行和缩进，增强代码的可读性；
2. 在 JSX 代码的外面扩上一个小括号，可以防止的「分号自动插入」bug。

### JSX 属性

```js
// 可以使用引号来定义以字符串为值的属性
const element = <div tabIndex="0"></div>

// 也可以使用大括号来定义以 JavaScript 表达式为值的属性
const element = <img src={user.avatarUrl}></img>
```

### JSX 本质

Babel 转译器会把 JSX 转换成一个名为 `React.createElement()` 的方法调用。

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
)

// 等同于
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
)
```

## 元素渲染

> 元素是构成 React 应用的最小单位。

### 将元素渲染到 DOM 中

可以通过 `ReactDOM.render()` 方法把 React 元素渲染到根 DOM 节点中：

```js
const element = <h1>Hello, world</h1>
ReactDOM.render(
  element,
  document.getElementById('root')
)
```

### 更新元素渲染

举一个计时器的例子。

**简单粗暴系列**：

```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  )
  ReactDOM.render(
    element,
    document.getElementById('root')
  )
}

setInterval(tick, 1000)
```

上面方法通过每秒创建一个新的元素，并使用 `ReactDOM.render()` 方法更新页面内容；

虽然乍一眼看上去十分消耗性能，不过 React 为我们做了一层虚拟 DOM，渲染过程中只会更新**发生了变化的部分**。

这样，即便我们每秒都创建了一个描述整个 UI 树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容。

## 组件 & Props

这里的概念和 Vue 类似，就不再多赘述。

### 定义组件

「定义组件」的方式有两种：

1. 使用 JavaScript 函数：

    ```js
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>
    }
    ```

2. 也可以使用 ES6 class 来定义一个组件：

    ```js
    class Welcome extends React.Component {
        render() {
            return <h1>Hello, {this.props.name}</h1>
        }
    }
    ```

### 使用

```js
const element = <Welcome name="Bigno"/>
ReactDOM.render(element, document.getElementById('root'))
```

在这过程中间，React 将 `<Welcome name="Bigno"/>` 的属性提取出来 `{ name: 'Bigno' }` 作为参数 `props` 传入 Welcome 组件；

接下来，组件调用 `render()` 函数，使用 `this.props.name` 取到前面的属性 `name`，并返回一个 `<h1>Hello, Bigno</h1>` 元素。

React DOM 将 DOM 渲染为 `<h1>Hello, Sara</h1>`。

❗️ 需要注意的是：

1. 组件名称**必须**以大写字母开头；
2. 组件的返回值**只能**有一个根元素；
3. `Props` 具有只读性，它是不可修改的。

## State & 生命周期

「状态」与「属性」十分相似，但是状态是 **私有** 的，完全受控于当前组件。

`this.state` 一般用来存放与视觉输出相关的属性（ 即需要在 `render()` 方法中使用 ），否则其他属性应该存在 `this` 的其他字段下。（ 除了 `this.props`、`this.state` 等具有特殊含义的之外 ）

如果需要更新 `state` 中的属性，就需要使用 `setState()` 方法进行设置：

```js
constructor(props) {
  super(props) // 类组件应始终使用 props 调用基础构造函数
  this.state = {
    date: new Date()
  }
}
// ...

tick() {
  this.setState({
    date: new Date()
  })
}
```

例子见 [demo3](./demo/demo3.html)。

关于使用 `setState()`，需要注意的有：

- **不要直接更新状态**

    比如使用 `this.state.comment = 'Hello'`，因为这样不会触发重新渲染组件。

    应该使用 `this.setState({comment: 'Hello'})`。

    构造函数（ `constructor` ）是唯一能够初始化 `this.state` 的地方。

- **状态更新可能是异步的**

    如果你的状态可能是异步更新的，那么就不应该依靠 `this.state.xxx` 去获取他们的值进行计算。

    这时候应该使用 `setState()` 方法的第二种形式：传入一个函数，这个函数接收两个参数，第一个参数 `prevState` 表示的是先前的状态，第二个参数 `props` 表示的是此次更新被应用时的 `props`。

    ```js
    this.setState((prevState, props) => ({
      counter: prevState.counter + props.increment
    }))
    ```

- **状态更新合并**

    使用 `setState()` 方法更新某个属性的时候，会将传入的对象**合并到当前状态**。

    ```js
    constructor(props) {
      super(props)
      this.state = {
        posts: [],
        comments: []
      }
    }

    /* 可以调用 setState() 独立地更新它们 */

    componentDidMount() {

      fetchPosts().then(response => {
        this.setState({
          posts: response.posts
        })
      })

      fetchComments().then(response => {
        this.setState({
          comments: response.comments
        })
      })
    }
    ```

    这里的合并是浅合并，也就是说 `this.setState({comments})` 完整保留了`this.state.posts`（ 不影响 ），但完全替换了 `this.state.comments`。


在使用「生命周期」前，我们需要把函数转换为类：

1. 创建一个名称扩展为 `React.Component` 的 ES6 类；
1. 创建一个叫做 `render()` 的空方法；
1. 将函数体移动到 `render()` 方法中；
1. 在 `render()` 方法中，使用 `this.props` 替换 `props`；
1. 删除剩余的空函数声明。

使用**类**就允许我们使用其它特性，例如局部状态、生命周期钩子。

- `componentDidMount()`：挂载，组件第一次加载到 DOM 中的时候；
- `componentWillUnmount()`：卸载，DOM 被移除的时候。

## 事件处理

- React 事件绑定属性的命名采用驼峰式写法，而不是小写。
- 如果采用 JSX 的语法你，需要传入一个函数作为事件处理函数，而不是一个字符串 (DOM 元素的写法)

    相比于 HTML 传统写法：

    ```html
    <button onclick="activateLasers()"> Activate Lasers </button>
    ```

    React 写法：

    ```html
    <button onClick={activateLasers}> Activate Lasers </button>
    ```

需要注意的是：

- 在 React 中另一个不同是你不能使用返回 `false` 的方式阻止默认行为。必须在处理函数中明确的使用 `preventDefault`。

    ```js
    function ActionLink() {
      function handleClick(e) {
        e.preventDefault()
        console.log('The link was clicked.')
      }

      return (
        <a href="#" onClick={handleClick}>
          Click me
        </a>
      )
    }
    ```

    让人激动的是，这里的 `e` 是React 根据 W3C spec 进行定义一个合成事件，所以不需要担心跨浏览器的兼容性问题啦~ [👉🏻 合成事件 SyntheticEvent 详情](https://doc.react-china.org/docs/events.html)

- 谨慎对待 JSX 回调函数中的 `this`。

    类的方法默认是不会绑定 `this` 的，如果没有为方法绑定 `this` 值，调用函数的时候 `this` 的值会是 `undefined`。

    所以，这里有三种方法解决：

    第一个是在构造函数中为方法绑定 `this`，如：`this.handleClick = this.handleClick.bind(this)`；

    第二个是使用「属性初始化器语法」：

    ```js
    class LoggingButton extends React.Component {
      handleClick = () => {
        console.log('this is:', this)
      }

      render() {
        return (
          <button onClick={this.handleClick}>
            Click me
          </button>
        )
      }
    }
    ```

    第三个是在回调函数中使用箭头函数：

    ```js
    class LoggingButton extends React.Component {
      handleClick() {
        console.log('this is:', this)
      }

      render() {
        return (
          <button onClick={(e) => this.handleClick(e)}>
            Click me
          </button>
        )
      }
    }
    ```

    一般来说**建议**使用第二种。第三种方法有个问题就是每次 `LoggingButton` 渲染的时候都会创建一个不同的回调函数。在大多数情况下，这没有问题。然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染。

向处理函数传递事件：

```html
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

上面两种方法都 OK，不过在第一种方法中，如果需要传递 React 事件，则需要通过剪头函数显示的向函数进行传递；如果使用第二种 `bind` 方法的话，React 事件会隐式的进行传递，但是接收的话，React 事件是在自定义参数的**后面**接收，如：`preventPop(id, e){ e.preventDefault() alert(name)}`。

## 条件渲染

```js
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn
  if (isLoggedIn) {
    return <UserGreeting/>
  }
  return <GuestGreeting/>
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false}/>,
  document.getElementById('root')
)
```

上面的例子会根据 `props` 中的 `isLoggedIn` 输出不同的内容。

### 元素变量

可以使用变量来储存元素。

```js
render() {
  const isLoggedIn = this.state.isLoggedIn

  let button = null

  if (isLoggedIn) {
    button = <LogoutButton onClick={this.handleLogoutClick} />
  } else {
    button = <LoginButton onClick={this.handleLoginClick} />
  }

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </div>
  )
}
```

### 与运算符 &&

可以通过用「花括号」包裹代码在 JSX 中嵌入**任何表达式** ，也包括 JavaScript 的逻辑与 `&&`，它可以更加方便和优雅地条件渲染一个元素：

```html
<div>
  <h1>Hello!</h1>
  {unreadMessages.length > 0 &&
    <h2>
      You have {unreadMessages.length} unread messages.
    </h2>
  }
</div>
```

之所以能这样做，是因为在 JavaScript 中，`true && expression` 总是返回 `expression`，而 `false && expression` 总是返回 `false`。

因此，如果条件是 `true`，`&&` 右侧的元素就会被渲染，如果是 `false`，React 会忽略并跳过它。

### 三目运算符

```html
<div>
  The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
</div>
```

## 列表 & Keys

```js
const numbers = [1, 2, 3, 4, 5]
const listItems = numbers.map((number) =>
  <li key={number.toString()}>{number}</li>
)

ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
)
```

上面这段代码生成了一个 1 到 5 的数字列表。

### Keys

Keys 可以在 DOM 中的某些元素被增加或删除的时候帮助 React 识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。

一个元素的 `key` 最好是这个元素在列表中拥有的一个独一无二的字符串。

所以，当你在 `map()` 方法的内部调用元素时，你最好随时记得为每一个元素加上一个独一无二的 `key`。

注意，Key 应该是在兄弟之间应该是独一无二的，即只有在它和它的兄弟节点对比时才有意义，所以，比方说，如果你提取出一个 `ListItem` 组件，你应该把 `key` 保存在数组中的这个 `<ListItem />` 元素上，而不是放在 `ListItem` 组件中的 `<li>` 元素上。

## 表单

在 React 中，类似 Vue 中 `v-model`，其值由 React 控制的输入表单元素称为「受控组件」，比如：

```js
handleChange(event) {
  this.setState({value: event.target.value})
}
handleSubmit(event) {
  event.preventDefault()
  alert(this.state.value)
}
```

```html
<form onSubmit={this.handleSubmit}>
  <input type="text" value={this.state.value} onChange={this.handleChange} />
  <input type="submit" value="Submit" />
</form>·
```

在上面代码中，由于 value 属性是在我们的表单元素上设置的，因此显示的值将始终为 React 数据源上 `this.state.value` 的值。由于每次按键都会触发 `handleChange` 来更新当前 React 的 `state`，所展示的值也会随着不同用户的输入而更新。

其中也包括 `<textarea>` 以及 `<select>` 元素。

例外的是 `type=file` 的 `<input>` 标签，由于该标签的 `value` 属性是只读的， 所以它是 React 中的一个非受控组件。

### 多个输入的解决方法

给每个受控组件添加一个 `name`，然后让函数根据 `name` 自行选择做什么。

例子见 [👉🏻 demo7](./demo7.html)

## 状态提升

类似 Vue 中的「父子组件通信」，多说不如直接上手：

例子见 [👉🏻 demo8](./demo8.html)

## 组合 vs 继承

```js
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  )
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  )
}
```

上面代码中 `WelcomeDialog` 组件中的

```html
<h1 className="Dialog-title">
  Welcome
</h1>
<p className="Dialog-message">
  Thank you for visiting our spacecraft!
</p>
```

会被 `FancyBorder` 组件用 `props.children` 的方式插入到 `<div>` 中，所以被传递的所有元素都会出现在最终输出中。

如果你的组件中有多个入口，可以使用以下的方法插入：

```js
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

上面代码中 `<Contacts />` 和 `<Chat />` 这样的 React 元素都是对象，所以你可以像任何其他元素一样传递它们。

## React 理念

- [单一功能原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，在理想状况下，一个组件应该只做一件事情。
- 考虑你的应用所需要的最小可变状态集。要点是 **DRY**：不要重复 (Don’t Repeat Yourself)
- `state` 只在交互的时候使用，即随时间变化的数据。所以在创建静态版本的时候不要使用 `state`。

    考虑是否是 `state`，主要考虑以下三点：

    1. 它是通过 `props` 从父级传来的吗？如果是，他可能不是 `state`。
    2. 它随着时间推移不变吗？如果是，它可能不是 `state`。
    3. 你能够根据组件中任何其他的 `state` 或 `props` 把它计算出来吗？如果是，它不是 `state`。

## 参考资料

[React 中文文档 - 用于构建用户界面的 JavaScript 库](https://doc.react-china.org/)