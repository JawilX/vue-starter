import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface ITab {
  name: string
  title: string
}

export const useTabBarStore = defineStore('tabBar', () => {
  const visible = ref(true)

  /**
   * 默认 allTab 的值会在获取菜单后通过 setAllTab 赋值，默认为
   * route.name: route.meta.locale
   * 如果对应的tab名不想跟菜单的名字保持一样，可以在这里进行覆盖
   */
  const allTab = ref<Record<string, string>>({
    // '/': '首页',
  })

  const curTab = ref('')
  const cacheTabs = ref<ITab[]>([])
  const cacheRoutes = ref<any>({})

  function setAllTab(tabs: Record<string, string>) {
    allTab.value = Object.assign({}, tabs, allTab.value)
  }

  function setCurTab(route: RouteLocationNormalizedLoaded) {
    const name = route.name as string
    curTab.value = name
    if (!Object.keys(allTab.value).includes(name))
      return

    const index = cacheTabs.value.findIndex(item => item.name === name)
    if (index === -1)
      cacheTabs.value.push({ name, title: allTab.value[name] })
    cacheRoutes.value[name] = { ...route }
  }

  function deleteTab(name: string) {
    const index = cacheTabs.value.findIndex(item => item.name === name)

    if (name === curTab.value)
      curTab.value = (cacheTabs.value[index + 1] || cacheTabs.value[index - 1]).name

    if (index > -1)
      cacheTabs.value.splice(index, 1)
  }

  return { visible, curTab, cacheTabs, cacheRoutes, setAllTab, setCurTab, deleteTab }
})
