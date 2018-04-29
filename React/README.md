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

上面方法通过每秒创建一个新的元素，并使用 `ReactDOM.render()` 方法更新页面内容；

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