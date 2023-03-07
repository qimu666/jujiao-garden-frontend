<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showToast} from "vant";


const router = useRouter()
const username = ref('');
const password = ref('');
const onSubmit = async () => {
  showToast('登陆成功')
  await router.push("/index")

  // const loginUser = await request.post("/user/login", {
  //   "userAccount": username.value,
  //   "userPassword": password.value
  // })
  // if (loginUser) {
  //   console.log(loginUser)
  //   showToast('登陆成功')
  //   await router.push("/index")
  // }
};
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="username"
          :rules="[{ required: true, message: '请填写账号!' }]"
          label="账号 ："
          name="账号"
          placeholder="账号"
      />
      <van-field
          v-model="password"
          :rules="[{ required: true, message: '请填写密码!' }]"
          label="密码 ："
          name="密码"
          placeholder="密码"
          type="password"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button block native-type="submit" round type="primary">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
</style>
