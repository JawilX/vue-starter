<script setup lang="ts">
import type { RouteNamedMap } from 'vue-router/auto-routes'
import { IconToLeft, IconToRight } from '@arco-design/web-vue/es/icon'

const modelCollapsed = defineModel('collapsed', {
  type: Boolean,
  default: false,
})

const router = useRouter()
const route = useRoute()

const menuStore = useMenuStore()
const menus = menuStore.list
const items = menuStore.all

const selectedKeys = ref<string[]>([])
watch(() => route.name, () => {
  const cur = route.name as string
  const curSplit = cur.split('-')
  if (cur.endsWith('-detail')) {
    const name = items.find(item => item.name?.startsWith(curSplit[0] + (curSplit.length > 2 ? `-${curSplit[1]}` : '')))?.name
    if (name)
      selectedKeys.value = [name]
  }
  else {
    selectedKeys.value = [cur]
  }
}, { immediate: true })

const openKeys = ref<string[]>([])
watch(() => route.name, (val) => {
  for (const menu of menus) {
    const curMenu = menu.children?.find((item: any) => item.name === val)
    if (curMenu)
      return openKeys.value = Array.from(new Set(openKeys.value.concat(menu.name || menu.meta.locale)))
  }
}, { immediate: true })

function goto(name: keyof RouteNamedMap) {
  router.push({ name, query: { t: Date.now() } })
}
</script>

<template>
  <div class="menu-scrollbar-thumb h-full w-220px overflow-y-auto">
    <div class="mb-2 flex items-center border-b border-gray-1 p-1">
      <span v-show="!modelCollapsed" class="ml-2 flex-1">
        App
      </span>
      <ATooltip v-if="modelCollapsed" position="right" trigger="hover" content="展开" @click="modelCollapsed = false">
        <AButton type="text" class="h-10! w-10! text-gray-5! hover:bg-gray-1!">
          <template #icon>
            <IconToRight />
          </template>
        </AButton>
      </ATooltip>
      <ATooltip v-else position="right" trigger="hover" content="收起" @click="modelCollapsed = true">
        <AButton type="text" class="h-10! w-10! text-gray-5! hover:bg-gray-1!">
          <template #icon>
            <IconToLeft />
          </template>
        </AButton>
      </ATooltip>
    </div>

    <AMenu
      v-model:collapsed="modelCollapsed"
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      :level-indent="36"
      auto-open-selected
    >
      <template v-for="submenu in menus">
        <ASubMenu v-if="submenu.children?.length" :key="submenu.name || submenu.meta.locale">
          <template v-if="submenu.meta.icon" #icon>
            <img :src="submenu.meta.icon" class="h-4 w-4 fill-current">
          </template>
          <template #title>
            {{ submenu.meta.locale }}
          </template>
          <AMenuItem v-for="menu in submenu.children" :key="menu.name" @click="goto(menu.name!)">
            <template v-if="menu.meta.icon" #icon>
              <img :src="menu.meta.icon" class="h-4 w-4">
            </template>
            {{ menu.meta.locale }}
          </AMenuItem>
        </ASubMenu>
        <AMenuItem v-else :key="submenu.name" @click="goto(submenu.name!)">
          <template v-if="submenu.meta.icon" #icon>
            <img :src="submenu.meta.icon" class="h-4 w-4 fill-current">
          </template>
          {{ submenu.meta.locale }}
        </AMenuItem>
      </template>
    </AMenu>
  </div>
</template>

<style scoped lang="less">
.menu-scrollbar-thumb {
  &::-webkit-scrollbar {
    /* 滚动条宽度 */
    width: 1px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb:hover,
  &::-webkit-scrollbar-thumb:active {
    background-color: transparent;
  }
}
</style>
