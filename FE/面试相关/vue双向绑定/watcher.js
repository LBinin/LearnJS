/**
 * Watcher 订阅者作为 Observer 和 Compile 之间通信的桥梁，主要做的事情是:
 * 1、在自身实例化时往属性订阅器 (dep) 里面添加自己
 * 2、自身必须有一个 update() 方法
 * 3、待属性变动 dep.notice() 通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。
 */

function Watcher(vm, expOrFn, cb) {
  this.vm = vm
  this.expOrFn = expOrFn
  this.cb = cb
  this.depIds = {}

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  } else {
    this.getter = this.parseGetter(expOrFn)
  }

  // 此处为了触发属性的 getter，从而在 dep 添加自己，结合 Observer 更易理解
  this.value = this.get()
}

Watcher.prototype = {
  update() {
    this.run() // 属性值变化收到通知
  },

  run() {
    let value = this.get(); // 获取最新值
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      // 执行 Compile 中绑定的回调，更新视图
      this.cb.call(this.vm, value, oldVal);
    }
  },

  addToDep(dep) {
    // 1. 每次调用 run() 的时候会触发相应属性的 getter
    // getter 里面会触发 dep.depend()，继而触发这里的 addToDep

    // 2. 假如相应属性的 dep.id 已经在当前 watcher 的 depIds 里，说明不是一个新的属性，仅仅是改变了其值而已
    // 则不需要将当前 watcher 添加到该属性的 dep 里

    // 3. 假如相应属性是新的属性，则将当前 watcher 添加到新属性的 dep 里
    // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
    // 则需要将当前 watcher(child.name) 加入到新的 child.name 的 dep 里
    // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的 dep 中
    // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了

    // 4. 每个子属性的 watcher 在添加到子属性的 dep 的同时，也会添加到父属性的 dep
    // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的 watcher 也能收到通知进行 update
    // 这一步是在 this.get() --> this.getVmVal() 里面完成，forEach 时会从父级开始取值，间接调用了它的getter
    // 触发了 addToDep(), 在整个 forEach 过程，当前 watcher 都会加入到每个父级过程属性的 dep
    // 例如：当前 watcher 的是'child.child.name', 那么 child, child.child, child.child.name 这三个属性的dep都会添加当前 watcher
    if (!this.depIds.hasOwnProperty(dep.id)) {
      // 未被添加到订阅器
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },

  get() {
    Dep.target = this                               // 将当前订阅者指向自己
    let value = this.getter.call(this.vm, this.vm)  // 触发 getter，添加自己到属性订阅器中，执行 dep.depend()
    Dep.target = null                               // 添加完毕，重置
    return value
  },

  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) {
      return
    }
    const exps = exp.split('.')
    return obj => {
      for (let i = 0; i < exps.length; i++) {
        if (!obj) {
          return
        }
        obj = obj[exps[i]]
      }
      return obj
    }
  }
}