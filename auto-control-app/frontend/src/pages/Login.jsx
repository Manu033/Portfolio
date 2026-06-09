import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Wrench, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: ({ data }) => {
      login(data.token, data.user)
      toast.success(`Bienvenido, ${data.user.name}`)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión')
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Auto Control</h1>
          <p className="text-gray-500 text-sm mt-1">Iniciá sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                autoComplete="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password', { required: 'La contraseña es requerida' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full justify-center py-2.5"
            >
              {mutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
