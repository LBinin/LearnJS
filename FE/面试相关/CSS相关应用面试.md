## HTML 相关

### 知识点

1. HTML 常见元素

    不赘述了。

2. 版本

    HTML 是基于 SGML 的一个应用，不断迭代；SGML 是一个通用的标记语言，XML 是 SGML 的超集。

    XHTML 属于 XML，是对 HTML 进行 XML 严格化的产物；

    HTML5 不属于 SGML 或 XML，是基于 HTML4 的升级，在书写要求上会比 XHTML 宽松些。

    它们的一些约束内容如下：

    |        HTML4         |        XHTML         |        HTML5         |
    | :------------------: | :------------------: | :------------------: |
    |    标签允许不结束    |     标签必须结束     |     标签允许结束     |
    |    属性不用带引号    |    属性必须带引号    |    属性不用带引号    |
    |    标签属性可大写    |   标签属性必须小写   |    标签属性可大写    |
    | Boolean 属性可省略值 | Boolean 属性必须写值 | Boolean 属性可省略值 |

3. 元素分类

    - 按默认样式分类
        - 块级 block
        - 行内 inline（ 内联元素 ）
        - 行内块级 inline-block
    - 按内容分
        
        [https://www.w3.org/TR/html5/dom.html#kinds-of-content](https://www.w3.org/TR/html5/dom.html#kinds-of-content)

4. 嵌套关系

    - 「块级元素」**可以包含**「行内元素」
    - 「块级元素」**不一定包含**「块级元素」如：`<p>` 不能包含「块级元素」
    - 「行内元素」**一般不能包含**「块级元素」如：`<a>` 元素可以包含「块级元素」

5. 默认样式

    最小的 Reset：

    ```css
    * {
        margin: 0;
    }
    ```

    推荐：[**Normalize.css**](https://necolas.github.io/normalize.css/)

---

### 真题

1.  `<!DOCTYPE html>` 的意义是什么？

    历史原因：IE 有一些自己的渲染模型，加上 `DOCTYPE` 会让 IE 以标准模型渲染。

    这样做的好处是：可以让浏览器以标准模式进行渲染，并且让浏览器知道元素的合法性。

2.  HTML、XHTML、HTML5 之间有什么关系？

    HTML 是基于 SGML 的一个应用；SGML 是一个通用的标记语言，XML 是 SGML 的超集。

    XHTML 属于 XML，是 HTML 进行 XML 严格化的产物；

    HTML5 不属于 SGML 或 XML，是基于 HTML4 的升级，在书写要求上会比 XHTML 宽松些。

3.  HTML5 有什么变化？

    - 新的语义化元素，如 `<nav>`、`<section>`、`<article>`、`<footer>` 等。
    - 表单增强，如：表单验证，新的类型 `range`、`number` 等，详见 [HTML5 Input 类型](http://www.w3school.com.cn/html5/html_5_form_input_types.asp)
    - 新的 API，这是最大的变化，如：application-cache、音频视频标签、图形 Canvas 或 SVG、实时通讯 webscoket、本地存储 localstorage、本地存储 indexDB、增加获取定位、加速计、陀螺仪等设备信息的能力。

4. `em` 和 `i` 有什么区别？

    `em` 是语义化的标签，表「强调」；
    在以前，`i` 是纯样式的标签，表「斜体」（ italic ），现在一般用于显示图标，表「icon」。

5. 语义化的意义是什么

    首先，HTML 是一个文档，需要开发者容易阅读和理解，另一方面，机器（ 一些读屏软件、SEO ）也更容易理解页面结构。

6. 那些元素可以自闭合？

    `img`、`input`、`br`、`hr`、`meta`、`link`。

7. HTML 和 DOM 的关系。

    HTML 仅仅只是字符串，而 DOM 是由 HTML 解析而来的一个具有结构的「树」，通过 JavaScript 可以对 DOM 进行维护。

8. property 和 attribute 有什么不同？

    举个例子：`<input type="text" value="1" />`。

    上面的 HTML 属性 `value` 就是一个 attribute，只能通过 `setAttribute` 进行更改，但是 property 是 `$0.value`，可以直接进行 get 和 set 并实时渲染。所以 attribute 是「死」的，property 是「活」的。

9. `form` 的作用有哪些？

    1. 用于直接提交表单。
    2. 使用 `submit` 和 `reset` 按钮。
    3. 便于大部分浏览器保存表单信息。
    4. 第三方库可以整体取值。
    5. 第三方库可以进行表单验证。

---

## CSS 相关

1. 选择器

    1. 匹配 HTMl 元素（ 作用 ）
    2. 分类和权重

        - ID 选择器 `#id`：+ 100
        - 类、属性、伪类选择器：+ 10
        - 元素、伪元素选择器：+ 1
        - 其他选择器：+ 0

        还需要记的一个是：不进位。（ 俗话说：官大一级压死人 ）

    3. 解析方式和性能：选择器表达式从右往左解析，防止范围过大，加快解析速度、寻找元素，性能较好。
    4. 值得关注的选择器
    5. 伪类和伪元素：伪类表示的「状态」而不是某个「元素」，用**单冒号**表示，如 `:hover`；伪元素表示的「元素」（ 某个真实存在的元素 ），用**双冒号**表示，如 `::before`。

2. 非布局样式

    主要内容有：

    - 字体、字重、颜色、大小、行高
    - 背景、边框
    - 滚动、换行
    - 粗体、斜体、下划线

    ---

    1. 字体

        - 字体族：会在这一类字体中寻找某个字体作为渲染字体。

            - 衬线字体：serif，在字的笔画开始、结束的地方有额外的装饰，而且笔画的粗细会有所不同。
            - 非衬线字体：sans serif，没有额外的装饰，而且笔画的粗细差不多。
            - 等宽字体：monospace，字符宽度相同的电脑字体。
            - 手写体：
            - 花体

            需要注意的是，在 `font-family` 中指定字体的时候，字体名称需要用「引号」包裹，字体族不需要，比如：`font-family: 'Microsoft Yahei', serif;`

        - 多字体 fallback

            当指定字体无法找到，就往后继续寻找能够找到的字体。

        - 网络、自定义字体

            ```css
            @font-face {
                font-family: 'name';
                src: url('字体地址，本地或者网络')
            }
            ```

            如果使用网络字体，需要注意跨域的问题。

        - iconfont：详情 [Iconfont-阿里巴巴矢量图标库](http://www.iconfont.cn/)

    2. 行高

        - 行高的构成

            `line-box` 表示一整行的盒子，里面可以有许多 `inline-box`。

            没有标签的内容是「匿名内联元素」。

            `line-height` 可以撑起 `line-box` 的高度，但是不会影响 `inline-box`（ 内联元素 ）布局的高度。

            行高是 `line-box` 的高度，是由 `inline-box` 的高度撑起的。

            `inline-box` 元素的 `background` 是根据字体的顶部和底部渲染的。

        - 行高相关的现象和方案
        - 行高的调整

