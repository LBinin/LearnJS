function MVVM(options) {
  this.$options = options
  let data = this._data = this.$options.data
  let me = this

  // 属性代理
  Object.keys(data).forEach(key => {
    this._proxyData(key)
  })

  // this._initComputed();

  observe(data, this)
  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  $watch: function(key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxyData(key) {
    const me = this
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get() {
        return me._data[key];
      },
      set(newVal) {
        me._data[key] = newVal;
      }
    });
  }
}