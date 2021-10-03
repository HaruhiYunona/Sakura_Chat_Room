/*Func:处理数据库获取出来的数据
 **@data: 输入的数据库数据
 */
function dataFormat(data) {
    var result = JSON.stringify(data);
    var json = str_substr('[', ']', result);
    if (json !== "" && json !== null) {
        var json = JSON.parse(json);
    } else {
        var json = false;
    }
    return json;
}



/**
 * 加密方法
 * @param key      加密key
 * @param data     数据
 * @returns string
 */
var crypto = require('crypto');
var encrypt = function(key, data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', key, "1111111111111111");
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = Buffer.from(crypted, 'binary').toString('base64');
    return crypted;
};
var decrypt = function(key, crypted) {
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, "1111111111111111");
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

/** Func:根据两端截取字符串
 ** @start: 起始字符串
 ** @end:结束字符串
 ** @str:被截取的字符串
 */
function str_substr(start, end, str) {
    temp = str.split(start, 2);
    content = temp[1].split(end, 2);
    return content[0];
}

/** Func:用户注册功能
 ** @nickName: 用户昵称
 ** @passWd:用户密码
 ** Tips.1:这是一个异步函数,接受回调结果请使用module.func().then((result)=>{ //your code }) 
 ** Tips.2:这里我为了省事没有写很多参数,具体什么样的参数请自行修改,明文密码也就图个乐呵
 */
var userRegister = function(nickName, passWd) {
    return new Promise((suc) => {
        //导入配置和Mysql模块
        var config = require('./config');
        var mysql = require('mysql');
        //创建Mysql链接
        var connection = mysql.createConnection({
            host: config.databaseConfig('host'),
            user: config.databaseConfig('user'),
            password: config.databaseConfig('passWd'),
            port: config.databaseConfig('dbport'),
            database: config.databaseConfig('database')
        });
        writeLog('System Info', 'connecting database', config.chatConfig('logTime'), config.chatConfig('logWrite'));
        connection.connect();
        var sql = "SELECT * FROM `user` WHERE `nickName` = '".concat(nickName, "'");
        connection.query(sql, function(err, result) {
            //查询注册的用户是否重名,如果出错抛出错误
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            var json = dataFormat(result);
            if (json !== false) {
                var uid = json.uid;
            } else {
                var uid = null;
            }
            if (uid !== null) {
                var info = "repeat";
                suc(info);
            } else {
                //判断没有重复的用户名，开始插入注册数据
                var Regx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                if (Regx.test(passWd)) {
                    var passWord = encrypt(config.chatConfig('key'), passWd);
                    var addSql = "INSERT INTO `".concat(config.databaseConfig('database'), "`.`user` (`uid`, `nickName`, `passWd`, `exp`, `glory`) VALUES (NULL, ?, ?, ?, ?)");
                    var addSqlParams = [nickName, passWord, '10', '用户'];
                    connection.query(addSql, addSqlParams, function(err, result) {
                        if (err) {
                            console.log('[INSERT ERROR] - ', err.message);
                            return;
                        }
                        var json = JSON.stringify(result);
                        if (json !== "" && json !== null) {
                            var json = JSON.parse(json);
                        } else {
                            var json = "{\"u\":1}";
                            var json = JSON.parse(json);
                        }
                        if (json.hasOwnProperty("affectedRows")) {
                            var info = "success";
                            suc(info);
                        } else {
                            var info = "failed";
                            suc(info);
                        }
                    });
                } else {
                    var info = "passWdErr";
                    suc(info);
                }
            }
            //统一异步接收info参数，通过info分辩注册过程发生了什么（完成或者失败报错）
        });
    });
}

/** Func:用户登陆功能
 ** @nickName: 用户昵称
 ** @passWd:用户密码
 ** Tips.1:这是一个异步函数,接受回调结果请使用module.func().then((result)=>{ //your code }) 
 ** Tips.2:与注册函数差不多 ，没啥可讲的，就是查询用户数据，查不到或者密码不对都返回错误
 */
var userLogin = function(nickName, passWd) {
    return new Promise((suc) => {
        var config = require('./config');
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: config.databaseConfig('host'),
            user: config.databaseConfig('user'),
            password: config.databaseConfig('passWd'),
            port: config.databaseConfig('dbport'),
            database: config.databaseConfig('database')
        });
        writeLog('System Info', 'connecting database', config.chatConfig('logTime'), config.chatConfig('logWrite'));
        connection.connect();
        var sql = "SELECT * FROM `user` WHERE `nickName` = '".concat(nickName, "'");
        connection.query(sql, function(err, result) {
            var json = dataFormat(result);
            if (json !== false) {
                var dbpassWd = json.passWd;
                var uid = json.uid;
            } else {
                var uid = null;
                var dbpassWd = null;
            }
            var repassWd = encrypt(config.chatConfig('key'), passWd);
            if (dbpassWd == repassWd) {
                var info = uid;
            } else {
                var info = false;
            }
            suc(info);
        });
    });
}

/** Func:用户信息查询
 ** @uid:用户UID
 ** Tips.1:这是一个异步函数,接受回调结果请使用module.func().then((result)=>{ //your code }) 
 ** Tips.2:所有异步函数最好都用json返回,保证数据到达的一致性
 */
var userInfoQuery = function(uid) {
    return new Promise((suc) => {
        var config = require('./config');
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: config.databaseConfig('host'),
            user: config.databaseConfig('user'),
            password: config.databaseConfig('passWd'),
            port: config.databaseConfig('dbport'),
            database: config.databaseConfig('database')
        });
        writeLog('System Info', 'connecting database', config.chatConfig('logTime'), config.chatConfig('logWrite'));
        connection.connect();
        var sql = "SELECT * FROM `user` WHERE `uid` =".concat(uid);
        connection.query(sql, function(err, result) {
            var result = JSON.stringify(result);
            var json = str_substr('[', ']', result);
            if (json !== "" && json !== null) {
                var json = JSON.parse(json);
            } else {
                var json = "{\"u\":1}";
                var json = JSON.parse(json);
            }
            if (json.hasOwnProperty("nickName")) {
                var nickName = json.nickName;
                var exp = json.exp;
                var glory = json.glory;
            } else {
                var nickName = "未知用户";
                var exp = 0;
                var glory = "用户";
            }
            connection.end();
            var tmp = timeStample();
            if (exp >= 0 && exp < 100) {
                var lv = "LV.1";
            } else if (exp >= 100 && exp < 250) {
                var lv = "LV.2";
            } else if (exp >= 250 && exp < 500) {
                var lv = "LV.3";
            } else if (exp >= 500 && exp < 1000) {
                var lv = "LV.4";
            } else if (exp >= 1000 && exp < 3000) {
                var lv = "LV.5";
            } else if (exp >= 3000 && exp < 8000) {
                var lv = "LV.6";
            } else if (exp >= 8000 && exp < 15000) {
                var lv = "LV.7";
            } else if (exp >= 15000 && exp < 30000) {
                var lv = "LV.8";
            } else if (exp >= 30000 && exp < 50000) {
                var lv = "LV.9";
            } else if (exp >= 50000 && exp < 100000) {
                var lv = "LV.10";
            } else if (exp >= 100000) {
                var lv = "MAX";
            }
            var info = "{\"nickName\":\"".concat(nickName, "\",\"lv\":\"", lv, "\",\"glory\":\"", glory, "\"}");
            suc(info);
        });
    });
}


/** Func:发送消息广播
 ** @.type:传入消息的类型,区别代码在switch()中
 ** @message:传入的文本消息
 ** @extraA,@extraB,@extraC,@extraD,附带参数，详见README.MD
 */
function sendMessage(type, message, extraA, extraB, extraC, extraD) {
    var config = require('./config');
    var app = require('express')();
    var express = require('express');
    var fs = require("fs");
    switch (type) {
        case "userChat":
            var file = "./".concat(config.chatConfig('headImg'), "/", extraA, ".png");
            fs.access(file, (err) => {
                if (err) {
                    var headimgPath = "./".concat(config.chatConfig('iconImg'), "/head.png");
                    var msg = "{\"type\":\"userChat\",\"msg\":\"".concat(message, "\",\"uid\":\"", extraA, "\",\"nickName\":\"", extraB, "\",\"glory\":\"", extraC, "\",\"lv\":\"", extraD, "\",\"headimg\":\"" + headimgPath + "\"}");
                    writeLog('Chat Out', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'));
                    io.emit('chat message', msg);
                } else {
                    var headimgPath = file;
                    var msg = "{\"type\":\"userChat\",\"msg\":\"".concat(message, "\",\"uid\":\"", extraA, "\",\"nickName\":\"", extraB, "\",\"glory\":\"", extraC, "\",\"lv\":\"", extraD, "\",\"headimg\":\"" + headimgPath + "\"}");
                    writeLog('Chat Out', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'));
                    io.emit('chat message', msg);
                }
            });
            break;
        case "notice":
            var msg = "{\"type\":\"notice\",\"msg\":\"".concat(message, "\"}");
            writeLog('System Push', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'));
            io.emit('chat message', msg);
            break;
        case "botChat":
            var msg = "{\"type\":\"botChat\",\"msg\":\"".concat(message, "\",\"botname\":\"", extraA, "\",\"botImg\":\"./", config.chatConfig('botImg'), "/", extraB, "\",\"botFunc\":\"", extraC, "\"}");
            writeLog('BOT Chat', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'), "\"}");
            io.emit('chat message', msg);
            break;
        case "config":
            var msg = "{\"type\":\"config\",\"configName\":\"".concat(message, "\",\"configData\":\"", extraA, "\"}");
            writeLog('Config App', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'), "\"}");
            io.emit('SystemConfig', msg);
            break;
        case "SystemMsg":
            var msg = "{\"msg\":\"".concat(message, "\",\"uid\":\"", extraA, "\",\"nickName\":\"", extraB, "\",\"result\":\"", extraC, "\",\"act\":\"", extraD, "\"}");
            writeLog('System Msg', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'), "\"}");
            io.emit('SystemMsg', msg);
            break;
            /*
             **您想要增加的消息类型代码可以在这里填写
             */
        default:
            var msg = "{\"type\":\"notice\",\"msg\":\"花Q!服务器被你搞炸了，原因不明！\"}";
            writeLog('System Push', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'));
            io.emit('chat message', msg);
    }
}

/** Func:输出报告，写入日志
 ** @pusher:报告推送人,例如用户,系统,服务器,数据库等
 ** @log:推送人报告的日志内容
 ** @timeType:报告的时间格式,有timeStamp(默认)和dateTime
 ** @isWrite:是否写入日志到文件
 */
function writeLog(pusher, log, timeType, isWrite) {
    var fs = require("fs");
    if (timeType == "dateTime") {
        var time = dateTime();
    } else {
        var time = timeStample();
    }
    var log = "[".concat(pusher, "]", log, " --", time);
    console.log(log);
    if (isWrite == true) {
        var oldLog = fs.readFileSync('./log.txt', 'utf-8');
        fs.writeFile("./log.txt", oldLog + "\n" + log, error => {
            if (error) return console.log("[System Info]Log write error:" + error.message);
        });
    }
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

//导出js模块
module.exports = { str_substr, userRegister, userLogin, userInfoQuery, sendMessage, writeLog, timeStample, dateTime, dataFormat, encrypt, decrypt }
