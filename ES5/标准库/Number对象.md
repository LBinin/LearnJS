### Number 对象的属性

>`Number.POSITIVE_INFINITY`：正的无限，指向 Infinity。
>
>`Number.NEGATIVE_INFINITY`：负的无限，指向 -Infinity。
>
>`Number.NaN`：表示非数值，指向 NaN。
>
>`Number.MAX_VALUE`：表示最大的**正数**，相应的，最小的负数为 -Number.MAX_VALUE。
>
>`Number.MIN_VALUE`：表示最小的**正数**（即最接近 0 的正数，在 64 位浮点数体系中为 5e-324），相应的，最接近 0 的负数为 -Number.MIN_VALUE。
>
>`Number.MAX_SAFE_INTEGER`：表示能够精确表示的最大整数，即 9007199254740991。
>
>`Number.MIN_SAFE_INTEGER`：表示能够精确表示的最小整数，即 -9007199254740991。

```javascript
Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN // NaN

Number.MAX_VALUE // 1.7976931348623157e+308
Number.MAX_VALUE < Infinity // true

Number.MIN_VALUE // 5e-324
Number.MIN_VALUE > 0 // true

Number.MAX_SAFE_INTEGER // 9007199254740991
Number.MIN_SAFE_INTEGER // -9007199254740991
```

### Number 对象实例的方法

1. Number.prototype.toString()

    > 将一个数值转为字符串形式。

    `toString()` 方法可以接受一个参数，表示**输出的进制**。如果省略这个参数，默认将数值先转为十进制，再输出字符串；若存在参数，就根据参数指定的进制，将一个数字转化成某个进制的字符串。

    ```javascript
    (10).toString(2) // "1010"
    (10).toString(8) // "12"
    (10).toString(16) // "a"

    /* 可以直接对一个小数使用 toString 方法 */
    10.5.toString() // "10.5"
    10.5.toString(2) // "1010.1"
    10.5.toString(8) // "12.4"
    10.5.toString(16) // "a.8"

    /* 骚操作 */
    10['toString'](2) // "1010"
    ```

    当然，如果需要将其他进制的数转成**十进制**，需要使用 [parseInt()](https://github.com/LBinin/LearnJS/blob/master/%E8%AF%AD%E6%B3%95/%E6%95%B0%E5%80%BC.md#parseint-%E6%96%B9%E6%B3%95) 方法。

2. Number.prototype.toFixed()

    > 将一个数转为指定位数的小数（ 四舍五入 ），返回这个小数对应的**字符串**。

    `toFixed()` 方法的参数为指定的小数位数，有效范围为 0 到 20。

    ```javascript
    (10).toFixed(2) // "10.00"
    10.005.toFixed(2) // "10.01"
    ```

3. Number.prototype.toExponential()

    > 将一个数转为科学计数法形式。

    `toExponential()` 方法的参数表示**小数点后有效数字的位数**，范围为 0 到 100。

    ```javascript
    (10).toExponential()  // "1e+1"
    (10).toExponential(1) // "1.0e+1"
    (10).toExponential(2) // "1.00e+1"

    (1234).toExponential()  // "1.234e+3"
    (1234).toExponential(1) // "1.2e+3"
    (1234).toExponential(2) // "1.23e+3"
    ```

4. Number.prototype.toPrecision()

    > 将一个数转为指定位数的有效数字。

    `toPrecision()` 方法的参数为有效数字的位数，范围是 1 到 100。

    ```javascript
    (12.34).toPrecision(1) // "1e+1"
    (12.34).toPrecision(2) // "12"
    (12.34).toPrecision(3) // "12.3"
    (12.34).toPrecision(4) // "12.34"
    (12.34).toPrecision(5) // "12.340"
    ```

    `toPrecision()` 方法用于四舍五入时不太可靠，跟浮点数不是精确储存有关。

    ```javascript
    (12.35).toPrecision(3) // "12.3"
    (12.25).toPrecision(3) // "12.3"
    (12.15).toPrecision(3) // "12.2"
    (12.45).toPrecision(3) // "12.4"
    ```

### 自定义方法

与其他对象一样，`Number.prototype` 对象上面可以自定义方法，被 **Number** 的实例继承。

需要注意的是，数值的自定义方法，只能定义在它的原型对象 `Number.prototype` 上面，数值本身是无法自定义属性的。

```javascript
Number.prototype.add = function (x) {
  return this + x
};

Number.prototype.subtract = function (x) {
  return this - x;
};

(8).add(2) // 10
(8).add(2).subtract(4) // 6 链式调用
```