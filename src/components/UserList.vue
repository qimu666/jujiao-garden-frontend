<template>
  <div v-if="users.length <=0" class="null">
    <van-empty description="暂无数据"/>
  </div>
  <div v-if="users.length >0 && users">
    <div v-for="user in users" id="card" class="card">
      <van-swipe-cell>
        <van-card
            :desc="'简介：'+user.desc"
            :thumb="user.avatarUrl ? user.avatarUrl :defaultPicture "
            :title="user.title"
            @click="showUser(user.id)"
        >
          <template #tags>
            <div v-if="user.tags.length<8" style="margin-bottom: 12px"></div>
            标签：<br>
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
  <div v-if="loading" class="center">
    <van-loading size="24px">加载中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {showNotify, showSuccessToast} from "vant";
import {useRouter} from "vue-router";
import {defaultPicture} from "../common/userCommon";
import userDate from "../../mock/indexUsers.json";

const router = useRouter()
const show_pop = ref("true")
const users = ref(userDate.slice(0, 10))
const tags = ref(users.value.tags)
const currentPage = ref(1);

const addUser = () => {
  showSuccessToast('添加');
}
const showUser = (id) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}


const page = ref(1) // 当前页码
const loading = ref(false) // 是否正在加载数据

const loadMoreData = () => {
  if (loading.value) return // 避免重复加载数据
  loading.value = true // 显示 loading 图标

  if (users.value.length >= userDate.length) {
    loading.value = false
    return
  }

  setTimeout(() => {
    const start = users.value.length // 从未加载的数据开始截取
    const end = start + 10 // 截取 10 条数据

    users.value = users.value.concat(userDate.slice(start, end))
    loading.value = false // 隐藏 loading 图标
    page.value++ // 下一页页码加1
  }, 1500)
}

const handleScroll = () => {
  if (loading.value) return // 避免重复加载数据
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
    loadMoreData()
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
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
@import "../assets/css/userList.css";
@import "../assets/css/public.css";

</style>