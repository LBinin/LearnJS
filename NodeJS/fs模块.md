### 简介

**fs** 是 **filesystem** 的缩写，该模块提供本地文件的读写能力。

---

### API 介绍

基本上 **fs** 的 API 都有「同步操作」的方法，方法名基本为 `异步方法名称+Sync`。如果没有特别说明都表明除了回调函数，其他参数内容与作用相同，

1. **readFile()**，**readFileSync()**

    > `readFile` 方法用于「异步」读取数据。

    ```javascript
    fs.readFile('./image.png', function (err, buffer) {
      if (err) throw err
      process(buffer)
    })
    ```

    `readFile` 方法接收两个参数：第一个是「文件的路径」，第二个是读取完成后的「回调函数」

    **文件的路径**：可以是相对路径，也可以是绝对路径。需要注意的是，如果是相对路径，则是相对于 `process.cwd()` 方法返回的路径，而不是相对于脚本所在位置的路径。

    **回调函数**：回调函数的第一个参数是错误对象，第二个参数是文件内容的 **`Buffer` 实例**。

    > `readFileSync` 方法用于「同步」读取文件，返回一个**字符串**。

    ```javascript
    var text = fs.readFileSync(fileName, 'utf8')

    // 将文件按行拆成数组
    text.split(/\r?\n/).forEach(function (line) {
      // ...
    })
    ```

    `readFileSync` 方法接收两个参数：第一个参数是「文件路径」，第二个参数可以是一个表示「配置」的对象，也可以是一个表示文本「文件编码」的字符串。

    **文件的路径**：和 `readFile` 方法的第一个参数一样。

    **配置对象**：默认的配置对象是 `{ encoding: null, flag: 'r' }`，即文件编码默认为 `null`，读取模式默认为 `r`（ 只读 ）。

    如果第二个参数指定了编码（ encoding ），返回的是一个**字符串**，否则 `readFileSync` 方法返回一个 **`Buffer` 实例**。

2. **writeFile()**，**writeFileSync()**

    > `writeFile` 方法用于「异步」写入文件。

    ```javascript
    fs.writeFile('message.txt', 'Hello Node.js', (err) => {
      if (err) throw err
      console.log('It\'s saved!')
    })
    ```

    `writeFile` 方法接收三个参数：第一个是「写入的文件名」，第二个是「写入的字符串」，第三个是「回调函数」。

    回调函数前面，还可以再加一个参数，表示写入字符串的「编码」（ 默认是 `utf8` ）。

    ```javascript
    fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback)
    ```

    > `writeFileSync` 方法用于「同步」写入文件。

    ```javascript
    fs.writeFileSync(fileName, str, 'utf8')
    ```

    `writeFileSync` 方法接收三个参数：第一个是「文件路径」，第二个是「写入的字符串」，第三个是「文件编码」，默认为 `utf8`。

3. **exists()**，**existsSync()**

    > 判断给定路径是否存在，然后不管结果如何，都会调用回调函数。

    上了 API 文档看到该接口已经被废弃，建议使用 `fs.stat()` 或 `fs.access()` 代替。

    不建议在调用 `fs.open()` 、`fs.readFile()` 或 `fs.writeFile()` 之前使用 `fs.stat()` 或者 `fs.access()` 检查一个文件是否存在。作为替代，用户代码应该直接打开/读取/写入文件，当文件无效时再处理错误。

    因为其他进程可能在两个调用之间改变该文件的状态，如此处理会造成紊乱情况。

4. **mkdir()**

    > `mkdir` 方法用于**新建目录**。相应的存在同步方法 `mkdirSync`。

    ```javascript
    var fs = require('fs')

    fs.mkdir('./helloDir', 0777, function (err) {
      if (err) throw err
    })
    ```

    `mkdir` 接受三个参数：第一个是「目录名」，第二个是「权限值」，第三个是「回调函数」。

5. **readdir()**

    > `readdir` 方法用于**读取目录**，返回一个所包含的文件和子目录的「数组」。应的存在同步方法 `readdirSync`。

    ```javascript
    fs.readdir(process.cwd(), function (err, files) {
      if (err) {
        console.log(err)
        return
      }

      var count = files.length
      var results = {}
      files.forEach(function (filename) {
        fs.readFile(filename, function (data) {
          results[filename] = data
          count--
          if (count <= 0) {
            // 对所有文件进行处理
          }
        })
      })
    })
    ```

6. **stat()**

    > `stat` 方法的参数是一个「文件或目录」，它产生一个 [fs.Stats](http://nodejs.cn/api/fs.html#fs_class_fs_stats) 类的对象，该对象包含了该文件或目录的「具体信息」。

    我们往往通过该方法，判断正在处理的到底是一个文件，还是一个目录。

    ```javascript
    var fs = require('fs')

    fs.readdir('/etc/', function (err, files) {
      if (err) throw err

      files.forEach( function (file) {
        fs.stat('/etc/' + file, function (err, stats) {
          if (err) throw err

          if (stats.isFile()) {
            console.log("%s is file", file)
          }
          else if (stats.isDirectory ()) {
          console.log("%s is a directory", file)
          }
        console.log('stats:  %s',JSON.stringify(stats))
        })
      })
    })
    ```

7. **watchfile()**，**unwatchfile()**

> `watchfile` 方法监听一个文件，如果该文件发生变化，就会自动触发回调函数。`unwatchfile` 方法用于解除对文件的监听。

    ```javascript
    var fs = require('fs')

    fs.watchFile('./testFile.txt', function (curr, prev) {
      console.log('the current mtime is: ' + curr.mtime)
      console.log('the previous mtime was: ' + prev.mtime)
    })

    fs.writeFile('./testFile.txt', "changed", function (err) {
      if (err) throw err

      console.log("file write complete")   
    })
    ```

8. **createReadStream()**

    > `createReadStream` 方法将创建并返回一个「读取操作的数据流」，往往用于打开**大型**的文本文件。

    所谓大型文本文件，指的是文本文件的体积很大，读取操作的缓存装不下，只能分成几次发送，每次发送会触发一个 `data` 事件，发送结束会触发 `end` 事件。

    `createReadStream` 方法接收两个参数：第一个是「文件路径」，第二个是「[配置选项](http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options)」。

    默认的配置选项为：

    ```javascript
    const defaults = {
      flags: 'r',
      encoding: null,
      fd: null,
      mode: 0o666,
      autoClose: true
    }
    ```

    ```javascript
    var fs = require('fs')

    function readLines(input, func) {
      var remaining = ''
      // 监听 data 也就是监听数据片段的传输
      input.on('data', function(data) {
        remaining += data
        var index = remaining.indexOf('\n')
        var last  = 0
        while (index > -1) {
          var line = remaining.substring(last, index)
          func(line, last, index)
          last = index + 1
          index = remaining.indexOf('\n', last)
        }

        // remaining = ''
        console.log('last = ' + last)
        remaining = remaining.substring(last)
      })

      // 监听 end 事件，也就是数据传输完毕的时候
      input.on('end', function() {
        if (remaining.length > 0) {
          func(remaining)
        }
      })
    }

    function func(data, index, last) {
      console.log('Line(' + index + ', ' + last + '): ' + data)
    }

    var input = fs.createReadStream('./README.md') // 创建一个可读流的对象
    readLines(input, func)
    ```

9. **createWriteStream()**

> `createWriteStream` 方法创建并返回一个「写入数据流对象」，该对象的 `write` 方法用于写入数据，`end` 方法用于结束写入操作。

`createWriteStream` 方法接收两个参数：第一个是「文件路径」，第二个是「[配置选项](http://nodejs.cn/api/fs.html#fs_fs_createwritestream_path_options)」。

默认的配置选项为：

```javascript
const defaults = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
}
```

```javascript
var out = fs.createWriteStream(fileName, {
  encoding: 'utf8'
})
out.write(str)
out.end()
```