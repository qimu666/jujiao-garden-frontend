<template>
  <van-nav-bar v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)" fixed="fixed" left-arrow left-text="返回"
               :title="title" @click-right="onRight" @click-left="onLift">
    <template v-if="SHOW_SEARCH.includes(route.path)"  #right>
      <van-icon name="search" size="22"/>
      <span style="color: rgb(25,137,250)">标签</span>
    </template>
  </van-nav-bar>
  <div id="center">
    <router-view/>
  </div>
  <van-tabbar v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)" route>
    <van-tabbar-item icon="search" name="index" replace to="/">推荐</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="friends" replace to="/friends">好友</van-tabbar-item>
    <van-tabbar-item icon="chat-o" name="chat" replace to="/public_chat">聊天厅</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="team" replace to="/team">队伍</van-tabbar-item>
    <van-tabbar-item icon="manager-o" name="user" replace to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import routers from "../router/index";

const NOT_SHOW_NAVBAR_AND_TABBAR = ["/user/login", '/user/register']
const SHOW_SEARCH = ["/", '/team', '/friends', '/public_chat', '/user']

const title = ref();
const router = useRouter()
const route = useRoute()


routers.beforeEach((to) => {
  title.value = to.meta.title || "聚交园";
})

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
  margin-top: 48px;
  padding-bottom: 60px;
}
</style>