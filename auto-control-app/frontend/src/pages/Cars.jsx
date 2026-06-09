import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Car, ChevronRight, Trash2, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { carsApi } from '../services/api'
import CarFormModal from '../components/cars/CarFormModal'
import ConfirmModal from '../components/ui/ConfirmModal'
import ErrorState from '../components/ui/ErrorState'

export default function Cars() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // car object to delete

  const { data: cars = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carsApi.getAll().then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => carsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      toast.success('Auto eliminado')
    },
    onError: () => toast.error('Error al eliminar el auto'),
  })

  const handleClose = () => {
    setShowModal(false)
    setEditCar(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis autos</h1>
          <p className="text-gray-500 mt-1">
            {cars.length} vehículo{cars.length !== 1 ? 's' : ''} registrado{cars.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Nuevo auto
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="No se pudieron cargar los autos" onRetry={refetch} />
      ) : cars.length === 0 ? (
        <div className="card py-20 text-center">
          <Car className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No tenés autos registrados</p>
          <p className="text-gray-400 text-sm mt-1">Agregá tu primer vehículo para empezar</p>
          <button className="btn-primary mt-6" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Registrar auto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative">
                {car.photoUrl ? (
                  <img src={car.photoUrl} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <Car className="w-16 h-16 text-primary-300" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => { e.preventDefault(); setEditCar(car); setShowModal(true) }}
                    className="p-1.5 bg-white/80 backdrop-blur rounded-lg text-gray-600 hover:text-primary-600 hover:bg-white transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); setConfirmDelete(car) }}
                    className="p-1.5 bg-white/80 backdrop-blur rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Link to={`/cars/${car.id}`} className="block p-4">
                <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{car.year} · {car.licensePlate}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">
                    {car._count?.maintenances ?? 0} mantenimiento{car._count?.maintenances !== 1 ? 's' : ''}
                  </span>
                  <span className="text-primary-600 text-sm font-medium flex items-center gap-0.5">
                    Ver historial <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && <CarFormModal car={editCar} onClose={handleClose} />}

      {confirmDelete && (
        <ConfirmModal
          title={`¿Eliminar ${confirmDelete.brand} ${confirmDelete.model}?`}
          message="Se eliminarán todos sus mantenimientos. Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          onConfirm={() => { deleteMutation.mutate(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
