<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const currentTheme = ref<'light' | 'dark'>()

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    currentTheme.value = 'dark'
    document.documentElement.classList.add('dark')
  } else {
    currentTheme.value = 'light'
    document.documentElement.classList.remove('dark')
  }
})

function toggleTheme() {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  currentTheme.value = newTheme
  localStorage.setItem('theme', newTheme)
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <Button v-if="currentTheme" variant="ghost" size="icon" @click="toggleTheme">
    <Sun v-if="currentTheme === 'light'" />
    <Moon v-if="currentTheme === 'dark'" />
  </Button>
</template>
