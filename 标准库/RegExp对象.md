这里只记录 JavaScript 中 **RegExp** 对象的属性和方法，有关正则可以看下面三篇文章：

[正则表达式30分钟入门教程](http://www.cnblogs.com/deerchao/archive/2006/08/24/zhengzhe30fengzhongjiaocheng.html)

[正则表达式之：零宽断言不『消费』](http://blog.csdn.net/u013291076/article/details/53672750)

[RegExp对象 / 匹配规则](http://javascript.ruanyifeng.com/stdlib/regexp.html#toc10)

---

### 概述

正则表达式（ regular expression ）是一种表达文本模式（即字符串结构）的方法。

JavaScript 新建正则表达式有两种方法。一种是使用**字面量**，以斜杠表示开始和结束，另一种是使用 RegExp 构造函数：

```javascript
var regex = /xyz/

var regex = new RegExp('xyz')
```

它们的主要区别是，第一种方法在编译时新建正则表达式，第二种方法在运行时新建正则表达式。

RegExp 构造函数还可以接受第二个参数，表示修饰符：

```javascript
var regex = /xyz/i
// 等价于
var regex = new RegExp('xyz', "i")
```

考虑到书写的便利和直观，实际应用中，基本上都采用**字面量**的写法。

**正则对象**生成以后，有两种使用方式：

定义以下两个变量：

```javascript
var regex = /w/i
var string = 'Hello World'
```

1. **正则对象**的方法，将字符串作为参数：

    ```javascript
    regex.test(string) // true
    ```

2. **字符串对象**的方法，将正则对象作为参数：

    ```javascript
    string.match(regex) // ["W", index: 6, input: "Hello World"]
    ```

---

### 正则对象的属性

正则对象的属性分成两类：

一类是修饰符相关，返回一个布尔值，表示对应的修饰符是否设置。

另一类是与修饰符无关的属性，主要是 `lastIndex` 和 `source`。

修饰符相关：

> `ignoreCase`：返回一个布尔值，表示是否设置了 i 修饰符，该属性**只读**。
>
> `global`：返回一个布尔值，表示是否设置了 g 修饰符，该属性**只读**。
>
> `multiline`：返回一个布尔值，表示是否设置了 m 修饰符，该属性**只读**。

修饰符无关：

> `lastIndex`：返回下一次开始搜索的位置。该属性**可读写**，但是只在设置了 g 修饰符时有意义。
>
> `source`：返回正则表达式的字符串形式（ 不包括反斜杠与修饰符 ），该属性**只读**。

```javascript
var r = /abc/igm

/* 修饰符相关 */
r.ignoreCase // true
r.global // true
r.multiline // true

/* 修饰符无关 */
r.lastIndex // 0
r.source // "abc"
```

---

### 正则对象的方法

切记！这里都是正则对象的方法！

#### 1. test()

> 返回一个**布尔值**，表示当前模式是否能匹配参数字符串。

如果正则表达式带有 g 修饰符，则每一次 `test()` 方法都从上一次结束的位置开始**向后匹配**。

带有 g 修饰符时，可以通过正则对象的 `lastIndex` 属性指定开始搜索的位置。

如果正则模式是一个空字符串，则匹配所有字符串。

```javascript
/cat/.test('cats and dogs') // true

/* 在全文匹配的条件下，每使用一次 test 都从上一次结束的位置开始向后匹配 */
var r = /x/g
var s = '_x_x'

r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false

/* 指定开始搜索的位置 */
var r = /x/g
var s = '_x_x'

r.lastIndex = 4
r.test(s) // false

/* 正则为空串，则匹配所有字符串 */
new RegExp('').test('abc')
```

注意事项：

`lastIndex` 属性只对同一个正则表达式有效。

```javascript
var count = 0
while (/a/g.test('babaa')) count++
```

上面代码会导致无限循环，因为 **while** 循环的每次匹配条件都是一个新的正则表达式，导致 `lastIndex` 属性总是等于 0。


#### 2. exec()

> 返回匹配结果。如果发现匹配，就返回一个**数组**，成员是每一个匹配成功的子字符串，否则返回 **null**。

`exec` 方法的返回数组还包含以下两个属性：

- `input`：整个原字符串。
- `index`：整个模式匹配成功的开始位置（从0开始计数）。

```javascript
var s = '_x_x'
var r1 = /x/
var r2 = /y/

r1.exec(s) // ["x", index: 1, input: "_x_x"]
r2.exec(s) // null
```



```javascript
var s = '_x_x'
var r = /_(x)/

r.exec(s) // ["_x", "x"]
```

如果正则表示式包含圆括号（ 即含有「组匹配」 ），则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号，以此类推。整个数组的 length 属性等于组匹配的数量再加 1。

如果正则表达式加上 `g` 修饰符，则可以使用多次 `exec` 方法，下一次搜索的位置从上一次匹配成功结束的位置开始。

```javascript
var r = /a(b+)a/g

var a1 = r.exec('_abbba_aba_')
a1 // ['abbba', 'bbb', index: 1, input: "_abbba_aba_"]
a1.index // 1
r.lastIndex // 6

var a2 = r.exec('_abbba_aba_')
a2 // ['aba', 'b', index: 7, input: "_abbba_aba_"]
a2.index // 7
r.lastIndex // 10

var a3 = r.exec('_abbba_aba_')
a3 // null
a3.index // TypeError: Cannot read property 'index' of null
r.lastIndex // 0

var a4 = r.exec('_abbba_aba_')
a4 // ["abbba", "bbb", index: 1, input: "_abbba_aba_"]
a4.index // 1
r.lastIndex // 6
```

可以看到，当第三次匹配结束以后，整个字符串已经到达尾部，正则对象的 `lastIndex` 属性重置为 0，意味着第四次匹配将从头开始。

正则对象的 `lastIndex` 属性不仅可读，还可写。一旦手动设置了 `lastIndex` 的值，就会从指定位置开始匹配。但是，这只在设置了 `g` 修饰符的情况下，才会有效。

如果正则对象是一个**空字符串**，则 `exec` 方法会匹配成功，但返回的也是空字符串。

```javascript
var r1 = new RegExp('')
var a1 = r1.exec('abc')
a1 // ["", index: 0, input: "abc"]
a1.index // 0
r1.lastIndex // 0

var r2 = new RegExp('()')
var a2 = r2.exec('abc')
a2 // ["", "", index: 0, input: "abc"]
a2.index // 0
r2.lastIndex // 0
```

---

### 字符串对象的方法

现在介绍的才是字符串对象的方法，上面两个方法在字符串对象上是不存在的。

在字符串对象的方法中，有4种与正则对象有关：

> `match()`：返回一个**数组**，成员是所有匹配的子字符串。
>
> `search()`：按照给定的正则表达式进行搜索，返回一个**整数**，表示匹配开始的位置。
>
> `replace()`：按照给定的正则表达式进行替换，返回替换后的**字符串**。
>
> `split()`：按照给定规则进行字符串分割，返回一个**数组**，包含分割后的各个成员。

#### 1. String.prototype.match()

> 对字符串进行正则匹配，返回匹配结果。

字符串的 `match` 方法与正则对象的 `exec` 方法非常类似：匹配成功返回一个数组，匹配失败返回 `null`。

如果正则表达式带有 `g` 修饰符，则该方法与正则对象的 `exec` 方法行为不同，会一次性返回所有匹配成功的结果。

```javascript
var s = 'abba'
var r = /a/g

s.match(r) // ["a", "a"]
r.exec(s) // ["a", index: 0, input: "abba"]
```

正则表达式的lastIndex属性，对match方法无效，匹配总是从字符串的第一个字符开始。

```javascript
var r = /a|b/g
r.lastIndex = 7
'xaxb'.match(r) // ['a', 'b']
r.lastIndex // 0
```

#### 2. String.prototype.search()

> 返回**第一个**满足条件的匹配结果在整个字符串中的**位置**。如果没有任何匹配，则返回 -1。该方法会忽略 `g` 修饰符。

```javascript
'_x_x'.search(/x/) // 1
```

#### 3. String.prototype.replace()

> 替换匹配的值。它接受两个参数，第一个是**搜索模式**，第二个是**替换的内容**。

```javascript
// 格式
str.replace(search, replacement)

'aaa'.replace('a', 'b') // "baa"
'aaa'.replace(/a/, 'b') // "baa"
'aaa'.replace(/a/g, 'b') // "bbb"
```

**接下来说一下 `replace()` 方法的第二个参数。**

在第二个参数中可以使用美元符号 $，用来指代所替换的内容。

> `$&` 指代匹配的子字符串。
>
> `$\`` 指代匹配结果前面的文本。
>
> `$'` 指代匹配结果后面的文本。
>
> `$n` 指代匹配成功的第n组内容，n是从1开始的自然数。
>
> `$$` 指代美元符号$。

```javascript
'Hello World'.replace(/(\w+)\s(\w+)/, '$2 $1') // "World Hello"

'abcde'.replace('c', '[$`-$&-$\']') // "ab[ab-c-de]de"
```

此外，第二个参数还可以是一个**函数**，将每一个匹配内容替换为函数返回值。

该替换函数可以接受多个参数：

1. 第一个参数是捕捉到的内容。
2. 第二个参数是捕捉到的组匹配（有多少个组匹配，就有多少个对应的参数）。
3. 此外，最后还可以添加两个参数，倒数第二个参数是捕捉到的内容在整个字符串中的位置（比如从第五个位置开始），最后一个参数是原字符串。

```javascript
'3 and 5'.replace(/[0-9]+/g, function(match){
  return 2 * match
})
// "6 and 10"

var a = 'The quick brown fox jumped over the lazy dog.'
var pattern = /quick|brown|lazy/ig

a.replace(pattern, function replacer(match) {
  return match.toUpperCase()
})
// The QUICK BROWN fox jumped over the LAZY dog.


/* 网页模板替换 */
var prices = {
  'pr_1': '$1.99',
  'pr_2': '$9.99',
  'pr_3': '$5.00'
};

var template = '/* ... */'; // 这里可以放网页模块字符串

template.replace(
  /(<span id=")(.*?)(">)(<\/span>)/g,
  function(match, $1, $2, $3, $4){
    return $1 + $2 + $3 + prices[$2] + $4;
  }
);
```

#### 4. String.prototype.split()

> 按照正则规则分割字符串，返回一个由分割后的各个部分组成的数组。

第一个参数是**分隔规则**，第二个参数是返回数组的**最大成员数**。

```javascript
// 格式
str.split(separator, [limit])

// 非正则分隔
'a,  b,c, d'.split(',')
// [ 'a', '  b', 'c', ' d' ]

// 正则分隔，去除多余的空格
'a,  b,c, d'.split(/, */)
// [ 'a', 'b', 'c', 'd' ]

// 指定返回数组的最大成员
'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]
```