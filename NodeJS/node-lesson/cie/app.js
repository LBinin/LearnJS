const express = require('express')
const cheerio = require('cheerio')
const async = require('async')
const superagent = require('superagent')
const url = require('url')
const eventproxy = require('eventproxy')

const app = express()

const cieUrl = 'http://cie.xtu.edu.cn/'

app.get('/', function (req, res, next) {
    var newsUrl = url.resolve(cieUrl, 'ciextu_new/zxdta/index.html')

    if (typeof (req.query.page) != 'undefined') {
        newsUrl = url.resolve(cieUrl, 'ciextu_new/zxdta/index_' + req.query.page + '.html')
    }

    superagent.get(newsUrl)
        .timeout({
            response: 5000,  // Wait 5 seconds for the server to start sending,
            deadline: 60000, // but allow 1 minute for the file to finish loading.
        })
        .end(function (err, sres) {
            err && err.timeout && error('4', '请求超时')
            
            if (sres.text.match(/您的请求已被拦截，原因：/)) {
                error('3', '刷新频率过快')
                return
            }

            const $ = cheerio.load(sres.text)

            var json = [] // 接口信息

            const ep = eventproxy()
            ep.after('get', 2, function () {
                res.send({
                    code: 0,
                    msg: '成功',
                    data: json
                })
            })

            // 获取地址、发布时间、标题
            $('#change_list').each(function (index, element) {
                const $element = $(element)
                const time = $element.text().substr(1, 10)
                const title = $element.text().substr(12).trim()
                const href = $element.attr('href')
                var pattern = new RegExp(/\/(\d+)\.html/)
                json.push({
                    id: pattern.exec(href)[1],
                    url: url.resolve(newsUrl, href),
                    time: time,
                    title: title,
                })
            })

            // 获取点击量
            async.mapLimit(json, 5, function (item, callback) {
                const clickUrl = url.resolve(cieUrl, 'ciextu_new/e/public/ViewClick/?classid=59&id=' + item.id)

                superagent.get(clickUrl)
                    .end(function (err, innerInfo) {
                        if (typeof (innerInfo) == 'undefined') {
                            error('1', '获取点击量失败')
                        } else {
                            callback(null, [json.indexOf(item), innerInfo.text])
                        }
                    })
            }, function (err, result) {
                result.forEach(function (item) {
                    var id = parseInt(item[0])
                    if (item[1].match(/(\d+)/g).length > 1) {
                        json[id]['click'] = -1
                    } else {
                        json[id]['click'] = parseInt(item[1].match(/(\d+)/g)[0].trim(0))
                    }
                })
                ep.emit('get')
            })

            // 获取第一张图片
            async.mapLimit(json, 5, function (item, callback) {
                superagent.get(item.url)
                    .end(function (err, innerInfo) {
                        if (typeof (innerInfo) == 'undefined') {
                            error('2', '获取图片失败')
                        } else {
                            callback(null, [json.indexOf(item), innerInfo.text])
                        }
                    })
            }, function (err, result) {
                result.forEach(function (item) {
                    var id = parseInt(item[0])

                    const $ = cheerio.load(item[1])
                    const images = $('img')
                    if (images.length > 0) {
                        json[id]['img'] = url.resolve(cieUrl, images.eq(0).attr('src'))
                    }
                })
                ep.emit('get')
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