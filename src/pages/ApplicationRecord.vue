<template>
  <van-tabs v-model:active="active" @change="onTabChange">
    <van-tab name="1" title="我收到的">
      <template #title>
        <van-icon name="bullhorn-o"/>
        我收到的
      </template>
    </van-tab>
    <van-tab name="2" title="我的申请">
      <template #title>
        <van-icon name="user-o" size="16px"/>
        我的申请
      </template>
    </van-tab>
  </van-tabs>
  <div class="friend-list">
    <div class="friend-group">
      <ul class="friend-items" v-if="active==='1'">
        <van-empty v-if="status.applyFriends.length<=0" description="暂无新的好友申请"/>
        <li v-else v-for="friend in status.applyFriends" :key="friend.id"
            class="friend-item">
          <div class="avatar-container">
            <img @click="showUser(friend.applyUser.id)" :src="friend.applyUser.userAvatarUrl??defaultPicture"
                 class="avatar">
          </div>
          <div @click="showUser(friend.applyUser.id)" class="friend-info">
            <div class="friend-apply">
              <p class="friend-name">{{
                  friend.applyUser.username.length < 8 ? friend.applyUser.username : friend.applyUser.username.slice(0, 8) + '...'
                }}</p>
              <p class="remark">
                {{ friend.remark.length < 15 ? friend.remark : friend.remark.slice(0, 15) + '...' }}</p>
            </div>
          </div>
          <div style="padding-right: 10px;" @click="agree(friend.applyUser.id)">
            <van-button style="width: 60px;" size="small" v-if="friend.status===0" type="primary">接受</van-button>
            <p class="apply" v-if="friend.status===1" type="primary">
              <van-icon name="certificate" size="16px"/>
              已接受
            </p>
            <p class="apply" v-if="friend.status===2" type="primary">
              <van-icon name="warning-o" size="16px"/>
              已过期
            </p>
            <p style="font-size:14px;color: #999;width: 90px" v-if="friend.status===3" type="primary">
              <van-icon name="delete-o" size="16px"/>
              对方已撤销
            </p>
          </div>
        </li>
      </ul>
      <ul class="friend-items" v-else>
        <van-empty v-if="status.myApplyFriends.length<=0" description="暂无申请"/>
        <li v-else v-for="friend in status.myApplyFriends" :key="friend.id"
            class="friend-item">
          <div class="avatar-container">
            <img @click="showUser(friend.applyUserid)" :src="friend.applyUser.userAvatarUrl??defaultPicture"
                 class="avatar">
          </div>
          <div @click="showUser(friend.applyUser.id)" class="friend-info">
            <div class="friend-apply">
              <p class="friend-name">{{
                  friend.applyUser.username.length < 8 ? friend.applyUser.username : friend.applyUser.username.slice(0, 8) + '...'
                }}</p>
              <p class="remark">
                {{ friend.remark.length < 15 ? friend.remark : friend.remark.slice(0, 15) + '...' }}</p>
            </div>
          </div>
          <div style="padding-right: 10px;" @click="canceledApply(friend.id)">
            <van-button style="width: 60px;" size="small" v-if="friend.status===0" type="danger">撤销</van-button>
            <p style="font-size:14px;color: #999;width: 80px" v-if="friend.status===1" type="primary">
              <van-icon name="certificate" size="16px"/>
              已被接受
            </p>
            <p class="apply" v-if="friend.status===2" type="primary">
              <van-icon name="warning-o" size="16px"/>
              已过期
            </p>
            <p class="apply" v-if="friend.status===3" type="primary">
              <van-icon name="delete-o" size="16px"/>
              已撤销
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import request from "../service/myAxios";

const router = useRouter()
const status = ref({
  loginUser: {},
  applyFriends: [],
  myApplyFriends: []
})
const active = ref("1");
const onTabChange = async (name: string) => {
  if (name === "1") {
    status.value.applyFriends = await request.get("/friends/getRecords")
  }
  if (name === "2") {
    status.value.myApplyFriends = await request.get("/friends/getMyRecords")
  }
}
const agree = async (id: number) => {
  const agree = await request.post(`/friends/agree/${id}`)
  if (agree) {
    status.value.applyFriends.forEach(apply => {
      if (apply.applyUser.id === id) {
        apply.status = 1
      }
    })
  }
}

const canceledApply = async (id: number) => {
  const canceledApply = await request.post(`/friends/canceledApply/${id}`)
  if (canceledApply) {
    status.value.myApplyFriends.forEach(apply => {
      if (apply.id === id) {
        apply.status = 3
      }
    })
  }
}

onMounted(async () => {
  status.value.applyFriends = await request.get("/friends/getRecords")
})

const showUser = (id: number) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}
</script>

<style scoped>
.apply {
  font-size: 14px;
  color: #999;
  width: 80px
}

.friend-list {
  padding: 10px;
}

.friend-group {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.friend-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.avatar-container {
  width: 40px;
  height: 40px;
  min-width: 40px !important;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.avatar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.friend-info {
  margin-left: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friend-apply {
  display: flex;
  align-items: self-start;
  flex-direction: column;
}

.friend-name {
  font-size: 14px;

}

.remark {
  padding-top: 5px;
  padding-right: 5px;
  font-size: 10px;
  color: #999;
}
</style>