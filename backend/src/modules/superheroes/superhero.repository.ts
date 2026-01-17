import { Superhero } from './superhero.model';
import { Types } from 'mongoose';

export type SuperheroInput = {
  nickname: string;
  real_name: string;
  origin_description?: string;
  superpowers?: string[];
  catch_phrase?: string;
};

export type ImageInput = {
  url: string;
  filename: string;
};

export const createSuperhero = (data: SuperheroInput) => {
  return Superhero.create(data);
};


const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getSuperheroByIdentity = (nickname: string, realName: string) => {
  const nicknameRegex = new RegExp(`^${escapeRegExp(nickname)}$`, 'i');
  const realNameRegex = new RegExp(`^${escapeRegExp(realName)}$`, 'i');
  return Superhero.findOne({ nickname: nicknameRegex, real_name: realNameRegex });
};

export const getSuperheroes = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;
  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  const filter = trimmedSearch
    ? {
      $or: [
        { nickname: new RegExp(escapeRegExp(trimmedSearch), 'i') },
        { real_name: new RegExp(escapeRegExp(trimmedSearch), 'i') }
      ]
    }
    : {};
  const [data, total] = await Promise.all([
    Superhero.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Superhero.countDocuments(filter)
  ]);

  return { data, total, page, limit };
};

export const getSuperheroById = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Superhero.findById(id);
};

export const updateSuperhero = (id: string, data: Partial<SuperheroInput>) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Superhero.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSuperhero = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Superhero.findByIdAndDelete(id);
};

export const addImageToSuperhero = (id: string, image: ImageInput) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Superhero.findByIdAndUpdate(
    id,
    { $push: { images: image } },
    { new: true }
  );
};

export const removeImageFromSuperhero = (id: string, imageId: string) => {
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(imageId)) {
    return null;
  }
  return Superhero.findByIdAndUpdate(
    id,
    { $pull: { images: { _id: imageId } } },
    { new: true }
  );
};
