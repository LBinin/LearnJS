/**
 * compile 主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图
 * 并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
 */

/**
 * vm 指当前实例
 * node 表所解析的节点
 * exp 指令内表达式 v-model="exp"
 * dir 指令 v-on、v-model 等 `v-` 后面内容
 */

function Compile(el, vm) {
  // 遍历解析的过程有多次操作 DOM 节点
  // 为提高性能和效率，会先将跟节点 el 转换成文档碎片 fragment 进行解析编译操作
  // 解析完成后，再将 fragment 添加回原来的真实 DOM 节点中
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el) // 转换 el 所有的 child
    this.init()                                   // 初始化，解析 fragment
    this.$el.appendChild(this.$fragment)          // 将 fragment 添加到 node 节点下
  }
}

Compile.prototype = {
  // 初始化，解析 fragment
  init() {
    this.compileElement(this.$fragment)
  },

  // 将 node 转换成 fragment
  node2Fragment: (el) => {
    let fragment = document.createDocumentFragment()
    let child;
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  },

  // 解析 node 上的指令
  compile(node) {
    let nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach(attr => {
      // 规定：指令以 v-xxx 命名
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(2) // 取 `v-` 后面的内容，如 model、class、html、on

        if (this.isEventDirective(dir)) {
          // 事件指令，如 v-on:click
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }
      }
    })
  },

  compileElement(el) {
    // 遍历所有节点及其子节点，进行扫描解析编译
    // 调用对应的指令渲染函数进行数据渲染，并调用对应的指令更新函数进行绑定
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(node => {
      const text = node.textContent
      const reg = /{{(.*)}}/

      // 按元素节点编译
      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1)
      }

      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  },

  compileText(node, exp) {
    console.log(node)
    compileUtil.text(node, this.$vm, exp);
  },

  isDirective(attr) {
    return attr.indexOf('v-') === 0;
  },

  isEventDirective(dir) {
    return dir.indexOf('on') === 0;
  },

  isElementNode(node) {
    return node.nodeType === 1;
  },

  isTextNode(node) {
    return node.nodeType === 3;
  }
}

// 更新函数
let updater = {
  textUpdater: (node, value) => {
    node.textContent = typeof value === 'undefined' ? '' : value
    console.log("after", node.textContent)
  },

  htmlUpdater: (node, value) => {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  classUpdater: (node, value, oldValue) => {
    let className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    node.className = [...className.split(' '), ...value.split(' ')].join(' ')
  },

  modelUpdater: (node, value) => {
    console.log(node, value)
    node.value = typeof value === 'undefined' ? '' : value
  }
};

// 指令处理集合
let compileUtil = {
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },

  class(node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  model(node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    const me = this
    let val = this._getVmVal(vm, exp)

    console.log("this is model, is ready add event listener")
    console.log(node)

    node.addEventListener('input', e => {
      const newValue = e.target.value
      console.log(newValue)

      if (val === newValue) {
        return
      }

      me._setVmVal(vm, exp, newValue)
      // val = newValue
    })
  },

  bind(node, vm, exp, dir) {
    const updaterFn = updater[dir + 'Updater'];
    // 初始化视图
    updaterFn && updaterFn(node, this._getVmVal(vm, exp))
    // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者 watcher
    new Watcher(vm, exp, (value, oldValue) => {
      // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
      updaterFn && updaterFn(node, value, oldValue)
    })
  },

  // 事件处理
  eventHandler: (node, vm, exp, dir) => {
    const eventType = dir.split(':')[1] // 获取当前需要处理的名称，如 change、click
    const fn = vm.$options.methods && vm.$options.methods[exp]; // 指令内表达式绑定的函数

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false); // 监听，并在冒泡阶段执行
    }
  },

  _getVmVal: (vm, exp) => {
    // 提供链式调用解析
    let val = vm
    exp = exp.split(".")
    exp.forEach(k => {
      val = val[k]
    })
    return val
  },

  _setVmVal: (vm, exp, value) => {
    let val = vm
    exp = exp.split(".")
    exp.forEach((k, i) => {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    })
    console.log("set vm val", val)
  }
};