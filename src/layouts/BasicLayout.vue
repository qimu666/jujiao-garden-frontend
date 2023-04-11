<template>
  <van-nav-bar left-arrow left-text="返回" title="聚交园" @click-right="onRight" @click-left="onLift">
    <template #right>
      <van-icon name="search" size="22"/>
      <span style="color: rgb(25,137,250)">标签</span>
    </template>
  </van-nav-bar>
  <div id="center">
    <router-view/>
  </div>
  <van-tabbar route>
    <van-tabbar-item icon="search" name="index" replace to="/">推荐</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="friends" replace to="/friends">好友</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="team" replace to="/team">队伍</van-tabbar-item>
<!--    <van-tabbar-item icon="chat-o" name="chat" replace to="/chat">聊天</van-tabbar-item>-->
    <van-tabbar-item icon="home-o" name="user" replace to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()

const onLift = () => {
  router.back()
};
const onRight = () => {
  router.push("/search")
};

const loading = ref(true);


</script>

<style scoped>
#center {
  margin: 0;
  padding-bottom: 60px;
}
</style>