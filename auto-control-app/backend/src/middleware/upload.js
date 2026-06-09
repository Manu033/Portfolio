import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const storage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'uploads', subfolder))
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${uuidv4()}${ext}`)
    },
  })

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'), false)
  }
}

export const uploadCarPhoto = multer({
  storage: storage('cars'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('photo')

export const uploadMaintenancePhotos = multer({
  storage: storage('maintenances'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).array('photos', 10)
