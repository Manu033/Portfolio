import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Car, Wrench, Bell, Timer, LogOut, User, Menu, X, AlertTriangle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { differenceInDays, format } from 'date-fns'
import { maintenancesApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const MAINTENANCE_LABELS = {
  OIL_CHANGE: 'Cambio de aceite', TIRE_CHANGE: 'Cambio de neumáticos',
  ALIGNMENT: 'Alineado', BALANCING: 'Balanceado', BELT_CHANGE: 'Cambio de correa',
  BRAKE_SERVICE: 'Service de frenos', FILTER_CHANGE: 'Cambio de filtros',
  SPARK_PLUGS: 'Bujías', BATTERY: 'Batería', SUSPENSION: 'Suspensión',
  TRANSMISSION: 'Transmisión', COOLING_SYSTEM: 'Sistema de refrigeración',
  ELECTRICAL: 'Sistema eléctrico', GENERAL_SERVICE: 'Service general', OTHER: 'Otro',
}

const NAV_LINKS = [
  { to: '/', label: 'Inicio', exact: true },
  { to: '/cars', label: 'Mis autos', icon: Car },
  { to: '/intervals', label: 'Intervalos', icon: Timer },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [bellOpen, setBellOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const bellRef = useRef(null)

  const { data: upcoming = [] } = useQuery({
    queryKey: ['upcoming-maintenances'],
    queryFn: () => maintenancesApi.getUpcoming(7).then((r) => r.data),
    refetchInterval: 1000 * 60 * 10,
  })

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/login', { replace: true })
  }

  const isActive = (link) =>
    link.exact ? pathname === link.to : pathname.startsWith(link.to)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-primary-700 text-lg flex-shrink-0">
            <Wrench className="w-5 h-5" />
            Auto Control
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive({ to, exact: to === '/' })
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </Link>
            ))}

            {/* Bell */}
            <div className="relative ml-1" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {upcoming.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {upcoming.length}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-sm text-gray-800">Próximos 7 días</span>
                  </div>

                  {upcoming.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-400">Sin alertas pendientes</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                      {upcoming.map((m) => {
                        const days = differenceInDays(new Date(m.nextMaintenanceDate), new Date())
                        return (
                          <li key={m.id}>
                            <Link
                              to={`/cars/${m.car?.id ?? ''}`}
                              onClick={() => setBellOpen(false)}
                              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {MAINTENANCE_LABELS[m.type] || m.type}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                  {m.car?.brand} {m.car?.model} · {m.car?.licensePlate}
                                </p>
                              </div>
                              <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                                days === 0
                                  ? 'bg-red-100 text-red-700'
                                  : days <= 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {days === 0 ? 'Hoy' : `${days}d`}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
              <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile: bell + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {upcoming.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {upcoming.length}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-sm text-gray-800">Próximos 7 días</span>
                  </div>
                  {upcoming.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-400">Sin alertas pendientes</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                      {upcoming.map((m) => {
                        const days = differenceInDays(new Date(m.nextMaintenanceDate), new Date())
                        return (
                          <li key={m.id}>
                            <Link
                              to={`/cars/${m.car?.id ?? ''}`}
                              onClick={() => { setBellOpen(false); setMobileOpen(false) }}
                              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {MAINTENANCE_LABELS[m.type] || m.type}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {m.car?.brand} {m.car?.model}
                                </p>
                              </div>
                              <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                                days === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {days === 0 ? 'Hoy' : `${days}d`}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive({ to, exact: to === '/' })
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
