<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

const store = useCalendarStore()

const triggerLabel = computed(() => {
  if (store.selectedUserId === 'all') return 'All'
  const user = store.users.find(u => u.id === store.selectedUserId)
  return user?.name ?? 'Select user'
})

function handleValueChange(value: string | number | bigint | Record<string, any> | null) {
  store.selectedUserId = value as string
}
</script>

<template>
  <Select :model-value="store.selectedUserId" @update:model-value="handleValueChange">
    <SelectTrigger class="flex-1 md:w-48">
      <span class="truncate">{{ triggerLabel }}</span>
    </SelectTrigger>

    <SelectContent align="end">
      <SelectItem value="all">
        <div class="flex items-center gap-1">
          <AvatarGroup :max="2" :count="store.users.length">
            <Avatar
              v-for="user in store.users.slice(0, 2)"
              :key="user.id"
              class="size-6 text-xxs"
            >
              <AvatarImage :src="user.picturePath ?? ''" :alt="user.name" />
              <AvatarFallback class="text-xxs">
                {{ user.name[0] }}
              </AvatarFallback>
            </Avatar>
          </AvatarGroup>
          All
        </div>
      </SelectItem>

      <SelectItem
        v-for="user in store.users"
        :key="user.id"
        :value="user.id"
        class="flex-1"
      >
        <div class="flex items-center gap-2">
          <Avatar class="size-6">
            <AvatarImage :src="user.picturePath ?? ''" :alt="user.name" />
            <AvatarFallback class="text-xxs">
              {{ user.name[0] }}
            </AvatarFallback>
          </Avatar>
          <p class="truncate">
            {{ user.name }}
          </p>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
