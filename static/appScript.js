/** Func:设置cookie
 ** @.name:cookie的名字
 ** @value:cokkie的值
 ** @time:cookie在本地保存的时间
 ** Tips.1:如果要删除cookie可以设置cookie内容为空,时间为过去的时间
 */
function setCookie(name, value, time) {
    var exp = new Date();
    exp.setTime(exp.getTime() + time * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/** Func:读取cookie
 ** @.name:cookie的名字
 */
function $_COOKIE(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

/** Func:获取GET参数
 ** @.name:GET参数的名字
 */
function $_GET(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//时间戳
function timeStample() {
    var tmp = Date.parse(new Date()).toString();
    return tmp.substr(0, 10);
}

//日期
function dateTime() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
