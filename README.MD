**来来往下看，虽然教程又臭又长但是一步步地保姆式教学很简单的，毕竟我是真菜鸟嘛，当然什么都往细了说╮(╯_╰)╭**

![](http://5b0988e595225.cdn.sohucs.com/images/20171108/ba6631fd3c8843ada5c2c89b882dc61e.gif)



### 一、使用方法

**该教程内容所有指令都为`Linux CentOS 7.x`环境下指令,其他平台请您自行查询(⊙x⊙;)**

#### 1.下载node.js并下载Sakura_Chat_Room

node.js安装方法见菜鸟教程

> https://www.runoob.com/nodejs/nodejs-install-setup.html

要注意机子是否安装了`git`,`wget`和`tar`，没装的话自己装一下
然后
```shell
git clone https://github.com/HaruhiYunona/Sakura_Chat_Room
```

#### 2.依赖库

> express
>
> fs
>
> mysql
>
> socket.io

如果您发现报错缺少或者未找到以上任何一项的话,还请您

```shell
npm uninstall 以上缺少项目 

npm install  以上缺少项目
```

这些依赖如果安装完成，会出现在工程根目录下`package.json`和`node_modules`里

#### 3.配置端口

```shell
firewall-cmd --zone=public --add-port=5555/tcp --permanent
```

如果您想用别的端口也是完全ok的，将`5555`换成您想要的端口即可，但是不可以和别的已经被占用的端口相同。websocket需要独占一个端口作为服务器。如果您有面板,可以直接去面板里设置。

#### 4.配置文件

如果您已经解压好/git好Sakura_Chat_Room,就可以修改配置文件了

```shell
vi ./config.js
```

一般而言仅仅在我的项目基础上改动只需要更改这些配置即可

```javascript
config['name'] = "Sakura聊天室";  //换成您想要的名字
config['hosting'] = "localhost";  //换成您自己服务器的ip
config['port'] = 5555;  //换成您刚刚开放的端口
config['logWrite'] = true;  //您看情况配置,true会将log写入到./log.txt,false则不输出log,仅显示于命令行
config['logTime'] = "timeStample";  //设置timeStample,log会输出十位数的时间戳。而dateTime则会输出日期格式的时间
```

数据库信息您自己填写。(请正确配置数据库信息，否则不能工作)

```shell
:wq
```

即可保存配置文件。

#### 5.导入数据表和运行调试

该项目实例中我为您简单配置了一个Mysql数据表，它位于根目录,名称为`user.sql`，您可以通过面板或者以下命令导入数据库

```shell
mysql -u 数据库用户名 -p
Enter password:
```

输入数据库密码后命令行 会变成  `mysql>` 格式

```sql
mysql>use 数据库名
mysql>source ./user.sql 
```

数据表导入以后，执行

```shell
node index
```

运行程序，当shell输出:

```
[System Info]APP running! Listen to: IP:PORT --TimeStample
```

这类格式说明您的程序已正常运行。

接下来您访问您的服务器地址（不可以关闭shell命令行）

> http://IP:端口
>
> 例如:http://110.123.456.789:5555

为以下界面，即安装成功

<img src="https://mdzz.pro/sample1.png" style="zoom: 25%;" />

是不是可喜可贺？

问题来了，当您关闭shell命令行对话的时候，这个聊天室就会**超时未响应**

服务器端会话结束时会关闭掉会话中所有任务，我们不可能一直开着命令行，这时候就需要一个托管会话的工具:**`screen`**

如果您是第一次使用这个工具，请记得先安装，如下

```shell
yum install screen
```

安装完毕以后（之后不需再安装），使用

```shell
screen
```

指令即可创建一个托管窗口，该窗口可以在您关闭命令行后仍然执行会话。画面闪烁以后可以直接输入`Sakura_Chat_Room`的运行指令

```shell
node index
```

当程序提示正在运行以后，您不论怎么关闭shell命令行，都可以正常访问聊天室了。

这里我给您预留了个默认账户，直接登陆就可以测试聊天（您也可以自己注册）

> 昵称:可可萝
>
> 密码:w123456

#### 6.常见问题解决

##### (1)端口占用

如果运行程序提示您相应端口已经被占用，请您使用指令

```shell
netstat -lnp | grep 端口号
```

查询出相应端口被占用进程的pid，然后

```shell
kill -9 进程pid
```

再运行程序即可

##### (2)缺少依赖

```shell
npm uninstall 缺少项目 
npm install  缺少项目
```

##### (3)node.js未找到

重新安装一遍,严格执行，结束后

```shell
node -v
```

检查版本号，如果成功输出就代表安装完成。

容我吃个鱼ヾ§ ￣▽)ゞ2333333

#### ![吃鱼](http://5b0988e595225.cdn.sohucs.com/images/20171108/47aac141f11b407e8cedcce768b6bafa.gif)





### 二.项目文件详解

| ***文件夹/文件名*** | ***相对地址***             | ***作用***                                                   |
| ------------------- | -------------------------- | ------------------------------------------------------------ |
| index.js            | ./index.js                 | 运行websocket服务器的基本文件，作为服务端处理中枢            |
| config.js           | ./config.js                | 配置文件,记录聊天室可配置的功能                              |
| package.json        | ./package.json             | npm打包文件，可以看到依赖最高版本和本应用信息                |
| package_lock.json   | ./package_lock.json        | npm打包文件，可以看到依赖详细版本和本应用信息                |
| log.txt             | ./log.txt                  | 本程序日志文件，开启日志写入后会不断写入日志                 |
| serverScript.js     | ./serverScript.js          | 服务器端方法模块，包含一些重要的逻辑方法                     |
| user.sql            | ./user.sql                 | 示例数据表，导入以后可以删除                                 |
| appScript.js        | ./static/appScript.js      | webApp的方法模块,包含前端常用方法                            |
| sweetalert.min.js   | ./static/sweetalert.min.js | 弹窗提醒模块包,用于提醒弹窗                                  |
| index.html          | ./static/index.html        | webApp主要文件,和正常网页一样index.html是默认的首页          |
| login-reg.html      | ./static/login-reg.html    | 注册和登录功能页面                                           |
| login.css           | ./static/login.css         | 注册登录样式表                                               |
| style.css           | ./static/style.css         | 聊天室样式表                                                 |
| sweetalert.css      | ./static/sweetalert.css    | 弹窗提醒模块样式表                                           |
| node_modules        | ./node_modules             | node.js导入模块的文件夹                                      |
| bot                 | ./img/bot                  | 机器人头像文件夹                                             |
| head                | ./img/head                 | 用户头像文件文件夹,可以把用户头像传到该文件夹                |
| icon                | ./img/icon                 | 聊天室所需图标                                               |
| static              | ./static                   | 公开文件夹，其被当做根目录托管到IP：PORT/后面,整个目录都可以直接访问 |

有没有GET到？

![](http://5b0988e595225.cdn.sohucs.com/images/20171108/c58bd48d75154dec8eef73ef09be820f.gif)

没有就对了，我也不知道这是在讲啥(￣△￣；)，往下看，下面有您想要的，真正的`express`和`socket.io`的讲解



### 三.express/socket.io模块详解

#### 1.模块调用

打开`index.js`,我们可以看到其中一些`express`的使用。

首先调用模块这个应该不用特别讲,不管您使用什么方法，首先得调用它所在的模块，否则会造成方法未定义的结果。

```javascript
var app = require('express')(); //初始化 app 作为 HTTP 服务器的回调函数
var http = require('http').Server(app); //定义http模块，主要用于基础通信
var express = require('express'); //定义express模块,其中部分方法会在路由中起到作用
io = require('socket.io')(http); //定义io模块，websocket相关
var config = require('./config'); //加载配置文件
```

#### 2.`http.listen(port, function() {});`

这是一个简单的监听通信的http方法，一般而言无需动它。

```javascript
//监听配置的端口，建立服务器通信
http.listen(config.chatConfig('port'), function() {
    serverScript.writeLog('System Info', 'APP running! Listen to: ' + config.chatConfig('hosting') + ':' + config.chatConfig('port'), config.chatConfig('logTime'), config.chatConfig('logWrite'));
});
```

#### 3.`app.use(route, express.static(path));`

接下来便是如何将您想要向用户展示的文件发送给用户的问题了。为了让用户能从端口向访问域名一样访问我们所提供的文件，我们需要对websocket服务器内文件设置路由。

个人更加推荐`app.use()`方法，建立一个单独的webApp文件夹，利用`app.use()`将其托管给websocket服务器。`app.use()`和`app.get`相比最大的好处就是其可以很方便指定整个文件夹,而`app.get()`则是以中间人的形式向一个文件发送请求。

而且当您使用`app.get()`时,内部`sendFile()`函数只会有第一个起效。该函数可以用于提供文件下载服务,但绝对不能算是托管路由的好选择

```javascript
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

```

| 参数  | 可能值                                         | Tips                                                         |
| ----- | ---------------------------------------------- | ------------------------------------------------------------ |
| route | 为http://IP:PORT后面添加一个类似于文件夹的路由 | 这个会改变用户所见的参数，不管您提供路由的是哪个文件夹。比如说您给它填的是‘’/abc‘’,那么用户需要输入http://IP:PORT/abc来访问您指定的path内的文件 |
| path  | 指向服务器内文件夹,路径字符串                  | 这是您指定服务器内所需要设置路由的文件夹,其名称如何与用户所见无关,但需要使用绝对路径以托管 |

#### 4.`io.on('connection', function(socket) {});`

**socket.io 由两部分组成：**

- 一个服务端用于集成 (或挂载) 到 Node.JS HTTP 服务器： `socket.io`
- 一个加载到浏览器中的客户端： `socket.io-client`

开发环境下， `socket.io` 会自动提供客户端。

```javascript
io.on('connection', function(socket) {
//Your code in the connection
});
```

我们通过传入 `http` （HTTP 服务器） 对象(webApp)初始化了 `socket.io` 的一个实例。 然后监听 `connection` 事件来接收 sockets。

此函数内可以写当用户通过webApp连接上服务器后触发的事件，例如欢迎xxx进入聊天室之类的信息发送之类。

因为其在连接时触发,所以一般一个用户在进入/刷新页面时只触发一次。

Sakura_Chat_Room是将webApp的配置发送写在这里的,事实上还有一种改进方法就是写一个临时的配置js文件,利用`app.get()`和`sendFile()`将其在webApp之前发送到客户端。这种方法似乎会比普通的websocket发送信息更加高效,后续版本我会尝试这种办法。

相比较于普通的Ajax轮询和网页刷新方式,websocket在高收发频率时建立的长连接更节省服务器资源,聊天室,实时小游戏等项目我更推荐websocket。

#### 5.`socket.on(target, function(message) {});`

这是当长连接内客户端/服务端发起了websocket的对应target请求时对其做出的接收处理函数,他就像一个人向另一个人喊话

> 艾里:"嘿,杰克!"    **<- 客户端**
>
> 杰克:"收到,艾里,有什么事?"      **<- 服务器端**

或许这么解释看起来很傻,但它确实就是这么简单的原理。

当webApp发送请求

```javascript
socket.emit(target,function(message){});   //这个是客户端发送消息
```

| 参数    | 可能值                                         | Tips                                                         |
| ------- | ---------------------------------------------- | ------------------------------------------------------------ |
| target  | 标志值字符串,与服务端socket.on()里的target对应 | 如果socket.emit()与socket.on()中target值相同，那么socket.on()将收到socket.emit()发送的讯息 |
| message | 向服务端发送的消息字符串                       | 尽可能进行一些加密保证通讯安全,本实例里为了方便就没有加密了  |

服务器端通过socket.on接收。该方法在io.on()之内可以存在多个,也就是说您可以通过target区别发送的消息类型。

```javascript
socket.on(target, function(message) {});   //这个是服务端接收消息
```

在您使用socket.on()接收消息后,您可以在其中写对消息的逻辑处理,比如附加发送消息的用户信息,对消息的指令进行分析等。



### 四.其他模块

由于开发中这些模块不是必须,您可以使用其他模块或者造轮子代替,所以我就不限制创造力了ヾ(￣▽￣)

这些模块的解析请看node.js官网

###### 1.fs文件系统

> http://nodejs.cn/api/fs.html

###### 2.Mysql数据库

> https://www.runoob.com/nodejs/nodejs-mysql.html

关于数据库这里我特别讲解一下

当您执行查询,插入,修改后,Mysql返回的并不是一个正常的数组或者json,其格式很麻烦

```javascript
//这是查询用户信息时返回的数据
[
  RowDataPacket {
    uid: 1,
    nickName: '可可萝',
    passWd: 'w123456',
    exp: 10,
    glory: '用户'
  }
]
//这是用户注册插入表时返回的数据
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 2,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
```

您会发现这不是一个标准的数组。我们需要先利用`JSON.stringify()`将其转化为JSON字符串(此时仍然不是标准JSON字符串)

```javascript
var json=JSON.stringify(result);
```

再酌情利用我自定义的特殊两端字符截取函数str_substr()截取正确JSON字符串,然后将其JSON对象化。要注意判断一下该字符串截取后是否为空,否则将空值输入`JSON.parse()`会报undfinded错误的

```javascript
var json=JSON.parse(json);
```

这样用`json.键值`就能拿到您想要的数据了。

这方法看着是不是想撞墙？我也没办法啊......后续更新我会出个专门解析这类数据的函数（耸肩摊手）。当然您觉得这样太Low了也可以用`underscore`模块将其`map`一下，也可以达到效果。当然大佬们有好的方法也可以提一下（摔）

![](http://5b0988e595225.cdn.sohucs.com/images/20171108/de935e67455445af8c46f454e381e306.gif)





### 五.自定义模块

在这个项目里我定义了一些小方法模块,后续应该还会增加。每一个自己定义的模块,请不要忘了`exports` ,否则代码报模块未找到别说我没提醒！！！

```javascript
module.exports = { 方法名1,方法名2,方法名3,方法.... }
```

咱示例一下就是

```javascript
function abcd(){
//Your code
}
function efg(){
//Your code
}
module.exports = { abcd,efg }
//一个文件内写一个exports就够了
```

接下来进入正题

#### 1.服务器端方法(serverScript.js)

##### (1)`str_substr( star, end，str)`

用途:根据字符串两端字符截取中间字符。

| 参数  | 可能值            | Tips |
| ----- | ----------------- | ---- |
| start | 用户自定义,字符串 | 无   |
| end   | 用户自定义,字符串 | 无   |
| str   | 传入字符串        | 无   |

例子

```javascript
var string="bbbabcdgwfwfoidjalfaljqqq";
console.log(str_substr("bbb","qqq",string));
//输出 abcdgwfwfoidjalfalj
```

##### (2)`userRegister(nickName,passWd)`

*这是一个异步方法,请使用`userRegister(nickName,passWd).then((result)=>{ //your code })` 接收结果。如果在其他js文件中调用,请加上模块名`serverScript.userRegister(nickName,passWd).then((result)=>{ //your code })`

用途:用户注册

| 参数     | 可能值                                         | Tips |
| -------- | ---------------------------------------------- | ---- |
| nickName | 字符串                                         | 无   |
| passWd   | /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/ | 无   |

##### (3)`userLogin(nickName,passWd)`

同`userRegister(nickName,passWd)`

用途:用户登录

##### (4)`userInfoQuery(uid)`

*这是一个异步方法,请使用`userInfoQuery(uid).then((result)=>{ //your code })` 接收结果。如果在其他js文件中调用,请加上模块名`serverScript.userRegister(uid).then((result)=>{ //your code })`

用途:用户信息查询

| 参数 | 可能值  | Tips |
| ---- | ------- | ---- |
| uid  | int(10) | 无   |

该函数会返回一个JSON

```json
{"nickName":"昵称","lv":"等级","glory":"称号"}
```

##### (5)`sendMessage(type, message, extraA, extraB, extraC, extraD)`

用途:向客户端发送信息

| 参数    | 对应type  | 可能值                                                       | Tips       |
| ------- | --------- | ------------------------------------------------------------ | ---------- |
| type    | 无        | userChat:用户消息, botChat:机器人消息, notice:聊天室提示消息, config:配置消息, SystemMsg:系统消息 | 消息种类   |
| message | 无        | 字符串                                                       | 消息字符串 |
| extraA  | userChat  | int(10)                                                      | UID        |
| extraB  | userChat  | 字符串                                                       | 昵称       |
| extraC  | userChat  | 字符串                                                       | 称号       |
| extraD  | userChat  | 字符串                                                       | 等级       |
| extraA  | botChat   | 字符串                                                       | 机器人名   |
| extraB  | botChat   | 字符串,相对路径                                              | 机器人头像 |
| extraC  | botChat   | 字符串                                                       | 机器人功能 |
| extraA  | config    | 字符串                                                       | 配置数据   |
| extraA  | SystemMsg | 字符串                                                       | UID        |
| extraB  | SystemMsg | 字符串                                                       | 昵称       |
| extraC  | SystemMsg | 字符串                                                       | 结果       |
| extraD  | SystemMsg | 字符串                                                       | 操作请求   |

##### (6)`function writeLog(pusher, log, timeType, isWrite)`

用途:输出报告,写入Log

| 参数     | 可能值                            | Tips                                 |
| -------- | --------------------------------- | ------------------------------------ |
| pusher   | 字符串,自定义报告前缀             | 尽量统一不要五花八门                 |
| log      | 日志值                            | 无                                   |
| timeType | dateTime :日期, timeStamp :时间戳 | timeStample更节省空间,dateTime更直观 |
| isWrite  | true,false                        | 是否把日志写入log.txt                |

##### (7)`timeStample()`和`dateTime()`

用途:输出时间。

timeStample:十位时间戳

dateTime:日期

#### 2.客户端方法(appScript.js)

##### (1)`setCookie(name, value, time)`

用途:设置cookie

| 参数  | 可能的值        | Tips                       |
| ----- | --------------- | -------------------------- |
| name  | 字符串,cookie名 | 无                         |
| value | 字符串,cookie值 | 无                         |
| time  | int(10)         | cookie存在的秒数，可正可负 |

##### (2)`$_COOKIE(name)`

用途:获取cookie

##### (3) $_GET(name)

用途:获取GET参数

##### (4)`timeStample()`和`dateTime()`

用途:输出时间。

timeStample:十位时间戳

dateTime:日期



这就完了,剩下的请您自己鼓捣吧.....

![](http://5b0988e595225.cdn.sohucs.com/images/20171108/9dbdbe6024ea496eb051f2eb914cba0b.gif)











2021.6.12
