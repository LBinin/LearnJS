// 给 data 所有属性及子属性添加属性监听
function observe(data, vm) {
  if (!data || typeof data !== 'object') {
    return
  }
  return new Observer(data)
}

function Observer(data) {
  this.data = data
  this.walk(data)
}
Observer.prototype = {
  // 走起！
  walk(data) {
    const me = this

    Object.keys(data).map(key => {
      me.convert(key, data[key])
    })
  },

  // 拦截，去监听属性变动
  convert(key, val) {
    this.defineReactive(this.data, key, val)
  },

  // 监听属性变动
  defineReactive: (data, key, value) => {
    let dep = new Dep() // 初始化一个订阅器
    observe(value) // 监听子属性
  
    Object.defineProperty(data, key, {
      enumerable: true,     // 可枚举
      configurable: false,  // 不能再define
      get: () => {
        // 由于需要在闭包内添加 watcher，所以通过 Dep 定义一个全局 target 属性，暂存 watcher, 添加完移除
        Dep.target && dep.depend()
        return value
      },
      set: newValue => {
        if (newValue === value) { return }
        console.log(`监听到变化，${value} => ${newValue}`)
        value = newValue
        // 监听到变化后需要通知所有订阅者
        dep.notify()
      }
    })
  }
}

let uid = 0
// 订阅器，用来存放订阅者
function Dep() {
  this.subs = []
  this.id = uid++
}
Dep.prototype = {
  // 添加订阅者
  addSub(sub) {
    this.subs.push(sub)
  },

  // 移除订阅者
  removeSub(sub) {
    let index = this.subs.indexOf(sub)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  },

  depend() {
    Dep.target.addToDep(this)
  },

  // 通知所有订阅者
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    });
  }
}
Dep.target = null