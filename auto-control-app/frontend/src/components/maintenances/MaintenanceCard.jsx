import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, MapPin, User, DollarSign, Camera, ChevronDown, ChevronUp, Pencil, Trash2, AlertCircle } from 'lucide-react'

export default function MaintenanceCard({ maintenance: m, labels, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const isOverdue = m.nextMaintenanceDate && new Date(m.nextMaintenanceDate) < new Date()
  const isSoon = m.nextMaintenanceDate && !isOverdue &&
    (new Date(m.nextMaintenanceDate) - new Date()) < 1000 * 60 * 60 * 24 * 7

  return (
    <li className="px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{labels[m.type] || m.type}</span>
            {(isOverdue || isSoon) && (
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <AlertCircle className="w-3 h-3" />
                {isOverdue ? 'Vencido' : 'Próximo'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(m.date), "dd/MM/yyyy")}
            </span>
            {m.place && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {m.place}
              </span>
            )}
            {m.mechanic && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <User className="w-3.5 h-3.5" />
                {m.mechanic}
              </span>
            )}
            {m.cost && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                {parseFloat(m.cost).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 pl-1">
          {m.description && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{m.description}</p>
          )}

          {(m.nextMaintenanceDate || m.nextMaintenanceKm) && (
            <div className={`text-sm flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Próximo:{' '}
                {m.nextMaintenanceDate && format(new Date(m.nextMaintenanceDate), "dd/MM/yyyy")}
                {m.nextMaintenanceDate && m.nextMaintenanceKm && ' · '}
                {m.nextMaintenanceKm && `${m.nextMaintenanceKm.toLocaleString('es-AR')} km`}
              </span>
            </div>
          )}

          {m.photos?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                <Camera className="w-3.5 h-3.5" /> {m.photos.length} foto{m.photos.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2 flex-wrap">
                {m.photos.map((p) => (
                  <img
                    key={p.id}
                    src={p.photoUrl}
                    alt={p.fileName}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-transparent hover:ring-primary-400"
                    onClick={() => setLightbox(p.photoUrl)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}
    </li>
  )
}
