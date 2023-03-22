<template>
  <team-list/>
</template>

<script lang="ts" setup>
import TeamList from "../components/TeamList.vue"</script>

<style scoped>
:deep(.van-search__field) {
  flex: 1;
  align-items: center;
  padding: 0 var(--van-padding-xs) 0 0;
  height: var(--van-search-input-height);
  background-color: transparent;
}
</style>