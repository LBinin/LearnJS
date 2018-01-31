### 有关 JSON

JSON 格式（ JavaScript Object Notation 的缩写 ）是一种用于数据交换的文本格式，2001年由 Douglas Crockford 提出，目的是取代繁琐笨重的 XML 格式。

相比 XML 格式，JSON 格式有两个显著的优点：书写简单，一目了然；符合 JavaScript 原生语法，可以由解释引擎直接处理，不用另外添加解析代码。所以，JSON 迅速被接受，已经成为各大网站交换数据的标准格式，并被写入 ECMAScript 5，成为标准的一部分。

简单说，每个 JSON 对象，就是一个值。要么是简单类型的值，要么是复合类型的值，但是只能是一个值，不能是两个或更多的值。这就是说，每个 JSON 文档只能包含一个值。

### JSON 格式

JSON 对值的类型和格式有严格的规定：

> 复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
>
> 简单类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和 null（不能使用 NaN, Infinity, -Infinity 和 undefined）。
>
> 字符串必须使用**双引号**表示，不能使用**单引号**。
>
> 对象的键名必须放在**双引号**里面。
>
> 数组或对象最后一个成员的后面，**不能加逗号**。

ES5 新增了 JSON 对象，用来处理 JSON 格式数据。它有两个方法：`JSON.stringify()` 和 `JSON.parse()`。

### JSON.stringify()

> 将一个值转为字符串。该字符串符合 JSON 格式，并且可以被 `JSON.parse` 方法还原。

需要注意的是，对于原始类型的字符串，转换结果会带双引号。这是因为将来还原的时候，双引号可以让 JavaScript 引擎知道，该值是一个字符串，而不是一个变量名。

并且 `JSON.stringify()` 方法会忽略对象的不可遍历属性。

```javascript
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"

JSON.stringify([1, "false", false])
// '[1,"false",false]'

JSON.stringify({ name: "张三" })
// '{"name":"张三"}'
```

如果「原始对象」中，有一个成员的值是 undefined、函数或 XML 对象，这个成员会被过滤。

```javascript
var obj = {
  a: undefined,
  b: function () {}
}

JSON.stringify(obj) // "{}"
```

如果「数组」的成员是 undefined、函数或 XML 对象，则这些值被转成 null。

```javascript
var arr = [undefined, function () {}]
JSON.stringify(arr) // "[null,null]"
```

正则对象会被转成空对象。

```javascript
JSON.stringify(/foo/) // "{}"
```

#### JSON.stringify() 的第二个参数

`JSON.stringify()` 方法还可以接受一个数组，作为第二个参数，指定需要转成字符串的属性。

这个类似「**白名单**」的数组，只对对象的属性有效，对数组无效。

```javascript
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
}

var selectedProperties = ['prop1', 'prop2']

JSON.stringify(obj, selectedProperties)
```

此外，第二个参数还可以是一个**函数**，用来更改 `JSON.stringify()` 的默认行为。

这个函数接受两个参数，分别是被转换的对象的**键名**和**键值**。

注意，这个处理函数是递归处理**所有的键**。

```javascript
function f(key, value) {
  if (typeof value === "number") {
    value = 2 * value
  }
  return value
}

JSON.stringify({ a: 1, b: 2 }, f)
// '{"a": 2,"b": 4}'

function f(key, value) {
  if (typeof(value) === "string") {
    return undefined
  }
  return value
}

JSON.stringify({ a: "abc", b: 123 }, f)
// '{"b": 123}'
```

#### JSON.stringify() 的第三个参数

`JSON.stringify()` 还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性。如果是数字，表示每个属性前面添加的空格（ 最多不超过 10 个 ）；如果是字符串（ 不超过 10 个字符 ），则该字符串会添加在每行前面。

感觉不常用呀 😗

```javascript
/* 添加空格 */
JSON.stringify({ p1: 1, p2: 2 }, null, 2)
/*
"{
  "p1": 1,
  "p2": 2
}"
*/

/* 添加字符串 */
JSON.stringify({ p1:1, p2:2 }, null, '|-')
/*
"{
|-"p1": 1,
|-"p2": 2
}"
*/
```

#### toJSON 方法

如果对象有自定义的 `toJSON()` 方法，那么 `JSON.stringify()` 会使用这个方法的「返回值」作为**参数**，而忽略原对象的其他属性。

```javascript
var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName
  },

  toJSON: function () {
    var data = {
      firstName: this.firstName,
      lastName: this.lastName
    }
    return data
  }
}

JSON.stringify(user)
// "{"firstName":"三","lastName":"张"}"
```

再比如，**Date** 对象就有一个自己的 `toJSON` 方法。

```javascript
(new Date()).toJSON()
// "2018-01-12T08:19:09.063Z"
```

---

### JSON.parse()

> 将 JSON 字符串转化成对象。

如果传入的字符串不是有效的 JSON 格式，`JSON.parse()` 方法将报错。

所以为了处理解析错误，可以将 `JSON.parse()` 方法放在 `try...catch` 代码块中。

```javascript
JSON.parse('{}') // {}
JSON.parse('true') // true
JSON.parse('"foo"') // "foo"
JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
JSON.parse('null') // null

var o = JSON.parse('{"name": "张三"}')
o.name // 张三

/* 不符合 JSON 格式 */
JSON.parse("'String'") // illegal single quotes
// SyntaxError: Unexpected token ILLEGAL
```

`JSON.parse` 方法可以接受一个处理函数，用法与 `JSON.stringify()` 方法类似。

```javascript
function f(key, value) {
  if (key === ''){
    return value
  }
  if (key === 'a') {
    return value + 10
  }
}

var o = JSON.parse('{"a":1,"b":2}', f)
o.a // 11
o.b // undefined
```