<template>
  <div style="padding-top: 5px"></div>
  <!--  <div class="xindong">-->
  <!--    <div style="float: left;">-->
  <!--      <van-icon name="like-o" size="22px"/>-->
  <!--      心动模式-->
  <!--    </div>-->
  <!--    <div style="text-align: right">-->
  <!--      <van-switch v-model="checked" size="22px" @click="cardiacSwitch()"/>-->
  <!--    </div>-->
  <!--  </div>-->
  <user-list/>
  <div style="padding-top: 35px"></div>
  <div style="position: fixed;bottom: 50px;width: 100%">
    <copyright/>
  </div>
</template>

<script setup>
import {showSuccessToast} from "vant";
import {ref} from "vue";
import UserList from "../components/UserList.vue";
import Copyright from "../components/Copyright.vue";

const checked = ref(true);
const cardiacSwitch = () => {
  if (checked.value) {
    showSuccessToast("心动模式已开启")
  } else {
    showSuccessToast("心动模式已关闭")
  }
}
</script>

<style scoped>
.xindong {
  margin: 1px;
  padding: 1px 16px;
}

</style>