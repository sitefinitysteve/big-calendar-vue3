import { z } from 'zod'
import { DEFAULT_LABELS } from '@/calendar/labels'
import type { ICalendarLabels } from '@/calendar/labels'

export function createEventSchema(labels: ICalendarLabels = DEFAULT_LABELS) {
  return z
    .object({
      user: z.string(),
      title: z.string().min(1, labels.validationTitleRequired),
      description: z.string().min(1, labels.validationDescriptionRequired),
      isAllDay: z.boolean().default(false),
      startDate: z.date({ required_error: labels.validationStartDateRequired }),
      startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: labels.validationStartTimeRequired }).optional(),
      endDate: z.date({ required_error: labels.validationEndDateRequired }),
      endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: labels.validationEndTimeRequired }).optional(),
      color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'gray'], { required_error: labels.validationColorRequired }),
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
