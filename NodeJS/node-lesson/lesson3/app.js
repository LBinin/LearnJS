import { request } from 'https';

const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

var app = express()

app.get('/', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    const url = "https://cnodejs.org/?tab=all&page="
    for(var i = 1; i < 2; i++) {
        superagent.get(url + i)
            .end(function (err, sres) {
                // 常规的错误处理
                if (err) {
                    return next(err)
                }
                // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
                // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
                // 剩下就都是 jquery 的内容了
                var $ = cheerio.load(sres.text)
                var items = []
                $('#topic_list .topic_title_wrapper').each(function (idx, element) {
                    var $element = $(element)
                    var title = $element.children('.topic_title')
                    items.push({
                        id: idx,
                        type: $element.children('span').text().trim(),
                        title: title.attr('title'),
                        href: "https://cnodejs.org" + title.attr('href')
                    })
                })
    
                res.send(items)
            })
    }
})

app.listen(3000, function() {
    console.log('now you can visit the website: localhost:3000')
})