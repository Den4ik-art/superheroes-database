import axios from 'axios';
import type { PaginatedSuperheroes, Superhero } from '../types/superhero';

export const API_HOST = 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_HOST}/api`
});

export const resolveImageUrl = (url: string) => {
  if (!url) {
    return url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_HOST}${url}`;
  }
  return `${API_HOST}/${url}`;
};

export const getSuperheroes = async (
  page: number,
  limit = 5,
  search = ''
): Promise<PaginatedSuperheroes> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });
  if (search.trim()) {
    params.set('search', search.trim());
  }
  const res = await api.get(`/superheroes?${params.toString()}`);
  return res.data;
};

export const getSuperhero = async (id: string): Promise<Superhero> => {
  const res = await api.get(`/superheroes/${id}`);
  return res.data;
};

export const createSuperhero = async (data: Omit<Superhero, '_id'>): Promise<Superhero> => {
  const res = await api.post('/superheroes', data);
  return res.data;
};

export const updateSuperhero = async (id: string, data: Partial<Superhero>): Promise<Superhero> => {
  const res = await api.put(`/superheroes/${id}`, data);
  return res.data;
};

export const deleteSuperhero = async (id: string): Promise<void> => {
  await api.delete(`/superheroes/${id}`);
};

export const uploadHeroImage = async (id: string, file: File): Promise<Superhero> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post(`/superheroes/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteHeroImage = async (id: string, imageId: string): Promise<Superhero> => {
  const res = await api.delete(`/superheroes/${id}/images/${imageId}`);
  return res.data;
};
