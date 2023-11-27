<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="mt-1/3 text-center">
    页面没找到, 点击
    <ALink @click="router.go(0)">
      刷新
    </ALink>
  </div>
</template>
