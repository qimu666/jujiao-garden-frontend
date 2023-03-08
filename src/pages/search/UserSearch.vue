<template>
  <form action="/">
    <van-search
        v-model="tagSearch"
        placeholder="请输入搜索标签"
        show-action
        @cancel="onCancel"
        @search="onSearch"
    />
  </form>
  <div id="tage" :class="{ 'has-border': tagSearchList.length > 0 }">
    <div v-if="tagSearchList.length<=0">
      <van-empty :image-size="[35, 20]" description="未选择标签"/>
    </div>
    <div v-else class="span_tag">
      <span v-for="tage in tagSearchList">
    <van-tag :show="show" class="van_tag" closeable size="large" type="primary"
             @close="close(tage)">{{ tage }}</van-tag>
  </span>
    </div>
  </div>
  <van-tree-select
      v-model:active-id="tagSearchList"
      v-model:main-active-index="activeIndex"
      :items="items"
  />
  <van-divider/>
  <van-space direction="vertical" fill>
    <van-button block type="primary" @click="searchResult">搜索</van-button>
  </van-space>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {showSuccessToast} from "vant";

const tagSearch = ref('');
const tagSearchList = ref([]);
const activeIndex = ref(0);
const show = ref(true);
const router = useRouter()
const items = [
  {
    text: '浙江',
    children: [
      {text: '杭州', id: '杭州'},
      {text: '温州', id: '温州'},
      {text: '宁波', id: '宁波'},
    ],
  },
  {
    text: '江苏',
    children: [
      {text: '南京', id: '南京'},
      {text: '无锡', id: '无锡'},
      {text: '徐州', id: '徐州'},
    ],
  },
  {
    text: '福建', children: [
      {text: '浙江', id: '浙江'},
      {text: '波', id: '波'},
      {text: '宁', id: '宁'},
    ],
  },
];

const ids = items.flatMap(item => item.children.map(child => child.id));

const onSearch = () => {
  if (ids.includes(tagSearch.value) && !tagSearchList.value.includes(tagSearch.value)) {
    tagSearchList.value.push(tagSearch.value)
  } else if (tagSearchList.value.includes(tagSearch.value)) {
    showSuccessToast("该标签已选择")
  } else {
    showSuccessToast("不存在该标签")
  }
}

const onCancel = () => {
  tagSearchList.value = []
};

const close = (tag) => {
  tagSearchList.value = tagSearchList.value.filter((tage) => tage !== tag);
};

const searchResult = () => {
  showSuccessToast("搜索结果")
  router.push({
    path: "/index",
    query: {
      tags: tagSearchList.value
    }
  })
}
</script>

<style scoped>
@import "../../assets/css/userSearch.css";
</style>