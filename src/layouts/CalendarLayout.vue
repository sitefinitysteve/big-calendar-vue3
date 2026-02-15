<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Settings } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { USERS_MOCK, CALENDAR_ITEMS_MOCK } from '@/calendar/mocks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ChangeBadgeVariantInput from '@/calendar/components/settings/ChangeBadgeVariantInput.vue'
import ChangeVisibleHoursInput from '@/calendar/components/settings/ChangeVisibleHoursInput.vue'
import ChangeWorkingHoursInput from '@/calendar/components/settings/ChangeWorkingHoursInput.vue'
import ChangeCalendarOptionsInput from '@/calendar/components/settings/ChangeCalendarOptionsInput.vue'

const store = useCalendarStore()
const settingsOpen = ref(false)

onMounted(() => {
  store.initialize(USERS_MOCK, CALENDAR_ITEMS_MOCK)
})
</script>

<template>
  <div class="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
    <router-view />

    <div class="flex justify-start">
      <Dialog v-model:open="settingsOpen">
        <DialogTrigger as-child>
          <Button variant="outline" size="sm">
            <Settings class="size-4" />
            Calendar settings
          </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calendar settings</DialogTitle>
            <DialogDescription>Configure calendar appearance and behavior.</DialogDescription>
          </DialogHeader>

          <div class="flex flex-col gap-6 py-4">
            <ChangeBadgeVariantInput />
            <ChangeCalendarOptionsInput />
            <ChangeVisibleHoursInput />
            <ChangeWorkingHoursInput />
          </div>

          <DialogFooter>
            <DialogClose as-child>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
