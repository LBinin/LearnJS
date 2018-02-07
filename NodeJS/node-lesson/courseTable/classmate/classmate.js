const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()

const classmateUrl = 'http://jwxt.xtu.edu.cn/common/xs0101_select.jsp?id=xs0101id&name=xs0101xm&type=1&where='

app.get('/student/:name', (req, res, next) => {
  superagent
    .post(classmateUrl)
    .type('form')
    .send({
      'searchName': 'xm',
      'searchJsfh': 'like',
      'searchVal': req.params.name,
    })
    .set({
      'Cookie': 'UM_distinctid=15f75f97ede30-09e7483118eb38-31657c00-1aeaa0-15f75f97edf323; JSESSIONID=5EAFD2966FF8693D602E176DE916AEA1'
    })
    .end((err, sres) => {
      err && res.send(err)
      var info = []
      const $ = cheerio.load(sres.text)

      // 获取所有数据
      const dataRows = $('tbody').eq(0).find('tr')

      // 整理、格式化数据
      for(var i = 0; i < dataRows.length; i++) {
        let row = dataRows.eq(i)
        info.push({
          // 'id':         row.find('td').eq(0).text(),
          'department': row.find('td').eq(1).text(),
          'major':      row.find('td').eq(2).text(),
          'grade':      row.find('td').eq(3).text(),
          'class':      row.find('td').eq(4).text(),
          'sid':        row.find('td').eq(5).text(),
          'name':       row.find('td').eq(6).text(),
          'sex':        row.find('td').eq(7).text(),
        })
      }

      // 按年级查询，新生 -> 老生
      info.sort((a, b) => {
        return b.grade - a.grade
      })
      
      res.send(info)
    })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})