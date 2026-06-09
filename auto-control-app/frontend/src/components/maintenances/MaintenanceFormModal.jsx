import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X, Upload, Lightbulb, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, addMonths } from 'date-fns'
import { maintenancesApi, intervalsApi } from '../../services/api'

const TYPES = [
  ['OIL_CHANGE',      'Cambio de aceite'],
  ['TIRE_CHANGE',     'Cambio de neumáticos'],
  ['ALIGNMENT',       'Alineado'],
  ['BALANCING',       'Balanceado'],
  ['BELT_CHANGE',     'Cambio de correa'],
  ['BRAKE_SERVICE',   'Service de frenos'],
  ['FILTER_CHANGE',   'Cambio de filtros'],
  ['SPARK_PLUGS',     'Bujías'],
  ['BATTERY',         'Batería'],
  ['SUSPENSION',      'Suspensión'],
  ['TRANSMISSION',    'Transmisión'],
  ['COOLING_SYSTEM',  'Sistema de refrigeración'],
  ['ELECTRICAL',      'Sistema eléctrico'],
  ['GENERAL_SERVICE', 'Service general'],
  ['OTHER',           'Otro'],
]

export default function MaintenanceFormModal({ carId, maintenance, onClose }) {
  const isEditing = !!maintenance

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: maintenance
      ? {
          type: maintenance.type,
          date: format(new Date(maintenance.date), 'yyyy-MM-dd'),
          place: maintenance.place || '',
          mechanic: maintenance.mechanic || '',
          description: maintenance.description || '',
          cost: maintenance.cost || '',
          nextMaintenanceDate: maintenance.nextMaintenanceDate
            ? format(new Date(maintenance.nextMaintenanceDate), 'yyyy-MM-dd')
            : '',
          nextMaintenanceKm: maintenance.nextMaintenanceKm || '',
        }
      : { date: format(new Date(), 'yyyy-MM-dd') },
  })

  const selectedType = watch('type')
  const photos = watch('photos')
  const currentDate = watch('date')

  // Fetch intervals when type changes
  const { data: intervals = [] } = useQuery({
    queryKey: ['intervals-by-type', selectedType],
    queryFn: () => intervalsApi.getByType(selectedType).then((r) => r.data),
    enabled: !!selectedType,
  })

  // Auto-fill next maintenance date when interval loads (only for new maintenances)
  useEffect(() => {
    if (isEditing || !intervals.length || !intervals[0].intervalMonths) return
    const baseDate = currentDate ? new Date(currentDate) : new Date()
    const nextDate = addMonths(baseDate, intervals[0].intervalMonths)
    setValue('nextMaintenanceDate', format(nextDate, 'yyyy-MM-dd'))
  }, [intervals, isEditing])

  const applySuggestion = () => {
    if (!intervals.length || !intervals[0].intervalMonths) return
    const baseDate = currentDate ? new Date(currentDate) : new Date()
    const nextDate = addMonths(baseDate, intervals[0].intervalMonths)
    setValue('nextMaintenanceDate', format(nextDate, 'yyyy-MM-dd'))
  }

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEditing
        ? maintenancesApi.update(maintenance.id, formData)
        : maintenancesApi.create(carId, formData),
    onSuccess: () => {
      toast.success(isEditing ? 'Mantenimiento actualizado' : 'Mantenimiento registrado')
      onClose()
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al guardar')
    },
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photos') return
      if (value !== '' && value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    if (data.photos) {
      Array.from(data.photos).forEach((f) => formData.append('photos', f))
    }
    mutation.mutate(formData)
  }

  // Build suggestion text
  const suggestion = intervals[0]
  const suggestionText = suggestion
    ? [
        suggestion.intervalKm ? `${suggestion.intervalKm.toLocaleString('es-AR')} km` : null,
        suggestion.intervalMonths ? `${suggestion.intervalMonths} meses` : null,
      ]
        .filter(Boolean)
        .join(' o ')
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h2 className="font-semibold text-gray-900">
            {isEditing ? 'Editar mantenimiento' : 'Registrar mantenimiento'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Type selector */}
          <div>
            <label className="label">Tipo de mantenimiento *</label>
            <select className="input" {...register('type', { required: 'Requerido' })}>
              <option value="">Seleccionar tipo...</option>
              {TYPES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          {/* Suggestion banner */}
          {selectedType && intervals.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      {intervals.length === 1
                        ? intervals[0].name
                        : `${intervals.length} intervalos sugeridos`}
                    </p>
                    {suggestionText && (
                      <p className="text-xs text-amber-700 mt-0.5">
                        Se recomienda repetir cada {suggestionText}
                      </p>
                    )}
                    {intervals.length > 1 && (
                      <ul className="mt-1 space-y-0.5">
                        {intervals.map((iv) => (
                          <li key={iv.id} className="text-xs text-amber-700">
                            · {iv.name}:{' '}
                            {[
                              iv.intervalKm ? `${iv.intervalKm.toLocaleString('es-AR')} km` : null,
                              iv.intervalMonths ? `${iv.intervalMonths} meses` : null,
                            ]
                              .filter(Boolean)
                              .join(' o ')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {suggestion?.intervalMonths && (
                  <button
                    type="button"
                    onClick={applySuggestion}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Aplicar fecha
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha *</label>
              <input type="date" className="input" {...register('date', { required: 'Requerido' })} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="label">Costo</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                placeholder="0.00"
                {...register('cost')}
              />
            </div>

            <div>
              <label className="label">Lugar</label>
              <input className="input" placeholder="Taller YPF" {...register('place')} />
            </div>

            <div>
              <label className="label">Mecánico</label>
              <input className="input" placeholder="Juan García" {...register('mechanic')} />
            </div>
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Repuesto cambiado, marca, observaciones..."
              {...register('description')}
            />
          </div>

          {/* Next maintenance */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Próximo mantenimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Fecha estimada</label>
                <input type="date" className="input bg-white" {...register('nextMaintenanceDate')} />
                <p className="text-xs text-gray-400 mt-1">Notificación 7 días antes</p>
              </div>
              <div>
                <label className="label">Kilometraje estimado</label>
                <input
                  type="number"
                  min="0"
                  className="input bg-white"
                  placeholder="ej. 80000"
                  {...register('nextMaintenanceKm')}
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="label">Fotos</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500">
                {photos?.length > 0
                  ? `${photos.length} archivo${photos.length !== 1 ? 's' : ''} seleccionado${photos.length !== 1 ? 's' : ''}`
                  : 'Seleccionar imágenes (máx. 10)'}
              </span>
              <input type="file" accept="image/*" multiple className="hidden" {...register('photos')} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
