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
