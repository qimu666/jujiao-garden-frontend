<template>
  <van-form @submit="onSubmit">
    <div class="center">
      <van-uploader :after-read="afterRead"
                    :max-count="1"
                    :max-size="5000 * 1024"
                    @oversize="onOversize">
        <div>
          <img class="img" :src="team?.teamAvatarUrl ? team.teamAvatarUrl :defaultPicture ">
        </div>
      </van-uploader>
    </div>
    <van-divider>队伍头像</van-divider>
    <van-cell-group inset>
      <van-field
          v-model="team.teamName"
          name="队伍名"
          label="队伍名"
          placeholder="队伍名"
          :rules="[{ required: true, message: '请填写队伍名' }]"
      />
      <van-field
          v-model="team.expireTime"
          is-link
          readonly
          name="datePicker"
          label="过期时间"
          :placeholder="team.expireTime?team.expireTime:'请选择过期时间'"
          @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-picker-group
            title="队伍过期时间"
            v-model="team.expireTime"
            next-step-text="下一步"
            :tabs="['选择日期', '选择时间']"
            @confirm="onConfirm"
            @cancel="onCancel"
        >
          <van-date-picker
              v-model="currentDate"
              :min-date="minDate"
              :max-date="maxDate"
          />
          <van-time-picker v-model="currentTime"/>
        </van-picker-group>
      </van-popup>

      <van-field name="maxNum" v-model="team.maxNum" label="最大人数">
        <template #input>
          <van-stepper v-model="team.maxNum" theme="round" button-size="22" disable-input/>
        </template>
      </van-field>
      <van-field
          v-model="teamStatusEnum[team.teamStatus]"
          is-link
          readonly
          name="picker"
          label="队伍状态"
          placeholder="点击队伍状态"
          @click="showTeamStatusPicker = true"
      />
      <van-popup v-model:show="showTeamStatusPicker" position="bottom">
        <van-picker
            :columns="teamStatusColumns"
            @confirm="teamStatusOnConfirm"
            @cancel="showTeamStatusPicker = false"
        />
      </van-popup>
      <div v-if="!team.teamPassword&&team.teamStatus===2">
        <van-field
            v-model="toPassword"
            is-link
            readonly
            name="toEditPassword"
            @click="updateEditPasswordStatus"
            label="修改密码"
        />
      </div>
      <div v-if="toEditPassword">
        <div v-if="team&&team.teamStatus===2">
          <van-field
              v-model="team.teamPassword"
              type="password"
              name="队伍密码"
              label="队伍密码"
              placeholder="请修改队伍的新密码"
              :rules="[{ required: true, message: '请填写队伍密码' }]"
          />
        </div>
      </div>
      <van-field
          v-model="team.announce"
          rows="1"
          autosize
          maxlength="50"
          label="队伍公告"
          type="textarea"
          show-word-limit
          placeholder="请输入队伍公告"
      />

      <van-field
          v-model="team.teamDesc"
          rows="1"
          autosize
          label="队伍描述"
          type="textarea"
          maxlength="50"
          placeholder="请输入队伍描述"
          show-word-limit
      />

    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        修改队伍
      </van-button>
    </div>
  </van-form>
  <div class="updateAvatarUrl" v-if="updateAvatarUrl">
    <van-loading color="#0094ff" size="10">头像更新中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import {showConfirmDialog, showFailToast, showNotify, showSuccessToast, showToast} from "vant";
import {teamStatusEnum} from "../constants/team";
import request from "../service/myAxios";
import {useRoute, useRouter} from "vue-router";

const toPassword = ref("点击修改队伍密码")
const toEditPassword = ref(false)
const route = useRoute()
const router = useRouter()

const team = ref<any>({
  id: null,
  teamName: '',
  teamAvatarUrl: "",
  teamPassword: '',
  teamDesc: '',
  maxNum: 5,
  expireTime: null,
  teamStatus: 0,
  announce: ''
})

const updateEditPasswordStatus = () => {
  toEditPassword.value = !toEditPassword.value
}
const showPicker = ref(false);

const show_teamAvatarUrl_pop = ref("true")

onMounted(async () => {
  const show_updateUserAvatarUrl = sessionStorage.getItem("teamAvatarUrl")
  show_teamAvatarUrl_pop.value = show_updateUserAvatarUrl ? show_updateUserAvatarUrl : show_teamAvatarUrl_pop.value
  if (show_teamAvatarUrl_pop.value === "true") {
    showNotify({message: '点击队伍头像可更换默认头像', type: "primary", duration: 2000});
    show_teamAvatarUrl_pop.value = "false"
    sessionStorage.setItem('teamAvatarUrl', show_teamAvatarUrl_pop.value)
  }
  const teamId = JSON.parse(route.query.teamId)
  team.value = await request.get(`/team/${teamId}`)
})

const formatDate = (datetime:string) => {
  const date = new Date(datetime.replace(/[年月日]/g, "/"));
  // 返回格式化后的日期
  return date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
}

const showTeamStatusPicker = ref(false);
const teamStatusColumns = [
  {text: '公开', value: 0},
  {text: '加密', value: 2},
];

const teamStatusOnConfirm = ({selectedOptions}:any) => {
  team.value.teamStatus = selectedOptions[0]?.value;
  showTeamStatusPicker.value = false;
};

const date = new Date()
// 默认队伍过期时间为一天
const currentDate = ref([date.getFullYear().toString(), date.getMonth().toString(), (date.getDate() + 1).toString()]);
const currentTime = ref([date.getHours().toString(), date.getMinutes().toString()]);
const onConfirm = () => {
  team.value.expireTime = currentDate.value.join('-') + ' ' + currentTime.value.join(':') + ":" + date.getSeconds()
  showPicker.value = false
};
const onCancel = () => {
  showToast('cancel');
};


const onSubmit = () => {
  showConfirmDialog({
    message: '请确认是否修改该队伍?',
  }).then(async () => {
    team.value.expireTime = formatDate(team.value.expireTime)
    const update = await request.post("/team/update", team.value)
    if (update) {
      showSuccessToast("修改成功")
      await router.replace("/team")
    }
  }).catch(() => {
    showSuccessToast("取消修改")
  });
};

const minDate = new Date()

const maxDate = new Date(2099, 5, 1)
const updateAvatarUrl = ref(false)

const afterRead = async (file: any) => {
  updateAvatarUrl.value = true
  if (updateAvatarUrl.value) {
    team.value.teamAvatarUrl = await request.post("/file/upload", {
      'file': file.file,
      'biz': "team_avatar"
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    setTimeout(() => {
      updateAvatarUrl.value = false
    }, 1000);  }
};

const onOversize = () => {
  showFailToast("头像上传大小不能超过500kb")
}

</script>

<style scoped>
@import "../../src/assets/css/public.css";
.updateAvatarUrl {
  position: fixed;
  top: 30%;
  left: 37%;
}
</style>