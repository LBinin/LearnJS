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

`data` 字段传入对象内容而不是一个对象，格式如：`firstName: 'Hulk', lastName: 'Hu'` 而不需要括号，所以上方使用的对象解包。

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
<view bindtap="action"></view>
```

```js
Page({
  action: function(e) {
    console.log(e)

    // e 等于下面对象
    {
      /* BaseEvent 基础事件对象属性列表 */
      "type": "tap",      // 事件类型
      "timeStamp": 895,   // 事件生成时的时间戳（页面打开到触发事件所经过的毫秒数）
      "target": {         // 触发事件的源组件的一些属性值集合，就是用户当前进行操作的组件
        "id": "tapTest",  // 事件源组件的 id
        "dataset": {      // 事件源组件上由data-开头的自定义属性组成的集合
          "hi": "WeChat"
        }
      },
      "currentTarget": {  // 事件绑定的当前组件的一些属性值集合，也就是说当前函数是绑定在哪个组件上
        "id": "tapTest",
        "dataset": {
          "hi": "WeChat"
        }
      },

      /* CustomEvent 自定义事件对象属性列表（继承 BaseEvent） */
      "detail": {         // 额外的信息
        "x": 53,
        "y": 14
      },

      /* TouchEvent 触摸事件对象属性列表（继承 BaseEvent） */
      "touches": [{       // 触摸事件，当前停留在屏幕中的触摸点信息的数组，其中每个元素为一个 Touch 对象，表示当前停留在屏幕上的触摸点。
        "identifier": 0,  // 触摸点的标识符
        "pageX": 53,      // 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
        "pageY": 14,
        "clientX": 53,    // 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
        "clientY": 14
      }],
      "changedTouches": [{// 触摸事件，当前变化的触摸点信息的数组
        "identifier": 0,
        "pageX": 53,
        "pageY": 14,
        "clientX": 53,
        "clientY": 14
      }]
    }
  }
})
```

其中，数据集的命名格式如下：

```html
<view data-alpha-beta="1" data-alphaBeta="2" bindtap="bindViewTap"> DataSet Test </view>
```

```js
Page({
  bindViewTap:function(event){
    event.currentTarget.dataset.alphaBeta === 1 // - 会转为驼峰写法
    event.currentTarget.dataset.alphabeta === 2 // 大写会转为小写
  }
})
```

### detail 字段

自定义事件所携带的数据，如表单组件的提交事件会携带用户的输入，媒体的错误事件会携带错误信息，详见组件定义中各个事件的定义。

点击事件的detail 带有的 x, y 同 pageX, pageY 代表距离文档左上角的距离。

### 事件分类

1. 冒泡事件：当一个组件上的事件被触发后，该事件会向父节点传递。
2. 非冒泡事件：当一个组件上的事件被触发后，该事件不会向父节点传递。

`bind` 事件绑定不会阻止冒泡事件向上冒泡，`catch` 事件绑定可以阻止冒泡事件向上冒泡，如 `bind:tap`、`catch:touchstart`

```html
<!-- 只有冒泡事件 -->
<view id="outer" bindtap="handleTap1">
  handleTap1
  <view id="middle" catchtap="handleTap2">
    handleTap2
    <view id="inner" bindtap="handleTap3">
      handleTap3 handleTap2
    </view>
  </view>
</view>
```

事件的捕获的阶段：

> 自基础库版本 1.5.0 起，触摸类事件支持捕获阶段。捕获阶段位于冒泡阶段之前，且在捕获阶段中，事件到达节点的顺序与冒泡阶段恰好相反。需要在捕获阶段监听事件时，可以采用 `capture-bind`、`capture-catch` 关键字，后者将中断捕获阶段和取消冒泡阶段。

```html
<view id="outer" bind:touchstart="handleTap1" capture-bind:touchstart="handleTap2">
  handleTap2 handleTap1
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    handleTap2 handleTap4 handleTap3 handleTap1
  </view>
</view>

<view id="outer" bind:touchstart="handleTap1" capture-catch:touchstart="handleTap2">
  handleTap2
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    handleTap2
  </view>
</view>
```

## 参考资料

[WXML · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/)
