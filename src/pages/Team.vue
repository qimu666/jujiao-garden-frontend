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

  <van-tabs v-model:active="active" @change="onTabChange">
    <van-tab name="public" title="公开">
      <template #title>
        <van-icon name="smile-o" size="16px"/>
        公开
      </template>
    </van-tab>
    <van-tab name="secret" title="加密">
      <template #title>
        <van-icon name="lock" size="16px"/>
        加密
      </template>
    </van-tab>
  </van-tabs>

  <div v-for="team in teamList" class="img">
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
      </template>

      <template #footer>
        <van-button plain size="small" type="primary" @click="addTeam">加入队伍</van-button>
        <van-button plain size="small" type="default" @click="showTeam">查看队伍</van-button>
      </template>
    </van-card>
    <div style="padding-top:4px "></div>
  </div>
</template>

<script lang="ts" setup>
import teamData from '../../mock/teamDate.json'
import {ref} from "vue";
import {showToast} from "vant";

const teamList = ref(teamData)

const onSearch = (val: string) => showToast(val);
const onClickButton = () => showToast(searchText.value + '搜索成功');

const active = ref('public');
const searchText = ref('');

const onTabChange = (name: string) => {
  showToast(name)
}

const showTeam = () => {
  showToast("查看队伍")
}
const addTeam = () => {
  showToast("成功加入队伍")
}
</script>

<style scoped>
.img :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>