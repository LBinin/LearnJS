## 简介

WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。

WXS 代码可以编写在 wxml 文件中的 `<wxs>` 标签内，或以 `.wxs` 为后缀名的文件内。

举例：

```js
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5, 1, 2, 3, 4]
  }
})
```

```html
<!--wxml-->
<!-- 下面的 getMax 函数，接受一个数组，且返回数组中最大的元素的值 -->
<wxs module="m1">
var getMax = function(array) {
  var max = undefined;
  for (var i = 0; i < array.length; ++i) {
    max = max === undefined ? 
      array[i] : 
      (max >= array[i] ? max : array[i]);
  }
  return max;
}

module.exports.getMax = getMax;
</wxs>

<!-- 调用 wxs 里面的 getMax 函数，参数为 page.js 里面的 array -->
<view> {{m1.getMax(array)}} </view>
<!-- 5 -->
```

## 注意

1. wxs 不依赖于运行时的基础库版本，可以在所有版本的小程序中运行。
1. wxs 与 javascript 是不同的语言，有自己的语法，并不和 javascript 一致。
1. wxs 的运行环境和其他 javascript 代码是隔离的，wxs 中不能调用其他 javascript 文件中定义的函数，也不能调用小程序提供的 API。
1. wxs 函数不能作为组件的事件回调。
1. 由于运行环境的差异，在 iOS 设备上小程序内的 wxs 会比 javascript 代码快 2 ~ 20 倍。在 android 设备上二者运行效率无差异。

## .wxs 文件

每一个 `.wxs` 文件和 `<wxs>` 标签都是一个单独的模块。

每个模块都有自己独立的作用域。即在一个模块里面定义的变量与函数，默认为私有的，对其他模块不可见。

一个模块要想对外暴露其内部的私有变量与函数，只能通过 `module.exports` 实现。

### module

每个 `wxs` 模块均有一个内置的 `module` 对象。（同 ES Module）

### require

在 `.wxs` 模块中引用其他 `wxs` 文件模块，可以使用 `require` 函数。

需要注意的是：

- 只能引用 `.wxs` 文件模块，且必须使用相对路径。
- `wxs` 模块均为单例，`wxs` 模块在第一次被引用时，会自动初始化为单例对象。**多个页面，多个地方，多次引用**，使用的都是同一个 `wxs` 模块对象。
- 如果一个 `wxs` 模块在定义之后，一直没有被引用，则该模块不会被解析与运行。

## \<wxs\> 标签

|属性名 |	类型 |	默认值 |	说明|
|---|--|--|--|
|module	| String| |	当前 <wxs> 标签的模块名。必填字段。|
|src|	String| |		引用 .wxs 文件的相对路径。**仅当本标签为单闭合标签或标签的内容为空时有效**。|

## 注意点

- `<wxs>` 模块只能在定义模块的 WXML 文件中被访问到。使用 `<include>` 或 `<import>` 时，`<wxs>` 模块不会被引入到对应的 WXML 文件中。
- `<template>` 标签中，只能使用定义该 `<template>` 的 WXML 文件中定义的 `<wxs>` 模块。