## [Pinia 🍍](https://github.com/vuejs/pinia)

Intuitive, type safe, light and flexible Store for Vue using the composition api with DevTools support

### Example

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})
```
