var a = [0.33, 0.33, 0.33, 0.5, 0.16, 0.5, 0.16, 0.16]

var temp = a[0]

for (var i = 0; i < a.length - 1; i++) {
  temp = Math.sqrt(temp * temp + a[i + 1] * a[i + 1]).toFixed(2)
  console.log( temp )
}