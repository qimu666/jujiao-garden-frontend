<template>
  <van-form @submit="onSubmit">
    <div style="padding-top: 18px"/>
    <van-cell-group inset>
      <van-field
          v-model="oldPassword"
          label="登录密码"
          name="旧密码"
          placeholder="请输入登录密码"
          :rules="[{ required: true, message: '请填写登录密码!' }]"
      />
      <van-field
          v-model="newPassword"
          label="新密码"
          type="password"
          name="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请填写新密码!' }]"
      />
      <van-field
          v-model="checkPassword"
          label="确认密码"
          type="password"
          name="确认密码"
          placeholder="请确认密码"
          :rules="[{ required: true, message: '请填写相同密码!' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button block native-type="submit" round type="primary">
        修改
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showConfirmDialog, showSuccessToast} from "vant";
import getCurrent from "../service/currentUser"
import request from "../service/myAxios";

const router = useRouter()
const route = useRoute()

const oldPassword = ref();
const newPassword = ref();
const checkPassword = ref();

const id = ref(route.query.id);


const onSubmit = () => {
  showConfirmDialog({
    message: '请确认是否修改密码！',
  }).then(async () => {
    const updateData = await request.post("/user/update/password", {
      id: id.value,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      checkPassword: checkPassword.value
    })
    if (updateData) {
      showSuccessToast("修改成功")
      await router.push({
        path: "/user",
      })
    }
  }).catch(() => {
    showSuccessToast("取消修改")
  });

};
onMounted(() => {
  getCurrent()
})
</script>

<style scoped>

</style>