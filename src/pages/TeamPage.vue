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
  <team-list/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {showSuccessToast} from "vant";
import {useRouter} from "vue-router";
import TeamList from "../components/TeamList.vue";

const router = useRouter()

const onSearch = (val: string) => showSuccessToast(val);
const onClickButton = () => showSuccessToast(searchText.value + '搜索成功');

const searchText = ref('');

</script>

<style scoped>
:deep(.van-search__field) {
  flex: 1;
  align-items: center;
  padding: 0 var(--van-padding-xs) 0 0;
  height: var(--van-search-input-height);
  background-color: transparent;
}
</style>