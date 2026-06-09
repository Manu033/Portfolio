import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { User, Lock, Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

function ProfileForm({ user, updateUser }) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user.name },
  })

  const mutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: ({ data }) => {
      updateUser(data)
      toast.success('Nombre actualizado')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al actualizar'),
  })

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary-100 rounded-xl">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Datos personales</h2>
          <p className="text-sm text-gray-500">Actualizá tu nombre</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div>
          <label className="label">Nombre</label>
          <input
            className="input"
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input bg-gray-50 cursor-not-allowed" value={user.email} disabled />
          <p className="text-xs text-gray-400 mt-1">El email no se puede modificar</p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || !isDirty}
          className="btn-primary"
        >
          <Check className="w-4 h-4" />
          {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()
  const newPassword = watch('newPassword')

  const mutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Contraseña actualizada')
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al cambiar la contraseña'),
  })

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-amber-100 rounded-xl">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Cambiar contraseña</h2>
          <p className="text-sm text-gray-500">Usá una contraseña segura de al menos 6 caracteres</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(({ currentPassword, newPassword }) =>
          mutation.mutate({ currentPassword, newPassword })
        )}
        className="space-y-4"
      >
        <div>
          <label className="label">Contraseña actual</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              {...register('currentPassword', { required: 'Requerida' })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrent((v) => !v)}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="label">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              className="input pr-10"
              placeholder="Mínimo 6 caracteres"
              {...register('newPassword', {
                required: 'Requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowNew((v) => !v)}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="label">Confirmar nueva contraseña</label>
          <input
            type={showNew ? 'text' : 'password'}
            className="input"
            placeholder="Repetí la nueva contraseña"
            {...register('confirmPassword', {
              required: 'Requerida',
              validate: (v) => v === newPassword || 'Las contraseñas no coinciden',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={mutation.isPending} className="btn-primary">
          <Lock className="w-4 h-4" />
          {mutation.isPending ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  )
}

export default function Profile() {
  const { user, updateUser } = useAuth()

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-gray-500 mt-1">Administrá tu cuenta</p>
      </div>

      <ProfileForm user={user} updateUser={updateUser} />
      <PasswordForm />
    </div>
  )
}
