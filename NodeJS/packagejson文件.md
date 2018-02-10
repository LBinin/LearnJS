### 概述

每个项目的根目录下面，一般都有一个 `package.json` 文件，定义了这个项目所需要的各种模块，以及项目的配置信息（ 比如**名称**、**版本**、**许可证**等元数据 ）。

`npm install` 命令根据这个配置文件，自动下载所需的模块，也就是**配置项目所需的运行和开发环境**。

`package.json` 文件可以手工编写，也可以使用 `npm init` 命令自动生成。

如果一个模块不在 `package.json` 文件之中，可以**单独安装**这个模块，并使用相应的参数，将其写入 `package.json` 文件之中的 `dependencies` 或者 `devDependencies` 属性。

```bash
$ npm install express --save
$ npm install express --save-dev
```

上面代码表示单独安装 `express` 模块，`--save` 参数表示将该模块写入 `dependencies` 属性，`--save-dev` 表示将该模块写入 `devDependencies` 属性。

---

### 各个字段

举例一个完整的 `package.json`：

```javascript
{
	"name": "Hello World",
	"version": "0.0.1",
	"author": "张三",
	"description": "第一个node.js程序",
	"keywords":["node.js","javascript"],
	"repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
	"license":"MIT",
	"engines": {"node": "0.10.x"},
	"bugs":{"url":"http://path/to/bug","email":"bug@example.com"},
	"contributors":[{"name":"李四","email":"lisi@example.com"}],
	"scripts": {
		"start": "node index.js"
	},
	"dependencies": {
		"express": "latest",
		"mongoose": "~3.8.3",
		"handlebars-runtime": "~1.0.12",
		"express3-handlebars": "~0.5.0",
		"MD5": "~1.2.0"
	},
	"devDependencies": {
		"bower": "~1.2.8",
		"grunt": "~0.4.1",
		"grunt-contrib-concat": "~0.3.0",
		"grunt-contrib-jshint": "~0.7.2",
		"grunt-contrib-uglify": "~0.2.7",
		"grunt-contrib-clean": "~0.5.0",
		"browserify": "2.36.1",
		"grunt-browserify": "~1.3.0",
	}
}
```

接下来介绍各个字段：

1. **scripts** 字段

    > 该字段指定了运行脚本命令的 npm 命令行**缩写**，比如 `start` 指定了运行 `npm run start` 时，所要执行的命令。

    ```javascript
    "scripts": {
      "preinstall": "echo here it comes!",
      "postinstall": "echo there it goes!",
      "start": "node index.js",
      "test": "tap test/*.js"
    }
    ```

    上面设置指定了 `npm run preinstall`、`npm run postinstall`、`npm run start`、`npm run test` 时，所要执行的命令。也就是 `npm run scripts对象属性名称` 执行的命令是对应的值。

2. **dependencies** 字段，**devDependencies** 字段

    > `dependencies` 字段指定了项目**运行所依赖的模块**，`devDependencies` 指定项目**开发所需要的模块**。

    它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模块及其版本范围。

    对应的版本可以加上各种限定，主要有以下几种：

    - **指定版本**：比如 `1.2.2`，遵循「大版本.次要版本.小版本」的格式规定，安装时只安装指定版本。
    - **波浪号**（ tilde ）+ 指定版本：比如 `~1.2.2`，表示安装 `1.2.x` 的最新版本（ 不**低**于 1.2.2 ），但是**不安装** `1.3.x`，也就是说安装时**不改变大版本号和次要版本号**。
    - **插入号**（ caret ）+ 指定版本：比如 `ˆ1.2.2`，表示安装 `1.x.x` 的最新版本（ 不**低**于 1.2.2 ），但是**不安装** `2.x.x`，也就是说安装时**不改变大版本号**。

        需要注意的是，如果大版本号为 `0`，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。

    - **latest**：安装最新版本。

5. **main** 字段

    > main 字段指定了加载的入口文件。

    该字段的默认值是 `index.js`。

    配合 `name` 字段，也就是模块名，当其他模块加载该模块的时候，会查询该模块的 `main` 字段，作为被加载模块的入口文件。

3. **peerDependencies** 字段

    > `peerDependencies` 字段，就是用来供插件指定其所需要的主工具的版本。

    也就是当前模块需要依赖的模块和对应的版本，比如：

    ```javascript
    {
      "name": "chai-as-promised",
      "peerDependencies": {
        "chai": "1.x"
      }
    }
    ```

    上面表示安装 `chai-as-promised` 模块时，主程序 `chai` 必须一起安装，而且 `chai` 的版本必须是 `1.x`。如果你的项目指定的依赖是 `chai` 的 **2.0** 版本，就会报错。

    不过从 npm **3.0** 版开始，`peerDependencies` 不再会默认安装了。

4. **bin** 字段

    > `bin` 字段用来指定各个内部命令对应的可执行文件的位置。

    举个例子：

    ```javascript
    scripts: {
      start: './node_modules/someTool/someTool.js build'
    }

    // 简写为
    "bin": {
      "someTool": "./bin/someTool.js"
    }
    scripts: {  
      start: 'someTool build'
    }
    ```

6. **config** 字段

    > `config` 字段用于添加命令行的环境变量。

    打个比方，下面是一个 `package.json` 文件：

    ```javascript
    {
      "name" : "foo",
      "config" : { "port" : "8080" },
      "scripts" : { "start" : "node server.js" }
    }
    ```

    然后在 `server.js` 文件中就能访问到：

    ```javascript
    http
      .createServer(...)
      .listen(process.env.npm_package_config_port)
    ```

    也可以在命令行中改变这个值：

    ```bash
    $ npm config set foo:port 80
    ```

7. **browser** 字段

    > `browser` 字段用于指定该模板供浏览器使用的版本。
    
    像 **Browserify** 这样的浏览器打包工具，通过它就知道该打包那个文件，比如：

    ```javascript
    "browser": {
      "tipso": "./node_modules/tipso/src/tipso.js"
    }
    ```

8. **engines** 字段

    > `engines` 字段指明了该模块运行的平台，比如 **Node** 的某个版本或者浏览器，也可以指定适用的 npm 版本。

    ```javascript
    { "engines" : { "node" : ">=0.10.3 <0.12", "npm" : "~1.0.20" } }
    ```

10. **preferGlobal** 字段

    > `preferGlobal` 的值是**布尔值**。
    
    表示当用户不将该模块安装为全局模块时（ 即不用 `–global` 参数 ），要不要显示警告，表示该模块的本意就是安装为全局模块。

11. **style** 字段

    > `style` 指定供浏览器使用时，样式文件所在的位置。
    
    样式文件打包工具 `parcelify`，通过它知道样式文件的打包位置。