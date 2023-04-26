<template>
  <van-nav-bar v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)" fixed="fixed" left-arrow left-text="返回"
               :title="title" @click-right="onRight" @click-left="onLift">
    <template v-if="route.path ==='/friends'|| !SHOW_SEARCH.includes(route.path)" #right>
      <van-badge :content="applyFriendsCount" v-if="applyFriendsCount>0">
        <notice/>
      </van-badge>
      <notice v-else/>
    </template>
    <template v-else #right>
      <van-icon name="search" size="22"/>
      <span style="color: rgb(25,137,250)">标签</span>
    </template>
  </van-nav-bar>
  <div id="center">
    <router-view/>
  </div>
  <van-tabbar v-model="active" v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)" @change="onChange" route>
    <van-tabbar-item icon="search" name="index" replace to="/">推荐</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="friends" :badge="applyFriendsCount<=0?null:applyFriendsCount" replace
                     to="/friends">好友
    </van-tabbar-item>
    <van-tabbar-item icon="chat-o" name="chat" replace to="/public_chat">聊天厅</van-tabbar-item>
    <van-tabbar-item icon="home-o" name="team" replace to="/team">队伍</van-tabbar-item>
    <van-tabbar-item icon="manager-o" name="user" replace to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import routers from "../router/index";
import Notice from "../components/icon/Notice.vue";
import request from "../service/myAxios";
import qs from "qs";

const NOT_SHOW_NAVBAR_AND_TABBAR = ["/user/login", '/user/register']
const SHOW_SEARCH = ["/", '/team', '/public_chat', '/user', '/apply']

const title = ref();
const router = useRouter()
const route = useRoute()
const applyFriendsCount = ref(0)
const recordId = ref([])

routers.beforeEach((to) => {
  title.value = to.meta.title || "聚交园";
})

const onLift = () => {
  router.back()
};
const onRight = async () => {
  if (!SHOW_SEARCH.includes(route.path)) {
    const read = await request.get("/friends/read", {
      params: {
        ids: recordId.value
      }, paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params, {indices: false})
        }
      }
    })
    if (read) {
      recordId.value.length = 0
      applyFriendsCount.value = 0
    }
    await router.push("/apply")
  } else {
    await router.push("/search")
  }
};
const getRecord =async () => {
  const records = await request.get("/friends/getRecords")
  records.forEach(record => {
    if (record.status == 0) {
      recordId.value.push(record.id)
    }
  })
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code){
    const data = await request.post("/login/loginInfo", {
      code: code
    })
  }
  if (route.path!=="/"){
    applyFriendsCount.value = await onChange()
    await getRecord()
  }
})
const active = ref('name');

const onChange = async () => {
  if (active.value === "friends") {
    await getRecord()
  }
  return applyFriendsCount.value = await request.get("/friends/getRecordCount")
}

const loading = ref(true);

</script>

<style scoped>
#center {
  margin-top: 48px;
  padding-bottom: 60px;
}
</style>