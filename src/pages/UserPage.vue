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
    <div style="padding-top: 10px"/>
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
    <van-cell value="点击查看" icon="label-o" is-link
              @click="tagUpdate(user.tags,user.id,'tags')">
      <template #title>
        <span class="custom-title">我的标签</span>
      </template>
    </van-cell>
    <van-cell value="点击更新信息" icon="ellipsis" is-link
              @click="toMore">
      <template #title>
        <span class="custom-title">更多信息</span>
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
      <van-button type="primary" @click="loginOut" block>退出登录</van-button>
    </van-space>
  </div>
  <copyright/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showConfirmDialog, showFailToast, showNotify, showSuccessToast} from "vant";
import {defaultPicture} from "../common/userCommon";
import getCurrent from "../service/currentUser";
import request from "../service/myAxios";
import {UserType} from "../model/user";

const router = useRouter()
const user = ref<UserType>()


const afterRead = async (file) => {
  showConfirmDialog({
    message: '请确认修改当前头像?',
  }).then(async () => {
    const fileFile = file.file
    const res = await request.post("/file/upload", {
      'file': fileFile,
      'biz': "user_avatar"
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    if (res) {
      user.value = await getCurrent()
      showSuccessToast("更新成功")
    }
  }).catch(() => {
    showSuccessToast("取消修改")
  });
};
const onOversize = () => {
  showFailToast("头像上传大小不能超过500kb")
}

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
const show_pop = ref("true")

onMounted(async () => {
  user.value = await getCurrent()
  const show_updateUserAvatarUrl = sessionStorage.getItem("userAvatarUrl")
  show_pop.value = show_updateUserAvatarUrl ? show_updateUserAvatarUrl : show_pop.value
  if (!user.value.userAvatarUrl && show_pop.value === "true") {
    showNotify({message: '点击头像可更换默认头像', type: "primary", duration: 1000});
    show_pop.value = "false"
    sessionStorage.setItem('userAvatarUrl', show_pop.value)
  }
})
const toMore = () => {
  router.push("/user/more")
}
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