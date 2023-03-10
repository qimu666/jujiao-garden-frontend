<template>
  <div v-if="teamList.length <=0" class="null">
    <van-empty  image="search" description="暂无数据"/>
  </div>
  <div v-for="team in teamList">
    <van-card
        :desc="team.desc"
        :thumb="team.teamAvatarUrl"
        :title="team.title"
    >
      <template #tags>
        <van-tag plain style="color: #ee0a24; margin-right: 8px; margin-top: 8px" type="primary">公开</van-tag>
        <van-tag plain style="color: #ff976a;margin-right: 8px; margin-top: 8px" type="primary">
          队长：{{ team.captain }}
        </van-tag>
        <div style="padding-top: 3px">
          队伍人数：{{ 4 }} / {{ 5 }}
        </div>
        <div style="padding-top: 3px">
          创建时间：{{ 2022 }}年 {{ 3 }}月 &nbsp; {{ 7 }}日&nbsp{{ 18 }}:{{ 34 }}:{{ 34 }}
        </div>
        <div style="padding-top: 3px">
          过期时间：{{ 2022 }}年 {{ 3 }}月 {{ 17 }}日 18:34:34
        </div>
        <div style="margin-top: 12px;"></div>

      </template>
      <template #footer>
        <div style="margin-left: 103px">
        <span v-for="user of team.users.slice(0, 5)">
          <img :alt="user.title" :src="user.avatarUrl ? user.avatarUrl:defaultPicture" class="usersImgUrl">
        </span>
          <span v-if="team.users.length>4" class="omit">
               ...
          </span>
        </div>
        <van-button v-if="addStatus" plain size="small" type="primary" @click="addTeam">加入队伍</van-button>
        <van-button plain size="small" type="default" @click="showTeam(team.id)">查看队伍</van-button>
      </template>
    </van-card>
    <div style="padding-top:4px "></div>
  </div>
</template>

<script setup lang="ts">
import teamData from '../../mock/teamDate.json'
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import {useRouter} from "vue-router";
import {showSuccessToast} from "vant";
import getCurrent from "../service/currentUser";

const router = useRouter()

const teamList = ref(teamData)

const showTeam = (id: number) => {
  router.push({
    name: "teamShow",
    params: {teamId: id},
  })
  showSuccessToast("查看队伍")
}
const addTeam = () => {
  addStatus.value = false
  showSuccessToast("成功加入队伍")
}
const addStatus = ref(true)
onMounted(() => {
  getCurrent()
})
</script>

<style scoped>
@import "../assets/css/teamList.css";
</style>