<template>
  <div>
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 用户信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image round width="0.8rem" height="0.8rem" :src="userInfo.photo" />
      <!-- 用户选择文件的表单 -->
      <input
        type="file"
        hidden
        accept=".jpg,.jfif,.png"
        ref="file"
        @change="selectPhoto"
      />
    </van-cell>
    <!-- 头像的弹层 -->
    <van-popup
      class="avator-popup"
      v-model="isShowAvator"
      closeable
      :style="{ height: '100%', width: '100%' }"
    >
      <update-avator
        @update-avator="userInfo.photo = $event"
        :photo="photo"
        v-if="isShowAvator"
      ></update-avator>
    </van-popup>
    <van-cell title="昵称" is-link :value="userInfo.name"> </van-cell>
    <van-cell title="性别" is-link :value="userInfo.gender ? '女' : '男'">
    </van-cell>
    <van-cell title="生日" is-link :value="userInfo.birthday"> </van-cell>
  </div>
</template>

<script>
import { getUserInfo } from '@/api'
import UpdateAvator from './components/UpdateAvator'
import { resolveToBase64 } from '@/utils'
export default {
  name: 'User',
  components: {
    UpdateAvator
  },
  data() {
    return {
      userInfo: {},
      isShowAvator: false,
      photo: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (error) {
        this.$toast.fail('获取用户信息失败，请刷新')
      }
    },
    async selectPhoto(e) {
      // 1.获取用户选择的图片的文件对象
      // e.target 触发事件的元素
      // - HTMLInputElement.files 伪数组，存储的用户...
      const file = e.target.files[0]
      // console.dir(file)

      // 2.把file文件对象处理成img标签可识别的url
      // URL.createObjectURL(file对象) --> img标签的src可识别的url
      // const url = window.URL.createObjectURL(file)

      const url = await resolveToBase64(file)

      this.photo = url

      // 4.清空value，让用户可以选择同一张图片
      e.target.value = ''

      // 5.展示弹层组件
      this.isShowAvator = true
    }
  }
}
</script>

<style scoped lang="less">
:deep(.navbar) {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.avator-popup {
  background-color: #000;
}
</style>
