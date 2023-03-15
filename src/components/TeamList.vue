<template>
  <div v-if="!teamSet||teamSet.length <=0" class="null">
    <van-empty image="search" description="暂无数据"/>
  </div>
  <div v-for="team in teamSet">
    <van-card
        :desc="team.teamDesc"
        :thumb="team.teamAvatarUrl"
        :title="team.teamName"
    >
      <template #tags>
        <van-tag plain style="color: #ee0a24; margin-right: 8px; margin-top: 8px" type="primary">公开</van-tag>
        <van-tag plain style="color: #ff976a;margin-right: 8px; margin-top: 8px" type="primary">
          队长：{{ team.user.username }}
        </van-tag>
        <div style="padding-top: 3px">
          队伍人数：{{ team.userSet.length }}/{{ team.maxNum }}
          <!--          {{ 4 }} / {{ 5 }}-->
        </div>
        <div style="padding-top: 3px">
          {{ '创建时间：' + team.createTime }}
        </div>
        <div style="padding-top: 3px">
          {{ '过期时间：' + team.expireTime }}
        </div>
        <div style="margin-top: 12px;"></div>

      </template>
      <template #footer>
        <div style="margin-left: 103px">
        <span v-for="user of team.userSet.slice(0, 5)">
          <img :alt="user.username" :src="user.userAvatarUrl ? user.userAvatarUrl:defaultPicture" class="usersImgUrl">
        </span>
          <span v-if="team.userSet.length>4" class="omit">
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

<script setup>
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import {useRoute, useRouter} from "vue-router";
import {showSuccessToast} from "vant";
import getCurrent from "../service/currentUser";
import request from "../service/myAxios";
import qs from "qs";

const route = useRoute()
const router = useRouter()

const teamSet = ref([])
const teamId = ref([])

const showTeam = (id) => {
  router.push({
    name: "teamShow",
    params: {teamId: id},
  })
}
const addTeam = () => {
  addStatus.value = false
  showSuccessToast("成功加入队伍")
}
const addStatus = ref(true)
onMounted(async () => {
  await getCurrent()
  const {teamsId} = route.query
  if (teamsId) {
    const teamsById = await request.get("/team/teamsById", {
      params: {
        teamId: teamsId,
      }, paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params, {indices: false})
        }
      }
    })
    teamSet.value = teamsById.teamSet
  } else {
    const teams = await request.get("/team/teams")
    teamSet.value = teams.teamSet
  }
})
</script>

<style scoped>
@import "../assets/css/teamList.css";
</style>