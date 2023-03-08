<template>
  <div class="center">
    <img class="img" :src="user.avatarUrl">
  </div>
  <van-divider>{{ user.username }}</van-divider>
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

  <van-cell :value="user.phone" icon="phone-o">
    <template #title>
      <span class="custom-title">联系方式</span>
    </template>
  </van-cell>
  <van-cell :value="user.email" icon="envelop-o">
    <template #title>
      <span class="custom-title">邮箱</span>
    </template>
  </van-cell>
  <van-cell :value="user.gender" icon="like-o">
    <template #title>
      <span class="custom-title">性别</span>
    </template>
  </van-cell>
  <van-cell value="点击查看" icon="cluster-o" @click="teams" is-link>
    <template #title>
      <span class="custom-title">已加队伍</span>
    </template>
  </van-cell>
  <div style="height:30px;">
    <div class="tags">
      <van-icon name="chat-o"/>
      标签
    </div>
    <div v-for="tage in user.tags">
      <van-tag plain class="van_tag" type="primary">{{ tage }}</van-tag>
    </div>
  </div>

  <span class="desc">
      <van-icon name="chat-o"/> 简介：
  </span>
  <div class="van-multi-ellipsis--l2">
    {{ user.desc }}
  </div>
  <van-space style="margin: 13px" direction="vertical" fill>
    <van-button type="primary" @click="addUser" block>添加好友</van-button>
  </van-space>
  <copyright/>
</template>

<script setup lang="ts">
import userData from '../../mock/oneUser.json'
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showSuccessToast} from "vant";

const router = useRouter()

const user = ref(userData)

const teams = () => {
  router.push({
    name: "userTeamPage",
    params: {
      teamsId: user.value.teamIds.toString()
    }
  })
}

const addUser = () => {
  showSuccessToast("添加成功")
}
</script>

<style scoped>
@import "../assets/css/userShow.css";
@import "../assets/css/public.css";

</style>