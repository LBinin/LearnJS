## 基础类型

### 布尔值 boolean

```ts
let isDone: boolean = false
```

### 数字 number

TypeScript 支持除了十进制和十六进制，还支持 ES5 引入的二进制和八进制字面量：

```ts
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744
```

### 字符串 string

```ts
let name: string = "bob"
let name: string = `Gene` // 模板字符串
```

### 数组

```ts
let list: number[] = [1, 2, 3] // 在类型后加 [] 表示由此类型元素组成的一个数组
let list: Array<number> = [1, 2, 3] // 使用数组泛型，形如 `Array<元素类型>`
```

### 元组 Tuple

```ts
// Declare a tuple type
let x: [string, number]

// Initialize it
x = ['hello', 10] // OK
// Initialize it incorrectly
x = [10, 'hello'] // Error
```

### 枚举 enum

```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green
```

转义出来：

```ts
var Color
(function (Color) {
    Color[Color["Red"] = 0] = "Red"
    Color[Color["Green"] = 1] = "Green"
    Color[Color["Blue"] = 2] = "Blue"
})(Color || (Color = {}))
var c = Color.Green
```

上面的代码就容易理解了，Color 中的内容为 `{ '0': 'Red', '1': 'Green', '2': 'Blue', Red: 0, Green: 1, Blue: 2 }`。

### Any

用来指定一个不确定的变量类型。

```ts
let notSure: any = 4
notSure = "maybe a string instead"
notSure = false // okay, definitely a boolean
```

### Void

一般用于无返回值的函数返回值类型设置：

```ts
let unusable: void = undefined
unusable = null

function warnUser(): void {
    alert("This is my warning message")
}
```

### Never

当函数必须存在无法达到的终点的时候使用：

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message)
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
        /* code */
    }
}
```

### 类型断言

实际相当于类型转换：

```ts
// 使用尖括号语法
let someValue: any = "this is a string"
let strLength: number = (<string>someValue).length

// 或者使用 as 关键字
let someValue: any = "this is a string"
let strLength: number = (someValue as string).length
```

## 接口

举个例子：

```ts
interface LabelledValue {
  label: string
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label)
}

let myObj = {size: 10, label: "Size 10 Object"}
printLabel(myObj)
```

上面代码中的用 `interface` 关键字声明了一个接口变量 `LabelledValue`。

接口就好比一个名字，用来描述上面例子中函数参数的要求。它代表了有一个 `label` 属性且类型为 `string` 的对象。

需要注意的是：类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就是被允许的。

检查器不会检查例子中多余的属性，但是会检测出缺少的属性；如果其中一个属性在某些条件下存在，或者根本不存在的话，我们可以设置其为「可选属性」，即在对应属性后加上 `?`：

```ts
interface SquareConfig {
  color?: string
  width?: number
}
```

### 只读属性

可以在属性名前用 `readonly` 来指定只读属性，这些属性只能在对象刚刚创建的时候修改其值：

```ts
interface Point {
    readonly x: number
    readonly y: number
}
```

可选属性的好处之一是可以对可能存在的属性进行「预定义」，好处之二是可以捕获引用了不存在的属性时的错误。

### 函数类型

这类接口可以用来描述函数类型：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {
  let result = source.search(subString)
  return result > -1
}
```

上述内容表示定义了一个 `SearchFunc` 的函数类型，这个函数接收两个 `string` 类型的参数，并返回一个 `boolean` 类型的值。

对于函数类型的类型检查来说，函数的参数名**不需要**与接口里定义的名字相匹配，只需要**对应位置**上的参数类型是兼容的，所以，下面的例子也是可以的：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function(src: string, sub: string) {
  let result = src.search(sub)
  return result > -1
}
```

### 可索引的类型

可索引类型具有一个「索引签名」，它描述了对象**索引的类型**，还有相应的索引返回值类型。

```ts
interface StringArray {
  [index: number]: string;
}
```

上面代码中定义了 `StringArray` 接口，它具有索引签名。

这个索引签名表示了当用 `number` 类型去索引 `StringArray` 时会得到 `string` 类型的返回值。

## 类

❗️ 需要注意的是，在构造函数的参数上使用 `public` 等同于创建了**同名的成员变量**。

```ts
class Student {
    fullName: string
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName
    }
}
```

上面代码转化后：

```ts
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName
        this.middleInitial = middleInitial
        this.lastName = lastName
        this.fullName = firstName + " " + middleInitial + " " + lastName
    }
    return Student
}())
```

## 参考资料

[文档简介 · TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/docs/home.html)