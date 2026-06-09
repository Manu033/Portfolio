import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Ocurrió un error al cargar los datos', onRetry }) {
  return (
    <div className="card py-16 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-gray-700 font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4 inline-flex">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      )}
    </div>
  )
}
