### 概述

`process` 对象是 **Node** 的一个「全局对象」，提供当前 **Node** 进程的信息。

它可以在脚本的任意位置使用，不必通过 `require` 命令加载。该对象部署了 `EventEmitter` 接口。

---

### 属性

`process` 对象提供一系列属性，用于返回**系统信息**。

- `process.argv`：返回一个**数组**，成员是当前进程的**所有命令行参数**。
- `process.env`：返回一个**对象**，成员为当前 **Shell** 的环境变量，比如 `process.env.HOME`。
- `process.installPrefix`：返回一个**字符串**，表示 **Node** 安装路径的前缀，比如 `/usr/local`。相应地，**Node** 的执行文件目录为 `/usr/local/bin/node`。
- `process.pid`：返回一个**数字**，表示当前进程的「进程号」。
- `process.platform`：返回一个**字符串**，表示当前的操作系统，比如 Linux。
- `process.title`：返回一个**字符串**，默认值为 `node`，可以自定义该值。
- `process.version`：返回一个**字符串**，表示当前使用的 **Node** 版本，比如 `v7.10.0`。

接下来详细介绍一下：

1. **process.argv**

    `process.argv` 属性返回一个数组，由命令行**执行脚本时的各个参数**组成。

    它的第一个成员总是 `node`，第二个成员是「脚本文件名」，其余成员是脚本文件的「参数」。

    ```javascript
    // argv.js
    console.log("argv: ", process.argv)

    // terminal
    $ node argv.js a b c
    [ 'node', '/path/to/argv.js', 'a', 'b', 'c' ]
    ```

2. **process.env**

    > `process.env` 属性返回一个对象，包含了当前 Shell 的**所有环境变量**。

    通常的做法是，新建一个环境变量 `NODE_ENV`，用它确定当前所处的开发阶段，生产阶段设为 **production**，开发阶段设为 **develop** 或 **staging**，然后在脚本中读取 `process.env.NODE_ENV` 即可。

---

### 方法

`process` 对象提供以下方法：

- `process.chdir()`：切换工作目录到**指定目录**。
- `process.cwd()`：返回运行当前脚本的**工作目录的路径**。
- `process.exit()`：退出当前进程。
- `process.getgid()`：返回当前进程的组ID（ 数值 ）。
- `process.getuid()`：返回当前进程的用户ID（ 数值 ）。
- `process.nextTick()`：指定回调函数在当前执行栈的尾部、下一次 **Event Loop** 之前执行。
- `process.on()`：监听事件。
- `process.setgid()`：指定当前进程的组，可以使用数字 ID，也可以使用字符串 ID。
- `process.setuid()`：指定当前进程的用户，可以使用数字 ID，也可以使用字符串 ID。

接下来详细介绍一下：

1. **process.cwd()**，**process.chdir()**

    > `cwd` 方法返回进程的当前目录（ 绝对路径 ），`chdir` 方法用来切换目录。

    注意，`process.cwd()` 与 `__dirname` 的区别。前者「进程」发起时的位置，后者是「脚本」的位置，两者可能是不一致的。

2. **process.nextTick()**

    > `process.nextTick` 将任务放到当前一轮事件循环（ Event Loop ）的尾部。

    `setTimeout(f,0)` 是将任务放到下一轮事件循环的头部，因此 `nextTick` 会比它先执行。另外，`nextTick`的效率更高，因为不用检查是否到了指定时间。

    基本上，根据 **Node** 的事件循环的实现，进入下一轮事件循环后的执行顺序如下：

    1. `setTimeout(f,0)`
    1. 各种到期的回调函数
    1. `process.nextTick push()`, `sort()`, `reverse()`, `splice()`

3. **process.exit()**

    > `process.exit` 方法用来退出当前进程。

    它可以接受一个数值参数，如果参数大于 0，表示执行失败；如果等于 0 表示执行成功。

    一般来说，`process.exit()` 是不需要的，因为一旦事件循环之中没有待完成的任务，**Node** 本来就会退出进程。而且 `exit` 方法将会立即结束进程，不论是否有异步操作正在执行。

    `process.exit()` 执行时，会触发 `exit` 事件。

    另外，进程退出的时候，进程退出时，会返回一个整数值，表示退出时的状态。这个整数值就叫做退出码。
    
    下面是常见的 **Node** 进程退出码：

    - **0**：正常退出
    - **1**：发生未捕获错误
    - **5**：V8执行错误
    - **8**：不正确的参数
    - **128** + 信号值，如果 **Node** 接受到退出信号（ 比如 SIGKILL 或 SIGHUP ），它的退出码就是 **128** 加上信号值。由于 **128** 的二进制形式是 10000000, 所以退出码的后七位就是信号值。


5. **process.kill()**

> `process.kill` 方法用来对指定 ID 的线程**发送信号**，默认为 SIGINT 信号。

```javascript
process.kill(process.pid, 'SIGTERM')
```

4. **process.on()**

    > `process` 对象部署了 `EventEmitter` 接口，可以使用 **on** 方法监听各种事件，并指定回调函数。

    `process` 支持的事件还有下面这些：

    - **data** 事件：数据输出输入时触发。
    - **SIGINT** 事件：接收到系统信号 **SIGINT** 时触发，主要是用户按 <kbd>Ctrl</kbd> + <kbd>c</kbd> 时触发。
    - **SIGTERM** 事件：系统发出进程终止信号 **SIGTERM** 时触发。
    - **exit** 事件：进程退出前触发。

    事件介绍：

    - **exit** 事件

        当前进程退出时，会触发exit事件，可以对该事件指定回调函数。

        注意，监听 `exit` 事件的回调函数只能执行「同步操作」，不能包含**异步操作**，因为执行完回调函数，进程就会退出，无法监听到回调函数的操作结果。

    - **beforeExit** 事件

        `beforeExit` 事件在 **Node** 清空了 Event Loop 以后，再没有任何待处理的任务时触发。正常情况下，如果没有任何待处理的任务，Node 进程会自动退出，设置 `beforeExit` 事件的监听函数以后，就可以提供一个机会，再部署一些任务，使得 **Node** 进程不退出。

        `beforeExit` 事件与 `exit` 事件的主要区别是，`beforeExit` 的监听函数可以部署异步任务，而 `exit` 不行。

        此外，如果是显式终止程序（ 比如调用 `process.exit()` ），或者因为**发生未捕获的错误**，而导致进程退出，这些场合不会触发 `beforeExit` 事件。因此，不能使用该事件替代 `exit` 事件。

    - **uncaughtException** 事件

        当前进程抛出一个没有被捕捉的错误时，会触发 `uncaughtException` 事件。

        部署 `uncaughtException` 事件的监听函数，是免于 **Node** 进程终止的最后措施，否则 **Node** 就要执行 `process.exit()`。
        
        出于除错的目的，并不建议发生错误后，还保持进程运行。

    - 信号事件

        操作系统内核向 **Node** 进程发出信号，会触发信号事件。
        
        实际开发中，主要对 `SIGTERM` 和 `SIGINT` 信号部署监听函数，这两个信号在非 `Windows` 平台会导致进程退出，但是只要部署了监听函数，**Node** ~进程收到信号后就不会退出。