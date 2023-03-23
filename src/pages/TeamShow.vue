<template>
  <van-sticky>
    <van-notice-bar v-if="team.announce"
                    left-icon="volume-o"
                    color="#1989fa" background="#ecf9ff"
                    :text="'队伍公告：'+team.announce"
    />
  </van-sticky>

  <div class="center">
    <img class="img" :src="team.teamAvatarUrl?team.teamAvatarUrl:defaultPicture">
  </div>
  <van-divider>霸气侧漏队</van-divider>
  <van-cell :value="team.id" center icon="points">
    <template #title>
      <span class="custom-title">队伍ID</span>
    </template>
  </van-cell>
  <van-cell :value="team.teamName" center icon="award-o">
    <template #title>
      <span class="custom-title">队伍名称</span>
    </template>
  </van-cell>
  <van-cell :value="user.username" center icon="manager-o">
    <template #title>
      <span class="custom-title">队长</span>
    </template>
  </van-cell>
  <van-cell :value="team.teamDesc" center icon="label-o">
    <template #title>
      <span class="custom-title">队伍描述</span>
    </template>
  </van-cell>
  <van-cell :value="userSet.length +'/' + team.maxNum" center icon="friends-o">
    <template #title>
      <span class="custom-title">队伍人数</span>
    </template>
  </van-cell>
  <div style="margin-bottom: 10px"></div>
  <div v-if="!userSet||userSet.length <=0" class="null">
    <van-empty image="search" description="暂无数据"/>
  </div>
  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }" content-position="left">队员
  </van-divider>
  <div v-if="userSet.length >0 && userSet">
    <div v-for="user in userSet" id="card" class="card">
      <van-swipe-cell>
        <van-card
            :desc="user.userDesc ?'简介：'+ user.userDesc:'简介：该用户比较懒,暂时没有设置'"
            :thumb="user.userAvatarUrl ? user.userAvatarUrl :defaultPicture "
            :title="user.username"
            @click="showUser(user.id)"
        >
          <template #tags>
            <div v-if="user.tags.length<7" style="margin-bottom: 12px"></div>
            标签：<br>
            <van-tag v-for="tag in user.tags" style="color: rgb(245, 67, 67)" class="tag" plain type="primary">
              {{ tag }}
            </van-tag>
            <span v-if="!user.tags||user.tags.length<=0">该用户暂时没有设置</span>
          </template>
        </van-card>
        <template #right>
          <van-button class="delete-button child" square text="添加好友" type="primary" @click="addUser"/>
          <van-button v-if="loginUser.userRole===1||team.user.id===loginUser.id" square text="踢出队伍"
                      class="delete-button child" type="danger" @click="deleteUser(user.id)"/>
        </template>
      </van-swipe-cell>
      <div style="padding-top: 5px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import getCurrent from "../service/currentUser.js";
import request from "../service/myAxios";
import {defaultPicture, jsonParseTag} from "../common/userCommon";
import {showConfirmDialog, showSuccessToast} from "vant";
import {TeamListType, TeamType} from "../model/team";
import {UserType} from "../model/user";

const loginUser = ref({})
const router = useRouter()
const team = ref<TeamListType[]>({})
const user = ref<UserType>({})
const userSet = ref<UserType[]>([])
const route = useRoute()
const teamId = JSON.parse(route.query.teamId)

onMounted(async () => {
  await getCurrent()
  const users:any[] = await request.get(`/team/${teamId}`)
  if (users) {
    team.value = users
    user.value = users.user
    userSet.value = users.userSet
  }
  jsonParseTag(users.userSet)
  loginUser.value = sessionStorage.getItem("longUser") ? JSON.parse(sessionStorage.getItem("longUser")) : undefined
})

const addUser = () => {
  showSuccessToast('添加');
}

const deleteUser = (userId:number) => {
  showConfirmDialog({
    title: "删除用户",
    message:
        '确认删除该用户？',
  })
      .then(async () => {
        await request.post(`/user/delete?id=${userId}`).then(e => {
          if (e) {
            showSuccessToast("删除成功")
            userSet.value = userSet.value.filter(user => user.id !== userId)
          }
        })
      })
}


const showUser = (id:number) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}
</script>

<style scoped>
@import "../assets/css/public.css";
@import "../assets/css/userPage.css";
@import "../assets/css/userList.css";

</style>