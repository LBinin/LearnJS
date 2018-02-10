话不多说，npm 应该不需要介绍了。有需要的可以到 [npm 官网](https://www.npmjs.com/) 了解详情。

这里提供一下 [npm 中文文档](https://www.npmjs.com.cn/) 地址，方便查阅。

---

### npm init

> `npm init` 用来初始化生成一个新的 `package.json` 文件。

它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。

如果使用了 `-f`（ 代表 **force** ）、`-y`（ 代表 **yes** ），则跳过提问阶段，直接生成一个新的 `package.json` 文件，如 `npm init -y`。

---

### npm set

> `npm set` 用来设置环境变量。

```bash 
$ npm set init-author-name 'Your name'
$ npm set init-author-email 'Your email'
$ npm set init-author-url 'http://yourdomain.com'
$ npm set init-license 'MIT'
```

设置了默认值，以后执行 `npm init` 的时候，`package.json` 的作者姓名、邮件、主页、许可证字段就会自动写入预设的值。

这些信息会存放在用户主目录的 `~/.npmrc` 文件，使得用户不用每个项目都输入。

如果某个项目有不同的设置，可以针对该项目运行 `npm config`。

---

### npm install

每个模块可以「全局安装」，也可以「本地安装」。

**全局安装**：指的是将一个模块安装到**系统目录**中，各个项目都可以调用。一般来说，全局安装只适用于工具模块，比如 `eslint` 和 `gulp`。

**本地安装**：指的是将一个模块下载到**当前项目**的 `node_modules` 子目录，然后只有在项目目录之中，才能调用这个模块。

```bash
# 本地安装
$ npm install <package name>

# 全局安装
$ sudo npm install -global <package name>
$ sudo npm install -g <package name>
```

安装之前，`npm install` 会先检查，`node_modules` 目录之中是否已经存在指定模块。如果存在，就不再重新安装了，即使远程仓库已经有了一个新版本，也是如此。

如果需要强制重新安装，可以使用 `-f` 或 `--force` 参数。

`npm install` 默认会安装 `dependencies` 字段和 `devDependencies` 字段中的所有模块，如果使用 `--production` 参数，可以只安装 `dependencies` 字段的模块。

```bash
$ npm install --production
# 或者
$ NODE_ENV=production npm install
```

#### 安装不同版本的模块

npm 的 `install` 命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上 `@` 和版本号。

```bash
$ npm install sax@latest
$ npm install sax@0.1.1
$ npm install sax@">=0.1.0 <0.2.0"
```

`install` 命令可以使用不同参数，指定所安装的模块属于哪一种性质的依赖关系，即出现在 `packages.json` 文件的 `dependencies` 还是 `devDependencies` 字段中。

`–save`：模块名将被添加到 `dependencies`，可以简化为参数-S。
`–save-dev`: 模块名将被添加到 `devDependencies`，可以简化为参数-D。

```bash
$ npm install sax --save
$ npm install node-tap --save-dev
# 或者
$ npm install sax -S
$ npm install node-tap -D
```

另外，`install` 可以简写为 `i`，比如：`npm i eslint -D`。

当我们安装好需要的模块后就可以在文件中愉快的 `require` 啦~

---

### npm run

npm 不仅可以用于模块管理，还可以用于执行脚本。

在前面的 [package.json 文件](./packagejson文件.md) 中介绍过，`package.json` 文件有一个 `scripts` 字段，可以用于指定脚本命令，供 npm 直接调用。

npm 内置了两个命令简写，`npm test` 等同于执行 `npm run test`，`npm start` 等同于执行 `npm run start`。

**举个例子：**

现在我们来安装使用一下 **ESLint**：

```bash
npm i eslint --save-dev
```

运行上面的命令以后，会产生两个结果：

1. 首先，**ESLint** 被安装到当前目录的 `node_modules` 子目录；
2. 其次，`node_modules/.bin` 目录会生成一个符号链接 `node_modules/.bin/eslint`，指向 **ESLint** 模块的**可执行脚本**。

所以，我们可以在 `package.json` 文件中不需要带路径的使用 **ESLint**：

```javascript
{
  "name": "Test Project",
  "devDependencies": {
    "eslint": "^1.10.3"
  },
  "scripts": {
    "lint": "eslint ."
  }
}
```

然后，当我们使用 `npm run lint` 的时候，就会自动执行 `./node_modules/.bin/eslint .` 这样的命令。

当然，我们也可以使用 `npm run` 查看当前模块或者工程的 `package.json` 中都有些什么命令（ 也就是 `script` 字段 ）。

#### 参数

`npm run` 命令还能够加上参数，需要在使用命令的时候，在参数之前要加上两个连词线，打个比方：

在 `package.json` 中有如下 `script`：

```javascript
"scripts": {
  "test": "mocha test/"
}
```

如果我们运行 `npm test` 的话就相当于运行 `mocha test/`，现在我们通过命令行来传递参数：

```bash
$ npm run test -- anothertest.js
# 等同于
$ mocha test/ anothertest.js
```

上面命令表示，`mocha` 要运行所有 `test` 子目录的测试脚本，以及另外一个测试脚本 `anothertest.js`。

---

### 内部变量

`scripts` 字段可以使用一些内部变量，主要是 `package.json` 的各种字段。

比如，`package.json` 的内容是 `{"name":"foo", "version":"1.2.5"}`，那么变量 `npm_package_name` 的值是 `foo`，变量 `npm_package_version` 的值是 **1.2.5**。也就是说可以通过 `npm_package_字段名` 获得 `package.json` 文件中字段的值。可以把下划线 `_` 看成 `.` 当做对象来用。