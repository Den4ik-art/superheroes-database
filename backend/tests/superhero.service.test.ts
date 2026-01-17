import { listHeroes, createHero, getHero, updateHero, deleteHero } from '../src/modules/superheroes/superhero.service';
import {
  getSuperheroes,
  createSuperhero,
  getSuperheroById,
  updateSuperhero,
  deleteSuperhero,
} from '../src/modules/superheroes/superhero.repository';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

jest.mock('../src/modules/superheroes/superhero.repository', () => ({
  getSuperheroes: jest.fn(),
  createSuperhero: jest.fn(),
  getSuperheroById: jest.fn(),
  updateSuperhero: jest.fn(),
  deleteSuperhero: jest.fn(),
}));

const mockedGetSuperheroes = getSuperheroes as jest.Mock<any>;
const mockedCreateSuperhero = createSuperhero as jest.Mock<any>;
const mockedGetSuperheroById = getSuperheroById as jest.Mock<any>;
const mockedUpdateSuperhero = updateSuperhero as jest.Mock<any>;
const mockedDeleteSuperhero = deleteSuperhero as jest.Mock<any>;

describe('superhero service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards pagination and search params to the repository', async () => {
    mockedGetSuperheroes.mockResolvedValue({
      data: [] as any[],
      total: 0,
      page: 1,
      limit: 5,
    });

    await listHeroes(1, 5, 'arrow');

    expect(mockedGetSuperheroes).toHaveBeenCalledWith(1, 5, 'arrow');
  });

  it('creates a hero via repository', async () => {
    const heroData = {
      nickname: 'Wonder Woman',
      real_name: 'Diana Prince',
      origin_description: 'Amazonian princess',
      superpowers: ['super strength', 'flight'],
      catch_phrase: 'Hera help me!',
      images: ['wonder_woman.jpg'],
    };
    const createdHero = { ...heroData, _id: '507f1f77bcf86cd799439011' };

    mockedCreateSuperhero.mockResolvedValue(createdHero);

    const result = await createHero(heroData as any);

    expect(mockedCreateSuperhero).toHaveBeenCalledWith(heroData);
    expect(result).toEqual(createdHero);
  });

  it('gets a hero by id via repository', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const hero = { _id: validId, nickname: 'Hero' };
    mockedGetSuperheroById.mockResolvedValue(hero);

    const result = await getHero(validId);

    expect(mockedGetSuperheroById).toHaveBeenCalledWith(validId);
    expect(result).toEqual(hero);
  });

  it('updates a hero via repository', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const updateData = { nickname: 'Updated' };
    const updatedHero = { _id: validId, ...updateData };
    mockedUpdateSuperhero.mockResolvedValue(updatedHero);

    const result = await updateHero(validId, updateData);

    expect(mockedUpdateSuperhero).toHaveBeenCalledWith(validId, updateData);
    expect(result).toEqual(updatedHero);
  });

  it('deletes a hero via repository', async () => {
    const validId = '507f1f77bcf86cd799439011';
    mockedDeleteSuperhero.mockResolvedValue({ _id: validId });

    await deleteHero(validId);

    expect(mockedDeleteSuperhero).toHaveBeenCalledWith(validId);
  });
});
