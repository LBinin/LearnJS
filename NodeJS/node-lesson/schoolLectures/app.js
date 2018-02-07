const express = require('express')
const cheerio = require('cheerio')
const async = require('async')
const superagent = require('superagent')
const url = require('url')

const app = express()

const xtuUrl = 'http://www.xtu.edu.cn/'

app.get('/', function (req, res, next) {
  var lectureUrl = url.resolve(xtuUrl, 'xysh/xywh/xsjz/index.html')

  if (typeof (req.query.page) != 'undefined') {
    lectureUrl = url.resolve(xtuUrl, 'xysh/xywh/xsjz/index_' + req.query.page + '.html')
  }

  superagent.get(lectureUrl)
    .timeout({
      response: 5000,  // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .end(function (err, sres) {
      const $ = cheerio.load(sres.text)

      var info = []

      $('.list a').each(function (index, element) {
        const title = $(element).attr('title')
        info.push({
          author: title.substr(0, title.indexOf('】') + 1),
          title: title.substr(title.indexOf('】') + 1, title.lastIndexOf('')),
          url: url.resolve(xtuUrl, $(element).attr('href')),
          public: $(element).find('span').text().trim()
        })
      })

      // 获取详细信息
      async.mapLimit(info, 10, function (item, callback) {
        // const clickUrl = url.resolve(xtuUrl, 'ciextu_new/e/public/ViewClick/?classid=59&id=' + item.id)

        const contentUrl = item.url

        superagent.get(contentUrl)
          .end(function (err, innerInfo) {
            if (typeof (innerInfo) == 'undefined') {
              error('1', '获取详细内容失败')
              console.log('???')
            } else {
              callback(null, [info.indexOf(item), innerInfo.text])
            }
          })
      }, function (err, result) {
        result.forEach(function (item) {
          var id = parseInt(item[0])
          const $ = cheerio.load(item[1])
          var contentInfo = {}

          const searchElement = $('.con-tent-box div').length > $('.con-tent-box p') ? 'div' : 'p'
          
          $('.con-tent-box ' + searchElement).each(function (index, element) {
            const data = $(element).text().trim().replace(/\s+/g, '')
            
            // 寻找时间
            const time = data.match(/时间/)
            if (time && time.length > 0) {
              contentInfo.time = time.input.substring(time.input.indexOf('：') + 1)
            }
            // 寻找地点
            const location = data.match(/地点/)
            if (location && location.length > 0) {
              contentInfo.location = location.input.substring(location.input.indexOf('：') + 1)
            }
          })
          info[id].data = contentInfo
        })
        res.send(info)
      })

    })
  function error(code, msg) {
    res.send({
      code: code,
      msg: msg
    })
    return
  }
})

app.listen(3000, function () {
  console.log('now you can visit this website: localhost:3000')
})