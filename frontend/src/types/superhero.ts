export type SuperheroImage = {
  _id?: string;
  url: string;
  filename: string;
  createdAt?: string;
};

export type Superhero = {
  _id: string;
  nickname: string;
  real_name: string;
  origin_description?: string;
  superpowers?: string[];
  catch_phrase?: string;
  images?: SuperheroImage[];
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedSuperheroes = {
  data: Superhero[];
  total: number;
  page: number;
  limit: number;
};
