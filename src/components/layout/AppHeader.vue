<script setup lang="ts">
import { Calendar, ArrowUpRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ToggleTheme from '@/components/layout/ToggleTheme.vue'
</script>

<template>
  <header class="mx-auto flex h-[88px] w-full max-w-screen-2xl items-center justify-center">
    <div class="my-3 flex h-14 w-full items-center justify-between px-8">
      <div class="flex items-center gap-3.5">
        <div class="flex size-12 items-center justify-center rounded-full border p-3">
          <Calendar class="size-6 text-foreground" />
        </div>

        <div class="space-y-1">
          <p class="text-lg font-medium leading-6">Big calendar</p>
          <p class="text-sm text-foreground">
            Vue port of
            <a
              href="https://github.com/lramos33/big-calendar"
              target="_blank"
              class="inline-flex gap-0.5 text-sm underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              lramos33/big-calendar
              <ArrowUpRight :size="12" class="text-foreground" />
            </a>
          </p>
        </div>
      </div>

      <div class="hidden items-center gap-4 md:flex">
        <a
          href="https://github.com/lramos33/big-calendar"
          target="_blank"
          class="inline-flex gap-0.5 text-sm hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          View original on GitHub
          <ArrowUpRight :size="14" class="text-foreground" />
        </a>

        <ToggleTheme />
      </div>
    </div>
  </header>
</template>
