<template>
  <div v-if="route.path==='/team'">
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
  </div>
  <van-tabs v-model:active="active" @change="onTabChange">
    <van-tab name="1" title="公开">
      <template #title>
        <van-icon name="fire-o" color="#ee0a24" size="16px"/>
        公开
      </template>
    </van-tab>
    <van-tab name="2" title="加密">
      <template #title>
        <van-icon name="lock" size="16px"/>
        加密
      </template>
    </van-tab>
    <div v-if="route.path==='/team'">
      <van-tab name="3" title="我的">
        <template #title>
          <van-icon name="user-o" size="16px"/>
          我的
        </template>
      </van-tab>
    </div>
  </van-tabs>
  <div style="padding-top: 4px"></div>
  <van-button class="add-button" type="primary" icon="plus" @click="toAddTeam"/>
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
        <van-tag plain style="color: #ee0a24; margin-right: 8px; margin-top: 8px" type="primary">
          {{ teamStatusEnum[team.teamStatus] }}
        </van-tag>
        <van-tag plain style="color: #ff976a;margin-right: 8px; margin-top: 8px" type="primary">
          队长：{{ team.user.username }}
        </van-tag>
        <div style="padding-top: 3px">
          队伍人数：{{ team.userSet.length }} / {{ team.maxNum }} 人
          <span>
            &nbsp;--&nbsp; 剩余位置：{{
              team.maxNum + 2 - team.userSet.length <= 0 ? "已满员" : team.maxNum + 2 - team.userSet.length + " 人"
            }}
        </span>
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
        <div
            v-if="loginUser.id===team.user.id ||loginUser.userRole===1"
            style="margin-left: 7px">
        <span v-for="user of team.userSet.slice(0, 5)">
          <img :alt="user.username" :src="user.userAvatarUrl ? user.userAvatarUrl:defaultPicture" class="usersImgUrl">
        </span>
          <span v-if="team.userSet.length>5" class="omit">
               ...
          </span>
        </div>
        <div v-if="loginUser.id!==team.user.id &&loginUser.userRole!==1" style="margin-left: 103px">
        <span v-for="user of team.userSet.slice(0, 5)">
          <img :alt="user.username" :src="user.userAvatarUrl ? user.userAvatarUrl:defaultPicture" class="usersImgUrl">
        </span>
          <span v-if="team.userSet.length>5" class="omit">
               ...
          </span>
        </div>
        <span v-if="!isUserInTeam(team)">
        <van-button plain size="mini" type="primary" icon="plus" @click="joinTeam(team.id,team.teamStatus)">加入队伍
        </van-button>
        </span>
        <span v-if="isUserInTeam(team)">
        <van-button v-if="loginUser.id===team.user.id||loginUser.userRole===1" plain size="mini" type="danger"
                    icon="close" @click="disbandTeam(team.id)">解散队伍</van-button>
         <van-button v-else plain size="mini" type="danger" icon="close"
                     @click="quitTeam(team.id)">退出队伍</van-button>
        </span>
        <van-button v-if="loginUser.id===team.user.id||loginUser.userRole===1" plain size="mini" type="primary"
                    icon="replay"
                    @click="updateTeam(team.id)">更新队伍
        </van-button>
        <van-button plain size="mini" type="default" icon="eye-o" @click="showTeam(team.id)">查看队伍</van-button>
      </template>
    </van-card>
    <div style="padding-top:4px"></div>
  </div>

  <van-dialog v-model:show="showEncryptionTeam" title="请输入队伍口令" show-cancel-button @confirm="sendJoin">
    <div style="padding-top:8px "></div>
    <van-field v-model="encryptionTeamPassword"
               type="password"
               :rules="[{ required: true, message: '请输入队伍口令' }]"
               style="text-align: center;width: 150px;margin-left:85px"
    />
    <div style="padding-top:8px "></div>

  </van-dialog>
  <div style="padding-bottom: 32px;"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import {useRoute, useRouter} from "vue-router";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import request from "../service/myAxios";
import qs from "qs";
import {teamStatusEnum} from "../constants/team.ts";

const showEncryptionTeam = ref(false);
const route = useRoute()
const router = useRouter()
const loginUser = ref({})
const teamSet = ref([])
const teamList = ref([])
const teamId = ref([])
const toSend = ref(false)
const active = ref("1");

const encryptionTeamPassword = ref();
const encryptionTeamId = ref()
const sendJoin = async () => {
  await joinTeamPost(encryptionTeamId.value)
  toSend.value = false
}

const searchText = ref('');

const onSearch = async () => {
  await queryTeam()
};

const onClickButton = async () => {
  await queryTeam()
};
const queryTeam = async () => {
  // 去除空格
  searchText.value=searchText.value.trim()
 const teams=  await request.post("/team/search", {
    searchText: searchText.value
  })
  teamSet.value=teams.teamSet
}

const showTeam = (id) => {
  teamId.value.push(id)
  router.push({
    name: "teamShow",
    query: {teamId: teamId.value},
  })
}
// 使用Vue的响应式数据机制更新队伍信息
const joinTeam = async (id, teamStatus) => {
  if (teamStatus === 2) {
    showEncryptionTeam.value = true
    encryptionTeamId.value = id
  } else {
    showConfirmDialog({
      message: '请确认是否加入该队伍?',
    }).then(async () => {
      await joinTeamPost(id)
    }).catch(() => {
      showSuccessToast("取消成功")
    })
  }
}
const joinTeamPost = async (teamId) => {
  const joinTeamUser = await request.post("/team/join", {
    teamId: teamId,
    password: encryptionTeamPassword.value
  })
  if (joinTeamUser) {
    showSuccessToast("加入成功")
    // 更新队伍信息
    teamSet.value.forEach(team => {
      if (team.id === teamId) {
        loginUser.value = joinTeamUser
        team.userSet.push(joinTeamUser)
      }
    })
  }
}

const toAddTeam = () => {
  router.push("/team/create")
}
const updateTeam = (tid) => {
  showSuccessToast("更新队伍" + tid)
}

const disbandTeam = (tid) => {
  showConfirmDialog({
    message: '请确认是否解散该队伍?',
  }).then(async () => {
    const dissolutionTeam = await request.post(`/team/${tid}`)
    if (dissolutionTeam) {
      showSuccessToast("解散成功")
      // 过滤掉删除的队伍id
      teamSet.value = teamSet.value.filter(team => team.id !== tid)
    }
  }).catch(() => {
    showSuccessToast("取消成功")
  });
}

const quitTeam = (tid) => {
  showConfirmDialog({
    message: '请确认是否退出该队伍?',
  }).then(async () => {
    const quitTeam = await request.post(`/team/quit/${tid}`)
    if (quitTeam) {
      showSuccessToast("退出成功")
      // 过滤掉退出的用户id
      teamSet.value.filter(team => {
        team.userSet = team.userSet.filter(user => user.id !== loginUser.value.id
        )
      });
    }
  }).catch(() => {
    showSuccessToast("取消成功")
  });
}

const isUserInTeam = (team) => {
  // Array.prototype.some() 方法用于检测数组中是否至少有一个元素符合指定的条件，
  // 如果有则返回 true，否则返回 false。
  // 回调函数将会对数组中的每个元素执行，直到找到第一个满足条件的元素为止。
  return team.userSet.some(user => user.id === loginUser.value.id);
}

onMounted(async () => {
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
    publicTeam(teamsById)
  } else {
    const teams = await request.get("/team/teams")
    publicTeam(teams)
  }
  // 默认公开
})

const publicTeam = (teams) => {
  teamSet.value = teams.teamSet
  teamList.value = teams.teamSet
  onTabChange('1')
}

const onTabChange = (name) => {
  teamSet.value = teamList.value
  if (name === "1") {
    teamSet.value = teamSet.value.filter(team => team.teamStatus === 0)
  }
  if (name === "2") {
    teamSet.value = teamSet.value.filter(team => team.teamStatus === 2)
  }
  if (name === "3") {
    teamSet.value = teamSet.value.filter(team => {
      const currentUserInTeam = team.userSet.some(user => user.id === loginUser.value.id);
      const isCreatedByCurrentUser = team.user.id === loginUser.value.id;
      return currentUserInTeam || isCreatedByCurrentUser
    });
  }
}
</script>

<style scoped>
@import "../assets/css/teamList.css";
</style>