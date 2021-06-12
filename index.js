//调用模块
var fs = require('fs');
var config = require('./config');
var app = require('express')();
var http = require('http').Server(app);
var serverScript = require("./" + config.chatConfig('serverScript'));
var express = require('express');
io = require('socket.io')(http);

//只发送web客户端
/*
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + config.chatConfig('appFile') + "/" + config.chatConfig('webApp'));
});
*/

//发送webApp及托管webApp所需资源
app.use(express.static(__dirname + "/" + config.chatConfig('appFile')));
app.use("/" + config.chatConfig('botImg'), express.static(__dirname + "/" + config.chatConfig('botImg')));
app.use("/" + config.chatConfig('headImg'), express.static(__dirname + "/" + config.chatConfig('headImg')));
app.use("/" + config.chatConfig('iconImg'), express.static(__dirname + "/" + config.chatConfig('iconImg')));

//接收连接请求
io.on('connection', function(socket) {
    //连接成功后触发的事件
    serverScript.sendMessage("config", "chatRoomName", config.chatConfig('name'));
    serverScript.sendMessage("config", "appScript", config.chatConfig('appScript'));
    serverScript.writeLog('System Info', 'an user join the chat', config.chatConfig('logTime'), config.chatConfig('logWrite'));
    serverScript.sendMessage("notice", "一只用户加入了聊天");
    serverScript.sendMessage("botChat", "欢迎来到聊天室<br>请遵守用户规则以及以下事项<br>1.禁止涉政，禁止嘴臭，禁止刷屏<br>2.友好交流，禁止引战<br>3.不开三次元车，不盗图<br>不听话的都鲨了！", "莫得感情的鲨鲨BOT", "bot_shale.png", "公告BOT");
    //用户聊天广播接收。请注意您每个接收广播的标识，它应该与您web客户端的socket.emit('target',func(data){your code})中的target对应
    socket.on('chat message', function(msg) {
        serverScript.writeLog('Chat In', msg, config.chatConfig('logTime'), config.chatConfig('logWrite'));
        var json = JSON.parse(msg);
        var uid = json.uid;
        var msg = json.msg;
        //查询用户信息的异步回调
        serverScript.userInfoQuery(uid).then((info) => {
            var json = JSON.parse(info);
            var nickName = json.nickName;
            var lv = json.lv;
            var glory = json.glory;
            //将用户消息附加上用户信息后推送给所有人
            serverScript.sendMessage("userChat", msg, uid, nickName, glory, lv);
        });
    });
    //对于登录页面的登录请求广播的接收
    socket.on('login', function(msg) {
        var json = JSON.parse(msg);
        var nickName = json.nickName;
        var passWd = json.passWd;
        //登录事件的异步回调,处理完成以后向web客户端发送结果
        serverScript.userLogin(nickName, passWd).then((info) => {
            if (info !== false) {
                var msg = "User =>".concat(nickName, "<= login success");
                var result = true;
            } else {
                var msg = "User =>".concat(nickName, "<= login Failed");
                var result = false;
            }
            serverScript.sendMessage("SystemMsg", msg, info, nickName, result, "login");
        });
    });
    //对于注册页面的注册请求广播的接收
    socket.on('register', function(msg) {
        var json = JSON.parse(msg);
        var nickName = json.nickName;
        var passWd = json.passWd;
        serverScript.userRegister(nickName, passWd).then((info) => {
            if (info == "repeat") {
                var msg = "An user register Failed because the nickName repeat";
                var result = "failed";
            } else if (info == "passWdErr") {
                var msg = "An user register Failed because the passWd Err";
                var result = "failed";
            } else if (info == "failed") {
                var msg = "An user register Failed because the database Err";
                var result = "failed";
            } else if (info == "success") {
                var msg = "An user =>".concat(nickName, "<= register success");
                var result = "success";
            }
            serverScript.sendMessage("SystemMsg", msg, result, nickName, info, "register");
        })
    });

});


//程序运行,websocket开始轮询与客户端交换数据
http.listen(config.chatConfig('port'), function() {
    serverScript.writeLog('System Info', 'APP running! Listen to: ' + config.chatConfig('hosting') + ':' + config.chatConfig('port'), config.chatConfig('logTime'), config.chatConfig('logWrite'));
});