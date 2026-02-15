import { z } from 'zod'

export const eventSchema = z
  .object({
    user: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    isAllDay: z.boolean().default(false),
    startDate: z.date({ required_error: 'Start date is required' }),
    startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: 'Start time is required' }).optional(),
    endDate: z.date({ required_error: 'End date is required' }),
    endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: 'End time is required' }).optional(),
    color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'gray'], { required_error: 'Color is required' }),
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
      message: 'Start date cannot be after end date',
      path: ['startDate'],
    }
  )

export type TEventFormData = z.infer<typeof eventSchema>
