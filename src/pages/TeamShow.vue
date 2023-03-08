<template>
  <div class="center">
    <img class="img" src="https://typor-1305950889.cos.ap-guangzhou.myqcloud.com/typory/233.jfif">
  </div>
  <van-divider>霸气侧漏队</van-divider>
  <van-cell value="1" center icon="points">
    <template #title>
      <span class="custom-title">队伍ID</span>
    </template>
  </van-cell>
  <van-cell value="霸气侧漏队" center icon="award-o">
    <template #title>
      <span class="custom-title">队伍名称</span>
    </template>
  </van-cell>
  <van-cell value="柒木" center icon="manager-o">
    <template #title>
      <span class="custom-title">队长</span>
    </template>
  </van-cell>
  <van-cell value="222222233" center icon="label-o">
    <template #title>
      <span class="custom-title">队伍描述</span>
    </template>
  </van-cell>
  <!--  <van-cell :value="teamData.hasJoinNum+' / '+teamData.maxNum" center title="队伍人数">-->
  <van-cell value="5 / 5" center icon="friends-o">
    <template #title>
      <span class="custom-title">队伍人数</span>
    </template>
  </van-cell>
  <div style="margin-bottom: 10px"></div>
  <user-list/>
  <!--  <van-cell v-if="teamData.expireTime" :value="moment(teamData.expireTime).format('lll')" center title="过期时间">-->
  <!--    <template #icon>-->
  <!--      <van-icon name="underway-o"/>-->
  <!--    </template>-->
  <!--  </van-cell>-->
  <!--  <van-divider/>-->
  <!--  <van-popover v-model:show="showPopover" placement="right-start">-->
  <!--    <van-grid-->
  <!--        :border="false"-->
  <!--        clickable-->
  <!--        column-num="3"-->
  <!--        square-->
  <!--        style="width: 240px;"-->
  <!--    >-->
  <!--      <van-grid-item-->
  <!--          v-for="operation in operations"-->
  <!--          :icon="operation.icon"-->
  <!--          :text="operation.text"-->
  <!--          @click="doClickEvent(operation.clickEvent)"-->
  <!--      />-->
  <!--    </van-grid>-->
  <!--  </van-popover>-->
</template>

<script setup>
import {useRoute} from "vue-router";
import UserList from "../components/UserList.vue";

const route = useRoute()
const teamId = route.params.teamId
console.log(teamId)
const team = teamId
</script>

<style scoped>
@import "../assets/css/public.css";
</style>