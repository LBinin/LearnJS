## 目录

- [简介](#%E7%AE%80%E4%BB%8B)
- [抛砖](#%E6%8A%9B%E7%A0%96)
- [属性](#%E5%B1%9E%E6%80%A7)
- [理论](#%E7%90%86%E8%AE%BA)
- [引玉](#%E5%BC%95%E7%8E%89)
- [移动端 1px 变粗解决方案](#%E7%A7%BB%E5%8A%A8%E7%AB%AF-1px-%E5%8F%98%E7%B2%97%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)
- [参考资料](#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

## 简介

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

通常，我们都会在 HTML 文档中加入以下的语句：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

这是针对移动端视觉体验做的一个优化，通俗来说用来控制显示网页的那一块区域。

`meta viewport` 标签首先是由苹果公司在其 Safari 浏览器中引入的，目的就是解决移动设备的 `viewport` 问题。后来安卓以及各大浏览器厂商也都纷纷效仿，引入对 `meta viewport` 的支持，事实也证明这个东西还是非常有用的。

## 抛砖

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

在 CSS 中我们一般使用 `px` 作为单位，在**桌面浏览器**中 CSS 的 1 个像素往往都是对应着电脑屏幕的 1 个物理像素，这可能会造成我们的一个错觉，那就是 CSS 中的像素就是设备的「物理像素」。

但实际情况却并非如此，CSS 中的像素只是一个抽象的单位，在不同的设备或不同的环境中，CSS 中的 `1px` 所代表的**设备物理像素**是不同的。

拿 iPhone8 来说，它的物理分辨率为 **750 × 1334**，然鹅它的逻辑分辨率为 **375 × 667**。

何为「逻辑分辨率」？

通俗来说，在 HTML 文档中添加上述 `viewport` 元信息后，我们在 CSS 中使用 `375px` 就能占据页面的整个宽度，但是实际上这个元素的宽度为 750 个像素点，其中「像素比」为 **2**（ 750 / 375 = 2 ）。如果没有添加 `viewport` 元信息，在 iPhone8 上浏览便只能占据一半的宽度。

## 属性

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

> 其中多个属性之间需要使用逗号 `,` 隔开。

- `width`：控制视口的宽度，也就是逻辑像素，这里指逻辑宽度。

    可以像 `width=600` 这样设为确切的像素数，或者设为 `device-width` 这一特殊值来指代比例为 `100%` 时屏幕宽度的 CSS 像素数值。（ 可能对包含基于视口高度调整大小及位置的元素的页面有用 ）

- `height`：控制视口的高度，这里指逻辑高度；可设定数值，或者指定为 `device-height`（ 设备高度 ）。
- `initial-scale`：控制页面最初加载时的缩放比例。
- `maximum-scale`、`minimum-scale`：控制页面放大或缩小的最大（ 最小 ）比例。
- `user-scalable`：表示是否允许使用者缩放，值为 `1` 或 `0`（ `yes` 或 `no` ）。需要注意的是，在 iOS10 及以上，为了提高 Safari 中网站的辅助功能，即使网站在视口中设置了 `user-scalable = no`，用户也可以手动缩放。

## 理论

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

为了方便理解，PPK 大神定义了以下几个概念：

- `layout viewport`：布局视图，也就是页面本身的大小。
- `visual viewport`：视觉视图，也就是浏览器可视区域的大小，即「物理像素」。
- `ideal viewport`：理想视图，也就是「逻辑像素」；通俗来说就是通过 **物理像素 / 像素比** 得到的逻辑像素。

移动设备默认的 `viewport` 是 `layout viewport`，但在进行移动设备网站的开发时，我们需要的是 `ideal viewport`。

## 引玉

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

- 设置 `width` 就相当于是设置了 `layout viewport`。
- 默认的 `initial-scale` 为：`ideal viewport` 宽度 / `visual viewport` 宽度。

    这就是像素比，比如：在 iPhone8 上，物理宽度为 750，逻辑宽度为 375，默认的 `initial-scale` 便为 0.5（ 375 / 750 = 0.5 ），这样页面就不会出现滚动条了。

    但是，一旦被设置了，默认值就不生效了，如果设置了 `initial-scale=1`，当前的 `layout viewport` 宽度会被设为 `ideal viewport` 的宽度。

## 移动端 1px 变粗解决方案

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

移动端 CSS 里面写了 `1px`。但实际看起来比 `1px` 粗，这是因为 `1px` 表示的逻辑像素中的 `1px`，比如在 iPhone8 上，就会变成物理像素中的 `2px`。

**解决方案**：

1. CSS

    ```css
    .border { border: 1px solid #999 }
    @media screen and (-webkit-min-device-pixel-ratio: 2) {
        .border { border: 0.5px solid #999 }
    }
    @media screen and (-webkit-min-device-pixel-ratio: 3) {
        .border { border: 0.333333px solid #999 }
    }
    ```

2. flexible.js

    根据前面的说法，如果能把 `viewport` 宽度设置为实际的设备物理宽度, CSS 里的 `1px` 不就等于实际 `1px` 长了么？在 [flexible.js](https://github.com/amfe/lib-flexible) 中，它就是这么干的。

## 参考资料

[⬆️ 返回目录](#%E7%9B%AE%E5%BD%95)

- [在移动浏览器中使用viewport元标签控制布局 - Mobile | MDN](https://developer.mozilla.org/zh-CN/docs/Mobile/Viewport_meta_tag)
- [iOS 10下 viewport中user-scalable=no 无效，无法禁止用户缩放页面](https://segmentfault.com/q/1010000007109015)