import fs from 'fs';
import path from 'path';
import {
  addImageToSuperhero,
  createSuperhero,
  deleteSuperhero,
  getSuperheroById,
  getSuperheroByIdentity,
  getSuperheroes,
  removeImageFromSuperhero,
  updateSuperhero
} from './superhero.repository';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const resolvedUploadDir = path.isAbsolute(uploadDir)
  ? uploadDir
  : path.join(process.cwd(), uploadDir);

export const createHero = (data: Parameters<typeof createSuperhero>[0]) => {
  return createSuperhero(data);
};

export const listHeroes = (page: number, limit: number, search?: string) => {
  return getSuperheroes(page, limit, search);
};

export const getHero = (id: string) => {
  return getSuperheroById(id);
};

export const updateHero = (id: string, data: Parameters<typeof updateSuperhero>[1]) => {
  return updateSuperhero(id, data);
};

export const deleteHero = async (id: string) => {
  const hero = await getSuperheroById(id);
  if (!hero) {
    return null;
  }

  for (const image of hero.images || []) {
    if (image?.filename) {
      const filePath = path.join(resolvedUploadDir, image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  return deleteSuperhero(id);
};

export const attachImage = (id: string, url: string, filename: string) => {
  return addImageToSuperhero(id, { url, filename });
};

export const removeImage = async (heroId: string, imageId: string) => {
  const hero = await getSuperheroById(heroId);
  if (!hero) {
    return null;
  }

  const image = hero.images?.find((item) => item._id?.toString() === imageId);
  if (image?.filename) {
    const filePath = path.join(resolvedUploadDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return removeImageFromSuperhero(heroId, imageId);
};


export const findHeroByIdentity = (nickname: string, realName: string) => {
  return getSuperheroByIdentity(nickname, realName);
};
