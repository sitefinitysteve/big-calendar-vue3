<script setup lang="ts">
import { onMounted } from 'vue'
import { Settings } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { USERS_MOCK, CALENDAR_ITEMS_MOCK } from '@/calendar/mocks'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ChangeBadgeVariantInput from '@/calendar/components/settings/ChangeBadgeVariantInput.vue'
import ChangeVisibleHoursInput from '@/calendar/components/settings/ChangeVisibleHoursInput.vue'
import ChangeWorkingHoursInput from '@/calendar/components/settings/ChangeWorkingHoursInput.vue'

const store = useCalendarStore()

onMounted(() => {
  store.initialize(USERS_MOCK, CALENDAR_ITEMS_MOCK)
})
</script>

<template>
  <div class="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
    <router-view />

    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" class="border-none">
        <AccordionTrigger class="flex-none gap-2 py-0 hover:no-underline">
          <div class="flex items-center gap-2">
            <Settings class="size-4" />
            <p class="text-base font-semibold">Calendar settings</p>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div class="mt-4 flex flex-col gap-6">
            <ChangeBadgeVariantInput />
            <ChangeVisibleHoursInput />
            <ChangeWorkingHoursInput />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
