## 概述

大家都知道浏览器使用了资源缓存的方法加快响应速度。

但是，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手。

所以这篇笔记的重点是：通过配置，达到 **webpack** 构建生成的资源能够被客户端（ 通常指浏览器 ）缓存，然鹅在我们更改内容后能够让浏览器请求新的文件。

---



---

## 踩坑

在开启 HMR 的时候使用 `[chunkhash]`，提示

```bash
ERROR in chunk main [entry]
[name].[chunkhash].js
Cannot use [chunkhash] for chunk in '[name].[chunkhash].js' (use [hash] instead)
```

问题原因：

热更新( HMR )不能和 `[chunkhash]` 同时使用。

解决方法：

1. 如果是**开发环境**，将配置文件中的 `[chunkhash]` 替换为 `[hash]`。
2. 如果是**生产环境**，不要使用 HMR，即关闭 `devServe` 中的 `hot` 字段，以及不使用 `webpack.HotModuleReplacementPlugin` 插件。