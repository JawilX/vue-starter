<script setup lang="ts">
const backPath = history.state.back
const router = useRouter()
if (backPath)
  router.replace({ path: backPath })
</script>

<template>
  <div class="mt-1/3 text-center">
    <AButton type="primary" @click="router.back()">
      返回
    </AButton>
  </div>
</template>
