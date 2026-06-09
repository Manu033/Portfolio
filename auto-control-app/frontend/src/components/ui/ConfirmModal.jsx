import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ title, message, confirmText = 'Eliminar', onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-red-100 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
