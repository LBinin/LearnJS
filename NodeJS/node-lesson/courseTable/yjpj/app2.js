const express = require('express')
const Nightmare = require('nightmare')

const app = express()
const nightmare = Nightmare({
  show: true,
  openDevTools: {
    mode: 'detach'
  }
})

const url = 'http://jwxt.xtu.edu.cn/jsxsd/'

nightmare
  .goto(url)
  .wait('#xh')
  .insert('#xh', '2015551403')
  .evaluate(function () {

  })
  .wait(1000 * 60)
  .end(content => {
    app.get('/', function (req, res) {
      res.send(content)
    })
    app.listen(3000, function () {
      console.log('http://localhost:3000')
    })
  })