// var fetch = require('node-fetch')
const superagent = require('superagent')

var i = 1
var score = 0

setInterval(() => {
  score = 35 + Math.ceil(15 * Math.random())
  superagent
  .post('https://2017.zhihu.com/api/star/mine/game')
  .send({ "game_score": score })
  .set({
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
    'Cookie' : 'd_c0="AADA1dktugqPTgLVPiJz_fmh42cnbvHp-W0=|1477072960"; _zap=c9ede15d-7edc-44a7-8b73-025332751461; q_c1=1f6fa657fc644f91a69663548a57d1c3|1513505549000|1477072960000; l_cap_id="ZmEzN2NjNWJlYzUxNDNhOTliYzk5MGU0OWUzMmIwYmM=|1513693146|54df68d240a0f647d7e7ef63e053291149cdd471"; r_cap_id="NDc0Y2Y5MTQ0OTY1NDc5Mzk5NjgxYmJlNjNjMDhjYjg=|1513693146|9c5130fc48b7f8928e6425be16443a54ef850fcc"; cap_id="ZTE4OGNhYmQyNTIwNDZiYmFjM2M1YmM2YTdlMjE0YWQ=|1513693146|0c40c65863765aa1b7df5ac48d951aa1025d7980"; z_c0="2|1:0|10:1513693171|4:z_c0|92:Mi4xNkZRT0JBQUFBQUFBQU1EVjJTMjZDaWNBQUFDRUFsVk44NnhnV2dERjJGUndVWmNpTm9JOEFGZ3diS2JEWi0tWmh3|9945d79dad002e01d5e49c951bb61d0139922eb1989d72c620a9dca78d56bc96"; _xsrf=90c9d9db-ea11-44e2-8946-66ddeaf68b2c; __utmc=51854390; __utmz=51854390.1514428597.1.1.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/question/20289071; __utmv=51854390.100--|2=registration_date=20170204=1^3=entry_date=20161022=1; __utma=51854390.2093835629.1514428597.1514428597.1514509965.2; aliyungf_tc=AQAAAAnKThWTdQUAHW8Br18xpaAg+bRf'
  })
  .end(function (err, sres) {
    if (err) {
      console.log('任务 3 ：第 ' + i++ + ' 次失败')
      return
    }
    const json = JSON.parse(sres.text)
    const user_name = json['user_game_record']['user_name']
    const rank = json['user_game_record']['rank']
    const game_record = json['user_game_record']['game_record']
    console.log(user_name + '任务 3 ：第 ' + i++ + ' 次得分：' + score + '，排名：' + rank + '，总得分：' + game_record)
  })
}, 5000)