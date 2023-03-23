<template>
  <van-form @submit="onSubmit">
    <div style="padding-top: 5px"/>
    <div v-if="field==='gender'" style="margin: 15px">
      <van-field
          v-model="editValue"
          is-link
          readonly
          label="性别"
          placeholder="选择性别"
          @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
            :columns="gender"
            @cancel="showPicker = false"
            @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <div v-if="field==='userRole'" style="margin: 15px">
      <van-field
          v-model="editValue"
          is-link
          readonly
          label="角色"
          placeholder="选择角色"
          @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
            :columns="role"
            @cancel="showPicker = false"
            @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <div v-if="field !=='userRole' && field !=='gender'">
      <van-cell-group inset>
        <van-field
            v-model="editValue"
            :label="title+'：'"
            :name="field"
            :placeholder="'请输入'+title"
            :rules="[{ required: true, message: '请填写'+title+'!' }]"
        />
      </van-cell-group>
    </div>
    <div style="margin: 16px;">
      <van-button block native-type="submit" round type="primary">
        修改
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showConfirmDialog, showSuccessToast} from "vant";
import getCurrent from "../service/currentUser"
import {genderMap, roleMap} from "../model/userMap";
import request from "../service/myAxios";
import {gender, genderId, role, roleId} from "../enum/userEnum";

const router = useRouter()
const route = useRoute()

const showPicker = ref(false);
const editValue = ref(route.query.value);
const title = ref(route.query.title);
const field = ref(route.query.field);
const id = ref(route.query.id);

if (field.value === "userRole") {
  editValue.value = roleMap[editValue.value]
}

if (field.value === "gender") {
  editValue.value = genderMap[editValue.value]
}

const onConfirm = ({selectedOptions}:any) => {
  showPicker.value = false;
  editValue.value = selectedOptions[0].text;
};

let UpdateValue = () => {
  let newEditValue = ref();
  if (field.value === "userRole") {
    newEditValue.value = roleId[editValue.value]
  } else if (field.value === "gender") {
    newEditValue.value = genderId[editValue.value]
  } else {
    newEditValue.value = editValue.value
  }
  return newEditValue.value
}
const onSubmit = () => {
  showConfirmDialog({
    message: '请确认当前' + title.value + '是否修改为' + editValue.value + '?',
  }).then(async () => {
    const updateData = await request.post("/user/update", {
      id: id.value,
      [field.value]: UpdateValue()
    })
    if (updateData){
        showSuccessToast("修改成功")
        await router.push({
          path: "/user",
        })
    }
  }).catch(() => {
    showSuccessToast("取消修改")
  });

};
onMounted(() => {
  getCurrent()
})
</script>

<style scoped>

</style>