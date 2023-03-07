<template>
  <div class="center">
    <van-uploader :after-read="afterRead"
                  :max-count="1"
                  :max-size="5000 * 1024"
                  @oversize="onOversize">
      <van-image
          :src="user?.avatarUrl?user.avatarUrl:defaultPicture"
          fit="cover"
          height="88px"
          round
          width="88px"
      >
        <template v-slot:error>加载失败</template>
      </van-image>
    </van-uploader>
  </div>
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
  <van-cell :value="user.phone" icon="phone-o" is-link
            @click="update(user.phone,'联系方式','phone')">
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
  <van-cell :value="user.gender" icon="like-o" is-link
            @click="update(user.gender,'性别','gender')">
    <template #title>
      <span class="custom-title">性别</span>
    </template>
  </van-cell>
  <van-cell :value="user.userRole" icon="cluster-o" is-link
            @click="update(user.userRole,'角色','userRole')">
    <template #title>
      <span class="custom-title">角色</span>
    </template>
  </van-cell>
</template>

<script lang="ts" setup>
import {onMounted, Ref, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast} from "vant";
import {defaultPicture} from "../common/userCommon";

const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  // console.log(file);
};
const onOversize = () => {
  showFailToast("头像上传大小不能超过500kb")
}

type User = {
  username: string;
  userAccount: string;
  avatarUrl: string;
  gender: string;
  phone: string;
  email: string;
  createTime: string;
  userRole: string;
}
const route = useRoute()
const router = useRouter()
const roleEnum = {
  0: '普通用户',
  1: '管理员'
}

const u = {
  "username": "柒木",
  "userAccount": "qimuu",
  "avatarUrl": "https://typor-1305950889.cos.ap-guangzhou.myqcloud.com/typory/444.jfif",
  "gender": "男",
  "phone": "13211235312",
  "email": "248918282@qq.com",
  "createTime": "2023-03-06T12:06:53.000+00:00",
  "userRole": roleEnum[1]
}
const user: Ref<User> = ref(u)
const update = (val: string, name: string, field: string) => {
  router.push({
    path: "/user_edit",
    query: {
      title: name,
      value: val,
      field: field
    }
  })
}
onMounted(() => {
  const {field, editValue} = route.query
  if (field && editValue) {
    user.value[field] = editValue
  }
})
</script>

<style scoped>
.custom-title {
  margin-right: 4px;
  vertical-align: middle;
}

.center {
  margin-top: 40px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}
</style>