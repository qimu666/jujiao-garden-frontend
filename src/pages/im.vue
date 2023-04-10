<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="8">
        <el-card style="width: 100%; min-height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">（点击聊天气泡开始聊天）</span>
          </div>
          <div style="padding: 10px 0" v-for="user in stats.users" :key="user.username">
            <span @click="check(user.id)">{{ user.username }}
            <i class="el-icon-chat-dot-round" style="margin-left: 10px; font-size: 16px; cursor: pointer"
            ></i></span>
            <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.id === stats.chatUser.id">chatting...</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            Web聊天室（{{ stats.chatUser.username }}）
          </div>
          <div style="height: 350px; overflow:auto; border-top: 1px solid #ccc" v-html="stats.content"></div>
          <div style="height: 200px">
            <textarea v-model="stats.text" style="height: 160px; width: 100%; padding: 20px; border: none; border-top: 1px solid #ccc;
             border-bottom: 1px solid #ccc; outline: none"></textarea>
            <div style="text-align: right; padding-right: 10px">
              <button @click="send">发送</button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
let socket;
const stats = ref({
  user: {
    id: 0,
    username: "",
    userAvatarUrl: ''
  },
  isCollapse: false,
  users: [],
  chatUser: {
    id: 0,
  },
  text: "",
  messages: [],
  cacheMessage: [[]],
  content: ''
})
let html
onMounted(() => {
  stats.value.user = sessionStorage.getItem("longUser") ? JSON.parse(sessionStorage.getItem("longUser")) : {}
  init()
})

const check = (uid) => {
  stats.value.cacheMessage=[]
  stats.value.content=''
  stats.value.chatUser.id = uid
  stats.value.messages = []
  stats.value.cacheMessage = JSON.parse(localStorage.getItem(`cacheMessage${uid}`)) ?? [[]]
  stats.value.cacheMessage.forEach(mess => {
    mess.forEach(message=>{
      if (message.type === 1) {
        createContent(null, stats.value.user, message.text)
      } else {
        createContent(message.formUser, null, message.text)
      }
    })
  })
}

const init = () => {
  stats.value.cacheMessage=[]
  let uid = stats.value.user.id;
  if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");
    let socketUrl = `ws://localhost:8080/api/websocket/` + uid;
    if (socket != null) {
      socket.close();
      socket = null;
    }
    // 开启一个websocket服务
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      console.log("websocket已打开");
    };
    //  浏览器端收消息，获得从服务端发送过来的文本消息
    socket.onmessage = function (msg) {
      console.log("收到数据====" + msg.data)
      let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
      if (data.users) {  // 获取在线人员信息
        stats.value.users = data.users.filter(user => {
          return user.id !== uid
        })
        console.log(stats.value.users)// 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
      } else {
        // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
        if (stats.value.user.id === data.toUser.id) {
          stats.value.messages.push(data)
          stats.value.cacheMessage.push(stats.value.messages)
          localStorage.setItem(`cacheMessage${data.toUser.id}`, JSON.stringify(stats.value.cacheMessage))
          // 构建消息内容
          createContent(data.formUser, null, data.text)
        }
      }
    };
    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
    };
    //发生了错误事件
    socket.onerror = function () {
      console.log("websocket发生了错误");
    }
  }
}

const send = () => {
  if (stats.value.chatUser.id === 0) {
    return;
  }
  if (!stats.value.text) {
    alert("请输入内容")
  } else {
    if (typeof (WebSocket) == "undefined") {
      console.log("您的浏览器不支持WebSocket");
    } else {
      console.log("您的浏览器支持WebSocket");
      // 组装待发送的消息 json
      // {"from": "zhang", "to": "admin", "text": "聊天文本"}
      let message = {
        fromId: stats.value.user.id,
        toId: stats.value.chatUser.id,
        text: stats.value.text,
      }
      socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
      stats.value.messages.push({type: 1, user: stats.value.user.id, text: stats.value.text})
      stats.value.cacheMessage.push(stats.value.messages)
      localStorage.setItem(`cacheMessage${stats.value.chatUser.id}`, JSON.stringify(stats.value.cacheMessage))

      // 构建消息内容，本人消息
      createContent(null, stats.value.user, stats.value.text)
      stats.value.text = '';
    }
  }
}

const createContent = (remoteUser, nowUser, text) => {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
  // 当前用户消息
  if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = `<div class="el-row" style="padding: 5px 0">
      <div class="el-col el-col-22" style="text-align: right; padding-right: 10px">
        <div class="tip left" style="max-width: 180px;font-size: 13px"> ${text}</div>
        <img src=${nowUser.userAvatarUrl} width="30px" height="30px">
      </div>
      <div class="el-col el-col-2">
      </div>
    </div>`;
  } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
    html = `<div class="el-row" style="padding: 5px 0">
 <div class="el-col el-col-" style="text-align: right">
          </div>
          <div class="el-col el-col-22" style="text-align: left; padding-left: 10px">
                  <img src=${remoteUser.userAvatarUrl} width="30px" height="30px">
            <div class="tip right"> ${text} </div>
          </div>
        </div>`;
  }
  console.log(html)
  stats.value.content += html;
}
</script>

<style>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
  display: inline;
}

.right {
  background-color: deepskyblue;
}

.left {
  background-color: forestgreen;
}
</style>
