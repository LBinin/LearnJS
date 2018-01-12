### 概述

`Date` 对象是 JavaScript 提供的日期和时间的操作接口。它可以表示的时间范围是，1970 年 1 月 1 日 00:00:00 前后的各 1 亿天（单位为毫秒）。// woc 一亿天 -=-

`Date` 对象可以作为普通函数直接调用，返回一个代表当前时间的字符串。

如果直接当做普通函数调用，不论函数有什么参数都会返回一样的内容。

```javascript
Date() // "Thu Jan 11 2018 23:49:27 GMT+0800 (CST)"
```

---

### 构造函数

`Date` 还可以当作**构造函数**使用。对它使用 **new** 命令，会返回一个 `Date` 对象的实例。

作为构造函数时，`Date` 对象可以接受多种格式的参数。如果不加参数，生成的就是代表当前时间的对象。

1. new Date(毫秒)

    > 接受从 1970 年 1 月 1 日 00:00:00 UTC 开始计算的**毫秒数**作为参数。这意味着如果将 Unix 时间戳（单位为秒）作为参数，必须将 Unix 时间戳乘以1000。

    ```javascript
    new Date(1515685843727)
    // Thu Jan 11 2018 23:50:43 GMT+0800 (CST)

    // 1970 年 1 月 2 日的零时
    var Jan02_1970 = new Date(3600 * 24 * 1000)
    // Fri Jan 02 1970 08:00:00 GMT+0800 (CST)

    // 1969 年 12 月 31 日的零时
    var Dec31_1969 = new Date(-3600 * 24 * 1000)
    // Wed Dec 31 1969 08:00:00 GMT+0800 (CST)
    ```

2. new Date(日期字符串)

    > 接受一个**日期字符串**作为参数，返回所对应的时间。

    日期字符串的完整格式是 `month day, year hours:minutes:seconds`，比如 `December 25, 1995 13:30:00`。如果省略了小时、分钟或秒数，这些值会被设为 0。

    ```javascript
    new Date('January 1, 2018')
    // Sun Jan 06 2013 00:00:00 GMT+0800 (CST)
    ```

    事实上，所有可以被 `Date.parse()` 方法解析的日期字符串，都可以当作 **Date** 对象的参数。

    ```javascript
    new Date('2013-2-15')
    new Date('2013/2/15')
    new Date('02/15/2013')
    new Date('2013-FEB-15')
    new Date('FEB, 15, 2013')
    new Date('FEB 15, 2013')
    new Date('Feberuary, 15, 2013')
    new Date('Feberuary 15, 2013')
    new Date('15 Feb 2013')
    new Date('15, Feberuary, 2013')

    // Fri Feb 15 2013 00:00:00 GMT+0800 (CST)
    ```

3. new Date(年, 月 [, 日, 小时, 分钟, 秒, 毫秒])

    > Date 对象还可以接受多个整数作为参数，依次表示年、月、日、小时、分钟、秒和毫秒。如果采用这种格式，最少需要提供**两个**参数（ 年和月 ），其他参数都是可选的，默认等于 0。因为如果只使用「年」这一个参数，Date 对象会将其解释为毫秒数。

    各个参数的取值范围如下：

    > `year`：四位年份，如果写成两位数，则加上 1900。
    >
    > `month`：表示月份，0 表示一月，11 表示 12 月。
    >
    > `date`：表示日期，1 到 31。
    >
    > `hour`：表示小时，0 到 23。
    >
    > `minute`：表示分钟，0 到 59。
    >
    > `second`：表示秒钟，0 到 59。
    >
    > `ms`：表示毫秒，0 到 999。

    注意事项：

    - 除开 `year`，只有 `date` 日期不是从 0 开始！
    - 这些参数如果超出了正常范围，会被自动折算。比如，如果月设为 15，就折算为下一年的 4 月（ 15 - 12 = 3; 3 代表 4 月 ）。
    - 参数还可以使用负数，表示扣去的时间。
    - 年份如果是0到99，会自动加上1900。比如，0表示1900年，1表示1901年；如果为负数，则表示公元前。

    ```javascript
    new Date(2013)
    // Thu Jan 01 1970 08:00:02 GMT+0800 (CST) 解释为毫秒数

    new Date(2013, 0)
    // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

    new Date(2013, 0, 1)
    // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

    new Date(2013, 0, 1, 0)
    // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

    new Date(2013, 0, 1, 0, 0, 0, 0)
    // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

    /* 超出范围 */
    new Date(2013, 15)
    // Tue Apr 01 2014 00:00:00 GMT+0800 (CST)

    /* 使用负数 */
    new Date(2013, -1)
    // Sat Dec 01 2012 00:00:00 GMT+0800 (CST)

    /* 年份为 0 - 99 自动加上 1900 */
    new Date(1, 0)
    // Tue Jan 01 1901 00:00:00 GMT+0800 (CST)
    new Date(1, 0)
    // Tue Jan 01 1901 00:00:00 GMT+0800 (CST)
    new Date(-1, 0)
    // Fri Jan 01 -1 00:00:00 GMT+0800 (CST)
    ```

---

### 日期的运算

类型转换时，**Date** 对象的实例如果转为「数值」，则等于对应的**毫秒数**；

如果转为「字符串」，则等于对应的**日期字符串**。

所以，两个日期对象进行**减法运算**，返回的就是它们**间隔的毫秒数**；进行加**法运算**，返回的就是**连接后的两个字符串**。

```javascript
var d1 = new Date(2000, 2, 1)
var d2 = new Date(2000, 3, 1)

d2 - d1
// 2678400000

d2 + d1
// "Sat Apr 01 2000 00:00:00 GMT+0800 (CST)Wed Mar 01 2000 00:00:00 GMT+0800 (CST)"
```

---

### Date 对象的静态方法

`Date` 对象的静态方法部署在 `Date` 的原型对象（ prototype ）上，不需要创建实例就能使用。

#### 1. Date.now()

> 返回当前距离 1970 年 1 月 1 日 00:00:00 UTC 的毫秒数（ Unix 时间戳乘以1000 ）。

```javascript
Date.now() // 1515687901639
```

使用 `window.performance.now()` 可以获取到比毫秒更精确的时间。它提供页面加载到命令运行时的已经过去的时间，可以精确到**千分之一毫秒**。

```javascript
window.performance.now() // 8528.575
```

#### 2. Date.parse()

> 解析**日期字符串**，返回距离 1970 年 1 月 1 日 00:00:00 的毫秒数。

如果解析失败，返回 `NaN`。

标准的日期字符串的格式，应该完全或者部分符合 **RFC 2822** 和 **ISO 8061**，即 `YYYY-MM-DDTHH:mm:ss.sssZ` 格式，其中最后的 Z 表示**时区**。但是，其他格式也可以被解析：

```javascript
Date.parse('Aug 9, 1995')
// 返回807897600000，以下省略返回值

Date.parse('January 26, 2011 13:51:50')
Date.parse('Mon, 25 Dec 1995 13:30:00 GMT')
Date.parse('Mon, 25 Dec 1995 13:30:00 +0430')
Date.parse('2011-10-10')
Date.parse('2011-10-10T14:48:00')

Date.parse('xxx') // NaN
```

#### 3. Date.UTC()

> 该方法接受年、月、日等变量作为参数，前距离 1970 年 1 月 1 日 00:00:00 UTC 的毫秒数（ UTC = 世界标准时间，比北京时间东八区晚 8 小时，如北京时间早上 8 点，UTC 时区为凌晨 0 点 ）。

该方法的参数用法与 `Date` 构造函数完全一致，比如月从 0 开始计算，日期从 1 开始计算。

```javascript
// 格式
Date.UTC(年, 月[, 日[, 小时[, 分钟[, 秒[, 毫秒]]]]])

// 用法
Date.UTC(2018, 0, 1, 2, 3, 4, 567) // 1514772184567
```

---

### ### Date 对象的实例方法

先介绍一个 `Date.prototype.valueOf()` 方法

> 返回实例对象距离1970年1月1日00:00:00 UTC对应的毫秒数，该方法等同于 `getTime()` 方法（ 下面会介绍 ）。

```javascript
var d = new Date()

d.valueOf() // 1515726987592
d.getTime()() // 1515726987592
```

```javascript
var start = new Date()

doSomething()
var end = new Date()
var elapsed = end.getTime() - start.getTime()
```

接下来，阮老师将 Date 的十几种实例方法分成 3 类：

> to 类：从 Date 对象返回一个**字符串**，表示指定的时间。
>
> get 类：获取 Date 对象的日期和时间。
>
> set 类：设置 Date 对象的日期和时间。

#### 1. to 类方法

1. **Date.prototype.toString()**

    > 返回一个完整的日期字符串。

    因为 `toString()` 是默认的调用方法，所以如果直接读取 Date 对象实例，就相当于调用这个方法。

    ```javascript
    var d = new Date(2018, 0, 1)

    d.toString()
    // "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"

    d
    // "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"
    ```

2. **Date.prototype.toUTCString()**

    > 返回对应的 UTC 时间，也就是比北京时间晚 8 个小时。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toUTCString()
    // "Thu, 11 Jan 2018 16:00:00 GMT"

    d.toString()
    // "Fri Jan 12 2018 00:00:00 GMT+0800 (CST)"
    ```

3. **Date.prototype.toISOString()**

    > 返回对应时间的 ISO8601 写法。

    注意，`toISOString()` 方法返回的总是 UTC 时区的时间。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toString()
    // "Fri Jan 12 2018 00:00:00 GMT+0800 (CST)"

    d.toISOString()
    // "2018-01-11T16:00:00.000Z"
    ```

4. **Date.prototype.toJSON()**

    > 返回一个符合 JSON 格式的 ISO 格式的日期字符串，与 `toISOString()` 方法的返回结果完全相同。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toJSON()
    // "2018-01-11T16:00:00.000Z"

    d.toISOString()
    // "2018-01-11T16:00:00.000Z"
    ```

5. **Date.prototype.toDateString()**

    > 返回日期字符串。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toDateString() // "Fri Jan 12 2018"
    ```

6. **Date.prototype.toTimeString()**

    > 返回时间字符串。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toTimeString() // "00:00:00 GMT+0800 (CST)"
    ```

7. **Date.prototype.toLocaleDateString()**

    > 返回一个字符串，代表日期的当地写法。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toLocaleDateString() // "2018/1/12"
    ```

8. **Date.prototype.toLocaleTimeString()**

    > 返回一个字符串，代表时间的当地写法。

    ```javascript
    var d = new Date(2018, 0, 12)

    d.toLocaleTimeString() // "上午12:00:00"
    ```

#### 2. get 类方法

> **Date** 对象提供了一系列 `get` 方法，用来获取实例对象某个方面的值：

> `getTime()`：返回距离 1970 年 1 月 1 日 00:00:00 的毫秒数，等同于 valueOf 方法。
>
> `getDate()`：返回实例对象对应每个月的几号（ 从 1 开始 ）。
>
> `getDay()`：返回星期几，星期日为 0，星期一为 1，以此类推。
>
> `getYear()`：返回距离 1900 的年数。
>
> `getFullYear()`：返回四位的年份。
>
> `getMonth()`：返回月份（ 0 表示 1 月，11 表示 12 月 ）。
>
> `getHours()`：返回小时（ 0 - 23 ）。
>
> `getMilliseconds()`：返回毫秒（ 0 - 999 ）。
>
> `getMinutes()`：返回分钟（ 0 - 59 ）。
>
> `getSeconds()`：返回秒（ 0 - 59 ）。
>
> `getTimezoneOffset()`：返回当前时间与 UTC 的时区差异，以分钟表示，返回结果考虑到了夏令时因素。

所有的这个 get 方法获取到的到时整数：

**分钟和秒**：0 到 59

**小时**：0 到 23

**星期**：0（ 星期天 ）到 6（ 星期六 ）

**日期**：1 到 31

**月份**：0（ 一月 ）到 11（ 十二月 ）

**年份**：距离 1900 年的年数

也是只有 **日期** 不从 0 开始，除了 **日期** 和 **年份** 是语意化的，其他都不是。

```javascript
var d = new Date()

d.toString() // "Fri Jan 12 2018 10:59:34 GMT+0800 (CST)"

/* 距离1970年1月1日00:00:00的毫秒数 */
d.getTime() // 1515725974102

/* 距离1900的年数 */
d.getYear() // 118

/* 年份 */
d.getFullYear() // 2018

/* 月份（ 从 0 开始 ） */
d.getMonth() // 0

/* 日（ 从 1 开始 ） */
d.getDate() // 12

/* 星期，星期日为 0，星期一为 1 */
d.getDay() // 5

/* 小时（ 0 - 23 ） */
d.getHours() // 10

/* 分钟（ 0 - 59 ） */
d.getMinutes() // 59

/* 秒（ 0 - 59 ） */
d.getSeconds() // 34

/* 毫秒（ 0 - 999 ） */
d.getMilliseconds() // 102

/* 与UTC的时区差异 */
d.getTimezoneOffset() // -480 ( -8 * 60 )
```

如计算本年度还剩下多少天：

```javascript
function leftDays() {
  var today = new Date()
  var endYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
  var msPerDay = 24 * 60 * 60 * 1000
  return Math.round((endYear.getTime() - today.getTime()) / msPerDay)
}
```

在上述 get 方法后加上 UTC 还能返回 UTC 时区的时间。

> `getUTCDate()`
>
> `getUTCFullYear()`
>
> `getUTCMonth()`
>
> `getUTCDay()`
>
> `getUTCHours()`
>
> `getUTCMinutes()`
>
> `getUTCSeconds()`
>
> `getUTCMilliseconds()`

#### 3. set 类方法

> **Date** 对象提供了一系列 `set` 方法，用来设置实例对象的各个方面。

> `setDate(date)`：设置实例对象对应的每个月的几号（ 1 - 31 ），返回改变后毫秒时间戳。
>
> `setYear(year)`：设置距离 1900 年的年数。
>
> `setFullYear(year [, month, date])`：设置四位年份。
>
> `setHours(hour [, min, sec, ms])`：设置小时（ 0 - 23 ）。
>
> `setMilliseconds()`：设置毫秒（ 0 - 999 ）。
>
> `setMinutes(min [, sec, ms])`：设置分钟（ 0 - 59 ）。
>
> `setMonth(month [, date])`：设置月份（ 0 - 11 ）。
>
> `setSeconds(sec [, ms])`：设置秒（ 0 - 59 ）。
>
> `setTime(milliseconds)`：设置毫秒时间戳。

这些方法基本是跟 `get` 方法一一对应的，但是没有 `setDay` 方法，因为星期几是计算出来的，而不是设置的。另外，需要注意的是，凡是涉及到设置月份，都是从0开始算的，即0是1月，11是12月。

`set` 类方法和 `get` 类方法，可以结合使用，得到相对时间：

```javascript
var d = new Date()

// 将日期向后推1000天
d.setDate( d.getDate() + 1000 )

// 将时间设为6小时后
d.setHours(d.getHours() + 6)

// 将年份设为去年
d.setFullYear(d.getFullYear() - 1)
```

并且这些函数都有对应的 UTC 版本，即设置 UTC 时区的时间。

> `setUTCDate()`
>
> `setUTCFullYear()`
>
> `setUTCHours()`
>
> `setUTCMilliseconds()`
>
> `setUTCMinutes()`
>
> `setUTCMonth()`
>
> `setUTCSeconds()`