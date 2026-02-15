import { computed, ref, watchEffect } from 'vue'
import type { Locale } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { es } from 'date-fns/locale/es'
import type { ICalendarLabels } from '@/calendar/labels'

export type TLocale = 'en' | 'fr' | 'es'

export const LOCALE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'fr' as const, label: 'Fran\u00e7ais' },
  { value: 'es' as const, label: 'Espa\u00f1ol' },
]

const FR_LABELS: Partial<ICalendarLabels> = {
  viewDay: 'Jour',
  viewWeek: 'Semaine',
  viewMonth: 'Mois',
  viewYear: 'Ann\u00e9e',
  viewAgenda: 'Agenda',
  viewDayTooltip: 'Afficher par jour',
  viewWeekTooltip: 'Afficher par semaine',
  viewMonthTooltip: 'Afficher par mois',
  viewYearTooltip: 'Afficher par ann\u00e9e',
  viewAgendaTooltip: 'Afficher l\'agenda',

  addEvent: 'Ajouter un \u00e9v\u00e9nement',
  userAll: 'Tous',
  userSelectPlaceholder: 'S\u00e9lectionner un utilisateur',

  eventsCount: (n: number) => `${n} \u00e9v\u00e9nement${n !== 1 ? 's' : ''}`,
  moreEvents: (n: number) => `${n} de plus...`,
  dayOfTotal: (day: number, total: number) => `Jour ${day} sur ${total}`,

  allDay: 'Toute la journ\u00e9e',
  happeningNow: 'En ce moment',
  noCurrentEvents: 'Aucun rendez-vous ou consultation en ce moment',
  noEventsMonth: 'Aucun \u00e9v\u00e9nement pr\u00e9vu pour le mois s\u00e9lectionn\u00e9',
  fieldResponsible: 'Responsable',
  fieldTitle: 'Titre',
  fieldDescription: 'Description',
  fieldColor: 'Couleur',
  fieldStartDate: 'Date de d\u00e9but',
  fieldStartTime: 'Heure de d\u00e9but',
  fieldEndDate: 'Date de fin',
  fieldEndTime: 'Heure de fin',
  fieldDate: 'Date',
  placeholderTitle: 'Entrez un titre',
  placeholderSelectOption: 'S\u00e9lectionner une option',
  placeholderSelectDate: 'S\u00e9lectionner une date',

  dialogAddTitle: 'Ajouter un \u00e9v\u00e9nement',
  dialogEditTitle: 'Modifier l\'\u00e9v\u00e9nement',
  dialogAddDescription: 'Ce formulaire est \u00e0 des fins de d\u00e9monstration uniquement et ne cr\u00e9era pas r\u00e9ellement un \u00e9v\u00e9nement. Dans une vraie application, soumettez le formulaire \u00e0 l\'API backend pour sauvegarder l\'\u00e9v\u00e9nement.',
  dialogEditDescription: 'Ce formulaire met uniquement \u00e0 jour l\'\u00e9tat actuel de l\'\u00e9v\u00e9nement localement \u00e0 des fins de d\u00e9monstration. Dans une vraie application, soumettez ce formulaire \u00e0 une API backend pour persister les changements.',
  buttonCancel: 'Annuler',
  buttonCreate: 'Cr\u00e9er l\'\u00e9v\u00e9nement',
  buttonSave: 'Enregistrer',
  buttonEdit: 'Modifier',
  buttonDelete: 'Supprimer',

  colorBlue: 'Bleu',
  colorGreen: 'Vert',
  colorRed: 'Rouge',
  colorYellow: 'Jaune',
  colorPurple: 'Violet',
  colorOrange: 'Orange',
  colorGray: 'Gris',

  settingsBadgeVariant: 'Variante de badge',
  settingsVisibleHours: 'Heures visibles',
  settingsWorkingHours: 'Heures de travail',
  settingsAvailableViews: 'Vues disponibles',
  settingsShowUserSelect: 'Afficher la s\u00e9lection d\'utilisateur',
  settingsCanAdd: 'Peut ajouter des \u00e9v\u00e9nements',
  settingsCanEdit: 'Peut modifier des \u00e9v\u00e9nements',
  settingsCanDelete: 'Peut supprimer des \u00e9v\u00e9nements',
  badgeColored: 'Color\u00e9',
  badgeDot: 'Point',
  badgeMixed: 'Mixte',
  selectVariant: 'S\u00e9lectionner la variante',
  from: 'De',
  to: '\u00c0',
  closed: 'Ferm\u00e9',
  apply: 'Appliquer',

  weekdaySun: 'Dim',
  weekdayMon: 'Lun',
  weekdayTue: 'Mar',
  weekdayWed: 'Mer',
  weekdayThu: 'Jeu',
  weekdayFri: 'Ven',
  weekdaySat: 'Sam',

  sunday: 'Dimanche',
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',

  validationTitleRequired: 'Le titre est requis',
  validationDescriptionRequired: 'La description est requise',
  validationStartDateRequired: 'La date de d\u00e9but est requise',
  validationStartTimeRequired: 'L\'heure de d\u00e9but est requise',
  validationEndDateRequired: 'La date de fin est requise',
  validationEndTimeRequired: 'L\'heure de fin est requise',
  validationColorRequired: 'La couleur est requise',
  validationStartAfterEnd: 'La date de d\u00e9but ne peut pas \u00eatre apr\u00e8s la date de fin',

  weekViewNotAvailable: 'La vue hebdomadaire n\'est pas disponible sur les petits appareils.',
  weekViewSwitchView: 'Veuillez passer \u00e0 la vue journali\u00e8re ou mensuelle.',

  visibleHoursTooltip: 'D\u00e9finir la plage horaire visible pour les vues jour et semaine.',
  workingHoursTooltip: 'Configurer les heures de travail pour chaque jour de la semaine.',
}

const ES_LABELS: Partial<ICalendarLabels> = {
  viewDay: 'D\u00eda',
  viewWeek: 'Semana',
  viewMonth: 'Mes',
  viewYear: 'A\u00f1o',
  viewAgenda: 'Agenda',
  viewDayTooltip: 'Ver por d\u00eda',
  viewWeekTooltip: 'Ver por semana',
  viewMonthTooltip: 'Ver por mes',
  viewYearTooltip: 'Ver por a\u00f1o',
  viewAgendaTooltip: 'Ver agenda',

  addEvent: 'Agregar evento',
  userAll: 'Todos',
  userSelectPlaceholder: 'Seleccionar usuario',

  eventsCount: (n: number) => `${n} evento${n !== 1 ? 's' : ''}`,
  moreEvents: (n: number) => `${n} m\u00e1s...`,
  dayOfTotal: (day: number, total: number) => `D\u00eda ${day} de ${total}`,

  allDay: 'Todo el d\u00eda',
  happeningNow: 'Ocurriendo ahora',
  noCurrentEvents: 'No hay citas o consultas en este momento',
  noEventsMonth: 'No hay eventos programados para el mes seleccionado',
  fieldResponsible: 'Responsable',
  fieldTitle: 'T\u00edtulo',
  fieldDescription: 'Descripci\u00f3n',
  fieldColor: 'Color',
  fieldStartDate: 'Fecha de inicio',
  fieldStartTime: 'Hora de inicio',
  fieldEndDate: 'Fecha de fin',
  fieldEndTime: 'Hora de fin',
  fieldDate: 'Fecha',
  placeholderTitle: 'Ingrese un t\u00edtulo',
  placeholderSelectOption: 'Seleccionar una opci\u00f3n',
  placeholderSelectDate: 'Seleccionar una fecha',

  dialogAddTitle: 'Agregar nuevo evento',
  dialogEditTitle: 'Editar evento',
  dialogAddDescription: 'Este formulario es solo para fines de demostraci\u00f3n y no crear\u00e1 un evento real. En una aplicaci\u00f3n real, env\u00ede el formulario a la API del backend para guardar el evento.',
  dialogEditDescription: 'Este formulario solo actualiza el estado actual del evento localmente para fines de demostraci\u00f3n. En una aplicaci\u00f3n real, env\u00ede este formulario a una API del backend para persistir los cambios.',
  buttonCancel: 'Cancelar',
  buttonCreate: 'Crear evento',
  buttonSave: 'Guardar cambios',
  buttonEdit: 'Editar',
  buttonDelete: 'Eliminar',

  colorBlue: 'Azul',
  colorGreen: 'Verde',
  colorRed: 'Rojo',
  colorYellow: 'Amarillo',
  colorPurple: 'Morado',
  colorOrange: 'Naranja',
  colorGray: 'Gris',

  settingsBadgeVariant: 'Variante de insignia',
  settingsVisibleHours: 'Horas visibles',
  settingsWorkingHours: 'Horas de trabajo',
  settingsAvailableViews: 'Vistas disponibles',
  settingsShowUserSelect: 'Mostrar selecci\u00f3n de usuario',
  settingsCanAdd: 'Puede agregar eventos',
  settingsCanEdit: 'Puede editar eventos',
  settingsCanDelete: 'Puede eliminar eventos',
  badgeColored: 'Coloreado',
  badgeDot: 'Punto',
  badgeMixed: 'Mixto',
  selectVariant: 'Seleccionar variante',
  from: 'Desde',
  to: 'Hasta',
  closed: 'Cerrado',
  apply: 'Aplicar',

  weekdaySun: 'Dom',
  weekdayMon: 'Lun',
  weekdayTue: 'Mar',
  weekdayWed: 'Mi\u00e9',
  weekdayThu: 'Jue',
  weekdayFri: 'Vie',
  weekdaySat: 'S\u00e1b',

  sunday: 'Domingo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Mi\u00e9rcoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'S\u00e1bado',

  validationTitleRequired: 'El t\u00edtulo es obligatorio',
  validationDescriptionRequired: 'La descripci\u00f3n es obligatoria',
  validationStartDateRequired: 'La fecha de inicio es obligatoria',
  validationStartTimeRequired: 'La hora de inicio es obligatoria',
  validationEndDateRequired: 'La fecha de fin es obligatoria',
  validationEndTimeRequired: 'La hora de fin es obligatoria',
  validationColorRequired: 'El color es obligatorio',
  validationStartAfterEnd: 'La fecha de inicio no puede ser posterior a la fecha de fin',

  weekViewNotAvailable: 'La vista semanal no est\u00e1 disponible en dispositivos peque\u00f1os.',
  weekViewSwitchView: 'Cambie a la vista diaria o mensual.',

  visibleHoursTooltip: 'Establecer el rango de tiempo visible para las vistas de d\u00eda y semana.',
  workingHoursTooltip: 'Configurar las horas de trabajo para cada d\u00eda de la semana.',
}

const locale = ref<TLocale>((typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null) as TLocale ?? 'en')

watchEffect(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('locale', locale.value)
  }
})

const LABEL_SETS: Record<TLocale, Partial<ICalendarLabels>> = {
  en: {},
  fr: FR_LABELS,
  es: ES_LABELS,
}

const DATE_LOCALE_MAP: Record<TLocale, Locale | undefined> = {
  en: undefined,
  fr,
  es,
}

const currentLabels = computed(() => LABEL_SETS[locale.value])
const currentDateLocale = computed(() => DATE_LOCALE_MAP[locale.value])

function setLocale(value: TLocale) {
  locale.value = value
}

export function useLocale() {
  return {
    locale,
    currentLabels,
    currentDateLocale,
    setLocale,
    LOCALE_OPTIONS,
  }
}
