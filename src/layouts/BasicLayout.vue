<template>
  <van-nav-bar left-arrow left-text="返回" title="聚交园" @click-right="onRight" @click-left="onLift">
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="center">
    <router-view/>
  </div>
  <div style="padding-bottom:100px"></div>
  <div id="copyright">
    © 2023 柒木. 保留所有权利
  </div>
  <van-tabbar route @change="onChange">
    <van-tabbar-item icon="search" name="index" replace to="/index">推荐</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="team" replace to="/team">队伍</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="user" replace to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";

const router = useRouter()

const onLift = () => {
  router.back()
};
const onRight = () => {
  router.push("/search")
};
</script>

<style scoped>
#center {
  margin: 0 0;
  padding: 0 0;
}

div#copyright {
  position: fixed;
  bottom: 50px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #999;
  background-color: #fff;
  z-index: 999;
}

</style>