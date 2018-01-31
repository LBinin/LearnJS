'use strict';

var pipe = function pipe(value) {
  var funcStack = []; // 存储操作
  // 过滤器
  var oproxy = new Proxy({}, {
    get: function get(pipeObject, fnName) {
      // pipeObject 为上一层传下来的 Proxy 实例
      if (fnName === 'get') {
        // 如果属性名为 get
        return funcStack.reduce(function (val, fn) {
          return fn(val); // 依次调用 funcStack 中的函数，初始值为 value
        }, value);
      }
      funcStack.push(myMath[fnName]); // 不为 get 的话就将操作存入数组
      return oproxy; // 返回 Proxy 实例给下一层使用
    }
  });

  return oproxy;
};

var myMath = {
  double: function double(val) {
    return val * 2;
  },
  pow: function pow(val) {
    return val * val;
  },
  reverseInt: function reverseInt(val) {
    return Number(val.toString().split('').reverse().join('') | 0);
  }
};

console.log(pipe(3).double.pow.reverseInt.get); // 63
