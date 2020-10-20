import { Router } from 'express';
import OrphanageContoller from './controllers/OrphanagesController';
import multer from 'multer';
import uploadConfig from './config/upload';


const routes = Router();
const upload = multer(uploadConfig);

routes.post('/orphanages', upload.array('images'), OrphanageContoller.create);
routes.get('/orphanages', OrphanageContoller.list);
routes.get('/orphanage/:id', OrphanageContoller.listById);

export default routes;