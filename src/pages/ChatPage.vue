<template>
  <div style="padding-bottom: 100px;">
    <van-divider
        :style="{ color: '#000000', borderColor: '#969799', padding: '15px 0',margin:0 }"
    >
      {{ stats.chatUser.username }}
    </van-divider>
    <div class="content" v-html="stats.content"></div>
    <div class="footer">
      <textarea placeholder="聊点什么吧...." v-model="stats.text" class="text"></textarea>
      <div class="send">
        <van-button size="normal" class="send-button" @keyup.enter="send" @click="send">
          发送
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {showFailToast} from "vant";
import getCurrent from "../service/currentUser";

const route = useRoute()
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
    username: ''
  },
  text: "",
  messages: [],
  cacheMessage: [[]],
  content: ''
})
let html
onMounted(async () => {
  stats.value.chatUser.id = route.query.id
  stats.value.chatUser.username = route.query.username
  stats.value.user = await getCurrent()
  init()
})

const init = () => {
  stats.value.cacheMessage = []
  let uid = stats.value.user.id;
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  } else {
    let socketUrl = `wss://qimuu.icu/api/websocket/` + uid;
    // console.log(socketUrl)
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
      // console.log("收到数据====" + msg.data)
      let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
      if (data.users) {  // 获取在线人员信息
        stats.value.users = data.users.filter(user => {
          return user.id !== uid
        })
        // console.log(stats.value.users)// 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
      } else {
        // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
        if (stats.value.user.id === data.toUser.id) {
          stats.value.messages.push(data)
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
    showFailToast("请输入内容")
  } else {
    if (typeof (WebSocket) == "undefined") {
      showFailToast("您的浏览器不支持WebSocket")
    } else {
      console.log("您的浏览器支持WebSocket");
      let message = {
        fromId: stats.value.user.id,
        toId: stats.value.chatUser.id,
        text: stats.value.text,
      }
      socket.send(JSON.stringify(message));
      stats.value.messages.push({type: 1, user: stats.value.user.id, text: stats.value.text})
      createContent(null, stats.value.user, stats.value.text)
      stats.value.text = '';
    }
  }
}

const createContent = (remoteUser, nowUser, text) => {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
  // 当前用户消息
  if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = ` <div style="padding: 5px 0">
    <div style="text-align: right; padding-right: 10px">
      <div class="tip left"  id="div_text"> ${text}</div>
      <img src=${nowUser.userAvatarUrl} class="img">
    </div>
  </div>`;
  } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
    html = `<div style="padding: 5px 0">
    <div  style="text-align: left; padding-left: 10px">
      <img src=${remoteUser.userAvatarUrl} class="img">
      <div class="tip right"  id="div_text"> ${text} </div>
    </div>
  </div>`;
  }
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

.content {
  overflow: auto;
}

.img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 50%;
}

#div_text {
  max-width: 140px;
  font-size: 16px;
  word-wrap: break-word;
  word-break: break-all;
}

.right {
  background-color: deepskyblue;
}

.left {
  background-color: forestgreen;
}

.footer {
  height: 150px;
  width: 100%;
  position: fixed;
  bottom: 22px;
  display: flex;
  align-items: center;
}

.text {
  height: 80px;
  background-color: #f3f4f3;
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  font-size: 16px;
  padding: 7px 10px;
  border-bottom: 1px solid #ccc;
  outline: none;
  resize: none;
  max-height: 130px;
  overflow-y: auto;
}

.send {
  text-align: right;
}

.send-button {
  font-size: 14px;
  height: 96px;
  width: 60px
}
</style>
