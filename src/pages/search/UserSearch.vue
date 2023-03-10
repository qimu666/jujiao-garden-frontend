<template>
  <form action="/">
    <van-search
        v-model="newTagSearch"
        placeholder="请输入搜索标签"
        show-action
        @cancel="onCancel"
        @search="onSearch"
    />
  </form>
  <div id="tage" :class="{ 'has-border': existedTagSearchList.length > 0 }">
    <div v-if="existedTagSearchList.length<=0">
      <van-empty :image-size="[35, 20]" description="未选择标签"/>
    </div>
    <div v-else class="span_tag">
      <span v-for="tage in existedTagSearchList">
    <van-tag :show="show" class="van_tag" closeable size="large" type="primary"
             @close="close(tage)">{{ tage }}</van-tag>
  </span>
    </div>
  </div>
  <van-tree-select
      v-model:active-id="existedTagSearchList"
      v-model:main-active-index="activeIndex"
      :items="userTagsList"
  />
  <van-divider/>
  <van-space direction="vertical" fill>
    <van-button block type="primary" @click="searchResult">搜索</van-button>
  </van-space>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showFailToast, showSuccessToast} from "vant";
import getCurrent from "../../service/currentUser";
import userTagsList from "../../constants/UserTagsList";

const newTagSearch = ref('');
const existedTagSearchList = ref([]);
const activeIndex = ref(0);
const show = ref(true);
const router = useRouter()

const ids = userTagsList.flatMap(item => item.children.map(child => child.id));
const toUpperCaseTags = ids.map(id => id.charAt(0).toUpperCase() + id.slice(1));

const onSearch = () => {
  const newTagUpperCase = newTagSearch.value.charAt(0).toUpperCase() + newTagSearch.value.slice(1)
  const existedTagSearchListUpperCase = existedTagSearchList.value.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));

  if (toUpperCaseTags.includes(newTagUpperCase) && !existedTagSearchListUpperCase.includes(newTagUpperCase)) {
    existedTagSearchList.value.push(newTagUpperCase)
  } else if (existedTagSearchListUpperCase.includes(newTagUpperCase)) {
    showSuccessToast("该标签已选择")
  } else {
    showSuccessToast("不存在该标签")
  }
}

const onCancel = () => {
  existedTagSearchList.value = []
};

const close = (tag) => {
  existedTagSearchList.value = existedTagSearchList.value.filter((tage) => tage !== tag);
};

const searchResult = () => {

  if (existedTagSearchList.value.length > 0) {
    router.push({
      path: "/",
      query: {
        tags: existedTagSearchList.value
      }
    })
  } else {
    showFailToast("未选择标签")
  }
}
onMounted(() => {
  getCurrent()
})
</script>

<style scoped>
@import "../../assets/css/userSearch.css";
</style>