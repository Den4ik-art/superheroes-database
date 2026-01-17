import {
  getSuperheroByIdentity,
  getSuperheroes,
  createSuperhero,
  getSuperheroById,
  updateSuperhero,
  deleteSuperhero,
} from '../src/modules/superheroes/superhero.repository';
import { Superhero } from '../src/modules/superheroes/superhero.model';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

jest.mock('../src/modules/superheroes/superhero.model', () => ({
  __esModule: true,
  Superhero: {
    find: jest.fn() as jest.Mock,
    countDocuments: jest.fn() as jest.Mock,
    findOne: jest.fn() as jest.Mock,
    create: jest.fn() as jest.Mock,
    findById: jest.fn() as jest.Mock,
    findByIdAndUpdate: jest.fn() as jest.Mock,
    findByIdAndDelete: jest.fn() as jest.Mock,
    findOneAndUpdate: jest.fn() as jest.Mock,
    findOneAndDelete: jest.fn() as jest.Mock,
  },
}));

const buildFindChain = (data: unknown[] = []) => {
  const limit = (jest.fn() as jest.Mock<any>).mockResolvedValue(data);
  const skip = (jest.fn() as jest.Mock<any>).mockReturnValue({ limit });
  const sort = (jest.fn() as jest.Mock<any>).mockReturnValue({ skip });
  (Superhero.find as jest.Mock<any>).mockReturnValue({ sort });
  return { limit, skip, sort };
};

describe('superhero repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated heroes without a search filter', async () => {
    buildFindChain([]);
    (Superhero.countDocuments as jest.Mock<any>).mockResolvedValue(0);

    await getSuperheroes(1, 5);

    expect(Superhero.find).toHaveBeenCalledWith({});
    expect(Superhero.countDocuments).toHaveBeenCalledWith({});
  });

  it('applies a search filter across nickname and real name', async () => {
    buildFindChain([]);
    (Superhero.countDocuments as jest.Mock<any>).mockResolvedValue(0);

    await getSuperheroes(1, 5, 'Bat*man');
    const filter = (Superhero.find as jest.Mock).mock.calls[0][0] as any;

    expect(filter.$or).toHaveLength(2);
    expect(filter.$or[0].nickname).toBeInstanceOf(RegExp);
    expect(filter.$or[0].nickname.source).toBe('Bat\\*man');
    expect(filter.$or[0].nickname.flags).toContain('i');
  });

  it('trims the search input before building the filter', async () => {
    buildFindChain([]);
    (Superhero.countDocuments as jest.Mock<any>).mockResolvedValue(0);

    await getSuperheroes(2, 10, '  Arrow  ');

    const filter = (Superhero.find as jest.Mock).mock.calls[0][0] as any;
    expect(filter.$or[0].nickname.source).toBe('Arrow');
  });

  it('builds exact-match identity queries for nickname and real name', async () => {
    (Superhero.findOne as jest.Mock<any>).mockResolvedValue(null);

    await getSuperheroByIdentity('Flash', 'Barry Allen');

    const filter = (Superhero.findOne as jest.Mock).mock.calls[0][0] as any;

    expect(filter.nickname).toBeInstanceOf(RegExp);
    expect(filter.nickname.source).toBe('^Flash$');
    expect(filter.nickname.flags).toContain('i');
    expect(filter.real_name).toBeInstanceOf(RegExp);
    expect(filter.real_name.source).toBe('^Barry Allen$');
    expect(filter.real_name.flags).toContain('i');
  });

  it('creates a new superhero', async () => {
    const heroInput = {
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description: 'He was born on Krypton...',
      superpowers: ['solar energy absorption', 'flight', 'x-ray vision'],
      catch_phrase: 'Truth, Justice, and the American Way',
      images: ['superman.jpg'],
    };
    const savedHero = {
      ...heroInput,
      _id: '507f1f77bcf86cd799439011',
      __v: 0,
    };
    (Superhero.create as jest.Mock<any>).mockResolvedValue(savedHero);

    const result = await createSuperhero(heroInput as any);

    expect(Superhero.create).toHaveBeenCalledWith(heroInput);
    expect(result).toEqual(savedHero);
  });

  it('finds a superhero by id', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const mockHero = { _id: validId, nickname: 'Batman' };
    (Superhero.findById as jest.Mock<any>).mockResolvedValue(mockHero);

    const result = await getSuperheroById(validId);

    expect(Superhero.findById).toHaveBeenCalledWith(validId);
    expect(result).toEqual(mockHero);
  });

  it('updates a superhero', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const mockHero = { _id: validId, nickname: 'Batman Updated' };
    const updateData = { nickname: 'Batman Updated' };
    (Superhero.findByIdAndUpdate as jest.Mock<any>).mockResolvedValue(mockHero);

    const result = await updateSuperhero(validId, updateData);

    expect(Superhero.findByIdAndUpdate).toHaveBeenCalledWith(
      validId,
      updateData,
      { new: true }
    );
    expect(result).toEqual(mockHero);
  });

  it('deletes a superhero', async () => {
    const validId = '507f1f77bcf86cd799439011';
    const mockHero = { _id: validId, nickname: 'Deleted Hero' };
    (Superhero.findByIdAndDelete as jest.Mock<any>).mockResolvedValue(mockHero);

    const result = await deleteSuperhero(validId);

    expect(Superhero.findByIdAndDelete).toHaveBeenCalledWith(validId);
    expect(result).toEqual(mockHero);
  });
});
