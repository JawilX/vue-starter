import type { App } from 'vue'
import type { Router } from 'vue-router/auto'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useMenuStore } from '~/stores/menu'

function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (/refresh|403/.test(to.name as string))
      return next()

    const menuStore = useMenuStore()
    await menuStore.fetchConfig()

    const tabBarStore = useTabBarStore()
    tabBarStore.setAllTab(menuStore.all.reduce((prev, cur) => {
      if (cur.name)
        prev[cur.name] = cur.meta.locale
      return prev
    }, {} as any))

    let exist = false
    for (const menu of menuStore.all) {
      if (to.name === menu.name) {
        exist = true
        break
      }
    }
    const firstMenuName = menuStore.all.find(menu => !menu.meta.hideInMenu)?.name
    if (!exist && firstMenuName)
      next({ name: firstMenuName })
    else if (!exist && !firstMenuName)
      next({ name: '403' })
    else
      next()
  })
}

export async function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })
  app.use(router)
  setupRouterGuard(router)
  await router.isReady()
}
