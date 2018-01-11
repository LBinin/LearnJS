### 概述

`String()` 对象是 JavaScript 原生提供的三个包装对象之一，用来生成字符串的包装对象。

实际上，字符串的包装对象是一个「类数组对象」。

```javascript
new String("abc")
// String {
//   0: "a"
//   1: "b"
//   2: "c"
//   length: 3
// }
```

除了用作构造函数，**String** 对象还可以当作工具方法使用，将任意类型的值转为字符串。

---

### String 对象的静态方法

所谓「静态方法」即定义在对象本身，而不是定义在对象实例的方法。主要是 `String.fromCharCode()`。

**String.fromCharCode()**

> 该方法的参数是一系列 Unicode 码点，返回对应的字符串。

```javascript
String.fromCharCode(104, 101, 108, 108, 111) // "hello"
```

注意，该方法不支持 Unicode 码点大于 `0xFFFF` 的字符，即传入的参数不能大于 `0xFFFF`。

```javascript
String.fromCharCode(0x20BB7) // "ஷ"
```

上面代码返回字符的编号是 `0x0BB7`，而不是 `0x20BB7`。它的根本原因在于，码点大于 `0xFFFF` 的字符占用四个字节，而 JavaScript 只支持两个字节的字符。这种情况下，必须把 `0x20BB7` 拆成两个字符表示。

```javascript
String.fromCharCode(0xD842, 0xDFB7) // "𠮷"
```

---

### String 对象的实例方法和属性

#### 1. length属性

> 返回字符串的长度。

```javascript
'abc'.length // 3
```

#### 2. charAt()

> 返回指定位置的字符，参数是从 0 开始编号的位置。

如果参数为**负数**，或**大于等于字符串的长度**，`charAt` 返回空字符串。

```javascript
var s = new String('abc')

s.charAt(1) // "b"
s.charAt(s.length - 1) // "c"

'Hello'.charAt(1) // "e"
'abc'[1] // "b"
```

#### 3. charCodeAt()

> 返回给定位置字符的 Unicode 码点（ 十进制表示 ），相当于 `String.fromCharCode()` 的逆操作。

如果没有任何参数，`charCodeAt` 返回首字符的 Unicode 码点。

如果参数为负数，或大于等于字符串的长度，`charCodeAt` 返回 `NaN`。

```javascript
'abc'.charCodeAt() // 97
'abc'.charCodeAt(1) // 98
'abc'.charCodeAt(-1) // NaN
```

需要注意的是，`charCodeAt()` 方法返回的 Unicode 码点不大于 65536（0xFFFF），也就是说，只返回两个字节的字符的码点。如果遇到 Unicode 码点大于 65536 的字符，必需连续使用两次 `charCodeAt`，不仅读入 `charCodeAt(i)`，还要读入 `charCodeAt(i+1)`，将两个 16 字节放在一起，才能得到准确的字符。

#### 4. concat()

> 连接两个字符串，返回一个新字符串，不改变原字符串。

该方法可以接受多个参数，会将所有的参数按顺序连接到原字符串的末尾。

如果参数不是字符串，`concat()` 方法会将其先转为字符串，然后再连接。

```javascript
var s1 = 'abc'
var s2 = 'def'

s1.concat(s2) // "abcdef"
s1 // "abc"

'a'.concat('b', 'c', 1) // "abc1"
```

#### 5. slice()

> 从原字符串取出子字符串并返回，不改变原字符串。

`slice()` 方法第一个参数是子字符串的开始位置，第二个参数是子字符串的**结束位置**（不含该位置）。

如果省略第二个参数，则表示子字符串一直到原字符串结束。

如果参数是负值，表示从结尾开始倒数计算的位置，即该负值加上字符串长度。

如果第一个参数大于第二个参数，slice方法返回一个空字符串。

```javascript
'JavaScript'.slice(0, 4) // "Java"

/* 只有一个参数，表示从该位置到结尾 */
'JavaScript'.slice(4) // "Script"

/* 参数是负值，表示从结尾开始倒数计算位置 */
'JavaScript'.slice(-6) // "Script"
'JavaScript'.slice(0, -6) // "Java"
'JavaScript'.slice(-2, -1) // "p"

/* 第一个参数大于第二个参数  */
'JavaScript'.slice(2, 1) // ""
```

#### 6. substring()

建议使用 `slice()` 🤪

#### 7. substr()

> 从原字符串取出子字符串并返回，**不改变原字符串**。

`substr()` 方法的第一个参数是子字符串的开始位置，第二个参数是子字符串的**长度**。

和 `slice()` 的区别就在第二个参数 -=-

如果省略第二个参数，则表示子字符串一直到原字符串的结束。

如果第一个参数是负数，表示倒数计算的字符位置。如果第二个参数是**负数**，将被自动转为 0 ，因此会返回空字符串。

```javascript
'JavaScript'.substr(4) // "Script"
'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
```

#### 8. indexOf()，lastIndexOf()

这两个方法用于确定一个字符串在另一个字符串中的位置，都返回一个整数，表示匹配开始的位置。如果返回 -1，就表示不匹配。

两者的区别在于，`indexOf()` 从字符串头部开始匹配，`lastIndexOf()` 从尾部开始匹配。

它们还可以接受第二个参数，对于 `indexOf()` 方法，第二个参数表示从该位置开始（ 包含该位置 ）向后匹配；对于 `lastIndexOf()`，第二个参数表示从该位置起（ 包含该位置 ）向前匹配。

```javascript
'hello world'.indexOf('o') // 4
'hello world'.lastIndexOf('o') // 7

'JavaScript'.indexOf('script') // -1

'hello world'.indexOf('o', 6) // 7
'hello world'.lastIndexOf('o', 6) // 4
```

#### 9. trim()

> 去除字符串两端的空格，返回一个新字符串，**不改变原字符串**。

该方法去除的不仅是空格，还包括制表符（ `\t`、`\v` ）、换行符（ `\n` ）和回车符（ `\r` ）。

```javascript
'  hello world  '.trim() // "hello world"
'\r\nabc \t'.trim() // 'abc'
```

#### 10. toLowerCase()，toUpperCase()

> 将一个字符串全部转为小写，toUpperCase则是全部转为大写。它们都返回一个新字符串，**不改变原字符串**。

```javascript
'Hello World'.toLowerCase() // "hello world"

'Hello World'.toUpperCase() // "HELLO WORLD"
```

#### 11. localeCompare()

> 用于比较两个字符串。它返回一个整数，如果小于0，表示第一个字符串小于第二个字符串；如果等于0，表示两者相等；如果大于0，表示第一个字符串大于第二个字符串。该方法的最大特点，就是会考虑自然语言的顺序。

```javascript
'apple'.localeCompare('banana') // -1
'apple'.localeCompare('apple') // 0

'B' > 'a' // false
'B'.localeCompare('a') // 1
```

#### 12. match()

> 用于确定原字符串是否匹配某个子字符串，返回一个数组，成员为匹配的第一个字符串，还有index属性和input属性，分别表示匹配字符串开始的位置和原始字符串。如果没有找到匹配，则返回 `null`。

`match` 方法还可以使用正则表达式作为参数。详情见「正则表达式」，虽然还没有开始写 -=-。

```javascript
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```

#### 13. search()

用法等同于 `match()`。但是返回值为匹配的第一个位置。如果没有找到匹配，则返回-1。

```javascript
'cat, bat, sat, fat'.search('at') // 1
```

`search` 方法还可以使用正则表达式作为参数。详情见「正则表达式」。

#### 14. replace()

> 用于替换匹配的子字符串，一般情况下只替换第一个匹配（ 除非使用带有 g 修饰符的正则表达式 ）。

```javascript
'aaa'.replace('a', 'b') // "baa"
```

`replace` 方法还可以使用正则表达式作为参数。详情见「正则表达式」。

#### 15. split()

> 按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组。

- 如果分割规则为**空字符串**，则返回数组的成员是原字符串的每一个字符。
- 如果省略参数，则返回数组的唯一成员就是原字符串。
- 如果满足分割规则的两个部分紧邻着（即中间没有其他字符），则返回数组之中会有一个空字符串。
- 如果满足分割规则的部分处于字符串的开头或结尾（即它的前面或后面没有其他字符），则返回数组的第一个或最后一个成员是一个空字符串。

```javascript
'a|b|c'.split('|') // ["a", "b", "c"]
'a|b|c'.split('') // ["a", "|", "b", "|", "c"]
'a|b|c'.split() // ["a|b|c"]

/* 满足分割规则的两个部分紧邻着或者处于字符串的开头或结尾，结果会有一个空字符串 */
'a||c'.split('|') // ['a', '', 'c']
'|b|c'.split('|') // ["", "b", "c"]
'a|b|'.split('|') // ["a", "b", ""]
```

`split` 方法还可以接受第二个参数，限定返回数组的**最大成员数**。

```javascript
'a|b|c'.split('|', 0) // []
'a|b|c'.split('|', 1) // ["a"]
'a|b|c'.split('|', 2) // ["a", "b"]
'a|b|c'.split('|', 3) // ["a", "b", "c"]
'a|b|c'.split('|', 4) // ["a", "b", "c"]
```

`split` 方法还可以使用正则表达式作为参数。详情见「正则表达式」。