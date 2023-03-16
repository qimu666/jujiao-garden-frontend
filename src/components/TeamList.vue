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
        <span v-if="!isUserInTeam(team)">
        <van-button plain size="mini" type="primary" icon="plus" @click="joinTeam(team.id)">加入队伍
        </van-button>
        <van-button plain size="mini" type="default" icon="eye-o" @click="showTeam(team.id)">查看队伍</van-button>
        </span>
        <span v-if="isUserInTeam(team)">
        <van-button plain size="mini" type="danger" icon="close" @click="quitTeam(team.id)">退出队伍
        </van-button>
        <van-button plain size="mini" type="primary" icon="replay" @click="updateTeam(team.id)">更新队伍</van-button>
        </span>

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
const loginUser = ref({})
const teamSet = ref([])
const teamId = ref([])
const showTeam = (id) => {
  teamId.value.push(id)
  router.push({
    name: "teamShow",
    query: {teamId: teamId.value},
  })
}
// 使用Vue的响应式数据机制更新队伍信息
const joinTeam = async (tid) => {
  const joinTeamUser = await request.post("/team/join", {
    teamId: tid,
    password: null
  })
  if (joinTeamUser) {
    showSuccessToast("加入成功")
    // 更新队伍信息
    teamSet.value.forEach(team => {
      if (team.id === tid) {
        team.userSet.push(joinTeamUser)
      }
    })
  }
}

const updateTeam = (tid) => {
  showSuccessToast("更新队伍" + tid)
}

const quitTeam = (tid) => {
  showSuccessToast("退出队伍" + tid)
}

const isUserInTeam = (team) => {
  console.log(team.userSet);
  console.log(loginUser.value);
  // Array.prototype.some() 方法用于检测数组中是否至少有一个元素符合指定的条件，
  // 如果有则返回 true，否则返回 false。
  // 回调函数将会对数组中的每个元素执行，直到找到第一个满足条件的元素为止。
  return team.userSet.some(user => user.id === loginUser.value.id);
}
onMounted(async () => {
  loginUser.value = await getCurrent()
  const {teamsId} = route.query
  if (teamsId) {
    const teamsById = await request.get("/team/teamsByIds", {
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