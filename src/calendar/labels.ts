import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'
import type { Locale } from 'date-fns'

export interface ICalendarLabels {
  // Views
  viewDay: string
  viewWeek: string
  viewMonth: string
  viewYear: string
  viewAgenda: string
  viewDayTooltip: string
  viewWeekTooltip: string
  viewMonthTooltip: string
  viewYearTooltip: string
  viewAgendaTooltip: string

  // Header
  addEvent: string
  userAll: string
  userSelectPlaceholder: string

  // Interpolated
  eventsCount: (n: number) => string
  moreEvents: (n: number) => string
  dayOfTotal: (day: number, total: number) => string

  // Event fields
  allDay: string
  happeningNow: string
  noCurrentEvents: string
  noEventsMonth: string
  fieldResponsible: string
  fieldTitle: string
  fieldDescription: string
  fieldColor: string
  fieldStartDate: string
  fieldStartTime: string
  fieldEndDate: string
  fieldEndTime: string
  fieldDate: string
  placeholderTitle: string
  placeholderSelectOption: string
  placeholderSelectDate: string

  // Dialog titles & actions
  dialogAddTitle: string
  dialogEditTitle: string
  dialogAddDescription: string
  dialogEditDescription: string
  buttonCancel: string
  buttonCreate: string
  buttonSave: string
  buttonEdit: string
  buttonDelete: string

  // Colors
  colorBlue: string
  colorGreen: string
  colorRed: string
  colorYellow: string
  colorPurple: string
  colorOrange: string
  colorGray: string

  // Settings
  settingsBadgeVariant: string
  settingsVisibleHours: string
  settingsWorkingHours: string
  settingsAvailableViews: string
  settingsShowUserSelect: string
  settingsCanAdd: string
  settingsCanEdit: string
  settingsCanDelete: string
  badgeColored: string
  badgeDot: string
  badgeMixed: string
  selectVariant: string
  from: string
  to: string
  closed: string
  apply: string

  // Weekday abbreviations
  weekdaySun: string
  weekdayMon: string
  weekdayTue: string
  weekdayWed: string
  weekdayThu: string
  weekdayFri: string
  weekdaySat: string

  // Day names
  sunday: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string

  // Validation
  validationTitleRequired: string
  validationDescriptionRequired: string
  validationStartDateRequired: string
  validationStartTimeRequired: string
  validationEndDateRequired: string
  validationEndTimeRequired: string
  validationColorRequired: string
  validationStartAfterEnd: string

  // Week view mobile
  weekViewNotAvailable: string
  weekViewSwitchView: string

  // Visible hours tooltip
  visibleHoursTooltip: string
  workingHoursTooltip: string
}

export const DEFAULT_LABELS: ICalendarLabels = {
  // Views
  viewDay: 'Day',
  viewWeek: 'Week',
  viewMonth: 'Month',
  viewYear: 'Year',
  viewAgenda: 'Agenda',
  viewDayTooltip: 'View by day',
  viewWeekTooltip: 'View by week',
  viewMonthTooltip: 'View by month',
  viewYearTooltip: 'View by year',
  viewAgendaTooltip: 'View by agenda',

  // Header
  addEvent: 'Add Event',
  userAll: 'All',
  userSelectPlaceholder: 'Select user',

  // Interpolated
  eventsCount: (n: number) => `${n} events`,
  moreEvents: (n: number) => `${n} more...`,
  dayOfTotal: (day: number, total: number) => `Day ${day} of ${total}`,

  // Event fields
  allDay: 'All day',
  happeningNow: 'Happening now',
  noCurrentEvents: 'No appointments or consultations at the moment',
  noEventsMonth: 'No events scheduled for the selected month',
  fieldResponsible: 'Responsible',
  fieldTitle: 'Title',
  fieldDescription: 'Description',
  fieldColor: 'Color',
  fieldStartDate: 'Start Date',
  fieldStartTime: 'Start Time',
  fieldEndDate: 'End Date',
  fieldEndTime: 'End Time',
  fieldDate: 'Date',
  placeholderTitle: 'Enter a title',
  placeholderSelectOption: 'Select an option',
  placeholderSelectDate: 'Select a date',

  // Dialog titles & actions
  dialogAddTitle: 'Add New Event',
  dialogEditTitle: 'Edit Event',
  dialogAddDescription: 'This form is for demonstration purposes only and will not actually create an event. In a real application, submit the form to the backend API to save the event.',
  dialogEditDescription: 'This form only updates the current event state locally for demonstration purposes. In a real application, you should submit this form to a backend API to persist the changes.',
  buttonCancel: 'Cancel',
  buttonCreate: 'Create Event',
  buttonSave: 'Save changes',
  buttonEdit: 'Edit',
  buttonDelete: 'Delete',

  // Colors
  colorBlue: 'Blue',
  colorGreen: 'Green',
  colorRed: 'Red',
  colorYellow: 'Yellow',
  colorPurple: 'Purple',
  colorOrange: 'Orange',
  colorGray: 'Gray',

  // Settings
  settingsBadgeVariant: 'Badge Variant',
  settingsVisibleHours: 'Visible Hours',
  settingsWorkingHours: 'Working Hours',
  settingsAvailableViews: 'Available Views',
  settingsShowUserSelect: 'Show User Select',
  settingsCanAdd: 'Can Add Events',
  settingsCanEdit: 'Can Edit Events',
  settingsCanDelete: 'Can Delete Events',
  badgeColored: 'Colored',
  badgeDot: 'Dot',
  badgeMixed: 'Mixed',
  selectVariant: 'Select variant',
  from: 'From',
  to: 'To',
  closed: 'Closed',
  apply: 'Apply',

  // Weekday abbreviations
  weekdaySun: 'Sun',
  weekdayMon: 'Mon',
  weekdayTue: 'Tue',
  weekdayWed: 'Wed',
  weekdayThu: 'Thu',
  weekdayFri: 'Fri',
  weekdaySat: 'Sat',

  // Day names
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',

  // Validation
  validationTitleRequired: 'Title is required',
  validationDescriptionRequired: 'Description is required',
  validationStartDateRequired: 'Start date is required',
  validationStartTimeRequired: 'Start time is required',
  validationEndDateRequired: 'End date is required',
  validationEndTimeRequired: 'End time is required',
  validationColorRequired: 'Color is required',
  validationStartAfterEnd: 'Start date cannot be after end date',

  // Week view mobile
  weekViewNotAvailable: 'Weekly view is not available on smaller devices.',
  weekViewSwitchView: 'Please switch to daily or monthly view.',

  // Visible hours tooltip
  visibleHoursTooltip: 'Set the visible time range for the day and week views.',
  workingHoursTooltip: 'Configure working hours for each day of the week.',
}

export const CALENDAR_LABELS_KEY: InjectionKey<ComputedRef<ICalendarLabels>> = Symbol('calendar-labels')

export const CALENDAR_FLAGS_KEY: InjectionKey<{ showViewTooltips: ComputedRef<boolean> }> = Symbol('calendar-flags')

export const CALENDAR_DATE_LOCALE_KEY: InjectionKey<ComputedRef<Locale | undefined>> = Symbol('calendar-date-locale')

export function useCalendarLabels(): ComputedRef<ICalendarLabels> {
  return inject(CALENDAR_LABELS_KEY) ?? computed(() => DEFAULT_LABELS)
}

export function useCalendarFlags() {
  return inject(CALENDAR_FLAGS_KEY) ?? { showViewTooltips: computed(() => true) }
}

export function useDateLocale(): ComputedRef<Locale | undefined> {
  return inject(CALENDAR_DATE_LOCALE_KEY) ?? computed(() => undefined)
}
