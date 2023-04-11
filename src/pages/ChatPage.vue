<template>
  <div class="chat-container">
    <p class="heard">{{ stats.chatUser.username }}</p>
    <div class="content" v-html="stats.content"></div>
    <div class="send">
      <textarea placeholder="聊点什么吧...." v-model="stats.text" @keyup.enter="send" class="input-text"></textarea>
      <input class="input-send-button" type="button" @click="send" value="发送">
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {showFailToast} from "vant";
import getCurrent from "../service/currentUser";
import request from "../service/myAxios";

const route = useRoute()
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
  chatEnum: {
    PRIVATE_CHAT: 1,
    PUBLIC_CHAT: 2
  },
  chatType: null,
  text: "",
  messages: [],
  content: ''
})

onMounted(async () => {
  stats.value.chatType = stats.value.chatEnum.PUBLIC_CHAT
  let {id, username, type} = route.query
  stats.value.chatUser.id = Number.parseInt(id)
  stats.value.chatUser.username = username
  if (type && Number.parseInt(type) !== stats.value.chatEnum.PUBLIC_CHAT) {
    stats.value.chatType = stats.value.chatEnum.PRIVATE_CHAT
  }
  stats.value.user = await getCurrent()
  if (stats.value.chatType === stats.value.chatEnum.PRIVATE_CHAT) {
    const chaheMessage = await request.post("/chat/private",
        {
          fromId: stats.value.user.id,
          toId: stats.value.chatUser.id,
          chatType: stats.value.chatType
        })
    chaheMessage.forEach(chat => {
      if (chat.type === true) {
          createContent(null, chat.formUser, chat.text)
      } else {
          createContent(chat.toUser, null, chat.text)
      }
    })
  }
  init()
})

let socket;
const init = () => {
  let uid = stats.value.user.id;
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  } else {
    // 线上
    // let socketUrl = `wss://qimuu.icu/api/websocket/` + uid;
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
      // console.log("收到数据====" + msg.data)
      let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
      if (data.users) {  // 获取在线人员信息
        stats.value.users = data.users.filter(user => {
          return user.id !== uid
        })
        // console.log(stats.value.users)// 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
      } else {
        // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
        let flag;
        if (stats.value.chatType === stats.value.chatEnum.PRIVATE_CHAT) {
          // 单聊
          flag = (uid === data.toUser.id && stats.value.chatUser.id === data.formUser.id)
        } else {
          // 群聊
          flag = (data.formUser.id !== uid)
        }
        if (flag) {
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
  if (stats.value.chatUser.id === stats.value.user.id){
    showFailToast("不能给自己发信息")
    return;
  }
  if (!stats.value.text.trim()) {
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
        chatType: stats.value.chatType
      }
      socket.send(JSON.stringify(message));
      stats.value.messages.push({user: stats.value.user.id, text: stats.value.text})
      createContent(null, stats.value.user, stats.value.text)
      stats.value.text = '';
    }
  }
}

const createContent = (remoteUser, nowUser, text) => {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
  // 当前用户消息
  let html;
  if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = `
    <div class="message self">
      <img class="avatar" src=${nowUser.userAvatarUrl}>
      <p class="text">${text}</p>
    </div>
`
  } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
    html = `
     <div class="message other">
      <img class="avatar" src=${remoteUser.userAvatarUrl}>
      <p class="text">${text}</p>
    </div>
`
  }
  stats.value.content += html;
}
</script>
<style>
@import "../assets/css/chat.css";
</style>
