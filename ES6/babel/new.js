// const a = require('./example.js');
// console.log(a);
// global[Symbol.for('foo')] = 123;
// console.log(Symbol.for('foo') === a.key)
// console.log(Symbol('foo') === a.key)
// const a2 = require('./example.js');
// console.log(a2);

var ha2 = new haha('Hola')
ha2.start()
console.log()

function haha(str) {
  this.x = str

  function start() {
    console.log('start')
  }
}