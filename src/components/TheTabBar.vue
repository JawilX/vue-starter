<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const tabBarStore = useTabBarStore()

watch(() => route.name, () => {
  tabBarStore.setCurTab(route)
}, { immediate: true })

watch(() => tabBarStore.curTab, (val) => {
  router.push(tabBarStore.cacheRoutes[val])
})
</script>

<template>
  <ATabs
    v-model:active-key="tabBarStore.curTab"
    class="my-2"
    type="card-gutter"
    hide-content
    :editable="tabBarStore.cacheTabs.length > 1"
    @delete="name => tabBarStore.deleteTab(name as string)"
  >
    <ATabPane v-for="item in tabBarStore.cacheTabs" :key="item.name" :title="item.title" />
  </ATabs>
</template>

<style scoped lang="less">
:deep(.arco-tabs-nav::before) {
  display: none;
}
:deep(.arco-tabs-tab) {
  margin: 0 4px 0 0 !important;
  padding: 4px 10px !important;
  background-color: transparent;
  border: none;
  font-weight: 400;

  &:hover {
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
  color: #333 !important;

  .arco-tabs-tab-close-btn {
    visibility: visible;
  }
}
</style>
