<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showSuccessToast} from "vant";
import request from "../service/myAxios";
import {defaultPicture} from "../common/userCommon";
import Copyright from "../components/Copyright.vue";

const router = useRouter()
const username = ref('');
const password = ref('');
const onSubmit = async () => {
  const loginUser = await request.post("/user/login", {
    "userAccount": username.value,
    "userPassword": password.value
  })
  if (loginUser) {
    sessionStorage.setItem("longUser", loginUser ? JSON.stringify(loginUser) : undefined)
    showSuccessToast('登陆成功')
    await router.back()
  }
};
</script>

<template>
  <div style="padding-top:60px"/>
  <div class="center">
    <img class="img" :src="defaultPicture">
  </div>
  <div style="padding-top: 20px"/>
  <van-row justify="center">
    <h3>"聚交园 —— 寻找志同道合的朋友"</h3>
  </van-row>
  <div style="margin: 14px;padding-top: 20px">
    <van-form @submit="onSubmit">
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
      </van-cell-group>
      <div class="longin">
        <van-button block native-type="submit" round type="primary">
          登录账号
        </van-button>
        <van-cell title="" to="/user/register" value="还没有账号？点击注册"></van-cell>
      </div>
    </van-form>
  </div>
  <copyright/>
</template>

<style scoped>
@import "../assets/css/public.css";
.longin{
  margin: 16px 14px 0 14px;
}
</style>
