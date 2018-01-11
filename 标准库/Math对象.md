`Math` 是 JavaScript 的内置对象，提供一系列数学常数和数学方法。该对象**不是构造函数**，不能生成实例，所有的属性和方法都必须在 `Math` 对象上调用。

### 属性

`Math` 对象提供以下一些只读的数学常数。

> `Math.E`：常数 e。
>
> `Math.LN2`：2 的自然对数。
>
> `Math.LN10`：10 的自然对数。
>
> `Math.LOG2E`：以 2 为底的 e 的对数。
>
> `Math.LOG10E`：以 10 为底的 e 的对数。
>
> `Math.PI`：常数 Pi。
>
> `Math.SQRT1_2`：0.5 的平方根。
>
> `Math.SQRT2`：2 的平方根。

这些值如下：

```javascript
Math.E // 2.718281828459045
Math.LN2 // 0.6931471805599453
Math.LN10 // 2.302585092994046
Math.LOG2E // 1.4426950408889634
Math.LOG10E // 0.4342944819032518
Math.PI // 3.141592653589793
Math.SQRT1_2 // 0.7071067811865476
Math.SQRT2 // 1.4142135623730951
```

---

### 方法

以下是一些 `Math` 对象提供的数学方法。

> `Math.abs()`：绝对值
>
> `Math.ceil()`：向上取整
>
> `Math.floor()`：向下取整
>
> `Math.max()`：最大值
>
> `Math.min()`：最小值
>
> `Math.pow()`：指数运算
>
> `Math.sqrt()`：平方根
>
> `Math.log()`：自然对数
>
> `Math.exp()`：e的指数
>
> `Math.round()`：四舍五入
>
> `Math.random()`：随机数

#### 1. Math.abs

> 返回参数值的绝对值。

```javascript
Math.abs(1) // 1
Math.abs(-1) // 1
```

#### 2. Math.max()，Math.min()

这两者都可以接受**多个参数**，`Math.max()` 返回其中**最大**的参数，`Math.min()` 返回**最小**的参数。

有趣的是, `Math.min()` 不传参数返回 **Infinity**， `Math.max()` 不传参数返回 **-Infinity**。

```javascript
Math.max(2, -1, 5) // 5
Math.min(2, -1, 5) // -1
Math.min() // Infinity
Math.max() // -Infinity
```

#### 3. Math.floor()，Math.ceil()

`Math.floor()`：接受一个参数，返回小于该参数的最大整数。

`Math.ceil()`：接受一个参数，返回大于该参数的最小整数。

**floor** 为地板，说明返回的值比参数小（ 在下方 ），**ceil** 为天花板，说明返回值要比参数大（ 在上方 ）😉 

```javascript
Math.floor(3.2) // 3
Math.floor(-3.2) // -4

Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3
```

#### 4. Math.round()

> 用于四舍五入.

**注意**，它对负数的处理（主要是对0.5的处理）。

```javascript
Math.round(0.1) // 0
Math.round(0.5) // 1
Math.round(0.6) // 1

Math.round(-1.1) // -1
Math.round(-1.5) // -1
Math.round(-1.6) // -2
```

#### 5. Math.pow()

> 返回以第一个参数为底数、第二个参数为幂的指数值。

```javascript
Math.pow(2, 2) // 4
Math.pow(2, 3) // 8
```

下面是计算圆面积的方法：

```javascript
var radius = 20
var area = Math.PI * Math.pow(radius, 2)
```

#### 6. Math.sqrt()

> 返回参数值的**平方根**。如果参数是一个负值，则返回 `NaN`。

```javascript
Math.sqrt(4) // 2
Math.sqrt(-4) // NaN
```

#### 7. Math.log()

> 返回以 e 为底的自然对数值。

```javascript
Math.log(Math.E) // 1
Math.log(10) // 2.302585092994046
```

如果要计算以 10 为底的对数，可以先用 `Math.log` 求出自然对数，然后除以 `Math.LN10`；求以 2 为底的对数，可以除以 `Math.LN2`。

```javascript
/* 以10为底的对数 */
Math.log(100)/Math.LN10 // 2

/* 求以2为底的对数 */
Math.log(8)/Math.LN2 // 3
```

#### 8. Math.exp()

> 返回常数 e 的参数次方。

```javascript
Math.exp(1) // 2.718281828459045
Math.exp(3) // 20.085536923187668
```

#### 9. Math.random()

> 返回 0 到 1 之间的一个伪随机数，可能等于 0，但是**一定小于** 1。

```javascript
Math.random() // 0.5164310887563837
```

任意范围的**随机数**生成函数如下：

```javascript
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

getRandomArbitrary(1.5, 6.5) // 2.5670475185579553
getRandomArbitrary(1.5, 6.5) // 5.784100208221356
```

任意范围的随机**整数**生成函数如下：

```javascript
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

getRandomInt(1, 6) // 6
getRandomInt(1, 6) // 4
```

返回随机**字符**的例子如下：

```javascript
function random_str(length) {
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz'
  ALPHABET += '0123456789-_'
  var str = ''
  for (var i=0; i < length; ++i) {
    var rand = Math.floor(Math.random() * ALPHABET.length)
    str += ALPHABET.substring(rand, rand + 1)
  }
  return str
}

random_str(6) // "fceHua"
random_str(6) // "jUOtOg"
```

---

### 三角函数方法

Math对象还提供一系列三角函数方法，如下：

> `Math.sin()`：返回参数的正弦
>
> `Math.cos()`：返回参数的余弦
>
> `Math.tan()`：返回参数的正切
>
> `Math.asin()`：返回参数的反正弦（弧度值）
>
> `Math.acos()`：返回参数的反余弦（弧度值）
>
> `Math.atan()`：返回参数的反正切（弧度值）

```javascript
Math.sin(0) // 0
Math.cos(0) // 1
Math.tan(0) // 0
Math.asin(1) // 1.5707963267948966
Math.acos(1) // 0
Math.atan(1) // 0.7853981633974483
```