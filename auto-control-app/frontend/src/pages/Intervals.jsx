import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Check, X, Timer } from 'lucide-react'
import toast from 'react-hot-toast'
import { intervalsApi } from '../services/api'
import ConfirmModal from '../components/ui/ConfirmModal'
import ErrorState from '../components/ui/ErrorState'

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

const TYPE_MAP = Object.fromEntries(TYPES)

const emptyForm = { name: '', maintenanceType: '', intervalKm: '', intervalMonths: '' }

function IntervalRow({ interval, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: interval.name,
    maintenanceType: interval.maintenanceType || '',
    intervalKm: interval.intervalKm ?? '',
    intervalMonths: interval.intervalMonths ?? '',
  })

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('El nombre es requerido')
    onSave(interval.id, form)
    setEditing(false)
  }

  if (!editing) {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-900">{interval.name}</td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {interval.maintenanceType ? TYPE_MAP[interval.maintenanceType] || interval.maintenanceType : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700 text-right">
          {interval.intervalKm ? `${interval.intervalKm.toLocaleString('es-AR')} km` : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700 text-right">
          {interval.intervalMonths ? `${interval.intervalMonths} meses` : '—'}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(interval.id)}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="bg-primary-50">
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nombre del intervalo"
        />
      </td>
      <td className="px-4 py-2">
        <select
          className="input text-sm py-1.5"
          value={form.maintenanceType}
          onChange={(e) => setForm((f) => ({ ...f, maintenanceType: e.target.value }))}
        >
          <option value="">Sin tipo</option>
          {TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5 text-right"
          type="number"
          min="0"
          value={form.intervalKm}
          onChange={(e) => setForm((f) => ({ ...f, intervalKm: e.target.value }))}
          placeholder="km"
        />
      </td>
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5 text-right"
          type="number"
          min="0"
          value={form.intervalMonths}
          onChange={(e) => setForm((f) => ({ ...f, intervalMonths: e.target.value }))}
          placeholder="meses"
        />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditing(false)}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function NewIntervalRow({ onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm)

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('El nombre es requerido')
    onSave(form)
    setForm(emptyForm)
  }

  return (
    <tr className="bg-green-50">
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nombre del intervalo *"
          autoFocus
        />
      </td>
      <td className="px-4 py-2">
        <select
          className="input text-sm py-1.5"
          value={form.maintenanceType}
          onChange={(e) => setForm((f) => ({ ...f, maintenanceType: e.target.value }))}
        >
          <option value="">Sin tipo</option>
          {TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5 text-right"
          type="number"
          min="0"
          value={form.intervalKm}
          onChange={(e) => setForm((f) => ({ ...f, intervalKm: e.target.value }))}
          placeholder="km"
        />
      </td>
      <td className="px-4 py-2">
        <input
          className="input text-sm py-1.5 text-right"
          type="number"
          min="0"
          value={form.intervalMonths}
          onChange={(e) => setForm((f) => ({ ...f, intervalMonths: e.target.value }))}
          placeholder="meses"
        />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function Intervals() {
  const queryClient = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data: intervals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['intervals'],
    queryFn: () => intervalsApi.getAll().then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => intervalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervals'] })
      queryClient.invalidateQueries({ queryKey: ['intervals-by-type'] })
      toast.success('Intervalo actualizado')
    },
    onError: () => toast.error('Error al actualizar'),
  })

  const createMutation = useMutation({
    mutationFn: (data) => intervalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervals'] })
      queryClient.invalidateQueries({ queryKey: ['intervals-by-type'] })
      toast.success('Intervalo creado')
      setAdding(false)
    },
    onError: () => toast.error('Error al crear'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => intervalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervals'] })
      queryClient.invalidateQueries({ queryKey: ['intervals-by-type'] })
      toast.success('Intervalo eliminado')
    },
    onError: () => toast.error('Error al eliminar'),
  })

  const handleDelete = (id) => setConfirmDelete(id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intervalos de mantenimiento</h1>
          <p className="text-gray-500 mt-1">
            Guía orientativa usada en el formulario para sugerir la próxima fecha de servicio
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)} disabled={adding}>
          <Plus className="w-4 h-4" />
          Nuevo intervalo
        </button>
      </div>

      {isError && <ErrorState message="No se pudieron cargar los intervalos" onRetry={refetch} />}

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : isError ? null : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-[35%]">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-[25%]">
                    Tipo asociado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-[15%]">
                    Cada (km)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-[15%]">
                    Cada (meses)
                  </th>
                  <th className="px-4 py-3 w-[10%]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adding && (
                  <NewIntervalRow
                    onSave={(data) => createMutation.mutate(data)}
                    onCancel={() => setAdding(false)}
                  />
                )}
                {intervals.length === 0 && !adding ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      <Timer className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                      No hay intervalos configurados
                    </td>
                  </tr>
                ) : (
                  intervals.map((interval) => (
                    <IntervalRow
                      key={interval.id}
                      interval={interval}
                      onSave={(id, data) => updateMutation.mutate({ id, data })}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Tip: podés personalizar estos valores según tu vehículo. Los cambios se reflejan inmediatamente en el formulario de mantenimiento.
      </p>

      {confirmDelete && (
        <ConfirmModal
          title="¿Eliminar este intervalo?"
          message="Ya no aparecerá como sugerencia en el formulario de mantenimiento."
          confirmText="Sí, eliminar"
          onConfirm={() => { deleteMutation.mutate(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
