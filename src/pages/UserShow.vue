<template>
  <div class="center">
    <img class="img" :src="user.userAvatarUrl?user.userAvatarUrl:defaultPicture">
  </div>
  <van-cell :value="user.username" icon="manager-o">
    <template #title>
      <span class="custom-title">昵称</span>
    </template>
  </van-cell>
  <van-cell :value="user.userAccount" icon="user-circle-o">
    <template #title>
      <span class="custom-title">账号</span>
    </template>
  </van-cell>
  <van-cell :value="genderMap[user.gender]" icon="like-o">
    <template #title>
      <span class="custom-title">性别</span>
    </template>
  </van-cell>
  <van-cell :value="user.contactInfo" icon="comment-o">
    <template #title>
      <span class="custom-title">联系方式</span>
    </template>
  </van-cell>

  <van-cell title="邮箱" @click="showPopup" icon="envelop-o">
    <template #value>
      <div v-if="user.email" class="van-ellipsis">
        {{ user.email }}
      </div>
    </template>
  </van-cell>
  <van-popup v-model:show="show" :style="{ padding: '64px' }">{{ user.email }}</van-popup>

  <van-cell value="点击查看" icon="cluster-o" @click="teams" is-link>
    <template #title>
      <span class="custom-title">已加队伍</span>
    </template>
  </van-cell>
  <van-cell title="简介" icon="chat-o">
    <template #value>
      <div v-if="user.userDesc" class="van-multi-ellipsis--l3">
        {{ user.userDesc }}
      </div>
      <div v-if="!user.userDesc" class="van-ellipsis">
        暂无简介
      </div>
    </template>
  </van-cell>
  <van-space style="margin: 13px" direction="vertical" fill>
    <van-button type="primary" @click="addUser" block>添加好友</van-button>
  </van-space>
  <copyright/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showSuccessToast} from "vant";
import {genderMap} from "../model/userMap";
import {defaultPicture} from "../common/userCommon";
import request from "../service/myAxios";

const show = ref(false);
const showPopup = () => {
  show.value = true;
};

const route = useRoute()
const router = useRouter()
const user = ref({})

const teams = () => {
  router.push({
    name: "userTeamPage",
    query: {
      teamsId: JSON.parse(user.value.teamIds)
    }
  })
}

const addUser = () => {
  const {...a} = user.value.teamIds
  console.log(a);
  showSuccessToast("添加成功")
}
onMounted(async () => {
  user.value = await request.get(`/user/${route.params.userId}`)
})
</script>

<style scoped>
@import "../assets/css/userShow.css";
@import "../assets/css/public.css";

.omit {
  margin-left: -2px;
}

:deep(.van-popup--center) {
  max-width: none;
  border-radius: 5%;
}

</style>