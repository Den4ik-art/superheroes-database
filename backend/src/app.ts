import express from 'express';
import cors from 'cors';
import path from 'path';
import { superheroRouter } from './modules/superheroes/superhero.routes';

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const resolvedUploadDir = path.isAbsolute(uploadDir)
  ? uploadDir
  : path.join(process.cwd(), uploadDir);

app.use('/uploads', express.static(resolvedUploadDir));

app.use('/api/superheroes', superheroRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
