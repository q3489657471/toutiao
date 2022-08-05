<template>
  <div>
    <van-nav-bar class="navbar">
      <template #title>
        <van-button
          class="search-btn"
          round
          icon="search"
          @click="$router.push('/search')"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <article-list :id="item.id"></article-list>
      </van-tab>
      <span class="toutiao toutiao-gengduo1" @click="show = true"></span>
    </van-tabs>
    <!-- 频道弹层 -->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channel-popup
        :myChannels="myChannels"
        @close="show = false"
        @change-active="active = $event"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></channel-popup>
    </van-popup>
  </div>
</template>

<script>
import {
  getMyChannel as getMyChannelAPI,
  delChannel,
  addChannel,
  setMyChannelsToLocal,
  getMyChannelByLocal
} from '@/api'
import ArticleList from './component/ArticleList.vue'
import ChannelPopup from './component/ChannelPopup.vue'

export default {
  components: {
    ArticleList,
    ChannelPopup
  },
  name: 'Home',
  data() {
    return {
      active: 0,
      myChannels: [],
      show: false
    }
  },
  created() {
    this.initMyChannels()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.tokenObj.token
    }
  },
  methods: {
    initMyChannels() {
      // 1. 登录的仔
      // - 发请求 服务器
      // 2.未登录的仔
      // - 本地
      // - 服务器
      if (this.isLogin) {
        this.getMyChannel()
      } else {
        const myChannels = getMyChannelByLocal()
        if (myChannels) {
          this.myChannels = myChannels
        } else {
          this.getMyChannel()
        }
      }
    },
    async getMyChannel() {
      try {
        const { data } = await getMyChannelAPI()
        this.myChannels = data.data.channels
      } catch (error) {
        console.dir(error)
        this.$toast.fail('获取频道失败，请刷新')
      }
    },
    // 删除频道
    async delChannel(id) {
      this.$toast.loading({
        message: '正在删除频道...',
        forbidClick: true
      })
      try {
        const newChannels = this.myChannels.filter((item) => item.id !== id)
        // 删除我的频道
        if (this.isLogin) {
          // -1.删除服务器的数据
          await delChannel(id)
        } else {
          setMyChannelsToLocal(newChannels)
        }

        // -2.删除页面上的数据
        this.myChannels = newChannels

        this.$toast.success('删除频道成功')
      } catch (error) {
        this.$toast.fail('删除频道失败')
      }
    },
    // 添加频道
    async addChannel(channel) {
      this.$toast.loading({
        message: '正在添加频道...',
        forbidClick: true
      })
      try {
        if (this.isLogin) {
          await addChannel(channel.id, this.myChannels.length)
        } else {
          setMyChannelsToLocal([...this.myChannels, channel])
        }

        this.myChannels.push(channel)

        this.$toast.success('添加频道成功')
      } catch (error) {
        this.$toast.fail('添加频道失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  position: sticky;
  top: 0;
  left: 0;
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }

  :deep(.van-icon) {
    color: #fff;
  }
}

.search-btn {
  width: 7.4rem;
  height: 0.85333rem;
  background-color: #5babfb;
  color: #fff;

  &.van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}

/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo1 {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;
  z-index: 999;

  position: fixed;
  top: 92px;
  right: 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 88px - 100px);
  padding-bottom: 100px;
  overflow: auto;
}
</style>
