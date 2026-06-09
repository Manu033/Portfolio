import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { carsApi } from '../../services/api'

export default function CarFormModal({ car, onClose }) {
  const queryClient = useQueryClient()
  const fileRef = useRef()
  const isEditing = !!car

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: car
      ? { brand: car.brand, model: car.model, year: car.year, licensePlate: car.licensePlate, notes: car.notes || '' }
      : {},
  })

  const photoFile = watch('photo')

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEditing ? carsApi.update(car.id, formData) : carsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      toast.success(isEditing ? 'Auto actualizado' : 'Auto registrado')
      onClose()
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al guardar el auto')
    },
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('brand', data.brand)
    formData.append('model', data.model)
    formData.append('year', data.year)
    formData.append('licensePlate', data.licensePlate)
    if (data.notes) formData.append('notes', data.notes)
    if (data.photo?.[0]) formData.append('photo', data.photo[0])
    mutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{isEditing ? 'Editar auto' : 'Registrar auto'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Marca *</label>
              <input
                className="input"
                placeholder="Toyota"
                {...register('brand', { required: 'Requerido' })}
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <label className="label">Modelo *</label>
              <input
                className="input"
                placeholder="Corolla"
                {...register('model', { required: 'Requerido' })}
              />
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Año *</label>
              <input
                className="input"
                type="number"
                placeholder="2020"
                {...register('year', {
                  required: 'Requerido',
                  min: { value: 1900, message: 'Año inválido' },
                  max: { value: new Date().getFullYear() + 1, message: 'Año inválido' },
                })}
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <label className="label">Patente *</label>
              <input
                className="input uppercase"
                placeholder="AB123CD"
                {...register('licensePlate', { required: 'Requerido' })}
              />
              {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Notas</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Observaciones generales..."
              {...register('notes')}
            />
          </div>

          <div>
            <label className="label">Foto del auto</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {photoFile?.[0]?.name || (car?.photoUrl ? 'Reemplazar foto' : 'Seleccionar imagen')}
              </span>
              <input type="file" accept="image/*" className="hidden" {...register('photo')} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
