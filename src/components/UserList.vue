<template>
  <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
  >
    <template #action>
      <div style="color: #1989fa" @click="onClickButton">搜索</div>
    </template>
  </van-search>
  <div v-if="!users||users.length <=0" class="null">
    <van-empty image="search" description="暂无数据"/>
  </div>
  <div v-if="users.length >0 && users">
    <div v-for="user in users" id="card" class="card">
      <van-swipe-cell>
        <van-card
            :desc="user.userDesc ?'简介：'+ user.userDesc:'简介：该用户比较懒,暂时没有设置'"
            :thumb="user.userAvatarUrl ? user.userAvatarUrl :defaultPicture "
            :title="user.username"
            @click="showUser(user.id)"
        >
          <template #tags>
            <div v-if="user.tags.length<7" style="margin-bottom: 12px"></div>
            标签：<br>
            <van-tag v-for="tag in user.tags" style="color: rgb(245, 67, 67)" class="tag" plain type="primary">
              {{ tag }}
            </van-tag>
            <span v-if="!user.tags||user.tags.length<=0">该用户暂时没有设置</span>
          </template>
        </van-card>
        <!--        <template #right>-->
        <!--          <van-button v-if="user?.id!==loginUser?.id" class="delete-button child" square text="添加好友" type="primary"-->
        <!--                      @click="addUser(user.id,user.username)"/>-->
        <!--          <van-button v-if="loginUser&&loginUser.userRole===1" square text="删除用户"-->
        <!--                      class="delete-button child" type="danger" @click="deleteUser(user.id)"/>-->
        <!--        </template>-->
      </van-swipe-cell>
      <div style="padding-top: 5px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {defaultPicture, jsonParseTag} from "../common/userCommon";
import request from "../service/myAxios";
import qs from 'qs'
import {UserType} from "../model/user";

const route = useRoute()
const router = useRouter()
const show_pop = ref("true")
const users = ref<UserType[]>([])
const searchText = ref('');

const loginUser = ref({})
const {tags} = route.query

const onSearch = async () => {
  await queryUser()
};

const onClickButton = async () => {
  await queryUser()
};

const queryUser = async () => {
  // 去除空格
  searchText.value = searchText.value.trim()
  const userList: UserType[] = await request.post("/user/search", {
    searchText: searchText.value
  })
  if (userList.length <= 0) {
    showFailToast("无搜索用户")
  }
  users.value = userList
  jsonParseTag(userList)
}

const deleteUser = (userId: number) => {
  showConfirmDialog({
    title: "删除用户",
    message:
        '确认删除该用户？',
  })
      .then(async () => {
        await request.post(`/user/delete?id=${userId}`).then(e => {
          if (e) {
            showSuccessToast("删除成功")
            users.value = users.value.filter(user => user.id !== userId)
          }
        })
      })
}

const showUser = (id: number) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}

onMounted(async () => {
  if (tags) {
    const searchTagsList: UserType[] = await request.get(`/user/search/tags`, {
          params: {
            tagNameList: tags
          },
          paramsSerializer: {
            serialize:
                (params) => {
                  return qs.stringify(params, {indices: false})
                }
          }
        }
    )
    users.value = searchTagsList
    jsonParseTag(searchTagsList)
  } else {
    let userList: UserType[] = await request.get("/user/search")
    if (userList) {
      users.value = userList
      jsonParseTag(userList)
    }
  }
  // const show_session = sessionStorage.getItem("show_pop")
  // show_pop.value = show_session ? show_session : show_pop.value
  // if (show_pop.value === "true") {
  //   showNotify({message: '右滑可以添加好友', type: "primary", duration: 1000});
  //   show_pop.value = "false"
  //   sessionStorage.setItem('show_pop', show_pop.value)
  // }
  loginUser.value = sessionStorage.getItem("longUser") ? JSON.parse(sessionStorage.getItem("longUser")) : undefined
})


</script>
<style scoped>
@import "../assets/css/userList.css";
@import "../assets/css/public.css";

:deep(.van-search__field) {
  flex: 1;
  align-items: center;
  padding: 0 var(--van-padding-xs) 0 0;
  height: var(--van-search-input-height);
  background-color: transparent;
}
</style>