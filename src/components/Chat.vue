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
      />
      <textarea placeholder="聊点什么吧...." v-model="stats.text" @keyup.enter="send" class="input-text"></textarea>
      <input class="input-send-button" type="button" @click="send" value="发送">
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
        createContent(chat.toUser, null, chat.text)
      }
    })
  }
  if (stats.value.chatType === stats.value.chatEnum.HALL_CHAT) {
    const hallMessage = await request.get("/chat/hallChat")
    hallMessage.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.formUser, null, chat.text, chat.isAdmin)
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
        createContent(chat.formUser, null, chat.text, chat.isAdmin)
      }
    })
  }
  init()
  // 内容始终显示最下方
  await nextTick()
  const lastElement = chatRoom.value.lastElementChild
  lastElement.scrollIntoView()
})

let socket;
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
      console.log("websocket已打开");
    };
    //  浏览器端收消息，获得从服务端发送过来的文本消息
    socket.onmessage = function (msg) {
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
          createContent(data.formUser, null, data.text, data.isAdmin)
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
const createContent = (remoteUser, nowUser, text, isAdmin) => {
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
      <span class="username">${remoteUser.username.length < 10 ? remoteUser.username : remoteUser.username.slice(0, 18)}</span>
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
  width: 280px;
  height: 260px;
  position: absolute;
  right: 0;
  margin-left: 10px;
  bottom: 35px;
  z-index: 5;
  transition: all ease .5s;
  border-radius: 10px;
  overflow: hidden;
}

.pollup .emoji-container-item {
  padding: 4px;
  text-align: center;
  cursor: pointer;
}

.emoji-container-open-btn {
  font-size: 28px;
  cursor: pointer;
  margin-left: 5px;
}

</style>
