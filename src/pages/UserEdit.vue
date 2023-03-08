<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="editValue"
          :label="title+'：'"
          :name="field"
          :placeholder="'请输入'+title"
          :rules="[{ required: true, message: '请填写'+title+'!' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button block native-type="submit" round type="primary">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {showConfirmDialog, showSuccessToast} from "vant";

const router = useRouter()
const route = useRoute()

const editValue = ref(route.query.value);
const title = ref(route.query.title);
const field = ref(route.query.field);

const onSubmit = () => {
  showConfirmDialog({
    message: '请确认当前' + title.value + '是否修改为' + editValue.value + '?',
  }).then(() => {
    showSuccessToast("修改成功")
    router.push({
      path: "/user",
      query: {
        editValue: editValue.value,
        field: field.value
      }
    })
  }).catch(() => {
    showSuccessToast("取消修改")
  });

};
</script>

<style scoped>

</style>