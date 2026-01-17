import { Request, Response } from 'express';
import {
  attachImage,
  createHero,
  findHeroByIdentity,
  deleteHero,
  getHero,
  listHeroes,
  removeImage,
  updateHero
} from './superhero.service';

export const createSuperheroHandler = async (req: Request, res: Response) => {
  const nickname = typeof req.body.nickname === 'string' ? req.body.nickname.trim() : '';
  const realName = typeof req.body.real_name === 'string' ? req.body.real_name.trim() : '';

  if (nickname && realName) {
    const existing = await findHeroByIdentity(nickname, realName);
    if (existing) {
      res.status(409).json({ message: 'A superhero with this nickname and real name already exists.' });
      return;
    }
  }

  const hero = await createHero(req.body);
  res.status(201).json(hero);
};

export const listSuperheroesHandler = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const result = await listHeroes(page, limit, search);
  res.json(result);
};

export const getSuperheroHandler = async (req: Request, res: Response) => {
  const hero = await getHero(req.params.id);
  if (!hero) {
    res.status(404).json({ message: 'Superhero not found' });
    return;
  }
  res.json(hero);
};

export const updateSuperheroHandler = async (req: Request, res: Response) => {
  const hero = await updateHero(req.params.id, req.body);
  if (!hero) {
    res.status(404).json({ message: 'Superhero not found' });
    return;
  }
  res.json(hero);
};

export const deleteSuperheroHandler = async (req: Request, res: Response) => {
  const hero = await deleteHero(req.params.id);
  if (!hero) {
    res.status(404).json({ message: 'Superhero not found' });
    return;
  }
  res.json({ message: 'Superhero deleted' });
};

export const uploadImageHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const host = req.get('host');
  const baseUrl = host ? `${req.protocol}://${host}` : '';
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  const hero = await attachImage(req.params.id, url, req.file.filename);
  if (!hero) {
    res.status(404).json({ message: 'Superhero not found' });
    return;
  }

  res.status(201).json(hero);
};

export const deleteImageHandler = async (req: Request, res: Response) => {
  const hero = await removeImage(req.params.id, req.params.imageId);
  if (!hero) {
    res.status(404).json({ message: 'Superhero not found' });
    return;
  }
  res.json(hero);
};
