import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-7xl font-black text-gray-200">404</p>
      <p className="text-gray-500 mt-4">Página no encontrada</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Volver al inicio
      </Link>
    </div>
  )
}
