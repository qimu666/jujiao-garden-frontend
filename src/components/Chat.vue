<template>
  <div class="chat-container">
    <div v-if="route.path==='/public_chat'" style="width: 100%;position: fixed;top: 44px;">
      <van-notice-bar
          left-icon="volume-o"
          scrollable
          color="#1989fa" background="#ecf9ff"
          text="感谢大家的光临,本项目仅供参考学习,切勿在此刷屏"
      />
    </div>
    <div style="margin-top: 10px;" v-if="route.path==='/public_chat'">
    </div>
    <div v-else class="heard">
      <p v-if="stats.chatType===stats.chatEnum.PRIVATE_CHAT">{{ stats.chatUser.username.slice(0, 14) }}</p>
      <p v-if="stats.chatType===stats.chatEnum.TEAM_CHAT">{{ stats.team.teamName.slice(0, 14) }}</p>
    </div>
    <div class="content" ref="chatRoom" v-html="stats.content"></div>
    <div class="send">
      <V3Emoji
          :recent="true"
          @click-emoji="appendText"
          :options-name="optionsName"
          size="big"
      />
      <textarea placeholder="聊点什么吧...." v-model="stats.text" @keyup.enter="send" class="input-text"></textarea>
      <button class="input-send-button" @click="send">
        <svg class="icon" style="width: 45px;height: 45px;vertical-align: middle;fill: currentColor;overflow: hidden;"
             viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M925.558 97.72c-0.292-0.154-1.582-0.719-4.739-0.719-2.941 0-8.151 0.521-16.343 2.979-36.058 12.923-754.37 270.362-773.606 276.872-0.939 0.318-1.934 0.651-2.974 0.999-6.376 2.134-14.312 4.789-21.199 7.962-4.428 2.04-7.167 3.719-8.829 4.928 17.832 15.715 119.575 97.983 147.656 120.663l564.222-327.071-432.705 429.86 50.076 61.687-0.298 0.242c71.737 87.846 178.502 218.056 196.953 239.206 3.79-4.609 9.658-15.269 13.893-31.349l0.32-1.068c4.197-12.448 271.564-726.894 284.955-762.677 5.193-16.388 2.925-21.894 2.618-22.514z"
              fill="#53AFFD"/>
          <path d="M360.942 646.668l-23.209 58.122 1.062-0.53 22.366-57.321z" fill="#53AFFD"/>
          <path
              d="M952.158 78.229c-4.725-6.476-13.998-14.195-31.339-14.195-7.7 0-16.304 1.478-26.303 4.516l-0.769 0.254c-7.542 2.703-754.41 270.378-773.445 276.821-0.906 0.307-1.865 0.628-2.868 0.962-20.672 6.918-48.985 16.392-53.687 38.008-1.601 7.358-0.929 18.539 11.361 30.017l0.284 0.257c17.603 15.689 128.736 105.481 152.37 124.56l59.231 227.524 31.165-15.563 0.833 0.333 0.373-0.935 89.425-44.655c39.865 48.793 184.043 225.075 193.933 234.965l0.122 0.056c7.568 7.413 15.352 8.846 20.552 8.846h0.007c12.054 0 22.763-7.486 31.827-22.486 5.649-9.349 10.661-21.497 14.14-34.496 7.164-20.075 188.713-505.43 284.587-761.613l0.259-0.747c7.436-23.193 6.761-40.343-2.058-52.429z m-314.493 805.75c-4.234 16.08-10.103 26.74-13.893 31.349-18.451-21.149-125.216-151.36-196.953-239.206l0.298-0.242-50.076-61.687 432.705-429.86-564.222 327.071c-28.08-22.68-129.823-104.948-147.656-120.663 1.661-1.209 4.401-2.889 8.829-4.928 6.886-3.173 14.823-5.828 21.199-7.962 1.04-0.348 2.035-0.681 2.974-0.999 19.236-6.51 737.548-263.949 773.606-276.872 8.192-2.458 13.402-2.979 16.343-2.979 3.157 0 4.447 0.565 4.739 0.719 0.307 0.62 2.575 6.125-2.617 22.513-13.391 35.783-280.759 750.229-284.955 762.677l-0.321 1.069zM337.733 704.79l23.208-58.122 0.22 0.27 30.678 37.792-58.245 32.857 5.2-13.328-1.061 0.531z m267.594-363.852l-259.134 257.43-2.423 2.408-40.964 102.585-41.809-162.821 344.33-199.602z"
              fill=""/>
          <path d="M343.769 600.777l2.423-2.408 259.135-257.431-344.331 199.603 41.808 162.821z" fill="#FFFFFF"/>
          <path d="M391.84 684.731l-30.679-37.792-22.366 57.321-5.201 13.328z" fill="#1083EA"/>
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast} from "vant";
import getCurrent from "../service/currentUser";
import request from "../service/myAxios";
import {defaultPicture} from "../common/userCommon";
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'

const route = useRoute()
const router = useRouter()

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
    // 私聊
    PRIVATE_CHAT: 1,
    // 队伍聊天
    TEAM_CHAT: 2,
    // 大厅
    HALL_CHAT: 3
  },
  chatType: null,
  team: {
    teamId: 0,
    teamName: ''
  },
  text: "",
  messages: [],
  content: ''
})

const appendText = (val) => {
  stats.value.text += val
}


const optionsName = {
  'Smileys & Emotion': '笑脸&表情',
  'Food & Drink': '食物&饮料',
  'Animals & Nature': '动物&自然',
  'Travel & Places': '旅行&地点',
  'People & Body': '人物&身体',
  Objects: '物品',
  Symbols: '符号',
  Flags: '旗帜',
  Activities: '活动'
};

let socket = null;
const heartbeatInterval = 30 * 1000; // 30秒
let heartbeatTimer = null;

const startHeartbeat = () => {
  heartbeatTimer = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("PING");
    }
  }, heartbeatInterval);
}

const stopHeartbeat = () => {
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

const chatRoom = ref(null)

onMounted(async () => {
  let {id, username, userType, teamId, teamName, teamType} = route.query
  stats.value.chatUser.id = Number.parseInt(id)
  stats.value.team.teamId = Number.parseInt(teamId)
  stats.value.chatUser.username = username
  stats.value.team.teamName = teamName
  if (userType && Number.parseInt(userType) === stats.value.chatEnum.PRIVATE_CHAT) {
    stats.value.chatType = stats.value.chatEnum.PRIVATE_CHAT
  } else if (teamType && Number.parseInt(teamType) === stats.value.chatEnum.TEAM_CHAT) {
    stats.value.chatType = stats.value.chatEnum.TEAM_CHAT
  } else {
    stats.value.chatType = stats.value.chatEnum.HALL_CHAT
  }
  stats.value.user = await getCurrent()
  // 私聊
  if (stats.value.chatType === stats.value.chatEnum.PRIVATE_CHAT) {
    const privateMessage = await request.post("/chat/privateChat",
        {
          toId: stats.value.chatUser.id,
        })
    privateMessage.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.toUser, null, chat.text,null,chat.createTime)
      }
    })
  }
  if (stats.value.chatType === stats.value.chatEnum.HALL_CHAT) {
    const hallMessage = await request.get("/chat/hallChat")
    hallMessage.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.formUser, null, chat.text, chat.isAdmin,chat.createTime)
      }
    })
  }
  if (stats.value.chatType === stats.value.chatEnum.TEAM_CHAT) {
    const teamMessage = await request.post("/chat/teamChat",
        {
          teamId: stats.value.team.teamId
        })
    teamMessage.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.formUser, null, chat.text, chat.isAdmin,chat.createTime)
      }
    })
  }
  init()
  // 内容始终显示最下方
  await nextTick()
  const lastElement = chatRoom.value.lastElementChild
  lastElement.scrollIntoView()
})

const init = () => {
  let uid = stats.value.user?.id;
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  } else {
    // 区分线上和开发环境
    let socketUrl = process.env.NODE_ENV !== "development" ? `wss://qimuu.icu/api/websocket/${uid}/${stats.value.team.teamId}`
        : `ws://localhost:8080/api/websocket/${uid}/${stats.value.team.teamId}`
    if (socket != null) {
      socket.close();
      socket = null;
    }
    // 开启一个websocket服务
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      startHeartbeat();
      console.log("websocket已打开");
    };
    //  浏览器端收消息，获得从服务端发送过来的文本消息
    socket.onmessage = function (msg) {
      if (msg.data === "pong") {
        return;
      }
      // 对收到的json数据进行解析，
      let data = JSON.parse(msg.data)
      if (data.error) {
        showFailToast(data.error)
        return
      }
      // 获取在线人员信息
      if (data.users) {
        stats.value.users = data.users.filter(user => {
          return user.id !== uid
        })
        // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
      } else {
        // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
        let flag;
        if (stats.value.chatType === data.chatType) {
          // 单聊
          flag = (uid === data.toUser?.id && stats.value.chatUser?.id === data.formUser?.id)
        }
        if ((stats.value.chatType === data.chatType)) {
          // 大厅
          flag = (data.formUser?.id !== uid)
        }
        // 队伍
        if (stats.value.chatType === data.chatType && data.teamId && stats.value.team.teamId === data.teamId) {
          flag = (data.formUser?.id !== uid)
        }
        if (flag) {
          stats.value.messages.push(data)
          // 构建消息内容
          createContent(data.formUser, null, data.text, data.isAdmin,data.createTime)
          nextTick(() => {
            const lastElement = chatRoom.value.lastElementChild
            lastElement.scrollIntoView()
          })
        }
        flag = null;
      }
    };
    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
      stopHeartbeat();
      setTimeout(init, 5000); // 5秒后重连
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
  if (stats.value.chatUser.id === stats.value.user.id) {
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
        chatType: stats.value.chatType,
        teamId: stats.value.team.teamId,
      }
      socket.send(JSON.stringify(message));
      stats.value.messages.push({user: stats.value.user.id, text: stats.value.text})
      createContent(null, stats.value.user, stats.value.text)
      stats.value.text = '';
      nextTick(() => {
        const lastElement = chatRoom.value.lastElementChild
        lastElement.scrollIntoView()
      })
    }
  }
}

const showUser = (id) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}

/**
 * 这个方法是用来将 json的聊天消息数据转换成 html的。
 */
const createContent = (remoteUser, nowUser, text, isAdmin,createTime) => {
  // 当前用户消息
  let html;
  if (nowUser) {
    // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = `
    <div class="message self">
    <div class="myInfo info">
      <img :alt=${nowUser.username} class="avatar" onclick="showUser(${nowUser.id})" src=${nowUser.userAvatarUrl ?? defaultPicture}>
    </div>
      <p class="text">${text}</p>
    </div>
`
  } else if (remoteUser) {
    // remoteUser表示远程用户聊天消息，灰色的气泡
    html = `
     <div class="message other">
      <img :alt=${remoteUser.username} class="avatar" onclick="showUser(${remoteUser.id})" src=${remoteUser.userAvatarUrl ?? defaultPicture}>
    <div class="info">
      <span class="username">${remoteUser.username.length < 10 ? remoteUser.username : remoteUser.username.slice(0, 10)}&nbsp;&nbsp;&nbsp;${createTime}</span>
      <p class="${isAdmin ? 'admin text' : 'text'}" >${text}</p>
    </div>
    </div>
`
  }
  stats.value.content += html;
}
/**
 * 模板字符串事件
 * @param id
 */
window.showUser = (id) => {
  showUser(id)
}

</script>
<style>
@import "../assets/css/chat.css";

.emoji-item {
  width: 0;
  height: 0;
  margin-top: -45px;
}

.pollup {
  width: 290px;
  height: 280px;
  position: absolute;
  right: 0;
  margin-left: 10px;
  bottom: 50px;
  z-index: 5;
  transition: all ease .5s;
  border-radius: 10px;
  overflow: hidden;
}

.pollup .emoji-container-item {
  padding: 1px;
  text-align: center;
  cursor: pointer;
}

.emoji-container-open-btn {
  font-size: 28px;
  cursor: pointer;
  margin-left: 5px;
}

</style>
