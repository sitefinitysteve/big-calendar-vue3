import { z } from 'zod'
import { DEFAULT_LABELS } from '@/calendar/labels'
import type { ICalendarLabels } from '@/calendar/labels'

// Use `message`, never `required_error`: zod 4 silently ignores `required_error` and falls
// back to its own English text. `message` is honoured by both zod 3 and zod 4.
export function createEventSchema(labels: ICalendarLabels = DEFAULT_LABELS) {
  return z
    .object({
      user: z.string(),
      title: z.string().min(1, labels.validationTitleRequired),
      description: z.string().min(1, labels.validationDescriptionRequired),
      isAllDay: z.boolean().default(false),
      startDate: z.date({ message: labels.validationStartDateRequired }),
      startTime: z.object({ hour: z.number(), minute: z.number() }, { message: labels.validationStartTimeRequired }).optional(),
      endDate: z.date({ message: labels.validationEndDateRequired }),
      endTime: z.object({ hour: z.number(), minute: z.number() }, { message: labels.validationEndTimeRequired }).optional(),
      color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'gray'], { message: labels.validationColorRequired }),
    })
    .refine(
      data => {
        if (data.isAllDay) {
          const start = new Date(data.startDate)
          start.setHours(0, 0, 0, 0)
          const end = new Date(data.endDate)
          end.setHours(0, 0, 0, 0)
          return start <= end
        }

        if (!data.startTime || !data.endTime) return false

        const startDateTime = new Date(data.startDate)
        startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0)

        const endDateTime = new Date(data.endDate)
        endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0)

        return startDateTime < endDateTime
      },
      {
        message: labels.validationStartAfterEnd,
        path: ['startDate'],
      }
    )
}

export const eventSchema = createEventSchema()

export type TEventFormData = z.infer<typeof eventSchema>
