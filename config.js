/* 感谢使用Sakura聊天室，这是一个简单的基于node.js,express,socket.io,jQuery,HTML5
// 的websockt项目。请您在使用过程中保留这些无关紧要的注释
// 这里所有的文件夹都不需要前置带./，仅仅相对于根目录填写名称即可
*/
function chatConfig(name) {
    var config = new Array();
    config['name'] = "Sakura聊天室"; //聊天室名字
    config['hosting'] = "localhost"; //服务器IP
    config['port'] = 5555; //Websocket端口
    config['key'] = "d2afd04d4559b4c0"; //程序加密所用秘钥，16位
    config['webApp'] = "index.html"; //web客户端文件，没有必要就不动
    config['serverScript'] = "serverScript"; //独立出来的服务端逻辑文件,不要带.js后缀
    config['appFile'] = "static"; //客户端所需文件所在文件夹
    config['logWrite'] = true; //是否写入日志，日志文件名log.txt
    config['logTime'] = "timeStample"; //日志时间计算方法。timeStample为时间戳格式，dateTime为日期格式
    config['botImg'] = "img/bot"; //机器人头像文件夹
    config['headImg'] = "img/head"; //用户头像文件夹
    config['iconImg'] = "img/icon"; //聊天室图标文件夹
    return config[name];
}

function databaseConfig(name) {
    var config = new Array();
    config['host'] = "localhost"; //数据库地址
    config['user'] = "dbUser"; //数据库用户名
    config['passWd'] = "dbPassWd"; //数据库密码
    config['dbport'] = 3306; //数据库默认端口，一般不用动
    config['database'] = "dbName"; //数据库名称
    return config[name];
}
module.exports = { chatConfig, databaseConfig }
