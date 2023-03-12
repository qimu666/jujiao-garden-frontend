<template>
  <div v-if="!user">
    <van-empty image="search" description="暂无数据"/>
  </div>
  <div v-else>
    <div class="center">
      <van-uploader :after-read="afterRead"
                    :max-count="1"
                    :max-size="5000 * 1024"
                    @oversize="onOversize">
        <div>
          <img class="img" :src="user.userAvatarUrl ? user.userAvatarUrl :defaultPicture ">
        </div>
      </van-uploader>
    </div>
    <div style="padding-top: 20px"/>
    <van-cell :value="user.username" icon="manager-o" is-link
              @click="update(user.username,'昵称','username')">
      <template #title>
        <span class="custom-title">昵称</span>
      </template>
    </van-cell>
    <van-cell :value="user.userAccount" icon="user-circle-o" is-link
              @click="update(user.userAccount,'账号','userAccount')">
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
    <van-cell :value="user.email" icon="envelop-o" is-link
              @click="update(user.email,'邮箱','email')">
      <template #title>
        <span class="custom-title">邮箱</span>
      </template>
    </van-cell>
    <van-cell :value="genderMap[user.gender]" icon="like-o" is-link
              @click="update(user.gender,'性别','gender')">
      <template #title>
        <span class="custom-title">性别</span>
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
    <van-space style="margin: 13px" direction="vertical" fill>
      <van-button type="primary" @click="loginOut" block>退出登录</van-button>
    </van-space>
    <copyright/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showFailToast, showSuccessToast} from "vant";
import {defaultPicture} from "../common/userCommon";
import getCurrent from "../service/currentUser";
import request from "../service/myAxios";
import {genderMap, roleMap} from "../model/userMap";

const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  // console.log(file);
};
const onOversize = () => {
  showFailToast("头像上传大小不能超过500kb")
}
const router = useRouter()
const user = ref({})
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
onMounted(async () => {
  user.value = await getCurrent()
})

const loginOut = async () => {
  const loginOut = await request.post("/user/loginOut", {})
  sessionStorage.clear()
  if (loginOut) {
    showSuccessToast("退出成功")
    router.replace("/user/login").catch(e => console.log(e))
  }
}
</script>

<style scoped>
@import "../assets/css/userPage.css";
@import "../assets/css/public.css";

</style>