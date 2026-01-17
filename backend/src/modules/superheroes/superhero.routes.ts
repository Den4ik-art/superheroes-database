import { Router } from 'express';
import {
  createSuperheroHandler,
  deleteImageHandler,
  deleteSuperheroHandler,
  getSuperheroHandler,
  listSuperheroesHandler,
  updateSuperheroHandler,
  uploadImageHandler
} from './superhero.controller';
import { upload } from '../../middleware/upload.middleware';

export const superheroRouter = Router();

superheroRouter.get('/', listSuperheroesHandler);
superheroRouter.get('/:id', getSuperheroHandler);
superheroRouter.post('/', createSuperheroHandler);
superheroRouter.put('/:id', updateSuperheroHandler);
superheroRouter.delete('/:id', deleteSuperheroHandler);
superheroRouter.post('/:id/images', upload.single('image'), uploadImageHandler);
superheroRouter.delete('/:id/images/:imageId', deleteImageHandler);
