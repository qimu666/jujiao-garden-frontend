<template>
  <div style="padding-top: 5px"></div>
  <div class="center">
    <img :alt="user?.username" class="img" :src="user?.userAvatarUrl?user.userAvatarUrl:defaultPicture">
  </div>
  <div style="padding-top: 15px"/>
  <van-cell :value="user?.username.length<10?user?.username:user?.username.slice(0,10)+'...'" icon="manager-o">
    <template #title>
      <span class="custom-title">昵称</span>
    </template>
  </van-cell>
  <van-cell :value="user.userAccount" icon="user-circle-o">
    <template #title>
      <span class="custom-title">账号</span>
    </template>
  </van-cell>
  <van-cell :value="genderMap[user?.gender]" icon="like-o">
    <template #title>
      <span class="custom-title">性别</span>
    </template>
  </van-cell>
  <van-cell :value="user?.contactInfo" icon="comment-o">
    <template #title>
      <span class="custom-title">联系方式</span>
    </template>
  </van-cell>
  <van-cell :value="user?.email" icon="envelop-o">
    <template #title>
      <span class="custom-title">邮箱</span>
    </template>
  </van-cell>
  <van-cell value="点击查看" icon="cluster-o" @click="teams" is-link>
    <template #title>
      <span class="custom-title">已加队伍</span>
    </template>
  </van-cell>
  <van-cell title="简介" icon="chat-o">
    <template #value>
      <div v-if="user.userDesc" class="van-multi-ellipsis--l3">
        {{ user?.userDesc }}
      </div>
      <div v-if="!user.userDesc" class="van-ellipsis">
        暂无简介
      </div>
    </template>
  </van-cell>
  <van-space style="margin: 13px" direction="vertical" fill>
    <div v-if="loginUser?.user.id!==user.id">
      <div v-if="!loginUser.userIds.includes(user?.id)">
        <van-button v-if="applyStatus" type="primary" @click="addUser" block>
          添加好友
        </van-button>
      </div>
      <div v-else>
        <van-button type="primary" @click="chatUser" block>联系好友</van-button>
        <div style="padding-top: 10px;"></div>
        <van-button type="danger" @click="deleteFriend" block>删除好友</van-button>
      </div>
    </div>
  </van-space>
  <van-dialog v-model:show="addUserApply" :title="'添加好友：'+user.username.slice(0,10)" show-cancel-button
              @confirm="toAddUserApply(user.id)">
    <div style="padding-top:8px"></div>
    <van-field v-model="addUserApplyText"
               type="text"
               placeholder="我是...."
               style="text-align: center;width: 150px;margin-left: 75px;"
    />
    <div style="padding-top:8px "></div>
  </van-dialog>
  <copyright/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {genderMap, roleMap, userStatus} from "../model/userMap";
import {defaultPicture} from "../common/userCommon";
import request from "../service/myAxios";
import getCurrent from "../service/currentUser";
import {UserType} from "../model/user";
import Copyright from "../components/Copyright.vue";

const loginUser = ref({
  user: {},
  userIds: []
})

const applyStatus = ref(true)

const route = useRoute()
const router = useRouter()
const user = ref<UserType>({
  "id": 0,
  "username": "",
  "userAccount": "",
  "userAvatarUrl": "",
  "gender": genderMap,
  "email": "",
  "contactInfo": '',
  "userDesc": '',
  "userStatus": userStatus,
  "userRole": roleMap,
  "tags": [],
  "teamIds": [],
  "userIds": []
})

const teams = () => {
  router.push({
    name: "userTeamPage",
    query: {
      teamsId: JSON.parse(user.value.teamIds)
    }
  })
}

const chatUser = () => {
  if (!loginUser.value.userIds.includes(user.value.id)) {
    showFailToast("该用户暂时不是您的好友")
    return
  }
  router.push({
    path: "/chat",
    query: {
      id: user.value.id,
      username: user.value.username,
      userType: 1
    }
  })
}

const addUser = async () => {
  addUserApply.value = true
}

const deleteFriend = async () => {
  showConfirmDialog({
    message: '请确认是否删除好友?',
  }).then(async () => {
    const deleteFriend = await request.post(`/user/deleteFriend/${user.value.id}`, {})
    if (deleteFriend) {
      loginUser.value.userIds = loginUser.value.userIds.filter(id => id !== user.value.id)
      showSuccessToast("删除成功")
    }
  }).catch(() => {
    showSuccessToast("修改成功")
  });

}

onMounted(async () => {
  user.value = await request.get(`/user/${route.params.userId}`)
  const currentUser = await getCurrent()
  loginUser.value.user = currentUser
  loginUser.value.userIds = JSON.parse(currentUser.userIds)
})
const addUserApply = ref(false);
const addUserApplyText = ref();
const toAddUserApply = async (id: number) => {
  const status = await request.post("/friends/add", {
    "receiveId": id,
    "remark": addUserApplyText.value
  })
  if (status) {
    showSuccessToast("申请成功")
  }
}
</script>

<style scoped>
@import "../assets/css/userShow.css";
@import "../assets/css/public.css";

:deep(.van-popup--center) {
  max-width: none;
  border-radius: 5%;
}

</style>