import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomeLanding from './components/HomeLanding.vue'
import mediumZoom from 'medium-zoom'
import { useRoute } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeLanding', HomeLanding)
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 全站正文图片支持点击放大（截图、二维码等）
      mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => initZoom())
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
