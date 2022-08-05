<template>
  <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model.trim="keywords"
        background="#3296fa"
        show-action
        placeholder="请输入搜索关键词"
        class="search"
        @search="onSearch"
        @focus="onSearchFocus"
      />
    </form>
    <!-- 搜索历史、建议、结果 -->
    <!-- <search-suggestion></search-suggestion>
    <search-result></search-result>
    <search-history></search-history> -->

    <!-- 动态组件 -->
    <component :is="componentName" :keywords="keywords"></component>
  </div>
</template>

<script>
import SearchSuggestion from './components/SearchSuggestion'
import SearchResult from './components/SearchResult'
import SearchHistory from './components/SearchHistory'
export default {
  name: 'Search',
  data() {
    return {
      keywords: '',
      // 用于记录用户是否搜索了
      isShowSearchResult: false
    }
  },
  methods: {
    onSearch() {
      console.log('正在搜索')
      this.isShowSearchResult = true
    },
    onSearchFocus() {
      // 如果keywords为'' 显示搜索历史
      // 如果keywords有值，显示搜索建议
      this.isShowSearchResult = false
    }
  },
  components: {
    SearchSuggestion,
    SearchResult,
    SearchHistory
  },
  computed: {
    componentName() {
      // 如果输入的是空字符串那么渲染搜索历史
      if (this.keywords === '') {
        return 'SearchHistory'
      }

      if (this.isShowSearchResult) {
        // 用变量记录是否显示搜索结果
        return 'SearchResult'
      }

      // 既不显示搜索历史，也不显示搜索结果，就渲染搜索建议
      return 'SearchSuggestion'
    }
  }
}
</script>

<style scoped lang="less">
// 属性选择器
.search {
  [role='button'] {
    color: #fff;
  }
}
</style>
