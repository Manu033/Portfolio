import { Router } from 'express'
import {
  getMaintenancesByCarId,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  deleteMaintenancePhoto,
  getUpcomingMaintenances,
} from '../controllers/maintenancesController.js'
import { uploadMaintenancePhotos } from '../middleware/upload.js'

const router = Router()

// Standalone routes
router.get('/upcoming', getUpcomingMaintenances)
router.get('/:id', getMaintenanceById)
router.put('/:id', uploadMaintenancePhotos, updateMaintenance)
router.delete('/:id', deleteMaintenance)
router.delete('/:id/photos/:photoId', deleteMaintenancePhoto)

// Nested under /cars/:carId
router.get('/car/:carId', getMaintenancesByCarId)
router.post('/car/:carId', uploadMaintenancePhotos, createMaintenance)

export default router
