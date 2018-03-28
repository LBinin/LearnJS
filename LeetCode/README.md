[**7. Reverse Integer**](https://leetcode.com/problems/reverse-integer/description/)

需要注意题目，如果翻转后的数超过 32 位，就需要返回 `0`。

```JavaScript
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let result = 0
    if (x >= 0) {
        result = Number(String(x).split('').reverse().join(''))
    } else {
        result = Number(String(x).slice(1).split('').reverse().join('')) * -1
    }
    // 处理溢出的数
    if (result >= Math.pow(2, 31) || result <= -1 * Math.pow(2, 31)) {
        return 0
    }
    return result
}
```

[**9. Palindrome Number**](https://leetcode.com/problems/palindrome-number/description/)

需要注意负数没有回文。

```JavaScript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) {
        return false
    }
    return x.toString() === x.toString().split('').reverse().join('')
};
```