import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, FileDown, Car, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { carsApi, maintenancesApi } from '../services/api'
import MaintenanceFormModal from '../components/maintenances/MaintenanceFormModal'
import MaintenanceCard from '../components/maintenances/MaintenanceCard'
import ConfirmModal from '../components/ui/ConfirmModal'
import ErrorState from '../components/ui/ErrorState'

const MAINTENANCE_LABELS = {
  OIL_CHANGE: 'Cambio de aceite', TIRE_CHANGE: 'Cambio de neumáticos',
  ALIGNMENT: 'Alineado', BALANCING: 'Balanceado', BELT_CHANGE: 'Cambio de correa',
  BRAKE_SERVICE: 'Service de frenos', FILTER_CHANGE: 'Cambio de filtros',
  SPARK_PLUGS: 'Bujías', BATTERY: 'Batería', SUSPENSION: 'Suspensión',
  TRANSMISSION: 'Transmisión', COOLING_SYSTEM: 'Sistema de refrigeración',
  ELECTRICAL: 'Sistema eléctrico', GENERAL_SERVICE: 'Service general', OTHER: 'Otro',
}

export default function CarDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editMaintenance, setEditMaintenance] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data: car, isLoading, isError, refetch } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getById(id).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (mId) => maintenancesApi.delete(mId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car', id] })
      toast.success('Mantenimiento eliminado')
    },
    onError: () => toast.error('Error al eliminar'),
  })

  const handleExportPDF = async () => {
    try {
      const response = await carsApi.exportPDF(id)
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `historial_${car.licensePlate}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF generado')
    } catch {
      toast.error('Error al generar el PDF')
    }
  }

  const handleEdit = (m) => {
    setEditMaintenance(m)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditMaintenance(null)
    queryClient.invalidateQueries({ queryKey: ['car', id] })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="card h-40 animate-pulse" />
        <div className="card h-64 animate-pulse" />
      </div>
    )
  }

  if (isError) return <ErrorState message="No se pudo cargar el auto" onRetry={refetch} />
  if (!car) return <ErrorState message="Auto no encontrado" />

  const totalCost = car.maintenances?.reduce((acc, m) => acc + (parseFloat(m.cost) || 0), 0) ?? 0

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/cars" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
            <ArrowLeft className="w-4 h-4" /> Volver a mis autos
          </Link>
          <div className="flex items-center gap-4">
            {car.photoUrl ? (
              <img src={car.photoUrl} alt={car.brand} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                <Car className="w-8 h-8 text-primary-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500">{car.year} · {car.licensePlate}</p>
              {car.notes && <p className="text-sm text-gray-400 mt-1">{car.notes}</p>}
            </div>
          </div>
        </div>
        <button onClick={handleExportPDF} className="btn-secondary">
          <FileDown className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{car.maintenances?.length ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Mantenimientos</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            ${totalCost.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Gasto total</p>
        </div>
        <div className="card p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-sm font-semibold text-gray-900">
            {car.maintenances?.[0]
              ? format(new Date(car.maintenances[0].date), "dd/MM/yyyy")
              : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Último servicio</p>
        </div>
      </div>

      {/* Maintenances */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-400" />
            Historial de mantenimientos
          </h2>
          <button className="btn-primary text-sm" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {!car.maintenances || car.maintenances.length === 0 ? (
          <div className="py-16 text-center">
            <Wrench className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay mantenimientos registrados</p>
            <button className="btn-primary mt-4" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              Registrar mantenimiento
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {car.maintenances.map((m) => (
              <MaintenanceCard
                key={m.id}
                maintenance={m}
                labels={MAINTENANCE_LABELS}
                onEdit={() => handleEdit(m)}
                onDelete={() => setConfirmDelete(m.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <MaintenanceFormModal
          carId={id}
          maintenance={editMaintenance}
          labels={MAINTENANCE_LABELS}
          onClose={handleClose}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="¿Eliminar este mantenimiento?"
          message="Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          onConfirm={() => { deleteMutation.mutate(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
