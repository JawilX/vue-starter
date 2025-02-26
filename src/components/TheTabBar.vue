<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const tabBarStore = useTabBarStore()

watch(() => route.name, () => {
  tabBarStore.setCurTab(route)
}, { immediate: true })

watch(() => tabBarStore.curTab, (val) => {
  router.push(tabBarStore.cacheRoutes[val] || { name: val })
})
</script>

<template>
  <ATabs
    v-model:active-key="tabBarStore.curTab"
    class="mt-2"
    size="mini"
    type="card-gutter"
    hide-content
    :editable="tabBarStore.cacheTabs.length > 1"
    @delete="(name: string) => tabBarStore.deleteTab(name)"
  >
    <ATabPane v-for="item in tabBarStore.cacheTabs" :key="item.name" :title="item.title" />
  </ATabs>
</template>

<style scoped lang="less">
:deep(.arco-tabs-nav::before) {
  display: none;
}
:deep(.arco-tabs-tab) {
  margin: 0 8px 0 0 !important;
  padding: 10px 16px !important;
  background-color: transparent !important;
  border: none !important;
  border-radius: 4px !important;
  font-weight: 400;

  &:hover {
    background-color: #e5e6eb !important;
    .arco-tabs-tab-close-btn {
      visibility: visible;
    }
  }
  .arco-tabs-tab-close-btn {
    visibility: hidden;
  }
}
:deep(.arco-tabs-tab-active) {
  background: white !important;
  &:hover {
    background: white !important;
  }

  .arco-tabs-tab-close-btn {
    visibility: visible;
  }
}
</style>
