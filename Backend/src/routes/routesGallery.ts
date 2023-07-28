import { Router } from 'express';
import multer from 'multer';
import GalleryController from '../controllers/GalleryController';

const upload = multer({
  dest:'./tmp',
  fileFilter: (req,file,cb)=>{
    const allowed: string[] = ['image/jpg', 'image/jpeg','image/png','image/gif'];
    console.log("Info Image", file)
    cb(null,allowed.includes(file.mimetype))
  },
  limits: {fieldSize: 20000000}
});

export default (routes:Router) => {
  routes.post('/filterFiles',GalleryController.filterFiles)
  routes.post('/uploadFile',upload.single('file'),GalleryController.uploadFile)
  routes.get('/infoFile/:fileId',GalleryController.infoFile)
  routes.patch('/editFile/:fileId',GalleryController.editFile)
  routes.delete('/removeFile/:fileId',GalleryController.removeFile)
}
