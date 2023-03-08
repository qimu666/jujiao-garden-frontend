<template>
  <van-nav-bar left-arrow left-text="返回" title="聚交园" @click-right="onRight" @click-left="onLift">
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <van-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh">
    <div id="center">
      <router-view/>
    </div>
  </van-pull-refresh>
  <div style="padding-bottom:60px"></div>
  <van-tabbar route>
    <van-tabbar-item icon="search" name="index" replace to="/index">推荐</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="team" replace to="/team">队伍</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="user" replace to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import Copyright from "../components/Copyright.vue";
import {ref} from "vue";

const router = useRouter()

const onLift = () => {
  router.back()
};
const onRight = () => {
  router.push("/search")
};
const loading = ref(true);
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>

<style scoped>
#center {
  margin: 0 0;
  padding: 0 0;
}
</style>