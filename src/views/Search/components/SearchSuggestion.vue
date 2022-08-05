<template>
  <div>
    <van-cell
      v-for="(item, index) in hightlightSuggestions"
      :key="index"
      icon="search"
    >
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestionsAPI } from '@/api'
import { debounce } from 'lodash'
//  #region
// 1.动态正则
// -字面量 /aasdasd/ig
// -new RegExp(变量, 'ig')

// 2.字符串的replace
// - 第一个参数可以是正则
// - 第二个参数可以是函数，函数的返回值是要替换的字符串
// - match：正则匹配上的字符

/* 'Auglar'.replace(/a/ig,function(match){
  return `<span>${match}</span>`
})
'<span>A</span>ugl<span>a</span>r' */
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  computed: {
    hightlightSuggestions() {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((item) => {
        return item.replace(reg, (match) => {
          return `<span style="color: red">${match}</span>`
        })
      })
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler() {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    // 获取搜索建议
    // 防抖
    // 1.延迟执行
    // 2.干掉上一次的定时器 clearTimeout（id）

    // 处理搜索建议+防抖
    // 单一职责原则
    getSearchSuggestion: debounce(async function () {
      try {
        const { data } = await getSearchSuggestionsAPI(this.keywords)
        // 等价的: data.options.filter((str) => Boolean(str))===data.options.filter(Boolean)
        // this.suggestions = data.data.options.filter((str) => Boolean(str))
        this.suggestions = data.data.options.filter(Boolean)
      } catch (error) {
        this.$toast.fail('获取搜索建议失败')
      }
    }, 300)
  }
}
</script>

<style></style>
