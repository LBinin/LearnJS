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