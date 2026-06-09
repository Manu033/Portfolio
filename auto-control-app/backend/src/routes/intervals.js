import { Router } from 'express'
import {
  getIntervals,
  getIntervalsByType,
  createInterval,
  updateInterval,
  deleteInterval,
} from '../controllers/intervalsController.js'

const router = Router()

router.get('/', getIntervals)
router.get('/by-type/:type', getIntervalsByType)
router.post('/', createInterval)
router.put('/:id', updateInterval)
router.delete('/:id', deleteInterval)

export default router
