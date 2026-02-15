<script setup lang="ts">
import { watch } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { useForm, useFormValues } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCalendarStore } from '@/stores/calendar'
import type { IEvent } from '@/calendar/interfaces'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { TimeInput } from '@/components/ui/time-input'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { eventSchema } from '@/calendar/schemas'

const props = withDefaults(defineProps<{
  open: boolean
  startDate?: Date
  startTime?: { hour: number; minute: number }
}>(), {
  startDate: undefined,
  startTime: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'eventCreated': [event: IEvent]
}>()

const store = useCalendarStore()

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(eventSchema),
  initialValues: {
    title: '',
    description: '',
    isAllDay: false,
    startDate: props.startDate,
    startTime: props.startTime,
  },
})

const formValues = useFormValues()

watch(
  () => [props.startDate, props.startTime],
  () => {
    resetForm({
      values: {
        title: '',
        description: '',
        isAllDay: false,
        startDate: props.startDate,
        startTime: props.startTime,
        user: undefined,
        endDate: undefined,
        endTime: undefined,
        color: undefined,
      },
    })
  },
)

const onSubmit = handleSubmit(values => {
  const user = store.users.find(u => u.id === values.user)
  if (!user) return

  const startDateTime = new Date(values.startDate)
  const endDateTime = new Date(values.endDate)

  if (values.isAllDay) {
    startDateTime.setHours(0, 0, 0, 0)
    endDateTime.setHours(23, 59, 0, 0)
  } else {
    startDateTime.setHours(values.startTime!.hour, values.startTime!.minute)
    endDateTime.setHours(values.endTime!.hour, values.endTime!.minute)
  }

  const newEvent: IEvent = {
    id: Date.now(),
    user,
    title: values.title,
    color: values.color,
    description: values.description,
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    ...(values.isAllDay && { isAllDay: true }),
  }

  store.addEvent(newEvent)
  emit('eventCreated', newEvent)
  emit('update:open', false)
  resetForm()
})

const EVENT_COLORS = [
  { value: 'blue', label: 'Blue', bg: 'bg-blue-600' },
  { value: 'green', label: 'Green', bg: 'bg-green-600' },
  { value: 'red', label: 'Red', bg: 'bg-red-600' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-600' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-600' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-600' },
  { value: 'gray', label: 'Gray', bg: 'bg-neutral-600' },
] as const
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogDescription>
          <AlertTriangle class="mr-1 inline-block size-4 text-yellow-500" />
          This form is for demonstration purposes only and will not actually create an event. In a real application, submit the form to the backend API to save the event.
        </DialogDescription>
      </DialogHeader>

      <form id="add-event-form" class="grid gap-4 py-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="user">
          <FormItem>
            <FormLabel>Responsible</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="user in store.users" :key="user.id" :value="user.id">
                    <div class="flex items-center gap-2">
                      <Avatar class="size-6">
                        <AvatarImage :src="user.picturePath ?? ''" :alt="user.name" />
                        <AvatarFallback class="text-xxs">{{ user.name[0] }}</AvatarFallback>
                      </Avatar>
                      <p class="truncate">{{ user.name }}</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a title" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="isAllDay">
          <FormItem class="flex items-center justify-between">
            <FormLabel>All day</FormLabel>
            <FormControl>
              <Switch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="flex items-start gap-2">
          <FormField v-slot="{ value, handleChange }" name="startDate">
            <FormItem class="flex-1">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <SingleDayPicker
                  :model-value="value"
                  placeholder="Select a date"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-if="!formValues.isAllDay" v-slot="{ value, handleChange }" name="startTime">
            <FormItem class="flex-1">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <TimeInput
                  :model-value="value"
                  :hour-cycle="12"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex items-start gap-2">
          <FormField v-slot="{ value, handleChange }" name="endDate">
            <FormItem class="flex-1">
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <SingleDayPicker
                  :model-value="value"
                  placeholder="Select a date"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-if="!formValues.isAllDay" v-slot="{ value, handleChange }" name="endTime">
            <FormItem class="flex-1">
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <TimeInput
                  :model-value="value"
                  :hour-cycle="12"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="color">
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in EVENT_COLORS" :key="c.value" :value="c.value">
                    <div class="flex items-center gap-2">
                      <div :class="['size-3.5 rounded-full', c.bg]" />
                      {{ c.label }}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button form="add-event-form" type="submit">Create Event</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
