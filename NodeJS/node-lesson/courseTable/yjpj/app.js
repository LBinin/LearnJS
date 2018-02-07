const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()

// const pinjiaourl = 'http://jwxt.xtu.edu.cn/jsxsd/xspj/xspj_edit.do?xnxq01id=2017-2018-1&pj01id=F6C466BC5E234CFB9D43CB7306DABBE8&pj0502id=8CFD2705474B4ACFAEC6AF42ED61A014&jx02id=021301000661&jx0404id=201720181001331&xsflid=&zpf=0&jg0101id=19920461&tktime=1515164856000'

const pinjiaourl = 'http://jwxt.xtu.edu.cn/jsxsd/xspj/xspj_edit.do?xnxq01id=2017-2018-1&pj01id=F6C466BC5E234CFB9D43CB7306DABBE8&pj0502id=8CFD2705474B4ACFAEC6AF42ED61A014&jx02id=021301001394&jx0404id=201720181006920&xsflid=&zpf=0&jg0101id=20022983&tktime=1515166413000'

const saveUrl = 'http://jwxt.xtu.edu.cn/jsxsd/xspj/xspj_save.do'

app.get('/', (req, res, next) => {
  superagent
    .post(pinjiaourl)
    .set({
      'Cookie': 'UM_distinctid=15f75f97ede30-09e7483118eb38-31657c00-1aeaa0-15f75f97edf323; JSESSIONID=5EAFD2966FF8693D602E176DE916AEA1'
    })
    .end((err, sres) => {
      const $ = cheerio.load(sres.text)
      const rows = $('#table1 tr')

      var option = {
        hidden: [],
        score: []
      }

      // 获取隐藏 input 数据
      $('form').find('input[type="hidden"]').each((index, element) => {
        option.hidden.push({
          'name': $(element).attr('name'),
          'value': $(element).attr('value'),
        })
      })

      // 设置评分
      for (var i = 1; i < rows.length - 1; i++) {
        const options = rows.eq(i).find('td').eq(1).find('input')

        const currOption = i == 2 ? 1 : 0 // A -> 0, B -> 1, C -> 2, D -> 3

        option.score.push({
          'text': rows.eq(i).html(),
          'item': rows.eq(i).find('td').eq(0).text().trim(),
          'optionName': options.eq(currOption).attr('name'),
          'optionValue': options.eq(currOption).attr('value'),
        })
      }

      // 整理
      var result = {}

      for (key in option.hidden) {
        result[option.hidden[key]['name']] = option.hidden[key]['value']
      }
      for (key in option.score) {
        result[option.score[key]['optionName']] = option.score[key]['optionValue']
      }

      result.issubmit = '1'
      // result['pj06xh'] = '2'
      result['jynr'] = ''

      console.log(result)
      
      superagent
        .post(saveUrl)
        .type('form')
        .set({
          'Cookie': 'UM_distinctid=15f75f97ede30-09e7483118eb38-31657c00-1aeaa0-15f75f97edf323; JSESSIONID=5EAFD2966FF8693D602E176DE916AEA1'
        })
        .send({'pj06xh': 1})
        .send({'pj06xh': 2})
        .send({'pj06xh': 3})
        .send({'pj06xh': 4})
        .send({'pj06xh': 5})
        .send({'pj06xh': 6})
        .send({'pj06xh': 7})
        .send({'pj06xh': 8})
        .send({'pj06xh': 9})
        .send(result)
        .end((err, xres) => {
          console.log(xres.body)
          res.send(xres.text)
        })

      // res.send(result)
      // res.send(option)
      // res.send(sres.text)
    })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})