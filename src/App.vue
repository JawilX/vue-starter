<script setup lang="ts">
const route = useRoute()
const collapsed = ref(false)

const menuStore = useMenuStore()
const tabBarStore = useTabBarStore()
</script>

<template>
  <AConfigProvider size="small">
    <ALayout class="h-screen">
      <ALayoutSider v-if="menuStore.visible" :width="220" :collapsed="collapsed">
        <TheMenu v-model:collapsed="collapsed" />
      </ALayoutSider>
      <ALayoutContent class="box-border flex flex-col bg-[#f7f8fa] px-5 pb-4">
        <div v-if="tabBarStore.visible">
          <TheTabBar />
        </div>
        <div class="flex-1 overflow-auto">
          <Suspense>
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component :is="Component" :key="route.fullPath" />
              </KeepAlive>
            </RouterView>
          </Suspense>
        </div>
      </ALayoutContent>
    </ALayout>
  </AConfigProvider>
</template>
