import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Wrench, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const mutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: ({ data }) => {
      login(data.token, data.user)
      toast.success(`¡Cuenta creada! Bienvenido, ${data.user.name}`)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al registrarse')
    },
  })

  const onSubmit = ({ name, email, password }) => mutation.mutate({ name, email, password })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Auto Control</h1>
          <p className="text-gray-500 text-sm mt-1">Creá tu cuenta gratuita</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                className="input"
                placeholder="Juan García"
                autoComplete="name"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
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

            <div>
              <label className="label">Confirmar contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Confirmá la contraseña',
                  validate: (v) => v === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full justify-center py-2.5"
            >
              {mutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
