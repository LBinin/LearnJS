const express = require('express')
const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')

// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
const URL = require('url')
// 得到一个 eventproxy 的实例
const ep = new eventproxy()

const app = express()

app.get('/', function (req, res, next) {
    var cnodeUrl = 'https://cnodejs.org/'
    superagent.get(cnodeUrl)
        .end(function (err, sres) {
            if (err) {
                return next(err)
            }
            var items = []
            var $ = cheerio.load(sres.text)
            // 获取首页所有的链接
            $('#topic_list .topic_title_wrapper').each(function (idx, element) {
                var $element = $(element)
                var title = $element.children('.topic_title')
                items.push({
                    id: idx,
                    type: $element.children('span').text().trim(),
                    title: title.attr('title'),
                    // title.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
                    // 我们用 URL.resolve 来自动推断出完整 url，变成
                    // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
                    // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
                    topicUrl: URL.resolve(cnodeUrl, title.attr('href'))
                })
            })

            // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
            var ii = 1
            ep.after('topic_html', items.length, function (topics) {
                // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

                // 开始行动
                topics = topics.forEach(function (topicPair) {
                    // 接下来都是 jquery 的用法了
                    var topicId = topicPair[0]
                    var topicHtml = topicPair[1]
                    var $ = cheerio.load(topicHtml)

                    items[parseInt(topicId)]['comment'] = $('.reply_content p').eq(0).text().trim()
                })
                res.send(items)
            })

            items.forEach(function (item) {
                superagent.get(item.topicUrl)
                    .end(function (err, res) {
                        ep.emit('topic_html', [item.id, res.text])
                    })
            })

            // console.log(topicUrls)
        })
})


app.listen(3000, function () {
    console.log('localhost:3000')
})