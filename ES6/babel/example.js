var url1 = 'https://bbsimg.fengimg.com/2014/07/28/7531032_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202014-07-28%2016.06.12.png'

var url2 = 'http://pic.pc6.com/up/2015-6/201506081716072465131.png'

function getImg(url) {
  var img = new Image()
  img.src = url
  img.onload = () => {
    console.log('done: ' + url)
  }
}

function* gen() {
  yield getImg(url1)
  yield getImg(url2)
}

var g = gen()
var res = g.next()

while(!res.done){
  console.log(res.value)
  res = g.next()
}