const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

const app = express()

const calendarUrl = 'http://www.xtu.edu.cn/xysh/ggfw/xl/'

app.get('/', function (req, res, next) {

  var calendarInfo = {}

  superagent.get(calendarUrl)
    .timeout({
      response: 5000,  // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .end(function (err, sres) {
      err && err.timeout && error('4', '请求超时')

      var $ = cheerio.load(sres.text)

      // 获取到表格内容 即校历信息
      const content = $('.con-tent-box')
      $ = cheerio.load(content.html()) // 排除干扰

      // 获取校历标题
      const title = content.children('h1').eq(0).text()

      calendarInfo.title = title
      calendarInfo.start = title.match(/\d+/g)[0] // 开始年份
      calendarInfo.end = title.match(/\d+/g)[1]   // 结束年份
      calendarInfo.term = []

      for (var i = 0; i < $('table').length; i++) {
        var table = $('table').eq(i) // 获取表格

        // 获取学期
        const termTitle = table.find('tr').eq(0).text().trim()

        // 获取周数
        var weeks = []
        for (var j = 2; j < table.find('tr').length - 1; j++) {
          const row = table.find('tr').eq(j)
          for (var k = 0; k < 8; k++) {
            const col = row.find('td').eq(k)
            if (k == 0) {
              weeks[col.text().trim()] = []
            } else {
              weeks[weeks.length - 1].push(col.text().trim())
            }
          }
        }

        // 获取备注
        const remarks = table.find('tr').eq(2).find('td').last().find('p')
        var remark = []
        for (var j = 0; j < remarks.length; j++) {
          remark.push(remarks.eq(j).text().trim())
        }

        // 获取注意事项
        const attention = table.find('tr').last().text().trim()

        calendarInfo.term.push({
          title: termTitle,
          week: weeks,
          remark: remark,
          attention: attention
        })
      }

      res.status(200)
      res.send({
        code: 0,
        msg: '成功',
        data: calendarInfo
      })
      function error(code, msg) {
        res.send({
          code: code,
          msg: msg
        })
        return
      }
    })
})

app.listen(3000, function () {
  console.log('now you can visit website with http://localhost:3000')
})