const express = require("express");
const socket = require("socket.io");
const cors = require('cors')

// 数据源
const userList = require("./store/userList.json");

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const msg = {
  sucess: function (data, message = '') {
    return {
      code: 200,
      message,
      data
    }
  },
  error: function (message = '') {
    return {
      code: 600,
      message
    }
  }
}

// 生成token
function newGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
      guid += "-";
  }
  return guid;
}

// 随机获取数组
function getRandArray(arr) {
  var result = {};
  arr.sort(function () {
    return (0.5 - Math.random());
  })
  result = arr[0]
  return result
}

// 根据Id获取用户信息
app.post('/api/getUserById', function (req, res) {
  let data = req.body;
  let queryResult = userList.filter(x => x.Id == data.id)[0];
  res.send(msg.sucess(queryResult, '成功'))
})

// 获取用户列表
app.post('/api/userList', function (req, res) {
  let data = req.body;
  let queryResult = userList.filter(x => x.Id != data.id);
  res.send(msg.sucess(queryResult, '成功'))
})

// 随机获取一条用户数据
app.post('/api/getRandomUser', function (req, res) {
  let queryResult = getRandArray(userList);
  res.send(msg.sucess(queryResult, '成功'))
})

// 登陆接口
app.post('/api/login', function (req, res) {
  let data = req.body;
  let queryResult = {}
  myInfo = userList.filter(x => x.Email == data.email);
  if (myInfo.length > 0) {
    if (myInfo[0].Password == data.password) {
      let token = newGuid();
      queryResult = {
        myInfo: myInfo[0],
        token
      }
      res.send(msg.sucess(queryResult, '成功'))
    } else {
      res.send(msg.error('密码错误'));
    }
  } else {
    res.send(msg.error('该用户不存在'));
  }
})

// 发送邮箱验证码
app.post('/api/sendVerificationCode', async function (req, res) {
  try {
    res.send(msg.error("当前版本不支持注册"))
  } catch (err) {
    res.send(msg.error(err.message))
  }
})

const server = app.listen(9527, function () {
  console.log("server running on port 9527");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

// 所有用户
let allSessionPeople = [];
// 会话列表
let conversitionList = [];
// 当前在线会话
let users = [];

// 初始化所有用户列表
if (userList.length > 0) {
  userList.map(x => {
    let item = {
      NoCode: "",
      OutTradeNo: "",
      ReciverId: -1,
      ReciverName: "",
      SendId: x.Id,
      SendName: x.Name,
    }
    allSessionPeople.push(item)
  })
}

// 事件
io.on("connection", function (socket) {

  // 加入聊天
  socket.on("joinChat", data => {

    //若该用户已登陆，将旧设备登陆的用户强制下线
    let oldUser = users.filter(x => x.SendId === data.SendId);
    if (oldUser.length > 0) {
      socket.to(oldUser[0].OutTradeNo).emit("squeezeOut", {
        noCode: oldUser[0].NoCode
      });
    }

    users = users.filter(x => x.SendId !== data.SendId);
    let user = {
      SendId: data.SendId,
      SendName: data.SendName,
      ReciverId: data.ReciverId,
      ReciverName: data.ReciverName,
      OutTradeNo: socket.id,
      NoCode: data.noCode
    };
    users.push(user);
    for (let i = 0; i < allSessionPeople.length; i++) {
      if (allSessionPeople[i].SendId == data.SendId) {
        allSessionPeople[i].OutTradeNo = socket.id;
        break;
      }
    }



    let conversition = conversitionList.filter(x => x.SendId == data.SendId || x.ReciverId == data.SendId);

    let historySessionList = []
    let queryHistory = userList.filter(x => x.Id == data.SendId)
    if (queryHistory.length > 0)
      historySessionList = userList.filter(x => x.Id == data.SendId)[0].HistorySessionList;
    let result = {
      conversition,
      historySessionList
    }
    socket.emit("joinSuccess", result)
  })

  //发送消息
  socket.on("sendMsg", data => {
    let sender = users.filter(x => x.SendId === data.Conversition.SendId);
    let reciver = allSessionPeople.filter(x => x.SendId === data.Conversition.ReciverId);
    data.Conversition.State = 1; // 设置发送状态为成功
    conversitionList.push(data.Conversition);
    if (reciver.length > 0) {
      socket.to(reciver[0].OutTradeNo).emit("reviceMsg", data.Conversition);
    }
    socket.emit("changMsgState", data.Conversition);

    // 将发送者的会话存储到接收者的历史会话中
    let currentUser = userList.filter(x => x.Id == data.ReciverId)[0];
    let len = currentUser.HistorySessionList.filter((x) => x.Id == data.Sender.Id)?.length ?? 0;
    if (len === 0) {
      currentUser.HistorySessionList.push(data.Sender);
    }
  })

  //修改信息阅读状态
  socket.on("changeMsgRead", data => {
    let userConversition = conversitionList.filter(x => (x.SendId == data.sendId && x.ReciverId == data.reciverId && !x.ReadFlag));
    if (userConversition.length > 0) {
      userConversition.map(x => {
        x.ReadFlag = true;
      })
    }
  })

  //新增历史会话
  socket.on("insertHistorySession", data => {
    let currentUser = userList.filter(x => x.Id == data.SendId)[0];
    let len = currentUser.HistorySessionList.filter((x) => x.Id == data.Revicer.Id)?.length ?? 0;
    if (len === 0) {
      currentUser.HistorySessionList.push(data.Revicer);
    }
  })
});