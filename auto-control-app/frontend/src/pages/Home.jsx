import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Car, Wrench, AlertTriangle, ChevronRight } from 'lucide-react'
import { carsApi, maintenancesApi } from '../services/api'
import { format, differenceInDays } from 'date-fns'

const MAINTENANCE_LABELS = {
  OIL_CHANGE: 'Cambio de aceite', TIRE_CHANGE: 'Cambio de neumáticos',
  ALIGNMENT: 'Alineado', BALANCING: 'Balanceado', BELT_CHANGE: 'Cambio de correa',
  BRAKE_SERVICE: 'Service de frenos', FILTER_CHANGE: 'Cambio de filtros',
  SPARK_PLUGS: 'Bujías', BATTERY: 'Batería', SUSPENSION: 'Suspensión',
  TRANSMISSION: 'Transmisión', COOLING_SYSTEM: 'Sistema de refrigeración',
  ELECTRICAL: 'Sistema eléctrico', GENERAL_SERVICE: 'Service general', OTHER: 'Otro',
}

export default function Home() {
  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carsApi.getAll().then((r) => r.data),
  })

  const { data: upcoming = [] } = useQuery({
    queryKey: ['upcoming-maintenances'],
    queryFn: () => maintenancesApi.getUpcoming(30).then((r) => r.data),
  })

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel principal</h1>
        <p className="text-gray-500 mt-1">Gestioná el mantenimiento de tus vehículos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Car className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vehículos</p>
            <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Wrench className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total mantenimientos</p>
            <p className="text-2xl font-bold text-gray-900">
              {cars.reduce((acc, c) => acc + (c._count?.maintenances ?? 0), 0)}
            </p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Próximos (30 días)</p>
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
          </div>
        </div>
      </div>

      {/* Upcoming maintenances */}
      {upcoming.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Mantenimientos próximos
            </h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {upcoming.map((m) => {
              const days = differenceInDays(new Date(m.nextMaintenanceDate), new Date())
              return (
                <li key={m.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {m.car.brand} {m.car.model} <span className="text-gray-400">·</span> {m.car.licensePlate}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {MAINTENANCE_LABELS[m.type] || m.type} — {format(new Date(m.nextMaintenanceDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      days <= 7
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {days === 0 ? 'Hoy' : `En ${days} día${days !== 1 ? 's' : ''}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Cars quick access */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Tus vehículos</h2>
          <Link to="/cars" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {cars.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No tenés autos registrados todavía</p>
            <Link to="/cars" className="btn-primary mt-4 inline-flex">
              Registrar auto
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {cars.slice(0, 5).map((car) => (
              <li key={car.id}>
                <Link
                  to={`/cars/${car.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {car.photoUrl ? (
                    <img
                      src={car.photoUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {car.brand} {car.model} {car.year}
                    </p>
                    <p className="text-sm text-gray-500">{car.licensePlate}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    {car._count?.maintenances ?? 0} servicio{car._count?.maintenances !== 1 ? 's' : ''}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
