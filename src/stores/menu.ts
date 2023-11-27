import type { IMenuRes, IMenuRoute } from '~/api/_user'
import { fetchMenuList } from '~/api/_user'
import { cloneDeep } from '~/utils'

export const useMenuStore = defineStore('menu', () => {
  const visible = ref(true)

  const isFromServer = ref(false)

  const config = ref<IMenuRes | null | undefined>({ menuRoute: [], permission: [] })
  async function fetchConfig() {
    if (config.value?.menuRoute?.length || !isFromServer.value)
      return
    const { data } = await fetchMenuList()
    config.value = data.value
  }

  const local: IMenuRoute[] = [{
    meta: { locale: '系统' },
    children: [
      { name: '/', meta: { locale: '首页', hideChildrenInMenu: true } },
    ],
  }]

  const all = computed(() => {
    const res: IMenuRoute[] = []
    const traverse = (item: IMenuRoute) => {
      if (item.children)
        item.children.forEach(traverse)

      if (item.name)
        res.push(item)
    }
    if (isFromServer.value)
      config.value?.menuRoute.forEach(traverse)
    else
      local.forEach(traverse)

    res.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
    return res
  })

  const list = computed(() => {
    let res: IMenuRoute[] = isFromServer.value ? cloneDeep(config.value?.menuRoute) : local
    if (!res?.length)
      return []
    res = res[0].children!
    res.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
    const traverse = (routes: IMenuRoute[], layer: number) => {
      if (!routes)
        return null

      const collector: any = routes.map((element) => {
        if (element.meta?.hideInMenu === true)
          return null

        // leaf node
        if (element.meta?.hideChildrenInMenu || !element.children) {
          element.children = []
          return element
        }

        // route filter hideInMenu true
        element.children = element.children.filter(x => x.meta?.hideInMenu !== true)
        // Associated child node
        const subItem = traverse(element.children, layer + 1)

        if (subItem.length) {
          element.children = subItem
          return element
        }
        // the else logic
        if (layer >= 1) {
          element.children = subItem
          return element
        }

        if (element.meta?.hideInMenu === false)
          return element

        return null
      })
      return collector.filter(Boolean)
    }

    return traverse(res, 0)
  })

  return { visible, isFromServer, config, fetchConfig, all, list }
})
