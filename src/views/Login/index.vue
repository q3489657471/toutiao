<template>
  <div>
    <van-nav-bar title="登录" />
    <van-form @submit="onSubmit" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji1"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #button>
          <van-button
            round
            size="mini"
            id="getcode"
            v-if="isShowCode"
            native-type="button"
            @click="sendCode"
            >获取验证码</van-button
          >
          <van-count-down
            :time="3 * 1000"
            format="ss秒"
            v-else
            @finish="isShowCode = true"
          />
        </template>
      </van-field>
      <div style="margin: 0.42rem">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mobileRules, codeRules } from './rules'
import { login, getCodeAPI } from '@/api'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCode: true
    }
  },
  methods: {
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
    },

    async onSubmit() {
      try {
        this.loading()
        // 如果表单校验不通过，这个方法不会触发

        const {
          data: { data: token }
        } = await login(this.mobile, this.code)

        this.$store.commit('SET_TOKEN', token)

        // 跳转到profile
        this.$router.push('/my')

        this.$toast.success('登录成功！')

        // console.log('res@@', res)
      } catch (error) {
        // 细分失败
        const status = error.response.status

        let message = '请重新登陆'

        if (status === 400) {
          message = error.response.data.message
        }

        this.$toast.fail(message)
      }
    },

    sendCode() {
      // 1.验证手机号
      this.$refs.form.validate('mobile').then(async () => {
        // loading
        this.loading()
        try {
          // 2.发送请求
          await getCodeAPI(this.mobile)

          this.$toast.success('获取验证码成功!!')
          // 3.显示倒计时
          this.isShowCode = false
        } catch (error) {
          const status = error.response.status

          let message = '手机号不正确呀'

          if (status === 429) {
            message = error.response.data.message
          }

          this.$toast.fail(message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: rgba(51, 150, 252);
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
:deep(.form) {
  .van-field__label {
    flex: 1;
  }
  .van-cell__value {
    flex: 20;
  }
  .toutiao {
    font-size: 40px;
  }
}
/* :deep(.van-button--mini){
  background-color: rgba(238, 238, 238);
}
:deep(.van-button--default){
  color: rgba(145, 123, 102);
} */
//验证码样式
// & 代表父亲的类名
// 等同于#getcode .van-button--mini 。并集
:deep(#getcode) {
  &.van-button--mini {
    padding: 0 0.2rem;
    background-color: rgba(238, 238, 238);
  }
  &.van-button--default {
    color: rgba(145, 123, 102);
  }
}
</style>
