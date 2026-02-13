import { ref, onMounted, onUnmounted } from 'vue'

export function useCurrentTime() {
  const currentTime = ref(new Date())
  let timer: ReturnType<typeof setInterval>

  onMounted(() => {
    timer = setInterval(() => {
      currentTime.value = new Date()
    }, 60 * 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { currentTime }
}
