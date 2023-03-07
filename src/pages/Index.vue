<template>
  <div style="padding-top: 5px"></div>
  <div class="xindong">
    <div style="float: left;">
      <van-icon name="like-o" size="22px"/>
      心动模式
    </div>
    <div style="text-align: right">
      <van-switch v-model="checked" size="22px" @click="cardiacSwitch()"/>
    </div>
  </div>
  <div v-if="users.length <=0" class="null">
    <van-empty description="暂无数据"/>
  </div>
  <div v-if="users.length >0 && users" class="img">
    <div v-for="user in users" id="card" class="card">
      <van-swipe-cell>
        <van-card
            :desc="'简介：'+user.desc"
            :thumb="user.avatarUrl ? user.avatarUrl :defaultPicture "
            :title="user.title"
        >
          <template #tags>
            <span class="aa">
              标签：<br>
            </span>
            <van-tag v-for="tag in user.tags" class="tag" plain type="primary">
              {{ tag }}
            </van-tag>
          </template>
        </van-card>
        <template #right>
          <van-button class="delete-button child" square text="添加好友" type="primary" @click="addUser"/>
        </template>
      </van-swipe-cell>
      <div style="padding-top: 5px"></div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {showNotify, showToast} from "vant";
import {useRoute} from "vue-router";
import {defaultPicture} from "../common/userCommon";
import userData from '../../mock/indexUsers.json'

const show_pop = ref("true")
const route = useRoute()
const users = ref([])
const tags = ref([])

const userMock = userData
users.value = userMock
tags.value = users.value.tags
const checked = ref(true);
const currentPage = ref(1);
const cardiacSwitch = () => {
  if (checked.value) {
    showToast("心动模式已开启")
  } else {
    showToast("心动模式已关闭")
  }
}
const addUser = () => {
  showToast('添加');
}

onMounted(() => {
  const show_session = sessionStorage.getItem("show_pop")
  show_pop.value = show_session ? show_session : show_pop.value
  if (show_pop.value === "true") {
    showNotify({message: '右滑可以添加好友', type: "primary", duration: 1000});
    show_pop.value = "false"
    sessionStorage.setItem('show_pop', show_pop.value)
  }
})
</script>

<style scoped>
#card {
  padding: 0.1px 16px;
}

.card :deep(.van-card__title) {
  margin-top: 3px;
  font-size: 13px;
}

.tag {
  justify-content: center;
  align-items: center;
  width: auto;
  margin: 2px 2px 4px 2px;
  padding: 2px;
  color: rgb(245, 67, 67)
}

.van-card {
  border-radius: 10px;
  margin: 0;
  padding: 0.10px;
}

.xindong {
  margin: 1px;
  padding: 1px 16px;
}

.aa {
  position: relative;
  padding-top: 2px;
}

.delete-button {
  border-radius: 10px;
  height: 100%;
  width: 70px;
}
</style>