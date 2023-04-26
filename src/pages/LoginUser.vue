<script setup>

import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showSuccessToast} from "vant";
import request from "../service/myAxios";
import {defaultPicture} from "../common/userCommon";
import Copyright from "../components/Copyright.vue";

const qqLogin = async () => {
  window.location.href=await request.get("login/qq")
}
const router = useRouter()
const route = useRoute()

const username = ref('');
const password = ref('');

const NOT_JUMP = ["/user/register", "/user/register"]
const onSubmit = async () => {
  const loginUser = await request.post("/user/login", {
    "userAccount": username.value,
    "userPassword": password.value
  })
  if (loginUser) {
    sessionStorage.setItem("longUser", loginUser ? JSON.stringify(loginUser) : undefined)
    showSuccessToast('登陆成功')
    let jumpPath = !NOT_JUMP.includes(route.meta.lastRoutePath) ? route.meta.lastRoutePath : "/"
    await router.push(jumpPath)
  }
};

</script>
<template>
  <div style="padding-top:60px;  margin-left: -20px;;min-width: 380px">
    <div class="center">
      <img alt="聚交园" class="img" :src="defaultPicture">
    </div>
    <div style="padding-top: 20px"/>
    <van-row justify="center">
      <h3>"聚交园 —— 寻找志同道合的朋友"</h3>
    </van-row>
    <div style="margin: 14px;padding-top: 20px">
        <van-cell-group inset>
          <van-field
              v-model="username"
              :rules="[{ required: true, message: '请填写账号!' }]"
              label="账号"
              name="账号"
              placeholder="账号"
          />
          <van-field
              v-model="password"
              :rules="[{ required: true, message: '请填写密码!' }]"
              label="密码"
              name="密码"
              placeholder="密码"
              type="password"
          />
          <div class="longin">
            <van-button plain class="defaultLogin" @click="onSubmit" round type="primary">
              <van-icon name="lock"/>
              账号密码登录
            </van-button>
            <van-button @click="qqLogin" class="qqLogin" plain round type="primary">
              <van-icon name="qq"/>
              QQ 账号登录
            </van-button>
          </div>
          <van-cell title="" to="/user/register" value="还没有账号？点击注册"></van-cell>
        </van-cell-group>
    </div>
    <copyright/>
  </div>
</template>

<style scoped>
@import "../assets/css/public.css";

.longin {
  margin: 16px 14px 0 12%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.defaultLogin {
  flex: auto;
  min-width: 140px;
  margin-right: 10px;
}

.qqLogin {
  flex: auto;
  min-width: 140px;
}
</style>
