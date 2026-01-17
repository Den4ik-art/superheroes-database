import dotenv from 'dotenv';
import { app } from './app';
import { connectDB } from './config/db';

dotenv.config();

const port = Number(process.env.PORT || 4000);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
