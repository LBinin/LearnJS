let isDone: boolean = false

let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744

let name1: string = "bob"
let name2: string = `Gene` // 模板字符串

let list1: number[] = [1, 2, 3] // 在类型后加 [] 表示由此类型元素组成的一个数组
let list2: Array<number> = [1, 2, 3] // 使用数组泛型，形如 `Array<元素类型>`

// Declare a tuple type
let x: [string, number]
// Initialize it
x = ['hello', 10] // OK
// Initialize it incorrectly
x = [10, 'hello'] // Error

enum Color {Red, Green, Blue}
let c: Color = Color.Green