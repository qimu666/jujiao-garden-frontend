<template>
  <team-list/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import TeamList from "../components/TeamList.vue";
import getCurrent from "../service/currentUser";

const route = useRoute()

const teamsId = ref([])

onMounted(() => {
  getCurrent()

  teamsId.value = route.params.teamsId.split(",")
  console.log(teamsId.value)
})
</script>

<style scoped>
</style>