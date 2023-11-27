<script setup lang="ts">
const router = useRouter()

const menuStore = useMenuStore()

async function refresh() {
  await menuStore.fetchConfig()
  if (menuStore.all.length > 0) {
    await router.push({ name: menuStore.all[0].name })
    location.reload()
  }
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <AModal
    :visible="true"
    :fullscreen="true"
    :mask="false"
    :esc-to-close="false"
    :closable="false"
    :footer="false"
    modal-animation-name="none"
  >
    <AResult class="mt-20" status="403" subtitle="该账号无权限，请切换账号或者联系管理员">
      <template #extra>
        <ASpace>
          <AButton type="primary" @click="refresh">
            重新获取
          </AButton>
        </ASpace>
      </template>
    </AResult>
  </AModal>
</template>
