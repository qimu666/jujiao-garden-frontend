<template>
  <div v-if="!user">
    <van-empty image="search" description="暂无数据"/>
  </div>
  <div v-else>
    <div style="padding-top: 5px"/>
    <van-cell :value="user.username" icon="manager-o" is-link
              @click="update(user.username,'昵称','username')">
      <template #title>
        <span class="custom-title">昵称</span>
      </template>
    </van-cell>
    <van-cell :value="user.userAccount" icon="user-circle-o">
      <template #title>
        <span class="custom-title">账号</span>
      </template>
    </van-cell>
    <van-cell :value="user.contactInfo" icon="comment-o" is-link
              @click="update(user.contactInfo,'联系方式','contactInfo')">
      <template #title>
        <span class="custom-title">联系方式</span>
      </template>
    </van-cell>
    <van-cell value="点击查看" icon="label-o" is-link
              @click="tagUpdate(user.tags,user.id,'tags')">
      <template #title>
        <span class="custom-title">我的标签</span>
      </template>
    </van-cell>
    <van-cell :value="genderMap[user.gender]" icon="like-o" is-link
              @click="update(user.gender,'性别','gender')">
      <template #title>
        <span class="custom-title">性别</span>
      </template>
    </van-cell>
    <van-cell value="点击修改" icon="eye-o" is-link
              @click="updatePassword(user.id)">
      <template #title>
        <span class="custom-title">修改密码</span>
      </template>
    </van-cell>
    <van-cell v-if="user.userRole===1" :value="roleMap[user.userRole]" icon="cluster-o" is-link
              @click="update(user.userRole,'角色','userRole')">
      <template #title>
        <span class="custom-title">角色</span>
      </template>
    </van-cell>
    <van-cell v-else :value="roleMap[user.userRole]" icon="cluster-o">
      <template #title>
        <span class="custom-title">角色</span>
      </template>
    </van-cell>
    <van-cell :value="user.email" icon="envelop-o" is-link
              @click="update(user.email,'邮箱','email')">
      <template #title>
        <span class="custom-title">邮箱</span>
      </template>
    </van-cell>
    <van-cell title="简介" icon="chat-o" is-link @click="update(user.userDesc,'简介','userDesc')">
      <template #value>
        <div v-if="user.userDesc" class="van-multi-ellipsis--l2">
          {{ user.userDesc }}
        </div>
        <div v-if="!user.userDesc" class="van-ellipsis">
          暂无简介
        </div>
      </template>
    </van-cell>
    <van-space style="margin: 13px" direction="vertical" fill>
      <van-button type="primary" @click="goToUser" block>返回</van-button>
    </van-space>
  </div>
  <copyright/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import getCurrent from "../service/currentUser";
import {genderMap, roleMap} from "../model/userMap";
import {UserType} from "../model/user";

const router = useRouter()
const user = ref<UserType>({})

const update = (val: string, name: string, field: string) => {
  router.push({
    path: "/user/edit",
    query: {
      title: name,
      value: val,
      field: field,
      id: user.value.id
    }
  })
}

const tagUpdate = (tags: string, id: number, field: string) => {
  router.push({
    path: "/search",
    query: {
      id: id,
      tags: JSON.parse(tags),
    }
  })
}

const updatePassword = (id: number) => {
  router.push({
    path: "/user/more/password",
    query: {
      id: id,
    }
  })
}


onMounted(async () => {
  user.value = await getCurrent()
})

const goToUser = async () => {
  router.replace("/user").catch(e => console.log(e))
}
</script>

<style scoped>
@import "../assets/css/userPage.css";
@import "../assets/css/public.css";
</style>