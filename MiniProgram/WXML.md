## 简介

WXML（ WeiXin Markup Language ）是框架设计的一套标签语言，结合基础组件、事件系统，可以构建出页面的结构。

其中有许多地方与 Vue 类似，本篇文章主要记录与 Vue 不同的地方。

## 数据绑定

> WXML 中的动态数据均来自对应 `page.js` 的 `Page()` 参数对象中的 `data` 字段。

举个例子 🌰 ：

```html
<!-- 使用 Mustache 语法（双大括号）将变量包起来 -->
<view> {{ message }} </view>
```

```js
Page({
  data: {
    message: 'Hello Lin!'
  }
})
```

如果在组件属性、控制属性、关键字中使用变量，也需要使用双大括号：

```html
<view id="item-{{id}}"> </view>
<view wx:if="{{condition}}"> </view>
<checkbox checked="{{false}}"> </checkbox>
<!-- 这里需要使用双大括号 -->
<!-- 不要直接写 checked="false"，其计算结果是一个字符串，转成 boolean 类型后代表真值。 -->
<!-- 上面的 wx:if 也是这个道理 -->
<!-- 如果没有加双大括号就会变成字符串 -->
```

```js
Page({
  data: {
    id: 0,
    condition: true
  }
})
```

可以在 `{{}}` 内进行简单的运算，支持的有如下几种方式：

* 三元运算

  ```html
  <view hidden="{{flag ? true : false}}"> Hidden </view>
  ```

* 算数运算

  ```html
  <view> {{a + b}} + {{c}} + d </view>
  ```

* 逻辑判断

  ```html
  <view wx:if="{{length > 5}}"> </view>
  ```

* 字符串运算

  ```html
  <view>{{"hello" + name}}</view>
  ```

* 数据路径运算

  ```html
  <view>{{object.key}} {{array[0]}}</view>
  ```

❗️ 最后一个需要注意的是：花括号和引号之间如果有空格，将最终被解析成为字符串

```html
<view wx:for="{{[1,2,3]}} ">
  {{item}}
</view>
<!-- 等同于 -->

<view wx:for="{{[1,2,3] + ' '}}">
  {{item}}
</view>
```

## 列表渲染

```html
<!--wxml-->
<view wx:for="{{array}}"> {{item}} </view>
```

```js
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5]
  }
})
```

默认数组中每个项目的内容将储存到变量 `item` 中，可以通过属性 `wx:for-item="你的元素变量名"` 去修改。

默认的索引值储存在变量 `index` 中，可以通过属性 `wx:for-index="你的索引变量名"` 去修改。

```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```

### wx:key

如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 `<input/>` 中的输入内容，`<switch/>` 的选中状态），需要使用 `wx:key` 来指定列表中项目的唯一的标识符。

`wx:key` 的值以两种形式提供：

* 字符串，代表在 `for` 循环的 `array` 中 `item` 的某个 `property`，该 `property` 的值需要是列表中唯一的字符串或数字，且不能动态改变。（ 所以在写的时候不需要加上类似 `item.` 的字样，只需要直接在 `wx:key="属性名"` ）
* 保留关键字 `*this` 代表在 `for` 循环中的 `item` 本身，这种表示需要 `item` **本身是一个唯一的字符串或者数字**。

❗️ 需要注意的是：当 `wx:for` 的值为「字符串」时，会将字符串解析成字符串数组：

```html
<view wx:for="array">
  {{item}}
</view>
<!-- 等同于 -->

<view wx:for="{{['a','r','r','a','y']}}">
  {{item}}
</view>
```

## 条件渲染

使用 `wx:if="{{condition}}"` 来判断是否需要「渲染」该代码块：

```html
<!--wxml-->
<view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
<view wx:elif="{{view == 'APP'}}"> APP </view>
<view wx:else="{{view == 'MINA'}}"> MINA </view>
```

```js
// page.js
Page({
  data: {
    view: 'MINA'
  }
})
```

```html
<view wx:if="{{flag ? true : false}}"> Hidden </view>
<view hidden="{{flag ? true : false}}"> Hidden </view>
```

一般来说，`wx:if` 有更高的「切换消耗」而 `hidden` 有更高的「初始渲染消耗」。因此，如果需要频繁切换的情景下，用 `hidden` 更好，如果在运行时条件不大可能改变则 `wx:if` 较好。

## 模板

```html
<!--wxml-->
<!-- 定义模板 -->
<template name="staffName">
  <!-- 使用 name 属性，作为模板的名字。 -->
  <view>
    FirstName: {{firstName}}, LastName: {{lastName}}
  </view>
</template>

<!-- 使用模板 -->
<template is="staffName" data="{{...staffA}}"></template>
<template is="staffName" data="{{...staffB}}"></template>
<template is="staffName" data="{{...staffC}}"></template>
```

`data` 字段传入「对象内容」而不是一个对象，格式如：`firstName: 'Hulk', lastName: 'Hu'` 而不需要括号，所以上方使用的对象解包。

```js
// page.js
Page({
  data: {
    staffA: { firstName: 'Hulk', lastName: 'Hu' },
    staffB: { firstName: 'Shang', lastName: 'You' },
    staffC: { firstName: 'Gideon', lastName: 'Lin' }
  }
})
```

模板拥有自己的**作用域**，只能使用 `data` 传入的数据以及模版定义文件中定义的 `<wxs />` 模块。

## 事件

```html
<view bindtap="add"> {{count}} </view>
```

```js
Page({
  data: {
    count: 1
  },
  add: function(e) {
    this.setData({
      count: this.data.count + 1
    })
  }
})
```

## 参考资料

[WXML · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/)
