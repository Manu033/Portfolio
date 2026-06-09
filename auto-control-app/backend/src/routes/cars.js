import { Router } from 'express'
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carsController.js'
import { uploadCarPhoto } from '../middleware/upload.js'

const router = Router()

router.get('/', getCars)
router.get('/:id', getCarById)
router.post('/', uploadCarPhoto, createCar)
router.put('/:id', uploadCarPhoto, updateCar)
router.delete('/:id', deleteCar)

export default router
