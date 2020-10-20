import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {

  async list(request: Request, response: Response) {

    const orphanageRepository = getRepository(Orphanage);
    const orphanages = await orphanageRepository.find({
      relations: ['images']
    });

    return response.json(orphanageView.renderMany(orphanages));
  },


  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;

    const orphanageRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatorio'),
      latitude: Yup.number().required('latitude obrigatorio'),
      longitude: Yup.number().required('Longitude obrigatorio'),
      about: Yup.string().required('Sobre obrigatorio').max(300),
      instructions: Yup.string().required('Instrução obrigatorio'),
      opening_hours: Yup.string().required('Horario obrigatorio'),
      open_on_weekends: Yup.boolean().required('Abertura obrigatoria'),
      images: Yup.array(Yup.object().shape({ path: Yup.string().required() }))
    });

    const finalData = schema.cast(data);

    await schema.validate(data, { abortEarly: false });

    const orphanage = orphanageRepository.create(data);

    await orphanageRepository.save(orphanage);

    return response.status(201).json(orphanage);


  },

  async listById(request: Request, response: Response) {

    const { id } = request.params;

    const orphanageRepository = getRepository(Orphanage);
    const orphanage = await orphanageRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(orphanageView.renderOne(orphanage));
  },
}